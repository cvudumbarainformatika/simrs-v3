<template>
  <q-page class="homecare-page q-pa-md">
    <section class="hero q-mb-md">
      <div>
        <div class="row items-center no-wrap q-gutter-sm">
          <q-avatar color="white" text-color="primary" icon="icon-mat-home_health" size="42px" />
          <div>
            <div class="text-h6 text-weight-bold">Kasir Homecare</div>
            <div class="text-caption text-blue-1">Daftar kunjungan dan status pembayaran pasien</div>
          </div>
        </div>
      </div>
      <q-btn unelevated color="white" text-color="primary" icon="icon-mat-refresh" label="Muat ulang" :loading="store.loading" @click="store.getLists" />
    </section>

    <q-card flat bordered class="filter-card q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="text-subtitle2 text-weight-bold q-mb-sm">Filter kunjungan</div>
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-5">
            <q-input v-model="search" outlined dense clearable debounce="500" bg-color="white" label="Cari nama, No. RM, atau No. Registrasi" @update:model-value="store.setQ(search || '')">
              <template #prepend><q-icon name="icon-mat-search" color="primary" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-input v-model="tanggal" outlined dense bg-color="white" label="Tanggal kunjungan">
              <template #append>
                <q-icon name="icon-mat-event" color="primary" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale"><q-date v-model="tanggal" mask="YYYY-MM-DD" /></q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-select v-model="status" outlined dense emit-value map-options bg-color="white" label="Status layanan" :options="statusOptions" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mb-md">
      <div v-for="stat in stats" :key="stat.label" class="col-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap q-pa-sm">
            <q-avatar :color="stat.color" text-color="white" :icon="stat.icon" size="38px" />
            <div class="q-ml-sm">
              <div class="text-h6 text-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-grey-7">{{ stat.label }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="list-card">
      <q-card-section class="row items-center justify-between q-py-sm">
        <div>
          <div class="text-subtitle1 text-weight-bold">Pasien Homecare</div>
          <div class="text-caption text-grey-7">{{ store.meta?.total || 0 }} data ditemukan</div>
        </div>
        <q-badge color="primary" rounded class="q-px-sm q-py-xs">Kasir</q-badge>
      </q-card-section>
      <q-separator />

      <q-card-section v-if="store.loading" class="q-pa-xl text-center">
        <q-spinner color="primary" size="2.5em" />
        <div class="q-mt-sm text-grey-7">Memuat data pasien...</div>
      </q-card-section>

      <q-card-section v-else-if="!store.items.length" class="q-pa-xl text-center text-grey-7">
        <q-icon name="icon-mat-folder_off" size="48px" color="grey-5" />
        <div class="q-mt-sm text-subtitle2">Belum ada pasien Homecare</div>
        <div class="text-caption">Ubah filter atau pilih tanggal lain.</div>
      </q-card-section>

      <q-list v-else padding class="patient-list">
        <q-item v-for="item in store.items" :key="item.id" clickable v-ripple class="patient-item q-pa-md q-mb-sm" @click="openPayment(item)">
          <q-item-section avatar top>
            <app-avatar-pasien :pasien="item.masterpasien || item" />
          </q-item-section>
          <q-item-section>
            <div class="row items-center q-gutter-sm">
              <q-item-label class="text-subtitle1 text-weight-bold">{{ item.nama || item.masterpasien?.rs2 || 'Nama pasien belum tersedia' }}</q-item-label>
              <q-badge outline color="primary">RM {{ item.norm }}</q-badge>
              <q-badge outline color="teal">{{ patientGender(item) }}</q-badge>
              <q-badge outline color="orange">{{ patientAge(item) }}</q-badge>
            </div>
            <q-item-label caption class="q-mt-xs">
              <q-icon name="icon-mat-confirmation_number" size="15px" /> {{ item.noreg }}
              <span class="q-mx-xs">|</span>
              <q-icon name="icon-mat-account_balance_wallet" size="15px" /> {{ item.sistem_bayar || '-' }}
            </q-item-label>
            <div class="row q-col-gutter-sm q-mt-xs text-caption text-grey-8">
              <div class="col-auto"><q-icon name="icon-mat-medical_services" color="negative" /> {{ item.dokter?.nama || 'DPJP belum ditentukan' }}</div>
              <div class="col-auto"><q-icon name="icon-mat-home_health" color="teal" /> {{ item.nama_admin_layanan || item.poli?.rs2 || 'Homecare' }}</div>
            </div>
          </q-item-section>
          <q-item-section side top class="status-area">
            <q-badge rounded :color="item.tgl_lunas ? 'positive' : 'negative'" :label="item.tgl_lunas ? 'Sudah Lunas' : 'Belum Lunas'" />
            <q-badge outline class="q-mt-xs" :color="item.tgl_selesai ? 'positive' : 'grey-7'" :label="item.tgl_selesai ? 'Selesai' : 'Proses'" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator v-if="store.meta" />
      <q-card-actions v-if="store.meta" class="q-px-md q-py-sm" align="between">
        <span class="text-caption text-grey-7">Halaman {{ store.meta.current_page || 1 }} dari {{ store.meta.last_page || 1 }}</span>
        <q-pagination v-model="page" :max="store.meta.last_page || 1" :max-pages="6" direction-links boundary-links color="primary" active-color="secondary" />
      </q-card-actions>
    </q-card>
    <DialogPembayaranPage v-model="paymentDialog" :patient="selectedPatient" @saved="store.getLists" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useKasirHomecareStore } from 'src/stores/simrs/kasir/homecare/homecare'
import DialogPembayaranPage from './comp/DialogPembayaranPage.vue'

const store = useKasirHomecareStore()
const search = ref(store.params.q)
const paymentDialog = ref(false)
const selectedPatient = ref(null)
const statusOptions = [
  { label: 'Semua kunjungan', value: 'SEMUA' },
  { label: 'Terlayani', value: 'TERLAYANI' },
  { label: 'Belum terlayani', value: 'BELUM TERLAYANI' }
]
const tanggal = computed({ get: () => store.params.tgl, set: value => store.setDate(value) })
const status = computed({ get: () => store.params.flag, set: value => store.setFlag(value) })
const page = computed({ get: () => store.params.page, set: value => store.setPage(value) })
const stats = computed(() => {
  const items = store.items || []
  return [
    { label: 'Total pasien', value: store.meta?.total || items.length, color: 'primary', icon: 'icon-mat-groups' },
    { label: 'Belum lunas', value: items.filter(item => !item.tgl_lunas).length, color: 'negative', icon: 'icon-mat-pending_actions' },
    { label: 'Sudah lunas', value: items.filter(item => item.tgl_lunas).length, color: 'positive', icon: 'icon-mat-verified' },
    { label: 'Selesai layanan', value: items.filter(item => item.tgl_selesai).length, color: 'teal', icon: 'icon-mat-task_alt' }
  ]
})

onMounted(() => store.getLists())

function openPayment (patient) {
  selectedPatient.value = patient
  paymentDialog.value = true
}
function patientGender (patient) {
  const gender = patient?.kelamin || patient?.masterpasien?.rs17
  return gender === 'L' ? 'Laki-laki' : (gender === 'P' ? 'Perempuan' : (gender || 'Jenis kelamin -'))
}

function patientAge (patient) {
  const birthDate = patient?.tgllahir || patient?.masterpasien?.tgllahir || patient?.masterpasien?.rs16
  if (!birthDate) return 'Usia -'
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return 'Usia -'
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const beforeBirthday = today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  if (beforeBirthday) age--
  return age >= 0 ? age + ' tahun' : 'Usia -'
}
</script>

<style lang="scss" scoped>
.homecare-page { background: #f4f7fb; min-height: 100%; }
.hero { background: linear-gradient(110deg, #164f9e, #2377c9); border-radius: 14px; color: white; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 7px 18px rgba(31, 89, 157, .2); }
.filter-card, .list-card, .stat-card { border-radius: 12px; }
.filter-card { background: #fbfdff; }
.stat-card { min-height: 62px; }
.patient-item { border: 1px solid #e5ebf3; border-radius: 10px; transition: .15s ease; }
.patient-item:hover { border-color: #8ab5e6; box-shadow: 0 4px 12px rgba(29, 88, 154, .09); }
.status-area { min-width: 104px; align-items: flex-end; }
@media (max-width: 599px) { .hero { align-items: flex-start; gap: 12px; flex-direction: column; } .hero .q-btn { width: 100%; } .status-area { margin-top: 10px; } }
</style>
