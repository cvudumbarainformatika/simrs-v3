  <div v-if="col.name === 'tindakan'" class="text-wrap">
    {{ props.row[col.field] }}
  </div>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const columns = [
  { name: 'tgl', label: 'TGL', field: 'tgl', style: 'width: 70px' },
  { name: 'jam', label: 'JAM', field: 'jam', style: 'width: 60px' },
  { name: 'tensi', label: 'TENSI', field: 'tensi', style: 'width: 80px' },
  { name: 'nadi', label: 'NADI', field: 'nadi', style: 'width: 60px' },
  { name: 'rr', label: 'RR', field: 'rr', style: 'width: 60px' },
  { name: 'suhu', label: 'SUHU', field: 'suhu', style: 'width: 60px' },
  { name: 'spo2', label: 'SP.O2', field: 'spo2', style: 'width: 70px' },
  { name: 'gcs', label: 'GCS', field: 'gcs', style: 'width: 70px' },
  { name: 'pupil', label: 'PUPIL', field: 'pupil', style: 'width: 80px' },
  { name: 'output', label: 'OUTPUT', field: 'output', style: 'width: 70px' },
  { name: 'obat', label: 'OBAT', field: 'obat', style: 'width: 100px' },
  { name: 'keluhan', label: 'KELUHAN', field: 'keluhan', style: 'width: 120px' },
  { name: 'tindakan', label: 'TINDAKAN', field: 'tindakan', style: 'width: 150px' },
  { name: 'perawat', label: 'PERAWAT', field: 'perawat', style: 'width: 120px' }
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
  const enc = btoa(`${item?.noreg}|${item?.perawat}|${item?.tglFull}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
</script>

<style scoped>
/* WRAPPER */
.print-wrapper {
  width: 100%;
}

/* PRINT MODE */
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
    word-break: break-word;
    white-space: normal;
  }

  .q-tr {
    page-break-inside: avoid;
  }
}

.text-wrap {
  white-space: pre-line;
  /* 🔥 support enter (\n) */
  word-break: break-word;
  max-width: 250px;
  /* 🔥 biar gak dorong tabel */
  line-height: 1.2;
}

.q-table td {
  vertical-align: top;
}
</style>
