<script setup>
import { computed } from 'vue'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

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
  id: 'print-edukasi-doc',
  popTitle: 'Formulir Edukasi Farmasi'
}

const items = [
  { key: 'indikasi', label: 'Indikasi / Kegunaan Obat' },
  { key: 'aturan', label: 'Aturan & Cara Pakai Obat' },
  { key: 'antibiotik', label: 'Aturan Khusus Antibiotik' },
  { key: 'penyimpanan', label: 'Cara Penyimpanan & Stabilitas Obat' },
  { key: 'jangka', label: 'Jangka Waktu Pemakaian Obat' },
  { key: 'interaksi', label: 'Potensi Interaksi Obat' },
  { key: 'efek_samping', label: 'Potensi Efek Samping Obat' }
]

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
  const dok = 'FORMULIR EDUKASI FARMASI.png'
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
          <span class="text-subtitle1 text-weight-bold">Pratinjau Cetak: Formulir Edukasi Farmasi</span>
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
        <div id="print-edukasi-doc" class="bg-white print-area q-pa-lg shadow-3 text-black font-print border-print" style="width: 210mm; min-height: 297mm; box-sizing: border-box;">
          
          <!-- Kop Surat Standard RS -->
          <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['FORMULIR', 'EDUKASI', 'FARMASI']" />

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
            FORMULIR EDUKASI FARMASI
          </div>

          <div class="q-mb-md">
            Tanggal Edukasi: <strong>{{ form?.tanggal }}</strong>
          </div>

          <!-- Table of items -->
          <table class="table-print full-width q-mb-md">
            <thead>
              <tr class="bg-grey-2">
                <th width="5%" class="text-center">No</th>
                <th width="35%" class="text-left">Poin Edukasi</th>
                <th width="15%" class="text-center">Jelaskan</th>
                <th class="text-left">Keterangan / Catatan Tambahan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in items" :key="item.key">
                <td class="text-center">{{ idx + 1 }}</td>
                <td class="text-weight-bold text-left">{{ item.label }}</td>
                <td class="text-center text-bold" style="font-size: 14px;">
                  {{ form?.[item.key + '_chk'] ? '✓' : '-' }}
                </td>
                <td class="text-left">{{ form?.[item.key + '_keterangan'] || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Verifikasi dan Penerima -->
          <div class="row q-mt-md" style="font-size: 11px;">
            <div class="col-12 q-mb-xs">
              Verifikasi Pemahaman Pasien/Keluarga: 
              <strong>{{ form?.pemahaman === 'paham' ? 'PAHAM SEPENUHNYA' : 'BELUM PAHAM / PERLU EDUKASI ULANG' }}</strong>
            </div>
            <div class="col-12">
              Nama Penerima / Pengambil Obat: <strong>{{ form?.penerima || '-' }}</strong>
            </div>
          </div>

          <!-- Signatures Area -->
          <div class="row justify-between q-mt-xl" style="font-size: 11px;">
            <div class="text-center" style="width: 220px;">
              Petugas Farmasi,<br><br>
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
            <div class="text-center" style="width: 220px;">
              Penerima Edukasi / Obat,<br><br>
              <div style="height: 80px;" class="flex flex-center q-mb-xs">
                <img v-if="form?.tanda_tangan" :src="form?.tanda_tangan" style="max-height: 80px; max-width: 100%; object-fit: contain;" />
                <span v-else class="text-grey-5">Belum Tanda Tangan</span>
              </div>
              <u><b>( {{ form?.penerima || '..................................' }} )</b></u>
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
  padding: 4px 6px;
  line-height: 1.2;
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
