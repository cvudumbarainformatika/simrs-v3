import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"

export const useListReturDepoStore = defineStore('list_retur_dari_depo', {
  state: () => ({
    loading: true,
    items: [],
    meta: {},
    params: {
      q: '',
      page: 1,
      per_page: 10,
      from: null,
      nama: '',
      kddepo: '',
    },
  }),
  actions: {

    setParams (key, val) {
      this.params[key] = val
    },
    setSearch (val) {
      this.setParams('q', val)
      this.setParams('page', 1)
      this.getData()
    }, setSearchDua (val) {
      this.setParams('nama', val)
      this.setParams('page', 1)
      this.getDataTable()
    },
    refresh () {
      this.setParams('page', 1)
      this.getData()
    },
    setPerPage (val) {
      this.setParams('per_page', val)
      this.setParams('page', 1)
      this.getData()
    },
    setPage (val) {
      this.setParams('page', val)
      this.getData()
    },
    setPeriodik (val) {
      this.params.page = 1
      this.params.from = val
      this.getData()
    },
    getData () {
      this.loading = true
      const param = { params: this.params }
      return new Promise(resolve => {
        api.get('v1/simrs/farmasinew/depo/list-retur', param)
          .then(resp => {
            this.loading = false
            this.items = resp?.data?.data
            this.meta = resp?.data?.meta
            console.log('resp', this.items)
            resolve(resp)
          }).catch(() => {
            this.loading = false
          })

      })

    },
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListReturDepoStore, import.meta.hot))
}
