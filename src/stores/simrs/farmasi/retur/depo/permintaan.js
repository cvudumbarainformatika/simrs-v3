import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"

export const usePemintaanReturDepoStore = defineStore('permintaan_retur_depo', {
  state: () => ({
    loading: true,
    items: [],
    meta: {},
    params: {
      q: '',
      page: 1,
      per_page: 10
    },
    depos: [
      { nama: 'Floor Stock 1 (AKHP)', value: 'Gd-03010101', jenis: 't' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102', jenis: 'rnp' },
      { nama: 'Depo OK', value: 'Gd-04010103', jenis: 'ok' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101', jenis: 'rjl' },
      { nama: 'Depo IGD', value: 'Gd-02010104', jenis: 'igd' }
    ],
  }),
  actions: {
    setParams (key, val) {
      this.params[key] = val
    },
    setSearch (val) {
      this.setParams('q', val)
      this.setParams('page', 1)
      this.getData()
    },
    refresh () {
      this.setParams('page', 1)
      this.getData()
    },
    setPerPage (val) {
      this.setParams('per_page', val)
      this.setParams('page', 1)
      this.getData()
    },
    setPage (val) {
      this.setParams('page', val)
      this.getData()
    },
    setHeaders () {
      this.items.forEach((item) => {
        const resep = []
        const nores = [...new Set(item?.rinci?.map(ri => ri?.noresep))]
        nores.forEach(x => {
          const itemx = item?.rinci.filter(a => a.noresep === x)
          const depo = this.depos.find(a => a.value === itemx[0]?.depo)
          resep.push({
            noresep: x,
            depo: depo?.nama,
            header: itemx[0]?.header_resep,
            rincian: itemx
          })
        })
        item.resep = resep

      })
    },
    getData () {
      this.loading = true
      const param = { params: this.params }
      return new Promise(resolve => {
        api.get('v1/simrs/farmasinew/depo/permintaan-retur/list-permintaan', param)
          .then(resp => {
            this.loading = false
            this.items = resp?.data?.data
            this.meta = resp?.data?.meta
            if (this.items?.length) this.setHeaders()
            console.log('resp', this.items)
            resolve(resp)
          }).catch(() => {
            this.loading = false
          })

      })

    },
    selesaiManual (val) {
      val.loading = true
      const resepOK = val?.resep?.filter(a => a.noresep?.includes('-D-KO'))?.map(a => a.noresep)
      const form = {
        nopermintaan: val.nopermintaan,
        noresep: resepOK
      }
      // console.log('form', form, 'val', val)

      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/permintaan-retur/selesai-permintaan-manual', form)
          .then(resp => {
            delete val.loading
            this.getData()
            console.log('resp', resp)
            resolve(resp)
          }).catch(() => {
            delete val.loading
          })

      })

    },
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePemintaanReturDepoStore, import.meta.hot))
}
