<template>
  <div class="full-height full-width">
    <div class="row full-height q-pa-xs">
      <div flat bordered square class="col-7 full-height q-pa-xs">
        <FormPage :pasien="pasien" :user="user" />
      </div>
      <div class="col-6 full-height ">
        <div flat bordered square class="col-5 full-height q-pa-xs">
          sadas
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormPage from './comp/FormPage.vue';

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})


</script>