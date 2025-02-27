<template>
  <div class="column full-height" style="overflow: hidden;">
    <div class="q-gutter-y-md full-height full-width">
      <div class="col-auto bg-red">
        <q-tabs v-model="store.tab" inline-label outside-arrows mobile-arrows align="left" active-color="yellow"
          class="bg-grey-4 text-white shadow-2 text-grey-8" active-bg-color="primary">
          <q-tab v-for="(item, i) in store.tabs" :key="i" :name="item.page" :label="item.name" style="width: 100%;" />
        </q-tabs>
      </div>
      <div class="col full-height" style="overflow: hidden;">
        <q-tab-panels v-model="store.tab" animated class="full-height">
          <q-tab-panel name="Billing" class="full-height q-pa-none">
            <BillingPage :judul="billing" :pasien="props?.pasien" />
          </q-tab-panel>
          <q-tab-panel name="Triase" class="full-height q-pa-none">
            <TriasePage :judul="triase" :pasien="props.pasien" />
          </q-tab-panel>
          <q-tab-panel name="Surat Kematian" class="full-height q-pa-none">
            <SuratKematianPage :judul="suratkematian" :pasien="props.pasien" />
          </q-tab-panel>
          <q-tab-panel name="Indikasi Masuk Nicu" class="full-height q-pa-none">
            <Indikasimasuknicudaninter :judul="indikasinicu" :pasien="props.pasien" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useDokumenIgdStore } from 'src/stores/simrs/igd/dokumen'
import { ref } from 'vue'

import BillingPage from './dokumenisi/Billing/BillingPage.vue';
import TriasePage from './dokumenisi/triage/TriasePage.vue';
import SuratKematianPage from './dokumenisi/suratkematian/SuratKematianPage.vue';
import Indikasimasuknicudaninter from './dokumenisi/inidakasimasuknicudaninter/indikasimasuknicudaninter.vue';
const billing = ref('BILLING')
const triase = ref('TRIASE')
const suratkematian = ref('Surat Kematian')
const indikasinicu = ref('Indikasi Pasien Masuk Ruang Nicu')
const store = useDokumenIgdStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
</script>
