import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"

export const useTemplatePersiapanOperasiStore = defineStore('template_persiapan_operasi', {
  state: () => ({
    loading: false,
    isOpen: false,
    namaObat: null,
    Obats: [],
    nonFilteredObat: [],
    item: {},
    items: [],
    params: {
      page: 1,
      per_page: 10,
      q: '',
    },
    form: {
      user: 'private',
      nama: '',
      sistembayar: 'bpjs',
    },
    typeOptions: [
      { value: 'public', nama: 'Semua' },
      { value: 'private', nama: 'Untuk saya saja' },
    ],
    sistemBayarOptions: [
      { value: 'bpjs', nama: 'BPJS' },
      { value: 'non', nama: 'Non-BPJS' },
    ]
  }),
  actions: {
    setparams (key, val) {
      this.params[key] = val
    },
    setForm (key, val) {
      this.form[key] = val
    },

    cariObat (val) {

      const param = {
        groups: this?.pasien?.sistembayar?.groups,
        kdruang: 'Gd-04010103',
        q: val,
        tiperesep: this.form.tiperesep
      }
      // console.log('obat', val, filtObat)
      this.loadingObat = true
      const params = { params: param }
      return new Promise(resolve => {
        api.get('v1/simrs/penunjang/farmasinew/obatoperasi/get-obat-persiapan', params)
          .then(resp => {
            this.loadingObat = false
            this.nonFilteredObat = resp.data?.dataobat
            this.Obats = val?.length ? this.nonFilteredObat.filter(nfil => nfil?.namaobat.toLowerCase().includes(val?.toLowerCase())) : this.nonFilteredObat
            // console.log('hasil', this.nonFilteredObat, this.Obats)

            resolve(resp)
          })
          .catch(() => {
            this.loadingObat = false
            this.Obats = []
          })
      })
      // }
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTemplatePersiapanOperasiStore, import.meta.hot))
}
