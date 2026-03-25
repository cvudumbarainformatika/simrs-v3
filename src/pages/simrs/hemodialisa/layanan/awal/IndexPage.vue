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
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./FrontPage.vue')
)
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingTerima: {
    type: Boolean,
    default: false
  },
  nakes: {
    type: String,
    default: null
  },
  depo: {
    type: String,
    default: null
  },
  headheight: {
    type: Number,
    default: 0
  }
})
</script>
