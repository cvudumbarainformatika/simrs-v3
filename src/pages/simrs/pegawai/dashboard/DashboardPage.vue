<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-lg">
      <!-- Premium Admin Header -->
      <div class="col-12">
        <q-card flat class="welcome-card text-white overflow-hidden shadow-10">
          <q-card-section class="q-pa-xl relative-position">
            <div class="z-index-1 row items-center justify-between">
              <div class="col-12 col-md-7">
                <div class="text-h4 text-weight-bold q-mb-xs">Dashboard Kepegawaian 🏥</div>
                <div class="text-subtitle1 opacity-80">Ringkasan kehadiran dan aktifitas pegawai hari ini. Monitor
                  kinerja SDM dengan lebih mudah.</div>
                <div class="q-mt-lg flex q-gutter-sm">
                  <q-btn unelevated rounded color="white" text-color="primary" label="Rekap Absensi"
                    icon="icon-mat-assessment" no-caps to="/pegawai/rekap/report" />
                  <q-btn outline rounded color="white" label="Manajemen User" icon="icon-mat-manage_accounts" no-caps
                    to="/pegawai/user/list" />
                </div>
              </div>
              <div class="col-12 col-md-4 text-right q-mt-md-none q-mt-lg">
                <div class="header-stat-box">
                  <div class="text-overline">Total Seluruh Pegawai</div>
                  <div class="text-h3 text-weight-bolder">{{ store.summary.total_pegawai }}</div>
                  <div class="text-caption text-weight-bold">Update: {{ currentTime }}</div>
                </div>
              </div>
            </div>
            <!-- Shapes -->
            <div class="header-shape shape-1"></div>
            <div class="header-shape shape-2"></div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-dots size="50px" color="white" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Admin Status Cards -->
      <div v-for="(stat, index) in store.adminStats" :key="index" class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">{{ stat.label }}</div>
              <div class="text-h5 text-weight-bolder" :class="`text-${stat.color}`">{{ stat.value }}</div>
              <div :class="`text-caption text-weight-bold ${stat.trendColor} items-center flex`">
                <q-icon :name="stat.trendIcon" size="xs" class="q-mr-xs" />
                {{ stat.trendText }}
              </div>
            </div>
            <div class="col-auto">
              <q-avatar :color="stat.color" text-color="white" :icon="stat.icon" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-oval size="20px" :color="stat.color" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Visualizations Row -->
      <div class="col-12 col-md-8">
        <q-card flat class="border-radius-15 shadow-sm full-height">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Trend Kehadiran Pegawai (Harian)</div>
            <q-space />
            <q-badge outline color="primary" label="1 Minggu Terakhir" />
          </q-card-section>
          <q-card-section>
            <apexchart type="area" height="320" :options="chartOptionsTrend" :series="store.seriesTrend" />
          </q-card-section>
          <q-inner-loading :showing="store.loading">
            <q-spinner-box size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <div class="column q-gutter-lg">
          <!-- Donut Chart -->
          <q-card flat class="border-radius-15 shadow-sm">
            <q-card-section class="q-pb-none text-center">
              <div class="text-subtitle1 text-weight-bold">Komposisi Absensi</div>
            </q-card-section>
            <q-card-section>
              <apexchart type="donut" height="240" :options="chartOptionsDonut" :series="store.seriesDonut" />
            </q-card-section>
            <q-inner-loading :showing="store.loading">
              <q-spinner-pie size="50px" color="primary" />
            </q-inner-loading>
          </q-card>

          <!-- Online List -->
          <q-card flat class="presence-card border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="bg-primary text-white q-pa-sm row items-center">
              <q-icon name="icon-mat-online_prediction" size="sm" class="q-mr-sm" />
              <div class="text-subtitle2">Admin Login</div>
              <q-space />
              <q-badge color="accent">{{ usersOnline.length }} Online</q-badge>
            </q-card-section>
            <q-list separator class="scroll" style="max-height: 200px;">
              <TransitionGroup name="list">
                <q-item v-for="user in usersOnline" :key="user.id" class="q-py-sm">
                  <q-item-section avatar>
                    <q-avatar size="35px" color="teal-2" text-color="primary">
                      <img v-if="user.foto" :src="user.foto">
                      <span v-else>{{ user.nama.charAt(0) }}</span>
                      <q-badge floating color="green" rounded />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold f-12 text-grey-9">{{ user.nama }}
                    </q-item-label>
                    <q-item-label caption class="f-10 ellipsis">{{ user.jabatan || 'Kepegawaian' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </TransitionGroup>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { laravelEcho } from 'src/modules/newsockets'
import { useAdminDashboardStore } from 'src/stores/simrs/pegawai/dashboard/admin'
import { onMounted, ref, computed, watch } from 'vue'

const store = useAdminDashboardStore()
const usersOnline = ref([])
const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
})

const chartOptionsTrend = ref({
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 4 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
  xaxis: { categories: store.categoriesTrend },
  yaxis: { labels: { formatter: (v) => `${v}%` } },
  colors: ['#027BE3'],
  grid: { borderColor: '#f1f1f1' }
})

watch(() => store.categoriesTrend, (newVal) => {
  chartOptionsTrend.value = {
    ...chartOptionsTrend.value,
    xaxis: { categories: newVal }
  }
})

const chartOptionsDonut = ref({
  labels: ['Hadir', 'Terlambat', 'Izin/Sakit', 'Alpha'],
  colors: ['#21BA45', '#F2C037', '#31CCEC', '#C10015'],
  stroke: { width: 0 },
  legend: { position: 'bottom' },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: { show: true, label: 'Total Absen', formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) }
        }
      }
    }
  }
})

onMounted(() => {
  store.getData()
  subscribedChannel()
})

function subscribedChannel() {
  const channel = laravelEcho.join('presence.chat.simpeg')
  channel.here((users) => { usersOnline.value = [...users] })
    .joining((user) => { usersOnline.value.push(user) })
    .leaving((user) => { usersOnline.value = usersOnline.value.filter(x => x.id !== user.id) })
}
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

/* Animations for Online List */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
