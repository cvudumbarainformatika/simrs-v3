import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const useLaporanSpmFarmasiStore = defineStore('laporan_spm_farmasi', {
  state: () => ({
    loadingDownload: false,
    loading: false,
    reseps: [],
    rawItems: [],
    items: [],
    meta: {},
    ketProses: null,
    params: {
      q: '',
      per_page: 10,
      page: 1,
      bulan: '03', // buat percobaan
      // bulan: date.formatDate(Date.now(), 'MM'), // aslinya
      tahun: date.formatDate(Date.now(), 'YYYY'),
      kelompok: [],
      depo: ['Gd-04010102', 'Gd-05010101', 'Gd-02010104'],
      sistem_bayar: [],
      generik: 'Semua',
      formularium: 'Semua',
    },

    groupSistembayar: '',
    tipe: 'Rinci',
    optionTipes: ['Rinci', 'Rekap'],
    bulans: [
      { nama: 'January', value: '01' },
      { nama: 'February', value: '02' },
      { nama: 'Maret', value: '03' },
      { nama: 'April', value: '04' },
      { nama: 'Mei', value: '05' },
      { nama: 'Juni', value: '06' },
      { nama: 'Juli', value: '07' },
      { nama: 'Agustus', value: '08' },
      { nama: 'September', value: '09' },
      { nama: 'Oktober', value: '10' },
      { nama: 'November', value: '11' },
      { nama: 'Desember', value: '12' }
    ],
    optionJenisLaporans: ['Generik', 'Response Time', 'Kesesuaian Obat'],
    jenisLaporan: 'Generik',
    optionGeneriks: [
      'Semua',
      'Generik',
      'Non Generik'
    ],
    optionFormulariums: [
      'Semua',
      'Fornas',
      'Forkit'
    ],
    depos: [
      { nama: 'Depo Rawat inap', value: 'Gd-04010102' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'Depo IGD', value: 'Gd-02010104' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
    ],
    optionKelompoks: [],   // ini kelompok penyimpanan di master obat
    optionSistemBayars: [],   // ini kelompok penyimpanan di master sistem bayar
    urls: [
      { nama: 'Generik', url: 'v1/simrs/laporan/farmasi/spm/laporan-generik' },
      { nama: 'Response Time', url: 'v1/simrs/laporan/farmasi/spm/laporan-response-time' },
      { nama: 'Kesesuaian Obat', url: 'v1/simrs/laporan/farmasi/spm/laporan-kesesuaian-obat' },
    ],
    url: 'v1/simrs/laporan/farmasi/spm/laporan-generik',
    progress: 0,
    fields: {},
  }),
  actions: {
    setParams (key, val) {
      this.params[key] = val
    },
    setSearch (payload) {
      this.setParams('q', payload)
      this.setParams('page', 1)
      this.getDataTable()
    },
    async getDataTable () {
      this.items = []
      this.rawItems = []
      this.reseps = []
      this.loading = true

      try {
        const worker = new Worker('/js/dataProcessor.js')

        worker.onmessage = (e) => {
          console.log('e', e?.data)

          // const { type, processedData, progress, uprocessedData } = e.data
          if (e.data?.type === 'progress') {
            this.ketProses = `Memproses data `
            // this.progress = progress
          } else if (e.data?.type === 'complete') {
            this.rawItems.push(...e.data?.processedData)
            this.reseps.push(...e.data?.unProcessedData)
            this.filterAndSetItems()
            worker.terminate()
          }
        }

        this.setParams('page', 1)
        this.meta = {
          current_page: 0,
          last_page: 5
        }
        const paramGenerik = this.params.generik
        const paramFormula = this.params.formularium
        this.setParams('generik', 'Non Generik')
        this.setParams('formularium', 'Forkit')

        // const MAX_PAGES = 10 // Batasi maksimal 10 halaman
        const DELAY = 300 // Delay 300ms antar request

        const param = { params: this.params }
        let currentPage = 1
        let totalPages = 5

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        do {
          this.ketProses = `Mengambil data halaman `
          this.progress = currentPage
          param.params.page = currentPage

          try {
            const resp = await api.get(this.url, param)

            if (!resp?.data?.data?.length) {
              if (currentPage === 1) {
                this.ketProses = null
                return notifErrVue('Data tidak ditemukan')
              }
              break
            }

            // Simpan data mentah ke reseps
            // this.reseps.push(...resp.data.data)

            // totalPages = Math.min(resp.data?.meta?.last_page || totalPages)
            totalPages = 10
            this.meta = resp.data?.meta

            const chunks = this.chunkArray(resp.data?.data, 100)
            worker.postMessage({
              chunks,
              jenisLaporan: this.jenisLaporan,
              isLastChunk: currentPage === totalPages // Tambahkan flag ini
            })

            await delay(50)

            currentPage++
            if (currentPage <= totalPages) {
              await delay(DELAY)
            }

          } catch (error) {
            console.error('Error fetching page:', currentPage, error)
            break
          }

        } while (currentPage <= totalPages)

        this.setParams('generik', paramGenerik)
        this.setParams('formularium', paramFormula)

        this.ketProses = null
        if (this.tipe === 'Rekap') {
          this.setRekapGenerik()
        }

      } catch (error) {
        console.error('Error in getDataTable:', error)
        notifErrVue('Terjadi kesalahan saat mengambil data')
      } finally {
        this.loading = false
      }
    },

    filterAndSetItems () {
      if (this.params.generik === 'Semua' && this.params.formularium === 'Semua') {
        this.items = [...this.rawItems]
      } else {
        const items = [...this.rawItems]
        this.items = items.filter(item => {
          if (this.params.generik === 'Generik') {
            return item.status_generik == '1' || item.obat_program == '1'
          } else if (this.params.generik === 'Non Generik') {
            return item.status_generik != '1'
          } else {
            return item
          }
        }).filter(item => {
          if (this.params.formularium === 'Fornas') {
            return item.status_fornas == '1'
          } else if (this.params.formularium === 'Forkit') {
            return item.status_forkit == '1' && item.status_fornas != '1'
          } else {
            return item
          }
        })
      }
      if (this.tipe === 'Rekap') {
        this.setRekapGenerik()
      }
    },

    // Helper function untuk memproses data dalam chunks
    chunkArray (array, size) {
      const chunked = []
      for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size))
      }
      return chunked
    },
    setRekapGenerik () {
      this.items = []
      const rawDates = this.reseps.map(item => date.formatDate(item.tgl_permintaan, 'YYYY-MM-DD'))
      const uniqueDates = [...new Set(rawDates)]

      uniqueDates.forEach(tangg => {
        const noreseps = this.reseps.filter(item => tangg === date.formatDate(item.tgl_permintaan, 'YYYY-MM-DD'))
        const resepnya = noreseps.map(item => item.noresep)
        const uniqueNoreseps = [...new Set(resepnya)]
        const permintaan = this.rawItems.filter(item => (tangg === date.formatDate(item.tgl, 'YYYY-MM-DD') && item.jumlah_resep > 0))
        const dilayani = this.rawItems.filter(item => (tangg === date.formatDate(item.tgl, 'YYYY-MM-DD') && item.jumlah_dilayani > 0))
        // console.log('permintaan', permintaan)

        const item = {
          tgl: tangg,
          jml_lembar_resep: uniqueNoreseps?.length,
          ditulis: {
            jml_fornas_generik: permintaan.filter(item => item.status_fornas == '1' && (item.status_generik == '1' || item.obat_program == '1'))?.length,
            jml_fornas_non_generik: permintaan.filter(item => item.status_fornas == '1' && item.status_generik != '1')?.length,
            jml_forkit_generik: permintaan.filter(item => item.status_fornas != '1' && item.status_forkit == '1' && (item.status_generik == '1' || item.obat_program == '1'))?.length,
            jml_forkit_non_generik: permintaan.filter(item => item.status_fornas != '1' && item.status_forkit == '1' && item.status_generik != '1')?.length,
            non_formulaium: permintaan.filter(item => item.status_fornas != '1' && item.status_forkit != '1' && item.status_generik != '1')?.length,
          },
          dilayani: {
            jml_fornas_generik: dilayani.filter(item => item.status_fornas == '1' && (item.status_generik == '1' || item.obat_program == '1'))?.length,
            jml_fornas_non_generik: dilayani.filter(item => item.status_fornas == '1' && item.status_generik != '1')?.length,
            jml_forkit_generik: dilayani.filter(item => item.status_fornas != '1' && item.status_forkit == '1' && (item.status_generik == '1' || item.obat_program == '1'))?.length,
            jml_forkit_non_generik: dilayani.filter(item => item.status_fornas != '1' && item.status_forkit == '1' && item.status_generik != '1')?.length,
            non_formulaium: permintaan.filter(item => item.status_fornas != '1' && item.status_forkit != '1' && item.status_generik != '1')?.length,
          },
        }
        this.items.push(item)
      })
      console.log('items', this.items)
      // console.log('rawDates', rawDates, uniqueDates, this.reseps)

    },
    async getOptionKelompok () {
      try {
        const response = await api.get('v1/simrs/laporan/farmasi/spm/get-option-kelompok')
        this.optionKelompoks = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async getOptionSistemBayar () {
      try {
        const response = await api.get('v1/simrs/laporan/farmasi/spm/get-option-sistem-bayar', { params: this.params })
        this.optionSistemBayars = response.data
      } catch (error) {
        console.error(error)
      }
    },
    setField () {
      if (this.tipe === 'Rekap') {
        this.fields = {
          No: 'no',
          'Tanggal': 'tgl',
          'Lembar Resep': 'jml_lembar_resep',
          'Ditulis Fornas Generik': 'ditulis.jml_fornas_generik',
          'Ditulis Fornas Non Generik': 'ditulis.jml_fornas_non_generik',
          'Ditulis Forkit Generik': 'ditulis.jml_forkit_generik',
          'Ditulis Forkit Non Generik': 'ditulis.jml_forkit_non_generik',
          'Ditulis Non Formulaium': 'ditulis.non_formulaium',

          'Dilayani Fornas Generik': 'dilayani.jml_fornas_generik',
          'Dilayani Fornas Non Generik': 'dilayani.jml_fornas_non_generik',
          'Dilayani Forkit Generik': 'dilayani.jml_forkit_generik',
          'Dilayani Forkit Non Generik': 'dilayani.jml_forkit_non_generik',
          'Dilayani Non Formulaium': 'dilayani.non_formulaium',
        }
      }
      else {
        this.fields = {
          No: 'no',
          'Kode Obat': 'kdobat',
          'Nama Obat': 'nama_obat',
          'Nomor Resep': 'noresep',
          'Tanggal': 'tgl',
          'Jumah Resep': 'jumlah_resep',
          'Jumlah Dilayani': 'jumlah_dilayani',
          'Kelompok Obat': 'kelompok',
          'Jenis Perbekalan': 'perbekalan',
          'Generik ?': 'generik',
          'Status Generik': 'status_generik',
          'Fornas ?': 'fornas',
          'Status Fornas': 'status_fornas',
          'Forkit ?': 'forkit',
          'Status Forkit': 'status_forkit',
          'Status Obat Program': 'obat_program',
          'Depo': 'depo',
          'Nama Dokter': 'nama_dokter',
          'Kode Sistem Bayar': 'kode_sistembayar',
          'Nama Sistem Bayar': 'nama_sistembayar'
        }
      }
    },
    fetch () {
      if (!this.items.length) {
        this.getDataTable()
      }
      this.setField()
      const data = [...this.items]
      // console.log('data', data)

      return data
    },

    startDownload () { this.loadingDownload = true },
    finishDownload () { this.loadingDownload = false },
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanSpmFarmasiStore, import.meta.hot))
}
