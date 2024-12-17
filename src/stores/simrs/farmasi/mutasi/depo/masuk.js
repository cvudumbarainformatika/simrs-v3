import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const useMutasiMasukDepoStore = defineStore('mutasi_masuk_depo', {
  state: () => ({
    isOpen: false,
    loading: false,
    loadingSimpan: false,
    loadingKunci: false,
    items: [],
    meta: {},
    params: {
      page: 1,
      q: '',
      per_page: 10,
      jenisdistribusi: 'non-konsinyasi',
      no_permintaan: '',
      kdgudang: '',
      flag: '5'
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
      { nama: 'Floor Stock 1 (AKHP)', value: 'Gd-03010101' },
      { nama: 'Depo Rawat inap', value: 'Gd-04010102' },
      { nama: 'Depo OK', value: 'Gd-04010103' },
      { nama: 'Depo Rawat Jalan', value: 'Gd-05010101' },
      { nama: 'Depo IGD', value: 'Gd-02010104' }
    ],
    statuses: [
      { nama: 'Tampilkan semua', value: '', color: 'grey' },
      { nama: 'Menunggu verifikasi', value: '1', color: 'cyan' },
      { nama: 'Telah di verifikasi', value: '2', color: 'blue' }
    ],
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
            if (!row.permintaanrinci.length) {
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
