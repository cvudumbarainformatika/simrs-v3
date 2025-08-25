<template>
  <div class="fit column">
    <div class="col-auto ">
      <div class="q-pa-md flex justify-between bg-teal text-white items-center">
        <div>{{ menu?.label }}</div>
      </div>
    </div>
    <div class="col full-height q-pa-md scroll">
      <!-- <ResumePage id="resume" ref="refResume" :pasien="pasien" :menu="menu" :key="pasien" /> -->
      <iframe :src="src" width="100%" height="100%" frameborder="0" style="min-height: 100vh;"></iframe>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed } from 'vue'

const refResume = ref()

// eslint-disable-next-line no-unused-vars
const printObj = {
  id: 'resume',
  popTitle: 'Resume Medis'

}

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  }
})

const src = computed(() => {
  const base = `http://192.168.11.1/kasir/ranap/billing.php?cmd=lihat&noreg=${props.pasien?.noreg}&flagbill=lihat`
  return base
})

</script>
