import { defineStore } from "pinia";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { formInputNpdlsStore } from "./formnpdls";

export const dataBastFarmasiStore = defineStore('data_Bast_Farmasi_Store', {
  state: () => ({
    loading: false,
    reqs: {
      q: '',
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      kodepenerima: null,
      kodekegiatanblud: null,
      kodebast: null,
      rincianbast: null,
      nonpdls: null
    },
    bastfarmasis: [],
    konsinyasis: [],

    itembelanja: []
  }),
  actions: {
    getDataBast() {
      this.selectbastFarmasi()
    },
    onRequest(props) {
      // console.log('props', props)
      this.reqs.page = props?.pagination?.page ?? 1
      this.reqs.rowsPerPage = props?.pagination?.rowsPerPage ?? 10
      this.getDataBast()
    },
    refreshTable() {
      this.reqs.page = 1
      this.getDataBast()
    },
    goToPage(val) {
      this.reqs.page = val
      this.getDataBast()
    },
    selectbastFarmasi() {
      this.loading = true
      const params = { params: this.reqs }
      // console.log('parameter', params)
      return new Promise((resolve) => {
        api.get('/v1/transaksi/belanja_ls/bastfarmasi', params)
          .then((resp) => {
            if (resp.status === 200) {
              // console.log('BAST', resp.data)
              this.bastfarmasis = []
              this.konsinyasis = []
              this.bastfarmasis = resp.data.penerimaan
              // console.log('bast penerimaan', this.bastfarmasis)
              this.konsinyasis = resp.data.konsinyasi
              // console.log('konsinyasi', this.konsinyasis)
              this.reqs.rowsNumber = resp.data.total
              this.filterRekening50(resp.data)

              const sve = formInputNpdlsStore()
              this.reqs.nonpdls = sve.form.nonpdls
              const carinopenerimaan = this.itembelanja.map((x) => x.nopenerimaan)
              sve.paramsrinci.nopenerimaan = carinopenerimaan
              // const sve = formInputNpdlsStore()
              // this.reqs.nonpdls = sve.form.nonpdls
              // const carinopenerimaan = this.itembelanja.map((x) => x.nopenerimaan)
              // sve.paramsrinci.nopenerimaan = carinopenerimaan
              // sve.listrincians()

              this.loading = false
              resolve(resp.data)
            }
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    filterRekening50() {
      if (this.bastfarmasis.length !== 0) {
        const dataPagu = []
        for (let i = 0; i < this.bastfarmasis.length; i++) {
          const el = this.bastfarmasis[i].rincianbast
          const master = el.length
            ? el.map((x) => {
              return {
                nopenerimaan: x.nopenerimaan,
                rek50: x.masterobat.pagu.koderek50,
                uraian50: x.masterobat.pagu.uraian50,
                itembelanja: x.masterobat.pagu.usulan,
                rek108: x.masterobat.pagu.koderek108,
                item: x.masterobat.pagu.usulan,
                harga: parseFloat(x.masterobat.pagu.harga),
                satuan: x.masterobat.pagu.satuan,
                volume: parseFloat(x.masterobat.pagu.volume),
                pagu: parseFloat(x.masterobat.pagu.pagu),
                id_bast: x.masterobat.pagu.idpp,
                bast_r_id: x.id,
                nobast: x.nobast,
                hargabast: parseFloat(x.harga_net),
                volumebast: parseFloat(x.jumlah),
                subtotal: parseFloat(x.subtotal),
                nominalpembayaran: parseFloat(x.subtotal),
                realisasi: parseFloat(x.masterobat?.pagu?.realisasi?.map(x => parseFloat(x.nominalpembayaran))?.reduce((a, b) => a + b, 0)) +
                  parseFloat(x.masterobat?.pagu?.realisasi_spjpanjar?.map(x => parseFloat(x.jumlahbelanjapanjar))?.reduce((a, b) => a + b, 0)) -
                  parseFloat(x.masterobat?.pagu?.contrapost?.map(x => parseFloat(x.nominalcontrapost))?.reduce((a, b) => a + b, 0)),
              }
            })
            : []
          dataPagu.push(...master)
        }
        // this.rekening50 = dataPagu

        const uniknotrans = dataPagu.map((s) => s.nopenerimaan)
        const unik = uniknotrans.length ? [...new Set(uniknotrans)] : []

        // ITEM UNTUK FARMASI
        const arr = []
        for (let i = 0; i < unik.length; i++) {
          const el = unik[i]
          const data = dataPagu.filter((z) => z.nopenerimaan === el).map((x) => x)
          // console.log('dataxxx BAST', data)
          const unik108 = data.map((x) => x.rek108)
          const uniks = unik108.length ? [...new Set(unik108)] : []
          const arr108 = []
          for (let z = 0; z < uniks.length; z++) {
            const els = uniks[z];
            const un = data
            const objx = {
              bast_r_id: un.filter((z) => z.rek108 === els)[0]?.bast_r_id,
              nobast: un.filter((z) => z.rek108 === els)[0]?.nobast,
              koderek50: un.filter((z) => z.rek108 === els)[0]?.rek50,
              rincianbelanja: un.filter((z) => z.rek108 === els)[0]?.uraian50,
              idserahterima_rinci: un.filter((z) => z.rek108 === els)[0]?.id_bast,
              nopenerimaan: un.filter((z) => z.rek108 === els)[0]?.nopenerimaan,
              itembelanja: un.filter((z) => z.rek108 === els)[0]?.itembelanja,
              koderek108: un.filter((z) => z.rek108 === els)[0]?.rek108,
              uraian108: un.filter((z) => z.rek108 === els)[0]?.item,
              harga: parseFloat(un.filter((z) => z.rek108 === els)[0]?.harga),
              satuan: un.filter((z) => z.rek108 === els)[0]?.satuan,
              volume: parseFloat(un.filter((z) => z.rek108 === els)[0]?.volume),
              total: parseFloat(un.filter((z) => z.rek108 === els)[0]?.pagu),
              // hargabast: dataPagu.filter((z) => z.rek108 === el).map((x) => x.hargabast)[i] * dataPagu.filter((z) => z.rek108 === el).map((x) => x.volumebast)[i],
              hargals: parseFloat(un.filter((z) => z.rek108 === els).map((x) => x.subtotal).reduce((a, b) => a + b, 0)),
              volumels: 1,
              totalls: parseFloat(un.filter((z) => z.rek108 === els).map((x) => x.subtotal).reduce((a, b) => a + b, 0)),
              nominalpembayaran: parseFloat(un.filter((z) => z.rek108 === els).map((x) => x.nominalpembayaran).reduce((a, b) => a + b, 0)),
              realisasi: parseFloat(un.filter((z) => z.rek108 === els)[0]?.realisasi),
              sisapagu: parseFloat(un.filter((z) => z.rek108 === els)[0]?.pagu) - parseFloat(un.filter((z) => z.rek108 === els)[0]?.realisasi),
            }
            arr108.push(objx)
          }
          arr.push(...arr108)
        }
        this.itembelanja = arr
        // console.log('DATA PENERIMAAN', this.itembelanja)
      }
      else {
        const kons = []
        for (let i = 0; i < this.konsinyasis.length; i++) {
          const el = this.konsinyasis[i].rinci
          const elx = this.konsinyasis[i]
          const master = el.length
            ? el.map((x) => {
              return {
                nopenerimaan: x.notranskonsi,
                rek50: x.obat.pagu.koderek50,
                uraian50: x.obat.pagu.uraian50,
                itembelanja: x.obat.pagu.usulan,
                rek108: x.obat.pagu.koderek108,
                item: x.obat.pagu.usulan,
                harga: parseFloat(x.obat.pagu.harga),
                satuan: x.obat.pagu.satuan,
                volume: parseFloat(x.obat.pagu.volume),
                pagu: parseFloat(x.obat.pagu.pagu),
                id_bast: x.obat.pagu.idpp,
                bast_r_id: x.id,
                nobast: elx.nobast,
                hargabast: parseFloat(x.harga_net),
                volumebast: parseFloat(x.jumlah),
                subtotal: parseFloat(x.subtotal),
                nominalpembayaran: parseFloat(x.subtotal),
                realisasi: parseFloat(x.obat?.pagu?.realisasi?.map(x => parseFloat(x.nominalpembayaran))?.reduce((a, b) => a + b, 0)) +
                  parseFloat(x.obat?.pagu?.realisasi_spjpanjar?.map(x => parseFloat(x.jumlahbelanjapanjar))?.reduce((a, b) => a + b, 0)) -
                  parseFloat(x.obat?.pagu?.contrapost?.map(x => parseFloat(x.nominalcontrapost))?.reduce((a, b) => a + b, 0)),
              }
            })
            : []
          kons.push(...master)
        }
        // this.rekening50 = kons

        const uniknot = kons.map((s) => s.nopenerimaan)
        const unik = uniknot.length ? [...new Set(uniknot)] : []
        const arrkons = []
        for (let i = 0; i < unik.length; i++) {
          const el = unik[i]
          const datakons = kons.filter((z) => z.nopenerimaan === el).map((x) => x)
          const unik108 = datakons.map((x) => x.rek108)
          const uniks = unik108.length ? [...new Set(unik108)] : []
          const arr108 = []
          for (let r = 0; r < uniks.length; r++) {
            const el = uniks[r];
            const kons = datakons
            const objkons = {
              bast_r_id: kons.filter((z) => z.rek108 === el)[0]?.bast_r_id,
              nobast: kons.filter((z) => z.rek108 === el)[0]?.nobast,
              koderek50: kons.filter((z) => z.rek108 === el)[0]?.rek50,
              rincianbelanja: kons.filter((z) => z.rek108 === el)[0]?.uraian50,
              idserahterima_rinci: kons.filter((z) => z.rek108 === el)[0]?.id_bast,
              nopenerimaan: kons.filter((z) => z.rek108 === el)[0]?.nopenerimaan,
              itembelanja: kons.filter((z) => z.rek108 === el)[0]?.itembelanja,
              koderek108: kons.filter((z) => z.rek108 === el)[0]?.rek108,
              uraian108: kons.filter((z) => z.rek108 === el)[0]?.item,
              harga: parseFloat(kons.filter((z) => z.rek108 === el)[0]?.harga),
              satuan: kons.filter((z) => z.rek108 === el)[0]?.satuan,
              volume: parseFloat(kons.filter((z) => z.rek108 === el)[0]?.volume),
              total: parseFloat(kons.filter((z) => z.rek108 === el)[0]?.pagu),
              // hargabast: dataPagu.filter((z) => z.rek108 === el).map((x) => x.hargabast)[i] * dataPagu.filter((z) => z.rek108 === el).map((x) => x.volumebast)[i],
              hargals: parseFloat(kons.filter((z) => z.rek108 === el).map((x) => x.subtotal).reduce((a, b) => a + b, 0)),
              volumels: 1,
              totalls: parseFloat(kons.filter((z) => z.rek108 === el).map((x) => x.subtotal).reduce((a, b) => a + b, 0)),
              nominalpembayaran: parseFloat(kons.filter((z) => z.rek108 === el).map((x) => x.nominalpembayaran).reduce((a, b) => a + b, 0)),
              realisasi: parseFloat(kons.filter((z) => z.rek108 === el)[0]?.realisasi),
              sisapagu: parseFloat(kons.filter((z) => z.rek108 === el)[0]?.pagu) - parseFloat(kons.filter((z) => z.rek108 === el)[0]?.realisasi),

            }
            arr108.push(objkons)
          }
          arrkons.push(...arr108)
        }
        this.itembelanja = arrkons
        // console.log('DATA KONSINYASI', this.itembelanja)
      }
      // console.log('DATA BAST ALL', this.itembelanja)
    }
  }

})
