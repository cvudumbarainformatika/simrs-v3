<template>
  <div class="q-pa-md">

    <div class="text-h6 text-weight-bold q-mb-sm">
      MONITORING PASIEN
    </div>

    <q-table :rows="rows" :columns="columns" row-key="id" flat bordered dense separator="cell" hide-bottom
      :pagination="{ rowsPerPage: 0 }">

      <!-- HEADER CUSTOM -->
      <template v-slot:header="props">
        <q-tr :props="props" class="bg-grey-3 text-weight-bold text-uppercase">
          <q-th v-for="col in props.cols" :key="col.name" align="center">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <!-- BODY CUSTOM -->
      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td v-for="col in props.cols" :key="col.name">

            <!-- 🔥 KHUSUS KOLOM PERAWAT -->
            <div v-if="col.name === 'perawat'" class="column items-center">

              <!-- QR -->
              <vue-qrcode :value="generateQr(props.row)" tag="svg" :options="{
                width: 60,
                margin: 0,
                errorCorrectionLevel: 'Q'
              }" />

              <!-- Nama -->
              <div class="text-weight-bold q-mt-xs">
                {{ props.row[col.field] }}
              </div>

            </div>

            <!-- 🔥 KOLOM LAIN NORMAL -->
            <div v-else>
              {{ props.row[col.field] }}
            </div>

          </q-td>

        </q-tr>
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
  { name: 'tgl', label: 'TGL', field: 'tgl' },
  { name: 'jam', label: 'JAM', field: 'jam' },
  { name: 'tensi', label: 'TENSI(MmHg)', field: 'tensi' },
  { name: 'nadi', label: 'NADI(x/mnt)', field: 'nadi' },
  { name: 'rr', label: 'RR(x/mnt)', field: 'rr' },
  { name: 'suhu', label: 'SUHU(C)', field: 'suhu' },
  { name: 'spo2', label: 'SP.O2(%)', field: 'spo2' },
  { name: 'gcs', label: 'GCS', field: 'gcs' },
  { name: 'pupil', label: 'PUPIL', field: 'pupil' },
  { name: 'output', label: 'OUTPUT', field: 'output' },
  { name: 'obat', label: 'NAMA OBAT', field: 'obat' },
  { name: 'keluhan', label: 'KELUHAN', field: 'keluhan' },
  { name: 'tindakan', label: 'TINDAKAN', field: 'tindakan' },
  { name: 'perawat', label: 'PERAWAT', field: 'perawat' }
]

const rows = computed(() => {
  const data = props?.pasien?.tinjauanulang || []

  return data.map(item => {
    const tglRaw = item?.tgl || ''

    return {
      id: item?.id,

      tgl: tglRaw.split(' ')[0] || '-',
      jam: tglRaw.split(' ')[1] || '-',

      tensi: item?.sistole && item?.diastole
        ? `${item.sistole}/${item.diastole}`
        : '-',

      nadi: item?.nadi || '-',
      rr: item?.pernapasanx || '-',
      suhu: item?.suhu || '-',
      spo2: item?.spo2 || '-',

      gcs: (item?.eye && item?.verbal && item?.motorik)
        ? `${item.eye}/${item.verbal}/${item.motorik}`
        : '-',

      pupil: item?.keadaan_pupil || '-',

      output: item?.output || '-',

      obat: '-', // belum ada field obat di data ini

      keluhan: item?.keluhan || '-',

      tindakan: item?.keterangan || '-',

      perawat: item?.nama || '-'
    }
  })
})

const generateQr = (item) => {
  const noreg = item?.noreg || '-'
  const perawat = item?.perawat || item?.nama || '-'
  const tgl = item?.tgl || '-'

  const enc = btoa(`${noreg}|${perawat}|${tgl}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
</script>

<style scoped>
/* 🔥 MODE PRINT */
@media print {
  .q-table {
    font-size: 10px;
  }

  .q-table th,
  .q-table td {
    padding: 4px 6px;
  }

  .q-table {
    border: 1px solid #000;
  }

  .q-tr {
    page-break-inside: avoid;
  }
}
</style>
