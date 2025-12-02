import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const useMasterRekeningJurnalStore = defineStore('keuangan-master-rekeningjurnal', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    form: {
      kodeall: '',
      kode50: '',
      uraian50: '',

      kode_bast: '',
      uraian_bast: '',
      kode_bastx: '',
      uraian_bastx: '',

      kode_bastcair1: '3.1.02.05.01.0001',
      uraian_bastcair1: 'Estimasi Perubahan SAL',
      kode_bastcairx: '',
      uraian_bastcairx: '',
      kode_bastcair2: '',
      uraian_bastcair2: '',

      kode_cair1: '3.1.02.05.01.0001',
      uraian_cair1: 'Estimasi Perubahan SAL',
      kode_cairx: '',
      uraian_cairx: '',
      kode_cair2: '',
      uraian_cair2: '',

      kode_lak: '',
      uraian_lak: '',
      kd_blud: '1.1.01.04.01.0001',
      ur_blud: 'Kas di BLUD',
    },
    params: {
      q: '',
      levelberapa: 17,
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
        api.get('v1/master/rekening/getrekening', params).then((resp) => {
          // console.log('KodeRekening', resp)
          if (resp.status === 200) {
            this.akuns = resp.data?.data
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
        const resp = await api.post('v1/master/rekening/simpan', this.form)
        if (resp.success === true) {
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          kodeall: '',
          kode50: '',
          uraian50: '',

          kode_bast: '',
          uraian_bast: '',
          kode_bastx: '',
          uraian_bastx: '',

          kode_bastcair1: '3.1.02.05.01.0001',
          uraian_bastcair1: 'Estimasi Perubahan SAL',
          kode_bastcairx: '',
          uraian_bastcairx: '',
          kode_bastcair2: '',
          uraian_bastcair2: '',

          kode_cair1: '3.1.02.05.01.0001',
          uraian_cair1: 'Estimasi Perubahan SAL',
          kode_cairx: '',
          uraian_cairx: '',
          kode_cair2: '',
          uraian_cair2: '',

          kode_lak: '',
          uraian_lak: '',
          kd_blud: '1.1.01.04.01.0001',
          ur_blud: 'Kas di BLUD'
        }
        this.loadingSave = false
      } catch (error) {
        console.log(error)
        this.loadingSave = false
      }
    },
    async getData() {
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/master/rekening/index', params)
      if (resp.status === 200) {
        this.items = resp.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {
      this.form.kode = val?.rs1
      this.form.nama = val?.rs2
      // this.form.group = val?.groups?.toString()
      if (val?.groups === '1')
        this.form.group = 'BPJS'
      else if (val?.groups === '2')
        this.form.group = 'UMUM'
      else if (val?.groups === '3')
        this.form.group = 'TAGIHAN'
    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/master/rekening/delete', payload)
        if (resp.status === 200) {
          this.items = resp?.data?.result
          notifSuccess(resp)
          this.loadingDelete = false
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
      this.getSistemBayar()
    },
  }
})
