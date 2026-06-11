<template>
  Tindakan selain tindakan operasi
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const TindakanPage = defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/complayanan/TindakanPage.vue'))
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
</script>
