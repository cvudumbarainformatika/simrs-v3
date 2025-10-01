<template>
  <q-card flat bordered class="q-pa-sm q-mb-sm">
    <div class="row q-pl-sm q-pt-xs">
      <div class="col-6">
        Nama Map : <q-span class="text-weight-bold">{{ store.itemsrinci[0]?.namamap }} </q-span>
      </div>
      <div class="col-6">
        Klasifikasi : <q-span class="text-weight-bold"> {{ store.itemsrinci[0]?.klasifikasi?.nama }} </q-span>
      </div>
    </div>

    <div class="row q-pl-sm">
      <div class="col-6">
        Keterangan : <q-span class="text-weight-bold">{{ store.itemsrinci[0]?.keterangan }}</q-span>
      </div>
      <div class="col-6">
        Unit Pengolah :
        <q-badge outline color="accent">{{ store.itemsrinci[0]?.unitpengolah?.nama }}</q-badge>
      </div>
    </div>

    <div class="row q-pl-sm">
      <div class="col-6">
        Tempat :
        <q-span class="text-weight-bold">
          <q-badge outline color="red">
            {{ store.itemsrinci[0]?.kabinet?.namacabinet }} ==> Laci {{ store.itemsrinci[0]?.laci }}
          </q-badge>
        </q-span>
      </div>
      <div class="col-6">
        Tahun : {{ store.itemsrinci[0]?.tahunMap }}
      </div>
    </div>
  </q-card>

  <div class="q-pb-xl">
    <ListLoading v-if="store.loadingrinci" />
    <empty-data v-else-if="!store.itemsrinci[0]?.rinciandalammap?.length && !store.loadingrinci" />
    <q-list v-else separator>
      <q-item v-for="(item, i) in store.itemsrinci[0]?.rinciandalammap" :key="i">
        <q-item-section avatar v-if="item?.dataarsip?.url === null || item?.dataarsip?.url === ''">
          <q-img src="../../../../../../assets/images/no-image.png" :key="item.url" style="width: 100px;">
            <!-- <div class="absolute-bottom">
                <div class="row items-center justify-between">
                  <q-btn size="sm" color="dark" round icon="icon-mat-settings" unelevated @click="addgambar(item)">
                    <q-tooltip class="primary" :offset="[10, 10]">
                      Tambah Gambar
                    </q-tooltip>
                  </q-btn>
                </div>
              </div> -->
          </q-img>
        </q-item-section>
        <q-item-section avatar v-else>
          <q-img :src="getImg(item?.dataarsip?.url)" :key="item.url" style="width: 100px;">
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
            <span class="text-weight-bold">{{ item?.dataarsip?.kode }} || </span>
            <span class="text-cyan text-weight-bold">{{ item?.dataarsip?.klasifikasi?.nama }}</span>
          </q-item-label>
          <q-item-label>
            Deskripsi : <span class="text-weight-bold">{{ item?.dataarsip?.uraian ?? '-' }}</span>
          </q-item-label>
          <q-item-label>
            Jenis Arsip : <span class=" text-weight-bold"><q-badge outline color="teal">{{ item?.dataarsip?.ket ?? '-'
                }}</q-badge></span>
          </q-item-label>
          <!-- <q-item-label>
            Unit Pengelolah : <span class=" text-weight-bold"><q-badge outline color="accent">{{
              store.itemsrinci[0]?.unitpengolah?.nama ?? '-'
                }}</q-badge></span>
          </q-item-label> -->
        </q-item-section>
        <q-separator vertical class="q-mx-md" />
        <q-item-section class="q-col-gutter-xs">
          <!-- <q-item-label>
              Lokasi : <span class="text-negative text-weight-bold">{{ item?.nama_lokasi ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              No. Laci :
              <span class="text-teal text-weight-bold"> {{ item?.nobox ?? '-' }}</span>
            </q-item-label> -->
          <q-item-label>
            Media :
            <span class="text-primary text-weight-bold"> {{ item?.dataarsip?.media?.nama_media ?? '-' }}</span>
          </q-item-label>
          <q-item-label>
            Tanggal : <i class="text-weight-bold text-green">{{ dateFullFormat(item?.dataarsip?.tanggal) }}</i>
          </q-item-label>
          <q-item-label>
            Keterangan : <span class="text-negative text-weight-bold">{{ item?.dataarsip?.keterangan ?? '-' }}</span>
          </q-item-label>
          <q-item-label>
            User : <span class=" text-weight-bold">{{ item?.dataarsip?.user?.nama ?? '-' }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <!-- <div class="q-gutter-sm">
              <q-btn flat round size="sm" icon="icon-mat-edit" @click="editForm(item)" />
            </div> -->
        </q-item-section>
      </q-item>
    </q-list>
  </div>

</template>

<script setup>
import { pathImg } from 'src/boot/axios'
// eslint-disable-next-line no-unused-vars
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'

import { dateFullFormat, formatJam } from 'src/modules/formatter'
import { date } from 'quasar';
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap';
import { onMounted } from 'vue';

const emits = defineEmits(['terimapasien', 'bukalayanan', 'kirimcasmix'])
const store = useUnitPengelolaharsipMapStore()


// const PageLayananIgd = defineAsyncComponent(() => import('src/pages/simrs/igd/layanan/PageLayananIgd.vue'))
// const pasien = ref(null)
// function bukaLayanan(item) {
//   pasien.value = item
//   store.pageLayanan = true
//   // store.setTerima(item)
// }



const getImg = (file) => {
  const spl = file.split('.')
  const ext = spl[spl?.length - 1]
  // console.log(ext)

  if (ext === 'pdf') {
    return new URL('../../../../../../assets/images/PDF_file_icon.png', import.meta.url).href
  }
  else {
    return pathImg + file
  }
}

// onMounted(() => {
//   store.getrincianmap()
// })

</script>
