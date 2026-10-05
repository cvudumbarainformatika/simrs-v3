import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErr } from 'src/modules/utils'

export const useDokumenHomeCareStore = defineStore('dokumen_home_care_store', {
  state: () => ({
    loading: false,
    items: [],
    params: {
      tahunawal: new Date().getFullYear(),
      tahunakhir: new Date().getFullYear(),
      norm: ''
    }
  }),
  actions: {
    init (norm) {
      this.params.norm = norm
      this.getDataCatatan()
    },
    async getDataCatatan () {
      this.loading = true
      const params = { params: this.params }
      try {
        const resp = await api.get('v1/simrs/homecare/dokumen/catatan', params)
        this.loading = false
        this.items = resp?.data ?? []
        return resp
      } catch (err) {
        this.loading = false
        notifErr(err?.response)
      }
    }
  }
})
