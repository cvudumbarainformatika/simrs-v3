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
      per_page: 100,
      page: 1,
    },
    akuns: [],
    akunslak: [],
    optionrekening: [],
    optionrekeninglak: [],
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
    getLak() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/master/akunlak/select', params).then((resp) => {
          // console.log('KodeRekening', resp)
          if (resp.status === 200) {
            this.akunslak = resp.data?.data
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

      }
      this.loading = false
    },

    OptionRekening(val) {
      if (!val?.kodeall3) return

      const exists = this.optionrekening.find(
        o => o.kodeall3 === val.kodeall3
      )

      if (!exists) {
        this.optionrekening.unshift({
          kodeall3: val.kodeall3,
          uraian: val.uraian
        })
      }
    },
    editForm(val) {
      // pastikan option edit ada
      this.OptionRekening({
        kodeall3: val?.kode50,
        uraian: val?.uraian50
      })

      this.OptionRekening({
        kodeall3: val?.kode_bast,
        uraian: val?.uraian_bast
      })

      this.OptionRekening({
        kodeall3: val?.kode_bastx,
        uraian: val?.uraian_bastx
      })

      // isi form
      Object.assign(this.form, {
        kodeall: val?.kodeall,

        kode50: val?.kode50,
        uraian50: val?.uraian50,

        kode_bast: val?.kode_bast,
        uraian_bast: val?.uraian_bast,

        kode_bastx: val?.kode_bastx,
        uraian_bastx: val?.uraian_bastx,

        kode_bastcair1: val?.kode_bastcair1,
        uraian_bastcair1: val?.uraian_bastcair1,
        kode_bastcairx: val?.kode_bastcairx,
        uraian_bastcairx: val?.uraian_bastcairx,
        kode_bastcair2: val?.kode_bastcair2,
        uraian_bastcair2: val?.uraian_bastcair2,

        kode_cair1: val?.kode_cair1,
        uraian_cair1: val?.uraian_cair1,
        kode_cairx: val?.kode_cairx,
        uraian_cairx: val?.uraian_cairx,
        kode_cair2: val?.kode_cair2,
        uraian_cair2: val?.uraian_cair2,

        kode_lak: val?.kode_lak,
        uraian_lak: val?.uraian_lak,

        kd_blud: val?.kd_blud,
        ur_blud: val?.ur_blud
      })
      console.log('valedit', this.form)
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
      // this.getSistemBayar()
    },
  }
})
