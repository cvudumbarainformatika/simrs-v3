<template>
  <div>
    <Suspense>
      <!-- main content -->
      <AsyncComp :pasien="pasien" />
      <!-- loading state -->
      <template #fallback>
        <app-loading />
      </template>
    </Suspense>
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
const AsyncComp = defineAsyncComponent(() =>
  import('./FrontPage.vue')
)
// const AsyncComp = defineAsyncComponent(() =>
//   import('src/pages/simrs/ranap/layanan/mutasi/IndexPage.vue')
// )
</script>
