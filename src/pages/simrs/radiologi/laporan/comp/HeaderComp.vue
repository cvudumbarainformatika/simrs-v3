<template>
  <div class="bg-primary text-white q-pa-sm rounded-borders shadow-1">
    <div class="row items-center justify-between q-col-gutter-xs">
      <!-- Left side: Filter Periode, Jenis Pasien, Status (Inline 1 Baris) -->
      <div class="col-12 col-md-7">
        <div class="row items-center q-col-gutter-xs">
          <!-- Periode Tanggal -->
          <div class="col-12 col-sm-4">
            <q-btn outline color="white" class="bg-primary full-width justify-start" padding="xs sm" size="md" no-caps style="height: 40px;">
              <div class="flex items-center justify-between full-width">
                <div class="f-12 text-weight-medium text-white ellipsis">
                  {{ store.header.periode }}
                </div>
                <transition>
                  <q-icon :name="`${showMenuPeriode ? 'icon-mat-keyboard_arrow_up' : 'icon-mat-keyboard_arrow_down'}`"
                    size="18px" />
                </transition>
              </div>

              <q-menu @show="showMenuPeriode = true" @hide="showMenuPeriode = false">
                <div class="row no-wrap q-pa-sms">
                  <q-list style="min-width: 100px">
                    <q-item v-for="item in store.periods" :key="item" clickable :active="item === store.header.periode"
                      active-class="bg-primary text-white" :disable="item === 'Custom'" @click="store.setPeriode(item)">
                      <q-item-section>{{ item }}</q-item-section>
                    </q-item>
                  </q-list>
                  <q-separator vertical inset />

                  <div class="column">
                    <div class="row q-pa-sm q-col-gutter-sm">
                      <div class="col">
                        <q-date v-model="store.params.from" minimal bordered flat mask="YYYY-MM-DD"
                          @update:model-value="store.setPeriode('Custom')" />
                        <div class="f-10 text-grey-8 q-mt-xs">
                          DARI TANGGAL : <b>{{ store.params.from }}</b>
                        </div>
                      </div>
                      <div class="col">
                        <q-date v-model="store.params.to" minimal bordered flat mask="YYYY-MM-DD"
                          @update:model-value="store.setPeriode('Custom')" />
                        <div class="f-10 text-grey-8 q-mt-xs">
                          SAMPAI TANGGAL : <b>{{ store.params.to }}</b>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                    <div class="row q-pa-sm justify-end">
                      <q-btn v-close-popup color="primary" label="Terapkan" push size="sm" @click="onFilterData()" />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>

          <!-- Jenis Pasien (Rajal, Ranap, IGD, Luar) -->
          <div class="col-12 col-sm-4">
            <q-select v-model="store.params.jenis_pasien" :options="jenisPasienOptions" emit-value map-options outlined
              dense dark class="bg-primary" label="Jenis Pasien" @update:model-value="onFilterData" />
          </div>

          <!-- Status Pemeriksaan (Semua, Selesai, Belum Selesai) -->
          <div class="col-12 col-sm-4">
            <q-select v-model="store.params.status" :options="statusPemeriksaanOptions" emit-value map-options outlined
              dense dark class="bg-primary" label="Status" @update:model-value="onFilterData" />
          </div>
        </div>
      </div>

      <!-- Right side: Quick Search & Action Buttons (Inline Right) -->
      <div class="col-12 col-md-5">
        <div class="row items-center justify-end q-gutter-xs">
          <!-- Input Search -->
          <q-input v-model="store.params.q" placeholder="Cari..." outlined dense dark class="bg-primary col" style="max-width: 250px;"
            clearable @update:model-value="onSearchInput">
            <template #append>
              <q-icon name="icon-mat-search" />
            </template>
          </q-input>

          <!-- Dashboard Link -->
          <q-btn flat round dense color="white" icon="icon-mat-space_dashboard" to="/radiologi/dashboard">
            <q-tooltip>Dasbor Visual Radiologi</q-tooltip>
          </q-btn>

          <!-- Refresh -->
          <q-btn flat round dense color="white" icon="icon-mat-refresh" @click="store.getDataAll()">
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>

          <!-- Export Excel -->
          <q-btn flat round dense color="white" icon="icon-mat-download" :loading="store.loadingDownload"
            @click="store.exportToExcel()">
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
import { ref } from 'vue'

defineEmits(['openPrint'])

const store = useLaporanRadiologiStore()

const showMenuPeriode = ref(false)

const jenisPasienOptions = [
  { label: 'Semua Pasien', value: 'ALL' },
  { label: 'Rawat Jalan', value: 'Rajal' },
  { label: 'Rawat Inap', value: 'Ranap' },
  { label: 'IGD', value: 'IGD' },
  { label: 'Pasien Luar', value: 'Luar' }
]

const statusPemeriksaanOptions = [
  { label: 'Semua Status', value: 'ALL' },
  { label: 'Selesai', value: 'Selesai' },
  { label: 'Belum Selesai', value: 'Belum' }
]

let searchTimeout = null

function onSearchInput(val) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setSearch(val || '')
  }, 250)
}

function onFilterData() {
  store.getDataAll()
}
</script>
