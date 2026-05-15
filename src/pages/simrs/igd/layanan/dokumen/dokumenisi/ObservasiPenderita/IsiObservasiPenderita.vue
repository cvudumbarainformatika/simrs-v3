<template>
  <div class="print-wrapper">
    <q-table flat bordered dense :rows="rows" :columns="columns" row-key="id" hide-bottom>
      <template v-slot:body-cell="slotProps">
        <q-td :props="slotProps">

          <!-- TINDAKAN -->
          <div v-if="slotProps.col.name === 'tindakan'" class="text-wrap">
            {{ slotProps.row[slotProps.col.field] }}
          </div>

          <!-- KELUHAN -->
          <div v-else-if="slotProps.col.name === 'keluhan'" class="text-wrap">
            {{ slotProps.row[slotProps.col.field] }}
          </div>

          <!-- PERAWAT + QR -->
          <div v-else-if="slotProps.col.name === 'perawat'" class="column items-start q-gutter-xs">
            <div>
              {{ slotProps.row[slotProps.col.field] }}
            </div>

            <q-img :src="`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${generateQr(slotProps.row)}`"
              style="width: 45px; height: 45px;" />
          </div>

          <!-- DEFAULT -->
          <div v-else>
            {{ slotProps.row[slotProps.col.field] }}
          </div>

        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const columns = [
  {
    name: 'tgl',
    label: 'TGL',
    field: 'tgl',
    align: 'left',
    style: 'width:70px'
  },

  {
    name: 'jam',
    label: 'JAM',
    field: 'jam',
    align: 'left',
    style: 'width:60px'
  },

  {
    name: 'tensi',
    label: 'TENSI',
    field: 'tensi',
    align: 'left',
    style: 'width:80px'
  },

  {
    name: 'nadi',
    label: 'NADI',
    field: 'nadi',
    align: 'left',
    style: 'width:60px'
  },

  {
    name: 'rr',
    label: 'RR',
    field: 'rr',
    align: 'left',
    style: 'width:60px'
  },

  {
    name: 'suhu',
    label: 'SUHU',
    field: 'suhu',
    align: 'left',
    style: 'width:60px'
  },

  {
    name: 'spo2',
    label: 'SP.O2',
    field: 'spo2',
    align: 'left',
    style: 'width:70px'
  },

  {
    name: 'gcs',
    label: 'GCS',
    field: 'gcs',
    align: 'left',
    style: 'width:70px'
  },

  {
    name: 'pupil',
    label: 'PUPIL',
    field: 'pupil',
    align: 'left',
    style: 'width:80px'
  },

  {
    name: 'output',
    label: 'OUTPUT',
    field: 'output',
    align: 'left',
    style: 'width:70px'
  },

  {
    name: 'keluhan',
    label: 'KELUHAN',
    field: 'keluhan',
    align: 'left',
    style: 'width:120px'
  },

  {
    name: 'tindakan',
    label: 'TINDAKAN',
    field: 'tindakan',
    align: 'left',
    style: 'width:150px'
  },

  {
    name: 'perawat',
    label: 'PERAWAT',
    field: 'perawat',
    align: 'left',
    style: 'width:120px'
  }
]

const rows = computed(() => {
  const data = props?.pasien?.tinjauanulang || []

  return data.map(item => {
    const tglRaw = item?.tgl || ''
    const splitTgl = tglRaw.split(' ')

    return {
      id: item?.id,

      tgl: splitTgl[0] || '-',
      jam: splitTgl[1] || '-',

      tensi:
        item?.sistole && item?.diastole
          ? `${item.sistole}/${item.diastole}`
          : '-',

      nadi: item?.nadi || '-',
      rr: item?.pernapasanx || '-',
      suhu: item?.suhu || '-',
      spo2: item?.spo2 || '-',

      gcs:
        item?.eye && item?.verbal && item?.motorik
          ? `${item.eye}/${item.verbal}/${item.motorik}`
          : '-',

      pupil: item?.keadaan_pupil || '-',
      output: item?.output || '-',

      obat: '-',
      keluhan: item?.keluhan || '-',
      tindakan: item?.keterangan || '-',

      perawat: item?.nama || '-',

      noreg: item?.noreg,
      tglFull: item?.tgl
    }
  })
})

const generateQr = (item) => {
  if (!item) return ''

  const enc = btoa(
    `${item?.noreg || ''}|${item?.perawat || ''}|${item?.tglFull || ''}`
  )

  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
</script>

<style scoped>
.print-wrapper {
  width: 100%;
}

.text-wrap {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.3;
  max-width: 250px;
}

.q-table td {
  vertical-align: top;
}

@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }

  .q-table {
    width: 100%;
    table-layout: fixed;
    font-size: 9px;
  }

  .q-table th,
  .q-table td {
    padding: 2px 4px;
    white-space: normal;
    word-break: break-word;
  }

  .q-tr {
    page-break-inside: avoid;
  }
}
</style>
