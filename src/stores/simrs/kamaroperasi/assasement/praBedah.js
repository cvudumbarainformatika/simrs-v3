import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErrVue } from "src/modules/utils"
import { toRaw } from "vue"

export const useAssasementPraBedahStore = defineStore('assasement_pra_bedah_store', {
  state: () => ({
    loading: false,
    loadingInduksi: false,
    form: {
      komplikasi: []
    },
    formInduksi: {
      obat_pre_medikasi: []
    }
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
        api.post('v1/simrs/penunjang/ok/assasement/pra-bedah/simpan', payload)
          .then(resp => {
            this.loading = false
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })

      })
    },
    simpanFormInduksi (pasien) {
      const obat = this.formInduksi.obat_pre_medikasi.filter(item => !item.delete)
      if (obat.length > 0) this.formInduksi.obat_pre_medikasi = obat
      const payload = { ...this.formInduksi }
      if (!payload.noreg) {
        if (!!pasien?.noreg) {
          payload.noreg = pasien.rs1
          payload.nota = pasien.rs2
          payload.norm = pasien.norm
        }
        else return notifErrVue('Maaf, Data Pasien tidak valid, silahkan refresh halaman kemudian coba lagi')
      }
      console.log('simpan', payload)
      this.loadingInduksi = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/assasement/pra-induksi/simpan', payload)
          .then(resp => {
            this.loadingInduksi = false

            const data = resp?.data?.data
            pasien.pra_induksi = data
            // this.formInduksi = structuredClone(data)
            console.log('simpan', resp?.data)
            console.log('simpan induksi', resp?.data)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loadingInduksi = false })
      })
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAssasementPraBedahStore, import.meta.hot))
}
