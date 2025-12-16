import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterMappingKegiatanPtkStore = defineStore('master-mapping-kegiatanptk-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      kodepptk: '',
      namapptk: '',
      kodekegiatan: '',
      kegiatan: '',
      kodebidang: '',
      bidang: '',
      alias: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    reqs: {
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    akuns: [],
    bidangs: [],
    kegiatans: [],
    optionrekening: [],
    optionkegiatan: [],
  }),
  actions: {
    setForm(key, val) {
      this.form[key] = val
    },
    getPegawai() {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('v1/master/siasik/ptk/index', params).then((resp) => {
          // console.log('Get Pegawai', resp)
          if (resp.status === 200) {
            this.akuns = resp.data
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    getKegiatan() {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('v1/master/siasik/kegiatanblud/index', params).then((resp) => {
          console.log('Get Kegiatang', resp)
          if (resp.status === 200) {
            this.kegiatans = resp.data
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/master/siasik/mappingkegiatanptk/save', this.form)

        if (resp.success === true) {
          // this.form.notrans = resp?.data?.data?.notrans
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          kodepptk: '',
          namapptk: '',
          kodekegiatan: '',
          kegiatan: '',
          kodebidang: '',
          bidang: '',
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
      const resp = await api.get('/v1/master/siasik/mappingkegiatanptk/index', params)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.kodepptk = val.kodepptk
      this.form.namapptk = val.namapptk
      this.form.kodekegiatan = val.kodekegiatan
      this.form.kegiatan = val.kegiatan
      this.form.kodebidang = val.kodebidang
      this.form.bidang = val.bidang
      this.form.alias = val.alias
      this.form.tahun = val.tahun

    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/master/siasik/mappingkegiatanptk/delete', payload)
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
