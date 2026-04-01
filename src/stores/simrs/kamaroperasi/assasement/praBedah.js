import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErrVue } from "src/modules/utils"

export const useAssasementPraBedahStore = defineStore('assasement_pra_bedah_store', {
  state: () => ({
    loading: false,
    form: {
      komplikasi: []
    },
  }),
  actions: {
    simpan (pasien) {
      // console.log('simpan pasien', pasien)
      const payload = { ...this.form }
      if (!payload.noreg) {
        if (!!pasien?.noreg) {
          payload.noreg = pasien.rs1
          payload.nota = pasien.rs2
          payload.norm = pasien.norm
        }
        else return notifErrVue('Maaf, Data Pasien tidak valid, silahkan refresh halaman kemudian coba lagi')
      }
      else console.log('sudah di isi')

      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/assasement/simpan', payload)
          .then(resp => {
            this.loading = false
            console.log('simpan', resp?.data)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })

      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAssasementPraBedahStore, import.meta.hot))
}
