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
    datapenyesuaianbebans: [],
    datakoreksi: [],

    pagupendapatan: [],
    pagupendapatan_lalu: [],
    surplusnonoperasional: [],
    surplusnonoperasional_lalu: [],
    defisitnonoperasional: [],
    defisitnonoperasional_lalu: [],

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
            this.datapendapatans_lalu = resp.data.pendapatan_lalu

            this.datapenyesuaianpendapatans = resp.data.penyesuaianpendapatan
            this.datapenyesuaianpendapatans_lalu = resp.data.penyesuaianpendapatan_lalu

            this.datakoreksi = resp.data.koreksi

            this.databebans = resp.data.beban
            this.databebans_lalu = resp.data.beban_lalu

            this.datapenyesuaianbebans = resp.data.penyesuaianbeban
            this.datapenyesuaianbebans_lalu = resp.data.penyesuaianbeban_lalu

            this.pagupendapatan = resp.data.pagupendapatan
            this.pagupendapatan_lalu = resp.data.pagupendapatan_lalu

            this.surplusnonoperasional = resp.data.surplusnonoperasional
            this.surplusnonoperasional_lalu = resp.data.surplusnonoperasional_lalu
            this.defisitnonoperasional = resp.data.defisitnonoperasional
            this.defisitnonoperasional_lalu = resp.data.defisitnonoperasional_lalu

            this.dataLpe = resp.data
            // const objekuitas = []
            const datekuitas = this.dataekuitas.map((x) => {
              return {
                uraian: 'Ekuitas Awal',
                nilai: (x?.saldoawal.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0) +
                  x?.jurnalotom.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0) +
                  x?.penyesuaianx.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)),
                nilai_lalu: (x?.saldoawal_lalu.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0) +
                  x?.jurnalotom_lalu.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0) +
                  x?.penyesuaianx_lalu.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0))
              }
            })
            const nilaiekuitas = {
              kode: '3.1.01',
              uraian: 'Ekuitas Awal',
              nilai: datekuitas.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
              nilai_lalu: datekuitas.map((x) => parseFloat(x.nilai_lalu)).reduce((a, b) => a + b, 0).toFixed(2)
            }
            this.ekuitasawal = nilaiekuitas
            // console.log('ekuitasawal', this.ekuitasawal)
            const koderekpend = this.pagupendapatan.concat(this.pagupendapatan_lalu).map((x) => x.kode6)
            const pendapatan = this.datapendapatans.filter(x => koderekpend.includes(x.kode6))
            const pendapatan_lalu = this.datapendapatans_lalu.filter(x => koderekpend.includes(x.kode6))

            const penyependapatan = this.datapenyesuaianpendapatans.filter(x => koderekpend.includes(x.kode6))
            const penyependapatan_lalu = this.datapenyesuaianpendapatans_lalu.filter(x => koderekpend.includes(x.kode6))

            const totalpenyependapatan = penyependapatan.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)
            const totalpenyependapatan_lalu = penyependapatan_lalu.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)

            const totalpendapatan = pendapatan.map((x) => parseFloat(x.realisasi)).reduce((a, b) => a + b, 0)
            const totalpendapatan_lalu = pendapatan_lalu.map((x) => parseFloat(x.realisasi)).reduce((a, b) => a + b, 0)
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

            const pendapatanx_lalu = pendapatan_lalu.map((x) => {
              return {
                uraian: 'Surplus / Defisit LO',
                // nilai: parseFloat(x.realisasi) + x.penyesuaian.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0),
                nilai: totalpendapatan_lalu + totalpenyependapatan_lalu,
                realisasi: parseFloat(x.realisasi),
                penyesuaian: x.penyesuaian.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)
              }
            })
            // console.log('pendapatan', pendapatanx)
            const beban = this.databebans.map((x) => {
              return {
                uraian: 'Surplus / Defisit LO',
                nilai: parseFloat(x.realisasi)
                // + x.penyesuaian.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)
              }
            })

            const beban_lalu = this.databebans_lalu.map((x) => {
              return {
                uraian: 'Surplus / Defisit LO',
                nilai: parseFloat(x.realisasi)
                // + x.penyesuaian.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)
              }
            })
            // const pendapatanzzz = pendapatanx.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2)
            // const bebans = beban.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2)
            const penyesuaianbeban = this.datapenyesuaianbebans.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)
            const penyesuaianbeban_lalu = this.datapenyesuaianbebans_lalu.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)


            const allnonoperasional = this.surplusnonoperasional.concat(this.defisitnonoperasional)
            const nonoperasional = allnonoperasional.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)


            const allnonoperasional_lalu = this.surplusnonoperasional_lalu.concat(this.defisitnonoperasional_lalu)
            const nonoperasional_lalu = allnonoperasional_lalu.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)

            // console.log('penyeseuaianbeban', penyesuaianbeban)
            // console.log('bebans', bebans)
            const nilaisurplusdef = {
              kode: '3.1.01',
              uraian: 'Surplus / Defisit LO',
              nilai: pendapatanx.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2) - beban.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2) - penyesuaianbeban.toFixed(2) + nonoperasional,
              nilai_lalu: pendapatanx_lalu.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2) - beban_lalu.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2) - penyesuaianbeban_lalu.toFixed(2) + nonoperasional_lalu,
              pendapatan: pendapatanx.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
              pendapatan_lalu: pendapatanx_lalu.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
              beban: beban.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
              beban_lalu: beban_lalu.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0).toFixed(2),
            }
            this.surplusdefisit = nilaisurplusdef
            // console.log('surplusdefisit', this.surplusdefisit)

            const objkoreksi = []
            for (let i = 0; i < this.datakoreksi?.length; i++) {
              const el = this.datakoreksi[i]
              const saldoawal = el?.saldoawal.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
              const saldoawal_lalu = el?.saldoawal_lalu.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
              const jurnal = el?.jurnalotom.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0)
              const jurnal_lalu = el?.jurnalotom_lalu.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0)
              const penyesuaian = el?.penyesuaianx.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)
              const penyesuaian_lalu = el?.penyesuaianx_lalu.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)

              const koreksi = {
                kode: el.kodeall3,
                uraian: el.uraian,
                nilai: saldoawal + jurnal + penyesuaian,
                nilai_lalu: saldoawal_lalu + jurnal_lalu + penyesuaian_lalu
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
