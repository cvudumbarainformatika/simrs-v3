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
  id: 'print-meso-doc',
  popTitle: 'Monitoring Efek Samping Obat (MESO)'
}

const getNamaPetugas = computed(() => {
  const val = props.form?.petugas
  if (!val) return ''
  const found = props.apotekers?.find(st => st.kdpegsimrs === val)
  return found ? found.nama : val
})

const qrUrl = computed(() => {
  const kdpeg = props.form?.petugas
  if (!kdpeg) return ''
  const noreg = props.pasien?.noreg || ''
  const dok = 'MONITORING EFEK SAMPING OBAT MESO.png'
  const asal = 'FARMASI'
  const enc = btoa(`${noreg}|${dok}|${asal}|${kdpeg}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})
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
          <span class="text-subtitle1 text-weight-bold">Pratinjau Cetak: Monitoring Efek Samping Obat (MESO)</span>
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
        <div id="print-meso-doc" class="bg-white print-area q-pa-lg shadow-3 text-black font-print border-print" style="width: 210mm; min-height: 297mm; box-sizing: border-box;">
          
          <!-- Kop Surat Standard RS -->
          <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['MONITORING', 'EFEK SAMPING', 'OBAT (MESO)']" />

          <!-- Patient Info Box -->
          <table class="table-print patient-info-table full-width q-my-md">
            <tbody>
              <tr>
                <td width="18%" class="bg-grey-2 text-weight-bold">Nama Pasien</td>
                <td width="32%">: <strong>{{ pasien?.nama || '-' }}</strong></td>
                <td width="18%" class="bg-grey-2 text-weight-bold">No. RM / Noreg</td>
                <td width="32%">: <strong>{{ pasien?.norm || '-' }} / {{ pasien?.noreg || '-' }}</strong></td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Tgl. Lahir / Usia</td>
                <td>: {{ pasien?.tgllahir || '-' }} ({{ pasien?.usia || '-' }})</td>
                <td class="bg-grey-2 text-weight-bold">Jenis Kelamin / SB</td>
                <td>: {{ pasien?.kelamin || '-' }} / {{ pasien?.sistembayar || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="text-center text-weight-bold text-subtitle2 uppercase tracking-wide q-my-md text-black border-bottom-double q-pb-xs">
            LEMBAR MONITORING EFEK SAMPING OBAT (MESO)
          </div>

          <div class="q-mb-md">
            Tanggal Monitoring: <strong>{{ form?.tanggal }}</strong>
          </div>

          <!-- MESO Details Table -->
          <table class="table-print full-width q-mb-xl">
            <tbody>
              <tr>
                <td width="30%" class="bg-grey-2 text-weight-bold">Keluhan Efek Samping Obat</td>
                <td>{{ form?.keluhan || '-' }}</td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Obat yang Dicurigai</td>
                <td><strong>{{ form?.obat_dicurigai || '-' }}</strong></td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Tindakan / Penanganan yang Diambil</td>
                <td>{{ form?.tindakan_diambil || '-' }}</td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Kondisi Akhir / Outcome Pasien</td>
                <td>{{ form?.outcome || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Signatures Area -->
          <div class="row justify-end q-mt-xl" style="font-size: 11px;">
            <div class="text-center" style="width: 260px;">
              Probolinggo, {{ form?.tanggal ? dateFullFormat(form.tanggal) : '.....................' }}<br>
              Petugas Farmasi yang Melaporkan,<br><br>
              <div style="height: 80px;" class="flex flex-center q-mb-xs">
                <div v-if="form?.petugas" class="flex flex-center">
                  <div style="width: 70px; height: 70px;">
                    <vue-qrcode :value="qrUrl" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }" />
                  </div>
                </div>
                <span v-else class="text-grey-5">Belum Tanda Tangan</span>
              </div>
              <u><b>( {{ getNamaPetugas || '..................................' }} )</b></u>
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
.border-print { border: 1px solid #000; }
.border-bottom-double { border-bottom: 3px double #000; }

.table-print {
  border-collapse: collapse;
  width: 100%;
}
.table-print th,
.table-print td {
  border: 1px solid #000;
  padding: 8px 10px;
  line-height: 1.3;
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
    margin: 4mm;
  }
}
</style>
