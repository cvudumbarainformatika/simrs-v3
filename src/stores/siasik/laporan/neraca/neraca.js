import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { useLPEStore } from '../lpe/lpe'
import { data } from 'autoprefixer'

export const useNeracaStore = defineStore('Neraca_Akuntansi', {
  state: () => ({
    loading: false,
    dialogCetak: false,
    exportExcel: false,
    loadingDownload: false,
    reqs: {
      q: '',
      page: 1,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglx: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
      levelberapa: ''
    },
    display: {
      dari: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      sampai: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    level: [
      { nama: 'Akun', value: '1' },
      { nama: 'Kelompok', value: '2' },
      { nama: 'Jenis', value: '3' },
      { nama: 'Objek', value: '4' },
      { nama: 'Rincian Objek', value: '5' },
      { nama: 'SubRincian Objek', value: '6' }
    ],


    // REVISI //
    dataaset: [],
    datakewajiban: [],
    dataekuitas: [],
    datapendapatans: [],
    datapenyesuaianpendapatans: [],
    databebans: [],
    datapenyesuaianbebans: [],
    pagupendapatan: [],
    surplusnonoperasional: [],
    defisitnonoperasional: [],

    datakoreksi: [],

    dataaset_lalu: [],
    datakewajiban_lalu: [],
    dataekuitas_lalu: [],
    datapendapatans_lalu: [],
    datapenyesuaianpendapatans_lalu: [],
    databebans_lalu: [],
    datapenyesuaianbebans_lalu: [],
    pagupendapatan_lalu: [],
    surplusnonoperasional_lalu: [],
    defisitnonoperasional_lalu: [],


    hasilaset: [],
    hasilkewajiban: [],
    hasilekuitas: [],
    // REVISI //

  }),
  actions: {
    setParameter(key, val) {
      this.reqs[key] = val
    },
    getDataNeraca() {
      this.loading = true
      const params = { params: this.reqs }

      return new Promise((resolve) => {
        api.get('v1/akuntansi/neraca/getneraca', params).then((resp) => {
          console.log('getData NERACA', resp?.data)
          if (resp.status === 200) {

            this.hasilaset = []
            this.hasilkewajiban = []
            this.hasilekuitas = []
            this.dataaset = resp.data?.aset
            this.datakewajiban = resp.data?.kewajiban
            this.dataekuitas = resp.data?.ekuitas

            this.dataaset_lalu = resp.data?.aset_lalu
            this.datakewajiban_lalu = resp.data?.kewajiban_lalu
            this.dataekuitas_lalu = resp.data?.ekuitas_lalu

            this.datapendapatans = resp.data.pendapatan
            this.datapendapatans_lalu = resp.data.pendapatan_lalu
            this.datapenyesuaianpendapatans = resp.data.penyesuaianpendapatan
            this.datapenyesuaianpendapatans_lalu = resp.data.penyesuaianpendapatan_lalu

            this.databebans = resp.data.beban
            this.databebans_lalu = resp.data.beban_lalu

            this.datapenyesuaianbebans = resp.data.penyesuaianbeban
            this.datapenyesuaianbebans_lalu = resp.data.penyesuaianbeban_lalu

            this.pagupendapatan = resp.data.pagupendapatan
            this.pagupendapatan_lalu = resp.data.pagupendapatan_lalu

            this.datakoreksi = resp.data.koreksi

            this.surplusnonoperasional = resp.data.surplusnonoperasional
            this.defisitnonoperasional = resp.data.defisitnonoperasional

            this.surplusnonoperasional_lalu = resp.data.surplusnonoperasional_lalu
            this.defisitnonoperasional_lalu = resp.data.defisitnonoperasional_lalu
            this.mapData()

            this.loading = false
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },

    mapData() {
      const koderekpend = this.pagupendapatan.map((x) => x.kode6)
      const pendapatan = this.datapendapatans.filter(x => koderekpend.includes(x.kode6))
      const penyependapatan = this.datapenyesuaianpendapatans.filter(x => koderekpend.includes(x.kode6))
      const totalpenyependapatan = penyependapatan.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)
      const totalpendapatan = pendapatan.map((x) => parseFloat(x.realisasi)).reduce((a, b) => a + b, 0)


      const koderekpend_lalu = this.pagupendapatan_lalu.map((x) => x.kode6)
      const pendapatan_lalu = this.datapendapatans_lalu.filter(x => koderekpend_lalu.includes(x.kode6))
      const penyependapatan_lalu = this.datapenyesuaianpendapatans_lalu.filter(x => koderekpend_lalu.includes(x.kode6))
      const totalpenyependapatan_lalu = penyependapatan_lalu.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)
      const totalpendapatan_lalu = pendapatan_lalu.map((x) => parseFloat(x.realisasi)).reduce((a, b) => a + b, 0)

      const beban = this.databebans.map((x) => parseFloat(x.realisasi)).reduce((a, b) => a + b, 0)
      const penyesuaianbeban = this.datapenyesuaianbebans.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)

      const beban_lalu = this.databebans_lalu.map((x) => parseFloat(x.realisasi)).reduce((a, b) => a + b, 0)
      const penyesuaianbeban_lalu = this.datapenyesuaianbebans_lalu.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)


      this.surplusdefisit = (totalpendapatan + totalpenyependapatan) - (beban + penyesuaianbeban)
      this.surplusdefisit_lalu = (totalpendapatan_lalu + totalpenyependapatan_lalu) - (beban_lalu + penyesuaianbeban_lalu)
      // console.log('surplusdefisit', this.surplusdefisit)

      const objkoreksi = []
      for (let i = 0; i < this.datakoreksi?.length; i++) {
        const el = this.datakoreksi[i]
        const saldoawal = el?.saldoawal.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const jurnal = el?.jurnalotom.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0)
        const penyesuaian = el?.penyesuaianx.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = el?.saldoawal_lalu.map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const jurnal_lalu = el?.jurnalotom_lalu.map((x) => parseFloat(x.totaljurnal)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = el?.penyesuaianx_lalu.map((x) => parseFloat(x.totalpenyesuaian)).reduce((a, b) => a + b, 0)

        const koreksi = {
          kode: el.kodeall3,
          uraian: el.uraian,
          nilai: saldoawal + jurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + jurnal_lalu + penyesuaian_lalu
        }
        objkoreksi.push(koreksi)
      }
      this.hasilkoreksi = objkoreksi.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0)
      this.hasilkoreksi_lalu = objkoreksi.map((x) => parseFloat(x.nilai_lalu)).reduce((a, b) => a + b, 0)


      const allnonoperasional = this.surplusnonoperasional.concat(this.defisitnonoperasional)
      const nonoperasional = allnonoperasional.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)

      const allnonoperasional_lalu = this.surplusnonoperasional_lalu.concat(this.defisitnonoperasional_lalu)
      const nonoperasional_lalu = allnonoperasional_lalu.map((x) => parseFloat(x.subtotal)).reduce((a, b) => a + b, 0)

      const kode6 = []
      const kode5 = []
      const kode4 = []
      const kode3 = []
      const kode2 = []
      const kode1 = []

      const set6 = this.dataaset.concat(this.dataaset_lalu).map((x) => x.kode6)
      const set5 = this.dataaset.concat(this.dataaset_lalu).map((x) => x.kode5)
      const set4 = this.dataaset.concat(this.dataaset_lalu).map((x) => x.kode4)
      const set3 = this.dataaset.concat(this.dataaset_lalu).map((x) => x.kode3)
      const set2 = this.dataaset.concat(this.dataaset_lalu).map((x) => x.kode2)
      const set1 = this.dataaset.concat(this.dataaset_lalu).map((x) => x.kode1)

      const setunik6 = set6?.length ? [...new Set(set6)] : []
      const setunik5 = set5?.length ? [...new Set(set5)] : []
      const setunik4 = set4?.length ? [...new Set(set4)] : []
      const setunik3 = set3?.length ? [...new Set(set3)] : []
      const setunik2 = set2?.length ? [...new Set(set2)] : []
      const setunik1 = set1?.length ? [...new Set(set1)] : []

      for (let i = 0; i < setunik6?.length; i++) {
        const el = setunik6[i]
        const saldoawal = this.dataaset.filter((x) => x.kode6 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataaset.filter((x) => x.kode6 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataaset.filter((x) => x.kode6 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = this.dataaset_lalu.filter((x) => x.kode6 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataaset_lalu.filter((x) => x.kode6 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataaset_lalu.filter((x) => x.kode6 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.dataaset.concat(this.dataaset_lalu).filter((x) => x.kode6 === el)[0]?.uraian,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode6.push(obj)
      }

      for (let i = 0; i < setunik5?.length; i++) {
        const el = setunik5[i]
        const saldoawal = this.dataaset.filter((x) => x.kode5 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataaset.filter((x) => x.kode5 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataaset.filter((x) => x.kode5 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = this.dataaset_lalu.filter((x) => x.kode5 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataaset_lalu.filter((x) => x.kode5 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataaset_lalu.filter((x) => x.kode5 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.dataaset.concat(this.dataaset_lalu).filter((x) => x.kode5 === el)[0]?.uraian5,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode5.push(obj)
      }

      for (let i = 0; i < setunik4?.length; i++) {
        const el = setunik4[i]
        const saldoawal = this.dataaset.filter((x) => x.kode4 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataaset.filter((x) => x.kode4 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataaset.filter((x) => x.kode4 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = this.dataaset_lalu.filter((x) => x.kode4 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataaset_lalu.filter((x) => x.kode4 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataaset_lalu.filter((x) => x.kode4 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.dataaset.concat(this.dataaset_lalu).filter((x) => x.kode4 === el)[0]?.uraian4,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode4.push(obj)
      }

      for (let i = 0; i < setunik3?.length; i++) {
        const el = setunik3[i]
        const saldoawal = this.dataaset.filter((x) => x.kode3 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataaset.filter((x) => x.kode3 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataaset.filter((x) => x.kode3 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = this.dataaset_lalu.filter((x) => x.kode3 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataaset_lalu.filter((x) => x.kode3 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataaset_lalu.filter((x) => x.kode3 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const obj = {
          kode: el,
          uraian: this.dataaset.concat(this.dataaset_lalu).filter((x) => x.kode3 === el)[0]?.uraian3,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode3.push(obj)
      }

      for (let i = 0; i < setunik2?.length; i++) {
        const el = setunik2[i]
        const saldoawal = this.dataaset.filter((x) => x.kode2 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataaset.filter((x) => x.kode2 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataaset.filter((x) => x.kode2 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = this.dataaset_lalu.filter((x) => x.kode2 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataaset_lalu.filter((x) => x.kode2 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataaset_lalu.filter((x) => x.kode2 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const obj = {
          kode: el,
          uraian: this.dataaset.concat(this.dataaset_lalu).filter((x) => x.kode2 === el)[0]?.uraian2,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode2.push(obj)
      }

      for (let i = 0; i < setunik1?.length; i++) {
        const el = setunik1[i]
        const saldoawal = this.dataaset.filter((x) => x.kode1 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataaset.filter((x) => x.kode1 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataaset.filter((x) => x.kode1 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = this.dataaset_lalu.filter((x) => x.kode1 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataaset_lalu.filter((x) => x.kode1 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataaset_lalu.filter((x) => x.kode1 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.dataaset.concat(this.dataaset_lalu).filter((x) => x.kode1 === el)[0]?.uraian1,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode1.push(obj)
      }
      kode6.push(...kode5, ...kode4, ...kode3, ...kode2, ...kode1)
      const sort6 = (kode6) =>
        kode6.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data6 = sort6(kode6)

      kode5.push(...kode4, ...kode3, ...kode2, ...kode1)
      const sort5 = (kode5) =>
        kode5.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data5 = sort5(kode5)

      kode4.push(...kode3, ...kode2, ...kode1)
      const sort4 = (kode4) =>
        kode4.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data4 = sort4(kode4)

      kode3.push(...kode2, ...kode1)
      const sort3 = (kode3) =>
        kode3.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data3 = sort3(kode3)

      kode2.push(...kode1)
      const sort2 = (kode2) =>
        kode2.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data2 = sort2(kode2)

      const sort1 = (kode1) =>
        kode1.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data1 = sort1(kode1)


      // KEWAJIBAN //

      const kode6kewajiban = []
      const kode5kewajiban = []
      const kode4kewajiban = []
      const kode3kewajiban = []
      const kode2kewajiban = []
      const kode1kewajiban = []

      const set6kewajiban = this.datakewajiban.concat(this.datakewajiban_lalu).map((x) => x.kode6)
      const set5kewajiban = this.datakewajiban.concat(this.datakewajiban_lalu).map((x) => x.kode5)
      const set4kewajiban = this.datakewajiban.concat(this.datakewajiban_lalu).map((x) => x.kode4)
      const set3kewajiban = this.datakewajiban.concat(this.datakewajiban_lalu).map((x) => x.kode3)
      const set2kewajiban = this.datakewajiban.concat(this.datakewajiban_lalu).map((x) => x.kode2)
      const set1kewajiban = this.datakewajiban.concat(this.datakewajiban_lalu).map((x) => x.kode1)

      const setunik6kewajiban = set6kewajiban?.length ? [...new Set(set6kewajiban)] : []
      const setunik5kewajiban = set5kewajiban?.length ? [...new Set(set5kewajiban)] : []
      const setunik4kewajiban = set4kewajiban?.length ? [...new Set(set4kewajiban)] : []
      const setunik3kewajiban = set3kewajiban?.length ? [...new Set(set3kewajiban)] : []
      const setunik2kewajiban = set2kewajiban?.length ? [...new Set(set2kewajiban)] : []
      const setunik1kewajiban = set1kewajiban?.length ? [...new Set(set1kewajiban)] : []

      for (let i = 0; i < setunik6kewajiban?.length; i++) {
        const el = setunik6kewajiban[i]
        const saldoawal = this.datakewajiban.filter((x) => x.kode6 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.datakewajiban.filter((x) => x.kode6 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.datakewajiban.filter((x) => x.kode6 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const saldoawal_lalu = this.datakewajiban_lalu.filter((x) => x.kode6 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.datakewajiban_lalu.filter((x) => x.kode6 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.datakewajiban_lalu.filter((x) => x.kode6 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.datakewajiban.concat(this.datakewajiban_lalu).filter((x) => x.kode6 === el)[0]?.uraian,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode6kewajiban.push(obj)
      }

      for (let i = 0; i < setunik5kewajiban?.length; i++) {
        const el = setunik5kewajiban[i]
        const saldoawal = this.datakewajiban.filter((x) => x.kode5 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.datakewajiban.filter((x) => x.kode5 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.datakewajiban.filter((x) => x.kode5 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.datakewajiban_lalu.filter((x) => x.kode5 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.datakewajiban_lalu.filter((x) => x.kode5 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.datakewajiban_lalu.filter((x) => x.kode5 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.datakewajiban.concat(this.datakewajiban_lalu).filter((x) => x.kode5 === el)[0]?.uraian5,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode5kewajiban.push(obj)
      }
      for (let i = 0; i < setunik4kewajiban?.length; i++) {
        const el = setunik4kewajiban[i]
        const saldoawal = this.datakewajiban.filter((x) => x.kode4 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.datakewajiban.filter((x) => x.kode4 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.datakewajiban.filter((x) => x.kode4 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.datakewajiban_lalu.filter((x) => x.kode4 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.datakewajiban_lalu.filter((x) => x.kode4 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.datakewajiban_lalu.filter((x) => x.kode4 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.datakewajiban.concat(this.datakewajiban_lalu).filter((x) => x.kode4 === el)[0]?.uraian4,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode4kewajiban.push(obj)
      }

      for (let i = 0; i < setunik3kewajiban?.length; i++) {
        const el = setunik3kewajiban[i]
        const saldoawal = this.datakewajiban.filter((x) => x.kode3 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.datakewajiban.filter((x) => x.kode3 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.datakewajiban.filter((x) => x.kode3 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.datakewajiban_lalu.filter((x) => x.kode3 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.datakewajiban_lalu.filter((x) => x.kode3 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.datakewajiban_lalu.filter((x) => x.kode3 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.datakewajiban.concat(this.datakewajiban_lalu).filter((x) => x.kode3 === el)[0]?.uraian3,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode3kewajiban.push(obj)
      }

      for (let i = 0; i < setunik2kewajiban?.length; i++) {
        const el = setunik2kewajiban[i]
        const saldoawal = this.datakewajiban.filter((x) => x.kode2 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.datakewajiban.filter((x) => x.kode2 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.datakewajiban.filter((x) => x.kode2 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.datakewajiban_lalu.filter((x) => x.kode2 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.datakewajiban_lalu.filter((x) => x.kode2 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.datakewajiban_lalu.filter((x) => x.kode2 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.datakewajiban.concat(this.datakewajiban_lalu).filter((x) => x.kode2 === el)[0]?.uraian2,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode2kewajiban.push(obj)
      }

      for (let i = 0; i < setunik1kewajiban?.length; i++) {
        const el = setunik1kewajiban[i]
        const saldoawal = this.datakewajiban.filter((x) => x.kode1 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.datakewajiban.filter((x) => x.kode1 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.datakewajiban.filter((x) => x.kode1 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.datakewajiban_lalu.filter((x) => x.kode1 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.datakewajiban_lalu.filter((x) => x.kode1 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.datakewajiban_lalu.filter((x) => x.kode1 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.datakewajiban.concat(this.datakewajiban_lalu).filter((x) => x.kode1 === el)[0]?.uraian1,
          nilai: saldoawal + nilaijurnal + penyesuaian,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu
        }
        kode1kewajiban.push(obj)
      }
      kode6kewajiban.push(...kode5kewajiban, ...kode4kewajiban, ...kode3kewajiban, ...kode2kewajiban, ...kode1kewajiban)
      const sort6kewajiban = (kode6kewajiban) =>
        kode6kewajiban.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data6kewajiban = sort6kewajiban(kode6kewajiban)

      kode5kewajiban.push(...kode4kewajiban, ...kode3kewajiban, ...kode2kewajiban, ...kode1kewajiban)
      const sort5kewajiban = (kode5kewajiban) =>
        kode5kewajiban.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data5kewajiban = sort5kewajiban(kode5kewajiban)

      kode4kewajiban.push(...kode3kewajiban, ...kode2kewajiban, ...kode1kewajiban)
      const sort4kewajiban = (kode4kewajiban) =>
        kode4kewajiban.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data4kewajiban = sort4kewajiban(kode4kewajiban)

      kode3kewajiban.push(...kode2kewajiban, ...kode1kewajiban)
      const sort3kewajiban = (kode3kewajiban) =>
        kode3kewajiban.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data3kewajiban = sort3kewajiban(kode3kewajiban)

      kode2kewajiban.push(...kode1kewajiban)
      const sort2kewajiban = (kode2kewajiban) =>
        kode2kewajiban.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data2kewajiban = sort2kewajiban(kode2kewajiban)

      const sort1kewajiban = (kode1kewajiban) =>
        kode1kewajiban.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data1kewajiban = sort1kewajiban(kode1kewajiban)


      const kode6ekuitas = []
      const kode5ekuitas = []
      const kode4ekuitas = []
      const kode3ekuitas = []
      const kode2ekuitas = []
      const kode1ekuitas = []

      const set6ekuitas = this.dataekuitas.concat(this.dataekuitas_lalu).map((x) => x.kode6)
      const set5ekuitas = this.dataekuitas.concat(this.dataekuitas_lalu).map((x) => x.kode5)
      const set4ekuitas = this.dataekuitas.concat(this.dataekuitas_lalu).map((x) => x.kode4)
      const set3ekuitas = this.dataekuitas.concat(this.dataekuitas_lalu).map((x) => x.kode3)
      const set2ekuitas = this.dataekuitas.concat(this.dataekuitas_lalu).map((x) => x.kode2)
      const set1ekuitas = this.dataekuitas.concat(this.dataekuitas_lalu).map((x) => x.kode1)

      const setunik6ekuitas = set6ekuitas?.length ? [...new Set(set6ekuitas)] : []
      const setunik5ekuitas = set5ekuitas?.length ? [...new Set(set5ekuitas)] : []
      const setunik4ekuitas = set4ekuitas?.length ? [...new Set(set4ekuitas)] : []
      const setunik3ekuitas = set3ekuitas?.length ? [...new Set(set3ekuitas)] : []
      const setunik2ekuitas = set2ekuitas?.length ? [...new Set(set2ekuitas)] : []
      const setunik1ekuitas = set1ekuitas?.length ? [...new Set(set1ekuitas)] : []

      for (let i = 0; i < setunik6ekuitas?.length; i++) {
        const el = setunik6ekuitas[i]
        const saldoawal = this.dataekuitas.filter((x) => x.kode6 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataekuitas.filter((x) => x.kode6 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataekuitas.filter((x) => x.kode6 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.dataekuitas_lalu.filter((x) => x.kode6 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataekuitas_lalu.filter((x) => x.kode6 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataekuitas_lalu.filter((x) => x.kode6 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const obj = {
          kode: el,
          uraian: this.dataekuitas.concat(this.dataekuitas_lalu).filter((x) => x.kode6 === el)[0]?.uraian,
          nilai: saldoawal + nilaijurnal + penyesuaian + this.surplusdefisit + this.hasilkoreksi + nonoperasional,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu + this.surplusdefisit_lalu + this.hasilkoreksi_lalu + nonoperasional_lalu
        }
        kode6ekuitas.push(obj)
      }

      for (let i = 0; i < setunik5ekuitas?.length; i++) {
        const el = setunik5ekuitas[i]
        const saldoawal = this.dataekuitas.filter((x) => x.kode5 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataekuitas.filter((x) => x.kode5 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataekuitas.filter((x) => x.kode5 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.dataekuitas_lalu.filter((x) => x.kode5 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataekuitas_lalu.filter((x) => x.kode5 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataekuitas_lalu.filter((x) => x.kode5 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const obj = {
          kode: el,
          uraian: this.dataekuitas.concat(this.dataekuitas_lalu).filter((x) => x.kode5 === el)[0]?.uraian5,
          nilai: saldoawal + nilaijurnal + penyesuaian + this.surplusdefisit + this.hasilkoreksi + nonoperasional,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu + this.surplusdefisit_lalu + this.hasilkoreksi_lalu + nonoperasional_lalu
        }
        kode5ekuitas.push(obj)
      }

      for (let i = 0; i < setunik4ekuitas?.length; i++) {
        const el = setunik4ekuitas[i]
        const saldoawal = this.dataekuitas.filter((x) => x.kode4 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataekuitas.filter((x) => x.kode4 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataekuitas.filter((x) => x.kode4 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.dataekuitas_lalu.filter((x) => x.kode4 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataekuitas_lalu.filter((x) => x.kode4 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataekuitas_lalu.filter((x) => x.kode4 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const obj = {
          kode: el,
          uraian: this.dataekuitas.concat(this.dataekuitas_lalu).filter((x) => x.kode4 === el)[0]?.uraian4,
          nilai: saldoawal + nilaijurnal + penyesuaian + this.surplusdefisit + this.hasilkoreksi + nonoperasional,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu + this.surplusdefisit_lalu + this.hasilkoreksi_lalu + nonoperasional_lalu
        }
        kode4ekuitas.push(obj)
      }

      for (let i = 0; i < setunik3ekuitas?.length; i++) {
        const el = setunik3ekuitas[i]
        const saldoawal = this.dataekuitas.filter((x) => x.kode3 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataekuitas.filter((x) => x.kode3 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataekuitas.filter((x) => x.kode3 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.dataekuitas_lalu.filter((x) => x.kode3 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataekuitas_lalu.filter((x) => x.kode3 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataekuitas_lalu.filter((x) => x.kode3 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const obj = {
          kode: el,
          uraian: this.dataekuitas.concat(this.dataekuitas_lalu).filter((x) => x.kode3 === el)[0]?.uraian3,
          nilai: saldoawal + nilaijurnal + penyesuaian + this.surplusdefisit + this.hasilkoreksi + nonoperasional,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu + this.surplusdefisit_lalu + this.hasilkoreksi_lalu + nonoperasional_lalu
        }
        kode3ekuitas.push(obj)
      }

      for (let i = 0; i < setunik2ekuitas?.length; i++) {
        const el = setunik2ekuitas[i]
        const saldoawal = this.dataekuitas.filter((x) => x.kode2 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataekuitas.filter((x) => x.kode2 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataekuitas.filter((x) => x.kode2 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.dataekuitas_lalu.filter((x) => x.kode2 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataekuitas_lalu.filter((x) => x.kode2 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataekuitas_lalu.filter((x) => x.kode2 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const obj = {
          kode: el,
          uraian: this.dataekuitas.concat(this.dataekuitas_lalu).filter((x) => x.kode2 === el)[0]?.uraian2,
          nilai: saldoawal + nilaijurnal + penyesuaian + this.surplusdefisit + this.hasilkoreksi + nonoperasional,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu + this.surplusdefisit_lalu + this.hasilkoreksi_lalu + nonoperasional_lalu
        }
        kode2ekuitas.push(obj)
      }

      for (let i = 0; i < setunik1ekuitas?.length; i++) {
        const el = setunik1ekuitas[i]
        const saldoawal = this.dataekuitas.filter((x) => x.kode1 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal = this.dataekuitas.filter((x) => x.kode1 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian = this.dataekuitas.filter((x) => x.kode1 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const saldoawal_lalu = this.dataekuitas_lalu.filter((x) => x.kode1 === el).map((x) => parseFloat(x.saldo)).reduce((a, b) => a + b, 0)
        const nilaijurnal_lalu = this.dataekuitas_lalu.filter((x) => x.kode1 === el).map((x) => (x.jurnalotom).map((y) => parseFloat(y.totaljurnal)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        const penyesuaian_lalu = this.dataekuitas_lalu.filter((x) => x.kode1 === el).map((x) => (x.penyesuaian).map((y) => parseFloat(y.totalpenyesuaian)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)

        const obj = {
          kode: el,
          uraian: this.dataekuitas.concat(this.dataekuitas_lalu).filter((x) => x.kode1 === el)[0]?.uraian1,
          nilai: saldoawal + nilaijurnal + penyesuaian + this.surplusdefisit + this.hasilkoreksi + nonoperasional,
          nilai_lalu: saldoawal_lalu + nilaijurnal_lalu + penyesuaian_lalu + this.surplusdefisit_lalu + this.hasilkoreksi_lalu + nonoperasional_lalu
        }
        kode1ekuitas.push(obj)
      }
      kode6ekuitas.push(...kode5ekuitas, ...kode4ekuitas, ...kode3ekuitas, ...kode2ekuitas, ...kode1ekuitas)
      const sort6ekuitas = (kode6ekuitas) =>
        kode6ekuitas.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data6ekuitas = sort6ekuitas(kode6ekuitas)

      kode5ekuitas.push(...kode4ekuitas, ...kode3ekuitas, ...kode2ekuitas, ...kode1ekuitas)
      const sort5ekuitas = (kode5ekuitas) =>
        kode5ekuitas.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data5ekuitas = sort5ekuitas(kode5ekuitas)

      kode4ekuitas.push(...kode3ekuitas, ...kode2ekuitas, ...kode1ekuitas)
      const sort4ekuitas = (kode4ekuitas) =>
        kode4ekuitas.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data4ekuitas = sort4ekuitas(kode4ekuitas)

      kode3ekuitas.push(...kode2ekuitas, ...kode1ekuitas)
      const sort3ekuitas = (kode3ekuitas) =>
        kode3ekuitas.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data3ekuitas = sort3ekuitas(kode3ekuitas)

      kode2ekuitas.push(...kode1ekuitas)
      const sort2ekuitas = (kode2ekuitas) =>
        kode2ekuitas.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data2ekuitas = sort2ekuitas(kode2ekuitas)

      const sort1ekuitas = (kode1ekuitas) =>
        kode1ekuitas.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const data1ekuitas = sort1ekuitas(kode1ekuitas)

      if (this.reqs.levelberapa === 6) {
        this.hasilaset = data6
        this.hasilkewajiban = data6kewajiban
        this.hasilekuitas = data6ekuitas
      } else if (this.reqs.levelberapa === 5) {
        this.hasilaset = data5
        this.hasilkewajiban = data5kewajiban
        this.hasilekuitas = data5ekuitas
      } else if (this.reqs.levelberapa === 4) {
        this.hasilaset = data4
        this.hasilkewajiban = data4kewajiban
        this.hasilekuitas = data4ekuitas
      } else if (this.reqs.levelberapa === 3) {
        this.hasilaset = data3
        this.hasilkewajiban = data3kewajiban
        this.hasilekuitas = data3ekuitas
      } else if (this.reqs.levelberapa === 2) {
        this.hasilaset = data2
        this.hasilkewajiban = data2kewajiban
        this.hasilekuitas = data2ekuitas
      } else if (this.reqs.levelberapa === 1) {
        this.hasilaset = data1
        this.hasilkewajiban = data1kewajiban
        this.hasilekuitas = data1ekuitas
      }
    }
  }
})
