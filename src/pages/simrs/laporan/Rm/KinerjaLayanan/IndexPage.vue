<template>
  <q-page>
    <Suspense>
      <!-- main content -->
      <AsyncComp jenisPeminta="rekammedik" />
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
  import('../../keuangan/rincianperunit/RincianPerunitPage.vue')
)
</script>
