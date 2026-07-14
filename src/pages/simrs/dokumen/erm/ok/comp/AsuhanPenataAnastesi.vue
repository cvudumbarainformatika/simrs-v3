<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal v-if="!history" title1="ASUHAN KEPENATAAN" title2="ANESTESI" />

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
          <!-- BAGIAN A: PRA ANESTESI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">BAGIAN A: PRA ANESTESI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Diagnosa Pra Anestesi</td>
                <td>{{ store.form?.pra_diagnosa || '-' }}</td>
              </tr>
              <tr>
                <td>Tindakan Operasi</td>
                <td>{{ ambilTindakanOperasi(props.pasien?.manytindakanop) }}</td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-2">Tanda-tanda Vital & Antropometri</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%">Berat Badan (BB)</td>
                <td width="25%">{{ store.form?.pra_bb ? store.form?.pra_bb + ' kg' : '-' }}</td>
                <td width="25%">Tinggi Badan (TB)</td>
                <td width="25%">{{ store.form?.pra_tb ? store.form?.pra_tb + ' cm' : '-' }}</td>
              </tr>
              <tr>
                <td>Golongan Darah</td>
                <td>{{ store.form?.pra_gol_darah || '-' }}</td>
                <td>Keadaan Umum</td>
                <td>{{ store.form?.pra_keadaan_umum || '-' }}</td>
              </tr>
              <tr>
                <td>Tekanan Darah (TD)</td>
                <td>{{ store.form?.pra_td ? store.form?.pra_td + ' mmHg' : '-' }}</td>
                <td>Nadi</td>
                <td>{{ store.form?.pra_nadi ? store.form?.pra_nadi + ' x/menit' : '-' }}</td>
              </tr>
              <tr>
                <td>Respirasi Rate (RR)</td>
                <td>{{ store.form?.pra_rr ? store.form?.pra_rr + ' x/menit' : '-' }}</td>
                <td>Suhu</td>
                <td>{{ store.form?.pra_suhu ? store.form?.pra_suhu + ' °C' : '-' }}</td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="6" class="text-weight-bold title-th bg-grey-2">Hasil Laboratorium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="16%">Hemoglobin (HB)</td>
                <td width="16%">{{ store.form?.pra_hb ? store.form?.pra_hb + ' gr/dl' : '-' }}</td>
                <td width="16%">Hematokrit (HT)</td>
                <td width="16%">{{ store.form?.pra_ht ? store.form?.pra_ht + ' %' : '-' }}</td>
                <td width="16%">GDS</td>
                <td width="16%">{{ store.form?.pra_gds ? store.form?.pra_gds + ' mg/dl' : '-' }}</td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-2">Pemeriksaan Fisik</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Respirasi</td>
                <td>
                  Status: {{ store.form?.pra_respirasi_status || '-' }}
                  <span v-if="store.form?.pra_respirasi_status_keterangan"> ({{ store.form?.pra_respirasi_status_keterangan }})</span>
                  <br />
                  Saturasi (SpO2): {{ store.form?.pra_respirasi_sat ? store.form?.pra_respirasi_sat + ' %' : '-' }}
                </td>
              </tr>
              <tr>
                <td>Kardiovaskuler</td>
                <td>
                  Status: {{ store.form?.pra_kardio_status || '-' }}
                  <span v-if="store.form?.pra_kardio_status_keterangan"> ({{ store.form?.pra_kardio_status_keterangan }})</span>
                  <br />
                  CRT: {{ store.form?.pra_kardio_crt_detik || '-' }} | Kulit: {{ store.form?.pra_kardio_kulit || '-' }}
                  <br />
                  Perdarahan: {{ store.form?.pra_kardio_perdarahan_status || '-' }}
                  <span v-if="store.form?.pra_kardio_perdarahan_status === 'Ada' && store.form?.pra_kardio_perdarahan_cc"> ({{ store.form?.pra_kardio_perdarahan_cc }} cc)</span>
                </td>
              </tr>
              <tr>
                <td>Persyarafan</td>
                <td>
                  Kesadaran: {{ store.form?.pra_kesadaran || '-' }} | GCS: {{ store.form?.pra_gcs || '-' }}
                </td>
              </tr>
              <tr>
                <td>Renal & Hepato</td>
                <td>
                  Renal: {{ store.form?.pra_renal_status || '-' }}
                  <span v-if="store.form?.pra_renal_ket"> (Keterangan: {{ store.form?.pra_renal_ket }})</span>
                  <br />
                  Hepato: {{ store.form?.pra_hepato_status || '-' }}
                  <span v-if="store.form?.pra_hepato_ket"> (Keterangan: {{ store.form?.pra_hepato_ket }})</span>
                </td>
              </tr>
              <tr>
                <td>Muskuloskeletal</td>
                <td>
                  Status: {{ store.form?.pra_muskulo_status || '-' }}
                  <span v-if="store.form?.pra_muskulo_ket"> (Keterangan: {{ store.form?.pra_muskulo_ket }})</span>
                </td>
              </tr>
              <tr>
                <td>Alergi</td>
                <td>
                  Status: {{ store.form?.pra_alergi_status || '-' }}
                  <span v-if="store.form?.pra_alergi_riwayat"> (Riwayat: {{ store.form?.pra_alergi_riwayat }})</span>
                </td>
              </tr>
              <tr>
                <td>Nyeri</td>
                <td>
                  Status: {{ store.form?.pra_nyeri_status || '-' }}
                  <span v-if="store.form?.pra_nyeri_skala"> (Skala: {{ store.form?.pra_nyeri_skala }})</span>
                </td>
              </tr>
              <tr>
                <td>Informed Consent</td>
                <td>{{ store.form?.pra_informed_consent || '-' }}</td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th width="25%" class="text-weight-bold bg-grey-2">Masalah Kesehatan</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Intervensi</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Implementasi</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div v-if="store.form?.pra_masalah_kesehatan?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pra_masalah_kesehatan" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.pra_intervensi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pra_intervensi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.pra_implementasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pra_implementasi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.pra_evaluasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pra_evaluasi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- BAGIAN B: INTRA ANESTESI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">BAGIAN B: INTRA ANESTESI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Waktu Anestesi & Bedah</td>
                <td>
                  Anestesi: Mulai: {{ store.form?.intra_jam_mulai_anestesi || '-' }} s/d Selesai: {{ store.form?.intra_jam_selesai_anestesi || '-' }}
                  <br />
                  Bedah: Mulai: {{ store.form?.intra_jam_mulai_bedah || '-' }} s/d Selesai: {{ store.form?.intra_jam_selesai_bedah || '-' }}
                </td>
              </tr>
              <tr>
                <td>Teknik Anestesi</td>
                <td>
                  <div v-if="store.form?.intra_teknik_anestesi?.length">
                    {{ store.form?.intra_teknik_anestesi.join(', ') }}
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
              <tr>
                <td>Inhalasi</td>
                <td>{{ store.form?.intra_inhalasi || '-' }}</td>
              </tr>
              <tr>
                <td>Posisi Operasi</td>
                <td>
                  <div v-if="store.form?.intra_posisi_operasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(posisi, idx) in store.form?.intra_posisi_operasi" :key="idx">
                        {{ posisi }}
                        <span v-if="posisi === 'Lainnya' && store.form?.intra_posisi_lain"> (Lainnya: {{ store.form?.intra_posisi_lain }})</span>
                      </li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th width="25%" class="text-weight-bold bg-grey-2">Masalah Kesehatan</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Intervensi</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Implementasi</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div v-if="store.form?.intra_masalah_kesehatan?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.intra_masalah_kesehatan" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.intra_intervensi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.intra_intervensi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.intra_implementasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.intra_implementasi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.intra_evaluasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.intra_evaluasi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- BAGIAN C: PASCA ANESTESI -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="2" class="text-weight-bold title-th bg-grey-3">BAGIAN C: PASCA ANESTESI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">RR (Recovery Room)</td>
                <td>
                  Jam Masuk: {{ store.form?.pasca_jam_masuk_rr || '-' }} s/d Jam Keluar: {{ store.form?.pasca_jam_keluar_rr || '-' }}
                </td>
              </tr>
              <tr>
                <td>Tanda-tanda Vital Pasca</td>
                <td>
                  TD: {{ store.form?.pasca_td ? store.form?.pasca_td + ' mmHg' : '-' }} | 
                  Nadi: {{ store.form?.pasca_nadi ? store.form?.pasca_nadi + ' x/menit' : '-' }} | 
                  Suhu: {{ store.form?.pasca_suhu ? store.form?.pasca_suhu + ' °C' : '-' }} | 
                  SpO2: {{ store.form?.pasca_spo2 ? store.form?.pasca_spo2 + ' %' : '-' }}
                </td>
              </tr>
              <tr>
                <td>Pernafasan</td>
                <td>
                  Status: 
                  <span v-if="store.form?.pasca_pernafasan_status?.length">
                    {{ store.form?.pasca_pernafasan_status.join(', ') }}
                  </span>
                  <span v-else>-</span>
                  <br />
                  Pola Nafas: {{ store.form?.pasca_pola_nafas || '-' }}
                </td>
              </tr>
              <tr>
                <td>Scoring</td>
                <td>
                  Steward Score (Anak): {{ store.form?.pasca_steward_score || '-' }}
                  <br />
                  Bromage Score (Spinal Anestesi): {{ store.form?.pasca_bromage_score || '-' }}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="doc-table">
            <thead>
              <tr>
                <th width="25%" class="text-weight-bold bg-grey-2">Masalah Kesehatan</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Intervensi</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Implementasi</th>
                <th width="25%" class="text-weight-bold bg-grey-2">Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div v-if="store.form?.pasca_masalah_kesehatan?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pasca_masalah_kesehatan" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.pasca_intervensi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pasca_intervensi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.pasca_implementasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pasca_implementasi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
                <td>
                  <div v-if="store.form?.pasca_evaluasi?.length">
                    <ul class="q-pl-md q-my-none">
                      <li v-for="(item, idx) in store.form?.pasca_evaluasi" :key="idx">{{ item }}</li>
                    </ul>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Penata Anestesi Signature Section -->
        <div class="row q-mt-lg justify-end">
          <div class="col-4 text-center">
            <div>Probolinggo, {{ store.form?.pasca_jam_keluar_rr ? (store.form?.pasca_jam_keluar_rr.split(' ')[0] || '-') : '-' }}</div>
            <div class="text-weight-bold q-mb-sm">Penata Anestesi</div>
            <div v-if="qrUrl" style="height: 100px; width: 100px; margin: 0 auto;" class="q-mb-sm">
              <vue-qrcode :value="qrUrl" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
            <div style="text-decoration: underline;" class="text-weight-bold">
              {{ penata?.nama || 'Nama Penata Anestesi' }}
            </div>
            <div class="f-10">NIP. {{ penata?.nip || '-' }}</div>
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
import { useAsuhanAnastesiStore } from 'src/stores/simrs/kamaroperasi/asuhan/asuhanAnastesi'
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

const store = useAsuhanAnastesiStore()
const auth = useAuthStore()
const refPrint = ref()

onMounted(async () => {
  await store.getAsuhanAnastesi(props.pasien)
})

const penata = computed(() => {
  return auth.user?.pegawai || props.pasien?.nakes || null
})

function ambilTindakanOperasi (val) {
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
  const code = penata.value?.kdpegsimrs || penata.value?.nip || penata.value?.nama || ''
  return generateQRUrl(props.pasien?.noreg, 'Asuhan Penata Anestesi', code, 'PENUNJANG')
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'ASUHAN KEPENATAAN ANESTESI',
  popTitle: 'ASUHAN KEPENATAAN ANESTESI'
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
