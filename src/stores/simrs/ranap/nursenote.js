import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungPoliStore } from 'src/stores/simrs/pelayanan/poli/pengunjung'
import { notifSuccess } from 'src/modules/utils'
import { usePengunjungRanapStore } from './pengunjung'
import { useTindakanRanapStore } from 'src/stores/simrs/ranap/tindakan'

export const useNurseNoteRanapStore = defineStore('nursenote-ranap-store', {
  state: () => ({
    items: [],
    form: {
      // tindakan
      tindakan: null,
      ket: null,

      // implementasi
      dx: null,
      implementasi: null,

      //ttv
      bb: 0,
      tb: 0,
      nadi: 0,
      suhu: 0,
      sis: 0,
      dia: 0,
      rr: 0,
      spo2: 0,
      nyeri: 0,
      skor: 0,
      // tambahan observasi
      cvp: 0,
      icp: 0,
      gcs: 0,
      kejang: 0,

      // ventilator menu
      mode: null,
      fraksio2: 0,
      frek: 0,
      peep: 0,
      pins: 0,
      ratio: 0,

      // intake
      infus: 0,
      pump: 0,
      // injeksi: 0,
      // oral: 0,
      // tetes: 0,
      obat: 0,
      albumin: 0,
      mamin: 0,
      zonde: 0,
      water: 0,

      // output
      urine: 0,
      drain: 0,
      muntah: 0,
      feces: 0,
      iwl: 0,
      pendarahan: 0,
      ufg: 0,
      produksigc: 0,


    },
    tindakans: [],
    loadingSave: false
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    initForm() {
      console.log('initForm');

      const tindakanStore = useTindakanRanapStore()
      this.tindakans = tindakanStore.listTindakan
      // console.log('tindakanStore', tindakanStore.listTindakan);

      for (const key in this.form) {
        this.form[key] = 0
      }

      this.form.tindakan = null
      this.form.ket = null
      this.form.dx = null
      this.form.implementasi = null
      this.form.mode = null

    },

    simpanData(pasien) {
      this.loadingSave = true
      this.form.noreg = pasien?.noreg || null
      this.form.norm = pasien?.norm || null
      this.form.kdruang = pasien?.kdruangan || null

      // console.log('this.form', this.form);

      return new Promise((resolve, reject) => {
        api.post('/v1/simrs/ranap/layanan/nursenote/simpan', this.form)
          .then((res) => {
            console.log('res', res);

            this.loadingSave = false
            this.items.unshift(res?.data?.result)
            notifSuccess('Simpan Data Berhasil')
            resolve(res)
          })
          .catch((err) => {
            this.loadingSave = false
            reject(err) || console.log(err)
          })
      })
    },


    async getData(pasien) {

      const params = {
        params: {
          noreg: pasien?.noreg
        }
      }
      try {
        const resp = await api.get('v1/simrs/ranap/layanan/nursenote/list', params)
        console.log('resp nursenote list', resp)
        if (resp.status === 200) {
          this.items = resp.data
        }
      } catch (error) {
        console.log('error', error);

      }

    }

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNurseNoteRanapStore, import.meta.hot))
}
