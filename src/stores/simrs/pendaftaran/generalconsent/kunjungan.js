import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
// import { notifSuccess } from 'src/modules/utils'

export const useListGeneralConsentStore = defineStore('list_general_consent', {
  state: () => ({
    ranap: [],
    meta: null,
    params: {
      q: '',
      per_page: 25,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      to: dateDbFormat(new Date()),
      from: dateDbFormat(new Date()),
      kdbayar: null,
      status: 'Belum Pulang',
      koderuangan: 'SEMUA',
    },
    loading: false,
    filters: false,
    periods: ['Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    periode: 'Hari Ini',
    statuses: ['Belum Pulang', 'Pulang'],
    statusx: 'Belum Pulang',
    ruangans: [],
    ruangan: 'SEMUA',
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {


    async getKunjunganRanap() {
      this.loading = true
      const params = { params: this.params }
      try {
        const resp = await api.get('/v1/simrs/pendaftaran/ranap/history-general-consent', params)
        console.log('data kunjungan', resp);
        if (resp.status === 200) {
          this.ranap = resp.data?.data || []
          this.meta = resp.data?.meta
        }

      } catch (error) {
        console.log(error);

      } finally {
        this.loading = false
      }
    },


    getRuangan() {
      return new Promise((resolve, reject) => {
        api.get('v1/simrs/ranap/ruangan/listruanganranap')
          .then(resp => {
            // console.log('ruangan ranap', resp)
            if (resp.status === 200) {
              const ruangs = resp.data
              this.ruangans = ruangs || []
              this.ruangans?.unshift('SEMUA')
            }
            resolve(resp)
          }).catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },

    gantiRuangan() {
      this.params.page = 1
      this.params.koderuangan = this.ruangan
      this.getKunjunganRanap()
    },



    setPeriode(val) {
      this.periode = val
      if (val === 'Hari ini') {
        this.hariIni()
      }
      else if (val === 'Minggu ini') {
        this.mingguIni()
      }
      else if (val === 'Bulan ini') {
        this.bulanIni()
      }
    },

    hariIni() {
      const cDate = new Date()
      this.params.to = dateDbFormat(cDate)
      this.params.from = dateDbFormat(cDate)
    },
    bulanIni() {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      // const firstday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-01'
      // const lastday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-31'
      const firstday = curr.setFullYear(y, m, 1)
      const lastday = curr.setFullYear(y, m + 1, 0)
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    mingguIni() {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    tahunIni() {
      const curr = new Date()
      const firstday = date.formatDate(curr, 'YYYY') + '-01' + '-01'
      const lastday = date.formatDate(curr, 'YYYY') + '-12' + '-31'
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },


    setDate(payload) {
      this.params.page = 1
      // this.params.tgl = payload
      this.getKunjunganRanap()
    },
    setPeriodik(val) {
      const { to, from } = val
      this.params.to = to
      this.params.from = from
      delete this.params.nokas
      // console.log('periodik', to)
      this.getKunjunganRanap()
    },
    setTo(val) {
      this.params.to = val
    },
    setFrom(val) {
      this.params.from = val
    },
    setQ(payload) {
      this.params.page = 1
      this.params.q = payload
      this.getKunjunganRanap()
    },
    setFlag(payload) {
      this.params.page = 1
      this.params.flag = payload
      this.getListPasiens()
    },
    setFilterStatus(payload) {
      this.params.page = 1
      this.params.status = payload
      // console.log('stat', payload)
      let pas = []
      if (payload == 'TERLAYANI') {
        pas = this.antrianBpjs.filter(p => p.status == 'Selesai dilayani')?.map(p => p.nokapst)
      }
      else if (payload == 'BELUM TERLAYANI') {
        pas = this.antrianBpjs.filter(p => p.status == 'Belum dilayani' || p.status == 'Sedang dilayani')?.map(p => p.nokapst)
      }
      else if (payload == 'GAGAL BRIDGING') {
        const nokas = this.antrianBpjs?.map(p => p.nokapst)
        pas = this.items.filter(p => !nokas.includes(p.noka))?.map(p => p.noka)
      }
      // const terlayani = this.antrianBpjs.filter(p => p.status == 'Selesai dilayani')
      // const belumTerlayani = this.antrianBpjs.filter(p => p.status == 'Belum dilayani')
      // const bukan = this.antrianBpjs.filter(p => p.status != 'Belum dilayani' && p.status != 'Selesai dilayani')
      // const poli = (new Set(terlayani.map(p => p.kodepoli)))
      // console.log('pas', terlayani, terlayani.length, belumTerlayani?.length, bukan?.length, poli)
      // console.log('pas', pas.length, pas)
      if (pas.length > 0) {
        this.params.nokas = pas
        this.getListPasiens()
      } else {
        this.params.nokas = null
        this.getListPasiens()
      }

      // this.params.status = payload
    },
    setTglAwal() {
      this.params.tgl = dateDbFormat(new Date())
    },
    setPage(payload) {
      this.params.page = payload
      console.log('params', this.params);

      this.getKunjunganRanap()
    },
    setPerPage(payload) {
      this.params.page = 1
      this.params.per_page = payload
      this.getKunjunganRanap()
    },
    setFilters() {
      this.filters = !this.filters
    },
    filterData(val) {
      const { to, from, q } = val // status
      this.params.to = to
      this.params.from = from
      this.params.q = q
      this.getKunjunganRanap()
    },

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListGeneralConsentStore, import.meta.hot))
}
