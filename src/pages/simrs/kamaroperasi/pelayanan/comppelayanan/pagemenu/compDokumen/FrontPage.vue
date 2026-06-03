<template>
  <div class="q-pa-sm" style="overflow: scroll;">
    <div class="row q-col-gutter-x-xs">
      <div class="col-12 full-height">
        <DocumentPage :key="props.pasien" :pasien="props.pasien" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const DocumentPage = defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/ok/DokumenPage.vue'))
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
</script>
