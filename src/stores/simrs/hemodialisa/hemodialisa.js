import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { date } from 'quasar'

export const useListPasienHemodialisaStore = defineStore('list-pasien-hemodialisa', {
  state: () => ({
    items: [],
    meta: null,
    loading: false,
    header: {
      periode: 'Hari ini'
    },
    params: {
      page: 1,
      per_page: 50,
      q: '',
      status: 'Semua',
      to: dateDbFormat(new Date()),
      from: dateDbFormat(new Date()),
      sort: 'terbaru'
    },
    periods: ['Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    sorting: ['terbaru', 'terlama'],
    statuses: ['Semua', 'Terlayani', 'Belum terlayani'],
    isViewList: false,
    pasien: null,
    pageTindakan: false,
    loadingTerima: false
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {
    getDataTable () {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.get('/v1/simrs/hemodialisa/hemodialisa/pasienhemodialisa', {
          params: this.params
        }).then(res => {
          // console.log('res list tggu ranap', res)
          if (res.status === 200) {
            const total = res.data?.total
            const obj = res.data?.data
            const clone = (({ data, ...o }) => o)(obj)
            this.meta = clone
            this.meta.total = total
            this.items = obj?.data ?? []

            console.log('this.meta', this.meta)
            console.log('this.items', this.items)
            // this.togglePageTindakan()
            this.pageTindakan = true
          }
          this.loading = false
          resolve(res)
        }).catch(err => {
          console.log('err list tggu ranap', err)
          this.loading = false
          reject(err)
        })
      })
    },

    setPeriode (val) {
      this.header.periode = val
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

    setUrutan (val) {
      this.params.sort = val
      this.getDataTable()
    },

    setPage (val) {
      this.params.page = val
      this.getDataTable()
    },

    setStatus (val) {
      this.params.page = 1
      this.params.status = val
      this.getDataTable()
    },

    hariIni () {
      const cDate = new Date()
      this.params.to = dateDbFormat(cDate)
      this.params.from = dateDbFormat(cDate)
    },
    bulanIni () {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      // const firstday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-01'
      // const lastday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-31'
      const firstday = curr.setFullYear(y, m, 1)
      const lastday = curr.setFullYear(y, m + 1, 0)
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    mingguIni () {
      const curr = new Date()
      const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
      const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    tahunIni () {
      const curr = new Date()
      const firstday = date.formatDate(curr, 'YYYY') + '-01' + '-01'
      const lastday = date.formatDate(curr, 'YYYY') + '-12' + '-31'
      this.params.to = dateDbFormat(firstday)
      this.params.from = dateDbFormat(lastday)
    },
    togglePageTindakan () {
      this.pageTindakan = !this.pageTindakan
    },
    injectDataPasien (noreg, val, kode, arr) {
      const findPasien = this.items?.filter(x => x.noreg === noreg)
      // console.log('inject pasien', findPasien)
      if (findPasien.length) {
        const data = findPasien[0]
        // data[kode] = val
        if (kode === 'kd_jeniskasus' ||
          kode === 'status' || kode === 'carakeluar' || kode === 'prognosis' ||
          kode === 'tindaklanjut' || kode === 'diagakhir' || kode === 'sebabkematian') {
          data[kode] = val
        }
        else {
          const target = data[kode]?.find(x => x.id === val?.id) ?? null
          // console.log('inject target pasien', target, kode, val, data)
          // console.log('inject kode pasien', kode)
          // console.log('inject isi pasien', val)

          if (target) {
            Object.assign(target, val)
          }
          else {
            data[kode]?.splice(0, 0, val)
            // data[kode].push(val)
          }
        }
      }
    },
    injectDataArray (noreg, arr, kode) {
      const findPasien = this.items.filter(x => x?.noreg === noreg)
      // console.log('inject pasien', findPasien)
      if (findPasien.length) {
        const data = findPasien[0]
        data[kode] = arr
      }
    },

    injectUpdatean (noreg, id, val, kode) {
      const findPasien = this.items.filter(x => x?.noreg === noreg)
      if (findPasien.length) {
        const data = findPasien[0]
        const target = data[kode]?.find(x => x?.id === id)
        if (target) {
          Object.assign(target, val)
        }
      }
    },
    deleteInjectanNull (noreg, kode) {
      const findPasien = this.items.filter(x => x.noreg === noreg)
      if (findPasien.length) {
        const data = findPasien[0]
        const target = data[kode]?.find(x => x?.id === null || x?.id === '' || x?.id === undefined || !('id' in x)) ?? null
        if (target) {
          data[kode]?.splice(data[kode]?.findIndex(x => x?.id === null), 1)
        }
      }
    },
    deleteInjectanNull2 (noreg, kode) {
      const findPasien = this.items.filter(x => x.noreg === noreg)
      if (findPasien.length) {
        const data = findPasien[0]
        const target = data[kode]?.find(x => !('id' in x))
        if (target) {
          data[kode]?.splice(target, 1)
        }
      }
    },
    terimapasien (pas) {
      return new Promise((resolve, reject) => {
        api.post('v1/simrs/hemodialisa/hemodialisa/terima-pasien', pas)
          .then((resp) => {
            console.log('resp', resp)
            const findPasien = this.items.find(x => x?.noreg === pas?.noreg)
            if (findPasien) {
              findPasien.anamnesis = resp?.data?.anamnesis
            }
            resolve(resp)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListPasienHemodialisaStore, import.meta.hot))
}
