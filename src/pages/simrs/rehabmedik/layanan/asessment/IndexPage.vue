<template>
  <div class="full-height full-width">
    <div class="row full-height q-pa-xs">
      <div flat bordered square class="col-7 full-height q-pa-xs">
        <FormPage :pasien="pasien" :user="user" :store-kunjungan="props.store" />
      </div>
      <div class="col-5 full-height ">

        <ListPage :pasien="pasien" :user="user" :store-kunjungan="props.store" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormPage from './comp/FormPage.vue';
import ListPage from './comp/ListPage.vue';

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  }
})


</script>