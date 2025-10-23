import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { usePendaftaranAutocompleteStore } from '../../autocomplete'


export const useRegistrasiPasienHomeCareStore = defineStore('registrasi_pasien_home_care', {
  state: () => ({

    loading: false,
    form: {
      tglmasuk: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      sistembayar: 'UMUM',
      kode_poli: 'PEN014'
    },
    display: {},
    homeCareAdminLayanans: [],
    dpjps: [],
    polis: []
  }),
  actions: {
    setForm (key, val) {
      this.form[key] = val
    },
    clearForm () {
      this.form = {
        tglmasuk: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        sistembayar: 'UMUM',
        kode_poli: 'PEN014'
      }
      this.display = {}
      this.paramDpjp = {
        tglsep: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        jenis_pelayanan: 2
      }
    },
    // initial data
    getInitialData () {
      const autocompleteStore = usePendaftaranAutocompleteStore()
      if (autocompleteStore.homeCareAdmins?.length) {
        this.homeCareAdminLayanans = autocompleteStore.homeCareAdmins
        console.log('log', this.homeCareAdminLayanans)

      }
      else {
        this.getBiayaAdminHomeCare()
      }
      this.getDokterDpjp()

    },

    // api related function
    async getDokterDpjp () {
      this.loading = true
      await api.get('v1/simrs/pendaftaran/homecare/dokter',)
        .then(resp => {
          this.loading = false
          console.log('dokter', resp?.data)
          this.dpjps = resp?.data
          return new Promise(resolve => { resolve(resp.data) })
        })
        .catch(() => {
          this.loading = false
        })
    },
    async getBiayaAdminHomeCare () {
      this.loading = true
      const autocompleteStore = usePendaftaranAutocompleteStore()
      await api.get('v1/simrs/pendaftaran/homecare/admin-home-care')
        .then(resp => {
          this.loading = false
          this.homeCareAdminLayanans = resp.data
          autocompleteStore.setHomeCareAdmins(resp.data)
          console.log('Admin homecare ', this.homeCareAdminLayanans)
          return new Promise(resolve => { resolve(resp.data) })
        })
        .catch(() => {
          this.loading = false
        })
    },
    pilihAdminLayanan (val) {
      const layanan = this.homeCareAdminLayanans.find(x => x.kode == val)
      this.setForm('nama_layanan', layanan?.nama)
      this.setForm('kode_layanan', layanan?.kode)
      this.setForm('administrasi', layanan?.jumlah)
      this.setForm('js', layanan?.js)
      this.setForm('jp', layanan?.jp)
      console.log('pilih', val, layanan, this.form)

    },
    simpanRegistrasi () {
      return new Promise((resolve, reject) => {
        this.loading = true
        api.post('v1/simrs/pendaftaran/homecare/simpan-daftar', this.form)
          .then(resp => {
            console.log('simpan pendaftaran', resp)
            this.loading = false
            resolve(resp?.data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRegistrasiPasienHomeCareStore, import.meta.hot))
}
