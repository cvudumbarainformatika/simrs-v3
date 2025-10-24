<template>
  <q-page class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header bg-primary text-white">
      <header-page />
    </div>

    <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
      <q-scroll-area style="height: calc(100% - 1px);">
        <list-pengunjung v-if="store.meta !== null" :keloading-cesmixy="store.items" :items="store.items"
          :loading="store.loading" :loading-terima="store.loadingTerima" :loadingcesmix="store.loadingcesmix"
          @terimapasien="terimapasien" @bukalayanan="bukaTindakan" @kirimcasmix="kirimcasmix" />
      </q-scroll-area>
      <div class=" absolute-bottom bg-primary text-white z-top">
        <footer-page :meta="store.meta" @go-to="store.goToPage" />
      </div>
    </q-card>
    <page-layanan :key="pasien" v-model="store.pageLayanan" :pasien="pasien" :loadingaja="store.loadingTerima" />
  </q-page>
</template>

<script setup>
import { useStyledStore } from 'src/stores/app/styled'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useDiagnosaDokter } from 'src/stores/simrs/igd/diagnosadokter'
import { usePengunjungHomeCareStore } from 'src/stores/simrs/homeCare/pengunjung'
const ListPengunjung = defineAsyncComponent(() => import('./ListPengunjung.vue'))
const HeaderPage = defineAsyncComponent(() => import('./HeaderPage.vue'))
const FooterPage = defineAsyncComponent(() => import('./FooterPage.vue'))
const PageLayanan = defineAsyncComponent(() => import('../layanan/PageLayanan.vue'))
const store = usePengunjungHomeCareStore()
const style = useStyledStore()
const pasien = ref(null)
const diagnosa = useDiagnosaDokter()

function terimapasien (val) {
  // console.log('terimapasien', val)
  store.bukaLayanan(val)
  store.items.flag = '1'
}

function bukaTindakan (val) {
  // console.log('bukaTindakan', val)
  pasien.value = val
  store.bukaLayanan(val)
}


onMounted(() => {
  store.getData()
})
</script>
