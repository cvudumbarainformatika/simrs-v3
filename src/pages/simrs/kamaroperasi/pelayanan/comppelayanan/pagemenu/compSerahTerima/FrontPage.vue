<template>
  <div>
    <!-- <Mutasi :pasien="pasien" /> -->
    <app-maintenance text="Diagendakan setelah Akreditasi" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const Mutasi = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/mutasi/IndexPage.vue'))
</script>
