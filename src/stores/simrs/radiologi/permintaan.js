import { acceptHMRUpdate, defineStore } from 'pinia'
import { useListPasienRadiologiStore } from './radiologi'

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
    ]
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

      this.listPermintaans = arrayResult.map(kode => {
        const item = master?.find(item => item.rs1 === kode)
        const hasil = null
        const ukuran = '43 x 35'
        const jumlah = 1
        return {
          ...item,
          kode, hasil, ukuran, jumlah
        }
      })

      // console.log('listPermintaans', this.listPermintaans);

    }
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermintaanRadiologiStore, import.meta.hot))
}
