<template>
  <q-dialog persistent transition-show="slide-up" transition-hide="slide-down" @show="lihatData">
    <q-card style="width: 700px; max-width: 80vw;" class="fit bg-grey-4 text-dark">
      <div class="absolute-top bg-grey-5 full-width z-top flex items-center justify-between q-px-sm">
        <div>Dokumen Radiologi</div>
        <q-btn dense flat icon="icon-mat-close" :size="'md'" v-close-popup>
          <q-tooltip class="bg-white text-primary">
            Close
          </q-tooltip>
        </q-btn>
      </div>

      <q-card-section style="max-height: 90vh;" class="fit scroll">
        <DataPrint id="printMe" :item="props.item" :pasien="props.pasien" :key="props.item.id" />
      </q-card-section>
      <q-card-section class="q-pa-none bg-primary text-white absolute-bottom full-width">
        <div class="q-pa-md row justify-between items-center">
          <div><q-btn label="Tutup" color="dark" text-color="white" @click="" /></div>
          <div>
            <q-btn v-print="printObj" label="Print" color="yellow-3" text-color="dark" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import DataPrint from './DataPrint.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  item: {
    type: Object,
    default: null
  }
})

const lihatData = () => {
  console.log('lihat data', props.item);
  console.log('lihat data', props.pasien);

}

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'CETAK RADIOLOGI',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}
</script>
