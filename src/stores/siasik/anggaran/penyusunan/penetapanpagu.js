import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifSuccess, notifSuccessVue } from "src/modules/utils";

export const usePenetapanPaguStore = defineStore('penetapan-pagu-store', {
  state: () => ({
    items: [],
    loading: false,
    loadingSave: false,
    loadingDelete: false,
    loadingKunci: false,
    form: {
      notrans: '',
      kodekegiatan: '',
      kegiatanblud: '',
      kodeorganisasi1: '',
      kodeorganisasi2: '',
      kodeorganisasi3: '',
      namaorganisasi: '',
      total: 0,
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    akuns: [],
    kegiatans: [],
    optionkegiatan: [],
  }),
  actions: {
    setForm(key, val) {
      this.form[key] = val
    },
    getKegiatan() {
      this.loading = true
      const params = { params: this.params }
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
        const resp = await api.post('v1/anggaran/penyusunan/penetapanpagu/save', this.form)

        if (resp.success === true) {
          this.form.notrans = resp?.data?.data?.notrans
          this.items = resp?.data?.data

        }
        notifSuccessVue(resp?.data?.message)
        this.form = {
          notrans: '',
          kodekegiatan: '',
          kegiatanblud: '',
          kodeorganisasi1: '',
          kodeorganisasi2: '',
          kodeorganisasi3: '',
          namaorganisasi: '',
          total: 0,
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
      const resp = await api.get('/v1/anggaran/penyusunan/penetapanpagu/index', params)
      console.log('resp Data', resp)
      if (resp.status === 200) {
        this.items = resp?.data
        this.loading = false
      }
      this.loading = false
    },
    editForm(val) {

      // const arr = this.kegiatans || []
      // console.log('arr kegiatan', arr)
      // console.log('kegiatan', this.optionkegiatan)
      // const data = arr.find(x => x.no == val.kodekegiatan)

      // if (data) {
      //   this.form.kodekegiatan = data.no
      //   this.form.kegiatanblud = data.nomenklatur
      // } else {
      //   console.warn('Kegiatan tidak ditemukan untuk kode ', val.kodekegiatan)
      //   this.form.kodekegiatan = val.kodekegiatan  // tetap isi dari val
      // }
      this.form.no = val?.no
      this.form.kode = val?.kode
      this.form.nomenklatur = val?.nomenklatur
      this.form.kodekegiatan = val?.kodekegiatan
      this.form.kegiatanblud = val?.kegiatanblud
      this.form.kodeorganisasi1 = val?.kodeorganisasi1
      this.form.kodeorganisasi2 = val?.kodeorganisasi2
      this.form.kodeorganisasi3 = val?.kodeorganisasi3
      this.form.namaorganisasi = val?.namaorganisasi
      this.form.total = val?.total
      this.form.notrans = val?.notrans
      this.form.tahun = val?.tahun
      console.log('valedit', val)
      console.log('valedit form', this.form)
      // this.form.group = val?.groups?.toString()

    },
    async deleteData(id) {
      this.loadingDelete = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/anggaran/penyusunan/penetapanpagu/delete', payload)
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
    async kunciData(id) {
      this.loadingKunci = true
      const payload = { id }
      try {
        const resp = await api.post('/v1/anggaran/penyusunan/penetapanpagu/kunci', payload)
        if (resp.status === 200) {
          // this.items = resp?.data?.data
          notifSuccess(resp)
          this.getData()
        }
        this.loadingKunci = false
      }
      catch (error) {
        notifErr(error)
        this.loadingKunci = false
      }
    },
    search(val) {
      this.params.q = val
      this.getData()
    },
    goToPage(val) {
      this.params.page = val
      this.getData()
    },
  }
})
