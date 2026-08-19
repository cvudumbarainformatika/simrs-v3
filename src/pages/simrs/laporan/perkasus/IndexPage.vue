<template>
  <q-page
    class="q-pa-sm relative-position"
    :class="style.componentfull ? 'container-no-header' : 'container--q-header'"
    style="min-height: 0;"
  >
    <q-card flat bordered class="column no-wrap shadow-2 rounded-borders overflow-hidden" style="position: absolute; top: 8px; bottom: 8px; left: 8px; right: 8px;">
      <!-- Header Section -->
      <q-card-section class="bg-primary text-white q-py-sm q-px-md col-auto">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-avatar
              size="38px"
              color="white"
              text-color="primary"
              icon="icon-mat-analytics"
              class="shadow-1"
            />
            <div>
              <div class="text-subtitle1 text-weight-bold">
                Laporan Pasien Per Kasus (Rawat Inap)
              </div>
              <div class="text-caption text-blue-2">
                Rekapitulasi medis & perawatan pasien rawat inap berdasarkan filter Diagnosa ICD-10 & Periode
              </div>
            </div>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-btn
              color="positive"
              unelevated
              dense
              class="q-px-md text-weight-bold"
              :loading="store.loadingExport"
              @click="store.exportToExcel"
            >
              <q-icon name="icon-mat-download" size="xs" class="q-mr-xs" />
              Export Excel
            </q-btn>

            <q-btn
              round
              flat
              dense
              icon="icon-mat-refresh"
              color="white"
              @click="onTampilkanLaporan"
            >
              <q-tooltip>Refresh Data</q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              dense
              :icon="!style.componentfull ? 'icon-mat-open_in_full' : 'icon-mat-close_fullscreen'"
              color="white"
              @click="style.setComponentFull"
            >
              <q-tooltip>Fullscreen</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <!-- Filter Section -->
      <q-card-section class="q-py-sm q-px-md bg-grey-2 border-bottom col-auto">
        <div class="row q-col-gutter-xs items-center">
          <!-- Filter Tahun -->
          <div style="width: 100px;">
            <q-select
              v-model="store.params.tahun"
              :options="store.years"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              dense
              outlined
              bg-color="white"
              label="Tahun"
            />
          </div>

          <!-- Filter Bulan -->
          <div style="width: 140px;">
            <q-select
              v-model="store.params.bulan"
              :options="store.months"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              dense
              outlined
              bg-color="white"
              label="Bulan"
            />
          </div>

          <!-- Multiple Filter Kode Diagnosa (ICD-10) -->
          <div class="col" style="min-width: 150px;">
            <q-select
              v-model="store.params.kd_diagnosa"
              :options="store.optionsDiagnosa"
              use-input
              use-chips
              multiple
              clearable
              emit-value
              map-options
              option-value="kode"
              :option-label="opt => Object(opt) === opt && 'keterangan' in opt ? `${opt.kode} ~ ${opt.keterangan}` : opt"
              dense
              outlined
              bg-color="white"
              label="Pilih Kode Diagnosa (ICD-10) - Multiple *"
              placeholder="Cari ICD..."
              input-debounce="0"
              @filter="filterDiagnosa"
            >
              <template #selected-item="scope">
                <q-chip
                  removable
                  dense
                  square
                  color="primary"
                  text-color="white"
                  class="q-my-none q-mr-xs text-weight-bold text-caption"
                  @remove="scope.removeAtIndex(scope.index)"
                >
                  {{ typeof scope.opt === 'object' ? scope.opt.kode : scope.opt }}
                </q-chip>
              </template>
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Diagnosa tidak ditemukan
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps" class="q-py-xs">
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-primary">{{ scope.opt.kode }}</q-item-label>
                    <q-item-label caption class="text-grey-8">{{ scope.opt.keterangan }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Tombol Cari / Tampilkan -->
          <div>
            <q-btn
              color="primary"
              unelevated
              no-caps
              icon="icon-mat-filter_alt"
              label="Tampilkan Laporan"
              class="text-weight-bold"
              style="height: 40px;"
              :loading="store.loading"
              @click="onTampilkanLaporan"
            />
          </div>
        </div>
      </q-card-section>

      <!-- KPI / Summary Bar -->
      <q-card-section class="q-py-xs q-px-md bg-blue-1 border-bottom col-auto">
        <div class="row items-center justify-between text-caption text-grey-9">
          <div class="row items-center q-gutter-x-md">
            <div>
              Total Pasien: <b class="text-primary text-subtitle2">{{ store.items.length }}</b> Orang
            </div>
            <q-separator vertical inset />
            <div>
              Rata-rata LOS: <b class="text-teal-9 text-subtitle2">{{ avgLos }}</b> Hari
            </div>
            <q-separator vertical inset />
            <div>
              Sembuh / Membaik: <b class="text-positive text-subtitle2">{{ countSembuh }}</b>
            </div>
            <q-separator vertical inset />
            <div>
              Meninggal: <b class="text-negative text-subtitle2">{{ countMeninggal }}</b>
            </div>
          </div>
          <div class="ellipsis">
            Filter Active: <b>{{ store.params.tahun }}</b> | Kode ICD: <b class="text-primary">{{ store.selectedDiagnosaLabels }}</b>
          </div>
        </div>
      </q-card-section>

      <!-- Table Section (Arsitektur SIMRS v3 Resmi) -->
      <q-card-section class="col fit q-pa-none overflow-hidden">
        <q-table
          flat
          bordered
          square
          dense
          separator="cell"
          class="fit perkasus-qtable"
          :rows="store.items"
          :columns="columns"
          row-key="id"
          :loading="store.loading"
          v-model:pagination="pagination"
        >
          <!-- Custom Body Cell Slot -->
          <template #body="props">
            <!-- Group Header Bulan jika baris pertama bulan baru -->
            <tr v-if="isFirstOfMonth(props.rowIndex)" class="bg-indigo-1 text-indigo-10 text-weight-bold">
              <td colspan="10" class="q-py-xs q-px-md border-top border-bottom">
                <div class="row items-center justify-between">
                  <div class="row items-center q-gutter-xs text-subtitle2 text-weight-bold">
                    <q-icon name="icon-mat-calendar_month" size="xs" color="indigo" />
                    <span>BULAN {{ getBulanTahunGroup(props.row) }}</span>
                  </div>
                  <q-badge color="indigo" class="text-caption text-weight-bold q-px-sm">
                    {{ getCountPerBulan(props.row) }} Pasien
                  </q-badge>
                </div>
              </td>
            </tr>

            <tr class="hover-row">
              <td class="text-center text-weight-medium" style="width: 40px;">
                {{ props.rowIndex + 1 }}
              </td>
              <td style="width: 120px;">
                <div class="text-weight-medium text-caption">
                  {{ getTglIgd(props.row) }}
                </div>
              </td>
              <td style="width: 140px;">
                <div class="text-caption text-weight-medium">
                  <span class="text-grey-7">MRS:</span> <span class="text-weight-bold">{{ getMrs(props.row) }}</span>
                </div>
                <div class="text-caption text-weight-medium">
                  <span class="text-grey-7">KRS:</span> <span class="text-weight-bold">{{ getKrs(props.row) }}</span>
                </div>
              </td>
              <td class="text-center" style="width: 60px;">
                <q-chip dense square color="teal-1" text-color="teal-10" class="text-weight-bold text-caption">
                  {{ getLos(props.row) }} hr
                </q-chip>
              </td>
              <td style="width: 220px;">
                <div class="text-weight-bold text-primary">
                  {{ getNama(props.row) }}
                </div>
                <div class="text-caption text-grey-9">
                  <span>RM: <b>{{ getNorm(props.row) }}</b></span> | <span>Reg: {{ getNoreg(props.row) }}</span>
                </div>
                <div class="text-caption text-grey-7">
                  NIK: {{ getNik(props.row) }}
                </div>
                <div class="text-caption text-indigo-9 text-weight-medium">
                  {{ getKelamin(props.row) }} ({{ getUsia(props.row) }})
                </div>
                <div class="text-caption text-grey-7" :title="getAlamat(props.row)">
                  {{ getAlamat(props.row) }}
                </div>
              </td>
              <td style="width: 170px;">
                <div class="text-weight-bold text-purple-9">
                  {{ getRuang(props.row) }}
                </div>
                <div class="text-caption text-grey-8">
                  <span class="text-weight-medium">DPJP:</span> {{ getDpjp(props.row) }}
                </div>
              </td>
              <td style="width: 120px;">
                <div class="q-mb-xs">
                  <q-chip dense square color="blue-1" text-color="blue-9" class="text-caption text-weight-bold">
                    {{ getSistemBayar(props.row) }}
                  </q-chip>
                </div>
                <div>
                  <q-chip dense square :color="getCaraKeluarColor(props.row)" text-color="white" class="text-caption text-weight-bold">
                    {{ getCaraKeluar(props.row) }}
                  </q-chip>
                </div>
              </td>
              <td style="width: 180px;">
                <q-chip dense square color="red-1" text-color="red-9" class="text-weight-bold text-caption">
                  {{ getKodeDiagnosa(props.row) }}
                </q-chip>
                <div class="text-caption text-weight-medium q-mt-xs" :title="getDiagnosa(props.row)">
                  {{ getDiagnosa(props.row) }}
                </div>
              </td>
              <td style="width: 240px;">
                <div class="text-caption">
                  <b class="text-primary">Anamnesis:</b>
                  <div class="text-grey-9 text-caption" :title="getAnamneseAwal(props.row)">
                    {{ getAnamneseAwal(props.row) }}
                  </div>
                </div>
                <q-separator class="q-my-xs" />
                <div class="text-caption">
                  <b class="text-deep-orange-9">RPS:</b>
                  <div class="text-grey-9 text-caption" :title="getRps(props.row)">
                    {{ getRps(props.row) }}
                  </div>
                </div>
              </td>
              <td style="width: 240px;">
                <div class="text-caption">
                  <b class="text-indigo-9">Diag. Sekunder:</b>
                  <div class="text-grey-9 text-caption" :title="getDiagnosaTambahan(props.row)">
                    {{ getDiagnosaTambahan(props.row) }}
                  </div>
                </div>
                <q-separator class="q-my-xs" />
                <div class="text-caption">
                  <b class="text-amber-10">Memo Diagnosa:</b>
                  <div class="text-grey-9 text-caption" :title="getMemoDiagnosa(props.row)">
                    {{ getMemoDiagnosa(props.row) }}
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <template #no-data>
            <div class="full-width column items-center justify-center text-grey-6 q-pa-xl">
              <q-icon name="icon-mat-filter_alt" size="56px" class="q-mb-sm text-amber-8" />
              <div class="text-subtitle1 text-weight-bold text-grey-8">
                {{ isDiagnosaEmpty ? 'Pilihan Kode Diagnosa Belum Diisi' : 'Tidak Ada Data Ditemukan' }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                {{ isDiagnosaEmpty ? 'Silakan pilih Kode Diagnosa (ICD-10) terlebih dahulu, kemudian klik tombol Tampilkan Laporan.' : 'Tidak ada data pasien yang sesuai dengan filter terpilih.' }}
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <!-- Footer Section -->
      <q-card-section class="q-py-xs q-px-md bg-grey-2 border-top col-auto">
        <div class="row items-center justify-between text-caption text-grey-8">
          <div>
            Menampilkan <b class="text-primary">{{ store.items.length }}</b> data dari <b class="text-primary">{{ Math.max(store.items.length, store.total || 0).toLocaleString('id-ID') }}</b> seluruh data
          </div>
          <div>
            Tahun: <b>{{ store.params.tahun }}</b> | ICD-10: <b class="text-primary">{{ store.selectedDiagnosaLabels }}</b>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useStyledStore } from 'src/stores/app/styled'
import { useLaporanPerkasusStore } from 'src/stores/simrs/laporan/perkasus'

const $q = useQuasar()
const style = useStyledStore()
const store = useLaporanPerkasusStore()

const pagination = ref({
  page: 1,
  rowsPerPage: 15
})

const columns = [
  { name: 'no', label: 'No', align: 'center', headerStyle: 'width: 35px;', style: 'width: 35px;' },
  { name: 'tgl_masuk_igd', label: 'Tgl Masuk IGD', align: 'left', headerStyle: 'width: 110px;', style: 'width: 110px;' },
  { name: 'mrs_krs', label: 'MRS & KRS', align: 'left', headerStyle: 'width: 130px;', style: 'width: 130px;' },
  { name: 'los', label: 'LOS', align: 'center', headerStyle: 'width: 50px;', style: 'width: 50px;' },
  { name: 'identitas', label: 'Identitas Pasien', align: 'left', headerStyle: 'width: 16%;', style: 'width: 16%;' },
  { name: 'ruang_dpjp', label: 'Ruang & DPJP', align: 'left', headerStyle: 'width: 12%;', style: 'width: 12%;' },
  { name: 'bayar_status', label: 'Bayar & Status', align: 'left', headerStyle: 'width: 100px;', style: 'width: 100px;' },
  { name: 'kode_diagnosa', label: 'Kode & Diagnosa Utama', align: 'left', headerStyle: 'width: 14%;', style: 'width: 14%;' },
  { name: 'anamnese_rps', label: 'Anamnese Awal & RPS', align: 'left', headerStyle: 'width: 20%;', style: 'width: 20%;' },
  { name: 'diagnosa_sekunder', label: 'Diagnosa Sekunder & Memo', align: 'left', headerStyle: 'width: 20%;', style: 'width: 20%;' }
]

function getBulanTahunGroup(row) {
  const mrsStr = getMrs(row)
  if (mrsStr && mrsStr !== '-') {
    const cleanDate = mrsStr.replace(' ', 'T')
    const d = new Date(cleanDate)
    if (!isNaN(d.getTime())) {
      const monthNamesUpper = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
      return `${monthNamesUpper[d.getMonth()]} ${d.getFullYear()}`
    }
  }
  return 'LAINNYA'
}

function isFirstOfMonth(index) {
  if (index === 0) return true
  const curr = store.items[index]
  const prev = store.items[index - 1]
  return getBulanTahunGroup(curr) !== getBulanTahunGroup(prev)
}

function getCountPerBulan(row) {
  const targetGroup = getBulanTahunGroup(row)
  return store.items.filter(item => getBulanTahunGroup(item) === targetGroup).length
}

onMounted(() => {
  store.fetchMasterDiagnosa()
})

const isDiagnosaEmpty = computed(() => {
  return !store.params.kd_diagnosa || (Array.isArray(store.params.kd_diagnosa) && store.params.kd_diagnosa.length === 0)
})

function filterDiagnosa(val, update, abort) {
  store.filterDiagnosaFn(val, update, abort)
}

function onTampilkanLaporan() {
  if (isDiagnosaEmpty.value) {
    $q.notify({
      color: 'red-6',
      textColor: 'white',
      icon: 'icon-mat-warning',
      message: 'Pilihan Kode Diagnosa (ICD-10) wajib diisi! Mohon pilih minimal 1 kode diagnosa.',
      position: 'top'
    })
    return
  }
  store.searchData()
}

// Computed Grouping per Bulan
const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const groupedItems = computed(() => {
  if (!store.items || store.items.length === 0) return []

  const groups = {}

  store.items.forEach(row => {
    const mrsStr = getMrs(row)
    let monthYearKey = 'Lainnya / Tidak Diketahui'
    let sortKey = 0

    if (mrsStr && mrsStr !== '-') {
      const cleanDate = mrsStr.replace(' ', 'T')
      const d = new Date(cleanDate)
      if (!isNaN(d.getTime())) {
        const monthIndex = d.getMonth()
        const year = d.getFullYear()
        monthYearKey = `BULAN ${monthNames[monthIndex].toUpperCase()} ${year}`
        sortKey = year * 100 + (monthIndex + 1)
      }
    }

    if (!groups[monthYearKey]) {
      groups[monthYearKey] = {
        title: monthYearKey,
        sortKey,
        items: []
      }
    }
    groups[monthYearKey].items.push(row)
  })

  return Object.values(groups).sort((a, b) => b.sortKey - a.sortKey)
})

// Computed KPIs
const avgLos = computed(() => {
  if (!store.items || store.items.length === 0) return '0'
  const total = store.items.reduce((sum, item) => sum + (parseFloat(getLos(item)) || 0), 0)
  return (total / store.items.length).toFixed(1)
})

const countSembuh = computed(() => {
  if (!store.items) return 0
  return store.items.filter(item => {
    const status = (getCaraKeluar(item) || '').toLowerCase()
    return status.includes('sembuh') || status.includes('izinkan') || status.includes('membaik')
  }).length
})

const countMeninggal = computed(() => {
  if (!store.items) return 0
  return store.items.filter(item => {
    const status = (getCaraKeluar(item) || '').toLowerCase()
    return status.includes('meninggal')
  }).length
})

// Helpers Extraction
function formatCleanDate(str) {
  if (!str || str === '-') return '-'
  return str.split('.')[0]
}

function getTglIgd(row) {
  return formatCleanDate(row.tgl_masuk_igd || row.tgl_igd || row.triage)
}

function getMrs(row) {
  return formatCleanDate(row.mrs || row.tgl_mrs || row.tgl_masuk)
}

function getKrs(row) {
  return formatCleanDate(row.krs || row.tgl_krs || row.tgl_keluar)
}

function getLos(row) {
  return row.los || row.lama_dirawat || row.lama_rawat || '0'
}

function getNoreg(row) {
  return row.noreg || row.no_reg || '-'
}

function getNorm(row) {
  return row.norm || row.no_rm || '-'
}

function getNik(row) {
  return row.nik || '-'
}

function getNama(row) {
  return row.nama || row.nama_pasien || '-'
}

function getAlamat(row) {
  return row.alamat || '-'
}

function getKelamin(row) {
  return row.kelamin || row.jk || '-'
}

function getUsia(row) {
  return row.usia || row.umur || '-'
}

function getRuang(row) {
  return row.ruang || row.ruangan || row.kamar || '-'
}

function getDpjp(row) {
  return row.dpjp || row.dokter || '-'
}

function getSistemBayar(row) {
  return row.sistem_bayar || row.penjamin || row.sistembayar || '-'
}

function getCaraKeluar(row) {
  return row.cara_keluar || row.carakeluar || '-'
}

function getCaraKeluarColor(row) {
  const val = (getCaraKeluar(row) || '').toLowerCase()
  if (val.includes('sembuh') || val.includes('izinkan') || val.includes('membaik')) {
    return 'positive'
  }
  if (val.includes('meninggal')) {
    return 'negative'
  }
  if (val.includes('paksa') || val.includes('permintaan sendiri')) {
    return 'warning'
  }
  if (val.includes('rujuk')) {
    return 'info'
  }
  return 'primary'
}

function getKodeDiagnosa(row) {
  return row.kode_diagnosa || row.kddiagnosa || row.icd10 || '-'
}

function getDiagnosa(row) {
  return row.diagnosa || row.diagnosa_utama || '-'
}

function getAnamneseAwal(row) {
  return row.anamnese_awal || row.keluhan_utama || row.anamnesis || '-'
}

function getRps(row) {
  return row.riwayat_penyakit_sekarang || row.rps || '-'
}

function getDiagnosaTambahan(row) {
  return row.diagnosa_tambahan || row.diag_sekunder || '-'
}

function getMemoDiagnosa(row) {
  return row.memodiagnosa || row.memo_diagnosa || '-'
}
</script>

<style scoped>
.container--q-header,
.container-no-header {
  max-width: 100% !important;
  box-sizing: border-box !important;
}
.shrink-0 {
  flex-shrink: 0;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.hover-row:hover {
  background-color: #f0f7ff;
}
/* CSS Q-Table Resmi SIMRS v3 */
.perkasus-qtable {
  height: 100%;
}
.perkasus-qtable :deep(.q-table__middle) {
  max-height: 100% !important;
  height: 100% !important;
  overflow: auto !important;
}
.perkasus-qtable :deep(table) {
  width: 100% !important;
  table-layout: fixed !important;
}
.perkasus-qtable :deep(thead tr th) {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #e2e8f0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  font-weight: bold;
}
.perkasus-qtable :deep(td),
.perkasus-qtable :deep(th) {
  vertical-align: top;
  padding: 6px 8px !important;
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: break-word;
}
.perkasus-qtable :deep(tbody tr.hover-row) {
  content-visibility: auto;
  contain-intrinsic-block-size: 72px;
}
</style>
