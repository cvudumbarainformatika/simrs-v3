import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifSuccess } from "src/modules/utils";
import { useUnitPengelolahArsipStore } from "./arsip";
import { store } from "quasar/wrappers";

export const useUnitPengelolaharsipMapStore = defineStore('unit-pengelolah-arsip-map-store', {
  state: () => ({
    items: [],
    itemsorganisasi: [],
    itemscabinet: [],
    itemsrinci: [],
    meta: null,
    loading: false,
    loadingForm: false,
    loadingisimap: false,
    loadingrinci: false,
    loadinghapusrinci: {},
    loadinghapusmap: {},
    meta: null,
    dialog: false,
    dialogrincian: false,
    dialogtambaharsip: false,
    params: {
      q: '',
      page: 1,
      per_page: 10,
      tahunmap: new Date().getFullYear(),
      bidangbagian: ''
    },
    form: {
      id: '',
      namamap: '',
      kodeorganisasi: '',
      kodekelasifikasi: '',
      kelasifikasi: '',
      keterangan: '',
      cabinet: '',
      laci: 1,
      tahunmap: new Date().getFullYear()
    },
    formisi: {
      idmap: '',
      noarsip: ''
    },
    formhapus: {
      id: '',
      noarsip: ''
    },

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
    searchtahun(val) {
      this.params.tahunmap = val
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
          this.items = resp?.data?.data
          this.meta = resp?.data
          console.log('meta', this.meta)
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
    async getdatacabinet() {
      await api.get('v1/simrs/master/listcabinet')
        .then(resp => {
          this.itemscabinet = resp?.data
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
      this.form.kodekelasifikasi = ''
      this.form.kelasifikasi = ''
      this.form.keterangan = ''
      this.form.cabinet = ''
      this.form.laci = 1,
        this.form.tahunmap = new Date().getFullYear()
    },
    simpanisimap(val) {
      this.loadingisimap = true
      this.formisi.noarsip = val.noarsip
      return new Promise(resolve => {
        api.post('v1/simrs/unitpengelolaharsip/map/simpanisimap', this.formisi)
          .then(resp => {
            const noarsip = resp.data?.result
            this.itemsrinci = resp?.data?.rincianmap
            const storearsip = useUnitPengelolahArsipStore()
            storearsip.itemsuntukmap = storearsip.itemsuntukmap.filter(
              item => item.noarsip !== noarsip
            )

            this.loadingisimap = false
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            this.loadingisimap = false
          }).finally(() => {
            this.loadingisimap = false
          })
      })
    },
    async getrincianmap(val) {
      this.loadingrinci = true
      const params = { params: { idmap: val } }
      await api.get('v1/simrs/unitpengelolaharsip/map/rincian-map', params)
        .then(resp => {
          this.itemsrinci = resp?.data
          this.loadingrinci = false
        })
        .catch(() => { this.loadingrinci = false })
    },
    async hapusitem(id, noarsip) {
      this.loadinghapusrinci[id] = true
      this.formhapus.id = id
      this.formhapus.noarsip = noarsip
      await api.post('v1/simrs/unitpengelolaharsip/map/hapus-item', this.formhapus)
        .then(resp => {
          if (resp.status === 200) {
            this.itemsrinci[0].rinciandalammap = this.itemsrinci[0]?.rinciandalammap.filter(
              item => item.id !== id
            )
            const storearsip = useUnitPengelolahArsipStore()
            storearsip.getDataarsip()

            notifSuccess(resp)
          }
          this.loadinghapusrinci[id] = false
        })
        .catch(() => { this.loadinghapusrinci[id] = false })
    },
    async hapusmap(id) {
      // console.log('hapus map', id)
      this.loadinghapusmap[id] = true
      await api.post('v1/simrs/unitpengelolaharsip/map/hapus-map', { id: id })
        .then(resp => {
          if (resp.status === 200) {
            this.items = this.items.filter(item => item.id !== id)
            notifSuccess(resp)
            this.loadinghapusmap[id] = false
          }
          this.loadinghapusmap[id] = false
        })
        .catch(() => { this.loadinghapusmap[id] = false })
    }
  }
})
