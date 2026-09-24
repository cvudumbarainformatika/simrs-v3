<template>
  <q-page :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header bg-primary text-white">
      <header-page />
    </div>

    <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
      <q-scroll-area style="height: calc(100% - 1px);">
        <ListPengajuanKlaim
          v-if="store.meta !== null"
          :items="store.items"
          :loading="store.loading"
          :loading-terima="store.loadingTerima"
          @bukalayanan="bukaDokumenRanap"
        />
      </q-scroll-area>
      <div class="absolute-bottom bg-primary text-white z-top">
        <footer-page :meta="store.meta" @go-to="store.goToPage" />
      </div>
    </q-card>

    <page-grouping-klaim
      :key="pasien?.noreg"
      v-model="store.pageLayanan"
      :pasien="pasien"
      :loading-aja="store.loadingbuka"
    />
  </q-page>
</template>

<script setup>
import ListPengajuanKlaim from './ListPengajuanKlaim.vue'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
import PageGroupingKlaim from '../grouping/PageGroupingKlaim.vue'
import { useStyledStore } from 'src/stores/app/styled'
import { onMounted, ref } from 'vue'
import { useKlaimRanapPenjaminanStore } from 'src/stores/simrs/penjaminan/klaimranap'

const store = useKlaimRanapPenjaminanStore()
const style = useStyledStore()
const pasien = ref(null)

async function bukaDokumenRanap(val) {
  pasien.value = val
  await store.bukaLayanan(val)
}

onMounted(() => {
  store.getData()
  store.getRuanganRanap()
})
</script>
