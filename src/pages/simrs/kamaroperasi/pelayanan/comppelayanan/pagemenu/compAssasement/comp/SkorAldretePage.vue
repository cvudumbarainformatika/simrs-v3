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
        <div class="text-subtitle2 text-primary q-mb-sm font-weight-bold">DATA KELUAR RUANG PEMULIHAN</div>
        <div class="row q-col-gutter-sm">
          <div class="col-md-2 col-xs-6">
            <q-input v-model="store.formKeluar.jam_masuk" label="Jam Masuk" dense outlined mask="##:##" />
            <div class="text-caption text-primary q-mt-xs" v-if="estimasiMasukRR">
              ℹ️ Est. Masuk RR (Selesai Bedah + 5m): <strong>{{ estimasiMasukRR }}</strong>
            </div>
            <div class="text-caption text-grey-6 q-mt-xs" v-else>
              ℹ️ Est. Masuk RR: Belum diisi
            </div>
          </div>
          <div class="col-md-2 col-xs-6">
            <q-input v-model="store.formKeluar.jam_keluar" label="Jam Keluar" dense outlined mask="##:##" />
            <div class="text-caption text-primary q-mt-xs" v-if="estimasiKeluarRR">
              ℹ️ Est. Keluar RR (Masuk RR + Durasi Log): <strong>{{ estimasiKeluarRR }}</strong>
            </div>
            <div class="text-caption text-grey-6 q-mt-xs" v-else>
              ℹ️ Est. Keluar RR: Belum diisi
            </div>
          </div>
          <div class="col-md-5 col-xs-12">
            <div class="row q-col-gutter-xs">
              <div class="col-3"><q-input v-model="store.formKeluar.td_sistolik" label="TD Sis" dense outlined />
              </div>
              <div class="col-3"><q-input v-model="store.formKeluar.td_diastolik" label="TD Dia" dense outlined />
              </div>
              <div class="col-3"><q-input v-model="store.formKeluar.nadi" label="HR" dense outlined /></div>
              <div class="col-3"><q-input v-model="store.formKeluar.rr" label="RR" dense outlined /></div>
            </div>
          </div>
          <div class="col-md-3 col-xs-12">
            <q-input v-model="store.formKeluar.infus" label="Infus" dense outlined />
          </div>

          <div class="col-md-3 col-xs-6">
            <q-input v-model="store.formKeluar.urine" label="Urine" dense outlined />
          </div>
          <div class="col-md-3 col-xs-6">
            <q-input v-model="store.formKeluar.muntah" label="Muntah" dense outlined />
          </div>
          <div :class="store.formKeluar.dipindah_ke == 'Ruangan' ? 'col-md-3 col-xs-6' : 'col-md-6 col-xs-12'">
            <q-select v-model="store.formKeluar.dipindah_ke" :options="['Ruangan', 'ICU', 'Pulang']"
              label="Dipindahkan ke" dense outlined />
          </div>
          <div v-if="store.formKeluar.dipindah_ke == 'Ruangan'" class="col-md-3 col-xs-6">
            <q-select v-model="store.formKeluar.ruangan" option-label="rs2" option-value="rs1" :options="store.kamars"
              :key="store.kamars?.length || 0" label="Pilih Ruangan" dense outlined map-options emit-value />
          </div>

          <div class="col-md-6 col-xs-12">
            <app-autocomplete v-model="store.formKeluar.penata_anastesi" :key="laporanOp.nakes?.length || 0" label="Penata Anestesi"
              outlined dense :source="laporanOp.nakes?.filter(y => y?.kdgroupnakes != '1')" option-label="nama"
              option-value="kdpegsimrs" hide-dropdown-icon />
            <!-- <q-input v-model="store.formKeluar.penata_anestesi" label="Penata Anestesi" dense outlined /> -->
          </div>
          <div class="col-md-6 col-xs-12">
            <app-autocomplete v-model="store.formKeluar.dokter_anastesi" :key="laporanOp.nakes?.length || 0" label="Dokter Anestesi"
              outlined dense :source="laporanOp.nakes?.filter(y => y?.kdgroupnakes == '1')" option-label="nama"
              option-value="kdpegsimrs" hide-dropdown-icon />
            <!-- <q-input v-model="store.formKeluar.dokter_anestesi" label="Dokter Anestesi" dense outlined /> -->
          </div>
        </div>

        <div class="row q-mt-lg q-mb-xl justify-end">
          <q-btn color="primary" icon="save" label="Simpan " size="md" no-caps @click="store.simpanFormKeluar()" />
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

// const store.formKeluar = ref({
//   jam_keluar: '',
//   td_sistolik: '',
//   td_diastolik: '',
//   nadi: '',
//   rr: '',
//   infus: '',
//   urine: '',
//   muntah: '',
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
