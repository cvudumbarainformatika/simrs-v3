import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErrVue, notifSuccess } from "src/modules/utils"

export const usePermintaanReturEresepStore = defineStore('permintaan_retur_eresep', {
  state: () => ({
    loading: false,
    allItems: [],
    items: [],
    listItems: [],
    form: [],
    depos: [
      { nama: 'Floor Stock 1 (AKHP)', value: 'Gd-03010101', jenis: 't' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102', jenis: 'rnp' },
      { nama: 'Depo OK', value: 'Gd-04010103', jenis: 'ok' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101', jenis: 'rjl' },
      { nama: 'Depo IGD', value: 'Gd-02010104', jenis: 'igd' }
    ],
  }),
  actions: {
    setItem (val) {
      val?.forEach(ite => {
        ite?.rincian?.forEach(ri => {
          ri.ruanganranap = ite?.ruanganranap
          ri.poli = ite?.poli
          ri.ruangan = ite?.ruangan
          ri.depo = ite?.depo
          ri.norm = ite?.norm
        })
      })
      console.log('val', val)

      const rin = val?.flatMap(item => item?.rincian)
      this.allItems = [...rin]
      this.items = this.allItems
    },
    setForm () {

      // const form = this.allItems.filter(item => item?.rincian?.some(ri => ri?.retur > 0)).map(item => ({
      //   ...item,
      //   rincian: item.rincian.filter(ri => ri?.retur > 0)
      // }))
      // const form = this.allItems.flatMap(item =>
      //   item?.rincian?.filter(ri => ri?.retur > 0) || []
      // )
      const form = this.allItems?.filter(ri => ri?.retur > 0)
      // console.log('set form', form)
      this.form = [...form]
    },
    getObatKeluar (val) {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/permintaan-retur/get-oabt-keluar', val)
          .then(resp => {
            this.loading = false
            this.setItem(resp?.data?.data ?? [])
            this.listItems = resp?.data?.list
            console.log('resp', this.items)
            resolve(resp)
          }).catch(() => {
            this.loading = false
          })

      })

    },
    simpanPermintaan () {
      if (this.form.length < 1) return notifErrVue('Data tidak boleh kosong')
      this.loading = true
      const noresep = [... new Set(this.form.map(item => item.noresep))]
      const depo = [... new Set(this.form.map(item => item.depo))]
      const payload = {
        noreg: this.form[0]?.noreg,
        norm: this.form[0]?.norm,
        noresep: noresep,
        depo: depo,
        item: this.form
      }
      const payloaGet = {
        noreg: this.form[0]?.noreg
      }
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/permintaan-retur/simpan-permintaan', payload)
          .then(resp => {
            console.log('resp', resp?.data)
            notifSuccess(resp)
            this.loading = false
            this.getObatKeluar(payloaGet)
            this.form = {}
            resolve(resp)
          }).catch(() => {
            this.loading = false
          })
      })
    }
  }
})

if (import.meta?.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermintaanReturEresepStore, import.meta.hot))
}
