import { acceptHMRUpdate, defineStore } from "pinia"
import { useListPasienHemodialisaStore } from "./hemodialisa"
import { date } from "quasar"

export const usePengkajianHemodialisaStore = defineStore('pengkajian-hemodialisa', {
  state: () => ({

    loading: false,
    pengunjung: useListPasienHemodialisaStore(),
    form: {
      noreg: null,
      norm: null,
      tgl: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
      alasan: '',
      riwayat: '',
      hubungan: 'Baik',
      psikologis: 'Tenang',
      lain: '', // jika psikologis = Lain-lain
      td: '',
      nadi: '',
      suhu: '',
      tb: '',
      bb: '',
      penurunanBB: 'Tidak ada Penurunan Berat Badan',
      asupanNafsu: 'Ya',
      diagKhus: 'Ya',
      fungsional: 'Mandiri',
      lainx: '', // jika fungsional = Perlu Bantuan
    },
    yatis: ['Ya', 'Tidak'],
    hubungans: ['Baik', 'Tidak Baik'],
    psikologis: ['Tenang', 'Cemas', 'Takut', 'Marah', 'Kecenderungan Bunuh Diri', 'Lain-lain'],
    penurunanBeratBadans: ['Tidak ada Penurunan Berat Badan', 'Tidak Yakin / Tidak Tahu / Terasa Baju Longgar', 'Ya, Turun 1-5 kg', 'Ya, Turun 6-10 kg', 'Ya, Turun 11-15 kg', 'Ya, > 15 kg'],
    statusFungs: ['Mandiri', 'Perlu Bantuan']
  }),
  actions: {
    initPasien () {
      this.setForm('noreg', this.pengunjung?.pasien?.noreg)
      this.setForm('norm', this.pengunjung?.pasien?.norm)
    },
    setForm (key, val) {
      this.form[key] = val
    },
    resetForm () {
      this.form = {
        noreg: null,
        norm: null,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'),
        alasan: '',
        riwayat: '',
        hubungan: 'Baik',
        psikologis: 'Tenang',
        lain: '', // jika psikologis = Lain-lain
        td: '',
        nadi: '',
        suhu: '',
        tb: '',
        bb: '',
        penurunanBB: 'Tidak ada Penurunan Berat Badan',
        asupanNafsu: 'Ya',
        diagKhus: 'Ya',
        fungsional: 'Mandiri',
        lainx: '', // jika fungsional = Perlu Bantuan
      }
    },
    simpan () { }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePengkajianHemodialisaStore, import.meta.hot))
}
