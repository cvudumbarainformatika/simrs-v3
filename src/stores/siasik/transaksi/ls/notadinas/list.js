import { defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"
import { notifErr, notifSuccess } from "src/modules/utils"

export const listdataNotadinasStore = defineStore('list_data_notadinas', {
  state: () => ({
    loading: false,
    disabled: false,
    dialogCetak: false,
    dialogCetakSptj: false,
    dialogCetakPernyataan: false,
    dialogLembarverif: false,
    openDialogRinci: false,
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      page: 1,
    },
    display: {
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    listdata: [],
    datanotadinas: [],
    cetaknotadinas: [],

    editdata: [],
    listrinci: [],

    datattd: []
  }),
  actions: {
    goToPage(val) {
      this.params.page = val
      this.listData()
    },
    listData() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api.get('/v1/transaksi/notadinas/listdata', params)
          .then((resp) => {
            if (resp.status === 200) {
              // console.log('data Nota Dinas', resp.data)
              this.loading = false
              this.listdata = resp.data
              this.rincianNotadinas()
              resolve(resp.data)
            }
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    rincianNotadinas() {
      if (this.listdata?.length) {
        const sas = []
        for (let i = 0; i < this.listdata?.length; i++) {
          const arr = this.listdata[i]
          // console.log('rincianqqq', arr)
          const head = {
            id: arr.id,
            nonotadinas: arr.nonotadinas,
            nosptjm: arr.nosptjm,
            noverifikasi: arr.noverifikasi,
            tglnotadinas: arr.tglnotadinas,
            kodepptk: arr.kodepptk,
            namapptk: arr.namapptk,
            kodebidang: arr.kodebidang,
            bidang: arr.bidang,
            kegiatan: arr.kegiatan,
            kodekegiatan: arr.kodekegiatan,
            nonpk: arr.nonpk,
            total: arr.rincians?.map((x) => parseFloat(x.total)).reduce((a, b) => a + b, 0),
            tglentry: arr.tglentry,
            userentry: arr.userentry,
            kunci: arr.kunci,
            terima: arr.terima,
            rincians: arr.rincians,
          }

          sas.push(head)
        }
        this.datanotadinas = sas

      }
    },
    kunciData(row) {
      // console.log('KUNCI', row)
      this.loading = true;
      return new Promise((resolve) => {
        api.post('/v1/transaksi/notadinas/kuncidata', row)
          .then((resp) => {
            // console.log('resp', resp)
            this.loading = false
            notifSuccess(resp)
            resolve(resp)
          })
          .catch((err) => {
            console.error(err)
            this.loading = false
          });
      });
    },

    ttd() {
      this.loading = true
      // const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api.get('/v1/siasik/ttd/ttdpengesahan')
          .then((resp) => {
            if (resp.status === 200) {
              console.log('TTD', resp.data)
              this.datattd = resp.data
              this.loading = false

              resolve(resp.data)
            }
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },

  }
})
