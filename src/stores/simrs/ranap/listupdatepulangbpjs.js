import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

export const useListUpdatePulangBpjsStore = defineStore('list-update-pulang-bpjs', {
  state: () => {
    const now = new Date()
    const currentMonth = String(now.getMonth() + 1)
    const currentYear = String(now.getFullYear())

    return {
      loading: false,
      items: [],
      meta: null,
      params: {
        bulan: currentMonth,
        tahun: currentYear,
        filter: ''
      },

      months: [
        { label: 'Januari', value: '1' },
        { label: 'Februari', value: '2' },
        { label: 'Maret', value: '3' },
        { label: 'April', value: '4' },
        { label: 'Mei', value: '5' },
        { label: 'Juni', value: '6' },
        { label: 'Juli', value: '7' },
        { label: 'Agustus', value: '8' },
        { label: 'September', value: '9' },
        { label: 'Oktober', value: '10' },
        { label: 'November', value: '11' },
        { label: 'Desember', value: '12' }
      ],

      years: Array.from({ length: 7 }, (_, i) => {
        const y = now.getFullYear() - 4 + i
        return { label: String(y), value: String(y) }
      })
    }
  },

  getters: {
    selectedMonthLabel: (state) => {
      const found = state.months.find(m => String(m.value) === String(state.params.bulan))
      return found ? found.label : state.params.bulan
    }
  },

  actions: {
    async getData() {
      this.loading = true
      try {
        const resp = await api.get('v1/simrs/ranap/layanan/pulang/list-update-pulang-bpjs', {
          params: {
            bulan: this.params.bulan,
            tahun: this.params.tahun,
            filter: this.params.filter
          }
        })

        if (resp && resp.status === 200) {
          const resData = resp.data
          if (Array.isArray(resData)) {
            this.items = resData
            this.meta = null
          } else if (resData && Array.isArray(resData.data)) {
            this.items = resData.data
            this.meta = resData.meta || resData.pagination || null
          } else if (resData && Array.isArray(resData.result)) {
            this.items = resData.result
            this.meta = null
          } else {
            this.items = []
            this.meta = null
          }
        } else {
          this.items = []
        }
      } catch (error) {
        console.error('Error fetching list update pulang BPJS:', error)
        this.items = []
      } finally {
        this.loading = false
      }
    },

    setBulan(val) {
      this.params.bulan = val
      this.getData()
    },

    setTahun(val) {
      this.params.tahun = val
      this.getData()
    },

    setFilter(val) {
      this.params.filter = val
    },

    searchData() {
      this.getData()
    },

    refresh() {
      this.getData()
    }
  }
})
