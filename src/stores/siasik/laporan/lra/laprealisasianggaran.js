/* eslint-disable space-before-function-paren */
import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useLaporanLraLaprealisasianggaranStore = defineStore('laporan_realisasi_anggaran', {
  state: () => ({
    loading: false,
    loadingdata: false,
    items: [],
    kodeakun: [],
    kodekelompok: [],
    kodejenis: [],
    kodeobjek: [],
    koderinciobjek: [],
    // dataitems: [],
    meta: {},
    params: {
      q: '',
      page: 1,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglx: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      // tahun: date.formatDate(Date.now(), 'YYYY'),
      bidang: '',
      kegiatan: '',
      kodebidang: null
    },
    display: {
      dari: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      sampai: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      bidang: null,
      kegiatan: null
    },
    reqlevels: null,
    realisasibelanja: [],
    pendapatans: [],
    nilaipends: [],
    realisasipends: [],
    mapbidangptk: [],
    bidangs: [],
    kegiatans: [],
    ptks: [],
    paguAnggaran: [],
    mapRekening: [],
    penggunaAnggaran: [],
    pembiayaans: [],
    realisasiPembiayaans: [],
    paguPembiayaans: [],

    //PENDAPATAN
    pagupendapatans: [],
    datapendapatans: [],
    datapendpsblm: [],
    datareklas: [],
    datareklas_sblm: [],

    realpendapatans: [],
    kurangiKASs: [],
    level: [
      { nama: 'Akun', value: '1' },
      { nama: 'Kelompok', value: '2' },
      { nama: 'Jenis', value: '3' },
      { nama: 'Objek', value: '4' },
      { nama: 'Rincian Objek', value: '5' },
      { nama: 'SubRincian Objek', value: '6' }
    ]
  }),
  actions: {
    setParameter(key, val) {
      this.params[key] = val
    },
    setForm(key, val) {
      this.params[key] = val
    },
    emptyForm() {
      this.params.bidang = ''
      this.params.kegiatan = ''
    },

    // eslint-disable-next-line space-before-function-paren
    getDataBidang() {
      this.params.bidang = ''
      this.params.kegiatan = ''
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve) => {
        api.get('v1/laporan/lra/bidang', params).then((resp) => {
          // console.log('bidang', resp)
          if (resp.status === 200) {
            this.bidangs = []
            this.kegiatans = []
            this.mapbidangptk = resp.data
            // this.bidangs = resp.data
            // this.kegiatans = resp.data
            // this.ptks = resp.data
            this.loading = false
            this.filterBidang(resp.data)
            this.filterKegiatan(resp.data)
            this.filterPtk(resp.data)
            resolve(resp)
          }
        }).catch(() => { this.loading = false })
      })
    },
    filterBidang() {
      const data = this.mapbidangptk?.length
        ? this.mapbidangptk?.map((x) => {
          return {
            kodebidang: x.kodebidang,
            bidang: x.bidang
          }
        })
        : []
      const bid = data.reduce((acc, curr) => {
        const kodesama = acc.find(x => x.kodebidang === curr.kodebidang)
        if (!kodesama) {
          acc.push(curr)
        }
        return acc
      }, [])
      this.bidangs = bid
      // console.log('bidangfilt', this.params.bidang)
    },
    filterPtk() {
      const data = this.mapbidangptk?.length
        ? this.mapbidangptk?.map((x) => {
          return {
            nip: x.kodepptk,
            nama: x.namapptk,
            kodeBagian: x.kodebidang,
            bagian: x.bidang
          }
        })
        : []
      const ptk = data.reduce((acc, curr) => {
        const kodesama = acc.find(x => x.nip === curr.nip)
        if (!kodesama) {
          acc.push(curr)
        }
        return acc
      }, [])
      this.ptks = ptk
      // console.log('pptk', this.ptks)
    },
    filterKegiatan() {
      const data = this.mapbidangptk?.length
        ? this.mapbidangptk?.filter(x =>
          x.kodebidang === this.params.kodebidang
        )
        : []
      this.kegiatans = data
      // console.log('kegiatans', this.kegiatans)
    },
    getDataRealisasi() {
      this.loadingdata = true
      const params = { params: this.params }
      return new Promise(resolve => {
        api.get('v1/laporan/lra/laplra', params).then(resp => {
          if (resp.status === 200) {
            // console.log('DATA LRA', resp)
            // RESET HASIL GET
            this.items = []
            this.kodeakun = []
            this.kodekelompok = []
            this.kodejenis = []
            this.kodeobjek = []
            this.koderinciobjek = []
            this.pembiayaans = []
            // ---------//

            this.realisasibelanja = resp.data?.belanja
            this.realpendapatans = resp.data?.realisasipendapatan
            // this.pagupendapatans = resp.data?.nilaipendapatan
            this.pagupendapatans = resp.data.pagupendapatan
            this.datapendapatans = resp.data.pendapatan
            this.datapendpsblm = resp.data.pendapatansblm
            this.datareklas = resp.data.datareklas
            this.datareklas_sblm = resp.data.datareklas_sblm
            // this.realisasiPembiayaans = resp.data?.silpa
            this.paguPembiayaans = resp.data?.silpa
            this.kurangiKASs = resp.data?.kurangikaskecil
            // this.dataitems = resp.data
            this.paguAnggaran()
            this.mapRekening()
            this.mapPendapatan()
            // this.nilaiPendapatan()
            // this.realisasiPendapatan()
            this.rekPembiayaan(resp.data?.pembiayaan)
            this.realisasiPembiayaan()
            // this.paguPembiayaan()
            this.penggunaAnggaran = resp.data?.pa
            this.loadingdata = false
            resolve(resp)
          }
        }).catch(() => {
          this.loadingdata = false
          // this.items = []
        })
      })
    },

    mapPendapatan() {
      const pendsblm = this.datapendpsblm
      const pendapatan = this.datapendapatans
      const pagupendapatan = this.pagupendapatans
      const datareklas = this.datareklas
      const datareklas_sblm = this.datareklas_sblm
      const kode6 = []
      const kode5 = []
      const kode4 = []
      const kode3 = []
      const kode2 = []
      const kode1 = []

      const setkod = pagupendapatan.map((x) => x.kode6)
      const unikset = setkod?.length ? [...new Set(setkod)] : []
      for (let i = 0; i < unikset?.length; i++) {
        const el = unikset[i];
        const totalpagu = pagupendapatan.filter((x) => x.kode6 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.pagupendapatan), 0)

        const nilaiskg = pendapatan.filter((x) => x.kode6 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
        const penyesuaiskg = datareklas.filter((x) => x.kode6 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpeny = penyesuaiskg.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaiskg = (parseFloat(nilaiskg) + parseFloat(totalpeny)).toFixed(2)

        const nilaisblm = pendsblm.filter((x) => x.kode6 === el).map((x) => parseFloat(x.pendpsebelumnya)).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        const penyesblm = datareklas_sblm.filter((x) => x.kode6 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpenysblm = penyesblm.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaisblm = (isNaN(parseFloat(nilaisblm) + parseFloat(totalpenysblm)) ? parseFloat(0) : parseFloat(nilaisblm) + parseFloat(totalpenysblm)).toFixed(2)
        // console.log('penyesuaian', totalpeny)
        // console.log('penyesblm', totalpenysblm)
        const obj6 = {
          kode: pagupendapatan.filter((x) => x.kode6 === el)[0].kode6,
          uraian: pagupendapatan.filter((x) => x.kode6 === el)[0].uraian,
          pagupend: parseFloat(totalpagu),
          nilaiskg: parseFloat(totalnilaiskg),
          nilaisblm: parseFloat(totalnilaisblm),
          nilaisemua: parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm),
          selisih: parseFloat(totalpagu) - (parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)),
          persen: (((parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)) / parseFloat(totalpagu)) * 100).toFixed(2),
        }
        kode6.push(obj6)
      }

      const setkod5 = pagupendapatan.map((x) => x.kode5)
      const unikset5 = setkod5?.length ? [...new Set(setkod5)] : []
      for (let i = 0; i < unikset5?.length; i++) {
        const el = unikset5[i];
        const totalpagu = pagupendapatan.filter((x) => x.kode5 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.pagupendapatan), 0)

        const nilaiskg = pendapatan.filter((x) => x.kode5 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
        const penyesuaiskg = datareklas.filter((x) => x.kode5 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpeny = penyesuaiskg.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaiskg = (parseFloat(nilaiskg) + parseFloat(totalpeny)).toFixed(2)

        const nilaisblm = pendsblm.filter((x) => x.kode5 === el).map((x) => parseFloat(x.pendpsebelumnya)).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        const penyesblm = datareklas_sblm.filter((x) => x.kode5 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpenysblm = penyesblm.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaisblm = (isNaN(parseFloat(nilaisblm) + parseFloat(totalpenysblm)) ? parseFloat(0) : parseFloat(nilaisblm) + parseFloat(totalpenysblm)).toFixed(2)
        const obj5 = {
          kode: pagupendapatan.filter((x) => x.kode5 === el)[0].kode5,
          uraian: pagupendapatan.filter((x) => x.kode5 === el)[0].uraian5,
          pagupend: parseFloat(totalpagu),
          nilaiskg: parseFloat(totalnilaiskg),
          nilaisblm: parseFloat(totalnilaisblm),
          nilaisemua: parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm),
          selisih: parseFloat(totalpagu) - (parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)),
          persen: (((parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)) / parseFloat(totalpagu)) * 100).toFixed(2),
        }
        kode5.push(obj5)
      }
      const setkod4 = pagupendapatan.map((x) => x.kode4)
      const unikset4 = setkod4?.length ? [...new Set(setkod4)] : []
      for (let i = 0; i < unikset4?.length; i++) {
        const el = unikset4[i];
        const totalpagu = pagupendapatan.filter((x) => x.kode4 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.pagupendapatan), 0)

        const nilaiskg = pendapatan.filter((x) => x.kode4 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
        const penyesuaiskg = datareklas.filter((x) => x.kode4 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpeny = penyesuaiskg.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaiskg = (parseFloat(nilaiskg) + parseFloat(totalpeny)).toFixed(2)

        const nilaisblm = pendsblm.filter((x) => x.kode4 === el).map((x) => parseFloat(x.pendpsebelumnya)).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        const penyesblm = datareklas_sblm.filter((x) => x.kode4 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpenysblm = penyesblm.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaisblm = (isNaN(parseFloat(nilaisblm) + parseFloat(totalpenysblm)) ? parseFloat(0) : parseFloat(nilaisblm) + parseFloat(totalpenysblm)).toFixed(2)
        const obj4 = {
          kode: pagupendapatan.filter((x) => x.kode4 === el)[0].kode4,
          uraian: pagupendapatan.filter((x) => x.kode4 === el)[0].uraian4,
          pagupend: parseFloat(totalpagu),
          nilaiskg: parseFloat(totalnilaiskg),
          nilaisblm: parseFloat(totalnilaisblm),
          nilaisemua: parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm),
          selisih: parseFloat(totalpagu) - (parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)),
          persen: (((parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)) / parseFloat(totalpagu)) * 100).toFixed(2),
        }
        kode4.push(obj4)
      }

      const setkod3 = pagupendapatan.map((x) => x.kode3)
      const unikset3 = setkod3?.length ? [...new Set(setkod3)] : []
      for (let i = 0; i < unikset3?.length; i++) {
        const el = unikset3[i];
        const totalpagu = pagupendapatan.filter((x) => x.kode3 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.pagupendapatan), 0)

        const nilaiskg = pendapatan.filter((x) => x.kode3 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
        const penyesuaiskg = datareklas.filter((x) => x.kode3 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpeny = penyesuaiskg.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaiskg = (parseFloat(nilaiskg) + parseFloat(totalpeny)).toFixed(2)

        const nilaisblm = pendsblm.filter((x) => x.kode3 === el).map((x) => parseFloat(x.pendpsebelumnya)).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        const penyesblm = datareklas_sblm.filter((x) => x.kode3 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpenysblm = penyesblm.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaisblm = (isNaN(parseFloat(nilaisblm) + parseFloat(totalpenysblm)) ? parseFloat(0) : parseFloat(nilaisblm) + parseFloat(totalpenysblm)).toFixed(2)
        const obj3 = {
          kode: pagupendapatan.filter((x) => x.kode3 === el)[0].kode3,
          uraian: pagupendapatan.filter((x) => x.kode3 === el)[0].uraian3,
          pagupend: parseFloat(totalpagu),
          nilaiskg: parseFloat(totalnilaiskg),
          nilaisblm: parseFloat(totalnilaisblm),
          nilaisemua: parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm),
          selisih: parseFloat(totalpagu) - (parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)),
          persen: (((parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)) / parseFloat(totalpagu)) * 100).toFixed(2),
        }
        kode3.push(obj3)
      }

      const setkod2 = pagupendapatan.map((x) => x.kode2)
      const unikset2 = setkod2?.length ? [...new Set(setkod2)] : []
      for (let i = 0; i < unikset2?.length; i++) {
        const el = unikset2[i];
        const totalpagu = pagupendapatan.filter((x) => x.kode2 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.pagupendapatan), 0)

        const nilaiskg = pendapatan.filter((x) => x.kode2 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
        const penyesuaiskg = datareklas.filter((x) => x.kode2 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpeny = penyesuaiskg.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaiskg = (parseFloat(nilaiskg) + parseFloat(totalpeny)).toFixed(2)

        const nilaisblm = pendsblm.filter((x) => x.kode2 === el).map((x) => parseFloat(x.pendpsebelumnya)).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        const penyesblm = datareklas_sblm.filter((x) => x.kode2 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpenysblm = penyesblm.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaisblm = (isNaN(parseFloat(nilaisblm) + parseFloat(totalpenysblm)) ? parseFloat(0) : parseFloat(nilaisblm) + parseFloat(totalpenysblm)).toFixed(2)
        const obj2 = {
          kode: pagupendapatan.filter((x) => x.kode2 === el)[0].kode2,
          uraian: pagupendapatan.filter((x) => x.kode2 === el)[0].uraian2,
          pagupend: parseFloat(totalpagu),
          nilaiskg: parseFloat(totalnilaiskg),
          nilaisblm: parseFloat(totalnilaisblm),
          nilaisemua: parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm),
          selisih: parseFloat(totalpagu) - (parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)),
          persen: (((parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)) / parseFloat(totalpagu)) * 100).toFixed(2),
        }
        kode2.push(obj2)
      }


      const setkod1 = pagupendapatan.map((x) => x.kode1)
      const unikset1 = setkod1?.length ? [...new Set(setkod1)] : []
      for (let i = 0; i < unikset1?.length; i++) {
        const el = unikset1[i];
        const totalpagu = pagupendapatan.filter((x) => x.kode1 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.pagupendapatan), 0)

        const nilaiskg = pendapatan.filter((x) => x.kode1 === el).reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
        const penyesuaiskg = datareklas.filter((x) => x.kode1 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpeny = penyesuaiskg.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaiskg = (parseFloat(nilaiskg) + parseFloat(totalpeny)).toFixed(2)

        const nilaisblm = pendsblm.filter((x) => x.kode1 === el).map((x) => parseFloat(x.pendpsebelumnya)).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
        const penyesblm = datareklas_sblm.filter((x) => x.kode1 === el).map((x) => parseFloat(x.totalpenyesuaian))
        const totalpenysblm = penyesblm.reduce((x, y) => parseFloat(x) + parseFloat(y), 0).toFixed(2)
        const totalnilaisblm = (isNaN(parseFloat(nilaisblm) + parseFloat(totalpenysblm)) ? parseFloat(0) : parseFloat(nilaisblm) + parseFloat(totalpenysblm)).toFixed(2)
        const obj1 = {
          kode: pagupendapatan.filter((x) => x.kode1 === el)[0].kode1,
          uraian: pagupendapatan.filter((x) => x.kode1 === el)[0].uraian1,
          pagupend: parseFloat(totalpagu),
          nilaiskg: parseFloat(totalnilaiskg),
          nilaisblm: parseFloat(totalnilaisblm),
          nilaisemua: parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm),
          selisih: parseFloat(totalpagu) - (parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)),
          persen: (((parseFloat(totalnilaiskg) + parseFloat(totalnilaisblm)) / parseFloat(totalpagu)) * 100).toFixed(2),
        }
        kode1.push(obj1)
      }
      kode6.push(...kode5, ...kode4, ...kode3, ...kode2, ...kode1)
      const sortpend6 = (kode6) =>
        kode6.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      const pendapatan6 = sortpend6(kode6)
      this.pendapatans = pendapatan6
    },

    // NILAI PAGU PENDAPATAN
    // nilaiPendapatan(val) {
    //   const real = this.pagupendapatans?.map((x) => parseFloat(x.nilai))
    //   // console.log('datapendapatanmmm', real)
    //   const total = {
    //     totalPaguPendapatan: real?.reduce((a, b) => a + b, 0)
    //   }

    //   this.nilaipends = total
    //   // console.log('anggaran', this.nilaipends)
    //   // for (let i = 0; i < val?.length; i++) {
    //   //   val.nilaipends =
    //   //     val?.map((x) => parseInt(x.nilai)).reduce((a, b) => a + b, 0)

    //   //   console.log('nilai', val.nilaipends)

    //   //   this.nilaipends.push(val.nilaipends)
    //   // }
    // },

    // NILAI REALISASI PENDAPATAN
    // realisasiPendapatan(val) {
    //   const kasSebelumnya = this.kurangiKASs?.filter((x) => {
    //     const tgl = new Date(x?.tanggalpengeluaran).getTime()
    //     return tgl < new Date(this.params.tgl).getTime()
    //   }).map((x) => parseFloat(x.nominal))

    //   const kasSekarang = this.kurangiKASs?.filter((x) => {
    //     const tgl = new Date(x?.tanggalpengeluaran).getTime()
    //     return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
    //   }).map((x) => parseFloat(x.nominal))

    //   const realSebelumnya = this.realpendapatans?.filter((x) => {
    //     const tgl = new Date(x?.tgltrans).getTime()
    //     return tgl < new Date(this.params.tgl).getTime()
    //   }).map((x) => parseFloat(x.nilai))

    //   const real = this.realpendapatans?.filter((x) => {
    //     const tgl = new Date(x?.tgltrans).getTime()
    //     return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
    //   }).map((x) => parseFloat(x.nilai))

    //   const totalPagu = this.nilaipends?.totalPaguPendapatan

    //   const total = {
    //     totalPaguPendapatan: totalPagu,
    //     totalSekarang: real?.reduce((a, b) => a + b, 0) - kasSekarang?.reduce((a, b) => a + b, 0),
    //     totalSebelumnya: realSebelumnya?.reduce((a, b) => a + b, 0) - kasSebelumnya?.reduce((a, b) => a + b, 0),
    //     totalRealisasi: (real?.reduce((a, b) => a + b, 0) + realSebelumnya?.reduce((a, b) => a + b, 0)) - (kasSekarang?.reduce((a, b) => a + b, 0) + kasSebelumnya?.reduce((a, b) => a + b, 0)),
    //     selisih: totalPagu - ((realSebelumnya?.reduce((a, b) => a + b, 0) + real?.reduce((a, b) => a + b, 0)) - (kasSekarang?.reduce((a, b) => a + b, 0) + kasSebelumnya?.reduce((a, b) => a + b, 0))),
    //     persen: (((((realSebelumnya?.reduce((a, b) => a + b, 0) + real?.reduce((a, b) => a + b, 0)) - (kasSekarang?.reduce((a, b) => a + b, 0) + kasSebelumnya?.reduce((a, b) => a + b, 0)))) / parseFloat(totalPagu)) * 100).toFixed(2)
    //   }

    //   this.realisasipends = total
    //   // console.log('realisasi', this.realisasipends)
    //   // for (let i = 0; i < val?.length; i++) {
    //   //   val[i].realpendapatan = val?.map((x) => parseInt(x.nilai)).reduce((a, b) => a + b, 0)
    //   //   console.log('real', val[i].realpendapatan)
    //   // }
    // },
    rekPembiayaan(val) {
      this.pembiayaans = val
    },
    // paguPembiayaan() {
    //   const real = this.paguPembiayaans?.map((x) => parseFloat(x.nominal))
    //   const total = {
    //     totalPaguPembiayaan: real?.reduce((a, b) => a + b, 0)
    //   }

    //   this.paguPembiayaans = total
    // },
    realisasiPembiayaan() {
      const realSebelumnya = this.paguPembiayaans?.filter((x) => {
        const tgl = new Date(x?.tanggal).getTime()
        return tgl < new Date(this.params.tgl).getTime()
      }).map((x) => parseFloat(x.nominal))

      const realsekarang = this.paguPembiayaans?.filter((x) => {
        const tgl = new Date(x?.tanggal).getTime()
        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
      }).map((x) => parseFloat(x.nominal))

      const totalPagu = this.paguPembiayaans?.map((x) => parseFloat(x.nominal)).reduce((a, b) => a + b, 0)

      // console.log('klklkl', totalPagu)

      const total = {
        totalPaguPembiayaan: totalPagu,
        totalSekarang: realsekarang?.reduce((a, b) => a + b, 0),
        totalSebelumnya: realSebelumnya?.reduce((a, b) => a + b, 0),
        totalRealisasi: realsekarang?.reduce((a, b) => a + b, 0) + realSebelumnya?.reduce((a, b) => a + b, 0),
        selisih: totalPagu - (realSebelumnya?.reduce((a, b) => a + b, 0) + realsekarang?.reduce((a, b) => a + b, 0)),
        persen: isNaN((((realSebelumnya?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) + realsekarang?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) / parseFloat(totalPagu)) * 100).toFixed(2)) ?
          parseFloat(0).toFixed(2) : (((realSebelumnya?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) + realsekarang?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) / parseFloat(totalPagu)) * 100).toFixed(2)
      }

      this.realisasiPembiayaans = total
      // console.log('realisasi', this.realisasiPembiayaans)
      // for (let i = 0; i < val?.length; i++) {
      //   val[i].realpendapatan = val?.map((x) => parseInt(x.nilai)).reduce((a, b) => a + b, 0)
      //   console.log('real', val[i].realpendapatan)
      // }
    },

    paguAnggaran() {
      // console.log('val', val)
      // this.items = []
      const anggaran = []
      for (let i = 0; i < this.realisasibelanja?.length; i++) {
        const xy = this.realisasibelanja
        const el = this.realisasibelanja[i].anggaran

        // FILTER TRANSAKSI SEBELUMNYA
        const lsAwal = this.realisasibelanja[i].npdls_rinci?.filter((x) => {
          const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku
          ).getTime()
          return tgl < new Date(this.params.tgl).getTime()
        })
        const pjrAwal = this.realisasibelanja[i].spjpanjar?.filter((x) => {
          const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
          return tgl < new Date(this.params.tgl).getTime()
        })
        const cpAwal = this.realisasibelanja[i].cp?.filter((x) => {
          const tgl = new Date(x?.tglcontrapost).getTime()
          return tgl < new Date(this.params.tgl).getTime()
        })

        // FILTER TRANSAKSI SEKARANG
        const ls = this.realisasibelanja[i].npdls_rinci?.filter((x) => {
          const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
          return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
        })
        const pjr = this.realisasibelanja[i].spjpanjar?.filter((x) => {
          const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
          return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
        })
        const cp = this.realisasibelanja[i].cp?.filter((x) => {
          const tgl = new Date(x?.tglcontrapost).getTime()
          return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
        })
        // const pagu = {
        //   totalPagu: el.map((x) => parseInt(x.pagu)).reduce((a, b) => a + b, 0)
        // }

        // NILAI PAGU
        xy[i].totalPagu = el?.map((x) => parseFloat(x.pagu)).reduce((a, b) => a + b, 0)
        // console.log('dataxxx', val[i])
        // NILAI REALISASI SEBELUMNYA
        xy[i].sumLSsebelumnya = lsAwal?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0)
        xy[i].sumPanjarsebelumnya = pjrAwal?.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0)
        xy[i].sumCPsebelumnya = cpAwal?.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)
        xy[i].totalRealisasiSebelumnya = xy[i].sumLSsebelumnya + xy[i].sumPanjarsebelumnya - xy[i].sumCPsebelumnya

        // NILAI REALISASI SEKARANG
        xy[i].sumLS = ls?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0)
        xy[i].sumPanjar = pjr?.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0)
        xy[i].sumCP = cp?.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)
        xy[i].totalRealisasi = xy[i].sumLS + xy[i].sumPanjar - xy[i].sumCP

        // NILAI REALISASI KESELURUHAN
        xy[i].RealisasiSemua = xy[i].totalRealisasi + xy[i].totalRealisasiSebelumnya
        // NILAI SELISIH
        xy[i].selisih = xy[i].totalPagu - (xy[i].totalRealisasiSebelumnya + xy[i].totalRealisasi)
        xy[i].persen = ((parseFloat(xy[i].totalRealisasiSebelumnya) + parseFloat(xy[i].totalRealisasi)) / parseFloat(xy[i].totalPagu) * 100).toFixed(2)

        const level6 = {
          kodeall3: xy[i].kodeall3,
          uraian: xy[i].uraian,
          totalPagu: xy[i].totalPagu,
          totalRealisasiSebelumnya: xy[i].totalRealisasiSebelumnya,
          totalRealisasi: xy[i].totalRealisasi,
          RealisasiSemua: xy[i].RealisasiSemua,
          selisih: xy[i].selisih,
          persen: xy[i].persen
        }
        // this.items = pagu
        anggaran.push(level6)
        // console.log('xxxx', anggaran)
      }

      // anggaran.push(...val)
      this.items.push(...anggaran)
      // this.dataitems = this.items
      // console.log('thisitem', this.items)
      // val = Anggaran
      // console.log('paguuuu', val)
      // return this.items
    },
    mapRekening() {
      const pagu = this.realisasibelanja?.map((x) => x.totalPagu)
      const realisasiSebelumnya = this.realisasibelanja?.map((x) => x.totalRealisasiSebelumnya)
      const realisasi = this.realisasibelanja?.map((x) => x.totalRealisasi)
      const kode1 = {
        kodeall3: this.realisasibelanja.map((x) => x.kode1?.kodeall2).reduce((a, b) => {
          if (!a.includes(b)) {
            a.push(b)
          }
          return a
        }),
        uraian: this.realisasibelanja.map((x) => x.kode1?.uraian).reduce((a, b) => {
          if (!a.includes(b)) {
            a.push(b)
          }
          return a
        }),
        totalPagu: pagu.reduce((a, b) => a + b, 0),
        totalRealisasiSebelumnya: realisasiSebelumnya.reduce((a, b) => a + b, 0),
        totalRealisasi: realisasi.reduce((a, b) => a + b, 0),
        RealisasiSemua: realisasiSebelumnya.reduce((a, b) => a + b, 0) + realisasi.reduce((a, b) => a + b, 0),
        selisih: pagu.reduce((a, b) => a + b, 0) - realisasiSebelumnya.reduce((a, b) => a + b, 0) - realisasi.reduce((a, b) => a + b, 0),
        persen: ((realisasiSebelumnya.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) + realisasi.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) / pagu.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) * 100).toFixed(2)
      }
      // console.log('KODE 1', kode1)
      // KODE2
      const kod2 = this.realisasibelanja?.length
        ? this.realisasibelanja.map((x) => {
          const a = x?.kode2?.kodeall2
          return {
            kodeall3: x?.kode2?.kodeall2,
            uraian: x?.kode2?.uraian,
            totalPagu: this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
              }).reduce((x, y) => x + y, 0),
            totalRealisasiSebelumnya: this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            totalRealisasi: this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            RealisasiSemua: (this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0)) + (this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0)),
            selisih: this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
              }).reduce((x, y) => x + y, 0) -
              (this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0) +
                this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
                  .map((x) => {
                    return (x?.npdls_rinci?.filter((x) => {
                      const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                      (x?.spjpanjar?.filter((x) => {
                        const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                      (x?.cp?.filter((x) => {
                        const tgl = new Date(x?.tglcontrapost).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                  }).reduce((x, y) => x + y, 0)),

            persen: (((this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0) +
              this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) /
              this.realisasibelanja?.filter((s) => s?.kode2?.kodeall2 === a)
                .map((x) => {
                  return x?.anggaran.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) * 100).toFixed(2)
          }
        })
        : []
      const kode2 = kod2.reduce(
        (acc, curr) =>
          acc.find((v) => v?.kodeall3 === curr?.kodeall3) ? acc : [...acc, curr],
        []
      )
      // console.log('KODE 2', kode2)
      // const kode2 = {}
      // for (let i = 0; i < kode?.length; i++) {
      //   const el = kode.reduce(
      //     (acc, curr) =>
      //       acc.find((v) => v.kodeall2 === curr.kodeall2) ? acc : [...acc, curr],
      //     []
      //   )

      //   kode2.push(el)
      // }

      // KODE 3
      const kod3 = this.realisasibelanja?.length
        ? this.realisasibelanja.map((x) => {
          const a = x?.kode3?.kodeall2
          return {
            kodeall3: x?.kode3?.kodeall2,
            uraian: x?.kode3?.uraian,
            totalPagu: this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran?.reduce((a, b) => parseFloat(a) + parseFloat(b?.pagu), 0)
              }).reduce((x, y) => x + y, 0),
            totalRealisasiSebelumnya: this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            totalRealisasi: this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            RealisasiSemua: (this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0)) + (this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0)),
            selisih: this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran?.reduce((a, b) => parseFloat(a) + parseFloat(b?.pagu), 0)
              }).reduce((x, y) => x + y, 0) -
              (this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0) +
                this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
                  .map((x) => {
                    return (x?.npdls_rinci?.filter((x) => {
                      const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                      (x?.spjpanjar?.filter((x) => {
                        const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                      (x?.cp?.filter((x) => {
                        const tgl = new Date(x?.tglcontrapost).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                  }).reduce((x, y) => x + y, 0)),

            persen: (((this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0) +
              this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) /
              this.realisasibelanja?.filter((s) => s?.kode3?.kodeall2 === a)
                .map((x) => {
                  return x?.anggaran.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) * 100).toFixed(2)
          }
        })
        : []
      const kode3 = kod3.reduce(
        (acc, curr) =>
          acc.find((v) => v?.kodeall3 === curr?.kodeall3) ? acc : [...acc, curr],
        []
      )
      // console.log('kode3', kode3)
      // KODE4
      const kod4 = this.realisasibelanja?.length
        ? this.realisasibelanja.map((x) => {
          const a = x?.kode4?.kodeall2
          return {
            kodeall3: x?.kode4?.kodeall2,
            uraian: x?.kode4?.uraian,
            totalPagu: this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran?.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
              }).reduce((x, y) => x + y, 0),
            totalRealisasiSebelumnya: this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            totalRealisasi: this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            RealisasiSemua: (this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0)) + (this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0)),
            selisih: this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran?.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
              }).reduce((x, y) => x + y, 0) -
              (this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0) +
                this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
                  .map((x) => {
                    return (x?.npdls_rinci?.filter((x) => {
                      const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                      (x?.spjpanjar?.filter((x) => {
                        const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                      (x?.cp?.filter((x) => {
                        const tgl = new Date(x?.tglcontrapost).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                  }).reduce((x, y) => x + y, 0)),
            persen: (((this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0) +
              this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) /
              this.realisasibelanja?.filter((s) => s?.kode4?.kodeall2 === a)
                .map((x) => {
                  return x?.anggaran.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) * 100).toFixed(2)
          }
        })
        : []
      const kode4 = kod4.reduce(
        (acc, curr) =>
          acc.find((v) => v?.kodeall3 === curr?.kodeall3) ? acc : [...acc, curr],
        []
      )
      // console.log('kode4', kode4)
      // KODE4
      const kod5 = this.realisasibelanja?.length
        ? this.realisasibelanja?.map((x) => {
          const a = x?.kode5?.kodeall2
          return {
            kodeall3: x?.kode5?.kodeall2,
            uraian: x?.kode5?.uraian,
            totalPagu: this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran?.reduce((a, b) => parseFloat(a) + parseFloat(b?.pagu), 0)
              }).reduce((x, y) => x + y, 0),
            totalRealisasiSebelumnya: this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            totalRealisasi: this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0),
            RealisasiSemua: (this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => x + y, 0)) + (this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0)),
            selisih: this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
              .map((x) => {
                return x?.anggaran?.reduce((a, b) => parseFloat(a) + parseFloat(b?.pagu), 0)
              }).reduce((x, y) => x + y, 0) -
              (this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl < new Date(this.params.tgl).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => x + y, 0) +
                this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
                  .map((x) => {
                    return (x?.npdls_rinci?.filter((x) => {
                      const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                      (x?.spjpanjar?.filter((x) => {
                        const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                      (x?.cp?.filter((x) => {
                        const tgl = new Date(x?.tglcontrapost).getTime()
                        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                      }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                  }).reduce((x, y) => x + y, 0)),

            persen: (((this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
              .map((x) => {
                return (x?.npdls_rinci?.filter((x) => {
                  const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                  return tgl < new Date(this.params.tgl).getTime()
                }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                  (x?.spjpanjar?.filter((x) => {
                    const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                  (x?.cp?.filter((x) => {
                    const tgl = new Date(x?.tglcontrapost).getTime()
                    return tgl < new Date(this.params.tgl).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
              }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0) +
              this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
                .map((x) => {
                  return (x?.npdls_rinci?.filter((x) => {
                    const tgl = new Date(x?.headerls?.npkrinci?.header?.tglpindahbuku).getTime()
                    return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                  }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalpembayaran), 0)) +
                    (x?.spjpanjar?.filter((x) => {
                      const tgl = new Date(x?.spjheader?.tglspjpanjar).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.jumlahbelanjapanjar), 0)) -
                    (x?.cp?.filter((x) => {
                      const tgl = new Date(x?.tglcontrapost).getTime()
                      return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
                    }).reduce((a, b) => parseFloat(a) + parseFloat(b?.nominalcontrapost), 0))
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) /
              this.realisasibelanja?.filter((s) => s?.kode5?.kodeall2 === a)
                .map((x) => {
                  return x?.anggaran.reduce((a, b) => parseFloat(a) + parseFloat(b.pagu), 0)
                }).reduce((x, y) => parseFloat(x) + parseFloat(y), 0)) * 100).toFixed(2)
          }
        })
        : []
      const kode5 = kod5.reduce(
        (acc, curr) =>
          acc.find((v) => v?.kodeall3 === curr?.kodeall3) ? acc : [...acc, curr],
        []
      )
      // console.log('kode5', kod5)
      // const kode2 = []
      // for (let i = 0; i < kode?.length; i++) {
      //   const kodkelompok = {
      //     kodeall3: kode[i]
      //   }

      //   console.log('jj', kodkelompok)
      //   kode2.push(kodkelompok)
      // }

      // const kode = this.items?.map((x) => x.akun + '.' + x.kelompok)
      // const kelm = kode.reduce((a, b) => {
      //   if (!a.includes(b)) {
      //     a.push(b)
      //   }
      //   return a
      // }, [])
      // const kode2 = []
      // for (let i = 0; i < kelm?.length; i++) {
      //   const kodkelompok = {
      //     kodeall3: kelm[i],
      //     totalPagu: 0,
      //     totalRealisasi: 0
      //   }
      //   kode2.push(kodkelompok)
      // }

      // console.log('ksksk', kode2)

      // const join = this.items?.concat(kode1, kode2, kode3, kode4, kode5)
      // console.log('allll', join)
      // const join = kode1?.concat(kode2, kode3, kode4, kode5)
      // console.log('al al', join)
      this.items.push(kode1, ...kode2, ...kode3, ...kode4, ...kode5)
      const sort = this.items.sort(({ kodeall3: a }, { kodeall3: b }) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      this.kodeakun.push(kode1)
      // console.log('kelompok', this.kodeakun)
      const sortkode1 = this.kodeakun.sort(({ kodeall3: a }, { kodeall3: b }) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      this.kodekelompok.push(kode1, ...kode2)
      // console.log('kelompok', this.kodekelompok)
      const sortkode2 = this.kodekelompok.sort(({ kodeall3: a }, { kodeall3: b }) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      this.kodejenis.push(kode1, ...kode2, ...kode3)
      // console.log('jenis', this.kodejenis)
      const sortkode3 = this.kodejenis.sort(({ kodeall3: a }, { kodeall3: b }) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      this.kodeobjek.push(kode1, ...kode2, ...kode3, ...kode4)
      // console.log('jenis', this.kodeobjek)
      const sortkode4 = this.kodeobjek.sort(({ kodeall3: a }, { kodeall3: b }) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      this.koderinciobjek.push(kode1, ...kode2, ...kode3, ...kode4, ...kode5)
      // console.log('jenis', this.koderinciobjek)
      const sortkode5 = this.koderinciobjek.sort(({ kodeall3: a }, { kodeall3: b }) =>
        a < b ? -1 : a > b ? 1 : 0
      )

      // this.dataitems.push(kode1, ...kode2, ...kode3, ...kode4, ...kode5)
      // console.log('jenis', this.dataitems)
      // const sortkode6 = this.dataitems.sort(({ kodeall3: a }, { kodeall3: b }) =>
      //   a < b ? -1 : a > b ? 1 : 0
      // )

      return sort && sortkode1 && sortkode2 && sortkode3 && sortkode4 && sortkode5
    },

    getLRA() {
      this.loadingdata = true
      const params = { params: this.params }
      return new Promise(resolve => {
        api.get('v1/laporan/lra/datalra', params).then(resp => {
          if (resp.status === 200) {
            console.log('Data LRA', resp)
            this.pagupendapatans = resp.data.pagupendapatan
            this.realisasi_pendapatan = resp.data?.realisasi_pendapatan
            this.realisasi_pendapatan_sebelum = resp.data?.realisasi_pendapatan_sebelum
            this.reklas_pendapatan = resp.data?.reklas_pendapatan
            this.reklas_pendapatan_sebelum = resp.data?.reklas_pendapatan_sebelum

            this.pembiayaans = resp.data?.pembiayaan
            this.paguPembiayaans = resp.data?.silpa

            this.realisasibelanja = resp.data?.belanja
            this.realisasibelanja_sebelum = resp.data?.belanja_sebelum
            this.mapingData()

            this.loadingdata = false
            resolve(resp)
          }
        }).catch(() => {
          this.loadingdata = false
          // this.items = []
        })
      })
    },

    mapingData() {

      // PEMBIAYAAN
      const realSebelumnya = this.paguPembiayaans?.filter((x) => {
        const tgl = new Date(x?.tanggal).getTime()
        return tgl < new Date(this.params.tgl).getTime()
      }).map((x) => parseFloat(x.nominal))

      const realsekarang = this.paguPembiayaans?.filter((x) => {
        const tgl = new Date(x?.tanggal).getTime()
        return tgl >= new Date(this.params.tgl).getTime() && tgl <= new Date(this.params.tglx).getTime()
      }).map((x) => parseFloat(x.nominal))

      const totalPagu = this.paguPembiayaans?.map((x) => parseFloat(x.nominal)).reduce((a, b) => a + b, 0)

      // console.log('klklkl', totalPagu)

      const total = {
        totalPaguPembiayaan: totalPagu,
        totalSekarang: realsekarang?.reduce((a, b) => a + b, 0),
        totalSebelumnya: realSebelumnya?.reduce((a, b) => a + b, 0),
        totalRealisasi: realsekarang?.reduce((a, b) => a + b, 0) + realSebelumnya?.reduce((a, b) => a + b, 0),
        selisih: totalPagu - (realSebelumnya?.reduce((a, b) => a + b, 0) + realsekarang?.reduce((a, b) => a + b, 0)),
        persen: isNaN((((realSebelumnya?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) + realsekarang?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) / parseFloat(totalPagu)) * 100).toFixed(2)) ?
          parseFloat(0).toFixed(2) : (((realSebelumnya?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) + realsekarang?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) / parseFloat(totalPagu)) * 100).toFixed(2)
      }

      this.realisasiPembiayaans = total


      // PENDAPATAN
      const pendapatan = []

      const groupBypendapatan = (arr, field) =>
        arr.reduce((acc, item) => {
          if (!acc[item[field]]) acc[item[field]] = []
          acc[item[field]].push(item)
          return acc
        }, {})
      const paguByKode6 = groupBypendapatan(this.pagupendapatans, 'kode6')
      const realisasiByKode6 = groupBypendapatan(this.realisasi_pendapatan, 'kode6')
      const realisasiSebelumByKode6 = groupBypendapatan(this.realisasi_pendapatan_sebelum, 'kode6')
      const reklasByKode6 = groupBypendapatan(this.reklas_pendapatan, 'kode6')
      const reklasSebelumByKode6 = groupBypendapatan(this.reklas_pendapatan_sebelum, 'kode6')

      Object.entries(paguByKode6).forEach(([kode6, paguRows]) => {

        const realisasiRows = realisasiByKode6[kode6] || []
        const realisasiSebelumRows = realisasiSebelumByKode6[kode6] || []
        const reklasRows = reklasByKode6[kode6] || []
        const reklasSebelumRows = reklasSebelumByKode6[kode6] || []

        const totalPagu = paguRows.reduce(
          (a, b) => a + Number(b.pagupendapatan || 0),
          0
        )

        const realisasi_skg = realisasiRows.reduce(
          (a, b) => a + Number(b.subtotal || 0),
          0
        )

        const realisasi_sblm = realisasiSebelumRows.reduce(
          (a, b) => a + Number(b.pendpsebelumnya || 0),
          0
        )

        const totalpeny = reklasRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const totalpenysblm = reklasSebelumRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const nilaiskg = realisasi_skg + totalpeny
        const nilaisblm = realisasi_sblm + totalpenysblm
        const nilaisemua = nilaiskg + nilaisblm

        pendapatan.push({
          kode: kode6,
          uraian: paguRows[0].uraian,
          pagu: totalPagu,
          nilaiskg,
          nilaisblm,
          nilaisemua,
          selisih: totalPagu - nilaisemua,
          persen: totalPagu > 0
            ? ((nilaisemua / totalPagu) * 100).toFixed(2)
            : '0.00'
        })
      })


      const paguByKode5 = groupBypendapatan(this.pagupendapatans, 'kode5')
      const realisasiByKode5 = groupBypendapatan(this.realisasi_pendapatan, 'kode5')
      const realisasiSebelumByKode5 = groupBypendapatan(this.realisasi_pendapatan_sebelum, 'kode5')
      const reklasByKode5 = groupBypendapatan(this.reklas_pendapatan, 'kode5')
      const reklasSebelumByKode5 = groupBypendapatan(this.reklas_pendapatan_sebelum, 'kode5')

      Object.entries(paguByKode5).forEach(([kode5, paguRows]) => {

        const realisasiRows = realisasiByKode5[kode5] || []
        const realisasiSebelumRows = realisasiSebelumByKode5[kode5] || []
        const reklasRows = reklasByKode5[kode5] || []
        const reklasSebelumRows = reklasSebelumByKode5[kode5] || []

        const totalPagu = paguRows.reduce(
          (a, b) => a + Number(b.pagupendapatan || 0),
          0
        )

        const realisasi_skg = realisasiRows.reduce(
          (a, b) => a + Number(b.subtotal || 0),
          0
        )

        const realisasi_sblm = realisasiSebelumRows.reduce(
          (a, b) => a + Number(b.pendpsebelumnya || 0),
          0
        )

        const totalpeny = reklasRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const totalpenysblm = reklasSebelumRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const nilaiskg = realisasi_skg + totalpeny
        const nilaisblm = realisasi_sblm + totalpenysblm
        const nilaisemua = nilaiskg + nilaisblm

        pendapatan.push({
          kode: kode5,
          uraian: paguRows[0].uraian5,
          pagu: totalPagu,
          nilaiskg,
          nilaisblm,
          nilaisemua,
          selisih: totalPagu - nilaisemua,
          persen: totalPagu > 0
            ? ((nilaisemua / totalPagu) * 100).toFixed(2)
            : '0.00'
        })
      })



      const paguByKode4 = groupBypendapatan(this.pagupendapatans, 'kode4')
      const realisasiByKode4 = groupBypendapatan(this.realisasi_pendapatan, 'kode4')
      const realisasiSebelumByKode4 = groupBypendapatan(this.realisasi_pendapatan_sebelum, 'kode4')
      const reklasByKode4 = groupBypendapatan(this.reklas_pendapatan, 'kode4')
      const reklasSebelumByKode4 = groupBypendapatan(this.reklas_pendapatan_sebelum, 'kode4')

      Object.entries(paguByKode4).forEach(([kode4, paguRows]) => {

        const realisasiRows = realisasiByKode4[kode4] || []
        const realisasiSebelumRows = realisasiSebelumByKode4[kode4] || []
        const reklasRows = reklasByKode4[kode4] || []
        const reklasSebelumRows = reklasSebelumByKode4[kode4] || []

        const totalPagu = paguRows.reduce(
          (a, b) => a + Number(b.pagupendapatan || 0),
          0
        )

        const realisasi_skg = realisasiRows.reduce(
          (a, b) => a + Number(b.subtotal || 0),
          0
        )

        const realisasi_sblm = realisasiSebelumRows.reduce(
          (a, b) => a + Number(b.pendpsebelumnya || 0),
          0
        )

        const totalpeny = reklasRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const totalpenysblm = reklasSebelumRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const nilaiskg = realisasi_skg + totalpeny
        const nilaisblm = realisasi_sblm + totalpenysblm
        const nilaisemua = nilaiskg + nilaisblm

        pendapatan.push({
          kode: kode4,
          uraian: paguRows[0].uraian4,
          pagu: totalPagu,
          nilaiskg,
          nilaisblm,
          nilaisemua,
          selisih: totalPagu - nilaisemua,
          persen: totalPagu > 0
            ? ((nilaisemua / totalPagu) * 100).toFixed(2)
            : '0.00'
        })
      })


      const paguByKode3 = groupBypendapatan(this.pagupendapatans, 'kode3')
      const realisasiByKode3 = groupBypendapatan(this.realisasi_pendapatan, 'kode3')
      const realisasiSebelumByKode3 = groupBypendapatan(this.realisasi_pendapatan_sebelum, 'kode3')
      const reklasByKode3 = groupBypendapatan(this.reklas_pendapatan, 'kode3')
      const reklasSebelumByKode3 = groupBypendapatan(this.reklas_pendapatan_sebelum, 'kode3')

      Object.entries(paguByKode3).forEach(([kode3, paguRows]) => {

        const realisasiRows = realisasiByKode3[kode3] || []
        const realisasiSebelumRows = realisasiSebelumByKode3[kode3] || []
        const reklasRows = reklasByKode3[kode3] || []
        const reklasSebelumRows = reklasSebelumByKode3[kode3] || []

        const totalPagu = paguRows.reduce(
          (a, b) => a + Number(b.pagupendapatan || 0),
          0
        )

        const realisasi_skg = realisasiRows.reduce(
          (a, b) => a + Number(b.subtotal || 0),
          0
        )

        const realisasi_sblm = realisasiSebelumRows.reduce(
          (a, b) => a + Number(b.pendpsebelumnya || 0),
          0
        )

        const totalpeny = reklasRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const totalpenysblm = reklasSebelumRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const nilaiskg = realisasi_skg + totalpeny
        const nilaisblm = realisasi_sblm + totalpenysblm
        const nilaisemua = nilaiskg + nilaisblm

        pendapatan.push({
          kode: kode3,
          uraian: paguRows[0].uraian3,
          pagu: totalPagu,
          nilaiskg,
          nilaisblm,
          nilaisemua,
          selisih: totalPagu - nilaisemua,
          persen: totalPagu > 0
            ? ((nilaisemua / totalPagu) * 100).toFixed(2)
            : '0.00'
        })
      })

      const paguByKode2 = groupBypendapatan(this.pagupendapatans, 'kode2')
      const realisasiByKode2 = groupBypendapatan(this.realisasi_pendapatan, 'kode2')
      const realisasiSebelumByKode2 = groupBypendapatan(this.realisasi_pendapatan_sebelum, 'kode2')
      const reklasByKode2 = groupBypendapatan(this.reklas_pendapatan, 'kode2')
      const reklasSebelumByKode2 = groupBypendapatan(this.reklas_pendapatan_sebelum, 'kode2')

      Object.entries(paguByKode2).forEach(([kode2, paguRows]) => {

        const realisasiRows = realisasiByKode2[kode2] || []
        const realisasiSebelumRows = realisasiSebelumByKode2[kode2] || []
        const reklasRows = reklasByKode2[kode2] || []
        const reklasSebelumRows = reklasSebelumByKode2[kode2] || []

        const totalPagu = paguRows.reduce(
          (a, b) => a + Number(b.pagupendapatan || 0),
          0
        )

        const realisasi_skg = realisasiRows.reduce(
          (a, b) => a + Number(b.subtotal || 0),
          0
        )

        const realisasi_sblm = realisasiSebelumRows.reduce(
          (a, b) => a + Number(b.pendpsebelumnya || 0),
          0
        )

        const totalpeny = reklasRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const totalpenysblm = reklasSebelumRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const nilaiskg = realisasi_skg + totalpeny
        const nilaisblm = realisasi_sblm + totalpenysblm
        const nilaisemua = nilaiskg + nilaisblm

        pendapatan.push({
          kode: kode2,
          uraian: paguRows[0].uraian2,
          pagu: totalPagu,
          nilaiskg,
          nilaisblm,
          nilaisemua,
          selisih: totalPagu - nilaisemua,
          persen: totalPagu > 0
            ? ((nilaisemua / totalPagu) * 100).toFixed(2)
            : '0.00'
        })
      })


      const paguByKode1 = groupBypendapatan(this.pagupendapatans, 'kode1')
      const realisasiByKode1 = groupBypendapatan(this.realisasi_pendapatan, 'kode1')
      const realisasiSebelumByKode1 = groupBypendapatan(this.realisasi_pendapatan_sebelum, 'kode1')
      const reklasByKode1 = groupBypendapatan(this.reklas_pendapatan, 'kode1')
      const reklasSebelumByKode1 = groupBypendapatan(this.reklas_pendapatan_sebelum, 'kode1')

      Object.entries(paguByKode1).forEach(([kode1, paguRows]) => {

        const realisasiRows = realisasiByKode1[kode1] || []
        const realisasiSebelumRows = realisasiSebelumByKode1[kode1] || []
        const reklasRows = reklasByKode1[kode1] || []
        const reklasSebelumRows = reklasSebelumByKode1[kode1] || []

        const totalPagu = paguRows.reduce(
          (a, b) => a + Number(b.pagupendapatan || 0),
          0
        )

        const realisasi_skg = realisasiRows.reduce(
          (a, b) => a + Number(b.subtotal || 0),
          0
        )

        const realisasi_sblm = realisasiSebelumRows.reduce(
          (a, b) => a + Number(b.pendpsebelumnya || 0),
          0
        )

        const totalpeny = reklasRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const totalpenysblm = reklasSebelumRows.reduce(
          (a, b) => a + Number(b.totalpenyesuaian || 0),
          0
        )

        const nilaiskg = realisasi_skg + totalpeny
        const nilaisblm = realisasi_sblm + totalpenysblm
        const nilaisemua = nilaiskg + nilaisblm

        pendapatan.push({
          kode: kode1,
          uraian: paguRows[0].uraian1,
          pagu: totalPagu,
          nilaiskg,
          nilaisblm,
          nilaisemua,
          selisih: totalPagu - nilaisemua,
          persen: totalPagu > 0
            ? ((nilaisemua / totalPagu) * 100).toFixed(2)
            : '0.00'
        })
      })

      const sortpendapatan = (pendapatan) =>
        pendapatan.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      this.pendapatans = sortpendapatan(pendapatan)




      // BELANJA
      const belanja_kode = []
      const summaryIdpp = {}
      // hitung sekali saja
      const semuaIdpp = [...new Set(this.realisasibelanja.map(x => x.idpp))]

      semuaIdpp.forEach(idpp => {
        const rows = this.realisasibelanja.filter(x => x.idpp === idpp)
        const row = rows[0]

        const npdLS = rows
          .flatMap(x => x.realisasi || [])
          .reduce((a, b) => a + Number(b.realisasi || 0), 0)

        const spjpanjar = rows
          .flatMap(x => x.realisasi_spjpanjar || [])
          .reduce((a, b) => a + Number(b.jumlahbelanjapanjar || 0), 0)

        const cp = rows
          .flatMap(x => x.contrapost || [])
          .reduce((a, b) => a + Number(b.nominalcontrapost || 0), 0)

        const rowsSebelum = this.realisasibelanja_sebelum.filter(x => x.idpp === idpp)

        const npdLS_sebelum = rowsSebelum
          .flatMap(x => x.realisasi || [])
          .reduce((a, b) => a + Number(b.realisasi || 0), 0)

        const spjpanjar_sebelum = rowsSebelum
          .flatMap(x => x.realisasi_spjpanjar || [])
          .reduce((a, b) => a + Number(b.jumlahbelanjapanjar || 0), 0)

        const cp_sebelum = rowsSebelum
          .flatMap(x => x.contrapost || [])
          .reduce((a, b) => a + Number(b.nominalcontrapost || 0), 0)

        summaryIdpp[idpp] = {
          usulan: row.usulan,
          pagu: Number(row.pagu),
          volume: Number(row.volume),
          harga: Number(row.harga),
          satuan: row.satuan,
          koderek108: row.koderek108,
          realisasi_sekarang: npdLS + spjpanjar - cp,
          realisasi_sebelum: npdLS_sebelum + spjpanjar_sebelum - cp_sebelum
        }
      })

      const byKode6 = this.realisasibelanja.reduce((acc, item) => {
        if (!acc[item.kode6]) acc[item.kode6] = []
        acc[item.kode6].push(item)
        return acc
      }, {})

      Object.entries(byKode6).forEach(([kode6, rows]) => {

        const rincian = []
        const pagu = rows.reduce(
          (a, b) => a + Number(b.pagu || 0),
          0
        )
        const unikIdpp = [...new Set(rows.map(x => x.idpp))]

        unikIdpp.forEach(idpp => {
          const data = summaryIdpp[idpp]
          rincian.push({
            usulan: data.usulan,
            pagu: data.pagu,
            volume: data.volume,
            harga: data.harga,
            satuan: data.satuan,
            koderek108: data.koderek108,
            realisasi_sekarang: data.realisasi_sekarang,
            realisasi_sebelum: data.realisasi_sebelum,
            total:
              data.realisasi_sekarang +
              data.realisasi_sebelum,
            sisa_pagu:
              data.pagu -
              (
                data.realisasi_sekarang +
                data.realisasi_sebelum
              )
          })
        })
        const realisasi_skg = rincian.reduce(
          (a, b) => a + b.realisasi_sekarang,
          0
        )
        const realisasi_sblm = rincian.reduce(
          (a, b) => a + b.realisasi_sebelum,
          0
        )
        const total_realisasi =
          realisasi_skg + realisasi_sblm

        // rincian.sort((a, b) => {
        //   const kodeA = a.koderek108 || '';
        //   const kodeB = b.koderek108 || '';
        //   return kodeA.localeCompare(kodeB, undefined, { numeric: true, sensitivity: 'base' });
        // })
        belanja_kode.push({
          kode: kode6,
          uraian: rows[0].uraian,
          pagu,
          realisasi_skg,
          realisasi_sblm,
          total_realisasi,
          selisih: pagu - total_realisasi,
          persen:
            pagu > 0
              ? ((total_realisasi / pagu) * 100).toFixed(2)
              : '0.00',
          rincian
        })
      })

      //KODE 5
      const byKode5 = this.realisasibelanja.reduce((acc, item) => {
        if (!acc[item.kode5]) acc[item.kode5] = []
        acc[item.kode5].push(item)
        return acc
      }, {})

      Object.entries(byKode5).forEach(([kode5, rows]) => {

        const rincian = []
        const pagu = rows.reduce(
          (a, b) => a + Number(b.pagu || 0),
          0
        )
        const unikIdpp = [...new Set(rows.map(x => x.idpp))]

        unikIdpp.forEach(idpp => {
          const data = summaryIdpp[idpp]
          rincian.push({
            // usulan: data.usulan,
            // pagu: data.pagu,
            // volume: data.volume,
            // harga: data.harga,
            // satuan: data.satuan,
            // koderek108: data.koderek108,
            realisasi_sekarang: data.realisasi_sekarang,
            realisasi_sebelum: data.realisasi_sebelum,
            // total:
            //   data.realisasi_sekarang +
            //   data.realisasi_sebelum,
            // sisa_pagu:
            //   data.pagu -
            //   (
            //     data.realisasi_sekarang +
            //     data.realisasi_sebelum
            //   )
          })
        })
        const realisasi_skg = rincian.reduce(
          (a, b) => a + b.realisasi_sekarang,
          0
        )
        const realisasi_sblm = rincian.reduce(
          (a, b) => a + b.realisasi_sebelum,
          0
        )
        const total_realisasi =
          realisasi_skg + realisasi_sblm
        // rincian.sort((a, b) => {
        //   const kodeA = a.koderek108 || '';
        //   const kodeB = b.koderek108 || '';
        //   return kodeA.localeCompare(kodeB, undefined, { numeric: true, sensitivity: 'base' });
        // })
        belanja_kode.push({
          kode: kode5,
          uraian: rows[0].uraian5,
          pagu,
          realisasi_skg,
          realisasi_sblm,
          total_realisasi,
          selisih: pagu - total_realisasi,
          persen:
            pagu > 0
              ? ((total_realisasi / pagu) * 100).toFixed(2)
              : '0.00',
          rincian
        })
      })


      //KODE 4
      const byKode4 = this.realisasibelanja.reduce((acc, item) => {
        if (!acc[item.kode4]) acc[item.kode4] = []
        acc[item.kode4].push(item)
        return acc
      }, {})

      Object.entries(byKode4).forEach(([kode4, rows]) => {

        const rincian = []
        const pagu = rows.reduce(
          (a, b) => a + Number(b.pagu || 0),
          0
        )
        const unikIdpp = [...new Set(rows.map(x => x.idpp))]

        unikIdpp.forEach(idpp => {
          const data = summaryIdpp[idpp]
          rincian.push({
            // usulan: data.usulan,
            // pagu: data.pagu,
            // volume: data.volume,
            // harga: data.harga,
            // satuan: data.satuan,
            // koderek108: data.koderek108,
            realisasi_sekarang: data.realisasi_sekarang,
            realisasi_sebelum: data.realisasi_sebelum,
            // total:
            //   data.realisasi_sekarang +
            //   data.realisasi_sebelum,
            // sisa_pagu:
            //   data.pagu -
            //   (
            //     data.realisasi_sekarang +
            //     data.realisasi_sebelum
            //   )
          })
        })
        const realisasi_skg = rincian.reduce(
          (a, b) => a + b.realisasi_sekarang,
          0
        )
        const realisasi_sblm = rincian.reduce(
          (a, b) => a + b.realisasi_sebelum,
          0
        )
        const total_realisasi =
          realisasi_skg + realisasi_sblm
        // rincian.sort((a, b) => {
        //   const kodeA = a.koderek108 || '';
        //   const kodeB = b.koderek108 || '';
        //   return kodeA.localeCompare(kodeB, undefined, { numeric: true, sensitivity: 'base' });
        // })
        belanja_kode.push({
          kode: kode4,
          uraian: rows[0].uraian4,
          pagu,
          realisasi_skg,
          realisasi_sblm,
          total_realisasi,
          selisih: pagu - total_realisasi,
          persen:
            pagu > 0
              ? ((total_realisasi / pagu) * 100).toFixed(2)
              : '0.00',
          rincian
        })
      })

      //KODE 3
      const byKode3 = this.realisasibelanja.reduce((acc, item) => {
        if (!acc[item.kode3]) acc[item.kode3] = []
        acc[item.kode3].push(item)
        return acc
      }, {})

      Object.entries(byKode3).forEach(([kode3, rows]) => {

        const rincian = []
        const pagu = rows.reduce(
          (a, b) => a + Number(b.pagu || 0),
          0
        )
        const unikIdpp = [...new Set(rows.map(x => x.idpp))]

        unikIdpp.forEach(idpp => {
          const data = summaryIdpp[idpp]
          rincian.push({
            // usulan: data.usulan,
            // pagu: data.pagu,
            // volume: data.volume,
            // harga: data.harga,
            // satuan: data.satuan,
            // koderek108: data.koderek108,
            realisasi_sekarang: data.realisasi_sekarang,
            realisasi_sebelum: data.realisasi_sebelum,
            // total:
            //   data.realisasi_sekarang +
            //   data.realisasi_sebelum,
            // sisa_pagu:
            //   data.pagu -
            //   (
            //     data.realisasi_sekarang +
            //     data.realisasi_sebelum
            //   )
          })
        })
        const realisasi_skg = rincian.reduce(
          (a, b) => a + b.realisasi_sekarang,
          0
        )
        const realisasi_sblm = rincian.reduce(
          (a, b) => a + b.realisasi_sebelum,
          0
        )
        const total_realisasi =
          realisasi_skg + realisasi_sblm
        // rincian.sort((a, b) => {
        //   const kodeA = a.koderek108 || '';
        //   const kodeB = b.koderek108 || '';
        //   return kodeA.localeCompare(kodeB, undefined, { numeric: true, sensitivity: 'base' });
        // })
        belanja_kode.push({
          kode: kode3,
          uraian: rows[0].uraian3,
          pagu,
          realisasi_skg,
          realisasi_sblm,
          total_realisasi,
          selisih: pagu - total_realisasi,
          persen:
            pagu > 0
              ? ((total_realisasi / pagu) * 100).toFixed(2)
              : '0.00',
          rincian
        })
      })

      //KODE 2
      const byKode2 = this.realisasibelanja.reduce((acc, item) => {
        if (!acc[item.kode2]) acc[item.kode2] = []
        acc[item.kode2].push(item)
        return acc
      }, {})

      Object.entries(byKode2).forEach(([kode2, rows]) => {

        const rincian = []
        const pagu = rows.reduce(
          (a, b) => a + Number(b.pagu || 0),
          0
        )
        const unikIdpp = [...new Set(rows.map(x => x.idpp))]

        unikIdpp.forEach(idpp => {
          const data = summaryIdpp[idpp]
          rincian.push({
            // usulan: data.usulan,
            // pagu: data.pagu,
            // volume: data.volume,
            // harga: data.harga,
            // satuan: data.satuan,
            // koderek108: data.koderek108,
            realisasi_sekarang: data.realisasi_sekarang,
            realisasi_sebelum: data.realisasi_sebelum,
            // total:
            //   data.realisasi_sekarang +
            //   data.realisasi_sebelum,
            // sisa_pagu:
            //   data.pagu -
            //   (
            //     data.realisasi_sekarang +
            //     data.realisasi_sebelum
            //   )
          })
        })
        const realisasi_skg = rincian.reduce(
          (a, b) => a + b.realisasi_sekarang,
          0
        )
        const realisasi_sblm = rincian.reduce(
          (a, b) => a + b.realisasi_sebelum,
          0
        )
        const total_realisasi =
          realisasi_skg + realisasi_sblm

        // rincian.sort((a, b) => {
        //   const kodeA = a.koderek108 || '';
        //   const kodeB = b.koderek108 || '';
        //   return kodeA.localeCompare(kodeB, undefined, { numeric: true, sensitivity: 'base' });
        // })
        belanja_kode.push({
          kode: kode2,
          uraian: rows[0].uraian2,
          pagu,
          realisasi_skg,
          realisasi_sblm,
          total_realisasi,
          selisih: pagu - total_realisasi,
          persen:
            pagu > 0
              ? ((total_realisasi / pagu) * 100).toFixed(2)
              : '0.00',
          rincian
        })
      })

      //KODE 1
      const byKode1 = this.realisasibelanja.reduce((acc, item) => {
        if (!acc[item.kode1]) acc[item.kode1] = []
        acc[item.kode1].push(item)
        return acc
      }, {})

      Object.entries(byKode1).forEach(([kode1, rows]) => {
        const rincian = []
        const pagu = rows.reduce(
          (a, b) => a + Number(b.pagu || 0),
          0
        )
        const unikIdpp = [...new Set(rows.map(x => x.idpp))]

        unikIdpp.forEach(idpp => {
          const data = summaryIdpp[idpp]
          rincian.push({
            realisasi_sekarang: data.realisasi_sekarang,
            realisasi_sebelum: data.realisasi_sebelum,

          })
        })
        const realisasi_skg = rincian.reduce(
          (a, b) => a + b.realisasi_sekarang,
          0
        )
        const realisasi_sblm = rincian.reduce(
          (a, b) => a + b.realisasi_sebelum,
          0
        )
        const total_realisasi =
          realisasi_skg + realisasi_sblm
        // rincian.sort((a, b) => {
        //   const kodeA = a.koderek108 || '';
        //   const kodeB = b.koderek108 || '';
        //   return kodeA.localeCompare(kodeB, undefined, { numeric: true, sensitivity: 'base' });
        // })
        belanja_kode.push({
          kode: kode1,
          uraian: rows[0].uraian1,
          pagu,
          realisasi_skg,
          realisasi_sblm,
          total_realisasi,
          selisih: pagu - total_realisasi,
          persen:
            pagu > 0
              ? ((total_realisasi / pagu) * 100).toFixed(2)
              : '0.00',
          rincian
        })
      })

      const sortBelanja = (belanja_kode) =>
        belanja_kode.sort(({ kode: a }, { kode: b }) =>
          a < b ? -1 : a > b ? 1 : 0
        )
      this.items = sortBelanja(belanja_kode)

    },

    dataUnik(x) {
      const unik = Object.values(x.reduce((a, b) => {
        if (!a.includes(b)) {
          a.push(b)
        }
        return a
      })
      )
      return unik
    },
    ambilDataUnik(x, f) {
      // eslint-disable-next-line no-sequences
      const unique = Object.values(x.reduce((a, b) => ((a[f(b)] = b), a), {}))
      return unique
    },
    totalAnggaran(arr) {
      return arr
        .map((x) => x.pagu)
        .reduce((x, y) => parseInt(x) + parseInt(y), 0)
    }

  }
})
