<template>
  <div class="full-width document-host">
    <div class="row full-height document-host__row">
      <q-card flat bordered square class="col-12 full-height document-host__card">
        <MenuDokumen :key="props.pasien" :pasien="props.pasien" :loadingaja="loadingaja" />
      </q-card>
    </div>
  </div>
</template>

<script setup>

import MenuDokumen from './MenuDokumen.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingaja: {
    type: Boolean,
    default: false
  }
})

</script>

<style lang="scss" scoped>
.document-host,
.document-host__row,
.document-host__card {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.document-host,
.document-host__card {
  overflow: hidden;
}
</style>
