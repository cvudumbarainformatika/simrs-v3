import { acceptHMRUpdate, defineStore } from "pinia"

export const useAsuhanKeperawatanStore = defineStore('asuhan_keperawatan', {
  state: () => ({
    loading: false,
    formPengkajian: {
      faktor_resiko: [],
      posisi_canul_intra_vena: [],
      urine_katheter: null,
      td_sis: null,
      td_dia: null,
      status_pernafasan: null,
    },
    display: {
      tanggal: '',
    },
    optionFaktorResikos: [
      { label: 'Penyakit kronis', value: 'Penyakit kronis' },
      { label: 'Efek prosedur invasif', value: 'Efek prosedur invasif' },
      { label: 'Peningkatan paparan organisme pathogen lingkungan', value: 'Peningkatan paparan organisme pathogen lingkungan' },
      { label: 'Ketidakadekuatan pertahanan tubuh primer', value: 'Ketidakadekuatan pertahanan tubuh primer' },
      { label: 'Ketidakadekuatan pertahanan tubuh  sekunder', value: 'Ketidakadekuatan pertahanan tubuh  sekunder' },
    ],
    optionPosisiCanulIntraVenas: [
      { label: 'Tangan ka / ki', value: 'Tangan ka / ki' },
      { label: 'Arteri', value: 'Arteri' },
      { label: 'Kaki ka / ki', value: 'Kaki ka / ki' },
    ],
    ynOptions: [
      { label: 'Ya', value: 'Ya' },
      { label: 'Tidak', value: 'Tidak' },
    ],
    nafasOptions: [
      { label: 'Spontan', value: 'Spontan' },
      { label: 'Dibantu', value: 'Dibantu' },
    ],

  }),
  actions: {}
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAsuhanKeperawatanStore, import.meta.hot))
}
