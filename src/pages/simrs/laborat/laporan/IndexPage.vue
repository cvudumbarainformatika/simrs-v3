<template>
  <q-page class="container--q-header q-pa-sm">
    <div class="column full-height">
      <div class="col-auto header">
        <div>
          <HeaderComp @set-periode="setPeriode" @refresh="refreshData" @print="printReport" />
        </div>
      </div>
      <div class="col full-height relative-position">
        <div class="absolute-top full-height scroll">
          <TableComp ref="tableRef" />
        </div>
      </div>
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
// .q-page {
//   height: calc(100% - 140px);
// }</style>
