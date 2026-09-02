<template>
  <div v-if="!props.pasien?.laporaneswl?.length" class="column full-height flex-center bg-white">
    <q-icon name="icon-mat-assignment" size="50px" color="grey-5" />
    <div class="text-grey-6 text-bold q-mt-sm">Belum Ada Data Laporan ESWL Tersimpan</div>
  </div>

  <div v-else class="fit bg-grey-4 q-pa-md scroll">
    <!-- Toolbar (Sembunyikan saat dicetak) -->
    <div class="row justify-between items-center bg-teal text-white q-pa-sm q-mb-md rounded-borders shadow-1 no-print"
      style="max-width: 210mm; margin: 0 auto; width: 100%;">
      <div class="text-weight-bold text-subtitle2 q-pl-xs">Dokumen Laporan Tindakan ESWL</div>

      <div class="row q-gutter-x-sm items-center no-wrap">
        <span class="text-caption text-weight-bold q-mr-xs">Pilih Sesi:</span>
        <q-select v-model="selectedReportId" :options="reportOptions" option-value="value" option-label="label"
          emit-value map-options dense outlined dark color="white" bg-color="teal-8" style="min-width: 200px;" />

        <q-btn icon="icon-mat-print" flat dense size="md" v-print="printObj">
          <q-tooltip class="primary" :offset="[10, 10]">Cetak Laporan</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Area Dokumen Cetak (Rata Tengah / Centered) -->
    <div v-if="selectedReport" id="printMe"
      class="bg-white print-area q-pa-lg shadow-3 text-black text-body2 font-body font-print border-print"
      style="width: 210mm; min-height: 297mm; box-sizing: border-box; margin: 0 auto;">

      <!-- Kop Surat Standar Pemkot -->
      <my-kop-surat title1="LAPORAN TINDAKAN" title2="ESWL" />

      <!-- Biodata Pasien -->
      <div class="biodata-pasien q-my-md">
        <div class="flex justify-between">
          <div class="flex q-gutter-md kiri">
            <div style="width: 78px;" class="text-weight-bold">NO. RM</div>
            <div style="width: 100px;">: {{ pasien.norm || '-' }}</div>
            <div class="text-weight-bold">NAMA PASIEN</div>
            <div>: {{ pasien.nama || '-' }}</div>
          </div>
          <div class="flex q-gutter-md kanan">
            <div class="text-weight-bold">TGL. LAHIR</div>
            <div>: {{ pasien.tgllahir || '-' }}</div>
          </div>
        </div>
        <div class="flex">
          <div class="column full-width">
            <div>
              <span class="q-mr-lg text-weight-bold" style="margin-right: 28px;">ALAMAT</span> : {{ pasien.alamat ?? '-'
              }}
            </div>
            <div class="flex justify-between full-width">
              <div class="flex">
                <div style="width:92px;" class="text-weight-bold">J. Kelamin</div>
                <div>: {{ pasien.kelamin || '-' }}</div>
              </div>
              <div class="text-right">
                <span class="text-weight-bold text-teal-9">Sesi Tindakan : </span> <strong>Sesi ke-{{
                  selectedReport.sesi || '-' }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator color="black" class="q-my-sm" />

      <!-- I. INFORMASI UMUM -->
      <div class="text-weight-bold text-subtitle2 text-uppercase q-mb-xs">I. INFORMASI UMUM & KEADAAN PASIEN</div>
      <table class="table-print q-mb-md">
        <tbody>
          <tr>
            <td width="20%" class="text-weight-bold bg-grey-2">Tanggal Tindakan</td>
            <td width="30%">{{ selectedReport.tanggal ? date.formatDate(selectedReport.tanggal, 'DD MMMM YYYY') : '-' }}
            </td>
            <td width="20%" class="text-weight-bold bg-grey-2">No. Pasien ESWL</td>
            <td width="30%">{{ selectedReport.no_eswl || '-' }}</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Operator (DPJP)</td>
            <td>{{ getNamaDokter(selectedReport.kddokter) }}</td>
            <td class="text-weight-bold bg-grey-2">Asisten Dokter</td>
            <td>{{ getNamaAsisten(selectedReport.asisten) }}</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">BB / TB</td>
            <td>{{ vitalFisik?.beratbadan || selectedReport.berat_badan || '-' }} kg &nbsp;/&nbsp; {{ vitalFisik?.tinggibadan || selectedReport.tinggi_badan || '-' }} cm</td>
            <td class="text-weight-bold bg-grey-2">Tekanan Darah</td>
            <td>{{ vitalFisik?.sistole || selectedReport.td_sistol || '-' }}/{{ vitalFisik?.diastole || selectedReport.td_diastol || '-' }} mmHg</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Nadi</td>
            <td>{{ vitalFisik?.rs4 || vitalFisik?.denyutjantung || selectedReport.nadi || '-' }} x/menit</td>
            <td class="text-weight-bold bg-grey-2">RR / Suhu Tubuh</td>
            <td>RR: {{ vitalFisik?.pernapasan || '-' }} x/m &nbsp;|&nbsp; Suhu: {{ vitalFisik?.suhutubuh || '-' }} &deg;C</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Diagnosa</td>
            <td colspan="3" class="line-height-tight" style="white-space: pre-wrap;">{{ pasien?.memodiagnosa || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- II. SPESIFIKASI BATU & LOKALISASI -->
      <div class="text-weight-bold text-subtitle2 text-uppercase q-mb-xs">II. SPESIFIKASI BATU & LOKALISASI</div>
      <div class="row q-col-gutter-x-md q-mb-md">
        <div class="col-7">
          <table class="table-print">
            <tbody>
              <tr>
                <td width="40%" class="text-weight-bold bg-grey-2">Tipe Lokalisasi</td>
                <td colspan="2">{{ selectedReport.lokalisasi_type || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold bg-grey-2">Lama Lokalisasi</td>
                <td colspan="2">{{ selectedReport.lokalisasi_lama || '-' }} menit</td>
              </tr>
              <tr>
                <td class="text-weight-bold bg-grey-2">Kualitas Gambar</td>
                <td colspan="2">{{ selectedReport.lokalisasi_gambar || '-' }}</td>
              </tr>
              <tr v-if="selectedReport.lokalisasi_type === 'X-Ray' || selectedReport.lokalisasi_type === 'Keduanya'">
                <td class="text-weight-bold bg-grey-2">Detail X-Ray</td>
                <td colspan="2">
                  KV: {{ selectedReport.lokalisasi_xray?.kv || '-' }} | mA: {{ selectedReport.lokalisasi_xray?.ma || '-'
                  }} <br />
                  Fluroscopy: {{ selectedReport.lokalisasi_xray?.fluroscopy || '-' }} menit
                </td>
              </tr>
              <tr
                v-if="selectedReport.lokalisasi_type === 'Ultrasound' || selectedReport.lokalisasi_type === 'Keduanya'">
                <td class="text-weight-bold bg-grey-2">Detail U/S (USG)</td>
                <td colspan="2">
                  Probe-Fokus: {{ selectedReport.lokalisasi_usg?.probe_fokus || '-' }} mm <br />
                  Probe-Batu: {{ selectedReport.lokalisasi_usg?.probe_batu || '-' }} mm <br />
                  Perputaran: {{ selectedReport.lokalisasi_usg?.perputaran || '-' }}
                </td>
              </tr>
              <tr class="text-weight-bold bg-grey-2">
                <td width="40%">Target Batu</td>
                <td width="30%">Posisi</td>
                <td width="30%">Ukuran (mm)</td>
              </tr>
              <tr v-for="(batu, idx) in selectedReport.batu_detail" :key="idx">
                <td>Batu {{ idx + 1 }}</td>
                <td>{{ batu.posisi || '-' }}</td>
                <td>{{ batu.ukuran_x || '-' }} x {{ batu.ukuran_y || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-5 flex flex-center">
          <!-- Diagram Coretan/Canvas -->
          <div v-if="selectedReport.alternatif" class="relative-position bg-white shadow-1 border-print"
            style="width: 100%; max-width: 220px; aspect-ratio: 1024 / 601; overflow: hidden;">
            <!-- Background Image (Urinary tract diagram) -->
            <img :src="bodyMarkerImg" style="display: block; width: 100%; height: auto; pointer-events: none;" />
            <!-- Canvas Drawing Overlay -->
            <img :src="selectedReport.alternatif"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;" />
          </div>
          <div v-else class="text-grey-5 text-italic text-caption border-print q-pa-md text-center"
            style="width: 220px; height: 130px; display: flex; align-items: center; justify-content: center;">
            Tidak ada diagram penandaan lokasi batu
          </div>
        </div>
      </div>

      <!-- III. PARAMETER PENEMBAKAN & MONITOR -->
      <div class="text-weight-bold text-subtitle2 text-uppercase q-mb-xs">III. PARAMETER PENEMBAKAN & MONITOR</div>
      <table class="table-print q-mb-md">
        <tbody>
          <tr>
            <td width="20%" class="text-weight-bold bg-grey-2">Waktu Tindakan</td>
            <td width="30%">{{ selectedReport.waktu_mulai || '-' }} s/d {{ selectedReport.waktu_selesai || '-' }}</td>
            <td width="20%" class="text-weight-bold bg-grey-2">Posisi Pasien</td>
            <td width="30%">{{ selectedReport.posisi || '-' }}</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Sinkronisasi</td>
            <td>{{ selectedReport.sinkronisasi || '-' }}</td>
            <td class="text-weight-bold bg-grey-2">Elektrode S/N</td>
            <td>{{ selectedReport.elektrode_sn || '-' }}</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Tingkat Kesakitan</td>
            <td>
              Skor Nyeri : <b>{{ parsedTingkatKesakitan.skor }}</b>
              <em v-if="parsedTingkatKesakitan.ket" class="text-primary q-ml-sm">({{ parsedTingkatKesakitan.ket }})</em>
            </td>
            <td class="text-weight-bold bg-grey-2">Monitor USG / Rontgen</td>
            <td>USG: {{ selectedReport.monitor_usg || '-' }} | Rontgen: {{ selectedReport.monitor_rontgen || '-' }}</td>
          </tr>
          <tr class="text-weight-bold bg-grey-2 text-center">
            <td>Batu Target</td>
            <td>Jumlah Tembakan</td>
            <td>Power (kV)</td>
            <td>Energi (Hz)</td>
          </tr>
          <tr v-for="(sh, idx) in selectedReport.penembakan_detail" :key="idx" class="text-center">
            <td class="text-weight-bold bg-grey-2">Batu {{ idx + 1 }}</td>
            <td>{{ sh.tembakan || '-' }}</td>
            <td>{{ sh.power || '-' }}</td>
            <td>{{ sh.energi || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- IV. PENGGUNAAN OBAT & EVALUASI AKHIR -->
      <div class="text-weight-bold text-subtitle2 text-uppercase q-mb-xs">IV. PENGGUNAAN OBAT & EVALUASI AKHIR</div>
      <table class="table-print q-mb-md">
        <tbody>
          <tr>
            <td width="20%" class="text-weight-bold bg-grey-2">Obat Pre-Tindakan</td>
            <td width="80%" style="white-space: pre-wrap;">{{ selectedReport.obat_pre || '-' }}</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Obat Durante-Tindakan</td>
            <td style="white-space: pre-wrap;">{{ selectedReport.obat_durante || '-' }}</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Obat Post-Tindakan</td>
            <td style="white-space: pre-wrap;">{{ selectedReport.obat_post || '-' }}</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Tingkat Kepecahan Batu</td>
            <td><strong>{{ selectedReport.kepecahan_batu || '-' }}</strong></td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Lama Penembakan Bersih</td>
            <td>{{ selectedReport.lama_penembakan || '-' }} menit</td>
          </tr>
          <tr>
            <td class="text-weight-bold bg-grey-2">Keterangan / Evaluasi Medis</td>
            <td style="white-space: pre-wrap;" class="line-height-tight">{{ selectedReport.keterangan || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tanda Tangan -->
      <div class="row q-mt-lg justify-end" style="page-break-inside: avoid;">
        <div class="col-4 text-center">
          <div class="text-caption text-weight-bold">Dokter Operator (DPJP)</div>
          <div style="height: 90px; width: 90px; margin: 0 auto;" class="flex flex-center q-my-sm">
            <vue-qrcode v-if="selectedReport.kddokter" :value="qrUrl(selectedReport.kddokter)" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: { dark: '#000000', light: '#ffffff' },
              margin: 0
            }" />
            <div v-else class="text-grey-6 text-italic">Belum Ditandatangani</div>
          </div>
          <div class="text-weight-bold border-bottom-print q-pb-xs">
            {{ getNamaDokter(selectedReport.kddokter) }}
          </div>
          <div class="text-caption text-grey-7">NIP: {{ getNipDokter(selectedReport.kddokter) }}</div>
        </div>
        <div class="col-2"></div>
        <div class="col-4 text-center">
          <div class="text-caption text-weight-bold">Asisten Dokter</div>
          <div style="height: 90px; width: 90px; margin: 0 auto;" class="flex flex-center q-my-sm">
            <vue-qrcode v-if="selectedReport.asisten" :value="qrUrl(selectedReport.asisten)" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: { dark: '#000000', light: '#ffffff' },
              margin: 0
            }" />
            <div v-else class="text-grey-6 text-italic">Belum Ditandatangani</div>
          </div>
          <div class="text-weight-bold border-bottom-print q-pb-xs">
            {{ getNamaAsisten(selectedReport.asisten) }}
          </div>
          <div class="text-caption text-grey-7">NIP: {{ getNipAsisten(selectedReport.asisten) }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { date } from 'quasar'
import { useLaporanEswlPoliStore } from 'src/stores/simrs/pelayanan/poli/laporanEswl'
import bodyMarkerImg from 'src/assets/human/anatomys/body-marker-eswl.webp'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useLaporanEswlPoliStore()
const selectedReportId = ref(null)

const reportOptions = computed(() => {
  return props.pasien?.laporaneswl?.map(x => {
    const tgl = x.tanggal ? date.formatDate(x.tanggal, 'DD MMMM YYYY') : '-'
    return {
      label: `Sesi ${x.sesi || '-'} (${tgl})`,
      value: x.id
    }
  }) || []
})

const selectedReport = computed(() => {
  return props.pasien?.laporaneswl?.find(x => x.id === selectedReportId.value) || null
})

const vitalFisik = computed(() => {
  const list = props.pasien?.pemeriksaanfisik
  if (Array.isArray(list) && list.length > 0) {
    return list[list.length - 1] || list[0]
  }
  return list || {}
})

const parsedTingkatKesakitan = computed(() => {
  const val = selectedReport.value?.tingkat_kesakitan
  if (!val) return { skor: '-', ket: '' }

  // Format is "3 (nyeri ringan)"
  const match = val.match(/^(\d+)\s*\((.+)\)$/)
  if (match) {
    return {
      skor: match[1],
      ket: match[2]
    }
  }

  // Fallback for old/legacy values (e.g. "Tidak sakit", "Sedikit sakit")
  let tempSkor = val
  let tempKet = ''
  if (val.includes('Tidak sakit')) {
    tempSkor = '0'
    tempKet = 'tidak ada nyeri'
  } else if (val.includes('Sedikit sakit')) {
    tempSkor = '3'
    tempKet = 'nyeri ringan'
  } else if (val.includes('Cukup sakit')) {
    tempSkor = '5'
    tempKet = 'nyeri sedang'
  } else if (val.includes('Sakit sekali')) {
    tempSkor = '8'
    tempKet = 'nyeri berat'
  }

  return {
    skor: tempSkor,
    ket: tempKet
  }
})

onMounted(() => {
  store.getListDokter()
  store.getListPerawat()

  if (props.pasien?.laporaneswl?.length) {
    selectedReportId.value = props.pasien.laporaneswl[0].id
  }
})

watch(() => props.pasien?.laporaneswl, (newVal) => {
  if (newVal?.length && !selectedReportId.value) {
    selectedReportId.value = newVal[0].id
  }
}, { immediate: true })

function getNamaDokter (kddokter) {
  const found = store.listdokters.find(x => x.kode === kddokter)
  return found ? found.nama : kddokter
}

function getNamaAsisten (asisten) {
  const found = store.listperawats.find(x => x.kode === asisten)
  return found ? found.nama : asisten
}

function getNipDokter (kddokter) {
  const found = store.listdokters.find(x => x.kode === kddokter)
  return found ? (found.nip || found.nik || '-') : '-'
}

function getNipAsisten (asisten) {
  const found = store.listperawats.find(x => x.kode === asisten)
  return found ? (found.nip || found.nik || '-') : '-'
}

const qrUrl = (kdpeg) => {
  if (!kdpeg) return ''
  const noreg = props.pasien?.noreg || ''
  const dok = 'LAPORAN TINDAKAN ESWL.png'
  const asal = 'RAWAT JALAN'
  const petugas = kdpeg
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}

const printObj = {
  id: 'printMe',
  popTitle: ' '
}
</script>

<style scoped>
.page-legal {
  font-family: 'Arial', sans-serif;
  font-size: 11px;
  line-height: 1.18;
}

.border-print {
  border: 1px solid #000;
}

.border-bottom-double {
  border-bottom: 3px double #000;
}

.border-bottom-print {
  border-bottom: 1px solid #000;
}

.table-print {
  border-collapse: collapse;
  width: 100%;
}

.table-print th,
.table-print td {
  border: 1px solid #000;
  padding: 3px 5px;
  line-height: 1.18;
}

.biodata-pasien td {
  border: none !important;
}
</style>

<style>
@media print {

  body,
  html {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  .q-header,
  .q-footer,
  .q-drawer,
  .q-drawer-container,
  .q-page-container>header,
  .q-page-container>div:not(.print-area),
  .q-menu,
  .q-backdrop,
  .q-notifications,
  .no-print {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    width: 0 !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  .q-dialog,
  .q-dialog__inner {
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  .print-area {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 210mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
    visibility: visible !important;
    z-index: 99999 !important;
  }

  .print-area * {
    visibility: visible !important;
  }

  @page {
    size: A4 portrait;
    margin: 4mm;
  }
}
</style>
