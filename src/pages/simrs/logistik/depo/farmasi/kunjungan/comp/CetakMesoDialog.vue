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

const naranjoQuestions = [
  { key: 'q1', label: 'Apakah terdapat laporan lengkap tentang reaksi tersebut sebelumnya?' },
  { key: 'q2', label: 'Apakah kejadian yang tidak dikehendaki muncul setelah obat yang dicurigai digunakan?' },
  { key: 'q3', label: 'Apakah ROTD membaik ketika obat dihentikan atau setelah pemberian suatu antagonis yang spesifik?' },
  { key: 'q4', label: 'Apakah ROTD muncul kembali setelah obatnya digunakan kembali?' },
  { key: 'q5', label: 'Adakah penyebab lain yang dapat menyebabkan reaksi dengan sendirinya?' },
  { key: 'q6', label: 'Apakah reaksi muncul kembali setelah pemberian plasebo?' },
  { key: 'q7', label: 'Apakah kadar obat dalam darah berada dalam rentang yang dianggap toksik?' },
  { key: 'q8', label: 'Apakah reaksi menjadi lebih parah ketika dosis ditingkatkan atau menjadi kurang parah ketika dosis diturunkan?' },
  { key: 'q9', label: 'Apakah pasien memiliki reaksi serupa terhadap obat-obatan yang sama atau serupa pada paparan sebelumnya?' },
  { key: 'q10', label: 'Apakah ROTD telah dipastikan dengan suatu bukti yang objektif? (misal: hasil uji laboratorium, dsb)?' }
]

const naranjoScore = computed(() => {
  const n = props.form?.detail?.naranjo
  if (!n) return 0
  let score = 0

  if (n.q1 === 'Ya') score += 1
  if (n.q2 === 'Ya') score += 2; else if (n.q2 === 'Tidak') score -= 1
  if (n.q3 === 'Ya') score += 1; else if (n.q3 === 'Tidak') score -= 1
  if (n.q4 === 'Ya') score += 2; else if (n.q4 === 'Tidak') score -= 1
  if (n.q5 === 'Ya') score -= 1; else if (n.q5 === 'Tidak') score += 2
  if (n.q6 === 'Ya') score -= 1
  if (n.q7 === 'Ya') score += 1
  if (n.q8 === 'Ya') score += 1
  if (n.q9 === 'Ya') score += 1
  if (n.q10 === 'Ya') score += 1

  return score
})

const getEvaluasiLabel = computed(() => {
  const s = naranjoScore.value
  if (s >= 9) return 'Pasti / Certain'
  if (s >= 5) return 'Lebih Mungkin / Probable'
  if (s >= 1) return 'Mungkin / Possible'
  return 'Meragukan / Doubtful'
})

const parseOutcome = (val) => {
  if (val === 'sembuh') return 'Sembuh'
  if (val === 'sembuh_gejala_sisa') return 'Sembuh dengan Gejala Sisa'
  if (val === 'belum_sembuh') return 'Belum Sembuh'
  if (val === 'meninggal') return 'Meninggal'
  if (val === 'tidak_tahu') return 'Tidak Tahu'
  return val || '-'
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
          
          <!-- ================= PAGE 1 ================= -->
          <div class="page-container">
            <!-- Kop Surat Standard RS -->
            <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['MONITORING', 'EFEK SAMPING', 'OBAT (MESO)']" />

            <!-- Demografi Pasien -->
            <table class="table-print full-width q-my-sm">
              <tbody>
                <tr>
                  <td width="15%" class="bg-grey-2 text-weight-bold">Nama Pasien</td>
                  <td width="35%">: <strong>{{ pasien?.nama || '-' }}</strong></td>
                  <td width="15%" class="bg-grey-2 text-weight-bold">No. RM</td>
                  <td width="35%">: <strong>{{ pasien?.norm || '-' }}</strong></td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Umur / BB</td>
                  <td>: {{ pasien?.usia || '-' }} / {{ form?.detail?.bb ? form.detail.bb + ' kg' : '-' }}</td>
                  <td class="bg-grey-2 text-weight-bold">Suku / Pekerjaan</td>
                  <td>: {{ form?.detail?.suku || '-' }} / {{ form?.detail?.pekerjaan || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Kehamilan</td>
                  <td>: {{ form?.detail?.kehamilan === 'hamil' ? 'Hamil' : form?.detail?.kehamilan === 'tidak_hamil' ? 'Tidak Hamil' : 'Tidak Tahu' }}</td>
                  <td class="bg-grey-2 text-weight-bold">Jenis Kelamin / SB</td>
                  <td>: {{ pasien?.kelamin || '-' }} / {{ pasien?.sistembayar || '-' }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Penyakit Utama & Kondisi -->
            <table class="table-print full-width q-mb-sm">
              <tbody>
                <tr>
                  <td width="30%" class="bg-grey-2 text-weight-bold">Penyakit Utama</td>
                  <td>{{ form?.detail?.penyakit_utama || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Kondisi Penyakit Utama</td>
                  <td>{{ parseOutcome(form?.detail?.kondisi_penyakit_utama) }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Penyakit/Kondisi Menyertai</td>
                  <td>
                    <span v-if="form?.detail?.penyakit_penyerta_chk?.gangguan_ginjal" class="q-mr-sm">[✓] Gangguan Ginjal</span>
                    <span v-if="form?.detail?.penyakit_penyerta_chk?.gangguan_hati" class="q-mr-sm">[✓] Gangguan Hati</span>
                    <span v-if="form?.detail?.penyakit_penyerta_chk?.alergi" class="q-mr-sm">[✓] Alergi</span>
                    <span v-if="form?.detail?.kondisi_lain">[✓] Lain-lain: {{ form.detail.kondisi_lain }}</span>
                    <span v-if="!form?.detail?.penyakit_penyerta_chk?.gangguan_ginjal && !form?.detail?.penyakit_penyerta_chk?.gangguan_hati && !form?.detail?.penyakit_penyerta_chk?.alergi && !form?.detail?.kondisi_lain">-</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Efek Samping Obat (ESO) -->
            <div class="text-subtitle2 text-weight-bold text-teal q-my-xs">EFEK SAMPING OBAT (ESO)</div>
            <table class="table-print full-width q-mb-sm">
              <tbody>
                <tr>
                  <td width="30%" class="bg-grey-2 text-weight-bold">Bentuk / Manifestasi ESO</td>
                  <td>{{ form?.keluhan || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Mutu / Kualitas Produk Obat</td>
                  <td>{{ form?.detail?.mutu_obat || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Kesudahan ESO</td>
                  <td>{{ parseOutcome(form?.detail?.kesudahan_eso) }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Riwayat ESO Sebelumnya</td>
                  <td>{{ form?.detail?.riwayat_eso || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Tindakan / Penanganan</td>
                  <td>{{ form?.tindakan_diambil || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Data Lab / Tgl Pemeriksaan</td>
                  <td>{{ form?.detail?.data_lab || '-' }} <span v-if="form?.detail?.tgl_pemeriksaan_lab">(Tgl: {{ form.detail.tgl_pemeriksaan_lab }})</span></td>
                </tr>
              </tbody>
            </table>

            <!-- Penggunaan Obat Table -->
            <div class="text-subtitle2 text-weight-bold text-teal q-my-xs">PENGGUNAAN OBAT</div>
            <table class="table-print full-width q-mb-sm font-mini">
              <thead>
                <tr class="bg-grey-2">
                  <th width="3%">No</th>
                  <th>Nama Obat</th>
                  <th width="12%">Bentuk Sediaan</th>
                  <th width="10%">No. Bets</th>
                  <th width="6%">Dicurigai</th>
                  <th width="10%">Cara Pemberian</th>
                  <th width="8%">Waktu</th>
                  <th width="8%">Dosis</th>
                  <th width="10%">Mulai</th>
                  <th width="10%">Akhir</th>
                  <th>Indikasi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obat, index) in form?.detail?.penggunaan_obat" :key="index">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td>{{ obat.nama || '-' }}</td>
                  <td>{{ obat.sediaan || '-' }}</td>
                  <td>{{ obat.bets || '-' }}</td>
                  <td class="text-center">{{ obat.dicurigai ? '✓' : '-' }}</td>
                  <td>{{ obat.cara || '-' }}</td>
                  <td>{{ obat.waktu || '-' }}</td>
                  <td>{{ obat.dosis || '-' }}</td>
                  <td>{{ obat.tgl_mulai || '-' }}</td>
                  <td>{{ obat.tgl_akhir || '-' }}</td>
                  <td>{{ obat.indikasi || '-' }}</td>
                </tr>
                <tr v-if="!form?.detail?.penggunaan_obat?.length">
                  <td colspan="11" class="text-center text-grey-6">Tidak ada data penggunaan obat</td>
                </tr>
              </tbody>
            </table>

            <!-- Lain-lain -->
            <table class="table-print full-width q-mb-sm">
              <tbody>
                <tr>
                  <td width="30%" class="bg-grey-2 text-weight-bold">Kecepatan Timbulnya ESO</td>
                  <td>{{ form?.detail?.kecepatan_eso || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Reaksi Setelah Obat Dihentikan</td>
                  <td>{{ form?.detail?.reaksi_dihentikan || '-' }}</td>
                </tr>
                <tr>
                  <td class="bg-grey-2 text-weight-bold">Pengobatan untuk Mengatasi ESO</td>
                  <td>{{ form?.detail?.pengobatan_eso || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Page Break for Printing -->
          <div class="page-break"></div>

          <!-- ================= PAGE 2 ================= -->
          <div class="page-container q-pt-lg">
            <div class="text-center text-weight-bold text-subtitle1 text-teal border-bottom-double q-pb-xs q-mb-md">
              ALGORITMA NARANJO (EVALUASI KAUSALITAS ESO)
            </div>

            <table class="table-print full-width q-mb-md">
              <thead>
                <tr class="bg-grey-2">
                  <th width="5%">No</th>
                  <th class="text-left">Pertanyaan Evaluasi Kausalitas Naranjo</th>
                  <th width="10%" class="text-center">Ya</th>
                  <th width="10%" class="text-center">Tidak</th>
                  <th width="15%" class="text-center">Tidak Tahu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(q, idx) in naranjoQuestions" :key="q.key">
                  <td class="text-center">{{ idx + 1 }}</td>
                  <td class="text-left text-wrap">{{ q.label }}</td>
                  <td class="text-center text-weight-bold">
                    {{ form?.detail?.naranjo?.[q.key] === 'Ya' ? '✓' : '-' }}
                  </td>
                  <td class="text-center text-weight-bold">
                    {{ form?.detail?.naranjo?.[q.key] === 'Tidak' ? '✓' : '-' }}
                  </td>
                  <td class="text-center text-weight-bold">
                    {{ form?.detail?.naranjo?.[q.key] === 'Tidak Tahu' || !form?.detail?.naranjo?.[q.key] ? '✓' : '-' }}
                  </td>
                </tr>
                <tr class="bg-grey-2 font-weight-bold">
                  <td colspan="2" class="text-right text-weight-bold">TOTAL SKOR NARANJO :</td>
                  <td colspan="3" class="text-center text-subtitle1 text-teal text-weight-bold">{{ naranjoScore }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Hasil Evaluasi & Sign Area -->
            <div class="row items-stretch q-col-gutter-md q-mt-md">
              <!-- Box Hasil Evaluasi -->
              <div class="col-7">
                <div class="border-print fit q-pa-md bg-grey-1" style="border-radius: 4px;">
                  <div class="text-weight-bold text-subtitle2 text-teal q-mb-sm">HASIL EVALUASI (KAUSALITAS):</div>
                  <div class="row q-col-gutter-xs">
                    <div class="col-12 flex items-center">
                      <span class="q-mr-sm" :class="{ 'text-weight-bold text-teal': naranjoScore >= 9 }">
                        {{ naranjoScore >= 9 ? '[✓]' : '[  ]' }} Pasti (Certain) &ge; 9
                      </span>
                    </div>
                    <div class="col-12 flex items-center">
                      <span class="q-mr-sm" :class="{ 'text-weight-bold text-teal': naranjoScore >= 5 && naranjoScore <= 8 }">
                        {{ naranjoScore >= 5 && naranjoScore <= 8 ? '[✓]' : '[  ]' }} Lebih Mungkin (Probable) 5 - 8
                      </span>
                    </div>
                    <div class="col-12 flex items-center">
                      <span class="q-mr-sm" :class="{ 'text-weight-bold text-teal': naranjoScore >= 1 && naranjoScore <= 4 }">
                        {{ naranjoScore >= 1 && naranjoScore <= 4 ? '[✓]' : '[  ]' }} Mungkin (Possible) 1 - 4
                      </span>
                    </div>
                    <div class="col-12 flex items-center">
                      <span class="q-mr-sm" :class="{ 'text-weight-bold text-teal': naranjoScore <= 0 }">
                        {{ naranjoScore <= 0 ? '[✓]' : '[  ]' }} Meragukan (Doubtful) &le; 0
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Signatures -->
              <div class="col-5 flex flex-center">
                <div class="text-center full-width" style="font-size: 11px;">
                  Probolinggo, {{ form?.tanggal ? dateFullFormat(form.tanggal) : '.....................' }}<br>
                  Petugas Farmasi yang Melaporkan,<br><br>
                  <div style="height: 70px;" class="flex flex-center q-mb-xs">
                    <div v-if="form?.petugas" class="flex flex-center">
                      <div style="width: 65px; height: 65px;">
                        <vue-qrcode :value="qrUrl" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }" />
                      </div>
                    </div>
                    <span v-else class="text-grey-5">Belum Tanda Tangan</span>
                  </div>
                  <u><b>( {{ getNamaPetugas || '..................................' }} )</b></u>
                </div>
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
.font-mini th,
.font-mini td {
  padding: 3px 4px;
}
.text-wrap {
  white-space: normal !important;
  word-wrap: break-word;
}
.page-break {
  display: none;
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

  .page-break {
    display: block !important;
    page-break-before: always !important;
    height: 0;
    margin: 0;
    padding: 0;
    border: none;
  }

  @page {
    size: A4 portrait;
    margin: 5mm;
  }
}
</style>
