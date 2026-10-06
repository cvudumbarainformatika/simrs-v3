import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'

export const useKasirHomecareStore = defineStore('kasir_homecare', {
  state: () => ({
    items: [],
    meta: null,
    params: {
      q: '',
      per_page: 10,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      from: dateDbFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      to: dateDbFormat(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
      flag: 'SEMUA'
    },
    loading: false,
    rincianPembayaran: [],
    totalTagihan: 0,
    riwayatPembayaran: [],
    riwayatKwitansi: [],
    loadingRincian: false,
    loadingRiwayatPembayaran: false,
    loadingRiwayatKwitansi: false,
    savingPembayaran: false,
    deletingPembayaran: false,
    printingKwitansi: false,
    membatalkanKwitansi: false
  }),

  actions: {
    async getLists () {
      this.loading = true
      try {
        const response = await api.get('/v1/simrs/pendaftaran/homecare/list', { params: this.params })
        this.items = response.data?.data || []
        this.meta = response.data?.meta || null
        return response
      }
      finally {
        this.loading = false
      }
    },

    setFlag (payload) {
      this.params.flag = payload
      this.getLists()
    },

    setDateRange (payload) {
      this.params.page = 1
      this.params.from = payload.from
      this.params.to = payload.to
      this.getLists()
    },

    setQ (payload) {
      this.params.page = 1
      this.params.q = payload
      this.getLists()
    },

    setPage (payload) {
      this.params.page = payload
      this.getLists()
    },

    resetPembayaran () {
      this.rincianPembayaran = []
      this.totalTagihan = 0
      this.riwayatPembayaran = []
      this.riwayatKwitansi = []
    },

    async getRincianPembayaran (noreg) {
      this.loadingRincian = true
      try {
        const response = await api.get('v1/simrs/pendaftaran/homecare/rincian-pembayaran', { params: { noreg } })
        this.rincianPembayaran = response.data?.data || []
        this.totalTagihan = Number(response.data?.total || 0)
        return response
      }
      finally {
        this.loadingRincian = false
      }
    },

    async getRiwayatPembayaran (noreg) {
      this.loadingRiwayatPembayaran = true
      try {
        const response = await api.get('v1/simrs/pendaftaran/homecare/riwayat-pembayaran', { params: { noreg } })
        this.riwayatPembayaran = response.data?.data || []
        return response
      }
      finally {
        this.loadingRiwayatPembayaran = false
      }
    },

    async cekKwitansiPembayaran (noreg, noPembayaran) {
      return api.get('v1/simrs/pendaftaran/homecare/cek-kwitansi-pembayaran', {
        params: { noreg, no_pembayaran: noPembayaran }
      })
    },
    async getRiwayatKwitansi (noreg) {
      this.loadingRiwayatKwitansi = true
      try {
        const response = await api.get('v1/simrs/pendaftaran/homecare/riwayat-kwitansi', { params: { noreg } })
        this.riwayatKwitansi = response.data?.data || []
        return response
      }
      finally {
        this.loadingRiwayatKwitansi = false
      }
    },

    async batalKwitansi (payload) {
      this.membatalkanKwitansi = true
      try {
        return await api.post('v1/simrs/pendaftaran/homecare/batal-kwitansi', payload)
      }
      finally {
        this.membatalkanKwitansi = false
      }
    },
    async cetakKwitansi (payload) {
      this.printingKwitansi = true
      try {
        return await api.post('v1/simrs/pendaftaran/homecare/cetak-kwitansi', payload)
      }
      finally {
        this.printingKwitansi = false
      }
    },
    async hapusPembayaran (payload) {
      this.deletingPembayaran = true
      try {
        return await api.post('v1/simrs/pendaftaran/homecare/hapus-pembayaran', payload)
      }
      finally {
        this.deletingPembayaran = false
      }
    },
    async simpanPembayaran (payload) {
      this.savingPembayaran = true
      try {
        return await api.post('v1/simrs/pendaftaran/homecare/simpan-pembayaran', payload)
      }
      finally {
        this.savingPembayaran = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useKasirHomecareStore, import.meta.hot))
}
