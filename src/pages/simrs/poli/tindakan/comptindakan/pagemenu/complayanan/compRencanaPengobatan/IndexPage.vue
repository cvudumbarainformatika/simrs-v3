<template>
  <q-page>
    <Suspense>
      <!-- main content -->
      <AsyncComp :pasien="pasien" />
      <!-- loading state -->
      <template #fallback>
        <app-loading />
      </template>
    </Suspense>
  </q-page>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./target/TargetPage.vue')
)
defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
</script>
