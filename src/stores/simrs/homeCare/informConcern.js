import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'

function tanggalHariIni () {
  const tanggal = new Date()
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0')
  const hari = String(tanggal.getDate()).padStart(2, '0')
  return `${tanggal.getFullYear()}-${bulan}-${hari}`
}

function formKosong (pasien) {
  const usiaJenisKelamin = [pasien?.usia, pasien?.kelamin].filter(Boolean).join(' / ')
  const namaPasien = pasien?.nama ?? pasien?.nama_panggil ?? ''
  return {
    applicant_name: namaPasien,
    applicant_age_gender: usiaJenisKelamin,
    applicant_address: pasien?.alamat ?? '',
    applicant_phone: pasien?.nohp ?? '',
    patient_relationship: 'Diri Sendiri',
    patient_name: namaPasien,
    patient_age_gender: usiaJenisKelamin,
    patient_address: pasien?.alamat ?? '',
    service_type: '',
    homecare_24_hours: false,
    nurse_visit_frequency: '',
    doctor_visit_frequency: '',
    other_staff: '',
    other_visit_frequency: '',
    nursing_actions: '',
    witness_name: '',
    signer_name: '',
    ttd_signer: null,
    ttd_witness: null,
    signed_at: tanggalHariIni()
  }
}

export const useInformConcernHomeCareStore = defineStore('inform-concern-home-care', {
  state: () => ({
    permohonan: formKosong(),
    persetujuan: formKosong(),
    loadingData: false,
    loadingSave: ''
  }),
  actions: {
    async getData (pasien) {
      this.loadingData = true
      this.permohonan = formKosong(pasien)
      this.persetujuan = formKosong(pasien)

      try {
        const resp = await api.get('v1/simrs/homecare/pengunjung/inform-concern', {
          params: { noreg: pasien?.noreg }
        })
        if (resp?.status === 200) {
          this.permohonan = { ...this.permohonan, ...(resp?.data?.permohonan ?? {}) }
          this.persetujuan = { ...this.persetujuan, ...(resp?.data?.persetujuan ?? {}) }
        }
      } catch (error) {
        notifErrVue(error?.response?.data?.message ?? 'Gagal memuat form Infrom Concern')
      } finally {
        this.loadingData = false
      }
    },

    async simpan (pasien, documentType) {
      const form = documentType === 'request' ? this.permohonan : this.persetujuan
      this.loadingSave = documentType

      try {
        const resp = await api.post('v1/simrs/homecare/pengunjung/inform-concern', {
          ...form,
          noreg: pasien?.noreg,
          document_type: documentType
        })
        if (resp?.status === 200) {
          const saved = resp?.data?.data
          if (documentType === 'request') this.permohonan = { ...this.permohonan, ...saved }
          else this.persetujuan = { ...this.persetujuan, ...saved }
          notifSuccess(resp)
        }
      } catch (error) {
        notifErrVue(error?.response?.data?.message ?? 'Gagal menyimpan form Infrom Concern')
      } finally {
        this.loadingSave = ''
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInformConcernHomeCareStore, import.meta.hot))
}
