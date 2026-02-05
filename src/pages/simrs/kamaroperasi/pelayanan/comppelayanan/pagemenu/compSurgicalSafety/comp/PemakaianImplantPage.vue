<template>
  <div class="row bg-white">
    <div class=" col fit">
      <div class="full-height columm q-col-gutter-x-xs">
        <div class="">
          <Info :pasien="pasien" />
          <q-separator class="q-my-sm" size="2px" />
        </div>
        <div class=" ">
          <div class="q-px-sm">
            <div class="row ">
              <div class="text-bold f-14 q-mr-sm">Pemakaian Implant </div>
            </div>
            <q-separator class="q-my-sm" size="1px" />

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'


const Info = defineAsyncComponent(() => import('./InfoPasienPage.vue'))
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
</script>
