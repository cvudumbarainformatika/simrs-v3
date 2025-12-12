import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { usePengunjungRanapStore } from './pengunjung'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { dateFilter } from 'src/modules/formatter'
// eslint-disable-next-line no-unused-vars
import { notifErrVue, notifSuccess } from 'src/modules/utils'

export const useKontrolRanapStore = defineStore('kontrol-ranap-store', {
  state: () => ({
    items: [],

    dokters: [],
    perawats: [],
    sistembayars: [],
    polis: [],

    loading: false,
    loadingSave: false,
    loadingHapus: null,
    filterTanggal: null,
    filterByRuang: null,
    filterByJenis: null,

    loadingCariDokter: false

  }),

  actions: {

    async getData(noreg) {
      this.loading = true
      const params = { params: { noreg } }
      const resp = await api.get('v1/simrs/pelayanan/suratkontrol/list', params)
      console.log('list surat kontrol', resp);

      if (resp.status === 200) {
        this.items = resp?.data || []
      }
      this.loading = false
    },
    async getDataBpjs() {
      this.loading = true
      // const params = { params: { noreg } }
      const resp = await api.get('v1/simrs/pelayanan/suratkontrol/bridging-bpjs-list')
      console.log('list surat kontrol from bpjs', resp);

      if (resp.status === 200) {
        // this.items = resp?.data || []
      }
      this.loading = false
    },
    async simpan(form) {
      try {
        let response;
        this.loadingSave = true;
        const payload = { ...form };

        if (form.noSuratKontrol) {
          response = await api.put(`v1/simrs/pelayanan/suratkontrol/update/${form.noSuratKontrol}`, payload);
        } else {
          response = await api.post('v1/simrs/pelayanan/suratkontrol/create', payload);
        }

        // this.$emit('surat-kontrol-saved', response.data);
        console.log('response', response);
        if (response.status === 200) {
          notifSuccess('Berhasil menyimpan surat kontrol')
          this.getData(form.noreg)
        }

      } catch (error) {
        console.error('Error saving surat kontrol:', error);
        alert('Gagal menyimpan surat kontrol: ' + (error.response?.data?.message || error.message));
      } finally {
        this.loadingSave = false;
      }
    },

    async hapus(noSuratKontrol) {
      let resp;
      const params = { noSuratKontrol }
      try {
        resp = await api.post(`v1/simrs/pelayanan/suratkontrol/remove`, params)
        // console.log(resp);
        if (resp.status === 200) {
          notifSuccess('Berhasil menghapus surat kontrol')
          this.getData()
        }
        return resp
      } catch (error) {
        console.log('err', error);
        throw error
      }
    },


    async getDokterByPoli(kodePoli, tglRencanaKontrol) {

      if (!kodePoli) {
        return notifErrVue('Mohon Memilih Poli Terlebih dahulu')
      }

      if (!tglRencanaKontrol) {
        return notifErrVue('silahkan pilih tanggal rawat inap')
      }

      this.loadingCariDokter = true

      const params = {
        jenis: 2,
        kodePoli,
        tglRencanaKontrol
      }

      try {
        const resp = await api.get(`v1/simrs/bpjs/bridging/dokter-by-poli/`, { params })
        console.log('getDokterByPoli', resp)
        if (resp.status === 200) {
          this.dokters = resp.data?.result?.list ?? []

        }

        return this.dokters
      }
      catch (error) {
        console.log(error)
        throw error
      }
      finally {
        this.loadingCariDokter = false
      }
    },


    initReset() {


      const pengunjung = usePengunjungRanapStore()
      const app = useAplikasiStore()
      // this.dokters = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      this.perawats = pengunjung?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []


      this.sistembayars = app?.sistemBayars

      this.polis = app?.polis.filter(x => x && (x.kodemapingbpjs || x.kodemappingbpjs)) ?? []


      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useKontrolRanapStore, import.meta.hot))

}