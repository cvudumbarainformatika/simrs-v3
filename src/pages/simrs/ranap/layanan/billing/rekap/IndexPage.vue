<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <q-icon name="icon-mat-receipt_long" size="24px" color="teal" />
          <div class="text-subtitle2 text-bold text-teal">REKAP BILLING PASIEN RAWAT INAP</div>
          <q-badge color="teal" outline class="q-ml-sm" v-if="store.billingData?.header">
            {{ store.billingData?.header?.sistembayar }} ({{ store.billingData?.header?.ruangan }})
          </q-badge>
        </div>

        <div class="row items-center q-gutter-sm">
          <!-- Filter Ruangan Pasien jika ada mutasi -->
          <div v-if="store.billingData?.header?.list_ruangan?.length > 1" style="min-width: 150px;">
            <q-select
              v-model="selectedRuangan"
              :options="store.billingData?.header?.list_ruangan"
              option-label="nama_ruangan"
              option-value="kd_ruangan"
              emit-value
              map-options
              dense
              outlined
              label="Pilih Ruangan"
              @update:model-value="onFilterChange"
            />
          </div>

          <!-- Filter Sistem Bayar jika ada mutasi -->
          <div v-if="store.billingData?.header?.list_sistembayar?.length > 1" style="min-width: 150px;">
            <q-select
              v-model="selectedSistemBayar"
              :options="store.billingData?.header?.list_sistembayar"
              option-label="nama_sistembayar"
              option-value="kd_sistembayar"
              emit-value
              map-options
              dense
              outlined
              label="Pilih Sistem Bayar"
              @update:model-value="onFilterChange"
            />
          </div>

          <!-- Tombol Refresh -->
          <q-btn
            icon="icon-mat-refresh"
            color="primary"
            flat
            round
            dense
            :loading="store.loading"
            @click="loadData"
          >
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>

          <!-- Tombol Cetak -->
          <q-btn
            v-if="store.billingData"
            v-print="printObj"
            color="teal"
            icon="icon-mat-print"
            label="Cetak Faktur Rekap"
            no-caps
            dense
            class="q-px-md"
          />
        </div>
      </div>
    </div>

    <!-- Container Isi Dokumen Billing -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <!-- Loading State -->
      <div v-if="store.loading" class="column flex-center q-pa-xl text-teal">
        <q-spinner-dots size="48px" />
        <div class="q-mt-md text-bold">Memuat Rincian Billing...</div>
      </div>

      <!-- Empty / Not Found State -->
      <div v-else-if="!store.billingData" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-mat-receipt" size="64px" class="q-mb-sm" />
        <div class="text-bold">Data Billing Tidak Tersedia</div>
        <div class="text-caption">Belum ada rincian data billing untuk pasien ini.</div>
      </div>

      <!-- Sheet Dokumen Kertas Cetak A4 / Faktur -->
      <div v-else id="print-billing-ranap" class="document-card print-page bg-white q-pa-md shadow-2 text-dark font-billing">
        
        <!-- KOP RUMAH SAKIT -->
        <div class="row items-center justify-between border-kop q-pb-sm q-mb-sm">
          <div class="row items-center q-gutter-x-md">
            <img src="~assets/logos/logo-rsud.png" class="logo-kop" alt="Logo RS" @error="onImgError" />
            <div>
              <div class="text-bold text-subtitle1" style="line-height: 1.2;">
                UOBK RSUD dr. MOHAMAD SALEH
              </div>
              <div class="text-caption text-grey-9" style="font-size: 11px; line-height: 1.2;">
                Jl. Mayjend Panjaitan No. 65 Probolinggo Jawa Timur
              </div>
              <div class="text-caption text-grey-9" style="font-size: 11px; line-height: 1.2;">
                Telp. (0335) 433478,433119,421118 Fax. (0335) 432702
              </div>
            </div>
          </div>
          <div class="text-right text-caption" style="font-size: 11px;">
            <div>{{ formatTanggalSekarang() }}</div>
            <div class="badge-faktur q-mt-xs">FAKTUR REKAP BY SISTEM BAYAR</div>
          </div>
        </div>

        <!-- HEADER IDENTITAS PASIEN -->
        <div class="q-mb-sm">
          <table class="table-identitas">
            <tbody>
              <tr>
                <td class="label-col">Nama</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.nama }}</td>
                <td class="label-col">No. RM</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.norm }}</td>
              </tr>
              <tr>
                <td class="label-col">Pekerjaan</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.pekerjaan }}</td>
                <td class="label-col">Noreg</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.noreg }}</td>
              </tr>
              <tr>
                <td class="label-col">Umur</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.umur }}</td>
                <td class="label-col">Ruangan</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.ruangan }}</td>
              </tr>
              <tr>
                <td class="label-col">Alamat</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.alamat }}</td>
                <td class="label-col">Ongkos Perwt/hari</td>
                <td class="sep-col">:</td>
                <td class="val-col">Rp. {{ rp(headerData?.ongkos_per_hari) }}</td>
              </tr>
              <tr>
                <td class="label-col">Tanggal Masuk</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.tglmasuk }}</td>
                <td class="label-col">Dokter</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.dokter }}</td>
              </tr>
              <tr>
                <td class="label-col">Tgl. Keluar/Hidup/Mati</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.tglkeluar }}</td>
                <td class="label-col">Sistem Bayar</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.sistembayar }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- GARIS DOUBLE ATAS TABEL -->
        <div class="border-top-double q-my-xs"></div>

        <!-- TABEL RINCIAN ITEM BILLING -->
        <table class="table-billing full-width">
          <tbody>
            <!-- 1. Administrasi -->
            <tr class="row-item">
              <td class="col-no">1</td>
              <td class="col-desc" colspan="7">Administrasi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.administrasi) }}</td>
            </tr>

            <!-- 2. Akomodasi / Kamar -->
            <tr class="row-item">
              <td class="col-no">2</td>
              <td class="col-desc" colspan="7">Akomodasi / Kamar</td>
              <td class="col-curr"></td>
              <td></td>
            </tr>
            <tr v-if="rincian?.akomodasi?.items?.length">
              <td></td>
              <td width="30"></td>
              <td colspan="6" class="q-pr-none">
                <table class="sub-table-kamar">
                  <tbody>
                    <tr v-for="(kamar, kIdx) in rincian.akomodasi.items" :key="kIdx">
                      <td class="text-left" nowrap>{{ kamar.kelas }}</td>
                      <td width="10">:</td>
                      <td class="text-right" width="25">{{ kamar.jml }}</td>
                      <td class="text-left" width="30">hari</td>
                      <td class="text-center" width="15">@</td>
                      <td class="text-right" width="60" nowrap>{{ rp(kamar.biaya) }}</td>
                      <td class="text-right" width="25">Rp.</td>
                      <td class="text-right col-subtotal-kamar" width="80" nowrap>{{ rp(kamar.subtotal) }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.akomodasi?.total) }}</td>
            </tr>
            <tr v-else>
              <td></td>
              <td colspan="7"></td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.akomodasi?.total) }}</td>
            </tr>

            <!-- 3. Jasa / Tindakan Dokter -->
            <tr class="row-item">
              <td class="col-no">3</td>
              <td class="col-desc" colspan="7">Jasa / Tindakan Dokter</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.tindakan_dokter) }}</td>
            </tr>

            <!-- 4. Visite / Konsultasi / Oncall Dokter -->
            <tr class="row-item">
              <td class="col-no">4</td>
              <td class="col-desc" colspan="7">Visite / Konsultasi / Oncall Dokter</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.visite_dokter) }}</td>
            </tr>

            <!-- 5. Tindakan Keperawatan -->
            <tr class="row-item">
              <td class="col-no">5</td>
              <td class="col-desc" colspan="7">Tindakan Keperawatan</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.tindakan_perawat) }}</td>
            </tr>

            <!-- 6. Asuhan Gizi -->
            <tr class="row-item">
              <td class="col-no">6</td>
              <td class="col-desc" colspan="7">Asuhan Gizi ( Selama dirawat)</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.asuhan_gizi) }}</td>
            </tr>

            <!-- 7. Makan Pasien -->
            <tr class="row-item">
              <td class="col-no">7</td>
              <td class="col-desc" colspan="7">Makan Pasien</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.makan_pasien) }}</td>
            </tr>

            <!-- 8. Biaya Oksigen -->
            <tr class="row-item">
              <td class="col-no">8</td>
              <td class="col-desc" colspan="7">Biaya Oksigen</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.oksigen) }}</td>
            </tr>

            <!-- 9. Jasa Keperawatan -->
            <tr class="row-item">
              <td class="col-no">9</td>
              <td class="col-desc" colspan="7">Jasa Keperawatan</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.jasa_keperawatan) }}</td>
            </tr>

            <!-- 10. Biaya Pelayanan Penunjang -->
            <tr class="row-item">
              <td class="col-no">10</td>
              <td class="col-desc" colspan="7">Biaya Pelayanan Penunjang :</td>
              <td class="col-curr"></td>
              <td></td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Laboratorium</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.laboratorium) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Radiologi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.radiologi) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Operasi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.operasi) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Fisioterapi</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.fisioterapi) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Hemodialisa / Cardio / EEG</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.hemodialisa_cardio_eeg) }}</td>
            </tr>
            <!-- Penunjang Dinamis (seperti Anestesi Di Luar OK & ICU) -->
            <tr v-for="(pLain, pIdx) in rincian?.penunjang?.penunjang_lain" :key="'pl-'+pIdx" class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">{{ pLain.nama }}</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(pLain.subtotal) }}</td>
            </tr>
            <tr class="row-penunjang">
              <td colspan="2"></td>
              <td class="col-desc" colspan="6">Biaya Penggunaan Darah</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.penunjang?.penggunaan_darah) }}</td>
            </tr>

            <!-- 11. Biaya Farmasi / Obat -->
            <tr class="row-item">
              <td class="col-no">11</td>
              <td class="col-desc" colspan="7">Biaya Farmasi / Obat (Tidak Termasuk IGD)</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.farmasi) }}</td>
            </tr>

            <!-- 12. IRD -->
            <tr class="row-item">
              <td class="col-no">12</td>
              <td class="col-desc" colspan="7">IRD</td>
              <td class="col-curr">Rp.</td>
              <td class="col-val">{{ rp(rincian?.ird) }}</td>
            </tr>

            <!-- TOTAL KESELURUHAN -->
            <tr class="row-grand-total">
              <td colspan="8" class="text-right text-bold font-large q-pr-md">
                TOTAL
              </td>
              <td class="col-curr text-bold font-large">Rp.</td>
              <td class="col-val text-bold font-large">
                {{ formatRp(store.billingData?.grand_total) }}
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBillingRanapStore } from 'src/stores/simrs/ranap/billing'
import { formatRp } from 'src/modules/formatter'
import { date } from 'quasar'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  },
  menu: {
    type: Object,
    default: () => null
  }
})

const store = useBillingRanapStore()

const selectedRuangan = ref(null)
const selectedSistemBayar = ref(null)

const headerData = computed(() => store.billingData?.header || {})
const rincian = computed(() => store.billingData?.rincian || {})

const printObj = {
  id: 'print-billing-ranap',
  popTitle: 'Faktur Rekap Billing Pasien Ranap'
}

/**
 * Fungsi pembantu yang identik dengan fungsi rp() di legacy PHP:
 * Jika nilai 0 atau kosong, return string kosong agar baris tidak berbiaya tetap bersih
 */
function rp(value) {
  if (!value || Number(value) === 0) {
    return ''
  }
  return formatRp(value)
}

function formatTanggalSekarang() {
  return date.formatDate(new Date(), 'DD/MM/YYYY HH:mm:ss')
}

function onImgError(e) {
  e.target.style.display = 'none'
}

function loadData() {
  if (props.pasien?.noreg) {
    store.getRekapBilling(props.pasien, {
      flagruangan: selectedRuangan.value,
      flagsistembayar: selectedSistemBayar.value
    })
  }
}

function onFilterChange() {
  loadData()
}

watch(() => props.pasien?.noreg, (newVal) => {
  if (newVal) {
    selectedRuangan.value = null
    selectedSistemBayar.value = null
    loadData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.pasien?.noreg && !store.billingData) {
    loadData()
  }
})
</script>

<style lang="scss" scoped>
.document-card {
  width: 210mm;
  min-height: 297mm;
  padding: 8mm;
  margin: 0 auto;
  border-radius: 2px;
  box-sizing: border-box;
}

.font-billing {
  font-family: 'Tahoma', 'Roboto', 'Segoe UI', Arial, sans-serif;
  font-size: 14px;
  color: #000;
}

.logo-kop {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.border-kop {
  border-bottom: 2px solid #999;
}

.border-top-double {
  border-top: 3px double #006699;
}

.badge-faktur {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 3px 5px;
  font-size: 11px;
  background: #fff;
}

.table-identitas {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  td {
    padding: 1px 2px;
    vertical-align: top;
  }

  .label-col {
    width: 150px;
  }

  .sep-col {
    width: 10px;
  }

  .val-col {
    width: 35%;
  }
}

.table-billing {
  border-collapse: collapse;
  font-size: 14px;

  tr {
    vertical-align: top;
  }

  td {
    padding: 1px 2px;
  }

  .col-no {
    width: 25px;
    text-align: left;
  }

  .col-desc {
    text-align: left;
  }

  .col-curr {
    width: 35px;
    text-align: left;
  }

  .col-val {
    width: 120px;
    text-align: right;
    border-bottom: 1px dotted #006699;
    white-space: nowrap;
  }

  .col-subtotal-kamar {
    border-bottom: 1px dotted #006699;
  }

  .row-grand-total td {
    padding-top: 6px;
    padding-bottom: 6px;
    border-top: 3px double #006699;
    border-bottom: 1px dotted #006699;
  }

  .font-large {
    font-size: 14px;
  }
}

.sub-table-kamar {
  border-collapse: collapse;
  font-size: 14px;
  td {
    padding: 0 2px;
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }

  .no-print {
    display: none !important;
  }

  .print-page {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 8mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
</style>
