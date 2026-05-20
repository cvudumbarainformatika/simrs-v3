import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungIgdStore } from './pengunjung'
import { notifErr, notifErrVue, notifSuccess } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'

export const useVisumStore = defineStore('visum-store', {
  state: () => ({
    loadingForm: false,
    loadingHistory: false,
    tab: 'Visum',
    tabs: [
      { name: 'Visum Penganiayaan', page: 'VisumPenganiayaan' },
      { name: 'Visum Pemerkosaan', page: 'VisumPemerkosaan' },
      { name: 'Visum Jenazah', page: 'VisumJenazah' }
    ],
    form: {
      nomor: ''
    }
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    hitungNilaiSkor() {
      const skorKondKhusus = this.form.skorkondisikhusus
      const skor = parseInt(this.form.skreeninggizi) + parseInt(this.form.asupanmakan) + parseInt(skorKondKhusus)
      this.form.skor = skor
    },
  }
})
