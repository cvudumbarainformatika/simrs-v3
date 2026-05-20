<template>
  <div class="flex-center">
    <div class="q-pa-sm row justify-between bg-teal text-white items-center">
      <div class="col-6">{{ props?.judul ?? 'Indikasi Masuk Ranap' }}</div>
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
      <div v-if="props?.pasien?.anamnesis?.length <= 0">
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
        <div id="printMe" style="width: 21cm;" class="q-pa-xs full-width full-height">
          <KopSurat :judul="props?.judul ?? 'Indikasi Masuk Ranap'" :pasien="props?.pasien" :jangantampil=false
            :kelas="props.kelas" />

          <Isiindikasimasuknicudaninter :pasien="props?.pasien" :isi="props.isi" :kelas="props.kelas"
            :keterangan="props.keterangan" :loading="props.loading" />
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
<script setup>
import { usePlannStore } from 'src/stores/simrs/igd/plann';
import KopSurat from '../../KopSurat.vue';
import Isiindikasimasuknicudaninter from './Isiindikasimasuknicudaninter.vue';
import html2pdf from 'html2pdf.js';
const store = usePlannStore()

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
  },
  isi: {
    type: Array,
    default: () => []
  },
  kelas: {
    type: Object,
    default: null
  },
  keterangan: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
})

function exportPdf() {
  const concern = document.getElementById('printMe')
  const nama = props?.pasien?.nama ?? props?.pasien?.pasien
  const pdfConfig = {
    margin: [12, 12, 12, 12],
    filename: 'Resume-Medis_' + props?.pasien?.noreg + '_' + nama + '_' + props?.pasien?.norm + '.pdf',
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
