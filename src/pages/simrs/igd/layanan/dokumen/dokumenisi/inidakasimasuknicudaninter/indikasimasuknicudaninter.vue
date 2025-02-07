<template>
  <div class="full-height full-height q-pa-sm">
    <div id="printMe" style="width: 21cm;" class="q-pa-xs full-width full-height">
      <KopSurat :judul="props?.judul" :pasien="props?.pasien" :jangantampil=false />

      <Isiindikasimasuknicudaninter :pasien="props?.pasien" />
    </div>
  </div>
</template>
<script setup>
import { usePlannStore } from 'src/stores/simrs/igd/plann';
import KopSurat from '../../KopSurat.vue';
import Isiindikasimasuknicudaninter from './Isiindikasimasuknicudaninter.vue';
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

store.indikasimasuknicuinter(props.pasien)
</script>
