import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { dateDbFormat } from "src/modules/formatter"

export const useLogActivityFarmasiStore = defineStore('log_activity_farmasi', {
  state: () => ({
    loading: false,
    meta: {},
    items: [],
    params: {
      q: '',
      page: 1,
      per_page: 10,
      from: null,
      to: null
    },
    columns: ['action', 'description'],
    columnHide: ['updated_at'],
    header: {
      periode: 'Hari ini'
    },
    periods: ['Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
  }),
  actions: {
    setParams (key, val) {
      this.params[key] = val
    },
    setQ (val) {
      this.setParams('q', val)
      this.getList()
    },
    setPerPage (val) {
      this.setParams('per_page', val)
      this.setParams('page', 1)
      this.getList()
    },
    setPeriode (from, to) {
      this.setParams('from', from)
      this.setParams('to', to)
      this.getList()
    },
    setPage (val) {
      this.setParams('page', val)
      this.getList()
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
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },
    mingguIni () {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },
    getList () {
      this.loading = true
      const param = { params: this.params }
      return new Promise(resolve => {
        api.get('v1/simrs/farmasinew/activity/list', param)
          .then(resp => {
            this.loading = false
            console.log('list activity', resp.data)
            this.items = resp?.data?.data ?? resp?.data
            this.meta = resp?.data?.meta ?? resp?.data
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLogActivityFarmasiStore, import.meta.hot))
}
