// import { api } from 'src/boot/axios'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { usePagtStore } from 'src/stores/simrs/ranap/pagt'
// import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
// eslint-disable-next-line no-unused-vars
import { onMounted, reactive, ref, watch, watchEffect } from 'vue'

export default function useRightPanel(pasien) {
  const store = usePagtStore()
  // const pengunjung = usePengunjungRanapStore()
  const auth = useAplikasiStore()

  const settings = reactive({
    splitMin: 100,
    hoverred: false
  })

  const nakes = reactive({
    dokter: !!(auth?.user?.pegawai?.kdgroupnakes === '1' || auth?.user?.pegawai?.kdgroupnakes === 1),
    perawat: !!(auth?.user?.pegawai?.kdgroupnakes === '2' || auth?.user?.pegawai?.kdgroupnakes === 2),
    bidan: !!(auth?.user?.pegawai?.kdgroupnakes === '3' || auth?.user?.pegawai?.kdgroupnakes === 3)

  })


  onMounted(() => {
    nakes.dokter = !!(auth?.user?.pegawai?.kdgroupnakes === '1' || auth?.user?.pegawai?.kdgroupnakes === 1)
    nakes.perawat = !!(auth?.user?.pegawai?.kdgroupnakes === '2' || auth?.user?.pegawai?.kdgroupnakes === '3')
  })



  watchEffect(() => {
    // console.log('watchEffect pasien', pasien)
    // store.PISAH_DATA_RANAP_IGD(pasien?.anamnesis, pasien)
  })

  return {
    store, settings, nakes
  }
}
