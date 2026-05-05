<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- AREA 1: KONDISI MASUK RR -->
    <q-card flat bordered class="bg-white q-mb-md">
      <q-card-section class="q-pa-sm bg-primary text-white">
        <div class="text-subtitle2 font-weight-bold">KONDISI MASUK RUANG PEMULIHAN (RR)</div>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-md-2 col-xs-6">
            <q-input v-model="store.inputFormPasca.jam_masuk" label="Masuk Jam" dense outlined bg-color="white"
              mask="##:##" />
          </div>
          <div class="col-md-4 col-xs-6">
            <q-select v-model="store.inputFormPasca.keadaan_umum"
              :options="['Sadar', 'Belum Sadar', 'Reflek (-)', 'Reflek (+)', 'Panas', 'Syok']" label="Keadaan Umum"
              dense outlined bg-color="white" multiple use-chips />
          </div>
          <div class="col-md-2 col-xs-4">
            <q-input v-model="store.inputFormPasca.pernapasan" label="Pernapasan" dense outlined bg-color="white" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- AREA 2: GRAFIK VITAL SIGNS (SAMA DENGAN LOWER CHART ANDA) -->
    <q-card flat bordered class="anesthesia-chart-container q-mb-md">
      <q-card-section class="q-pa-sm bg-secondary text-white">
        <div class="text-subtitle2 font-weight-bold">GRAFIK MONITORING PASCA ANESTESI</div>
      </q-card-section>

      <div class="vital-signs-container flex no-wrap items-center q-mt-md">
        <!-- CUSTOM Y-AXIS LABELS -->
        <div class="custom-y-labels q-ml-sm text-center">
          <div class="label-row flex no-wrap text-weight-bold">
            <span class="label-col ">temp</span>
            <span class="label-col ">R</span>
            <span class="label-col ">N</span>
            <span class="label-col ">TD</span>
          </div>
          <div v-for="label in medicalYLabels" :key="label.grid" class="label-row flex no-wrap">
            <span class="label-col ">{{ label.t }}</span>
            <span class="label-col ">{{ label.r }}</span>
            <span class="label-col ">{{ label.n }}</span>
            <span class="label-col ">{{ label.td }}</span>
          </div>
        </div>

        <!-- APEXCHART WRAPPER -->
        <div class="chart-wrapper flex-grow">
          <apexchart ref="chartWrapperRef" type="line" :key="'lower-' + logs.length" :options="lowerChartOptions"
            :series="lowerSeries" height="400px" :width="dynamicChartWidth" />
        </div>
      </div>
    </q-card>

    <!-- AREA 3: INSTRUKSI PASCA ANESTESI -->
    <q-card flat bordered class="bg-white q-mb-xl">
      <q-card-section class="q-pa-sm bg-deep-orange text-white">
        <div class="text-subtitle2 font-weight-bold">INSTRUKSI PASCA ANESTESI</div>
      </q-card-section>
      <div class="q-pa-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-md-4">
            <q-input v-model="store.inputFormPasca.monitor_mulai" label="Monitor Mulai Jam" dense outlined
              mask="##:##" />
          </div>
          <div class="col-md-4">
            <q-input v-model="store.inputFormPasca.monitor_selama" label="Selama (Jam/Menit)" dense outlined />
          </div>
          <div class="col-md-4">
            <q-input v-model="store.inputFormPasca.monitor_setiap" label="Setiap (Menit)" dense outlined />
          </div>

          <div class="col-md-6 q-mt-sm">
            <q-input v-model="store.inputFormPasca.infus" label="Infus" outlined type="textarea" rows="2" />
          </div>
          <div class="col-md-6 q-mt-sm">
            <q-input v-model="store.inputFormPasca.antibiotika" label="Antibiotika" outlined type="textarea" rows="2" />
          </div>

          <div class="col-md-4 q-mt-sm">
            <q-input v-model="store.inputFormPasca.obat_mual" label="Bila Mual / Muntah" dense outlined />
          </div>
          <div class="col-md-4 q-mt-sm">
            <q-input v-model="store.inputFormPasca.obat_sakit" label="Bila Kesakitan" dense outlined />
          </div>
          <div class="col-md-4 q-mt-sm">
            <q-input v-model="store.inputFormPasca.makan_minum" label="Minum / Makan" dense outlined />
          </div>

          <div class="col-md-12 q-mt-sm">
            <q-input v-model="store.inputFormPasca.lain_lain" label="Lain-lain" dense outlined />
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn label="Simpan Pasca Anestesi" color="primary" glossy icon="save" @click="simpanData" />
        </div>
      </div>
    </q-card>

    <!-- FAB BUTTON UNTUK TAMBAH LOG -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_chart" color="secondary" @click="showInputLog = true">
        <q-tooltip anchor="top left" self="bottom right" :offset="[10, 10]">Input Data Observasi Pasca</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <!-- DIALOG INPUT LOG OBSERVASI -->
    <q-dialog v-model="showInputLog" persistent @show="onDialogShow">
      <q-card style="min-width: 400px;">
        <q-card-section class="bg-secondary text-white row items-center q-pb-none">
          <div class="text-h6">Input Tanda Vital (Pasca)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="row q-col-gutter-md items-center">
            <!-- <div class="col-12"> -->
            <!-- <q-input v-model.number="formDialogLog.time" label="Waktu (Menit Ke-)" type="number" dense outlined
                autofocus /> -->
            <div class="col-6">
              <q-select v-model="formDialogLog.time" :options="minuteOptions" label="Pilih Waktu" dense outlined
                emit-value map-options options-dense behavior="menu">
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-8">
                Pilih menit observasi pasca anestesi.
              </div>
            </div>
            <!-- </div> -->
            <div class="col-6">
              <q-input v-model.number="formDialogLog.td_sistolik" label="TD Sistolik" type="number" dense outlined />
            </div>
            <div class="col-6">
              <q-input v-model.number="formDialogLog.td_diastolik" label="TD Diastolik" type="number" dense outlined />
            </div>
            <div class="col-6">
              <q-input v-model.number="formDialogLog.nadi" label="Nadi" type="number" dense outlined />
            </div>
            <div class="col-6">
              <q-input v-model.number="formDialogLog.resp" label="Respirasi" type="number" dense outlined />
            </div>
            <div class="col-12">
              <q-input v-model.number="formDialogLog.temp" label="Suhu" type="number" dense outlined />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn color="primary" label="Tambahkan" @click="tambahLog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { useMonitoringSaatStore } from 'src/stores/simrs/kamaroperasi/assasement/monitoringSaat'
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  pasien: { type: Object, default: () => ({}) }
})

const store = useMonitoringSaatStore()

// --- DATA FORM STATE ---
const formInstruksi = ref({ monitor_mulai: '', monitor_selama: '', monitor_setiap: '', infus: '', antibiotika: '', obat_mual: '', obat_sakit: '', makan_minum: '', lain_lain: '' })

// --- DIALOG & LOG STATE ---
const showInputLog = ref(false)
const formDialogLog = ref({ time: 0, td_sistolik: '', td_diastolik: '', nadi: '', resp: '', temp: '' })

// // --- DATA DUMMY LOGS (Agar langsung bisa dicek tanpa error) ---
// const logs = ref([
//   { time: 5, td_sistolik: 140, td_diastolik: 90, nadi: 85, resp: 20, temp: 36 },
//   { time: 15, td_sistolik: 130, td_diastolik: 80, nadi: 80, resp: 18, temp: 36.2 },
//   { time: 30, td_sistolik: 120, td_diastolik: 80, nadi: 75, resp: 16, temp: 36.5 }
// ])
const logs = computed(() => store.dataPasca)
// --- FUNGSI SCALE (SAMA PERSIS DENGAN KODINGAN ANDA) ---
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

// --- KONFIGURASI Y-AXIS (SAMA PERSIS) ---
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

// Waktu maksimal default 120 menit untuk Pasca Anestesi
const dynamicMaxTime = computed(() => {
  if (logs.value.length === 0) return 145
  const lastLogTime = Math.max(...logs.value.map(l => l.time))
  const calculatedMax = lastLogTime + 30
  return calculatedMax < 145 ? 145 : calculatedMax
})

const dynamicChartWidth = computed(() => {
  const pixelsPerMinute = 6
  const totalWidth = dynamicMaxTime.value * pixelsPerMinute
  return totalWidth + 'px'
})

// --- APEXCHARTS OPTIONS (MENYESUAIKAN LOWER CHART) ---
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
      formatter: (val) => {
        if (val % 15 === 0) {
          const jam = Math.floor(val / 60).toString().padStart(2, '0')
          const menit = (val % 60).toString().padStart(2, '0')
          return `${jam}:${menit}`
        }
        return ''
      }
    },
    axisTicks: { show: false }
  },
  yaxis: {
    min: 20, max: 220, tickAmount: 10, labels: { show: false }
  },
  stroke: {
    width: [0, 0, 0, 0],
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
      if (seriesIndex === 0) return '∨'  // Sistolik
      if (seriesIndex === 1) return '∧'  // Diastolik
      if (seriesIndex === 2) return '●'  // Nadi
      if (seriesIndex === 3) return '✱'  // Respirasi
      if (seriesIndex === 4) return '•  '  // suhu
      return val
    },
    style: {
      fontSize: '11px',
      fontWeight: 'bold',
      offsetY: -10,
      colors: [
        function ({ seriesIndex }) {
          const colors = ['#2E7D32', '#f44336', '#2196f3', '#ff9800', '#999']
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
        case 'Sistolik': symbol = '∨'; color = '#2E7D32'; break
        case 'Diastolik': symbol = '∧'; color = '#f44336'; break
        case 'Nadi': symbol = '●'; color = '#2196f3'; break
        case 'Respirasi': symbol = '✱'; color = '#ff9800'; break
        default: symbol = '•'; color = '#999'
      }
      return `
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="color: ${color}; font-weight: bold; font-size: 14px;">${symbol}</span>
        <span style="color: #333; font-size: 11px;">${seriesName}</span>
      </div>`
    }
  },
  colors: ['#2E7D32', '#f44336', '#2196F3', '#FFA000'],
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
    const gridElement = chartWrapperRef.value.$el.querySelector('.apexcharts-grid')
    if (gridElement) {
      const totalHeight = gridElement.getBoundingClientRect().height
      if (totalHeight > 0) {
        labelRowHeight.value = totalHeight / 10
      }
    }
  }, 200)
}

// --- FUNGSI AKSI ---
// const tambahLog = () => {
//   // Push data ke state dummy
//   logs.value.push({ ...formDialogLog.value })

//   // Update waktu untuk input berikutnya (misal tambah 15 menit)
//   formDialogLog.value.time = Number(formDialogLog.value.time) + 15
//   formDialogLog.value.td_sistolik = ''
//   formDialogLog.value.td_diastolik = ''
//   formDialogLog.value.nadi = ''
//   formDialogLog.value.resp = ''
//   formDialogLog.value.temp = ''

//   showInputLog.value = false
//   syncLabels()
// }

// ... (kode formKondisi dan logs yang sudah ada sebelumnya) ...

// 1. GENERATE OPSI MENIT (Kelipatan 5 menit)
const minuteOptions = computed(() => {
  const lastTime = logs.value.length > 0
    ? Math.max(...logs.value.map(l => l.time))
    : 0

  // Batas atas minimal 120 menit untuk RR (Recovery Room), atau + 30 menit dari log terakhir
  const limit = Math.max(145, lastTime + 30)
  const length = Math.floor(limit / 5) + 1

  return Array.from({ length }, (_, i) => {
    const val = i * 5
    return {
      label: `Menit ke-${val}`,
      value: val
    }
  })
})

// 2. FUNGSI KETIKA DIALOG MUNCUL
function onDialogShow () {
  const lastTime = logs.value.length > 0
    ? Math.max(...logs.value.map(l => l.time))
    : -5 // Default awal agar mulai dari 0 jika belum ada log

  // Asumsi observasi pasca anestesi biasanya tiap 15 menit,
  // Anda bisa ganti "lastTime + 5" jika ingin interval 5 menit.
  formDialogLog.value.time = lastTime + 5
}

// 3. WATCHER UNTUK AUTO-LOAD DATA (EDIT MODE)
watch(() => formDialogLog.value.time, (newTime) => {
  const existingData = logs.value.find(l => l.time === newTime)

  if (existingData) {
    // Load data lama untuk diedit
    Object.assign(formDialogLog.value, {
      td_sistolik: existingData.td_sistolik || '',
      td_diastolik: existingData.td_diastolik || '',
      nadi: existingData.nadi || '',
      resp: existingData.resp || '',
      temp: existingData.temp || ''
    })
  } else {
    // Kosongkan form jika menit tersebut belum ada datanya
    Object.assign(formDialogLog.value, {
      td_sistolik: '',
      td_diastolik: '',
      nadi: '',
      resp: '',
      temp: ''
    })
  }
})

// 4. MODIFIKASI FUNGSI SIMPAN (Bisa Insert & Update)
async function tambahLog () {
  // Cek apakah data di menit tersebut sudah ada
  // const index = logs.value.findIndex(l => l.time === formDialogLog.value.time)

  // if (index !== -1) {
  //   // UPDATE DATA JIKA SUDAH ADA
  //   logs.value[index] = { ...formDialogLog.value }
  // } else {
  //   // INSERT DATA BARU JIKA BELUM ADA
  //   logs.value.push({ ...formDialogLog.value })
  // }

  // // Opsional: Urutkan array logs berdasarkan waktu agar garis grafik tidak zig-zag
  // logs.value.sort((a, b) => a.time - b.time)
  await store.simpanLogPasca(props.pasien, formDialogLog.value)

  showInputLog.value = false
  syncLabels()
}

const simpanData = () => {
  // Logic simpan ke API (bisa menggunakan action dari Store)
  // console.log("Data Disimpan:", { kondisi: formKondisi.value, instruksi: formInstruksi.value, logs: logs.value })
  store.simpanMedikasiPasca()
}

onMounted(() => {
  store.getMonitoringPasca(props.pasien)
  nextTick(() => {
    if (typeof syncLabels === 'function') syncLabels()
  })
})
</script>

<style scoped>
/* CSS INI SAMA PERSIS DENGAN REFERENSI ANDA AGAR PRESISI TERJAGA */
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
  max-width: 90vw;
  height: auto;
  margin: auto;
  background: white;
  overflow-x: auto;
}

.chart-wrapper {
  flex-grow: 1;
}
</style>
