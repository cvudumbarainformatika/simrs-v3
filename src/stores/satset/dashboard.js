import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErr, notifSuccess } from 'src/modules/utils'
import { date } from 'quasar'

export const useSatsetDashboardStore = defineStore('satset_dashboard_store', {
  state: () => ({
    loadingSummary: false,
    loadingResource: false,
    loadingErrorStats: false,
    loadingListKunjungan: false,
    loadingListError: false,
    loadingDetail: false,
    loadingRetry: false,

    activeTab: 'kunjungan', // 'kunjungan' | 'error' | 'resources'
    filterJenis: 'all', // 'all' | 'rajal' | 'ranap' | 'igd'

    tglAwal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    tglAkhir: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    searchQuery: '',
    searchQueryError: '',

    summary: {
      total_kunjungan: 0,
      total_terkirim: 0,
      total_error: 0,
      compliance_rate: '0%'
    },
    detailModul: {
      rajal: { total_kunjungan: 0, terkirim: 0, error: 0, rate: '0%' },
      ranap: { total_kunjungan: 0, terkirim: 0, error: 0, rate: '0%' },
      igd: { total_kunjungan: 0, terkirim: 0, error: 0, rate: '0%' }
    },

    resourceStats: [],
    totalResourceTerkirim: 0,
    totalTransaksiBundle: 0,

    topErrors: [],

    kunjunganList: [],
    kunjunganMeta: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },

    errorList: [],
    errorMeta: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },

    dialogDetail: false,
    selectedKunjunganDetail: null
  }),

  actions: {
    async initDashboard() {
      await Promise.all([
        this.getSummary(),
        this.getResourceStats(),
        this.getErrorStats(),
        this.getListKunjungan(1),
        this.getListError(1)
      ])
    },

    async getSummary() {
      this.loadingSummary = true
      try {
        const resp = await api.get('v4/satusehat/bundle/dashboard/summary', {
          params: {
            tgl_awal: this.tglAwal,
            tgl_akhir: this.tglAkhir
          }
        })
        if (resp?.data?.status === 'success') {
          this.summary = resp.data.summary
          this.detailModul = resp.data.detail_modul
        }
      } catch (err) {
        console.error('Error fetching satset summary', err)
      } finally {
        this.loadingSummary = false
      }
    },

    async getResourceStats() {
      this.loadingResource = true
      try {
        const resp = await api.get('v4/satusehat/bundle/dashboard/resource-stats', {
          params: {
            tgl_awal: this.tglAwal,
            tgl_akhir: this.tglAkhir,
            jenis: this.filterJenis
          }
        })
        if (resp?.data?.status === 'success') {
          this.resourceStats = resp.data.detail_resource || []
          this.totalResourceTerkirim = resp.data.total_resource_terkirim || 0
          this.totalTransaksiBundle = resp.data.total_transaksi_bundle || 0
        }
      } catch (err) {
        console.error('Error fetching resource stats', err)
      } finally {
        this.loadingResource = false
      }
    },

    async getErrorStats() {
      this.loadingErrorStats = true
      try {
        const resp = await api.get('v4/satusehat/bundle/dashboard/error-stats', {
          params: {
            tgl_awal: this.tglAwal,
            tgl_akhir: this.tglAkhir,
            jenis: this.filterJenis
          }
        })
        if (resp?.data?.status === 'success') {
          this.topErrors = resp.data.top_errors || []
        }
      } catch (err) {
        console.error('Error fetching error stats', err)
      } finally {
        this.loadingErrorStats = false
      }
    },

    async getListKunjungan(page = 1) {
      this.loadingListKunjungan = true
      try {
        const resp = await api.get('v4/satusehat/bundle/dashboard/list-kunjungan', {
          params: {
            tgl_awal: this.tglAwal,
            tgl_akhir: this.tglAkhir,
            jenis: this.filterJenis,
            q: this.searchQuery,
            page: page,
            per_page: 20
          }
        })
        if (resp?.data?.status === 'success') {
          const pagination = resp.data.data
          this.kunjunganList = pagination.data || []
          this.kunjunganMeta = {
            current_page: pagination.current_page,
            last_page: pagination.last_page,
            per_page: pagination.per_page,
            total: pagination.total
          }
        }
      } catch (err) {
        console.error('Error fetching list kunjungan', err)
      } finally {
        this.loadingListKunjungan = false
      }
    },

    async getListError(page = 1) {
      this.loadingListError = true
      try {
        const resp = await api.get('v4/satusehat/bundle/dashboard/list-error', {
          params: {
            tgl_awal: this.tglAwal,
            tgl_akhir: this.tglAkhir,
            jenis: this.filterJenis,
            q: this.searchQueryError,
            page: page,
            per_page: 20
          }
        })
        if (resp?.data?.status === 'success') {
          const pagination = resp.data.data
          this.errorList = pagination.data || []
          this.errorMeta = {
            current_page: pagination.current_page,
            last_page: pagination.last_page,
            per_page: pagination.per_page,
            total: pagination.total
          }
        }
      } catch (err) {
        console.error('Error fetching list error', err)
      } finally {
        this.loadingListError = false
      }
    },

    async getDetailKunjungan(noreg) {
      this.loadingDetail = true
      this.dialogDetail = true
      this.selectedKunjunganDetail = null
      try {
        const resp = await api.get('v4/satusehat/bundle/dashboard/detail-kunjungan', {
          params: { noreg }
        })
        if (resp?.data?.status === 'success') {
          this.selectedKunjunganDetail = resp.data
        }
      } catch (err) {
        notifErr(err)
      } finally {
        this.loadingDetail = false
      }
    },

    async retryKirim(noreg, jenis) {
      this.loadingRetry = true
      try {
        const resp = await api.post('v4/satusehat/bundle/dashboard/retry', {
          noreg,
          jenis
        })
        if (resp?.data?.status === 'success') {
          notifSuccess({ message: `Berhasil memproses kirim ulang no. reg ${noreg}` })
          // Refresh data
          this.getSummary()
          this.getResourceStats()
          this.getErrorStats()
          this.getListKunjungan(this.kunjunganMeta.current_page)
          this.getListError(this.errorMeta.current_page)
        } else {
          notifErr({ message: resp?.data?.message || 'Gagal mengirim ulang data' })
        }
      } catch (err) {
        notifErr(err)
      } finally {
        this.loadingRetry = false
      }
    },

    setPeriode(awal, akhir) {
      this.tglAwal = awal
      this.tglAkhir = akhir
      this.initDashboard()
    },

    setFilterJenis(val) {
      this.filterJenis = val
      this.getResourceStats()
      this.getErrorStats()
      this.getListKunjungan(1)
      this.getListError(1)
    }
  }
})
