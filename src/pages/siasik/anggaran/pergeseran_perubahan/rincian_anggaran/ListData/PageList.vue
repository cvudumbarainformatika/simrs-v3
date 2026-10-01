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
import ListData from './inpage/ListData.vue'
import { onBeforeMount, onMounted } from 'vue';
import { usePergeseran_PerubahanAnggaranStore } from 'src/stores/siasik/anggaran/perubahan_pergeseran/geserperubahan_anggaran.js';
// import listRegjurnal from './inpage/ListRegjurnal.vue'

const store = usePergeseran_PerubahanAnggaranStore()

onBeforeMount(() => {
  store.getData()
})
</script>
