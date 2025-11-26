<template>
  <div>
    <ListLoading v-if="loading" />
    <empty-data v-else-if="!items?.length && !loading" />
    <q-list v-else separator>
      <q-item v-for="(item, i) in items" :key="i">
        <!-- <pre>{{ item }}</pre> -->
        <!-- <q-item-section avatar v-if="item?.url === null || item?.url === ''">
          <q-img src="../../../../../assets/images/no-image.png" :key="item.url" style="width: 100px;">
            <div class="absolute-bottom">
              <div class="row items-center justify-between">
                <q-btn size="sm" color="dark" round icon="icon-mat-settings" unelevated @click="addgambar(item)">
                  <q-tooltip class="primary" :offset="[10, 10]">
                    Tambah Gambar
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-img>
        </q-item-section>
        <q-item-section avatar v-else>
          <q-img :src="getImg(item?.url)" :key="item.url" style="width: 100px;">
            <div class="absolute-bottom">
              <div class="row items-center justify-between">
                <q-btn class="gt-xs" size="md" color="yellow" flat dense round icon="icon-mat-visibility"
                  :href="pathImg + item.url" target="_blank" />

              </div>
            </div>
          </q-img>
        </q-item-section> -->

        <q-item-section class="col-auto">
          <q-item-label>
            <span class="text-weight-bold">{{ i + 1 }}.</span>
          </q-item-label>
        </q-item-section>
        <q-separator vertical class="q-mx-md" />
        <q-item-section>
          <q-item-label>
            No. Peminjaman : <span class="text-weight-bold text-red"> {{ item.notrans }}</span>
          </q-item-label>
          <q-item-label>
            No. Berkas : <span class="text-weight-bold">{{ item?.noarsip }}</span>
          </q-item-label>
          <q-item-label>
            Tgl Peminjaman : <span class="text-weight-bold">{{ humanDate(item.tgl) }}</span>
          </q-item-label>
        </q-item-section>
        <q-separator vertical class="q-mx-md" />
        <q-item-section class="q-col-gutter-xs">
          <q-item-label>
            Rencana Pengembalian : <span class="text-weight-bold">{{ humanDate(item.rencana_kembali) }}</span>
          </q-item-label>
          <q-item-label>
            Tgl Pengembalian : <span class="text-weight-bold">{{ humanDate(item.tgl_kembali) }}</span>
          </q-item-label>
        </q-item-section>
        <q-separator vertical class="q-mx-md" />
        <q-item-section class="q-col-gutter-xs">
          <q-item-label>
            Peminjam : <span class="text-weight-bold text-primary">{{ item.userpeminjam?.nama }}</span>
            <q-item-label>
              Petugas : <span class="text-weight-bold">{{ item.user?.nama }}</span>
            </q-item-label>
          </q-item-label>
        </q-item-section>
        <q-separator vertical class="q-mx-md" />
        <q-item-section class="q-col-gutter-xs">
          <q-item-label>
            Posisi Arsip : <span class="text-weight-bold text-accent">{{ flagingan(item?.flaging) }}</span>
            <q-item-label>
              Lokasi : <span class="text-weight-bold">{{ item.namacabinet }} || Laci : {{ item.laci }} || Map : {{
                item.posisimap }}
              </span>
            </q-item-label>
          </q-item-label>
        </q-item-section>
        <q-item-section class="q-col-gutter-xs">
          <q-btn rounded unelevated color="dark" glossy icon="icon-mat-print" @click="CetakData(item)">
            <q-tooltip class="primary" :offset="[10, 10]">Print</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
  </div>
  <PrintFormPeminjaman />
</template>

<script setup>
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
import { useUnitPengelolaharsippeminjamanStore } from 'src/stores/simrs/unitpengelolaarsip/peminjamanarsip';
import { humanDate } from 'src/modules/formatter';
import PrintFormPeminjaman from './PrintFormPeminjaman.vue';
const store = useUnitPengelolaharsippeminjamanStore()
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

function flagingan(val) {
  if (val === "1") {
    return 'Unit Pengolah Arsip'
  } else {
    return 'Record Center'
  }
}

function CetakData(item) {
  // store.loadingprint = true
  store.dataprint = item
  store.dialogprint = true
}
</script>
