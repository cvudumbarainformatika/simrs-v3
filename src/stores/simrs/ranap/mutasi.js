import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
// eslint-disable-next-line no-unused-vars
import { notifErrVue, notifSuccess, notifSuccessVue } from 'src/modules/utils'
import { dateDbFormat } from 'src/modules/formatter'

export const useMutasiRanapStore = defineStore('mutasi-ranap-store', {
  state: () => ({
    ruanganAsal: null,
    taripRuanganAsal: null,
    ruangans: [],
    kamars: [],
    beds: [],
    alasans: [],
    historys: [],
    loadingForm: false,

    form: {
      ruanganTujuan: null,
      kamar: null,
      noBed: null,
      kd_mutasi: null,
      titipan: false,
      ruanganTitipan: null,

      // document serah terima
      derajatPasien: null,
      skalaNyeri: null,
      tensi: null,
      sistole: null,
      diastole: null,
      nadi: null,
      suhu: null,
      rr: null,
      spo2: null,
      terapis: [],
      plann: null,
      ro: null,
      lab: null,
      ecg: null,
      lainlain: null,
      kelengkapan: null
    },
    isEditted: null,
    selectRuangan: null,
    terapi: {
      obat: null,
      dosis: null,
      jamMasuk: null,
      sisa: null,
      ket: null
    },

  }),
  getters: {
    tarip: (state) => ((state?.taripRuanganAsal?.pelayanan || 0) + (state?.taripRuanganAsal?.sarana || 0)) || 0
  },
  actions: {
    async getMasterAlasanMutasi() {


      try {

        const resp = await api.get('v1/simrs/master/alasanmutasi')

        const data = resp?.data || []
        if (data) {
          this.alasans = data
        }
        // console.log('resp alasan', resp);
      } catch (error) {
        console.log(error);

      }
    },
    async getData(pasien) {

      const params = {
        params: {
          noreg: pasien?.noreg
        }
      }

      // try {

      //   const resp = await api.get('v1/simrs/ranap/ruangan/ruanganranap', params)

      //   const data = resp?.data || null
      //   if (data) {
      //     this.ruanganAsal = data?.ruangan[0] || null
      //     this.taripRuanganAsal = data?.tarif[0] || null
      //   }
      //   // console.log('resp', resp);
      // } catch (error) {
      //   console.log(error);

      // }

      return new Promise((resolve, reject) => {
        api.get('v1/simrs/ranap/ruangan/ruanganranap', params)
          .then(resp => {
            const data = resp?.data || null
            if (data) {
              this.ruanganAsal = data?.ruangan[0] || null
              this.taripRuanganAsal = data?.tarif[0] || null
            }
            // console.log('resp', resp);
            resolve(resp)
          })
          .catch(error => {
            console.log(error);
            reject(error)
          })
      })
    },
    async getHistory(pasien) {

      const params = {
        params: {
          noreg: pasien?.noreg
        }
      }

      try {

        const resp = await api.get('v1/simrs/ranap/ruangan/historymutasi', params)


        // console.log('resp', resp);
        this.historys = resp?.data || []
      } catch (error) {
        console.log(error);

      }
    },
    async getKamar() {


      try {

        const resp = await api.get('v1/simrs/master/kamar')

        // console.log('resp list kamar', resp);
        this.ruangans = resp?.data || []

      } catch (error) {
        console.log(error);

      }
    },
    async showKamar(nama) {
      const params = {
        params: {
          nama
        }
      }
      // try {

      //   const resp = await api.get('v1/simrs/master/showkamar', params)

      //   // console.log('resp list list kamar', resp);
      //   this.kamars = resp?.data || []

      // } catch (error) {
      //   console.log(error);

      // }

      return new Promise((resolve, reject) => {
        api.get('v1/simrs/master/showkamar', params)
          .then(resp => {
            // console.log('resp list list kamar', resp);
            this.kamars = resp?.data || []
            resolve(resp)
          })
          .catch(err => {
            console.log(err);
            reject(err)
          })
      })
    },
    showBed(nama, namax) {
      const params = {
        params: {
          nama,
          namax
        }
      }
      // try {

      //   const resp = await api.get('v1/simrs/master/showBed', params)

      //   // console.log('resp list list Beds', resp);
      //   this.beds = resp?.data || []

      // } catch (error) {
      //   console.log(error);

      // }

      return new Promise((resolve, reject) => {
        api.get('v1/simrs/master/showBed', params)
          .then(resp => {
            // console.log('resp list list Beds', resp);
            this.beds = resp?.data || []
            resolve(resp)
          })
          .catch(err => {
            console.log(err);
            reject(err)
          })
      })
    },

    addTerapi() {
      this.form.terapis.push(this.terapi)
      this.terapi = {
        obat: null,
        dosis: null,
        jamMasuk: null,
        sisa: null,
        ket: null
      }
    },


    async simpanMutasi(pasien) {
      this.loadingForm = true
      // this.error = null

      // console.log('pasien', pasien, this.ruanganAsal);


      try {
        // ambil value dari form
        const noreg = pasien?.noreg
        const norm = pasien?.norm
        const tanggal = dateDbFormat(new Date())
        const nama = pasien?.nama
        const ruanglm = pasien?.kdruangan
        const kd_kelas = pasien?.kelas_ruangan
        const kamarlm = this.ruanganAsal?.kd_kmr
        const bedlm = this.ruanganAsal?.no_bed
        // const hargalm = pasien.hargalm.value
        // const biaya_dokter1 = pasien.biaya_dokter1.value

        const kd_mutasi = this.form.kd_mutasi
        const titipan = this.form.titipan
        const ruang = this.form.ruanganTujuan
        const kamar = this.form.kamar
        const nobed = this.form.noBed
        const ruanganTitipan = this.form.ruanganTitipan
        // const biaya_kamar = pasien.biaya_kamar.value
        // const biaya_dokter2 = pasien.biaya_dokter2.value




        const payload = {
          noreg,
          norm,
          tanggal,
          nama,
          ruanglm,
          kamarlm,
          bedlm,
          // hargalm,
          // biaya_dokter1,
          kd_kelas,
          kd_mutasi,
          titipan,
          ruanganTitipan,
          ruang,
          kamar,
          nobed,
          // biaya_kamar,
          // biaya_dokter2,
          // editable,

          derajatPasien: this.form.derajatPasien,
          skalaNyeri: this.form.skalaNyeri,
          tensi: this.form.tensi,
          sistole: this.form.sistole,
          diastole: this.form.diastole,
          nadi: this.form.nadi,
          suhu: this.form.suhu,
          rr: this.form.rr,
          spo2: this.form.spo2,
          terapis: this.form.terapis,
          plann: this.form.plann,
          ro: this.form.ro,
          lab: this.form.lab,
          ecg: this.form.ecg,
          lainlain: this.form.lainlain,
          kelengkapan: this.form.kelengkapan

        }


        // konfirmasi


        // kirim ke server (pakai axios)
        // const response = await api.post('v1/simrs/ranap/ruangan/simpanmutasi', payload)

        // notifSuccess('Data berhasil disimpan')
        // this.getHistory(pasien)

        // this.initForm()

        return new Promise((resolve, reject) => {
          api.post('v1/simrs/ranap/ruangan/simpanmutasi', payload)
            .then(resp => {
              notifSuccess('Data berhasil disimpan')
              this.getHistory(pasien)
              this.initForm()
              this.loadingForm = false
              resolve(resp)
            })
            .catch(err => {
              notifErrVue(err?.response?.data?.message)
              this.loadingForm = false
              reject(err)
            })
        })



      } catch (err) {
        this.error = err
        console.error(err)
      } finally {
        this.loadingForm = false
      }
    },
    async updateDokumen(pasien) {
      this.loadingForm = true
      // this.error = null

      // console.log('pasien', pasien, this.ruanganAsal);


      try {

        const dataId = this.historys?.find(el => el?.id === this.isEditted)?.serah_terima?.id
        const payload = {

          derajatPasien: this.form.derajatPasien,
          skalaNyeri: this.form.skalaNyeri,
          tensi: this.form.tensi,
          sistole: this.form.sistole,
          diastole: this.form.diastole,
          nadi: this.form.nadi,
          suhu: this.form.suhu,
          rr: this.form.rr,
          spo2: this.form.spo2,
          terapis: this.form.terapis,
          plann: this.form.plann,
          ro: this.form.ro,
          lab: this.form.lab,
          ecg: this.form.ecg,
          lainlain: this.form.lainlain,
          kelengkapan: this.form.kelengkapan,

          id: dataId,
          sistole_trm: this.form.sistole_trm,
          diastole_trm: this.form.diastole_trm,
          rr_trm: this.form.rr_trm,
          nadi_trm: this.form.nadi_trm,
          spo2_trm: this.form.spo2_trm,
          suhu_trm: this.form.suhu_trm

        }


        console.log('payload', payload);

        return new Promise((resolve, reject) => {
          api.post('v1/simrs/ranap/ruangan/updatedokumenmutasi', payload)
            .then(resp => {
              notifSuccess(resp?.data?.message)
              this.getHistory(pasien)
              this.initForm()
              this.loadingForm = false
              resolve(resp)
            })
            .catch(err => {
              notifErrVue(err?.response?.data?.message)
              this.loadingForm = false
              reject(err)
            })
        })






      } catch (err) {
        this.error = err
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    removeTerapi(index) {
      this.form.terapis.splice(index, 1)
    },

    initForm(data) {
      this.isEditted = data ? data?.id : null

      this.form = {
        kd_mutasi: null,
        // titipan: this.ruanganAsal?.titipan ? true : false,
        titipan: false,
        ruanganTujuan: null,
        kamar: null,
        noBed: null,
        // ini form serah terima
        derajatPasien: data?.serah_terima?.derajatPasien || null,
        skalaNyeri: data?.serah_terima?.skalaNyeri || null,
        tensi: null,
        sistole: data?.serah_terima?.sistole || null,
        diastole: data?.serah_terima?.diastole || null,
        nadi: data?.serah_terima?.nadi || null,
        suhu: data?.serah_terima?.suhu || null,
        rr: data?.serah_terima?.rr || null,
        spo2: data?.serah_terima?.spo2 || null,
        terapis: data?.serah_terima?.terapis || [],
        plann: data?.serah_terima?.plann || null,
        ro: data?.serah_terima?.ro || null,
        lab: data?.serah_terima?.lab || null,
        ecg: data?.serah_terima?.ecg || null,
        lainlain: data?.serah_terima?.lainlain || null,
        kelengkapan: data?.serah_terima?.kelengkapan || null,

        sistole_trm: data?.serah_terima?.sistole_trm || null,
        diastole_trm: data?.serah_terima?.diastole_trm || null,
        nadi_trm: data?.serah_terima?.nadi_trm || null,
        suhu_trm: data?.serah_terima?.suhu_trm || null,
        rr_trm: data?.serah_terima?.rr_trm || null,
        spo2_trm: data?.serah_terima?.spo2_trm || null

      }

      // console.log('this.form', this.form);

    }

  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMutasiRanapStore, import.meta.hot))
