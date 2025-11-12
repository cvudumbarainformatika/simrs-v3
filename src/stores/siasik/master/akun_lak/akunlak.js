import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterAkunLakStore = defineStore('keuangan-master-akunlak', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      kode: '',
      uraian: '',
      jenis: '',
      kodejenis: ''
    },
    params: {
      q: '',
    },
    jenis: [
      { nama: 'Arus Kas Aktivitas Operasi', value: '010' },
      { nama: 'Arus Kas Aktivitas Investasi Aset non Keuangan', value: '020' },
      { nama: 'Arus Kas Aktivitas Pembiayaan', value: '030' },
      { nama: 'Arus Kas Aktivitas Pendanaan', value: '040' },
    ],
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
        api.get('v1/master/rekening/getrekening', params).then((resp) => {
          // console.log('KodeRekening', resp)
          if (resp.status === 200) {
            this.akuns = resp.data
            // console.log('KodeRekening', this.akuns)
            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    async simpanData() {
      this.loadingSave = true
      try {
        const resp = await api.post('v1/master/akunlak/simpan', this.form)

        if (resp.success === true) {
          this.form.kode = resp?.data?.data?.kode
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          kode: '',
          uraian: '',
          jenis: '',
          kodejenis: ''
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
      const resp = await api.get('/v1/master/akunlak/index', params)
      if (resp.status === 200) {
        this.items = resp.data
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
