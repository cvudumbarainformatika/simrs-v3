<template>
  <div v-if="store.nosurat === null || store.nosurat === ''">
    <span class="text-bold text-h5"> Belum Ada Dokumen </span>
  </div>
  <div class="full-height full-height q-pa-sm" v-else>
    <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
      <q-tooltip class="primary" :offset="[10, 10]">
        Print
      </q-tooltip>
    </q-btn>
    <div id="printMe" style="width: 21cm;" class="q-pa-xs full-width full-height">
      <KopSurat :judul="props?.judul" :pasien="props?.pasien" :jangantampil=true />
      <IsiSuratKematianPage :pasien="props?.pasien" />
    </div>
  </div>
</template>
<script setup>
import KopSurat from '../../KopSurat.vue';
import IsiSuratKematianPage from './IsiSuratKematianPage.vue';
import { usePlannStore } from 'src/stores/simrs/igd/plann';

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
  }
})

store.suratkematian(props?.pasien)
</script>
