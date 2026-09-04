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
                  Ringkasan visual dan analitik kepatuhan pengiriman data Rawat Jalan, Rawat Inap, dan IGD ke platform SatuSehat (Periode {{ currentMonthYear }}).
                </div>
                <div class="q-mt-lg flex q-gutter-sm">
                  <!-- Button Laporan Detail (Identik Radiologi) -->
                  <q-btn
                    unelevated
                    rounded
                    color="white"
                    text-color="primary"
                    label="Laporan Detail"
                    icon="icon-mat-assessment"
                    no-caps
                    to="/satset/kunjungan"
                  />
                  <!-- Button Filter Periode -->
                  <q-btn
                    outline
                    rounded
                    color="white"
                    :label="periodeBtnLabel"
                    icon="icon-mat-event"
                    no-caps
                  >
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <div class="q-pa-md bg-white" style="min-width: 280px;">
                        <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">Pilih Rentang Tanggal</div>
                        <div class="q-gutter-sm">
                          <q-input v-model="store.tglAwal" type="date" dense outlined label="Tgl Awal" />
                          <q-input v-model="store.tglAkhir" type="date" dense outlined label="Tgl Akhir" />
                        </div>
                        <div class="row q-gutter-xs q-mt-sm">
                          <q-btn size="xs" color="grey-3" text-color="dark" label="Hari Ini" no-caps @click="setFilterCepat('hari_ini')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="7 Hari" no-caps @click="setFilterCepat('7_hari')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="Bulan Ini" no-caps @click="setFilterCepat('bulan_ini')" />
                        </div>
                        <div class="row justify-end q-mt-md">
                          <q-btn v-close-popup label="Terapkan" color="primary" dense class="q-px-md" @click="store.initDashboard()" />
                        </div>
                      </div>
                    </q-popup-proxy>
                  </q-btn>
                  <!-- Button Refresh Data -->
                  <q-btn
                    outline
                    rounded
                    color="white"
                    label="Refresh Data"
                    icon="icon-mat-refresh"
                    no-caps
                    :loading="store.loadingSummary"
                    @click="store.initDashboard()"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4 text-right q-mt-md-none q-mt-lg">
                <div class="header-stat-box">
                  <div class="text-overline">Kepatuhan Pengiriman</div>
                  <div class="text-h3 text-weight-bolder">{{ store.summary?.compliance_rate || '0%' }}</div>
                  <div class="text-caption text-weight-bold">Update: {{ currentTime }}</div>
                </div>
              </div>
            </div>
            <!-- Decorative Shapes -->
            <div class="header-shape shape-1"></div>
            <div class="header-shape shape-2"></div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-dots size="50px" color="white" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- 4 Status Cards (100% Identik Radiologi) -->
      <!-- Card 1: Total Kunjungan -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">TOTAL KUNJUNGAN</div>
              <div class="text-h5 text-weight-bolder text-primary">{{ formatNumber(store.summary?.total_kunjungan) }}</div>
              <div class="text-caption text-weight-bold text-blue items-center flex q-mt-xs">
                <q-icon name="icon-mat-receipt" size="xs" class="q-mr-xs" />
                Kunjungan SIMRS
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="primary" text-color="white" icon="icon-mat-receipt" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-oval size="20px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 2: Terkirim Sukses -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">TERKIRIM SUKSES</div>
              <div class="text-h5 text-weight-bolder text-teal-9">{{ formatNumber(store.summary?.total_terkirim) }}</div>
              <div class="text-caption text-weight-bold text-teal items-center flex q-mt-xs">
                <q-icon name="icon-mat-check_circle" size="xs" class="q-mr-xs" />
                Bundle Sukses (201)
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="teal" text-color="white" icon="icon-mat-cloud_done" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-oval size="20px" color="teal" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 3: Resource FHIR -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">RESOURCE FHIR</div>
              <div class="text-h5 text-weight-bolder text-purple-9">{{ formatNumber(store.totalResourceTerkirim) }}</div>
              <div class="text-caption text-weight-bold text-purple items-center flex q-mt-xs">
                <q-icon name="icon-mat-hub" size="xs" class="q-mr-xs" />
                Entry Resource Aktif
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="purple" text-color="white" icon="icon-mat-dataset" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingResource">
            <q-spinner-oval size="20px" color="purple" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 4: Gagal / Error -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">GAGAL / ERROR</div>
              <div class="text-h5 text-weight-bolder text-orange-9">{{ formatNumber(store.summary?.total_error) }}</div>
              <div class="text-caption text-weight-bold text-orange-9 items-center flex q-mt-xs">
                <q-icon name="icon-mat-warning" size="xs" class="q-mr-xs" />
                Perlu Tindak Lanjut
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="orange-9" text-color="white" icon="icon-mat-error_outline" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-oval size="20px" color="orange-9" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Visualizations Row (100% Identik Radiologi 8 cols vs 4 cols) -->
      <!-- Left: Horizontal Bar Chart Resource FHIR (8 cols) -->
      <div class="col-12 col-md-8">
        <q-card flat class="border-radius-15 shadow-sm full-height">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Rincian Resource FHIR Terkirim ke SatuSehat</div>
            <q-space />
            <q-badge outline color="primary" :label="`${store.resourceStats.length} Resource`" />
          </q-card-section>
          <q-card-section>
            <div v-if="!store.resourceStats?.length && !store.loadingResource" class="text-center q-pa-xl text-grey-6">
              Belum ada data resource pada periode ini.
            </div>
            <div v-else>
              <apexchart type="bar" height="320" :options="chartOptionsResources" :series="seriesResources" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingResource">
            <q-spinner-box size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Right: Donut Chart & Top 5 Errors List (4 cols) -->
      <div class="col-12 col-md-4">
        <div class="column q-gutter-lg">
          <!-- Donut Chart Komposisi Pengiriman Modul -->
          <q-card flat class="border-radius-15 shadow-sm">
            <q-card-section class="q-pb-none text-center">
              <div class="text-subtitle1 text-weight-bold">Komposisi Pengiriman Modul</div>
            </q-card-section>
            <q-card-section>
              <apexchart type="donut" height="240" :options="chartOptionsDonutModul" :series="seriesDonutModul" />
            </q-card-section>
            <q-inner-loading :showing="store.loadingSummary">
              <q-spinner-pie size="50px" color="primary" />
            </q-inner-loading>
          </q-card>

          <!-- Top 5 Errors List (Identik Top Ruangan Radiologi) -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="bg-teal-9 text-white q-pa-sm row items-center">
              <q-icon name="icon-mat-error_outline" size="sm" class="q-mr-sm" />
              <div class="text-subtitle2">Top 5 Penyebab Error</div>
            </q-card-section>
            <q-list separator class="scroll" style="max-height: 200px;">
              <div v-if="!store.topErrors?.length && !store.loadingErrorStats" class="text-center q-pa-md text-grey-6 text-caption">
                Tidak ada catatan error pada periode ini.
              </div>
              <q-item v-for="(err, idx) in top5Errors" :key="idx" class="q-py-sm items-center no-wrap" style="max-width: 100%; overflow: hidden;">
                <q-item-section avatar style="min-width: 32px; max-width: 32px; flex-shrink: 0;">
                  <q-avatar size="26px" color="teal-1" text-color="teal-9" class="text-weight-bold f-12">
                    {{ idx + 1 }}
                  </q-avatar>
                </q-item-section>
                <q-item-section style="min-width: 0; overflow: hidden; flex: 1 1 auto;">
                  <div class="text-weight-bold f-12 text-grey-9 ellipsis" style="width: 100%; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ truncateText(err.pesan_error, 40) }}
                  </div>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">{{ err.pesan_error }}</q-tooltip>
                </q-item-section>
                <q-item-section side style="flex-shrink: 0;">
                  <q-chip dense color="orange-1" text-color="orange-9" class="text-weight-bold f-10 q-ma-none" :label="`${err.total} Kasus`" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

      <!-- 3 Modul Kepatuhan (Rawat Jalan, Rawat Inap, IGD) -->
      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="blue-1" text-color="primary" icon="icon-mat-medical_services" size="36px" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Rawat Jalan (Rajal)</div>
                  <div class="text-caption text-grey-6">Poliklinik & Spesialis</div>
                </div>
              </div>
              <q-badge color="primary" class="q-pa-xs text-weight-bold f-12" :label="store.detailModul?.rajal?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.rajal?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.rajal?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.rajal?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.rajal?.rate)"
              color="primary"
              track-color="blue-1"
              size="8px"
              class="q-mt-sm rounded-borders"
            />
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
              <q-badge color="teal-9" class="q-pa-xs text-weight-bold f-12" :label="store.detailModul?.ranap?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.ranap?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.ranap?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.ranap?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.ranap?.rate)"
              color="teal-9"
              track-color="teal-1"
              size="8px"
              class="q-mt-sm rounded-borders"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="deep-orange-1" text-color="deep-orange" icon="icon-mat-emergency" size="36px" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Gawat Darurat (IGD)</div>
                  <div class="text-caption text-grey-6">Instalasi Rawat Darurat</div>
                </div>
              </div>
              <q-badge color="deep-orange" class="q-pa-xs text-weight-bold f-12" :label="store.detailModul?.igd?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.igd?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.igd?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.igd?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.igd?.rate)"
              color="deep-orange"
              track-color="deep-orange-1"
              size="8px"
              class="q-mt-sm rounded-borders"
            />
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSatsetDashboardStore } from 'src/stores/satset/dashboard'
import { date } from 'quasar'

const store = useSatsetDashboardStore()

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
})

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

const top5Errors = computed(() => {
  return (store.topErrors || []).slice(0, 5)
})

onMounted(() => {
  store.initDashboard()
})

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

function setFilterCepat(tipe) {
  const now = Date.now()
  if (tipe === 'hari_ini') {
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(today, today)
  } else if (tipe === '7_hari') {
    const tujuhHariLalu = date.formatDate(date.subtractFromDate(now, { days: 7 }), 'YYYY-MM-DD')
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(tujuhHariLalu, today)
  } else if (tipe === 'bulan_ini') {
    const awalBulan = date.formatDate(date.startOfDate(now, 'month'), 'YYYY-MM-DD')
    const akhirBulan = date.formatDate(date.endOfDate(now, 'month'), 'YYYY-MM-DD')
    store.setPeriode(awalBulan, akhirBulan)
  }
}

/* =========================================================================
   APEXCHART 1: Rincian Resource FHIR Terkirim (Horizontal Bar)
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
  colors: ['#027BE3', '#1565C0', '#1976D2', '#0288D1', '#0097A7', '#00897B', '#2E7D32', '#558B2F', '#F9A825', '#EF6C00'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '11px', fontWeight: 'bold' }
  },
  xaxis: {
    categories: (store.resourceStats || []).map(r => r.resource_type)
  },
  legend: { show: false }
}))

/* =========================================================================
   APEXCHART 2: Komposisi Pengiriman Modul (Donut Top 6)
   ========================================================================= */
const seriesDonutModul = computed(() => {
  const rajal = Number(store.detailModul?.rajal?.terkirim) || 0
  const ranap = Number(store.detailModul?.ranap?.terkirim) || 0
  const igd = Number(store.detailModul?.igd?.terkirim) || 0
  if (rajal === 0 && ranap === 0 && igd === 0) return [1]
  return [rajal, ranap, igd]
})

const chartOptionsDonutModul = computed(() => {
  const rajal = Number(store.detailModul?.rajal?.terkirim) || 0
  const ranap = Number(store.detailModul?.ranap?.terkirim) || 0
  const igd = Number(store.detailModul?.igd?.terkirim) || 0
  const isEmpty = rajal === 0 && ranap === 0 && igd === 0

  return {
    labels: isEmpty ? ['Belum Ada Data'] : ['Rawat Jalan', 'Rawat Inap', 'IGD'],
    colors: ['#027BE3', '#21BA45', '#EF6C00'],
    stroke: { width: 0 },
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Sukses',
              formatter: () => formatNumber(store.summary?.total_terkirim || 0)
            }
          }
        }
      }
    }
  }
})
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

.transition-hover {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-5px);
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
