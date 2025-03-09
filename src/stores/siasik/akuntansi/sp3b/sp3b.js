import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { notifErr, notifSuccess } from "src/modules/utils";

export const useSp3bStore = defineStore('laporan_sp3b', {
  state: () => ({
    loading: false,
    loadingsave: false,
    disabled: false,
    dialogCetak: false,
    reqs: {
      q: '',
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
      nosp3b: '00000',
      page: 1,
    },
    tanggal: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    bulan: date.formatDate(Date.now(), 'MMMM'),
    tahun: date.formatDate(Date.now(), 'YYYY'),
    bulans: [
      { nama: 'Januari', value: '01' },
      { nama: 'Februari', value: '02' },
      { nama: 'Maret', value: '03' },
      { nama: 'April', value: '04' },
      { nama: 'Mei', value: '05' },
      { nama: 'Juni', value: '06' },
      { nama: 'Juli', value: '07' },
      { nama: 'Agustus', value: '08' },
      { nama: 'September', value: '09' },
      { nama: 'Oktober', value: '10' },
      { nama: 'November', value: '11' },
      { nama: 'Desember', value: '12' }
    ],
    form: {
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
      nosp3b: null,
      tanggal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      bulan_realisasi: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      pendapatan: 0,
      realisasi: 0,
      pembiayaan: 0,
      saldoawal: 0,
      rincians: []
    },
    allitems: [],
    pendapatans: [],
    belanjas: [],
    pembiayaans: [],

    saldoawal: {},

    listdataSp3b: [],

    viewData: [],
    //Untuk simpan Data Gabungan
    saveall: []
  }),
  actions: {
    setParams(key, val) {
      this.reqs[key] = val
    },
    goToPage(val) {
      this.reqs.page = val
      this.getData()
    },
    refreshTable() {
      this.reqs.page = 1
      this.getList()
    },
    create() {
      this.form.nosp3b = this.reqs.nosp3b
      this.form.bulan = this.reqs.bulan
      this.form.tahun = this.reqs.tahun
      this.form.saldoawal = this.saldoawal
      this.form.rincians = this.saveall

      this.saveData()
      console.log('HASIIIL', this.form)
    },
    getList() {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('v1/akuntansi/sp3b/listdata', params).then((resp) => {
          console.log('LIST SP3B', resp.data)
          if (resp.status === 200) {
            this.listdataSp3b = []

            this.listdataSp3b = resp.data
            this.loading = false
            resolve(resp.data)
          }
        }).catch(() => { this.loading = false })
      })
    },
    saveData() {
      this.loading = true
      console.log('params', this.form)
      return new Promise((resolve) => {
        api.post('v1/akuntansi/sp3b/savedata', this.form).then((resp) => {
          console.log('Create SP3B', resp)
          if (resp.status === 200) {
            notifSuccess(resp)
            this.loading = false
            resolve(resp.data)
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },

    deleteData(row) {
      this.loading = true
      return new Promise(resolve => {
        api.post('v1/akuntansi/sp3b/delete', row)
          .then(resp => {
            console.log('resp delete', resp)
            this.loading = false
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    getData() {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('v1/akuntansi/sp3b/getdata', params).then((resp) => {
          console.log('data SP3B', resp.data)
          if (resp.status === 200) {
            this.pendapatans = []
            this.belanjas = []
            this.pembiayaans = []
            this.saldoawal = []

            this.allitems = resp.data

            this.dataSp3b()
            this.loading = false
            resolve(resp.data)
          }
        }).catch(() => { this.loading = false })
      })
    },
    dataSp3b() {
      //SALDO AWAL
      const pendx = this.allitems?.sebelumpendapatan
      const bljx = this.allitems?.sebelumbelanja
      const biayax = this.allitems?.sebelumpembiayaan
      const pendapatanx = []
      for (let i = 0; i < pendx.length; i++) {
        const el = pendx[i];
        const obj = parseFloat(el.total).toFixed(2)
        pendapatanx.push(obj)
      }
      const totalpendapatanx = parseFloat(pendapatanx) || 0

      const belanjax = []
      const unx = bljx.map((x) => x.kode)
      const hslunikx = unx.length ? [...new Set(unx)] : []
      for (let i = 0; i < hslunikx.length; i++) {
        const el = hslunikx[i];
        const obj = bljx.filter((x) => x.kode === el).map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)
        belanjax.push(obj)
      }
      const totalbljx = belanjax.reduce((a, b) => a + b, 0) || 0

      const pmbiayax = []
      for (let i = 0; i < biayax.length; i++) {
        const el = biayax[i];
        const obj = parseFloat(el.total).toFixed(2)
        pmbiayax.push(obj)
      }
      const totalbiayax = parseFloat(pmbiayax) || 0
      const saldoawalx = ((totalpendapatanx - totalbljx) + totalbiayax).toFixed(2)

      this.saldoawal = saldoawalx
      console.log('saldo awal', totalpendapatanx, totalbljx, totalbiayax)


      console.log('saldo awal', this.saldoawal)

      // DATA PENDAPATAN
      const pend = this.allitems?.pendapatan
      const pendapatan = []
      for (let i = 0; i < pend.length; i++) {
        const el = pend[i];
        const obj = {
          kode: el.kode,
          uraian: el.uraian,
          total: parseFloat(el.total).toFixed(2),
          keterangan: 'PENDAPATAN'
        }
        pendapatan.push(obj)
      }

      this.pendapatans.push(...pendapatan)
      // const peny = penyesuaian.map((x) => parseFloat(x.totalpenyesuaian))


      // DATA BELANJA
      const blj = this.allitems?.belanja
      const un = blj.map((x) => x.kode)
      const hslunik = un.length ? [...new Set(un)] : []

      const belanja = []
      for (let i = 0; i < hslunik.length; i++) {
        const el = hslunik[i];
        const obj = {
          kode: blj.filter((x) => x.kode === el)[0].kode,
          uraian: blj.filter((x) => x.kode === el)[0].uraian,
          total: blj.filter((x) => x.kode === el).map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0),
          keterangan: 'REALISASI'
        }
        belanja.push(obj)
      }
      this.belanjas = belanja

      //DATA PEMBIAYAAN
      const pmbiaya = this.allitems?.pembiayaan
      const pembiayaan = []
      for (let i = 0; i < pmbiaya.length; i++) {
        const el = pmbiaya[i];
        const obj = {
          kode: el.kode,
          uraian: el.uraian,
          total: parseFloat(el.total).toFixed(2),
          keterangan: 'PEMBIAYAAN'
        }
        pembiayaan.push(obj)
      }

      this.pembiayaans.push(...pembiayaan)

      this.saveall = pendapatan.concat(belanja, ...pembiayaan)
      console.log('saveall', this.pembiayaans)
    }

  }
})
