import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useLogActivityRanapStore = defineStore('log-activity-ranap-store', {
  state: () => ({
    logs: [],
    loading: false,
    searchQ: ''
  }),
  actions: {
    async getLogActivities(noreg) {
      if (!noreg) {
        this.logs = []
        return
      }
      this.loading = true
      const params = {
        params: {
          noreg: noreg
        }
      }
      try {
        const resp = await api.get('v1/simrs/farmasinew/activity/by-noreg', params)
        if (resp.status === 200) {
          this.logs = resp.data ?? []
        } else {
          this.logs = []
        }
      } catch (error) {
        console.error('Error fetching log activities:', error)
        this.logs = []
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLogActivityRanapStore, import.meta.hot))
}
