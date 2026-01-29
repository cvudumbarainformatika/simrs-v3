import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"
import { toRaw } from "vue"
import { usePermintaanOperasistore } from "./permintaanoperasi"
import { date } from "quasar"

export const useLaporanOperasiStore = defineStore('laporan_operasi_store', {
  state: () => ({
    loading: false,
    pasien: null,
    params: {
      q: '',
      page: 1,
      per_page: 10
    },
    tarif: [],
    form: {},
    formTindakan: {}
  }),
  actions: {
    setForm (key, val) {
      this.form[key] = val
    },
    resetForm () {
      console.log('reset Form')
    },
    setFormTindakan (key, val) {
      this.formTindakan[key] = val
    },
    resetFormTindakan () {
      console.log('reset Form tindakan')
      let kelas = null

      if (this.pasien.rs10 == 'POL014') kelas = 'IRD'
      else if (this.pasien.rs10.includes('POL') && !this.pasien.rs10 == 'POL014') kelas = 'poli'
      else kelas = this.pasien.ruangranap?.rs3

      this.setFormTindakan('tanggal', date.formatDate(Date.now(), 'YYYY-MM-DD'))
      this.setFormTindakan('noreg', this.pasien?.noreg)
      this.setFormTindakan('nota', this.pasien?.rs2)
      this.setFormTindakan('rs14', this.pasien?.rs14)
      this.setFormTindakan('rs9', this.pasien?.rs11)
      this.setFormTindakan('rs15', this.pasien?.rs13)
      this.setFormTindakan('rs16', kelas)
      this.setFormTindakan('tanpaAnas', false)
      this.setFormTindakan('cito', false)
      this.setFormTindakan('kode', '')
      this.setFormTindakan('tarif', 0)
      this.setFormTindakan('an', 0)
      this.setFormTindakan('js', 0)
      this.setFormTindakan('jp', 0)
      this.setFormTindakan('subtotal', 0)
      this.setFormTindakan('jumlah', 1)
      this.setFormTindakan('sisbaysplit', '')
      this.setFormTindakan('total_split', 0)
    },
    getTarifOp (val) {
      const param = {
        params: {
          q: val
        }
      }
      return new Promise(resolve => {
        api.get('v1/simrs/penunjang/ok/tindakan-op/get-tindakan-op', param)
          .then(({ data }) => {
            this.tarif = data?.data ?? data
            console.log('tarif', this.tarif)
            resolve(data)
          })
      })

    },
    simpanLaporan (pasien) {
      this.loading = true
      const pengunjung = usePermintaanOperasistore()
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/tindakan-op/simpan-laporan', this.form)
          .then(resp => {
            this.loading = false
            console.log('simpan', resp?.data)
            // this.form = resp?.data?.data
            // pengunjung.injectDataPasien(pasien, resp?.data?.data, 'tindakanop')
            // notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    simpanFormTindakan () {
      this.loading = true
      // const pengunjung = usePermintaanOperasistore()
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/tindakan-op/simpan', this.formTindakan)
          .then(resp => {
            this.loading = false
            const data = resp?.data?.data
            console.log('simpan', data, this.pasien)
            this.pasien.tindakanop = data
            // this.form = resp?.data?.data
            // pengunjung.injectDataPasien(this.pasien, data, 'tindakanop')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    hapusTindakanOp (data) {
      this.loading = true
      const form = {
        id: data?.id,
        noreg: data?.rs1,
        nota: data?.rs2,
      }
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/ok/tindakan-op/hapus', form)
          .then(resp => {
            this.loading = false
            const data = resp?.data?.data
            console.log('s hapus', data, this.pasien)
            this.pasien.tindakanop = null
            // this.hapusDariPengunjung(data, 'tindakanop')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    },
    hapusDariPengunjung (data, kode) {
      // const pengunjung = usePermintaanOperasistore()
      // const pasien = pengunjung.items.find(x => x.noreg === data.noreg)
      const pasien = this.pasien
      const tipe = typeof pasien[kode]
      console.log('hapus', pasien, tipe, data)

      if (tipe === 'object') {
        pasien[kode] = null
      } else {
        const target = pasien[kode]?.find(x => x.id === val.id)
        if (target) {
          target = null
        }
        else {
          const index = pasien[kode]?.findIndex(x => x.id === val.id)
          pasien[kode].splice(index, 1)
        }
      }

    }
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanOperasiStore, import.meta.hot))
}
