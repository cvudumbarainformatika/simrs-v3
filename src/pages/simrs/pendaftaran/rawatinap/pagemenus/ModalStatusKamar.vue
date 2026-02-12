<template>
  <q-dialog persistent backdrop-filter="blur(4px)" @show="getData">
    <q-card style="width: 90vw; max-width: 1200px; height: 90vh; max-height: 90vh; overflow: hidden;" class="column">

      <!-- Header -->
      <q-card-section class="row items-center q-pb-none bg-primary text-white q-pa-sm">
        <div class="text-subtitle1 text-weight-bold items-center flex q-gutter-md">
          <div><q-icon name="icon-mat-bedroom_parent" size="sm" /></div>
          <div>Ketersediaan Kamar Rawat Inap</div>
        </div>
        <q-space />
        <q-btn icon="icon-mat-refresh" flat round dense @click="getData" :loading="loading">
          <q-tooltip>Refresh Data</q-tooltip>
        </q-btn>
        <q-btn icon="icon-mat-close" flat round dense v-close-popup>
          <q-tooltip>Tutup</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-separator />

      <!-- Search Input & Filters -->
      <div class="q-pa-sm bg-white border-bottom-primary">
        <div class="row items-center q-gutter-md">
          <div class="col-grow">
            <q-input v-model="search" dense outlined color="primary" placeholder="Cari Nama Ruangan..." clearable
              :loading="loading">
              <template v-slot:prepend>
                <q-icon name="icon-mat-search" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="q-mt-sm row q-gutter-xs scroll-x no-wrap">
          <q-btn dense no-caps unelevated :color="selectedClass === 'all' ? 'primary' : 'grey-3'"
            :text-color="selectedClass === 'all' ? 'white' : 'grey-8'" label="Semua Kelas"
            @click="selectedClass = 'all'" class="q-px-md" />
          <q-btn v-for="cls in uniqueClasses" :key="cls" dense no-caps unelevated
            :color="selectedClass === cls ? 'primary' : 'grey-3'"
            :text-color="selectedClass === cls ? 'white' : 'grey-8'" :label="cls" @click="selectedClass = cls"
            class="q-px-md" />
        </div>
      </div>

      <q-separator />

      <!-- Content -->
      <q-card-section class="col scroll bg-grey-2 q-pa-md">

        <!-- Loading State -->
        <div v-if="loading" class="column flex-center fit">
          <q-spinner-hourglass color="primary" size="4em" />
          <div class="text-grey-7 q-mt-md text-h6">Memuat Data Ketersediaan Kamar...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="column flex-center fit">
          <q-icon name="icon-mat-error_outline" color="negative" size="4em" />
          <div class="text-negative q-mt-md text-h6">Gagal Memuat Data</div>
          <div class="text-grey-7">{{ errorMessage }}</div>
          <q-btn label="Coba Lagi" color="primary" icon="icon-mat-refresh" outline class="q-mt-lg" @click="getData" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredItems.length" class="column flex-center fit">
          <div v-if="items.length">
            <q-icon name="icon-mat-search_off" color="grey-5" size="4em" />
            <div class="text-grey-5 q-mt-md text-h6">Pencarian Tidak Ditemukan</div>
          </div>
          <div v-else>
            <q-icon name="icon-mat-meeting_room" color="grey-5" size="4em" />
            <div class="text-grey-5 q-mt-md text-h6">Tidak Ada Data Kamar Tersedia</div>
          </div>
        </div>

        <!-- Data Grid -->
        <div v-else class="row q-col-gutter-md">
          <div v-for="(category, index) in groupedItems" :key="index" class="col-12 q-mb-lg">
            <div class="text-h6 q-mb-sm text-primary text-weight-bold border-bottom-primary">
              {{ category.name }}
            </div>

            <div class="row q-col-gutter-md">
              <div v-for="(room, rIndex) in category.rooms" :key="rIndex" class="col-12 col-sm-6 col-md-4 col-lg-3">
                <q-card class="my-card fit column transition-hover">

                  <!-- Card Header: Room Name & Type -->
                  <q-card-section class="bg-white q-pa-sm row items-center justify-between">
                    <div class="text-subtitle2 text-weight-bold text-grey-9 ellipsis" style="max-width: 70%;">
                      {{ room.ruang }}
                    </div>
                    <q-badge :color="getBadgeColor(room.jenis)" class="q-py-xs q-px-sm shadow-1">
                      {{ room.jenis }}
                    </q-badge>
                  </q-card-section>

                  <q-separator />

                  <!-- Card Body: Stats -->
                  <q-card-section class="col q-pa-md">
                    <div class="row q-col-gutter-sm text-center">
                      <!-- Total -->
                      <div class="col-3">
                        <div class="text-caption text-grey-7">Total</div>
                        <div class="text-subtitle1 text-weight-bold text-blue-8">{{ room.total
                          }}</div>
                      </div>
                      <!-- Terisi -->
                      <div class="col-3">
                        <div class="text-caption text-grey-7">Terisi</div>
                        <div class="text-subtitle1 text-weight-bold text-orange-8">{{
                          room.terisi }}</div>
                      </div>
                      <!-- Rusak (if any) -->
                      <div class="col-3" v-if="parseInt(room.rusak) > 0">
                        <div class="text-caption text-grey-7">Rusak</div>
                        <div class="text-subtitle1 text-weight-bold text-red-8">{{ room.rusak }}
                        </div>
                      </div>
                      <div class="col-3" v-else>
                        <div class="text-caption text-grey-4">Rusak</div>
                        <div class="text-subtitle1 text-weight-bold text-grey-4">-</div>
                      </div>

                      <!-- Sisa -->
                      <div class="col-3">
                        <div class="text-caption text-grey-7">Sisa</div>
                        <div class="text-subtitle1 text-weight-bold"
                          :class="parseInt(room.sisa) > 0 ? 'text-green-8' : 'text-red-8'">
                          {{ room.sisa }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>

                  <q-separator />

                  <!-- Card Footer: Status Bar -->
                  <q-linear-progress size="8px" :value="getProgressValue(room)" :color="getProgressColor(room)"
                    track-color="grey-3" />

                </q-card>
              </div>
            </div>
          </div>
        </div>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'

const loading = ref(false)
const items = ref([])
const error = ref(false)
const errorMessage = ref('')
const search = ref('')
const selectedClass = ref('all')

const getData = async () => {
  loading.value = true
  error.value = false
  errorMessage.value = ''
  items.value = []

  try {
    const response = await api.get('v1/simrs/pendaftaran/ranap/cek-tt')
    console.log('API Response:', response)

    if (response?.data?.tempat_tidur) {
      items.value = response.data.tempat_tidur
    } else {
      // Fallback if data structure is different, adjust based on actual API response
      items.value = response.data || []
    }

  } catch (err) {
    console.error('Error fetching bed availability:', err)
    error.value = true
    errorMessage.value = err.response?.data?.message || err.message || 'Terjadi kesalahan saat memuat data.'
  } finally {
    loading.value = false
  }
}

const uniqueClasses = computed(() => {
  const classes = items.value.map(item => item.jenis).filter(Boolean)
  return [...new Set(classes)].sort()
})

const filteredItems = computed(() => {
  let result = items.value

  // Filter by Class Button
  if (selectedClass.value !== 'all') {
    result = result.filter(item => item.jenis === selectedClass.value)
  }

  // Filter by Search (Room Name Only)
  if (search.value) {
    const lowerSearch = search.value.toLowerCase()
    result = result.filter(item => {
      const ruang = String(item.ruang || '').toLowerCase()
      return ruang.includes(lowerSearch)
    })
  }

  return result
})

// Helper to group by logic if needed, currently assumes flat list or can be adapted
// If the API returns a flat list and we want to group by 'ruang' prefix or just show as grid
// For now, let's treat it as a single group 'Semua Ruangan' if no specific grouping logic provided,
// or we can group by 'jenis' (Class). Let's try grouping by 'jenis' or just list them.
// The user sample showed "RUANG AB", "RUANG CD". Let's group by Class/Jenis for better organization.

const groupedItems = computed(() => {
  if (!filteredItems.value.length) return []

  // Group keys can be 'jenis'
  const groups = {}
  filteredItems.value.forEach(item => {
    const key = item.jenis || 'Lainnya'
    if (!groups[key]) {
      groups[key] = {
        name: `Kelas ${key}`, // Or just key
        rooms: []
      }
    }
    groups[key].rooms.push(item)
  })

  // Convert to array and sort if needed
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))
})


// Helpers for styling
const getBadgeColor = (jenis) => {
  const j = String(jenis).toLowerCase()
  if (j.includes('vip')) return 'purple'
  if (j.includes('1') || j.includes('satu')) return 'blue'
  if (j.includes('2') || j.includes('dua')) return 'teal'
  if (j.includes('3') || j.includes('tiga')) return 'green'
  if (j.includes('iso')) return 'orange'
  if (j.includes('icu') || j.includes('hcu')) return 'red'
  return 'grey-8'
}

const getProgressValue = (room) => {
  const total = parseInt(room.total)
  const terisi = parseInt(room.terisi)
  if (!total) return 0
  return terisi / total
}

const getProgressColor = (room) => {
  const sisa = parseInt(room.sisa)
  if (sisa === 0) return 'negative' // Red if full
  if (sisa < 3) return 'warning' // Orange if running low
  return 'positive' // Green if available
}

</script>

<style lang="scss" scoped>
.my-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

.border-bottom-primary {
  border-bottom: 2px solid var(--q-primary);
  display: inline-block;
  padding-bottom: 4px;
}

.transition-hover {
  transition: transform 0.2s;
}

/* Custom scrollbar for the card section */
.scroll::-webkit-scrollbar {
  width: 8px;
}

.scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.scroll::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
