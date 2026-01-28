import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useRehabmedikAsessmentStore = defineStore('rehabmedik_asessment', {
  state: () => ({
    item: null,
    loading: false
  }),
  actions: {
    setItem (payload) {
      this.item = payload
    },
    async getData (payload) {
      this.loading = true
      try {
        const resp = await api.get(`v1/simrs/rehabmedik/asessment/get?noreg=${payload}`)
        if (resp.status === 200) {
          this.item = resp.data
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
})
