<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN ASESMEN ULANG RISIKO JATUH</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="storeUlang.itemsJatuh?.length">
            {{ storeUlang.itemsJatuh.length }} Riwayat Terdaftar
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="storeUlang.itemsJatuh?.length">
          <q-btn
            v-print="printObj"
            color="indigo-10"
            icon="icon-mat-print"
            label="Cetak Asesmen Jatuh"
            no-caps
            dense
            class="q-px-md"
          />
        </div>
      </div>
    </div>


    <!-- Container Preview Dokumen -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="storeUlang.loading" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1" style="min-width: 300px;">
        <q-spinner-dots color="indigo-10" size="40px" />
        <div class="q-mt-sm">Memuat data riwayat...</div>
      </div>

      <div v-else-if="!hasRealData" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1 full-width" style="max-width: 900px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <q-icon name="icon-my-personal_injury" size="64px" class="q-mb-sm text-grey-4" />
        <div class="text-bold text-h6 text-grey-5">Tidak Ada Riwayat Asesmen</div>
        <div class="text-caption text-grey-5">Belum ada riwayat penilaian risiko jatuh menggunakan metode <strong>{{ activeTab.toUpperCase() }}</strong> untuk pasien ini.</div>
      </div>

      <div v-else id="print-jatuh-document" class="column items-center q-gutter-y-md full-width">
        <div class="document-container">
          <div class="print-page q-pa-md bg-white shadow-1">
            
            <!-- Kop Surat -->
            <div class="col-auto">
              <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="documentHeader" />
            </div>

            <!-- Identitas Pasien -->
            <div class="patient-info q-pa-sm q-mt-sm">
              <div class="row items-center justify-between text-caption-custom">
                <div class="col-4">Nama Pasien: <strong>{{ pasien?.nama || '-' }}</strong></div>
                <div class="col-4 text-center">No. RM: <strong>{{ pasien?.norm || '-' }}</strong></div>
                <div class="col-4 text-right">Noreg: <strong>{{ pasien?.noreg || '-' }}</strong></div>
              </div>
              <div class="row items-center justify-between q-mt-xs text-caption-custom">
                <div class="col-6">Tgl. Lahir / Usia: <strong>{{ pasien?.tgllahir || '-' }} / {{ pasien?.usia || '-' }}</strong></div>
                <div class="col-6 text-right">Jenis Kelamin: <strong>{{ pasien?.kelamin || '-' }}</strong></div>
              </div>
            </div>

            <!-- Tabel Parameter Asesmen Jatuh -->
            <div class="q-mt-md table-responsive">
              <table class="jatuh-table full-width">
                <thead>
                  <tr>
                    <th class="text-left text-bold uppercase bg-grey-2 border-cell text-xs" style="width: 250px;">
                      Parameter & Tanggal / Jam
                    </th>
                    <th v-for="col in filteredItems" :key="col.id" class="text-center bg-grey-1 border-cell text-xxs font-mono" style="min-width: 90px; line-height: 1.1;">
                      <div>{{ formatTgl(col.tanggal).date }}</div>
                      <div class="text-grey-6 text-xxs">{{ formatTgl(col.tanggal).time }}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- ── 1. METODE HUMPTY DUMPTY ── -->
                  <template v-if="activeTab === 'humpty'">
                    <!-- Usia -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Usia:</strong><br>
                        • &le; 3 tahun (4)<br>
                        • 3 - 7 tahun (3)<br>
                        • 7 - 13 tahun (2)<br>
                        • &ge; 13 tahun (1)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getHumptyDetail(col, 'usia') }}
                      </td>
                    </tr>
                    <!-- Jenis Kelamin -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Jenis Kelamin:</strong><br>
                        • Laki-laki (2)<br>
                        • Perempuan (1)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getHumptyDetail(col, 'kelamin') }}
                      </td>
                    </tr>
                    <!-- Diagnosis -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Diagnosis:</strong><br>
                        • Diagnosis neurologis (4)<br>
                        • Oksigenasi/dehidrasi/sinkop dll (3)<br>
                        • Perilaku/psikiatri (2)<br>
                        • Diagnosis lain (1)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getHumptyDetail(col, 'diagnosa') }}
                      </td>
                    </tr>
                    <!-- Gangguan Kognitif -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Gangguan Kognitif:</strong><br>
                        • Tidak sadar keterbatasan (3)<br>
                        • Lupa keterbatasan (2)<br>
                        • Sadar kemampuan diri (1)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getHumptyDetail(col, 'gangguanKognitif') }}
                      </td>
                    </tr>
                    <!-- Faktor Lingkungan -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Faktor Lingkungan:</strong><br>
                        • Riwayat jatuh / tempat tidur bayi (3)<br>
                        • Menggunakan alat bantu (2)<br>
                        • Berada di tempat tidur (1)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getHumptyDetail(col, 'faktorLingkungan') }}
                      </td>
                    </tr>
                    <!-- Bedah / Sedasi / Anestesi -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Respon Bedah/Sedasi/Anestesi:</strong><br>
                        • Dalam 24 jam (3)<br>
                        • Dalam 48 jam (2)<br>
                        • &gt; 48 jam / tidak ada (1)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getHumptyDetail(col, 'responBedah') }}
                      </td>
                    </tr>
                    <!-- Penggunaan Obat -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Penggunaan Obat-obatan:</strong><br>
                        • Obat multi sedatif/narkotik/diuretik (3)<br>
                        • Salah satu obat di atas (2)<br>
                        • Lainnya / tidak ada (1)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getHumptyDetail(col, 'penggunaanObat') }}
                      </td>
                    </tr>
                  </template>

                  <!-- ── 2. METODE MORSE FALL SCALE ── -->
                  <template v-if="activeTab === 'morse'">
                    <!-- Riwayat Jatuh -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Riwayat Jatuh:</strong><br>
                        • Ya (25)<br>
                        • Tidak (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getMorseDetail(col, 'riwayatJatuh') }}
                      </td>
                    </tr>
                    <!-- Diagnosis Sekunder -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Diagnosis Sekunder (&ge; 2 diagnosa):</strong><br>
                        • Ya (15)<br>
                        • Tidak (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getMorseDetail(col, 'diagnosisSekunder') }}
                      </td>
                    </tr>
                    <!-- Alat Bantu Jalan -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Alat Bantu Jalan:</strong><br>
                        • Berpegangan perabot (30)<br>
                        • Tongkat/kruk/walker (15)<br>
                        • Tidak ada/bedrest/kursi roda (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getMorseDetail(col, 'alatBantu') }}
                      </td>
                    </tr>
                    <!-- Terpasang Infus -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Terpasang Infus / Terapi IV:</strong><br>
                        • Ya (20)<br>
                        • Tidak (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getMorseDetail(col, 'heparin') }}
                      </td>
                    </tr>
                    <!-- Gaya Berjalan -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Gaya Berjalan / Transfer:</strong><br>
                        • Terganggu (20)<br>
                        • Lemah (10)<br>
                        • Normal/imobilisasi/bedrest (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getMorseDetail(col, 'gayaBerjalan') }}
                      </td>
                    </tr>
                    <!-- Status Mental -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Status Mental:</strong><br>
                        • Lupa dengan keterbatasan (15)<br>
                        • Sadar kemampuan sendiri (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getMorseDetail(col, 'statusMental') }}
                      </td>
                    </tr>
                  </template>

                  <!-- ── 3. METODE ONTARIO ── -->
                  <template v-if="activeTab === 'ontario'">
                    <!-- Riwayat Jatuh A -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Riwayat Jatuh (a):</strong><br>
                        • Datang ke RS karena jatuh (6/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'riwayatJth_a') }}
                      </td>
                    </tr>
                    <!-- Riwayat Jatuh B -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Riwayat Jatuh (b):</strong><br>
                        • Mengalami jatuh dalam 2 bulan terakhir (6/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'riwayatJth_b') }}
                      </td>
                    </tr>
                    <!-- Status Mental A -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Status Mental (a):</strong><br>
                        • Delirium (14/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'statusMental_a') }}
                      </td>
                    </tr>
                    <!-- Status Mental B -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Status Mental (b):</strong><br>
                        • Disorientasi (14/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'statusMental_b') }}
                      </td>
                    </tr>
                    <!-- Status Mental C -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Status Mental (c):</strong><br>
                        • Agitasi (14/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'statusMental_c') }}
                      </td>
                    </tr>
                    <!-- Penglihatan A -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Penglihatan (a):</strong><br>
                        • Memakai kacamata (1/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'penglihatan_a') }}
                      </td>
                    </tr>
                    <!-- Penglihatan B -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Penglihatan (b):</strong><br>
                        • Mengeluh penglihatan buram (1/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'penglihatan_b') }}
                      </td>
                    </tr>
                    <!-- Penglihatan C -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Penglihatan (c):</strong><br>
                        • Glaukoma, katarak, degen. makula (1/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'penglihatan_c') }}
                      </td>
                    </tr>
                    <!-- Kebiasaan Berkemih -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Kebiasaan Berkemih:</strong><br>
                        • Perubahan berkemih (nokturia dll) (2/0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'berkemih_a') }}
                      </td>
                    </tr>
                    <!-- Transfer -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Transfer (Bed ke kursi):</strong><br>
                        • Bantuan total / tidak seimbang (3)<br>
                        • Bantuan nyata (2)<br>
                        • Bantuan minimal / pengawasan (1)<br>
                        • Mandiri / alat bantu jalan (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'transfertk') }}
                      </td>
                    </tr>
                    <!-- Mobilitas -->
                    <tr>
                      <td class="text-left border-cell text-xxs">
                        <strong>Mobilitas:</strong><br>
                        • Imobilisasi (3)<br>
                        • Kursi roda (2)<br>
                        • Berjalan bantuan orang (1)<br>
                        • Mandiri / alat bantu jalan (0)
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                        {{ getOntarioDetail(col, 'mobilitas') }}
                      </td>
                    </tr>
                  </template>

                  <!-- ── FOOTER BARIS / TOTALS (SEMUA METODE) ── -->
                  <!-- Jumlah Skor -->
                  <tr>
                    <td class="text-left border-cell text-bold text-xs bg-grey-1 uppercase">
                      Total Skor
                    </td>
                    <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-sm bg-grey-2 border-cell font-mono">
                      {{ col.skor }}
                    </td>
                  </tr>
                  <!-- Kategori Risiko -->
                  <tr>
                    <td class="text-left border-cell text-bold text-xs bg-grey-1 uppercase">
                      Kategori / Tingkat Risiko
                    </td>
                    <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell" style="line-height: 1.1;">
                      <span :class="col.kuning ? 'risk-high-text' : ''">
                        {{ col.kategori }}
                      </span>
                    </td>
                  </tr>
                  <!-- Petugas -->
                  <tr>
                    <td class="text-left border-cell text-bold text-xs bg-grey-1 uppercase">
                      Dilengkapi Oleh
                    </td>
                    <td v-for="col in filteredItems" :key="col.id" class="text-center border-cell text-xxs font-mono" style="line-height: 1.1;">
                      <div>{{ col.petugas }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri.js'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const storeUlang = useAsesmenJatuhNyeriStore()

// Menentukan metode skoring secara otomatis tanpa tabs
const activeTab = computed(() => {
  if (storeUlang.itemsJatuh && storeUlang.itemsJatuh.length > 0) {
    const latest = storeUlang.itemsJatuh[0]
    return latest.metode?.toLowerCase() || 'morse'
  }
  // Fallback berdasarkan usia jika belum ada riwayat
  const usia = props.pasien?.usia ? parseInt(props.pasien.usia) : 30
  if (usia < 14) {
    return 'humpty'
  } else if (usia >= 60) {
    return 'ontario'
  } else {
    return 'morse'
  }
})

watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    storeUlang.getData(newPasien)
  }
}, { immediate: true })

onMounted(() => {
  if (props.pasien) {
    storeUlang.getData(props.pasien)
  }
})

const MAX_COLUMNS = 10

// Mengecek apakah ada data rekam medis riil untuk metode aktif
const hasRealData = computed(() => {
  if (!storeUlang.itemsJatuh || !storeUlang.itemsJatuh.length) return false
  return storeUlang.itemsJatuh.some(x => x.metode?.toLowerCase() === activeTab.value.toLowerCase())
})

// Judul header rekam medis dinamis berdasarkan metode yang aktif
const documentHeader = computed(() => {
  let methodLabel = ''
  if (activeTab.value === 'humpty') {
    methodLabel = '(HUMPTY DUMPTY)'
  } else if (activeTab.value === 'morse') {
    methodLabel = '(MORSE FALL SCALE)'
  } else if (activeTab.value === 'ontario') {
    methodLabel = '(ONTARIO)'
  }
  return ['REKAM MEDIS', 'ASESMEN ULANG RISIKO JATUH', methodLabel]
})

const filteredItems = computed(() => {
  if (!storeUlang.itemsJatuh) return []
  
  // 1. Ambil data asli dan petakan properti
  const mapped = storeUlang.itemsJatuh
    .filter(x => x.metode?.toLowerCase() === activeTab.value.toLowerCase())
    .map(item => {
      let parsed = {}
      if (item.details) {
        parsed = typeof item.details === 'string' ? JSON.parse(item.details) : item.details
      }
      return {
        id: item.id,
        tanggal: item.created_at || item.tanggal,
        petugas: item.pegawai?.nama || item.kdpegsimrs || 'Petugas',
        metode: item.metode,
        skor: item.skor,
        kategori: item.kategori,
        kuning: !!item.kuning,
        detailsRaw: parsed
      }
    })
    .reverse() // urutkan kronologis tertua -> terbaru (kiri -> kanan)

  // 2. Jika data melebihi MAX_COLUMNS, ambil data terbaru yang muat
  let activeItems = []
  if (mapped.length > MAX_COLUMNS) {
    activeItems = mapped.slice(-MAX_COLUMNS)
  } else {
    activeItems = [...mapped]
  }

  // 3. Lengkapi kolom kosong ke kanan jika total data kurang dari MAX_COLUMNS
  const cols = []
  for (let i = 0; i < MAX_COLUMNS; i++) {
    if (i < activeItems.length) {
      cols.push(activeItems[i])
    } else {
      cols.push({
        id: `empty-${i}`,
        isEmpty: true,
        tanggal: null,
        petugas: '',
        skor: '',
        kategori: '',
        kuning: false,
        detailsRaw: {}
      })
    }
  }
  return cols
})

// Helper untuk mengambil skor per item (kosongkan jika kolom kosong)
const getHumptyDetail = (col, key) => {
  if (col.isEmpty) return ''
  return col.detailsRaw?.[key]?.skor !== undefined ? col.detailsRaw[key].skor : ''
}

const getMorseDetail = (col, key) => {
  if (col.isEmpty) return ''
  return col.detailsRaw?.[key]?.skor !== undefined ? col.detailsRaw[key].skor : ''
}

const getOntarioDetail = (col, key) => {
  if (col.isEmpty) return ''
  return col.detailsRaw?.[key]?.skor !== undefined ? col.detailsRaw[key].skor : ''
}

// Format Tanggal untuk kolom
const formatTgl = (tglStr) => {
  if (!tglStr) return { date: '', time: '' }
  const date = new Date(tglStr)
  if (isNaN(date.getTime())) return { date: tglStr, time: '' }
  const pad = (n) => String(n).padStart(2, '0')
  return {
    date: `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${String(date.getFullYear()).slice(-2)}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
}

const dataHeader = ref([
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
  'RSUD DOKTER MOHAMMAD SALEH',
  'Jalan Mayjend Panjaitan No.65 Telp : (0335) 433119,421118 Fax. (0335) 432705',
  'e-mail : rsudprob@probolinggokota.go.id',
  'PROBOLINGGO 67219'
])

const printObj = {
  id: 'print-jatuh-document',
  popTitle: 'Asesmen Ulang Risiko Jatuh'
}
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid #ddd;
}

.patient-info {
  border: 1px solid #000;
  border-radius: 4px;
  box-sizing: border-box;
}

.text-caption-custom {
  font-size: 11px;
  line-height: 1.3;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.jatuh-table {
  border-collapse: collapse;
  margin-top: 5px;
  width: 100%;
  
  th, td {
    padding: 6px 8px;
    border: 1px solid #000;
  }
}

.border-cell {
  border: 1px solid #000 !important;
}

.text-xxs {
  font-size: 9px;
  line-height: 1.25;
}

.text-bold {
  font-weight: bold;
}

.risk-high-text {
  color: #d32f2f !important;
  font-weight: bold !important;
  text-decoration: underline;
}

.document-container {
  width: 100%;
  max-width: 1100px;
}

.print-page {
  box-sizing: border-box;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>

<style lang="scss">
@media print {
  .no-print {
    display: none !important;
  }

  @page {
    size: A4 landscape;
    margin: 6mm 10mm;
  }

  body {
    background: #fff !important;
  }

  .fit {
    height: auto !important;
    min-height: 0 !important;
  }

  .scroll {
    overflow: visible !important;
  }

  .bg-grey-4 {
    background-color: #fff !important;
  }

  .document-container {
    width: 280mm !important;
    max-width: 280mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  .print-page {
    width: 280mm !important;
    height: auto !important;
    min-height: 0 !important;
    padding: 3mm 4mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
    border: none !important;
  }

  .patient-info {
    margin-top: 4px !important;
    padding: 4px 6px !important;
  }

  .text-caption-custom {
    font-size: 10px !important;
  }

  .q-mt-md {
    margin-top: 6px !important;
  }

  .text-xxs {
    font-size: 8px !important;
    line-height: 1.15 !important;
  }

  .text-xs {
    font-size: 8.5px !important;
  }

  .text-sm {
    font-size: 10px !important;
  }

  .jatuh-table {
    width: 100% !important;
    
    th, td {
      border: 1px solid #000 !important;
      color: #000 !important;
      padding: 4px 5px !important;
      line-height: 1.15 !important;
    }
  }
  
  .border-cell {
    border: 1px solid #000 !important;
  }

  /* Ukuran Kop Surat Proporsional saat dicetak */
  .kotak {
    padding: 3px !important;
    margin-bottom: 4px !important;
    border-bottom: 2px solid #000 !important;
  }
  .kotak img {
    width: 65px !important;
    height: auto !important;
  }
  .kotak .f-16 {
    font-size: 13px !important;
  }
  .kotak .f-12 {
    font-size: 10px !important;
  }
  .kotak .f-10 {
    font-size: 9px !important;
  }
  .kotak .q-px-lg {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  
  * {
    color: #000000 !important;
  }
}
</style>
