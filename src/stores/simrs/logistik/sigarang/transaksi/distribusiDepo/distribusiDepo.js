import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess, uniqueId } from 'src/modules/utils'
// import { useSettingsStore } from '../../settings/setting'

export const useDistribusiDepoStore = defineStore('distribusi_depo_store', {
  state: () => ({
    loading: true,
    isOpen: false,
    items: [],
    meta: {},
    columns: [],
    columnHide: ['id', 'created_at', 'updated_at'],
    deleteId: null,
    params: {
      q: '',
      page: 1,
      per_page: 10,
      order_by: 'created_at',
      sort: 'asc'
    },
    // custom for this store
    form: {
      no_distribusi: null,
      kode_depo: null,
      tanggal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      details: []
    },
    display: {
      tanggal: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    input: {
      kode_barang: null,
      jumlah: 0
    },
    detail: {
      kode_rs: null,
      kode_satuan: null,
      kode_108: null,
      jumlah: 0
    },
    displays: [],
    depos: [],
    barangrses: [],
    barangrHasStoks: [],
    mappingBarangs: [],
    minMaxDepos: [],
    stoks: [],
    distribusies: [],
    hasStok: false,
    loadingHasStok: false
  }),
  actions: {
    resetFORM() {
      this.form = {}
      const columns = [
        'no_distribusi',
        'kode_depo'
      ]

      for (let i = 0; i < columns.length; i++) {
        this.setForm(columns[i], null)
      }
      this.form.details = []
      this.setNoDistribusi()
      this.form.tanggal = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.display.tanggal = date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    resetDisplay() {
      this.displays = []
    },
    setForm(key, payload) {
      this.form[key] = payload
    },
    setParam(key, payload) {
      this.params[key] = payload
    },
    setOpen() {
      this.isOpen = !this.isOpen
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
      this.columns = [
        'tanggal',
        'tanggal_distribusi',
        'no_distribusi',
        'no_permintaan',
        'tanggal_verif',
        'pengguna',
        'pj',
        'status',
        'aksi']
      // if (!payload) return
      // const thumb = payload.map((x) => Object.keys(x))
      // this.columns = thumb[0]
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
      // console.log('edit', val)
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
    getInitialData() {
      this.getDataTable()
      this.getDataDepo()
      this.setNoDistribusi()
      // this.getBarangRs()
      this.getMappingBarang()
      this.getMinMaxDepo()
      this.getCurrentStok()
      this.getToDistributed()
    },
    // this custom store
    setNoDistribusi() {
      this.setForm('no_distribusi', 'DSTRDP-' + uniqueId())
      this.setForm('reff', 'reff-' + uniqueId())
    },
    setInput(key, val) {
      this.input[key] = val
    },
    resetInput() {
      this.input = {
        kode_barang: null,
        jumlah: 0
      }
    },
    resetDetail() {
      this.detail = {
        kode_rs: null,
        kode_satuan: null,
        kode_108: null,
        jumlah: 0
      }
    },
    setDetail(key, val) {
      this.detail[key] = val
    },
    resetAll() {
      this.resetFORM()
      this.resetInput()
      this.displays = []
      this.detail = {}
    },
    filterBarangHasStok(val) {
      // const setting = useSettingsStore()
      this.barangrHasStoks = []

      // console.log('Stoks', this.stoks)
      if (this.stoks.length) {
        // this.barangrses = this.stoks.filter(stok => { return stok.maping.kode_gudang === val })
        const apem = this.stoks.filter(stok => {
          if (stok.barang) {
            return stok.barang.kode_depo === val
          } else {
            return false
          }
        })
        this.barangrses = apem.filter(anu => { return anu !== false })
        // console.log('barangrses', this.barangrses)
        const temp = this.barangrses.map(data => {
          data.nama = data.barang.nama
          data.kode = data.barang.kode
          data.kode_satuan = data.barang.kode_satuan
          return data
        })
        // console.log('barangrses after if', this.barangrses)

        // const keys = Object.keys(this.stoks)
        // console.log('stoks keys', keys)
        // const ape = keys.map(key => {
        //   const temp = this.barangrses.filter(data => {
        //     return data.stok > 0
        //   })

        //   if (temp.length) {
        //     const barang = {
        //       nama: temp[0].barang.nama,
        //       kode: temp[0].barang.kode,
        //       kode_satuan: temp[0].barang.kode_satuan
        //     }
        //     return barang
        //   } else return false
        // })
        const filtered = temp.filter(data => {
          return data.stok > 0
        })

        if (filtered[0] === false) {
          this.barangrHasStoks = []
        } else {
          this.barangrHasStoks = filtered
        }
      } else {
        setTimeout(() => {
          if (this.stoks.length) {
            this.barangrses = this.stoks.filter(stok => { return stok.barang.kode_depo === val })
            // console.log('barangrses with timeout', this.barangrses)
            const ape = this.stoks.map(stok => {
              const temp = this.barangrses.filter(data => {
                return data.kode_rs === stok.kode_rs
              })
              if (temp.length) {
                const barang = {
                  nama: temp[0].barangrs.nama,
                  kode: temp[0].barangrs.kode,
                  kode_satuan: temp[0].barangrs.kode_satuan
                }
                return barang
              } else return false
            })
            // console.log('apem', ape)
            if (ape[0] === false) {
              this.barangrHasStoks = []
            } else {
              this.barangrHasStoks = ape
            }
          }
        }, 10000)
      }
    },
    // api related function
    // get data tabel
    getDataTable() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/transaksi/distribusidepo/index', params)
          .then((resp) => {
            this.loading = false
            // console.log('data table', resp.data)
            this.items = resp.data.data.data
            this.setColumns(resp.data)
            this.meta = resp.data.meta
            resolve(resp)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    // get data distribusi yang belum di terima
    getToDistributed() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('v1/transaksi/distribusidepo/distribusi', params)
          .then((resp) => {
            this.loading = false
            // console.log('data disribusi', resp.data)
            this.distribusies = resp.data
            resolve(resp)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    // get data depo
    getDataDepo() {
      this.loading = true
      return new Promise(resolve => {
        api.get('v1/gudang/depo')
          .then(resp => {
            this.loading = false
            // console.log('depo', resp)
            this.depos = resp.data
            resolve(resp)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    // get data stok
    getCurrentStok() {
      this.loadingHasStok = true
      return new Promise(resolve => {
        api.get('v1/stok/current-gudang')
          .then(resp => {
            this.loadingHasStok = false
            // console.log('stok', resp.data)
            this.stoks = resp.data
            if (this.barangrses.length) {
              this.filterBarangHasStok()
            } else {
              setTimeout(() => {
                if (this.barangrses.length) {
                  this.filterBarangHasStok()
                }
              }, 1500)
            }
            resolve(resp)
          })
          .catch(() => {
            this.loadingHasStok = false
          })
      })
    },
    // get data barang rs
    getBarangRs() {
      this.loading = true
      return new Promise(resolve => {
        api.get('v1/barangrs/barangrs')
          .then(resp => {
            this.loading = false
            // console.log('barangrs', resp)
            this.barangrses = resp.data
            resolve(resp)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    // get data mapping barang
    getMappingBarang() {
      if (!this.mappingBarangs.length) {
        this.loading = true
        return new Promise(resolve => {
          api.get('v1/mapingbarang/mapingwith')
            .then(resp => {
              this.loading = false
              // console.log('maping barang', resp)
              this.mappingBarangs = resp.data
              resolve(resp)
            })
            .catch(() => {
              this.loading = false
            })
        })
      }
    },
    // get data minMaxDepo
    getMinMaxDepo() {
      if (!this.minMaxDepos.length) {
        this.loading = true
        return new Promise(resolve => {
          api.get('v1/minmaxdepostok/all')
            .then(resp => {
              this.loading = false
              // console.log('minmaxdepo', resp)
              this.minMaxDepos = resp.data
              resolve(resp)
            })
            .catch(() => {
              this.loading = false
            })
        })
      }
    },
    resetAllData() {
      this.resetFORM()
      this.resetInput()
      this.resetDisplay()
      this.getDataTable()
      this.getToDistributed()
      this.getCurrentStok()
    },
    // save
    saveForm() {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/transaksi/distribusidepo/store', this.form)
          .then(resp => {
            this.loading = false
            notifSuccess(resp)
            this.resetAllData()
            resolve(resp)
          }).catch(() => {
            this.resetAll()
            this.loading = false
          })
      })
    },
    hapusDataStokGudang(form) {
      this.loading = true
      console.log('form hapus', form)
      return new Promise(resolve => {
        api.post('v1/transaksi/distribusidepo/hapus-data-gudang', form)
          .then(resp => {
            this.loading = false
            notifSuccess(resp)
            resolve(resp.data)
          })
          .catch(() => { this.loading = false })
      })
    }
  }
})
