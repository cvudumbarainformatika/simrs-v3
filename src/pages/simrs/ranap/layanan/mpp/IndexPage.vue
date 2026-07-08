<template>
  <div class="fit column no-wrap">
    <FormPageA :pasien="pasien" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const FormPageA = defineAsyncComponent(() => import('./comp/FormPageA.vue'))

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  }
})
</script>
