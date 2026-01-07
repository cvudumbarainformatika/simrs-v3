import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterBarangModalStore = defineStore('master-barang-modal-store', {
  state: () => ({
    items: [],
    itemsrek108: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    loading108: false,
    form: {
      kdaset: '',
      namaaset: '',
      kode108: '',
      uraian108: '',
      kode50: '',
      uraian50: '',
      kdaspak: '',
      uraianaspak: '',
      flaging: '',
    },
    params: {
      q: '',
      per_page: 100,
      page: 1,
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
        api.get('v1/master/siasik/kegiatanblud/getbidang', params).then((resp) => {
          // console.log('Get Bidang', resp)
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
        const resp = await api.post('/v1/master/maset/simpan', this.form)

        if (resp.success === true) {
          // this.form.no = resp?.data?.data?.no
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          kdaset: '',
          namaaset: '',
          kd108: '',
          uraian108: '',
          kd50: '',
          uraian50: '',
          kdaspak: '',
          uraianaspak: '',
          flaging: '',
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
      const resp = await api.get('/v1/master/maset/index', params)
      console.log('resp Kegiatan BLUD', resp)
      if (resp.status === 200) {
        this.items = resp?.data?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.kdaset = val.kdaset
      this.form.namaaset = val.namaaset
      this.form.kd108 = val.kd108
      this.form.uraian108 = val.uraian108
      this.form.kd50 = val.kd50
      this.form.uraian50 = val.uraian50
      this.form.kdaspak = val.kdaspak
      this.form.uraianaspak = val.uraianaspak
      this.form.flaging = val.flaging
      // this.form.group = val?.groups?.toString()

    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/master/maset/delete', payload)
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
    async getrek108() {
      this.loading108 = true
      const params = { params: this.params }
      const resp = await api.get('/v1/barang108/barang108', params)
      if (resp.status === 200) {
        this.itemsrek108 = resp?.data
        this.loading = false
      }
      this.loading = false
    },
  }
})
