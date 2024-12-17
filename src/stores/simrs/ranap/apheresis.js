import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
 
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const usePermintaanApheresisStore = defineStore('permintaan-apheresis-store', {
  state: () => ({
    notas: [],
    form: {
      noreg: '',
      nota: null,
      tindakan: '',
      js: 0,
      jp: 0,
      gol: '',
      jumlah: 1,
      transfusike: 0,
      reaksi: '',
      keterangan: '',
      perawatyanmeminta: '',
      kodeperawat: ''
    },
    dokters: [],
    perawats: [],
    loadingOrder: false,
    loadingHapus: false,

    optionsApheresis: []

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    async getMaster () {
      try {
        const resp = await api.get('v1/simrs/penunjang/apheresis/getmaster')
        // console.log('master apheresis', resp)

        if (resp.status === 200) {
          const data = resp.data
          this.optionsApheresis = data
        }
      }
      catch (error) {

      }
    },

    async saveOrder (pasien) {
      if (!pasien?.kodedokter) {
        return notifErrVue('kode Dokter masih kosong, silahkan tutup dulu pasien ini kemudian tekan tombol refresh di pojok kanan atas')
      }
      this.loadingOrder = true
      this.form.noreg = pasien?.noreg
      this.form.norm = pasien?.norm
      this.form.kodepoli = pasien?.kodepoli
      this.form.kodedokter = pasien?.kodedokter
      this.form.namadokterdpjp = pasien?.dokter
      this.form.kodesistembayar = pasien?.kodesistembayar
      this.form.kdgroup_ruangan = pasien?.kdgroup_ruangan
      this.form.nota = (this.form.nota === 'BARU' || this.form.nota === 'SEMUA' || this.form.nota === '' || this.form.nota === null) ? null : this.form.nota
      // this.form.isRanap = isRanap

      console.log(this.form)

      try {
        const resp = await api.post('v1/simrs/penunjang/apheresis/simpanpermintaan', this.form)
        // console.log('save permintaan apheresis', resp.data)
        if (resp.status === 200) {
          // const storePasien = usePengunjungPoliStore()
          const storeRanap = usePengunjungRanapStore()
          const isi = resp?.data?.result
          // storePasien.injectDataPasien(pasien, isi, 'fisio')
          storeRanap.injectDataPasien(pasien?.noreg, isi, 'apheresis')
          this.setNotas(resp?.data?.nota)
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

    async getNota (pasien) {
      const payload = { params: { noreg: pasien?.noreg } }
      const resp = await api.get('v1/simrs/penunjang/apheresis/getnota', payload)
      // console.log('nota fisio', resp.data)
      if (resp.status === 200) {
        this.setNotas(resp?.data)
      }
    },

    setNotas (array) {
      const arr = array.map(x => x.nota)
      this.notas = arr.length ? arr : []
      this.notas.push('BARU')
      // this.notas.unshift('SEMUA')
      this.form.nota = this.notas[0]
    },

    async hapusPermintaan (pasien, id) {
      this.loadingHapus = true
      const payload = { noreg: pasien?.noreg, id }
      try {
        const resp = await api.post('v1/simrs/penunjang/apheresis/hapuspermintaan', payload)
        this.loadingHapus = false
        // console.log(resp)
        if (resp.status === 200) {
          // const storePasien = usePengunjungPoliStore()
          const storeRanap = usePengunjungRanapStore()
          // storePasien.hapusDataFisio(pasien, id)
          storeRanap.hapusDataInjectan(pasien, id, 'apheresis')
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
        }
      }
      catch (error) {
        this.loadingHapus = false
        // console.log(error)
      }
    },

    initReset () {
      this.form = {
        noreg: '',
        nota: null,
        tindakan: '',
        js: 0,
        jp: 0,
        gol: '',
        jumlah: 1,
        transfusike: 0,
        reaksi: '',
        keterangan: '',
        perawatyanmeminta: '',
        kodeperawat: ''
      }

      const pengunjung = usePengunjungRanapStore()
      this.dokters = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      this.perawats = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []

      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})