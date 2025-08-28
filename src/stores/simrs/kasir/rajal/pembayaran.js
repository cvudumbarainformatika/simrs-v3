import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifErr, notifSuccess } from "src/modules/utils";
import { useKasirRajalListKunjunganStore } from "./kunjungan";
import { printNb } from 'src/modules/print'

export const usePembayaranKasirRajalStore = defineStore('pembayaran-kasir-rajal-store', {
  state: () => ({
    loading: false,
    loadingpembayaran: false,
    loadingQris: false,
    items: [],
    itemsobat: [],
    itemstindakan: [],
    itemsoperasi: [],
    itemslaborat: [],
    itemsradiologi: [],
    itemssharingbpjs: [],
    kwitansi: [],
    form: {
      noreg: '',
      norm: '',
      tglkunjungan: '',
      nama: '',
      sapaan: '',
      kelamin: '',
      kodepoli: '',
      poli: '',
      sistembayar: '',
      total: '',
      // rinci: '',
      tglx: '',
      users: '',
      carabayar: '',
      jenislayanan: ''
    },
    formqris: {},
    totalkarcis: 0,
    totalobat: 0,
    totaltindakan: 0,
    total: 0,
    dataCetak: null,
    showCetak: false,
    printObj: {
      id: 'printMe',
      popTitle: 'Kwitansi Pembayaran'
    }
  }),
  actions: {
    savePembayaran(pasien, subtotal, jenislayanan, val, router, { nomor, poli, norm }) {
      this.loadingpembayaran = true
      this.form.noreg = pasien.noreg
      this.form.norm = pasien.norm
      this.form.tglkunjungan = pasien.tgl_kunjungan
      this.form.nama = pasien.nama
      this.form.sapaan = pasien.sapaan
      this.form.kelamin = pasien.kelamin
      this.form.kodepoli = pasien.kodepoli
      this.form.poli = pasien.poli
      this.form.sistembayar = pasien.sistembayar
      this.form.total = subtotal
      // this.form.rinci = billing.rincian
      this.form.carabayar = val
      this.form.jenislayanan = jenislayanan
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/pembayarankarcis', this.form)
          .then((resp) => {
            this.loadingpembayaran = false
            const kwitansikarcis = resp.data?.kwitansikarcis ?? []
            const hasilglobal = []
            kwitansikarcis.forEach(k => {
              const hasil = {
                noreg: k?.noreg,
                norm: k?.norm,
                nota: k?.nokarcis,
                tgl_pembayaran: k?.tglx,
                batal: k?.batal,
                total: k?.total,
                nama: k?.nama,
              }
              hasilglobal.push(hasil)
            })
            const storekunjungan = useKasirRajalListKunjunganStore()
            storekunjungan.kwitansikarcis = hasilglobal
            this.kwitansi = kwitansikarcis
            console.log('this.kwitansi', this.kwitansi)
            notifSuccess(resp.data?.message)
            const routeData = router.resolve({
              path: '/print/kwitansi',
              query: { kwitansikarcis: JSON.stringify(kwitansikarcis) }
            })
            window.open(routeData.href, '_blank')
            // const id = kwitansikarcis?.nokarcis
            // window.open(`/print`, "_blank")
            resolve(resp.data)
          })
          .catch((err) => {

            this.loadingpembayaran = false
          })
      })
    },
    createQris(pasien, billing, jenislayanan, val) {
      this.loadingQris = true
      this.formqris.noreg = pasien.noreg
      this.formqris.norm = pasien.norm
      this.forformqrism.tglkunjungan = pasien.tgl_kunjungan
      this.formqris.nama = pasien.nama
      this.formqris.sapaan = pasien.sapaan
      this.formqris.kelamin = pasien.kelamin
      this.formqris.kodepoli = pasien.kodepoli
      this.formqris.poli = pasien.poli
      this.formqris.sistembayar = pasien.sistembayar
      this.formqris.total = billing.totalall
      this.formqris.rinci = billing.rincian
      this.formqris.carabayar = val
      this.formqris.jenislayanan = jenislayanan
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/pembayarankarcis', this.form)
          .then((resp) => {
            this.loadingQris = false
            const thiskwitansi = resp.data?.result?.heder
            const hasilglobal = []
            thiskwitansi?.forEach(x => {
              const kwitansilog = x?.kwitansilog
              kwitansilog?.forEach(k => {
                const hasil = {
                  noreg: k?.noreg,
                  norm: k?.norm,
                  nota: k?.nota,
                  tgl_pembayaran: k?.tglx,
                  batal: k?.batal,
                  total: k?.total,
                  nama: k?.nama,
                  nokwitansi: k?.nokwitansi,
                  i: ''
                }
                hasilglobal.push(hasil)
              })
              const karcislog = x?.karcislog
              karcislog?.forEach(k => {
                const hasilx = {
                  noreg: k?.noreg,
                  norm: k?.norm,
                  nota: null,
                  tgl_pembayaran: k?.tglx,
                  batal: k?.batal,
                  total: k?.total,
                  nama: k?.nama,
                  nokwitansi: k?.nokarcis,
                  i: 'KARCIS'
                }
                hasilglobal.push(hasilx)
              })
            })
            const storekunjungan = useKasirRajalListKunjunganStore()
            storekunjungan.kwitansi = hasilglobal
            notifSuccess(resp.data?.message)
            setTimeout(() => {
              this.printElement(this.printObj.id)
            }, 500)
            //this.qris = resp.data.result.qrValue
            resolve(resp.data)
          })
          .catch((err) => {
            console.log('err', err)
            this.loading = false
          })
      })
    },
    async carikarcis(noreg) {
      this.loading = true
      this.items = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-karcis', params)
        .then(resp => {
          this.items = resp.data?.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async cariobat(noreg) {
      this.loading = true
      this.itemsobat = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-obat', params)
        .then(resp => {
          const respdata = resp.data?.data
          // console.log('respdata', respdata)
          const racikan_r = resp.data?.racikan_R
          const jumlahracikan_r = (racikan_r ?? []).reduce(
            (total, item) => total + (item.subtotal ?? 0),
            0
          )
          const hasilglobal = []
          respdata.forEach(x => {
            // console.log('x', x)
            const rincian = (x?.rincian ?? []).reduce((total, item) => {
              const hargajual = item?.harga_jual ?? 0
              const jumlah = item?.jumlah ?? 0
              const r = item?.nilai_r ?? 0
              return total + (hargajual * jumlah + r)
            }, 0)
            // console.log('rincian', rincian)
            const rincianracik = (x?.rincianracik ?? []).reduce((total, item) => {
              const hargajual = item?.harga_jual ?? 0
              const jumlah = item?.jumlah ?? 0
              return total + (hargajual * jumlah)
            }, 0)
            const retur = x?.retur?.rinci?.reduce((total, item) => {
              return total + ((item.harga_jual ?? 0) * (item.jumlah_retur ?? 0))
            }, 0) ?? 0

            const hasil = {
              nota: x?.noresep,
              tanggal: x?.tgl,
              rincian: rincian,
              rincianracik: rincianracik,
              retur: retur,
              subtotal: rincian + rincianracik - retur
            }
            // console.log('hasil', hasil)
            hasilglobal.push(hasil)
          })
          this.itemsobat = hasilglobal
          // const totalSemua = hasilglobal.reduce((acc, h) => {
          //   return acc + h.rincian + h.rincianracik
          // }, 0) + jumlahracikan_r
          // console.log('hasilglobal', totalSemua)
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async caritindakan(noreg) {
      this.loading = true
      this.itemstindakan = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-tindakan', params)
        .then(resp => {
          this.itemstindakan = resp.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async carioperasi(noreg) {
      this.loading = true
      this.itemsoperasi = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-tindakan-operasi', params)
        .then(resp => {
          this.itemsoperasi = resp.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async carilaborat(noreg) {
      this.loading = true
      this.itemslaborat = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-laborat', params)
        .then(resp => {
          this.itemslaborat = resp.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async cariradiologi(noreg) {
      this.loading = true
      this.itemsradiologi = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-radiologi', params)
        .then(resp => {
          this.itemsradiologi = resp.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    async carisharingbpjs(noreg) {
      this.loading = true
      this.itemssharingbpjs = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-radiologi', params)
        .then(resp => {
          this.itemssharingbpjs = resp.data
          this.loading = false
        })
        .catch(() => { this.loading = false })
    },
    setPrintObj(obj) {
      this.printObj = obj
    },
    printElement(elId) {
      const el = document.getElementById(elId)
      if (!el) {
        console.error('Element untuk print tidak ditemukan:', elId)
        return
      }

      const printContents = el.innerHTML
      const win = window.open('', '', 'width=900,height=650')
      win.document.write(`
        <html>
          <head>
            <title>${this.printObj.popTitle}</title>
          </head>
          <body>${printContents}</body>
        </html>
      `)
      win.document.close()
      win.focus()
      win.print()
      win.close()
    }
  }
})
