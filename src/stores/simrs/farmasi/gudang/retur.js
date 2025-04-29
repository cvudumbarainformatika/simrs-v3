import { defineStore } from 'pinia'
import { date, Dialog } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/utils'

export const useReturPenyediaStore = defineStore('retur_penyedia', {
  state: () => ({
    loading: false,
    loadingObat: false,
    loadingDataMauRet: false,
    items: [],
    params: {
      per_page: 10
    },
    form: {
      tanggal: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      tanggalRusak: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      tgl_retur: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tgl_rusak: date.formatDate(Date.now(), 'YYYY-MM-DD')
    },
    kondisis: ['Rusak', 'Kadalwarsa'],
    perusahaans: [],
    obats: [],
    dataMauReturs: [],
    dataRusaks: [],
    dataReturs: []
  }),
  actions: {
    setParams (key, val) {
      this.params[key] = val
    },
    setForm (key, val) {
      this.form[key] = val
    },
    resetForm (key, val) {
      const gudang = this.form.kd_ruang
      this.form = {}
      this.setForm('kd_ruang', gudang)
    },
    perusahaanSelected (val) {
      if (this.dataReturs?.length) {
        Dialog.create({
          title: 'Konfirmasi',
          message: 'Sudah Ada Data yang diretur, jika mengganti perusahaan maka akan mengganti nomor retur, apakah akan dilanjutkan?',
          ok: {
            push: true,
            label: 'Ganti PBF',
            'no-caps': true,
            color: 'negative'
          },
          cancel: {
            push: true,
            label: 'Batal',
            'no-caps': true,
            color: 'dark'
          }
        })
          .onOk(() => {
            this.dataReturs = []
            this.form = {}
            this.setParams('kdpbf', val)
            this.setForm('kdpbf', val)
            this.getObat()
          })
          .onCancel(() => {
            this.setForm('kdpbf', this.params.kdpbf)
          })
      }
      else {
        this.setParams('kdpbf', val)
        this.getObat()
      }
    },
    obatSelected (val) {
      this.setForm('satuan_k', null)
      this.setForm('kd_obat', val)
      this.setParams('kd_obat', val)
      if (!val) return
      const obat = this.obats.find(ob => ob.kd_obat === val)
      if (obat) {
        this.setForm('satuan_k', obat?.satuan_k)
      }
      this.getDataMauRet()
    },
    getInitialData () {
      this.getPerusahan()
    },
    async getPerusahan () {
      this.perusahaans = []
      this.loadingPerusahaan = true
      const param = { params: this.params }
      await api.get('v1/simrs/penunjang/farmasinew/retur/perusahaan', param)
        .then(resp => {
          this.loadingPerusahaan = false
          this.perusahaans = resp?.data
        })
        .catch(() => { this.loadingPerusahaan = false })
    },
    async getObat () {
      if (!this.params.kdpbf) return
      this.obats = []
      this.dataMauReturs = []
      this.dataRusaks = []
      this.setForm('kd_obat', null)
      this.loadingObat = true
      const param = { params: this.params }
      await api.get('v1/simrs/penunjang/farmasinew/retur/obat', param)
        .then(resp => {
          this.loadingObat = false
          this.obats = resp?.data
        })
        .catch(() => { this.loadingObat = false })
    },
    async getDataMauRet () {
      this.dataMauReturs = []
      this.dataRusaks = []
      this.loadingDataMauRet = true
      const param = { params: this.params }
      await api.get('v1/simrs/penunjang/farmasinew/retur/ambil-data', param)
        .then(resp => {
          this.loadingDataMauRet = false
          this.dataRusaks = resp?.data?.rusak
          this.dataMauReturs = resp?.data?.penerimaan
          this.dataStokSekarang = resp?.data?.stok
          if (this.dataStokSekarang?.length > 0) {
            this.dataStokSekarang.forEach(da => {
              da.no_batch = da.nobatch
              da.tgl_exp = da.tglexp
              da.harga_neto = da?.harga ?? 0
            })
          }
          if (this.dataMauReturs?.length > 0) {
            this.dataMauReturs.forEach(da => {
              da.stok = da.stokterima.map(s => parseFloat(s.jumlah)).reduce((a, b) => a + b, 0)
            })
          }

          return Promise.resolve(resp?.data)
        })
        .catch(() => { this.loadingDataMauRet = false })
    },
    simpanRetur (item) {
      console.log('sebelum simpan', item)
      this.loading = true
      item.loading = true
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/farmasinew/retur/simpan', this.form)
          .then(resp => {
            this.loading = false
            item.loading = false
            console.log('simpan', resp.data)
            if (!this.form.no_retur) {
              this.setForm('no_retur', resp?.data?.no_retur)
            }

            const rinci = resp?.data?.rinci
            const index = this.dataReturs.findIndex(da => da.no_retur === rinci.no_retur && da.kd_obat === rinci.kd_obat && da.nopenerimaan === rinci.nopenerimaan && da.no_batch === rinci.no_batch)
            if (index >= 0) this.dataReturs[index] = rinci
            else this.dataReturs.push(rinci)

            notifSuccess(resp)
            resolve(resp.data)
          })
          .catch(() => {
            this.loading = false
            item.loading = false
          })
      })
    }
  }
})
