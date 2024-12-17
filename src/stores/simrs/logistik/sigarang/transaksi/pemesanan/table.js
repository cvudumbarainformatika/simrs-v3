import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { notifCenterVue, notifSuccess } from 'src/modules/utils'
// import { routerInstance } from 'src/boot/router'
import { useTransaksiPemensananForm } from './form'

export const useTransaksiPemesananTable = defineStore('transaksi_pemesanan_table', {
  state: () => ({
    items: [],
    meta: {},
    item: {},
    loading: false,
    params: {
      q: '',
      page: 1,
      per_page: 10,
      order_by: 'id',
      sort: 'desc'
    },
    columns: [],
    columnHide: ['id', 'kode_satuan', 'created_at', 'updated_at', 'pemesanan_id']
  }),
  getters: {
    getterColumns (state) {
      return state.columns.filter((el) => !state.columnHide.includes(el))
    }
  },
  actions: {
    // local table related function
    setSearch (val) {
      this.params.q = val
      this.getDataTable()
    },
    resetData () {
      this.items = []
      this.meta = {}
      this.item = {}
    },
    setParam (key, val) {
      this.params[key] = val
    },
    setForm (val) {
      const store = useTransaksiPemensananForm()
      const columns = [
        'tanggal',
        'reff',
        'nomor',
        'kontrak',
        'kode_rs',
        'kode_108',
        'kode_satuan',
        'kode_perusahaan',
        'kode_gudang',
        'kode_stok_minimun',
        'qty',
        'harga',
        'sub_total'
      ]
      const terima = val.nomor.split('/')
      const sp = terima[3].split('-')

      store.terima.nomer_urut = terima[2]
      store.terima.bidang = sp[1]
      store.terima.bulan = sp[5]
      // console.log('val', terima)

      columns.forEach(data => {
        store.form[data] = val[data]
        // console.log('each', val[data], data)
      })
      // store.form.kode_rs = val.detals[0].kode_rs
      // store.form.kode_108 = val.detals[0].kode_108
      store.kontrakSelected(val.details_kontrak)
      // console.log('form', store.form)
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
    pindah (from, to) {
      const toIn = this.columns.indexOf(to)
      const fromIn = this.columns.indexOf(from)
      const mau = this.columns.splice(fromIn, 1)[0]
      this.columns.splice(toIn, 0, mau)
    },
    setColumns (payload) {
      // const thumb = payload.map((x) => Object.keys(x))
      // this.columns = thumb[0].sort()
      this.columns = [
        'kode_rs',
        'nama_barang',
        'kode_108',
        'uraian_108',
        'kode_50',
        'uraian_50',
        'qty',
        'harga',
        'merk',
        'satuan_besar',
        'isi',
        'satuan_kecil',
        'sub_total'
      ]
      // // pindah harga ke dekat jumlah / qty
      // this.pindah('harga', 'qty')
      // this.pindah('satuan', 'kode_satuan')
      // console.log('columns', this.columns)
    },

    refreshTable () {
      this.params.page = 1
      this.getDataTable()
    },

    // api related function

    // ambil
    getDataTable () {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/transaksi/pemesanan/draft', params)
          .then((resp) => {
            this.loading = false
            // console.log('data ', resp)
            // console.log('data[0] ', resp.data.data[0])
            if (resp.data.message === 'completed') {
              // console.log(resp)
              notifCenterVue('data sudah disimpan dan dikunci, tidak diperkenannkan untuk diubah')
              resolve('completed')
              return
            }
            if (resp.status === 200) {
              // console.log('Detail length', resp.data.length)
              if (resp.data.length) {
                // console.log('with detail', resp.data)
                this.items = resp.data[0].details
                this.setColumns(resp.data[0].details)
                this.setForm(resp.data[0])
                // console.log('ada')
                resolve('ada')
              } else {
                // console.log('ambil baru')
                resolve('get new')
              }
              // this.meta = resp.data.meta
            }
          })
          .catch((err) => {
            this.loading = false
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
          .post('v1/transaksi/pemesanan/delete-details', params)
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
    }
  }
})
