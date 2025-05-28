import { acceptHMRUpdate, defineStore } from 'pinia'
import { useListPasienRadiologiStore } from './radiologi'
import { notifErrVue } from 'src/modules/utils'

export const usePermintaanRadiologiStore = defineStore('permintaan-radiologi', {
  state: () => ({
    permintaan: null,
    listPermintaans: [],
    ukurans: [
      '43 x 35',
      '35 x 35',
      '30 x 40',
      '24 x 30',
      '18 x 24'
    ],
    dokters: [],
    perawats: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    initPermintaan(pasien) {
      const nota = pasien?.nota_permintaan
      const dasarPermintaan = pasien?.permintaan ?? null
      this.permintaan = dasarPermintaan
      console.log('dasarPermintaan', dasarPermintaan);
      const data = dasarPermintaan?.rs15 || null
      const arrayResult = data ? data?.split(';') : []


      const storePasienRadiologi = useListPasienRadiologiStore()
      const master = storePasienRadiologi.namaPemeriksaans

      // this.listPermintaans = arrayResult.map(kode => {
      //   const item = master?.find(item => item.rs1 === kode)
      //   const hasil = null
      //   const ukuran = '43 x 35'
      //   const jumlah = 1
      //   const kesimpulan = null
      //   const pelaksana = null
      //   const kdPelaksana = null
      //   return {
      //     ...item,
      //     kode, hasil, ukuran, jumlah, kesimpulan, pelaksana, kdPelaksana
      //   }
      // })

      this.listPermintaans = pasien?.permintaan?.rincians?.map(x => {
        const ukuran = '43 x 35'
        const jumlah = 1
        const kdPelaksana = null
        return {
          ...x,
          kdPelaksana, ukuran, jumlah
        }
      })

      console.log('listPermintaans', this.listPermintaans);

    },
    initNakes(store) {

      this.dokters = store?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
      this.perawats = store?.nakes?.filter(x => x?.kdgroupnakes === '2' || x?.kdgroupnakes === '3') ?? []

      // console.log('initNakes dokters', this.dokters);

    },
    async simpan(item) {

      if (!item.hasil || !item.jumlah > 0 || !item.kdPelaksana) {
        notifErrVue('Ad field yang belum diisi, silahkan periksa kembali')
        return
      }
      console.log('simpan item', item);

    },
    batal(item) {
      item.kdPelaksana = null
      item.pelaksana = null
      item.hasil = null
      item.jumlah = 1
      item.kesimpulan = null
      item.ukuran = '43 x 35'
    }
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermintaanRadiologiStore, import.meta.hot))
}
