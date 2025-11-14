import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { notifSuccess } from 'src/modules/utils'

export const useListKunjunganBpjsStore = defineStore('list_kunjungan_bpjs', {
  state: () => ({
    items: [],
    antrianBpjs: [],
    meta: null,
    params: {
      q: '',
      per_page: 10,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      // tgl: dateDbFormat(new Date()),
      to: dateDbFormat(new Date()),
      from: dateDbFormat(new Date()),
      kdbayar: null,
      status: null
    },
    loading: false,
    loadingBpjs: false,
    loadingH: false,
    filters: false
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    getLists () {
      this.getAntrianBPJS()
      this.getListPasiens()
    },
    async getListPasiens () {
      this.loading = true
      // const params = { params: this.params }
      // const resp = await api.get('/v1/simrs/pendaftaran/kunjunganpasienbpjs', params)

      const resp = await api.post('/v1/simrs/pendaftaran/kunjunganpasienbpjs', this.params)
      if (resp.status === 200) {
        console.log('kunjungan', resp)
        this.items = resp.data.data
        this.meta = resp.data?.meta ?? resp?.data
        this.loading = false
      }
      this.loading = false
    },
    getArrDates (da1, da2) {
      const from = new Date(da1)
      const to = new Date(da2)

      const dates = []
      let current = new Date(from)

      while (current <= to) {
        dates.push(current.toISOString().split('T')[0]) // format YYYY-MM-DD
        current.setDate(current.getDate() + 1) // tambah 1 hari
      }

      return dates
    },
    async getAntrianBPJS () {
      const tgls = this.getArrDates(this.params.from, this.params.to)
      // console.log('get antrian bpjs', tgls)
      this.loadingBpjs = true
      this.antrianBpjs = []
      try {
        for (const tgl of tgls) {
          const resp = await this.getDataAntrian(tgl)
          const metadata = resp?.data?.data?.metadata
          const data = resp?.data?.data?.result
          if (metadata?.code == 200) {
            if (Array.isArray(data)) {
              this.antrianBpjs.push(...data) // kalau array, spread
            } else if (data) {
              this.antrianBpjs.push(data) // kalau object tunggal
            }
          }
          // console.log('data antrian', metadata, data)
          console.log('data antrian', this.antrianBpjs.length)
        }
      } catch (e) {
        console.log('e', e)
      } finally {
        // console.log('f', this.antrianBpjs)
        this.loadingBpjs = false
      }
    },

    async getDataAntrian (tgal) {
      try {
        const param = { tgl: tgal }
        const resp = await api.post('v1/simrs/pendaftaran/cari-antrian-bpjs', param)
        // console.log('resp antrian', tgal, resp)
        return resp
      } catch (e) {
        console.log('e', e)
      }
    },
    hapusPasien (pasien) {
      console.log('hapus', pasien)
      this.loadingH = true
      const form = {
        noreg: pasien.noreg,
        nosep: pasien.sep
      }
      return new Promise(resolve => {
        api.post('/v1/simrs/pendaftaran/hapuspasien', form)
          .then(resp => {
            this.loadingH = false
            notifSuccess(resp)
            this.getLists()
            resolve(resp)
          })
          .catch(() => {
            this.loadingH = false
          })
      })
    },
    setDate (payload) {
      this.params.page = 1
      // this.params.tgl = payload
      this.getLists()
    },
    setPeriodik (val) {
      const { to, from } = val
      this.params.to = to
      this.params.from = from
      delete this.params.nokas
      // console.log('periodik', to)
      this.getLists()
    },
    setTo (val) {
      this.params.to = val
    },
    setFrom (val) {
      this.params.from = val
    },
    setQ (payload) {
      this.params.page = 1
      this.params.q = payload
      this.getLists()
    },
    setFlag (payload) {
      this.params.page = 1
      this.params.flag = payload
      this.getListPasiens()
    },
    setFilterStatus (payload) {
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
    setTglAwal () {
      this.params.tgl = dateDbFormat(new Date())
    },
    setPage (payload) {
      this.params.page = payload
      this.getLists()
    },
    setPerPage (payload) {
      this.params.page = 1
      this.params.per_page = payload
      this.getLists()
    },
    setFilters () {
      this.filters = !this.filters
    },
    filterData (val) {
      const { to, from, q } = val // status
      this.params.to = to
      this.params.from = from
      this.params.q = q
      this.getLists()
    },
    kirimUlangTask (payload) {
      const indexReg = this.items.findIndex(p => p.noreg == payload.noreg)
      const indexAntrian = this.antrianBpjs.findIndex(p => p.kodebooking == payload.kodebooking)
      // console.log('payload', payload, indexAntrian, indexAntrian)
      return new Promise(resolve => {
        api.post('/v1/simrs/pendaftaran/kirim-ulang-taskid', payload)
          .then(resp => {

            delete this.items[indexReg].loading
            delete this.antrianBpjs[indexAntrian].loading
            const antrian = resp?.data?.data?.antrian?.result[0] ?? false
            if (antrian) this.antrianBpjs[indexAntrian] = antrian
            this.items[indexReg].taskid = resp?.data?.data?.kunjungan?.taskid
            this.items[indexReg].bpjshttprespon = resp?.data?.data?.kunjungan?.bpjshttprespon
            console.log('resp', resp?.data?.data, this.items[indexReg], this.antrianBpjs[indexAntrian], antrian)
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            delete this.items[indexReg].loading
            delete this.antrianBpjs[indexAntrian].loading
          })
      })

    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListKunjunganBpjsStore, import.meta.hot))
}
