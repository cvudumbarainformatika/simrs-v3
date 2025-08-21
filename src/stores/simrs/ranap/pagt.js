import { acceptHMRUpdate, defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess, notifSuccessVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { usePengunjungRanapStore } from './pengunjung'

export const usePagtStore = defineStore('pagt-store', {
  state: () => ({

    items: [],
    loading: false,
    form: {
      // ini untuk 4.1
      id: null,
      antropometri: null,
      status_gizi: null,
      biokimia: null,
      biokimiaKet: null,
      klinis: null,
      klinisKet: null,
      // riwayat gizi dahulu
      alergiMakanan: null,
      alergiMakananKet: null,
      polaMakan: null,
      polaMakanKet: null,
      lainlain: null,
      nafsuMakan: null,
      nafsuMakanKet: null,
      sulitNelan: null,
      sulitNelanKet: null,
      sulitNgunyah: null,
      sulitNgunyahKet: null,
      mual: null,
      mualKet: null,

      // riawayat personal
      rwPenyDhl: [],
      rwPenyDhlKet: null,
      rwPenySkr: null,

    },






    loadingSave: false,


    yaTidaks: ['Ya', 'Tidak'],
    normals: ['Normal', 'Bermasalah'],
    riwayats: ['HIPERTENSI', 'DM', 'JANTUNG', 'STROKE']




  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  actions: {

    async getData(pasien) {
      this.loading = true
      const params = {
        params: {
          noreg: pasien?.noreg
        }
      }
      try {
        const resp = await api.get('v1/simrs/ranap/layanan/pagt/list', params)
        console.log('resp', resp)
        if (resp.status === 200) {
          this.items = resp.data
        }
        this.loading = false
      }
      catch (error) {
        this.loading = false
      }
    },

    initReset(data) {
      // console.log('data init reset', data)
      this.loadingSave = false

      this.form = {
        id: data?.id ?? null,
        antropometri: data?.antropometri ?? null,
        status_gizi: data?.status_gizi ?? null,
        biokimia: data?.biokimia ?? null,
        biokimiaKet: data?.biokimiaKet ?? null,
        klinis: data?.klinis ?? null,
        klinisKet: data?.klinisKet ?? null,
        // riwayat gizi dahulu
        alergiMakanan: data?.alergiMakanan ?? null,
        alergiMakananKet: data?.alergiMakananKet ?? null,
        polaMakan: data?.polaMakan ?? null,
        polaMakanKet: data?.polaMakanKet ?? null,
        lainlain: data?.lainlain ?? null,
        nafsuMakan: data?.nafsuMakan ?? null,
        nafsuMakanKet: data?.nafsuMakanKet ?? null,
        sulitNelan: data?.sulitNelan ?? null,
        sulitNelanKet: data?.sulitNelanKet ?? null,
        sulitNgunyah: data?.sulitNgunyah ?? null,
        sulitNgunyahKet: data?.sulitNgunyahKet ?? null,
        mual: data?.mual ?? null,
        mualKet: data?.mualKet ?? null,

        // riawayat personal
        rwPenyDhl: data?.rwPenyDhl ?? null,
        rwPenyDhlKet: data?.rwPenyDhlKet ?? null,
        rwPenySkr: data?.rwPenySkr ?? null,
      }
    },


    select(item) {
      console.log('item', item);
      this.initReset(item)
    },




    // KHUSUS KEPERAWATAN
    async saveForm(pasien) {


      const timeStamp = Date.now()
      const auth = useAplikasiStore()
      const pushSementara = {
        id: this.form.id,
        noreg: pasien?.noreg,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        nakes: auth?.user?.pegawai?.kdgroupnakes,
        tgl: date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss'),
        petugas: { nama: auth?.user?.nama }

      }

      const pengunjung = usePengunjungRanapStore()
      pengunjung.injectDataPasien(pasien?.noreg, pushSementara, 'anamnesis')


      const payload = {
        noreg: pasien?.noreg ?? null,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        ...this.form
      }

      console.log('push sementara', pushSementara)
      console.log('form', payload)

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/pagt/simpan', payload)
        // console.log('resp', resp)
        if (resp.status === 200) {
          notifSuccess(resp)
          const result = resp?.data?.result
          this.items.unshift(result)
          this.initReset()
          // pengunjung.injectDataPasien(pasien?.noreg, result, 'anamnesis')
          pengunjung.deleteInjectanNull2(pasien?.noreg, 'pagt')
          pengunjung.injectDataArray(pasien?.noreg, result, 'pagt')
        }
        this.loadingSave = false
      }
      catch (error) {
        console.log('error', error)
        this.loadingSave = false
      }
      // this.loadingSave = false
    },



  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePagtStore, import.meta.hot))
}
