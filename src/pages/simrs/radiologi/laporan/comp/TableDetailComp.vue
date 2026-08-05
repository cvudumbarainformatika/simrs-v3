<template>
  <q-card class="shadow-1 full-height">
    <q-card-section class="q-pa-sm bg-blue-grey-1">
      <div class="row items-center justify-between">
        <div class="text-subtitle2 text-weight-bold text-primary">
          <q-icon name="icon-mat-apartment" class="q-mr-xs" />
          Rekapitulasi Tindakan Radiologi Per Ruangan / Poli
        </div>
        <div class="text-caption text-grey-7">
          Total {{ store.filteredRuangan.length }} ruangan / poli
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <q-table
        :rows="store.filteredRuangan"
        :columns="columns"
        row-key="nama"
        flat
        dense
        :loading="store.loading"
        :rows-per-page-options="[15, 25, 50, 0]"
        rows-per-page-label="Per halaman"
        no-data-label="Belum ada data ruangan"
        class="table-perruangan-radiologi"
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

        <!-- Nama Ruangan -->
        <template #body-cell-nama="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs">
              <q-avatar
                size="26px"
                :color="ruanganColor(props.value)"
                text-color="white"
                class="text-caption text-weight-bold"
              >
                {{ props.value?.charAt(0)?.toUpperCase() || 'R' }}
              </q-avatar>
              <span class="text-weight-medium text-grey-9">{{ props.value }}</span>
            </div>
          </q-td>
        </template>

        <!-- Total Tindakan -->
        <template #body-cell-total="props">
          <q-td :props="props" class="text-center">
            <q-chip
              dense
              color="orange-1"
              text-color="orange-9"
              :label="String(props.value || 0)"
              class="text-weight-bold"
            />
          </q-td>
        </template>

        <!-- Kontribusi / Persentase -->
        <template #body-cell-persentase="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs no-wrap">
              <q-linear-progress
                :value="hitungPersentase(props.row.total) / 100"
                :color="ruanganColor(props.row.nama)"
                rounded
                style="height: 8px; min-width: 60px; flex: 1;"
              />
              <span class="text-caption text-weight-bold text-primary" style="min-width: 38px; text-align: right;">
                {{ hitungPersentase(props.row.total) }}%
              </span>
            </div>
          </q-td>
        </template>

        <!-- Footer Total -->
        <template #bottom-row>
          <q-tr class="bg-blue-grey-1">
            <q-td colspan="2" class="text-weight-bold text-caption text-right text-primary">
              TOTAL TINDAKAN
            </q-td>
            <q-td class="text-center text-weight-bold text-orange-9">
              {{ totalSeluruhTindakan }}
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
import { computed } from 'vue'
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

const store = useLaporanRadiologiStore()

const columns = [
  { name: 'no', label: 'No', field: 'no', align: 'center', style: 'width: 48px' },
  { name: 'nama', label: 'Ruangan / Poli Pengirim', field: 'nama', align: 'left', sortable: true },
  { name: 'total', label: 'Total Tindakan', field: 'total', align: 'center', sortable: true, style: 'width: 140px' },
  { name: 'persentase', label: 'Kontribusi', field: 'persentase', align: 'left', style: 'width: 200px' }
]

const totalSeluruhTindakan = computed(() => {
  return store.dataRuangan.reduce((sum, item) => sum + (Number(item?.total) || 0), 0)
})

function hitungPersentase(total) {
  const tot = totalSeluruhTindakan.value
  if (!tot || tot === 0) return 0
  return (((Number(total) || 0) / tot) * 100).toFixed(1)
}

function ruanganColor(nama) {
  if (!nama) return 'primary'
  const n = nama.toLowerCase()
  if (n.includes('ird') || n.includes('igd') || n.includes('gawat')) return 'red-8'
  if (n.includes('anak')) return 'deep-purple'
  if (n.includes('bedah')) return 'red-6'
  if (n.includes('dalam')) return 'teal'
  if (n.includes('jantung') || n.includes('kardio')) return 'pink-8'
  if (n.includes('paru') || n.includes('pulmo')) return 'cyan-8'
  if (n.includes('ranap') || n.includes('inap')) return 'blue-9'
  return 'primary'
}
</script>

<style lang="scss" scoped>
.table-perruangan-radiologi {
  :deep(.q-table thead th) {
    font-size: 11px;
    font-weight: 700;
    background: #ECEFF1;
    color: #37474F;
    padding: 6px 8px;
  }
  :deep(.q-table tbody tr:hover td) {
    background: #FFF3E0;
  }
  :deep(.q-table td) {
    padding: 5px 8px;
  }
}
</style>
