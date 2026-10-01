import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'
import { dateDbFormat } from 'src/modules/formatter'

export const useListPermintaanRuanganStore = defineStore('list_permintaan_ruangan_store', {
  state: () => ({
    isOpen: false,
    loading: false,
    items: [],
    meta: {},
    header: {
      periode: 'Semua'
    },
    periods: ['Semua', 'Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    param: {
      cari: '',
      no_permintaan: '',
      per_page: 10,
      page: 1,
      from: '',
      to: '',
      tanggal: '',
      flag: ['1', '2', '3', '4']
    },
    statuses: [
      { nama: 'Semua Status', value: '', color: 'grey' },
      { nama: 'Dikirim ke Depo', value: '1', color: 'cyan' },
      { nama: 'Diterima Depo', value: '2', color: 'blue' },
      { nama: 'Telah didistribusikan', value: '3', color: 'orange' },
      { nama: 'Diterima Ruangan', value: '4', color: 'grey' }
    ],
    paramStatus: {
      nama: 'Semua Status', value: '', color: 'grey'
    },
    columns: [
      'no_permintaan',
      'tgl_permintaan',
      'dari',
      'tujuan',
      'flag'
    ],
    columnHide: [],
    dataToPrint: {}
  }),
  actions: {
    setParam(key, val) {
      this.param[key] = val
    },
    setSearch(payload) {
      this.setParam('cari', payload)
      this.setParam('no_permintaan', payload)
      this.setParam('page', 1)
      this.ambilPermintaan()
    },
    setPage(payload) {
      this.setParam('page', payload)
      this.ambilPermintaan()
    },
    setPerPage(payload) {
      this.setParam('per_page', payload)
      this.setParam('page', 1)
      this.ambilPermintaan()
    },
    refreshTable() {
      this.setParam('page', 1)
      this.ambilPermintaan()
    },
    setParamStatus(val) {
      this.paramStatus = val
      if (!val || val.value === '') {
        this.setParam('flag', ['1', '2', '3', '4'])
      } else {
        this.setParam('flag', [val.value])
      }
      this.setParam('page', 1)
      this.ambilPermintaan()
    },
    setPeriode(val) {
      this.header.periode = val
      if (val === 'Semua') {
        this.param.from = ''
        this.param.to = ''
        this.param.tanggal = ''
      } else if (val === 'Hari ini') {
        this.hariIni()
      } else if (val === 'Minggu ini') {
        this.mingguIni()
      } else if (val === 'Bulan ini') {
        this.bulanIni()
      }
      if (val !== 'Custom') {
        this.setParam('page', 1)
        this.ambilPermintaan()
      }
    },
    hariIni() {
      const cDate = new Date()
      this.param.to = dateDbFormat(cDate)
      this.param.from = dateDbFormat(cDate)
      this.param.tanggal = dateDbFormat(cDate)
    },
    mingguIni() {
      const curr = new Date()
      const first = curr.getDate() - curr.getDay() + 1
      const last = first + 6
      const firstday = new Date(curr.setDate(first))
      const lastday = new Date(curr.setDate(last))
      this.param.from = dateDbFormat(firstday)
      this.param.to = dateDbFormat(lastday)
      this.param.tanggal = ''
    },
    bulanIni() {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      const firstday = new Date(y, m, 1)
      const lastday = new Date(y, m + 1, 0)
      this.param.from = dateDbFormat(firstday)
      this.param.to = dateDbFormat(lastday)
      this.param.tanggal = ''
    },
    getInitialData() {
      this.ambilPermintaan()
    },
    ambilPermintaan() {
      this.loading = true
      console.log('penerimaan ', this.param)
      const params = { params: this.param }
      return new Promise(resolve => {
        api.get('v1/simrs/farmasinew/depo/list-permintaan-ruangan', params)
          .then(resp => {
            this.loading = false
            console.log('list permintaan', resp.data)
            this.items = resp.data?.data
            this.meta = resp.data
            if (this.items?.length) {
              this.items.forEach(it => {
                if (it?.permintaanrinci?.length) {
                  it?.permintaanrinci.forEach(ri => {
                    if (it?.mutasigudangkedepo?.length) {
                      const dist = it?.mutasigudangkedepo.filter(mu => mu.kd_obat === ri.kdobat).map(ma => parseFloat(ma.jml)).reduce((a, b) => a + b, 0)
                      // console.log('dist', dist)
                      ri.distribusi = !isNaN(dist) ? dist : 0
                    } else {
                      ri.distribusi = 0
                    }
                  })
                }
              })
            }
            resolve(resp)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    simpanDetail(val, item) {
      this.loadingSimpan = true
      item.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/terimadistribusi', val)
          .then(resp => {
            this.loadingSimpan = false
            item.loading = false
            console.log('terima', resp)
            notifSuccess(resp)
            this.ambilPermintaan()
            resolve(resp)
          })
          .catch(() => {
            this.loadingSimpan = false
            item.loading = false
          })
      })
    }
  }
})
