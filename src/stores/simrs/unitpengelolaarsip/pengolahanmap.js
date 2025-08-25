import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifSuccess } from "src/modules/utils";

export const useUnitPengelolaharsipMapStore = defineStore('unit-pengelolah-arsip-map-store', {
  state: () => ({
    items: [],
    itemsorganisasi: [],
    itemsrinci: [],
    loading: false,
    loadingForm: false,
    loadingrinci: false,
    meta: null,
    dialog: false,
    dialogrincian: false,
    params: {
      q: '',
      page: 1,
      per_page: 10,
      bidangbagian: ''
    },
    form: {
      id: '',
      namamap: '',
      kodeorganisasi: '',
      keterangan: ''
    }
  }),
  actions: {
    setParams(key, val) {
      this.params[key] = val
    },
    goToPage(val) {
      this.params.page = val
      this.getData()
    },
    search(val) {
      this.params.q = val
      this.params.page = 1
      this.getData()
    },
    refresh(val) {
      this.params.page = 1
      this.getData()
    },
    async getData() {
      this.loading = true
      const params = { params: this.params }
      await api.get('v1/simrs/unitpengelolaharsip/map/list-data', params)
        .then(resp => {
          this.items = resp?.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async getDataorganisasi() {
      await api.get('v1/simrs/master/listorganisasi')
        .then(resp => {
          this.itemsorganisasi = resp?.data
        })
        .catch(() => { })
    },
    saveData() {
      this.loadingForm = true
      return new Promise(resolve => {
        api.post('v1/simrs/unitpengelolaharsip/map/simpan-map', this.form)
          .then(resp => {
            const newItem = resp?.data?.result
            this.items = resp?.data?.result
            this.loadingForm = false
            this.initreset()
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            this.loadingForm = false
          })
      })
    },
    initreset() {
      this.form.id = ''
      this.form.namamap = ''
      this.form.kodeorganisasi = ''
      this.form.keterangan = ''
    }
  }
})
