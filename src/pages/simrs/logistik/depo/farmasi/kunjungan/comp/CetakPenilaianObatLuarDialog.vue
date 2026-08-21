<script setup>
import { computed } from 'vue'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'
import { dateFullFormat } from 'src/modules/formatter'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  pasien: { type: Object, default: null },
  form: { type: Object, default: null },
  apotekers: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const dataHeader = [
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
  'UOBK RSUD DOKTER MOHAMAD SALEH',
  'Jl. Mayjend Panjaitan No.65 Telp: (0335)433119 Fax.(0335)432702',
  'email: rsudprob@probolinggokota.go.id',
  'PROBOLINGGO – 67219'
]

const printObj = {
  id: 'print-penilaian-doc',
  popTitle: 'Form Penilaian Obat Dari Luar Rumah Sakit'
}

const getNamaCheck1 = computed(() => {
  const val = props.form?.detail?.check_1
  if (!val) return ''
  const found = props.apotekers?.find(st => st.kdpegsimrs === val)
  return found ? found.nama : val
})

const getNamaDoubleCheck2 = computed(() => {
  const val = props.form?.detail?.double_check_2
  if (!val) return ''
  const found = props.apotekers?.find(st => st.kdpegsimrs === val)
  return found ? found.nama : val
})

const getNip = (kdpeg) => {
  if (!kdpeg) return ''
  const found = props.apotekers?.find(st => st.kdpegsimrs === kdpeg)
  return found ? (found.nip || found.nik || '') : ''
}

const qrUrl = (kdpeg) => {
  if (!kdpeg) return ''
  const noreg = props.pasien?.noreg || ''
  const dok = 'FORM PENILAIAN OBAT LUAR.png'
  const asal = 'RAWAT JALAN'
  const enc = btoa(`${noreg}|${dok}|${asal}|${kdpeg}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    maximized
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-grey-3 fit column">
      <!-- Toolbar Header -->
      <q-card-section class="bg-teal text-white row items-center justify-between q-py-xs no-print shadow-2">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="print" size="22px" />
          <span class="text-subtitle1 text-weight-bold">Pratinjau Cetak: Penilaian Obat Luar</span>
        </div>
        <div class="row items-center q-gutter-x-sm">
          <q-btn
            v-print="printObj"
            color="amber-9"
            text-color="dark"
            icon="print"
            label="Cetak Dokumen"
            no-caps
            class="text-weight-bold shadow-1"
          />
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </div>
      </q-card-section>

      <!-- Printable Area Container -->
      <q-card-section class="col scroll q-pa-md flex justify-center">
        <div id="print-penilaian-doc" class="bg-white print-area q-pa-lg shadow-3 text-black font-print border-print" style="width: 210mm; min-height: 297mm; box-sizing: border-box;">
          
          <div class="page-container">
            <!-- Kop Surat Standard RS -->
            <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['PENILAIAN OBAT', 'DARI LUAR RUMAH SAKIT']" />

            <!-- Identitas Pasien -->
            <table class="table-print full-width q-my-sm">
              <tbody>
                <tr>
                  <td width="20%" class="bg-grey-2 text-weight-bold">Nama Pasien</td>
                  <td width="30%">: <strong>{{ pasien?.nama || '-' }}</strong></td>
                  <td width="20%" class="bg-grey-2 text-weight-bold">No. Rekam Medis</td>
                  <td width="30%">: <strong>{{ pasien?.norm || '-' }}</strong></td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Tanggal Masuk</td>
                  <td>: {{ pasien?.tgl_masuk ? dateFullFormat(pasien.tgl_masuk) : '-' }}</td>
                  <td class="bg-grey-2 text-weight-bold">Ruang / Unit</td>
                  <td>: {{ pasien?.ruangan || pasien?.poli || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Dokter Penanggung Jawab</td>
                  <td colspan="3">: {{ pasien?.dokter || '-' }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Penilaian Obat Table -->
            <div class="text-subtitle2 text-weight-bold q-mt-md q-mb-xs">Penilaian Obat</div>
            <table class="table-print full-width font-mini q-mb-md">
              <thead>
                <tr class="bg-grey-3">
                  <th style="width: 5%;" class="text-center">No</th>
                  <th style="width: 25%;" class="text-left">Nama Obat</th>
                  <th style="width: 15%;" class="text-left">Sediaan</th>
                  <th style="width: 11%;" class="text-center">Kondisi Fisik</th>
                  <th style="width: 11%;" class="text-center">Identifikasi Jelas</th>
                  <th style="width: 11%;" class="text-center">Keaslian Terverifikasi</th>
                  <th style="width: 11%;" class="text-center">Mutu Obat</th>
                  <th style="width: 11%;" class="text-center">Keputusan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obat, index) in form?.detail?.evaluasi_obat" :key="index">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td class="text-wrap text-weight-bold">{{ obat.nama_obat || '-' }}</td>
                  <td>{{ obat.sediaan || '-' }}</td>
                  <td class="text-center">{{ obat.kondisi_fisik || '-' }}</td>
                  <td class="text-center">{{ obat.identifikasi || '-' }}</td>
                  <td class="text-center">{{ obat.keaslian || '-' }}</td>
                  <td class="text-center">{{ obat.mutu || '-' }}</td>
                  <td class="text-center text-weight-bold" :class="obat.keputusan === 'Layak' ? 'text-teal' : 'text-red'">
                    {{ obat.keputusan || '-' }}
                  </td>
                </tr>
                <tr v-if="!form?.detail?.evaluasi_obat?.length">
                  <td colspan="8" class="text-center text-grey-5 q-py-md">Tidak ada data obat yang dinilai</td>
                </tr>
              </tbody>
            </table>

            <!-- Lembar Resep Box -->
            <div class="border-print q-pa-sm q-mb-md" style="min-height: 250px;">
              <div class="text-subtitle2 text-weight-bold border-bottom-print q-pb-xs q-mb-sm">LEMBAR RESEP</div>
              <div class="flex flex-center" style="min-height: 200px;">
                <img v-if="form?.lembar_resep" :src="form.lembar_resep" style="max-height: 220px; max-width: 100%; object-fit: contain;" />
                <div v-else class="text-grey-4 text-italic">Tidak ada unggahan gambar lembar resep</div>
              </div>
            </div>

            <!-- Tanggal Penilaian & Tanda Tangan -->
            <div class="row justify-between items-end q-mt-lg" style="page-break-inside: avoid;">
              <div class="col-4 text-center">
                <div class="text-caption text-weight-bold">Check 1</div>
                <div style="height: 80px;" class="flex flex-center q-my-xs">
                  <div v-if="form?.detail?.check_1" class="q-pa-xs border">
                    <vue-qrcode :value="qrUrl(form.detail.check_1)" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0, width: 70, height: 70 }" />
                  </div>
                  <span v-else class="text-grey-5 text-italic">Belum Verifikasi</span>
                </div>
                <div class="text-weight-bold"><u>( {{ getNamaCheck1 || '..................................' }} )</u></div>
                <div class="text-caption text-grey-7" style="font-size: 9px;">NIP: {{ getNip(form?.detail?.check_1) || '-' }}</div>
              </div>

              <div class="col-4 text-center">
                <div>Tanggal Penilaian: <strong>{{ form?.tanggal ? dateFullFormat(form.tanggal) : '-' }}</strong></div>
              </div>

              <div class="col-4 text-center">
                <div class="text-caption text-weight-bold">Double Check 2</div>
                <div style="height: 80px;" class="flex flex-center q-my-xs">
                  <div v-if="form?.detail?.double_check_2" class="q-pa-xs border">
                    <vue-qrcode :value="qrUrl(form.detail.double_check_2)" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0, width: 70, height: 70 }" />
                  </div>
                  <span v-else class="text-grey-5 text-italic">Belum Verifikasi</span>
                </div>
                <div class="text-weight-bold"><u>( {{ getNamaDoubleCheck2 || '..................................' }} )</u></div>
                <div class="text-caption text-grey-7" style="font-size: 9px;">NIP: {{ getNip(form?.detail?.double_check_2) || '-' }}</div>
              </div>
            </div>

          </div>

        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.font-print {
  font-family: 'Arial', sans-serif;
  font-size: 11px;
}
.font-mini {
  font-size: 9.5px;
}
.border-print { border: 1px solid #000; }
.border-bottom-print { border-bottom: 1px solid #000; }

.table-print {
  border-collapse: collapse;
  width: 100%;
}
.table-print th,
.table-print td {
  border: 1px solid #000;
  padding: 4px 6px;
  line-height: 1.2;
}
.font-mini th,
.font-mini td {
  padding: 3px 4px;
}
.text-wrap {
  white-space: normal !important;
  word-wrap: break-word;
}
</style>

<style>
@media print {
  body, html {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  .q-header,
  .q-footer,
  .q-drawer,
  .q-drawer-container,
  .q-page-container > header,
  .q-page-container > div:not(.print-area),
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

  .q-dialog, .q-dialog__inner {
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
    margin: 5mm;
  }
}
</style>
