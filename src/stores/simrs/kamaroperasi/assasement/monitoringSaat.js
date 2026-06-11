import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"

export const useMonitoringSaatStore = defineStore('monitoring_saat', {
  state: () => ({
    loading: false,
    inputForm: {},
    data: [
      // {
      //   time: 0, td_sistolik: 100, td_diastolik: 81, nadi: 95, resp: 17,
      //   mulai_op: 20, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [],
      //   o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 5, td_sistolik: 120, td_diastolik: 80, nadi: 105, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [{ nama: 'Paracetamol', dosis: '2 mg', cara_masuk: 'IV' }],
      //   cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 10, td_sistolik: 110, td_diastolik: 75, nadi: null, resp: 18,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 15, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [{ nama: 'Normal Saline', volume: '100 ml' }],
      //   o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 20, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [{ nama: 'Propopol', dosis: '5 mg', cara_masuk: 'IV' }],
      //   cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 25, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: 20, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 30, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 35, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: 20, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [], o2: 2, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 40, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [{ nama: 'Paracetamol', dosis: '2 mg', cara_masuk: 'IV' }],
      //   cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 45, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: 20, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // },
      // {
      //   time: 50, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
      //   mulai_op: null, selesai_op: 20, eno_oro: null, x_ana: null, ass_resep: null, cn_resp: null, sp_resp: null,
      //   obat: [], cairan: [{ nama: 'Normal Saline', volume: '100 ml' }],
      //   o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
      // }
    ],
    inputFormPasca: {
      jam_masuk: '',
      keadaan_umum: []
    },
    loadingPasca: false,
    dataPasca: [],
    // aldrete
    loadingAldrete: false,
    aldreteLogs: [
      // { waktu: '13:50', oksigenasi: 2, aktifitas: 2, pernafasan: 2, sirkulasi: 2, kesadaran: 0, total: 8 }
    ],
    formKeluar: {
      jam_masuk: '',
      jam_keluar: '',
      td_sistolik: '',
      td_diastolik: '',
      nadi: '',
      rr: '',
      infus: '',
      urine: '',
      muntah: '',
      dipindah_ke: '',
      ruangan: '',
      penata_anestesi: '',
      dokter_anestesi: ''
    },
    kamars: []

  }),
  actions: {
    // ---- selama anast ---- //
    updateMasuk (evt, key) {
      const input = !isNaN(parseFloat(evt)) ? (parseFloat(evt) < 0 ? 0 : parseFloat(evt)) : 0
      this.inputForm[key] = input
      const kristaloid = this.inputForm.kristaloid ?? 0
      const koloid = this.inputForm.koloid ?? 0
      const transfusi = this.inputForm.transfusi ?? 0
      this.inputForm.jumlah_tr = kristaloid + koloid + transfusi

    },
    updateKeluar (evt, key) {
      const input = !isNaN(parseFloat(evt)) ? (parseFloat(evt) < 0 ? 0 : parseFloat(evt)) : 0
      this.inputForm[key] = input
      const pendarahan = this.inputForm.pendarahan ?? 0
      const urine = this.inputForm.urine ?? 0
      const lain = this.inputForm.lain ?? 0
      this.inputForm.jumlah_kel = pendarahan + urine + lain
    },
    async getMonitoringSelama (pasien) {
      try {
        const param = {
          params: {
            noreg: pasien.noreg,
            nota: pasien.rs2,
            norm: pasien.norm
          }
        }

        const resp = await api.get('v1/simrs/penunjang/ok/monitoring/selama/get', param)
        // console.log('get monitoring', resp?.data)
        this.data = resp?.data?.monitoring
        this.inputForm = resp?.data?.medikasi
        if (!resp?.data?.medikasi) this.inputForm = {
          noreg: pasien.noreg,
          nota: pasien.rs2,
          norm: pasien.norm
        }
        this.data.sort((a, b) => a.time - b.time)
        return resp?.data
      } catch (e) {
        // console.log('err', e)
      }
    },
    async simpanLogMonitoringSelama (pasien, anu) {
      this.loading = true
      const payload = { ...anu }
      payload.noreg = pasien.noreg
      payload.nota = pasien.rs2
      payload.norm = pasien.norm
      try {
        const resp = await api.post('v1/simrs/penunjang/ok/monitoring/selama/simpan', payload)
        // console.log('simpan monitoring', resp?.data)
        const hasil = resp?.data?.data
        if (hasil) {
          const index = this.data.findIndex(x => x.id === hasil.id)
          if (index >= 0) this.data[index] = hasil
          else this.data.push(hasil)
          this.data.sort((a, b) => a.time - b.time)
        }
        // console.log('data', this.data)

        return resp?.data
      } catch (e) {
        throw e
      }
      finally {
        this.loading = false
      }

    },
    async simpanBawahMonitoringSelama () {
      this.loading = true
      try {
        const resp = await api.post('v1/simrs/penunjang/ok/monitoring/selama/simpan-medikasi', this.inputForm)

        return resp?.data
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    // ---- selama anast end ---- //
    // ---- pasca anast  ---- //
    // Tambahkan di actions store
    async getMonitoringPasca (pasien) {
      const param = { params: { noreg: pasien.noreg, nota: pasien.rs2, norm: pasien.norm } }
      const resp = await api.get('v1/simrs/penunjang/ok/monitoring/pasca/get', param)
      this.dataPasca = resp?.data?.monitoring // Simpan di state terpisah
      this.inputFormPasca = resp?.data?.medikasi
      if (!resp?.data?.medikasi) this.inputFormPasca = {
        noreg: pasien.noreg,
        nota: pasien.rs2,
        norm: pasien.norm
      }
      this.dataPasca.sort((a, b) => a.time - b.time)
      return resp?.data
    },

    async simpanLogPasca (pasien, anu) {
      const payload = { ...anu }
      payload.noreg = pasien.noreg
      payload.nota = pasien.rs2
      payload.norm = pasien.norm
      const resp = await api.post('v1/simrs/penunjang/ok/monitoring/pasca/simpan', payload)
      // Update local state...
      const hasil = resp?.data?.data
      if (hasil) {
        const index = this.dataPasca.findIndex(x => x.id === hasil.id)
        if (index >= 0) this.dataPasca[index] = hasil
        else this.dataPasca.push(hasil)
        this.dataPasca.sort((a, b) => a.time - b.time)
      }
      return resp?.data
    },
    async simpanMedikasiPasca () {
      try {
        const resp = await api.post('v1/simrs/penunjang/ok/monitoring/pasca/simpan-medikasi', this.inputFormPasca)
        return resp?.data
      } catch (e) { }
    },
    // ---- pasca anast end ---- //
    // ---- Aldrete start ---- //
    async getKamars () {
      try {
        const resp = await api.get('v1/simrs/master/kamar')
        this.kamars = resp?.data
        this.kamars.sort((a, b) => a.rs4 - b.rs4)
        // console.log('kamar', this.kamars)

        return resp?.data
      } catch (e) { }
    },
    async getSkolrAldrete (pasien) {
      this.loadingAldrete = true
      const param = { params: { noreg: pasien.noreg, nota: pasien.rs2, norm: pasien.norm } }
      const resp = await api.get('v1/simrs/penunjang/ok/monitoring/aldrete/get', param)
      this.aldreteLogs = resp?.data?.monitoring // Simpan di state terpisah
      this.formKeluar = resp?.data?.medikasi
      if (!resp?.data?.medikasi) this.formKeluar = {
        noreg: pasien.noreg,
        nota: pasien.rs2,
        norm: pasien.norm
      }
      this.aldreteLogs.sort((a, b) => a.waktu.localeCompare(b.waktu))
      this.loadingAldrete = false
      return resp?.data
    },
    async simpanSkorAldrete (payload) {
      this.loadingAldrete = true
      try {
        const resp = await api.post('v1/simrs/penunjang/ok/monitoring/aldrete/simpan', payload)
        // Update local state...
        const hasil = resp?.data?.data
        if (hasil) {
          const index = this.aldreteLogs.findIndex(x => x.id === hasil.id)
          if (index >= 0) this.aldreteLogs[index] = hasil
          else this.aldreteLogs.push(hasil)
          this.aldreteLogs.sort((a, b) => a.waktu.localeCompare(b.waktu))
        }
        return resp?.data

      } catch (e) {
        throw e
      }
      finally {
        this.loadingAldrete = false
      }
    },
    async hapusSkorAldrete (payload) {
      this.loadingAldrete = true
      try {
        const resp = await api.post('v1/simrs/penunjang/ok/monitoring/aldrete/hapus', payload)
        // Update local state...
        const hasil = resp?.data?.data
        if (hasil) {
          const index = this.aldreteLogs.findIndex(x => x.id === hasil.id)
          if (index >= 0) this.aldreteLogs.splice(index, 1)
          // else this.aldreteLogs.push(hasil)
          this.aldreteLogs.sort((a, b) => a.waktu.localeCompare(b.waktu))
        }
        return resp?.data
      } catch (e) {
        throw e
      }
      finally {
        this.loadingAldrete = false
      }
    },
    async simpanFormKeluar () {
      this.loadingAldrete = true
      try {
        const resp = await api.post('v1/simrs/penunjang/ok/monitoring/aldrete/simpan-keluar', this.formKeluar)
        return resp?.data
      } catch (e) {
        throw e
      } finally {
        this.loadingAldrete = false
      }
    }
    // ---- Aldrete end ---- //
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMonitoringSaatStore, import.meta.hot))
}
