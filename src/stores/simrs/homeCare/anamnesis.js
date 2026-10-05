import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungHomeCareStore } from './pengunjung'
import { notifErr, notifSuccess } from 'src/modules/utils'

export const useAnamnesisHomeCare = defineStore('anamnesis-home-care', {
  state: () => ({
    loadingForm: false,
    loadingHistory: false,

    form: {
      keluhanutama: '',
      riwayatpenyakit: '',
      riwayatpenyakitsekarang: '',
      riwayatalergi: '',
      keteranganalergi: '',
      riwayatpengobatan: '',
      // baru
      riwayatpekerjaan: '',
      riwayatpenyakitkeluarga: '',
      skreeninggizi: 0,
      asupanmakan: 0,
      kondisikhusus: '',
      skor: 0,

      // baru skornyeri
      skornyeri: 0,
      keteranganscorenyeri: 'tidak ada nyeri'
    },

    alergis: ['Obat', 'Makanan', 'Udara', 'Lain-lain', 'Tidak ada Alergi'],
    selection: [],
    historys: [],
    historyMeta: null
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    hitungNilaiSkor () {
      const skorKondKhusus = this.form.kondisikhusus.trim()?.length === 0 ? 0 : 2
      const skor = parseInt(this.form.skreeninggizi) + parseInt(this.form.asupanmakan) + parseInt(skorKondKhusus)
      this.form.skor = skor
    },

    async saveData (pasien) {
      this.loadingForm = true
      this.form.norm = pasien ? pasien.norm : ''
      this.form.noreg = pasien ? pasien.noreg : ''

      if (this.selection?.length) {
        this.form.riwayatalergi = this.selection.join(', ')
      }
      else {
        this.form.riwayatalergi = ''
      }
      this.form.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya = this.form.riwayatpekerjaan

      this.hitungNilaiSkor()

      // console.log(this.form)

      try {
        const resp = await api.post('v1/simrs/pelayanan/simpananamnesis', this.form)
        if (resp.status === 200) {
          // console.log('simpan anamnesis', resp)
          const storePasien = usePengunjungHomeCareStore()
          let isi = resp.data.result
          if (resp.data.result === 1 || !resp.data.result) {
            this.form.rs4 = this.form.keluhanutama
            isi = { ...this.form }
          }
          storePasien.injectDataPasien(pasien, isi, 'anamnesis')
          notifSuccess(resp)
          this.initReset()
          this.loadingForm = false
          return resp
        }

        this.loadingForm = false
        return resp
      }
      catch (error) {
        // console.log('anamnesis err', error)
        this.loadingForm = false
        notifErr(error)
      }
    },

    parseAlergi (raw) {
      if (!raw) return []
      let list = []
      if (Array.isArray(raw)) {
        list = raw
      }
      else if (typeof raw === 'string') {
        const trimmed = raw.trim()
        if (trimmed.startsWith('[') || trimmed.startsWith('"')) {
          try {
            const parsed = JSON.parse(trimmed)
            if (Array.isArray(parsed)) {
              list = parsed
            }
            else if (typeof parsed === 'string') {
              list = parsed.split(',').map(s => s.trim()).filter(Boolean)
            }
          }
          catch (e) {
            list = trimmed.split(',').map(s => s.trim()).filter(Boolean)
          }
        }
        else {
          list = trimmed.split(',').map(s => s.trim()).filter(Boolean)
        }
      }

      return list.map(item => {
        const str = String(item).trim()
        const match = this.alergis.find(a => a.toLowerCase() === str.toLowerCase())
        return match || str
      }).filter(Boolean)
    },

    editForm (val) {
      this.selection = this.parseAlergi(val?.riwayatalergi)
      const rwPekerjaan = val?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya || val?.riwayatpekerjaan || ''

      this.form = {
        id: val.id,
        keluhanutama: val.rs4 || val.keluhanutama || '',
        riwayatpenyakit: val.riwayatpenyakit || '',
        riwayatpenyakitsekarang: val.riwayatpenyakitsekarang || '',
        riwayatalergi: this.selection.join(', '),
        keteranganalergi: val.keteranganalergi || '',
        riwayatpengobatan: val.riwayatpengobatan || '',
        riwayatpekerjaan: rwPekerjaan,
        riwayatpenyakitkeluarga: val.riwayatpenyakitkeluarga || '',
        skreeninggizi: val.skreeninggizi || 0,
        asupanmakan: val.asupanmakan || 0,
        kondisikhusus: val.kondisikhusus || '',
        skor: val.skor || 0,
        skornyeri: isNaN(parseInt(val?.scorenyeri)) ? 0 : parseInt(val?.scorenyeri),
        keteranganscorenyeri: val?.keteranganscorenyeri || 'tidak ada nyeri'
      }
    },
    copyForm (val) {
      this.selection = this.parseAlergi(val?.riwayatalergi)
      const rwPekerjaan = val?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya || val?.riwayatpekerjaan || ''

      this.form = {
        keluhanutama: val.keluhanutama || val.rs4 || '',
        riwayatpenyakit: val.riwayatpenyakit || '',
        riwayatpenyakitsekarang: val.riwayatpenyakitsekarang || '',
        riwayatalergi: this.selection.join(', '),
        keteranganalergi: val.keteranganalergi || '',
        riwayatpengobatan: val.riwayatpengobatan || '',
        riwayatpekerjaan: rwPekerjaan,
        riwayatpenyakitkeluarga: val.riwayatpenyakitkeluarga || '',
        skreeninggizi: val.skreeninggizi || 0,
        asupanmakan: val.asupanmakan || 0,
        kondisikhusus: val.kondisikhusus || '',
        skor: val.skor || 0,
        skornyeri: isNaN(parseInt(val?.scorenyeri)) ? 0 : parseInt(val?.scorenyeri),
        keteranganscorenyeri: val?.keteranganscorenyeri || 'tidak ada nyeri'
      }
    },

    setForm (key, val) {
      this.form[key] = val
    },

    setKeteranganSkornyeri (val) {
      if (val === 0) {
        this.form.keteranganscorenyeri = 'tidak ada nyeri'
      }
      else if (val > 0 && val <= 3) {
        this.form.keteranganscorenyeri = 'nyeri ringan'
      }
      else if (val > 3 && val <= 6) {
        this.form.keteranganscorenyeri = 'nyeri sedang'
      }
      else if (val > 6 && val <= 10) {
        this.form.keteranganscorenyeri = 'nyeri berat'
      }
    },

    async deleteData (pasien, id) {
      const payload = { id }
      try {
        const resp = await api.post('v1/simrs/pelayanan/hapusanamnesis', payload)
        // console.log(resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungHomeCareStore()
          storePasien.hapusDataAnamnesis(pasien, id)
          notifSuccess(resp)
        }
      }
      catch (error) {
        notifErr(error)
      }
    },

    async getHistory (norm) {
      this.loadingHistory = true
      const params = { params: { norm } }
      try {
        const resp = await api.get('v1/simrs/pelayanan/historyanamnesis', params)
        // console.log('history', resp)
        if (resp.status === 200) {
          if (resp.data?.length) {
            const arr = resp.data
            this.historyMeta = null
            this.historys = arr
          }
          else {
            this.historys = []
          }
        }
        this.loadingHistory = false
      }
      catch (error) {
        this.loadingHistory = false
        notifErr(error)
      }
    },
    async nextHistory (cursor) {
      this.loadingHistory = true
      const params = { params: { cursor } }
      try {
        const resp = await api.get('v1/simrs/pelayanan/historyanamnesis', params)
        // console.log('history', resp)
        if (resp.status === 200) {
          if (resp.data?.length) {
            const arr = resp.data
            this.historyMeta = null
            this.historys = arr
          }
          else {
            this.historys = []
          }
        }
        this.loadingHistory = false
      }
      catch (error) {
        this.loadingHistory = false
        notifErr(error)
      }
    },

    pilihHistory (val) {
      this.form = {
        keluhanutama: val.keluhanutama,
        riwayatpenyakit: val.riwayatpenyakit,
        riwayatpenyakitsekarang: val.riwayatpenyakitsekarang,
        riwayatalergi: val.riwayatalergi,
        keteranganalergi: val.keteranganalergi,
        riwayatpengobatan: val.riwayatpengobatan
      }
      const kommatext = val?.riwayatalergi?.split(', ')
      this.selection = kommatext
    },

    initReset () {
      this.form = null
      return new Promise((resolve, reject) => {
        this.form = {
          keluhanutama: '',
          riwayatpenyakit: '',
          riwayatpenyakitsekarang: '',
          riwayatalergi: '',
          keteranganalergi: '',
          riwayatpengobatan: '',
          // baru
          riwayatpekerjaan: '',
          riwayatpenyakitkeluarga: '',
          skreeninggizi: 0,
          asupanmakan: 0,
          kondisikhusus: '',
          skor: 0,

          // baru skornyeri
          skornyeri: 0,
          keteranganskornyeri: 'tidak ada nyeri'
        }
        this.selection = []

        resolve()
      })
    },

    keteranganSkorGizi (nilai) {
      const skor = nilai || 0
      if (skor < 2) {
        return 'tidak beresiko malnutrisi'
      }
      else {
        return 'Beresiko malnutrisi'
      }
    }

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnamnesisHomeCare, import.meta.hot))
}
