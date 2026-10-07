import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungIgdStore } from './pengunjung'
import { notifErr, notifErrVue, notifSuccess } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

export const useVisumStore = defineStore('visum-store', {
  state: () => ({
    loadingForm: false,
    loadingHistory: false,
    items: [],
    tab: 'Visum',
    tabs: [
      { name: 'Visum Penganiayaan', page: 'VisumPenganiayaan' },
      { name: 'Visum Pemerkosaan', page: 'VisumPemerkosaan' },
      { name: 'Visum Jenazah', page: 'VisumJenazah' }
    ],
    form: {
      nomor: ''
    }
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    initReset(pasien = null) {
      this.form = {
        nomor: '',
        tanggalvisum: '',
        jam: '',
        permintaan: '',
        dari: '',
        tanggalsurat: '',
        nosurat: '',
        bangsa: '',
        umur: pasien?.usia || '',
        pekerjaan: '',
        Alamat: pasien?.alamat || ''
      }
    },
    editForm(item) {
      this.form = {
        id: item.id,
        nomor: item.novisum || '',
        tanggalvisum: item.tgl_visum || '',
        jam: item.jam || '',
        permintaan: item.permintaan || '',
        dari: item.dari || '',
        tanggalsurat: item.tgl_surat || '',
        nosurat: item.nomorsurat || '',
        bangsa: item.bangsa || '',
        umur: item.umur || '',
        pekerjaan: item.pekerjaan || '',
        Alamat: item.alamat || ''
      }
    },
    async getDataVisum(noreg) {
      if (!noreg) {
        this.items = []
        return
      }

      this.loadingHistory = true
      try {
        const response = await api.get('v1/simrs/igd/visum/list', { params: { noreg } })
        this.items = response.data?.data || []
        return response
      } catch (error) {
        this.items = []
        notifErr(error)
        throw error
      } finally {
        this.loadingHistory = false
      }
    },
    async onSubmit(pasien) {
      this.form.norm = pasien?.norm || ''
      this.form.noreg = pasien?.noreg || ''
      this.form.dpjp = pasien?.dokter || pasien?.datasimpeg?.nama || pasien?.kodedokter || ''
      this.form.umur = this.form.umur || pasien?.usia || ''
      this.form.Alamat = this.form.Alamat || pasien?.alamat || ''
      this.loadingForm = true
      try {
        const response = await api.post('v1/simrs/igd/visum/simpan', this.form)
        this.form.id = response.data?.data?.id || this.form.id
        await this.getDataVisum(this.form.noreg)
        notifSuccess(response)
        this.initReset(pasien)
        return response
      } catch (error) {
        notifErr(error)
        throw error
      } finally {
        this.loadingForm = false
      }
    },
    async deleteData(noreg, id) {
      this.loadingHistory = true
      try {
        const response = await api.post('v1/simrs/igd/visum/hapus', { noreg, id })
        await this.getDataVisum(noreg)
        notifSuccess(response)
        return response
      } catch (error) {
        notifErr(error)
        throw error
      } finally {
        this.loadingHistory = false
      }
    },

    hitungNilaiSkor() {
      const skorKondKhusus = this.form.skorkondisikhusus
      const skor = parseInt(this.form.skreeninggizi) + parseInt(this.form.asupanmakan) + parseInt(skorKondKhusus)
      this.form.skor = skor
    },
  }
})
