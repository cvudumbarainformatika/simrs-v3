import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'
import { notifSuccess } from 'src/modules/utils'
import { dataBastFarmasi } from './databast'
// import ListdataNpdLS from 'src/pages/siasik/transaksi/ls/npdls/inpage/ListdataNpdLS.vue'
// import { dataBastFarmasi } from 'src/stores/siasik/transaksi/ls/npdls/databast'

export const formNotaPermintaanDanaLS = defineStore('form_NPD_LS', {
  state: () => ({
    loading: false,
    loadingHapus: false,
    disabled: false,
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      bidang: '',
      kegiatan: ''
    },
    display: {
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    reqs: {
      q: '',
      page: 1,
      kodebidang: null,
      kodekegiatan: null,
      bast: null,
      rekening50: null,
      nip: null,
      volumels: null,
      rincianmanual: null,
      subtotal: null,
      jmlperkoderek108: [],
      listrinci: [],
      nonpdls: null
      // page: 1,
      // rowsPerPage: 10,
      // rowsNumber: 0
    },
    form: {
      nonpdls: null,
      tglnpdls: null,

      // PPTK
      kodepptk: null,
      pptk: null,
      kodebidang: null,
      bidang: null,

      bast: null,
      // Data Kontrak
      serahterimapekerjaan: null,
      noserahterima: null,
      nokontrak: null,

      triwulan: null,

      // kegiatan
      kodekegiatanblud: null,
      kegiatanblud: null,

      // pihak ketiga
      kodepenerima: null,
      penerima: null,
      bank: null,
      rekening: null,
      npwp: null,

      keterangan: null,
      biayatransfer: 0,
      rincians: [],
      rincimanual: []
    },
    rinci:
    {
      nonpdls: null,

      // Rekening 50
      koderek50: null,
      rincianbelanja: null,
      // Rekening 108
      koderek108: null,
      uraian108: null,
      itembelanja: null,

      // Nomer Usulan
      nopenerimaan: null,

      // id serahterima
      idserahterima_rinci: null,
      tglentry: null,
      userentry: null,

      // PAGU
      volume: null,
      satuan: null,
      harga: null,
      total: null,
      sisapagu: null,

      // Belanja
      volumels: null,
      hargals: null,
      totalls: null,
      nominalpembayaran: null,

      // jurnal
      kode_lo: null,
      uraian_lo: null,
      kode_neraca1: null,
      uraian_neraca1: null,
      kode_neraca2: null,
      uraian_neraca2: null,
      kode_lpsal: null,
      uraian_lpsal: null,
      kode_lak: null,
      uraian_lak: null
    },
    dariserahterima: [
      { nama: '-', value: '1' },
      { nama: 'Sigarang', value: '2' },
      { nama: 'Farmasi', value: '3' },
      { nama: 'Siasik', value: '4' }
    ],

    serahterimas: [
      { ket: 'Ya', value: '3' },
      { ket: 'Tidak', value: '2' }
    ],
    // DATA NPD LS
    listnpdls: [],
    datanpd: [],

    bidangdanptk: [],
    bidangs: [],
    kegiatans: [],
    ptks: [],
    anggarans: [],
    rekening50: [],
    itembelanja: [],

    npddatasave: [],
    editnpd: [],
    // utuk list tersimpan
    rincians: [],
    dialogEditNpd: false,
    // datafarmasi: [],
    // bastfarmasis: [],
    dialogPrintPencairan: false,
    dialogCetakNpd: false,
    openDialogFarmasi: false,
    openDialogSiasik: false,
    openDialogRinci: false
  }),
  actions: {
    resetFORM () {
      const forms = Object.keys(this.form)
      for (let i = 0; i < forms.length; i++) {
        const el = forms[i]
        this.setForm(el, null)
      }
      const keys = Object.keys(this.rinci)
      for (let i = 0; i < keys.length; i++) {
        const el = keys[i]
        this.setForm(el, null)
      }
      const bast = Object.keys(this.reqs)
      for (let i = 0; i < bast.length; i++) {
        const el = bast[i]
        this.setForm(el, null)
      }
    },
    setParams (key, val) {
      this.reqs[key] = val
    },
    setForm (key, val) {
      this.form[key] = val
      this.rinci[key] = val
      this.reqs[key] = val
      // this.openDialogFarmasi = false
      // console.log('form', this.form)
    },
    setFormInput (key, val) {
      this.rinci[key] = val
    },
    emptyForm () {
      this.form = {}
      this.rinci = {}
      this.reqs = []
    },
    dataTersimpan () {
      this.simpanNpdls()
    },
    goToPage (val) {
      this.reqs.page = val
      this.listdatanpd()
    },
    // onRequest (props) {
    //   console.log('props', props)
    //   this.reqs.page = props?.pagination?.page ?? 1
    //   this.reqs.rowsPerPage = props?.pagination?.rowsPerPage ?? 20
    //   this.getInitialData()
    // },
    // goToPage (val) {
    //   this.reqs.page = val
    //   this.getInitialData()
    // },
    getDataBidang () {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/laporan/lra/bidang', params).then((resp) => {
          // console.log('bidang', resp.data)
          if (resp.status === 200) {
            this.bidangdanptk = resp.data
            // this.kegiatans = resp.data
            // this.ptks = resp.data
            this.loading = false
            // this.filterBidang(resp.data)
            this.filterKegiatan(resp.data)
            this.filterPtk(resp.data)
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    filterPtk () {
      const data = this.bidangdanptk?.length
        ? this.bidangdanptk?.map((x) => {
          return {
            nip: x.kodepptk,
            nama: x.namapptk,
            kodeBagian: x.kodebidang,
            bagian: x.bidang
          }
        })
        : []
      const ptk = data.reduce((acc, curr) => {
        const kodesama = acc.find(x => x.nip === curr.nip)
        if (!kodesama) {
          acc.push(curr)
        }
        return acc
      }, [])
      this.ptks = ptk
      // console.log('pptk', this.ptks)
    },
    filterKegiatan () {
      const data = this.bidangdanptk?.length
        ? this.bidangdanptk?.filter(x =>
          x.kodepptk === this.reqs.nip
        )
        : []
      this.kegiatans = data
      // console.log('ddd', this.kegiatans)
    },
    simpanNpdls () {
      console.log('fooorm', this.form)
      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('/v1/transaksi/belanja_ls/simpannpd', this.form)
          .then((resp) => {
            console.log('nomer', this.form.nonpdls)
            this.form = []
            this.rinci = []

            this.reqs.subtotal = ''
            const bst = dataBastFarmasi()
            bst.itembelanja = []

            // Ini Buat Memunculkan Nomer NPD di Front ketika disimpan
            this.form.nonpdls = resp.data?.result?.nonpdls
            this.reqs.nonpdls = resp.data?.result?.nonpdls

            this.form.nonpdls = ''
            console.log('lihat nomer', this.form.nonpdls)

            this.loading = false
            notifSuccess(resp)
            resolve(resp.data)
            // this.form.rincians = {}
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    getRincianBelanja () {
      // console.log('pagu', this.anggarans)
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('/v1/transaksi/belanja_ls/anggaran', params)
          .then((resp) => {
            if (resp.status === 200) {
              console.log('anggaran', resp.data)
              this.loading = false
              this.anggarans = resp.data
              // this.itembelanja = resp.data
              this.filterRekening50(resp.data)
              this.filterItemBelanja(resp.data)
              resolve(resp.data)
            }
            else {
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    filterRekening50 () {
      const data = this.anggarans?.length
        ? this.anggarans?.map((x) => {
          return {
            itembelanja: x.usulan,
            rincianbelanja: x.uraian50,
            rek50: x.koderek50,
            realisasi: x.realisasi.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
            x.realisasi_spjpanjar.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
            x.contrapost.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)
          }
        })
        : []
      console.log('realisasi item', data)
      const rek = data.reduce((a, b) => {
        const yangsama = a.find(x => x.rek50 === b.rek50)
        if (!yangsama) {
          a.push(b)
        }
        return a
      }, [])
      this.rekening50 = rek
    },
    filterItemBelanja () {
      // const fil50 = this.reqs.rekening50
      const data = this.anggarans?.length
        ? this.anggarans?.filter(x => x.koderek50 === this.reqs.rekening50).map((x) => {
          return {
            idpp: x.idpp,
            koderek108: x.koderek108,
            uraian108: x.uraian108,
            rek50: x.koderek50,
            uraian50: x.uraian50,
            item: x.usulan,
            harga: parseFloat(x.harga),
            satuan: x.satuan,
            volume: parseFloat(x.volume),
            pagu: parseFloat(x.pagu),
            realisasi: x.realisasi.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
            x.realisasi_spjpanjar.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
            x.contrapost.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0),
            sisapagu: parseFloat(x.pagu) - (x.realisasi.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
            x.realisasi_spjpanjar.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
            x.contrapost.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)),

            kode_lo: x?.jurnal?.kode_lo,
            uraian_lo: x?.jurnal?.uraian_lo,
            kode_neraca1: x?.jurnal?.kode_neraca1,
            uraian_neraca1: x?.jurnal?.uraian_neraca1,
            kode_neraca2: x?.jurnal?.kode_neraca2,
            uraian_neraca2: x?.jurnal?.uraian_neraca2,
            kode_lpsal: x?.jurnal?.kode_lpsal,
            uraian_lpsal: x?.jurnal?.uraian_lpsal,
            kode_lak: x?.jurnal?.kode_lak,
            uraian_lak: x?.jurnal?.uraian_lak
          }
        })
        : []
      this.itembelanja = data
      console.log('item belanja', data)
    },

    listdatanpd () {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve, reject) => {
        api.get('/v1/transaksi/belanja_ls/listnpdls', params)
          .then((resp) => {
            if (resp.status === 200) {
              console.log('data NPD', resp)
              this.loading = false
              this.listnpdls = resp.data
              this.rincianNpd(resp.data)
              resolve(resp.data)
            }
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    rincianNpd () {
      if (this.listnpdls.length) {
        const sas = []
        for (let i = 0; i < this.listnpdls.length; i++) {
          const arr = this.listnpdls[i]
          // console.log('rincianqqq', arr)
          const head = {
            nonpk: arr.nonpk,
            nonpdls: arr.nonpdls,
            tglnpdls: arr.tglnpdls,
            bidang: arr.bidang,
            pptk: arr.pptk,
            kodepptk: arr.kodepptk,
            kegiatanblud: arr.kegiatanblud,
            penerima: arr.penerima,
            kodepenerima: arr.kodepenerima,
            bank: arr.bank,
            rekening: arr.rekening,
            npwp: arr.npwp,
            keterangan: arr.keterangan,
            nopencairan: arr.nopencairan,
            serahterimapekerjaan: arr.serahterimapekerjaan,
            tglcair: arr.npkrinci?.header?.tglpindahbuku,
            total: arr.npdlsrinci?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0),
            rincian: arr.npdlsrinci,
            pajak: arr.pajak,
            totalpajak: parseFloat(arr.pajak?.ppnpusat) + parseFloat(arr.pajak?.pph21) + parseFloat(arr.pajak?.pph22) + parseFloat(arr.pajak?.pph23) + parseFloat(arr.pajak?.pph25) + parseFloat(arr.pajak?.pajakdaerah) + parseFloat(arr.pajak?.pasal4),
            totalbayar: (arr.npdlsrinci?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0)) - (parseFloat(arr.pajak?.ppnpusat) + parseFloat(arr.pajak?.pph21) + parseFloat(arr.pajak?.pph22) + parseFloat(arr.pajak?.pph23) + parseFloat(arr.pajak?.pph25) + parseFloat(arr.pajak?.pajakdaerah) + parseFloat(arr.pajak?.pasal4))
          }
          // console.log('head', head)
          // const el = arr.npdlsrinci
          // const obj = el.length
          //   ? el.map((x) => {
          //     return {
          //       nonpdls: x.nonpdls,
          //       item: x.itembelanja,
          //       total: parseFloat(x.nominalpembayaran)
          //     }
          //   })
          //   : []
          // console.log('datarinci', el)
          sas.push(head)
        }
        this.datanpd = sas
        console.log('rinciiii', this.datanpd)
      }
    },
    hapusRinci (row) {
      console.log('hapus rinci', row)
      this.loadingHapus = true
      return new Promise(resolve => {
        api.post('/v1/transaksi/belanja_ls/deleterinci', row)
          .then(resp => {
            this.loadingHapus = false
            console.log('hapus data', resp)

            const bst = dataBastFarmasi()
            bst.refreshTable()
            // const index = row.rincian.findIndex(x => x.id === val.id)
            // if (index >= 0) {
            //   row.rincian.splice(index, 1)
            // }
            // if (!row.rincian.length) this.cariRencanaBeli()
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            this.loadingHapus = false
            row.loading = false
          })
      })
    }
  }
})
