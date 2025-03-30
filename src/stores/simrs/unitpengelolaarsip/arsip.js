import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const useUnitPengelolahArsipStore = defineStore('unit-pengelolah-arsip-store', {
  state: () => ({
    items: [],
    loading: false,
    meta: null,
    dialog: false,
    params: {
      q: '',
      page: 1,
      per_page: 10,
    },
    from: {
      tglbuat: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    },
    tanggal: {
      tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
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
    async gantiDpjp(form, pasien) {
      // console.log(form)
      this.loadingSaveGantiDpjp = true
      try {
        const resp = await api.post('/v1/simrs/pelayanan/gantidpjp', form)
        if (resp.status === 200) {
          const findPasien = this.items.filter(x => x === pasien)
          if (findPasien.length) {
            const data = findPasien[0]
            data.datasimpeg = resp?.data?.result?.datasimpeg
            data.dokter = resp?.data?.result?.datasimpeg?.nama
            data.kodedokter = resp?.data?.result?.datasimpeg?.kdpegsimrs
            this.loadingSaveGantiDpjp = false
          }

          this.loadingSaveGantiDpjp = false
        }
        this.loadingSaveGantiDpjp = false
      }
      catch (error) {
        console.log(error)
        this.loadingSaveGantiDpjp = false
      }
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
  }
})

// make sure to pass the right store definition, useAuth in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUnitPengelolahArsipStore, import.meta.hot))
}
