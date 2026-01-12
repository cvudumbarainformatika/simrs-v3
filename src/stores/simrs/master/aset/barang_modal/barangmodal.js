import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterBarangModalStore = defineStore('master-barang-modal-store', {
  state: () => ({
    items: [],
    itemsrek108: [],
    itemsrek50: [],
    itemsaspak: [],
    itemsatuan: [],
    loading: false,
    loadin50: false,
    loadingaspak: false,
    loadingSave: false,
    loadingDelete: false,
    loading108: false,
    form: {
      kdaset: '',
      namaaset: '',
      kd108: '',
      uraian108: '',
      kd50: '',
      uraian50: '',
      kdaspak: '',
      uraianaspak: '',
      satuan: '',
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
    async getsatuan() {
      const resp = await api.get('/v1/satuan/satuan')
      if (resp.status === 200) {
        this.itemssatuan = resp?.data
      }
      this.loading = false
    },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('/v1/master/maset/simpan', this.form)

        if (this.form.id !== resp?.data?.data?.id) {
          const data = resp?.data?.data
          this.items.unshift(data)
        } else {
          const index = this.items.findIndex(item => item.id === this.form.id)
          this.items[index] = resp?.data?.data
        }

        notifSuccessVue(resp?.data?.message)
        this.resetForm()

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
      if (resp.status === 200) {
        this.items = resp?.data?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.id = val.id
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
      const resp = await api.get('/v1/barang108/maping-50', params)
      if (resp.status === 200) {
        this.itemsrek108 = resp?.data?.data
        this.loading108 = false
      }
      this.loading = false
    },
    async getrek50() {
      this.loadin50 = true

      const resp = await api.get('/v1/rekening50/semua')
      if (resp.status === 200) {
        this.itemsrek50 = resp?.data
        this.loadin50 = false
      }
      this.loadin50 = false
    },
    async getkodeaspak() {
      this.loadingaspak = true
      const resp = await api.get('/v1/master/maset/indexaspak')
      if (resp.status === 200) {
        this.itemsaspak = resp?.data
        this.loadingaspak = false
      }
      this.loadingaspak = false
    },
    resetForm() {
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
    }
  }
})
