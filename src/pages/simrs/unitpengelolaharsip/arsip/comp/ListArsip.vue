<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />
      <empty-data v-else-if="!items.length && !loading" />
      <q-list v-else separator>
        <q-item v-for="(item, i) in items" :key="i">
          <!-- <q-item-section avatar>
            <app-avatar-pasien :pasien="item" />
          </q-item-section> -->

          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              <span class="text-weight-bold">{{ item.noarsip }}</span>
            </q-item-label>
            <q-item-label>
              <span class="text-weight-bold">{{ item.kodeklasifikasi }} || </span>
              <span class="text-cyan text-weight-bold">{{ item?.namakelasifikasi }}</span>
            </q-item-label>
            <q-item-label>
              Uraian : <span class="text-negative text-weight-bold">{{ item?.uraian ?? '-' }}</span>
            </q-item-label>
          </q-item-section>
          <q-separator vertical class="q-mx-md" />
          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              Lokasi : <span class="text-negative text-weight-bold">{{ item?.nama_lokasi ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              No. Box :
              <span class="text-teal text-weight-bold"> {{ item?.nobox ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              Media :
              <span class="text-primary text-weight-bold"> {{ item?.nama_media ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              Tanggal : <i class="text-weight-bold text-green">{{ dateFullFormat(item.tanggal) }}</i>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <!-- layanan -->
    <!-- <page-layanan-igd
      v-model="store.pageLayanan"
      :pasien="pasien"
    /> -->
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
// import { defineAsyncComponent, ref } from 'vue'
import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung'
import { dateFullFormat, formatJam } from 'src/modules/formatter'

const emits = defineEmits(['terimapasien', 'bukalayanan', 'kirimcasmix'])
const store = usePengunjungIgdStore()

// const PageLayananIgd = defineAsyncComponent(() => import('src/pages/simrs/igd/layanan/PageLayananIgd.vue'))
// const pasien = ref(null)
// function bukaLayanan(item) {
//   pasien.value = item
//   store.pageLayanan = true
//   // store.setTerima(item)
// }

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

function colortriage(val) {
  if (val === 'Resusitasi') {
    return 'red'
  }
  else if (val === 'P1') {
    return 'deep-orange'
  }
  else if (val === 'P2') {
    return 'yellow-7'
  }
  else if (val === 'P3') {
    return 'green'
  }
  else {
    return 'black'
  }
}
</script>
