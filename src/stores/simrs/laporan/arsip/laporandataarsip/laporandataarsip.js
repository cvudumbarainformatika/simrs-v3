import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useLaporandataarsip = defineStore('laporan_data_arsip', {
  state: () => ({
    loading: false,
    items: [],
    meta: {},
    params: {
      tahunDari: date.formatDate(new Date(), 'YYYY'),
      tahunSampai: date.formatDate(new Date(), 'YYYY'),
      inactive: 'AKTIF'
    },
  }),
  actions: {
    resetFilter() {
      this.params.tahunDari = date.formatDate(new Date(), 'YYYY')
      this.params.tahunSampai = date.formatDate(new Date(), 'YYYY')
    },
    setPage(val) {
      this.setParams('page', val)
      this.getData()
    },
    setSearch(val) {
      this.setParams('q', val)
      this.getData()
    },
    getData() {

      return new Promise(resolve => {
        this.loading = true
        api.get('v1/simrs/laporan/arsip/daftarberkas/get-datax', { params: this.params })
          .then(res => {
            this.loading = false
            this.items = res.data
            this.meta = res.data.meta
            resolve(res)
          })
          .catch(() => { this.loading = false })
      })
    }
  }
})
