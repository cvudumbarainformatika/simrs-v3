<template>
  <div>
    <!-- AREA 4: SKOR ALDRETE & KRITERIA PINDAH -->
    <q-card flat bordered class="bg-white q-mb-xl">
      <q-card-section class="q-pa-sm bg-teal-8 text-white row items-center justify-between">
        <div class="text-subtitle2 font-weight-bold">SKOR ALDRETE & KEPUTUSAN KELUAR RR</div>
        <q-btn size="sm" color="white" text-color="teal-8" label="Tambah Penilaian" icon="add"
          @click="showDialogAldrete = true" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <!-- Tabel Penilaian Aldrete -->
        <q-markup-table dense flat bordered separator="cell" class="q-mb-md">
          <thead class="bg-grey-2">
            <tr>
              <th class="text-left font-weight-bold"
                :style="store.aldreteLogs.length > 0 ? 'width: 25%' : 'width: 100%'">
                Kriteria</th>
              <th v-for="(log, idx) in store.aldreteLogs" :key="'header-' + idx" class="text-center font-weight-bold">
                Waktu: {{ log.waktu }}
                <q-btn flat round dense icon="delete" color="negative" size="xs" @click="hapusAldrete(log)"
                  class="q-ml-sm" />
              </th>
            </tr>
          </thead>
          <tbody :key="store.aldreteLogs?.length || 0">
            <template v-if="store.aldreteLogs.length <= 0">
              <tr>
                <td :colspan="store.aldreteLogs.length + 1">
                  <div class="flex flex-center q-pa-xl" style="width: 70vw; height: 150px;">
                    <app-no-data-small text="Belum Ada Data Aldrete" />
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="text-left"><strong>Oksigenasi</strong></td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'oks-' + idx" class="text-center">{{ log.oksigenasi }}
                </td>
              </tr>
              <tr>
                <td class="text-left"><strong>Aktifitas</strong></td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'akt-' + idx" class="text-center">{{ log.aktifitas }}
                </td>
              </tr>
              <tr>
                <td class="text-left"><strong>Pernafasan</strong></td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'nap-' + idx" class="text-center">{{ log.pernafasan }}
                </td>
              </tr>
              <tr>
                <td class="text-left"><strong>Sirkulasi</strong></td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'sir-' + idx" class="text-center">{{ log.sirkulasi }}
                </td>
              </tr>
              <tr>
                <td class="text-left"><strong>Kesadaran</strong></td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'kes-' + idx" class="text-center">{{ log.kesadaran }}
                </td>
              </tr>
              <tr class="bg-yellow-1">
                <td class="text-left"><strong>TOTAL SKOR</strong></td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'tot-' + idx"
                  class="text-center text-weight-bold text-h6 text-primary">
                  {{ log.total }}
                </td>
              </tr>
            </template>
          </tbody>
        </q-markup-table>

        <!-- Keterangan Standar -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12">
            <q-banner dense rounded class="bg-grey-2 text-dark">
              <div class="text-weight-bold">Kriteria Pemindahan:</div>
              <ul class="q-mb-none q-pl-md">
                <li>Nilai 7 - 10 boleh dipindah ke ruang perawatan semula</li>
                <li>Nilai 6 ke bawah pasien dipindahkan ke ruang ICU</li>
                <li>Observasi pasien di RR dilakukan maksimal selama 2 jam</li>
              </ul>
            </q-banner>
          </div>
        </div>

        <q-separator class="q-mb-md" />

        <!-- Form Keputusan Keluar RR -->
        <div class="text-subtitle2 text-primary q-mb-md font-weight-bold">DATA KELUAR RUANG PEMULIHAN</div>

        <!-- Sub-section 1: Waktu & Tanda Vital Keluar -->
        <div class="row q-col-gutter-md q-mb-md">
          <!-- Waktu Pemulihan -->
          <div class="col-xs-12 col-md-5">
            <div class="q-pa-sm bg-blue-1 rounded-borders border-blue full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-primary q-mb-xs">1. Waktu Pemulihan</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-input v-model="store.formKeluar.jam_masuk" label="Jam Masuk RR" dense outlined bg-color="white" mask="##:##" />
                    <div class="text-caption text-primary q-mt-xs" v-if="estimasiMasukRR">
                      ℹ️ Est. Masuk: <strong>{{ estimasiMasukRR }}</strong>
                    </div>
                  </div>
                  <div class="col-6">
                    <q-input v-model="store.formKeluar.jam_keluar" label="Jam Keluar RR" dense outlined bg-color="white" mask="##:##" />
                    <div class="text-caption text-primary q-mt-xs" v-if="estimasiKeluarRR">
                      ℹ️ Est. Keluar: <strong>{{ estimasiKeluarRR }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tanda Vital Keluar -->
          <div class="col-xs-12 col-md-7">
            <div class="q-pa-sm bg-teal-1 rounded-borders border-teal full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-teal-9 q-mb-xs">2. Tanda Vital Saat Keluar</div>
                <div class="row q-col-gutter-xs">
                  <div class="col-3"><q-input v-model="store.formKeluar.td_sistolik" label="TD Sis" dense outlined bg-color="white" /></div>
                  <div class="col-3"><q-input v-model="store.formKeluar.td_diastolik" label="TD Dia" dense outlined bg-color="white" /></div>
                  <div class="col-3"><q-input v-model="store.formKeluar.nadi" label="HR (Nadi)" dense outlined bg-color="white" /></div>
                  <div class="col-3"><q-input v-model="store.formKeluar.rr" label="RR (Nafas)" dense outlined bg-color="white" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-section 2: Infus, Urine & Muntah -->
        <div class="row q-col-gutter-md q-mb-md">
          <!-- Infus Saat Keluar -->
          <div class="col-xs-12 col-md-5">
            <div class="q-pa-sm bg-blue-1 rounded-borders border-blue full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-primary q-mb-xs">3. Infus Saat Keluar</div>
                <div class="q-mb-xs">
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
              <q-input v-model="store.formKeluar.infus" label="Infus Saat Keluar" dense outlined bg-color="white" />
            </div>
          </div>

          <!-- Status Urine -->
          <div class="col-xs-12 col-md-3">
            <div class="q-pa-sm bg-indigo-1 rounded-borders border-indigo full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-indigo-9 q-mb-xs">4. Status Urine</div>
                <div class="q-mb-xs">
                  <div class="row items-center q-gutter-xs">
                    <q-chip v-for="item in listUrine" :key="item" clickable
                      color="blue-8" outline text-color="blue-8"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendUrine(item)">
                      + {{ item }}
                    </q-chip>
                  </div>
                </div>
              </div>
              <q-input v-model="store.formKeluar.urine" label="Status Urine" dense outlined bg-color="white" />
            </div>
          </div>

          <!-- Status Muntah -->
          <div class="col-xs-12 col-md-4">
            <div class="q-pa-sm bg-purple-1 rounded-borders border-purple full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-purple-9 q-mb-xs">5. Status Muntah</div>
                <div class="q-mb-xs">
                  <div class="row items-center q-gutter-xs">
                    <q-chip v-for="item in listMuntahFix" :key="item" clickable
                      color="purple-8" outline text-color="purple-8"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendMuntah(item)">
                      + {{ item }}
                    </q-chip>
                    <q-chip v-for="obat in listObatMual" :key="obat" clickable
                      color="purple" outline text-color="purple"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendMuntah(obat)">
                      + {{ obat }}
                    </q-chip>
                    <q-chip v-for="mg in listDosisMg" :key="mg" clickable color="purple-7" text-color="white"
                      size="sm" dense class="q-ma-none q-mr-xs" @click="appendDosisMgMuntah(mg)">
                      + {{ mg }} mg
                    </q-chip>
                    <q-chip clickable color="purple-9" text-color="white" size="sm" dense class="q-ma-none q-mr-xs" @click="appendDosisMgMuntah('')">
                      + mg
                    </q-chip>
                  </div>
                </div>
              </div>
              <q-input v-model="store.formKeluar.muntah" label="Status Muntah" dense outlined bg-color="white" />
            </div>
          </div>
        </div>

        <!-- Sub-section 3: Tujuan Pemindahan & Petugas Anestesi -->
        <div class="row q-col-gutter-md q-mb-md">
          <!-- Tujuan Pemindahan -->
          <div class="col-xs-12 col-md-5">
            <div class="q-pa-sm bg-cyan-1 rounded-borders border-cyan full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-cyan-9 q-mb-xs">6. Tujuan Pemindahan Pasien</div>
                <div class="row q-col-gutter-xs">
                  <div :class="store.formKeluar.dipindah_ke == 'Ruangan' ? 'col-6' : 'col-12'">
                    <q-select v-model="store.formKeluar.dipindah_ke" :options="['Ruangan', 'ICU', 'Pulang']"
                      label="Dipindahkan ke" dense outlined bg-color="white" />
                  </div>
                  <div v-if="store.formKeluar.dipindah_ke == 'Ruangan'" class="col-6">
                    <q-select v-model="store.formKeluar.ruangan" option-label="rs2" option-value="rs1" :options="store.kamars"
                      :key="store.kamars?.length || 0" label="Pilih Ruangan" dense outlined map-options emit-value bg-color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Petugas Anestesi -->
          <div class="col-xs-12 col-md-7">
            <div class="q-pa-sm bg-grey-1 rounded-borders border-grey full-height column justify-between">
              <div>
                <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">7. Petugas Anestesi Bertanggung Jawab</div>
                <div class="row q-col-gutter-xs">
                  <div class="col-6">
                    <app-autocomplete v-model="store.formKeluar.penata_anastesi" :key="laporanOp.nakes?.length || 0" label="Penata Anestesi"
                      outlined dense :source="laporanOp.nakes?.filter(y => y?.kdgroupnakes != '1')" option-label="nama"
                      option-value="kdpegsimrs" hide-dropdown-icon bg-color="white" />
                  </div>
                  <div class="col-6">
                    <app-autocomplete v-model="store.formKeluar.dokter_anastesi" :key="laporanOp.nakes?.length || 0" label="Dokter Anestesi"
                      outlined dense :source="laporanOp.nakes?.filter(y => y?.kdgroupnakes == '1')" option-label="nama"
                      option-value="kdpegsimrs" hide-dropdown-icon bg-color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row q-mt-lg justify-end">
          <q-btn color="primary" icon="save" label="Simpan Data Keluar RR" size="md" glossy class="q-px-xl" @click="store.simpanFormKeluar()" />
        </div>
      </q-card-section>
    </q-card>

    <!-- DIALOG INPUT ALDRETE -->
    <q-dialog v-model="showDialogAldrete" persistent>
      <q-card style="min-width: 700px; max-width: 70vw;">
        <q-card-section class="bg-teal-8 text-white row items-center q-pb-none">
          <div class="text-h6">Input Skor Aldrete</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input v-model="formAldrete.waktu" label="Waktu Pengecekan" dense outlined mask="##:##" autofocus>
                <template v-slot:append>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>
            <div class="col-8 flex items-center justify-end">
              <div class="text-h6 text-primary">TOTAL SKOR: {{ hitungTotalAldrete }}</div>
            </div>

            <div class="col-12"><q-separator /></div>

            <!-- OKSIGENASI -->
            <div class="col-12">
              <q-select v-model="formAldrete.oksigenasi" :options="optOksigenasi" label="Oksigenasi" dense outlined
                emit-value map-options />
            </div>

            <!-- AKTIFITAS -->
            <div class="col-12">
              <q-select v-model="formAldrete.aktifitas" :options="optAktifitas" label="Aktifitas" dense outlined
                emit-value map-options />
            </div>

            <!-- PERNAFASAN -->
            <div class="col-12">
              <q-select v-model="formAldrete.pernafasan" :options="optPernafasan" label="Pernafasan" dense outlined
                emit-value map-options />
            </div>

            <!-- SIRKULASI -->
            <div class="col-12">
              <q-select v-model="formAldrete.sirkulasi" :options="optSirkulasi" label="Sirkulasi (TD dari normal)" dense
                outlined emit-value map-options />
            </div>

            <!-- KESADARAN -->
            <div class="col-12">
              <q-select v-model="formAldrete.kesadaran" :options="optKesadaran" label="Kesadaran" dense outlined
                emit-value map-options />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-2 text-teal-8 q-pa-md">
          <q-btn flat label="Batal" v-close-popup no-caps />
          <q-btn color="teal-8" label="Simpan Penilaian" @click="simpanAldrete"
            :disable="!formAldrete.waktu || store.loadingAldrete" :loading="store.loadingAldrete" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useMonitoringSaatStore } from 'src/stores/simrs/kamaroperasi/assasement/monitoringSaat'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const laporanOp = useLaporanOperasiStore()
const store = useMonitoringSaatStore()
// --- STATE ALDRETE & KELUAR RR ---
const showDialogAldrete = ref(false)

// Array untuk menampung riwayat pengukuran Aldrete (bisa lebih dari 1 kali)


const formAldrete = ref({
  waktu: '',
  oksigenasi: null,
  aktifitas: null,
  pernafasan: null,
  sirkulasi: null,
  kesadaran: null
})

// --- QUICK CHIP INFUS KELUAR RR STATE & METHODS ---
const listCairan = ref(['RL', 'NaCl 0.9%', 'D5 1/2 NS', 'Gelofusal', 'KA-EN 3B', 'Asering'])
const listTpm = ref(['7', '10', '15', '20', '28', '30'])

function appendCairan (cairan) {
  if (!store.formKeluar.infus || !store.formKeluar.infus.trim()) {
    store.formKeluar.infus = cairan
  } else {
    const text = store.formKeluar.infus.trim()
    if (text.endsWith(',') || text.endsWith(';')) {
      store.formKeluar.infus = text + ' ' + cairan
    } else {
      store.formKeluar.infus = text + ', ' + cairan
    }
  }
}

function appendTPM (tpm) {
  const tpmStr = `${tpm} TPM`
  if (!store.formKeluar.infus || !store.formKeluar.infus.trim()) {
    store.formKeluar.infus = tpmStr
  } else {
    const text = store.formKeluar.infus.trim()
    if (/\d\s*TPM$/i.test(text) || text.endsWith(',') || text.endsWith(';')) {
      const cleanText = text.replace(/[,;]\s*$/, '')
      store.formKeluar.infus = cleanText + ', ' + tpmStr
    } else {
      store.formKeluar.infus = text + ' ' + tpmStr
    }
  }
}

// --- QUICK CHIP URINE & MUNTAH STATE & METHODS ---
const listUrine = ref(['TERPASANG KATETER', 'TIDAK TERPASANG KATETER'])
const listMuntahFix = ref(['TIDAK MUNTAH'])
const listObatMual = ref(['Ondansetron'])
const listDosisMg = ref(['4', '8', '2'])

function appendUrine (val) {
  const currentVal = String(store.formKeluar.urine || '').trim()
  if (!currentVal) {
    store.formKeluar.urine = val
  } else if (currentVal.endsWith(',') || currentVal.endsWith(';')) {
    store.formKeluar.urine = currentVal + ' ' + val
  } else {
    store.formKeluar.urine = currentVal + ', ' + val
  }
}

function appendMuntah (val) {
  const currentVal = String(store.formKeluar.muntah || '').trim()
  if (!currentVal) {
    store.formKeluar.muntah = val
  } else if (currentVal.endsWith(',') || currentVal.endsWith(';')) {
    store.formKeluar.muntah = currentVal + ' ' + val
  } else {
    store.formKeluar.muntah = currentVal + ', ' + val
  }
}

function appendDosisMgMuntah (mg) {
  const mgStr = mg ? `${mg} mg` : 'mg'
  const currentVal = String(store.formKeluar.muntah || '').trim()
  if (!currentVal) {
    store.formKeluar.muntah = mgStr
  } else if (/\d\s*mg$/i.test(currentVal) || currentVal.endsWith(',') || currentVal.endsWith(';')) {
    const cleanText = currentVal.replace(/[,;]\s*$/, '')
    store.formKeluar.muntah = cleanText + ', ' + mgStr
  } else {
    store.formKeluar.muntah = currentVal + ' ' + mgStr
  }
}
//   dipindah_ke: '',
//   penata_anestesi: '',
//   dokter_anestesi: ''
// })

// --- OPTIONS ALDRETE (Sesuai Kertas Rekam Medis) ---
const optOksigenasi = [
  { label: 'SpO2 > 92% dengan udara ruangan (Skor: 2)', value: 2 },
  { label: 'SpO2 > 90% dengan tambahan oksigen (Skor: 1)', value: 1 },
  { label: 'SpO2 < 92% dengan tambahan oksigen (Skor: 0)', value: 0 }
]

const optAktifitas = [
  { label: 'Menggerakkan 4 ekstremitas (Skor: 2)', value: 2 },
  { label: 'Menggerakkan 2 ekstremitas (Skor: 1)', value: 1 },
  { label: 'Tidak ada gerakan (Skor: 0)', value: 0 }
]

const optPernafasan = [
  { label: 'Nafas dalam dan batuk bebas (Skor: 2)', value: 2 },
  { label: 'Dipsneu atau limitasi bernafas (Skor: 1)', value: 1 },
  { label: 'Apnea atau tidak bernafas (Skor: 0)', value: 0 }
]

const optSirkulasi = [
  { label: 'TD ± 20 mmHg dari normal (Skor: 2)', value: 2 },
  { label: 'TD ± 20-50 mmHg dari normal (Skor: 1)', value: 1 },
  { label: 'TD ± >50 mmHg dari normal (Skor: 0)', value: 0 }
]

const optKesadaran = [
  { label: 'Sadar penuh (Skor: 2)', value: 2 },
  { label: 'Sadar jika dipanggil (Skor: 1)', value: 1 },
  { label: 'Tidak ada respon (Skor: 0)', value: 0 }
]

// --- COMPUTED & METHODS ALDRETE ---
const hitungTotalAldrete = computed(() => {
  const o = formAldrete.value.oksigenasi || 0
  const a = formAldrete.value.aktifitas || 0
  const p = formAldrete.value.pernafasan || 0
  const s = formAldrete.value.sirkulasi || 0
  const k = formAldrete.value.kesadaran || 0
  return o + a + p + s + k
})

async function simpanAldrete () {
  const payload = {
    noreg: props.pasien?.noreg,
    nota: props.pasien?.rs2,
    norm: props.pasien?.norm,
    waktu: formAldrete.value.waktu,
    oksigenasi: formAldrete.value.oksigenasi || 0,
    aktifitas: formAldrete.value.aktifitas || 0,
    pernafasan: formAldrete.value.pernafasan || 0,
    sirkulasi: formAldrete.value.sirkulasi || 0,
    kesadaran: formAldrete.value.kesadaran || 0,
    total: hitungTotalAldrete.value
  }
  await store.simpanSkorAldrete(payload)
  // Reset form
  formAldrete.value = { waktu: '', oksigenasi: null, aktifitas: null, pernafasan: null, sirkulasi: null, kesadaran: null }
  showDialogAldrete.value = false
}

function hapusAldrete (index) {
  console.log('hapus', index)
  store.hapusSkorAldrete({ id: index.id })
  // store.aldreteLogs.splice(index, 1)
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
  const logs = store.dataPasca || []
  if (!logs.length) return 0
  const times = logs.map(l => parseInt(l.time, 10)).filter(t => !isNaN(t))
  return times.length ? Math.max(...times) : 0
})

const estimasiKeluarRR = computed(() => {
  const jamMasuk = store.formKeluar?.jam_masuk || estimasiMasukRR.value
  if (!jamMasuk) return ''
  return addMinutesToTime(jamMasuk, maxLogMinute.value)
})

watch(estimasiMasukRR, (newVal) => {
  if (newVal && !store.formKeluar?.jam_masuk) {
    store.formKeluar.jam_masuk = newVal
  }
}, { immediate: true })

watch([() => store.formKeluar?.jam_masuk, maxLogMinute], ([masuk, mins]) => {
  if (masuk && mins > 0 && !store.formKeluar?.jam_keluar) {
    store.formKeluar.jam_keluar = addMinutesToTime(masuk, mins)
  }
}, { immediate: true })

onMounted(async () => {
  if (!laporanOp.nakes?.length) laporanOp.getNakes()
  store.getKamars()
  await store.getSkorAldrete(props.pasien)
  if (estimasiMasukRR.value && !store.formKeluar?.jam_masuk) {
    store.formKeluar.jam_masuk = estimasiMasukRR.value
  }
  if (store.formKeluar?.jam_masuk && maxLogMinute.value > 0 && !store.formKeluar?.jam_keluar) {
    store.formKeluar.jam_keluar = addMinutesToTime(store.formKeluar.jam_masuk, maxLogMinute.value)
  }
})
</script>

<style scoped>
.border-blue { border: 1px solid #90caf9; }
.border-teal { border: 1px solid #80cbc4; }
.border-indigo { border: 1px solid #9fa8da; }
.border-purple { border: 1px solid #ce93d8; }
.border-cyan { border: 1px solid #80deea; }
.border-grey { border: 1px solid #e0e0e0; }
</style>
