<template>
  <q-page class="q-pa-md bg-grey-1 style-dashboard">
    <div class="row q-col-gutter-lg">

      <!-- Premium Header Card Banner -->
      <div class="col-12">
        <q-card flat class="welcome-card text-white overflow-hidden shadow-10">
          <q-card-section class="q-pa-xl relative-position">
            <div class="z-index-1 row items-center justify-between">
              <div class="col-12 col-md-8">
                <div class="text-h4 text-weight-bold q-mb-xs flex items-center">
                  <span>Dashboard Rawat Inap</span>
                  <q-chip dense color="white-02" text-color="white" class="q-ml-sm text-caption text-weight-bold">
                    🏥 {{ currentMonthYear }}
                  </q-chip>
                </div>
                <div class="text-subtitle1 opacity-80">
                  Monitor sensus pasien aktif (real-time), tempat tidur (BOR), tren kunjungan, serta indikator keselamatan pasien (Periode {{ currentMonthYear }}).
                </div>

                <!-- Filters & Action Buttons -->
                <div class="q-mt-lg row items-center q-gutter-md">
                  <!-- Filter Ruangan Dropdown -->
                  <div style="min-width: 220px;">
                    <q-select
                      v-model="store.koderuangan"
                      :options="ruanganOptions"
                      emit-value
                      map-options
                      dense
                      outlined
                      bg-color="white"
                      popup-content-class="bg-white text-dark shadow-5"
                      label="Pilih Ruangan Rawat Inap"
                      class="text-weight-bold"
                      @update:model-value="store.getData()"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-meeting_room" color="primary" />
                      </template>
                    </q-select>
                  </div>

                  <q-btn
                    unelevated
                    rounded
                    color="white"
                    text-color="primary"
                    label="Refresh Data"
                    icon="icon-mat-refresh"
                    no-caps
                    class="text-weight-bold"
                    @click="store.getData()"
                  />
                  <q-btn
                    outline
                    rounded
                    color="white"
                    label="Daftar Pasien"
                    icon="icon-mat-groups"
                    no-caps
                    class="text-weight-bold"
                    to="/ranap/pengunjung"
                  />
                </div>
              </div>

              <!-- Header Glassmorphism Stat Box -->
              <div class="col-12 col-md-4 text-right q-mt-md-none q-mt-lg">
                <div class="header-stat-box">
                  <div class="text-overline text-white-7 tracking-wide">BOR (BED OCCUPANCY RATE)</div>
                  <div class="text-h3 text-weight-bolder text-amber-3">{{ store.summary.bor_percent }}%</div>
                  <div class="text-caption text-weight-bold q-mt-xs">
                    {{ store.summary.bed_terisi }} dari {{ store.summary.total_bed }} Bed Terisi
                  </div>
                </div>
              </div>
            </div>
            <!-- Decorative Shapes -->
            <div class="header-shape shape-1"></div>
            <div class="header-shape shape-2"></div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-dots size="50px" color="white" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- 4 Primary KPI Status Cards -->
      <!-- KPI 1: Pasien Aktif -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm overflow-hidden">
          <q-card-section class="row items-center no-wrap">
            <div class="col overflow-hidden">
              <div class="text-overline text-grey-7 ellipsis">PASIEN AKTIF DIRAWAT</div>
              <div class="text-h5 text-weight-bolder text-primary">{{ store.summary.pasien_aktif }}</div>
              <div class="text-caption text-weight-bold text-blue items-center flex q-mt-xs ellipsis">
                <q-icon name="icon-mat-hotel" size="xs" class="q-mr-xs" />
                Sensus Belum Pulang
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="primary" text-color="white" icon="icon-mat-hotel" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- KPI 2: Keterisian Bed -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm overflow-hidden">
          <q-card-section class="row items-center no-wrap">
            <div class="col overflow-hidden">
              <div class="text-overline text-grey-7 ellipsis">KAPASITAS BED</div>
              <div class="text-h5 text-weight-bolder text-teal-9">{{ store.summary.bed_sisa }} <span class="text-caption text-grey-6">Kosong</span></div>
              <div class="text-caption text-weight-bold text-teal items-center flex q-mt-xs ellipsis">
                <q-icon name="icon-mat-single_bed" size="xs" class="q-mr-xs" />
                Total {{ store.summary.total_bed }} Bed
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="teal" text-color="white" icon="icon-mat-single_bed" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="teal" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- KPI 3: Pasien Masuk -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm overflow-hidden">
          <q-card-section class="row items-center no-wrap">
            <div class="col overflow-hidden">
              <div class="text-overline text-grey-7 ellipsis">PASIEN MASUK</div>
              <div class="text-h5 text-weight-bolder text-indigo-9">{{ store.summary.pasien_masuk }}</div>
              <div class="text-caption text-weight-bold text-indigo items-center flex q-mt-xs ellipsis">
                <q-icon name="icon-mat-login" size="xs" class="q-mr-xs" />
                Periode {{ currentMonthYear }}
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="indigo" text-color="white" icon="icon-mat-login" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="indigo" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- KPI 4: Pasien Pulang -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm overflow-hidden">
          <q-card-section class="row items-center no-wrap">
            <div class="col overflow-hidden">
              <div class="text-overline text-grey-7 ellipsis">PASIEN PULANG</div>
              <div class="text-h5 text-weight-bolder text-amber-9">{{ store.summary.pasien_pulang }}</div>
              <div class="text-caption text-weight-bold text-amber-9 items-center flex q-mt-xs ellipsis">
                <q-icon name="icon-mat-logout" size="xs" class="q-mr-xs" />
                Periode {{ currentMonthYear }}
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="amber-9" text-color="white" icon="icon-mat-logout" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="amber-9" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- FENOMENAL UI: Indikator Skrining & Keselamatan Pasien Aktif -->
      <div class="col-12">
        <q-card flat class="border-radius-15 shadow-sm bg-white overflow-hidden">
          <q-card-section class="q-pa-md border-bottom bg-grey-2 row items-center justify-between">
            <div class="text-subtitle1 text-weight-bold text-grey-9 flex items-center">
              <q-icon name="icon-mat-shield" class="q-mr-xs" color="purple-9" size="24px" />
              Indikator Skrining &amp; Keselamatan Pasien Aktif
            </div>
            <q-badge color="purple-1" text-color="purple-10" class="text-weight-bold q-px-sm" label="Sensus Pasien Dirawat Saat Ini" />
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-md">

              <!-- 1. Stempel Stop Kekerasan -->
              <div class="col-12 col-sm-6 col-md">
                <div class="phenomenal-card card-purple flex flex-center column relative-position">
                  <div class="glow-icon bg-purple-2 text-purple-9 flex flex-center">
                    <q-icon name="icon-mat-pan_tool" size="30px" />
                  </div>
                  <div class="text-h3 text-weight-bolder text-purple-10 q-mt-sm">
                    {{ store.indikator_risiko.berisiko_kekerasan }}
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-purple-9 q-mt-xs text-center">
                    Risiko Kekerasan
                  </div>
                  <div class="text-caption text-purple-7 text-center q-mt-xs">
                    Perlindungan Khusus Pasien
                  </div>
                </div>
              </div>

              <!-- 2. Risiko Jatuh -->
              <div class="col-12 col-sm-6 col-md">
                <div class="phenomenal-card card-amber flex flex-center column relative-position">
                  <div class="glow-icon bg-amber-2 text-amber-9 flex flex-center">
                    <q-icon name="icon-mat-warning" size="30px" />
                  </div>
                  <div class="text-h3 text-weight-bolder text-amber-10 q-mt-sm">
                    {{ store.indikator_risiko.resiko_jatuh }}
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-amber-9 q-mt-xs text-center">
                    Risiko Jatuh
                  </div>
                  <div class="text-caption text-amber-7 text-center q-mt-xs">
                    Skala Morse / Humpty / Ontario
                  </div>
                </div>
              </div>

              <!-- 3. Penolakan DNR -->
              <div class="col-12 col-sm-6 col-md">
                <div class="phenomenal-card card-red flex flex-center column relative-position">
                  <div class="glow-icon bg-red-2 text-red-9 flex flex-center">
                    <q-icon name="icon-mat-block" size="30px" />
                  </div>
                  <div class="text-h3 text-weight-bolder text-red-10 q-mt-sm">
                    {{ store.indikator_risiko.penolakan_resusitasi }}
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-red-9 q-mt-xs text-center">
                    Penolakan DNR
                  </div>
                  <div class="text-caption text-red-7 text-center q-mt-xs">
                    Instruksi Resusitasi
                  </div>
                </div>
              </div>

              <!-- 4. Pasien MPP -->
              <div class="col-12 col-sm-6 col-md">
                <div class="phenomenal-card card-blue flex flex-center column relative-position">
                  <div class="glow-icon bg-blue-2 text-blue-9 flex flex-center">
                    <q-icon name="icon-mat-info" size="30px" />
                  </div>
                  <div class="text-h3 text-weight-bolder text-blue-10 q-mt-sm">
                    {{ store.indikator_risiko.pasien_mpp }}
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-blue-9 q-mt-xs text-center">
                    Pasien MPP
                  </div>
                  <div class="text-caption text-blue-7 text-center q-mt-xs">
                    Manajemen Pelayanan Pasien
                  </div>
                </div>
              </div>

              <!-- 5. Alergi Obat/Makanan -->
              <div class="col-12 col-sm-6 col-md">
                <div class="phenomenal-card card-orange flex flex-center column relative-position">
                  <div class="glow-icon bg-orange-2 text-orange-9 flex flex-center">
                    <q-icon name="icon-mat-coronavirus" size="30px" />
                  </div>
                  <div class="text-h3 text-weight-bolder text-orange-10 q-mt-sm">
                    {{ store.indikator_risiko.alergis }}
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-orange-9 q-mt-xs text-center">
                    Alergi Obat/Makanan
                  </div>
                  <div class="text-caption text-orange-7 text-center q-mt-xs">
                    Riwayat Alergi Pasien
                  </div>
                </div>
              </div>

            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Visualizations Row 1 (8 cols vs 4 cols) -->
      <div class="col-12 col-lg-8 col-md-7" style="min-width: 0;">
        <q-card flat class="border-radius-15 shadow-sm full-height overflow-hidden">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Tren Kunjungan Harian (Masuk vs Pulang)</div>
            <q-space />
            <q-badge outline color="primary" :label="`Periode ${currentMonthYear}`" />
          </q-card-section>
          <q-card-section class="overflow-hidden">
            <apexchart type="area" height="320" width="100%" :options="chartOptionsTren" :series="seriesTren" />
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-box size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <div class="col-12 col-lg-4 col-md-5" style="min-width: 0;">
        <div class="column q-gutter-lg">
          <!-- Donut Chart Sistem Bayar -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="q-pb-none text-center">
              <div class="text-subtitle1 text-weight-bold">Distribusi Sistem Bayar (Pasien Aktif)</div>
            </q-card-section>
            <q-card-section class="overflow-hidden">
              <apexchart type="donut" height="240" width="100%" :options="chartOptionsSistemBayar" :series="seriesSistemBayar" />
            </q-card-section>
            <q-inner-loading :showing="store.loading">
              <q-spinner-pie size="50px" color="primary" />
            </q-inner-loading>
          </q-card>

          <!-- Top Cara Pulang List -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="bg-primary text-white q-pa-sm row items-center">
              <q-icon name="icon-mat-meeting_room" size="sm" class="q-mr-sm" />
              <div class="text-subtitle2">Kondisi Cara Pulang Pasien</div>
            </q-card-section>
            <q-list separator>
              <q-item v-for="(cp, idx) in store.cara_pulang" :key="idx" class="q-py-sm">
                <q-item-section avatar style="min-width: 28px;">
                  <q-avatar size="24px" color="blue-1" text-color="primary" class="text-weight-bold f-12">
                    {{ idx + 1 }}
                  </q-avatar>
                </q-item-section>
                <q-item-section style="min-width: 0;" class="overflow-hidden">
                  <q-item-label class="text-weight-bold f-12 text-grey-9 ellipsis">{{ cp.nama }}</q-item-label>
                </q-item-section>
                <q-item-section side style="min-width: 0;">
                  <q-badge color="teal-1" text-color="teal-9" class="text-weight-bold f-10 q-px-xs" :label="`${cp.total} Pasien (${cp.persen}%)`" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

      <!-- Visualizations Row 2 (7 cols vs 5 cols - BOR per Ruangan Proposional) -->
      <div class="col-12 col-lg-7 col-md-7" style="min-width: 0;">
        <q-card flat class="border-radius-15 shadow-sm full-height overflow-hidden">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Keterisian Tempat Tidur (BOR) per Ruangan</div>
            <q-space />
            <q-badge outline color="teal" :label="`${store.keterisian_ruangan.length} Ruangan`" />
          </q-card-section>
          <q-card-section class="overflow-hidden">
            <apexchart type="bar" :height="heightBOR" width="100%" :options="chartOptionsKeterisianRuangan" :series="seriesKeterisianRuangan" />
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-box size="50px" color="teal" />
          </q-inner-loading>
        </q-card>
      </div>

      <div class="col-12 col-lg-5 col-md-5" style="min-width: 0;">
        <div class="column q-gutter-lg">
          <!-- Pie Chart DPJP -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="q-pb-none text-center">
              <div class="text-subtitle1 text-weight-bold">Beban Pasien DPJP Ranap</div>
            </q-card-section>
            <q-card-section class="overflow-hidden">
              <apexchart type="pie" height="240" width="100%" :options="chartOptionsDpjp" :series="seriesDpjp" />
            </q-card-section>
            <q-inner-loading :showing="store.loading">
              <q-spinner-pie size="50px" color="purple" />
            </q-inner-loading>
          </q-card>

          <!-- Top DPJP List -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="bg-purple-9 text-white q-pa-sm row items-center">
              <q-icon name="icon-mat-medical_services" size="sm" class="q-mr-sm" />
              <div class="text-subtitle2">5 DPJP Pasien Terbanyak</div>
            </q-card-section>
            <q-list separator>
              <q-item v-for="(dp, idx) in top5Dpjp" :key="idx" class="q-py-sm">
                <q-item-section avatar style="min-width: 28px;">
                  <q-avatar size="24px" color="purple-1" text-color="purple-9" class="text-weight-bold f-12">
                    {{ idx + 1 }}
                  </q-avatar>
                </q-item-section>
                <q-item-section style="min-width: 0;" class="overflow-hidden">
                  <q-item-label class="text-weight-bold f-12 text-grey-9 ellipsis" style="max-width: 170px;" :title="dp.nama">
                    {{ dp.nama }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side style="min-width: 0;">
                  <q-badge color="purple-1" text-color="purple-9" class="text-weight-bold f-10 q-px-xs" :label="`${dp.total} Pasien`" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDashboardRanapStore } from 'src/stores/simrs/ranap/dashboard'

const store = useDashboardRanapStore()

const currentMonthYear = computed(() => {
  const now = new Date()
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${months[now.getMonth()]} ${now.getFullYear()}`
})

onMounted(() => {
  store.getRuangan()
  store.getData()
})

const ruanganOptions = computed(() => {
  const opts = [{ label: 'SEMUA RUANGAN', value: '' }]
  if (Array.isArray(store.ruangans)) {
    store.ruangans.forEach(r => {
      opts.push({
        label: r.ruang || r.groups_nama || r.nama || r.rs2 || r.groups,
        value: r.kdruangan || r.rs1 || r.groups
      })
    })
  }
  return opts
})

const top5Dpjp = computed(() => {
  return (store.dpjp || []).slice(0, 5)
})

/* Dynamic Height for BOR Horizontal Bar Chart (28px per room) */
const heightBOR = computed(() => {
  const len = store.keterisian_ruangan?.length || 0
  return Math.max(320, len * 28)
})

/* Helper format nama dokter agar legenda chart tidak mencerai-berai layout */
function shortenNamaDokter(nama) {
  if (!nama) return 'Tanpa Nama'
  let clean = nama.replace(/^dr\.\s*/i, '').trim()
  if (clean.length > 22) {
    clean = clean.substring(0, 22) + '...'
  }
  return clean
}

/* =========================================================================
   CHART 1: Tren Kunjungan Harian (Masuk vs Pulang)
   ========================================================================= */
const seriesTren = computed(() => [
  {
    name: 'Pasien Masuk',
    data: (store.tren_kunjungan || []).map(i => i.masuk || 0)
  },
  {
    name: 'Pasien Pulang',
    data: (store.tren_kunjungan || []).map(i => i.pulang || 0)
  }
])

const chartOptionsTren = computed(() => ({
  chart: {
    type: 'area',
    width: '100%',
    redrawOnParentResize: true,
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, Roboto, sans-serif'
  },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#1565C0', '#2E7D32'],
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  xaxis: {
    categories: (store.tren_kunjungan || []).map(i => i.tanggal || ''),
    labels: { rotate: -35, style: { fontSize: '10px' } }
  },
  grid: { borderColor: '#f1f1f1' }
}))

/* =========================================================================
   CHART 2: Sistem Bayar (Donut)
   ========================================================================= */
const seriesSistemBayar = computed(() => {
  return (store.sistem_bayar || []).map(i => i.total || 0)
})

const chartOptionsSistemBayar = computed(() => ({
  chart: {
    type: 'donut',
    width: '100%',
    redrawOnParentResize: true,
    fontFamily: 'Inter, Roboto, sans-serif'
  },
  labels: (store.sistem_bayar || []).map(i => shortenNamaDokter(i.nama)),
  colors: ['#027BE3', '#21BA45', '#F2C037', '#C10015', '#6A1B9A'],
  stroke: { width: 0 },
  legend: { position: 'bottom', fontSize: '10px' },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Pasien',
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
          }
        }
      }
    }
  }
}))

/* =========================================================================
   CHART 3: BOR per Ruangan (Horizontal Bar with constrained Y-Axis width)
   ========================================================================= */
const seriesKeterisianRuangan = computed(() => [
  {
    name: 'Terisi (Bed)',
    data: (store.keterisian_ruangan || []).map(i => i.terisi || 0)
  },
  {
    name: 'Sisa Kosong',
    data: (store.keterisian_ruangan || []).map(i => i.sisa || 0)
  }
])

const chartOptionsKeterisianRuangan = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    width: '100%',
    redrawOnParentResize: true,
    toolbar: { show: false },
    fontFamily: 'Inter, Roboto, sans-serif'
  },
  plotOptions: {
    bar: { horizontal: true, barHeight: '65%', borderRadius: 4 }
  },
  colors: ['#00897B', '#E0E0E0'],
  xaxis: {
    categories: (store.keterisian_ruangan || []).map(i => i.nama || 'Tanpa Nama')
  },
  yaxis: {
    labels: {
      show: true,
      maxWidth: 150,
      style: { fontSize: '10px' }
    }
  },
  legend: { position: 'top' }
}))

/* =========================================================================
   CHART 4: Beban DPJP (Pie Top 5)
   ========================================================================= */
const seriesDpjp = computed(() => {
  return top5Dpjp.value.map(i => i.total || 0)
})

const chartOptionsDpjp = computed(() => ({
  chart: {
    type: 'pie',
    width: '100%',
    redrawOnParentResize: true,
    fontFamily: 'Inter, Roboto, sans-serif'
  },
  labels: top5Dpjp.value.map(i => shortenNamaDokter(i.nama)),
  colors: ['#4A148C', '#7B1FA2', '#AB47BC', '#CE93D8', '#E1BEE7'],
  stroke: { width: 0 },
  legend: { position: 'bottom', fontSize: '10px' }
}))
</script>

<style lang="scss" scoped>
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

.white-02 {
  background: rgba(255, 255, 255, 0.2) !important;
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

.phenomenal-card {
  border-radius: 16px;
  padding: 20px 16px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
  }
}

.glow-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-purple {
  background: linear-gradient(145deg, #f3e5f5 0%, #e1bee7 100%);
  border-color: #ce93d8;
}

.card-amber {
  background: linear-gradient(145deg, #fff8e1 0%, #ffecb3 100%);
  border-color: #ffe082;
}

.card-red {
  background: linear-gradient(145deg, #ffebee 0%, #ffcdd2 100%);
  border-color: #ef9a9a;
}

.card-blue {
  background: linear-gradient(145deg, #e1f5fe 0%, #b3e5fc 100%);
  border-color: #81d4fa;
}

.card-orange {
  background: linear-gradient(145deg, #fff3e0 0%, #ffe0b2 100%);
  border-color: #ffcc80;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.opacity-80 {
  opacity: 0.8;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>
