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
            <div class="text-caption text-primary q-mt-xs" v-if="estimasiMasukRR">
              ℹ️ Est. Masuk RR (Selesai Bedah + 5m): <strong>{{ estimasiMasukRR }}</strong>
            </div>
            <div class="text-caption text-grey-6 q-mt-xs" v-else>
              ℹ️ Est. Masuk RR: Belum diisi
            </div>
          </div>
          <div class="col-md-4 col-xs-6">
            <q-select v-model="store.inputFormPasca.keadaan_umum"
              :options="['Sadar', 'Belum Sadar', 'Reflek (-)', 'Reflek (+)', 'Panas', 'Syok']" label="Keadaan Umum"
              dense outlined bg-color="white" multiple use-chips />
          </div>
          <div class="col-md-3 col-xs-6">
            <q-select v-model="store.inputFormPasca.pernapasan" :options="['Spontan', 'Kontrol']" label="Pernapasan"
              dense outlined bg-color="white" behavior="menu" />
          </div>
        </div>

        <!-- TANDA VITAL AWAL MASUK (LOG MENIT 0) -->
        <div class="q-mt-sm bg-blue-1 q-pa-xs rounded-borders" v-if="log0">
          <div class="text-caption text-weight-bold text-primary">Tanda Vital Awal Masuk (Log Menit ke-0):</div>
          <div class="row q-col-gutter-xs text-caption text-weight-bold text-dark">
            <div class="col-md-3 col-xs-6">TD: {{ log0.td_sistolik && log0.td_diastolik ? log0.td_sistolik + '/' + log0.td_diastolik + ' mmHg' : '-' }}</div>
            <div class="col-md-3 col-xs-6">Nadi: {{ log0.nadi ? log0.nadi + ' x/mnt' : '-' }}</div>
            <div class="col-md-3 col-xs-6">RR: {{ log0.resp ? log0.resp + ' x/mnt' : '-' }}</div>
            <div class="col-md-3 col-xs-6">Suhu: {{ log0.temp ? log0.temp + ' °C' : '-' }}</div>
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
      <div class="q-pa-md">
        <!-- Sub-section 1: Parameter Monitoring -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-xs-12 col-md-4">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Monitor Mulai Jam</div>
            <q-input v-model="store.inputFormPasca.monitor_mulai" label="Monitor Mulai Jam" dense outlined bg-color="white"
              mask="##:##" />
            <div class="text-caption text-primary q-mt-xs" v-if="lapOpSelesai">
              ℹ️ Jam Selesai Op (Lap. Op): <strong>{{ lapOpSelesai }}</strong>
            </div>
            <div class="text-caption text-grey-6 q-mt-xs" v-else>
              ℹ️ Jam Selesai Op (Lap. Op): Belum diisi
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Setiap (Menit)</div>
            <q-select v-model="store.inputFormPasca.monitor_setiap"
              :options="[{ label: '5 Menit', value: '5' }, { label: '10 Menit', value: '10' }, { label: '15 Menit', value: '15' }, { label: '30 Menit', value: '30' }]"
              label="Setiap (Menit)" dense outlined emit-value map-options behavior="menu" bg-color="white"
              :disable="logs.length > 0">
              <q-tooltip v-if="logs.length > 0">Interval terkunci karena data log observasi sudah ada</q-tooltip>
            </q-select>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Selama (Otomatis)</div>
            <q-input v-model="store.inputFormPasca.monitor_selama" label="Selama (Otomatis)" dense outlined readonly bg-color="grey-2" />
          </div>
        </div>

        <!-- Sub-section 2: Medikasi Utama (Infus & Antibiotika) -->
        <div class="row q-col-gutter-md q-mb-md">
          <!-- Infus -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm bg-blue-1 rounded-borders border-blue full-height column justify-between">
              <div>
                <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">1. Infus Pasca Anestesi</div>
                <!-- Quick Chips Infus -->
                <div class="q-mb-sm">
                  <div class="row items-center q-gutter-xs q-mb-xs">
                    <span class="text-caption text-weight-bold text-grey-8">Quick Cairan:</span>
                    <q-chip v-for="cairan in listCairan" :key="cairan" clickable
                      color="primary" outline text-color="primary"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendCairan(cairan)">
                      + {{ cairan }}
                    </q-chip>
                  </div>
                  <div class="row items-center q-gutter-xs bg-white q-pa-xs rounded-borders border-blue">
                    <span class="text-caption text-weight-bold text-teal-9">Quick TPM:</span>
                    <q-chip v-for="tpm in listTpm" :key="tpm" clickable color="teal" text-color="white"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendTPM(tpm)">
                      + {{ tpm }} TPM
                    </q-chip>
                  </div>
                </div>
              </div>
              <q-input v-model="store.inputFormPasca.infus" label="Keterangan Infus" outlined type="textarea" rows="2" bg-color="white" />
            </div>
          </div>

          <!-- Antibiotika -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm bg-indigo-1 rounded-borders border-indigo full-height column justify-between">
              <div>
                <div class="text-subtitle2 text-weight-bold text-indigo-9 q-mb-xs">2. Antibiotika</div>
                <div class="q-mb-sm">
                  <span class="text-caption text-weight-bold text-grey-8 q-mr-xs">Quick Options:</span>
                  <q-chip clickable color="indigo" text-color="white" size="sm" dense class="q-ma-none" @click="store.inputFormPasca.antibiotika = 'SESUAI ADVIS DPJP'">
                    + SESUAI ADVIS DPJP
                  </q-chip>
                </div>
              </div>
              <q-input v-model="store.inputFormPasca.antibiotika" label="Keterangan Antibiotika" outlined type="textarea" rows="2" bg-color="white" />
            </div>
          </div>
        </div>

        <!-- Sub-section 3: Penanganan Simptom (Mual, Nyeri/Sakit, Obat Lain) -->
        <div class="row q-col-gutter-md q-mb-md">
          <!-- Mual / Muntah -->
          <div class="col-xs-12 col-md-4">
            <div class="q-pa-sm bg-purple-1 rounded-borders border-purple full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-purple-9 q-mb-xs">3. Bila Mual / Muntah</div>
                <div class="q-mb-xs">
                  <div class="row items-center q-gutter-xs">
                    <q-chip v-for="obat in listObatMual" :key="obat" clickable
                      color="purple" outline text-color="purple"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendObatMual(obat)">
                      + {{ obat }}
                    </q-chip>
                    <q-chip v-for="mg in listDosisMg" :key="mg" clickable color="purple-7" text-color="white"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendDosisMg(mg)">
                      + {{ mg }} mg
                    </q-chip>
                    <q-chip clickable color="purple-9" text-color="white" size="sm" dense class="q-ma-none q-mr-xs" @click="appendDosisMg('')">
                      + mg
                    </q-chip>
                  </div>
                </div>
              </div>
              <q-input v-model="store.inputFormPasca.obat_mual" label="Obat Mual / Muntah" dense outlined bg-color="white" />
            </div>
          </div>

          <!-- Kesakitan -->
          <div class="col-xs-12 col-md-4">
            <div class="q-pa-sm bg-orange-1 rounded-borders border-orange full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-deep-orange-9 q-mb-xs">4. Bila Kesakitan</div>
                <div class="q-mb-xs">
                  <div class="row items-center q-gutter-xs">
                    <q-chip v-for="obat in listObatSakit" :key="obat" clickable
                      color="deep-orange" outline text-color="deep-orange"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendObatSakit(obat)">
                      + {{ obat }}
                    </q-chip>
                    <q-chip v-for="mg in listDosisMgSakit" :key="mg" clickable color="deep-orange-7" text-color="white"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendDosisMgSakit(mg)">
                      + {{ mg }} mg
                    </q-chip>
                    <q-chip clickable color="deep-orange-9" text-color="white" size="sm" dense class="q-ma-none q-mr-xs" @click="appendDosisMgSakit('')">
                      + mg
                    </q-chip>
                  </div>
                </div>
              </div>
              <q-input v-model="store.inputFormPasca.obat_sakit" label="Obat Kesakitan" dense outlined bg-color="white" />
            </div>
          </div>

          <!-- Obat Lain-lain -->
          <div class="col-xs-12 col-md-4">
            <div class="q-pa-sm bg-grey-1 rounded-borders border-grey full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">5. Obat Lain-lain</div>
                <div class="text-caption text-grey-6 q-mb-xs">Catatan obat tambahan pasca anestesi</div>
              </div>
              <q-input v-model="store.inputFormPasca.obat_lain" label="Obat Lain-lain" dense outlined bg-color="white" />
            </div>
          </div>
        </div>

        <!-- Sub-section 4: Asupan & Instruksi Lain -->
        <div class="row q-col-gutter-md q-mb-md">
          <!-- Makan Minum -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm bg-cyan-1 rounded-borders border-cyan full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-cyan-9 q-mb-xs">6. Minum / Makan</div>
                <div class="q-mb-xs">
                  <div class="row items-center q-gutter-xs">
                    <span class="text-caption text-weight-bold text-grey-8">Quick Options:</span>
                    <q-chip v-for="item in listMakanMinum" :key="item" clickable
                      color="cyan-9" outline text-color="cyan-9"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendMakanMinum(item)">
                      + {{ item }}
                    </q-chip>
                  </div>
                </div>
              </div>
              <q-input v-model="store.inputFormPasca.makan_minum" label="Instruksi Minum / Makan" dense outlined bg-color="white" />
            </div>
          </div>

          <!-- Lain-lain -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm bg-grey-1 rounded-borders border-grey full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">7. Lain-lain / Instruksi Lain</div>
                <div class="text-caption text-grey-6 q-mb-xs">Instruksi penanganan khusus lainnya</div>
              </div>
              <q-input v-model="store.inputFormPasca.lain_lain" label="Instruksi Lain-lain" dense outlined bg-color="white" />
            </div>
          </div>
        </div>

        <!-- Tombol Simpan Pasca Anestesi -->
        <div class="row justify-end q-mt-md">
          <q-btn label="Simpan Pasca Anestesi" color="primary" glossy size="md" icon="save" class="q-px-xl" @click="simpanData" />
        </div>
      </div>
    </q-card>

    <!-- FAB BUTTON UNTUK TAMBAH LOG -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_chart" color="secondary" @click="openInputLogDialog">
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
import { useQuasar } from 'quasar'

const props = defineProps({
  pasien: { type: Object, default: () => ({}) }
})

const store = useMonitoringSaatStore()
const $q = useQuasar()

function openInputLogDialog () {
  if (!store.inputFormPasca?.monitor_setiap) {
    store.inputFormPasca.monitor_setiap = '5'
  }
  showInputLog.value = true
}

// --- INDEPENDENT QUICK CHIP INFUS STATE & METHODS ---
const listCairan = ref(['RL', 'NaCl 0.9%', 'D5 1/2 NS', 'Gelofusal', 'KA-EN 3B', 'Asering'])
const listTpm = ref(['7', '10', '15', '20', '28', '30'])

function appendCairan (cairan) {
  if (!store.inputFormPasca.infus || !store.inputFormPasca.infus.trim()) {
    store.inputFormPasca.infus = cairan
  } else {
    const text = store.inputFormPasca.infus.trim()
    if (text.endsWith(',') || text.endsWith(';')) {
      store.inputFormPasca.infus = text + ' ' + cairan
    } else {
      store.inputFormPasca.infus = text + ', ' + cairan
    }
  }
}

function appendTPM (tpm) {
  const tpmStr = `${tpm} TPM`
  if (!store.inputFormPasca.infus || !store.inputFormPasca.infus.trim()) {
    store.inputFormPasca.infus = tpmStr
  } else {
    const text = store.inputFormPasca.infus.trim()
    if (/\d\s*TPM$/i.test(text) || text.endsWith(',') || text.endsWith(';')) {
      const cleanText = text.replace(/[,;]\s*$/, '')
      store.inputFormPasca.infus = cleanText + ', ' + tpmStr
    } else {
      store.inputFormPasca.infus = text + ' ' + tpmStr
    }
  }
}

// --- QUICK CHIP OBAT MUAL STATE & METHODS ---
const listObatMual = ref(['Ondansetron'])
const listDosisMg = ref(['4', '8', '2'])

function appendObatMual (obat) {
  if (!store.inputFormPasca.obat_mual || !store.inputFormPasca.obat_mual.trim()) {
    store.inputFormPasca.obat_mual = obat
  } else {
    const text = store.inputFormPasca.obat_mual.trim()
    if (text.endsWith(',') || text.endsWith(';')) {
      store.inputFormPasca.obat_mual = text + ' ' + obat
    } else {
      store.inputFormPasca.obat_mual = text + ', ' + obat
    }
  }
}

function appendDosisMg (mg) {
  const mgStr = mg ? `${mg} mg` : 'mg'
  if (!store.inputFormPasca.obat_mual || !store.inputFormPasca.obat_mual.trim()) {
    store.inputFormPasca.obat_mual = mgStr
  } else {
    const text = store.inputFormPasca.obat_mual.trim()
    if (/\d\s*mg$/i.test(text) || text.endsWith(',') || text.endsWith(';')) {
      const cleanText = text.replace(/[,;]\s*$/, '')
      store.inputFormPasca.obat_mual = cleanText + ', ' + mgStr
    } else {
      store.inputFormPasca.obat_mual = text + ' ' + mgStr
    }
  }
}

// --- QUICK CHIP OBAT SAKIT STATE & METHODS ---
const listObatSakit = ref(['Ketorolac', 'Metamizole'])
const listDosisMgSakit = ref(['30', '1000', '500'])

function appendObatSakit (obat) {
  if (!store.inputFormPasca.obat_sakit || !store.inputFormPasca.obat_sakit.trim()) {
    store.inputFormPasca.obat_sakit = obat
  } else {
    const text = store.inputFormPasca.obat_sakit.trim()
    if (text.endsWith(',') || text.endsWith(';')) {
      store.inputFormPasca.obat_sakit = text + ' ' + obat
    } else {
      store.inputFormPasca.obat_sakit = text + ', ' + obat
    }
  }
}

function appendDosisMgSakit (mg) {
  const mgStr = mg ? `${mg} mg` : 'mg'
  if (!store.inputFormPasca.obat_sakit || !store.inputFormPasca.obat_sakit.trim()) {
    store.inputFormPasca.obat_sakit = mgStr
  } else {
    const text = store.inputFormPasca.obat_sakit.trim()
    if (/\d\s*mg$/i.test(text) || text.endsWith(',') || text.endsWith(';')) {
      const cleanText = text.replace(/[,;]\s*$/, '')
      store.inputFormPasca.obat_sakit = cleanText + ', ' + mgStr
    } else {
      store.inputFormPasca.obat_sakit = text + ' ' + mgStr
    }
  }
}

// --- QUICK CHIP MAKAN MINUM STATE & METHODS ---
const listMakanMinum = ref(['SADAR PENUH', 'TIDAK MUAL', 'MINUM SEDIKIT-SEDIKIT'])

function appendMakanMinum (val) {
  const currentVal = String(store.inputFormPasca.makan_minum || '').trim()
  if (!currentVal) {
    store.inputFormPasca.makan_minum = val
  } else if (currentVal.endsWith(',') || currentVal.endsWith(';')) {
    store.inputFormPasca.makan_minum = currentVal + ' ' + val
  } else {
    store.inputFormPasca.makan_minum = currentVal + ', ' + val
  }
}

// --- DIALOG & LOG STATE ---
const showInputLog = ref(false)
const formDialogLog = ref({ time: 0, td_sistolik: '', td_diastolik: '', nadi: '', resp: '', temp: '' })

// // --- DATA DUMMY LOGS (Agar langsung bisa dicek tanpa error) ---
// const logs = ref([
//   { time: 5, td_sistolik: 140, td_diastolik: 90, nadi: 85, resp: 20, temp: 36 },
//   { time: 15, td_sistolik: 130, td_diastolik: 80, nadi: 80, resp: 18, temp: 36.2 },
//   { time: 30, td_sistolik: 120, td_diastolik: 80, nadi: 75, resp: 16, temp: 36.5 }
// ])
const logs = computed(() => store.dataPasca || [])
const log0 = computed(() => {
  if (!logs.value || !logs.value.length) return null
  return logs.value.find(l => parseInt(l.time, 10) === 0) || null
})
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
      if (seriesIndex === 0) return '∨'  // Sistolik
      if (seriesIndex === 1) return '∧'  // Diastolik
      if (seriesIndex === 2) return '●'  // Nadi
      if (seriesIndex === 3) return '✱'  // Respirasi
      if (seriesIndex === 4) return '△  '  // suhu
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

function formatSelectTime (val, waktuStr) {
  if (!waktuStr || typeof waktuStr !== 'string' || !waktuStr.includes(':')) {
    return `Menit ke-${val}`
  }
  let startHour = 0
  let startMin = 0
  const parts = waktuStr.split(':')
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (!isNaN(h)) startHour = h
  if (!isNaN(m)) startMin = m

  const totalMinutes = (startHour * 60 + startMin) + val
  const resH = Math.floor((totalMinutes / 60) % 24).toString().padStart(2, '0')
  const resM = Math.floor(totalMinutes % 60).toString().padStart(2, '0')
  return `${resH}:${resM} (Menit ke-${val})`
}

// 1. GENERATE OPSI MENIT (Berdasarkan monitor_setiap: default 5 menit)
const minuteOptions = computed(() => {
  const step = parseInt(store.inputFormPasca?.monitor_setiap || '5', 10) || 5
  const lastTime = logs.value.length > 0
    ? Math.max(...logs.value.map(l => l.time))
    : 0

  const limit = Math.max(145, lastTime + step * 2)
  const length = Math.floor(limit / step) + 1

  return Array.from({ length }, (_, i) => {
    const val = i * step
    return {
      label: formatSelectTime(val, store.inputFormPasca?.monitor_mulai),
      value: val
    }
  })
})

// 2. FUNGSI KETIKA DIALOG MUNCUL
function onDialogShow () {
  const step = parseInt(store.inputFormPasca?.monitor_setiap || '5', 10) || 5
  const lastTime = logs.value.length > 0
    ? Math.max(...logs.value.map(l => l.time))
    : -step

  formDialogLog.value.time = lastTime + step
}

// Watcher untuk otomatis menghitung dan mengisikan `monitor_selama` dari log paling akhir
watch(() => logs.value, (newLogs) => {
  if (newLogs && newLogs.length > 0) {
    const maxTime = Math.max(...newLogs.map(l => l.time))
    store.inputFormPasca.monitor_selama = `${maxTime} Menit`
  }
}, { deep: true, immediate: true })

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
  await store.simpanLogPasca(props.pasien, formDialogLog.value)

  if (logs.value.length > 0) {
    const maxTime = Math.max(...logs.value.map(l => l.time))
    store.inputFormPasca.monitor_selama = `${maxTime} Menit`
  }
  // Otomatis simpan medikasi pasca ke DB agar monitor_selama dan monitor_setiap tersimpan
  await store.simpanMedikasiPasca()

  showInputLog.value = false
  syncLabels()
}

const simpanData = () => {
  // Logic simpan ke API (bisa menggunakan action dari Store)
  // console.log("Data Disimpan:", { kondisi: formKondisi.value, instruksi: formInstruksi.value, logs: logs.value })
  store.simpanMedikasiPasca()
}

function addMinutesToTime (timeStr, mins) {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return ''
  const parts = timeStr.split(':')
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (isNaN(h) || isNaN(m)) return ''
  const addedMins = parseInt(mins, 10) || 0
  let totalMin = h * 60 + m + addedMins
  if (totalMin < 0) totalMin = 0
  const finalH = Math.floor((totalMin / 60) % 24).toString().padStart(2, '0')
  const finalM = Math.floor(totalMin % 60).toString().padStart(2, '0')
  return `${finalH}:${finalM}`
}

const lapOpSelesai = computed(() => {
  const lap = props.pasien?.laporanop
  if (Array.isArray(lap) && lap.length > 0) {
    const item = lap.find(x => x.rs12) || lap[0]
    return item?.rs12 ? item.rs12.substring(0, 5) : ''
  } else if (lap && typeof lap === 'object') {
    return lap.rs12 ? lap.rs12.substring(0, 5) : ''
  }
  return ''
})

const estimasiMasukRR = computed(() => {
  if (!lapOpSelesai.value) return ''
  return addMinutesToTime(lapOpSelesai.value, 5)
})

const maxLogMinute = computed(() => {
  if (!logs.value || !logs.value.length) return 0
  const times = logs.value.map(l => parseInt(l.time, 10)).filter(t => !isNaN(t))
  return times.length ? Math.max(...times) : 0
})

const estimasiKeluarRR = computed(() => {
  const jamMasuk = store.inputFormPasca?.jam_masuk || store.formKeluar?.jam_masuk || estimasiMasukRR.value
  if (!jamMasuk) return ''
  return addMinutesToTime(jamMasuk, maxLogMinute.value)
})

watch(lapOpSelesai, (newVal) => {
  if (newVal && !store.inputFormPasca?.monitor_mulai) {
    store.inputFormPasca.monitor_mulai = newVal
  }
}, { immediate: true })

watch(estimasiMasukRR, (newVal) => {
  if (newVal && !store.inputFormPasca?.jam_masuk) {
    store.inputFormPasca.jam_masuk = newVal
  }
  if (newVal && !store.formKeluar?.jam_masuk) {
    store.formKeluar.jam_masuk = newVal
  }
}, { immediate: true })

watch([() => store.inputFormPasca?.jam_masuk, maxLogMinute], ([masuk, mins]) => {
  if (masuk && mins > 0 && !store.formKeluar?.jam_keluar) {
    store.formKeluar.jam_keluar = addMinutesToTime(masuk, mins)
  }
}, { immediate: true })

onMounted(async () => {
  await store.getMonitoringPasca(props.pasien)
  if (lapOpSelesai.value && !store.inputFormPasca.monitor_mulai) {
    store.inputFormPasca.monitor_mulai = lapOpSelesai.value
  }
  if (estimasiMasukRR.value && !store.inputFormPasca.jam_masuk) {
    store.inputFormPasca.jam_masuk = estimasiMasukRR.value
  }
  if (estimasiMasukRR.value && !store.formKeluar?.jam_masuk) {
    store.formKeluar.jam_masuk = estimasiMasukRR.value
  }
  if (store.inputFormPasca?.jam_masuk && maxLogMinute.value > 0 && !store.formKeluar?.jam_keluar) {
    store.formKeluar.jam_keluar = addMinutesToTime(store.inputFormPasca.jam_masuk, maxLogMinute.value)
  }
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

.border-blue { border: 1px solid #90caf9; }
.border-indigo { border: 1px solid #9fa8da; }
.border-purple { border: 1px solid #ce93d8; }
.border-orange { border: 1px solid #ffcc80; }
.border-cyan { border: 1px solid #80deea; }
.border-grey { border: 1px solid #e0e0e0; }
</style>
