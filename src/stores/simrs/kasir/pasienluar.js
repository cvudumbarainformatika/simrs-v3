import { defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const usePasienLuarStore = defineStore('tbp-pasienluar-store', {
  state: () => ({
    items: [],
    meta: null,
    loading: false,
    params: {
      q: '',
      page: 1,
      per_page: 10,
      jenislayanan: 'LABORAT',
      status: 'SEMUA',
      daritgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      sampaitgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    },
    formatdisplay: {
      daritgl: date.formatDate(Date.now(), 'DD MMM YYYY'),
      sampaitgl: date.formatDate(Date.now(), 'DD MMM YYYY')
    }
  }),
  actions: {
    async getData() {
      this.loading = true
      const params = { params: this.params }
      await api.get('v1/simrs/kasir/pasien-luar/getbillpasienluar', params)
        .then(resp => {
          console.log('kunjungan igd', resp?.data?.data)
          this.loading = false
          this.items = resp?.data?.data?.data
          this.meta = resp?.data?.data
        })
        .catch(() => { this.loading = false })
    },
    goToPage(val) {
      console.log('val', val)
      this.params.page = val
      this.getData()
    },
  }
})
