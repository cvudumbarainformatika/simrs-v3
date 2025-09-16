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
      energi: null,
      extra: null,

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
      console.log('data init reset', data)
      this.loadingSave = false

      this.form = {
        id: data?.id ?? null,
        antropometri: data?.antropometri ?? null,
        status_gizi: data?.status_gizi ?? null,
        biokimia: data?.biokimia ?? null,
        biokimiaKet: data?.biokimia_ket ?? null,
        klinis: data?.klinis ?? null,
        klinisKet: data?.klinis_ket ?? null,
        // riwayat gizi dahulu
        alergiMakanan: data?.alergi_makanan ?? null,
        alergiMakananKet: data?.alergi_makanan_ket ?? null,
        polaMakan: data?.pola_makan ?? null,
        polaMakanKet: data?.pola_makan_ket ?? null,
        lainlain: data?.lain_lain ?? null,
        nafsuMakan: data?.nafsu_makan ?? null,
        nafsuMakanKet: data?.nafsu_makan_ket ?? null,
        sulitNelan: data?.sulit_nelan ?? null,
        sulitNelanKet: data?.sulit_nelan_ket ?? null,
        sulitNgunyah: data?.sulit_ngunyah ?? null,
        sulitNgunyahKet: data?.sulit_ngunyah_ket ?? null,
        mual: data?.mual ?? null,
        mualKet: data?.mual_ket ?? null,

        // riawayat personal
        rwPenyDhl: data?.rw_peny_dhl ?? [],
        rwPenyDhlKet: data?.rw_peny_dhl_ket ?? null,
        rwPenySkr: data?.rw_peny_skr ?? null,
        energi: data?.energi ?? null,
        extra: data?.extra ?? null,
      }
    },


    select(item) {
      console.log('item', item);
      this.initReset(item)
    },




    // KHUSUS KEPERAWATAN
    async saveForm(pasien) {

      console.log('pasien', pasien);


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
      // if (this.form?.id === null) {
      //   pengunjung.injectDataPasien(pasien?.noreg, pushSementara, 'anamnesis')
      // }


      const payload = {
        noreg: pasien?.noreg ?? null,
        norm: pasien?.norm,
        kdruang: pasien?.kdruangan,
        ...this.form
      }

      // console.log('push sementara', pushSementara)
      console.log('form', payload)

      try {
        const resp = await api.post('v1/simrs/ranap/layanan/pagt/simpan', payload)
        // console.log('resp', resp)
        if (resp.status === 200) {
          notifSuccess(resp)
          const result = resp?.data?.result
          if (!this.items?.length) {
            this.items.unshift(result)
          }
          this.initReset()
          // // pengunjung.injectDataPasien(pasien?.noreg, result, 'anamnesis')
          // if (this.form?.id === null) {
          //   pengunjung.deleteInjectanNull2(pasien?.noreg, 'pagt')
          //   pengunjung.injectDataArray(pasien?.noreg, result, 'pagt')
          // }
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
