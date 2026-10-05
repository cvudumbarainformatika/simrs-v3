<template>
  <div class="row full-height full-width" style="overflow: hidden;">
    <div class="col-12 col-md-7 full-height q-pa-xs">
      <FormPemeriksaanFisik :key="props.pasien" :pasien="props.pasien" />
    </div>
    <div class="col-12 col-md-5 full-height q-pa-xs">
      <ListPemeriksaanFisik :key="props.pasien" :pasien="props.pasien" />
    </div>
  </div>
</template>

<script setup>
import FormPemeriksaanFisik from './comp/FormPemeriksaanFisik.vue'
import ListPemeriksaanFisik from './comp/ListPemeriksaanFisik.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  depo: {
    type: String,
    default: ''
  }
})
</script>
