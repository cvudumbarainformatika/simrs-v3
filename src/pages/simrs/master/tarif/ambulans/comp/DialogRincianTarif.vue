<template>
  <q-dialog v-model="isOpen">
    <q-card style="width: 800px; max-width: 95vw;">
      <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="icon-mat-airport_shuttle" size="24px" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Rincian Tarif Ambulans
            </div>
            <div class="text-caption text-grey-3">
              {{ item?.rs1 }} - {{ item?.rs2 }}
            </div>
          </div>
        </div>
        <q-btn v-close-popup flat round dense icon="icon-mat-close" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <!-- Informasi Ambulans -->
        <div class="row q-col-gutter-sm q-mb-md bg-grey-2 q-pa-sm rounded-borders">
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-7">
              Tujuan Ambulans:
            </div>
            <div class="text-weight-bold text-body2">
              {{ item?.rs2 }}
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Kode Tujuan:
            </div>
            <div class="text-weight-bold text-body2 text-primary">
              {{ item?.rs1 }}
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Status Tarif:
            </div>
            <q-badge :color="statusBadge.color" :text-color="statusBadge.textColor" class="q-px-sm q-py-xs">
              {{ statusBadge.label }}
            </q-badge>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Jarak Tempuh:
            </div>
            <div class="text-caption text-weight-bold">
              {{ item?.rs12 ?? 0 }} KM
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Kebutuhan BBM:
            </div>
            <div class="text-caption text-weight-bold">
              {{ item?.rs13 ?? 0 }} Liter
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Mulai Berlaku:
            </div>
            <div class="text-caption text-weight-bold">
              {{ item?.tgl_mulai_berlaku ? dateFullFormat(item.tgl_mulai_berlaku) : '-' }}
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Dasar Perubahan:
            </div>
            <div class="text-caption text-italic">
              {{ item?.dasar_perubahan || '-' }}
            </div>
          </div>
          <div v-if="item?.tgl_hapus" class="col-12 text-negative text-caption">
            * Tarif ini telah diarsipkan/dinonaktifkan pada {{ dateFullFormat(item.tgl_hapus) }}
          </div>
        </div>

        <!-- Tabel Komponen Tarif Ambulans -->
        <div class="responsive-table-wrap q-mb-md">
          <div class="text-weight-bold text-subtitle2 q-mb-xs text-primary">
            1. Tarif Utama Ambulans
          </div>
          <table class="rincian-table">
            <thead>
              <tr>
                <th class="text-left">Kategori Layanan</th>
                <th class="text-right highlight-head">Tarif Ambulans</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tarif Standart / Rujukan</td>
                <td class="text-right text-weight-bold text-primary">{{ formatNominal(item?.rs9) }}</td>
              </tr>
              <tr>
                <td>Tarif Ambulan Jenazah</td>
                <td class="text-right text-weight-bold text-primary">{{ formatNominal(item?.rs10) }}</td>
              </tr>
              <tr>
                <td>Tarif Ambulan Private / Emergency</td>
                <td class="text-right text-weight-bold text-primary">{{ formatNominal(item?.rs11) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabel JP Sopir & Perawat & Dokter -->
        <div class="responsive-table-wrap">
          <div class="text-weight-bold text-subtitle2 q-mb-xs text-teal-8">
            2. Jasa Pelayanan Petugas (JP)
          </div>
          <table class="rincian-table">
            <thead>
              <tr>
                <th class="text-left">Petugas & Jenis Layanan</th>
                <th class="text-right highlight-head">Nominal JP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JP Sopir - Rujukan</td>
                <td class="text-right">{{ formatNominal(item?.rs3) }}</td>
              </tr>
              <tr>
                <td>JP Sopir - Jenazah</td>
                <td class="text-right">{{ formatNominal(item?.rs4) }}</td>
              </tr>
              <tr>
                <td>JP Sopir - Emergency</td>
                <td class="text-right">{{ formatNominal(item?.rs5) }}</td>
              </tr>
              <tr>
                <td>JP Perawat - Rujukan</td>
                <td class="text-right">{{ formatNominal(item?.rs6) }}</td>
              </tr>
              <tr>
                <td>JP Perawat - Emergency</td>
                <td class="text-right">{{ formatNominal(item?.rs7) }}</td>
              </tr>
              <tr>
                <td>JP Perawat - Privat</td>
                <td class="text-right">{{ formatNominal(item?.rs8) }}</td>
              </tr>
              <tr>
                <td>Dokter Emergency</td>
                <td class="text-right text-weight-bold text-orange-9">{{ formatNominal(item?.rs14) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="between" class="q-px-md q-py-sm bg-grey-1">
        <q-btn
          v-if="sudahDiHapus(item)"
          unelevated
          color="primary"
          icon="icon-mat-edit"
          label="Edit Tarif Ini"
          size="sm"
          @click="onEditClick"
        />
        <div v-else class="text-caption text-negative">
          Data non-aktif / diarsipkan
        </div>
        <q-btn v-close-popup flat label="Tutup" color="grey-8" size="sm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { date } from 'quasar'
import { dateFullFormat, formatRp } from 'src/modules/formatter'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['update:modelValue', 'edit'])

const isOpen = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emits('update:modelValue', val)
  }
})

const today = date.formatDate(new Date(), 'YYYY-MM-DD')

const statusBadge = computed(() => {
  if (props.item?.tgl_hapus || props.item?.flag === '1') {
    return {
      label: 'DIHAPUS / NON-AKTIF',
      color: 'red-1',
      textColor: 'negative'
    }
  }

  if (props.item?.tgl_mulai_berlaku) {
    const itemDate = date.formatDate(new Date(props.item.tgl_mulai_berlaku), 'YYYY-MM-DD')
    if (itemDate > today) {
      return {
        label: 'DRAFT (AKAN BERLAKU)',
        color: 'amber-1',
        textColor: 'orange-10'
      }
    }
  }

  return {
    label: 'AKTIF',
    color: 'green-1',
    textColor: 'positive'
  }
})

function sudahDiHapus (item) {
  return item?.tgl_hapus === null || item?.tgl_hapus === '' || item?.flag !== '1'
}

function formatNominal (val) {
  const num = Number(val)
  if (isNaN(num) || num === 0) return 'Rp 0'
  return formatRp(num)
}

function onEditClick () {
  isOpen.value = false
  emits('edit', props.item)
}
</script>

<style lang="scss" scoped>
.responsive-table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.rincian-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    background-color: #f5f5f5;
    color: #424242;
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
    white-space: nowrap;

    &.highlight-head {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
  }

  td {
    padding: 7px 12px;
    border-bottom: 1px solid #eeeeee;
    white-space: nowrap;
  }

  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }

  tbody tr:hover {
    background-color: #f1f8e9;
  }
}
</style>
