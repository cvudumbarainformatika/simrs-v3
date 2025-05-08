<template>
  <div class="q-pa-sm bg-white">
    <div class="f-18 text-weight-bold">
      Halaman restriksi fornas
    </div>
    <q-separator class="q-my-sm" />
    <app-table :columns="store.columns" :items="store.items" :meta="store.meta" :per-page="store.params.per_page"
      :loading="store.loading" :to-search="store.params.q" :default-btn="false" :ada-tambah="false" :ada-filter="false"
      force-paginasi @goto="store.setPage" @set-row="store.setPerPage" @refresh="store.refreshTable"
      @find="store.setSearch" @set-order="store.setOder">
      <template #header-left-after-search>
        <div class="row q-col-gutter-x-xs">
          <div class="col-auto">
            <q-checkbox class="q-mr-sm" v-model="store.fornas" label="Fornas saja" @update:model-value="store.getData"
              :disable="store.loading" />
          </div>
        </div>
        <div class="col-auto">
          <app-input-date-human :model="store.display.tgl" label="Tanggal Mulai Efektif" outlined />
        </div>
        <!-- anu -->
      </template>
      <template #col-obat>Obat</template>
      <template #col-jumlah>Jumah Restriksi</template>
      <template #col-kecuali>Kecuali Ruangan</template>
      <template #col-act>Aksi</template>
      <template #cell-obat="{ row }">
        <div style="min-width: 350px; white-space: normal !important;">
          <div class="row">
            {{ row?.nama_obat }}
          </div>
          <div class="row q-col-gutter-x-xs">
            <div class="col-auto f-10">
              ({{ row?.kd_obat }})
            </div>
            <div class="col-auto f-10 text-negative text-weight-bold">
              {{ row?.status_fornas ? 'Fornas' : '' }}
            </div>
          </div>
        </div>
      </template>
    </app-table>
  </div>
</template>
<script setup>
import { useRestriksiFornasStore } from 'src/stores/simrs/farmasi/restriksiFornas/restriksi'

const store = useRestriksiFornasStore()

store.getData()
</script>
