import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { dateDbFormat } from 'src/modules/formatter'
import { usePembayaranKasirRajalStore } from './pembayaran'
import { notifErr, notifSuccess } from 'src/modules/utils'

export const useKasirRajalListKunjunganStore = defineStore('kasir_rajal_list_kunjungan_umum', {
  state: () => ({
    items: [],
    kwitansi: [],
    kwitansikarcis: [],
    kwitansiterbayar: [],
    loadingbatalkwitansi: false,
    meta: null,
    params: {
      q: '',
      per_page: 10,
      sort: 'DESC',
      page: 1,
      order_by: 'id',
      jenispasien: 'Pasien RS',
      tgl: dateDbFormat(new Date())
    },
    getparams: {
      noreg: ''
    },
    golongan: '',
    loading: false,
    rekapBill: {},
    notas: {},
    qris: 'asd',
    jenispembayaran: '',
    loadingdataterbayar: false,
    kwitansinontunai: []
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
    goToPage(val) {
      this.params.page = val
      this.getLists()
    },
    async getLists() {
      this.loading = true
      const params = { params: this.params }
      const resp = await api.get('/v1/simrs/kasir/rajal/kunjunganpoli', params)
      if (resp.status === 200) {
        this.items = resp.data.data
        this.meta = resp.data
        this.loading = false
      }
      this.loading = false
    },
    async getBill(par) {
      this.loading = true
      const params = { params: par ?? this.getparams }
      const resp = await api.get('/v1/simrs/kasir/rajal/rekapbillbynoreg', params)
      if (resp.status === 200) {
        this.rekapBill = resp.data?.data
        // console.log('resp', resp.data)
        // const kwitansikarcis = resp.data?.data?.kwitansikarcis ?? []
        // const kwitansi = resp.data?.data?.kwitansi ?? []
        // const hasilglobal = []
        // kwitansikarcis.forEach(k => {
        //   const hasil = {
        //     noreg: k?.noreg,
        //     norm: k?.norm,
        //     nota: k?.nokarcis,
        //     tgl_pembayaran: k?.tglx,
        //     batal: k?.batal,
        //     total: k?.total,
        //     nama: k?.nama,
        //     usercetak: k?.nama,
        //   }
        //   hasilglobal.push(hasil)
        // })
        // kwitansi.forEach(k => {
        //   const hasil = {
        //     noreg: k?.noreg,
        //     norm: k?.norm,
        //     nota: k?.nokwitansi,
        //     tgl_pembayaran: k?.tglx,
        //     batal: k?.batal,
        //     total: k?.total,
        //     nama: k?.nama,
        //     usercetak: k?.nama,
        //   }
        //   hasilglobal.push(hasil)
        // })
        // this.kwitansikarcis = hasilglobal
        // console.log('kwitansikarcis', this.kwitansikarcis)

      }
      this.loading = false
    },
    async getKwitansiTerbayar() {
      this.loading = true
      const params = { params: this.getparams }
      const resp = await api.get('/v1/simrs/kasir/rajal/getkwitansiterbayar', params)
      if (resp.status === 200) {
        const kwitansikarcis = resp.data?.kwitansikarcis ?? []
        const kwitansi = resp.data?.kwitansi ?? []
        const hasilglobal = []
        kwitansikarcis.forEach(k => {
          const hasil = {
            noreg: k?.noreg,
            norm: k?.norm,
            nota: k?.nokarcis,
            nokwitansi: k?.nokarcis,
            tgl_pembayaran: k?.tglx,
            batal: k?.batal,
            total: k?.total,
            nama: k?.nama,
            usercetak: k?.pegawai?.nama,
            jenis: 'karcis',
          }
          hasilglobal.push(hasil)
        })
        kwitansi.forEach(k => {
          const hasil = {
            noreg: k?.noreg,
            norm: k?.norm,
            nota: k?.nota,
            nokwitansi: k?.nokwitansi,
            tgl_pembayaran: k?.tglx,
            batal: k?.batal,
            total: k?.total,
            nama: k?.nama,
            usercetak: k?.pegawai?.nama,
            jenis: 'kwitansi',
          }
          hasilglobal.push(hasil)
        })
        this.kwitansiterbayar = hasilglobal
        this.loading = false
      }
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
    async getKwitansinontunai(noreg) {
      this.loading = true
      const params = { params: { noreg: noreg ?? this.getparams } }
      const resp = await api.get('/v1/simrs/kasir/rajal/getKwitansinontunai', params)
      if (resp.status === 200) {
        this.kwitansinontunai = resp.data.data
        this.loading = false
      }
      this.loading = false
    },
    batalkwitansi(val) {
      this.loadingbatalkwitansi = true
      const payload = { nokwitansi: val?.nokwitansi, jenis: val?.jenis }
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/batalkwitansi', payload)
          .then(resp => {
            const data = resp.data?.data
            console.log('data', this.kwitansiterbayar)
            if (resp.data?.jenis === 'karcis') {
              this.kwitansiterbayar = this.kwitansiterbayar.map(item =>
                item.nota === data?.nokarcis
                  ? { ...item, ...data }   // merge item lama + data baru
                  : item                   // selain itu tetap
              )
            } else {
              this.kwitansiterbayar = this.kwitansiterbayar.map(item =>
                item.nokwitansi === data?.nokwitansi
                  ? { ...item, ...data }   // merge item lama + data baru
                  : item                   // selain itu tetap
              )
              console.log('dataxxx', this.kwitansiterbayar)
            }

            this.loadingbatalkwitansi = false
            notifSuccess(resp.data?.message)
            resolve(resp.data)
          })
          .catch(() => {
            this.loadingbatalkwitansi = false
            notifErr(resp.message)
          })
      })
    }
  }
})
