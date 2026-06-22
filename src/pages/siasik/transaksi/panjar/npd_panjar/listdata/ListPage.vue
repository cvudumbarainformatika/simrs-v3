<template>
  <div class="container">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row" style="height: 100%">
        <ListData />
      </div>
    </q-card>
  </div>
  <!-- <div class="container q-px-sm">
    <q-card class="items-center full-width">
      <div class="row">
        <listRegjurnal />
      </div>
    </q-card>
  </div> -->
</template>
<script setup>
import { storeNpdPanjar } from 'src/stores/siasik/transaksi/panjar/npd_panjar/store_npd_panjar';
import ListData from './inpage/ListData.vue'
import { onBeforeMount, onMounted } from 'vue';
// import listRegjurnal from './inpage/ListRegjurnal.vue'

const store = storeNpdPanjar()

onBeforeMount(() => {
  store.getDataNpdPanjar()
})
onMounted(() => {
  // store.getDataNpdPanjar()
  console.log('data npd panjar', store.transall)
})
</script>
