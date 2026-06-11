<template>
  <q-page class="arsip-page column no-wrap q-pa-sm">
    <div class="q-pa-md bg-primary text-white text-weight-bold text-subtitle1">
      LAPORAN DAFTAR ARSIP
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

        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template #body-cell-no="props">
          <q-td :props="props" class="text-center">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <template #body-cell-klasifikasi="props">
          <q-td :props="props" class="klasifikasi-cell">
            {{ props.value }}
          </q-td>
        </template>

        <template #body-cell-rinciandalammap="props">
          <q-td :props="props" class="nama-arsip-cell">
            <div v-if="props.row.rinciandalammap?.length">
              <div v-for="(item, index) in props.row.rinciandalammap" :key="item.id || index" class="q-mb-sm">
                <div>
                  {{ index + 1 }}.
                  {{ item.dataarsip?.uraian || '-' }}
                </div>

                <div class="text-grey-7">
                  No Arsip: {{ item.noarsip || '-' }}
                </div>

                <div class="text-grey-7">
                  Tanggal: {{ item.dataarsip?.tanggal || '-' }}
                  | Jumlah: {{ item.dataarsip?.jumlah || '-' }}
                </div>
              </div>
            </div>

            <div v-else>-</div>
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


      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
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

  { label: 'AKTIF', value: 'AKTIF' },
  { label: 'INAKTIF', value: 'INAKTIF' }
]

const columns = computed(() => {
  if (store.params.inactive === 'INAKTIF') {
    return [
      { name: 'no', label: 'No', align: 'center', style: 'width:60px' },
      { name: 'noberkas', label: 'No. Berkas', field: 'id', align: 'center', style: 'width:60px' },
      { name: 'namamap', label: 'Nama Berkas', field: 'namamap', align: 'left', style: 'min-width:300px' },
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
      { name: 'tanggalbuatberkas', label: 'Tanggal Buat Berkas', field: 'tahunMap', align: 'center', style: 'min-width:100px' },
      { name: 'rinciandalammap', label: 'Nama Arsip', field: 'rinciandalammap', align: 'left', style: 'min-width:700px' },
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
    { name: 'tanggalbuatberkas', label: 'Tanggal Buat Berkas', field: 'tahunMap', align: 'center', style: 'min-width:100px' },
    { name: 'rinciandalammap', label: 'Nama Arsip', field: 'rinciandalammap', align: 'left', style: 'min-width:700px' },
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
  try {
    const status = String(store.params.inactive || '').toUpperCase()
    const isInaktif = status === 'INAKTIF'

    const headers = isInaktif
      ? [
        'No',
        'No. Berkas',
        'Nama Berkas',
        'Akhir Retensi Inaktif',
        'Klasifikasi',
        'Tahun Berkas',
        'Kode Arsip',
        'Uraian Arsip',
        'Tanggal Arsip',
        'Jumlah',
        'Unit Pengolah',
        'Status'
      ]
      : [
        'No',
        'No. Berkas',
        'Nama Berkas',
        'Klasifikasi',
        'Tahun Berkas',
        'Kode Arsip',
        'Uraian Arsip',
        'Tanggal Arsip',
        'Jumlah',
        'Unit Pengolah',
        'Status'
      ]

    const data = [
      ['LAPORAN DAFTAR ARSIP'],
      [`Tahun ${store.params.tahunDari} s/d ${store.params.tahunSampai} | Status: ${status || 'SEMUA'}`],
      [],
      headers
    ]

    let nomor = 1

    store.items.forEach((row) => {
      const klasifikasi = `${row.keterangan_kode || '-'} (${row.kodeklasifikasi || '-'})`

      const akhirRetensiInaktif =
        row.akhir_retensi_inaktif ??
        (
          Number(row.tahunMap || 0) +
          Number(row.klasifikasi?.retensi || row.retensi || 0) +
          Number(row.klasifikasi?.retensi_inaktif || 0)
        )

      if (row.rinciandalammap?.length) {
        row.rinciandalammap.forEach((item) => {
          const noarsip = item.noarsip ?? '-'
          const uraian = item.dataarsip?.uraian ?? '-'
          const tanggal = item.dataarsip?.tanggal ?? '-'
          const jumlah = item.dataarsip?.jumlah ?? '-'

          if (isInaktif) {
            data.push([
              nomor++,
              row.id ?? '-',
              row.namamap ?? '-',
              akhirRetensiInaktif || '-',
              klasifikasi,
              row.tahunMap ?? '-',
              noarsip,
              uraian,
              tanggal,
              jumlah,
              row.unitpengolah?.nama ?? '-',
              row.status_arsip ?? '-'
            ])
          } else {
            data.push([
              nomor++,
              row.id ?? '-',
              row.namamap ?? '-',
              klasifikasi,
              row.tahunMap ?? '-',
              noarsip,
              uraian,
              tanggal,
              jumlah,
              row.unitpengolah?.nama ?? '-',
              row.status_arsip ?? '-'
            ])
          }
        })
      } else {
        if (isInaktif) {
          data.push([
            nomor++,
            row.id ?? '-',
            row.namamap ?? '-',
            akhirRetensiInaktif || '-',
            klasifikasi,
            row.tahunMap ?? '-',
            '-',
            '-',
            '-',
            '-',
            row.unitpengolah?.nama ?? '-',
            row.status_arsip ?? '-'
          ])
        } else {
          data.push([
            nomor++,
            row.id ?? '-',
            row.namamap ?? '-',
            klasifikasi,
            row.tahunMap ?? '-',
            '-',
            '-',
            '-',
            '-',
            row.unitpengolah?.nama ?? '-',
            row.status_arsip ?? '-'
          ])
        }
      }
    })

    const worksheet = XLSX.utils.aoa_to_sheet(data)

    const lastCol = headers.length - 1

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } }
    ]

    worksheet['!cols'] = isInaktif
      ? [
        { wch: 6 },
        { wch: 12 },
        { wch: 35 },
        { wch: 22 },
        { wch: 45 },
        { wch: 15 },
        { wch: 22 },
        { wch: 60 },
        { wch: 18 },
        { wch: 10 },
        { wch: 30 },
        { wch: 15 }
      ]
      : [
        { wch: 6 },
        { wch: 12 },
        { wch: 35 },
        { wch: 45 },
        { wch: 15 },
        { wch: 22 },
        { wch: 60 },
        { wch: 18 },
        { wch: 10 },
        { wch: 30 },
        { wch: 15 }
      ]

    worksheet['!rows'] = data.map((row, index) => {
      if (index < 4) return { hpt: 24 }
      return { hpt: 35 }
    })

    const range = XLSX.utils.decode_range(worksheet['!ref'])

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
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
      `Laporan_Daftar_Arsip_${store.params.tahunDari}_${store.params.tahunSampai}_${status || 'SEMUA'}.xlsx`
    )
  } catch (error) {
    console.error('Gagal export Excel:', error)
  }
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
  min-width: 2200px !important;
  width: 2200px !important;
}

:deep(.arsip-table th),
:deep(.arsip-table td) {
  white-space: nowrap;
}

:deep(.arsip-table thead tr th) {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

:deep(.arsip-table .nama-arsip-cell) {
  min-width: 700px;
  max-width: 700px;
  white-space: normal !important;
  vertical-align: top;
}

:deep(.klasifikasi-cell) {
  max-width: 350px;
  white-space: normal !important;
  word-break: break-word;
}
</style>
