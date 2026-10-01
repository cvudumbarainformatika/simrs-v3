import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'

export const useKasirIgdStore = defineStore('kasir_igd_store', {
  state: () => ({
    items: [],
    meta: null,
    loadingsimpanttd: false,
    params: {
      q: '',
      per_page: 10,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      from: dateDbFormat(new Date()),
      to: dateDbFormat(new Date())
    },
    golongan: '',
    loading: false,
    rekapBill: {},
    rincianPembayaran: [],
    riwayatPembayaran: [],
    totalTerbayar: 0,
    totalSisa: 0,
    riwayatKwitansi: [],
    totalKwitansiAktif: 0,
    savingPembayaran: false,
    printingKwitansi: false,
    membatalkanKwitansi: false,
    deletingPembayaran: false,
    notas: {},
    qris: 'asd',
    form: {
      kodedokumen: '',
      noreg: '',
      norm: '',
      saksiPasien: '',
      hubunganPasien: '',
      resumekeluargapasien: ''
    }
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    setDateRange(from, to) {
      this.params.page = 1
      this.params.from = from
      this.params.to = to
      this.getLists()
    },
    setQ(payload) {
      this.params.page = 1
      this.params.q = payload
      this.getLists()
    },
    setTglAwal() {
      this.params.tgl = dateDbFormat(new Date())
    },
    setPage(payload) {
      this.params.page = payload
      this.getLists()
    },
    setPerPage(payload) {
      this.params.page = 1
      this.params.per_page = payload
      this.getLists()
    },
    async getLists() {
      this.loading = true
      const params = { params: this.params }
      // const resp = await api.get('/v1/simrs/pendaftaran/umum/kunjunganpasienumum', params)
      const resp = await api.get('/v1/simrs/kasir/igd/pasien-pulang', params)
      if (resp.status === 200) {
        // console.log('kunjungan', resp)
        this.items = resp.data.data
        this.meta = resp.data
        this.loading = false
      }
      this.loading = false
    },
    getBill(val) {
      this.rekapBill = {}
      this.loading = true
      const params = { params: val }
      return new Promise(resolve => {
        api.get('/v1/simrs/kasir/igd/billbynoreg', params).then(resp => {
          if (resp.status === 200) {
            // console.log('bill', resp.data)
            this.rekapBill = resp.data
          }
          resolve(resp)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    async getRincianPembayaran (noreg) {
      this.loading = true
      try {
        const response = await api.get('/v1/simrs/kasir/igd/rincian-pembayaran', { params: { noreg } })
        this.rincianPembayaran = response.data?.data || []
        this.riwayatPembayaran = response.data?.riwayat_pembayaran || []
        this.totalTerbayar = Number(response.data?.total_terbayar || 0)
        this.totalSisa = Number(response.data?.total_sisa || 0)
        return response
      } finally {
        this.loading = false
      }
    },
    async getRiwayatKwitansiIgd (noreg) {
      const response = await api.get('/v1/simrs/kasir/igd/riwayat-kwitansi', { params: { noreg } })
      this.riwayatKwitansi = response.data?.data || []
      this.totalKwitansiAktif = Number(response.data?.total_terbayar || 0)
      return response
    },
    async hapusPembayaranIgd (payload) {
      this.deletingPembayaran = true
      try { return await api.post('/v1/simrs/kasir/igd/hapus-pembayaran', payload) } finally { this.deletingPembayaran = false }
    },    async batalKwitansiIgd (payload) {
      this.membatalkanKwitansi = true
      try { return await api.post('/v1/simrs/kasir/igd/batal-kwitansi', payload) } finally { this.membatalkanKwitansi = false }
    },    async cekKwitansiPembayaranIgd (noreg, noPembayaran) {
      return api.get('/v1/simrs/kasir/igd/cek-kwitansi-pembayaran', { params: { noreg, no_pembayaran: noPembayaran } })
    },    async cetakKwitansiIgd (payload) {
      this.printingKwitansi = true
      try { return await api.post('/v1/simrs/kasir/igd/cetak-kwitansi', payload) } finally { this.printingKwitansi = false }
    },
    async simpanPembayaranIgd (payload) {
      this.savingPembayaran = true
      try {
        return await api.post('/v1/simrs/kasir/igd/simpan-pembayaran', payload)
      } finally {
        this.savingPembayaran = false
      }
    },
    async getNotas(val) {
      this.notas = {}
      this.loading = true
      const params = { params: val }
      // const resp = await api.get('/v1/simrs/pendaftaran/umum/kunjunganpasienumum', params)
      const resp = await api.get('/v1/simrs/kasir/rajal/tagihanpergolongan', params)
      if (resp.status === 200) {
        console.log('resp notas ', resp.data)
        this.notas = resp.data
        this.loading = false
      }
      this.loading = false
    },
    savePembayaran(payload) {
      this.loading = true
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/pembayaran', payload)
          .then(resp => {
            this.loading = false
            // console.log('resp', resp.data)
            this.qris = resp.data.result.qrValue
            resolve(resp.data)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    async simpanttd() {
      this.loadingsimpanttd = true
      try {
        console.log('responsex:', this.form)
        const resp = await api.post('/v1/simrs/kasir/rajal/simpanttddokumen', this.form)
        console.log('response:', resp.data)

        return resp.data
      } catch (error) {
        console.error('Gagal simpan TTD:', error)

        const message =
          error.response?.data?.message ||
          error.message ||
          'Terjadi kesalahan saat menyimpan TTD'

        Notify.create({
          type: 'negative',
          message
        })

        return null
      } finally {
        this.loadingsimpanttd = false
      }
    }
  }
})
