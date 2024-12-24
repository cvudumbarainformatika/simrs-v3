<template>
  <div class="column full-height" style="overflow: hidden;">
    <div class="q-gutter-y-md full-height full-width">
      <div class="col-auto bg-red">
        <q-tabs v-model="store.tab" inline-label outside-arrows mobile-arrows align="left" active-color="yellow"
          class="bg-grey-4 text-white shadow-2 text-grey-8" active-bg-color="primary">
          <q-tab v-for="(item, i) in store.tabs" :key="i" :name="item.page" :label="item.name" style="width: 100%;" />
          <!-- <q-tab name="mails" label="Mails" />
      <q-tab name="alarms" label="Alarms" />
      <q-tab name="movies" label="Movies" />
      <q-tab name="photos" label="Photos" />
      <q-tab name="videos" label="Videos" />
      <q-tab name="addressbook" label="Address Book" /> -->
        </q-tabs>
      </div>
      <div class="col full-height" style="overflow: hidden;">
        <q-tab-panels v-model="store.tab" animated class="full-height">
          <q-tab-panel name="Billing" class="full-height q-pa-none">
            <BillingPage :judul="billing" :pasien="props?.pasien" />
          </q-tab-panel>
          <q-tab-panel name="Tindakan Medik" class="full-height q-pa-none">
            <TindakanPage :pasien="props.pasien" />
          </q-tab-panel>
          <q-tab-panel name="Diagnosa Keperawatan" class="full-height q-pa-none">
            <DiagnosaKeperawatanPage :pasien="props.pasien" />
          </q-tab-panel>
          <q-tab-panel name="Diagnosa Kebidanan" class="full-height q-pa-none">
            <DiagnosaKebidananPage :pasien="props.pasien" />
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
const billing = ref('BILLING')
const store = useDokumenIgdStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
</script>
