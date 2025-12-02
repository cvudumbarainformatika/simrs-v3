import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useAnggaranPendapatanStore = defineStore('anggaran-pendapatan-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      notrans: '',
      koderekeningblud: '',
      uraian_rekening: '',
      nilai: '',
      bidang: 'BAGIAN KEUANGAN',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    akuns: [],
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
        api.get('v1/anggaran/penyusunan/anggaranpendapatan/getrekening', params).then((resp) => {
          // console.log('KodeRekening', resp)
          if (resp.status === 200) {
            this.akuns = resp.data?.data
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/anggaran/penyusunan/anggaranpendapatan/save', this.form)

        if (resp.success === true) {
          this.form.notrans = resp?.data?.data?.notrans
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          notrans: '',
          koderekeningblud: '',
          uraian_rekening: '',
          nilai: '',
          tahun: '',
          bidang: 'BAGIAN KEUANGAN',
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
      const resp = await api.get('/v1/anggaran/penyusunan/anggaranpendapatan/index', params)
      console.log('resp anggaran pendapatan', resp)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      console.log('valedit', val)
      this.form.kode = val?.kode
      this.form.uraian = val?.uraian
      this.form.jenis = val?.jenis
      // this.form.group = val?.groups?.toString()

    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/master/akunlak/delete', payload)
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
