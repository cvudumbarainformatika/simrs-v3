<template>
  <q-page class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header bg-primary text-white">
      <header-page @fullscreen="style.setComponentFull" :organisasi="store.itemsorganisasi" @tambahmap="tambahmap"
        :users="appstore?.user?.pegawai?.kdarteri" />
    </div>

    <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
      <q-scroll-area style="height: calc(100% - 1px);">
        <ListMap :items="store.items" :klasifikasi="storeklasifikasi.items" :loading="store.loading"
          :users="appstore?.user?.pegawai?.kdarteri" :organisasi="store.itemsorganisasi"
          :kabinet="store.itemscabinet" />
      </q-scroll-area>
      <div class=" absolute-bottom bg-primary text-white z-top">
        <footer-page />
      </div>
    </q-card>
    <DialogFormPage :klasifikasi="storeklasifikasi.items" :organisasi="store.itemsorganisasi"
      :users="appstore?.user?.pegawai?.kdarteri" :kabinet="store.itemscabinet" />
  </q-page>
</template>
<script setup>
import { useStyledStore } from 'src/stores/app/styled';

const style = useStyledStore()
import HeaderPage from './HeaderPage.vue'
import ListMap from './ListMap.vue'
import FooterPage from './FooterPage.vue'
import DialogFormPage from './DialogFormPage.vue';
import { onMounted } from 'vue';
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap';
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { useArsipMasterKelasifikasiStore } from 'src/stores/arsip/master/mkelasifikasi';

const store = useUnitPengelolaharsipMapStore()
const appstore = useAplikasiStore()
const storeklasifikasi = useArsipMasterKelasifikasiStore()

function tambahmap() {
  store.initreset()
  store.dialog = true
  //store.initForm()
}

onMounted(() => {
  store.params.bidangbagian = appstore?.user?.pegawai?.kdarteri
  store.getData()
  store.getDataorganisasi()
  store.getdatacabinet()
  storeklasifikasi.getMkelasifikasi()
})
</script>
