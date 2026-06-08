<template>
  <div class="column full-height q-ma-sm">

    <div class="q-pa-md bg-primary text-white text-weight-bold text-subtitle1">
      LAPORAN DAFTAR ARSIP
    </div>

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

    <q-card flat bordered class="q-mt-md col">
      <q-table flat bordered :rows="store.items" :columns="columns" row-key="id" :loading="store.loading"
        separator="cell" hide-pagination :pagination="{ rowsPerPage: 0 }">
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

        <template #body-cell-rinciandalammap="props">
          <q-td :props="props">

            <div v-if="props.row.rinciandalammap?.length">

              <div v-for="(item, index) in props.row.rinciandalammap" :key="item.id" class="q-mb-xs">
                {{ index + 1 }}.
                {{ item.dataarsip?.uraian }}
                ({{ item.noarsip }})
              </div>

            </div>

            <div v-else>
              -
            </div>

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

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { date } from 'quasar'
import * as XLSX from 'xlsx-js-style'
import { useLaporandataarsip } from 'src/stores/simrs/laporan/arsip/laporandataarsip/laporandataarsip'

const store = useLaporandataarsip()

const tahunSekarang = new Date().getFullYear()

const tahunOptions = Array.from({ length: 20 }, (_, i) => {
  const tahun = tahunSekarang - i
  return {
    label: String(tahun),
    value: String(tahun)
  }
})

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
  { name: 'rinciandalammap', label: 'Nama Arsip', field: 'rinciandalammap', align: 'left' },
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
  { name: 'created_at', label: 'Tanggal Buat Berkas', field: 'created_at', align: 'center' },
  { name: 'status_arsip', label: 'Status', field: 'status_arsip', align: 'center' }
]

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
  const data = [
    ['LAPORAN DAFTAR ARSIP'],
    [`Tahun ${store.params.tahunDari} s/d ${store.params.tahunSampai} | Status: ${store.params.inactive || 'SEMUA'}`],
    [],
    [
      'No',
      'Nama Berkas',
      'Kode Klasifikasi',
      'Klasifikasi',
      'Nama Arsip',
      'Unit Pengolah',
      'Kabinet',
      'Tanggal Buat Berkas',
      'Status'
    ]
  ]

  store.items.forEach((row, index) => {
    const namaArsip = row.rinciandalammap?.length
      ? row.rinciandalammap
        .map((item, i) => {
          const uraian = item.dataarsip?.uraian ?? '-'
          const noarsip = item.noarsip ?? '-'
          return `${i + 1}. ${uraian} (${noarsip})`
        })
        .join('\n')
      : '-'

    data.push([
      index + 1,
      row.namamap ?? '-',
      row.kodeklasifikasi ?? '-',
      row.keterangan_kode ?? '-',
      namaArsip,
      row.unitpengolah?.nama ?? '-',
      row.kabinet?.namacabinet ?? '-',
      formatTanggal(row.created_at),
      row.status_arsip ?? '-'
    ])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(data)

  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }
  ]

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 35 },
    { wch: 18 },
    { wch: 35 },
    { wch: 80 },
    { wch: 30 },
    { wch: 25 },
    { wch: 22 },
    { wch: 15 }
  ]

  worksheet['!rows'] = data.map((row, index) => {
    if (index < 3) return { hpt: 24 }

    const namaArsip = row[4] || ''
    const jumlahBaris = String(namaArsip).split('\n').length

    return {
      hpt: Math.max(24, jumlahBaris * 18)
    }
  })

  const range = XLSX.utils.decode_range(worksheet['!ref'])

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })

      if (!worksheet[cellAddress]) continue

      worksheet[cellAddress].s = {
        font: {
          bold: R === 0 || R === 3,
          sz: R === 0 ? 14 : 10
        },
        alignment: {
          horizontal: R === 0 || R === 1 || R === 3 ? 'center' : 'left',
          vertical: 'top',
          wrapText: true
        },
        border: R >= 3
          ? {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
          : {}
      }
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Arsip')

  XLSX.writeFile(
    workbook,
    `Laporan_Daftar_Arsip_${store.params.tahunDari}_${store.params.tahunSampai}.xlsx`
  )
}

onMounted(() => {
  store.params.tahunDari = store.params.tahunDari || String(tahunSekarang)
  store.params.tahunSampai = store.params.tahunSampai || String(tahunSekarang)
  store.params.inactive = store.params.inactive ?? ''

  store.getData()
})
</script>
