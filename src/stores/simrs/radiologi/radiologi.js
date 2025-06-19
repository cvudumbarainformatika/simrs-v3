import { acceptHMRUpdate, defineStore, } from 'pinia'
import { api } from 'boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { date } from 'quasar'
import { usePermintaanRadiologiStore } from './permintaan'

export const useListPasienRadiologiStore = defineStore('list-pasien-radiologi', {
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
    pageTindakan: false,
    loadingTerima: false,
    loadingBatal: false,
    loadingSimpan: false,
    loadingSelesaikan: false,
    bukaLayanan: false,
    pasiens: [],
    pasien: null,
    newapotekrajal: [],
    diagnosa: [],
    koderuangan: null,
    depo: null,

    alasanpembatalan: null,

    // INI BARU
    namaPemeriksaans: [],
    jenisPemeriksaans: [],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {


    getDataTable() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.get('/v1/simrs/radiologi/radiologi/pasienradiologi', {
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

            // console.log('this.meta', this.meta)
            // console.log('this.items', this.items)
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

    async getDataPasienRadiologiByNota(pasien) {
      this.pasien = pasien
      // console.log('getDataPasienRadiologiByNoreg', pasien);

      this.loadingTerima = true

      const permintaan = usePermintaanRadiologiStore()
      // try {
      //   const resp = await api.get(`/v1/simrs/radiologi/radiologi/getDataPasienRadiologiByNota?nota=${pasien?.nota_permintaan}`)
      //   // console.log('resp pasien radiologi', resp, this.depo)
      //   if (resp.status === 200) {
      //     this.pasien['permintaan'] = resp.data?.permintaan ?? null
      //     this.pasien['newapotekrajal'] = resp.data?.newapotekrajal ?? []
      //     permintaan.initPermintaan(this.pasien)

      //   }
      // } catch (error) {
      //   console.error('Error fetching data for pasien radiologi:', error)

      // } finally {
      //   this.loadingTerima = false
      // }

      await api.get(`/v1/simrs/radiologi/radiologi/getDataPasienRadiologiByNota?nota=${pasien?.nota_permintaan}`)
        .then(resp => {
          // console.log('resp pasien radiologi', resp, this.depo)
          if (resp.status === 200) {
            this.pasien['permintaan'] = resp.data?.permintaan ?? null
            this.pasien['newapotekrajal'] = resp.data?.newapotekrajal ?? []
            permintaan.initPermintaan(this.pasien)

          }
        }).catch(err => {
          console.log('err pasien radiologi', err);
          // notifErrVue('Pasien gagal diterima')
        }).finally(() => {
          this.loadingTerima = false
        })




    },

    async terimaPasien(val) {
      this.loadingTerima = true
      // console.log('terima pasien', val);
      const payload = {
        'notrans': val?.nota_permintaan
      }
      await api.post('/v1/simrs/radiologi/radiologi/terimapasienradiologi', payload)
        .then(resp => {
          console.log('resp terima pasien radiologi', resp);
          if (resp.status === 200) {
            // notifSuccessVue('Pasien berhasil diterima')
            // this.getDataTable()
            const finder = this.items.find(x => x?.nota_permintaan === val?.nota_permintaan)
            if (finder) {
              finder['status'] = '2'
            }
          }
        }).catch(err => {
          console.log('err terima pasien radiologi', err);
          // notifErrVue('Pasien gagal diterima')
        }).finally(() => {
          this.loadingTerima = false
        })
    },

    async batalkanPasien(val, alasan) {
      this.loadingBatal = true
      // console.log('batalkan pasien', val);
      const payload = {
        'notrans': val?.nota_permintaan,
        'alasanpembatalan': alasan
      }
      await api.post('/v1/simrs/radiologi/radiologi/batalkanpasienradiologi', payload)
        .then(resp => {
          // console.log('resp batal pasien radiologi', resp);
          if (resp.status === 200) {
            // notifSuccessVue('Pasien berhasil diterima')
            // this.getDataTable()
            const finder = this.items.find(x => x?.nota_permintaan === val?.nota_permintaan)
            if (finder) {
              finder['status'] = '3'
            }
          }
        }).catch(err => {
          console.log('err batal pasien radiologi', err);
          // notifErrVue('Pasien gagal diterima')
        }).finally(() => {
          this.loadingBatal = false
        })
    },

    async selesaikanLayanan(val) {
      this.loadingSelesaikan = true
      // console.log('selesaikan layanan', val?.notrans);
      const payload = {
        'notrans': val?.nota_permintaan
      }
      await api.post('/v1/simrs/radiologi/radiologi/selesaikanlayananradiologi', payload)
        .then(resp => {
          // console.log('resp selesaikan layanan radiologi luar', resp);
          if (resp.status === 200) {
            // notifSuccessVue('Pasien berhasil diterima')
            // this.getDataTable()
            const finder = this.items.find(x => x?.nota_permintaan === val?.nota_permintaan)
            if (finder) {
              finder['status'] = '1'
            }
          }
        }).catch(err => {
          console.log('err selesaikan pasien radiologi', err);
          // notifErrVue('Pasien gagal diterima')
        }).finally(() => {
          this.loadingBatal = false
        })
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
    togglePageTindakan() {
      this.pageTindakan = !this.pageTindakan
    },

    // BARU RADIOLOGI
    helperKdRuangan(val) {
      const ruang = val?.ruangan.split('').slice(0, 3).join('')
      const poli = val?.poli.split('').slice(0, 3).join('')
      if (ruang === 'Rua' || poli === 'Rua') {
        this.depo = 'rnp'
      }
      else if (ruang === 'IRD' || poli === 'IRD') {
        this.depo = 'igd'
      }
      else if (ruang === 'Kam' || poli === 'Kam') {
        this.depo = 'ok'
      }
      else {
        this.depo = 'rjl'
      }
    },
    async simpan() {
      console.log('simpan');

    },

    async batal(item) {
      const itemId = this.items?.find(x => x?.id === item?.id) || null
      console.log('batal', itemId);

    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListPasienRadiologiStore, import.meta.hot))
}
