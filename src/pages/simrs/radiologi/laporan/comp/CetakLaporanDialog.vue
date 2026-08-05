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
          <!-- Header Rumah Sakit -->
          <div class="text-center q-mb-md">
            <div class="text-h6 text-weight-bold text-uppercase">LAPORAN REKAPITULASI RADIOLOGI</div>
            <div class="text-body2">Instalasi Radiologi RSUD / RS</div>
            <div class="text-caption">Periode: {{ store.formattedFrom }} s/d {{ store.formattedTo }}</div>
            <q-separator class="q-mt-sm" />
          </div>

          <!-- Summary Boxes -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Total Pasien</div>
                <div class="summary-value text-primary">{{ store.summary.totalPasien }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Total Tindakan</div>
                <div class="summary-value text-teal">{{ store.summary.totalTindakan }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Rajal / Ranap / IGD</div>
                <div class="text-caption text-center">
                  <b class="text-blue-9">{{ store.summary.totalRajal }}</b> /
                  <b class="text-orange-9">{{ store.summary.totalRanap }}</b> /
                  <b class="text-red-9">{{ store.summary.totalIgd }}</b>
                </div>
              </div>
            </div>
            <div class="col-6 col-sm-3">
              <div class="summary-box">
                <div class="summary-label">Total Dokter</div>
                <div class="summary-value text-deep-purple">{{ store.summary.totalDokter }}</div>
              </div>
            </div>
          </div>

          <!-- Tabel Rekap Global -->
          <div class="text-subtitle2 text-weight-bold q-mb-xs text-primary">
            A. Rekapitulasi Global Tindakan Radiologi
          </div>
          <table class="print-table q-mb-md">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th style="width: 90px;">Kode</th>
                <th>Nama Tindakan / Pemeriksaan</th>
                <th style="width: 90px;">Jml Pasien</th>
                <th style="width: 100px;">Jml Tindakan</th>
                <th style="width: 80px;">Kontribusi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(g, idx) in store.rekapGlobal" :key="g.kode">
                <td class="text-center">{{ idx + 1 }}</td>
                <td class="text-center">{{ g.kode }}</td>
                <td>{{ g.nama }}</td>
                <td class="text-center">{{ g.jlhPasien }}</td>
                <td class="text-center text-weight-bold">{{ g.jlhTindakan }}</td>
                <td class="text-center">{{ g.persentase }}%</td>
              </tr>
              <tr class="row-total">
                <td colspan="3" class="text-right text-weight-bold">TOTAL</td>
                <td class="text-center text-weight-bold">{{ store.summary.totalPasien }}</td>
                <td class="text-center text-weight-bold">{{ store.summary.totalTindakan }}</td>
                <td class="text-center text-weight-bold">100%</td>
              </tr>
            </tbody>
          </table>

          <!-- Tabel Rekap Per Dokter -->
          <div class="text-subtitle2 text-weight-bold q-mb-xs text-primary">
            B. Rekapitulasi Per Dokter / DPJP
          </div>
          <table class="print-table q-mb-lg">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th>Nama Dokter / DPJP</th>
                <th style="width: 100px;">Jml Pasien</th>
                <th style="width: 110px;">Jml Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(d, idx) in store.rekapDokter" :key="d.kodedokter">
                <tr>
                  <td class="text-center">{{ idx + 1 }}</td>
                  <td class="text-weight-medium">{{ d.nama }}</td>
                  <td class="text-center">{{ d.jlhPasien }}</td>
                  <td class="text-center text-weight-bold">{{ d.jlhTindakan }}</td>
                </tr>
                <!-- Sub Tindakan per Dokter -->
                <tr v-for="(tnd, ti) in d.detailTindakan" :key="ti" class="row-sub">
                  <td></td>
                  <td class="q-pl-lg text-caption text-grey-8">{{ tnd.namaTindakan }}</td>
                  <td></td>
                  <td class="text-center text-caption">{{ tnd.jumlah }}</td>
                </tr>
              </template>
              <tr class="row-total">
                <td colspan="2" class="text-right text-weight-bold">TOTAL</td>
                <td class="text-center text-weight-bold">{{ store.summary.totalPasien }}</td>
                <td class="text-center text-weight-bold">{{ store.summary.totalTindakan }}</td>
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
import { ref } from 'vue'
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

const dialog = ref(false)
const store = useLaporanRadiologiStore()

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
          .text-subtitle2 { font-size: 12px; font-weight: 700; }
          .text-uppercase { text-transform: uppercase; }
          .q-mb-xs { margin-bottom: 4px; }
          .q-mb-sm { margin-bottom: 8px; }
          .q-mb-md { margin-bottom: 16px; }
          .q-mb-lg { margin-bottom: 24px; }
          .q-mt-sm { margin-top: 8px; }
          .q-mt-xs { margin-top: 4px; }
          .q-mt-xl { margin-top: 48px; }
          .q-pa-lg { padding: 24px; }
          .q-pl-lg { padding-left: 24px; }
          .row { display: flex; flex-wrap: wrap; }
          .col-4 { width: 33.33%; }
          .col-6 { width: 50%; }
          .col-sm-3 { width: 25%; }
          .text-align-right { text-align: right; }
          .justify-end { justify-content: flex-end; }

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
          .print-table tbody tr:nth-child(even) {
            background: #F5F5F5;
          }
          .row-total td {
            background: #E3F2FD;
            font-weight: 700;
            border-top: 2px solid #90CAF9;
          }
          .row-sub td {
            background: #FAFAFA;
            color: #555;
            font-size: 10px;
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
.print-table tbody tr:nth-child(even) {
  background: #F5F5F5;
}
.row-total td {
  background: #E3F2FD;
  font-weight: 700;
  border-top: 2px solid #90CAF9;
}
.row-sub td {
  background: #FAFAFA;
  color: #607D8B;
  font-size: 11px;
}
</style>
