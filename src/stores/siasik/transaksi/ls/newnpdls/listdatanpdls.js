import { defineStore } from "pinia"
import { date } from "quasar"
import { api } from "src/boot/axios"

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
    listdatanpd() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api.get('/v1/transaksi/belanja_ls/listnpdls', params)
          .then((resp) => {
            if (resp.status === 200) {
              // console.log('data NPD', resp)
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
      if (this.listnpdls.length) {
        const sas = []
        for (let i = 0; i < this.listnpdls.length; i++) {
          const arr = this.listnpdls[i]
          // console.log('rincianqqq', arr)
          const head = {
            nonpk: arr.nonpk,
            nonpdls: arr.nonpdls,
            tglnpdls: arr.tglnpdls,
            bidang: arr.bidang,
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
            bast: arr.bast,
            serahterimapekerjaan: arr.serahterimapekerjaan,
            tglcair: arr.npkrinci?.header?.tglpindahbuku,
            total: arr.npdlsrinci?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0),
            rincian: arr.npdlsrinci,
            pajak: arr.pajak,
            totalpajak: parseFloat(arr.pajak?.ppnpusat) + parseFloat(arr.pajak?.pph21) + parseFloat(arr.pajak?.pph22) + parseFloat(arr.pajak?.pph23) + parseFloat(arr.pajak?.pph25) + parseFloat(arr.pajak?.pajakdaerah) + parseFloat(arr.pajak?.pasal4),
            totalbayar: (arr.npdlsrinci?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0)) - (parseFloat(arr.pajak?.ppnpusat) + parseFloat(arr.pajak?.pph21) + parseFloat(arr.pajak?.pph22) + parseFloat(arr.pajak?.pph23) + parseFloat(arr.pajak?.pph25) + parseFloat(arr.pajak?.pajakdaerah) + parseFloat(arr.pajak?.pasal4))
          }

          sas.push(head)
        }
        this.datanpd = sas

      }
    },
  }
})
