import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useLaporanStokHasrianFarmasiStore = defineStore('laporan_stok_harian_farmasi', {
  state: () => ({
    loading: false,
    items: [],
    meta: {},
    params: {
      page: 1,
      per_page: 10000,
      tanggal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      // bulan: date.formatDate(Date.now(), 'MM'),
      // tahun: date.formatDate(Date.now(), 'YYYY'),
      kode_ruang: 'Gd-05010100', // Default Gudang Farmasi
      jenis: 'rekap'
    },
    // Opsi Jenis
    optionJenis: [
      { nama: 'Rekap', value: 'rekap' },
      { nama: 'Rinci / Detail', value: 'detail' }
    ],
    // Fields untuk Excel
    fields: {
      'Kode Obat': 'kd_obat',
      'Nama Obat': 'nama_obat',
      'Satuan': 'satuan_k',
      'Saldo Awal': 'awal_qty',
      'Penerimaan': 'masuk_qty',
      'Pengeluaran': 'keluar_qty',
      'Saldo Akhir': 'sisa_qty'
    },
    loadingDownload: false,
    ketProses: '', // Fallback untuk kompatibilitas UI
    loadingNext: false, // Fallback
    // Data dummy untuk opsi dropdown (nanti bisa diganti API)
    bulans: [
      { nama: 'Januari', value: '01' },
      { nama: 'Februari', value: '02' },
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
    gudangs: [
      { nama: 'Gudang Farmasi ( Floor Stok )', value: 'Gd-03010100' },
      { nama: 'DEPO FLOORSTOK', value: 'Gd-03010101' },
      { nama: 'Depo Rawat Inap', value: 'Gd-04010102' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
      { nama: 'Gudang Farmasi ( Kamar Obat )', value: 'Gd-05010100' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'DEPO IGD', value: 'Gd-02010104' }
    ],
    // Local Filters
    filters: {
      q: '',
      hasActivity: false,
      sort: {
        by: 'sisa_qty', // default sort
        dir: 'desc'
      }
    }
  }),

  getters: {
    filteredItems (state) {
      let data = state.items

      // 1. Filter by Search (Nama Obat)
      if (state.filters.q) {
        const keyword = state.filters.q.toLowerCase()
        data = data.filter(item =>
          (item.nama_obat && item.nama_obat.toLowerCase().includes(keyword)) ||
          (item.kd_obat && item.kd_obat.toLowerCase().includes(keyword))
        )
      }

      // 2. Filter by Activity
      // Definisi 'Ada Aktifitas': Saldo Awal, Masuk, Keluar, atau Akhir TIDAK 0
      if (state.filters.hasActivity) {
        data = data.filter(item => {
          const awal = parseFloat(item.awal_qty) || 0
          const masuk = parseFloat(item.masuk_qty) || 0
          const keluar = parseFloat(item.keluar_qty) || 0
          const akhir = parseFloat(item.sisa_qty) || 0

          // Jika salah satu tidak 0, berarti ada aktifitas/saldo
          return awal !== 0 || masuk !== 0 || keluar !== 0 || akhir !== 0
        })
      }

      // 3. Sorting
      if (state.filters.sort.by) {
        data = [...data].sort((a, b) => {
          const valA = parseFloat(a[state.filters.sort.by]) || 0
          const valB = parseFloat(b[state.filters.sort.by]) || 0

          if (state.filters.sort.dir === 'asc') {
            return valA - valB
          } else {
            return valB - valA
          }
        })
      }

      return data
    }
  },

  actions: {
    setParams (key, val) {
      this.params[key] = val
    },

    setPage (val) {
      this.setParams('page', val)
      this.getDataTable()
    },

    // Reset dan ambil data awal
    getInitialData () {
      this.setParams('page', 1)
      this.items = [] // Clear items untuk indikasi loading baru
      this.getDataTable()
    },

    // Fetch data utama
    async getDataTable () {
      this.loading = true
      try {
        const resp = await api.get('v1/simrs/laporan/farmasi/persediaan/get-stokopname-harian', {
          params: this.params
        })

        // Asumsi backend mengirim data yang sudah clean
        // Structure: { data: [...], meta: { ... } }
        if (resp.status === 200) {
          this.items = resp.data.data || []
          this.meta = resp.data.meta || {}
        }
      } catch (error) {
        console.error('Gagal mengambil data stok opname', error)
        this.items = []
        this.meta = {}
      } finally {
        this.loading = false
      }
    },

    // Fungsi fetch semua data untuk keperluan print/excel (tanpa pagination)
    async getAllData () {
      // Logic ini bisa disesuaikan nanti apakah mau loop page atau ada endpoint khusus 'all'
      // Untuk sekarang kita simulasi load page besar jika backend mendukung,
      // atau loop seperti sebelumnya tapi lebih bersih.
      // User minta "kenceng", idealnya backend provide endpoint tanpa paginasi atau stream.
      // Kita coba minta per_page besar dulu.
      this.loading = true
      const originalPage = this.params.page
      const originalPerPage = this.params.per_page

      try {
        this.params.page = 1
        this.params.per_page = 10000 // Coba ambil banyak sekaligus
        const resp = await api.get('v1/simrs/laporan/farmasi/persediaan/get-stokopname', {
          params: this.params
        })

        if (resp.status === 200) {
          // Return data langsung ke caller (komponen) untuk diproses/didownload
          return resp.data.data || []
        }
      } catch (error) {
        console.error('Err get all', error)
      } finally {
        // Restore params
        this.params.page = originalPage
        this.params.per_page = originalPerPage
        this.loading = false
      }
    },
    // Helper Download Excel
    async fetch () {
      // Panggil getAllData dan kembalikan hasilnya untuk vue-excel-export
      const data = await this.getAllData()
      return data || []
    },
    startDownload () {
      this.loadingDownload = true
    },
    finishDownload () {
      this.loadingDownload = false
    }
  }
})
