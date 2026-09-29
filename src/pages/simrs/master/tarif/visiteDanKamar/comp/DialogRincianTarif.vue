<template>
  <q-dialog v-model="isOpen">
    <q-card style="width: 850px; max-width: 95vw;">
      <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="icon-mat-hotel" size="24px" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Rincian Tarif Visite & Kamar
            </div>
            <div class="text-caption text-grey-3">
              {{ item?.rs1 }} - {{ item?.rs2 }}
            </div>
          </div>
        </div>
        <q-btn v-close-popup flat round dense icon="icon-mat-close" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <!-- Informasi Visite & Kamar -->
        <div class="row q-col-gutter-sm q-mb-md bg-grey-2 q-pa-sm rounded-borders">
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-7">
              Nama Tarif / Tindakan:
            </div>
            <div class="text-weight-bold text-body2">
              {{ item?.rs2 }}
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Kode:
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
          <div class="col-6 col-md-6">
            <div class="text-caption text-grey-7">
              Mulai Berlaku:
            </div>
            <div class="text-caption text-weight-bold">
              {{ item?.tgl_mulai_berlaku ? dateFullFormat(item.tgl_mulai_berlaku) : '-' }}
            </div>
          </div>
          <div class="col-6 col-md-6">
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

        <!-- Tabel Matriks Semua Kelas Rawat Visite & Kamar -->
        <div class="responsive-table-wrap">
          <table class="rincian-table">
            <thead>
              <tr>
                <th class="text-left" style="width: 170px;">
                  Kelas / Ruang Rawat
                </th>
                <th class="text-right">
                  Jasa Sarana (JS)
                </th>
                <th class="text-right">
                  Jasa Pelayanan (JP)
                </th>
                <th class="text-right highlight-head">
                  Total Tarif
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(k, idx) in listKelas" :key="idx">
                <td class="text-weight-medium">
                  {{ k.nama }}
                </td>
                <td class="text-right text-grey-8">
                  {{ formatNominal(item?.[k.js]) }}
                </td>
                <td class="text-right text-grey-8">
                  {{ formatNominal(item?.[k.jp]) }}
                </td>
                <td class="text-right text-weight-bolder text-primary">
                  {{ formatNominal(item?.[k.total] || (Number(item?.[k.js] || 0) + Number(item?.[k.jp] || 0))) }}
                </td>
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

const listKelas = [
  { nama: 'Kelas 3', js: 'rs6', jp: 'rs7', total: 'tarif_kelas3' },
  { nama: 'Kelas 2', js: 'rs8', jp: 'rs9', total: 'tarif_kelas2' },
  { nama: 'Kelas 1', js: 'rs10', jp: 'rs11', total: 'tarif_kelas1' },
  { nama: 'Utama', js: 'rs12', jp: 'rs13', total: 'tarif_utama' },
  { nama: 'VIP', js: 'rs14', jp: 'rs15', total: 'tarif_vip' },
  { nama: 'VVIP', js: 'rs16', jp: 'rs17', total: 'tarif_vvip' },
  { nama: 'HCU', js: 'hcus', jp: 'hcup' },
  { nama: 'ICU', js: 'icus', jp: 'icup' },
  { nama: 'ICCU', js: 'iccus', jp: 'iccup' },
  { nama: 'NICU', js: 'nicus', jp: 'nicup' },
  { nama: 'Isolasi', js: 'ins', jp: 'inp' },
  { nama: 'Intensif Lain', js: 'isos', jp: 'isop' },
  { nama: 'Presidential Suite', js: 'pss', jp: 'psp' }
]

const statusBadge = computed(() => {
  if (props.item?.tgl_hapus) {
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
  return item?.tgl_hapus === null || item?.tgl_hapus === ''
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
    padding: 8px 12px;
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
