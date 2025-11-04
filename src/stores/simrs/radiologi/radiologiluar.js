import { acceptHMRUpdate, defineStore, } from 'pinia'
import { api } from 'boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { date } from 'quasar'
import { notifErrVue, notifSuccessVue } from 'src/modules/utils'

export const useListRadiologiLuarStore = defineStore('list-radiologi-luar', {
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
    isForm: false,
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

    // INI BARU
    namaPemeriksaans: [],
    jenisPemeriksaans: [],
    listPemeriksaans: [],
    dokters: [],
    perawats: [],
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {


    getDataTable() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.get('/v1/simrs/radiologi/radiologi/pasienradiologiluar', {
          params: this.params
        }).then(res => {
          // console.log('resp pasien radiologi luar', res)
          if (res.status === 200) {
            const total = res.data?.total
            const obj = res.data?.data
            const clone = (({ data, ...o }) => o)(obj)
            this.meta = clone
            this.meta.total = total
            this.items = obj?.data ?? []
            // this.pageTindakan = true
          }
          this.loading = false
          resolve(res)
        }).catch(err => {
          console.log('radiologi luar', err)
          this.loading = false
          reject(err)
        })
      })
    },

    async getDataPasienRadiologiByNota(pasien) {
      this.pasien = pasien
      console.log('getDataPasienRadiologiByNoreg', pasien);

      // this.loadingTerima = true

      // const permintaan = usePermintaanRadiologiStore()
      // try {
      //   const resp = await api.get(`/v1/simrs/radiologi/radiologi/getDataPasienRadiologiLuarByNota?nota=${pasien?.nota_permintaan}`)
      //   console.log('resp pasien radiologi', resp, this.depo)
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




    },

    async terimaPasien(val) {
      this.loadingTerima = true
      // console.log('terima pasien', val);
      const payload = {
        'notrans': val?.rs1
      }
      await api.post('/v1/simrs/radiologi/radiologi/terimapasienradiologiluar', payload)
        .then(resp => {
          // console.log('resp terima pasien radiologi', resp);
          if (resp.status === 200) {
            // notifSuccessVue('Pasien berhasil diterima')
            // this.getDataTable()
            const finder = this.items.find(x => x?.rs1 === val?.rs1)
            if (finder) {
              finder['flag'] = '2'
            }
          }
        }).catch(err => {
          console.log('err terima pasien radiologi', err);
          // notifErrVue('Pasien gagal diterima')
        }).finally(() => {
          this.loadingTerima = false
        })
    },
    async batalkanPasien(val) {
      this.loadingBatal = true
      // console.log('batalkan pasien', val);
      const payload = {
        'notrans': val?.rs1
      }
      await api.post('/v1/simrs/radiologi/radiologi/batalkanpasienradiologiluar', payload)
        .then(resp => {
          console.log('resp batal pasien radiologi', resp);
          if (resp.status === 200) {
            // notifSuccessVue('Pasien berhasil diterima')
            // this.getDataTable()
            const finder = this.items.find(x => x?.rs1 === val?.rs1)
            if (finder) {
              finder['flag'] = '3'
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
        'notrans': val?.notrans
      }
      await api.post('/v1/simrs/radiologi/radiologi/selesaikanlayananradiologiluar', payload)
        .then(resp => {
          // console.log('resp selesaikan layanan radiologi luar', resp);
          if (resp.status === 200) {
            // notifSuccessVue('Pasien berhasil diterima')
            // this.getDataTable()
            const finder = this.items.find(x => x?.rs1 === val?.rs1)
            if (finder) {
              finder['flag'] = '1'
            }
          }
        }).catch(err => {
          console.log('err selesaikan pasien radiologi', err);
          // notifErrVue('Pasien gagal diterima')
        }).finally(() => {
          this.loadingBatal = false
        })
    },

    initPermintaan(pasien) {
      this.listPemeriksaans = pasien?.rincians?.map(x => {


        const kdPelaksana = this.dokters?.find(d => d.nama === x?.pelaksana)?.kdpegsimrs || null

        const ukuran = x?.ukuran || '43 x 35'
        const jumlah = x?.jumlah || 1
        const pelaksana = x?.pelaksana || null
        const hasil = x?.hasil || null
        const kesimpulan = x?.kesimpulan || null
        return {
          ...x,
          ukuran, jumlah, pelaksana, hasil, kesimpulan, kdPelaksana
        }
      })

    },

    initNakes(store) {

      this.dokters = store?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      this.perawats = store?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []

      // console.log('initNakes dokters', this.dokters);

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

    async batal(item) {
      const itemId = this.items?.find(x => x?.id === item?.id) || null
      console.log('batal', itemId);

    },

    async simpan(item, pasien) {
      // console.log('simpan', item, pasien);

      if (item.hasil === null || item.kesimpulan === null || item.pelaksana === null) {
        notifErrVue('Ada field yang belum diisi, silahkan periksa kembali')
        return

      }

      this.loadingSimpan = true
      const payload = {
        'notrans': item?.rs1,
        'nama': pasien?.nama || '',
        'alamat': pasien?.alamat || '',
        'kelamin': pasien?.kelamin || '',
        'tgllahir': pasien?.tgllahir || '',
        'yangmeminta': pasien?.dari || '',
        // 'tanggal': item?.rs7 || '',
        'hasil': item?.hasil || '',
        'hasilhtml': item?.hasilhtml || '',
        'kesimpulan': item?.kesimpulan || '',
        'kesimpulanhtml': item?.kesimpulanhtml || '',
        'kode': item?.rs3 || '',
        'dokter': item?.pelaksana || ''
      }


      // console.log('payload simpan', payload);
      await api.post('/v1/simrs/radiologi/radiologi/simpanHasilRadiologiLuar', payload)
        .then(resp => {
          console.log('simpan hasil', resp);
          if (resp.status === 200) {
            notifSuccessVue(resp?.data?.message || 'Data berhasil disimpan')
            this.getDataTable()
          }
        })
        .catch(err => {
          console.log('error', err);
        })
        .finally(() => {
          this.loadingSimpan = false
        })


    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListRadiologiLuarStore, import.meta.hot))
}
