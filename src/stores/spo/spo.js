import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifErrVue } from "src/modules/utils";

export const useSpoStore = defineStore('spo-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingMore: false,
    page: 1,
    lastPage: 1,
    total: 0,
    params: {
      q: '',
      pemilik: '',
      unit: '',
    },
  }),
  actions: {
    async getList() {
      this.page = 1
      this.lastPage = 1
      this.total = 0
      this.loading = true
      try {
        const resp = await api.get('v1/spo/spo/getsoplist', {
          params: { ...this.params, page: this.page },
        })
        if (resp.status === 200) {
          this.items = Array.isArray(resp.data?.data) ? resp.data.data : []
          this.lastPage = resp.data?.last_page ?? 1
          this.total = resp.data?.total ?? this.items.length
        }
      } catch (error) {
        this.items = []
        notifErrVue(error?.response?.data?.message ?? 'Daftar SPO gagal dimuat')
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      if (this.loadingMore || this.loading || this.page >= this.lastPage) return

      this.loadingMore = true
      try {
        const nextPage = this.page + 1
        const resp = await api.get('v1/spo/spo/getsoplist', {
          params: { ...this.params, page: nextPage },
        })
        if (resp.status === 200) {
          const items = Array.isArray(resp.data?.data) ? resp.data.data : []
          this.items.push(...items)
          this.page = resp.data?.current_page ?? nextPage
          this.lastPage = resp.data?.last_page ?? this.lastPage
          this.total = resp.data?.total ?? this.total
        }
      } catch (error) {
        notifErrVue(error?.response?.data?.message ?? 'Daftar SPO berikutnya gagal dimuat')
      } finally {
        this.loadingMore = false
      }
    },
  }
})
