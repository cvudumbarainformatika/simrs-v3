<template>
  <q-page>
    <Suspense>
      <!-- main content -->
      <!-- ini error padahal harusnya ga -->
      <!-- <AsyncComp /> -->
      <!-- loading state -->
      <template #fallback>
        <app-loading />
      </template>
    </Suspense>
  </q-page>
</template>
<script setup>
// import { defineAsyncComponent } from 'vue'

// const AsyncComp = defineAsyncComponent(() =>
//   import('./LaporanKematian.vue')
// )
</script>
