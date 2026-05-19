<template>
  <div class="full-height q-pa-sm">
    <div class="row q-col-gutter-x-xs full-height">
      <div class="col-6 full-height">
        <Formvisum :pasien="props.pasien" :loadingaja="props.loadingaja" tooltip="History Pasien (Shift + H)" />
      </div>

      <div class="col-6 full-height">
        <ListVisum :pasien="props.pasien" :loadingaja="props.loadingaja" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useVisumStore } from 'src/stores/simrs/igd/visum';
import Formvisum from './comp/Formvisum.vue';
import ListVisum from './comp/ListVisum.vue';

const store = useVisumStore()
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
