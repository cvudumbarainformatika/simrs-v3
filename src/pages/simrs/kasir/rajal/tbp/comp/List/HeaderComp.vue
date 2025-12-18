<template>
  <div class="row items-center justify-between q-pa-sm" :class="`${color} text-${textColor}`">
    <div class="row items-center col">
      <div class="q-mr-sm" style="width: 220px;">
        <q-input v-model="store.params.q" outlined dark color="white" dense placeholder="Cari TBP ..." debounce="500" />
      </div>
      <div class="q-mr-sm" style="width: 220px;">
        <q-select v-model="store.params.jenislayanan" :options="['SEMUA', 'RAJAL', 'RANAP']" label="Jenis Layanan" dense
          outlined dark color="white" emit-value map-options :update:model-value="store.getDataTbp()" />
      </div>
      <div class="q-mr-sm" style="width: 220px;">
        <app-input-date-human :model="store.tanggal.from" label="Dari Tanggal" dark color="white" dense outlined
          @db-model="setTo" @set-display="setToDisp" />
      </div>
      <div class="q-mr-sm" style="width: 220px;">
        <app-input-date-human :model="store.tanggal.to" label="Sampai Tanggal" dark color="white" dense outlined
          @db-model="setTox" @set-display="setToDispx" />
      </div>
    </div>
    <div class="row items-center justify-end col-auto">
      <q-btn color="red" dense icon="add" @click="emits('add')" />
      <!-- fullscreen -->
      <!-- <q-btn color="dark" :color="textColor" :icon="!fullscreen ? 'icon-mat-open_in_full' : 'icon-mat-close_fullscreen'"
        @click="emits('fullscreen')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Fullscreen
        </q-tooltip>
      </q-btn> -->
    </div>
  </div>
</template>
<script setup>
import { dateDbFormat } from 'src/modules/formatter';
import { useTbpKasirStore } from 'src/stores/simrs/kasir/tbp';


const store = useTbpKasirStore()

const emits = defineEmits(['add'])

const props = defineProps({
  color: {
    type: String,
    default: 'bg-primary'
  },
  textColor: {
    type: String,
    default: 'white'
  },
  search: {
    type: String,
    default: ''
  },
  perPage: { type: Number, default: 10 },
  tanggal: {
    type: String,
    default: dateDbFormat(new Date())
  },
  fullscreen: { type: Boolean, default: false },
  masterkasir: {
    type: Array,
    default: () => []
  }
})

function setToDisp(vaal) {
  store.tanggal.from = vaal
}

function setTo(val) {
  console.log('params.tgldari', val)
  store.params.tgldari = val
  store.getDataTbp()
  console.log('store.params.tgldari', store.params.tgldari)
}

function setToDispx(vaal) {
  store.tanggal.to = vaal
}

function setTox(val) {
  store.params.tglsampai = val
}
</script>
