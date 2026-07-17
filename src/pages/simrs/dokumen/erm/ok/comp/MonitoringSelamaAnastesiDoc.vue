<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal v-if="!history" title1="MONITORING SELAMA ANESTESI" title2="" />

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
          <!-- VISUAL CHART -->
          <div class="anesthesia-chart-container bg-white q-mb-md">
            <div class="chart-section upper-section">
              <div class="chart-wrapper" style="width: 100%;">
                <apexchart type="scatter" height="300" width="100%" :key="'upper-' + logs.length"
                  :options="upperChartOptions" :series="upperSeries" />
              </div>
            </div>

            <div class="vital-signs-container flex no-wrap items-center q-mt-md">
              <div class="custom-y-labels q-ml-sm text-center">
                <div class="label-row flex no-wrap text-weight-bold">
                  <span class="label-col">R</span>
                  <span class="label-col">N</span>
                  <span class="label-col">TD</span>
                </div>
                <div v-for="label in medicalYLabels" :key="label.grid" class="label-row flex no-wrap"
                  :style="{ height: labelRowHeight + 'px' }">
                  <span class="label-col">{{ label.r }}</span>
                  <span class="label-col">{{ label.n }}</span>
                  <span class="label-col">{{ label.td }}</span>
                </div>
              </div>

              <div class="chart-wrapper flex-grow" style="width: 100%;">
                <apexchart ref="chartWrapperRef" type="line" :key="'lower-' + logs.length" :options="lowerChartOptions"
                  :series="lowerSeries" height="400px" width="100%" />
              </div>
            </div>
          </div>

          <!-- TABLE 1: LOG MONITORING SELAMA ANESTESI -->
          <table class="doc-table q-mb-md">
            <thead>
              <tr>
                <th colspan="12" class="text-weight-bold title-th bg-grey-3">LOG MONITORING SELAMA ANESTESI</th>
              </tr>
              <tr class="bg-grey-2">
                <th width="8%" rowspan="2" class="text-center vertical-middle">
                  {{ store.inputForm?.waktu ? 'Jam' : 'Waktu (Mnt)' }}
                </th>
                <th width="15%" colspan="2" class="text-center">Tanda Vital</th>
                <th width="8%" rowspan="2" class="text-center vertical-middle">RR</th>
                <th colspan="5" class="text-center">Gas Anestesi</th>
                <th width="15%" rowspan="2" class="text-center vertical-middle">Milestone</th>
                <th width="20%" rowspan="2" class="text-center vertical-middle">Obat & Cairan</th>
              </tr>
              <tr class="bg-grey-2">
                <th class="text-center">TD (S/D)</th>
                <th class="text-center">Nadi</th>
                <th class="text-center">O₂</th>
                <th class="text-center">N₂O</th>
                <th class="text-center">Hal.</th>
                <th class="text-center">Iso.</th>
                <th class="text-center">Sev.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!store.data?.length">
                <td colspan="12" class="text-center text-grey">Tidak ada data log monitoring</td>
              </tr>
              <tr v-else v-for="(log, idx) in store.data" :key="idx">
                <td class="text-center text-weight-bold">
                  {{ formatLogTime(log.time, store.inputForm?.waktu) }}
                </td>
                <td class="text-center">
                  {{ log.td_sistolik && log.td_diastolik ? log.td_sistolik + '/' + log.td_diastolik : '-' }}
                </td>
                <td class="text-center">{{ log.nadi || '-' }}</td>
                <td class="text-center">{{ log.resp || '-' }}</td>
                <td class="text-center">{{ log.o2 || '-' }}</td>
                <td class="text-center">{{ log.n2o || '-' }}</td>
                <td class="text-center">{{ log.halothan || '-' }}</td>
                <td class="text-center">{{ log.isoflurane || '-' }}</td>
                <td class="text-center">{{ log.sevoflurane || '-' }}</td>
                <td>{{ formatMilestone(log) }}</td>
                <td>{{ formatObatDanCairan(log) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- TABLE 2: DETAIL MEDIKASI & CAIRAN -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3">MEDIKASI & CAIRAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%" class="text-weight-bold">Jam Mulai</td>
                <td width="25%">{{ store.inputForm?.waktu || '-' }}</td>
                <td width="25%" class="text-weight-bold">Konversi Anestesi</td>
                <td width="25%">{{ store.inputForm?.konversi_anastesi || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Respirasi</td>
                <td colspan="3">{{ store.inputForm?.respirasi || '-' }}</td>
              </tr>
              <tr>
                <td colspan="2" class="bg-grey-1 text-weight-bold text-center">INPUT CAIRAN / TRANSFUSI</td>
                <td colspan="2" class="bg-grey-1 text-weight-bold text-center">OUTPUT CAIRAN</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Kristaloid</td>
                <td>{{ store.inputForm?.kristaloid ? store.inputForm?.kristaloid + ' cc' : '-' }}</td>
                <td class="text-weight-bold">Perdarahan</td>
                <td>{{ store.inputForm?.pendarahan ? store.inputForm?.pendarahan + ' cc' : '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Koloid</td>
                <td>{{ store.inputForm?.koloid ? store.inputForm?.koloid + ' cc' : '-' }}</td>
                <td class="text-weight-bold">Urine</td>
                <td>{{ store.inputForm?.urine ? store.inputForm?.urine + ' cc' : '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Transfusi</td>
                <td>{{ store.inputForm?.transfusi ? store.inputForm?.transfusi + ' cc' : '-' }}</td>
                <td class="text-weight-bold">Lain-lain</td>
                <td>{{ store.inputForm?.lain ? store.inputForm?.lain + ' cc' : '-' }}</td>
              </tr>
              <tr class="bg-grey-2 text-weight-bold">
                <td>Total Masuk</td>
                <td>{{ store.inputForm?.jumlah_tr ? store.inputForm?.jumlah_tr + ' cc' : '-' }}</td>
                <td>Total Keluar</td>
                <td>{{ store.inputForm?.jumlah_kel ? store.inputForm?.jumlah_kel + ' cc' : '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Catatan / Instruksi</td>
                <td colspan="3">{{ store.inputForm?.catatan || '-' }}</td>
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

// Logic chart dari MonitoringSelamaAnastesiPage
const logs = computed(() => store.data)

const scaleN = (val) => {
  if (!val) return val
  return 40 + ((val - 60) * (160 - 40)) / (180 - 60)
}
const scaleR = (val) => {
  if (!val) return val
  return 140 + ((val - 12) * (220 - 140)) / (28 - 12)
}

const medicalYLabels = [
  { grid: 220, r: '28', n: '', td: '220' },
  { grid: 200, r: '24', n: '', td: '200' },
  { grid: 180, r: '20', n: '', td: '180' },
  { grid: 160, r: '16', n: '180', td: '160' },
  { grid: 140, r: '12', n: '160', td: '140' },
  { grid: 120, r: '', n: '140', td: '120' },
  { grid: 100, r: '', n: '120', td: '100' },
  { grid: 80, r: '', n: '100', td: '80' },
  { grid: 60, r: '', n: '80', td: '60' },
  { grid: 40, r: '', n: '60', td: '40' },
  { grid: 20, r: '', n: '', td: '20' }
]

const chartWrapperRef = ref(null)
const labelRowHeight = ref(40)
const dynamicMaxTime = computed(() => {
  if (logs.value.length === 0) return 145
  const lastLogTime = Math.max(...logs.value.map(l => l.time))
  const calculatedMax = lastLogTime + 30
  return calculatedMax < 145 ? 145 : calculatedMax
})

const maxTime = 480
const lowerChartOptions = computed(() => ({
  chart: {
    id: 'vital-signs', group: 'anesthesia', toolbar: { show: false },
    events: {
      mounted: () => {
        syncLabels()
      },
      updated: () => {
        syncLabels()
      }
    }
  },
  xaxis: {
    type: 'numeric', min: 0, max: dynamicMaxTime.value, tickAmount: dynamicMaxTime.value / 5,
    labels: {
      offsetY: 0,
      style: { fontSize: '10px' },
      rotate: -45,
      formatter: (val) => formatXAxisTime(val, store.inputForm?.waktu)
    },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 20, max: 220, tickAmount: 10, labels: {
      show: false
    }
  },
  stroke: {
    width: [0, 0, 0, 0],
    curve: 'straight',
    dashArray: [0, 0, 0, 0],
    connectNulls: true
  },
  axisBorder: {
    show: true,
    color: '#e0e0e0',
    width: 1,
    offsetX: 0,
    offsetY: 0
  },
  markers: {
    size: 0,
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, { seriesIndex, dataPointIndex, w }) {
      if (val === null || typeof val === 'undefined') {
        return ''
      }
      if (seriesIndex === 0) return '∨'
      if (seriesIndex === 1) return '∧'
      if (seriesIndex === 2) return '●'
      if (seriesIndex === 3) return '✱'
      if (seriesIndex === 4) return '↑'
      if (seriesIndex === 5) return '↓'
      if (seriesIndex === 6) return '→'
      if (seriesIndex === 7) return '←'
      if (seriesIndex === 8) return 'X'
      if (seriesIndex === 9) return 'E'
      if (seriesIndex === 10) return 'AR'
      if (seriesIndex === 11) return 'CR'
      if (seriesIndex === 12) return 'SR'
      return val
    },
    style: {
      fontSize: '10px',
      fontWeight: 'bold', offsetY: -10,
      colors: [
        function ({ seriesIndex }) {
          const colors = ['#2E7D32', '#f44336', '#2196f3', '#ff9800', '#000', '#000', '#000', '#000', '#000', '#000', '#000']
          return colors[seriesIndex] || '#000'
        }
      ]
    },
    background: { enabled: false }
  },
  grid: {
    borderColor: '#e0e0e0',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    markers: {
      width: 0,
      height: 0,
      strokeWidth: 0,
      radius: 0,
      offsetY: 0,
      offsetX: 0,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5
    },
    formatter: function (seriesName) {
      let symbol = ''
      let color = ''

      switch (seriesName) {
        case 'Sistolik':
          symbol = '∨'; color = '#2E7D32'; break
        case 'Diastolik':
          symbol = '∧'; color = '#f44336'; break
        case 'Nadi':
          symbol = '●'; color = '#2196f3'; break
        case 'Respirasi':
          symbol = '✱'; color = '#ff9800'; break
        case 'Intubasi':
          symbol = '↑'; color = '#000000'; break
        case 'Ekstubasi':
          symbol = '↓'; color = '#000000'; break
        case 'Mulai Operasi':
          symbol = '→'; color = '#000000'; break
        case 'Selesai Operasi':
          symbol = '←'; color = '#000000'; break
        case 'Ass. Resep':
          symbol = 'AR'; color = '#000000'; break
        case 'X-Ana-X':
          symbol = 'X'; color = '#000000'; break
        case 'e-N-o O.R.O':
          symbol = 'E'; color = '#000000'; break
        case 'Conrt Resep':
          symbol = 'CR'; color = '#000000'; break
        case 'Spont Resep':
          symbol = 'SR'; color = '#000000'; break
        default:
          symbol = '•'; color = '#999'
      }

      return `
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="color: ${color}; font-weight: bold; font-size: 14px;">${symbol}</span>
        <span style="color: #333; font-size: 11px;">${seriesName}</span>
      </div>
    `
    }
  },
  colors: ['#2E7D32', '#f44336', '#2196F3', '#FFA000'],
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    x: { show: true },
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const data = logs.value[dataPointIndex]
      if (!data) return ''
      const statusHtml = !!data?.mulai_op ? `<div class="text-green-9 text-bold">→ Mulai OP</div>` : ''
      const selesaiHtml = !!data?.selesai_op ? `<div class="text-black text-bold">← Selesai OP</div>` : ''
      const intubasiHtml = !!data?.intubasi ? `<div class="text-black text-bold">↑ Intubasi</div>` : ''
      const extubasiHtml = !!data?.extubasi ? `<div class="text-black text-bold">↓ Extubasi</div>` : ''
      const anaHtml = !!data?.x_ana ? `<div class="text-black text-bold">X-Ana-X</div>` : ''
      const enoHtml = !!data?.eno_oro ? `<div class="text-black text-bold">e-N-o O.R.O</div>` : ''
      const assResHtml = !!data?.ass_resep ? `<div class="text-black text-bold">Ass. Resep</div>` : ''
      return `
      <div class="q-pa-sm bg-white shadow-2">
        <div class="text-bold">Menit ke-${data.time}</div>
        <div class="text-red">TD: ${data.td_sistolik}/${data.td_diastolik} mmHg</div>
        <div class="text-blue">Nadi: ${data.nadi} bpm</div>
        <div class="text-orange">Resp: ${data.resp} x/mnt</div>
        ${statusHtml}
        ${selesaiHtml}
        ${intubasiHtml}
        ${extubasiHtml}
        ${anaHtml}
        ${enoHtml}
        ${assResHtml}
      </div>
    `
    }
  }
}))

const lowerSeries = computed(() => [
  { name: 'Sistolik', type: 'line', data: logs.value.map(l => ({ x: l.time, y: l.td_sistolik, originalValue: l.td_sistolik })) },
  { name: 'Diastolik', type: 'line', data: logs.value.map(l => ({ x: l.time, y: l.td_diastolik, originalValue: l.td_diastolik })) },
  { name: 'Nadi', type: 'line', data: logs.value.map(l => ({ x: l.time, y: scaleN(l.nadi), originalValue: l.nadi })) },
  { name: 'Respirasi', type: 'line', data: logs.value.map(l => ({ x: l.time, y: scaleR(l.resp), originalValue: l.resp })) },
  {
    name: 'Intubasi',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l.intubasi ? 25 : null, originalValue: l.intubasi }))
  },
  {
    name: 'Ekstubasi',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l.extubasi ? 25 : null, originalValue: l.extubasi }))
  },
  {
    name: 'Mulai Operasi',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l.mulai_op ? 25 : null, originalValue: l.mulai_op }))
  },
  {
    name: 'Selesai Operasi',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l.selesai_op ? 25 : null, originalValue: l.selesai_op }))
  },
  {
    name: 'X-Ana-X',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l.x_ana ? 25 : null, originalValue: l.x_ana }))
  },
  {
    name: 'e-N-o O.R.O',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l.eno_oro ? 25 : null, originalValue: l.eno_oro }))
  },
  {
    name: 'Ass. Resep',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l.ass_resep ? 25 : null, originalValue: l.ass_resep }))
  },
  {
    name: 'Conrt Resep',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l?.cn_resp ? 25 : null, originalValue: l?.cn_resp }))
  },
  {
    name: 'Spont Resep',
    type: 'scatter',
    data: logs.value.map(l => ({ x: l.time, y: l?.sp_resp ? 25 : null, originalValue: l?.sp_resp }))
  },
])

const upperChartOptions = computed(() => ({
  chart: {
    id: 'meds',
    group: 'anesthesia2',
    toolbar: { show: false },
  },
  xaxis: {
    type: 'numeric',
    min: 0,
    max: dynamicMaxTime.value,
    tickAmount: dynamicMaxTime.value / 5,
    labels: {
      offsetY: 0,
      style: { fontSize: '10px' },
      rotate: -45,
      formatter: (val) => formatXAxisTime(val, store.inputForm?.waktu)
    },
  },
  yaxis: {
    min: 1,
    max: allRows.value.length,
    tickAmount: allRows.value.length - 1,
    labels: {
      style: { fontSize: '8px', fontWeight: 'bold' },
      formatter: (val) => {
        const idx = Math.round(val) - 1
        const obat = store.data.flatMap(o => o.obat).find(o => o.nama === allRows.value[idx])
        const cairan = store.data.flatMap(o => o.cairan).find(o => o.nama === allRows.value[idx])
        let nama = ''

        if (obat) nama = obat.nama + ' ' + obat.dosis + ' ' + obat.cara_masuk
        else if (cairan) nama = cairan.nama + ' ' + cairan.volume
        else nama = allRows.value[idx] ?? ''

        return nama
      }
    }
  },
  stroke: {
    width: allRows.value.map(name => gasKeys.includes(name) ? 3 : 0),
    dashArray: allRows.value.map(name => gasKeys.includes(name) ? 2 : 0),
    curve: 'straight',
    connectNulls: true
  },
  grid: {
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } }
  },
  dataLabels: {
    enabled: true,
    formatter: (val, opt) => {
      return opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].markerLabel || ''
    },
    style: { fontSize: '9px', colors: ['#000'] },
    offsetY: -5
  },
  markers: {
    size: 2,
    hover: { size: 7 }
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    x: { show: true },
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const data = w.config.series[seriesIndex].data[dataPointIndex]
      if (gasKeys.includes(w.config.series[seriesIndex].name)) {
        const nama = gasTr(w.config.series[seriesIndex].name)
        return `
      <div class="q-pa-xs">
        <div class="text-bold">${nama}</div>
        <div>Waktu:  menit ${data.x}</div>
      </div>
    `}
      else {
        return `
      <div class="q-pa-xs">
        <div class="text-bold">${w.config.series[seriesIndex].name}</div>
        <div>Waktu:  menit ${data.x}</div>
        <div>Dosis: ${data.info}</div>
      </div>
    `}
    }
  }
}))

function gasTr (gas) {
  switch (gas) {
    case 'o2': return 'O₂'
    case 'n2o': return 'N₂O'
    case 'halothan': return 'Halothan'
    case 'isoflurane': return 'Isoflurane'
    case 'sevoflurane': return 'Sevoflurane'
    default: return gas
  }
}

const gasKeys = ['o2', 'n2o', 'halothan', 'isoflurane', 'sevoflurane']

const allRows = computed(() => {
  const uniqueObat = [...new Set(logs.value.flatMap(l =>
    (l.obat || []).map(o => o.nama)
  ))]

  const uniqueCairan = [...new Set(logs.value.flatMap(l =>
    (l.cairan || []).map(c => c.nama)
  ))]

  return [...gasKeys, ...uniqueObat, ...uniqueCairan].reverse()
})

const upperSeries = computed(() => {
  return allRows.value.map((itemName, index) => {
    const yValue = index + 1
    const isGas = gasKeys.includes(itemName)

    if (isGas) {
      const gasEntries = logs.value.filter(l => l[itemName] >= 1)
      const lastTrueTime = gasEntries.length > 0 ? Math.max(...gasEntries.map(l => l.time)) : -1

      const seriesData = logs.value.map(l => {
        return {
          x: l.time,
          y: l.time <= lastTrueTime ? yValue : null,
          markerLabel: l.time <= lastTrueTime ? itemName.charAt(0).toUpperCase() : '',
        }
      })

      return {
        name: itemName,
        type: 'line',
        data: seriesData,
      }
    } else {
      const seriesData = logs.value.map(l => {
        const item = [...(l.obat || []), ...(l.cairan || [])].find(i => i.nama === itemName)
        return item ? { x: l.time, y: yValue, info: item.dosis || item.volume, markerLabel: itemName.charAt(0).toUpperCase() + ' ' + (item.dosis || item.volume) } : null
      }).filter(d => d !== null)

      return {
        name: itemName,
        type: 'scatter',
        data: seriesData
      }
    }
  })
})

function syncLabels () {
  if (!chartWrapperRef.value) return

  setTimeout(() => {
    const gridElement = chartWrapperRef.value?.$el?.querySelector?.('.apexcharts-grid')

    if (gridElement) {
      const totalHeight = gridElement.getBoundingClientRect().height
      if (totalHeight > 0) {
        const exactBarisHeight = totalHeight / 10
        labelRowHeight.value = exactBarisHeight
      }
    }
  }, 200)
}

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

function formatMilestone (log) {
  const milestone = []
  if (log.mulai_op) milestone.push('Mulai Operasi')
  if (log.selesai_op) milestone.push('Selesai Operasi')
  if (log.intubasi) milestone.push('Intubasi')
  if (log.extubasi) milestone.push('Ekstubasi')
  if (log.x_ana) milestone.push('X-Ana-X')
  if (log.eno_oro) milestone.push('e-N-o O.R.O')
  if (log.ass_resep) milestone.push('Ass. Resep')
  if (log.cn_resp) milestone.push('Conrt Resep')
  if (log.sp_resp) milestone.push('Spont Resep')
  return milestone.length ? milestone.join(', ') : '-'
}

function formatObatDanCairan (log) {
  const result = []
  if (log.obat && log.obat.length) {
    log.obat.forEach(o => {
      if (typeof o === 'string') {
        result.push(o)
      } else {
        result.push(`${o.nama} (${o.dosis || '-'}, ${o.cara_masuk || '-'})`)
      }
    })
  }
  if (log.cairan && log.cairan.length) {
    log.cairan.forEach(c => {
      if (typeof c === 'string') {
        result.push(c)
      } else {
        result.push(`${c.nama} (${c.volume || '-'})`)
      }
    })
  }
  return result.length ? result.join(', ') : '-'
}

const penataAnestesi = computed(() => {
  const code = store.inputForm?.penata_anastesi
  if (!code) return null
  return laporanOp.nakes?.find(x => x.kdpegsimrs === code) || { nama: code, nip: '-' }
})

const dokterAnestesi = computed(() => {
  const code = store.inputForm?.dokter_anastesi
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
  return generateQRUrl(props.pasien?.noreg, 'Monitoring Selama Anestesi - Penata', code, 'PENUNJANG')
})

const qrDokter = computed(() => {
  const code = dokterAnestesi.value?.kdpegsimrs || dokterAnestesi.value?.nip || dokterAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Monitoring Selama Anestesi - Dokter', code, 'PENUNJANG')
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'MONITORING SELAMA ANESTESI',
  popTitle: 'MONITORING SELAMA ANESTESI'
}

onMounted(async () => {
  if (laporanOp.nakes.length === 0) {
    laporanOp.getNakes()
  }
  try {
    await store.getMonitoringSelama(props.pasien)
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
    console.log('gagal memuat data monitoring', e)
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

.vertical-middle {
  vertical-align: middle !important;
}

.doc-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 10px;

  th,
  td {
    border: 1px solid #000;
    padding: 4px 6px;
    vertical-align: top;
  }

  th {
    background-color: #e0e0e0;
    font-weight: bold;
    text-align: left;
    font-size: 11px;
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

.upper-section {
  border-bottom: 2px solid #444;
  background: white;
  height: 350px;
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
  margin-top: -89px;
}

.label-row {
  height: calc((280px) / 10);
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
  height: 800px;
  margin: auto;
  background: white;
}

.chart-section {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.side-label {
  width: 120px;
  background: #f8f8f8;
  border-right: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  font-size: 11px;
}

.multi-axis {
  display: flex;
  justify-content: space-around;
  padding: 0 5px;
}

.label-col {
  border-right: 1px solid #ddd;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 4px;
}
</style>
