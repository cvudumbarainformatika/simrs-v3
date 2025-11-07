import { acceptHMRUpdate, defineStore } from 'pinia'
import { useListPasienRadiologiStore } from './radiologi'
import { notifErrVue, notifSuccessVue } from 'src/modules/utils'
import { api } from 'src/boot/axios'

export const useFormRadiologiLuarStore = defineStore('form-radiologi-luar-store', {
  state: () => ({
    form: {
      nik: null,
      nama: null,
      kelamin: null,
      tgllahir: null,
      alamat: null,
      // permintaan
      ygmeminta: null,
      permintaan: null,
      permintaans: [],
      // pembayaran
      jnsPembayaran: null,
      perusahaan_id: null
    },
    kelamins: [
      'Laki-laki',
      'Perempuan'
    ],
    jenis: [
      'Perorangan',
      'Perusahaan'
    ],
    ukurans: [
      '43 x 35',
      '35 x 35',
      '30 x 40',
      '24 x 30',
      '18 x 24'
    ],
    perusahaans: [],
    loading: false,
    loadingSimpan: false,
    openDialogPeserta: false,
    cekPeserta: null
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {

    async getPerusahaan() {
      this.loading = true
      await api.get('/v1/perusahaan')
        .then(res => {
          console.log('res', res);

          this.perusahaans = res.data
        })
        .catch(err => {
          notifErrVue(err)
        })
        .finally(() => {
          this.loading = false
        })
    },


    async simpan() {
      console.log('simpan');
      this.loadingSimpan = true
      await api.post('/v1/simrs/radiologi/radiologi/simpanPermintaan', this.form)
        .then(res => {
          console.log('res', res);
          if (res.status === 200) {
            notifSuccessVue(res?.message)
          }
        })
        .catch(err => {
          console.log('err', err);
          // notifErrVue(err)
        })
        .finally(() => {
          this.loadingSimpan = false
          this.initFormReset()
        })
    },

    initFormReset() {
      this.form = {
        noKtp: null,
        nama: null,
        kelamin: null,
        tgllahir: null,
        temp_lahir: null,
        alamat: null,
        // permintaan
        ygmeminta: null,
        permintaan: null,
        permintaans: [],
        // pembayaran
        jnsPembayaran: null,
        perusahaan_id: null
      }
    },

    async cekPesertaBpjs(by, no) {
      this.cekPeserta = null
      const params = { params: { by, no } }
      await api.get('v1/simrs/pendaftaran/ranap/cek-peserta-bpjs', params)
        .then(resp => {
          // console.log('cekPesertaBpjs', resp)
          const bpjs = resp?.data?.bpjs
          const rs = resp?.data?.rs
          if (bpjs.metadata.code === '200') {
            this.cekPeserta = resp?.data?.bpjs?.result?.peserta
            this.openDialogPeserta = true
            console.log('cekPesertaBpjs', this.cekPeserta);

          }
          else {
            // this.cekPeserta = null
            // this.pasien.nama = null
            // this.pasien.nokabpjs = null
            // this.pasien.barulama = 'Baru'
          }

          if (rs) {
            this.form.temp_lahir = rs.templahir
          }
          if (!rs) {
            // this.resetFormPasienIfnotExist()
          }
          // if (resp.data.metadata.code === '200') {
          //   this.cekPeserta = resp?.data.result.peserta
          //   this.openDialogPeserta = true
          // }
        })
        .catch(err => {
          // console.log('cekPesertaBpjs', err)
        })
    },

  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormRadiologiLuarStore, import.meta.hot))
}
