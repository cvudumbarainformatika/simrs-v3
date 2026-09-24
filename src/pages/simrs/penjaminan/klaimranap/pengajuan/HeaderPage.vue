<template>
  <div class="row justify-between items-center q-pa-sm">
    <div class="row items-center q-gutter-sm">
      <div>
        <q-input
          v-model="store.params.q"
          placeholder="Cari Pasien (Nama/RM/Noreg)..."
          dense
          outlined
          dark
          color="white"
          style="min-width: 220px;"
          debounce="800"
          :loading="store.loading"
          @update:model-value="store.search"
        >
          <template #prepend>
            <q-icon name="icon-mat-search" />
          </template>
          <template v-if="store.params.q" #append>
            <q-icon name="icon-mat-close" class="cursor-pointer" @click="store.search('')" />
          </template>
        </q-input>
      </div>

      <q-select
        v-model="store.params.bulan"
        dense
        outlined
        dark
        color="white"
        :options="periods"
        label="Bulan"
        emit-value
        map-options
        style="min-width: 140px;"
        @update:model-value="store.getData"
      />

      <q-select
        v-model="store.params.tahun"
        dense
        outlined
        dark
        color="white"
        :options="tahunOptions"
        label="Tahun"
        emit-value
        map-options
        style="min-width: 110px;"
        @update:model-value="store.getData"
      />

      <!-- Filter Ruangan Ranap -->
      <q-btn-dropdown
        class="glossy"
        color="teal"
        :label="selectedRuanganLabel"
      >
        <div class="q-pa-xs bg-grey-2">
          <q-input
            v-model="searchRuangan"
            dense
            outlined
            autofocus
            placeholder="Cari Ruangan..."
            style="min-width: 250px;"
          >
            <template #prepend>
              <q-icon name="icon-mat-search" size="xs" />
            </template>
            <template v-if="searchRuangan" #append>
              <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click="searchRuangan = ''" />
            </template>
          </q-input>
        </div>
        <q-separator />
        <q-list class="scroll" style="max-height: 300px; min-width: 250px;">
          <q-item
            v-close-popup
            clickable
            :active="store.params.kdruangan === ''"
            active-class="bg-teal-1 text-teal-10 text-weight-bold"
            @click="pilihRuangan({ kode: '', nama: 'SEMUA RUANGAN' })"
          >
            <q-item-section avatar>
              <q-avatar icon="icon-mat-meeting_room" color="teal" text-color="white" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>SEMUA RUANGAN</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-for="row in filteredRuangans"
            :key="row.kode"
            v-close-popup
            clickable
            :active="store.params.kdruangan === row.kode"
            active-class="bg-teal-1 text-teal-10 text-weight-bold"
            @click="pilihRuangan(row)"
          >
            <q-item-section avatar>
              <q-avatar icon="icon-mat-hotel" color="primary" text-color="white" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ row?.nama }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div>
      <q-btn
        unelevated
        color="orange"
        flat
        size="sm"
        padding="xs"
        icon="icon-mat-refresh"
        @click="store.refresh"
      >
        <q-tooltip class="primary" :offset="[10, 10]">
          Refresh Data
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useKlaimRanapPenjaminanStore } from 'src/stores/simrs/penjaminan/klaimranap'

const store = useKlaimRanapPenjaminanStore()

const periods = ref([
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
])

const tahunOptions = ref([])
const searchRuangan = ref('')

const selectedRuanganLabel = computed(() => {
  if (!store.params.kdruangan) return 'SEMUA RUANGAN'
  const match = store.ruangans.find(r => r.kode === store.params.kdruangan)
  return match?.nama || store.params.kdruangan
})

const filteredRuangans = computed(() => {
  if (!searchRuangan.value) return store.ruangans
  const q = searchRuangan.value.toLowerCase()
  return store.ruangans.filter(r => (r.nama || '').toLowerCase().includes(q))
})

function pilihRuangan(ruangan) {
  store.setRuangan(ruangan.kode)
}

onMounted(() => {
  const curYear = new Date().getFullYear()
  for (let i = curYear - 5; i <= curYear + 1; i++) {
    tahunOptions.value.push({ value: i, label: String(i) })
  }
})
</script>
