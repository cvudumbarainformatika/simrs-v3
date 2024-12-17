import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const useExtraAbsensiLiburStore = defineStore('extra_absensi_libur', {
  state: () => ({
    loading: false,
    isOpen: false,
    items: [],
    meta: {},
    columns: [],
    columnHide: ['id', 'created_at', 'updated_at'],
    form: {},
    params: {
      q: '',
      page: 1,
      per_page: 10,
      order_by: 'created_at',
      sort: 'desc',
      tahun: date.formatDate(new Date(), 'YYYY')
    }
  }),
  actions: {
    resetFORM() {
      this.form = {}
      const columns = ['prota_id', 'user_id', 'tanggal']
      for (let i = 0; i < columns.length; i++) {
        this.setForm(columns[i], null)
      }
    },
    setParam(key, payload) {
      this.params[key] = payload
    },
    setOpen() {
      this.isOpen = !this.isOpen
    },
    setForm(key, payload) {
      this.form[key] = payload
    },
    setMeta(payload) {
      delete payload.data
      this.meta = payload
    },
    setItems(payload) {
      this.items = payload
    },
    deletesData(payload) {
      this.deleteId = payload
      // console.log('id', payload)
      this.deleteData()
    },
    // local table related function
    setSearch(val) {
      this.params.q = val
      this.getDataTable()
    },
    setOder(payload) {
      this.params.order_by = payload
      this.params.sort === 'desc'
        ? (this.params.sort = 'asc')
        : (this.params.sort = 'desc')
      this.getDataTable()
    },
    setPage(payload) {
      // console.log('setPage', payload)
      this.params.page = payload
      this.getDataTable()
    },
    setPerPage(payload) {
      this.params.per_page = payload
      this.params.page = 1
      this.getDataTable()
    },
    setColumns(payload) {
      // this.columns = ["nama", "masuk", "pulang", "warna", "durasi"];
      if (!payload) return
      const thumb = payload.map((x) => Object.keys(x))
      this.columns = thumb[0]
      // this.columns.sort()
      // this.columns.reverse()
      // console.log('columns', this.columns)
    },

    refreshTable() {
      this.params.page = 1
      this.getDataTable()
    },
    // data form related

    newData() {
      this.resetFORM()
      this.edited = false
      this.isOpen = !this.isOpen
    },
    editData(val) {
      this.edited = true
      const keys = Object.keys(val)
      keys.forEach((key, index) => {
        this.setForm(key, val[key])
      })
      console.log('edit', val)
      // kecuali yang ada di object user
      this.isOpen = !this.isOpen
    },
    sanitazeForm() {
      const formini = Object.keys(this.form)
      formini.forEach((data) => {
        if (this.form[data] === null) {
          delete this.form[data]
        }
      })
    },
    // update form masuk
    updateMasuk() {
      this.form.masuk = this.proxyMasuk
    },
    saveMasuk() {
      this.proxyMasuk = this.form.masuk
    },
    // update form pulang
    updatePulang() {
      this.form.pulang = this.proxyPulang
    },
    savePulang() {
      this.proxyPulang = this.form.pulang
    },
    // initial data
    getInitialData() {
      this.getDataTable()
    },
    // api related function
    // get data tabel
    getDataTable() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/pegawai/absensi/kategori/index', params)
          .then((resp) => {
            this.loading = false
            console.log('store kategori', resp.data)
            this.items = resp.data.data
            this.setColumns(resp.data.data)
            this.meta = resp.data
            this.resetFORM()
            resolve(resp)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    saveForm() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .post('v1/pegawai/absensi/kategori/store', this.form)
          .then((resp) => {
            console.log('save kategory', resp)
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
    deleteData() {
      this.loading = true
      const data = { id: this.deleteId }
      return new Promise((resolve, reject) => {
        api
          .post('v1/pegawai/absensi/kategori/destroy', data)
          .then((resp) => {
            this.loading = false
            notifSuccess(resp)
            this.getDataTable()
            resolve(resp)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    }
  }
})
