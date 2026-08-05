<template>
  <q-page class="q-pa-sm column no-wrap" style="height: 100%;">
    <!-- Header Filter -->
    <HeaderComp @open-print="openCetakDialog" />

    <!-- Summary Cards -->
    <SummaryCards class="q-mt-sm" />

    <!-- Tabs -->
    <div class="row no-wrap q-mt-sm q-mb-xs" style="flex: 0 0 auto;">
      <q-tabs
        v-model="store.activeTab"
        dense
        align="left"
        active-color="primary"
        indicator-color="primary"
        class="full-width bg-white shadow-1 rounded-borders"
        narrow-indicator
      >
        <q-tab name="global" no-caps>
          <div class="row items-center q-gutter-xs">
            <q-icon name="icon-mat-bar_chart" size="16px" />
            <span>Rekap Global</span>
            <q-badge
              v-if="store.rekapGlobal.length"
              :label="store.rekapGlobal.length"
              color="primary"
              rounded
              floating
            />
          </div>
        </q-tab>
        <q-tab name="dokter" no-caps>
          <div class="row items-center q-gutter-xs">
            <q-icon name="icon-mat-person_search" size="16px" />
            <span>Per Dokter</span>
            <q-badge
              v-if="store.rekapDokter.length"
              :label="store.rekapDokter.length"
              color="teal"
              rounded
              floating
            />
          </div>
        </q-tab>
        <q-tab name="detail" no-caps>
          <div class="row items-center q-gutter-xs">
            <q-icon name="icon-mat-format_list_bulleted" size="16px" />
            <span>Detail Pasien</span>
            <q-badge
              v-if="store.detailItems.length"
              :label="store.detailItems.length"
              color="orange"
              rounded
              floating
            />
          </div>
        </q-tab>
      </q-tabs>
    </div>

    <!-- Tab Content -->
    <div class="col column no-wrap overflow-hidden">
      <!-- Loading Overlay -->
      <q-inner-loading :showing="store.loading" color="primary" />

      <!-- Rekap Global -->
      <div v-if="store.activeTab === 'global'" class="full-height">
        <TableGlobalComp />
      </div>

      <!-- Per Dokter -->
      <div v-else-if="store.activeTab === 'dokter'" class="full-height">
        <TablePerDokterComp />
      </div>

      <!-- Detail Pasien -->
      <div v-else-if="store.activeTab === 'detail'" class="full-height">
        <TableDetailComp />
      </div>
    </div>

    <!-- Dialog Cetak -->
    <CetakLaporanDialog ref="cetakRef" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

// Lazy load komponen untuk performa optimal
const HeaderComp = defineAsyncComponent(() => import('./comp/HeaderComp.vue'))
const SummaryCards = defineAsyncComponent(() => import('./comp/SummaryCards.vue'))
const TableGlobalComp = defineAsyncComponent(() => import('./comp/TableGlobalComp.vue'))
const TablePerDokterComp = defineAsyncComponent(() => import('./comp/TablePerDokterComp.vue'))
const TableDetailComp = defineAsyncComponent(() => import('./comp/TableDetailComp.vue'))
const CetakLaporanDialog = defineAsyncComponent(() => import('./comp/CetakLaporanDialog.vue'))

const store = useLaporanRadiologiStore()
const cetakRef = ref(null)

function openCetakDialog() {
  cetakRef.value?.open()
}

onMounted(async () => {
  // Load master dokter dan data awal secara paralel
  await Promise.all([
    store.fetchMasterDokter(),
    store.getData()
  ])
})
</script>
