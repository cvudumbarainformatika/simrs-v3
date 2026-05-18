import { acceptHMRUpdate, defineStore } from "pinia"

export const useAsuhanKeperawatanStore = defineStore('asuhan_keperawatan', {
  state: () => ({
    loading: false,
    form: {
      pengkajian_faktor_resiko: [],
      pengkajian_posisi_canul_intra_vena: [],
      pengkajian_jenis_operasi: null,
      pengkajian_disinfeksi_area_operasi: null,
      pengkajian_irigasi_luka: null,
      pengkajian_cairan_irigasi_luka: null,
      pengkajian_cuci_luka: null,
      pengkajian_cairan_untuk_cuci_luka: null,
      pengkajian_obat_penutup_luka: null,
      pengkajian_jenis_obat_penutup_luka: null,
      pengkajian_jenis_balutan_penutup_luka: null,
      pengkajian_urine_katheter: null,
      pengkajian_td_sis: null,
      pengkajian_td_dia: null,
      pengkajian_status_pernafasan: null,
      // luaran
      luaran_utama: [],
      luaran_hasil: [],
      // intervensi dan imlementasi
      inverntensi_utama: [],
      inverntensi_pendukung: [],
      implementasi_observasi: [],
      implementasi_terupetik: [],
      implementasi_kolaborasi: [],
      // evaluasi
      eval_tanggal: null,
      eval_jam: null,
      eval_subjective: null,
      eval_objective: null,
      eval_kerusakan_jaringan: null,
      eval_kemerahan: null,
      eval_oedem_daeran_incici: null,
      eval_haematon: null,
      eval_cariran_drainase: null,
      eval_jenis_cariran_drainase: null,
      eval_td_sis: null,
      eval_td_dia: null,
      eval_suhu: null,
      eval_rr: null,
      eval_hr: null,
      eval_spo2: null,
      eval_a_resiko_infeksi: null,
      eval_p: null,

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
    optionJenisOperasis: [
      { label: 'Bersih', value: 'Bersih' },
      { label: 'Terkontaminasi', value: 'Terkontaminasi' },
      { label: 'Kotor', value: 'Kotor' },
      { label: 'Bersih Terkontaminasi', value: 'Bersih Terkontaminasi' },
    ],
    optionDisinfeksiAreaOperasis: [
      { label: 'Alkohol 70%', value: 'Alkohol 70%' },
      { label: 'Povidon Iodium', value: 'Povidon Iodium' },
    ],
    optionCairanIrigasiLuka: [
      { label: 'NaCl', value: 'NaCl' },
      { label: 'Aquabidest', value: 'Aquabidest' },
      { label: 'Lain-lain', value: 'Lain-lain' },
    ],
    ynOptions: [
      { label: 'Ya', value: 'Ya' },
      { label: 'Tidak', value: 'Tidak' },
    ],
    nafasOptions: [
      { label: 'Spontan', value: 'Spontan' },
      { label: 'Dibantu', value: 'Dibantu' },
    ],

    // luaran
    optionLuarans: [
      { label: 'Tingkat Infeksi ( L.14137)', value: 'Tingkat Infeksi ( L.14137)' },
      { label: 'Integritas kulit dan jaringan ( L.14125 )', value: 'Integritas kulit dan jaringan ( L.14125 )' },
      { label: 'Kontrol Resiko ( L.14128 )', value: 'Kontrol Resiko ( L.14128 )' },
    ],
    optionHasils: [
      { label: 'Deman menurun', value: 'Deman menurun' },
      { label: 'Kemerahan menurun', value: 'Kemerahan menurun' },
      { label: 'Cairan berbau busuk menurun', value: 'Cairan berbau busuk menurun' },
      { label: 'Kerusakan jaringan menurun', value: 'Kerusakan jaringan menurun' },
      { label: 'Haenatoma menurun', value: 'Haenatoma menurun' },
    ],

    // intervensi dan imlementasi
    optionIntervensiUtama: [
      { label: 'Tingkat Infeksi ( L.14137)', value: 'Tingkat Infeksi ( L.14137)' },
      { label: 'Integritas kulit dan jaringan ( L.14125 )', value: 'Integritas kulit dan jaringan ( L.14125 )' },
      { label: 'Kontrol Resiko ( L.14128 )', value: 'Kontrol Resiko ( L.14128 )' },
    ],
    optionResikoInfeksis: [
      { label: 'Tidak terjadi', value: 'Tidak terjadi' },
      { label: 'Terjadi', value: 'Terjadi' },
    ],
    optionPs: [
      { label: 'Kontrol resiko meningkat', value: 'Kontrol resiko meningkat' },
      { label: 'Tingkat infeksi menurun', value: 'Tingkat infeksi menurun' },
    ],
  }),
  actions: {}
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAsuhanKeperawatanStore, import.meta.hot))
}
