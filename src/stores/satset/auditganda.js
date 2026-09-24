import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErr, notifSuccess } from "src/modules/utils"

export const useSatsetAuditGandaStore = defineStore("satset_audit_ganda_store", {
  state: () => ({
    loadingStats: false,
    loadingList: false,
    loadingAction: false,

    kategori: "nik_ganda", // "nik_ganda" | "nama_rm_lama" | "bpjs_ganda" | "nama_tgllahir_ganda" | "nama_tgllahir_ibu_ganda"
    searchQuery: "",

    stats: {
      nik_ganda: 0,
      nama_rm_lama: 0,
      bpjs_ganda: 0,
      nama_tgllahir_ganda: 0,
      nama_tgllahir_ibu_ganda: 0,
      total_grup_terdeteksi: 0
    },

    groups: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },

    dialogDetail: false,
    selectedGroup: null
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
        const resp = await api.get("v4/satusehat/bundle/audit-ganda/stats")
        if (resp?.data?.status === "success") {
          this.stats = resp.data.data
        }
      } catch (err) {
        console.error("Error fetching audit ganda stats", err)
      } finally {
        this.loadingStats = false
      }
    },

    async getList(page = 1) {
      this.loadingList = true
      try {
        const resp = await api.get("v4/satusehat/bundle/audit-ganda/list", {
          params: {
            kategori: this.kategori,
            q: this.searchQuery,
            page: page,
            per_page: 15
          }
        })
        if (resp?.data?.status === "success") {
          const pagination = resp.data.data
          this.groups = pagination.groups || []
          this.meta = {
            current_page: pagination.current_page,
            last_page: pagination.last_page,
            per_page: pagination.per_page,
            total: pagination.total
          }
        }
      } catch (err) {
        console.error("Error fetching audit ganda list", err)
      } finally {
        this.loadingList = false
      }
    },

    async updateStatus(groupId, status, catatan = "", user = "Administrator") {
      this.loadingAction = true
      try {
        const resp = await api.post("v4/satusehat/bundle/audit-ganda/update-status", {
          group_id: groupId,
          status,
          catatan,
          user
        })
        if (resp?.data?.status === "success") {
          notifSuccess({ message: `Status berhasil dicatat: ${status}` })
          this.dialogDetail = false
          this.getList(this.meta.current_page)
        } else {
          notifErr({ message: resp?.data?.message || "Gagal mencatat status" })
        }
      } catch (err) {
        notifErr(err)
      } finally {
        this.loadingAction = false
      }
    },

    setKategori(kategori) {
      this.kategori = kategori
      this.searchQuery = ""
      this.getList(1)
    },

    openDetail(group) {
      this.selectedGroup = group
      this.dialogDetail = true
    }
  }
})
