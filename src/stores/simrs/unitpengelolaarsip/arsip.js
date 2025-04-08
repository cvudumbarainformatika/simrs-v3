import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const useUnitPengelolahArsipStore = defineStore('unit-pengelolah-arsip-store', {
  state: () => ({
    items: [],
    itemsorganisasi: [],
    loading: false,
    meta: null,
    dialog: false,
    params: {
      q: '',
      page: 1,
      per_page: 10,
      bidangbagian: ''
    },
    from: {
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    },
    tanggal: {
      tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    form: {
      noarsip: '',
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      jumlah: 1,
      dokumen: []
    },
    loadingForm: false
  }),
  actions: {
    setParams(key, val) {
      this.params[key] = val
    },
    goToPage(val) {
      console.log('go', val)
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
      await api.get('v1/simrs/unitpengelolaharsip/arsip/listarsip', params)
        .then(resp => {
          this.items = resp?.data?.data
          this.meta = resp?.data
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
      const data = new FormData()
      for (let i = 0; i < this.form.dokumen; i++) {
        const images = this.form.dokumen[i]
        data.append(`dokumen[${i}]`, images)
      }

      return new Promise((resolve, reject) => {
        api.post('v1/simrs/unitpengelolaharsip/arsip/simpanarsip', this.form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((resp) => {
            if (resp.status === 200) {
              const datax = resp?.data?.result[0]
              this.form.noarsip = data?.noarsip
              this.items.unshift(datax)
              notifSuccess(resp)
              //this.initForm()
              this.loadingForm = false
            }
            this.loadingForm = false
          })
          .catch((err) => {
            console.log(err)
            this.loadingForm = false
            reject(err)
          })
      })
    },
    setPeriodik(val) {
      // console.log('wew', val)
      this.params.page = 1
      const { to, from, status } = val
      this.params.to = to
      this.params.from = from
      this.params.status = status
      // console.log('periodik', to)
      this.getData()
    },
    setDate(val) {
      this.params.tgl = val
    },
    setQ(payload) {
      this.params.page = 1
      this.params.q = payload
      this.getLists()
    },
    setPerPage(payload) {
      // console.log('sasa', payload)
      this.params.page = 1
      this.params.per_page = payload
      this.getLists()
    },
    setFilters() {
      this.filters = !this.filters
    },
    selectFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const images = files[i]
        this.form.dokumen.push(images)
      }
      // console.log('masukkan ke form', this.form)
    },
  }
})

// make sure to pass the right store definition, useAuth in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUnitPengelolahArsipStore, import.meta.hot))
}
