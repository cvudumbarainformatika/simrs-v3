import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useArsipMasterKelasifikasiStore = defineStore('arsip-master-kelasifikasi', {
  state: () => ({
    items: [],
    form: {}
  }),
  actions: {
    async simpanMaster() {
      try {
        const resp = await api.post('v1/arsip/master/simpankelasifikasi', this.form)
        if (resp.status === 200) {
          this.items.push(resp?.data?.result)
          notifSuccess(resp)
          this.loadingSave = false
          this.initReset()
        }
        this.loadingSave = false
      } catch (error) {
        console.log(error)
        this.loadingSave = false
      }
    },
  }
})
