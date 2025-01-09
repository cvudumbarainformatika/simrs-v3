import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungPoliStore } from 'src/stores/simrs/pelayanan/poli/pengunjung'
import { notifSuccess } from 'src/modules/utils'
import { usePengunjungRanapStore } from './pengunjung'
import { useTindakanRanapStore } from 'src/stores/simrs/ranap/tindakan'

export const useNurseNoteRanapStore = defineStore('nursenote-ranap-store', {
  state: () => ({
    form: {
      // tindakan
      tindakan: null,
      ket: null,

      // implementasi
      dx: null,
      implementasi: null,

      //ttv
      bb: 0,
      tb: 0,
      nadi: 0,
      suhu: 0,
      sis: 0,
      dia: 0,
      rr: 0,
      spo2: 0,
      nyeri: 0,
      skor: 0,

      // ventilator menu
      mode: null,
      fraksio2: 0,
      frek: 0,
      peep: 0,
      pins: 0,
      ratio: 0,

      // intake
      infus: 0,
      pump: 0,
      injeksi: 0,
      oral: 0,
      tetes: 0,
      albumin: 0,
      mamin: 0,
      zonde: 0,
      water: 0,

      // output
      urine: 0,
      drine: 0,
      muntah: 0,
      feces: 0,
      ivvi: 0,
      pendarahan: 0,
      ufg: 0,
      produksigc: 0,


    },
    tindakans: [],
    loadingSave: false
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    initForm() {
      const tindakanStore = useTindakanRanapStore()
      this.tindakans = tindakanStore.listTindakan
      // console.log('tindakanStore', tindakanStore.listTindakan);

    }

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNurseNoteRanapStore, import.meta.hot))
}
