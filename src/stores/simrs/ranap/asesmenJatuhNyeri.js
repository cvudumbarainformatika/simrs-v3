import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const useAsesmenJatuhNyeriStore = defineStore('asesmen-jatuh-nyeri-store', {
  state: () => ({
    itemsJatuh: [],
    itemsNyeri: [],
    loading: false,
    loadingSave: false
  }),

  actions: {
    async getData(pasien) {
      this.loading = true
      try {
        const resp = await api.get('v1/simrs/ranap/layanan/asesmenulang/list', {
          params: { noreg: pasien?.noreg }
        })
        if (resp.status === 200) {
          this.itemsJatuh = resp.data?.jatuh ?? []
          this.itemsNyeri = resp.data?.nyeri ?? []
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },

    async simpanJatuh(pasien, payload) {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/simpan-jatuh', payload)
        if (resp.status === 200) {
          notifSuccess('Simpan Asesmen Jatuh Berhasil')
          this.getData(pasien)
          return true
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loadingSave = false
      }
      return false
    },

    async hapusJatuh(pasien, id) {
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/hapus-jatuh', { id })
        if (resp.status === 200) {
          notifSuccess('Hapus Asesmen Jatuh Berhasil')
          this.getData(pasien)
          return true
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
      return false
    },

    async simpanNyeri(pasien, payload) {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/simpan-nyeri', payload)
        if (resp.status === 200) {
          notifSuccess('Simpan Asesmen Nyeri Berhasil')
          this.getData(pasien)
          return true
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loadingSave = false
      }
      return false
    },

    async hapusNyeri(pasien, id) {
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/hapus-nyeri', { id })
        if (resp.status === 200) {
          notifSuccess('Hapus Asesmen Nyeri Berhasil')
          this.getData(pasien)
          return true
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
      return false
    }
  }
})
