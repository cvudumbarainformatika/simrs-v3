import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungPoliStore } from './pengunjung'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import { usePengunjungRanapStore } from '../../ranap/pengunjung'
import { useListPasienHemodialisaStore } from '../../hemodialisa/hemodialisa'
// import { dateDbFormat } from 'src/modules/formatter'

export const useRadiologiPoli = defineStore('poli-radiologi', {
  state: () => ({
    namaPemeriksaans: [],
    jenisPemeriksaans: [],
    notas: [],
    form: {
      noreg: '', // rs1
      nota: '', // rs2
      // rs3:'', //tgl
      permintaan: '', // rs4
      keterangan: '', // rs7
      kodepoli: '', // rs10
      kd_ruang: '', // rs13
      tpemeriksaan: '', // rs15
      cito: 'Tidak',
      diagnosakerja: '',
      catatanpermintaan: '',
      metodepenyampaianhasil: 'Penyerahan langsung (digital/cetak foto)',
      statusalergipasien: 'Tidak',
      statuskehamilan: 'Tidak',
      kodedokter: null
    },
    loadingSave: false,
    dokters: []
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {
    async getRadiologi () {
      const resp = await api.get('v1/simrs/penunjang/radiologi/listpermintaanradiologirinci')
      // console.log('master radiologi', resp)
      if (resp.status === 200) {
        this.namaPemeriksaans = resp.data
      }
    },
    async getJenisRadiologi () {
      const resp = await api.get('v1/simrs/penunjang/radiologi/jenispermintaanradiologi')
      // console.log('jenis radiologi', resp)
      if (resp.status === 200) {
        this.jenisPemeriksaans = resp.data
      }
    },
    setForm (key, value) {
      this.form[key] = value
    },
    async saveRadiologi (pasien, isRanap) {
      if (!pasien?.kodedokter) {
        return notifErrVue('kode Dokter masih kosong, silahkan tutup dulu pasien ini kemudian tekan tombol refresh di pojok kanan atas')
      }
      this.loadingSave = true
      this.form.keterangan = this.form.diagnosakerja + ' ' + this.form.catatanpermintaan
      this.form.noreg = pasien?.noreg
      this.form.kodedokter = isRanap ? this.form.kodedokter : pasien?.kodedokter
      this.form.kodesistembayar = pasien?.kodesistembayar
      this.form.kodepoli = pasien?.kodepoli
      this.form.kdgroup_ruangan = pasien?.kdgroup_ruangan
      this.form.nota = (this.form.nota === 'BARU' || this.form.nota === 'SEMUA') ? '' : this.form.nota

      this.form.isRanap = isRanap
      // console.log('form rad', this.form)
      try {
        const resp = await api.post('v1/simrs/penunjang/radiologi/simpanpermintaanradiologi', this.form)
        // console.log('save', resp)
        if (resp.status === 200) {
          const storePasien = usePengunjungPoliStore()
          const storeRanap = usePengunjungRanapStore()
          const storeHD = useListPasienHemodialisaStore()
          const isi = resp?.data?.result
          storePasien.injectDataPasien(pasien, isi, 'radiologi')
          storeRanap.injectDataPasien(pasien?.noreg, isi, 'radiologi')
          storeHD.injectDataPasien(pasien?.noreg, isi, 'radiologi')
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
          this.loadingSave = false
          this.initReset()
        }
        this.loadingSave = false
      }
      catch (error) {
        // console.log(error)
        this.loadingSave = false
      }
    },
    async getNota (pasien, isRanap) {
      const params = { params: { noreg: pasien?.noreg, isRanap } }
      const resp = await api.get('v1/simrs/penunjang/radiologi/getnota', params)
      // console.log('nota rad', resp)
      if (resp.status === 200) {
        this.setNotas(resp.data)
      }
    },
    async getData (pasien, isRanap) {
      const params = { params: { noreg: pasien?.noreg, isRanap } }
      const resp = await api.get('v1/simrs/penunjang/radiologi/getdata', params)
      // console.log('nota rad', resp)
      if (resp.status === 200) {
        // this.setNotas(resp.data)
        const data = resp.data
        for (let i = 0; i < data?.length; i++) {
          const isi = data[i]

          const storeRanap = usePengunjungRanapStore()
          storeRanap.injectDataPasien(pasien?.noreg, isi, 'radiologi')
          const storeHD = useListPasienHemodialisaStore()
          storeHD.injectDataPasien(pasien?.noreg, isi, 'radiologi')
        }
      }
    },
    setNotas (array) {
      const arr = array.map(x => x.nota)
      this.notas = arr?.length ? arr : []
      this.notas.push('BARU')
      this.form.nota = this.notas[0]
    },

    async hapusRadiologi (pasien, id) {
      const payload = { noreg: pasien?.noreg, id }
      try {
        const resp = await api.post('v1/simrs/penunjang/radiologi/hapusradiologi', payload)
        if (resp.status === 200) {
          const storePasien = usePengunjungPoliStore()
          const storeRanap = usePengunjungRanapStore()
          const storeHD = useListPasienHemodialisaStore()
          storePasien.hapusDataRadiologi(pasien, id)
          storeRanap.hapusDataInjectan(pasien, id, 'radiologi')
          storeHD.hapusDataInjectan(pasien, id, 'radiologi')
          this.setNotas(resp?.data?.nota)
          notifSuccess(resp)
        }
      }
      catch (error) {
        // console.log('hpus rad', error)
      }
    },

    initReset () {
      this.form = {
        noreg: '', // rs1
        nota: this.notas?.length ? this.notas[0] : 'BARU', // rs2
        // rs3:'', //tgl
        permintaan: '', // rs4
        keterangan: '', // rs7
        kodepoli: '', // rs10
        kd_ruang: '', // rs13
        tpemeriksaan: '', // rs15
        cito: 'Tidak',
        diagnosakerja: '',
        catatanpermintaan: '',
        kodedokter: '',
        metodepenyampaianhasil: 'Penyerahan langsung (digital/cetak foto)',
        statusalergipasien: 'Tidak',
        statuskehamilan: 'Tidak'
      }

      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})
