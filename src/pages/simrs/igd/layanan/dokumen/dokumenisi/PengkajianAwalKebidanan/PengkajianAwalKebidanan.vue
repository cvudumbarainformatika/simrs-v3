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
    <div v-if="props?.pasien?.anamnesekebidanan?.length <= 0">
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
    <div v-else class="q-pa-sm " style="padding-bottom: 108px;">
      <div id="printMe" class="q-pa-sm full-width bg-white">
        <KopDokumen :judul="props?.judul ?? 'PENGKAJIAN AWAL KEBIDANAN IGD'" :pasien="props?.pasien"
          :jangantampil=false />

        <IsiPengkajianAwalKebidanan :pasien="props?.pasien" />
      </div>
    </div>
  </q-scroll-area>
</template>
<script setup>

import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung';
import KopDokumen from './KopDokumen.vue';
import html2pdf from 'html2pdf.js';
import IsiPengkajianAwalKebidanan from './IsiPengkajianAwalKebidanan.vue';
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

async function exportPdf() {
  const source = document.getElementById('printMe')
  const nama = props?.pasien?.nama ?? props?.pasien?.pasien

  // A4 portrait width in px at screen resolution (~794px)
  const a4Width = 794

  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.left = '-9999px'
  wrapper.style.top = '0'
  wrapper.style.width = a4Width + 'px'
  wrapper.style.background = 'white'

  const clone = source.cloneNode(true)
  clone.style.width = a4Width + 'px'
  clone.style.height = 'auto'
  clone.style.overflow = 'visible'
  clone.style.maxHeight = 'none'
  clone.style.padding = '0px'
  clone.style.fontSize = '12px'
  clone.style.backgroundColor = '#ffffff'
  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  const pdfConfig = {
    margin: [5, 5, 5, 5],
    filename: 'Pengkajian-Awal-Kebidanan-IGD_' + props?.pasien?.noreg + '_' + nama + '_' + props?.pasien?.norm + '.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollY: 0,
      scrollX: 0,
      windowWidth: a4Width
    },
    pagebreak: { mode: ['css', 'legacy'] },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  }

  await html2pdf().set(pdfConfig).from(clone).save()
  document.body.removeChild(wrapper)
}
</script>
<style lang="scss" scoped></style>
