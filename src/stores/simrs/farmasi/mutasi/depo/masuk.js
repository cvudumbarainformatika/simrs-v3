import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'
import { dateDbFormat } from 'src/modules/formatter'

export const useMutasiMasukDepoStore = defineStore('mutasi_masuk_depo', {
  state: () => ({
    isOpen: false,
    loading: false,
    loadingSimpan: false,
    loadingKunci: false,
    items: [],
    meta: {},
    header: {
      periode: 'Semua'
    },
    periods: ['Semua', 'Hari ini', 'Minggu ini', 'Bulan ini', 'Custom'],
    params: {
      page: 1,
      q: '',
      per_page: 10,
      jenisdistribusi: 'non-konsinyasi',
      no_permintaan: '',
      kdgudang: '',
      dari: '',
      from: '',
      to: '',
      flag: ''
    },
    form: {},
    columns: [
      'no_permintaan',
      'tgl_permintaan',
      'dari',
      'tujuan',
      'status',
      'act'
    ],
    gudangs: [
      { nama: 'Gudang Farmasi ( Kamar Obat )', value: 'Gd-05010100' },
      { nama: 'Gudang Farmasi (Floor Stok)', value: 'Gd-03010100' }
    ],
    depos: [
      { nama: 'Semua Depo', value: '' },
      { nama: 'Floor Stock 1 (AKHP)', value: 'Gd-03010101' },
      { nama: 'Floor Stock 2 (Obat)', value: 'Gd-04010101' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'Depo IGD', value: 'Gd-02010104' }
    ],
    statuses: [
      { nama: 'Semua Status', value: '', color: 'grey' },
      { nama: 'Menunggu verifikasi', value: '1', color: 'cyan' },
      { nama: 'Telah di verifikasi', value: '2', color: 'blue' },
      { nama: 'Sudah Didistribusikan', value: '3', color: 'orange' },
      { nama: 'Diterima Depo', value: '4', color: 'purple' }
    ],
    paramStatus: {
      nama: 'Semua Status', value: '', color: 'grey'
    },
    columnsHide: [],
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
    getInitialData () {
      this.getPermintaanDepo()
    },
    metaniRinci () {
      this.items.forEach(item => {
        item?.permintaanrinci?.forEach(rinc => {
          rinc.distribusi = item?.mutasigudangkedepo?.filter(x => x.kd_obat === rinc.kdobat).map(m => parseFloat(m.jml)).reduce((a, b) => a + b, 0) ?? 0
        })
      })
    },
    getPermintaanDepo () {
      this.items = []
      this.loading = true
      const param = { params: this.params }
      return new Promise(resolve => {
        api.get('v1/simrs/farmasinew/depo/list-mutasi', param)
          .then(resp => {
            this.loading = false
            this.items = resp?.data?.data ?? resp?.data
            this.meta = resp.data

            console.log('list PErmintaan depo', resp?.data)
            if (this.items?.length) this.metaniRinci()
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    simpanDetail (val) {
      this.loadingSimpan = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/terimadistribusi', val)
          .then(resp => {
            this.loadingSimpan = false
            console.log('terima', resp)
            notifSuccess(resp)
            this.getPermintaanDepo()
            resolve(resp)
          })
          .catch(() => { this.loadingSimpan = false })
      })
    },
    kirim (val) {
      const data = {
        no_permintaan: val
      }
      this.loadingKunci = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/kuncipermintaan', data)
          .then(resp => {
            this.loadingKunci = false
            console.log('kunci permintaan ', resp)
            notifSuccess(resp)
            this.getPermintaanDepo()
            this.details = []
            this.getListObat()
            this.clearForm()
            resolve(resp)
          })
          .catch(() => { this.loadingKunci = false })
      })
    },
    batalHead (val) {
      const data = { id: val?.id }
      this.loadingBatal = true
      val.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/hapus-permintaan-head', data)
          .then(resp => {
            this.loadingBatal = false
            val.loading = false
            console.log('hapus permintaan ', resp)
            notifSuccess(resp)
            // const list = useListPermintaanStore()
            // list.ambilPermintaan()
            this.getPermintaanDepo()
            this.details = []
            this.getListObat()
            this.clearForm()
            resolve(resp)
          })
          .catch(() => {
            this.loadingBatal = false
            val.loading = false
          })
      })
    },
    batalRinci (val, row) {
      const data = { id: val?.id }
      this.loadingBatal = true
      val.loading = true
      row.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/farmasinew/depo/hapus-permintaan-rinci', data)
          .then(resp => {
            this.loadingBatal = false
            val.loading = false
            row.loading = false
            console.log('hapus det permintaan ', resp)
            notifSuccess(resp)
            const index = row.permintaanrinci.findIndex(a => a.id === val.id)
            if (index >= 0) row.permintaanrinci.splice(index, 1)
            if (!row.permintaanrinci?.length) {
              // const list = useListPermintaanStore()
              // list.ambilPermintaan()
              this.getPermintaanDepo()
            }
            // this.details = []
            // this.getListObat()
            // this.clearForm()
            resolve(resp)
          })
          .catch(() => {
            this.loadingBatal = false
            val.loading = false
            row.loading = false
          })
      })
    }
  }
})
