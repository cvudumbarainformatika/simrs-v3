import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErrVue } from "src/modules/utils"

export const useAssesmentPostOpereasiStore = defineStore('assesment_post_operasi', {
  state: () => ({}),
  actions: {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAssesmentPostOpereasiStore, import.meta.hot))
}
