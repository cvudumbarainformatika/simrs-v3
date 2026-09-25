<template>
  <q-page class="q-pa-md bg-grey-1 style-dashboard">
    <div class="row q-col-gutter-lg">

      <!-- Premium SatuSehat Header Card (100% Identik Radiologi) -->
      <div class="col-12">
        <q-card flat class="welcome-card text-white overflow-hidden shadow-10">
          <q-card-section class="q-pa-xl relative-position">
            <div class="z-index-1 row items-center justify-between">
              <div class="col-12 col-md-7">
                <div class="text-h4 text-weight-bold q-mb-xs">Dashboard SatuSehat Kemkes 🇮🇩</div>
                <div class="text-subtitle1 opacity-80">
                  Ringkasan visual dan analitik kepatuhan pengiriman data Rawat Jalan, Rawat Inap, dan IGD ke platform
                  SatuSehat (Periode {{ currentMonthYear }}).
                </div>
                <div class="q-mt-lg flex q-gutter-sm">
                  <!-- Button Laporan Detail (Identik Radiologi) -->
                  <q-btn unelevated rounded color="white" text-color="primary" label="Laporan Detail"
                    icon="icon-mat-assessment" no-caps to="/satset/kunjungan" />
                  <!-- Button Audit Log & Rekonsiliasi -->
                  <q-btn unelevated rounded color="teal-8" text-color="white" label="Audit Log"
                    icon="icon-mat-fact_check" no-caps to="/satset/audit" />
                  <!-- Button Audit Pasien Ganda -->
                  <q-btn unelevated rounded color="indigo-8" text-color="white" label="Audit Pasien Ganda"
                    icon="icon-mat-people_alt" no-caps to="/satset/audit-ganda" />
                  <!-- Button Filter Periode Header -->
                  <q-btn outline rounded color="white" :label="periodeBtnLabel" icon="icon-mat-event" no-caps>
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <div class="q-pa-md bg-white" style="min-width: 280px;">
                        <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">Pilih Rentang Tanggal</div>
                        <div class="q-gutter-sm">
                          <q-input v-model="store.tglAwal" type="date" dense outlined label="Tgl Awal" />
                          <q-input v-model="store.tglAkhir" type="date" dense outlined label="Tgl Akhir" />
                        </div>
                        <div class="row q-gutter-xs q-mt-sm">
                          <q-btn size="xs" color="grey-3" text-color="dark" label="Hari Ini" no-caps
                            @click="setFilterCepat('hari_ini')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="2 Hari" no-caps
                            @click="setFilterCepat('2_hari')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="7 Hari" no-caps
                            @click="setFilterCepat('7_hari')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="30 Hari" no-caps
                            @click="setFilterCepat('30_hari')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="Bulan Ini" no-caps
                            @click="setFilterCepat('bulan_ini')" />
                        </div>
                        <div class="row justify-end q-mt-md">
                          <q-btn v-close-popup label="Terapkan" color="primary" dense class="q-px-md"
                            @click="store.initDashboard()" />
                        </div>
                      </div>
                    </q-popup-proxy>
                  </q-btn>
                  <!-- Button Refresh Data -->
                  <q-btn outline rounded color="white" label="Refresh Data" icon="icon-mat-refresh" no-caps
                    :loading="store.loadingSummary || store.loadingResource" @click="store.initDashboard()" />
                </div>
              </div>
              <div class="col-12 col-md-4 text-right q-mt-md q-mt-md-none">
                <div class="header-stat-box text-center">
                  <div class="text-h6 text-weight-medium">Keberhasilan Pengiriman</div>
                  <div class="text-h2 text-weight-bolder q-my-xs text-white">
                    {{ store.summary?.compliance_rate || '0%' }}
                  </div>
                  <div class="text-caption opacity-80">
                    {{ formatNumber(store.summary?.total_terkirim) }} dari {{
                      formatNumber(store.summary?.total_diproses || store.summary?.total_terkirim) }} Data Diproses
                  </div>
                </div>
              </div>
            </div>
            <!-- Decorative Shapes -->
            <div class="header-shape shape-1"></div>
            <div class="header-shape shape-2"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- =========================================================================
           SECTION 1: RINGKASAN TRANSAKSI FHIR (100% PERSIS SATUSEHAT PORTAL KEMKES)
           ========================================================================= -->
      <div class="col-12">
        <q-card flat class="bg-white border-radius-15 shadow-sm q-pa-lg">

          <!-- Header Bar: Title + Badges + Modul Filters + Period Selector -->
          <div class="row items-center justify-between q-col-gutter-md q-mb-md">

            <!-- Left Side: Title & Info Badge -->
            <div class="col-12 col-lg-5 row items-center q-gutter-sm">
              <span class="text-h6 text-weight-bolder text-grey-9">Ringkasan transaksi FHIR</span>
              <q-badge rounded class="q-px-sm q-py-xs cursor-pointer badge-penjelasan" @click="dialogPenjelasan = true">
                <span class="text-weight-medium">Lihat Penjelasan &rsaquo;</span>
              </q-badge>
            </div>

            <!-- Right Side: Filter Modul (Semua, Rajal, Ranap, IGD) + Periode Dropdown + Date Range -->
            <div class="col-12 col-lg-7 row items-center justify-end q-gutter-sm">

              <!-- Pilihan Filter Modul (Pill Button Group) -->
              <q-btn-toggle v-model="store.filterJenis" no-caps rounded unelevated dense toggle-color="teal-8"
                toggle-text-color="white" color="grey-2" text-color="grey-8" class="q-px-xs text-weight-bold" :options="[
                  { label: 'Semua', value: 'all' },
                  { label: 'Rawat Jalan', value: 'rajal' },
                  { label: 'Rawat Inap', value: 'ranap' },
                  { label: 'IGD', value: 'igd' },
                  { label: 'HD', value: 'hd' }
                ]" @update:model-value="store.setFilterJenis($event)" />

              <!-- Dropdown Periode Cepat -->
              <q-select v-model="selectedPeriodeCepat" dense outlined rounded options-dense class="bg-white"
                style="width: 170px;" :options="[
                  { label: '2 hari ke belakang', value: '2_hari' },
                  { label: 'Hari ini', value: 'hari_ini' },
                  { label: '7 hari ke belakang', value: '7_hari' },
                  { label: '30 hari ke belakang', value: '30_hari' },
                  { label: 'Bulan ini', value: 'bulan_ini' }
                ]" @update:model-value="onSelectPeriodeCepat($event)" />

              <!-- Date Range Display Box with Calendar Popup -->
              <q-btn outline rounded dense color="grey-7" class="q-px-md bg-white text-caption text-weight-medium"
                no-caps>
                <div class="row items-center no-wrap">
                  <span class="q-mr-sm">{{ formattedDateRange }}</span>
                  <q-icon name="icon-mat-event" size="18px" color="grey-7" />
                </div>
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <div class="q-pa-md bg-white" style="min-width: 280px;">
                    <div class="text-subtitle2 text-weight-bold text-teal-8 q-mb-sm">Atur Custom Periode</div>
                    <div class="q-gutter-sm">
                      <q-input v-model="store.tglAwal" type="date" dense outlined label="Tanggal Awal" />
                      <q-input v-model="store.tglAkhir" type="date" dense outlined label="Tanggal Akhir" />
                    </div>
                    <div class="row justify-end q-mt-md">
                      <q-btn v-close-popup label="Terapkan" color="teal-8" dense class="q-px-md"
                        @click="store.initDashboard()" />
                    </div>
                  </div>
                </q-popup-proxy>
              </q-btn>

            </div>
          </div>

          <!-- Subtitle / Last Update Timestamp -->
          <div class="row justify-end q-mb-lg">
            <span class="text-caption text-grey-7">
              Update data terakhir: <b class="text-grey-9">{{ store.lastUpdated || formattedCurrentDate }}</b>
            </span>
          </div>

          <!-- Loading Indicator -->
          <q-inner-loading :showing="store.loadingResource">
            <q-spinner-dots size="40px" color="teal-8" />
          </q-inner-loading>

          <!-- 19 FHIR Resource Cards Grid (4 Kolom Sesuai Screenshot SatuSehat) -->
          <div class="row q-col-gutter-md">
            <div v-for="card in fhirCardList" :key="card.key" class="col-12 col-sm-6 col-md-3">
              <q-card flat class="fhir-resource-card full-height">
                <q-card-section class="q-pa-md column justify-between full-height">
                  <div class="text-body2 text-weight-medium text-grey-8 q-mb-sm">
                    {{ card.label }}
                  </div>
                  <div class="text-h4 text-weight-bolder text-satset-teal">
                    {{ formatFhirValue(store.cardGrid?.[card.key]) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

        </q-card>
      </div>

      <!-- =========================================================================
           SECTION 2: MODUL BREAKDOWN CARDS (Rajal, Ranap, IGD)
           ========================================================================= -->
      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="blue-1" text-color="primary" icon="icon-mat-airline_seat_recline_normal" size="36px"
                  class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Rawat Jalan (Rajal)</div>
                  <div class="text-caption text-grey-6">Poliklinik & Spesialis</div>
                </div>
              </div>
              <q-badge color="primary" class="q-pa-xs text-weight-bold f-12"
                :label="store.detailModul?.rajal?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.rajal?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.rajal?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.rajal?.error) }}</b></div>
            </div>
            <q-linear-progress :value="getRateValue(store.detailModul?.rajal?.rate)" color="primary"
              track-color="blue-1" size="8px" class="q-mt-sm rounded-borders" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="teal-1" text-color="teal-9" icon="icon-mat-hotel" size="36px" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Rawat Inap (Ranap)</div>
                  <div class="text-caption text-grey-6">Ruang Perawatan & Kelas</div>
                </div>
              </div>
              <q-badge color="teal-9" class="q-pa-xs text-weight-bold f-12"
                :label="store.detailModul?.ranap?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.ranap?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.ranap?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.ranap?.error) }}</b></div>
            </div>
            <q-linear-progress :value="getRateValue(store.detailModul?.ranap?.rate)" color="teal-9" track-color="teal-1"
              size="8px" class="q-mt-sm rounded-borders" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="deep-orange-1" text-color="deep-orange" icon="icon-mat-emergency" size="36px"
                  class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Gawat Darurat (IGD)</div>
                  <div class="text-caption text-grey-6">Instalasi Rawat Darurat</div>
                </div>
              </div>
              <q-badge color="deep-orange" class="q-pa-xs text-weight-bold f-12"
                :label="store.detailModul?.igd?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.igd?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.igd?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.igd?.error) }}</b></div>
            </div>
            <q-linear-progress :value="getRateValue(store.detailModul?.igd?.rate)" color="deep-orange"
              track-color="deep-orange-1" size="8px" class="q-mt-sm rounded-borders" />
          </q-card-section>
        </q-card>
      </div>

      <!-- =========================================================================
           SECTION 3: ANALITIK KEPATUHAN & TOP 5 ERROR RESPON
           ========================================================================= -->
      <div class="col-12 col-lg-8">
        <q-card flat class="bg-white border-radius-15 shadow-sm q-pa-md full-height">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bolder text-grey-9">Distribusi Volume Resource Terkirim</div>
                <div class="text-caption text-grey-6">Perbandingan jumlah resource FHIR yang berhasil terbridging</div>
              </div>
              <q-badge color="teal-8" class="q-pa-xs text-weight-bold">
                Total: {{ formatNumber(store.totalResourceTerkirim) }} Resource
              </q-badge>
            </div>
            <div v-if="store.resourceStats && store.resourceStats.length > 0" style="min-height: 280px;">
              <apexchart type="bar" height="280" :options="chartOptionsResources" :series="seriesResources" />
            </div>
            <div v-else class="text-center text-grey-5 q-py-xl">
              Belum ada data resource FHIR pada periode ini
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card flat class="bg-white border-radius-15 shadow-sm q-pa-md full-height">
          <q-card-section>
            <div class="text-h6 text-weight-bolder text-grey-9 q-mb-xs">Top 5 Respon Error</div>
            <div class="text-caption text-grey-6 q-mb-md">Kendala validasi data SatuSehat paling sering</div>

            <div v-if="top5Errors && top5Errors.length > 0">
              <q-list separator dense>
                <q-item v-for="(err, idx) in top5Errors" :key="idx" class="q-py-sm">
                  <q-item-section avatar top style="min-width: 28px;">
                    <q-badge rounded color="negative" :label="idx + 1" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-caption text-grey-9 ellipsis-2-lines">
                      {{ truncateText(err.pesan_error, 45) }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-6">
                      Terjadi sebanyak {{ formatNumber(err.total) }} kali
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div v-else class="text-center text-grey-5 q-py-xl">
              <q-icon name="icon-mat-check_circle" size="36px" color="teal-5" class="q-mb-sm" />
              <div>Tidak ada respon error pada periode ini</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- Dialog Penjelasan FHIR Resource -->
    <q-dialog v-model="dialogPenjelasan">
      <q-card style="min-width: 480px; max-width: 600px;" class="border-radius-15">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-weight-bold text-teal-9">Tentang Transaksi FHIR SatuSehat</div>
          <q-btn v-close-popup icon="icon-mat-close" flat round dense />
        </q-card-section>
        <q-card-section class="q-pa-md text-body2 text-grey-8">
          <p>
            <b>HL7 FHIR (Fast Healthcare Interoperability Resources)</b> adalah standar pertukaran data kesehatan
            digital yang digunakan oleh Kementerian Kesehatan Republik Indonesia pada platform <b>SatuSehat</b>.
          </p>
          <p>
            Setiap kunjungan medis pasien dipecah menjadi beberapa resource standar, antara lain:
          </p>
          <ul class="q-pl-md">
            <li><b>Encounter:</b> Riwayat kunjungan admisi, poli, bangsal, atau IGD.</li>
            <li><b>Condition:</b> Diagnosa medis ICD-10 (utama dan sekunder).</li>
            <li><b>Observation:</b> Tanda vital (TTV), hasil lab, dan observasi fisik.</li>
            <li><b>Procedure:</b> Tindakan medis / keperawatan / operasi ICD-9-CM.</li>
            <li><b>Medication & Dispense:</b> Resep dan pemberian obat berbasis KFA Kemenkes.</li>
            <li><b>ImagingStudy & ServiceRequest:</b> Radiologi DICOM dan order penunjang.</li>
          </ul>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn v-close-popup flat label="Tutup" color="teal-9" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSatsetDashboardStore } from 'src/stores/satset/dashboard'
import { date } from 'quasar'

const store = useSatsetDashboardStore()

const dialogPenjelasan = ref(false)
const selectedPeriodeCepat = ref({ label: '2 hari ke belakang', value: '2_hari' })

/* 19 Standard FHIR Resource Cards List (Urutan Persis Screenshot Kemenkes) */
const fhirCardList = [
  { key: 'Encounter', label: 'Encounter' },
  { key: 'Condition', label: 'Condition' },
  { key: 'Observation', label: 'Observation' },
  { key: 'Procedure', label: 'Procedure' },
  { key: 'Composition', label: 'Composition' },
  { key: 'Medication', label: 'Medication' },
  { key: 'MedicationRequest', label: 'MedicationRequest' },
  { key: 'MedicationDispense', label: 'MedicationDispense' },
  { key: 'AllergyIntolerance', label: 'AllergyIntolerance' },
  { key: 'ImagingStudy', label: 'ImagingStudy' },
  { key: 'ServiceRequest', label: 'ServiceRequest' },
  { key: 'ClinicalImpression', label: 'ClinicalImpression' },
  { key: 'Immunization', label: 'Immunization' },
  { key: 'QuestionnaireResponse', label: 'QuestionnaireResponse' },
  { key: 'MedicationStatement', label: 'MedicationStatement' },
  { key: 'CarePlan', label: 'CarePlan' },
  { key: 'Specimen', label: 'Specimen' },
  { key: 'DiagnosticReport', label: 'DiagnosticReport' },
  { key: 'EpisodeOfCare', label: 'EpisodeOfCare' }
]

const currentMonthYear = computed(() => {
  const now = new Date()
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${months[now.getMonth()]} ${now.getFullYear()}`
})

const periodeBtnLabel = computed(() => {
  if (store.tglAwal === store.tglAkhir) {
    return `Periode: ${date.formatDate(store.tglAwal, 'DD MMM YYYY')}`
  }
  return `Periode: ${date.formatDate(store.tglAwal, 'DD/MM')} - ${date.formatDate(store.tglAkhir, 'DD/MM/YYYY')}`
})

const formattedDateRange = computed(() => {
  return `${date.formatDate(store.tglAwal, 'MMM DD, YYYY')} - ${date.formatDate(store.tglAkhir, 'MMM DD, YYYY')}`
})

const formattedCurrentDate = computed(() => {
  return date.formatDate(Date.now(), 'DD MMMM YYYY, HH:mm') + ' WIB'
})

const top5Errors = computed(() => {
  return (store.topErrors || []).slice(0, 5)
})

onMounted(() => {
  store.initDashboard()
})

function formatFhirValue(val) {
  if (val === undefined || val === null || val === 0) return '-'
  return formatNumber(val)
}

function truncateText(text, maxLen = 40) {
  if (!text) return '-'
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}

function formatNumber(num) {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

function getRateValue(rateStr) {
  if (!rateStr) return 0
  const num = parseFloat(rateStr.replace('%', ''))
  return isNaN(num) ? 0 : num / 100
}

function onSelectPeriodeCepat(opt) {
  setFilterCepat(opt?.value || '2_hari')
}

function setFilterCepat(tipe) {
  const now = Date.now()
  if (tipe === 'hari_ini') {
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(today, today)
  } else if (tipe === '2_hari') {
    const duaHariLalu = date.formatDate(date.subtractFromDate(now, { days: 2 }), 'YYYY-MM-DD')
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(duaHariLalu, today)
  } else if (tipe === '7_hari') {
    const tujuhHariLalu = date.formatDate(date.subtractFromDate(now, { days: 7 }), 'YYYY-MM-DD')
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(tujuhHariLalu, today)
  } else if (tipe === '30_hari') {
    const tigaPuluhHariLalu = date.formatDate(date.subtractFromDate(now, { days: 30 }), 'YYYY-MM-DD')
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(tigaPuluhHariLalu, today)
  } else if (tipe === 'bulan_ini') {
    const awalBulan = date.formatDate(date.startOfDate(now, 'month'), 'YYYY-MM-DD')
    const akhirBulan = date.formatDate(date.endOfDate(now, 'month'), 'YYYY-MM-DD')
    store.setPeriode(awalBulan, akhirBulan)
  }
}

/* =========================================================================
   APEXCHART: Horizontal Bar Chart Resource Distribution
   ========================================================================= */
const seriesResources = computed(() => [
  {
    name: 'Total Resource',
    data: (store.resourceStats || []).map(r => Number(r.total_terkirim) || 0)
  }
])

const chartOptionsResources = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, Roboto, sans-serif'
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%',
      borderRadius: 4,
      distributed: true
    }
  },
  colors: ['#00A896', '#0288D1', '#1976D2', '#0097A7', '#00897B', '#2E7D32', '#558B2F', '#F9A825', '#EF6C00'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '11px', fontWeight: 'bold' }
  },
  xaxis: {
    categories: (store.resourceStats || []).map(r => r.resource_type)
  },
  legend: { show: false }
}))
</script>

<style lang="scss" scoped>
.style-dashboard {
  max-width: 100%;
  overflow-x: hidden;
}

.welcome-card {
  background: linear-gradient(135deg, var(--q-primary) 0%, #0d47a1 100%);
  border-radius: 20px;
  position: relative;
}

.header-stat-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
}

.header-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.shape-1 {
  width: 300px;
  height: 300px;
  right: -50px;
  top: -100px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  right: 150px;
  bottom: -50px;
}

.border-radius-15 {
  border-radius: 15px;
}

/* Badge Lihat Penjelasan (Persis SatuSehat Kemenkes) */
.badge-penjelasan {
  background: #E6F7F5;
  color: #00A896;
  border: 1px solid rgba(0, 168, 150, 0.25);
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #00A896;
    color: #ffffff;
  }
}

/* 19 FHIR Resource Card Style */
.fhir-resource-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  min-height: 105px;
  transition: all 0.25s ease-in-out;

  &:hover {
    border-color: #00A896;
    box-shadow: 0 4px 12px rgba(0, 168, 150, 0.12);
    transform: translateY(-2px);
  }
}

.text-satset-teal {
  color: #00A896 !important;
}

.transition-hover {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
  }
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.opacity-80 {
  opacity: 0.8;
}
</style>
