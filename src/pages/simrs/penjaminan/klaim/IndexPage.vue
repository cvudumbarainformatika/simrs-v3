<template>
  <div>
    <Suspense>
      <AsyncComp />
      <template #fallback>
        <app-loading />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const AsyncComp = defineAsyncComponent(() =>
  import('./pengajuan/PageListPengajuanKlaim.vue')
)
</script>
