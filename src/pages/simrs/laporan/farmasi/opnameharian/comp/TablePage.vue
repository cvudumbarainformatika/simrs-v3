<template>
  <div class="table-container">
    <!-- Tampilan Layar (Virtual Scroll) -->
    <div class="print-hide h-full">
      <q-virtual-scroll ref="virtualScrollRef" type="table" style="height: 100%;" :items="store.filteredItems"
        :virtual-scroll-item-size="40" :virtual-scroll-sticky-size-start="40" class="virtual-scroll-table">
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th style="width: 4%">No</th>
              <th style="width: 10%">Kode Obat</th>
              <th style="width: 40%">Nama Obat</th>
              <th style="width: 8%">Satuan</th>
              <th style="width: 9.5%" class="text-right">Awal</th>

              <th style="width: 9.5%" class="text-right cursor-pointer" @click="sortBy('masuk_qty')">
                <div class="row items-center justify-end no-wrap">
                  Masuk
                  <q-icon :name="getSortIcon('masuk_qty')" size="14px" class="q-ml-xs"
                    :class="{ 'text-yellow': store.filters.sort.by === 'masuk_qty' }" />
                </div>
              </th>

              <th style="width: 9.5%" class="text-right cursor-pointer" @click="sortBy('keluar_qty')">
                <div class="row items-center justify-end no-wrap">
                  Keluar
                  <q-icon :name="getSortIcon('keluar_qty')" size="14px" class="q-ml-xs"
                    :class="{ 'text-yellow': store.filters.sort.by === 'keluar_qty' }" />
                </div>
              </th>

              <th style="width: 9.5%" class="text-right cursor-pointer" @click="sortBy('sisa_qty')">
                <div class="row items-center justify-end no-wrap">
                  Akhir
                  <q-icon :name="getSortIcon('sisa_qty')" size="14px" class="q-ml-xs"
                    :class="{ 'text-yellow': store.filters.sort.by === 'sisa_qty' }" />
                </div>
              </th>
            </tr>
          </thead>
        </template>

        <template v-slot:default="{ item: row, index }">
          <tr :key="index" :class="index % 2 === 0 ? 'even' : 'odd'">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ row.kd_obat }}</td>
            <td>
              <div>{{ row.nama_obat }}</div>
              <div class="text-caption text-grey-8 f-10">{{ row.nama_108 }} ({{ row.kode_108 }})</div>
            </td>
            <td class="text-center">{{ row.satuan_k }}</td>

            <td class="text-right">{{ formatNumber(row.awal_qty) }}</td>
            <td class="text-right">{{ formatNumber(row.masuk_qty) }}</td>
            <td class="text-right">{{ formatNumber(row.keluar_qty) }}</td>
            <td class="text-right font-bold">{{ formatNumber(row.sisa_qty) }}</td>
          </tr>
        </template>

        <template v-slot:after v-if="store.loading">
          <tr>
            <td colspan="8" class="text-center q-pa-md">
              <q-spinner-dots color="primary" size="2em" />
              <div class="q-mt-xs">Memuat data...</div>
            </td>
          </tr>
        </template>

        <template v-slot:after v-else-if="!store.loading && !store.filteredItems.length">
          <tr>
            <td colspan="8" class="text-center q-pa-md">
              <div class="column flex-center text-grey-6">
                <q-icon name="warning" size="2em" class="q-mb-sm" />
                Data tidak ditemukan
              </div>
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </div>

    <!-- Tampilan Cetak (Full Table) -->
    <div class="print-only">
      <table class="styled-table">
        <thead>
          <tr>
            <th width="5%">No</th>
            <th>Kode Obat</th>
            <th>Nama Obat</th>
            <th>Satuan</th>
            <th class="text-right">Awal</th>
            <th class="text-right">Masuk</th>
            <th class="text-right">Keluar</th>
            <th class="text-right">Akhir</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in store.filteredItems" :key="index" :class="index % 2 === 0 ? 'even' : 'odd'">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ row.kd_obat }}</td>
            <td>
              <div>{{ row.nama_obat }}</div>
              <div class="text-caption text-grey-8 f-10">{{ row.nama_108 }} ({{ row.kode_108 }})</div>
            </td>
            <td class="text-center">{{ row.satuan_k }}</td>

            <td class="text-right">{{ formatNumber(row.awal_qty) }}</td>
            <td class="text-right">{{ formatNumber(row.masuk_qty) }}</td>
            <td class="text-right">{{ formatNumber(row.keluar_qty) }}</td>
            <td class="text-right font-bold">{{ formatNumber(row.sisa_qty) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useLaporanStokHasrianFarmasiStore } from 'src/stores/simrs/laporan/farmasi/mutasififo/stokharian'

const store = useLaporanStokHasrianFarmasiStore()

// Sort helper
function sortBy (col) {
  if (store.filters.sort.by === col) {
    store.filters.sort.dir = store.filters.sort.dir === 'desc' ? 'asc' : 'desc'
  } else {
    store.filters.sort.by = col
    store.filters.sort.dir = 'desc'
  }
}

function getSortIcon (col) {
  if (store.filters.sort.by !== col) return 'unfold_more'
  return store.filters.sort.dir === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

function formatNumber (val) {
  if (!val) return '0'
  const num = parseFloat(val)
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1, minimumFractionDigits: 0 }).format(num)
}
</script>

<style scoped lang="scss">
.h-full {
  height: 100%;
}

.table-container {
  height: calc(100vh - 200px);
}

.wrap-text {
  white-space: normal;
  word-wrap: break-word;
}

.cursor-pointer {
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #3b5066 !important;
  }
}

@media print {
  .table-container {
    height: auto !important;
    overflow: visible !important;
  }

  /* Prevent header overlap on new pages */
  .styled-table thead {
    display: table-row-group;
  }

  /* Perkecil font saat print agar muat banyak */
  .styled-table {
    font-size: 0.65em;
    /* Lebih kecil dari default 0.85em */
  }

  .f-8 {
    font-size: 8px;
  }
}

.virtual-scroll-table {
  width: 100%;

  :deep(table) {
    width: 100%;
    table-layout: fixed;
    /* Force fixed layout */
    border-collapse: collapse;
    font-size: 0.85em;
  }

  :deep(.thead-sticky tr > th) {
    background-color: #2c3e50;
    color: white;
    position: sticky;
    top: 0;
    z-index: 3;
    /* Increased z-index */
    padding: 8px;
    border: none;
    box-shadow: inset 0 0 0 1px #34495e;
    font-weight: 600;
  }

  :deep(tbody tr.even) {
    background-color: #f8f9fa;
  }

  :deep(tbody tr.odd) {
    background-color: #ffffff;
  }

  :deep(tbody tr:hover) {
    background-color: #e8f4fd;
  }

  :deep(tbody td) {
    padding: 6px 8px;
    border: 1px solid #dee2e6;
    vertical-align: middle;
  }
}

/* Print Only Table Styles */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;

  thead th {
    background-color: #eee;
    color: black;
    padding: 8px;
    border: 1px solid black;
    font-weight: 600;
  }

  tbody td {
    padding: 6px 8px;
    border: 1px solid black;
    vertical-align: middle;
  }
}

.font-bold {
  font-weight: bold;
}

@media screen {
  .print-only {
    display: none;
  }
}

@media print {
  .print-hide {
    display: none;
  }

  .print-only {
    display: block;
  }
}
</style>
