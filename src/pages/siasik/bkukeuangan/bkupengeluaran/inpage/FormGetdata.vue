<template>
  <div class="row full-width justify-first">
    <div class="q-pa-sm" style="width:25%">
      <app-autocomplete v-model="store.params.bulan" label="Pilih Bulan" autocomplete="nama" option-label="nama"
        option-value="value" outlined :source="store.bulans" />
    </div>
    <div class="q-pa-sm" style="width:25%">
      <app-input v-model="store.params.tahun" label="Tahun" outlined />
    </div>
    <div class="q-pa-sm">
      <app-btn label="Ambil Data" :disable="store.loading" :loading="store.loading" @click="ambilData()" />
    </div>
    <div class="q-pa-sm">
      <q-btn icon="icon-mat-print" color="orange" round size="sm" :disable="store.loading" :loading="store.loading"
        @click="cetakData()">
        <q-tooltip class="bg-orange" :offset="[10, 10]">
          Cetak
        </q-tooltip>
      </q-btn>
    </div>
  </div>
  <cetak-bku v-model="store.dialogCetak" :printpdf="printpdf" />
</template>

<script setup>
import { useLaporanBkuPengeluaranStore } from 'src/stores/siasik/laporan/bku/bkupengeluaran';
import { defineAsyncComponent, ref } from 'vue';

const CetakBku = defineAsyncComponent(() => import('./CetakData.vue'))
const printpdf = ref(null)
const store = useLaporanBkuPengeluaranStore()
function ambilData() {
  // store.hitungharidalamBulan();
  store.getDataTable()
}
function cetakData() {
  store.dialogCetak = true
}
</script>
