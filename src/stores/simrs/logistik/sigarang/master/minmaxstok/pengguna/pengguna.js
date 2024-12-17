import { defineStore } from 'pinia'
import { Dialog } from 'quasar'
import { api } from 'src/boot/axios'
import { findWithAttr, notifSuccess, waitLoad } from 'src/modules/utils'
import { useTransaksiPermintaanForm } from '../../../transaksi/permintaan/form'

export const useMinMaxPenggunaStockStore = defineStore('min_max_pengguna_store', {
  state: () => ({
    // table
    items: [],
    meta: {},
    item: {},
    params: {
      q: '',
      ruang: '',
      barang: '',
      flag_minta: 'all',
      page: 1,
      per_page: 10,
      order_by: 'id',
      sort: 'desc'
    },
    paramsBarang: {
      q: '',
      page: 1,
      per_page: 15,
      order_by: 'id',
      sort: 'desc'
    },
    paramsRuang: {
      q: '',
      page: 1,
      per_page: 15,
      order_by: 'id',
      sort: 'desc'
    },
    columns: [],
    columnHide: [],

    // form
    loading: false,
    loadingBarang: false,
    loadingRuang: false,
    isOpen: false,
    optionTampil: [
      { nama: 'Semua', value: 'all' },
      { nama: 'Ada permintaan Maks', value: '1' },
      { nama: 'Tidak ada Pemrintaan maks', value: null }
    ],
    form: {
      kode_rs: null,
      kode_ruang: null,
      min_stok: 0,
      max_stok: 0
    },
    formRuangan: {
      kode_ruang: null,
      kode_rs: null,
      minta: 0,
      flag_minta: null,
      max_stok: 0
    },

    barangs: [],
    penggunas: [],
    gudangs: [],
    ruangs: []
  }),
  actions: {
    // form
    resetFORM () {
      this.form = {}
      const columns = [
        'kode_rs',
        'kode_ruang'

      ]
      for (let i = 0; i < columns.length; i++) {
        this.setForm(columns[i], null)
      }
      this.setForm('flag_minta', 'all')
      this.setForm('max_stok', 0)
      this.setForm('minta', 0)
    },
    setForm (nama, val) {
      this.form[nama] = val
    },
    setOpen () {
      this.isOpen = !this.isOpen
    },
    newData () {
      this.resetFORM()
      this.edited = false
      this.isOpen = !this.isOpen
      // this.getGedungsData()
    },
    editData (val) {
      this.edited = true
      const keys = Object.keys(val)
      keys.forEach((key, index) => {
        this.setForm(key, val[key])
      })
      // kecuali yang ada di object user
      this.isOpen = !this.isOpen
    },

    setBarangs(val) {
      this.barangs = val
    },

    sanitazeForm() {
      const formini = Object.keys(this.form)
      formini.forEach((data) => {
        if (this.form[data] === null) {
          delete this.form[data]
        }
      })
    },
    // table
    setSearch (val) {
      this.params.q = val
      this.getDataTable()
    },
    setOder (payload) {
      this.params.order_by = payload
      this.params.sort === 'desc'
        ? (this.params.sort = 'asc')
        : (this.params.sort = 'desc')
      this.getDataTable()
    },
    setPage (payload) {
      // console.log('setPage', payload)
      this.params.page = payload
      this.getDataTable()
    },
    setPerPage (payload) {
      this.params.per_page = payload
      this.params.page = 1
      this.getDataTable()
    },
    setColumns (payload) {
      // const thumb = payload.map((x) => Object.keys(x))
      // this.columns = thumb[0]
      this.columns = ['kode_rs', 'barang', 'ruang', 'max_stok', 'minta', 'flag_minta']
      // console.log('columns', this.columns)
    },

    refreshTable () {
      this.params.page = 1
      this.getDataTable()
    },
    // initial data
    getInitialData() {
      this.getDataBarang()
    },

    // custom for this store

    setBarangSearch (val) {
      this.params.barang = val
      this.getDataTable()
    },
    barangSearch (val) {
      this.paramsBarang.q = val
      this.getDataBarang()
    },
    setPenggunaSearch (val) {
      this.params.ruang = val
      console.log('ruang', val)
      this.getDataTable()
    },
    ruangSearch (val) {
      // this.params.ruang = val
      this.paramsRuang.q = val
      this.getDataRuang()
    },
    // api
    // api related function
    getDataBarang() {
      const params = { params: this.paramsBarang }
      this.loadingBarang = true
      return new Promise(resolve => {
        api.get('v1/barangrs/index', params)
          .then(resp => {
            this.loadingBarang = false
            console.log('barangrs', resp)
            this.barangs = resp.data.data
            resolve(resp)
          })
          .catch(() => {
            this.loadingBarang = false
          })
      })
    },
    getDataRuang() {
      const params = { params: this.paramsRuang }
      this.loadingRuang = true
      return new Promise(resolve => {
        api.get('v1/ruang/index', params)
          .then(resp => {
            this.loadingRuang = false
            console.log('pengguna', resp)
            this.ruangs = resp.data.data
            resolve(resp)
          })
          .catch(() => {
            this.loadingRuang = false
          })
      })
    },
    // table

    getDataTable () {
      waitLoad('show')
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/minmaxpenggunastok/index', params)
          .then((resp) => {
            waitLoad('done')
            // console.log(resp)
            if (resp.status === 200) {
              this.items = resp.data.data
              this.meta = resp.data.meta
              this.setColumns(resp.data.data)
              console.log(resp.data.data)
              resolve(resp.data.data)
            }
          })
          .catch((err) => {
            waitLoad('done')
            reject(err)
          })
      })
    },
    // delete
    deletesData (payload) {
      this.loading = true
      const params = { id: payload }
      return new Promise((resolve, reject) => {
        api
          .post('v1/minmaxpenggunastok/destroy', params)
          .then((resp) => {
            // console.log(resp)
            notifSuccess(resp)
            this.loading = false
            this.getDataTable()
            resolve(resp)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    // form

    // tambah
    saveForm () {
      this.sanitazeForm()
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('v1/minmaxpenggunastok/store', this.form)
          .then((resp) => {
            // console.log('save data   ', resp)
            notifSuccess(resp)
            this.getDataTable()
            this.loading = false
            this.isOpen = false
            this.resetFORM()
            resolve(resp)
          })
          .catch((err) => {
            this.isOpen = false
            this.loading = false
            reject(err)
          })
      })
    },
    // permintaan maks ruangan
    simpanPermintaanMaksRuangan() {
      this.loading = true
      console.log('form permintaan maks ruangan', this.formRuangan)
      return new Promise((resolve, reject) => {
        api
          .post('v1/minmaxpenggunastok/store', this.formRuangan)
          .then((resp) => {
            // console.log('save data   ', resp)
            const formPermintaan = useTransaksiPermintaanForm()
            formPermintaan.getMinMaxPengguna()
            notifSuccess(resp)
            this.loading = false
            resolve(resp)
          })
          .catch((err) => {
            this.isOpen = false
            this.loading = false
            reject(err)
          })
      })
      // this.formRuangan.flag_minta = null
    },
    // setujui maks ruangan
    setujuiMaxRuangan () {
      // this.sanitazeForm()
      // this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('v1/minmaxpenggunastok/store', this.form)
          .then((resp) => {
            console.log('save data   ', resp.data)
            notifSuccess(resp)
            const ind = findWithAttr(this.items, 'id', resp.data.data.id)
            delete this.items[ind].loading
            console.log('save data index  ', ind, this.items[ind])
            // this.loading = false
            this.resetFORM()
            resolve(resp)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // terima semua
    accceptAll() {
      Dialog.create({
        title: 'Konfirmasi',
        message: 'Apakah Akan diterima semua sesuai dengan jumlah yang diminta ruangan?',
        ok: {
          'no-caps': true,
          push: true,
          color: 'primary'
        },
        cancel: {
          'no-caps': true,
          push: true,
          color: 'dark'
        }
      })
        .onOk(() => {
          this.loading = true
          return new Promise(resolve => {
            api.get('v1/minmaxpenggunastok/terima-semua')
              .then(resp => {
                notifSuccess(resp)
                this.getDataTable()
                this.loading = false
                resolve(resp)
              })
              .catch(() => {
                this.loading = false
              })
          })
        })
    }
  }
})
