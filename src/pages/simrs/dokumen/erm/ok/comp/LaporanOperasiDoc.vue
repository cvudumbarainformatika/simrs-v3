<template>
  <div class="fit bg-grey-4  q-pa-lg q-pb-xl scroll">
    <!-- SELECTOR LAPORAN (HANYA MUNCUL DI LAYAR) -->
    <div v-if="props.pasien?.laporanop?.length"
      class="no-print q-mb-md row items-center justify-between bg-teal-1 q-pa-md rounded-borders style-selector">
      <div class="row items-center q-col-gutter-sm">
        <div class="text-weight-bold text-teal-9 text-subtitle2 q-mr-sm">PILIH NOTA / LAPORAN OPERASI:</div>
        <q-select v-model="selectedNota" :options="opsiLaporan" option-value="value" option-label="label" emit-value
          map-options outlined dense bg-white style="min-width: 350px;" />
      </div>
      <div class="text-grey-7 text-caption">
        *Pilihan laporan ini hanya untuk tampilan layar dan otomatis disembunyikan saat mencetak.
      </div>
    </div>

    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <!-- KOP SURAT INTERNAL -->
        <app-kop-surat-Internal title1="LAPORAN OPERASI" title2="" />

        <!-- BIODATA PASIEN -->
        <div class="biodata-pasien q-my-md">
          <div class="flex justify-between">
            <div class="flex q-gutter-md kiri">
              <div style="width: 58px;" class="text-weight-bold">
                NO. RM
              </div>
              <div style="width: 70px;">
                : {{ pasien?.norm ?? '-' }}
              </div>
              <div class="text-weight-bold">
                NAMA PASIEN
              </div>
              <div>
                : {{ pasien?.nama_panggil ?? pasien?.nama ?? '-' }}
              </div>
            </div>
            <div class="flex q-gutter-md kanan">
              <div class="text-weight-bold">
                TGL. LAHIR
              </div>
              <div>
                : {{ dateFullFormat(pasien?.tgllahir) || '-' }}
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

        <!-- DOKUMEN CONTENT -->
        <div v-if="activeLaporanComputed" class="dokumen-content q-mb-md">
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3 text-center">DATA LAPORAN OPERASI</th>
              </tr>
            </thead>
            <tbody>
              <!-- Baris Petugas / Nakes -->
              <tr>
                <td width="25%" class="text-weight-bold">Dokter Operator</td>
                <td width="25%">{{ dokterOperator?.nama || '-' }}</td>
                <td width="25%" class="text-weight-bold">Asisten Operator</td>
                <td width="25%">{{ asistenOperator?.nama || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Dokter Anestesi</td>
                <td>{{ dokterAnestesi?.nama || '-' }}</td>
                <td class="text-weight-bold">Asisten Anestesi</td>
                <td>{{ asistenAnestesi?.nama || '-' }}</td>
              </tr>

              <!-- Baris Informasi Utama / Waktu -->
              <tr>
                <td class="text-weight-bold">Tanggal Operasi</td>
                <td>{{ dateFullFormat(activeLaporanComputed?.rs10) || '-' }}</td>
                <td class="text-weight-bold">Lama Operasi</td>
                <td>{{ lamaOperasi(activeLaporanComputed) }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Jam Mulai</td>
                <td>{{ activeLaporanComputed?.rs11 || '-' }}</td>
                <td class="text-weight-bold">Jam Selesai</td>
                <td>{{ activeLaporanComputed?.rs12 || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Jenis Anestesi</td>
                <td>{{ activeLaporanComputed?.rs4 || '-' }}</td>
                <td class="text-weight-bold">Klasifikasi Operasi</td>
                <td>{{ activeLaporanComputed?.rs8 || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Dikirim untuk PA</td>
                <td>{{ activeLaporanComputed?.rs9 || '-' }}</td>
                <td class="text-weight-bold">ASA & T-Time</td>
                <td>
                  ASA: {{ activeLaporanComputed?.asa || '-' }} /
                  T-Time: {{ parseInt(activeLaporanComputed?.ttime) === 1 ? 'YA' : 'TIDAK' }}
                </td>
              </tr>

              <!-- Diagnosa & Tindakan -->
              <tr>
                <td colspan="2" class="text-weight-bold bg-grey-1">Diagnosa Pre-Operatif</td>
                <td colspan="2" class="text-weight-bold bg-grey-1">Diagnosa Post-Operatif</td>
              </tr>
              <tr>
                <td colspan="2" v-html="getNewLine(activeLaporanComputed?.rs5) || '-'" />
                <td colspan="2" v-html="getNewLine(activeLaporanComputed?.rs6) || '-'" />
              </tr>

              <tr>
                <td colspan="2" class="text-weight-bold bg-grey-1">Nama / Tindakan Operasi</td>
                <td colspan="2" class="text-weight-bold bg-grey-1">Jenis Operasi</td>
              </tr>
              <tr>
                <td colspan="2">{{ tindakanOperasi }}</td>
                <td colspan="2">{{ activeLaporanComputed?.rs7 || '-' }}</td>
              </tr>

              <!-- Laporan Jalannya Operasi & Komplikasi -->
              <tr>
                <td colspan="4" class="text-weight-bold bg-grey-1">Laporan Jalannya Operasi</td>
              </tr>
              <tr>
                <td colspan="4" style="white-space: pre-wrap;"
                  v-html="getNewLine(activeLaporanComputed?.rs14) || '-'" />
              </tr>

              <tr>
                <td colspan="4" class="text-weight-bold bg-grey-1">Catatan Komplikasi</td>
              </tr>
              <tr>
                <td colspan="4" v-html="getNewLine(activeLaporanComputed?.rs13) || '-'" />
              </tr>

              <!-- Cairan & Implan -->
              <tr>
                <td colspan="2" class="text-weight-bold bg-grey-1">Kehilangan Darah (Cairan Keluar)</td>
                <td colspan="2" class="text-weight-bold bg-grey-1">Jenis & Jumlah Darah Masuk</td>
              </tr>
              <tr>
                <td colspan="2">{{ activeLaporanComputed?.jd_keluar ? activeLaporanComputed.jd_keluar + ' ml' : '-' }}
                </td>
                <td colspan="2">
                  {{ (activeLaporanComputed?.jenis_darah_masuk || '-') + ' / ' + (activeLaporanComputed?.jd_masuk ?
                    activeLaporanComputed.jd_masuk + ' kolf' : '-') }}
                </td>
              </tr>

              <tr>
                <td colspan="4" class="text-weight-bold bg-grey-1">No Seri Implan</td>
              </tr>
              <tr>
                <td colspan="4">{{ seriImplan }}</td>
              </tr>

              <tr v-if="imgUrlImplan">
                <td colspan="4" class="text-weight-bold bg-grey-1 text-center">Gambar Seri Implan</td>
              </tr>
              <tr v-if="imgUrlImplan">
                <td colspan="4" class="text-center">
                  <div class="q-pa-md flex flex-center">
                    <q-img :src="imgUrlImplan"
                      style="max-height: 250px; max-width: 400px; object-fit: contain; border: 1px solid #ccc;" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Signature Section (Hanya Dokter Operator di pojok kanan bawah) -->
          <div class="row q-mt-xl justify-end sign-row">
            <div v-if="dokterOperator" class="col-3 text-center">
              <div class="text-weight-bold q-mb-xs text-center">Probolinggo, {{ dateFullFormat(activeLaporanComputed?.rs10) || '-' }}</div>
              <div class="text-weight-bold q-mb-sm text-center">Dokter Operator</div>
              <div v-if="qrOperator" style="height: 90px; width: 90px; margin: 0 auto;" class="q-mb-sm">
                <vue-qrcode :value="qrOperator" tag="svg" :options="{
                  errorCorrectionLevel: 'Q',
                  color: { dark: '#000000', light: '#ffffff' },
                  margin: 0
                }" />
              </div>
              <div style="text-decoration: underline;" class="text-weight-bold">
                {{ dokterOperator?.nama || '-' }}
              </div>
              <div class="f-10">NIP. {{ dokterOperator?.nip || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- NO DATA BANNER -->
        <div v-else class="column flex-center q-pa-xl text-grey-6 text-center">
          <q-icon name="icon-mat-warning" size="48px" />
          <div class="text-h6 q-mt-md">Belum Ada Laporan Operasi</div>
          <div>Pasien ini belum memiliki catatan laporan operasi yang tersimpan.</div>
        </div>
      </div>
    </div>

    <!-- FLOATING PRINT BUTTON -->
    <q-btn v-if="activeLaporanComputed" ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary"
      class="fixed-bottom-right" style="margin: 16px; z-index: 9999;">
      <q-tooltip>Print Laporan Operasi</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { pathImg } from 'src/boot/axios'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'
import { onMounted, ref, computed, watch } from 'vue'
import { dateFullFormat, getNewLine } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useLaporanOperasiStore()
const refPrint = ref()
const selectedNota = ref(null)

// Watch laporanop untuk inisialisasi default ke item pertama jika ada
watch(
  () => props.pasien?.laporanop,
  (newVal) => {
    if (newVal?.length) {
      selectedNota.value = newVal[0].rs2
    } else {
      selectedNota.value = null
    }
  },
  { immediate: true }
)

// List laporanop sebagai opsi dropdown
const opsiLaporan = computed(() => {
  if (!props.pasien?.laporanop?.length) return []
  return props.pasien.laporanop.map((x) => ({
    label: `Nota: ${x.rs2} - Tgl: ${x.rs10 || x.rs3}`,
    value: x.rs2
  }))
})

// Data laporanop yang aktif
const activeLaporanComputed = computed(() => {
  if (!props.pasien?.laporanop?.length) return null
  if (!selectedNota.value) return props.pasien.laporanop[0]
  return props.pasien.laporanop.find((x) => x.rs2 === selectedNota.value) || props.pasien.laporanop[0]
})

// Tindakan operasi yang bersesuaian dengan nota/rs2 laporan aktif
const tindakanAktif = computed(() => {
  const nota = activeLaporanComputed.value?.rs2
  if (!nota || !props.pasien?.manytindakanop?.length) return null
  return props.pasien.manytindakanop.find((x) => x.rs2 === nota)
})

const tindakanOperasi = computed(() => {
  if (!tindakanAktif.value) return '-'
  return tindakanAktif.value?.mastertindakanoperasi?.rs2 ?? tindakanAktif.value?.nama ?? '-'
})

// Hitung lama operasi
function lamaOperasi (data) {
  if (!data) return ''
  const awal = data?.rs11
  const akhir = data?.rs12
  if (!awal || !akhir) return '-'
  const [jm, mm] = awal.split(':').map(Number)
  const [js, ms] = akhir.split(':').map(Number)
  if (isNaN(jm) || isNaN(mm) || isNaN(js) || isNaN(ms)) return '-'
  const mulai = jm * 60 + mm
  let selesai = js * 60 + ms
  if (selesai < mulai) {
    selesai += 24 * 60
  }
  const diffMenit = selesai - mulai
  const jam = Math.floor(diffMenit / 60)
  const menit = diffMenit % 60
  return `${jam} jam ${menit} menit`
}

// Seri implan untuk activeLaporan
const seriImplan = computed(() => {
  const nota = activeLaporanComputed.value?.rs2
  if (!nota || !props.pasien?.implant?.length) return '-'
  let matching = props.pasien.implant.filter((x) => !!x.seri && x.nota === nota)
  if (matching.length === 0) {
    matching = props.pasien.implant.filter((x) => !!x.seri)
  }
  return matching.length > 0 ? matching.map((x) => x.seri).join(', ') : '-'
})

// File implan untuk activeLaporan
const fileImplan = computed(() => {
  const nota = activeLaporanComputed.value?.rs2
  if (!nota || !props.pasien?.implant_seri?.length) return null
  const found = props.pasien.implant_seri.find((x) => x.nota === nota)
  if (!found && props.pasien.implant_seri.length > 0) {
    return props.pasien.implant_seri[0]
  }
  return found
})

const imgUrlImplan = computed(() => {
  const file = fileImplan.value?.url
  if (!file) return null
  const spl = file.split('.')
  const ext = spl[spl.length - 1]?.toLowerCase()
  if (ext === 'pdf') {
    return new URL('../../../../../../assets/images/PDF_file_icon.png', import.meta.url).href
  } else {
    return pathImg + file
  }
})

// MAPPING NAKES
const dokterOperator = computed(() => {
  const code = tindakanAktif.value?.rs9?.split(';').filter((x) => !!x)[0]
  if (!code) return null
  return store.nakes.find((x) => x.kdpegsimrs === code) || { nama: code, nip: '-', kdpegsimrs: code }
})

const asistenOperator = computed(() => {
  const codes = tindakanAktif.value?.rs11?.split(';').filter((x) => !!x) || []
  if (codes.length === 0) return null
  const list = codes.map((code) => store.nakes.find((x) => x.kdpegsimrs === code) || { nama: code, nip: '-', kdpegsimrs: code })
  return {
    nama: list.map((x) => x.nama).join(', '),
    nip: list.map((x) => x.nip).join(', '),
    kdpegsimrs: codes[0]
  }
})

const dokterAnestesi = computed(() => {
  const code = tindakanAktif.value?.rs12?.split(';').filter((x) => !!x)[0]
  if (!code) return null
  return store.nakes.find((x) => x.kdpegsimrs === code) || { nama: code, nip: '-', kdpegsimrs: code }
})

const asistenAnestesi = computed(() => {
  const codes = tindakanAktif.value?.rs13?.split(';').filter((x) => !!x) || []
  if (codes.length === 0) return null
  const list = codes.map((code) => store.nakes.find((x) => x.kdpegsimrs === code) || { nama: code, nip: '-', kdpegsimrs: code })
  return {
    nama: list.map((x) => x.nama).join(', '),
    nip: list.map((x) => x.nip).join(', '),
    kdpegsimrs: codes[0]
  }
})

// QR CODE GENERATOR
function generateQRUrl (noreg, dokumen, petugas, asal) {
  if (!petugas) return ''
  try {
    const enc = btoa(`${noreg}|${dokumen}|${asal}|${petugas}`)
    return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  } catch (e) {
    return petugas
  }
}

const qrOperator = computed(() => {
  const code = dokterOperator.value?.kdpegsimrs || dokterOperator.value?.nip || dokterOperator.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Laporan Operasi - Dokter Operator', code, 'PENUNJANG')
})

const qrAsistenOp = computed(() => {
  const code = asistenOperator.value?.kdpegsimrs || asistenOperator.value?.nip || asistenOperator.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Laporan Operasi - Asisten Operator', code, 'PENUNJANG')
})

const qrDokterAn = computed(() => {
  const code = dokterAnestesi.value?.kdpegsimrs || dokterAnestesi.value?.nip || dokterAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Laporan Operasi - Dokter Anestesi', code, 'PENUNJANG')
})

const qrAsistenAn = computed(() => {
  const code = asistenAnestesi.value?.kdpegsimrs || asistenAnestesi.value?.nip || asistenAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Laporan Operasi - Asisten Anestesi', code, 'PENUNJANG')
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'LAPORAN OPERASI',
  popTitle: 'LAPORAN OPERASI'
}

onMounted(() => {
  if (store.nakes?.length === 0) {
    store.getNakes()
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

.style-selector {
  border: 1px solid #b2dfdb;
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

  th,
  td {
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

.sign-row {
  page-break-inside: avoid;
}

.sign-title {
  min-height: 28px;
}

@media print {
  .no-print {
    display: none !important;
  }

  .page-legal {
    width: 21.59cm;
    height: auto;

    .contentx {
      padding: 5mm;
    }
  }

  @page {
    margin: 10mm;
  }
}
</style>
