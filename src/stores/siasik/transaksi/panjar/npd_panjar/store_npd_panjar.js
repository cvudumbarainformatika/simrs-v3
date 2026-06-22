import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess } from "src/modules/utils";
// import { dataBastFarmasiStore } from "./bastfarmasi";


export const storeNpdPanjar = defineStore('store_npd_panjar', {
  state: () => ({
    loading: false,
    loadingHapus: false,
    disabled: false,
    disabledx: false,
    hidden: false,
    fixed: false,
    dialogCetakNpd: false,
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      tahunx: date.formatDate(Date.now(), 'YYYY'),
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      bidang: '',
      kegiatan: ''
    },
    reqs: {
      q: '',
      page: 1,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      kodebidang: null,
      kodekegiatan: null,
      bast: null,
      rekening50: null,
      nip: null,
      volumels: null,
      rincianmanual: null,
      subtotal: 0,
      jmlperkoderek108: [],
      nonpdpanjar: null
    },
    display: {
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    form: {
      nonpdpanjar: null,
      tglnpdpanjar: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      kodepptk: null,
      pptk: null,
      kodebidang: null,
      bidang: null,
      kodekegiatanblud: null,
      kegiatanblud: null,


      //RINCIAN
      nopp: '',
      koderek50: '',
      rincianbelanja50: '',
      koderek108: '',
      uraian108: '',
      itembelanja: '',

      volume: 0,
      harga: 0,
      total: 0,
      satuan: null,

      volumepermintaanpanjar: 0,
      hargapermintaanpanjar: 0,
      totalpermintaanpanjar: 0,
      idpp: null,
      sisapagu: 0
    },
    rincians: [],
    transall: [],
    npddatasave: []
  }),
  actions: {
    resetFORM() {
      const forms = Object.keys(this.form)
      for (let i = 0; i < forms?.length; i++) {
        const el = forms[i]
        this.setForm(el, null)
      }
      const bast = Object.keys(this.reqs)
      for (let i = 0; i < bast?.length; i++) {
        const el = bast[i]
        this.setForm(el, null)
      }
      const transall = Object.keys(this.transall)
      for (let i = 0; i < transall?.length; i++) {
        const el = transall[i]
        this.setForm(el, null)
      }
    },
    setForm(key, val) {
      this.form[key] = val
      this.reqs[key] = val
      this.transall[key] = val
    },
    setFormInput(key, val) {
      this.form.nopp = null
      this.form.koderek50 = null
      this.form.rincianbelanja50 = null
      this.form.koderek108 = null
      this.form.uraian108 = null
      this.form.itembelanja = null
      this.form.idpp = null
      this.form.satuan = null
      this.form.volume = 0
      this.form.harga = 0
      this.form.total = 0
      this.form.volumepermintaanpanjar = 0
      this.form.hargapermintaanpanjar = 0
      this.form.totalpermintaanpanjar = 0
      this.form.sisapagu = 0

      this.form[key] = val
    },
    setParams(key, val) {
      this.reqs[key] = val
      this.params[key] = val
    },
    refreshTable() {

      // this.listrincians()
      this.loadingHapus = false
      // const bst = dataBastFarmasiStore()
      // bst.getDataBast()
    },
    initForm() {
      this.form.nonpdpanjar = ''
      this.form.kodepptk = ''
      this.form.pptk = ''
      this.form.kodebidang = ''
      this.form.bidang = ''
      this.form.bast = ''
      this.form.serahterimapekerjaan = ''
      this.form.noserahterima = ''
      this.form.nokontrak = ''
      this.form.kodepenerima = ''
      this.form.kegiatanblud = ''
      this.form.kodekegiatanblud = ''
      this.form.keterangan = ''
      this.form.biayatransfer = 0
      this.form.rincians = []

      this.transall = []
      this.transallserahterima = []
      this.disabled = false
      this.disabledx = false
      this.loading = false
    },
    resetformrinci() {
      this.form.nopp = ''
      this.form.koderek50 = ''
      this.form.rincianbelanja50 = ''
      this.form.koderek108 = ''
      this.form.uraian108 = ''
      this.form.itembelanja = ''

      this.form.volume = 0
      this.form.harga = 0
      this.form.total = 0
      this.form.satuan = null

      this.form.volumepermintaanpanjar = 0
      this.form.hargapermintaanpanjar = 0
      this.form.totalpermintaanpanjar = 0
      this.form.idpp = null
      this.form.sisapagu = 0
    },
    getDataBidang() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('/v1/transaksi/belanja_ls/bidang', params).then((resp) => {
          if (resp.status === 200) {
            this.bidangdanptk = resp.data
            this.loading = false
            this.filterKegiatan()
            this.filterPtk()
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    filterPtk() {
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
    },
    filterKegiatan() {
      const data = this.bidangdanptk?.length
        ? this.bidangdanptk?.filter(x =>
          x.kodepptk === this.reqs.nip
        )
        : []
      this.kegiatans = data
    },
    getRincianBelanja() {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('/v1/transaksi/belanja_ls/anggaran', params)
          .then((resp) => {
            if (resp.status === 200) {
              console.log('anggaran', resp.data)
              this.loading = false
              this.anggarans = resp.data
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
    filterRekening50() {
      const data = this.anggarans?.length
        ? this.anggarans?.map((x) => {
          return {
            notrans: x.notrans,
            itembelanja: x.usulan,
            rincianbelanja: x.uraian50,
            rek50: x.koderek50,
            realisasi: x.realisasi.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
              x.realisasi_spjpanjar.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
              x.contrapost.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)
          }
        })
        : []
      const rek = data.reduce((a, b) => {
        const yangsama = a.find(x => x.rek50 === b.rek50)
        if (!yangsama) {
          a.push(b)
        }
        return a
      }, [])
      this.rekening50 = rek
    },
    filterItemBelanja() {
      const data = this.anggarans?.length
        ? this.anggarans?.filter(x => x.koderek50 === this.reqs.rekening50).map((x) => {
          return {
            idpp: x.idpp,
            koderek108: x.koderek108,
            uraian108: x.uraian108,
            koderek50: x.koderek50,
            uraian50: x.uraian50,
            itembelanja: x.usulan,
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
          }
        })
        : []
      this.itembelanja = data
      // console.log('item belanja', data)
    },

    async getDataNpdPanjar() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('/v1/transaksi/panjar/listdatanpd', params)
          .then((resp) => {
            // console.log('list npd', resp)
            if (resp.status === 200) {
              this.transall = resp.data?.data
              console.log('transall', this.transall)
              this.loading = false
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

    async simpan(add) {
      // console.log('fooorm', this.form)
      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('/v1/transaksi/panjar/savenpd', this.form)
          .then((resp) => {
            this.reqs.subtotal = 0
            this.form.nonpdpanjar = resp.data?.data?.nonpdpanjar
            // this.rinci.nonpdls = resp.data?.result?.nonpdls
            // this.paramsrinci.nonpdpanjar = resp.data?.data?.nonpdpanjar
            this.loading = false
            this.disabled = true
            notifSuccess(resp)
            this.resetformrinci()
            this.rincians = resp.data?.data?.npdpjr_rinci
            console.log('transall', this.transall)
            // this.listrincians()
            // bst.filterRekening50()

            resolve(resp.data)
            // this.form.rincians = {}
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    async kunciData(row) {
      this.loading = true
      // const payload = { id: row.id }
      try {
        const resp = await api.post('/v1/transaksi/panjar/kunci_npd', row)
        if (resp.status === 200) {
          // this.items = resp?.data?.data
          notifSuccess(resp)
          // this.getData()
        }
        this.loading = false
      }
      catch (error) {
        notifErr(error)
        this.loading = false
      }
      finally {
        this.loading = false
      }
    },
    // async listrincians() {
    //   this.loading = true
    //   const params = { params: this.paramsrinci }
    //   return new Promise((resolve, reject) => {
    //     api.get('/v1/transaksi/belanja_ls/getrincian', params).then((resp) => {
    //       if (resp.status === 200) {
    //         this.transall = resp.data
    //         // console.log('hasilall', this.transall)

    //       }
    //       this.loading = false
    //       resolve(resp)
    //     }).catch(() => { this.loading = false })
    //   })
    // },
    hapusRinci(row) {
      // console.log('hapus rinci', row)
      this.loadingHapus = true
      return new Promise(resolve => {
        api.post('/v1/transaksi/panjar/deletenpd', row)
          .then(resp => {

            this.rincians = resp?.data?.data
            console.log('HAPUS', this.rincians)
            // if (this.transall?.length < 0) {
            //   this.initForm()
            //   this.listrincians()
            // }
            // const index = row.rincian.findIndex(x => x.id === val.id)
            // if (index >= 0) {
            //   row.rincian.splice(index, 1)
            // }
            // if (!row.rincian?.length) this.cariRencanaBeli()
            this.loadingHapus = false
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
