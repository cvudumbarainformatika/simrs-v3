<template>
  <!--
    <q-page class="q-pa-sm q-mb-xl">
      <div>
      <app-card :is-header="false">
        <template #content>
          <CustomTable id="printMe" :columns="store.columns" :meta="store.meta" :items="store.items"
            :per-page="store.params.per_page" :loading="store.loading" :to-search="store.params.nmtindakan"
            :enable-head="false" left-btn @goto="store.setPage" @set-row="store.setPerPage"
            @refresh="store.refreshTable" @find="store.setSearch" @new-data="store.newData" @edit-data="store.editData"
            @delete="store.deletesData">
            <template #top-row>
              <th>
                <div class="row items-center text-weight-bold">
                  Kode
                </div>
              </th>
              <th>
                <div class="row items-center text-weight-bold">
                  Nama
                </div>
              </th>
              <th>
                <div class="row items-center justify-center text-weight-bold garis-bawah">
                  Kelas 3
                </div>
                <div class="row items-center text-weight-bold">
                  <div class="col-3">
                    JS
                  </div>
                  <div class="col-3">
                    JP
                  </div>
                  <div class="col-3">
                    HP
                  </div>
                  <div class="col-3">
                    Tarif
                  </div>
                </div>
              </th>
              <th>
                <div class="row items-center justify-center text-weight-bold garis-bawah">
                  Kelas 2
                </div>
                <div class="row items-center text-weight-bold">
                  <div class="col-3">
                    JS
                  </div>
                  <div class="col-3">
                    JP
                  </div>
                  <div class="col-3">
                    HP
                  </div>
                  <div class="col-3">
                    Tarif
                  </div>
                </div>
              </th>
              <th>
                <div class="row items-center justify-center text-weight-bold garis-bawah">
                  Kelas 1
                </div>
                <div class="row items-center text-weight-bold">
                  <div class="col-3">
                    JS
                  </div>
                  <div class="col-3">
                    JP
                  </div>
                  <div class="col-3">
                    HP
                  </div>
                  <div class="col-3">
                    Tarif
                  </div>
                </div>
              </th>
              <th>
                <div class="row items-center justify-center text-weight-bold garis-bawah">
                  Utama
                </div>
                <div class="row items-center text-weight-bold">
                  <div class="col-3">
                    JS
                  </div>
                  <div class="col-3">
                    JP
                  </div>
                  <div class="col-3">
                    HP
                  </div>
                  <div class="col-3">
                    Tarif
                  </div>
                </div>
              </th>
              <th>
                <div class="row items-center justify-center text-weight-bold garis-bawah">
                  VIP
                </div>
                <div class="row items-center text-weight-bold">
                  <div class="col-3">
                    JS
                  </div>
                  <div class="col-3">
                    JP
                  </div>
                  <div class="col-3">
                    HP
                  </div>
                  <div class="col-3">
                    Tarif
                  </div>
                </div>
              </th>
              <th>
                <div class="row items-center justify-center text-weight-bold garis-bawah">
                  VVIP
                </div>
                <div class="row items-center text-weight-bold">
                  <div class="col-3">
                    JS
                  </div>
                  <div class="col-3">
                    JP
                  </div>
                  <div class="col-3">
                    HP
                  </div>
                  <div class="col-3">
                    Tarif
                  </div>
                </div>
              </th>
              <th>
                <div class="row items-center justify-end text-weight-bold">
                  #
                </div>
              </th>
            </template>
<template #cell-kode="{ row }">
              {{ row.kdtindakan }}
            </template>
<template #cell-nama="{ row }">
              {{ row.nmtindakan }}
            </template>
<template #cell-kelas3="{ row }">
              <div class="row no-wrap q-col-gutter-md">
                <div class="col-3 text-right">
                  {{ row.js3 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.jp3 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.habispake3 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.tarif3 }}
                </div>
              </div>
            </template>
<template #cell-kelas2="{ row }">
              <div class="row no-wrap q-col-gutter-md">
                <div class="col-3 text-right">
                  {{ row.js2 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.jp2 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.habispake2 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.tarif2 }}
                </div>
              </div>
            </template>
<template #cell-kelas1="{ row }">
              <div class="row no-wrap q-col-gutter-md">
                <div class="col-3 text-right">
                  {{ row.js1 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.jp1 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.habispake1 }}
                </div>
                <div class="col-3 text-right">
                  {{ row.tarif1 }}
                </div>
              </div>
            </template>
<template #cell-utama="{ row }">
              <div class="row no-wrap q-col-gutter-md">
                <div class="col-3 text-right">
                  {{ row.jsutama }}
                </div>
                <div class="col-3 text-right">
                  {{ row.jputama }}
                </div>
                <div class="col-3 text-right">
                  {{ row.habispakeutama }}
                </div>
                <div class="col-3 text-right">
                  {{ row.tarifutama ?? 0 }}
                </div>
              </div>
            </template>
<template #cell-vip="{ row }">
              <div class="row no-wrap q-col-gutter-md">
                <div class="col-3 text-right">
                  {{ row.jsvip }}
                </div>
                <div class="col-3 text-right">
                  {{ row.jpvip }}
                </div>
                <div class="col-3 text-right">
                  {{ row.habispakevip }}
                </div>
                <div class="col-3 text-right">
                  {{ row.tarifvip }}
                </div>
              </div>
            </template>
<template #cell-vvip="{ row }">
              <div class="row no-wrap q-col-gutter-md">
                <div class="col-3 text-right">
                  {{ row.jsvvip }}
                </div>
                <div class="col-3 text-right">
                  {{ row.jpvvip }}
                </div>
                <div class="col-3 text-right">
                  {{ row.habispakevvip }}
                </div>
                <div class="col-3 text-right">
                  {{ row.tarifvvip }}
                </div>
              </div>
            </template>
</CustomTable>
</template>
</app-card>
</div>
</q-page>
-->
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
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
import FormDialog from './comp/FormDialog.vue'
import { useMasterTindakanJsJpStore } from 'src/stores/simrs/master/tindakan/tindakan'

const HeaderComp = defineAsyncComponent(() => import('./comp/CompHeader.vue'))
const TableComp = defineAsyncComponent(() => import('./comp/CompTable.vue'))
const BottomComp = defineAsyncComponent(() => import('./comp/CompBottom.vue'))

const store = useMasterTindakanJsJpStore()
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
