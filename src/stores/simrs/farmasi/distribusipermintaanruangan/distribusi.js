import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'
import { dateDbFormat } from 'src/modules/formatter'

export const useDistribusiPermintaanRuanganStore = defineStore('distribusi_permintaan_ruangan', {
  state: () => ({
    isOpen: false,
    loading: false,
    loadingSimpan: false,
    loadingCariPermintaan: false,
    loadingKunci: false,
    items: [],
    meta: { },
    header: {
      periode: 'Semua'
    },
    periods: ['Semua', 'Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    params: {
      page: 1,
      q: '',
      per_page: 10,
      no_permintaan: '',
      kdgudang: '',
      dari: '',
      flag: '',
      from: '',
      to: '',
      jenisdistribusi: 'non-konsinyasi'
    },
    form: {
    },
    disp: { no_permintaan: '' },
    terpilih: {},
    columns: [
      'no_permintaan',
      'tgl_permintaan',
      'dari',
      'status',
      'act'
    ],
    gudangs: [
      { nama: 'Gudang Farmasi ( Kamar Obat )', value: 'Gd-05010100' },
      { nama: 'Gudang Farmasi (Floor Stok)', value: 'Gd-03010100' }
    ],
    depos: [
      { nama: 'Floor Stock 1 (AKHP)', value: 'Gd-03010101' },
      { nama: 'Floor Stock 2 (Obat)', value: 'Gd-04010101' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'Depo IGD', value: 'Gd-02010104' }
    ],
    statuses: [
      { nama: 'Semua Status', value: '', color: 'grey' },
      { nama: 'Permintaan dikirim ke Depo', value: '1', color: 'cyan' },
      { nama: 'Diterima Depo', value: '2', color: 'blue' },
      { nama: 'Telah didistribusikan', value: '3', color: 'orange' },
      { nama: 'Diterima Ruangan', value: '4', color: 'grey' }
    ],
    paramStatus: {
      nama: 'Semua Status', value: '', color: 'grey'
    },
    dataToPrint: {}
  }),
  actions: {
    setForm (key, val) {
      this.form[key] = val
    },
    setParams (key, val) {
      this.params[key] = val
    },
    setSearch (val) {
      this.setParams('q', val)
      this.setParams('no_permintaan', val)
      this.setParams('page', 1)
      this.getPermintaanDepo()
    },
    setPage (val) {
      this.setParams('page', val)
      this.getPermintaanDepo()
    },
    setPerPage (val) {
      this.setParams('per_page', val)
      this.setParams('page', 1)
      this.getPermintaanDepo()
    },
    refreshTable (val) {
      this.setParams('page', 1)
      this.getPermintaanDepo()
    },
    setDari (val) {
      this.setParams('dari', val ?? '')
      this.setParams('page', 1)
      this.getPermintaanDepo()
    },
    setPeriode (val) {
      this.header.periode = val
      if (val === 'Semua') {
        this.params.from = ''
        this.params.to = ''
      } else if (val === 'Hari ini') {
        this.hariIni()
      } else if (val === 'Minggu ini') {
        this.mingguIni()
      } else if (val === 'Bulan ini') {
        this.bulanIni()
      }
      if (val !== 'Custom') {
        this.setParams('page', 1)
        this.getPermintaanDepo()
      }
    },
    hariIni () {
      const cDate = new Date()
      this.params.to = dateDbFormat(cDate)
      this.params.from = dateDbFormat(cDate)
    },
    mingguIni () {
      const curr = new Date()
      const first = curr.getDate() - curr.getDay() + 1
      const last = first + 6
      const firstday = new Date(curr.setDate(first))
      const lastday = new Date(curr.setDate(last))
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },
    bulanIni () {
      const curr = new Date(), y = curr.getFullYear(), m = curr.getMonth()
      const firstday = new Date(y, m, 1)
      const lastday = new Date(y, m + 1, 0)
      this.params.from = dateDbFormat(firstday)
      this.params.to = dateDbFormat(lastday)
    },
    setParamStatus (val) {
      this.paramStatus = val
      this.setParams('flag', val?.value ?? '')
      this.setParams('page', 1)
      this.getPermintaanDepo()
    },
    permintaanSelected (val) {
      this.disp.no_permintaan = val
      const temp = this.items.filter(a => a.no_permintaan === val)
      if (temp?.length) {
        const item = temp[0]
        this.terpilih = item
        console.log('item', item)
      }
    },
    gantiJenisDistribusi (val) {
      console.log('jenis dist', val)
      this.setParams('jenisdistribusi', val)
      this.getPermintaanDepo()
    },
    cariPermintaan (val) {
      const needle = val.toLowerCase()
      const arr = 'no_permintaan'
      let opt = []

      const splits = arr.split('-')
      const multiFilter = (data = [], filterKeys = [], value = '') =>
        data.filter((item) =>
          filterKeys.some(
            (key) =>
              item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
                item[key]
          )
        )
      const filteredData = multiFilter(this.items, splits, needle)
      opt = filteredData
      if (opt?.length <= 0) {
        this.setParams('no_permintaan', val)
        this.getPermintaanDepo()
        // console.log('opt', 'ga ada')
      }
      // console.log('opt', opt)
      // console.log('val', val)
    },

    getInitialData () {
      this.getPermintaanDepo()
    },
    getPermintaanDepo () {
      this.loading = true
      const param = { params: this.params }
      return new Promise(resolve => {
        // api.get('v1/simrs/farmasinew/gudang/distribusi/rencanadistribusikedepo', param)
        api.get('v1/simrs/farmasinew/gudang/distribusi/list-permintaan-ruangan', param)
          .then(resp => {
            this.loading = false
            this.items = resp?.data?.data
            this.meta = resp.data
            if (this.items?.length) {
              console.log('items anu', this.items)
              this.items.forEach(it => {
                if (it?.permintaanrinci?.length) {
                  it?.permintaanrinci.forEach(ri => {
                    ri.jumlahdiminta = ri.jumlah_minta
                    ri.jumlah_minta = 0
                    if (it?.mutasigudangkedepo?.length) {
                      const dist = it?.mutasigudangkedepo.filter(mu => mu.kd_obat === ri.kdobat).map(ma => parseFloat(ma.jml)).reduce((a, b) => a + b, 0)
                      console.log('dist', dist)
                      ri.distribusi = !isNaN(dist) ? dist : 0
                    }
                    else {
                      ri.distribusi = 0
                    }
                  })
                }
              })
            }
            console.log('list PErmintaan depo', this.items)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    simpanDetail (val, row) {
      this.loadingSimpan = true
      row.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/gudang/distribusi/simpandistribusidepo', val)
          .then(resp => {
            this.loadingSimpan = false
            delete row.loading
            console.log('didtribusi', resp)
            val.distribusi = parseFloat(resp?.data?.data?.jml)
            notifSuccess(resp)
            // this.getPermintaanDepo()
            resolve(resp)
          })
          .catch(() => {
            this.loadingSimpan = false
            delete row.loading
          })
      })
    },
    kunci (val) {
      console.log('store.kunci')
      this.loadingKunci = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/gudang/distribusi/kuncipermintaandaridepo', val)
          .then(resp => {
            this.loadingKunci = false
            this.getPermintaanDepo()
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            this.loadingKunci = false
          })
      })
    },
    tolak (val) {
      console.log('store.tolak')
      val.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/gudang/distribusi/tolak', val)
          .then(resp => {
            delete val.loading
            this.getPermintaanDepo()
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            delete val.loading
          })
      })
    },
    distribusi (val) {
      console.log('store.kunci')
      this.loadingKunci = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/gudang/distribusi/distribusikan', val)
          .then(resp => {
            this.loadingKunci = false
            this.getPermintaanDepo()
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            this.loadingKunci = false
          })
      })
    }
  }
})
