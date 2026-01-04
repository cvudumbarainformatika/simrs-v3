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
import ListData from './inpage/ListDataNpdls.vue'
import { onBeforeMount, onMounted } from 'vue';
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan';
// import listRegjurnal from './inpage/ListRegjurnal.vue'

const store = usePengusulanAnggaranStore()

onBeforeMount(() => {
  store.getData()
})
</script>
