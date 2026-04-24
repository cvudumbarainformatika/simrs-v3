<template>
  <q-page class="q-pa-md bg-grey-2">
    <q-card flat bordered class="anesthesia-chart-container">

      <div class="chart-section upper-section">
        <div class="chart-wrapper">
          <apexchart type="scatter" height="250" :key="'upper-' + logs.length" :options="upperChartOptions"
            :series="upperSeries" />
        </div>
      </div>

      <div class="vital-signs-container flex no-wrap items-center q-mt-md">
        <div class="custom-y-labels q-ml-sm text-center">
          <div class="label-row flex no-wrap text-weight-bold">
            <span class="label-col ">R</span>
            <span class="label-col ">N</span>
            <span class="label-col ">TD</span>
          </div>
          <div v-for="label in medicalYLabels" :key="label.grid" class="label-row flex no-wrap">
            <span class="label-col ">{{ label.r }}</span>
            <span class="label-col ">{{ label.n }}</span>
            <span class="label-col ">{{ label.td }}</span>
          </div>
        </div>

        <div class="chart-wrapper flex-grow">
          <apexchart ref="chartWrapperRef" type="line" :key="'lower-' + logs.length" :options="lowerChartOptions"
            :series="lowerSeries" height="400px" />
        </div>
      </div>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="edit_note" color="primary" @click="(val) => {

        showInputForm = true
      }">
        <q-tooltip>Input Data Observasi</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
  <InputObservasi v-model="showInputForm" :last-time="logs.length > 0 ? logs[logs.length - 1].time : -5" :logs="logs"
    @add-log="handleNewLog" @close="showInputForm = false" />
</template>
<script setup>
import { ref, computed, onMounted, nextTick, defineAsyncComponent } from 'vue'
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const InputObservasi = defineAsyncComponent(() => import('./InputObservasi.vue'))
const showInputForm = ref(false)

const handleNewLog = async (newLog) => {
  // Cari apakah menit (time) tersebut sudah ada di logs
  const index = logs.value.findIndex(l => l.time === newLog.time)
  // console.log('log', newLog, logs.value[index])

  if (index !== -1) {
    // Jika ADA, timpa data lama dengan data baru (Update)
    // logs.value[index] = { ...newLog }
    logs.value.splice(index, 1, { ...newLog })
  } else {
    // Jika TIDAK ADA, tambah data baru (Insert)
    logs.value.push(newLog)
  }

  // Selalu sort setelah perubahan agar garis grafik tidak berantakan
  logs.value.sort((a, b) => a.time - b.time)

  const charts = document.querySelectorAll('.vue-apexcharts')
  charts.forEach(el => el.style.pointerEvents = 'none')
  // Refresh label kustom
  await nextTick()
  if (typeof syncLabels === 'function') {
    syncLabels()
  }
  setTimeout(() => {
    charts.forEach(el => el.style.pointerEvents = 'auto')
  }, 500)
}
const scaleN = (val) => {
  if (!val) return val
  // Mapping dari rentang [60, 180] ke [40, 160]
  return 40 + ((val - 60) * (160 - 40)) / (180 - 60)
}
const scaleR = (val) => {
  if (!val) return val
  // Mapping dari rentang [12, 28] ke [140, 220]
  return 140 + ((val - 12) * (220 - 140)) / (28 - 12)
}
// Data Dummy sesuai gambar
const logs = ref([
  {
    time: 0, td_sistolik: 100, td_diastolik: 81, nadi: 95, resp: 17,
    mulai_op: 20, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [], cairan: [],
    o2: 20, n2o: 20, halothan: 20, isoflurane: 20, sevoflurane: 20
  },
  {
    time: 5, td_sistolik: 120, td_diastolik: 80, nadi: 105, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [{ nama: 'Paracetamol', dosis: '2 mg', cara_masuk: 'IV' }],
    cairan: [], o2: 20, n2o: 20, halothan: 20, isoflurane: null, sevoflurane: null
  },
  {
    time: 10, td_sistolik: 110, td_diastolik: 75, nadi: null, resp: 18,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [], cairan: [], o2: 20, n2o: 2, halothan: 20, isoflurane: null, sevoflurane: null
  },
  {
    time: 15, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [], cairan: [{ nama: 'Normal Saline', volume: '100 ml' }],
    o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
  },
  {
    time: 20, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [{ nama: 'Propopol', dosis: '5 mg', cara_masuk: 'IV' }],
    cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
  },
  {
    time: 25, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: 20, x_ana: null, ass_resep: null,
    obat: [], cairan: [], o2: null, n2o: null, halothan: 1.5, isoflurane: null, sevoflurane: null
  },
  {
    time: 30, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [], cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
  },
  {
    time: 35, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: 20, ass_resep: null,
    obat: [], cairan: [], o2: 2, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
  },
  {
    time: 40, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [{ nama: 'Paracetamol', dosis: '2 mg', cara_masuk: 'IV' }],
    cairan: [], o2: null, n2o: null, halothan: null, isoflurane: 1.2, sevoflurane: null
  },
  {
    time: 45, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: null, eno_oro: null, x_ana: null, ass_resep: 20,
    obat: [], cairan: [], o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: null
  },
  {
    time: 50, td_sistolik: 115, td_diastolik: 82, nadi: 110, resp: 16,
    mulai_op: null, selesai_op: 20, eno_oro: null, x_ana: null, ass_resep: null,
    obat: [], cairan: [{ nama: 'Normal Saline', volume: '100 ml' }],
    o2: null, n2o: null, halothan: null, isoflurane: null, sevoflurane: 1.8
  }
])

// Data label kustom kita berdasarkan kertas asli
const medicalYLabels = [
  // grid: nilai Y pada chart (misal 220), r: label R, n: label N, td: label TD
  { grid: 220, r: '28', n: '', td: '220' }, // Sejajar grid 220
  { grid: 200, r: '24', n: '', td: '200' }, // Sejajar grid 200
  { grid: 180, r: '20', n: '', td: '180' }, // Sejajar grid 180
  { grid: 160, r: '16', n: '180', td: '160' }, // Sejajar grid 160
  { grid: 140, r: '12', n: '160', td: '140' },
  { grid: 120, r: '', n: '140', td: '120' },
  { grid: 100, r: '', n: '120', td: '100' },
  { grid: 80, r: '', n: '100', td: '80' },
  { grid: 60, r: '', n: '80', td: '60' },
  { grid: 40, r: '', n: '60', td: '40' },
  { grid: 20, r: '', n: '', td: '20' }
]

const chartWrapperRef = ref(null) // Gunakan ref untuk mengambil elemen chart
const labelRowHeight = ref(40) // Default awal

// Konfigurasi Chart Bawah (Vital Signs)
const lowerChartOptions = computed(() => ({
  chart: {
    id: 'vital-signs', group: 'anesthesia', toolbar: { show: false },
    events: {
      // Dipanggil saat chart pertama kali muncul
      mounted: () => {
        syncLabels()
      },
      // Dipanggil saat data di-update (misal tambah data baru)
      updated: () => {
        syncLabels()
      }
    }
  },
  xaxis: {
    type: 'numeric', min: 0, max: 145, tickAmount: 29,
    labels: {
      offsetY: 0,
      style: { fontSize: '10px' }
    },
    axisTicks: { show: false } // Hilangkan 'tanda petik' di sumbu X agar lebih bersih

  }, // Per 5 menit
  yaxis: {
    min: 20, max: 220, tickAmount: 10, labels: {
      show: false // KITA MATIKAN LABEL Y NATIVE
    }
  },
  stroke: {
    width: [0, 0, 0, 0],
    curve: 'straight',
    dashArray: [0, 0, 0, 0],
    connectNulls: true // Set TRUE agar garis "melompat" melewati data null
    // connectNulls: false // Set FALSE agar garis terputus
  },
  // WAJIB AKTIFKAN INI: Kita pakai garis sumbu sebagai pemandu tinggi
  axisBorder: {
    show: true,
    color: '#e0e0e0', // Samakan dengan warna grid agar tidak terlihat
    width: 1,
    offsetX: 0,
    offsetY: 0
  },
  markers: {
    size: 0,
    // shape: [pathSistolik, pathDiastolik, "circle", pathRespirasi], // v=Sistolik, square=Diastolik (bisa custom ^), circle=Nadi, star=Resp
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, { seriesIndex, dataPointIndex, w }) {
      if (val === null || typeof val === 'undefined') {
        return ''
      }
      // Kita return karakter Unicode berdasarkan series-nya
      if (seriesIndex === 0) return '∨'  // Sistolik (Unicode Logical Or)
      if (seriesIndex === 1) return '∧'  // Diastolik (Unicode Logical And)
      if (seriesIndex === 2) return '●'  // Nadi
      if (seriesIndex === 3) return '✱'  // Respirasi
      // Tambahan Series Status (berdasarkan gambar baru)
      if (seriesIndex === 4) return '↑' // Intubasi
      if (seriesIndex === 5) return '↓' // Ekstubasi
      if (seriesIndex === 6) return '→' // Mulai Operasi
      if (seriesIndex === 7) return '←' // Selesai Operasi
      if (seriesIndex === 8) return 'X' // X-Ana-X
      if (seriesIndex === 9) return 'E' // e-N-o O.R.O
      if (seriesIndex === 10) return 'AR' // Ass. Resep
      return val
    },
    style: {
      fontSize: '10px', // Perbesar agar terlihat seperti icon
      fontWeight: 'bold', offsetY: -10,
      colors: [
        function ({ seriesIndex }) {
          const colors = ['#2E7D32', '#f44336', '#2196f3', '#ff9800', '#000', '#000', '#000', '#000', '#000', '#000', '#000']
          return colors[seriesIndex] || '#000'
        }
      ]
    },
    background: { enabled: false } // Agar tidak ada kotak di belakangnya
  },
  grid: {
    borderColor: '#e0e0e0',
    xaxis: {
      lines: {
        show: true // INI KUNCINYA: Menampilkan garis vertikal
      }
    },
    yaxis: {
      lines: {
        show: true // Tetap tampilkan garis horizontal
      }
    },
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // Mematikan marker bulat agar tidak numpuk
    markers: {
      width: 0,        // Set ke 0 agar tidak ada ruang untuk bulatan
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
    // Formatter untuk menyisipkan simbol sesuai standar medis
    formatter: function (seriesName) {
      let symbol = ''
      let color = ''

      // Logika penentuan simbol dan warna berdasarkan nama series
      switch (seriesName) {
        case 'Sistolik':
          symbol = '∨'; color = '#2E7D32'; break // Hijau
        case 'Diastolik':
          symbol = '∧'; color = '#f44336'; break // Merah
        case 'Nadi':
          symbol = '●'; color = '#2196f3'; break // Biru
        case 'Respirasi':
          symbol = '✱'; color = '#ff9800'; break // Orange
        case 'Intubasi':
          symbol = '↑'; color = '#000000'; break // Hitam
        case 'Ekstubasi':
          symbol = '↓'; color = '#000000'; break // Hitam
        case 'Mulai Operasi':
          symbol = '→'; color = '#000000'; break // Hitam
        case 'Selesai Operasi':
          symbol = '←'; color = '#000000'; break // Hitam
        case 'Ass. Resep':
          symbol = 'AR'; color = '#000000'; break // Teks AR
        case 'X-Ana-X':
          symbol = 'X'; color = '#000000'; break // Teks X
        case 'e-N-o O.R.O':
          symbol = 'E'; color = '#000000'; break // Teks X
        default:
          symbol = '•'; color = '#999'
      }

      // Mengembalikan HTML untuk legenda custom
      return `
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="color: ${color}; font-weight: bold; font-size: 14px;">${symbol}</span>
        <span style="color: #333; font-size: 11px;">${seriesName}</span>
      </div>
    `
    }
  },
  colors: ['#2E7D32', '#f44336', '#2196F3', '#FFA000'], // Merah untuk TD, Biru Nadi, Oranye Resp
  tooltip: {
    enabled: true,
    shared: true, // Sekarang sudah aman untuk diaktifkan
    intersect: false,
    x: { show: true },
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const data = logs.value[dataPointIndex]
      // console.log('tooltip', data)

      if (!data) return '' // Cegah error jika data kosong
      const statusHtml = !!data?.mulai_op
        ? `<div class="text-green-9 text-bold">→ Mulai OP</div>`
        : ''
      const selesaiHtml = !!data?.selesai_op
        ? `<div class="text-black text-bold">← Selesai OP</div>`
        : ''

      const intubasiHtml = !!data?.intubasi
        ? `<div class="text-black text-bold">↑ Intubasi</div>`
        : ''
      const extubasiHtml = !!data?.extubasi
        ? `<div class="text-black text-bold">↓ Extubasi</div>`
        : ''
      const anaHtml = !!data?.x_ana
        ? `<div class="text-black text-bold">X-Ana-X</div>`
        : ''
      const enoHtml = !!data?.eno_oro
        ? `<div class="text-black text-bold">e-N-o O.R.O</div>`
        : ''
      const assResHtml = !!data?.ass_resep
        ? `<div class="text-black text-bold">Ass. Resep</div>`
        : ''
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
])

// Konfigurasi Chart Atas (Obat/Cairan)

const upperChartOptions = computed(() => ({
  chart: {
    id: 'meds',
    group: 'anesthesia2', // Sinkron dengan lower chart
    toolbar: { show: false },
    animations: { enabled: false }
  },
  xaxis: {
    type: 'numeric',
    min: 0,
    max: 145,
    tickAmount: 29,
    // labels: { show: false } // Sembunyikan karena sudah ada di chart bawah
  },
  yaxis: {
    min: 1,
    max: allRows.value.length,
    tickAmount: allRows.value.length - 1, // Memaksa grid tepat di setiap angka bulat
    labels: {
      style: { fontSize: '8px', fontWeight: 'bold' },
      formatter: (val) => {
        // val adalah index 1, 2, 3...
        const idx = Math.round(val) - 1
        return allRows.value[idx] || ''
      }
    }
  },
  stroke: {
    //   width: [3, 3, 3, 3],
    width: allRows.value.map(name => gasKeys.includes(name) ? 3 : 0),
    dashArray: allRows.value.map(name => gasKeys.includes(name) ? 2 : 0),
    curve: 'straight',
    //   dashArray: [1, 1, 1, 1],
    connectNulls: true // Set TRUE agar garis "melompat" melewati data null
    //   // connectNulls: false // Set FALSE agar garis terputus
  },
  grid: {
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } } // Garis horizontal untuk memisahkan antar obat
  },
  dataLabels: {
    enabled: true,
    // Menampilkan dosis (info) tepat di atas marker
    formatter: (val, opt) => {
      return opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].markerLabel || ''
    },
    style: { fontSize: '9px', colors: ['#000'] },
    offsetY: -5
  },
  markers: {
    size: 2,
    // shape: "circle",
    // size: (seriesIndex) => {
    //   // Gas mungkin tidak butuh marker titik di tengah garis,
    //   // tapi obat butuh marker besar
    //   return 5
    // },
    hover: { size: 7 }
  },
  tooltip: {
    enabled: true,
    shared: true, // Sekarang sudah aman untuk diaktifkan
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
    case 'o2':
      return 'O₂'
      break
    case 'n2o':
      return 'N₂O'
      break
    case 'halothan':
      return 'Halothan'
      break
    case 'isoflurane':
      return 'Isoflurane'
      break
    case 'sevoflurane':
      return 'Sevoflurane'
      break

    default:
      return gas
      break
  }
}
// 1. Kumpulkan semua kunci yang mungkin ada
const gasKeys = ['o2', 'n2o', 'halothan', 'isoflurane', 'sevoflurane']

// 2. Buat daftar baris yang reaktif
const allRows = computed(() => {
  // 1. Gas (Statis sesuai urutan yang Anda inginkan)
  // const gasKeys = ['o2', 'n2o', 'halothan', 'isoflurane', 'sevoflurane']

  // 2. Ambil semua nama Obat unik dari seluruh log
  const uniqueObat = [...new Set(logs.value.flatMap(l =>
    (l.obat || []).map(o => o.nama)
  ))]

  // 3. Ambil semua nama Cairan unik dari seluruh log
  const uniqueCairan = [...new Set(logs.value.flatMap(l =>
    (l.cairan || []).map(c => c.nama)
  ))]

  // 4. Gabungkan: Gas (bawah) + Obat (tengah) + Cairan (atas)
  // return [...gasKeys, ...uniqueObat, ...uniqueCairan]
  // Kita balik urutan penggabungannya
  return [...gasKeys, ...uniqueObat, ...uniqueCairan].reverse()
})
const upperSeries = computed(() => {
  return allRows.value.map((itemName, index) => {
    const yValue = index + 1 // Baris ke-1, ke-2, dst.
    const isGas = gasKeys.includes(itemName)
    return {
      name: itemName,
      type: isGas ? 'line' : 'scatter',
      data: logs.value.map(l => {
        let info = null
        let markerLabel = ''

        // Cek apakah ini Gas (Statis)
        if (isGas) {
          if (l[itemName] !== null && l[itemName] !== undefined) {
            info = '-'
            markerLabel = itemName.charAt(0).toUpperCase()
            return { x: l.time, y: yValue, info: info, markerLabel: markerLabel }
          }
          return { x: l.time, y: null }
        }
        // Cek apakah ini Obat/Cairan (Dinamis)
        else {
          const item = [...(l.obat || []), ...(l.cairan || [])].find(i => i.nama === itemName)
          if (item) {
            info = item.dosis || item.volume
            markerLabel = itemName.charAt(0).toUpperCase() + ' ' + (item.dosis || item.volume)
            return { x: l.time, y: yValue, info: info, markerLabel: markerLabel }
          }
        }

        return null
      }).filter(d => isGas ? true : d !== null),
      stroke: {
        width: isGas ? 2 : 0,
        curve: 'stepline' // Sangat cocok untuk start-stop data
      }
    }
  })
})
// ... data label medicalYLabels Anda yang sebelumnya ...

function syncLabels () {
  if (!chartWrapperRef.value) return

  // Berikan jeda 200ms agar browser selesai menggambar SVG
  setTimeout(() => {
    // .apexcharts-grid adalah kotak area grafik (area grid horizontal/vertikal)
    const gridElement = chartWrapperRef.value.$el.querySelector('.apexcharts-grid')

    if (gridElement) {
      const totalHeight = gridElement.getBoundingClientRect().height
      // console.log('Tinggi Grid Terdeteksi:', totalHeight)

      if (totalHeight > 0) {
        // Karena tickAmount kita 10, maka ada 10 rentang/baris
        const exactBarisHeight = totalHeight / 10
        labelRowHeight.value = exactBarisHeight
      }
    } else {
      // console.warn('Elemen grid belum ditemukan, mencoba lagi...')
      // Opsional: Coba lagi sekali jika gagal
    }
  }, 200)
}
onMounted(async () => {
  // Kita berikan sedikit delay agar ApexCharts selesai me-render total
  // nextTick(() => {
  //   syncLabels()
  // })
  // console.log('gas', allRows.value.map(name => gasKeys.includes(name) ? 3 : 0))

  const charts = document.querySelectorAll('.vue-apexcharts')
  charts.forEach(el => el.style.pointerEvents = 'none')
  await nextTick()
  if (typeof syncLabels === 'function') {
    syncLabels()
  }
  setTimeout(() => {
    charts.forEach(el => el.style.pointerEvents = 'auto')
  }, 500)
})
</script>
<style scoped>
.upper-section {
  /* Pastikan ada border atau pemisah yang jelas */
  border-bottom: 2px solid #444;
  background: white;
}

:deep(.apexcharts-yaxis-label) {
  fill: #333;
  text-transform: uppercase;
}

/* Menghilangkan bulatan marker bawaan ApexCharts secara total */
:deep(.apexcharts-legend-marker) {
  display: none !important;
}

/* Opsional: Menyesuaikan jarak teks legenda agar lebih rapat ke kiri */
:deep(.apexcharts-legend-series) {
  margin-left: 0 !important;
  padding-left: 2px !important;
}

.vital-signs-container {
  /* Pastikan kontainer chart punya tinggi yang fixed agar grid stabil */
  height: 400px;
}

.custom-y-labels {
  width: 120px;
  /* Jangan pakai justify-between, kita kontrol tinggi per baris */
  display: flex;
  flex-direction: column;

  /* 1. Atur margin-top secara manual agar angka '220' sejajar garis grid teratas.
     Coba angka di kisaran 15px - 25px */
  margin-top: -80px;
}

.label-row {
  /* 2. Jika tinggi grid murni adalah 310px, maka 310 / 10 = 31px.
     Coba sesuaikan angka ini sedikit demi sedikit (misal: 31px, 31.5px, atau 32px)
     sampai angka '20' di paling bawah sejajar garis grid terbawah. */
  /* height: 31.5px; */
  height: calc((290px) / 10);
  display: flex;
  align-items: right;
  /* justify-content: space-around; */
  /* Tambahkan border bawah tipis untuk simulasi garis grid */
  /* border-bottom: 1px solid rgba(255, 0, 0, 0.3); */
}

.label-col {
  width: 33%;
  font-size: 11px;
  /* line-height: 1; */
  /* Supaya teks benar-benar di tengah secara vertikal */
  /* text-align: center; */
  /* font-weight: bold; */
  /* color: #333; */
}

.anesthesia-chart-container {
  max-width: 900px;
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

.chart-wrapper {
  flex-grow: 1;
}
</style>
