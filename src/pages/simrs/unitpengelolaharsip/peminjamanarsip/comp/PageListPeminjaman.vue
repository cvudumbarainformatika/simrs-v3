<template>
  <q-page class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header bg-primary text-white">
      <header-page @fullscreen="style.setComponentFull" :users="appstore?.user?.pegawai?.kdarteri"
        :organisasi="props.organisasi" />
    </div>

    <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
      <q-scroll-area style="height: calc(100% - 1px);">
        <ListArsip :items="store.itemspeminjaman" :loading="store.loadinglist" />
      </q-scroll-area>
      <!-- <div class=" absolute-bottom bg-primary text-white z-top">
        <footer-page :meta="store.meta" @go-to="store.goToPage" />
      </div> -->
    </q-card>
  </q-page>
</template>
<script setup>
import { useStyledStore } from 'src/stores/app/styled';
import HeaderPage from './HeaderPage.vue';
import ListArsip from './ListPeminjaman.vue';
// import FooterPage from './FooterPage.vue';
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { useUnitPengelolaharsippeminjamanStore } from 'src/stores/simrs/unitpengelolaarsip/peminjamanarsip';
import { onMounted } from 'vue';

const store = useUnitPengelolaharsippeminjamanStore()
const appstore = useAplikasiStore()
const style = useStyledStore()

const props = defineProps({
  organisasi: {
    type: Array,
    default: () => []
  },
})

onMounted(() => {
  store.getListPeminjaman()
})
</script>
