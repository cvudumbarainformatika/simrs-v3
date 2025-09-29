import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
// eslint-disable-next-line no-unused-vars
import { notifErrVue, notifSuccess } from 'src/modules/utils'
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

    form: {
      ruanganTujuan: null,
      kamar: null,
      noBed: null,
      kd_mutasi: null
    },
    selectRuangan: null

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

      try {

        const resp = await api.get('v1/simrs/ranap/ruangan/ruanganranap', params)

        const data = resp?.data || null
        if (data) {
          this.ruanganAsal = data?.ruangan[0] || null
          this.taripRuanganAsal = data?.tarif[0] || null
        }
        // console.log('resp', resp);
      } catch (error) {
        console.log(error);

      }
    },
    async getHistory(pasien) {

      const params = {
        params: {
          noreg: pasien?.noreg
        }
      }

      try {

        const resp = await api.get('v1/simrs/ranap/ruangan/historymutasi', params)


        console.log('resp', resp);
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


    async simpanMutasi(pasien) {
      // this.loading = true
      // this.error = null

      // console.log('pasien', pasien, this.ruanganAsal);


      try {
        // ambil value dari form
        const noreg = pasien?.noreg
        const tanggal = dateDbFormat(new Date())
        const nama = pasien?.nama
        const ruanglm = pasien?.kdruangan
        const kd_kelas = pasien?.kelas_ruangan
        const kamarlm = this.ruanganAsal?.kd_kmr
        const bedlm = this.ruanganAsal?.no_bed
        // const hargalm = pasien.hargalm.value
        // const biaya_dokter1 = pasien.biaya_dokter1.value

        const kd_mutasi = this.form.kd_mutasi
        const ruang = this.form.ruanganTujuan
        const kamar = this.form.kamar
        const nobed = this.form.noBed
        // const biaya_kamar = pasien.biaya_kamar.value
        // const biaya_dokter2 = pasien.biaya_dokter2.value

        const payload = {
          noreg,
          tanggal,
          nama,
          ruanglm,
          kamarlm,
          bedlm,
          // hargalm,
          // biaya_dokter1,
          kd_kelas,
          kd_mutasi,
          ruang,
          kamar,
          nobed,
          // biaya_kamar,
          // biaya_dokter2,
          // editable,
        }


        // konfirmasi
        const yakin = confirm('apakah yakin pasien ini akan dimutasikan?')
        if (!yakin) return

        // kirim ke server (pakai axios)
        const response = await api.post('v1/simrs/ranap/ruangan/simpanmutasi', payload)

        // return response.data
        console.log('response mutasi', response);

      } catch (err) {
        this.error = err
        console.error(err)
      } finally {
        this.loading = false
      }
    },

  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMutasiRanapStore, import.meta.hot))
