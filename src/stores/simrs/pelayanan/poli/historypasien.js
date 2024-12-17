import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useHistoryPasien = defineStore('history-pasien', {
  state: () => ({
    items: [],
    meta: null,
    itemsEresep: [],
    metaEresep: null,
    loading: false,
    params: {
      page: 1,
      per_page: 20,
      norm: ''
    },
    paramsEresep: {
      noreg: ''
    },
    optionsTingkatkesadaran: [
      { value: 0, label: 'Sadar Baik/Alert' },
      { value: 1, label: 'Berespon denga kata-kata / Voice' },
      { value: 2, label: 'Hanya berespons jika dirangsang nyeri / Pain' },
      { value: 3, label: 'Pasien tidak sadar / Unresponsive' },
      { value: 4, label: 'Gelisah atau bingung' },
      { value: 5, label: 'Acute Confusional States' }
    ],
    tab: 'Rawat Jalan',
    tabs: ['Rawat Jalan', 'Rawat Inap', 'IGD']
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    async getData (pasien) {
      this.loading = true
      try {
        this.params.norm = pasien?.norm
        const params = { params: this.params }
        const resp = await api.get('v1/simrs/historypasien/historypasienfull', params)
        // console.log('history  ', resp)
        if (resp.status === 200) {
          this.items = resp?.data?.data
          this.meta = resp?.data
          this.loading = false
        }
        this.loading = false
      }
      catch (error) {
        this.loading = false
      }
    },
    async getEresep (noreg) {
      if (this.metaEresep === null) {
        this.loading = true
        try {
          this.params.noreg = noreg
          const params = { params: this.params }
          const resp = await api.get('v1/simrs/pelayanan/listresepbynorm', params)
          // console.log('history  ', resp)
          if (resp.status === 200) {
            this.itemsEresep = resp?.data?.data
            this.loading = false

            this.metaEresep = resp?.data // or you can push specific data from resp
            console.log(this.metaEresep)
          }
          this.loading = false
        }
        catch (error) {
          this.loading = false
        }
      }
    }
  }
})
