import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifErr, notifSuccess } from 'src/modules/utils'
import { usePengunjungHomeCareStore } from './pengunjung'

export const usePemeriksaanFisikHomeCare = defineStore('pemeriksaan-fisik-home-care', {
  state: () => ({
    loadingForm: false,
    edited: false,
    editId: null,
    selectStatusPsikologi: [],

    keadaanUmums: ['Baik', 'Sedang', 'Lemah', 'Jelek'],

    optionsTingkatkesadaran: [
      { label: 'Compos Mentis (15)', value: 15 },
      { label: 'Apatis (12-14)', value: 13 },
      { label: 'Somnolen (10-11)', value: 10 },
      { label: 'Delirium (9-7)', value: 8 },
      { label: 'Stupor (4-6)', value: 5 },
      { label: 'Coma (3)', value: 3 }
    ],

    formVital: {
      keadaan_umum: 'Baik',
      tingkatkesadaran: 15,
      kesadaran: 'Compos Mentis',
      kesadarane: 4,
      kesadaranv: 5,
      kesadaranm: 6,
      denyutjantung: '',
      pernapasan: '',
      sistole: '',
      diastole: '',
      suhutubuh: '',
      tinggibadan: '',
      beratbadan: '',
      vas: 0,
      skornyeri: 0,
      keteranganskornyeri: 'tidak ada nyeri',
      statuspsikologis: '',
      sosialekonomi: '',
      spiritual: '',
      statusneurologis: '',
      muakuloskeletal: ''
    }
  }),

  actions: {
    setNumber (val, key) {
      const num = val.toString().replace(/[^0-9.]/g, '')
      this.formVital[key] = num
    },

    setKeteranganSkornyeri (val) {
      if (val === 0) {
        this.formVital.keteranganskornyeri = 'tidak ada nyeri'
      } else if (val > 0 && val <= 3) {
        this.formVital.keteranganskornyeri = 'nyeri ringan'
      } else if (val > 3 && val <= 6) {
        this.formVital.keteranganskornyeri = 'nyeri sedang'
      } else if (val > 6 && val <= 10) {
        this.formVital.keteranganskornyeri = 'nyeri berat'
      }
    },

    setTingkatKesadaran (val) {
      if (val === 3) {
        this.formVital.kesadaran = 'Coma'
      } else if (val > 3 && val <= 6) {
        this.formVital.kesadaran = 'Stupor'
      } else if (val > 6 && val <= 9) {
        this.formVital.kesadaran = 'Delirium'
      } else if (val > 9 && val <= 11) {
        this.formVital.kesadaran = 'Somnolen'
      } else if (val > 11 && val <= 14) {
        this.formVital.kesadaran = 'Apatis'
      } else if (val >= 15) {
        this.formVital.kesadaran = 'Compos Mentis'
      }
    },

    sumKesadaran () {
      const e = parseInt(this.formVital.kesadarane) || 0
      const v = parseInt(this.formVital.kesadaranv) || 0
      const m = parseInt(this.formVital.kesadaranm) || 0
      const total = e + v + m
      this.formVital.tingkatkesadaran = total
      this.setTingkatKesadaran(total)
    },

    initReset () {
      this.edited = false
      this.editId = null
      this.selectStatusPsikologi = []
      this.formVital = {
        keadaan_umum: 'Baik',
        tingkatkesadaran: 15,
        kesadaran: 'Compos Mentis',
        kesadarane: 4,
        kesadaranv: 5,
        kesadaranm: 6,
        denyutjantung: '',
        pernapasan: '',
        sistole: '',
        diastole: '',
        suhutubuh: '',
        tinggibadan: '',
        beratbadan: '',
        vas: 0,
        skornyeri: 0,
        keteranganskornyeri: 'tidak ada nyeri',
        statuspsikologis: '',
        sosialekonomi: '',
        spiritual: '',
        statusneurologis: '',
        muakuloskeletal: ''
      }
    },

    setEdit (item) {
      this.edited = true
      this.editId = item.id
      this.formVital.keadaan_umum = item.keadaan_umum || 'Baik'
      this.formVital.tingkatkesadaran = item.tingkatkesadaran || 15
      this.formVital.kesadaran = item.kesadaran || 'Compos Mentis'
      this.formVital.kesadarane = item.kesadarane || 4
      this.formVital.kesadaranv = item.kesadaranv || 5
      this.formVital.kesadaranm = item.kesadaranm || 6
      this.formVital.denyutjantung = item.rs4 || ''
      this.formVital.pernapasan = item.pernapasan || ''
      this.formVital.sistole = item.sistole || ''
      this.formVital.diastole = item.diastole || ''
      this.formVital.suhutubuh = item.suhutubuh || ''
      this.formVital.tinggibadan = item.tinggibadan || ''
      this.formVital.beratbadan = item.beratbadan || ''
      this.formVital.vas = item.vas || 0
      this.formVital.skornyeri = item.scorenyeri || 0
      this.formVital.keteranganskornyeri = item.keteranganscorenyeri || 'tidak ada nyeri'
      this.formVital.statuspsikologis = item.statuspsikologis || ''
      this.formVital.sosialekonomi = item.sosialekonomi || ''
      this.formVital.spiritual = item.spiritual || ''
      this.formVital.statusneurologis = item.statusneurologis || ''
      this.formVital.muakuloskeletal = item.muakuloskeletal || ''

      if (item.statuspsikologis) {
        this.selectStatusPsikologi = item.statuspsikologis.split(',').map(s => s.trim())
      } else {
        this.selectStatusPsikologi = []
      }
    },

    async saveData (pasien) {
      this.loadingForm = true

      if (this.selectStatusPsikologi.length) {
        this.formVital.statuspsikologis = this.selectStatusPsikologi.join(', ')
      }

      const form = {
        ...this.formVital,
        keteranganskorenyeri: this.formVital.keteranganskornyeri,
        norm: pasien?.norm,
        noreg: pasien?.noreg,
        details: [],
        deleteDetails: []
      }

      if (this.edited && this.editId) {
        form.id = this.editId
      }

      try {
        const resp = await api.post('v1/simrs/pelayanan/simpanpemeriksaanfisik', form)
        if (resp.status === 200) {
          const storePasien = usePengunjungHomeCareStore()
          const isi = resp.data.result
          storePasien.injectDataPasien(pasien, isi, 'pemeriksaanfisik')
          notifSuccess(resp)
          this.initReset()
          this.loadingForm = false
          return resp
        }
        this.loadingForm = false
      } catch (error) {
        this.loadingForm = false
        notifErr(error?.response)
      }
    },

    async deleteData (pasien, id) {
      const payload = { id }
      try {
        const resp = await api.post('v1/simrs/pelayanan/hapuspemeriksaanfisik', payload)
        if (resp.status === 200) {
          const storePasien = usePengunjungHomeCareStore()
          storePasien.hapusDataPemeriksaanfisik(pasien, id)
          if (this.editId === id) {
            this.initReset()
          }
          notifSuccess(resp)
        }
      } catch (error) {
        notifErr(error?.response)
      }
    }
  }
})
