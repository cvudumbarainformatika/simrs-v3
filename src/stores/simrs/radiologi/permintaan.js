import { acceptHMRUpdate, defineStore } from 'pinia'
import { useListPasienRadiologiStore } from './radiologi'
import { notifErrVue, notifSuccessVue } from 'src/modules/utils'
import { api } from 'src/boot/axios'

export function findDokterRadiologi(dokters, namaPelaksana) {
  const nama = String(namaPelaksana ?? '').trim()
  const normalizedName = normalizeDokterRadiologiName(nama)
  return dokters?.find(dokter => String(dokter?.nama ?? '').trim() === nama) ??
    dokters?.find(dokter => normalizeDokterRadiologiName(dokter?.nama) === normalizedName)
}

export function normalizeDokterRadiologiName(name) {
  return String(name ?? '')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\bdr\.?\s*/g, '')
    .replace(/sp\.?\s*rad\.?/g, '')
    .replace(/[^a-z0-9]/g, '')
}

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
    loadingSimpan: false
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    initPermintaan(pasien) {
      // const nota = pasien?.nota_permintaan
      // const dasarPermintaan = pasien?.permintaan ?? null
      // this.permintaan = dasarPermintaan
      // console.log('dasarPermintaan', dasarPermintaan, pasien);
      // const data = dasarPermintaan?.rs15 || null
      // const arrayResult = data ? data?.split(';') : []
      this.permintaan = pasien?.permintaan


      const storePasienRadiologi = useListPasienRadiologiStore()
      const master = storePasienRadiologi.namaPemeriksaans

      // console.log('dasarPermintaan', this.listPermintaans, pasien);


      this.listPermintaans = pasien?.permintaan?.rincians?.map(x => {
        const kdPelaksana = findDokterRadiologi(this.dokters, x.pelaksana)?.kdpegsimrs || null
        // console.log('kdPelaksana', kdPelaksana);

        const ukuran = x.ukuran || '43 x 35'
        const jumlah = x.jumlah || 1
        const pelaksana = x.pelaksana || null
        const hasil = x.hasil || null
        const kesimpulan = x.kesimpulan || null
        const hasilhtml = x.hasilhtml || null
        const kesimpulanhtml = x.kesimpulanhtml || null
        return {
          ...x,
          kdPelaksana, ukuran, jumlah, pelaksana, hasil, kesimpulan, hasilhtml, kesimpulanhtml
        }
      })

      // console.log('listPermintaans', this.listPermintaans);

    },
    initNakes(store) {

      this.dokters = store?.nakes?.filter(x => String(x?.kdgroupnakes) === '1') ?? []
      this.perawats = store?.nakes?.filter(x => ['2', '3'].includes(String(x?.kdgroupnakes))) ?? []

      // console.log('initNakes dokters', this.dokters);

    },
    async simpan(item, pasien) {

      this.loadingSimpan = true
      if (!item.hasil || !item.jumlah > 0 || !item.kdPelaksana || !item.kesimpulan || !item.ukuran) {
        notifErrVue('Ad field yang belum diisi, silahkan periksa kembali')
        return
      }
      console.log('simpan item', item);

      try {
        const resp = await api.post('v1/simrs/radiologi/radiologi/simpanHasilByKode', item)
        console.log('simpan hasil', resp);
        if (resp.status === 200) {
          const resData = resp.data?.data || resp.data?.result || resp.data
          if (resData && typeof resData === 'object') {
            Object.assign(item, resData)
          }
          const tglHasil = resp.data?.tgl || resData?.tgl || resData?.rs2
          if (tglHasil) {
            item.tgl = tglHasil
          }

          notifSuccessVue(resp?.data?.message || resp?.message || 'Data berhasil disimpan')

          // Reload data pasien radiologi dari backend agar rincians memuat tgl database secara langsung tanpa tutup layanan
          const storePasienRadiologi = useListPasienRadiologiStore()
          if (pasien?.nota_permintaan) {
            await storePasienRadiologi.getDataPasienRadiologiByNota(pasien)
          }
        }
      } catch (error) {
        console.log('error', error);

      } finally {
        this.loadingSimpan = false

      }




    },
    reset(item) {
      // item.kdPelaksana = null
      // item.pelaksana = null
      item.hasil = null
      item.kesimpulan = null
      item.hasilhtml = null
      item.kesimpulanhtml = null
      item.jumlah = 1
      item.ukuran = '43 x 35'
    }
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermintaanRadiologiStore, import.meta.hot))
}
