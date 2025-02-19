import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
// import { usePengunjungRanapStore } from './pengunjung'
// eslint-disable-next-line no-unused-vars
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { usePengunjungIgdStore } from './pengunjung'

export const useKonsulIgdStore = defineStore('konsul-igd-store', {
  state: () => ({
    form: {
      kddokterkonsul: null,
      kduntuk: '1',
      ketuntuk: 'Konsultasikan tindakan masalah medik saat ini',
      permintaan: null
    },
    dokters: [],
    perawats: [],

    untuks: [
      { value: '1', label: 'Konsultasikan tindakan masalah medik saat ini' }
      // { value: '2', label: 'Perawatan Bersama untuk selanjutnya' },
      // { value: '3', label: 'Alih rawat kasus untuk selanjutnya' }
    ],

    loadingOrder: false,
    loadingHapus: false

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    async saveData(pasien) {
      if (!pasien?.kodedokter) {
        return notifErrVue('kode Dokter masih kosong, silahkan tutup dulu pasien ini kemudian tekan tombol refresh di pojok kanan atas')
      }
      this.loadingOrder = true

      this.form.noreg = pasien?.noreg
      this.form.norm = pasien?.norm
      this.form.kodepoli = pasien?.kodepoli
      this.form.kodesistembayar = pasien?.kodesistembayar
      this.form.kdgroup_ruangan = pasien?.kdgroup_ruangan
      this.form.kelas_ruangan = pasien?.kelas_ruangan

      const storeIgd = usePengunjungIgdStore()
      storeIgd.injectDataPasien(pasien?.noreg, this.form, 'konsultasi')

      try {
        const resp = await api.post('v1/simrs/konsuldokter/igd/simpandata', this.form)
        if (resp.status === 200) {
          // storeIgd.deleteInjectanNull2(pasien?.noreg, 'konsultasi')
          const isi = resp?.data?.result[0]
          // console.log('isi', isi)
          storeIgd.injectDataPasien(pasien, isi, 'konsultasi')
          notifSuccess(resp)
          this.loadingOrder = false
          this.initReset()
        }
        this.loadingOrder = false
      }
      catch (error) {
        this.loadingOrder = false
      }
    },

    async hapusPermintaan(pasien, id, kddokterkonsul) {
      // console.log('sasa', pasien)
      this.loadingHapus = true

      if (!id) {
        return notifErrVue('Tidak dapat dihapus')
      }

      const payload = { noreg: pasien?.noreg, id, kddokterkonsul }
      try {
        const resp = await api.post('v1/simrs/konsuldokter/igd/hapusdata', payload)
        this.loadingHapus = false
        // console.log(resp)
        if (resp.status === 200) {
          // const storePasien = usePengunjungPoliStore()
          const storeRanap = usePengunjungIgdStore()
          // storePasien.hapusDataFisio(pasien, id)
          storeRanap.hapusDataInjectan(pasien, id, 'konsultasi')
          notifSuccess(resp)
        }
      }
      catch (error) {
        this.loadingHapus = false
        // console.log(error)
      }
    },

    initReset() {
      this.form = {
        dokterkonsul: null,
        kduntuk: '1',
        ketuntuk: 'Konsultasikan tindakan masalah medik saat ini',
        permintaan: 'Atas pasien ini dengan kondisi ' + '\n'
      }

      const pengunjung = usePengunjungIgdStore()
      // console.log('aaaaa', pengunjung)
      this.dokters = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      this.perawats = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []

      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})
