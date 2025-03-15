import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"

export const useTemplatePersiapanOperasiStore = defineStore('template_persiapan_operasi', {
  state: () => ({
    loading: false,
    loadingCari: false,
    isOpen: false,
    namaObat: null,
    Obats: [],
    nonFilteredObat: [],
    idTemplate: { id: null, nama: 'BARU' },
    item: {},
    items: [],
    params: {
      page: 1,
      per_page: 10,
      q: '',
      sistembayar: '1',
      user: 'private'
    },
    form: {
      user: 'private',
      nama: '',
      groups: '1',
    },
    typeOptions: [
      { value: 'public', nama: 'Semua' },
      { value: 'private', nama: 'Saya Saja' },
    ],
    sistemBayarOptions: [
      { value: '1', nama: 'BPJS' },
      { value: '0', nama: 'Non-BPJS' },
    ]
  }),
  actions: {
    setparams (key, val) {
      this.params[key] = val
    },
    setForm (key, val) {
      this.form[key] = val
    },
    resetObat () {
      this.setForm('kd_obat', null)
      this.setForm('jumlah', '')
      this.namaObat = null
    },
    resetForm () {
      this.form = {
        user: 'private',
        nama: '',
        groups: '1',
      }

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
    simpan () {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/farmasinew/obatoperasi/simpan-template', this.form)
          .then(resp => {
            this.loading = false
            console.log('simpan', resp?.data)
            this.resetObat()
            this.item = resp?.data?.data
            this.items.edit = true
            this.setForm('id', resp?.data?.data?.id)
            console.log('item', item, resp?.data?.data?.id)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    cariList () {
      this.loadingCari = true
      const params = { params: this.params }
      return new Promise(resolve => {
        api.get('v1/simrs/penunjang/farmasinew/obatoperasi/cari-template', params)
          .then(resp => {
            this.loadingCari = false
            this.items = resp?.data?.data

            resolve(resp)
          })
          .catch(() => {
            this.loadingCari = false
          })
      })
    },
    hapusObat (val) {
      console.log('hapusObat', val)
      val.loadind = true
      api.post('v1/simrs/penunjang/farmasinew/obatoperasi/hapus-rinci-template', val)
        .then(resp => {

          console.log('resp', resp?.data)
          // hapus list
          const index = this.items?.rinci?.findIndex(x => x.id === val.id)
          if (index >= 0) {
            this.items?.rinci.splice(index, 1)
          } else {
            delete val.loadind
          }
          notifSuccess(resp)
        })
        .catch(() => {
          delete val.loadind
        })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTemplatePersiapanOperasiStore, import.meta.hot))
}
