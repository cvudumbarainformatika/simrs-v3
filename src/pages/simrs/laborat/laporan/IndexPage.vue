<template>
  <q-page class="column no-wrap q-pa-sm">
    <!-- Fixed header - hapus margin bottom -->
    <div class="col-auto">
      <HeaderComp @set-periode="setPeriode" @refresh="refreshData" @print="printReport" />
    </div>

    <!-- Scrollable table container - tambahkan padding horizontal saja -->
    <div class="col relative-position">
      <q-scroll-area class="fit">
        <TableComp ref="tableRef" />
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const HeaderComp = defineAsyncComponent(() => import('./comp/HeaderComp.vue'))
const TableComp = defineAsyncComponent(() => import('./comp/TableComp.vue'))

const tableRef = ref(null)

function setPeriode(period) {
  console.log('Period changed:', period)
}

function refreshData() {
  console.log('Refreshing data...')
}

function printReport() {
  console.log('Printing report...')
}
</script>

<style lang="scss" scoped>
.q-page {
  height: calc(100vh - 100px);
}
</style>
