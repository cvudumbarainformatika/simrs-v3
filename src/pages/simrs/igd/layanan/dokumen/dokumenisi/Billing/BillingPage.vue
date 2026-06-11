<template>
  <div class="q-pa-sm row flex justify-between bg-teal text-white items-center">
    <div class="col-6">{{ props?.judul }}</div>
    <div class="col-6 text-right">
      <q-btn flat dense size="md" icon="icon-mat-download" @click="exportPdf()">
        <q-tooltip class="primary" :offset="[10, 10]">
          Download
        </q-tooltip>
      </q-btn>
      <q-btn icon="icon-mat-print" flat dense size="md" v-print="printObj"> <q-tooltip class="primary"
          :offset="[10, 10]">
          Print
        </q-tooltip>
      </q-btn>
    </div>
  </div>
  <q-scroll-area style="height: calc(100vh - 56px);">
    <div v-if="!storebill.rekapBill && !storebill.loading">
      <div class="column flex-center">
        <app-no-data />
      </div>
    </div>
    <div v-else-if="storebill.loading">
      <div class="column flex-center">
        <app-loading />
      </div>
    </div>
    <div v-else>
      <div class="q-pa-none bg-grey-6" style="padding-bottom: 108px;">
        <div id="printMe" class="full-width bg-white q-px-md q-py-lg" style="min-height: 1060px;">
          <KopSurat class="" :judul="props?.judul" :pasien="props?.pasien" :jangantampil=false />
          <IsiBillingPage :pasien="props?.pasien" />
        </div>
      </div>
    </div>
  </q-scroll-area>
</template>
<script setup>
import { useKasirIgdStore } from 'src/stores/simrs/kasir/igd/kasirigd';
import KopSurat from '../../KopDokumen.vue';
import IsiBillingPage from './IsiBillingPage.vue';
import html2pdf from 'html2pdf.js';

const storebill = useKasirIgdStore()
const printObj = {
  id: 'printMe',
  popTitle: ' '
}

const props = defineProps({
  judul: {
    type: String,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  }
})

function exportPdf() {
  const concern = document.getElementById('printMe')
  const nama = props?.pasien?.nama ?? props?.pasien?.pasien
  const pdfConfig = {
    margin: [12, 12, 12, 12],
    filename: 'billing-' + props?.pasien?.noreg + '_' + nama + '_' + props?.pasien?.norm + '.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      logging: true,
      dpi: 192,
      letterRendering: true
    },
    jsPDF: {
      unit: 'mm', // mm | pt | in
      format: 'a4', // a4 | letter
      orientation: 'portrait' // landscape | portrait
    }
  }

  html2pdf().set(pdfConfig).from(concern).save()
}
</script>
<style lang="scss" scoped>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.b_double {
  border-bottom: 4px double rgb(30, 30, 30);
  padding-top: 8px;
}

.b1 {
  border-style: solid;
  border-width: 2px;
}

.b2 {
  border-right-style: solid;
  border-width: 2px;
}

.b3 {
  border-bottom-style: solid;
  border-width: 2px;
}

.b4 {
  border-right-style: solid;
  border-left-style: solid;
  border-width: 2px;
}

.b5 {
  border-left-style: solid;
  border-width: 2px;
}
</style>
