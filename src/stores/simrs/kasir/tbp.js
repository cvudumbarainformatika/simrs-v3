import { defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"
import { notifSuccessVue } from "src/modules/utils"

export const useTbpKasirStore = defineStore('tbp-kasir-store', {
  state: () => ({
    item: [],
    items: [],
    itemskuitansi: [],
    itemspiutang: '0',
    itemskasir: [],
    itemscetaktbprincian: [],
    meta: null,
    loading: false,
    loadingsimpan: false,
    loadingcarikuitansi: false,
    loadingbatalkwitansi: false,
    loadingcetaktbp: false,
    loadinghapus: false,
    nokwitansi: '',
    dialogCetakTbp: false,
    masterkasir: [],
    tanggal: {
      from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    params: {
      q: '',
      tgl: '',
      page: 1,
      per_page: 10,
      jenislayanan: 'SEMUA',
      tgldari: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglsampai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    },
    form: {
      no_tbp: '',
      tgl_tbp: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tgl_terima: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      no_kwitansi: [],
      penerima: '',
      namapenerima: '',
      kasir: '',
      kdkasir: '',
      pelayanan: 'rajal'
    },

    formx: {
      tgl_tbp: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      tgl_terima: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    verifikasi: '',

    paramscarikuitansi: {
      tgldari: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglsampai: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      kasir: '',
      kodekasirtbp: ''
    },
    formtanggal: {
      dari: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      sampai: date.formatDate(Date.now(), 'DD MMMM YYYY')
    }
  }),
  actions: {
    setDate(payload) {
      this.params.page = 1
      this.params.tgl = payload
      this.getDataTbp()
    },
    setQ(payload) {
      this.params.page = 1
      this.params.q = payload
      this.getDataTbp()
    },
    setPerPage(payload) {
      this.params.page = 1
      this.params.per_page = payload
      this.getDataTbp()
    },
    getmasterkasir() {
      api.get('/v1/simrs/kasir/tbp/masterkasir')
        .then(resp => {
          // console.log('master kasir', resp)
          this.masterkasir = resp.data?.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getDataTbp() {
      this.loading = true
      const params = { params: this.params }
      await api.get('/v1/simrs/kasir/tbp/getdatatbp', params)
        .then(resp => {
          console.log('tbp', resp)
          this.loading = false
          this.meta = resp.data?.data
          this.items = resp.data?.data?.data
          console.log('items', this.items)
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    goToPage(val) {
      this.params.page = val
      this.getDataTbp()
    },
    async cariKwitansi() {
      this.loadingcarikuitansi = true
      const params = { params: this.paramscarikuitansi }
      await api.get('/v1/simrs/kasir/tbp/cariKwitansi', params)
        .then(resp => {
          this.itemskuitansi = []
          this.itemskuitansi = resp.data?.data
          this.itemspiutang = resp.data?.piutang
          this.loadingcarikuitansi = false
        })
        .catch(err => {
          console.log(err)
          this.loadingcarikuitansi = false
        })
    },
    async getmasterkasir() {
      await api.get('/v1/simrs/kasir/tbp/getmasterkasir')
        .then(resp => {
          this.loading = false
          this.itemskasir = resp.data?.data
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    async simpanTbp() {
      this.loadingsimpan = true
      await api.post('/v1/simrs/kasir/tbp/simpanTbp', this.form)
        .then(resp => {
          if (resp.status === 200) {
            this.loadingsimpan = false
            // const data = resp.data?.data[0]
            // this.items.unshift(data)
            // this.itemskuitansi = []
            this.itemskuitansi = resp.data?.data[0]?.kwitansi.length > 0 ? resp.data?.data[0]?.kwitansi : resp.data?.data[0]?.karcis
            this.form.no_tbp = resp?.data?.data[0]?.no_tbp
            notifSuccessVue('Data sukses tersimpan')
            // console.log('simpan tbp', resp?.data?.data[0]?.no_tbp)
          }
        })
        .catch(err => {
          console.log(err)
          this.loadingsimpan = false
        })
    },
    resetForm() {
      this.itemskuitansi = []
      this.form.no_tbp = ''
      this.form.no_kwitansi = []
      this.form.tgl_tbp = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.form.tgl_terima = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.form.kasir = ''
      this.form.kdkasir = ''

      this.formx.tgl_tbp = date.formatDate(Date.now(), 'DD MMMM YYYY')
      this.formx.tgl_terima = date.formatDate(Date.now(), 'DD MMMM YYYY')

    },
    async batal(nokwitansi) {
      this.nokwitansi = nokwitansi
      this.loadingbatalkwitansi = true
      const payload = { nokwitansi: nokwitansi }
      await api.post('/v1/simrs/kasir/tbp/batal', payload)
        .then(resp => {
          if (resp.status === 200) {
            this.loadingbatalkwitansi = false
            this.itemskuitansi = this.itemskuitansi.filter(x => x.nokwitansi !== nokwitansi)
            notifSuccessVue('Data sukses dibatalkan')
          }
        })
        .catch(err => {
          console.log(err)
          this.loadingbatalkwitansi = false
        })
    },
    async getrincianTbp(no_tbp) {
      this.loadingcetaktbp = true
      await api.get('/v1/simrs/kasir/tbp/getrincianTbp', { params: { no_tbp: no_tbp } })
        .then(resp => {
          this.itemscetaktbprincian = resp.data?.data
          this.loadingcetaktbp = false
        })
        .catch(err => {
          console.log(err)
          this.loadingcetaktbp = false
        })
    },
    async hapusTbp(data) {
      this.loadinghapus = data?.no_tbp
      const payload = { no_tbp: data?.no_tbp }
      await api.post('/v1/simrs/kasir/tbp/hapusTbp', payload)
        .then(resp => {
          if (resp.status === 200) {
            this.loadinghapus = false
            this.items = this.items.filter(x => x.no_tbp !== data?.no_tbp)

            // this.getDataTbp()
            notifSuccessVue('Data sukses dihapus')
          }
        })
        .catch(err => {
          console.log(err)
          this.loadinghapus = false
        })
    }
  }
})
