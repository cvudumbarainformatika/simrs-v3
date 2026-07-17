<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN ASESMEN ULANG RISIKO NYERI</div>
          
          <q-tabs v-model="activeTab" dense no-caps inline-label narrow-indicator class="bg-indigo-1 text-indigo-10 rounded-borders q-ml-md" active-bg-color="indigo-10" active-color="white">
            <q-tab name="wong-baker" label="Wong Baker" />
            <q-tab name="bps" label="BPS (Tidak Sadar)" />
            <q-tab name="nips" label="NIPS (< 1 Tahun)" />
          </q-tabs>

          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="filteredItems.some(x => !x.isEmpty)">
            {{ filteredItems.filter(x => !x.isEmpty).length }} Riwayat Terdaftar
          </q-badge>
        </div>
        
        <div class="row q-gutter-sm" v-if="filteredItems.some(x => !x.isEmpty)">
          <q-btn
            v-print="printObj"
            color="indigo-10"
            icon="icon-mat-print"
            label="Cetak Asesmen Nyeri"
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
        <q-icon name="icon-my-monitor_heart" size="64px" class="q-mb-sm text-grey-4" />
        <div class="text-bold text-h6 text-grey-5">Tidak Ada Riwayat Asesmen</div>
        <div class="text-caption text-grey-5">Belum ada riwayat penilaian risiko nyeri menggunakan metode <strong>{{ getMethodLabel(activeTab).toUpperCase() }}</strong> untuk pasien ini.</div>
      </div>

      <div v-else id="print-nyeri-document" class="column items-center q-gutter-y-md full-width">
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

            <!-- Table Area (Full Width) -->
            <div class="q-mt-md">
              <div class="table-responsive">
                <table class="nyeri-table full-width">
                  <thead>
                    <tr>
                      <th class="text-left text-bold uppercase bg-grey-2 border-cell text-xxs" style="width: 250px;">
                        Parameter & Tanggal / Jam
                      </th>
                      <th v-for="col in filteredItems" :key="col.id" class="text-center bg-grey-1 border-cell text-xxs font-mono" style="width: 75px; line-height: 1.1;">
                        <div v-if="!col.isEmpty">{{ formatTgl(col.tanggal).date }}</div>
                        <div v-if="!col.isEmpty" class="text-grey-6 text-xxs">{{ formatTgl(col.tanggal).time }}</div>
                        <div v-else>&nbsp;<br>&nbsp;</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- ── 1. WONG BAKER FACE SCALE ── -->
                    <template v-if="activeTab === 'wong-baker'">
                      <tr>
                        <td class="text-left border-cell text-xxs font-weight-bold">
                          Metode Kajian:
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-xxs border-cell font-mono">
                          {{ col.isEmpty ? '' : 'Wong Baker' }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left border-cell text-xxs font-weight-bold">
                          Skor Nyeri (0-10):
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs border-cell font-mono">
                          {{ col.isEmpty ? '' : col.skor }}
                        </td>
                      </tr>
                    </template>

                    <!-- ── 2. BPS (BEHAVIORAL PAIN SCALE) ── -->
                    <template v-if="activeTab === 'bps'">
                      <!-- Ekspresi Wajah -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Ekspresi Wajah:</strong><br>
                          • Santai, tanpa ketegangan (1)<br>
                          • Sedikit tegang (seperti dahi berkerut) (2)<br>
                          • Sangat tegang (mata tertutup rapat) (3)<br>
                          • Meringis / meringis parah (4)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'ekspresiWajah') }}
                        </td>
                      </tr>
                      <!-- Gerakan Tangan -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Gerakan Tangan:</strong><br>
                          • Tidak ada gerakan (1)<br>
                          • Ada gerakan ringan (menggerakkan telapak tanpa arah) (2)<br>
                          • Ada gerakan kuat (menarik tangan / melepas alat) (3)<br>
                          • Gerakan tidak terkendali (melarikan diri) (4)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'gerakanTangan') }}
                        </td>
                      </tr>
                      <!-- Kepatuhan terhadap Ventilator / Kebutuhan Ventilasi -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Kepatuhan Ventilator / Vokasional:</strong><br>
                          • Toleran, tidak ada perlawanan (1)<br>
                          • Sedikit tidak toleran (batuk/melawan sedikit) (2)<br>
                          • Sering batuk atau melawan ventilasi (3)<br>
                          • Tidak toleran sama sekali (melawan konstan) (4)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'kebutuhanVentilasi') }}
                        </td>
                      </tr>
                    </template>

                    <!-- ── 3. NIPS (NEONATAL INFANT PAIN SCALE) ── -->
                    <template v-if="activeTab === 'nips'">
                      <!-- Ekspresi Wajah -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Ekspresi Wajah:</strong><br>
                          • Santai (0)<br>
                          • Meringis (1)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'ekspresiWajah') }}
                        </td>
                      </tr>
                      <!-- Menangis -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Menangis:</strong><br>
                          • Tidak Menangis (0)<br>
                          • Merengek/Merintih (1)<br>
                          • Menangis (2)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'menangis') }}
                        </td>
                      </tr>
                      <!-- Pola Nafas -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Pola Nafas:</strong><br>
                          • Santai (0)<br>
                          • Perubahan Pola Nafas (1)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'polaNafas') }}
                        </td>
                      </tr>
                      <!-- Lengan -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Lengan:</strong><br>
                          • Santai (0)<br>
                          • Fleksi / Ekstensi (1)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'lengan') }}
                        </td>
                      </tr>
                      <!-- Kaki -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Kaki:</strong><br>
                          • Santai (0)<br>
                          • Fleksi / Ekstensi (1)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'kaki') }}
                        </td>
                      </tr>
                      <!-- Keadaan Rangsangan -->
                      <tr>
                        <td class="text-left border-cell text-xxs" style="line-height: 1.2;">
                          <strong>Keadaan Rangsangan:</strong><br>
                          • Tertidur / Bangun (0)<br>
                          • Rewel (1)
                        </td>
                        <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell font-mono">
                          {{ getNyeriDetail(col, 'keadaanRangsangan') }}
                        </td>
                      </tr>
                    </template>

                    <!-- ── FOOTER BARIS / TOTALS (SEMUA METODE) ── -->
                    <!-- Jumlah Skor -->
                    <tr>
                      <td class="text-left border-cell text-bold text-xxs bg-grey-1 uppercase">
                        Total Skor
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xs bg-grey-2 border-cell font-mono">
                        {{ col.isEmpty ? '' : col.skor }}
                      </td>
                    </tr>
                    <!-- Kategori -->
                    <tr>
                      <td class="text-left border-cell text-bold text-xxs bg-grey-1 uppercase">
                        Kategori / Keterangan
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center text-bold text-xxs border-cell" style="line-height: 1.1;">
                        <span>
                          {{ col.isEmpty ? '' : col.ket }}
                        </span>
                      </td>
                    </tr>
                    <!-- Petugas -->
                    <tr>
                      <td class="text-left border-cell text-bold text-xxs bg-grey-1 uppercase">
                        Dilengkapi Oleh
                      </td>
                      <td v-for="col in filteredItems" :key="col.id" class="text-center border-cell text-xxs font-mono" style="line-height: 1.1;">
                        <div>{{ col.isEmpty ? '' : col.petugas }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Reference Section (Below the Table) -->
            <div class="q-mt-sm border-t pt-sm page-break-avoid">
              
              <!-- 1. Wong Baker Wajah dan Skala Angka -->
              <div v-if="activeTab === 'wong-baker'" class="column items-center q-gutter-y-xs">
                <div class="text-subtitle2 text-bold text-indigo-10 text-center uppercase q-mb-xs" style="font-size: 10px;">
                  Panduan Skala Nyeri Wong-Baker FACES® & Numeric Rating Scale (NRS)
                </div>
                
                <div class="row justify-center items-center q-col-gutter-md full-width">
                  <!-- Wong Baker Faces -->
                  <div class="col-auto text-center">
                    <q-img :src="imgWongBakerFaces" style="max-height: 120px; width: 440px; border: 1px solid #ddd; border-radius: 4px;" fit="contain" />
                  </div>
                  <!-- Vertical/Horizontal Numeric Scale -->
                  <div class="col-auto text-center">
                    <q-img :src="imgNumericScale" style="max-height: 120px; width: 80px; border: 1px solid #ddd; border-radius: 4px;" fit="contain" />
                  </div>
                </div>

                <!-- Tabel Legenda Skor Wong Baker / NRS -->
                <table class="legend-table text-xxs font-mono q-mt-xs" style="margin: 0 auto; border-collapse: collapse; border: 1px solid #000;">
                  <tr>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor 0</td>
                    <td class="border-cell q-px-sm" style="width: 140px;">Bebas Nyeri (Tidak Nyeri)</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor 1 - 3</td>
                    <td class="border-cell q-px-sm" style="width: 100px;">Nyeri Ringan</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor 4 - 6</td>
                    <td class="border-cell q-px-sm" style="width: 100px;">Nyeri Sedang</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor 7 - 10</td>
                    <td class="border-cell q-px-sm" style="width: 100px;">Nyeri Berat</td>
                  </tr>
                </table>
              </div>

              <!-- 2. BPS Reference guide image -->
              <div v-if="activeTab === 'bps'" class="column items-center q-gutter-y-xs">
                <div class="text-subtitle2 text-bold text-indigo-10 text-center uppercase q-mb-xs" style="font-size: 10px;">
                  Panduan Pengukuran Nyeri: Behavioral Pain Scale (BPS)
                </div>
                
                <div class="row justify-center items-center q-col-gutter-md full-width">
                  <!-- Wong Baker Faces -->
                  <div class="col-auto text-center">
                    <q-img :src="imgWongBakerFaces" style="max-height: 120px; width: 440px; border: 1px solid #ddd; border-radius: 4px;" fit="contain" />
                  </div>
                  <!-- Vertical/Horizontal Numeric Scale -->
                  <div class="col-auto text-center">
                    <q-img :src="imgNumericScale" style="max-height: 120px; width: 80px; border: 1px solid #ddd; border-radius: 4px;" fit="contain" />
                  </div>
                </div>

                <!-- Tabel Legenda Skor BPS -->
                <table class="legend-table text-xxs font-mono q-mt-xs" style="margin: 0 auto; border-collapse: collapse; border: 1px solid #000;">
                  <tr>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor 3</td>
                    <td class="border-cell q-px-sm" style="width: 140px;">Rileks (Bebas Nyeri)</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor 4 - 5</td>
                    <td class="border-cell q-px-sm" style="width: 100px;">Nyeri Ringan</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor 6 - 8</td>
                    <td class="border-cell q-px-sm" style="width: 100px;">Nyeri Sedang</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 60px;">Skor &ge; 9</td>
                    <td class="border-cell q-px-sm" style="width: 100px;">Nyeri Berat</td>
                  </tr>
                </table>
              </div>

              <!-- 3. NIPS Reference guide image -->
              <div v-if="activeTab === 'nips'" class="column items-center q-gutter-y-xs">
                <!-- Tabel Legenda Skor NIPS -->
                <table class="legend-table text-xxs font-mono q-mt-xs" style="margin: 0 auto; border-collapse: collapse; border: 1px solid #000;">
                  <tr>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 80px;">Skor 0 - 2</td>
                    <td class="border-cell q-px-sm" style="width: 180px;">Ringan / Tidak Nyeri (Tidak Nyaman)</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 80px;">Skor 3 - 4</td>
                    <td class="border-cell q-px-sm" style="width: 140px;">Nyeri Sedang</td>
                    <td class="border-cell q-px-sm text-bold text-center" style="background-color: #f5f5f5; width: 80px;">Skor &ge; 5</td>
                    <td class="border-cell q-px-sm" style="width: 140px;">Nyeri Berat / Hebat</td>
                  </tr>
                </table>
              </div>

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

// Import Gambar Asset
import imgWongBakerFaces from 'src/assets/images/wong_baker_faces.png'
import imgNumericScale from 'src/assets/images/numeric_scale.png'
import imgBpsGuide from 'src/assets/images/bps_guide.png'

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
const activeTab = ref('wong-baker')

// Menentukan metode skoring secara otomatis berdasarkan data terakhir atau usia pasien
const autoSetTab = () => {
  if (storeUlang.itemsNyeri && storeUlang.itemsNyeri.length > 0) {
    const latest = storeUlang.itemsNyeri[0]
    const m = latest.metode?.toLowerCase()
    if (m?.includes('wong')) activeTab.value = 'wong-baker'
    else if (m?.includes('bps') || m?.includes('behavioral')) activeTab.value = 'bps'
    else if (m?.includes('nips') || m?.includes('neonatal')) activeTab.value = 'nips'
    return
  }

  // Fallback berdasarkan usia jika belum ada riwayat
  const tgllahir = props.pasien?.tgllahir
  if (tgllahir) {
    const birthDate = new Date(tgllahir)
    const today = new Date()
    const diffMonth = today.getFullYear() * 12 + today.getMonth() - birthDate.getFullYear() * 12 - birthDate.getMonth()
    if (diffMonth < 1) {
      activeTab.value = 'nips'
      return
    }
  }
  activeTab.value = 'wong-baker'
}

watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    storeUlang.getData(newPasien).then(() => {
      autoSetTab()
    })
  }
}, { immediate: true })

onMounted(() => {
  if (props.pasien) {
    storeUlang.getData(props.pasien).then(() => {
      autoSetTab()
    })
  }
})

const MAX_COLUMNS = 10

// Mengecek apakah ada data rekam medis riil untuk metode aktif
const hasRealData = computed(() => {
  if (!storeUlang.itemsNyeri || !storeUlang.itemsNyeri.length) return false
  const tabVal = activeTab.value
  return storeUlang.itemsNyeri.some(x => {
    const m = x.metode?.toLowerCase()
    if (tabVal === 'wong-baker') return m?.includes('wong')
    if (tabVal === 'bps') return m?.includes('bps') || m?.includes('behavioral')
    if (tabVal === 'nips') return m?.includes('nips') || m?.includes('neonatal')
    return false
  })
})

function getMethodLabel(tab) {
  if (tab === 'wong-baker') return 'Wong Baker Face Scale'
  if (tab === 'bps') return 'Behavioral Pain Scale (BPS)'
  if (tab === 'nips') return 'Neonatal Infant Pain Scale (NIPS)'
  return ''
}

// Judul header rekam medis dinamis berdasarkan metode yang aktif
const documentHeader = computed(() => {
  let methodLabel = ''
  if (activeTab.value === 'wong-baker') {
    methodLabel = '(WONG BAKER FACE SCALE)'
  } else if (activeTab.value === 'bps') {
    methodLabel = '(BEHAVIORAL PAIN SCALE - BPS)'
  } else if (activeTab.value === 'nips') {
    methodLabel = '(NEONATAL INFANT PAIN SCALE - NIPS)'
  }
  return ['REKAM MEDIS', 'ASESMEN ULANG RISIKO NYERI', methodLabel]
})

const filteredItems = computed(() => {
  if (!storeUlang.itemsNyeri) return []
  
  const tabVal = activeTab.value
  // 1. Ambil data asli dan petakan properti
  const mapped = storeUlang.itemsNyeri
    .filter(x => {
      const m = x.metode?.toLowerCase()
      if (tabVal === 'wong-baker') return m?.includes('wong')
      if (tabVal === 'bps') return m?.includes('bps') || m?.includes('behavioral')
      if (tabVal === 'nips') return m?.includes('nips') || m?.includes('neonatal')
      return false
    })
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
        ket: item.ket,
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
        ket: '',
        detailsRaw: {}
      })
    }
  }
  return cols
})

// Helper untuk mengambil skor per parameter
const getNyeriDetail = (col, key) => {
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
  id: 'print-nyeri-document',
  popTitle: 'Asesmen Ulang Risiko Nyeri'
}
</script>

<style lang="scss" scoped>
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
  overflow-x: hidden; /* Hilangkan scrollbar horizontal */
}

.nyeri-table {
  border-collapse: collapse;
  margin-top: 5px;
  width: 100%;
  table-layout: fixed; /* Memaksa kolom memiliki ukuran yang seragam dan tidak melebihi kontainer */
  
  th, td {
    padding: 6px 8px;
    border: 1px solid #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-word;
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

.border-t {
  border-top: 1px solid #ddd;
}
.pt-sm {
  padding-top: 8px;
}
.page-break-avoid {
  page-break-inside: avoid;
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

  .nyeri-table {
    width: 100% !important;
    table-layout: fixed !important;
    
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
    padding-bottom: 2px !important;
  }
  
  * {
    color: #000000 !important;
  }
}
</style>
