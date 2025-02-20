<template>
  <q-page>
    <Suspense>
      <AsyncComp />
      <template #fallback>
        <app-loading />
      </template>
    </Suspense>
  </q-page>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => import('./inpage/ListData.vue'))
</script>
