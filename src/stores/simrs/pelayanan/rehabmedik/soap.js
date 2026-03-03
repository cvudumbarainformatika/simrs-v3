import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErr, notifSuccess } from 'src/modules/utils'

export const useRehabmedikSoapStore = defineStore('rehabmedik-soap-store', {
  state: () => ({

    items: [],
    meta: null,
    loading: false,
    item: null,
    frekuensis: [],
    loadingFrekuensi: false

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    setItem(item) {
      this.item = item
    },

    async getMasterFrekuensis() {
      this.loadingFrekuensi = true
      try {
        const resp = await api.get('v1/simrs/rehabmedik/master/frekuensi')
        // console.log('resp', resp);

        if (resp.status === 200) {
          this.frekuensis = resp.data?.result
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingFrekuensi = false
      }
    },




  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRehabmedikSoapStore, import.meta.hot))
}
