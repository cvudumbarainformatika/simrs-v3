import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const useLaporanPemakaianFloorStokStore = defineStore('laporan_pemakaian_floor_stok', {
  state: () => ({
    loading: false,
    loadingNext: false,
    scrolling: false,
    loadingDownload: false,
    items: [],
    meta: {},
    ketProses: null,
    params: {
      q: '',
      per_page: 100,
      page: 1,
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
      kode_ruang: 'all',
    },
    ruangs: [{ kode: 'all', uraian: 'Semua' }],
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
    fields: {},
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
      this.getDataTable()
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
      this.setParams('action', '')
      this.getDataTable()
      this.getRuangans()
      this.meta = {}
      this.items = []
    },
    async getRuangans () {
      const { data } = await api.get('v1/simrs/laporan/farmasi/pemakaian-ruangan/get-ruangan')
      console.log('data', data)

      this.ruangs = data?.data
      this.ruangs.unshift({ kode: 'all', uraian: 'Semua' })
    },
    getAllData () { },
    getDataTable () { },
    setField () {
      if (this.params.jenis === 'rekap') {
        this.fields = {
          No: 'no',
          'Kode Obat': 'kd_obat',
          'Nama Obat': 'nama_obat',
          Satuan: 'satuan_k',
          'Kode Belanja': 'uraian50',
          Keterangan: 'ket',
          'Jumlah Saldo Awal': 'jumlSalAwal',
          'Nilai Saldo Awal': 'nilaiSalAwal',
          'Jumlah Masuk': 'jumlMasuk',
          'Nilai Masuk': 'nilaiMasuk',
          'Jumlah Keluar': 'jumlKeluar',
          'Nilai Keluar': 'nilaiKeluar',
          'Jumlah Saldo Akhir': 'jumlSalAkhir',
          'Nilai Saldo Akhir': 'nilaiSalAkhir'
        }
      }
      else {
        this.fields = {
          No: 'no',
          'Kode Obat': 'kd_obat',
          'Nama Obat': 'nama_obat',
          Satuan: 'satuan_k',
          Keterangan: 'ket',
          'Jumlah Saldo Awal': 'jumlSalAwal',
          'Harga Saldo Awal': 'harSalAwal',
          'Nilai Saldo Awal': 'nilaiSalAwal',
          'Tanggal Masuk': 'tglMasuk',
          'Jumlah Masuk': 'jumlMasuk',
          'Harga Masuk': 'harMasuk',
          'Nilai Masuk': 'nilaiMasuk',
          'Tanggal Keluar': 'tglKeluar',
          'Jumlah Keluar': 'jumlKeluar',
          'Harga Keluar': 'harKeluar',
          'Nilai Keluar': 'nilaiKeluar',
          'Jumlah Saldo Akhir': 'jumlSalAkhir',
          'Harga Saldo Akhir': 'harSalAkhir',
          'Nilai Saldo Akhir': 'nilaiSalAkhir'
        }
      }
    },
    cekNan (val) {
      return isNaN(parseFloat(val)) ? '' : val
    },
    async fetch () {
      // laravel throttle 180 ms
      this.setField()
      const param = { params: this.params }
      // param.params.action = 'download'
      this.ketProses = 'Mengambil data halaman '

      const data = []
      const dataForTotal = []
      let items = []

      // this.items = []
      // this.setParams('page', 1)
      if (this.meta?.current_page >= 1 && this?.meta.current_page === this?.meta.last_page) {
        items = [...this.items]
      } else {
        items = [...this.items]
        this.meta = {
          current_page: 0,
          last_page: 5
        }
        let currentPage = this.meta?.current_page + 1 ?? 1
        let totalPages = this.meta?.last_page ?? 5
        do {
          param.params.page = currentPage // Tambahkan parameter halaman
          const resp = await api.get('v1/simrs/laporan/farmasi/persediaan/get-mutasi', param)
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
          this.mapingItem(resp?.data?.data, items, 'download')

          currentPage++
        } while (currentPage <= totalPages)
      }

      items.forEach((item, i) => {
        if (item?.data?.length) {
          item?.data.forEach((dat, d) => {
            const ada = {}
            const tmpForTot = {}
            if (d === 0) {
              ada.no = i + 1
              ada.kd_obat = item?.kd_obat
              ada.nama_obat = item?.nama_obat
              ada.satuan_k = item?.satuan_k
              if (this.params.jenis === 'rekap') ada.uraian50 = item?.uraian50
            }
            // ini untuk menjmlah total
            tmpForTot.jumlSalAwal = this.cekNan(parseFloat(dat?.saldoawal?.jumlah), 2)
            tmpForTot.nilaiSalAwal = this.cekNan(parseFloat(dat?.saldoawal?.sub), 2)
            tmpForTot.jumlMasuk = this.cekNan(parseFloat(dat?.masuk?.jumlah), 2)
            tmpForTot.nilaiMasuk = this.cekNan(parseFloat(dat?.masuk?.sub), 2)
            tmpForTot.jumlKeluar = this.cekNan(parseFloat(dat?.keluar?.jumlah), 2)
            tmpForTot.nilaiKeluar = this.cekNan(parseFloat(dat?.keluar?.sub), 2)
            tmpForTot.jumlSalAkhir = this.cekNan(parseFloat(dat?.akhir?.jumlah), 2)
            tmpForTot.nilaiSalAkhir = this.cekNan(parseFloat(dat?.akhir?.sub), 2)

            if (this.params.jenis === 'rekap') {
              ada.ket = dat?.ket
              ada.jumlSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.jumlah), 2))
              ada.nilaiSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.sub), 2))
              ada.jumlMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.jumlah), 2))
              ada.nilaiMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.sub), 2))
              ada.jumlKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.jumlah), 2))
              ada.nilaiKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.sub), 2))
              ada.jumlSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.jumlah), 2))
              ada.nilaiSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.sub), 2))
            }
            else {
              ada.ket = dat?.ket
              ada.jumlSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.jumlah ?? dat?.subAw?.jumlah), 2))
              ada.harSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.harga), 2))
              ada.nilaiSalAwal = this.cekNan(formatDoubleKoma(parseFloat(dat?.saldoawal?.sub ?? dat?.subAw?.sub), 2))
              ada.tglMasuk = dat?.masuk?.tgl ?? ''
              ada.jumlMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.jumlah ?? dat?.subMs?.jumlah), 2))
              ada.harMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.harga), 2))
              ada.nilaiMasuk = this.cekNan(formatDoubleKoma(parseFloat(dat?.masuk?.sub ?? dat?.subMs?.sub), 2))
              ada.tglKeluar = dat?.keluar?.tgl ?? ''
              ada.jumlKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.jumlah ?? dat?.subKel?.jumlah), 2))
              ada.harKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.harga), 2))
              ada.nilaiKeluar = this.cekNan(formatDoubleKoma(parseFloat(dat?.keluar?.sub ?? dat?.subKel?.sub), 2))
              ada.jumlSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.jumlah ?? dat?.subtotal?.jumlah), 2))
              ada.harSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.harga), 2))
              ada.nilaiSalAkhir = this.cekNan(formatDoubleKoma(parseFloat(dat?.akhir?.sub ?? dat?.subtotal?.sub), 2))
            }

            const indexData = data.findIndex(f => f.kd_obat === item?.kd_obat)
            if (indexData >= 0) data[indexData] = ada
            else data.push(ada)
            const indexAdaForTot = dataForTotal.findIndex(f => f.kd_obat === item?.kd_obat)
            if (indexAdaForTot >= 0) dataForTotal[indexAdaForTot] = tmpForTot
            else dataForTotal.push(tmpForTot)
          })
        }
        else {
          console.log('ada tidak')
          const temp = {}
          temp.no = i + 1
          temp.kd_obat = item?.kd_obat
          temp.nama_obat = item?.nama_obat
          temp.satuan_k = item?.satuan_k
          if (this.params.jenis === 'rekap') temp.uraian50 = item?.uraian50

          const indexAda = temp.findIndex(f => f.kd_obat === item?.kd_obat)
          if (indexAda >= 0) data[indexAda] = temp
          else data.push(temp)

        }
      })
      // total
      const tot = {
        ket: 'Total',
        jumlSalAwal: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlSalAwal) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlSalAwal), 0), 2)),
        nilaiSalAwal: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiSalAwal) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiSalAwal), 0), 2)),
        jumlMasuk: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlMasuk) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlMasuk), 0), 2)),
        nilaiMasuk: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiMasuk) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiMasuk), 0), 2)),
        jumlKeluar: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlKeluar) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlKeluar), 0), 2)),
        nilaiKeluar: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiKeluar) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiKeluar), 0), 2)),
        jumlSalAkhir: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.jumlSalAkhir) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.jumlSalAkhir), 0), 2)),
        nilaiSalAkhir: this.cekNan(formatDoubleKoma(dataForTotal?.filter(f => parseFloat(f.nilaiSalAkhir) > 0)?.reduce((a, b) => parseFloat(a) + parseFloat(b.nilaiSalAkhir), 0), 2))
      }
      data.push(tot)
      console.log('items', data)
      this.ketProses = null
      this.items = [...items]
      return data
    },
    startDownload () { this.loadingDownload = true },
    finishDownload () { this.loadingDownload = false },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanPemakaianFloorStokStore, import.meta.hot))
}
