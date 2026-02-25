import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { date } from 'quasar'

export const useKunjunganRehabmediStore = defineStore('kunjungan-rehabmedik-store', {
  state: () => ({
    items: [],
    meta: null,
    loading: false,
    loadingTerima: false,
    header: {
      periode: 'Hari ini'
    },
    params: {
      page: 1,
      per_page: 20,
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
    bukaLayanan: false,
    loadingSaveGantiDpjp: false
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {
    getDataTable() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.get('/v1/simrs/rehabmedik/kunjunganpasien', {
          params: this.params
        }).then(res => {
          // console.log('res list tggu remed', res)
          if (res.status === 200) {
            const total = res.data?.total
            const obj = res.data?.data
            const clone = (({ data, ...o }) => o)(obj)
            this.meta = clone
            this.meta.total = total
            this.items = obj?.data ?? []

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

    terimaPasien(pasien) {
      this.loadingTerima = true

      const payload = {
        noreg: pasien?.noreg,
        norm: pasien?.norm
      }

      return new Promise((resolve, reject) => {
        api.get('/v1/simrs/rehabmedik/terimapasien', {
          params: payload
        }).then(res => {

          this.setPasien(pasien, res?.data)
          resolve(res)
        }).catch(err => {
          console.log('err list tggu ranap', err)
          reject(err)
        }).finally(() => {
          this.loadingTerima = false
        })
      })

    },

    setPasien(pasien, data) {
      const findPasien = this.items.filter(x => x?.noreg === pasien?.noreg)
      // this.pasiens[indexPasien] = data
      // // console.log('wew', this.pasiens[indexPasien])
      if (findPasien?.length) {
        const datax = findPasien[0]
        // 
        datax.laborats = data?.laborats ?? []
        datax.laboratold = data?.laboratold ?? []
        datax.hasilradiologi = data?.hasilradiologi ?? []
        datax.radiologi = data?.radiologi ?? []
        datax.diagnosa = data?.diagnosa ?? []
        datax.newapotekrajal = data?.newapotekrajal ?? []
        datax.anamnesis = data?.anamnesis ?? []
        datax.pengkajian = data?.pengkajian ?? []
        datax.memodiagnosa = data?.memodiagnosa ?? null
        datax.soap = data?.soap ?? [],
          datax.tindakan = data?.tindakan ?? []
        datax.datasimpeg = data?.datasimpeg ?? null
      }

      console.log('find pasien', findPasien);

    },

    async gantiDpjp(form, pasien) {
      // console.log('form', form)
      // console.log('pasien', pasien)
      this.loadingSaveGantiDpjp = true
      try {
        const resp = await api.post('/v1/simrs/rehabmedik/gantidpjp', form)
        console.log('resp', resp);

        if (resp.status === 200) {
          const findPasien = this.items.find(x => x?.noreg === pasien?.noreg)
          console.log('findPasien', findPasien);

          if (findPasien) {
            const data = findPasien
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
        this.loadingSaveGantiDpjp = false
      }
    },

    setPeriode(val) {
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

    setUrutan(val) {
      this.params.sort = val
      this.getDataTable()
    },

    setPage(val) {
      this.params.page = val
      this.getDataTable()
    },

    setStatus(val) {
      this.params.page = 1
      this.params.status = val
      this.getDataTable()
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

    injectDataPasien(noreg, val, kode, arr) {
      const findPasien = this.items?.find(x => x.noreg === noreg)
      console.log('inject pasien rehab', findPasien)
      if (findPasien) {
        const data = findPasien
        // data[kode] = val
        if (kode === 'kd_jeniskasus' ||
          kode === 'status' || kode === 'carakeluar' || kode === 'prognosis' ||
          kode === 'tindaklanjut' || kode === 'diagakhir' || kode === 'sebabkematian') {
          data[kode] = val
        }
        else {
          const target = data[kode]?.find(x => x.id === val?.id) ?? null
          console.log('inject target pasien', target, kode, val, data)
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

    hapusDataInjectan(noreg, id, key) {
      const findPasien = this.items.filter(x => x?.noreg === noreg)
      if (findPasien?.length) {
        const data = findPasien[0][key]
        const pos = data.findIndex(el => el.id === id)
        if (pos >= 0) { data.splice(pos, 1) }
      }
    },


    injectMemo(noreg, isi) {

      const findPasien = this.items?.filter(x => x?.noreg === noreg)
      if (findPasien?.length) {
        const data = findPasien[0]
        data.memodiagnosa = isi
      }

    },


  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useKunjunganRehabmediStore, import.meta.hot))
