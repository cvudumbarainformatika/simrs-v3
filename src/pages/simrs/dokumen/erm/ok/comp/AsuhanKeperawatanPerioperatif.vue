<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal v-if="!history" title1="ASUHAN KEPERAWATAN" title2="PERIOPERATIF" />

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
          <!-- I. INFORMASI PENGKAJIAN -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">I. INFORMASI PENGKAJIAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Tanggal & Jam Pengkajian</td>
                <td>{{ store.display?.tanggal || '-' }} - {{ store.form?.pengkajian_jam || '-' }}</td>
              </tr>
              <tr>
                <td>Waktu Pelayanan</td>
                <td>Mulai: {{ store.form?.pengkajian_jam_mulai || '-' }} s/d Selesai: {{ store.form?.pengkajian_jam_selesai || '-' }}</td>
              </tr>
              <tr>
                <td>Masuk Kamar Operasi (Waktu)</td>
                <td>{{ store.form?.pengkajian_waktu_masuk_ok || '-' }}</td>
              </tr>
              <tr>
                <td>Waktu Anestesi</td>
                <td>{{ store.form?.pengkajian_waktu_anastesi || '-' }}</td>
              </tr>
              <tr>
                <td>Tindakan Operasi</td>
                <td>{{ ambilTidakanOperasi(props.pasien?.manytindakanop) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- II. RESIKO INFEKSI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">II. RESIKO INFEKSI (D.0142)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Faktor Resiko</td>
                <td>
                  <div v-if="store.form?.pengkajian_faktor_resiko?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(fr, idx) in store.form?.pengkajian_faktor_resiko" :key="idx">{{ fr }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
              <tr>
                <td>Posisi Canul Intra Vena</td>
                <td>
                  <div v-if="store.form?.pengkajian_posisi_canul_intra_vena?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(pc, idx) in store.form?.pengkajian_posisi_canul_intra_vena" :key="idx">{{ pc }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
              <tr>
                <td>Urine Katheter</td>
                <td>{{ store.form?.pengkajian_urine_katheter || '-' }}</td>
              </tr>
              <tr>
                <td>Status Pernafasan</td>
                <td>{{ store.form?.pengkajian_status_pernafasan || '-' }}</td>
              </tr>
              <tr>
                <td>Vital Signs</td>
                <td>
                  Tensi: {{ store.form?.pengkajian_td_sis ?? '-' }}/{{ store.form?.pengkajian_td_dia ?? '-' }} mmHg, 
                  Nadi: {{ store.form?.pengkajian_nadi ?? '-' }} x/menit, 
                  Suhu: {{ store.form?.pengkajian_suhu ?? '-' }} °C, 
                  RR: {{ store.form?.pengkajian_respirasi_rate ?? '-' }} x/menit, 
                  Saturasi (SpO2): {{ store.form?.pengkajian_saturasi ?? '-' }} %, 
                  Lab HB: {{ store.form?.pengkajian_lab_hb ?? '-' }} gr/dl
                </td>
              </tr>
              <tr>
                <td>Dibuktikan dengan</td>
                <td>{{ store.form?.pengkajian_bukti || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- III. PENANGANAN LUKA -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">III. PENANGANAN LUKA OPERASI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Jenis Operasi</td>
                <td>{{ store.form?.pengkajian_jenis_operasi || '-' }}</td>
              </tr>
              <tr>
                <td>Disinfeksi Area Operasi</td>
                <td>{{ store.form?.pengkajian_disinfeksi_area_operasi || '-' }}</td>
              </tr>
              <tr>
                <td>Irigasi Luka</td>
                <td>
                  {{ store.form?.pengkajian_irigasi_luka || '-' }}
                  <span v-if="store.form?.pengkajian_irigasi_luka === 'Ya' && store.form?.pengkajian_cairan_irigasi_luka">
                    (Cairan: {{ store.form?.pengkajian_cairan_irigasi_luka }})
                  </span>
                </td>
              </tr>
              <tr>
                <td>Pencucian Luka</td>
                <td>
                  {{ store.form?.pengkajian_cuci_luka || '-' }}
                  <span v-if="store.form?.pengkajian_cuci_luka === 'Ya' && store.form?.pengkajian_cairan_untuk_cuci_luka">
                    (Cairan: {{ store.form?.pengkajian_cairan_untuk_cuci_luka }})
                  </span>
                </td>
              </tr>
              <tr>
                <td>Obat Penutup Luka</td>
                <td>
                  {{ store.form?.pengkajian_obat_penutup_luka || '-' }}
                  <span v-if="store.form?.pengkajian_obat_penutup_luka === 'Ya'">
                    <br/>- Jenis Obat: {{ store.form?.pengkajian_jenis_obat_penutup_luka || '-' }}
                    <br/>- Balutan: {{ store.form?.pengkajian_jenis_balutan_penutup_luka || '-' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- IV. LUARAN -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">IV. LUARAN (KRITERIA HASIL)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Luaran Utama</td>
                <td>
                  <div v-if="store.form?.luaran_utama?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(lu, idx) in store.form?.luaran_utama" :key="idx">{{ lu }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
              <tr>
                <td>Kriteria Hasil (3x24 jam)</td>
                <td>
                  <div v-if="store.form?.luaran_hasil?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(lh, idx) in store.form?.luaran_hasil" :key="idx">{{ lh }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- V. INTERVENSI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">V. INTERVENSI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Intervensi Utama</td>
                <td>
                  <div v-if="store.form?.intervensi_utama?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(iu, idx) in store.form?.intervensi_utama" :key="idx">{{ iu }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
              <tr>
                <td>Intervensi Pendukung</td>
                <td>
                  <div v-if="store.form?.intervensi_pendukung?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(ip, idx) in store.form?.intervensi_pendukung" :key="idx">{{ ip }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- VI. IMPLEMENTASI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">VI. IMPLEMENTASI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Observasi</td>
                <td>
                  <div v-if="store.form?.implementasi_observasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(io, idx) in store.form?.implementasi_observasi" :key="idx">{{ io }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
              <tr>
                <td>Terapeutik</td>
                <td>
                  <div v-if="store.form?.implementasi_terupetik?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(it, idx) in store.form?.implementasi_terupetik" :key="idx">{{ it }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
              <tr>
                <td>Kolaborasi</td>
                <td>
                  <div v-if="store.form?.implementasi_kolaborasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(ik, idx) in store.form?.implementasi_kolaborasi" :key="idx">{{ ik }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- VII. EVALUASI SOAP -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">VII. EVALUASI SOAP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Tanggal & Jam Evaluasi</td>
                <td>{{ store.display?.tanggal_eval || '-' }} - {{ store.form?.eval_jam || '-' }}</td>
              </tr>
              <tr>
                <td>S (Subjective)</td>
                <td>{{ store.form?.eval_subjective || '-' }}</td>
              </tr>
              <tr>
                <td>O (Objective)</td>
                <td>
                  <div>{{ store.form?.eval_objective || '-' }}</div>
                  <div class="q-mt-sm text-weight-bold text-italic">Kondisi Luka:</div>
                  <ul class="q-pl-md q-my-none">
                    <li>Kerusakan Jaringan: {{ store.form?.eval_kerusakan_jaringan || '-' }}</li>
                    <li>Kemerahan: {{ store.form?.eval_kemerahan || '-' }}</li>
                    <li>Oedem Daerah Incisi: {{ store.form?.eval_oedem_daerah_incici || '-' }}</li>
                    <li>Haematon: {{ store.form?.eval_haematon || '-' }}</li>
                  </ul>
                  <div class="q-mt-sm">
                    Cairan Drainase: {{ store.form?.eval_cairan_drainase || '-' }}
                    <span v-if="store.form?.eval_cairan_drainase === 'Ya' && store.form?.eval_jenis_cariran_drainase">
                      (Jenis: {{ store.form?.eval_jenis_cariran_drainase }})
                    </span>
                  </div>
                  <div class="q-mt-sm text-weight-bold text-italic">Vital Signs Akhir:</div>
                  <ul class="q-pl-md q-my-none">
                    <li>Tensi: {{ store.form?.eval_td_sis ?? '-' }}/{{ store.form?.eval_td_dia ?? '-' }} mmHg</li>
                    <li>Suhu: {{ store.form?.eval_suhu ?? '-' }} °C</li>
                    <li>RR: {{ store.form?.eval_rr ?? '-' }} x/menit</li>
                    <li>HR: {{ store.form?.eval_hr ?? '-' }} x/menit</li>
                    <li>SpO2: {{ store.form?.eval_spo2 ?? '-' }} %</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>A (Assessment)</td>
                <td>Resiko Infeksi: {{ store.form?.eval_a_resiko_infeksi || '-' }}</td>
              </tr>
              <tr>
                <td>P (Plan)</td>
                <td>{{ store.form?.eval_p || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Nurse Signature Section -->
        <div class="row q-mt-lg justify-end">
          <div class="col-4 text-center">
            <div>Probolinggo, {{ store.display?.tanggal_eval || store.display?.tanggal || '-' }}</div>
            <div class="text-weight-bold q-mb-sm">Perawat yang bertugas</div>
            <div v-if="qrUrl" style="height: 100px; width: 100px; margin: 0 auto;" class="q-mb-sm">
              <vue-qrcode :value="qrUrl" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
            <div style="text-decoration: underline;" class="text-weight-bold">
              {{ perawat?.nama || 'Nama Perawat' }}
            </div>
            <div class="f-10">NIP. {{ perawat?.nip || '-' }}</div>
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
import { useAuthStore } from 'src/stores/auth'
import { useAsuhanKeperawatanStore } from 'src/stores/simrs/kamaroperasi/asuhan/asuhanKeperawatan'
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

const store = useAsuhanKeperawatanStore()
const auth = useAuthStore()
const refPrint = ref()

onMounted(async () => {
  await store.getData(props.pasien)
})

const perawat = computed(() => {
  return auth.user?.pegawai || props.pasien?.nakes || null
})

function ambilTidakanOperasi (val) {
  const data = val?.length > 0 ? val?.map(v => v?.mastertindakanoperasi?.rs2).join(', ') : 'Belum ada Tindakan Operasi'
  return data
}

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
  const code = perawat.value?.kdpegsimrs || perawat.value?.nip || perawat.value?.nama || ''
  return generateQRUrl(props.pasien?.noreg, 'Asuhan Keperawatan Perioperatif', code, 'PENUNJANG')
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'ASUHAN KEPERAWATAN PERIOPERATIF',
  popTitle: 'ASUHAN KEPERAWATAN PERIOPERATIF'
}
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
