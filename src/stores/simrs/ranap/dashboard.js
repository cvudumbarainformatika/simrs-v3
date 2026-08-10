import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

export const useDashboardRanapStore = defineStore('dashboard-ranap', {
  state: () => ({
    loading: false,
    from: date.formatDate(new Date(), 'YYYY-MM-01'),
    to: date.formatDate(new Date(), 'YYYY-MM-DD'),
    koderuangan: '',
    ruangans: [],

    summary: {
      pasien_aktif: 0,
      pasien_masuk: 0,
      pasien_pulang: 0,
      total_bed: 0,
      bed_terisi: 0,
      bed_sisa: 0,
      bor_percent: 0
    },

    keterisian_ruangan: [],
    sistem_bayar: [],
    dpjp: [],
    cara_pulang: [],
    indikator_risiko: {
      berisiko_kekerasan: 0,
      resiko_jatuh: 0,
      penolakan_resusitasi: 0,
      pasien_mpp: 0,
      alergis: 0
    },
    tren_kunjungan: []
  }),

  actions: {
    async getRuangan() {
      try {
        const resp = await api.get('v1/simrs/ranap/ruangan/listruanganranap')
        if (resp?.data) {
          this.ruangans = Array.isArray(resp.data) ? resp.data : (resp.data.data || [])
        }
      } catch (err) {
        console.error('Error fetching list ruangan ranap:', err)
      }
    },

    async getData() {
      this.loading = true
      try {
        const params = {
          from: this.from,
          to: this.to,
          koderuangan: this.koderuangan || ''
        }
        const resp = await api.get('v1/simrs/ranap/ruangan/dashboard', { params })
        if (resp?.data?.status === 200 || resp?.data) {
          const data = resp.data
          this.summary = data.summary || this.summary
          this.keterisian_ruangan = data.keterisian_ruangan || []
          this.sistem_bayar = data.sistem_bayar || []
          this.dpjp = data.dpjp || []
          this.cara_pulang = data.cara_pulang || []
          this.indikator_risiko = data.indikator_risiko || this.indikator_risiko
          this.tren_kunjungan = data.tren_kunjungan || []
        }
      } catch (err) {
        console.error('Error fetching dashboard ranap:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
