import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { date } from 'quasar'

export const useListPasienRadiologiStore = defineStore('list-pasien-radiologi', {
  state: () => ({
    items: [],
    meta: null,
    loading: false,
    header: {
      periode: 'Hari ini'
    },
    params: {
      page: 1,
      per_page: 50,
      q: '',
      status: 'Semua',
      to: dateDbFormat(new Date()),
      from: dateDbFormat(new Date()),
      sort: 'terbaru'
    },
    periods: ['Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    sorting: ['terbaru', 'terlama'],
    statuses: ['Semua', 'Terlayani', 'Belum terlayani'],
    isViewList: false,
    pasien: null,
    pageTindakan: false,
    loadingTerima: false,
    bukaLayanan: false,
    pasiens: [],
    newapotekrajal: [],
    diagnosa: [],
    koderuangan: null,
    depo: null
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {
    getDataTable () {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.get('/v1/simrs/radiologi/radiologi/pasienradiologi', {
          params: this.params
        }).then(res => {
          // console.log('res list tggu ranap', res)
          if (res.status === 200) {
            const total = res.data?.total
            const obj = res.data?.data
            const clone = (({ data, ...o }) => o)(obj)
            this.meta = clone
            this.meta.total = total
            this.items = obj?.data ?? []

            console.log('this.meta', this.meta)
            console.log('this.items', this.items)
            // this.togglePageTindakan()
            this.pageTindakan = true
          }
          this.loading = false
          resolve(res)
        }).catch(err => {
          console.log('err list tggu ranap', err)
          this.loading = false
          reject(err)
        })
      })
    },

    setPeriode (val) {
      this.header.periode = val
      if (val === 'Hari ini') {
        this.hariIni()
      }
      else if (val === 'Minggu ini') {
        this.mingguIni()
      }
      else if (val === 'Bulan ini') {
        this.bulanIni()
      }
    },

    setUrutan (val) {
      this.params.sort = val
      this.getDataTable()
    },

    setPage (val) {
      this.params.page = val
      this.getDataTable()
    },

    setStatus (val) {
      this.params.page = 1
      this.params.status = val
      this.getDataTable()
    },

    hariIni () {
      const cDate = new Date()
      this.params.to = dateDbFormat(cDate)
      this.params.from = dateDbFormat(cDate)
    },
    bulanIni () {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      // const firstday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-01'
      // const lastday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-31'
      const firstday = curr.setFullYear(y, m, 1)
      const lastday = curr.setFullYear(y, m + 1, 0)
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    mingguIni () {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    tahunIni () {
      const curr = new Date()
      const firstday = date.formatDate(curr, 'YYYY') + '-01' + '-01'
      const lastday = date.formatDate(curr, 'YYYY') + '-12' + '-31'
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    togglePageTindakan () {
      this.pageTindakan = !this.pageTindakan
    },

    // BARU PUTRA DEV RADIOLOGI
    helperKdRuangan (val) {
      const ruang = val?.ruangan.split('').slice(0, 3).join('')
      const poli = val?.poli.split('').slice(0, 3).join('')
      if (ruang === 'Rua' || poli === 'Rua') {
        this.depo = 'rnp'
      }
      else if (ruang === 'IRD' || poli === 'IRD') {
        this.depo = 'igd'
      }
      else if (ruang === 'Kam' || poli === 'Kam') {
        this.depo = 'ok'
      }
      else {
        this.depo = 'rjl'
      }
    }
  }
})