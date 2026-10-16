<template>
  <div id="pdfDoc" class="bg-white print-page text-black">
    <!-- JIKA BELUM ADA DATA KONSULTASI -->
    <div v-if="!listKonsultasi || listKonsultasi.length === 0" class="full-height column flex-center q-pa-xl text-grey-7" style="min-height: 400px;">
      <q-icon name="icon-mat-assignment_late" size="64px" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-weight-bold">Belum Ada Data Konsultasi Spesialis</div>
      <div class="text-caption text-grey-6 q-mt-xs">Pasien ini belum memiliki riwayat permintaan konsultasi dokter spesialis.</div>
    </div>

    <!-- JIKA ADA DATA KONSULTASI -->
    <div v-else>
      <!-- Loop setiap item konsultasi (bisa 1 atau lebih) -->
      <div
        v-for="(item, index) in listKonsultasi"
        :key="item.id || index"
        class="lembar-konsul"
        :class="{ 'page-break-after': index < listKonsultasi.length - 1 }"
      >
        <!-- KOP SURAT STANDAR RSUD -->
        <AppKopSuratStandard
          :dataHeader="dataHeader"
          :pasien="pasien"
          :header="['LEMBAR KONSULTASI', 'DOKTER SPESIALIS', 'RAWAT INAP']"
        />

        <!-- IDENTITAS PASIEN -->
        <table class="table-identitas full-width q-my-xs">
          <tbody>
            <tr>
              <td width="15%" class="text-weight-bold bg-grey-2">Nama Pasien</td>
              <td width="35%">: <strong>{{ pasien?.nama || '-' }}</strong></td>
              <td width="18%" class="text-weight-bold bg-grey-2">No. RM / Noreg</td>
              <td width="32%">: <strong>{{ pasien?.norm || '-' }} / {{ pasien?.noreg || '-' }}</strong></td>
            </tr>
            <tr>
              <td class="text-weight-bold bg-grey-2">Tgl Lahir / Usia</td>
              <td>: {{ pasien?.tgllahir || '-' }} ({{ pasien?.usia || '-' }})</td>
              <td class="text-weight-bold bg-grey-2">Jenis Kelamin</td>
              <td>: {{ pasien?.kelamin || '-' }}</td>
            </tr>
            <tr>
              <td class="text-weight-bold bg-grey-2">Ruangan / Kelas</td>
              <td>: {{ pasien?.koderuangan || pasien?.ruangan || '-' }} / {{ pasien?.kelas || pasien?.hak_kelas || '-' }}</td>
              <td class="text-weight-bold bg-grey-2">Sistem Bayar</td>
              <td>: {{ pasien?.sistembayar || '-' }}</td>
            </tr>
            <tr>
              <td class="text-weight-bold bg-grey-2">DPJP Utama</td>
              <td colspan="3">: <strong>{{ pasien?.dokter || '-' }}</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- 1 KOTAK UTAMA (MEMUAT PERMINTAAN, JAWABAN, DAN TTD SEJAJAR) -->
        <div class="section-box q-mt-xs q-mb-md">
          <!-- HEADER I: PERMINTAAN KONSULTASI -->
          <div class="section-header bg-grey-3 q-px-sm q-py-xs row justify-between items-center">
            <span class="text-weight-bold f-11 text-uppercase">
              I. PERMINTAAN KONSULTASI (Konsultasi Ke-{{ listKonsultasi.length - index }} | ID: #{{ item?.id }})
            </span>
            <span class="text-caption text-weight-bold text-primary">
              Dikonsulkan: {{ formatWaktuLengkap(item?.tgl_permintaan || item?.created_at) }}
            </span>
          </div>

          <div class="q-px-sm q-py-xs">
            <table class="table-form full-width">
              <tbody>
                <tr>
                  <td width="22%" class="text-weight-bold">Kepada Yth. Teman Sejawat</td>
                  <td width="78%">: <strong>{{ getNamaDokterKonsul(item) }}</strong></td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Keperluan Konsultasi</td>
                  <td>: {{ item?.ketuntuk || 'Konsultasikan tindakan masalah medik saat ini' }}</td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Hari, Tanggal & Jam Konsul</td>
                  <td>: <strong>{{ formatWaktuLengkap(item?.tgl_permintaan || item?.created_at) }}</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="q-mt-xs">
              <div class="text-weight-bold q-mb-xs">Ikhtisar Klinik / Masalah Medik & Permintaan Konsul:</div>
              <div class="isi-teks q-pa-xs bg-grey-1 rounded-borders" v-html="formatNewLine(item?.permintaan) || '-'"></div>
            </div>
          </div>

          <!-- HEADER II: JAWABAN KONSULTASI (DI DALAM KOTAK YANG SAMA) -->
          <div class="section-header bg-grey-3 q-px-sm q-py-xs row justify-between items-center" style="border-top: 1px solid #000;">
            <span class="text-weight-bold f-11 text-uppercase">II. JAWABAN KONSULTASI</span>
            <span v-if="item?.jawaban" class="text-caption text-weight-bold text-positive">
              Dijawab: {{ formatWaktuLengkap(item?.tgl_jawaban || item?.updated_at) }}
            </span>
            <span v-else class="text-caption text-weight-bold text-negative">
              * Belum Ada Jawaban
            </span>
          </div>

          <div class="q-px-sm q-py-xs">
            <!-- JIKA BELUM ADA JAWABAN -->
            <div v-if="!item?.jawaban" class="text-center q-pa-sm text-grey-6 bg-grey-1 rounded-borders border-dashed q-my-xs">
              <q-icon name="icon-mat-pending_actions" size="28px" color="orange-8" class="q-mb-xs" />
              <div class="text-weight-bold text-orange-9 f-10">Permintaan Konsultasi Masih Menunggu Jawaban</div>
              <div class="text-caption f-9">Dokter spesialis tujuan konsul belum mengisi jawaban konsultasi medik ini.</div>
            </div>

            <!-- JIKA SUDAH ADA JAWABAN -->
            <div v-else>
              <table class="table-form full-width q-mb-xs">
                <tbody>
                  <tr>
                    <td width="22%" class="text-weight-bold">Hari, Tanggal & Jam Dijawab</td>
                    <td width="78%">: <strong>{{ formatWaktuLengkap(item?.tgl_jawaban || item?.updated_at) }}</strong></td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold">Status Verifikasi Dokter</td>
                    <td>: 
                      <q-badge
                        :color="isTerverifikasi(item) ? 'green-8' : 'orange-9'"
                        class="q-px-xs q-py-xs text-weight-bold f-9"
                      >
                        {{ isTerverifikasi(item) ? 'SUDAH TERVERIFIKASI OLEH DOKTER KONSULAN' : 'BELUM TERVERIFIKASI DOKTER KONSULAN' }}
                      </q-badge>
                    </td>
                  </tr>
                  <tr v-if="isTerverifikasi(item)">
                    <td class="text-weight-bold">Waktu Verifikasi</td>
                    <td>: <strong>{{ formatWaktuLengkap(item?.tgl_jawaban || item?.updated_at) }}</strong> (Oleh {{ getNamaDokterKonsul(item) }})</td>
                  </tr>
                </tbody>
              </table>

              <div class="q-mt-xs">
                <div class="text-weight-bold q-mb-xs">Pendapat / Saran Tindakan Medik & Pengobatan:</div>
                <div class="isi-teks q-pa-xs bg-grey-1 rounded-borders" v-html="formatNewLine(item?.jawaban)"></div>
              </div>
            </div>

            <!-- TTD / QR SEJAJAR DI BAWAH (KIRI: PENGONSUL, KANAN: KONSULAN) -->
            <div class="row justify-between items-start q-mt-sm q-pt-xs" style="border-top: 1px dashed #bbb;">
              <!-- SEBELAH KIRI: DOKTER / NAKES YANG MENGONSULKAN -->
              <div class="col-5 text-center">
                <div class="text-caption f-9">Probolinggo, {{ formatTanggalSaja(item?.tgl_permintaan || item?.created_at) }}</div>
                <div class="text-weight-bold text-caption f-9 q-mb-xs">Dokter / Nakes Yang Mengonsulkan,</div>
                <div class="column flex-center q-my-xs">
                  <div style="width: 65px; height: 65px;">
                    <vue-qrcode
                      :value="getQrUrl(item, 'PERMINTAAN')"
                      tag="svg"
                      :options="{
                        errorCorrectionLevel: 'Q',
                        color: { dark: '#000000', light: '#ffffff' },
                        margin: 0
                      }"
                    />
                  </div>
                </div>
                <div class="text-weight-bold f-10 text-decoration-underline">
                  {{ getNamaPengonsul(item) }}
                </div>
                <div class="text-caption text-grey-7 f-9">
                  {{ item?.nakesminta?.statusspesialis || (item?.nakesminta?.kdgroupnakes === '1' ? 'Dokter' : 'Petugas Ruangan') }}
                </div>
              </div>

              <!-- SEBELAH KANAN: DOKTER KONSULAN -->
              <div class="col-5 text-center">
                <div class="text-caption f-9">
                  Probolinggo, {{ isTerverifikasi(item) ? formatTanggalSaja(item?.tgl_jawaban || item?.updated_at) : '........................' }}
                </div>
                <div class="text-weight-bold text-caption f-9 q-mb-xs">Dokter Spesialis Konsulan,</div>
                <div class="column flex-center q-my-xs">
                  <!-- QR Code HANYA MUNCUL JIKA SUDAH DIVERIFIKASI OLEH DOKTER KONSULAN -->
                  <div v-if="isTerverifikasi(item)" style="width: 65px; height: 65px;">
                    <vue-qrcode
                      :value="getQrUrl(item, 'JAWABAN')"
                      tag="svg"
                      :options="{
                        errorCorrectionLevel: 'Q',
                        color: { dark: '#000000', light: '#ffffff' },
                        margin: 0
                      }"
                    />
                  </div>
                  <!-- JIKA BELUM DIVERIFIKASI -->
                  <div v-else style="height: 65px;" class="column flex-center text-caption f-9">
                    <span v-if="item?.jawaban" class="text-orange-9 text-weight-bold">( Belum Terverifikasi )</span>
                    <span v-else class="text-grey-5">( Menunggu Jawaban )</span>
                  </div>
                </div>
                <div class="text-weight-bold f-10 text-decoration-underline">
                  {{ getNamaDokterKonsul(item) }}
                </div>
                <div class="text-caption text-grey-7 f-9">
                  {{ item?.dokterkonsul?.statusspesialis || 'Spesialis' }}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  },
  menu: {
    type: Object,
    default: () => null
  },
  dataHeader: {
    type: Array,
    default: () => null
  }
})

const storeRanap = usePengunjungRanapStore()

const listKonsultasi = computed(() => {
  const arr = props?.pasien?.konsultasi || []
  return arr
})

const HARI_INDO = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN_INDO = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function formatWaktuLengkap(val) {
  if (!val) return '-'
  const cleanVal = typeof val === 'string' ? val.replace(/-/g, '/') : val
  const d = new Date(cleanVal)
  if (isNaN(d.getTime())) return val
  const hari = HARI_INDO[d.getDay()]
  const tgl = d.getDate()
  const bln = BULAN_INDO[d.getMonth()]
  const thn = d.getFullYear()
  const jam = String(d.getHours()).padStart(2, '0')
  const mnt = String(d.getMinutes()).padStart(2, '0')
  return `${hari}, ${tgl} ${bln} ${thn} pukul ${jam}:${mnt} WIB`
}

function formatTanggalSaja(val) {
  if (!val) return '-'
  const cleanVal = typeof val === 'string' ? val.replace(/-/g, '/') : val
  const d = new Date(cleanVal)
  if (isNaN(d.getTime())) return val
  const tgl = d.getDate()
  const bln = BULAN_INDO[d.getMonth()]
  const thn = d.getFullYear()
  return `${tgl} ${bln} ${thn}`
}

function getNamaDokterKonsul(item) {
  if (item?.dokterkonsul?.nama) return item.dokterkonsul.nama
  const dok = storeRanap.nakes?.find(x => x.kdpegsimrs === item?.kddokterkonsul)
  return dok?.nama || item?.kddokterkonsul || '-'
}

function getNamaPengonsul(item) {
  if (item?.nakesminta?.nama) return item.nakesminta.nama
  if (item?.userinput?.nama) return item.userinput.nama
  const peng = storeRanap.nakes?.find(x => x.kdpegsimrs === item?.kdminta || x.kdpegsimrs === item?.user)
  return peng?.nama || props?.pasien?.dokter || '-'
}

function isTerverifikasi(item) {
  return item?.user_jawab && item?.user_jawab === item?.kddokterkonsul
}

function formatNewLine(text) {
  if (!text) return ''
  return text.replace(/\n/g, '<br/>')
}

function getQrUrl(item, tipe) {
  const noreg = props?.pasien?.noreg || 'NOREG'
  const dok = `KONSUL-${tipe}-${item?.id || '0'}.png`
  const asal = 'RANAP'
  const petugas = tipe === 'JAWABAN' ? (item?.kddokterkonsul || 'DOKTER') : (item?.kdminta || 'PEMOHON')
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
</script>

<style lang="scss" scoped>
.print-page {
  background-color: #ffffff;
  padding: 10px !important;
  font-size: 10.5px;
  line-height: 1.35;
  font-family: Arial, Helvetica, sans-serif;
}

.lembar-konsul {
  margin-bottom: 20px;
}

.table-identitas, .table-form {
  border-collapse: collapse;
  width: 100%;
  font-size: 10.5px;
}

.table-identitas td {
  border: 1px solid #000;
  padding: 2px 5px;
  vertical-align: middle;
}

.table-form td {
  border: none;
  padding: 2px 0;
  vertical-align: top;
}

.section-box {
  border: 1px solid #000;
  border-radius: 4px;
  overflow: hidden;
}

.section-header {
  border-bottom: 1px solid #000;
}

.isi-teks {
  border: 1px solid #ccc;
  min-height: 36px;
  font-size: 10.5px;
  white-space: pre-wrap;
  word-break: break-word;
}

.border-dashed {
  border: 1px dashed #ffa726;
}

.text-decoration-underline {
  text-decoration: underline;
}

.f-9 {
  font-size: 9px;
}
.f-10 {
  font-size: 10px;
}

@media print {
  .print-page {
    padding: 0 !important;
    font-size: 10px;
  }

  .lembar-konsul {
    margin-bottom: 0 !important;
    page-break-after: always;
    break-after: page;
  }

  .lembar-konsul:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  @page {
    size: letter portrait;
    margin: 6mm 8mm;
  }
}
</style>
