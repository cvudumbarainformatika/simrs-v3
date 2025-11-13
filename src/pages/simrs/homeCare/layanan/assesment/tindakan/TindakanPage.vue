<template>
  <div class="full-height full-width">
    <div class="row full-height">
      <q-card flat bordered square class="col-6 full-height">
        <div class="column full-height">
          <div class="col-12">
            <FormTindakan ref="reffForm" :pasien="props.pasien" />
          </div>
        </div>
      </q-card>
      <div class="col-6 full-height ">
        <div class="column full-height">
          <div class="col">
            <TindakanTable :key="pasien" :pasien="props.pasien" />
          </div>
          <!-- <div class="col-6">
            <SimulasiPage :pasien="props.pasien" />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import FormTindakan from './comp/FormTindakan.vue'
// import TindakanTable from './comp/TindakanTable.vue'
// import SimulasiPage from './SimulasiPage.vue'
// import { useLayananPoli } from 'src/stores/simrs/pelayanan/poli/layanan'
// const store = useLayananPoli()

import { defineAsyncComponent, ref } from 'vue'
const FormTindakan = defineAsyncComponent(() => import('./comp/FormTindakan.vue'))
const TindakanTable = defineAsyncComponent(() => import('./comp/TindakanTable.vue'))
const reffForm = ref()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
// console.log('tindakan', props.pasien)
</script>
