<template>
  <div class="fit column">
    <div class="col-auto ">
      <div class="q-pa-md flex justify-between bg-teal text-white items-center">
        <div>{{ menu?.label }}</div>
        <q-btn icon="icon-mat-print" flat dense size="md" v-print="printObj" />
      </div>
    </div>
    <div class="col full-height q-pa-md scroll flex flex-center">
      <SkriningPage v-if="pasien?.summarydischargeplannings?.at(-1)" id="resume" ref="refResume" :pasien="pasien"
        :menu="menu" :data-header="dataHeader" />
      <div v-else class="text-center text-grey-6 q-pa-xl bg-white rounded-borders border-panel shadow-1"
        style="max-width: 500px;">
        <q-icon name="icon-my-file_sign" size="64px" class="q-mb-sm text-indigo-10" />
        <div class="text-bold text-subtitle1 text-indigo-10">Belum Ada Dokumen</div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const SkriningPage = defineAsyncComponent(() => import('./SkriningPage.vue'))

const refResume = ref()

const printObj = {
  id: 'resume',
  popTitle: 'Resume Medis'

}

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Array,
    default: null
  }
})

</script>
