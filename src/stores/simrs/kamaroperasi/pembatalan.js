import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess, notifErrVue } from "src/modules/utils"

export const usePembatalanOperasiStore = defineStore('pembatalan_operasi_store', {
  state: () => ({
    loading: false,
    form: {
      id: null,
      noreg: null,
      norm: null,
      nota: null,
      nama_penerima_informasi: '',
      tgllahir_penerima_informasi: '',
      umur_penerima_informasi: null,
      hubungan_penerima_informasi: '',
      alasan_pembatalan: '',
      alternatif_pilihan: '',
      alternatif_rujuk_ke: '',
      alternatif_kembali_rencana: '',
      dpjp_kodesimrs: null,
      ttd_penanggung_jawab: null,
    },
    nakes: [],
  }),
  actions: {
    resetForm () {
      this.form = {
        id: null,
        noreg: null,
        norm: null,
        nota: null,
        nama_penerima_informasi: '',
        tgllahir_penerima_informasi: '',
        umur_penerima_informasi: null,
        hubungan_penerima_informasi: '',
        alasan_pembatalan: '',
        alternatif_pilihan: '',
        alternatif_rujuk_ke: '',
        alternatif_kembali_rencana: '',
        dpjp_kodesimrs: null,
        ttd_penanggung_jawab: null,
      }
    },
    async getNakes () {
      try {
        const { data } = await api.get('v1/simrs/penunjang/surgical/get-nakes')
        this.nakes = data?.data ?? data
      } catch (e) {
        console.error('Error fetching nakes', e)
      }
    },
    async getDataPembatalan (pasien) {
      this.loading = true
      this.resetForm()
      try {
        const param = { params: { noreg: pasien?.noreg } }
        const { data } = await api.get('v1/simrs/penunjang/pembatalan-operasi/get-pembatalan', param)
        if (data && Object.keys(data).length > 0) {
          this.form = { ...data }
        } else {
          this.form.noreg = pasien?.noreg
          this.form.norm = pasien?.norm
          this.form.nota = pasien?.rs2 ?? null
          // Prepopulate DPJP if available
          this.form.dpjp_kodesimrs = pasien?.kodedokter ?? null
        }
      } catch (e) {
        console.error('Error fetching data pembatalan', e)
        this.form.noreg = pasien?.noreg
        this.form.norm = pasien?.norm
        this.form.nota = pasien?.rs2 ?? null
        this.form.dpjp_kodesimrs = pasien?.kodedokter ?? null
      } finally {
        this.loading = false
      }
    },
    async simpan (pasien) {
      this.loading = true
      const payload = { ...this.form }
      if (!payload.noreg) {
        payload.noreg = pasien?.noreg
        payload.norm = pasien?.norm
        payload.nota = pasien?.rs2 ?? null
      }
      try {
        const resp = await api.post('v1/simrs/penunjang/pembatalan-operasi/simpan-pembatalan', payload)
        this.form = resp?.data?.data
        notifSuccess(resp)
        return resp
      } catch (e) {
        console.error('Error saving data pembatalan', e)
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePembatalanOperasiStore, import.meta.hot))
}
