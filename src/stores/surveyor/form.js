import { defineStore } from 'pinia'
import { useSurveyorTable } from 'src/stores/surveyor/table'
import {
  axios,
  api
} from 'boot/axios'
// import { routerInstance } from 'src/boot/router'
import { notifSuccess } from 'src/modules/utils'
// import { useAuthStore } from './auth'
// import { Dialog } from 'quasar'

export const useSurveyorFormStore = defineStore('surveyor_form', {
  state: () => ({
    isOpen: false,
    form: {
      // data diri
      // id: '',
      // uuid: '',
      // user_id: '',
      nik: '',
      no_hp: '',
      nama: '',
      alamat: '',
      provinsi: '',
      kabkot: '',
      kecamatan: '',
      kelurahan: '',
      kodepos: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      gender: 'L',
      agama: 'Islam',
      // user login,
      email: '',
      password: ''
    },
    api_wilayah: 'https://globalbudged.github.io/api-wilayah-indonesia/static/api',
    provinces: [],
    kotas: [],
    kecs: [],
    kels: [],
    agamas: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya'],
    loadingSelect: false,
    loading: false,
    edited: false
  }),

  getters: {

  },

  actions: {
    async getProvinces (id) {
      await axios.get(`${this.api_wilayah}/provinces.json`)
        .then((resp) => {
          console.log(resp)
          this.provinces = resp.data
          return resp.data.name
        }).catch(err => {
          console.log(err)
        })
    },
    async getKota (val) {
      this.loadingSelect = true
      if (this.provinces?.length > 0) {
        console.log('jika data array provinsi ada')
        let temp = []
        temp = this.provinces.filter(v => v.name.toLowerCase() === val.toLowerCase())
        if (temp?.length > 0) {
          const tempId = temp[0].id
          await axios.get(`${this.api_wilayah}/regencies/${tempId}.json`)
            .then((resp) => {
              console.log('resp', resp)
              this.kotas = resp.data
              console.log('kotas', this.kotas)
              this.loadingSelect = false
            }).catch(err => {
              console.log(err)
              this.loadingSelect = false
            })
        }
      }
      this.loadingSelect = false
    },
    async getKec (val) {
      this.loadingSelect = true
      if (this.kotas?.length > 0) {
        console.log('jika data array provinsi ada')
        let temp = []
        temp = this.kotas.filter(v => v.name.toLowerCase() === val.toLowerCase())
        if (temp?.length > 0) {
          const tempId = temp[0].id
          await axios.get(`${this.api_wilayah}/districts/${tempId}.json`)
            .then((resp) => {
              console.log('resp', resp)
              this.kecs = resp.data
              console.log('kec', this.kecs)
              this.loadingSelect = false
            }).catch(err => {
              console.log(err)
              this.loadingSelect = false
            })
        }
      }
      this.loadingSelect = false
    },
    async getKels (val) {
      this.loadingSelect = true
      if (this.kecs?.length > 0) {
        let temp = []
        temp = this.kecs.filter(v => v.name.toLowerCase() === val.toLowerCase())
        if (temp?.length > 0) {
          const tempId = temp[0].id
          await axios.get(`${this.api_wilayah}/villages/${tempId}.json`)
            .then((resp) => {
              console.log('resp', resp)
              this.kels = resp.data
              this.loadingSelect = false
              console.log('kec', this.kels)
            }).catch(err => {
              console.log(err)
              this.loadingSelect = false
            })
        }
      }
      this.loadingSelect = false
    },
    setToday () {
      const date = new Date()
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + (date.getDate())).slice(-2)
      const formatDb = year + '-' + month + '-' + day
      this.form.tanggal_lahir = formatDb
    },
    setForm (name, val) {
      this.form[name] = val
    },
    setOpen() {
      this.isOpen = !this.isOpen
    },
    async saveForm () {
      this.loading = true
      try {
        const resp = await api.post('/v1/surveyor/store', this.form)
        console.log('save data', resp)
        notifSuccess(resp)
        // ini untuk panggil data table
        const table = useSurveyorTable()
        table.getDataTable()
        this.resetFORM()
        this.loading = false
        return new Promise((resolve) => {
          resolve(resp)
        })
      } catch (error) {
        this.loading = false
      }
    },
    resetFORM () {
      this.form = {}
      const columns = ['nik', 'nama',
        'tempat_lahir', 'tanggal_lahir',
        'agama', 'gender', 'no_hp',
        'alamat', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan', 'kodepos',
        'email', 'password']
      for (let i = 0; i < columns?.length; i++) {
        this.setForm(columns[i], '')
      }
      this.setToday()
      this.setForm('gender', 'L')
      this.setForm('agama', 'Islam')
    },
    newData () {
      this.resetFORM()
      this.edited = false
      this.isOpen = !this.isOpen
    },
    editData (val) {
      this.edited = true
      const keys = Object.keys(val)
      keys.forEach((key, index) => {
        this.setForm(key, val[key])
      })
      // kecuali yang ada di object user
      this.isOpen = !this.isOpen
    }

  }
})
