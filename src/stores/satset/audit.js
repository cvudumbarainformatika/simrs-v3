import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErr, notifSuccess } from "src/modules/utils"
import { date } from "quasar"

export const useSatsetAuditStore = defineStore("satset_audit_store", {
  state: () => ({
    loadingStats: false,
    loadingList: false,
    loadingAction: false,

    filterKategori: "all", // "all" | "PASIEN_MISMATCH_BPJS" | "PEGAWAI_NIK_KOSONG" | "PEGAWAI_UNREGISTERED_SATSET"
    filterUnit: "all", // "all" | "rajal" | "ranap" | "igd" | "kepegawaian"
    filterStatus: "all", // "all" | "PENDING" | "DIPERBAIKI" | "DIABAIKAN"
    searchQuery: "",

    tglAwal: date.formatDate(date.subtractFromDate(Date.now(), { days: 30 }), "YYYY-MM-DD"),
    tglAkhir: date.formatDate(Date.now(), "YYYY-MM-DD"),

    stats: {
      total_temuan: 0,
      total_pending: 0,
      total_diperbaiki: 0,
      total_diabaikan: 0,
      pasien_mismatch: 0,
      pegawai_nik_kosong: 0,
      pegawai_unregistered: 0
    },

    auditList: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },

    dialogDetail: false,
    selectedItem: null
  }),

  actions: {
    async initPage() {
      await Promise.all([
        this.getStats(),
        this.getList(1)
      ])
    },

    async getStats() {
      this.loadingStats = true
      try {
        const resp = await api.get("v4/satusehat/bundle/dashboard/audit-stats", {
          params: {
            tgl_awal: this.tglAwal,
            tgl_akhir: this.tglAkhir
          }
        })
        if (resp?.data?.status === "success") {
          this.stats = resp.data.stats
        }
      } catch (err) {
        console.error("Error fetching audit stats", err)
      } finally {
        this.loadingStats = false
      }
    },

    async getList(page = 1) {
      this.loadingList = true
      try {
        const resp = await api.get("v4/satusehat/bundle/dashboard/audit-list", {
          params: {
            tgl_awal: this.tglAwal,
            tgl_akhir: this.tglAkhir,
            kategori: this.filterKategori,
            unit: this.filterUnit,
            status: this.filterStatus,
            q: this.searchQuery,
            page: page,
            per_page: 20
          }
        })
        if (resp?.data?.status === "success") {
          const pagination = resp.data.data
          this.auditList = pagination.data || []
          this.meta = {
            current_page: pagination.current_page,
            last_page: pagination.last_page,
            per_page: pagination.per_page,
            total: pagination.total
          }
        }
      } catch (err) {
        console.error("Error fetching audit list", err)
      } finally {
        this.loadingList = false
      }
    },

    async updateStatus(id, status, user = "Administrator") {
      this.loadingAction = true
      try {
        const resp = await api.post("v4/satusehat/bundle/dashboard/audit-update-status", {
          id,
          status,
          user
        })
        if (resp?.data?.status === "success") {
          notifSuccess({ message: `Status berhasil diubah menjadi ${status}` })
          if (this.selectedItem && this.selectedItem.id === id) {
            this.selectedItem.status_perbaikan = status
            this.selectedItem.user_perbaikan = user
            this.selectedItem.tgl_perbaikan = new Date().toISOString()
          }
          this.getStats()
          this.getList(this.meta.current_page)
        } else {
          notifErr({ message: resp?.data?.message || "Gagal mengubah status" })
        }
      } catch (err) {
        notifErr(err)
      } finally {
        this.loadingAction = false
      }
    },

    openDetail(item) {
      this.selectedItem = item
      this.dialogDetail = true
    },

    setPeriode(awal, akhir) {
      this.tglAwal = awal
      this.tglAkhir = akhir
      this.initPage()
    },

    applyFilter() {
      this.getList(1)
    }
  }
})
