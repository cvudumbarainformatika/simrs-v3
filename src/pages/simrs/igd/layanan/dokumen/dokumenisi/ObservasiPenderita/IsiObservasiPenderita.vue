<template>
  <div class="print-wrapper b">
    <q-table flat dense :rows="rows" :columns="columns" row-key="id" hide-bottom>
      <template v-slot:body-cell="slotProps">
        <q-td :props="slotProps">
          <div v-if="slotProps.col.name === 'tgl'" class="text-center">
            <div>
              {{ slotProps.row.tanggal }}
            </div>

            <div class="text-caption">
              {{ slotProps.row.jam }}
            </div>
          </div>
          <div v-else-if="slotProps.col.name === 'pemeriksaan'" class="text-wrap">
            {{ slotProps.row.pemeriksaan }}
          </div>
          <!-- TINDAKAN -->
          <div v-else-if="slotProps.col.name === 'tindakan'" class="text-wrap">
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

  // {
  //   name: 'tensi',
  //   label: 'TENSI',
  //   field: 'tensi',
  //   align: 'left',
  //   style: 'width:80px'
  // },

  // {
  //   name: 'nadi',
  //   label: 'NADI',
  //   field: 'nadi',
  //   align: 'left',
  //   style: 'width:60px'
  // },

  // {
  //   name: 'rr',
  //   label: 'RR',
  //   field: 'rr',
  //   align: 'left',
  //   style: 'width:60px'
  // },

  // {
  //   name: 'suhu',
  //   label: 'SUHU',
  //   field: 'suhu',
  //   align: 'left',
  //   style: 'width:60px'
  // },

  // {
  //   name: 'spo2',
  //   label: 'SP.O2',
  //   field: 'spo2',
  //   align: 'left',
  //   style: 'width:70px'
  // },

  // {
  //   name: 'gcs',
  //   label: 'GCS',
  //   field: 'gcs',
  //   align: 'left',
  //   style: 'width:70px'
  // },

  // {
  //   name: 'pupil',
  //   label: 'PUPIL',
  //   field: 'pupil',
  //   align: 'left',
  //   style: 'width:80px'
  // },
  {
    name: 'pemeriksaan',
    label: 'PEMERIKSAAN',
    field: 'pemeriksaan',
    align: 'left',
    style: 'width:100px'
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
    style: 'width:200px'
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

      tanggal: splitTgl[0] || '-',
      jam: splitTgl[1] || '-',

      // tensi:
      //   item?.sistole && item?.diastole
      //     ? `${item.sistole}/${item.diastole}`
      //     : '-',

      // nadi: item?.nadi || '-',
      // rr: item?.pernapasanx || '-',
      // suhu: item?.suhu || '-',
      // spo2: item?.spo2 || '-',

      // gcs:
      //   item?.eye && item?.verbal && item?.motorik
      //     ? `${item.eye}/${item.verbal}/${item.motorik}`
      //     : '-',

      // pupil: item?.keadaan_pupil || '-',

      pemeriksaan:
        `TD : ${item?.sistole && item?.diastole ? parseInt(item.sistole) + '/' + parseInt(item.diastole) : '-'}\n` +
        `N : ${parseInt(item?.nadi) || '-'}\n` +
        `RR : ${parseInt(item?.pernapasanx) || '-'}\n` +
        `S : ${parseInt(item?.suhu) || '-'}\n` +
        `SpO₂ : ${parseInt(item?.spo2) || '-'}\n` +
        `GCS : ${item?.eye && item?.verbal && item?.motorik ? `${item.eye}/${item.verbal}/${item.motorik}` : '-'}\n` +
        `Pupil : ${item?.keadaan_pupil || '-'}`,
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

.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
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
    border-collapse: collapse;
    border: none !important;
  }

  .q-table th,
  .q-table td {
    padding: 2px 4px;
    white-space: normal;
    word-break: break-word;
    border: none !important;
  }

  .q-table tr,
  .q-table th,
  .q-table td {
    border-color: transparent !important;
  }

  .q-tr {
    page-break-inside: avoid;
  }
}
</style>
