<template>
  <q-page class="arsip-page column no-wrap q-pa-sm">
    <div class="q-pa-md bg-primary text-white text-weight-bold text-subtitle1">
      LAPORAN DAFTAR BERKAS ARSIP
    </div>

    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">

          <div class="col-12 col-md-3">
            <q-select v-model="store.params.tahunDari" :options="tahunOptions" outlined dense label="Tahun Dari"
              emit-value map-options @update:model-value="onChangeStatus" />
          </div>

          <div class="col-12 col-md-3">
            <q-select v-model="store.params.tahunSampai" :options="tahunOptions" outlined dense label="Tahun Sampai"
              emit-value map-options @update:model-value="onChangeStatus" />
          </div>

          <div class="col-12 col-md-2">
            <q-select v-model="store.params.inactive" :options="inactiveOptions" outlined dense emit-value map-options
              label="Status" @update:model-value="onChangeStatus" />
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

    <q-card flat bordered class="q-mt-md table-card">
      <q-table flat bordered class="arsip-table" :rows="store.items" :columns="columns" row-key="id"
        :loading="store.loading" separator="cell" hide-pagination :pagination="{ rowsPerPage: 0 }">
        <template #top>
          <div class="text-subtitle1 text-weight-bold">
            Data Arsip
          </div>

          <q-space />

          <q-btn color="green" icon="description" label="Export Excel" unelevated no-caps class="q-mr-sm"
            :disable="!store.items.length" @click="exportExcel" />

          <q-chip color="primary" text-color="white" icon="folder">
            {{ store.items.length }} Berkas
          </q-chip>
        </template>

        <template #body-cell-no="props">
          <q-td :props="props" class="text-center">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <template #body-cell-kodeklasifikasi="props">
          <q-td :props="props" class="text-center">
            <q-badge color="blue">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-jumlah_berkas="props">
          <q-td :props="props" class="text-center">
            <q-badge color="purple">
              {{ props.value || 0 }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-retensiaktif="props">
          <q-td :props="props" class="text-center">
            {{ props.value || 0 }} Tahun
          </q-td>
        </template>

        <template #body-cell-retensiinaktif="props">
          <q-td :props="props" class="text-center">
            {{ props.value || 0 }} Tahun
          </q-td>
        </template>

        <template #body-cell-created_at="props">
          <q-td :props="props" class="text-center">
            {{ formatTanggal(props.row.created_at) }}
          </q-td>
        </template>

        <template #body-cell-status_arsip="props">
          <q-td :props="props" class="text-center">
            <q-badge :color="props.value === 'AKTIF' ? 'positive' : 'negative'">
              {{ props.value || '-' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-unitpengolah="props">
          <q-td :props="props">
            {{ props.value || '-' }}
          </q-td>
        </template>

        <template #body-cell-kabinet="props">
          <q-td :props="props">
            {{ props.value || '-' }}
          </q-td>
        </template>

      </q-table>
    </q-card>


  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { date } from 'quasar'
import { useLaporandataberkasarsip } from 'src/stores/simrs/laporan/arsip/laporandataberkasarsip/laporandataberkasarsip'
import * as XLSX from 'xlsx'

const store = useLaporandataberkasarsip()

const tahunSekarang = new Date().getFullYear()

const tahunOptions = Array.from({ length: 20 }, (_, i) => {
  const tahun = tahunSekarang - i
  return {
    label: String(tahun),
    value: String(tahun)
  }
})

const inactiveOptions = [

  { label: 'AKTIF', value: 'AKTIF' },
  { label: 'INAKTIF', value: 'INAKTIF' }
]

const columns = computed(() => {
  if (store.params.inactive === 'INAKTIF') {
    return [
      { name: 'no', label: 'No', align: 'center', style: 'width:60px' },
      { name: 'noberkas', label: 'No. Berkas', field: 'id', align: 'center', style: 'width:60px' },
      {
        name: 'akhir_retensi_inaktif',
        label: 'Akhir Retensi Inaktif',
        field: 'akhir_retensi_inaktif',
        align: 'center',
        style: 'min-width:180px'
      },
      {
        name: 'klasifikasi', label: 'Klasifikasi', field: row =>
          `${row.keterangan_kode || '-'} (${row.kodeklasifikasi || '-'})`, align: 'left', style: 'min-width:350px; max-width:350px'
      },
      { name: 'tanggalbuatberkas', label: 'Kurun Waktu ', field: 'tahunMap', align: 'center', style: 'min-width:100px' },
      { name: 'jumlah_berkas', label: 'Jumlah Item', field: 'rinciandalammap_count', align: 'center' },
      { name: 'retensiaktif', label: 'Retensi Aktif', field: 'retensi', align: 'left', style: 'min-width:500px' },
      { name: 'retensiinaktif', label: 'Retensi Inaktif', field: 'retensi_inaktif', align: 'left', style: 'min-width:500px' },
      {
        name: 'unitpengolah',
        label: 'Unit Pengolah',
        field: row => row.unitpengolah?.nama ?? '-',
        align: 'left',
        style: 'min-width:220px'
      },

      { name: 'status_arsip', label: 'Status', field: 'status_arsip', align: 'center', style: 'min-width:140px' }
    ]
  }

  return [
    { name: 'no', label: 'No', align: 'center', style: 'width:60px' },
    { name: 'noberkas', label: 'No. Berkas', field: 'id', align: 'center', style: 'width:60px' },
    { name: 'namamap', label: 'Nama Berkas', field: 'namamap', align: 'left', style: 'min-width:300px' },
    {
      name: 'klasifikasi', label: 'Klasifikasi', field: row =>
        `${row.keterangan_kode || '-'} (${row.kodeklasifikasi || '-'})`, align: 'left', style: 'min-width:350px; max-width:350px'
    },
    { name: 'tanggalbuatberkas', label: 'Kurun Waktu', field: 'tahunMap', align: 'center', style: 'min-width:100px' },
    { name: 'jumlah_berkas', label: 'Jumlah Item', field: 'rinciandalammap_count', align: 'center' },
    { name: 'retensiaktif', label: 'Retensi Aktif', field: 'retensi', align: 'left', style: 'min-width:500px' },
    { name: 'retensiinaktif', label: 'Retensi Inaktif', field: 'retensi_inaktif', align: 'left', style: 'min-width:500px' },
    { name: 'penyelesaian_akhir', label: 'Penyelesaian Akhir', field: 'penyelesaian_akhir', align: 'left', style: 'min-width:500px' },
    {
      name: 'unitpengolah',
      label: 'Unit Pengolah',
      field: row => row.unitpengolah?.nama ?? '-',
      align: 'left',
      style: 'min-width:220px'
    },

    { name: 'status_arsip', label: 'Status', field: 'status_arsip', align: 'center', style: 'min-width:140px' }
  ]
})

function formatTanggal(value) {
  if (!value) return '-'
  return date.formatDate(new Date(value), 'DD/MM/YYYY HH:mm')
}

function getData() {
  store.getData()
}

function resetFilter() {
  store.params.tahunDari = String(tahunSekarang)
  store.params.tahunSampai = String(tahunSekarang)
  store.params.inactive = ''

  store.getData()
}

function exportExcel() {
  const status = String(store.params.inactive || '').toUpperCase()
  const isInaktif = status === 'INAKTIF'

  const rows = store.items.map((row, index) => {
    const retensiAktif = row.klasifikasi?.retensi ?? row.retensi ?? 0
    const retensiInaktif = row.klasifikasi?.retensi_inaktif ?? row.retensi_inaktif ?? 0

    const akhirRetensiInaktif =
      row.akhir_retensi_inaktif ??
      (
        Number(row.tahunMap || 0) +
        Number(retensiAktif || 0) +
        Number(retensiInaktif || 0)
      )

    const baseRow = {
      No: index + 1,
      'No. Berkas': row.id ?? '-',
      'Nama Berkas': row.namamap ?? '-',
      Klasifikasi: `${row.keterangan_kode || '-'} (${row.kodeklasifikasi || '-'})`,
      'Kurun Waktu': row.tahunMap ?? '-',
      'Jumlah Item': row.rinciandalammap_count ?? row.rinciandalammap?.length ?? 0,
      'Retensi Aktif': `${retensiAktif || 0} Tahun`,
      'Retensi Inaktif': `${retensiInaktif || 0} Tahun`,
      'Unit Pengolah': row.unitpengolah?.nama ?? '-',
      Status: row.status_arsip ?? '-'
    }

    if (isInaktif) {
      return {
        No: baseRow.No,
        'No. Berkas': baseRow['No. Berkas'],
        'Akhir Retensi Inaktif': akhirRetensiInaktif || '-',
        Klasifikasi: baseRow.Klasifikasi,
        'Kurun Waktu': baseRow['Kurun Waktu'],
        'Jumlah Item': baseRow['Jumlah Item'],
        'Retensi Aktif': baseRow['Retensi Aktif'],
        'Retensi Inaktif': baseRow['Retensi Inaktif'],
        'Unit Pengolah': baseRow['Unit Pengolah'],
        Status: baseRow.Status
      }
    }

    return {
      ...baseRow,
      'Penyelesaian Akhir': row.klasifikasi?.penyelesaian_akhir ?? row.penyelesaian_akhir ?? '-'
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)

  worksheet['!cols'] = isInaktif
    ? [
      { wch: 6 },
      { wch: 12 },
      { wch: 22 },
      { wch: 45 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 15 }
    ]
    : [
      { wch: 6 },
      { wch: 12 },
      { wch: 35 },
      { wch: 45 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 30 },
      { wch: 15 }
    ]

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Daftar Berkas Arsip'
  )

  XLSX.writeFile(
    workbook,
    `Laporan_Daftar_Berkas_Arsip_${store.params.tahunDari}_${store.params.tahunSampai}_${status || 'SEMUA'}.xlsx`
  )
}

function onChangeStatus() {
  store.items = []
  store.getData()
}

onMounted(() => {
  store.params.tahunDari = store.params.tahunDari || String(tahunSekarang)
  store.params.tahunSampai = store.params.tahunSampai || String(tahunSekarang)
  store.params.inactive = store.params.inactive ?? ''

  store.getData()
})
</script>
<style scoped>
.arsip-page {
  width: 100%;
  max-width: 100vw;
  min-width: 0;
  overflow: hidden !important;
}

.table-card {
  height: calc(100vh - 240px);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden !important;
}

:deep(.arsip-table) {
  height: 100%;
  width: 100%;
  overflow: hidden !important;
}

:deep(.arsip-table .q-table__container) {
  height: 100%;
  width: 100%;
  overflow: hidden !important;
}

:deep(.arsip-table .q-table__middle) {
  height: calc(100% - 60px);
  width: 100%;
  overflow: auto !important;
}

:deep(.arsip-table table) {
  min-width: 1500px !important;
  table-layout: fixed !important;
}

:deep(.arsip-table th) {
  white-space: nowrap;
}

:deep(.arsip-table td) {
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: anywhere;
  vertical-align: top;
}

:deep(.arsip-table thead tr th) {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

:deep(.arsip-table .klasifikasi-cell) {
  width: 350px !important;
  max-width: 350px !important;
  white-space: normal !important;
  word-break: break-word;
}

:deep(.arsip-table .nama-arsip-cell) {
  width: 700px !important;
  max-width: 700px !important;
  white-space: normal !important;
  word-break: break-word;
  vertical-align: top;
}
</style>
