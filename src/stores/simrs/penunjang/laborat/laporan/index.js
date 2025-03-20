import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useLaporanLaboratStore = defineStore('laporan_laborat', {
  state: () => ({
    loading: false,
    loadingDownload: false,
    items: [],
    groupedItems: {},
    rawData: [], // Data mentah dari API
    dailyTotals: {}, // Total per tanggal
    grandTotal: {
      laki: 0,
      perempuan: 0,
      total: 0
    },
    reportMetadata: {
      title: 'Formulir RL 3.8 Rekapitulasi Kegiatan Pelayanan Laboratorium',
      description: 'Formulir rekapitulasi Kegiatan Pelayanan Laboratorium dilaporkan bulanan dengan data yang bersumber dari Unit Laboratorium rumah sakit.',
      columns: {
        examination: 'Pemeriksaan',
        dailyCount: 'Jumlah Pemeriksaan'
      }
    },
    params: {
      from: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jenis_pasien: 'all',
      ruangan: 'all'
    },
    display: {
      from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY')
    }
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

    async getData() {
      try {
        this.loading = true
        const params = { params: this.params }
        const { data } = await api.get('/v1/simrs/penunjang/laborat/pemeriksaan-by-gender?from=2024-01-01&to=2024-01-31')
        // console.log('data', data);
        this.rawData = data?.data
        this.processData(data?.data)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
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
    },


    processData(raw) {
      // Reset data
      this.processedData = {}
      this.dailyTotals = {}
      this.grandTotal = { laki: 0, perempuan: 0, total: 0 }

      raw.forEach(item => {
        const key = `${item.kode}-${item.nama_pemeriksaan}`
        const tanggal = item.tgl_order

        // Initialize if not exists
        if (!this.processedData[key]) {
          this.processedData[key] = {
            kode: item.kode,
            nama_pemeriksaan: item.nama_pemeriksaan,
            dates: {},
            total: {
              laki: 0,
              perempuan: 0,
              total: 0
            }
          }
        }

        if (!this.dailyTotals[tanggal]) {
          this.dailyTotals[tanggal] = {
            laki: 0,
            perempuan: 0,
            total: 0
          }
        }

        // Update data per pemeriksaan
        if (!this.processedData[key].dates[tanggal]) {
          this.processedData[key].dates[tanggal] = {
            laki: item.total_laki,
            perempuan: item.total_perempuan,
            total: item.total
          }
        }

        // Update totals for this pemeriksaan
        this.processedData[key].total.laki += item.total_laki
        this.processedData[key].total.perempuan += item.total_perempuan
        this.processedData[key].total.total += item.total

        // Update daily totals
        this.dailyTotals[tanggal].laki += item.total_laki
        this.dailyTotals[tanggal].perempuan += item.total_perempuan
        this.dailyTotals[tanggal].total += item.total

        // Update grand totals
        this.grandTotal.laki += item.total_laki
        this.grandTotal.perempuan += item.total_perempuan
        this.grandTotal.total += item.total
      })

      console.log('this.processedData', this.processedData)
    },
    getDatesInRange() {
      const dates = []
      let currentDate = new Date(this.params.from)
      const endDate = new Date(this.params.to)

      while (currentDate <= endDate) {
        dates.push(date.formatDate(currentDate, 'YYYY-MM-DD'))
        currentDate = date.addToDate(currentDate, { days: 1 })
      }

      return dates
    },

    getDataForTable() {
      return Object.values(this.processedData).map(item => ({
        kode: item.kode,
        nama_pemeriksaan: item.nama_pemeriksaan,
        ...item.total
      }))
    }

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanLaboratStore, import.meta.hot))
}
