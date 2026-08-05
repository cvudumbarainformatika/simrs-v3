<template>
  <q-card class="shadow-1 full-height">
    <q-card-section class="q-pa-sm bg-blue-grey-1">
      <div class="row items-center justify-between">
        <div class="text-subtitle2 text-weight-bold text-primary">
          <q-icon name="icon-mat-person_search" class="q-mr-xs" />
          Rekapitulasi Per Dokter / DPJP
        </div>
        <div class="text-caption text-grey-7">
          Total {{ store.rekapDokter.length }} dokter
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <q-table
        :rows="store.rekapDokter"
        :columns="columns"
        row-key="kodedokter"
        flat
        dense
        :loading="store.loading"
        :rows-per-page-options="[15, 25, 50, 0]"
        rows-per-page-label="Per halaman"
        no-data-label="Belum ada data dokter"
        class="table-perdokter-radiologi"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!-- Expand row slot -->
        <template #body="props">
          <q-tr :props="props" class="cursor-pointer" @click="props.expand = !props.expand">
            <!-- No -->
            <q-td class="text-center text-caption">{{ props.rowIndex + 1 }}</q-td>

            <!-- Nama Dokter -->
            <q-td>
              <div class="row items-center q-gutter-xs">
                <q-icon
                  :name="props.expand ? 'icon-mat-expand_less' : 'icon-mat-expand_more'"
                  color="grey-6"
                  size="16px"
                />
                <q-avatar
                  size="28px"
                  color="primary"
                  text-color="white"
                  class="text-caption text-weight-bold"
                >
                  {{ props.row.nama?.charAt(0)?.toUpperCase() || 'D' }}
                </q-avatar>
                <span class="text-weight-medium">{{ props.row.nama }}</span>
              </div>
            </q-td>

            <!-- Jml Pasien -->
            <q-td class="text-center">
              <q-chip
                dense
                color="blue-1"
                text-color="primary"
                :label="String(props.row.jlhPasien)"
                class="text-weight-bold"
              />
            </q-td>

            <!-- Jml Tindakan -->
            <q-td class="text-center">
              <q-chip
                dense
                color="teal-1"
                text-color="teal-9"
                :label="String(props.row.jlhTindakan)"
                class="text-weight-bold"
              />
            </q-td>

            <!-- Rata-rata -->
            <q-td class="text-center">
              <span class="text-caption text-grey-8">
                {{ props.row.jlhPasien > 0 ? (props.row.jlhTindakan / props.row.jlhPasien).toFixed(1) : 0 }}x/pasien
              </span>
            </q-td>
          </q-tr>

          <!-- Expand: Detail Tindakan per Dokter -->
          <q-tr v-show="props.expand" :props="props" class="bg-blue-grey-1">
            <q-td colspan="5" class="q-pa-sm">
              <div class="text-caption text-grey-7 q-mb-xs text-weight-medium">
                Detail Tindakan oleh {{ props.row.nama }}
              </div>
              <div class="row q-col-gutter-xs">
                <div
                  v-for="(tnd, idx) in props.row.detailTindakan"
                  :key="idx"
                  class="col-12 col-sm-6 col-md-4"
                >
                  <div class="row items-center justify-between q-pa-xs rounded-borders bg-white shadow-0 border-tbl">
                    <span class="text-caption">{{ tnd.namaTindakan }}</span>
                    <q-badge :label="String(tnd.jumlah)" color="primary" />
                  </div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- Footer Total -->
        <template #bottom-row>
          <q-tr class="bg-blue-grey-1">
            <q-td colspan="2" class="text-weight-bold text-caption text-right text-primary">
              TOTAL
            </q-td>
            <q-td class="text-center text-weight-bold text-primary">
              {{ store.summary.totalPasien }}
            </q-td>
            <q-td class="text-center text-weight-bold text-teal">
              {{ store.summary.totalTindakan }}
            </q-td>
            <q-td />
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
  { name: 'nama', label: 'Nama Dokter / DPJP', field: 'nama', align: 'left', sortable: true },
  { name: 'jlhPasien', label: 'Jml Pasien', field: 'jlhPasien', align: 'center', sortable: true, style: 'width: 110px' },
  { name: 'jlhTindakan', label: 'Jml Tindakan', field: 'jlhTindakan', align: 'center', sortable: true, style: 'width: 120px' },
  { name: 'rataRata', label: 'Rata-rata', field: 'rataRata', align: 'center', style: 'width: 130px' }
]
</script>

<style lang="scss" scoped>
.table-perdokter-radiologi {
  :deep(.q-table thead th) {
    font-size: 11px;
    font-weight: 700;
    background: #ECEFF1;
    color: #37474F;
    padding: 6px 8px;
  }
  :deep(.q-table tbody tr:hover td) {
    background: #E8F5E9;
  }
  :deep(.q-table td) {
    padding: 5px 8px;
  }
}
.border-tbl {
  border: 1px solid #CFD8DC;
}
</style>
