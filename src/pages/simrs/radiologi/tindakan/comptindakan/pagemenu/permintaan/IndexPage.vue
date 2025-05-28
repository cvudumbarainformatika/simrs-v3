<template>
  <div class="bg-grey-2 q-pa-sm full-height scroll">
    <div class=" full-width">
      <div class="row q-col-gutter-xs">
        <!-- Profiling Permintaan -->
        <div class="col-12 col-md-4">
          <profiling-permintaan :pasien="pasien" />
        </div>

        <!-- Existing code for right column -->
        <div class="col-12 col-md-8">

          <list-permintaan :pasien="pasien" :loading="storeListPasienRadiologi?.loadingTerima" />


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'
import { useRadiologiPoli } from 'src/stores/simrs/pelayanan/poli/radiologi'
import { usePermintaanRadiologiStore } from 'src/stores/simrs/radiologi/permintaan'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'

const ProfilingPermintaan = defineAsyncComponent(() => import('./comp/ProfilingPermintaan.vue'))
const ListPermintaan = defineAsyncComponent(() => import('./comp/ListPermintaan.vue'))


const storeRadiologiPoli = useRadiologiPoli()
const storeListPasienRadiologi = useListPasienRadiologiStore()
const storeRanap = usePengunjungRanapStore()
const store = usePermintaanRadiologiStore()


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})


onMounted(() => {
  Promise.all([
    storeRadiologiPoli.getRadiologi(),
    storeRadiologiPoli.getJenisRadiologi(),
    storeRanap.getNakes()
  ]).then(() => {
    storeListPasienRadiologi.namaPemeriksaans = storeRadiologiPoli.namaPemeriksaans
    storeListPasienRadiologi.jenisPemeriksaans = storeRadiologiPoli.jenisPemeriksaans
    store.initPermintaan(props.pasien)
    store.initNakes(storeRanap)
  }).catch((err) => {
    // console.log('error', err)
  })
})

</script>

<style scoped>
.container {
  max-width: 100%;
}
</style>