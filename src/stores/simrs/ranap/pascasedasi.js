import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { date } from 'quasar'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'

export const usePascaSedasiRanapStore = defineStore('pasca-sedasi-ranap-store', {
  state: () => ({
    form: {
      id: null,
      noreg: null,
      norm: null,
      kdruang: null,
      kddokter: null,
      dokter: null,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),

      // 1. INFORMASI PROSEDUR & INTRA SEDASI (NAMA RINGKAS)
      diagnosa: null,
      prosedur: null,
      kd_operator: null,
      operator: null,
      tgl_prosedur: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      alergi: null,
      asa: '1',
      mallampati: '1',
      rencana_sedasi: 'Sedang',
      dokter_sedasi: null,
      kd_asisten: null,
      asisten: null,
      jam_mulai: date.formatDate(Date.now(), 'HH:mm'),
      jam_selesai: null,
      monitoring: ['SpO2', 'NIBP'],
      monitoring_lain: null,

      // 2. ASSESMEN PRA SEDASI AWAL
      jam_pra: date.formatDate(Date.now(), 'HH:mm'),
      fr_pra: null,
      spo2_pra: null,
      nadi_pra: null,
      td_pra: null,
      gcs_pra: null,
      suhu_pra: null,

      // 3. CHECKLIST PERSIAPAN & AKSES VENA
      checklist: ['PersetujuanTindakanMedis', 'PenilaianPraSedasi', 'PerlengkapanEmergensi', 'ObatObatSedasi'],
      jam_puasa: null,
      akses_iv: 'Tangan kanan dengan IV line no. 20',

      // 4. PEMANTAUAN SELAMA PROSEDUR (TIME SERIES)
      monitoring_intra: [
        {
          waktu: date.formatDate(Date.now(), 'HH:mm'),
          obat_sedasi: '',
          spo2: 98,
          nadi: 80,
          sis: 120,
          dis: 80,
          suhu: null,
          fr: 18,
          derajat_sedasi: 2
        }
      ],

      // 5. PEMANTAUAN PASCA SEDASI (RUANG PULIH) & ALDRETE
      jam_pulih: date.formatDate(Date.now(), 'HH:mm'),
      aldrete_kesadaran: 2,
      aldrete_pernafasan: 2,
      aldrete_tensi: 2,
      aldrete_pergerakan: 2,
      aldrete_warna_kulit: 2,
      total_aldrete: 10,
      catatan: null,

      // 6. KRITERIA DISCHARGE
      skor_discharge: 10,
      nyeri_vas: '0',
      mual_muntah: 'Tidak Ada',
      perdarahan: 'Tidak Ada',
      ambulasi: 'Mandiri',
      keputusan: 'Dipulangkan',
      jam_keluar: null,

      // 7. INSTRUKSI PASCA SEDASI
      instruksi_obat: null,
      instruksi_mobilisasi: null,
      instruksi_diet: null,
      instruksi_edukasi: null,
      instruksi_lain: null
    },

    loading: false,
    loadingSave: false,
    items: [],
    dokters: [],
    nakes: []
  }),

  getters: {
    totalSkorAldrete: (state) => {
      const f = state.form
      return (
        Number(f.aldrete_kesadaran || 0) +
        Number(f.aldrete_pernafasan || 0) +
        Number(f.aldrete_tensi || 0) +
        Number(f.aldrete_pergerakan || 0) +
        Number(f.aldrete_warna_kulit || 0)
      )
    }
  },

  actions: {
    async getNakes() {
      if (this.nakes && this.nakes.length > 0) {
        return
      }

      const pengunjung = usePengunjungRanapStore()
      if (pengunjung?.nakes && pengunjung.nakes.length > 0) {
        this.nakes = pengunjung.nakes
        this.dokters = pengunjung.nakes.filter(x => x?.kdgroupnakes === '1')
        return
      }

      try {
        const resp = await api.get('v1/simrs/penunjang/surgical/get-nakes')
        const data = resp?.data?.data ?? resp?.data ?? []
        if (data && data.length > 0) {
          this.nakes = data
          this.dokters = data.filter(x => x?.kdgroupnakes === '1')
        }
      } catch (e) {
        console.error('Error fetching nakes in pascasedasi store:', e)
      }
    },

    resetForm(pasien = null) {
      this.form = {
        id: null,
        noreg: pasien?.noreg || null,
        norm: pasien?.norm || null,
        kdruang: pasien?.kdruang || null,
        kddokter: pasien?.kddokter || null,
        dokter: pasien?.dokter || null,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),

        diagnosa: null,
        prosedur: null,
        kd_operator: null,
        operator: null,
        tgl_prosedur: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        alergi: null,
        asa: '1',
        mallampati: '1',
        rencana_sedasi: 'Sedang',
        dokter_sedasi: null,
        kd_asisten: null,
        asisten: null,
        jam_mulai: date.formatDate(Date.now(), 'HH:mm'),
        jam_selesai: null,
        monitoring: ['SpO2', 'NIBP'],
        monitoring_lain: null,

        jam_pra: date.formatDate(Date.now(), 'HH:mm'),
        fr_pra: null,
        spo2_pra: null,
        nadi_pra: null,
        td_pra: null,
        gcs_pra: null,
        suhu_pra: null,

        checklist: ['PersetujuanTindakanMedis', 'PenilaianPraSedasi', 'PerlengkapanEmergensi', 'ObatObatSedasi'],
        jam_puasa: null,
        akses_iv: 'Tangan kanan dengan IV line no. 20',

        monitoring_intra: [
          {
            waktu: date.formatDate(Date.now(), 'HH:mm'),
            obat_sedasi: '',
            spo2: 98,
            nadi: 80,
            sis: 120,
            dis: 80,
            fr: 18,
            derajat_sedasi: 2
          }
        ],

        jam_pulih: date.formatDate(Date.now(), 'HH:mm'),
        monitoring_pasca: [
          {
            waktu: date.formatDate(Date.now(), 'HH:mm'),
            spo2: 98,
            nadi: 80,
            sis: 120,
            dis: 80,
            fr: 18
          }
        ],
        aldrete_kesadaran: 2,
        aldrete_pernafasan: 2,
        aldrete_tensi: 2,
        aldrete_pergerakan: 2,
        aldrete_warna_kulit: 2,
        total_aldrete: 10,
        catatan: null,

        skor_discharge: 10,
        nyeri_vas: '0',
        mual_muntah: 'Tidak Ada',
        perdarahan: 'Tidak Ada',
        ambulasi: 'Mandiri',
        keputusan: 'Dipulangkan',
        jam_keluar: null,

        instruksi_obat: null,
        instruksi_mobilisasi: null,
        instruksi_diet: null,
        instruksi_edukasi: null,
        instruksi_lain: null
      }
    },

    editData(item) {
      if (!item) return

      let parsedMonitoring = item.monitoring
      if (typeof parsedMonitoring === 'string') {
        try { parsedMonitoring = JSON.parse(parsedMonitoring) } catch (e) { parsedMonitoring = ['SpO2', 'NIBP'] }
      }
      let parsedChecklist = item.checklist
      if (typeof parsedChecklist === 'string') {
        try { parsedChecklist = JSON.parse(parsedChecklist) } catch (e) { parsedChecklist = [] }
      }
      let parsedMonitoringIntra = item.monitoring_intra
      if (typeof parsedMonitoringIntra === 'string') {
        try { parsedMonitoringIntra = JSON.parse(parsedMonitoringIntra) } catch (e) { parsedMonitoringIntra = [] }
      }
      if (!Array.isArray(parsedMonitoringIntra) || parsedMonitoringIntra.length === 0) {
        parsedMonitoringIntra = [
          {
            waktu: date.formatDate(Date.now(), 'HH:mm'),
            obat_sedasi: '',
            spo2: 98,
            nadi: 80,
            sis: 120,
            dis: 80,
            fr: 18,
            derajat_sedasi: 2
          }
        ]
      }

      let parsedMonitoringPasca = item.monitoring_pasca
      if (typeof parsedMonitoringPasca === 'string') {
        try { parsedMonitoringPasca = JSON.parse(parsedMonitoringPasca) } catch (e) { parsedMonitoringPasca = [] }
      }
      if (!Array.isArray(parsedMonitoringPasca) || parsedMonitoringPasca.length === 0) {
        if (item.catatan) {
          try {
            const cDec = JSON.parse(item.catatan)
            if (cDec && cDec.monitoring_pasca) {
              parsedMonitoringPasca = cDec.monitoring_pasca
            }
          } catch (e) {}
        }
      }
      if (!Array.isArray(parsedMonitoringPasca) || parsedMonitoringPasca.length === 0) {
        parsedMonitoringPasca = [
          {
            waktu: item.jam_pulih || date.formatDate(Date.now(), 'HH:mm'),
            spo2: 98,
            nadi: 80,
            sis: 120,
            dis: 80,
            fr: 18
          }
        ]
      }

      this.form = {
        id: item.id || null,
        noreg: item.noreg || null,
        norm: item.norm || null,
        kdruang: item.kdruang || null,
        kddokter: item.kddokter || null,
        dokter: item.dokter || null,
        tgl: item.tgl || date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),

        diagnosa: item.diagnosa || null,
        prosedur: item.prosedur || item.nama_prosedur || null,
        kd_operator: item.kd_operator || item.kd_pelaku_prosedur || null,
        operator: item.operator || item.pelaku_prosedur || null,
        tgl_prosedur: item.tgl_prosedur || date.formatDate(Date.now(), 'YYYY-MM-DD'),
        alergi: item.alergi || item.riwayat_alergi || null,
        asa: item.asa || item.asa_class || '1',
        mallampati: item.mallampati || item.skor_mallampati || '1',
        rencana_sedasi: item.rencana_sedasi || 'Sedang',
        dokter_sedasi: item.dokter_sedasi || item.pelaku_sedasi || item.dokter || null,
        kd_asisten: item.kd_asisten || item.kd_asisten_sedasi || null,
        asisten: item.asisten || item.asisten_sedasi || null,
        jam_mulai: item.jam_mulai || item.jam_mulai_sedasi || date.formatDate(Date.now(), 'HH:mm'),
        jam_selesai: item.jam_selesai || item.jam_selesai_sedasi || null,
        monitoring: parsedMonitoring || ['SpO2', 'NIBP'],
        monitoring_lain: item.monitoring_lain || null,

        jam_pra: item.jam_pra || item.assesmen_pra_sedasi_jam || date.formatDate(Date.now(), 'HH:mm'),
        fr_pra: item.fr_pra || item.assesmen_pra_sedasi_fr || null,
        spo2_pra: item.spo2_pra || item.assesmen_pra_sedasi_spo2 || null,
        nadi_pra: item.nadi_pra || item.assesmen_pra_sedasi_nadi || null,
        td_pra: item.td_pra || item.assesmen_pra_sedasi_td || null,
        gcs_pra: item.gcs_pra || item.assesmen_pra_sedasi_gcs || null,
        suhu_pra: item.suhu_pra || item.assesmen_pra_sedasi_suhu || null,

        checklist: parsedChecklist || [],
        jam_puasa: item.jam_puasa || item.puasa_npo_mulai_jam || null,
        akses_iv: item.akses_iv || item.akses_intra_vena || 'Tangan kanan dengan IV line no. 20',

        monitoring_intra: parsedMonitoringIntra,

        jam_pulih: item.jam_pulih || item.jam_masuk_ruang_pulih || date.formatDate(Date.now(), 'HH:mm'),
        monitoring_pasca: parsedMonitoringPasca,
        aldrete_kesadaran: Number(item.aldrete_kesadaran ?? 2),
        aldrete_pernafasan: Number(item.aldrete_pernafasan ?? 2),
        aldrete_tensi: Number(item.aldrete_tensi ?? 2),
        aldrete_pergerakan: Number(item.aldrete_pergerakan ?? 2),
        aldrete_warna_kulit: Number(item.aldrete_warna_kulit ?? 2),
        total_aldrete: Number(item.total_aldrete ?? 10),
        catatan: item.catatan || item.aldrete_catatan || null,

        skor_discharge: Number(item.skor_discharge ?? item.total_aldrete ?? 10),
        nyeri_vas: String(item.nyeri_vas ?? item.nyeri_vas_discharge ?? '0'),
        mual_muntah: item.mual_muntah || 'Tidak Ada',
        perdarahan: item.perdarahan || 'Tidak Ada',
        ambulasi: item.ambulasi || 'Mandiri',
        keputusan: item.keputusan || item.keputusan_discharge || 'Dipulangkan',
        jam_keluar: item.jam_keluar || item.jam_keluar_ruang_pulih || null,

        instruksi_obat: item.instruksi_obat || null,
        instruksi_mobilisasi: item.instruksi_mobilisasi || null,
        instruksi_diet: item.instruksi_diet || item.instruksi_diet_nutrisi || null,
        instruksi_edukasi: item.instruksi_edukasi || item.instruksi_edukasi_followup || null,
        instruksi_lain: item.instruksi_lain || null
      }
    },

    addMonitoringRow() {
      const last = this.form.monitoring_intra[this.form.monitoring_intra.length - 1]
      this.form.monitoring_intra.push({
        waktu: date.formatDate(Date.now(), 'HH:mm'),
        obat_sedasi: '',
        spo2: last ? last.spo2 : 98,
        nadi: last ? last.nadi : 80,
        sis: last ? last.sis : 120,
        dis: last ? last.dis : 80,
        suhu: last ? last.suhu : null,
        fr: last ? last.fr : 18,
        derajat_sedasi: last ? last.derajat_sedasi : 2
      })
    },

    removeMonitoringRow(idx) {
      if (this.form.monitoring_intra.length > 1) {
        this.form.monitoring_intra.splice(idx, 1)
      }
    },

    addMonitoringPascaRow() {
      if (!Array.isArray(this.form.monitoring_pasca)) {
        this.form.monitoring_pasca = []
      }
      const last = this.form.monitoring_pasca[this.form.monitoring_pasca.length - 1]
      let nextTime = date.formatDate(Date.now(), 'HH:mm')
      if (last && last.waktu) {
        try {
          const parts = last.waktu.split(':')
          if (parts.length === 2) {
            let h = parseInt(parts[0], 10)
            let m = parseInt(parts[1], 10) + 15
            if (m >= 60) {
              h = (h + Math.floor(m / 60)) % 24
              m = m % 60
            }
            nextTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          }
        } catch (e) {}
      }
      this.form.monitoring_pasca.push({
        waktu: nextTime,
        spo2: last ? last.spo2 : 98,
        nadi: last ? last.nadi : 80,
        sis: last ? last.sis : 120,
        dis: last ? last.dis : 80,
        fr: last ? last.fr : 18
      })
    },

    removeMonitoringPascaRow(idx) {
      if (this.form.monitoring_pasca.length > 1) {
        this.form.monitoring_pasca.splice(idx, 1)
      }
    },

    async getData(pasien = null) {
      if (!pasien?.noreg) return
      this.loading = true
      await this.getNakes()

      try {
        const resp = await api.get('/v1/simrs/ranap/layanan/pascasedasi/get', {
          params: { noreg: pasien.noreg }
        })
        if (resp.status === 200 && resp.data) {
          const raw = resp.data.data !== undefined ? resp.data.data : resp.data
          const fetched = Array.isArray(raw) ? raw : (raw ? [raw] : [])
          this.items = fetched
        } else {
          this.items = []
        }
      } catch (err) {
        console.error('Error fetching status sedasi:', err)
        this.items = []
      } finally {
        this.loading = false
      }
    },

    async saveData(pasien = null) {
      this.loadingSave = true
      try {
        this.form.noreg = pasien?.noreg || this.form.noreg
        this.form.norm = pasien?.norm || this.form.norm
        this.form.kdruang = pasien?.kdruang || this.form.kdruang
        this.form.kddokter = pasien?.kddokter || this.form.kddokter
        this.form.dokter = pasien?.dokter || this.form.dokter
        this.form.total_aldrete = this.totalSkorAldrete
        this.form.skor_discharge = this.totalSkorAldrete

        const resp = await api.post('/v1/simrs/ranap/layanan/pascasedasi/store', this.form)
        if (resp.status === 200 || resp.status === 201) {
          notifSuccess('Data Status Sedasi berhasil disimpan')
          await this.getData(pasien)
          this.resetForm(pasien)
          return true
        }
      } catch (err) {
        notifErrVue(err?.response?.data?.message || 'Gagal menyimpan data Status Sedasi')
        return false
      } finally {
        this.loadingSave = false
      }
    },

    async deleteData(id, pasien = null) {
      try {
        await api.post('/v1/simrs/ranap/layanan/pascasedasi/destroy', { id })
        notifSuccess('Data Status Sedasi berhasil dihapus')
        await this.getData(pasien)
      } catch (err) {
        notifErrVue(err?.response?.data?.message || 'Gagal menghapus data')
      }
    }
  }
})
