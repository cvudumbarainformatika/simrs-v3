import { acceptHMRUpdate, defineStore } from "pinia"

export const useMonitoringSaatStore = defineStore('monitoring_saat', {
  state: () => ({
    loading: false,
    form: {}
  }),
  actions: {

  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMonitoringSaatStore, import.meta.hot))
}
