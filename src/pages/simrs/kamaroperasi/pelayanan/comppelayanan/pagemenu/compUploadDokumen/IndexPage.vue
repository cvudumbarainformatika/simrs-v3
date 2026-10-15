<template>
  <div class="fit">
    <Suspense>
      <!-- main content -->
      <AsyncComp :pasien="pasien" :nakes="nakes" />
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
  nakes: {
    type: String,
    default: null
  }
})

const AsyncComp = defineAsyncComponent(() =>
  import('src/pages/simrs/ranap/layanan/upload/IndexPage.vue')
)
</script>
