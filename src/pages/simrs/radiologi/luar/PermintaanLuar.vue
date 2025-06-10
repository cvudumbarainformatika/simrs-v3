<template>
  <!-- <q-page> -->
  <q-page class="fit q-pa-md absolute">
    <!-- <template v-if="store.pasien">
      <page-tindakan :key="store.pasien" v-model="store.pageTindakan" :pasien="store.pasien"
        :loading-terima="store?.loadingTerima" />
    </template> -->
    <!-- <template v-else> -->
    <div class="fit column relative-position">
      <div class="col-auto">
        <HeaderComp />
      </div>
      <div v-if="!store.pasien" class="col full-height">
        <div v-if="store.loading" class="fit column flex-center">
          <q-spinner-comment size="6em" color="grey"></q-spinner-comment>
          <div>Harap Tunggu ...</div>
        </div>
        <template v-else-if="store.items?.length && !store.loading > 0">
          <transition-group appear enter-active-class="animated fadeIn faster"
            leave-active-class="animated fadeOut faster">
            <list-pasien v-if="!store.isViewList" key="list-pasien" :items="store.items" :loading="store.loading"
              @details="(val) => store.getDataPasienRadiologiByNota(val)" jenis="luar" />
            <thumbnail-view v-else key="thumbnail-view" :items="store.items"
              @details="(val) => store.getDataPasienRadiologiByNota(val)" />
          </transition-group>
        </template>
        <div v-else class="fit column flex-center">
          <div class="text-h4 q-mb-xs">
            🏷️
          </div>
          <div class="text-grey-8">
            Data Tidak Ditemukan
          </div>
        </div>
      </div>
      <div v-else class="col full-height">
        <PageTindakan :key="store.pasien" :pasien="store.pasien" />
      </div>
      <div class="absolute-bottom z-top">
        <app-paginate-simple v-if="store.meta && !store.pasien" :key="store.meta" :meta="store.meta" color="bg-grey-8"
          @go-to="store.setPage" />
      </div>
    </div>
    <!-- </template> -->



    <FormDaftarPasien v-model="store.isForm" @close="store.isForm = false" />
  </q-page>
  <!-- </q-page> -->
</template>

<script setup>
import HeaderComp from '../luar/comp/HeaderComp.vue'
import ThumbnailView from './comp/ThumbnailView.vue'

import { useListRadiologiLuarStore } from 'src/stores/simrs/radiologi/radiologiluar'
import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'
import { useFormRadiologiLuarStore } from 'src/stores/simrs/radiologi/formradiologiluar'
import { useRadiologiPoli } from 'src/stores/simrs/pelayanan/poli/radiologi'

import { onMounted, defineAsyncComponent } from 'vue'
// import ListPasien from '../pengunjung/comp/ListPasien.vue'
import ListPasien from './comp/ListPasien.vue'
// import DetailsPasien from '../pengunjung/comp/DetailsPasien.vue'
import PageTindakan from './PageTindakan.vue'

const FormDaftarPasien = defineAsyncComponent(() => import('./comp/FormDaftarPasien.vue'))

const store = useListRadiologiLuarStore()
const storeRadiologiPoli = useRadiologiPoli()
const storeListPasienRadiologi = useListPasienRadiologiStore()
const storeFormRadiologiLuar = useFormRadiologiLuarStore()

onMounted(() => {
  Promise.all([
    storeFormRadiologiLuar.getPerusahaan(),
    storeRadiologiPoli.getRadiologi(),
    storeRadiologiPoli.getJenisRadiologi(),
    store.getDataTable()
  ]).then(() => {
    storeListPasienRadiologi.namaPemeriksaans = storeRadiologiPoli.namaPemeriksaans
    storeListPasienRadiologi.jenisPemeriksaans = storeRadiologiPoli.jenisPemeriksaans
    // store.initPermintaan(props.pasien)
    // store.initNakes(storeRanap)
  }).catch((err) => {
    // console.log('error', err)
  })
})

</script>

<style lang="scss" scoped>
.scroll {
  scrollbar-width: none;
  /* untuk Firefox */
}

.scroll::-webkit-scrollbar {
  display: none;
  /* untuk Chrome, Safari, dan Opera */
}
</style>
