<template>
  <q-dialog v-model="dialog" maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="column no-wrap">
      <!-- Header Dialog -->
      <q-bar class="bg-primary text-white q-pa-md" style="height: auto;">
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">Cetak Laporan Radiologi</div>
          <div class="text-caption">
            Periode: {{ store.formattedFrom }} s/d {{ store.formattedTo }}
          </div>
        </div>
        <q-space />
        <q-btn dense flat icon="icon-mat-print" label="Cetak" @click="doCetak" class="q-mr-sm" />
        <q-btn dense flat round icon="icon-mat-close" v-close-popup />
      </q-bar>

      <!-- Content Scrollable -->
      <q-scroll-area class="col">
        <div id="cetakLaporanRadiologi" class="cetak-container q-pa-lg">

          <!-- KOP SURAT STANDARD RSUD -->
          <AppKopSuratStandard
            :data-header="dataHeader"
            :header="['LAPORAN REKAPITULASI', 'RADIOLOGI', '']"
            class="q-mb-md"
          />

          <!-- Periode & Judul -->
          <div class="text-center q-mb-md q-mt-sm">
            <div class="text-caption text-weight-bold text-primary">
              Periode: {{ store.formattedFrom }} s/d {{ store.formattedTo }}
            </div>
          </div>

          <!-- Summary Boxes -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Total Nota Unik</div>
                <div class="summary-value text-primary">{{ store.totalNotaUnik }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Total Pemeriksaan</div>
                <div class="summary-value text-teal">{{ totalPemeriksaan }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Dokter Peminta</div>
                <div class="summary-value text-deep-purple">{{ store.dataDokterMinta.length }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Ruangan Pengirim</div>
                <div class="summary-value text-orange-9">{{ store.dataRuangan.length }}</div>
              </div>
            </div>
          </div>

          <!-- A. Rekapitulasi Per Pemeriksaan -->
          <div class="text-subtitle2 text-weight-bold q-mb-xs text-primary">
            A. Rekapitulasi Per Pemeriksaan Radiologi
          </div>
          <table class="print-table q-mb-md">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th style="width: 90px;">Kode</th>
                <th>Nama Pemeriksaan</th>
                <th style="width: 90px;">Total Nota</th>
                <th style="width: 100px;">Total Tindakan</th>
                <th style="width: 80px;">Kontribusi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, idx) in store.dataPemeriksaan" :key="idx">
                <td class="text-center">{{ idx + 1 }}</td>
                <td class="text-center">{{ p.kode || '-' }}</td>
                <td>{{ p.nama }}</td>
                <td class="text-center">{{ p.total_nota }}</td>
                <td class="text-center text-weight-bold">{{ p.total }}</td>
                <td class="text-center">{{ p.persen_nota }}%</td>
              </tr>
              <tr class="row-total">
                <td colspan="3" class="text-right text-weight-bold">TOTAL</td>
                <td class="text-center text-weight-bold">{{ store.totalNotaUnik }}</td>
                <td class="text-center text-weight-bold">{{ totalPemeriksaan }}</td>
                <td class="text-center text-weight-bold">100%</td>
              </tr>
            </tbody>
          </table>

          <!-- B. Rekapitulasi Per Dokter Peminta -->
          <div class="text-subtitle2 text-weight-bold q-mb-xs text-primary">
            B. Rekapitulasi Per Dokter Peminta / Pengirim
          </div>
          <table class="print-table q-mb-md">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th>Nama Dokter Peminta</th>
                <th style="width: 120px;">Total Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(dm, idx) in store.dataDokterMinta" :key="idx">
                <tr class="row-parent">
                  <td class="text-center text-weight-bold">{{ idx + 1 }}</td>
                  <td class="text-weight-bold">{{ dm.nama }}</td>
                  <td class="text-center text-weight-bold">{{ dm.total }}</td>
                </tr>
                <tr v-for="(pmr, pIdx) in dm.pemeriksaan" :key="pIdx" class="row-sub">
                  <td></td>
                  <td class="q-pl-lg">└─ {{ pmr.nama }}</td>
                  <td class="text-center">{{ pmr.total }}</td>
                </tr>
              </template>
              <tr class="row-total">
                <td colspan="2" class="text-right text-weight-bold">TOTAL</td>
                <td class="text-center text-weight-bold">{{ totalDokterMinta }}</td>
              </tr>
            </tbody>
          </table>

          <!-- C. Rekapitulasi Per Dokter Pelaksana -->
          <div class="text-subtitle2 text-weight-bold q-mb-xs text-primary">
            C. Rekapitulasi Per Dokter Pelaksana Radiologi
          </div>
          <table class="print-table q-mb-md">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th>Nama Dokter Pelaksana</th>
                <th style="width: 120px;">Total Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(dl, idx) in store.dataDokterLaksana" :key="idx">
                <tr class="row-parent">
                  <td class="text-center text-weight-bold">{{ idx + 1 }}</td>
                  <td class="text-weight-bold">{{ dl.nama }}</td>
                  <td class="text-center text-weight-bold">{{ dl.total }}</td>
                </tr>
                <tr v-for="(pmr, pIdx) in dl.pemeriksaan" :key="pIdx" class="row-sub">
                  <td></td>
                  <td class="q-pl-lg">└─ {{ pmr.nama }}</td>
                  <td class="text-center">{{ pmr.total }}</td>
                </tr>
              </template>
              <tr class="row-total">
                <td colspan="2" class="text-right text-weight-bold">TOTAL</td>
                <td class="text-center text-weight-bold">{{ totalDokterLaksana }}</td>
              </tr>
            </tbody>
          </table>

          <!-- D. Rekapitulasi Per Ruangan -->
          <div class="text-subtitle2 text-weight-bold q-mb-xs text-primary">
            D. Rekapitulasi Per Ruangan / Poli Pengirim
          </div>
          <table class="print-table q-mb-lg">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th>Ruangan / Poli Pengirim</th>
                <th style="width: 120px;">Total Tindakan</th>
                <th style="width: 100px;">Kontribusi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, idx) in store.dataRuangan" :key="idx">
                <td class="text-center">{{ idx + 1 }}</td>
                <td class="text-weight-medium">{{ r.nama }}</td>
                <td class="text-center text-weight-bold">{{ r.total }}</td>
                <td class="text-center">{{ hitungPersenRuangan(r.total) }}%</td>
              </tr>
              <tr class="row-total">
                <td colspan="2" class="text-right text-weight-bold">TOTAL</td>
                <td class="text-center text-weight-bold">{{ totalRuangan }}</td>
                <td class="text-center text-weight-bold">100%</td>
              </tr>
            </tbody>
          </table>

          <!-- Tanda Tangan -->
          <div class="row justify-end q-mt-xl">
            <div class="col-4 text-center">
              <div class="text-caption">............................, ............................</div>
              <div class="text-caption q-mt-xs">Kepala Instalasi Radiologi</div>
              <div style="height: 64px;"></div>
              <div class="text-caption text-weight-bold">( .................................................. )</div>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

const dialog = ref(false)
const store = useLaporanRadiologiStore()

const dataHeader = [
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA',
  'UOBK RSUD DOKTER MOHAMAD SALEH',
  'Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335) 432702',
  'E-mail : rsudprob@probolinggokota.go.id',
  'PROBOLINGGO 67219'
]

const totalPemeriksaan = computed(() => {
  return store.dataPemeriksaan.reduce((sum, item) => sum + (Number(item?.total) || 0), 0)
})

const totalDokterMinta = computed(() => {
  return store.dataDokterMinta.reduce((sum, item) => sum + (Number(item?.total) || 0), 0)
})

const totalDokterLaksana = computed(() => {
  return store.dataDokterLaksana.reduce((sum, item) => sum + (Number(item?.total) || 0), 0)
})

const totalRuangan = computed(() => {
  return store.dataRuangan.reduce((sum, item) => sum + (Number(item?.total) || 0), 0)
})

function hitungPersenRuangan(total) {
  const tot = totalRuangan.value
  if (!tot || tot === 0) return 0
  return (((Number(total) || 0) / tot) * 100).toFixed(1)
}

function open() {
  dialog.value = true
}

function doCetak() {
  const printContents = document.getElementById('cetakLaporanRadiologi').innerHTML
  const printWindow = window.open('', '_blank', 'height=900,width=1100')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Laporan Radiologi</title>
        <meta charset="UTF-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; font-size: 11px; padding: 24px; color: #222; }
          .cetak-container { width: 100%; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-weight-bold { font-weight: 700; }
          .text-weight-medium { font-weight: 500; }
          .text-caption { font-size: 10px; }
          .text-primary { color: #1565C0; }
          .text-teal { color: #00897B; }
          .text-blue-9 { color: #1565C0; }
          .text-orange-9 { color: #E65100; }
          .text-red-9 { color: #B71C1C; }
          .text-deep-purple { color: #4527A0; }
          .text-grey-8 { color: #555; }
          .text-h6 { font-size: 16px; font-weight: 700; }
          .text-body2 { font-size: 13px; }
          .text-subtitle2 { font-size: 12px; font-weight: 700; margin-top: 12px; }
          .text-uppercase { text-transform: uppercase; }
          .q-mb-xs { margin-bottom: 4px; }
          .q-mb-sm { margin-bottom: 8px; }
          .q-mb-md { margin-bottom: 16px; }
          .q-mb-lg { margin-bottom: 24px; }
          .q-mt-sm { margin-top: 8px; }
          .q-mt-xs { margin-top: 4px; }
          .q-mt-xl { margin-top: 48px; }
          .q-pa-lg { padding: 24px; }
          .q-pl-lg { padding-left: 20px; }
          .row { display: flex; flex-wrap: wrap; }
          .col-4 { width: 33.33%; }
          .col-6 { width: 50%; }
          .col-9 { width: 75%; }
          .col-3 { width: 25%; }
          .col-sm-3 { width: 25%; }
          .full-width { width: 100%; }

          /* AppKopSuratStandard Styling */
          .kotak { border: 1px solid #000; display: flex; margin-bottom: 12px; }
          .sisi-kanan { border-right: 1px solid #000; }
          .f-10 { font-size: 10px; }
          .f-12 { font-size: 12px; }
          .f-14 { font-size: 14px; }
          .f-16 { font-size: 16px; }

          /* Summary Boxes */
          .summary-box {
            border: 1px solid #CFD8DC;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            margin: 4px;
          }
          .summary-label { font-size: 9px; color: #607D8B; margin-bottom: 4px; font-weight: 600; text-transform: uppercase; }
          .summary-value { font-size: 20px; font-weight: 700; }
          .q-col-gutter-sm > * { padding: 4px; }

          /* Print Tables */
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 12px;
          }
          .print-table th {
            background: #ECEFF1;
            font-weight: 700;
            padding: 6px 8px;
            border: 1px solid #B0BEC5;
            text-align: center;
            font-size: 10px;
          }
          .print-table td {
            padding: 4px 8px;
            border: 1px solid #CFD8DC;
            vertical-align: middle;
          }
          .row-parent td {
            background: #F0F4F8;
          }
          .row-sub td {
            background: #FFFFFF;
            color: #444;
            font-size: 10px;
          }
          .row-total td {
            background: #E3F2FD;
            font-weight: 700;
            border-top: 2px solid #90CAF9;
          }
          @media print {
            body { padding: 12px; }
            @page { margin: 12mm; }
          }
        </style>
      </head>
      <body>
        <div class="cetak-container">${printContents}</div>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
/* Preview styles in dialog */
.cetak-container {
  max-width: 900px;
  margin: 0 auto;
}
.summary-box {
  border: 1px solid #CFD8DC;
  border-radius: 6px;
  padding: 8px 12px;
  text-align: center;
  background: #FAFAFA;
}
.summary-label {
  font-size: 10px;
  color: #607D8B;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.summary-value {
  font-size: 22px;
  font-weight: 700;
}
.print-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 12px;
}
.print-table th {
  background: #ECEFF1;
  font-weight: 700;
  padding: 6px 8px;
  border: 1px solid #B0BEC5;
  text-align: center;
  font-size: 11px;
}
.print-table td {
  padding: 5px 8px;
  border: 1px solid #CFD8DC;
  vertical-align: middle;
}
.row-parent td {
  background: #F0F4F8;
}
.row-sub td {
  background: #FFFFFF;
  color: #444;
  font-size: 11px;
}
.row-total td {
  background: #E3F2FD;
  font-weight: 700;
  border-top: 2px solid #90CAF9;
}
</style>
