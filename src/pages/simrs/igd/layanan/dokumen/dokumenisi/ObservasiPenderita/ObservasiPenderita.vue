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
    <div v-if="props?.pasien?.tinjauanulang?.length <= 0">
      <div class="column full-height flex-center">
        <div>
          <app-no-data />
        </div>
      </div>
    </div>
    <div v-else-if="store.loadingTerima">
      <div class="column full-height flex-center">
        <app-loading />
      </div>
    </div>
    <div v-else class="q-pa-sm">
      <div id="printMe" class="q-pa-lg bg-white print-area">
        <KopSurat :judul="props?.judul ?? 'Observasi Penderita'" :pasien="props?.pasien" :jangantampil="false" />

        <IsiObservasiPenderita :pasien="props?.pasien" />
      </div>
    </div>
  </q-scroll-area>
</template>
<script setup>

import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung';
import KopSurat from '../../KopSurat.vue';
import html2pdf from 'html2pdf.js';
import IsiObservasiPenderita from './IsiObservasiPenderita.vue';

const store = usePengunjungIgdStore()

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
  const element = document.getElementById('printMe')
  const nama = props?.pasien?.nama ?? props?.pasien?.pasien

  const opt = {
    margin: [5, 5, 5, 5], // 🔥 kecilin margin biar luas

    filename:
      'ObservasiPenderita_' +
      props?.pasien?.noreg +
      '_' +
      nama +
      '.pdf',

    image: {
      type: 'jpeg',
      quality: 1
    },

    html2canvas: {
      scale: 1.5,       // 🔥 jangan 2 (biar gak shrink)
      useCORS: true,
      scrollX: 0,
      scrollY: 0
    },

    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape'
    }
  }

  html2pdf().set(opt).from(element).save()
}
</script>
<style scoped>
.print-area {
  width: 100%;
  margin: 0;
  font-size: 11px;
  /* 🔥 sedikit dibesarin */
}

/* tabel biar gak ngelebar liar */
.print-area .q-table {
  width: 100%;
  table-layout: fixed;
}

.print-area .q-table th,
.print-area .q-table td {
  padding: 2px 4px;
  word-break: break-word;
  white-space: normal;
}

/* biar tidak overflow */
#printMe {
  overflow: hidden;
}
</style>
