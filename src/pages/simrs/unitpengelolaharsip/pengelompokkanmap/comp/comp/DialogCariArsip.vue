<template>
  <q-dialog v-model="store.dialogtambaharsip" full-width>
    <q-card>
      <q-card-section>
        <div class="row bg-primary text-white q-pa-sm">
          <div class="col-6">
            <q-input v-model="storearsip.paramsdarimap.q" placeholder="Cari Arsip ..." dense outlined dark color="white"
              style="min-width:100px" debounce="800" :loading="storearsip.loadingmap"
              @update:model-value="storearsip.searchdarimap">
              <template #prepend>
                <q-icon name="icon-mat-search" />
              </template>
            </q-input>
          </div>
          <div class="col-6" v-if="users === '' || users === null">
            <q-select v-model="storearsip.paramsdarimap.bidangbagian" dense outlined :options="organisasi" color="white"
              dark label="Unit Pengelolah.." option-label="nama" option-value="kode" class="q-ml-xs" emit-value
              map-options style="min-width: 300px;" @update:model-value="getUnit" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div class="q-pb-xl">

          <q-list separator>
            <q-item v-for="(item, i) in arsipyangbelummasukmap" :key="i">
              <q-item-section class="q-col-gutter-xs">
                <q-item-label>
                  <span class="text-weight-bold">{{ item.noarsip }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-bold">{{ item.kodeklasifikasi }} || </span>
                  <span class="text-cyan text-weight-bold">{{ item?.namakelasifikasi }}</span>
                </q-item-label>
                <q-item-label>
                  Deskripsi : <span class="text-weight-bold">{{ item?.uraian ?? '-' }}</span>
                </q-item-label>
                <q-item-label>
                  Jenis Arsip : <span class=" text-weight-bold"><q-badge outline color="teal">{{ item?.ket ?? '-'
                      }}</q-badge></span>
                </q-item-label>
                <q-item-label>
                  Unit Pengelolah : <span class=" text-weight-bold"><q-badge outline color="accent">{{
                    item?.unitpengolah?.nama ?? '-'
                      }}</q-badge></span>
                </q-item-label>
              </q-item-section>
              <q-separator vertical class="q-mx-md" />
              <q-item-section class="q-col-gutter-xs">
                <q-item-label>
                  Lokasi : <span class="text-negative text-weight-bold">{{ item?.nama_lokasi ?? '-' }}</span>
                </q-item-label>
                <q-item-label>
                  No. Laciz :
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
                <q-item-label>
                  User : <span class=" text-weight-bold">{{ item?.user?.nama ?? '-' }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="q-gutter-sm">
                  <q-btn flat round size="sm" icon="icon-mat-send" color="white" class="bg-red"
                    :loading="store.formisi.noarsip === item.noarsip" @click="masukkanmap(item, i)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-separator />

      <q-card-actions align="right">
        <!-- <q-btn flat label="Decline" color="primary" v-close-popup /> -->
        <q-btn label="Tutup" color="primary" v-close-popup unelevated />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>
<script setup>

import { useUnitPengelolahArsipStore } from 'src/stores/simrs/unitpengelolaarsip/arsip';
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap';
import ListLoading from './ListLoading.vue';
import EmptyData from './EmptyData.vue';
import { dateFullFormat } from 'src/modules/formatter';
import { onMounted, watch } from 'vue';


const store = useUnitPengelolaharsipMapStore()
const storearsip = useUnitPengelolahArsipStore()

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  users: {
    type: [String, Object, null],
    default: ''
  },
  organisasi: {
    type: Array,
    default: () => []
  },
  arsipyangbelummasukmap: {
    type: Array,
    default: () => []
  },
})

function getUnit(val) {
  storearsip.paramsdarimap.bidangbagian = val
  storearsip.searchdarimap()
}

function masukkanmap(val, i) {
  store.simpanisimap(val)
}

onMounted(() => {
  storearsip.paramsdarimap.q = ''
  storearsip.paramsdarimap.bidangbagian = props.users
  storearsip.getDataarsip()
})

</script>
