import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { notifErr, notifSuccess } from "src/modules/utils";
import { useKasirRajalListKunjunganStore } from "./kunjungan";
import { printNb } from 'src/modules/print'
import { dateDbFormat } from "src/modules/formatter";
import { use } from "echarts";
// import { data } from "autoprefixer";

export const usePembayaranKasirRajalStore = defineStore('pembayaran-kasir-rajal-store', {
  state: () => ({
    loading: false,
    loadingpembayaran: false,
    loadingbayar: false,
    loadingbuttonbill: false,
    loadingQris: false,
    items: [],
    itemsobat: [],
    itemstindakan: [],
    itemsoperasi: [],
    itemslaborat: [],
    itemsradiologi: [],
    itemssharingbpjs: [],
    itemstindakanpsikologi: [],
    kwitansi: [],
    kwitansinonkarcis: [],
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
      carabayar: 'Tunai',
      jenislayanan: ''
    },
    formqris: {},
    totalkarcis: 0,
    totalobat: 0,
    totaltindakan: 0,
    total: 0,
    dataCetak: null,
    showCetak: false,
    qrcode: '',
    printObj: {
      id: 'printMe',
      popTitle: 'Kwitansi Pembayaran'
    },
    va: ''
  }),
  actions: {
    savePembayaran(pasien, subtotal, jenislayanan, val, router) {
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
            //this.kwitansi = kwitansikarcis
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
                usercetak: k?.nama,
              }
              hasilglobal.push(hasil)
            })
            // this.kwitansi = hasilglobal
            const pengunjung = useKasirRajalListKunjunganStore()
            pengunjung.kwitansiterbayar.push(...hasilglobal)
            notifSuccess(resp.data?.message)
            const routeData = router.resolve({
              path: '/print/kwitansi',
              query: { kwitansikarcis: JSON.stringify(kwitansikarcis) }
            })
            window.open(routeData.href, '_blank')

            resolve(resp.data)
          })
          .catch((err) => {

            this.loadingpembayaran = false
          })
      })
    },
    createQris(pasien, billing, jenislayanan, carabayar) {
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
      this.form.total = billing
      this.form.merchantPan = '9360011400000396828'
      this.form.billNumber = pasien.noreg
      this.form.purposetrx = pasien.noreg
      this.form.storelabel = 'RSUD DR M SALEH'
      this.form.customerlabel = 'PUBLIC'
      this.form.terminalUser = 'U012001'
      this.form.transactionDate = dateDbFormat(new Date())
      this.form.amount = billing
      this.form.carabayar = carabayar
      this.form.jenislayanan = jenislayanan
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/pembayarankarcis', this.form)
          .then((resp) => {
            this.loadingpembayaran = false
            console.log('resp', resp.data)
            this.qrcode = resp.data.qrValue
            //this.qris = resp.data.result.qrValue
            resolve(resp.data)
          })
          .catch((err) => {
            console.log('err', err)
            this.loadingpembayaran = false
          })
      })
    },
    async carikarcis(noreg) {
      this.loadingbayar = true
      this.items = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-karcis', params)
        .then(resp => {
          this.items = resp.data?.data
          this.loadingbayar = false
        })
        .catch(() => { this.loadingbayar = false })
    },
    async cariobat(noreg) {
      this.loadingbayar = true
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
          this.loadingbayar = false
        })
        .catch(() => { this.loadingbayar = false })
    },
    async caritindakan(noreg) {
      this.loadingbayar = true
      this.itemstindakan = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-tindakan', params)
        .then(resp => {
          this.itemstindakan = resp.data
          this.loadingbayar = false
        })
        .catch(() => { this.loading = false })
    },
    async caritindakanpsikologi(noreg) {
      this.loadingbayar = true
      this.itemstindakan = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-tindakan-psikologi', params)
        .then(resp => {
          this.itemstindakanpsikologi = resp.data
          this.loadingbayar = false
        })
        .catch(() => { this.loading = false })
    },
    async carioperasi(noreg) {
      this.loadingbayar = true
      this.itemsoperasi = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-tindakan-operasi', params)
        .then(resp => {
          this.itemsoperasi = resp.data
          this.loadingbayar = false
        })
        .catch(() => { this.loadingbayar = false })
    },
    async carilaborat(noreg) {
      this.loadingbayar = true
      this.itemslaborat = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-laborat', params)
        .then(resp => {
          this.itemslaborat = resp.data
          this.loadingbayar = false
        })
        .catch(() => { this.loadingbayar = false })
    },
    async cariradiologi(noreg) {
      this.loadingbayar = true
      this.itemsradiologi = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-radiologi', params)
        .then(resp => {
          this.itemsradiologi = resp.data
          this.loadingbayar = false
        })
        .catch(() => { this.loading = false })
    },
    async carisharingbpjs(noreg) {
      this.loadingbayar = true
      this.itemssharingbpjs = []
      const params = { params: { noreg: noreg } }
      const resp = await api.get('/v1/simrs/kasir/rajal/cari-sharingbpjs', params)
        .then(resp => {
          this.itemssharingbpjs = resp.data
          this.loadingbayar = false
        })
        .catch(() => { this.loadingbayar = false })
    },
    setPrintObj(obj) {
      this.printObj = obj
    },
    createva(pasien, billing, jenislayanan, carabayar) {
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
      this.form.carabayar = carabayar
      this.form.jenislayanan = jenislayanan
      this.form.total = billing
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/pembayarankarcis', this.form)
          .then((resp) => {
            this.loadingpembayaran = false
            console.log('resp', resp.data)
            this.va = resp.data?.result?.response?.VirtualAccount
            console.log('respsasa', this.va)
            notifSuccess(resp?.data?.message)
            //this.qris = resp.data.result.qrValue
            resolve(resp.data)
          })
          .catch((err) => {
            console.log('err', err)
            this.loadingpembayaran = false
          })
      })
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
    },
    savePembayarannonKarcis(pasien, nota, subtotal, jenis, router) {
      this.loadingpembayaran = true
      this.form.noreg = pasien.noreg
      this.form.nota = nota
      this.form.norm = pasien.norm
      this.form.tglkunjungan = pasien.tgl_kunjungan
      this.form.nama = pasien.nama
      this.form.sapaan = pasien.sapaan
      this.form.kelamin = pasien.kelamin
      this.form.kodepoli = pasien.kodepoli
      this.form.poli = pasien.poli
      this.form.sistembayar = pasien.sistembayar
      this.form.jenis = jenis
      this.form.total = subtotal
      return new Promise(resolve => {
        api.post('/v1/simrs/kasir/rajal/pembayaran-non-karcis', this.form)
          .then((resp) => {
            this.loadingpembayaran = false
            const arr = resp?.data?.kwitansi || []
            const hasilglobal = arr.map(k => ({
              noreg: k?.noreg,
              norm: k?.norm,
              nota: k?.nokarcis ?? k?.nokwitansi,
              tgl_pembayaran: k?.tglx,
              batal: k?.batal,
              total: k?.total,
              nama: k?.nama,
              usercetak: k?.nama,
            }))

            // this.kwitansinonkarcis = hasilglobal
            const xxx = useKasirRajalListKunjunganStore()
            xxx.kwitansiterbayar.push(...hasilglobal)

            notifSuccess(resp.data?.message)

            const routeData = router.resolve({
              path: '/print/kwitansinonkarcis',
              query: { kwitansinonkarcis: JSON.stringify(arr) }
            })
            window.open(routeData.href, '_blank')

            resolve(resp.data)
          })
          .catch(() => {
            this.loadingpembayaran = false
          })
      })
    }
  }
})
