import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { notifInfVue } from 'src/modules/utils'

export const useListKunjunganHomeCareStore = defineStore('list_kunjungan_home_care', {
  state: () => ({
    items: [],
    meta: null,
    params: {
      q: '',
      per_page: 10,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      tgl: dateDbFormat(new Date()),
      flag: 'SEMUA'
    },
    loading: false
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    async getLists () {
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/simrs/pendaftaran/homecare/list', params)
      if (resp.status === 200) {
        console.log('kunjungan', resp)
        this.items = resp.data?.data
        this.meta = resp.data?.meta
        this.loading = false
      }
      this.loading = false
    },
    berangkat (val) {
      // console.log(val)
      if (val.tgl_berangkat != null) return notifInfVue('Sudah diberangkatkan')
      const item = this.items.find(item => item.id === val.id)
      if (item) item.loading = true
      const form = { id: val.id }
      return new Promise((resolve, reject) => {
        api.post('/v1/simrs/pendaftaran/homecare/berangkat', form)
          .then(resp => {
            console.log(resp?.data?.data)
            const data = resp?.data?.data
            const index = this.items.findIndex(item => item.id === data.id)
            this.items[index] = data
            // if (item) delete item.loading
            resolve(resp)
          })
          .catch(err => {
            if (item) delete item.loading
            reject(err)
          })
      })
    },
    setFlag (payload) {
      // console.log('flag', payload)
      this.params.flag = payload
      this.getLists()
    },
    setDate (payload) {
      this.params.page = 1
      this.params.tgl = payload
      this.getLists()
    },
    setQ (payload) {
      this.params.page = 1
      this.params.q = payload
      this.getLists()
    },
    setTglAwal () {
      this.params.tgl = dateDbFormat(new Date())
    },
    setPage (payload) {
      this.params.page = payload
      this.getLists()
    },
    setPerPage (payload) {
      this.params.page = 1
      this.params.per_page = payload
      this.getLists()
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListKunjunganHomeCareStore, import.meta.hot))
}
