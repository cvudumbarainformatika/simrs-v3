import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"

export const useAsuhanAnastesiStore = defineStore('asuhan_anastesi', {
  state: () => ({
    // Struktur awal di Pinia Store kamu
    form: {
      pra_nama: null,
      pra_no_rm: null,
      pra_diagnosa: null,
      pra_bb: null,
      pra_tb: null,
      pra_gol_darah: null,
      pra_keadaan_umum: null,
      pra_td: null,
      pra_nadi: null,
      pra_rr: null,
      pra_suhu: null,
      pra_hb: null,
      pra_ht: null,
      pra_gds: null,
      pra_respirasi_sat: null,
      pra_kardio_crt: null,
      pra_kesadaran: null,
      pra_gcs: null,
      pra_renal_hepato: null,
      pra_muskulo_alergi: null,
      pra_nyeri_status: 'Tidak',
      pra_nyeri_skala: null,
      pra_masalah_kesehatan: [], // Tipe TEXT di DB (Checkbox)
      pra_intervensi_implementasi: [], // Tipe TEXT di DB (Checkbox)
      pra_evaluasi: [], // Tipe TEXT di DB (Checkbox)

      intra_jam_mulai_anestesi: null,
      intra_jam_selesai_anestesi: null,
      intra_jam_mulai_bedah: null,
      intra_jam_selesai_bedah: null,
      intra_teknik_anestesi: [], // Tipe TEXT di DB
      intra_inhalasi: null,
      intra_posisi_operasi: [], // Tipe TEXT di DB
      intra_posisi_lain: null,
      intra_masalah_kesehatan: [],
      intra_intervensi_implementasi: [],
      intra_evaluasi: [],

      pasca_jam_masuk_rr: null,
      pasca_jam_keluar_rr: null,
      pasca_spo2: null,
      pasca_pernafasan_status: [],
      pasca_pola_nafas: null,
      pasca_td: null,
      pasca_nadi: null,
      pasca_suhu: null,
      pasca_steward_score: null,
      pasca_bromage_score: null,
      pasca_masalah_kesehatan: [],
      pasca_intervensi_implementasi: [],
      pasca_evaluasi: []
    },

    // Contoh Data Pilihan Opsi di Store:
    opsiYn: [
      { label: 'Tidak', value: 'Tidak' },
      { label: 'Ya', value: 'Ya' }
    ],
    opsiKesadaran: [
      { label: 'Compos Mentis', value: 'Compos Mentis' },
      { label: 'Somnolen', value: 'Somnolen' },
      { label: 'Delirium', value: 'Delirium' },
      { label: 'Soporo Coma', value: 'Soporo Coma' },
      { label: 'Coma', value: 'Coma' }
    ],
    opsiPosisiOperasi: [
      { label: 'Supine', value: 'Supine' },
      { label: 'Trendelenburg', value: 'Trendelenburg' },
      { label: 'Lateral', value: 'Lateral' },
      { label: 'Litotomi', value: 'Litotomi' },
      { label: 'Jackknife', value: 'Jackknife' },
      { label: 'Prone', value: 'Prone' }
    ],
    // ...teruskan isi array opsi checkbox masalah keperawatan, intervensi, dll sesuai tulisan di berkas PDF.
  }),
  actions: {
    async getAsuhanAnastesi () {
      try {
        const response = await api.get('/asuhan_anastesi')
        this.form = response.data.data
      } catch (error) {
        console.error(error)
      }
    },
  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAsuhanAnastesiStore, import.meta.hot))
}
