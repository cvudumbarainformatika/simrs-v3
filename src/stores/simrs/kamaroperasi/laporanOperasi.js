import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/utils"
import { toRaw } from "vue"
import { usePermintaanOperasistore } from "./permintaanoperasi"

export const useLaporanOperasiStore = defineStore('laporan_operasi_store', {
  state: () => ({
    loading: false,
    pasien: null,
    params: {
      q: '',
      page: 1,
      per_page: 10
    },
  }),
  actions: {
    setForm (key, val) {
      this.form[key] = val
    },
    resetForm () {
      console.log('reset Form')
      // const id = this.form.id
      // const surgical = this.pasien?.surgical?.find(x => x.nota === this.pasien.rs2)
      // if (!surgical) {
      //   this.setForm('signIn', structuredClone(toRaw(this.signIn)))
      //   this.setForm('signOut', structuredClone(toRaw(this.signOut)))
      //   this.setForm('timeOut', structuredClone(toRaw(this.timeOut)))
      //   this.setForm('dokter_anastesi', null)
      //   this.setForm('dokter_operator', null)
      //   this.setForm('penata_anastesi', null)
      //   this.setForm('perawat_instrumen', null)
      //   this.setForm('perawat_sirkuler', null)
      //   this.setForm('asisten_1', null)
      //   this.setForm('asisten_2', null)
      //   this.setForm('id', null)
      //   this.setForm('nota', this.pasien.rs2)
      //   this.setForm('noreg', this.pasien.noreg)
      // } else if (surgical) {
      //   this.form = surgical

      // }
    },
    async getNakes () {
      try {
        const { data } = await api.get('v1/simrs/penunjang/surgical/get-nakes')
        this.nakes = data?.data ?? data
        // console.log('nakes', this.nakes)

      } catch (e) {

      }
    },
    simpan (pasien) {
      this.loading = true
      const pengunjung = usePermintaanOperasistore()
      return new Promise(resolve => {
        api.post('v1/simrs/penunjang/surgical/simpan', this.form)
          .then(resp => {
            this.loading = false
            console.log('simpan', resp?.data)
            this.form = resp?.data?.data
            pengunjung.injectDataPasien(pasien, resp?.data?.data, 'surgical')
            notifSuccess(resp)
            resolve(resp)
          })
          .catch(() => { this.loading = false })
      })
    }
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanOperasiStore, import.meta.hot))
}
