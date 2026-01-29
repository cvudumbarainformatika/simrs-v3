<template>
  <div class="full-height q-pa-sm">
    <div class="row q-col-gutter-x-xs full-height">
      <div class="col-8 full-height">
        <FormPage :key="pasien" :pasien="pasien" />
      </div>
      <div class="col-4 full-height">
        <ListPage :key="pasien" :pasien="pasien" />
      </div>
    </div>
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
const FormPage = defineAsyncComponent(() => import('./FormTindakanOperasi.vue'))
const ListPage = defineAsyncComponent(() => import('./ListTindakanOperasi.vue'))
</script>
