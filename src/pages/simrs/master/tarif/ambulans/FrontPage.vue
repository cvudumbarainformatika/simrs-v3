<template>
  <div class="column">
    <div class="col-auto fixed-top" style="z-index:1; margin-top: 50px; margin-left: 55px; ">
      <HeaderComp :search="store.params.q" :per-page="store.params.per_page" :params="store.params"
        :loading-bpjs="store.loadingBpjs" @set-tanggal="(val) => store.setDate(val)" @set-search="store.setSearch"
        @set-row="store.setPerPage" @refresh="store.refreshTable" @get-data="store.getDataTable"
        @new-data="store.newData" />
    </div>
    <div class="col" style="margin-bottom: 60px; margin-top:60px; ">
      <TableComp :key="store.items" :items="store.items" :loading="store.loading" :params="store.params"
        :polis="store?.polis" :ruang-ranap="store.ruangRanap" @edit-data="store.editData" @delete="store.deletesData"
        @undelete="store.undeletesData" />
    </div>
    <div class="fixed-bottom" style="margin-left: 55px;">
      <BottomComp v-if="store.meta !== null" :key="store.meta" :meta="store.meta" @go-to="store.setPage" />
    </div>
    <FormDialog v-model="store.isOpen" />
  </div>
  <!-- <app-maintenance /> -->
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
import { useMasterTarifAmbulanStore } from 'src/stores/simrs/master/tarif/ambulan'

const FormDialog = defineAsyncComponent(() => import('./comp/FormDialog.vue'))
const HeaderComp = defineAsyncComponent(() => import('./comp/CompHeader.vue'))
const TableComp = defineAsyncComponent(() => import('./comp/CompTable.vue'))
const BottomComp = defineAsyncComponent(() => import('./comp/CompBottom.vue'))

const store = useMasterTarifAmbulanStore()
store.getInitialData()
</script>

<style lang="scss" scoped>
.garis-bawah {
  border-bottom: 1px solid black;
}

.garis-kiri-kanan {
  border-left: 1px solid black;
  border-right: 1px solid black;
}
</style>
