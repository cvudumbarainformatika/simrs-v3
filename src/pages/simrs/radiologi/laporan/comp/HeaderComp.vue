<template>
  <div class="bg-primary text-white q-pa-sm rounded-borders shadow-1">
    <div class="row items-center justify-between q-col-gutter-sm">
      <!-- Left side: Filters -->
      <div class="col-12 col-md-9">
        <div class="row q-col-gutter-sm items-center">
          <!-- Filter Periode Tanggal -->
          <div class="col-12 col-sm-3">
            <q-input
              v-model="store.params.from"
              type="date"
              label="Tgl Awal"
              outlined
              dense
              dark
              class="bg-primary"
              @update:model-value="onFilterChange"
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-input
              v-model="store.params.to"
              type="date"
              label="Tgl Akhir"
              outlined
              dense
              dark
              class="bg-primary"
              @update:model-value="onFilterChange"
            />
          </div>

          <!-- Filter Dokter -->
          <div class="col-12 col-sm-3">
            <q-select
              v-model="store.params.dokter"
              :options="store.dokters"
              option-value="kode"
              option-label="nama"
              emit-value
              map-options
              label="Dokter"
              outlined
              dense
              dark
              class="bg-primary"
              :loading="store.loadingDokter"
              @update:model-value="onDokterChange"
            />
          </div>

          <!-- Filter Jenis Pasien -->
          <div class="col-12 col-sm-3">
            <q-select
              v-model="store.params.jenis_pasien"
              :options="jenisPasienOptions"
              emit-value
              map-options
              label="Jenis Pasien"
              outlined
              dense
              dark
              class="bg-primary"
              @update:model-value="onJenisPasienChange"
            />
          </div>
        </div>
      </div>

      <!-- Right side: Quick Search & Actions -->
      <div class="col-12 col-md-3">
        <div class="row items-center justify-end q-gutter-xs">
          <!-- Input Search -->
          <q-input
            v-model="store.params.q"
            placeholder="Cari Pasien / Tindakan..."
            outlined
            dense
            dark
            class="bg-primary col"
            clearable
            @update:model-value="onSearchInput"
          >
            <template #append>
              <q-icon name="icon-mat-search" />
            </template>
          </q-input>

          <!-- Refresh -->
          <q-btn flat round dense color="white" icon="icon-mat-refresh" @click="store.getData()">
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>

          <!-- Export Excel -->
          <q-btn
            flat
            round
            dense
            color="white"
            icon="icon-mat-download"
            :loading="store.loadingDownload"
            @click="store.exportToExcel()"
          >
            <q-tooltip>Export Excel (.xlsx)</q-tooltip>
          </q-btn>

          <!-- Print -->
          <q-btn flat round dense color="white" icon="icon-mat-print" @click="$emit('openPrint')">
            <q-tooltip>Cetak Laporan</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

defineEmits(['openPrint'])

const store = useLaporanRadiologiStore()

const jenisPasienOptions = [
  { label: 'Semua Jenis', value: 'ALL' },
  { label: 'Rawat Jalan', value: 'Rajal' },
  { label: 'Rawat Inap', value: 'Ranap' },
  { label: 'IGD', value: 'IGD' }
]

let searchTimeout = null

function onFilterChange() {
  store.getData()
}

function onDokterChange(val) {
  store.setDokter(val)
}

function onJenisPasienChange(val) {
  store.setJenisPasien(val)
}

function onSearchInput(val) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setSearch(val || '')
  }, 250)
}
</script>
