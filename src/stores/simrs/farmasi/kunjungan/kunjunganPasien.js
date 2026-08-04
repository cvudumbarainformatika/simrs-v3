import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

export const useKunjunganPasienDepoStore = defineStore('kunjungan_pasien_depo', {
  state: () => ({
    loading: false,
    tab: 'rajal', // 'rajal' | 'ranap' | 'igd'
    items: [],
    meta: null,
    periode: 'Hari ini',
    isOpenWorkspace: false,
    selectedPasien: null,
    activeMenu: 'edukasi',
    params: {
      q: '',
      from: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      flag: 'all', // rajal/igd: 'all', ranap: 'aktif'
      poli: [],
      ruangan: [],
      sistemBayar: '',
      page: 1,
      per_page: 20,
      rowsNumber: 0
    }
  }),
  actions: {
    openWorkspace (pasien) {
      this.selectedPasien = pasien
      this.isOpenWorkspace = true
      this.activeMenu = 'edukasi'
    },
    closeWorkspace () {
      this.isOpenWorkspace = false
      this.selectedPasien = null
    },
    setTab (val) {
      this.tab = val
      this.resetParams()
      this.getData()
    },
    resetParams () {
      this.params.q = ''
      this.periode = 'Hari ini'
      this.params.from = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.params.to = date.formatDate(Date.now(), 'YYYY-MM-DD')
      this.params.flag = this.tab === 'ranap' ? 'aktif' : 'all'
      this.params.poli = []
      this.params.ruangan = []
      this.params.sistemBayar = ''
      this.params.page = 1
      this.params.rowsNumber = 0
    },
    setPeriode (val) {
      this.periode = val
      if (val === 'Hari ini') {
        const cDate = new Date()
        this.params.from = date.formatDate(cDate, 'YYYY-MM-DD')
        this.params.to = date.formatDate(cDate, 'YYYY-MM-DD')
      } else if (val === 'Minggu ini') {
        const now = new Date()
        const firstday = new Date(now)
        firstday.setDate(now.getDate() - now.getDay()) // Minggu
        const lastday = new Date(now)
        lastday.setDate(now.getDate() - now.getDay() + 6) // Sabtu
        this.params.from = date.formatDate(firstday, 'YYYY-MM-DD')
        this.params.to = date.formatDate(lastday, 'YYYY-MM-DD')
      } else if (val === 'Bulan ini') {
        const now = new Date()
        const firstday = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastday = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        this.params.from = date.formatDate(firstday, 'YYYY-MM-DD')
        this.params.to = date.formatDate(lastday, 'YYYY-MM-DD')
      }
      this.params.page = 1
    },
    async getData () {
      this.loading = true
      let url = 'v1/simrs/farmasinew/depo/list-pengunjung-rajal'
      if (this.tab === 'ranap') {
        url = 'v1/simrs/farmasinew/depo/list-pengunjung-ranap'
      } else if (this.tab === 'igd') {
        url = 'v1/simrs/farmasinew/depo/list-pengunjung-igd'
      }

      // Prepare payload
      const app = useAplikasiStore()
      const payloadParams = {
        q: this.params.q,
        from: this.params.from,
        to: this.params.to,
        flag: this.params.flag,
        sistemBayar: this.params.sistemBayar,
        page: this.params.page,
        per_page: this.params.per_page
      }

      if (this.tab === 'rajal') {
        if (!this.params.poli.length && app.polis.length) {
          payloadParams.poli = app.polis.map(x => x.kodepoli)
        } else {
          payloadParams.poli = this.params.poli
        }
      } else if (this.tab === 'ranap') {
        payloadParams.ruangan = this.params.ruangan
      }

      const params = { params: payloadParams }

      try {
        const resp = await api.get(url, params)
        if (resp.status === 200) {
          this.items = resp.data?.data ?? []
          this.meta = resp.data?.meta ?? null
          this.params.rowsNumber = resp.data?.meta?.total ?? 0
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('Error fetching kunjungan data', error)
      }
    },
    goToPage (val) {
      this.params.page = val
      this.getData()
    },
    setPerPage (val) {
      this.params.per_page = val
      this.params.page = 1
      this.getData()
    }
  }
})
