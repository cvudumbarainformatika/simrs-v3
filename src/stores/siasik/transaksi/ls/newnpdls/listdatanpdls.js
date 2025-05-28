import { defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"
import { notifErr, notifSuccess } from "src/modules/utils"

export const listDataNpdlsStore = defineStore('list_data_npdls', {
  state: () => ({
    loading: false,
    disabled: false,
    dialogEditNpd: false,
    dialogPrintPencairan: false,
    dialogCetakNpd: false,
    openDialogFarmasi: false,
    openDialogSiasik: false,
    openDialogRinci: false,
    params: {
      q: '',
      tahun: date.formatDate(Date.now(), 'YYYY'),
      page: 1,
    },
    display: {
      sekarang: date.formatDate(Date.now(), 'DD MMMM YYYY')
    },
    listnpdls: [],
    datanpd: [],

    npddatasave: [],
    editnpd: [],
    listrinci: []
  }),
  actions: {
    goToPage(val) {
      this.params.page = val
      this.listdatanpd()
    },
    listdatanpd() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api.get('/v1/transaksi/belanja_ls/listnpdls', params)
          .then((resp) => {
            if (resp.status === 200) {
              console.log('data NPD', resp)
              this.loading = false
              this.listnpdls = resp.data
              this.rincianNpd()
              resolve(resp.data)
            }
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
    rincianNpd() {
      if (this.listnpdls?.length) {
        const sas = []
        for (let i = 0; i < this.listnpdls?.length; i++) {
          const arr = this.listnpdls[i]
          // console.log('rincianqqq', arr)
          const head = {
            nonpk: arr.nonpk,
            nonpdls: arr.nonpdls,
            tglnpdls: arr.tglnpdls,
            bidang: arr.bidang,
            kodebidang: arr.kodebidang,
            pptk: arr.pptk,
            kodepptk: arr.kodepptk,
            kegiatanblud: arr.kegiatanblud,
            kodekegiatanblud: arr.kodekegiatanblud,
            penerima: arr.penerima,
            kodepenerima: arr.kodepenerima,
            biayatransfer: arr.biayatransfer,
            bank: arr.bank,
            rekening: arr.rekening,
            npwp: arr.npwp,
            keterangan: arr.keterangan,
            nopencairan: arr.nopencairan,
            nopenerimaan: arr.nopenerimaan,
            nonotadinas: arr.nonotadinas,
            bast: arr.bast,
            kunci: arr.kunci,
            serahterimapekerjaan: arr.serahterimapekerjaan,
            tglcair: arr.npkrinci?.header?.tglpindahbuku,
            total: arr.npdlsrinci?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0),
            rincian: arr.npdlsrinci,
            pajak: arr.pajak,
            newpajak: arr.newpajak,
            totalpajak: (arr.newpajak.map((x) => parseFloat(x.nilai)).reduce((a, b) => a + b, 0)) + parseFloat(arr.pajak?.ppnpusat) + parseFloat(arr.pajak?.pph21) + parseFloat(arr.pajak?.pph22) + parseFloat(arr.pajak?.pph23) + parseFloat(arr.pajak?.pph25) + parseFloat(arr.pajak?.pajakdaerah) + parseFloat(arr.pajak?.pasal4),
            totalbayar: (arr.npdlsrinci?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0)) - (parseFloat(arr.pajak?.ppnpusat) + parseFloat(arr.pajak?.pph21) + parseFloat(arr.pajak?.pph22) + parseFloat(arr.pajak?.pph23) + parseFloat(arr.pajak?.pph25) + parseFloat(arr.pajak?.pajakdaerah) + parseFloat(arr.pajak?.pasal4))
          }

          sas.push(head)
        }
        this.datanpd = sas

      }
    },
    kunciData(row) {
      console.log('KUNCI', row)
      this.loading = true;
      return new Promise((resolve) => {
        api.post('/v1/transaksi/belanja_ls/kuncinpd', row)
          .then((resp) => {
            console.log('resp', resp)
            this.loading = false
            notifSuccess(resp)
            resolve(resp)
          })
          .catch((err) => {
            console.error(err)
            this.loading = false
          });
      });
    }

  }
})
