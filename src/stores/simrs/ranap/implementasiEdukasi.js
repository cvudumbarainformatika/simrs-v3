import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungPoliStore } from 'src/stores/simrs/pelayanan/poli/pengunjung'
import { notifSuccess } from 'src/modules/utils'
import { usePengunjungRanapStore } from './pengunjung'

export const useImplementasiEdukasiRanapStore = defineStore('implementasi-edukasi-ranap', {
  state: () => ({
    form: {
      metode: [],
      materi: [],
      materiLain: null,
      estimasi: null,
      media: [],
      evaluasi: null,
      penerima: null,
      nakes: null,
    },
    loadingSave: false,


    metodis: ['Audio', 'Demonstrasi', 'Lisan', 'Tulisan', 'Visual'],
    materiDpjp: [
      'PENJELASAN HASIL PENGKAJIAN, DIAGNOSA DAN RENCANA ASUHAN',
      'HASIL PEMERIKSAAN PENUNJANG',
      'PERKIRAAN HARI RAWAT',
      'PENJELASAN KOMPLIKASI YANG MUNGKIN TERJADI',
      'PEMBERIAN TERAPI TERMASUK HASIL PENGOBATAN YANG TIDAK DIHARAPKAN',
      'TINDAKAN MEDIS YANG DIBERIKAN',
    ],
    medias: ['LEAFLET/LEMBAR BALIK', 'AUDIO/VIDEO', 'ALAT PERAGA']
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {

    initReset() {
      this.form = {
        metode: [],
        materi: [],
        materiLain: null,
        estimasi: null,
        media: [],
        evaluasi: null,
        penerima: null,
        nakes: null,
      }
    },

    setForm(key, val) {
      this.form[key] = val
    },
    async simpanEdukasi(pasien) {
      console.log('save implementasi', pasien);

    },


  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useImplementasiEdukasiRanapStore, import.meta.hot))
}
