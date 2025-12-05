import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterKegiatanBludStore = defineStore('master-kegiatan-blud-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      no: '',
      nomenklatur: '',
      kode: '',
      organisasi_nama: '',
      organisasi_kode1: '',
      organisasi_kode2: '',
      organisasi_kode3: '',
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
        const resp = await api.post('v1/master/siasik/kegiatanblud/save', this.form)

        if (resp.success === true) {
          this.form.no = resp?.data?.data?.no
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          no: '',
          kode: '',
          nomenklatur: '',
          organisasi_nama: '',
          organisasi_kode1: '',
          organisasi_kode2: '',
          organisasi_kode3: '',
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
      const resp = await api.get('/v1/master/siasik/kegiatanblud/index', params)
      // console.log('resp Kegiatan BLUD', resp)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      // console.log('valedit', val)
      this.form.no = val.no
      this.form.kode = val.kode
      this.form.nomenklatur = val.nomenklatur
      this.form.organisasi_nama = val.organisasi_nama
      this.form.organisasi_kode1 = val.organisasi_kode1
      this.form.organisasi_kode2 = val.organisasi_kode2
      this.form.organisasi_kode3 = val.organisasi_kode3
      this.form.tahun = val.tahun
      // this.form.group = val?.groups?.toString()

    },
    async deleteData(no) {
      this.loadingDelete = true
      const payload = { no }
      try {
        const resp = await api.post('/v1/master/siasik/kegiatanblud/delete', payload)
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
