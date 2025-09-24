import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const useLaporanEvaluasiResepStore = defineStore('laporan_evaluasi_resep', {
  state: () => ({

    loading: false,
    loadingNext: false,
    scrolling: false,
    loadingDownload: false,
    ketProses: null,
    items: [],
    meta: {},
    disp: {
      from: date.formatDate(Date.now(), '01 MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    params: {
      q: '',
      per_page: 100,
      page: 1,
      from: date.formatDate(Date.now(), 'YYYY-MM-01'),
      to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jenis: 'detail',
      tipe: 'noreg',
      depo: 'all',
    },

    types: [
      { nama: 'Lebih dari 5 item', value: 'item' },
      { nama: 'Lebih dari satu resep', value: 'noreg' },
    ],
    optionJenis: [
      { nama: 'Detail', value: 'detail' },
      { nama: 'Rekap', value: 'rekap' }
    ],
    gudangs: [
      { nama: 'Semua', value: 'all' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'Depo IGD', value: 'Gd-02010104' }
    ],
    fields: {}
  }),
  actions: {
    setParams (key, val) {
      this.params[key] = val
    },

    setSearch (payload) {
      console.log(this.params.q)
      // this.setParams('q', payload)
      this.items = []
      this.setParams('page', 1)
      this.getDataTable()
    },
    setPage (payload) {
      this.setParams('page', payload)
      this.getNextDataTable()
    },
    setPerPage (payload) {
      this.setParams('per_page', payload)
      this.setParams('page', 1)
      this.getDataTable()
    },
    refreshTable () {
      this.setParams('page', 1)
      this.getDataTable()
    },
    getInitialData (val) {
      this.ketProses = null
      this.setParams('page', val)
      this.getDataTable()
      this.meta = {}
      this.items = []
    },
    async getAllData (val) {
      const param = { params: this.params }
      let items = []


      this.ketProses = 'Mengambil data halaman '

      this.meta = {
        current_page: 0,
        last_page: 5
      }
      let currentPage = this.meta?.current_page + 1 ?? 1
      let totalPages = this.meta?.last_page ?? 5
      do {
        param.params.page = currentPage // Tambahkan parameter halaman
        const resp = await api.get('v1/simrs/laporan/farmasi/evaluasi/get-data', param)
        if (!resp?.data?.data?.length) {
          if (currentPage === 1) {
            this.ketProses = null
            return notifErrVue('Data tidak ditemukan')
          }
          break
        }
        this.ketProses = 'Mengambil data halaman '
        totalPages = resp.data?.meta?.last_page || totalPages // Total halaman dari API
        this.meta = resp.data?.meta
        // this.mapingItem(resp?.data?.data, items,)
        if (this.meta?.current_page == 1) {
          items = resp?.data?.data
        } else {
          items.push(...resp?.data?.data)
        }

        currentPage++
        // console.log('anu', currentPage, this.meta)
        // this.setParams('page', currentPage)
      } while (currentPage <= totalPages)
      this.ketProses = null
      this.items = items
    },
    async getDataTable (val) {
      this.ketProses = null
      this.loading = true
      const param = { params: this.params }
      await api.get('v1/simrs/laporan/farmasi/evaluasi/get-data', param)
        .then(resp => {
          setTimeout(() => {
            // this.scrolling = false
          }, 1000)
          this.loading = false
          this.loadingNext = false
          this.meta = resp.data?.meta
          this.items = resp?.data?.data
          // console.log('data tabel', this.items)
          console.log('data tabel', resp?.data)
        })
        .catch(() => {
          this.loading = false
          this.loadingNext = false
        })
    },
    async getNextDataTable (val) {
      this.ketProses = null
      this.loadingNext = true
      this.scrolling = true
      const param = { params: this.params }
      await api.get('v1/simrs/laporan/farmasi/evaluasi/get-data', param)
        .then(resp => {
          this.scrolling = false
          this.loadingNext = false
          this.meta = resp.data?.meta
          const next = [...this.items, ...resp?.data?.data]
          this.items = next
        })
        .catch(() => {
          this.loading = false
          this.loadingNext = false
        })
    },
    setField () {
      if (this.params.tipe == 'noreg') {
        if (this.params.jenis === 'rekap') {
          this.fields = {
            No: 'no',
            Noreg: 'noreg',
            Poli: 'poli',
            Dokter: 'dokter',
            'Jumlah Resep': 'total_resep',
          }
        }
        else {
          this.fields = {
            No: 'no',
            Noreg: 'noreg',
            Poli: 'poli',
            Dokter: 'dokter',
            'Nomor Resep': 'noresep',
            'Tanggal Resep': 'tgl_permintaan',
            'Nama Obat': 'nama_obat',
            'Jumlah Obat': 'jumlah',
          }
        }
      } else {
        if (this.params.jenis === 'rekap') {
          this.fields = {
            No: 'no',
            Noreg: 'noreg',
            'Nomor Resep': 'noresep',
            'Tanggal Resep': 'tgl_permintaan',
            Poli: 'poli',
            Dokter: 'dokter',
            'Jumlah Item': 'total_item',
          }
        }
        else {
          this.fields = {
            No: 'no',
            Noreg: 'noreg',
            Poli: 'poli',
            Dokter: 'dokter',
            'Nomor Resep': 'noresep',
            'Tanggal Resep': 'tgl_permintaan',
            'Kode Obat': 'kdobat',
            'Nama Obat': 'nama_obat',
            'Jumlah Resep': 'jumlah_resep',
            'Jumlah Diberikan': 'jumlah_diberikan',
          }
        }
      }
    },
    async fetch () {
      // laravel throttle 180 ms
      if (this.meta.to != this.meta.total) return this.getAllData()
      this.setField()
      const items = [...this.items]
      let data = []
      if (this.params.jenis === 'rekap') {
        data = [...this.items]
        data.forEach((item, i) => {
          item.no = i + 1
        })
      } else {
        items.forEach((item, i) => {
          if (item?.detail?.length) {
            item?.detail.forEach((dat, d) => {
              const ada = {}
              if (d === 0) {
                ada.no = i + 1
                ada.noreg = item?.noreg
                ada.poli = item?.poli
                ada.dokter = item?.dokter
                ada.noresep = item?.noresep
                ada.tgl_permintaan = item?.tgl_permintaan

                ada.nama_obat = dat?.mobat?.nama_obat
                ada.kdobat = dat?.kdobat
                ada.jumlah = dat?.jumlah
                ada.jumlah_resep = dat?.jumlah_resep
                ada.jumlah_diberikan = dat?.jumlah_diberikan
                // console.log('d', ada, item)

              } else {

                ada.nama_obat = dat?.mobat?.nama_obat
                ada.kdobat = dat?.kdobat
                ada.jumlah = dat?.jumlah
                ada.jumlah_resep = dat?.jumlah_resep
                ada.jumlah_diberikan = dat?.jumlah_diberikan
              }
              data.push(ada)

            })
          }
          else {
            console.log('ada tidak')
            const temp = {}
            temp.no = i + 1
            temp.noreg = item?.noreg
            temp.poli = item?.poli
            temp.dokter = item?.dokter
            temp.noresep = item?.noresep
            temp.tgl_permintaan = item?.tgl_permintaan

            // const indexAda = data.findIndex(f => f.kd_obat === item?.kd_obat)
            // if (indexAda >= 0) data[indexAda] = temp
            // else data.push(temp)
            data.push(temp)

          }
        })

      }

      console.log('items', data)
      this.ketProses = null
      this.items = [...items]
      return data
    },
    startDownload () { this.loadingDownload = true },
    finishDownload () { this.loadingDownload = false },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanEvaluasiResepStore, import.meta.hot))
}
