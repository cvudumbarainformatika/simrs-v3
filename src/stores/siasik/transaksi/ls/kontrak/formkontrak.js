import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const formKontrakPekerjaan = defineStore('form_KontrakPekerjaan', {
  state: () => ({
    loading: false,
    disabled: false,
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      bidang: '',
      kegiatan: '',
      nip: null,
      kodebidang: null
    },
    form: {
      nokontrak: null,
      tgltrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglmulaikontrak: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglakhirkontrak: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      // Perusahaan
      kodeperusahaan: null,
      namaperusahaan: null,
      kodemapingrs: null,
      namasuplier: null,
      // PPTK
      kodepptk: null,
      namapptk: null,
      kodeBagian: null,
      // Kegiatan
      kodekegiatanblud: null,
      kegiatanblud: null,

      nilaikontrak: 0,
      nokontrakx: null,
      termin: 1
    },
    bidangdanptk: [],
    pihaktigas: [],
    kegiatans: [],
    ptks: []
  }),
  actions: {
    resetFORM() {
      const forms = Object.keys(this.form)
      for (let i = 0; i < forms.length; i++) {
        const el = forms[i]
        this.setForm(el, null)
      }
    },
    // newData () {
    //   this.resetFORM()
    //   this.edited = false
    // },
    // editData (val) {
    //   this.edited = true
    //   const keys = Object.keys(val)
    //   keys.forEach((key, index) => {
    //     this.setForm(key, val[key])
    //   })
    // },
    // setAmbils (key, val) {
    //   this.reqs[key] = val
    // },
    setParams(key, val) {
      this.reqs[key] = val
    },
    setForm(key, val) {
      this.form[key] = val
      this.form.termin = 1
      this.form.nilaikontrak = 0
      // console.log('form', this.form)
    },
    emptyForm() {
      this.form.nokontrak = ''
      this.form.tgltrans = ''
      this.form.tglmulaikontrak = ''
      this.form.tglakhirkontrak = ''
      this.form.kodeperusahaan = ''
      this.form.namaperusahaan = ''
      this.form.kodemapingrs = ''
      this.form.namasuplier = ''
      this.form.kodepptk = ''
      this.form.namapptk = ''
      this.form.kodeBagian = ''
      this.form.kodekegiatanblud = ''
      this.form.kegiatanblud = ''
      this.form.nilaikontrak = 0
      this.form.nokontrakx = ''
      this.form.termin = 1

    },
    getDataBidang() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/laporan/lra/bidang', params).then((resp) => {
          console.log('bidang RSUD', resp)
          if (resp.status === 200) {
            this.bidangdanptk = resp.data
            // this.kegiatans = resp.data
            // this.ptks = resp.data
            this.loading = false
            // this.filterBidang(resp.data)
            this.filterKegiatan()
            this.filterPtk()
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    filterPtk() {
      const data = this.bidangdanptk?.length
        ? this.bidangdanptk?.map((x) => {
          return {
            nip: x.kodepptk,
            nama: x.namapptk,
            kodeBagian: x.kodebidang,
            bagian: x.bidang
          }
        })
        : []
      const ptk = data.reduce((acc, curr) => {
        const kodesama = acc.find(x => x.nip === curr.nip)
        if (!kodesama) {
          acc.push(curr)
        }
        return acc
      }, [])
      this.ptks = ptk
      // console.log('pptk', this.ptks)
    },
    filterKegiatan() {
      const data = this.bidangdanptk?.length
        ? this.bidangdanptk?.filter(x =>
          x.kodepptk === this.params.nip
        )
        : []
      this.kegiatans = data
      // console.log('ddd', this.kegiatans)
    },
    getPihaktiga() {
      this.loading = true
      return new Promise((resolve) => {
        api.get('v1/transaksi/belanja_ls/perusahaan').then((resp) => {
          // console.log('pihaktiga', resp)
          if (resp.status === 200) {
            this.loading = false
            this.pihaktigas = resp.data
            resolve(resp)
          }
        })
          .catch(() => {
            this.loading = false
          })
      })
    },
    simpanKontrak() {
      console.log('fooorm', this.form)
      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('/v1/transaksi/kontrak/simpankontrak', this.form)
          .then((resp) => {
            console.log('isian', resp)
            this.form.nokontrak = resp.data?.result?.nokontrak
            // console.log('nokontrak', this.form.nokontrak)
            this.loading = false
            notifSuccess(resp)

            resolve(resp.data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    }
  }
})
