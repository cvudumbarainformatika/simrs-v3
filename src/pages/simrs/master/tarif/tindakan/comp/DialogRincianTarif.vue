<template>
  <q-dialog v-model="isOpen">
    <q-card style="width: 850px; max-width: 95vw;">
      <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="icon-mat-receipt_long" size="24px" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Rincian Tarif Tindakan
            </div>
            <div class="text-caption text-grey-3">
              {{ item?.kdtindakan }} - {{ item?.nmtindakan }}
            </div>
          </div>
        </div>
        <q-btn v-close-popup flat round dense icon="icon-mat-close" />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <!-- Informasi Tindakan -->
        <div class="row q-col-gutter-sm q-mb-md bg-grey-2 q-pa-sm rounded-borders">
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-7">
              Nama Tindakan:
            </div>
            <div class="text-weight-bold text-body2">
              {{ item?.nmtindakan }}
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption text-grey-7">
              Kode Tindakan:
            </div>
            <div class="text-weight-bold text-body2 text-primary">
              {{ item?.kdtindakan }}
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
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-7">
              Berlaku di Ruangan:
            </div>
            <div class="text-caption text-weight-medium">
              {{ namaRuangan || 'Semua / Tidak Ditentukan' }}
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
            * Tindakan ini telah diarsipkan/dinonaktifkan pada {{ dateFullFormat(item.tgl_hapus) }}
          </div>
        </div>

        <!-- Tabel Matriks 9 Kelas Rawat -->
        <div class="responsive-table-wrap">
          <table class="rincian-table">
            <thead>
              <tr>
                <th class="text-left" style="width: 140px;">
                  Kelas Rawat
                </th>
                <th class="text-right">
                  Jasa Sarana (JS)
                </th>
                <th class="text-right">
                  Jasa Pelayanan (JP)
                </th>
                <th class="text-right">
                  Habis Pakai (HP)
                </th>
                <th class="text-right">
                  Anastesi (AN)
                </th>
                <th class="text-right highlight-head">
                  Total Tarif
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(k, idx) in daftarKelas" :key="idx" :class="{ 'row-kelas3': idx === 0 }">
                <td class="text-weight-bold text-left">
                  {{ k.nama }}
                </td>
                <td class="text-right font-mono">
                  {{ formatNominal(k.js) }}
                </td>
                <td class="text-right font-mono">
                  {{ formatNominal(k.jp) }}
                </td>
                <td class="text-right font-mono">
                  {{ formatNominal(k.hp) }}
                </td>
                <td class="text-right font-mono">
                  {{ k.an ? formatNominal(k.an) : '-' }}
                </td>
                <td class="text-right font-mono text-weight-bold highlight-cell">
                  {{ formatNominal(k.tarif) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="between" class="q-px-md q-py-sm">
        <q-btn v-close-popup flat color="dark" label="Tutup" />
        <q-btn
          color="primary"
          unelevated
          icon="icon-mat-edit"
          label="Edit Tarif Ini"
          @click="onEditClick"
        />
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
    default: () => null
  },
  polis: {
    type: Array,
    default: () => []
  },
  ruangRanap: {
    type: Array,
    default: () => []
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

function formatNominal (val) {
  const num = parseInt(val)
  if (isNaN(num) || num === 0) return '0'
  return formatRp(num)
}

const statusBadge = computed(() => {
  if (!props.item) return { label: '-', color: 'grey', textColor: 'white' }
  if (props.item.tgl_hapus) {
    const hariIni = new Date()
    const tglHapus = new Date(props.item.tgl_hapus)
    const diff = date.getDateDiff(tglHapus, hariIni, 'days')
    if (diff <= 0) {
      return { label: 'Dihapus / Non-Aktif', color: 'negative', textColor: 'white' }
    }
  }
  if (props.item.tgl_mulai_berlaku) {
    const hariIni = new Date()
    const tglBerlaku = new Date(props.item.tgl_mulai_berlaku)
    const diff = date.getDateDiff(tglBerlaku, hariIni, 'days')
    if (diff > 0) {
      return { label: 'Akan Berlaku (Draft)', color: 'warning', textColor: 'dark' }
    }
  }
  return { label: 'Aktif Saat Ini', color: 'positive', textColor: 'white' }
})

const namaRuangan = computed(() => {
  if (!props.item?.ruangan) return ''
  const ruangans = props.item.ruangan.split('|')
  const ruang = []
  if (ruangans?.length >= 1) {
    ruangans.forEach(element => {
      if (element !== '') {
        const poli = props.polis?.find(x => x?.kodepoli === element)
        const ranap = props.ruangRanap?.find(x => x?.groups === element)
        if (poli) ruang.push(poli.polirs)
        if (ranap) ruang.push(ranap.groups_nama)
      }
    })
  }
  return ruang.join(', ')
})

const daftarKelas = computed(() => {
  if (!props.item) return []
  const it = props.item
  return [
    { nama: 'Kelas 3', js: it.js3, jp: it.jp3, hp: it.habispake3, an: it.anastesi, tarif: it.tarif3 },
    { nama: 'Kelas 2', js: it.js2, jp: it.jp2, hp: it.habispake2, an: 0, tarif: it.tarif2 },
    { nama: 'Kelas 1', js: it.js1, jp: it.jp1, hp: it.habispake1, an: 0, tarif: it.tarif1 },
    { nama: 'Utama', js: it.jsutama, jp: it.jputama, hp: it.habispakeutama, an: 0, tarif: it.tarifutama },
    { nama: 'VIP', js: it.jsvip, jp: it.jpvip, hp: it.habispakevip, an: 0, tarif: it.tarifvip },
    { nama: 'VVIP', js: it.jsvvip, jp: it.jpvvip, hp: it.habispakevvip, an: 0, tarif: it.tarifvvip },
    { nama: 'Presidential', js: it.js_presidential, jp: it.jp_presidential, hp: it.habispake_presidential, an: 0, tarif: it.tarif_presidential },
    { nama: 'HCU', js: it.js_hcu, jp: it.jp_hcu, hp: it.habispake_hcu, an: 0, tarif: it.tarif_hcu },
    { nama: 'Home Care', js: it.js_hc, jp: it.jp_hc, hp: it.habispake_hc, an: 0, tarif: it.tarif_hc }
  ]
})

function onEditClick () {
  const itemToEdit = props.item
  isOpen.value = false
  emits('edit', itemToEdit)
}
</script>

<style lang="scss" scoped>
.responsive-table-wrap {
  width: 100%;
  overflow-x: auto;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.rincian-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: 600;
    padding: 8px 12px;
    border-bottom: 2px solid #ccc;
    white-space: nowrap;
  }

  td {
    padding: 6px 12px;
    border-bottom: 1px solid #eee;
  }

  tbody tr:hover {
    background-color: #f0f7ff;
  }

  .row-kelas3 {
    background-color: #fafbfc;
  }

  .highlight-head {
    background-color: #e8f4fd;
    color: #027be3;
  }

  .highlight-cell {
    background-color: #f4faff;
    color: #027be3;
  }

  .font-mono {
    font-family: monospace;
    font-size: 13px;
  }
}
</style>
