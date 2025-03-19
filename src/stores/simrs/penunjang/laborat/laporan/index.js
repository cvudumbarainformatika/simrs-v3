import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useLaporanLaboratStore = defineStore('laporan_laborat', {
  state: () => ({
    loading: false,
    loadingDownload: false,
    items: [],
    groupedItems: {},
    reportMetadata: {
      title: 'Formulir RL 3.8 Rekapitulasi Kegiatan Pelayanan Laboratorium',
      description: 'Formulir rekapitulasi Kegiatan Pelayanan Laboratorium dilaporkan bulanan dengan data yang bersumber dari Unit Laboratorium rumah sakit.',
      columns: {
        examination: 'Pemeriksaan',
        dailyCount: 'Jumlah Pemeriksaan'
      }
    },
  }),
  actions: {
    async getMaster() {
      try {
        this.loading = true
        const { data } = await api.get('/v1/simrs/penunjang/laborat/masterlaborat')
        this.items = data
        this.groupedItems = this.groupByJenisAndGruper(data)
        console.log('this.groupedItems', this.groupedItems)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    groupByJenisAndGruper(data) {
      // First, group by jenislab
      const groupedByJenis = data.reduce((acc, item) => {
        const jenislab = item.jenislab || 'Uncategorized'
        if (!acc[jenislab]) {
          acc[jenislab] = []
        }
        acc[jenislab].push(item)
        return acc
      }, {})

      // Then, for each jenislab group, group by gruper
      const result = Object.keys(groupedByJenis).reduce((acc, jenislab) => {
        const items = groupedByJenis[jenislab]

        // Group items by gruper
        const groupedByGruper = items.reduce((grupAcc, item) => {
          const gruper = item.gruper || 'Uncategorized'
          if (!grupAcc[gruper]) {
            grupAcc[gruper] = []
          }
          grupAcc[gruper].push(item)
          return grupAcc
        }, {})

        acc[jenislab] = groupedByGruper
        return acc
      }, {})

      return result
    },

    async downloadExcel() {
      try {
        this.loadingDownload = true
        const response = await api.get('/v1/laporan/laborat/download', {
          params: this.params,
          responseType: 'blob'
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Laporan_Laborat_${this.params.from}_${this.params.to}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        throw error
      } finally {
        this.loadingDownload = false
      }
    },
    resetParams() {
      this.params = {
        q: '',
        page: 1,
        per_page: 10,
        from: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        jenis_pasien: 'all',
        ruangan: 'all'
      }
      this.display = {
        from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
        to: date.formatDate(Date.now(), 'DD MMMM YYYY')
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanLaboratStore, import.meta.hot))
}
