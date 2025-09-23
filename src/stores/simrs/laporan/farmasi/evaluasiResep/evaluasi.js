import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const useLaporanEvaluasiResepStore = defineStore('laporan_evaluasi_resep', {
  state: () => ({

    loading: false,
    loadingNext: false,
    scrolling: false,
    loadingDownload: false,
    ketProses: null,
    items: [],
    meta: {},
    disp: {
      from: date.formatDate(Date.now(), '01 MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    params: {
      q: '',
      per_page: 100,
      page: 1,
      from: date.formatDate(Date.now(), 'YYYY-MM-01'),
      to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jenis: 'detail',
      tipe: 'noreg',
      depo: 'all',
    },

    types: [
      { nama: 'Lebih dari 5 item', value: 'item' },
      { nama: 'Lebih dari satu resep', value: 'noreg' },
    ],
    optionJenis: [
      { nama: 'Detail', value: 'detail' },
      { nama: 'Rekap', value: 'rekap' }
    ],
    gudangs: [
      { nama: 'Semua', value: 'all' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'Depo IGD', value: 'Gd-02010104' }
    ],
  }),
  actions: {
    setParams (key, val) {
      this.params[key] = val
    },

    setSearch (payload) {
      console.log(this.params.q)
      // this.setParams('q', payload)
      this.items = []
      this.setParams('page', 1)
      this.getDataTable()
    },
    setPage (payload) {
      this.setParams('page', payload)
      this.getNextDataTable()
    },
    setPerPage (payload) {
      this.setParams('per_page', payload)
      this.setParams('page', 1)
      this.getDataTable()
    },
    refreshTable () {
      this.setParams('page', 1)
      this.getDataTable()
    },
    getInitialData (val) {
      this.ketProses = null
      this.setParams('page', val)
      this.getDataTable()
      this.meta = {}
      this.items = []
    },
    getAllData (val) { },
    async getDataTable (val) {
      this.ketProses = null
      this.loading = true
      const param = { params: this.params }
      await api.get('v1/simrs/laporan/farmasi/evaluasi/get-data', param)
        .then(resp => {
          setTimeout(() => {
            // this.scrolling = false
          }, 1000)
          this.loading = false
          this.loadingNext = false
          this.meta = resp.data?.meta
          this.items = resp?.data?.data
          // console.log('data tabel', this.items)
          console.log('data tabel', resp?.data)
        })
        .catch(() => {
          this.loading = false
          this.loadingNext = false
        })
    },
    async getNextDataTable (val) {
      this.ketProses = null
      this.loadingNext = true
      this.scrolling = true
      const param = { params: this.params }
      await api.get('v1/simrs/laporan/farmasi/evaluasi/get-data', param)
        .then(resp => {
          this.scrolling = false
          this.loadingNext = false
          this.meta = resp.data?.meta
          const next = [...this.items, ...resp?.data?.data]
          this.items = next
        })
        .catch(() => {
          this.loading = false
          this.loadingNext = false
        })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanEvaluasiResepStore, import.meta.hot))
}
