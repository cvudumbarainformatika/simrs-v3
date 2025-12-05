import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterPejabatTeknisStore = defineStore('master-pejabat-teknis-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      nip: '',
      nama: '',
      kodeBagian: '',
      bagian: '',
      alias: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
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
    getPegawai() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/master/siasik/ptk/getpegawai', params).then((resp) => {
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
        const resp = await api.post('v1/master/siasik/ptk/save', this.form)

        if (resp.success === true) {
          // this.form.notrans = resp?.data?.data?.notrans
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          nip: '',
          nama: '',
          kodeBagian: '',
          bagian: '',
          alias: '',
          tahun: date.formatDate(Date.now(), 'YYYY'),
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
      const resp = await api.get('/v1/master/siasik/ptk/index', params)
      // console.log('resp Data PTK', resp)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.nip = val.nip
      this.form.nama = val.nama
      this.form.kodeBagian = val.kode_bagian
      this.form.bagian = val.bagian
      this.form.alias = val.alias
      this.form.tahun = val.tahun
      // this.form.group = val?.groups?.toString()

    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/master/siasik/ptk/delete', payload)
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
