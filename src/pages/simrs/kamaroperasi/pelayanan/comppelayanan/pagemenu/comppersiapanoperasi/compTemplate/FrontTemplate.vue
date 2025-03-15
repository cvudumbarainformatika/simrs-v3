<template>
  <div class="bg-white full-height column">
    <div class="col-auto bg-yellow text-red f-14 q-mb-md">
      <div class="q-pa-sm">
        Template Obat Operasi
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-6">
        <formPage />
      </div>
      <div class="col-6">
        <listPage />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useTemplatePersiapanOperasiStore } from 'src/stores/simrs/farmasi/kamaroperasi/template'
import { defineAsyncComponent, onMounted } from 'vue'

const store = useTemplatePersiapanOperasiStore()
const formPage = defineAsyncComponent(() => import('./FormPage.vue'))
const listPage = defineAsyncComponent(() => import('./ListPage.vue'))

onMounted(() => {
  store.cariObat('')
  store.cariList()
})
</script>
