<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />
      <empty-data v-else-if="!items.length && !loading" />
      <q-list v-else separator>
        <q-item v-for="(item, i) in items" :key="i">
          <q-item-section avatar>
            <q-img :src="getImg(item?.url)" :key="item.url" style="width: 100px;">
              <div class="absolute-bottom">
                <div class="row items-center justify-between">
                  <q-btn class="gt-xs" size="md" color="yellow" flat dense round icon="icon-mat-visibility"
                    :href="pathImg + item.url" target="_blank" />

                </div>
              </div>
            </q-img>
          </q-item-section>

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
            <q-item-label>
              Jenis Arsip : <span class=" text-weight-bold"><q-badge outline color="teal">{{ item?.ket ?? '-'
              }}</q-badge></span>
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
            <q-item-label>
              Keterangan : <span class="text-negative text-weight-bold">{{ item?.keterangan ?? '-' }}</span>
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
import { pathImg } from 'src/boot/axios'
// eslint-disable-next-line no-unused-vars
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'

import { dateFullFormat, formatJam } from 'src/modules/formatter'

const emits = defineEmits(['terimapasien', 'bukalayanan', 'kirimcasmix'])


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

const getImg = (file) => {
  const spl = file.split('.')
  const ext = spl[spl.length - 1]
  // console.log(ext)

  if (ext === 'pdf') {
    return new URL('../../../../../assets/images/PDF_file_icon.png', import.meta.url).href
  }
  else {
    return pathImg + file
  }
}

</script>
