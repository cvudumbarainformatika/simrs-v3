import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useHomeCareCssdStore = defineStore('homecare-cssd', {
  state: () => ({
    kategori: 'instrumen',
    ruangan: null,
    permintaan: [],
    permintaanAktif: null,
    rincian: [],
    barangOptions: [],
    loading: false,
    loadingRincian: false,
    saving: false,
    deletingId: null
  }),
  actions: {
    async getPermintaan () {
      this.loading = true
      try {
        const resp = await api.get('/v1/simrs/homecare/cssd/permintaan', {
          params: { kategori: this.kategori }
        })
        this.ruangan = resp.data?.ruangan?.kode ?? null
        this.permintaan = resp.data?.data ?? []
      } finally {
        this.loading = false
      }
    },
    async cariBarang (q) {
      const resp = await api.get('/v1/simrs/homecare/cssd/barang', {
        params: { kategori: this.kategori, q }
      })
      return resp.data?.data ?? []
    },
    async bukaPermintaan (nopermintaan) {
      this.loadingRincian = true
      try {
        const resp = await api.get(`/v1/simrs/homecare/cssd/permintaan/${encodeURIComponent(nopermintaan)}`)
        this.permintaanAktif = resp.data?.header ?? null
        this.rincian = resp.data?.details ?? []
      } finally {
        this.loadingRincian = false
      }
    },
    permintaanBaru () {
      this.permintaanAktif = null
      this.rincian = []
      this.barangOptions = []
    },
    async simpanBarang (payload) {
      this.saving = true
      try {
        const resp = await api.post('/v1/simrs/homecare/cssd/permintaan', {
          ...payload,
          kategori: this.kategori,
          nopermintaan: this.permintaanAktif?.nopermintaan ?? null
        })
        this.permintaanAktif = resp.data?.header ?? null
        this.rincian = resp.data?.details ?? []
        await this.getPermintaan()
        return resp
      } finally {
        this.saving = false
      }
    },
    async hapusBarang (id) {
      this.deletingId = id
      try {
        const resp = await api.delete(`/v1/simrs/homecare/cssd/permintaan/item/${id}`)
        if (this.permintaanAktif?.nopermintaan) {
          await this.bukaPermintaan(this.permintaanAktif.nopermintaan)
        }
        return resp
      } finally {
        this.deletingId = null
      }
    }
  }
})
