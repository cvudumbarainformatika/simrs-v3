<template>
  <div class="flex-center">
    <div class="q-pa-sm row justify-between bg-teal text-white items-center">
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
      <div v-if="props?.pasien?.laboratold?.length <= 0">
        <div class="column flex-center">
          <div>
            <app-no-data />
          </div>
        </div>
      </div>
      <div v-else-if="store.loadingTerima">
        <div class="column flex-center">
          <app-loading />
        </div>
      </div>
      <div v-else>
        <div class="q-pa-none bg-grey-6" style="padding-bottom: 108px;">
          <div id="printMe" class="full-width bg-white q-px-md q-py-lg" style="min-height: 1060px;">
            <KopSurat :judul="props?.judul" :pasien="props?.pasien" :jangantampil=false />
            <IsiLaboratPage :pasien="props?.pasien" />
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import KopSurat from '../../KopSurat.vue';
import IsiLaboratPage from './IsiLaboratPage.vue';
import html2pdf from 'html2pdf.js';
import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung';
import { usePengunjungPoliStore } from 'src/stores/simrs/pelayanan/poli/pengunjung';


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

const store = computed(() =>
  props?.pasien?.kdpoli === 'POL014'
    ? usePengunjungIgdStore()
    : usePengunjungPoliStore()
)


// const obatRef = ref(0);
// const returobatRef = ref(0);

// const totalakhir = computed(() => {
//   const returobat = returobatRef.value.returobat?.total ?? 0;
//   const obat = obatRef.value.rincianobat?.total ?? 0;
//   const total = parseInt(obat) - parseInt(returobat);
//   return total
// })

function exportPdf() {
  const concern = document.getElementById('printMe')
  const nama = props?.pasien?.nama ?? props?.pasien?.pasien
  const pdfConfig = {
    margin: 0,
    filename: 'LABORAT_' + props?.pasien?.noreg + '_' + nama + '_' + props?.pasien?.norm + '.pdf',
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
