import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErr, notifErrVue, notifSuccess, notifSuccessVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

export const useRehabmedikPlannStore = defineStore('rehabmedik-plann-store', {
  state: () => ({

    items: [],
    meta: null,
    loading: false,
    polikliniks: [],

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    getPoliklinik() {
      const app = useAplikasiStore()
      this.polikliniks = app?.polis?.map(x => {
        return {
          kode: x?.kodepoli,
          nama: x?.polirs
        }
      }) ?? []
      // console.log('getPoliklinik', this.polikliniks);


    },

    getNamaPoliklinik(kode) {
      const poli = this.polikliniks.find(p => p.kode === kode)
      return poli ? poli.nama : '-'
    },

    async simpanPlann(payload) {


      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/rehabmedik/simpanplann', payload)
          .then(resp => {
            console.log('simpan pendaftaran', resp)
            notifSuccessVue('Data berhasil disimpan')
            resolve(resp?.data)
          })
          .catch((err) => {
            notifErrVue('Data gagal disimpan')
            reject(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    }




  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRehabmedikPlannStore, import.meta.hot))
}
