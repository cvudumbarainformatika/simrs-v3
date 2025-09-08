import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { dateFilter } from 'src/modules/formatter'
// eslint-disable-next-line no-unused-vars
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const useJasaKeperawatanStore = defineStore('jasa-keperawatan-ranap-store', {
  state: () => ({
    items: [],
    form: {
      tanggal: dateFilter(Date.now()),
      keterangan: null,
      tarif: 0,
      harga_sarana: 0,
      harga_pelayanan: 0,
      kode_biaya: null
    },

    tarifs: [],

    filterRuangs: [],
    filterTanggal: null,
    filterByRuang: null,

    loading: false,
    loadingSave: false,
    loadingHapus: null,

  }),
  getters: {
    filterByTgl: (state) => {
      let data = (state.items || []).filter(a => {
        return (!state.filterTanggal || a.rs2?.includes(state.filterTanggal)) &&
          (!state.filterByRuang || a?.rs8?.includes(state.filterByRuang))
        // ((!state.filterByJenis || state.filterByJenis === 'SEMUA') || a?.rs6?.includes(state.filterByJenis === 'VISITE' ? 'V' : 'K'))
      })

      return data
    },
    total: (state) => state.filterByTgl?.reduce((a, b) => a + b.subtotal, 0),
  },
  actions: {

    async getTarif(pasien) {
      const params = {
        params: {
          noreg: pasien?.noreg,
          kd_ruang: pasien?.kdgroup_ruangan,
          kelas: pasien?.kelas_ruangan
        }
      }

      this.loading = true
      try {
        const resp = await api.get('v1/simrs/ranap/layanan/jasa/keperawatan/gettarif', params)
        // console.log('resp', resp);

        if (resp.status === 200) {
          this.tarifs = resp?.data
          // this.setRuangan()
        }

      }
      catch (error) {
        // notifErrVue(error)
        console.log(error);

      } finally {
        this.loading = false
      }
    },

    async getData(pasien) {
      const params = {
        params: {
          noreg: pasien?.noreg,
          kdgroup_ruangan: pasien?.kdgroup_ruangan,
        }
      }

      this.loading = true
      try {
        const resp = await api.get('v1/simrs/ranap/layanan/jasa/keperawatan/list', params)
        console.log('resp', resp);

        if (resp.status === 200) {
          this.items = resp?.data
          this.setRuangan()
        }

      }
      catch (error) {
        // notifErrVue(error)
        console.log(error);

      } finally {
        this.loading = false
      }
    },


    setRuangan() {
      const ruangs = this.items.map(x => {
        return {
          kdruang: x?.rs8,
          nama: x?.ruang,

        }
      })
      this.filterRuangs = ruangs.reduce((acc, curr) => {
        if (!acc.find(item => item.kdruang === curr.kdruang)) {
          acc.push(curr)
        }
        return acc
      }, [])
      this.filterRuangs.unshift({ kdruang: null, nama: 'SEMUA RUANGAN' })
    },

    async simpan(pasien) {

      this.form.kdgroup_ruangan = pasien?.kdgroup_ruangan
      this.form.kelas_ruangan = pasien?.kelas_ruangan
      this.form.noreg = pasien?.noreg
      this.form.norm = pasien?.norm
      this.form.kdruang = pasien?.kdruangan
      this.form.kelas_ruangan = pasien?.kelas_ruangan
      this.form.hak_kelas = pasien?.hak_kelas
      this.form.kodesistembayar = pasien?.kodesistembayar
      console.log('form', this.form);


      this.loadingSave = true
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/jasa/keperawatan/simpan', this.form)
        console.log('resp', resp);

        if (resp.status === 200) {
          notifSuccess(resp)
          this.initReset()
          this.getData(pasien)
        }
      }
      catch (error) {
        // notifErrVue(error)
        console.log(error);

      } finally {
        this.loadingSave = false
      }
    },

    async hapus(id) {
      this.loadingHapus = id
      try {
        const resp = await api.post('v1/simrs/ranap/layanan/jasa/keperawatan/hapus', { id: id })
        console.log('resp hapus', resp);

        if (resp.status === 200) {
          notifSuccess(resp)
          this.items = this.items.filter(x => x.id !== id)
          // this.getData()
        }
      }
      catch (error) {
        // notifErrVue(error)
        console.log(error);

      } finally {
        this.loadingHapus = null
      }
    },

    initReset() {
      this.form = {
        tanggal: dateFilter(Date.now()),
        keterangan: null,
        tarif: 0,
        harga_sarana: 0,
        harga_pelayanan: 0,
        kode_biaya: null
      }



      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJasaKeperawatanStore, import.meta.hot))

}