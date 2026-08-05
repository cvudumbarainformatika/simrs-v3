<template>
  <q-card class="shadow-1 full-height">
    <q-card-section class="q-pa-sm bg-blue-grey-1">
      <div class="row items-center justify-between">
        <div class="text-subtitle2 text-weight-bold text-primary">
          <q-icon name="icon-mat-bar_chart" class="q-mr-xs" />
          Rekapitulasi Global Tindakan Radiologi
        </div>
        <div class="text-caption text-grey-7">
          Total {{ store.rekapGlobal.length }} jenis tindakan
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <q-table
        :rows="store.rekapGlobal"
        :columns="columns"
        row-key="kode"
        flat
        dense
        :loading="store.loading"
        :rows-per-page-options="[15, 25, 50, 0]"
        rows-per-page-label="Per halaman"
        no-data-label="Belum ada data tindakan radiologi"
        class="table-laporan-radiologi"
      >
        <!-- Loading skeleton -->
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!-- No -->
        <template #body-cell-no="props">
          <q-td :props="props" class="text-center text-caption">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <!-- Kode -->
        <template #body-cell-kode="props">
          <q-td :props="props">
            <q-badge color="blue-grey" :label="props.value" />
          </q-td>
        </template>

        <!-- Nama Tindakan -->
        <template #body-cell-nama="props">
          <q-td :props="props" class="text-weight-medium">
            {{ props.value }}
          </q-td>
        </template>

        <!-- Jumlah Pasien -->
        <template #body-cell-jlhPasien="props">
          <q-td :props="props" class="text-center">
            <q-chip
              dense
              color="blue-1"
              text-color="primary"
              :label="String(props.value)"
              class="text-weight-bold"
            />
          </q-td>
        </template>

        <!-- Jumlah Tindakan -->
        <template #body-cell-jlhTindakan="props">
          <q-td :props="props" class="text-center">
            <q-chip
              dense
              color="teal-1"
              text-color="teal-9"
              :label="String(props.value)"
              class="text-weight-bold"
            />
          </q-td>
        </template>

        <!-- Persentase -->
        <template #body-cell-persentase="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs no-wrap">
              <q-linear-progress
                :value="props.value / 100"
                color="primary"
                rounded
                style="height: 8px; min-width: 60px; flex: 1;"
              />
              <span class="text-caption text-weight-bold text-primary" style="min-width: 38px; text-align: right;">
                {{ props.value }}%
              </span>
            </div>
          </q-td>
        </template>

        <!-- Footer Total -->
        <template #bottom-row>
          <q-tr class="bg-blue-grey-1">
            <q-td colspan="3" class="text-weight-bold text-caption text-right text-primary">
              TOTAL
            </q-td>
            <q-td class="text-center text-weight-bold text-primary">
              {{ store.summary.totalPasien }}
            </q-td>
            <q-td class="text-center text-weight-bold text-teal">
              {{ store.summary.totalTindakan }}
            </q-td>
            <q-td class="text-right text-weight-bold text-primary">
              100%
            </q-td>
          </q-tr>
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
  { name: 'kode', label: 'Kode', field: 'kode', align: 'left', style: 'width: 100px' },
  { name: 'nama', label: 'Nama Tindakan / Pemeriksaan', field: 'nama', align: 'left', sortable: true },
  { name: 'jlhPasien', label: 'Jml Pasien', field: 'jlhPasien', align: 'center', sortable: true, style: 'width: 110px' },
  { name: 'jlhTindakan', label: 'Jml Tindakan', field: 'jlhTindakan', align: 'center', sortable: true, style: 'width: 120px' },
  { name: 'persentase', label: 'Kontribusi', field: 'persentase', align: 'left', sortable: true, style: 'width: 180px' }
]
</script>

<style lang="scss" scoped>
.table-laporan-radiologi {
  :deep(.q-table thead th) {
    font-size: 11px;
    font-weight: 700;
    background: #ECEFF1;
    color: #37474F;
    padding: 6px 8px;
  }
  :deep(.q-table tbody tr:hover td) {
    background: #E3F2FD;
  }
  :deep(.q-table td) {
    padding: 5px 8px;
  }
}
</style>
