import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterJasadanLainStore = defineStore('master-jasa-lain-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      kode: '',
      nama: '',

    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    akuns: [],
    bidangs: [],
    optionrekening: [],
  }),
  actions: {
    setForm(key, val) {
      this.form[key] = val
    },
    getRekening() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/master/siasik/jasa/getrekening', params).then((resp) => {
          // console.log('Get Pegawai', resp)
          if (resp.status === 200) {
            this.akuns = resp.data?.data
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    // getBidang() {
    //   this.loading = true
    //   const params = { params: this.params }
    //   return new Promise((resolve) => {
    //     api.get('v1/master/siasik/ptk/getbidang', params).then((resp) => {
    //       // console.log('Get Bidang', resp)
    //       if (resp.status === 200) {
    //         this.bidangs = resp.data?.data
    //         this.loading = false
    //         resolve(resp)
    //       }
    //     }).catch(() => { this.loading = false })
    //   })
    // },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/master/siasik/jasa/save', this.form)
        console.log('resp', resp)
        if (resp.success === true) {
          this.form.kode = resp?.data?.data?.kode
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          kode: '',
          nama: '',

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
      const resp = await api.get('/v1/master/siasik/jasa/index', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.kode = val.kode
      this.form.nama = val.nama

    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/master/siasik/jasa/delete', payload)
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
