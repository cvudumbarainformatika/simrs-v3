import { acceptHMRUpdate, defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

export const useRestriksiFornasStore = defineStore('restriksi-fornas-store', {
  state: () => ({
    loading: false,
    loadingSimpan: false,
    loadingHapus: false,
    items: [],
    meta: {},
    params: {
      page: 1,
      q: '',
      per_page: 10,
    },
    form: {
      tgl: date.formatDate(new Date(), 'YYYY-MM-DD'),
    },
    fornas: true,
    display: {
      tgl: date.formatDate(new Date(), 'DD MMMM YYYY'),
    },
    columns: [
      'obat',
      'jumlah',
      'kecuali',
      'act'
    ],
    gudangs: [
      { nama: 'Gudang Farmasi ( Kamar Obat )', value: 'Gd-05010100' },
      { nama: 'Gudang Farmasi (Floor Stok)', value: 'Gd-03010100' }
    ],
    depos: [
      { nama: 'Floor Stock 1 (AKHP)', value: 'Gd-03010101' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'Depo IGD', value: 'Gd-02010104' }
    ],
  }),
  actions: {
    setParams (payload, value) {
      this.params[payload] = value
    },
    setPage (payload) {
      this.setParams('page', payload)
      this.getData()
    },
    setPerPage (payload) {
      this.setParams('per_page', payload)
      this.setParams('page', 1)
      this.getData()
    },
    refreshTable () {
      this.getData()
    },
    setSearch (payload) {
      this.setParams('page', 1)
      this.setParams('q', payload)
      this.getData()
    },

    getData () {
      this.loading = true
      this.params.fornas = this.fornas
      return new Promise((resolve, reject) => {
        api.get('/v1/simrs/penunjang/farmasinew/restriksi/obat', { params: this.params })
          .then(resp => {
            this.loading = false
            console.log('resp', resp?.data)
            this.items = resp?.data?.data
            this.meta = resp?.data?.meta
            resolve(resp)
          }).catch(err => {
            this.loading = false
            reject(err)
          })
      })
    },

  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRestriksiFornasStore, import.meta.hot))
}
