import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useBillingRanapStore = defineStore('billing-ranap-store', {
  state: () => ({
    loading: false,
    billingData: null,
    loadingFakturDetail: false,
    fakturDetailData: null,
    filter: {
      flagruangan: null,
      flagsistembayar: null,
      flagruangankelas: null
    }
  }),
  actions: {
    async getRekapBilling(pasien, customFilter = {}) {
      if (!pasien?.noreg) return
      this.loading = true

      const params = {
        noreg: pasien?.noreg,
        flagruangan: customFilter.flagruangan || undefined,
        flagsistembayar: customFilter.flagsistembayar || undefined,
        flagruangankelas: customFilter.flagruangankelas || undefined
      }

      try {
        const resp = await api.get('/v1/simrs/ranap/layanan/billing/rekap-billing', { params })
        if (resp.status === 200) {
          this.billingData = resp.data?.result || null
        }
      } catch (error) {
        console.error('Gagal mengambil data rekap billing ranap:', error)
      } finally {
        this.loading = false
      }
    },

    async getFakturDetail(pasien) {
      if (!pasien?.noreg) return
      this.loadingFakturDetail = true

      const params = {
        noreg: pasien?.noreg
      }

      try {
        const resp = await api.get('/v1/simrs/ranap/layanan/billing/faktur-detail', { params })
        if (resp.status === 200) {
          this.fakturDetailData = resp.data?.result || null
        }
      } catch (error) {
        console.error('Gagal mengambil data faktur detail ranap:', error)
      } finally {
        this.loadingFakturDetail = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBillingRanapStore, import.meta.hot))
}
