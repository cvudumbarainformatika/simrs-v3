import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useTransaksiNPDUP = defineStore('transaksi-npd-up-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    disabled: false,
    dialogCetak: false,
    form: {
      nosppup: '',
      tglTrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      kdBendaharaKeluar: '',
      bendaharaKeluar: '',
      jumlahspp: '',
      bank: '',
      kodeRek: '',
      uraian: '',
      userentry: '',
      tglentry: '',
      rekening: ''
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    bendahara: {},
    datattd: [],
    bank: [],
    satuans: [],
    optionrekening: [],
    cetaknotadinas: []
  }),
  actions: {
    setForm(key, val) {
      this.form[key] = val
    },
    getBendahara() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/transaksi/panjar/bendaharapengeluaran', params).then((resp) => {
          // console.log('Get Bendahara', resp)
          if (resp.status === 200) {
            this.bendahara = resp.data
            this.form.kdBendaharaKeluar = resp.data.nip
            this.form.bendaharaKeluar = resp.data.nama
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    getBank() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/transaksi/panjar/bank', params).then((resp) => {
          // console.log('Get Bank', resp)
          if (resp.status === 200) {
            this.bank = resp.data
            this.form.bank = resp.data.namaRek
            this.form.kodeRek = resp.data.noRek
            this.form.rekening = resp.data.jabatan
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    ttd() {
      this.loading = true
      // const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api.get('/v1/siasik/ttd/ttdpengesahan')
          .then((resp) => {
            if (resp.status === 200) {
              // console.log('TTD', resp.data)
              this.datattd = resp.data

            }
            this.loading = false

            resolve(resp.data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/transaksi/panjar/save', this.form)
        // console.log('resp', resp)
        if (resp.success === true) {
          this.form.nosppup = resp?.data?.data?.nosppup
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          nosppup: '',
          tglTrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
          kdBendaharaKeluar: '',
          bendaharaKeluar: '',
          jumlahspp: '',
          bank: '',
          kodeRek: '',
          uraian: '',
          userentry: '',
          tglentry: '',
        }
        this.getData()
        this.loadingSave = false
      } catch (error) {
        console.log(error)
        this.loadingSave = false
      } finally {
        this.loadingSave = false
      }
    },
    async getData() {
      this.items = []
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/transaksi/panjar/index', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.nosppup = val.nosppup
      this.form.tglTrans = val.tglTrans
      this.form.kdBendaharaKeluar = val.kdBendaharaKeluar
      this.form.bendaharaKeluar = val.bendaharaKeluar
      this.form.jumlahspp = val.jumlahspp
      this.form.bank = val.bank
      this.form.kodeRek = val.kodeRek
      this.form.uraian = val.uraian
    },
    async deleteData(nosppup) {
      this.loadingDelete = true
      const payload = { nosppup }
      try {
        const resp = await api.post('/v1/transaksi/panjar/delete', payload)
        if (resp.status === 200) {
          // this.items = resp?.data?.data
          notifSuccess(resp)
          this.getData()
        }
        this.loadingDelete = false
      }
      catch (error) {
        notifErr(error)
        this.loadingDelete = false
      }
    },
    async kunciData(row) {
      this.loading = true
      // const payload = { id: row.id }
      try {
        const resp = await api.post('/v1/transaksi/panjar/kunci', row)
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

    search(val) {
      this.params.q = val
      this.getData()
    },


    async getDatabelumVerif() {
      this.items = []
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/transaksi/panjar/belumverif', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
      }
      this.loading = false
    },
    async getDatasudahVerif() {
      this.items = []
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/transaksi/panjar/sudahverif', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
      }
      this.loading = false
    },

    async verifData(row) {
      this.loading = true
      // const payload = { id: row.id }
      try {
        const resp = await api.post('/v1/transaksi/panjar/verif', row)
        if (resp.status === 200) {
          // this.items = resp?.data?.data
          notifSuccess(resp)
          this.getDatabelumVerif()
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


    async getDatabelumcreate() {
      this.items = []
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/transaksi/panjar/databelumcreate', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
      }
      this.loading = false
    },

    async getDatasudahcreate() {
      this.items = []
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/transaksi/panjar/datasudahcreate', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
      }
      this.loading = false
    },

    async createNpk(row) {
      this.loading = true
      // const payload = { id: row.id }
      try {
        const resp = await api.post('/v1/transaksi/panjar/createnpk', row)
        if (resp.status === 200) {
          // this.items = resp?.data?.data
          notifSuccess(resp)
          this.getDatabelumcreate()
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

  }
})
