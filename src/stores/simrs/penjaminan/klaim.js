import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifErrVue } from "src/modules/utils"

export const useKlaimPenjaminanStore = defineStore('klaim-penjaminan', {
  state: () => ({
    loading: false,
    items: [],
    meta: {},
    params: {
      q: '',
      page: 1,
      per_page: 10,
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear(),
      pelayanan: 1
    }
  }),
  actions: {
    setParams(key, val) {
      this.params[key] = val
    },
    async getData() {
      this.loading = true
      const params = { params: this.params }
      await api.get('v1/simrs/penjaminan/klaim/getdataklaim', params)
        .then(resp => {
          // console.log('kunjungan igd', resp?.data?.data)
          this.loading = false
          this.pasiens = resp?.data?.data
          this.items = resp?.data?.data
          this.meta = resp?.data
        })
        .catch(() => { this.loading = false })
    },
    async setTerima(pasien) {
      this.loadingTerima = true
      const form = { noreg: pasien?.noreg, kdruang: pasien?.kdruangan }
      this.noreg = pasien?.noreg
      try {
        const resp = await api.post('v1/simrs/penjaminan/klaim/terimapasien', form)
        // console.log('terima', resp)
        if (resp.status === 200) {
          const findPasien = this.items.filter(x => x?.rs1 === pasien?.noreg)
          if (findPasien?.length) {
            // findPasien[0].status = findPasien[0].status === '' ? '2' : findPasien[0].status

            // BARU
            findPasien[0].triage = resp?.data?.triage
            findPasien[0].anamnesis = resp?.data?.anamnesis
            findPasien[0].penilaiananamnesis = resp?.data?.penilaiananamnesis
            findPasien[0].datasimpeg = resp?.data?.datasimpeg
            findPasien[0].diagnosa = resp?.data?.diagnosa
            findPasien[0].permintaanperawatanjenazah = resp?.data?.permintaanperawatanjenazah
            findPasien[0].historyperkawinan = resp?.data?.historyperkawinan
            findPasien[0].historykehamilan = resp?.data?.historykehamilan
            findPasien[0].anamnesekebidanan = resp?.data?.anamnesekebidanan
            findPasien[0].fisio = resp?.data?.fisio
            findPasien[0].diagnosakeperawatan = resp?.data?.diagnosakeperawatan
            findPasien[0].laborats = resp?.data?.laborats
            findPasien[0].newapotekrajal = resp?.data?.newapotekrajal
            findPasien[0].ok = resp?.data?.ok
            findPasien[0].diagnosakebidanan = resp?.data?.diagnosakebidanan
            findPasien[0].penunjanglain = resp?.data?.penunjanglain
            findPasien[0].ambulan = resp?.data?.ambulan
            findPasien[0].radiologi = resp?.data?.radiologi
            findPasien[0].bankdarah = resp?.data?.bankdarah
            findPasien[0].planheder = resp?.data?.planheder
            findPasien[0].tindakan = resp?.data?.tindakan
            findPasien[0].laboratold = resp?.data?.laboratold
            findPasien[0].pemeriksaanfisikpsikologidll = resp?.data?.pemeriksaanfisikpsikologidll
            findPasien[0].konsultasi = resp?.data?.konsuldokterspesialis
            findPasien[0].tinjauanulang = resp?.data?.tinjauanulang
            findPasien[0].skalatransfer = resp?.data?.skalatransfer
            findPasien[0].pemberianobat = resp?.data?.pemberianobat
            findPasien[0].rencanaterapidokter = resp?.data?.rencanaterapidokter
            findPasien[0].dokumenluar = resp?.data?.dokumenluar
            // BARU
            // findPasien[0].laporantindakan = resp?.data?.laporantindakan
            // findPasien[0].psikiatri = resp?.data?.psikiatri
            // findPasien[0].neonatusmedis = resp?.data?.neonatusmedis
            // findPasien[0].neonatuskeperawatan = resp?.data?.neonatuskeperawatan
            // findPasien[0].pediatri = resp?.data?.pediatri
            // findPasien[0].kandungan = resp?.data?.kandungan
            // findPasien[0].dokumenluar = resp?.data?.dokumenluar
          }
          this.loadingTerima = false
          // console.log('load2', this.loadingTerima)
          this.noreg = null
        }
      }
      catch (error) {
        console.log(error)
        this.loadingTerima = false
        this.noreg = null
        this.notifikasiError('Maaf.. Harap ulangi, Ada Kesalahan ')
      }
    },
    notifikasiError(msg) {
      notifErrVue(msg)
    }
  }
})
