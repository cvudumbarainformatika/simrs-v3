<template>
  <div class="row full-width justify-center">
    <div class="q-pa-sm" style="width:25%">
      <app-autocomplete v-model="store.reqs.jenisrka" label="Pilih Jenis RKA" autocomplete="value" option-label="label"
        option-value="value" outlined :source="store.jenisrka" :disable="store.loading" :loading="store.loading"
        @update:model-value="(val) => {
          console.log('value', val)
          store.datarka = []
          store.datarkapergeseran = []
        }" />
    </div>
    <div class="q-pa-sm" style="width:25%">
      <app-input v-model="store.reqs.tahun" label="Tahun" debounce="500" outlined @update:model-value="(val) => {
        console.log('Tahun berapa?', val)
        store.getDataBidang()
        store.reqs.bidang = ''
        store.reqs.kegiatan = ''
      }" />
    </div>
    <div class="q-pa-sm" style="width:25%">
      <app-autocomplete v-model="store.reqs.bidang" label="Pilih Bidang" autocomplete="bidang" option-label="bidang"
        option-value="kodebidang" outlined :source="store.bidangs" :disable="store.loading" :loading="store.loading"
        @selected="(val) => {
          const arr = store.bidangs
          const obj = arr?.length ? arr.find(x => x.kodebidang === val) : null
          store.reqs.kodebidang = obj?.kodebidang ?? ''
          store.reqs.kegiatan = ''
          console.log('kode bidang', store.reqs.kodebidang)
          store.filterKegiatan()
        }" />
    </div>
    <div class="q-pa-sm" style="width:25%">
      <app-autocomplete v-model="store.reqs.kegiatan" label="Pilih Kegiatan" autocomplete="kegiatan"
        option-label="kegiatan" option-value="kodekegiatan" outlined :source="store.kegiatans" :disable="store.loading"
        :loading="store.loading" @selected="(val) => {
          const arr = store.kegiatans
          const obj = arr?.length ? arr.find(x => x.kodekegiatan === val) : null
          const kegiatan = obj?.kegiatan
          store.kegiatanblud = kegiatan
          store.namapptk = obj?.namapptk
          store.kodepptk = obj?.kodepptk
        }" />
    </div>
    <!-- <div class="q-pa-sm" style="width:25%">
      <app-input-date-human :model="store.tglcetak" label="Tanggal Cetak" outlined :disable="store.loading"
        @set-display="setTglcetak" />
    </div> -->
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
    <div class="q-pa-sm">
      <!-- <download-excel
      class="btn"
      :fields="store.fields"
      :fetch="store.getDataBukubesar"
      :before-generate="store.startDownload"
      :before-finish="store.finishDownload"
      :name="'Buku Besar ' + store.reqs.tahun +'.xls'"
    > -->
      <q-btn icon="icon-mat-download" color="green" round size="sm" push :disable="store.loading"
        :loading="store.loading" @click="store.exportExcel = !store.exportExcel">
        <q-tooltip class="bg-green" :offset="[10, 10]">
          Export to Excel
        </q-tooltip>
      </q-btn>
      <!-- </download-excel> -->
    </div>
  </div>
  <cetak-rka v-model="store.dialogCetak" :printrka="printrka" />
</template>
<script setup>
import { useQuasar } from 'quasar'
import { useRkaStore } from 'src/stores/siasik/anggaran/storerka'
// eslint-disable-next-line no-unused-vars
import { defineAsyncComponent, onBeforeMount, onMounted, ref, watchEffect } from 'vue'

const CetakRka = defineAsyncComponent(() => import('../printRka/PrintDataRKA.vue'))
const store = useRkaStore()
const $q = useQuasar()

onBeforeMount(() => {
  // store.getDataBidang()
  store.emptyForm()
})
onMounted(() => {
  store.getDataBidang()
})
// Model berdasarkan ref agar tidak updte
// const berdasar = ref('')
function setTglcetak(val) {
  store.tglcetak = val
}
function ambilData() {
  if (store.reqs.tahun === '') {
    $q.notify({
      message: 'Tahun tidak boleh kosong',
      color: 'negative',
      icon: 'icon-mat-warning'
    })
    return
  }
  if (store.reqs.bidang === '' || store.reqs.kegiatan === '') {
    $q.notify({
      message: 'Bidang atau Kegiatan tidak boleh kosong',
      color: 'negative',
      icon: 'icon-mat-warning'
    })
    return
  }
  if (store.reqs.jenisrka === '') {
    $q.notify({
      message: 'Silahkan Pilih Jenis RKA',
      color: 'negative',
      icon: 'icon-mat-warning'
    })
    return

  }
  if (store.reqs.jenisrka !== '' && store.reqs.jenisrka === '1') {
    store.getAnggaran()
  }


  if (store.reqs.jenisrka !== '' && store.reqs.jenisrka === '2') {
    // store.datarkaperubahan = []
    store.datarkapergeseran = []
    store.getAnggaranPergeseran()
  }
  if (store.reqs.jenisrka !== '' && store.reqs.jenisrka === '3') {
    store.datarkaperubahan = []
    // store.datarkapergeseran = []
    store.getAnggaranPergeseran()
  }
  // if (store.reqs.jenisrka !== '' && store.reqs.jenisrka === '3') {
  //   store.mapingDataperubahan()
  // }


  console.log('ambil Data', store.reqs.jenisrka)


}
const printrka = ref(null)
function cetakData() {
  store.dialogCetak = true
}

// const jenisData = (val) => {
//   console.log('jenisData', val)
//   if (val === '1') {
//     return store.kodeakun
//   }
//   else if (val === '2') {
//     console.log('kode2', store.kodekelompok)
//     return store.kodekelompok
//   }
//   else if (val === '3') {
//     console.log('kode3', store.kodejenis)
//     return store.kodejenis
//   }
// }
function exportToExcel(tableId, filename) {
  // const el = document.getElementById(tableId)
  // const filenames = filename ? filename + '.xls' : 'KartuStokFarmasi.xls'
  // const columns = store.items
  // const content = [columns.map(col => wrapCsvValue(col.label))].concat(
  //   rows.map(row => columns.map(col => wrapCsvValue(
  //     typeof col.field === 'function'
  //       ? col.field(row)
  //       : row[col.field === void 0 ? col.name : col.field],
  //     col.format,
  //     row
  //   )).join(','))
  // ).join('\r\n')

  // const status = exportFile(
  //   'table-export.csv',
  //   content,
  //   'text/csv'
  // )
  // console.log('mulai export', el?.parentElement)
  $q.notify({
    message: 'Masih dibuatkan ... harap tunggu',
    color: 'negative',
    icon: 'icon-mat-warning'
  })
}

watchEffect(() => {
  if (store.exportExcel) {
    // console.log('store.exportExcel', store.exportExcel)
    exportToExcel('tableItem', 'KartuStokFarmasi')
  }
})
</script>
