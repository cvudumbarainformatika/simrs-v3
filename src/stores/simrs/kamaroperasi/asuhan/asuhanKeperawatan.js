import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

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
      intervensi_utama: [],
      intervensi_pendukung: [],
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
      eval_oedem_daerah_incici: null,
      eval_haematon: null,
      eval_cairan_drainase: null,
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
    optionIntervensiUtamas: [
      { label: 'Pencegahan infeksi ( I.14539 )', value: 'Pencegahan infeksi ( I.14539 )' },
    ],
    optionIntervensiPendukungs: [
      { label: 'Management lingkungan ( I.14514 )', value: 'Management lingkungan ( I.14514 )' },
      { label: 'Perawatan area insisi ( I.14558 )', value: 'Perawatan area insisi ( I.14558 )' },
    ],
    optionObservasis: [
      { label: 'Monitor lokasi insisi ( kemerahan, bengkak, atau tanda-tanda infeksi )', value: 'Monitor lokasi insisi ( kemerahan, bengkak, atau tanda-tanda infeksi )' },
      { label: 'Monitor dan mempertahankan sterilisasi lingkungan operasi selama perioperatif', value: 'Monitor dan mempertahankan sterilisasi lingkungan operasi selama perioperatif' },
    ],
    optionTerupetiks: [
      { label: 'Mengatur meja steril instrumen dan linen.', value: 'Mengatur meja steril instrumen dan linen.' },
      { label: 'Menyiapkan dan mempertahankan instrumen dalam keadaan steril selama perioperatif.', value: 'Menyiapkan dan mempertahankan instrumen dalam keadaan steril selama perioperatif.' },
      { label: 'Melakukan scrubing, glowing, gloving, dan draping dengan tenik antiseptik.', value: 'Melakukan scrubing, glowing, gloving, dan draping dengan tenik antiseptik.' },
      { label: 'Membersihkan area operasi dengan antiseptic dari area dalam menuju area luar.', value: 'Membersihkan area operasi dengan antiseptic dari area dalam menuju area luar.' },
      { label: 'Membatasi jumlah personil didalam OK.', value: 'Membatasi jumlah personil didalam OK.' },
      { label: 'Mengatur suhu kamar operasi.', value: 'Mengatur suhu kamar operasi.' },
      { label: 'Menerapkan prinsip teknik aseptic selama perioperative.', value: 'Menerapkan prinsip teknik aseptic selama perioperative.' },
      { label: 'Melakukan pernutupan luka insisi dengan teknik aseptik.', value: 'Melakukan pernutupan luka insisi dengan teknik aseptik.' },
    ],
    optionKolaborasis: [
      { label: 'Kolaborasi dengan operator untuk memastikan pembrian profilaksis.', value: 'Kolaborasi dengan operator untuk memastikan pembrian profilaksis.' },
    ],
    // Evaluasi
    optionResikoInfeksis: [
      { label: 'Tidak terjadi', value: 'Tidak terjadi' },
      { label: 'Terjadi', value: 'Terjadi' },
    ],
    optionPs: [
      { label: 'Kontrol resiko meningkat', value: 'Kontrol resiko meningkat' },
      { label: 'Tingkat infeksi menurun', value: 'Tingkat infeksi menurun' },
    ],
  }),
  actions: {
    resetForm (pasien) {
      // console.log('resetForm')
      this.form = {
        noreg: pasien?.noreg,
        norm: pasien?.norm,
        nota: pasien?.rs2,

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
        intervensi_utama: [],
        intervensi_pendukung: [],
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
        eval_oedem_daerah_incici: null,
        eval_haematon: null,
        eval_cairan_drainase: null,
        eval_jenis_cariran_drainase: null,
        eval_td_sis: null,
        eval_td_dia: null,
        eval_suhu: null,
        eval_rr: null,
        eval_hr: null,
        eval_spo2: null,
        eval_a_resiko_infeksi: null,
        eval_p: null,
      }
    },
    async getData (pasien) {
      try {
        const params = {
          params: {
            noreg: pasien?.noreg,
            norm: pasien?.norm,
            nota: pasien?.rs2,
          }
        }
        const resp = await api.get('v1/simrs/penunjang/ok/asuhan/keperawatan/getdata', params)
        // console.log('resp get data', resp)
        if (resp?.status === 200) {
          const data = resp.data?.data
          if (!!data) {
            this.form = resp.data?.data
            this.display.tanggal = date.formatDate(this.form.pengkajian_tanggal, 'DD MMMM YYYY')
            delete this.form.created_at
            delete this.form.updated_at

          } else {
            this.resetForm(pasien)
          }
        }
      } catch (e) { } finally { }
    },
    async simpan (pasien) {
      // console.log('pasien', pasien, this.form)
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/penunjang/ok/asuhan/keperawatan/simpan', this.form)
        // console.log('resp simpan', resp)
        if (resp?.status === 200) {
          notifSuccess(resp)
          this.getData(pasien)
        }
      } catch (e) { } finally {
        this.loading = false
      }

    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAsuhanKeperawatanStore, import.meta.hot))
}
