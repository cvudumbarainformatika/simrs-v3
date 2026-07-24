import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { date } from 'quasar'

export const usePraSedasiRanapStore = defineStore('pra-sedasi-ranap-store', {
  state: () => ({
    form: {
      id: null,
      noreg: null,
      norm: null,
      kdruang: null,
      kddokter: null,
      dokter: null,
      tgl: null,

      // 1. KAJIAN SISTEM
      kajian_sistem: {
        hilangnyaGigi: 'Tidak',
        masalahMobilisasiLeher: 'Tidak',
        leherPendek: 'Tidak',
        batuk: 'Tidak',
        sesakNafas: 'Tidak',
        baruSajaInfeksi: 'Tidak',
        saluranNafasSakitDada: 'Tidak',
        denyutJantungTidakNormal: 'Tidak',
        muntah: 'Tidak',
        pingsan: 'Tidak',
        stroke: 'Tidak',
        kejang: 'Tidak',
        sedangHamil: 'Tidak',
        kelainanTulangBelakang: 'Tidak',
        obesitas: 'Tidak'
      },
      keterangan_kajian_sistem: null,

      // 2. PEMERIKSAAN FISIK
      tinggi: null,
      berat: null,
      tekanan_darah: null,
      nadi: null,
      suhu: null,

      // 3. KEADAAN UMUM
      skor_mallampati: null,
      gigi_palsu: null,
      jantung: null,
      paru_paru: null,
      abdomen: null,
      tulang_belakang: null,
      ekstremitas: null,
      neurologi: null,
      keterangan_keadaan_umum: null,

      // 4. LABORATORIUM
      laboratorium: {
        hbHtCheck: false, hbHt: null,
        ptCheck: false, pt: null,
        glukosaDarahCheck: false, glukosaDarah: null,
        tesKehamilanCheck: false, tesKehamilan: null,
        kaliumCheck: false, kalium: null,
        ureumCheck: false, ureum: null,
        leukositCheck: false, leukosit: null,
        trombositCheck: false, trombosit: null,
        rontgenDadaCheck: false, rontgenDada: null,
        ekgCheck: false, ekg: null,
        naClCheck: false, naCl: null,
        kreatininCheck: false, kreatinin: null
      },
      keterangan_laboratorium: null,

      // 5. DIAGNOSIS (ICD X)
      diagnosis: ['', ''],

      // 6. ASA CLASSIFICATION
      asa_classification: null,

      // 7. PENYULIT SEDASI LAIN
      penyulit_sedasi_lain: ['', ''],

      // 8. CATATAN TINDAK LANJUT
      catatan_tindak_lanjut: null,

      // 9. PERENCANAAN SEDASI
      teknik_sedasi: null,
      teknik_khusus: [],
      teknik_khusus_lain: null,
      perawatan_pasca_sedasi: null,
      rawat_khusus_opt: null,
      rawat_khusus_lain: null,
      aps_ket: null,

      // 10. PERSIAPAN PRA SEDASI
      puasa_mulai_jam: null,
      puasa_mulai_tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      pre_medikasi_jam: null,
      pre_medikasi_tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      mulai_sedasi_jam: null,
      mulai_sedasi_tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      catatan_persiapan_pra_sedasi: null
    },

    items: [],
    loading: false,
    loadingSave: false,

    // Master pilihan
    asaOptions: [
      { label: 'ASA 1 Pasien normal yang sehat', value: 'ASA 1' },
      { label: 'ASA 2 Pasien dengan penyakit sistemik ringan', value: 'ASA 2' },
      { label: 'ASA 3 Pasien dengan penyakit sistemik berat', value: 'ASA 3' },
      { label: 'ASA 4 Pasien dengan penyakit sistemik berat yang mengancam nyawa.', value: 'ASA 4' }
    ],
    teknikKhususOptions: [
      'Hipotensi',
      'Gildescope',
      'USG',
      'Ventilasi satu paru',
      'TCI',
      'Lain-lain'
    ],
    perawatanPascaSedasiOptions: [
      'Rawat Inap',
      'Rawat Jalan',
      'Rawat Khusus',
      'APS'
    ],
    rawatKhususOptions: [
      'ICU',
      'ICCU',
      'PACU',
      'Lain-lain'
    ]
  }),

  actions: {
    initForm(data = null) {
      const today = date.formatDate(Date.now(), 'YYYY-MM-DD')
      if (data) {
        // Deep copy data
        const item = JSON.parse(JSON.stringify(data))
        // Unserialize JSON strings if necessary
        if (typeof item.kajian_sistem === 'string') {
          try { item.kajian_sistem = JSON.parse(item.kajian_sistem) } catch (e) {}
        }
        if (!item.kajian_sistem || typeof item.kajian_sistem !== 'object') {
          item.kajian_sistem = {
            hilangnyaGigi: 'Tidak',
            masalahMobilisasiLeher: 'Tidak',
            leherPendek: 'Tidak',
            batuk: 'Tidak',
            sesakNafas: 'Tidak',
            baruSajaInfeksi: 'Tidak',
            saluranNafasSakitDada: 'Tidak',
            denyutJantungTidakNormal: 'Tidak',
            muntah: 'Tidak',
            pingsan: 'Tidak',
            stroke: 'Tidak',
            kejang: 'Tidak',
            sedangHamil: 'Tidak',
            kelainanTulangBelakang: 'Tidak',
            obesitas: 'Tidak'
          }
        }
        if (typeof item.laboratorium === 'string') {
          try { item.laboratorium = JSON.parse(item.laboratorium) } catch (e) {}
        }
        if (!item.laboratorium || typeof item.laboratorium !== 'object') {
          item.laboratorium = {
            hbHtCheck: false, hbHt: null,
            ptCheck: false, pt: null,
            glukosaDarahCheck: false, glukosaDarah: null,
            tesKehamilanCheck: false, tesKehamilan: null,
            kaliumCheck: false, kalium: null,
            ureumCheck: false, ureum: null,
            leukositCheck: false, leukosit: null,
            trombositCheck: false, trombosit: null,
            rontgenDadaCheck: false, rontgenDada: null,
            ekgCheck: false, ekg: null,
            naClCheck: false, naCl: null,
            kreatininCheck: false, kreatinin: null
          }
        }
        if (typeof item.diagnosis === 'string') {
          try { item.diagnosis = JSON.parse(item.diagnosis) } catch (e) {}
        }
        if (!Array.isArray(item.diagnosis)) {
          item.diagnosis = ['', '']
        }
        if (typeof item.penyulit_sedasi_lain === 'string') {
          try { item.penyulit_sedasi_lain = JSON.parse(item.penyulit_sedasi_lain) } catch (e) {}
        }
        if (!Array.isArray(item.penyulit_sedasi_lain)) {
          item.penyulit_sedasi_lain = ['', '']
        }
        if (typeof item.teknik_khusus === 'string') {
          try { item.teknik_khusus = JSON.parse(item.teknik_khusus) } catch (e) {}
        }
        if (!Array.isArray(item.teknik_khusus)) {
          item.teknik_khusus = []
        }
        this.form = item
      } else {
        this.form = {
          id: null,
          noreg: null,
          norm: null,
          kdruang: null,
          kddokter: null,
          dokter: null,
          tgl: null,

          kajian_sistem: {
            hilangnyaGigi: 'Tidak',
            masalahMobilisasiLeher: 'Tidak',
            leherPendek: 'Tidak',
            batuk: 'Tidak',
            sesakNafas: 'Tidak',
            baruSajaInfeksi: 'Tidak',
            saluranNafasSakitDada: 'Tidak',
            denyutJantungTidakNormal: 'Tidak',
            muntah: 'Tidak',
            pingsan: 'Tidak',
            stroke: 'Tidak',
            kejang: 'Tidak',
            sedangHamil: 'Tidak',
            kelainanTulangBelakang: 'Tidak',
            obesitas: 'Tidak'
          },
          keterangan_kajian_sistem: null,

          tinggi: null,
          berat: null,
          tekanan_darah: null,
          nadi: null,
          suhu: null,

          skor_mallampati: null,
          gigi_palsu: null,
          jantung: null,
          paru_paru: null,
          abdomen: null,
          tulang_belakang: null,
          ekstremitas: null,
          neurologi: null,
          keterangan_keadaan_umum: null,

          laboratorium: {
            hbHtCheck: false, hbHt: null,
            ptCheck: false, pt: null,
            glukosaDarahCheck: false, glukosaDarah: null,
            tesKehamilanCheck: false, tesKehamilan: null,
            kaliumCheck: false, kalium: null,
            ureumCheck: false, ureum: null,
            leukositCheck: false, leukosit: null,
            trombositCheck: false, trombosit: null,
            rontgenDadaCheck: false, rontgenDada: null,
            ekgCheck: false, ekg: null,
            naClCheck: false, naCl: null,
            kreatininCheck: false, kreatinin: null
          },
          keterangan_laboratorium: null,

          diagnosis: ['', ''],
          asa_classification: null,
          penyulit_sedasi_lain: ['', ''],
          catatan_tindak_lanjut: null,

          teknik_sedasi: null,
          teknik_khusus: [],
          teknik_khusus_lain: null,
          perawatan_pasca_sedasi: null,
          rawat_khusus_opt: null,
          rawat_khusus_lain: null,
          aps_ket: null,

          puasa_mulai_jam: null,
          puasa_mulai_tgl: today,
          pre_medikasi_jam: null,
          pre_medikasi_tgl: today,
          mulai_sedasi_jam: null,
          mulai_sedasi_tgl: today,
          catatan_persiapan_pra_sedasi: null
        }
      }
    },

    async getData(pasien) {
      if (!pasien?.noreg) return
      this.loading = true
      try {
        const resp = await api.get('v1/simrs/ranap/layanan/prasedasi/list', {
          params: { noreg: pasien?.noreg }
        })
        if (resp.status === 200) {
          this.items = resp.data || []
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    async saveData(pasien) {
      if (!pasien?.noreg) return
      this.loadingSave = true

      const payload = JSON.parse(JSON.stringify(this.form))
      payload.noreg = pasien.noreg
      payload.norm = pasien.norm
      payload.kdruang = pasien.kodepoli

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/prasedasi/simpandata', payload)
        if (resp.status === 200) {
          notifSuccess(resp)
          this.initForm()
          this.getData(pasien)
        }
        this.loadingSave = false
      } catch (error) {
        this.loadingSave = false
      }
    },

    async deleteData(pasien, val) {
      if (!val?.id) return
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/prasedasi/hapusdata', { id: val.id })
        if (resp.status === 200) {
          notifSuccess(resp)
          this.getData(pasien)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})
