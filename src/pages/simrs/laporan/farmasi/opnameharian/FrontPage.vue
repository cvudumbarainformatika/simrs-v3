<template>
  <div class="bg-white q-pa-xs">
    <!-- Modular Filter Page -->
    <FilterPage>
      <!-- Inject Slot Action Buttons from Parent -->
      <template #action-buttons>
        <q-btn class="q-mr-sm" v-print="printObj" unelevated color="dark" round size="sm" :disable="!!store.ketProses"
          icon="icon-mat-print">
          <q-tooltip class="primary" :offset="[10, 10]">
            Print
          </q-tooltip>
        </q-btn>
        <download-excel class="inline-block" :fields="store.fields" :data="store.filteredItems"
          :name="'Laporan Stok Opname ' + bulan() + ' ' + store.params.tahun + '.xls'">
          <q-btn color="green" round size="sm" icon="icon-mat-download" push
            :disable="!!store.ketProses || !store.filteredItems.length">
            <q-tooltip>Export Excel</q-tooltip>
          </q-btn>
        </download-excel>
      </template>
    </FilterPage>

    <!-- Print Area -->
    <div id="printMe">
      <!-- Modular Header Print -->
      <HeaderPrint />

      <div>
        <!-- Main Table Component -->
        <div ref="refScroll" class="q-pa-sm" v-scroll="onScroll">
          <TableComp />
        </div>
      </div>

      <!-- Modular Signature Page -->
      <SignaturePage ref="signatureRef" />
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
// Import Modular Components
import FilterPage from './comp/FilterPage.vue'
import HeaderPrint from './comp/HeaderPrint.vue'
import SignaturePage from './comp/SignaturePage.vue'
import { useLaporanStokHasrianFarmasiStore } from 'src/stores/simrs/laporan/farmasi/mutasififo/stokharian'

const store = useLaporanStokHasrianFarmasiStore()

const TableComp = defineAsyncComponent(() => import('./comp/TablePage.vue'))

// Refs
const refScroll = ref(null)
const signatureRef = ref(null) // Ref untuk mengakses komponen child signature

// Helpers
function bulan () {
  const bul = store.bulans.find(a => a.value === store.params.bulan)
  return bul?.nama ?? '-'
}

// function typeJenis() {
//   const bul = store.optionJenis.find(a => a.value === store.params.jenis)
//   return ' (' + bul?.nama + ')' ?? '-'
// }

// Scroll Handling
// Mengakses refTt dari komponen child SignaturePage
function onScroll (pos) {
  const ttHeight = signatureRef.value?.refTt?.clientHeight || 0
  const height = refScroll.value.clientHeight - (ttHeight + 30)
  const currPage = store.meta.current_page

  if ((store.meta.current_page < store.meta.last_page) && pos >= height) {
    if (!store.loadingNext && !store.ketProses) store.setPage(currPage + 1)
  }
}

// Print Config
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Persediaan Farmasi'
}
</script>

<style scoped>
/* Scoped styles jika ada */
</style>
