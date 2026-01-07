import { defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"
import { notifErr, notifSuccess } from 'src/modules/utils'

export const usePasienLuarStore = defineStore('tbp-pasienluar-store', {
  state: () => ({
    items: [],
    meta: null,
    loading: false,
    kwitansiterbayar: [],
    loadingbatalkwitansi: false,
    getparams: {
      noreg: ''
    },
    params: {
      q: '',
      page: 1,
      per_page: 10,
      jenislayanan: 'LABORAT',
      status: 'SEMUA',
      daritgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      sampaitgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    },
    formatdisplay: {
      daritgl: date.formatDate(Date.now(), 'DD MMM YYYY'),
      sampaitgl: date.formatDate(Date.now(), 'DD MMM YYYY')
    }
  }),
  actions: {
    async getData() {
      this.loading = true
      const params = { params: this.params }
      await api.get('v1/simrs/kasir/pasien-luar/getbillpasienluar', params)
        .then(resp => {
          console.log('kunjungan igd', resp?.data?.data)
          this.loading = false
          this.items = resp?.data?.data
          this.meta = resp?.data
        })
        .catch(() => { this.loading = false })
    },
    async getKwitansiTerbayar() {
      this.loading = true
      const params = { params: this.getparams }
      const resp = await api.get('/v1/simrs/kasir/rajal/getkwitansiterbayar', params)
      if (resp.status === 200) {
        // const kwitansikarcis = resp.data?.kwitansikarcis ?? []
        const kwitansi = resp.data?.kwitansi ?? []
        const hasilglobal = []
        // kwitansikarcis.forEach(k => {
        //   const hasil = {
        //     noreg: k?.noreg,
        //     norm: k?.norm,
        //     nota: k?.nokarcis,
        //     nokwitansi: k?.nokarcis,
        //     tgl_pembayaran: k?.tglx,
        //     batal: k?.batal,
        //     total: k?.total,
        //     nama: k?.nama,
        //     usercetak: k?.pegawai?.nama,
        //     jenis: 'karcis',
        //   }
        //   hasilglobal.push(hasil)
        // })
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
        console.log('kwitansiterbayar', this.kwitansiterbayar)
        this.loading = false
      }
    },
    batalkwitansi(val) {
      this.loadingbatalkwitansi = true
      const payload = { nokwitansi: val?.nokwitansi, jenis: val?.jenis }
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/batalkwitansi', payload)
          .then(resp => {
            const data = resp.data?.data
            this.kwitansiterbayar = this.kwitansiterbayar.map(item =>
              item.nokwitansi === data?.nokwitansi
                ? { ...item, ...data }   // merge item lama + data baru
                : item                   // selain itu tetap
            )

            // this.loadingbatalkwitansi = false
            notifSuccess(resp.data?.message)
            resolve(resp.data)
          })
          .catch(() => {
            this.loadingbatalkwitansi = false
            notifErr(resp.message)
          })
      })
    },
    goToPage(val) {
      console.log('val', val)
      this.params.page = val
      this.getData()
    },
  }
})
