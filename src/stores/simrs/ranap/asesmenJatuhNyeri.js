import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const useAsesmenJatuhNyeriStore = defineStore('asesmen-jatuh-nyeri-store', {
  state: () => ({
    itemsJatuh: [],
    itemsNyeri: [],
    itemsPascaJatuh: [],
    itemsPenyakitMenular: [],
    itemsMonitoringRestrain: [],
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
          this.itemsPascaJatuh = resp.data?.pasca_jatuh ?? []
          this.itemsPenyakitMenular = resp.data?.penyakit_menular ?? []
          this.itemsMonitoringRestrain = resp.data?.monitoring_restrain ?? []
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
    },

    async simpanPascaJatuh(pasien, payload) {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/simpan-pasca-jatuh', payload)
        if (resp.status === 200) {
          notifSuccess('Simpan Monitoring Pasca Jatuh Berhasil')
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

    async hapusPascaJatuh(pasien, id) {
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/hapus-pasca-jatuh', { id })
        if (resp.status === 200) {
          notifSuccess('Hapus Monitoring Pasca Jatuh Berhasil')
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

    async simpanPenyakitMenular(pasien, payload) {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/simpan-penyakit-menular', payload)
        if (resp.status === 200) {
          notifSuccess('Simpan Asesmen Penyakit Menular Berhasil')
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

    async hapusPenyakitMenular(pasien, id) {
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/hapus-penyakit-menular', { id })
        if (resp.status === 200) {
          notifSuccess('Hapus Asesmen Penyakit Menular Berhasil')
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

    async simpanMonitoringRestrain(pasien, payload) {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/simpan-monitoring-restrain', payload)
        if (resp.status === 200) {
          notifSuccess('Simpan Monitoring Pengikatan Restrain Berhasil')
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

    async hapusMonitoringRestrain(pasien, id) {
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/asesmenulang/hapus-monitoring-restrain', { id })
        if (resp.status === 200) {
          notifSuccess('Hapus Monitoring Pengikatan Restrain Berhasil')
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
