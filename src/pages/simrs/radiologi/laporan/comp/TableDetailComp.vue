<template>
  <q-card class="shadow-1 full-height">
    <q-card-section class="q-pa-sm bg-blue-grey-1">
      <div class="row items-center justify-between">
        <div class="text-subtitle2 text-weight-bold text-primary">
          <q-icon name="icon-mat-format_list_bulleted" class="q-mr-xs" />
          Detail Transaksi Pasien Radiologi
        </div>
        <div class="text-caption text-grey-7">
          {{ store.detailItems.length }} transaksi ditemukan
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <q-table
        :rows="store.detailItems"
        :columns="columns"
        row-key="id"
        flat
        dense
        :loading="store.loading"
        :rows-per-page-options="[15, 25, 50, 100]"
        rows-per-page-label="Per halaman"
        no-data-label="Belum ada data transaksi radiologi"
        class="table-detail-radiologi"
        virtual-scroll
        :virtual-scroll-sticky-size-start="28"
        style="max-height: calc(100vh - 320px);"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!-- No -->
        <template #body-cell-no="props">
          <q-td :props="props" class="text-center text-caption text-grey-7">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <!-- Jenis Pasien Badge -->
        <template #body-cell-jenisPasien="props">
          <q-td :props="props" class="text-center">
            <q-badge
              :color="jenisBadgeColor(props.value)"
              :label="props.value"
              class="text-weight-medium"
            />
          </q-td>
        </template>

        <!-- Nama Pasien -->
        <template #body-cell-namaPasien="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.value }}</div>
            <div class="text-caption text-grey-6">
              RM: {{ props.row.norm }} | Reg: {{ props.row.noreg }}
            </div>
          </q-td>
        </template>

        <!-- Tindakan -->
        <template #body-cell-namaTindakan="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs">
              <q-badge color="blue-grey-4" :label="props.row.kodeTindakan" dense />
              <span class="text-caption">{{ props.value }}</span>
            </div>
          </q-td>
        </template>

        <!-- Status -->
        <template #body-cell-status="props">
          <q-td :props="props" class="text-center">
            <q-chip
              dense
              :color="statusColor(props.value)"
              text-color="white"
              :label="props.value"
              class="text-caption"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

const store = useLaporanRadiologiStore()

const columns = [
  { name: 'no', label: 'No', field: 'no', align: 'center', style: 'width: 48px' },
  { name: 'jenisPasien', label: 'Jenis', field: 'jenisPasien', align: 'center', sortable: true, style: 'width: 80px' },
  { name: 'namaPasien', label: 'Nama Pasien', field: 'namaPasien', align: 'left', sortable: true },
  { name: 'namaDokter', label: 'Dokter / DPJP', field: 'namaDokter', align: 'left', sortable: true },
  { name: 'ruangan', label: 'Ruangan / Poli', field: 'ruangan', align: 'left' },
  { name: 'namaTindakan', label: 'Tindakan Radiologi', field: 'namaTindakan', align: 'left', sortable: true },
  { name: 'tgl', label: 'Tanggal', field: 'tgl', align: 'center', sortable: true, style: 'width: 100px' },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true, style: 'width: 90px' }
]

function jenisBadgeColor(jenis) {
  if (jenis === 'Rajal') return 'blue-8'
  if (jenis === 'Ranap') return 'orange-8'
  if (jenis === 'IGD') return 'red-8'
  return 'grey-6'
}

function statusColor(status) {
  if (status === 'Selesai') return 'positive'
  if (status === 'Proses') return 'orange-8'
  if (status === 'Batal') return 'negative'
  return 'grey-6'
}
</script>

<style lang="scss" scoped>
.table-detail-radiologi {
  :deep(.q-table thead th) {
    font-size: 11px;
    font-weight: 700;
    background: #ECEFF1;
    color: #37474F;
    padding: 5px 8px;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  :deep(.q-table tbody tr:hover td) {
    background: #FFF8E1;
  }
  :deep(.q-table td) {
    padding: 4px 8px;
  }
}
</style>
