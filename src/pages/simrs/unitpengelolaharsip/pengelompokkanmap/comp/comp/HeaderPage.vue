<template>
  <div class="row justify-between items-center q-pa-sm bg-primary text-white">
    <div class="row items-center">
      <div>
        <q-input v-model="store.params.q" placeholder="Cari Arsip Dalam Map ..." dense outlined dark color="white"
          style="min-width:200px" debounce="800" :loading="store.loading" @update:model-value="store.search">
          <template #prepend>
            <q-icon name="icon-mat-search" />
          </template>
        </q-input>
      </div>
    </div>
    <div>
      <q-btn class="q-ml-sm" unelevated color="orange" flat size="sm" padding="xs" icon="icon-mat-add"
        @click="emits('tambaharsip')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Tambah Data
        </q-tooltip>
      </q-btn>
      <q-btn class="q-ml-sm" unelevated color="orange" flat size="sm" padding="xs" icon="icon-mat-refresh"
        @click="store.refresh">
        <q-tooltip class="primary" :offset="[10, 10]">
          Refresh Data
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
<script setup>
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap';

defineProps({
  hederdetail: {
    type: Array,
    default: () => []
  },
})
const store = useUnitPengelolaharsipMapStore()

const emits = defineEmits(['tambaharsip'])
</script>
