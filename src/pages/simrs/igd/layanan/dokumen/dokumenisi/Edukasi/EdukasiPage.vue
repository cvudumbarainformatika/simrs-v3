<template>
  <div v-if="store?.loadingTerima">
    <app-loading />
  </div>
  <div v-else-if="!pasien?.edukasi?.length && !store.loadingTerima">
    <app-no-data />
  </div>
  <div v-else class="" style="max-width: 100%">
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
      <div class="q-pa-sm bg-indigo-1" style="padding-bottom: 240px;">
        <div id="printMe" style="width: 21cm;" class="q-pa-xs full-width bg-white">
          <EdukasiPage :pasien="props?.pasien" :menu="menu" :data-header="dataHeader" />
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
<script setup>

import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung';

import html2pdf from 'html2pdf.js';
import { computed } from 'vue';
import { usePengunjungPoliStore } from 'src/stores/simrs/pelayanan/poli/pengunjung';
import EdukasiPage from 'src/pages/simrs/ranap/layanan/dokumen/edukasi/EdukasiPage.vue';

const menu = {
  title: 'EDUKASI PASIEN'
}

const dataHeader = [
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
  'RSUD DOKTER MOHAMMAD SALEH',
  'Jalan Mayjend Panjaitan No.65 Telp : (0335) 433119,421118 Fax. (0335) 432705',
  'e-mail : rsudprob@probolinggokota.go.id',
  'PROBOLINGGO 67219'
]

// const store = usePengunjungIgdStore()

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
    filename: 'Edukasi_Pasien' + props?.pasien?.noreg + '_' + nama + '_' + props?.pasien?.norm + '.pdf',
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
