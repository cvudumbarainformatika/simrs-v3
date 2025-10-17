import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
// import { api } from 'src/boot/axios'

export const useLPEStore = defineStore('laporan_PerubahanEkuitas', {
  state: () => ({
    loading: false,
    dialogCetak: false,
    reqs: {
      q: '',
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglx: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tahun: date.formatDate(Date.now(), 'YYYY')
    },
    display: {
      dari: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      sampai: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    dataekuitas: [],
    datapendapatans: [],
    datapenyesuaianpendapatans: [],
    databebans: [],
    datakoreksi: [],

    pagupendapatan: [],

    ekuitasawal: [],
    surplusdefisit: [],
    hasilkoreksi: [],

    dataLpe: []
  }),
  actions: {
    setParameter(key, val) {
      this.reqs[key] = val
    },
    getDataLap() {
      this.loading = true
      const params = { params: this.reqs }
      return new Promise((resolve) => {
        api.get('v1/laporan/lpe/getlpe', params).then((resp) => {
          console.log('data LPE', resp.data)
          if (resp.status === 200) {
            this.ekuitasawal = []
            this.surplusdefisit = []
            this.hasilkoreksi = []
            this.dataekuitas = resp.data.ekuitas
            this.datapendapatans = resp.data.pendapatan
            this.datapenyesuaianpendapatans = resp.data.penyesuaianpendapatan
            this.datakoreksi = resp.data.koreksi
            this.databebans = resp.data.beban
            this.pagupendapatan = resp.data.pagupendapatan

            this.dataLpe = resp.data
            // const objekuitas = []
            const datekuitas = this.dataekuitas.map((x) => {
              return {
                uraian: 'Ekuitas Awal',
                nilai: (x?.saldoawal.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0) +
                  x?.jurnalotom.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0) +
                  x?.penyesuaianx.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0))
              }
            })
            const nilaiekuitas = {
              kode: '3.1.01',
              uraian: 'Ekuitas Awal',
              nilai: datekuitas.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2)
            }
            this.ekuitasawal = nilaiekuitas
            // console.log('ekuitasawal', this.ekuitasawal)
            const koderekpend = this.pagupendapatan.map((x) => x.kode6)
            const pendapatan = this.datapendapatans.filter(x => koderekpend.includes(x.kode6))
            const penyependapatan = this.datapenyesuaianpendapatans.filter(x => koderekpend.includes(x.kode6))
            const totalpenyependapatan = penyependapatan.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)
            const totalpendapatan = pendapatan.map((x) => parseFloat(x.realisasi)).reduce((a, b) => a + b, 0)
            // console.log('totalpenyependapatan', totalpenyependapatan)
            // console.log('totalpendapatan', totalpendapatan)
            const pendapatanx = pendapatan.map((x) => {
              return {
                uraian: 'Surplus / Defisit LO',
                // nilai: parseFloat(x.realisasi) + x.penyesuaian.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0),
                nilai: totalpendapatan + totalpenyependapatan,
                realisasi: parseFloat(x.realisasi),
                penyesuaian: x.penyesuaian.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)
              }
            })
            // console.log('pendapatan', pendapatanx)
            const beban = this.databebans.map((x) => {
              return {
                uraian: 'Surplus / Defisit LO',
                nilai: parseFloat(x.realisasi) + x.penyesuaian.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)
              }
            })
            // console.log('beban', beban)
            const nilaisurplusdef = {
              kode: '3.1.01',
              uraian: 'Surplus / Defisit LO',
              nilai: pendapatanx.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2) - beban.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
              pendapatan: pendapatanx.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
              beban: beban.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
            }
            this.surplusdefisit = nilaisurplusdef
            // console.log('surplusdefisit', this.surplusdefisit)

            const objkoreksi = []
            for (let i = 0; i < this.datakoreksi?.length; i++) {
              const el = this.datakoreksi[i]
              const saldoawal = el?.saldoawal.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
              const jurnal = el?.jurnalotom.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0)
              const penyesuaian = el?.penyesuaianx.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)

              const koreksi = {
                kode: el.kodeall3,
                uraian: el.uraian,
                nilai: saldoawal + jurnal + penyesuaian
              }
              objkoreksi.push(koreksi)
            }
            this.hasilkoreksi = objkoreksi
            // console.log('hasilkoreksi', objkoreksi)

            // console.log('mappeny', mappeny)
            this.loading = false
            resolve(resp.data)
          }
        }).catch(() => { this.loading = false })
      })
    }
  }
})
