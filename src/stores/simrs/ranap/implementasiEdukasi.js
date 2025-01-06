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
      namaPenerima: null,
      ttdPenerima: null,
      nakes: null,
      ttdPenerima: null
    },
    loadingSave: false,
    items: [],


    metodis: ['Audio', 'Demonstrasi', 'Lisan', 'Tulisan', 'Visual'],
    materiDpjp: [
      'PENJELASAN HASIL PENGKAJIAN, DIAGNOSA DAN RENCANA ASUHAN',
      'HASIL PEMERIKSAAN PENUNJANG',
      'PERKIRAAN HARI RAWAT',
      'PENJELASAN KOMPLIKASI YANG MUNGKIN TERJADI',
      'PEMBERIAN TERAPI TERMASUK HASIL PENGOBATAN YANG TIDAK DIHARAPKAN',
      'TINDAKAN MEDIS YANG DIBERIKAN',
    ],
    medias: ['LEAFLET/LEMBAR BALIK', 'AUDIO/VIDEO', 'ALAT PERAGA'],
    evaluasis: ['TIDAK MENGERTI', 'MENYATAKAN PAHAM', 'MAMPU MENJELASKAN', 'MAMPU DEMONSTRASI'],
    penerimaEdukasis: ['Pasien', 'Orang Tua', 'Anak', 'Keluarga']
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
        namaPenerima: null,
        ttdPenerima: null,
        nakes: null,
        ttdPenerima: null
      }
    },

    async getList(pasien) {

      const params = {
        params: {
          noreg: pasien?.noreg
        }
      }

      try {
        const resp = await api.get('v1/simrs/pelayanan/simpanimplementasi-edukasi/list', params)
        console.log('respon list implementasi', resp);

        if (resp?.status === 200) {
          this.items = resp?.data
        }
      } catch (error) {
        console.log('implementasi error', error);

      }

    },

    setForm(key, val) {
      this.form[key] = val
    },
    async simpanData(pasien) {
      // console.log('save implementasi', pasien);

      this.form.noreg = pasien?.noreg
      this.form.norm = pasien?.norm
      this.form.kdruang = pasien?.kodepoli

      try {
        const resp = await api.post('v1/simrs/pelayanan/simpanimplementasi-edukasi', this.form)
        console.log('respon implementasi', resp);

        if (resp?.status === 200) {

        }
      } catch (error) {
        console.log('implementasi error', error);

      }

    },


  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useImplementasiEdukasiRanapStore, import.meta.hot))
}
