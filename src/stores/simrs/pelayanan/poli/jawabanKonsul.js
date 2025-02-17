import { defineStore } from "pinia"
import { usePengunjungPoliStore } from "./pengunjung"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"

export const useJawabanKonsulStore = defineStore('jawaban-konsul', {
  state: () => ({
    storePasien: usePengunjungPoliStore(),
    loading: false
  }),
  actions: {
    simpanJawaban (pasien, item) {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/pelayanan/update-jawaban-konsul', item)
          .then(resp => {
            this.loading = false
            const isi = resp?.data?.data ?? false
            console.log('simpan ', resp, isi)
            if (isi) {
              this.storePasien.injectDataPasien(pasien, isi, 'jawabankonsul')
              notifSuccess(resp)
            }
            resolve(resp)
          })
          .catch(() => {
            this.loading = false
          })

      })

    },
    async updateDibaca (pasien, item) {
      console.log('set dibaca', item)

      await api.post('v1/simrs/pelayanan/update-dibaca', item)
        .then(resp => {
          const isi = resp?.data?.data ?? false
          console.log('simpan ', resp, isi)
          if (isi) {
            this.storePasien.injectDataPasien(pasien, isi, 'jawabankonsul')
            // notifSuccess(resp)
          }
        })
    }
  }
})
