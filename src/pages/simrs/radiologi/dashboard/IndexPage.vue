<template>
  <q-page class="q-pa-md bg-grey-1 style-dashboard">
    <div class="row q-col-gutter-lg">

      <!-- Premium Radiologi Header Card (Tiru Welcome Card Kepegawaian) -->
      <div class="col-12">
        <q-card flat class="welcome-card text-white overflow-hidden shadow-10">
          <q-card-section class="q-pa-xl relative-position">
            <div class="z-index-1 row items-center justify-between">
              <div class="col-12 col-md-7">
                <div class="text-h4 text-weight-bold q-mb-xs">Dashboard Radiologi 🩻</div>
                <div class="text-subtitle1 opacity-80">
                  Ringkasan visual dan analitik tindakan radiologi, sebaran pasien, serta performa layanan (Periode {{ currentMonthYear }}).
                </div>
                <div class="q-mt-lg flex q-gutter-sm">
                  <q-btn
                    unelevated
                    rounded
                    color="white"
                    text-color="primary"
                    label="Laporan Detail"
                    icon="icon-mat-assessment"
                    no-caps
                    to="/radiologi/laporan"
                  />
                  <q-btn
                    outline
                    rounded
                    color="white"
                    label="Refresh Data"
                    icon="icon-mat-refresh"
                    no-caps
                    @click="store.getDataAll()"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4 text-right q-mt-md-none q-mt-lg">
                <div class="header-stat-box">
                  <div class="text-overline">Total Nota Unik</div>
                  <div class="text-h3 text-weight-bolder">{{ store.totalNotaUnik }}</div>
                  <div class="text-caption text-weight-bold">Update: {{ currentTime }}</div>
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

      <!-- 4 Status Cards (Tiru Stat Card Kepegawaian) -->
      <!-- Card 1: Total Nota Unik -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">TOTAL NOTA UNIK</div>
              <div class="text-h5 text-weight-bolder text-primary">{{ store.totalNotaUnik }}</div>
              <div class="text-caption text-weight-bold text-blue items-center flex q-mt-xs">
                <q-icon name="icon-mat-receipt" size="xs" class="q-mr-xs" />
                Transaksi Terdaftar
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="primary" text-color="white" icon="icon-mat-receipt" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 2: Total Tindakan -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">TOTAL TINDAKAN</div>
              <div class="text-h5 text-weight-bolder text-teal-9">{{ totalPemeriksaan }}</div>
              <div class="text-caption text-weight-bold text-teal items-center flex q-mt-xs">
                <q-icon name="icon-mat-check_circle" size="xs" class="q-mr-xs" />
                Pemeriksaan Selesai
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="teal" text-color="white" icon="icon-mat-biotech" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="teal" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 3: Dokter Peminta -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">DOKTER PEMINTA</div>
              <div class="text-h5 text-weight-bolder text-purple-9">{{ store.filteredDokterMinta.length }}</div>
              <div class="text-caption text-weight-bold text-purple items-center flex q-mt-xs">
                <q-icon name="icon-mat-groups" size="xs" class="q-mr-xs" />
                Dokter / Instansi
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="purple" text-color="white" icon="icon-mat-medical_services" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="purple" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 4: Ruangan Pengirim -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">RUANGAN PENGIRIM</div>
              <div class="text-h5 text-weight-bolder text-orange-9">{{ store.filteredRuangan.length }}</div>
              <div class="text-caption text-weight-bold text-orange-9 items-center flex q-mt-xs">
                <q-icon name="icon-mat-apartment" size="xs" class="q-mr-xs" />
                Poli & Ruang Inap
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="orange-9" text-color="white" icon="icon-mat-apartment" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" color="orange-9" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Visualizations Row 1 (8 cols vs 4 cols) -->
      <div class="col-12 col-md-8">
        <q-card flat class="border-radius-15 shadow-sm full-height">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle1 text-weight-bold">10 Jenis Pemeriksaan Radiologi Terbanyak</div>
            <q-space />
            <q-badge outline color="primary" :label="`${store.filteredPemeriksaan.length} Jenis`" />
          </q-card-section>
          <q-card-section>
            <apexchart type="bar" height="320" :options="chartOptionsTopPemeriksaan" :series="seriesTopPemeriksaan" />
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-box size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <div class="column q-gutter-lg">
          <!-- Donut Chart Sebaran Ruangan -->
          <q-card flat class="border-radius-15 shadow-sm">
            <q-card-section class="q-pb-none text-center">
              <div class="text-subtitle1 text-weight-bold">Sebaran Ruangan Pengirim</div>
            </q-card-section>
            <q-card-section>
              <apexchart type="donut" height="240" :options="chartOptionsSebaranRuangan" :series="seriesSebaranRuangan" />
            </q-card-section>
            <q-inner-loading :showing="store.loading">
              <q-spinner-pie size="50px" color="primary" />
            </q-inner-loading>
          </q-card>

          <!-- Top 5 Pemeriksaan List -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="bg-primary text-white q-pa-sm row items-center">
              <q-icon name="icon-mat-format_list_numbered" size="sm" class="q-mr-sm" />
              <div class="text-subtitle2">Top 5 Tindakan Radiologi</div>
            </q-card-section>
            <q-list separator class="scroll" style="max-height: 200px;">
              <q-item v-for="(p, idx) in top5Pemeriksaan" :key="idx" class="q-py-sm">
                <q-item-section avatar style="min-width: 35px;">
                  <q-avatar size="28px" color="blue-1" text-color="primary" class="text-weight-bold f-12">
                    {{ idx + 1 }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold f-12 text-grey-9 ellipsis">{{ p.nama }}</q-item-label>
                  <q-item-label caption class="f-10 ellipsis">Kode: {{ p.kode || '-' }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip dense color="teal-1" text-color="teal-9" class="text-weight-bold f-10" :label="`${p.total} x`" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

      <!-- Visualizations Row 2 (8 cols vs 4 cols) -->
      <div class="col-12 col-md-8">
        <q-card flat class="border-radius-15 shadow-sm full-height">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Top Dokter / Instansi Peminta Radiologi</div>
            <q-space />
            <q-badge outline color="purple" :label="`${store.filteredDokterMinta.length} Dokter`" />
          </q-card-section>
          <q-card-section>
            <apexchart type="bar" height="320" :options="chartOptionsTopDokterMinta" :series="seriesTopDokterMinta" />
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-box size="50px" color="purple" />
          </q-inner-loading>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <div class="column q-gutter-lg">
          <!-- Pie Chart Dokter Pelaksana -->
          <q-card flat class="border-radius-15 shadow-sm">
            <q-card-section class="q-pb-none text-center">
              <div class="text-subtitle1 text-weight-bold">Dokter Pelaksana Radiologi</div>
            </q-card-section>
            <q-card-section>
              <apexchart type="pie" height="240" :options="chartOptionsDokterLaksana" :series="seriesDokterLaksana" />
            </q-card-section>
            <q-inner-loading :showing="store.loading">
              <q-spinner-pie size="50px" color="orange-9" />
            </q-inner-loading>
          </q-card>

          <!-- Top 5 Ruangan List -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="bg-teal-9 text-white q-pa-sm row items-center">
              <q-icon name="icon-mat-apartment" size="sm" class="q-mr-sm" />
              <div class="text-subtitle2">Top 5 Ruangan Pengirim</div>
            </q-card-section>
            <q-list separator class="scroll" style="max-height: 200px;">
              <q-item v-for="(r, idx) in top5Ruangan" :key="idx" class="q-py-sm">
                <q-item-section avatar style="min-width: 35px;">
                  <q-avatar size="28px" color="teal-1" text-color="teal-9" class="text-weight-bold f-12">
                    {{ idx + 1 }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold f-12 text-grey-9 ellipsis">{{ r.nama }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip dense color="orange-1" text-color="orange-9" class="text-weight-bold f-10" :label="`${r.total} Tindakan`" />
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
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

const store = useLaporanRadiologiStore()

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
})

const currentMonthYear = computed(() => {
  const now = new Date()
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${months[now.getMonth()]} ${now.getFullYear()}`
})

onMounted(() => {
  store.getDataAll()
})

const totalPemeriksaan = computed(() => {
  return (store.filteredPemeriksaan || []).reduce((sum, item) => sum + (Number(item?.total) || 0), 0)
})

const top5Pemeriksaan = computed(() => {
  return (store.filteredPemeriksaan || []).slice(0, 5)
})

const top5Ruangan = computed(() => {
  return (store.filteredRuangan || []).slice(0, 5)
})

/* =========================================================================
   CHART 1: Top 10 Pemeriksaan Radiologi (Horizontal Bar)
   ========================================================================= */
const top10Pemeriksaan = computed(() => {
  return (store.filteredPemeriksaan || []).slice(0, 10)
})

const seriesTopPemeriksaan = computed(() => [
  {
    name: 'Total Tindakan',
    data: top10Pemeriksaan.value.map(i => Number(i.total) || 0)
  }
])

const chartOptionsTopPemeriksaan = computed(() => ({
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
    categories: top10Pemeriksaan.value.map(i => i.nama || 'Tanpa Nama')
  },
  legend: { show: false }
}))

/* =========================================================================
   CHART 2: Sebaran Ruangan / Poli Pengirim (Donut Top 6)
   ========================================================================= */
const top6Ruangan = computed(() => {
  return (store.filteredRuangan || []).slice(0, 6)
})

const seriesSebaranRuangan = computed(() => {
  return top6Ruangan.value.map(i => Number(i.total) || 0)
})

const chartOptionsSebaranRuangan = computed(() => ({
  labels: top6Ruangan.value.map(i => i.nama || 'Tanpa Nama'),
  colors: ['#21BA45', '#F2C037', '#31CCEC', '#C10015', '#00897B', '#1565C0'],
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
            label: 'Total Top 6',
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
          }
        }
      }
    }
  }
}))

/* =========================================================================
   CHART 3: Top 10 Dokter / Instansi Peminta (Vertical Bar)
   ========================================================================= */
const top10DokterMinta = computed(() => {
  return (store.filteredDokterMinta || []).slice(0, 10)
})

const seriesTopDokterMinta = computed(() => [
  {
    name: 'Total Permintaan',
    data: top10DokterMinta.value.map(i => Number(i.total) || 0)
  }
])

const chartOptionsTopDokterMinta = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, Roboto, sans-serif'
  },
  plotOptions: {
    bar: {
      columnWidth: '55%',
      borderRadius: 4,
      distributed: true
    }
  },
  colors: ['#4A148C', '#6A1B9A', '#7B1FA2', '#8E24AA', '#AB47BC', '#BA68C8', '#CE93D8', '#8E24AA', '#9C27B0', '#AA00FF'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '11px', fontWeight: 'bold' }
  },
  xaxis: {
    categories: top10DokterMinta.value.map(i => (i.nama || 'Tanpa Nama').replace('dr. ', '')),
    labels: {
      rotate: -35,
      style: { fontSize: '10px' }
    }
  },
  legend: { show: false }
}))

/* =========================================================================
   CHART 4: Sebaran Dokter Pelaksana (Pie Top 6)
   ========================================================================= */
const top6DokterLaksana = computed(() => {
  return (store.filteredDokterLaksana || []).slice(0, 6)
})

const seriesDokterLaksana = computed(() => {
  return top6DokterLaksana.value.map(i => Number(i.total) || 0)
})

const chartOptionsDokterLaksana = computed(() => ({
  labels: top6DokterLaksana.value.map(i => i.nama || 'Tanpa Nama'),
  colors: ['#E65100', '#EF6C00', '#F57C00', '#FB8C00', '#FF9800', '#FFA726'],
  stroke: { width: 0 },
  legend: { position: 'bottom' }
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
