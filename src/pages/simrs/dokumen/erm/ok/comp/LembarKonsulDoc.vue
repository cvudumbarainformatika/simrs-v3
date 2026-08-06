<template>
  <div class="fit bg-grey-4 q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white shadow-2">
      <div class="contentx">
        <!-- KOP SURAT INTERNAL -->
        <app-kop-surat-Internal v-if="!history" title1="LEMBAR" title2="KONSULTASI" />

        <!-- BIODATA PASIEN -->
        <div v-if="!history" class="biodata-pasien q-my-md">
          <div class="flex justify-between">
            <div class="flex q-gutter-md kiri">
              <div style="width: 58px;" class="text-weight-bold">
                NO. RM
              </div>
              <div style="width: 70px;">
                : {{ pasien?.norm }}
              </div>
              <div class="text-weight-bold">
                NAMA PASIEN
              </div>
              <div>
                : {{ pasien?.nama_panggil || pasien?.nama }}
              </div>
            </div>
            <div class="flex q-gutter-md kanan">
              <div class="text-weight-bold">
                TGL. LAHIR
              </div>
              <div>
                : {{ dateFullFormat(pasien?.tgllahir) }}
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
        <div class="dokumen-content q-mb-md">
          <div v-if="!konsultasis || konsultasis.length === 0" class="text-center q-pa-xl text-grey border-box">
            Belum ada data permintaan konsul spesialis untuk pasien ini.
          </div>

          <div v-else>
            <div v-for="(item, index) in konsultasis" :key="item.id" class="q-mb-xl p-box"
              style="page-break-inside: avoid;">
              <!-- Sub Header for Konsul Index -->
              <div class="text-weight-bold f-13 bg-grey-3 q-pa-sm text-primary border-top-bottom">
                KONSULTASI #{{ index + 1 }}
              </div>

              <!-- Permintaan Konsul Table -->
              <table class="doc-table q-mt-sm">
                <thead>
                  <th colspan="2" class="bg-grey-2 text-weight-bold">I. PERMINTAAN KONSUL (PENGANTAR)</th>
                </thead>
                <tbody>
                  <tr>
                    <td width="30%" class="text-weight-bold">Kepada Yth. Dokter</td>
                    <td>: <strong>{{ item?.dokterkonsul?.nama || namaPetugas(item?.kddokterkonsul) }}</strong></td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold">Konsultasi Untuk</td>
                    <td>: {{ item?.ketuntuk || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold">Isi Permintaan Konsul / Masalah Klinik</td>
                    <td>
                      <div class="q-py-xs" style="white-space: pre-line;">
                        {{ item?.permintaan ?? '-' }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold">Tanggal Permintaan</td>
                    <td>: {{ dateFullFormat(item?.created_at) }} Jam {{ jamTnpDetik(item?.created_at) }}</td>
                  </tr>
                  <tr>
                    <td class="text-weight-bold">Peminta Konsul</td>
                    <td>: {{ item?.nakesminta?.nama ?? '-' }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Jawaban Konsul Table -->
              <table class="doc-table q-mt-sm">
                <thead>
                  <th colspan="2" class="bg-grey-2 text-weight-bold">II. JAWABAN KONSUL</th>
                </thead>
                <tbody>
                  <template v-if="item?.jawaban">
                    <tr>
                      <td width="30%" class="text-weight-bold">Isi Jawaban & Saran Dokter</td>
                      <td>
                        <div class="q-py-xs" style="white-space: pre-line;">
                          {{ item?.jawaban }}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-weight-bold">Tanggal Jawaban</td>
                      <td>: {{ dateFullFormat(item?.tgl_jawaban) }} Jam {{ jamTnpDetik(item?.tgl_jawaban) }}</td>
                    </tr>
                    <tr>
                      <td class="text-weight-bold">Dokter Konsulan</td>
                      <td>: {{ item?.dokterkonsul?.nama || namaPetugas(item?.kddokterkonsul) }}</td>
                    </tr>
                    <tr>
                      <td class="text-weight-bold">Status Verifikasi</td>
                      <td>
                        <q-badge :color="item?.user_jawab === item?.kddokterkonsul ? 'primary' : 'orange-9'"
                          text-color="white" class="q-px-sm">
                          {{ item?.user_jawab === item?.kddokterkonsul ? 'Terverifikasi Dokter Konsul' : 'Belum Terverif
                          Dokter Konsul' }}
                        </q-badge>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="2" class="text-center text-grey text-italic q-pa-md bg-grey-1">
                        Belum ada jawaban dari dokter konsulan
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>

              <!-- Signature Section for Request and Answer -->
              <div class="row q-mt-md justify-between" style="border-top: 1px dashed #ccc; padding-top: 10px;">
                <div class="col-5 text-center">
                  <div class="text-weight-bold q-mb-xs f-10">
                    {{ item?.nakesminta?.kdgroupnakes === '1' ? 'Dokter Peminta Konsul' : 'Nakes Peminta Konsul' }}
                  </div>
                  <div v-if="qrUrl(item, 'permintaan')" style="height: 75px; width: 75px; margin: 0 auto;"
                    class="q-mb-xs">
                    <vue-qrcode :value="qrUrl(item, 'permintaan')" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: { dark: '#000000', light: '#ffffff' },
                      margin: 0
                    }" />
                  </div>
                  <div style="text-decoration: underline;" class="text-weight-bold f-11">
                    {{ item?.nakesminta?.nama ?? '..........................................' }}
                  </div>
                  <div class="f-9">{{ formatNipOrId(item?.nakesminta?.kdpegsimrs || item?.kdminta, false) }}</div>
                </div>

                <div class="col-5 text-center" v-if="item?.jawaban">
                  <div class="text-weight-bold q-mb-xs f-10">Dokter Konsulan</div>
                  <div v-if="qrUrl(item, 'jawaban')" style="height: 75px; width: 75px; margin: 0 auto;" class="q-mb-xs">
                    <vue-qrcode :value="qrUrl(item, 'jawaban')" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: { dark: '#000000', light: '#ffffff' },
                      margin: 0
                    }" />
                  </div>
                  <div style="text-decoration: underline;" class="text-weight-bold f-11">
                    {{ item?.dokterkonsul?.nama || namaPetugas(item?.kddokterkonsul) }}
                  </div>
                  <div class="f-9">{{ formatNipOrId(item?.dokterkonsul?.kdpegsimrs || item?.kddokterkonsul, true) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RM code placeholder at bottom -->
        <div class="q-mt-lg text-right text-italic f-10 text-grey">
          RM OK - KONSUL
        </div>
      </div>
    </div>

    <!-- Print Button -->
    <q-btn v-if="!history && konsultasis && konsultasis.length > 0" ref="refPrint" v-print="printObj" fab
      icon="icon-mat-print" color="primary" class="fixed-bottom-right" style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { useKonsulKamarOperasiStore } from 'src/stores/simrs/kamaroperasi/konsul'
import { onMounted, ref, computed } from 'vue'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  history: {
    type: Boolean,
    default: false
  }
})

const store = useKonsulKamarOperasiStore()
const refPrint = ref()

const konsultasis = computed(() => {
  return props.pasien?.konsultasi ?? []
})

function namaPetugas (code) {
  if (!code) return '-'
  return store.dokters?.find(x => x.kdpegsimrs === code)?.nama ?? code
}

function formatNipOrId (kdpeg, isDokter) {
  if (!kdpeg) return ''
  let target = isDokter
    ? store.dokters?.find(x => x.kdpegsimrs === kdpeg)
    : store.perawats?.find(x => x.kdpegsimrs === kdpeg)

  if (!target) {
    target = isDokter
      ? store.perawats?.find(x => x.kdpegsimrs === kdpeg)
      : store.dokters?.find(x => x.kdpegsimrs === kdpeg)
  }

  if (!target) return ''
  const nip = target?.nip
  if (!nip || nip === '-' || nip === 'undefined') return ''

  const cleanNip = nip.replace(/[\s.-]/g, '')
  if (/^\d{18}$/.test(cleanNip) || /^\d{9,}$/.test(cleanNip)) {
    return `NIP. ${nip}`
  }
  return nip
}

function qrUrl (item, type) {
  const noreg = props?.pasien?.noreg
  const dok = type === 'jawaban' ? 'JAWABAN KONSUL OK.png' : 'PERMINTAAN KONSUL OK.png'
  const asal = 'PENUNJANG'
  const petugas = type === 'jawaban'
    ? (item?.dokterkonsul?.kdpegsimrs || item?.kddokterkonsul)
    : (item?.nakesminta?.kdpegsimrs || item?.kdminta || props.pasien?.kodedokter)
  if (!petugas) return ''
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}

const printObj = {
  id: 'pdfDoc',
  popTitle: 'Lembar Konsul Spesialis',
  extraCss: '',
  extraHead: '<meta http-equiv="Content-Language" content="id">'
}

onMounted(() => {
  store.initReset()
})
</script>

<style lang="scss" scoped>
.page-legal {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 21.59cm;
  min-height: 29.7cm;
  font-family: 'Times New Roman', Times, serif;

  .contentx {
    padding: 10mm;
  }
}

.biodata-pasien {
  border: 1px solid #000;
  padding: 8px;
  margin-bottom: 20px;
  font-size: 11px;
}

.f-9 {
  font-size: 9px;
}

.f-10 {
  font-size: 10px;
}

.f-11 {
  font-size: 11px;
}

.f-12 {
  font-size: 12px;
}

.f-13 {
  font-size: 13px;
}

.text-weight-bold {
  font-weight: bold;
}

.border-box {
  border: 1px solid #000;
  padding: 15px;
}

.p-box {
  border: 1px solid #000;
  padding: 10px;
  border-radius: 4px;
}

.border-top-bottom {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}

.doc-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 11px;

  th,
  td {
    border: 1px solid #000;
    padding: 5px 8px;
    vertical-align: top;
  }

  th {
    text-align: left;
    font-size: 11px;
  }
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;
    box-shadow: none;

    .contentx {
      padding: 5mm;
    }
  }

  .fixed-bottom-right {
    display: none !important;
  }

  @page {
    margin: 10mm;
  }
}
</style>
