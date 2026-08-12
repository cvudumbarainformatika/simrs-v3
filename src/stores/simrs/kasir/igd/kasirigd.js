import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'

export const useKasirIgdStore = defineStore('kasir_igd_store', {
  state: () => ({
    items: [],
    meta: null,
    loadingsimpanttd: false,
    params: {
      q: '',
      per_page: 10,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      tgl: dateDbFormat(new Date())
    },
    golongan: '',
    loading: false,
    rekapBill: {},
    notas: {},
    qris: 'asd',
    form: {
      kodedokumen: '',
      noreg: '',
      norm: '',
      saksiPasien: '',
      hubunganPasien: '',
      resumekeluargapasien: ''
    }
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    setDate(payload) {
      this.params.page = 1
      this.params.tgl = payload
      this.getLists()
    },
    setQ(payload) {
      this.params.page = 1
      this.params.q = payload
      this.getLists()
    },
    setTglAwal() {
      this.params.tgl = dateDbFormat(new Date())
    },
    setPage(payload) {
      this.params.page = payload
      this.getLists()
    },
    setPerPage(payload) {
      this.params.page = 1
      this.params.per_page = payload
      this.getLists()
    },
    async getLists() {
      this.loading = true
      const params = { params: this.params }
      // const resp = await api.get('/v1/simrs/pendaftaran/umum/kunjunganpasienumum', params)
      const resp = await api.get('/v1/simrs/kasir/rajal/kunjunganpoli', params)
      if (resp.status === 200) {
        // console.log('kunjungan', resp)
        this.items = resp.data.data
        this.meta = resp.data
        this.loading = false
      }
      this.loading = false
    },
    getBill(val) {
      this.rekapBill = {}
      this.loading = true
      const params = { params: val }
      return new Promise(resolve => {
        api.get('/v1/simrs/kasir/igd/billbynoreg', params).then(resp => {
          if (resp.status === 200) {
            // console.log('bill', resp.data)
            this.rekapBill = resp.data
          }
          resolve(resp)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    async getNotas(val) {
      this.notas = {}
      this.loading = true
      const params = { params: val }
      // const resp = await api.get('/v1/simrs/pendaftaran/umum/kunjunganpasienumum', params)
      const resp = await api.get('/v1/simrs/kasir/rajal/tagihanpergolongan', params)
      if (resp.status === 200) {
        console.log('resp notas ', resp.data)
        this.notas = resp.data
        this.loading = false
      }
      this.loading = false
    },
    savePembayaran(payload) {
      this.loading = true
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/pembayaran', payload)
          .then(resp => {
            this.loading = false
            // console.log('resp', resp.data)
            this.qris = resp.data.result.qrValue
            resolve(resp.data)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    async simpanttd() {
      this.loadingsimpanttd = true
      try {
        console.log('responsex:', this.form)
        const resp = await api.post('/v1/simrs/kasir/rajal/simpanttddokumen', this.form)
        console.log('response:', resp.data)

        return resp.data
      } catch (error) {
        console.error('Gagal simpan TTD:', error)

        const message =
          error.response?.data?.message ||
          error.message ||
          'Terjadi kesalahan saat menyimpan TTD'

        Notify.create({
          type: 'negative',
          message
        })

        return null
      } finally {
        this.loadingsimpanttd = false
      }
    }
  }
})
