<template>
  <q-page class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header bg-primary text-white">
      <header-page @fullscreen="style.setComponentFull" @tambaharsip="tambaharsip" />
    </div>

    <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
      <q-scroll-area style="height: calc(100% - 1px);">
        <ListArsip :items="store.items" :loading="store.loading" />
      </q-scroll-area>
      <div class=" absolute-bottom bg-primary text-white z-top">
        <footer-page />
      </div>
    </q-card>
    <DialogFormPage :klasifikasi="storeklasifikasi.items" :media="storemedia.items" />
    <!-- <page-layanan-igd :key="pasien" v-model="store.pageLayanan" :pasien="pasien" :loadingaja="store.loadingTerima" /> -->
  </q-page>
</template>
<script setup>
import { useStyledStore } from 'src/stores/app/styled';
import HeaderPage from './HeaderPage.vue';
import ListArsip from './ListArsip.vue';
import FooterPage from './FooterPage.vue';
import DialogFormPage from './DialogFormPage.vue';
import { useUnitPengelolahArsipStore } from 'src/stores/simrs/unitpengelolaarsip/arsip';
import { onMounted } from 'vue';
import { useArsipMasterKelasifikasiStore } from 'src/stores/arsip/master/mkelasifikasi';
import { useArsipMasterMediaStore } from 'src/stores/arsip/master/mmedia';

const style = useStyledStore()
const store = useUnitPengelolahArsipStore()
const storeklasifikasi = useArsipMasterKelasifikasiStore()
const storemedia = useArsipMasterMediaStore()

function tambaharsip() {
  store.dialog = true
}

onMounted(() => {
  store.getData()
  storeklasifikasi.getMkelasifikasi()
  storemedia.getMastermedia()
})
</script>
