import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErr, notifSuccess } from 'src/modules/utils'

export const useRehabmedikPengkajianStore = defineStore('rehabmedik-pengkajian-store', {
  state: () => ({

    items: [],
    meta: null,
    loading: false,
    item: null,

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    setItem(item) {
      this.item = item
    },




  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRehabmedikPengkajianStore, import.meta.hot))
}
