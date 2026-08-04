<script setup>
import { computed } from 'vue'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  pasien: { type: Object, default: null },
  form: { type: Object, default: null },
  apotekers: { type: Array, default: () => [] },
  jenisPertanyaans: { type: Array, default: () => [] }
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
  id: 'print-pio-doc',
  popTitle: 'Pelayanan Informasi Obat (PIO)'
}

const getNamaApoteker = computed(() => {
  const val = props.form?.apoteker
  if (!val) return ''
  const found = props.apotekers?.find(st => st.kdpegsimrs === val)
  return found ? found.nama : val
})

const qrUrl = computed(() => {
  const kdpeg = props.form?.apoteker
  if (!kdpeg) return ''
  const noreg = props.pasien?.noreg || ''
  const dok = 'PELAYANAN INFORMASI OBAT PIO.png'
  const asal = 'FARMASI'
  const enc = btoa(`${noreg}|${dok}|${asal}|${kdpeg}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

const getJenisPertanyaanLabels = (keys) => {
  if (!keys || !Array.isArray(keys)) return '-'
  return keys.map(k => {
    if (typeof k === 'object') return k.label || k.nama
    const found = props.jenisPertanyaans?.find(item => item.value === k || item.label === k)
    return found ? found.label : k
  }).join(', ')
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
          <span class="text-subtitle1 text-weight-bold">Pratinjau Cetak: Pelayanan Informasi Obat (PIO)</span>
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
        <div id="print-pio-doc" class="bg-white print-area q-pa-lg shadow-3 text-black font-print border-print" style="width: 210mm; min-height: 297mm; box-sizing: border-box;">
          
          <!-- Kop Surat Standard RS -->
          <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['PELAYANAN', 'INFORMASI OBAT', '(PIO)']" />

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
                <td>: {{ form?.jenis_kelamin || pasien?.lp || pasien?.kelamin || '-' }} / {{ pasien?.sistembayar || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="text-center text-weight-bold text-subtitle2 uppercase tracking-wide q-my-md text-black border-bottom-double q-pb-xs">
            LEMBAR PELAYANAN INFORMASI OBAT (PIO)
          </div>

          <!-- Form Details Grid/Table -->
          <table class="table-print full-width q-mb-md">
            <tbody>
              <tr>
                <td width="30%" class="bg-grey-2 text-weight-bold">Tanggal & Waktu</td>
                <td>{{ form?.hari }}, {{ form?.tgl }} (Waktu: {{ form?.waktu }})</td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Metode Pertanyaan</td>
                <td>{{ form?.metode === '1' ? 'Lisan' : form?.metode === '2' ? 'Telepon' : form?.metode === '3' ? 'Tertulis' : form?.metode || '-' }}</td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold text-teal">Identitas Penanya</td>
                <td>
                  Nama: <strong>{{ form?.nama_penanya || '-' }}</strong><br>
                  Status: {{ form?.status_penanya === '1' ? 'Pasien' : form?.status_penanya === '2' ? 'Keluarga Pasien' : form?.status_penanya === '3' ? 'Tenaga Kesehatan' : form?.status_penanya || '-' }}<br>
                  No. Telepon: {{ form?.tlp_penanya || '-' }}
                </td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold text-teal">Kondisi Klinis Pasien</td>
                <td>
                  Jenis Kelamin: {{ form?.jenis_kelamin || '-' }}<br>
                  Umur: {{ form?.umur_pasien || '-' }}<br>
                  Kehamilan: {{ form?.kehamilan === '1' ? 'Ya' : 'Tidak' }}<br>
                  Menyusui: {{ form?.menyusui === '1' ? 'Ya' : 'Tidak' }}<br>
                  Kasus Khusus: {{ form?.kasus_khusus || '-' }}
                </td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Jenis / Kategori Pertanyaan</td>
                <td>
                  <span v-if="form?.jenisPertanyaan?.length">
                    {{ getJenisPertanyaanLabels(form.jenisPertanyaan) }}
                  </span>
                  <span v-else>-</span>
                </td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Obat Non E-Resep</td>
                <td>{{ form?.obat_non_eresep || '-' }}</td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Uraian Pertanyaan</td>
                <td>{{ form?.uraian_pertanyaan || '-' }}</td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Uraian Jawaban</td>
                <td>{{ form?.jawaban || '-' }}</td>
              </tr>
              <tr>
                <td class="bg-grey-2 text-weight-bold">Referensi</td>
                <td>{{ form?.referensi || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Signatures Area -->
          <div class="row justify-end q-mt-xl" style="font-size: 11px;">
            <div class="text-center" style="width: 260px;">
              Apoteker Penanggung Jawab,<br><br>
              <div style="height: 80px;" class="flex flex-center q-mb-xs">
                <div v-if="form?.apoteker" class="flex flex-center">
                  <div style="width: 70px; height: 70px;">
                    <vue-qrcode :value="qrUrl" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }" />
                  </div>
                </div>
                <span v-else class="text-grey-5">Belum Tanda Tangan</span>
              </div>
              <u><b>( {{ getNamaApoteker || '..................................' }} )</b></u>
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
  padding: 6px 8px;
  line-height: 1.25;
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
