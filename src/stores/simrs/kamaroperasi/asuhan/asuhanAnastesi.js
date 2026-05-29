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
      pra_informed_consent: null, // Tipe TEXT di DB (Radio: Ada/Tidak)
      pra_respirasi_status: null, // Tipe TEXT di DB (Radio: Normal/Tidak)
      pra_respirasi_status_keterangan: null, // Tipe TEXT di DB (Input: Sebutkan) - NEW
      pra_respirasi_sat: null,
      pra_kardio_status: null, // Tipe TEXT di DB (Radio: Normal/Tidak)
      pra_kardio_status_keterangan: null, // Tipe TEXT di DB (Input: Sebutkan) - NEW
      pra_kardio_crt_detik: null, // Tipe TEXT di DB (Radio: < 2 detik / > 2 detik)
      pra_kardio_kulit: null, // Tipe TEXT di DB (Radio: Hangat/Dingin)
      pra_kardio_perdarahan_status: null, // Tipe TEXT di DB (Radio: Tidak/Ada)
      pra_kardio_perdarahan_cc: null, // Tipe TEXT di DB (Input: cc)
      pra_kesadaran: null,
      pra_gcs: null,
      pra_renal_status: null, // Tipe TEXT di DB (Radio: Normal/Tidak)
      pra_renal_ket: null, // Tipe TEXT di DB (Input: Sebutkan)
      pra_hepato_status: null, // Tipe TEXT di DB (Radio: Normal/Tidak)
      pra_hepato_ket: null, // Tipe TEXT di DB (Input: Sebutkan)
      pra_muskulo_status: null, // Tipe TEXT di DB (Radio: Normal/Tidak)
      pra_muskulo_ket: null, // Tipe TEXT di DB (Input: Sebutkan)
      pra_alergi_status: null, // Tipe TEXT di DB (Radio: Normal/Tidak)
      pra_alergi_riwayat: null, // Tipe TEXT di DB (Input: Riwayat Alergi)
      pra_nyeri_status: null,
      pra_nyeri_skala: null,
      pra_masalah_kesehatan: [], // Tipe TEXT di DB (Checkbox)
      pra_intervensi: [], // Tipe TEXT di DB (Checkbox) - NEW
      pra_implementasi: [], // Tipe TEXT di DB (Checkbox) - NEW
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
      intra_intervensi: [], // Tipe TEXT di DB (Checkbox) - NEW
      intra_implementasi: [], // Tipe TEXT di DB (Checkbox) - NEW
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
      pasca_intervensi: [], // Tipe TEXT di DB (Checkbox) - NEW
      pasca_implementasi: [], // Tipe TEXT di DB (Checkbox) - NEW
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

    // ====== PRA ANESTESI OPTIONS ======
    opsiYesNo: [
      { label: 'Ada', value: 'Ada' },
      { label: 'Tidak', value: 'Tidak' }
    ],
    opsiNormal: [
      { label: 'Normal', value: 'Normal' },
      { label: 'Tidak', value: 'Tidak' }
    ],
    opsiRespirasiBantuan: [
      { label: 'Normal', value: 'Normal' },
      { label: 'Bantu oksigen', value: 'Bantu oksigen' }
    ],
    opsiPerdarahan: [
      { label: 'Tidak', value: 'Tidak' },
      { label: 'Ada', value: 'Ada' }
    ],
    opsiCRTDetik: [
      { label: '< 2 detik', value: '< 2 detik' },
      { label: '> 2 detik', value: '> 2 detik' }
    ],
    opsiKulit: [
      { label: 'Hangat', value: 'Hangat' },
      { label: 'Dingin', value: 'Dingin' }
    ],
    opsiPraMasalah: [
      { label: 'Nyeri', value: 'Nyeri' },
      { label: 'Resiko Cedera Anestesi', value: 'Resiko Cedera Anestesi' },
      { label: 'Shock', value: 'Shock' },
      { label: 'Resiko Cedera Pembedahan', value: 'Resiko Cedera Pembedahan' }
    ],
    opsiPraIntervensi: [
      { label: 'Kaji tingkat nyeri', value: 'Kaji tingkat nyeri' },
      { label: 'Kolaborasi pemberian Analgetik', value: 'Kolaborasi Analgetik' },
      { label: 'Monitoring tanda vital', value: 'Monitoring TTV' },
      { label: 'Siapkan mesin, alat (STATICS) dan obat anestesi sesuai kebutuhan', value: 'Siapkan Peralatan' },
      { label: 'Kolaborasi pemberian transfusi/ cairan pengganti darah / Antikuagulan', value: 'Transfusi/Cairan' }
    ],
    opsiPraImplementasi: [
      { label: 'Mengkaji skala nyeri', value: 'Mengkaji skala nyeri' },
      { label: 'Memberikan analgetik', value: 'Memberikan analgetik' },
      { label: 'Mengukur tanda vital', value: 'Mengukur tanda vital' },
      { label: 'Memberikan tranfusi/ cairan pengganti darah / Antikuagulan', value: 'Memberikan Transfusi' }
    ],
    opsiPraEval: [
      { label: 'TTV pasien dalam batas normal', value: 'TTV Normal' },
      { label: 'Cedera anestesi tidak terjadi', value: 'Cedera Tidak Terjadi' },
      { label: 'Cedera pembedahan dapat teratasi', value: 'Cedera Teratasi' }
    ],

    // ====== INTRA ANESTESI OPTIONS ======
    opsiTeknikAnestesi: [
      { label: 'GA', value: 'GA' },
      { label: 'ETT', value: 'ETT' },
      { label: 'NTT', value: 'NTT' },
      { label: 'FM', value: 'FM' },
      { label: 'LMA', value: 'LMA' },
      { label: 'Tiva', value: 'Tiva' },
      { label: 'Regional', value: 'Regional' },
      { label: 'Spinal', value: 'Spinal' },
      { label: 'Epidural', value: 'Epidural' },
      { label: 'Caudal', value: 'Caudal' },
      { label: 'Blok', value: 'Blok' },
      { label: 'Kombinasi Regional dan GA', value: 'Kombinasi Regional GA' }
    ],
    opsiTeknikPengkajian: [
      { label: 'NTT', value: 'NTT' },
      { label: 'FM', value: 'FM' },
      { label: 'LMA', value: 'LMA' },
      { label: 'Tiva', value: 'Tiva' },
      { label: 'Epidural', value: 'Epidural' },
      { label: 'Caudal', value: 'Caudal' },
      { label: 'Blok', value: 'Blok' }
    ],
    opsiIntraMasalah: [
      { label: 'Resiko Trauma Pembedahan', value: 'Resiko Trauma Pembedahan' },
      { label: 'PK Disfungsi Respirasi (hipoksia,bronkospasme, edema laring)', value: 'PK Disfungsi Respirasi' },
      { label: 'PK Disfungsi Kardiovaskuler (hipotensi,hipertensi, bradikardi, aritmia, arest)', value: 'PK Disfungsi Kardiovaskuler' },
      { label: 'Resiko hipersensitifitas agen anestesi', value: 'Resiko Hipersensitifitas' }
    ],
    opsiIntraIntervensi: [
      { label: 'Kolaborasi pemberian obat anestesi', value: 'Kolaborasi Obat' },
      { label: 'Atur posisi pasien', value: 'Atur Posisi' },
      { label: 'Monitoring tanda vital', value: 'Monitoring TTV' },
      { label: 'Asistensi tindakan anestesi umum', value: 'Asistensi Umum' },
      { label: 'Asistensi tindakan regional', value: 'Asistensi Regional' },
      { label: 'Kolaborasi pemberian obat vasopresor', value: 'Obat Vasopresor' },
      { label: 'Kolaborasi pemberian Cairan', value: 'Pemberian Cairan' },
      { label: 'Berikan blanket warmer pasien', value: 'Blanket Warmer' },
      { label: 'Kolaborasi pemberian obat emergensi', value: 'Obat Emergensi' }
    ],
    opsiIntraImplementasi: [
      { label: 'Memberikan obat anestesi', value: 'Memberikan obat anestesi' },
      { label: 'Mengatur posisi pasien', value: 'Mengatur posisi pasien' },
      { label: 'Melakukan monitoring tanda vital', value: 'Monitoring TTV' },
      { label: 'Melakukan asistensi tindakan anestesi dan sedasi', value: 'Asistensi Anestesi' },
      { label: 'Melakukan asistensi tindakan regional', value: 'Asistensi Regional' },
      { label: 'Memberikan obat vasopresor', value: 'Obat Vasopresor' },
      { label: 'Memberikan cairan elektrolit selama operasi', value: 'Cairan Elektrolit' },
      { label: 'Memberikan blanket warmer', value: 'Blanket Warmer' },
      { label: 'Memberikan obat emergensi', value: 'Obat Emergensi' }
    ],
    opsiIntraEval: [
      { label: 'Stadium anestesi terpenuhi', value: 'Stadium Terpenuhi' },
      { label: 'Posisi pasien sesuai rencana operasi', value: 'Posisi Sesuai' },
      { label: 'TTV pasien dalam batas normal', value: 'TTV Normal' },
      { label: 'Kebutuhan cairan terpenuhi', value: 'Cairan Terpenuhi' },
      { label: 'Suhu dalam batas normal', value: 'Suhu Normal' },
      { label: 'Kegawat daruratan pasien teratasi', value: 'Gawat Teratasi' }
    ],

    // ====== PASCA ANESTESI OPTIONS ======
    opsiPascaNafas: [
      { label: 'Nafas spontan', value: 'Nafas spontan' },
      { label: 'Bantu oksigen', value: 'Bantu oksigen' },
      { label: 'Alat bantu nafas', value: 'Alat bantu nafas' }
    ],
    opsiOksigenLpm: [
      { label: 'Canul', value: 'Canul' },
      { label: 'NRM', value: 'NRM' }
    ],
    opsiRetraksi: [
      { label: 'Ya', value: 'Ya' },
      { label: 'Tidak', value: 'Tidak' }
    ],
    opsiPolaNafas: [
      { label: 'Normal', value: 'Normal' },
      { label: 'Tidak normal', value: 'Tidak normal' }
    ],
    opsiPascaMasalah: [
      { label: 'Nyeri', value: 'Nyeri' },
      { label: 'Resiko Cedera Anestesi', value: 'Resiko Cedera Anestesi' },
      { label: 'PK Disfungsi Termoregulasi', value: 'PK Disfungsi Termoregulasi' },
      { label: 'Resiko Jatuh', value: 'Resiko Jatuh' },
      { label: 'Shock', value: 'Shock' },
      { label: 'Resiko Cedera Pembedahan', value: 'Resiko Cedera Pembedahan' },
      { label: 'RK Disfungsi Kardiovaskuler', value: 'RK Disfungsi Kardiovaskuler' },
      { label: 'RK Disfungsi Respirasi', value: 'RK Disfungsi Respirasi' }
    ],
    opsiPascaIntervensi: [
      { label: 'Kaji tingkat nyeri', value: 'Kaji tingkat nyeri' },
      { label: 'Observasi tanda vital', value: 'Observasi TTV' },
      { label: 'Atur posisi sesuai kebutuhan pasien', value: 'Atur Posisi' },
      { label: 'Observasi tingkat kesadaran', value: 'Observasi Kesadaran' },
      { label: 'Lakukan suction pasien', value: 'Suction Pasien' },
      { label: 'Kaji pergerakan ekstremitas bawah', value: 'Kaji Ekstremitas' }
    ],
    opsiPascaImplementasi: [
      { label: 'Mengkaji skala nyeri', value: 'Mengkaji skala nyeri' },
      { label: 'Mengukur tanda vital (TD,N,S,RR)', value: 'Mengukur TTV' },
      { label: 'Mengatur posisi pasien', value: 'Mengatur posisi' },
      { label: 'Mengobservasi tingkat kesadaran', value: 'Observasi Kesadaran' },
      { label: 'Melakukan suction pasien', value: 'Suction Pasien' },
      { label: 'Mengkaji ekstremitas bawah pasien', value: 'Kaji Ekstremitas' }
    ],
    opsiPascaEval: [
      { label: 'Pasien tampak tenang', value: 'Pasien Tenang' },
      { label: 'TTV pasien dalam batas normal', value: 'TTV Normal' },
      { label: 'Pasien tampak nyaman', value: 'Pasien Nyaman' },
      { label: 'Steward score > 5', value: 'Steward > 5' },
      { label: 'Bromage score 0 - 1', value: 'Bromage 0-1' }
    ]
  }),
  actions: {
    async getAsuhanAnastesi (pasien) {
      const param = {
        params: {
          noreg: pasien.noreg,
          nota: pasien.rs2,
          norm: pasien.norm
        }
      }
      try {
        const response = await api.get('v1/simrs/penunjang/ok/asuhan/anastesi/getdata', param)
        const data = response.data.data
        if (data) {
          this.form = { ...data }
          delete this.form.created_at
          delete this.form.updated_at
        } else {
          this.resetForm(pasien)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async saveFormAnestesi () {
      try {
        const response = await api.post('v1/simrs/penunjang/ok/asuhan/anastesi/simpan', this.form)
        return response.data
      } catch (error) {
        console.error('Error saving form:', error)
        throw error
      }
    },
    async updateFormAnestesi (id) {
      try {
        const response = await api.put(`v1/simrs/penunjang/ok/asuhan/${id}`, this.form)
        return response.data
      } catch (error) {
        console.error('Error updating form:', error)
        throw error
      }
    },
    resetForm (pasien) {
      this.form = {
        noreg: pasien?.noreg,
        norm: pasien?.norm,
        nota: pasien?.rs2,
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
        pra_respirasi_status: null,
        pra_respirasi_status_keterangan: null,
        pra_respirasi_sat: null,
        pra_kardio_status: null,
        pra_kardio_status_keterangan: null,
        pra_kesadaran: null,
        pra_gcs: null,
        pra_renal_hepato: null,
        pra_muskulo_alergi: null,
        pra_nyeri_status: null,
        pra_nyeri_skala: null,
        pra_masalah_kesehatan: [],
        pra_intervensi: [],
        pra_implementasi: [],
        pra_evaluasi: [],
        intra_jam_mulai_anestesi: null,
        intra_jam_selesai_anestesi: null,
        intra_jam_mulai_bedah: null,
        intra_jam_selesai_bedah: null,
        intra_teknik_anestesi: [],
        intra_inhalasi: null,
        intra_posisi_operasi: [],
        intra_posisi_lain: null,
        intra_masalah_kesehatan: [],
        intra_intervensi: [],
        intra_implementasi: [],
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
        pasca_intervensi: [],
        pasca_implementasi: [],
        pasca_evaluasi: []
      }
    }
  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAsuhanAnastesiStore, import.meta.hot))
}
