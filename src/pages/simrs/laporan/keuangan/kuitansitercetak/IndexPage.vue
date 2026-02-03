<template>
  <q-page>
    <Suspense>
      <!-- main content -->
      <AsyncComp />
      <!-- loading state -->
      <template #fallback>
        <app-loading />
      </template>
    </Suspense>
  </q-page>
</template>
<script setup>
import { useLaporanKuitansiTercetak } from 'src/stores/simrs/laporan/keuangan/kuitansitercetak/kuitansitercetak';
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./kuitansitercetak.vue')
)
const store = useLaporanKuitansiTercetak()
store.getmasterkasir()
</script>
