<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal v-if="!history" title1="ASSESSMENT PRA INDUKSI" title2="" />

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
                : {{ pasien?.nama_panggil }}
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

        <div class="dokumen-content q-mb-md">
          <!-- TABLE 1: INFORMASI UMUM & RIWAYAT -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3">INFORMASI UMUM & RIWAYAT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%" class="text-weight-bold">Keluhan Utama</td>
                <td colspan="3">{{ dataInduksi?.keluhan_utama || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Diagnosa</td>
                <td colspan="3">{{ dataInduksi?.diagnosa || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Rencana Pembedahan</td>
                <td colspan="3">{{ dataInduksi?.rencana_bedah || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Riwayat Anestesi</td>
                <td width="25%">
                  {{ dataInduksi?.riwayat_anastesi || '-' }}
                  <span v-if="dataInduksi?.riwayat_anastesi === 'Ya' && dataInduksi?.jenis_riwayat_anastesi">
                    ({{ dataInduksi?.jenis_riwayat_anastesi }})
                  </span>
                </td>
                <td width="25%" class="text-weight-bold">Riwayat Merokok</td>
                <td width="25%">{{ dataInduksi?.riwayat_merokok || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Alkoholik</td>
                <td>{{ dataInduksi?.alkohol || '-' }}</td>
                <td class="text-weight-bold">Riwayat Alergi</td>
                <td>
                  {{ dataInduksi?.riwayat_alergi || '-' }}
                  <span v-if="dataInduksi?.riwayat_alergi === 'Ya' && dataInduksi?.jenis_alergi">
                    ({{ dataInduksi?.jenis_alergi }})
                  </span>
                </td>
              </tr>
              <tr>
                <td class="text-weight-bold">Persiapan Transfusi</td>
                <td colspan="3">
                  {{ dataInduksi?.persiapan_transfusi || '-' }}
                  <span v-if="dataInduksi?.persiapan_transfusi === 'Ya'">
                    | Jenis: {{ dataInduksi?.jenis_transfusi || '-' }} | Jumlah: {{ dataInduksi?.jumlah_transfusi || '-' }} Kolf/Unit
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- TABLE 2: VITAL SIGN & PEMERIKSAAN FISIK -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3">TANDA-TANDA VITAL & PEMERIKSAAN FISIK</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%" class="text-weight-bold">Vital Sign</td>
                <td colspan="3">
                  Kesadaran/Sens: {{ dataInduksi?.vit_sens || '-' }} | 
                  TD: {{ dataInduksi?.vit_td_sistole || '-' }}/{{ dataInduksi?.vit_td_diastole || '-' }} mmHg | 
                  Nadi: {{ dataInduksi?.vit_nadi || '-' }} x/menit | 
                  RR: {{ dataInduksi?.vit_rr || '-' }} x/menit | 
                  Suhu: {{ dataInduksi?.vit_suhu || '-' }} °C
                </td>
              </tr>
              <tr>
                <td class="text-weight-bold">Jalan Napas (Kesulitan Intubasi)</td>
                <td width="25%">{{ dataInduksi?.fis_jalan_napas || '-' }}</td>
                <td width="25%" class="text-weight-bold">Mulut</td>
                <td width="25%">{{ dataInduksi?.fis_mulut || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Tenggorokan</td>
                <td>{{ dataInduksi?.fis_tenggorokan || '-' }}</td>
                <td class="text-weight-bold">Skor Mallampati</td>
                <td>{{ dataInduksi?.fis_skor_mallapati || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Kelainan Tulang Belakang</td>
                <td>{{ dataInduksi?.fis_kel_tul_bel || '-' }}</td>
                <td class="text-weight-bold">Kelainan Jantung / Paru</td>
                <td>{{ dataInduksi?.fis_kel_jan_par || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Abdomen</td>
                <td colspan="3">{{ dataInduksi?.fis_abdomen || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- TABLE 3: PEMERIKSAAN PENUNJANG, SKOR & RENCANA ANESTESI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3">PEMERIKSAAN PENUNJANG & RENCANA ANESTESI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%" class="text-weight-bold">Laboratorium</td>
                <td width="25%">{{ dataInduksi?.fis_penj_lab || '-' }}</td>
                <td width="25%" class="text-weight-bold">EKG</td>
                <td width="25%">{{ dataInduksi?.fis_penj_ekg || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Thorax</td>
                <td>{{ dataInduksi?.fis_penj_thorax || '-' }}</td>
                <td class="text-weight-bold">Lain-lain</td>
                <td>{{ dataInduksi?.fis_penj_lain || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Skor Nyeri</td>
                <td>{{ dataInduksi?.ket_skor_nyeri || '-' }}</td>
                <td class="text-weight-bold">Klasifikasi ASA</td>
                <td>{{ dataInduksi?.klasifikasi_asa || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Rencana Anestesi</td>
                <td colspan="3">
                  {{ dataInduksi?.renc_anastesi || '-' }}
                  <span v-if="dataInduksi?.renc_anastesi === 'Regional' && dataInduksi?.region_anas">
                    ({{ dataInduksi?.region_anas }})
                  </span>
                </td>
              </tr>
              <tr>
                <td class="text-weight-bold">Rencana Pemulihan</td>
                <td>{{ dataInduksi?.renc_pemulihan_pasca_anas || '-' }}</td>
                <td class="text-weight-bold">Rencana Management Nyeri</td>
                <td>{{ dataInduksi?.renc_management_nyeri || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- TABLE 4: PEMBERIAN OBAT PRE-MEDIKASI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="5" class="text-weight-bold title-th bg-grey-3">LOG PEMBERIAN OBAT PRE-MEDIKASI</th>
              </tr>
              <tr class="bg-grey-2">
                <th width="8%" class="text-center">No</th>
                <th width="35%">Obat Pre-Medikasi</th>
                <th width="20%">Dosis</th>
                <th width="12%">Jam</th>
                <th width="25%">Pelaksana</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!dataInduksi?.obat_pre_medikasi?.length">
                <td colspan="5" class="text-center text-grey">Tidak ada data obat pre-medikasi</td>
              </tr>
              <tr v-else v-for="(item, idx) in dataInduksi?.obat_pre_medikasi" :key="idx">
                <td class="text-center">{{ idx + 1 }}</td>
                <td>{{ item?.obat_pre_medikasi?.nama_obat || item?.obat_pre_medikasi || '-' }}</td>
                <td>{{ item?.dosis || '-' }}</td>
                <td>{{ item?.jam || '-' }}</td>
                <td>{{ item?.pelaksana?.nama || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Signature Section -->
        <div class="row q-mt-xl justify-end">
          <div class="col-4 text-center">
            <div>Probolinggo, {{ dataInduksi?.tgl ? dateFullFormat(dataInduksi.tgl) : '-' }}</div>
            <div class="text-weight-bold q-mb-sm">Dokter Anestesi</div>
            <div v-if="qrUrl" style="height: 100px; width: 100px; margin: 0 auto;" class="q-mb-sm">
              <vue-qrcode :value="qrUrl" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
            <div style="text-decoration: underline;" class="text-weight-bold">
              {{ dokterAnestesi?.nama || 'Nama Dokter Anestesi' }}
            </div>
            <div class="f-10">NIP. {{ dokterAnestesi?.nip || '-' }}</div>
          </div>
        </div>

      </div>
    </div>

    <q-btn v-if="!history" ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary"
      class="fixed-bottom-right" style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { useAssasementPraBedahStore } from 'src/stores/simrs/kamaroperasi/assasement/praBedah'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'
import { onMounted, ref, computed } from 'vue'
import { dateFullFormat } from 'src/modules/formatter'

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

const store = useAssasementPraBedahStore()
const laporanOp = useLaporanOperasiStore()
const refPrint = ref()

const dataInduksi = computed(() => {
  return props.pasien?.pra_induksi || {}
})

const dokterAnestesi = computed(() => {
  const code = dataInduksi.value?.dokter_anastesi
  if (!code) return null
  return laporanOp.nakes?.find(x => x.kdpegsimrs === code) || { nama: code, nip: '-' }
})

function generateQRUrl (noreg, dokumen, petugas, asal) {
  if (!petugas) return ''
  try {
    const enc = btoa(`${noreg}|${dokumen}|${asal}|${petugas}`)
    return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  } catch (e) {
    return petugas
  }
}

const qrUrl = computed(() => {
  const code = dokterAnestesi.value?.kdpegsimrs || dokterAnestesi.value?.nip || dokterAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Assessment Pra Induksi', code, 'PENUNJANG')
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'ASSESSMENT PRA INDUKSI',
  popTitle: 'ASSESSMENT PRA INDUKSI'
}

onMounted(() => {
  if (laporanOp.nakes.length === 0) {
    laporanOp.getNakes()
  }
})
</script>

<style lang="scss" scoped>
.page-legal {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 21.59cm;

  .contentx {
    padding: 10mm;
  }
}

.biodata-pasien {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.f-10 {
  font-size: 10px;
}

.f-12 {
  font-size: 12px;
}

.text-weight-bold {
  font-weight: bold;
}

.doc-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 11px;

  th, td {
    border: 1px solid #000;
    padding: 6px 10px;
    vertical-align: top;
  }

  th {
    background-color: #e0e0e0;
    font-weight: bold;
    text-align: left;
    font-size: 12px;
  }
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;

    .contentx {
      padding: 5mm;
    }
  }

  .hide-on-print {
    display: none;
  }

  @page {
    margin: 10mm;
  }
}
</style>
