import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { usehutangObatPerTanggalStore } from '../hutang/hutangobatpertanggal'
import { formatDoubleKoma } from 'src/modules/formatter'

export const useLaporanPenerimaanObatStore = defineStore('laporan_penerimaan_obat', {
  state: () => ({
    loading: false,
    loadingDownload: true,
    items: [],
    pihakTigas: [],
    pihakTigasx: [],
    meta: {},
    detail: [],
    kolom: ['NoPenerimaan', 'NoPemesanan', 'JenisPenerimaan', 'Gudang', 'TglPenerimaan', 'TglSurat', 'BatasBayar', 'NoSurat', 'JenisSurat', 'NoFaktur', 'Suplier', 'Uraian50', 'Total'],
    totalall: 0,
    tanggal: {
      from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    params: {
      tgldari: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglsampai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      gudang: 'all',
      jenispenerimaan: 'all',
      pihakketiga: ''
      // ruangan: ''
    },
    tanggal_rinci: {
      from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    pihakketiga: 'Semua Pbf',
    rekeningbelanja: [],
    items_rinci: [],
    kolom_rinci: ['Obat', 'Gudang', 'Penyedia', 'Kuantitas', 'Harga', 'Total'],
    params_rinci: {
      tgldari: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglsampai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      gudang: 'all',
      rekeningbelanja: 'all',
      pihakketiga: ''
      // ruangan: ''
    },
    pihakketiga_rinci: 'Semua Pbf',
    totalall_rinci: 0,
    fields: {},
    loadingDownload: false
  }),
  actions: {
    async getPihakKetiga () {
      return new Promise(resolve => {
        api.get('v1/transaksi/belanja_ls/perusahaan')
          .then(resp => {
            this.pihakTigas = resp.data
            // this.pihakTigas.unshift({ kode: 'all', nama: 'Semua Pbf' })
            this.pihakTigasx = resp.data
            // this.pihakTigasx.unshift({ kode: 'all', nama: 'Semua Pbf' })
            resolve(resp)
          })
      })
    },
    async getKodeBelanja () {
      return new Promise(resolve => {
        api.get('v1/simrs/farmasi/master/listkodebelanjaobat')
          .then(resp => {
            this.rekeningbelanja = resp.data
            this.rekeningbelanja.unshift({ kode: 'all', uraian: 'Semua Rekening Belanja' })
            resolve(resp)
          })
      })
    },
    async initAmbilData () {
      this.laporanRekapPenerimaanObat()
    },
    async laporanRekapPenerimaanObat () {
      this.loading = true
      this.kolom = ['NoPenerimaan', 'NoPemesanan', 'JenisPenerimaan', 'Gudang', 'TglPenerimaan', 'TglSurat', 'BatasBayar', 'NoSurat', 'JenisSurat', 'Suplier', 'Uraian50', 'Total']
      if (this.pihakketiga === 'Semua Pbf') {
        this.params.pihakketiga = 'all'
      }
      else {
        this.params.pihakketiga = this.pihakketiga
      }
      const params = { params: this.params }
      await api.get('v1/simrs/laporan/farmasi/hutang/caripenerimaanobat', params)
        .then((resp) => {
          if (resp.status === 200) {
            const datahasil = resp?.data
            this.sethasil(datahasil)
            this.loading = false
          }
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    sethasil (val) {
      const hasilglobal = []
      val.forEach(x => {
        // const uraian50 = x.penerimaanrinci[0]?.masterobat?.uraian50 ?? ''
        const arr50 = x.penerimaanrinci?.flatMap(x => x.masterobat?.uraian50) // flatten array
        const uni50 = [...new Set(arr50)] // get unique value
        const uraian50 = uni50.join(', ') // join each unique value
        // console.log('uraian50', uni50, arr50, uraian50)

        const hasil = {
          NoPenerimaan: x?.nopenerimaan,
          NoPemesanan: x?.nopemesanan,
          JenisPenerimaan: x?.jenis_penerimaan,
          Gudang: x?.gudang?.nama,
          TglPenerimaan: x?.tglpenerimaan,
          TglSurat: x?.tglsurat,
          BatasBayar: x?.batasbayar ?? '-',
          NoSurat: x?.nomorsurat,
          JenisSurat: x?.jenissurat,
          Suplier: x?.pihakketiga?.nama,
          Total: x?.total_faktur_pbf,
          uraian50
        }
        hasilglobal.push(hasil)
      })
      this.items = hasilglobal.sort(({ TglPenerimaan: a }, { TglPenerimaan: b }) => b - a)
      this.totalall = this.items.reduce((a, b) => parseFloat(a) + parseFloat(b.Total), 0)
    },
    async initAmbilDataRinci () {
      this.laporanRinciPenerimaanObat()
    },
    async laporanRinciPenerimaanObat () {
      this.loading = true
      this.kolom_rinci = ['Obat', 'Gudang', 'Penyedia', 'Kuantitas', 'Harga', 'Total']

      if (this.pihakketiga_rinci === 'Semua Pbf') {
        this.params_rinci.pihakketiga = 'all'
      }
      else {
        this.params_rinci.pihakketiga = this.pihakketiga_rinci
      }
      const params = { params: this.params_rinci }
      await api.get('v1/simrs/laporan/farmasi/hutang/caripenerimaanobatrinci', params)
        .then((resp) => {
          if (resp.status === 200) {
            const datahasil = resp?.data
            this.sethasilrinci(datahasil)
            this.loading = false
            this.params_rinci.pihakketiga = ''
          }
        })
        .catch((err) => {
          // console.log(err)
          this.loading = false
        })
    },
    sethasilrinci (val) {
      const hasilglobal = []
      val.forEach(x => {
        const nopenerimaan = x?.nopenerimaan
        const hasil = {
          KodeObat: x?.kdobat,
          NamaObat: x?.nama_obat,
          satuanB: x?.satuan,
          satuanK: x?.jml_terima_k,
          Gudang: x?.gudang?.nama,
          NoPenerimaan: nopenerimaan,
          NoBatch: x?.no_batch,
          Penyedia: x?.pihakketiga?.nama ?? '-',
          Kode108: x?.kode108,
          KodeBelanja050: x?.kode50,
          Uraian108: x?.uraian108,
          Uraian50: x?.uraian50,
          Kuantitas: x?.jml_terima_b,
          Harga: x?.harga_netto,
          Total: x?.subtotal
        }
        hasilglobal.push(hasil)
      })
      this.items_rinci = hasilglobal.sort(({ TglPenerimaan: a }, { TglPenerimaan: b }) => b - a)
      this.totalall_rinci = this.items_rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.Total), 0)
    },
    // refreshrinci () {
    //   this.tanggal.from = date.formatDate(Date.now(), 'DD MMMM YYYY')
    //   this.tanggal.to = date.formatDate(Date.now(), 'DD MMMM YYYY')
    // },
    setField () {
      const lapHut = usehutangObatPerTanggalStore()
      // console.log('this.params.jenisreport', lapHut.params.jenisreport)

      if (lapHut.params.jenisreport === '1') {
        this.fields = {
          No: 'no',
          'Nomor Penerimaan': 'NoPenerimaan',
          'Nomor Pemesanan': 'NoPemesanan',
          'Jenis Penerimaan': 'JenisPenerimaan',
          'Gudang': 'Gudang',
          'Tanggal Penerimaan': 'TglPenerimaan',
          'Tanggal Surat': 'TglSurat',
          'Batas Bayar': 'BatasBayar',
          'Nomor Surat': 'NoSurat',
          'Jenis Surat': 'JenisSurat',
          'Suplier': 'Suplier',
          'Uraian 50': 'Uraian50',
          'Total': 'Total'
        }
      }
    },
    fetch () {
      this.setField()
      const data = []
      this.items.forEach((item, i) => {
        const ada = {}
        ada.no = i + 1
        ada.NoPenerimaan = item.NoPenerimaan
        ada.NoPemesanan = item.NoPemesanan
        ada.JenisPenerimaan = item.JenisPenerimaan
        ada.Gudang = item.Gudang
        ada.TglPenerimaan = item.TglPenerimaan
        ada.TglSurat = item.TglSurat
        ada.BatasBayar = item.BatasBayar
        ada.NoSurat = "'   " + item.NoSurat
        ada.JenisSurat = item.JenisSurat
        ada.NoFaktur = item.NoFaktur
        ada.Suplier = item.Suplier
        ada.Uraian50 = item.uraian50
        ada.Total = formatDoubleKoma(item.Total, 2)
        data.push(ada)
      })
      // const data = [...this.items]

      // console.log('items', data)
      data.push({})
      data.push({ NoPenerimaan: 'TOTAL', Total: formatDoubleKoma(this.totalall, 2) })
      return data

    },
    startDownload () { this.loadingDownload = true },
    finishDownload () { this.loadingDownload = false },
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanPenerimaanObatStore, import.meta.hot))
}
