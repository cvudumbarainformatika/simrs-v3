<template>
  <div class="column full-height q-ma-sm">

    <!-- HEADER -->
    <div class="q-pa-md bg-primary text-white text-weight-bold text-subtitle1">
      LAPORAN DAFTAR BERKAS ARSIP
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">

          <div class="col-12 col-md-3">
            <q-select v-model="store.params.tahunDari" :options="tahunOptions" outlined dense label="Tahun Dari"
              emit-value map-options />
          </div>

          <div class="col-12 col-md-3">
            <q-select v-model="store.params.tahunSampai" :options="tahunOptions" outlined dense label="Tahun Sampai"
              emit-value map-options />
          </div>

          <div class="col-12 col-md-2">
            <q-select v-model="store.params.inactive" :options="inactiveOptions" outlined dense emit-value map-options
              label="Status" />
          </div>

          <div class="col-auto">
            <q-btn color="primary" icon="search" label="Tampilkan" unelevated @click="getData"
              :loading="store.loading" />
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" icon="refresh" label="Reset" flat @click="resetFilter" />
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- HASIL -->
    <q-card flat bordered class="q-mt-md col">
      <q-table flat bordered :rows="store.items" :columns="columns" row-key="id" :loading="store.loading"
        hide-pagination :pagination="{ rowsPerPage: 0 }" separator="cell">
        <template #top>
          <div class="text-subtitle1 text-weight-bold">
            Data Arsip
          </div>

          <q-space />

          <q-chip color="primary" text-color="white" icon="folder">
            {{ store.items.length }} Berkas
          </q-chip>
        </template>

        <!-- Nomor -->
        <template #body-cell-no="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <!-- Umur Berkas -->
        <template #body-cell-kodeklasifikasi="props">
          <q-td :props="props" class="text-center">
            <q-badge color="blue">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <!-- Status Arsip -->
        <template #body-cell-status_arsip="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'AKTIF'
              ? 'positive'
              : 'negative'">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <!-- Unit Pengolah -->
        <template #body-cell-unitpengolah="props">
          <q-td :props="props">
            {{ props.value || '-' }}
          </q-td>
        </template>

        <!-- Kabinet -->
        <template #body-cell-kabinet="props">
          <q-td :props="props">
            {{ props.value || '-' }}
          </q-td>
        </template>

      </q-table>
    </q-card>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLaporandataberkasarsip } from 'src/stores/simrs/laporan/arsip/laporandataberkasarsip/laporandataberkasarsip'

const store = useLaporandataberkasarsip()

const tahunSekarang = new Date().getFullYear()

const tahunOptions = Array.from(
  { length: 20 },
  (_, i) => ({
    label: String(tahunSekarang - i),
    value: String(tahunSekarang - i)
  })
)

const inactiveOptions = [
  { label: 'SEMUA', value: '' },
  { label: 'AKTIF', value: 'AKTIF' },
  { label: 'INAKTIF', value: 'INAKTIF' }
]

const columns = [
  { name: 'no', label: 'No', align: 'center' },
  { name: 'namamap', label: 'Nama Berkas', field: 'namamap', align: 'left' },
  { name: 'kodeklasifikasi', label: 'Kode Klasifikasi', field: 'kodeklasifikasi', align: 'center' },
  { name: 'keterangan_kode', label: 'Klasifikasi', field: 'keterangan_kode', align: 'left' },
  {
    name: 'unitpengolah',
    label: 'Unit Pengolah',
    field: row => row.unitpengolah?.nama ?? '-',
    align: 'left'
  },
  {
    name: 'kabinet',
    label: 'Kabinet',
    field: row => row.kabinet?.namacabinet ?? '-',
    align: 'left'
  },
  {
    name: 'created_at',
    label: 'Tanggal Buat Berkas',
    field: row =>
      new Date(row.created_at).toLocaleString('id-ID'),
    align: 'center'
  },
  { name: 'status_arsip', label: 'Status', field: 'status_arsip', align: 'center' }
]

function getData() {
  store.getData()
}

function resetFilter() {
  store.params.tahunDari = String(tahunSekarang)
  store.params.tahunSampai = String(tahunSekarang)
  store.params.inactive = ''

  store.getData()
}

onMounted(() => {
  store.params.tahunDari = store.params.tahunDari || String(tahunSekarang)
  store.params.tahunSampai = store.params.tahunSampai || String(tahunSekarang)
  store.params.inactive = store.params.inactive || ''

  store.getData()
})
</script>
