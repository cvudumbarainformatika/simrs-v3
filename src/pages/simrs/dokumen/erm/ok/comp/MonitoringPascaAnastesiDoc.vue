<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal v-if="!history" title1="MONITORING PASCA ANESTESI" title2="" />

        <div v-if="!history" class="biodata-pasien q-my-md">
          <div class="flex justify-between">
            <div class="flex q-gutter-md kiri">
              <div style="width: 58px;" class="text-weight-bold">
                NO. RM
              </div>
              <div style="width: 70px;">
                : {{ pasien?.norm }}
              </div>
              <div class="text-weight-bold">
                NAMA PASIEN
              </div>
              <div>
                : {{ pasien?.nama_panggil }}
              </div>
            </div>
            <div class="flex q-gutter-md kanan">
              <div class="text-weight-bold">
                TGL. LAHIR
              </div>
              <div>
                : {{ dateFullFormat(pasien?.tgllahir) }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="column full-width">
              <div>
                <span class="q-mr-lg text-weight-bold">ALAMAT</span> : {{ pasien?.alamat ?? '-' }}
              </div>
            </div>
          </div>
        </div>

        <div class="dokumen-content q-mb-md">
          <!-- TABLE 1: KONDISI MASUK RR & MONITORING PARAMETERS -->
          <table class="doc-table q-mb-md">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3">KONDISI MASUK RUANG PEMULIHAN (RR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%" class="text-weight-bold">Jam Masuk</td>
                <td width="25%">{{ store.inputFormPasca?.jam_masuk || '-' }}</td>
                <td width="25%" class="text-weight-bold">Keadaan Umum</td>
                <td width="25%">{{ formatKeadaanUmum(store.inputFormPasca?.keadaan_umum) }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Pernapasan</td>
                <td colspan="3">{{ store.inputFormPasca?.pernapasan || '-' }}</td>
              </tr>
              <tr class="bg-grey-1 text-weight-bold">
                <td colspan="4">PARAMETER MONITORING</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Mulai Jam</td>
                <td>{{ store.inputFormPasca?.monitor_mulai || '-' }}</td>
                <td class="text-weight-bold">Selama</td>
                <td>{{ store.inputFormPasca?.monitor_selama || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Setiap (Menit)</td>
                <td colspan="3">{{ store.inputFormPasca?.monitor_setiap ? store.inputFormPasca?.monitor_setiap + ' Menit' : '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- VISUAL CHART -->
          <div class="anesthesia-chart-container bg-white q-mb-md">
            <div class="vital-signs-container flex no-wrap items-center q-mt-md">
              <!-- CUSTOM Y-AXIS LABELS -->
              <div class="custom-y-labels q-ml-sm text-center">
                <div class="label-row flex no-wrap text-weight-bold">
                  <span class="label-col">temp</span>
                  <span class="label-col">R</span>
                  <span class="label-col">N</span>
                  <span class="label-col">TD</span>
                </div>
                <div v-for="label in medicalYLabels" :key="label.grid" class="label-row flex no-wrap" :style="{ height: labelRowHeight + 'px' }">
                  <span class="label-col">{{ label.t }}</span>
                  <span class="label-col">{{ label.r }}</span>
                  <span class="label-col">{{ label.n }}</span>
                  <span class="label-col">{{ label.td }}</span>
                </div>
              </div>

              <!-- APEXCHART WRAPPER -->
              <div class="chart-wrapper flex-grow" style="width: 100%;">
                <apexchart ref="chartWrapperRef" type="line" :key="'lower-' + logs.length" :options="lowerChartOptions"
                  :series="lowerSeries" height="400px" width="100%" />
              </div>
            </div>
          </div>

          <!-- TABLE 2: LOG MONITORING RR -->
          <table class="doc-table q-mb-md">
            <thead>
              <tr>
                <th colspan="7" class="text-weight-bold title-th bg-grey-3">LOG MONITORING RUANG PEMULIHAN (RR)</th>
              </tr>
              <tr class="bg-grey-2">
                <th width="12%" class="text-center">{{ store.inputFormPasca?.monitor_mulai ? 'Jam' : 'Waktu (Menit)' }}</th>
                <th width="15%" class="text-center">TD (mmHg)</th>
                <th width="12%" class="text-center">Nadi (x/mnt)</th>
                <th width="12%" class="text-center">RR (x/mnt)</th>
                <th width="12%" class="text-center">Suhu (°C)</th>
                <th width="12%" class="text-center">SpO₂ (%)</th>
                <th width="25%">Obat / Cairan Diberikan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!store.dataPasca?.length">
                <td colspan="7" class="text-center text-grey">Tidak ada data log monitoring RR</td>
              </tr>
              <tr v-else v-for="(log, idx) in store.dataPasca" :key="idx">
                <td class="text-center text-weight-bold">
                  {{ formatLogTime(log.time, store.inputFormPasca?.monitor_mulai) }}
                </td>
                <td class="text-center">
                  {{ log.td_sistolik && log.td_diastolik ? log.td_sistolik + '/' + log.td_diastolik : '-' }}
                </td>
                <td class="text-center">{{ log.nadi || '-' }}</td>
                <td class="text-center">{{ log.resp || '-' }}</td>
                <td class="text-center">{{ log.temp || '-' }}</td>
                <td class="text-center">{{ log.spo2 || '-' }}</td>
                <td>{{ log.obat_cairan || log.keterangan || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- TABLE 3: INSTRUKSI PASCA ANESTESI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3">INSTRUKSI PASCA ANESTESI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%" class="text-weight-bold">Infus</td>
                <td width="25%">{{ store.inputFormPasca?.infus || '-' }}</td>
                <td width="25%" class="text-weight-bold">Antibiotika</td>
                <td width="25%">{{ store.inputFormPasca?.antibiotika || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Bila Mual / Muntah</td>
                <td>{{ store.inputFormPasca?.obat_mual || '-' }}</td>
                <td class="text-weight-bold">Bila Kesakitan</td>
                <td>{{ store.inputFormPasca?.obat_sakit || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Obat Lain-lain</td>
                <td>{{ store.inputFormPasca?.obat_lain || '-' }}</td>
                <td class="text-weight-bold">Minum / Makan</td>
                <td>{{ store.inputFormPasca?.makan_minum || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Lain-lain / Instruksi Lain</td>
                <td colspan="3">{{ store.inputFormPasca?.instruksi_lain || store.inputFormPasca?.lain_lain || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Signature Section -->
        <div class="row q-mt-xl justify-around">
          <div class="col-4 text-center">
            <div class="text-weight-bold q-mb-sm">Penata Anestesi</div>
            <div v-if="qrPenata" style="height: 90px; width: 90px; margin: 0 auto;" class="q-mb-sm">
              <vue-qrcode :value="qrPenata" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
            <div style="text-decoration: underline;" class="text-weight-bold">
              {{ penataAnestesi?.nama || 'Nama Penata Anestesi' }}
            </div>
            <div class="f-10">NIP. {{ penataAnestesi?.nip || '-' }}</div>
          </div>

          <div class="col-4 text-center">
            <div class="text-weight-bold q-mb-sm">Dokter Anestesi</div>
            <div v-if="qrDokter" style="height: 90px; width: 90px; margin: 0 auto;" class="q-mb-sm">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
            <div style="text-decoration: underline;" class="text-weight-bold">
              {{ dokterAnestesi?.nama || 'Nama Dokter Anestesi' }}
            </div>
            <div class="f-10">NIP. {{ dokterAnestesi?.nip || '-' }}</div>
          </div>
        </div>

      </div>
    </div>

    <q-btn v-if="!history" ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary"
      class="fixed-bottom-right" style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { useMonitoringSaatStore } from 'src/stores/simrs/kamaroperasi/assasement/monitoringSaat'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'
import { onMounted, ref, computed, nextTick } from 'vue'
import { dateFullFormat } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  history: {
    type: Boolean,
    default: false
  }
})

const store = useMonitoringSaatStore()
const laporanOp = useLaporanOperasiStore()
const refPrint = ref()

// Logic chart dari MonitoringPascaAnastesiPage
const logs = computed(() => store.dataPasca)
const scaleN = (val) => {
  if (!val) return val
  return 40 + ((val - 60) * (160 - 40)) / (180 - 60)
}
const scaleR = (val) => {
  if (!val) return val
  return 140 + ((val - 12) * (220 - 140)) / (28 - 12)
}
const scaleS = (val) => {
  if (!val) return val
  return 20 + ((val - 30) * (220 - 20)) / (40 - 30)
}

const medicalYLabels = [
  { grid: 220, t: '40', r: '28', n: '', td: '220' },
  { grid: 200, t: '39', r: '24', n: '', td: '200' },
  { grid: 180, t: '38', r: '20', n: '', td: '180' },
  { grid: 160, t: '37', r: '16', n: '180', td: '160' },
  { grid: 140, t: '36', r: '12', n: '160', td: '140' },
  { grid: 120, t: '35', r: '', n: '140', td: '120' },
  { grid: 100, t: '34', r: '', n: '120', td: '100' },
  { grid: 80, t: '33', r: '', n: '100', td: '80' },
  { grid: 60, t: '32', r: '', n: '80', td: '60' },
  { grid: 40, t: '31', r: '', n: '60', td: '40' },
  { grid: 20, t: '30', r: '', n: '', td: '20' }
]

const chartWrapperRef = ref(null)
const labelRowHeight = ref(40)

const dynamicMaxTime = computed(() => {
  if (logs.value.length === 0) return 145
  const lastLogTime = Math.max(...logs.value.map(l => l.time))
  const calculatedMax = lastLogTime + 30
  return calculatedMax < 145 ? 145 : calculatedMax
})

const lowerChartOptions = computed(() => ({
  chart: {
    id: 'vital-signs-pasca',
    toolbar: { show: false },
    events: {
      mounted: () => syncLabels(),
      updated: () => syncLabels()
    }
  },
  xaxis: {
    type: 'numeric', min: 0, max: dynamicMaxTime.value, tickAmount: dynamicMaxTime.value / 5,
    labels: {
      offsetY: 0,
      style: { fontSize: '10px' },
      rotate: -45,
      formatter: (val) => formatXAxisTime(val, store.inputFormPasca?.monitor_mulai)
    },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 20, max: 220, tickAmount: 10, labels: { show: false }
  },
  stroke: {
    width: [0, 0, 0, 0, 0],
    curve: 'straight',
    connectNulls: true
  },
  axisBorder: {
    show: true,
    color: '#e0e0e0',
    width: 1,
  },
  markers: { size: 0 },
  dataLabels: {
    enabled: true,
    formatter: function (val, { seriesIndex }) {
      if (val === null || typeof val === 'undefined') return ''
      if (seriesIndex === 0) return '∨'
      if (seriesIndex === 1) return '∧'
      if (seriesIndex === 2) return '●'
      if (seriesIndex === 3) return '✱'
      if (seriesIndex === 4) return '△'
      return val
    },
    style: {
      fontSize: '11px',
      fontWeight: 'bold',
      offsetY: -10,
      colors: [
        function ({ seriesIndex }) {
          const colors = ['#000000', '#000000', '#F44336', '#000000', '#2196F3']
          return colors[seriesIndex] || '#000'
        }
      ]
    },
    background: { enabled: false }
  },
  grid: {
    borderColor: '#e0e0e0',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    markers: { width: 0, height: 0, strokeWidth: 0, radius: 0 },
    itemMargin: { horizontal: 10, vertical: 5 },
    formatter: function (seriesName) {
      let symbol = ''
      let color = ''
      switch (seriesName) {
        case 'Sistolik': symbol = '∨'; color = '#000000'; break
        case 'Diastolik': symbol = '∧'; color = '#000000'; break
        case 'Nadi': symbol = '●'; color = '#F44336'; break
        case 'Respirasi': symbol = '✱'; color = '#000000'; break
        case 'Suhu': symbol = '△'; color = '#2196F3'; break
        default: symbol = '•'; color = '#999'
      }
      return `
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="color: ${color}; font-weight: bold; font-size: 14px;">${symbol}</span>
        <span style="color: #333; font-size: 11px;">${seriesName}</span>
      </div>`
    }
  },
  colors: ['#000000', '#000000', '#F44336', '#000000', '#2196F3'],
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    x: { show: true },
    custom: function ({ dataPointIndex }) {
      const data = logs.value[dataPointIndex]
      if (!data) return ''
      return `
      <div class="q-pa-sm bg-white shadow-2">
        <div class="text-bold">Menit ke-${data.time}</div>
        <div class="text-red">TD: ${data.td_sistolik}/${data.td_diastolik} mmHg</div>
        <div class="text-blue">Nadi: ${data.nadi} bpm</div>
        <div class="text-orange">Resp: ${data.resp} x/mnt</div>
        <div class="text-black">Suhu: ${data.temp || '-'} °C</div>
      </div>`
    }
  }
}))

const lowerSeries = computed(() => [
  { name: 'Sistolik', type: 'line', data: logs.value.map(l => ({ x: l.time, y: l.td_sistolik })) },
  { name: 'Diastolik', type: 'line', data: logs.value.map(l => ({ x: l.time, y: l.td_diastolik })) },
  { name: 'Nadi', type: 'line', data: logs.value.map(l => ({ x: l.time, y: scaleN(l.nadi) })) },
  { name: 'Respirasi', type: 'line', data: logs.value.map(l => ({ x: l.time, y: scaleR(l.resp) })) },
  { name: 'Suhu', type: 'line', data: logs.value.map(l => ({ x: l.time, y: scaleS(l.temp) })) }
])

function syncLabels () {
  if (!chartWrapperRef.value) return
  setTimeout(() => {
    const gridElement = chartWrapperRef.value?.$el?.querySelector?.('.apexcharts-grid')
    if (gridElement) {
      const totalHeight = gridElement.getBoundingClientRect().height
      if (totalHeight > 0) {
        labelRowHeight.value = totalHeight / 10
      }
    }
  }, 200)
}

function formatKeadaanUmum (val) {
  if (!val) return '-'
  if (Array.isArray(val)) return val.join(', ')
  return val
}

const penataAnestesi = computed(() => {
  const code = store.inputFormPasca?.penata_anastesi || store.inputFormPasca?.penata_anestesi || store.inputFormPasca?.dokter_anastesi || store.formKeluar?.penata_anastesi || props.pasien?.nakes || ''
  if (!code) return null
  return laporanOp.nakes?.find(x => x.kdpegsimrs === code) || { nama: code, nip: '-' }
})

const dokterAnestesi = computed(() => {
  const code = props.pasien?.pra_induksi?.dokter_anastesi || store.formKeluar?.dokter_anastesi || props.pasien?.laporan_operasi?.dokter_anastesi || props.pasien?.anastesi?.dokter_anastesi || ''
  if (!code) return null
  return laporanOp.nakes?.find(x => x.kdpegsimrs === code) || { nama: code, nip: '-' }
})

function generateQRUrl (noreg, dokumen, petugas, asal) {
  if (!petugas) return ''
  try {
    const enc = btoa(`${noreg}|${dokumen}|${asal}|${petugas}`)
    return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  } catch (e) {
    return petugas
  }
}

const qrPenata = computed(() => {
  const code = penataAnestesi.value?.kdpegsimrs || penataAnestesi.value?.nip || penataAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Monitoring Pasca Anestesi - Penata', code, 'PENUNJANG')
})

const qrDokter = computed(() => {
  const code = dokterAnestesi.value?.kdpegsimrs || dokterAnestesi.value?.nip || dokterAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Monitoring Pasca Anestesi - Dokter', code, 'PENUNJANG')
})

function formatXAxisTime (val, waktuStr) {
  if (val % 15 !== 0) return ''
  let startHour = 0
  let startMin = 0
  if (waktuStr && typeof waktuStr === 'string' && waktuStr.includes(':')) {
    const parts = waktuStr.split(':')
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (!isNaN(h)) startHour = h
    if (!isNaN(m)) startMin = m
  }
  const totalMinutes = (startHour * 60 + startMin) + val
  const h = Math.floor((totalMinutes / 60) % 24).toString().padStart(2, '0')
  const m = Math.floor(totalMinutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

function formatLogTime (val, waktuStr) {
  if (!waktuStr || typeof waktuStr !== 'string' || !waktuStr.includes(':')) {
    return `${val}'`
  }
  let startHour = 0
  let startMin = 0
  const parts = waktuStr.split(':')
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (!isNaN(h)) startHour = h
  if (!isNaN(m)) startMin = m

  const totalMinutes = (startHour * 60 + startMin) + (parseInt(val, 10) || 0)
  const resH = Math.floor((totalMinutes / 60) % 24).toString().padStart(2, '0')
  const resM = Math.floor(totalMinutes % 60).toString().padStart(2, '0')
  return `${resH}:${resM}`
}

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'MONITORING PASCA ANESTESI',
  popTitle: 'MONITORING PASCA ANESTESI'
}

onMounted(async () => {
  if (laporanOp.nakes.length === 0) {
    laporanOp.getNakes()
  }
  try {
    await store.getMonitoringPasca(props.pasien)
    const charts = document.querySelectorAll('.vue-apexcharts')
    charts.forEach(el => el.style.pointerEvents = 'none')
    await nextTick()
    if (typeof syncLabels === 'function') {
      syncLabels()
    }
    setTimeout(() => {
      charts.forEach(el => el.style.pointerEvents = 'auto')
    }, 500)
  } catch (e) {
    console.log('gagal memuat data monitoring pasca', e)
  }
})
</script>

<style lang="scss" scoped>
.page-legal {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 21.59cm;

  .contentx {
    padding: 10mm;
  }
}

.biodata-pasien {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.f-10 {
  font-size: 10px;
}

.f-12 {
  font-size: 12px;
}

.text-weight-bold {
  font-weight: bold;
}

.doc-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 11px;

  th, td {
    border: 1px solid #000;
    padding: 6px 10px;
    vertical-align: top;
  }

  th {
    background-color: #e0e0e0;
    font-weight: bold;
    text-align: left;
    font-size: 12px;
  }
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;

    .contentx {
      padding: 5mm;
    }
  }

  .hide-on-print {
    display: none;
  }

  @page {
    margin: 10mm;
  }
}

:deep(.apexcharts-yaxis-label) {
  fill: #333;
  text-transform: uppercase;
}

:deep(.apexcharts-legend-marker) {
  display: none !important;
}

:deep(.apexcharts-legend-series) {
  margin-left: 0 !important;
  padding-left: 2px !important;
}

.vital-signs-container {
  height: 400px;
}

.custom-y-labels {
  width: 120px;
  display: flex;
  flex-direction: column;
  margin-top: -60px;
}

.label-row {
  height: calc((305px) / 10);
  display: flex;
  align-items: right;
}

.label-col {
  width: 33%;
  font-size: 11px;
}

.anesthesia-chart-container {
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: auto;
  background: white;
}

.chart-wrapper {
  flex-grow: 1;
}
</style>
