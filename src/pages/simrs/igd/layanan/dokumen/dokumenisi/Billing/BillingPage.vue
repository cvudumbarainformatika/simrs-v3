<template>
  <div class="full-height full-height q-pa-sm">
    <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
      <q-tooltip class="primary" :offset="[10, 10]">
        Print
      </q-tooltip>
    </q-btn>
    <div id="printMe" style="width: 21cm;" class="q-pa-xs full-width">
      <KopSurat :judul="props?.judul" :pasien="props?.pasien" />

      <IsiBillingPage :pasien="props?.pasien" />
    </div>
  </div>
</template>
<script setup>
import KopSurat from '../../KopSurat.vue';
import IsiBillingPage from './IsiBillingPage.vue';

const printObj = {
  id: 'printMe',
  popTitle: ' '
}

const props = defineProps({
  judul: {
    type: Object,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  }
})
</script>
