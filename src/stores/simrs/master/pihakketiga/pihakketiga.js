import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterPihakketigaStore = defineStore('master-pihakketiga-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      kode: '',
      nama: '',
      alamat: '',
      npwp: '',
      telepon: '',
      bank: '',
      norek: '',
      cp: '',
      kodemapsimrs: '',
      namasuplier: ''
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    akuns: [],
    bidangs: [],
    satuans: [],
    optionrekening: [],
  }),
  actions: {
    setForm(key, val) {
      this.form[key] = val
    },
    // getRekening() {
    //   this.loading = true
    //   const params = { params: this.params }
    //   return new Promise((resolve) => {
    //     api.get('v1/master/siasik/pihakketiga/getrekening', params).then((resp) => {
    //       // console.log('Get Pegawai', resp)
    //       if (resp.status === 200) {
    //         this.akuns = resp.data?.data
    //         this.loading = false
    //         resolve(resp)
    //       }
    //     }).catch(() => { this.loading = false })
    //   })
    // },
    // getData() {
    //   this.loading = true
    //   const params = { params: this.params }
    //   return new Promise((resolve) => {
    //     api.get('v1/master/siasik/pihakketiga/getdata', params).then((resp) => {
    //       // console.log('Get Pegawai', resp)
    //       if (resp.status === 200) {
    //         this.satuans = resp.data?.data
    //         this.loading = false
    //         resolve(resp)
    //       }
    //     }).catch(() => { this.loading = false })
    //   })
    // },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/master/pihakketiga/save', this.form)
        console.log('resp', resp)
        if (resp.success === true) {
          this.form.kode = resp?.data?.data?.kode
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          kode: '',
          nama: '',
          alamat: '',
          npwp: '',
          telepon: '',
          bank: '',
          norek: '',
          cp: '',
          kodemapsimrs: '',
          namasuplier: ''
        }
        this.getData()
        this.loadingSave = false
      } catch (error) {
        console.log(error)
        this.loadingSave = false
      }
    },
    async getData() {
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/master/pihakketiga/index', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.kode = val.kode
      this.form.nama = val.nama
      this.form.alamat = val.alamat
      this.form.npwp = val.npwp
      this.form.telepon = val.telepon
      this.form.bank = val.bank
      this.form.norek = val.norek
      this.form.cp = val.cp
      this.form.kodemapsimrs = val.kodemapsimrs
      this.form.namasuplier = val.namasuplier
    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/master/pihakketiga/delete', payload)
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
    search(val) {
      this.params.q = val
      this.getData()
    },
  }
})
