<template>
  <div class="row justify-between items-center q-pa-sm">
    <div class="row items-center">
      <div>
        <q-input v-model="store.params.q" placeholder="Cari Pasien ..." dense outlined dark color="white"
          style="min-width:200px" debounce="800" :loading="store.loading" @update:model-value="store.search">
          <template #prepend>
            <q-icon name="icon-mat-search" />
          </template>
        </q-input>
      </div>
      <q-select v-model="store.params.bulan" dense outlined dark color="white" :options="periods" label="Bulan"
        class="q-ml-sm" emit-value map-options style="min-width: 150px;" @update:model-value="store.getData" />
      <q-select v-model="store.params.tahun" dense outlined dark color="white" :options="tahun" label="Tahun"
        class="q-ml-sm" emit-value map-options style="min-width: 150px;" @update:model-value="store.getData" />
      <q-select v-model="store.params.pelayanan" dense outlined dark color="white" :options="pelayanan"
        label="Pelayanan" class="q-ml-sm" emit-value map-options style="min-width: 150px;"
        @update:model-value="gantiPelayanan" />
      <q-btn-dropdown
        v-if="store.params.pelayanan === 2"
        class="glossy q-ml-sm"
        color="orange"
        :label="poli?.polirs ?? 'SEMUA POLI'"
      >
        <div class="q-pa-xs bg-grey-2">
          <q-input
            v-model="searchPoli"
            dense
            outlined
            autofocus
            placeholder="Cari Poli..."
            style="min-width: 250px;"
          >
            <template #prepend>
              <q-icon name="icon-mat-search" size="xs" />
            </template>
            <template v-if="searchPoli" #append>
              <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click="searchPoli = ''" />
            </template>
          </q-input>
        </div>
        <q-separator />
        <q-list class="scroll" style="max-height: 300px; min-width: 250px;">
          <q-item
            v-for="row in filteredPolis"
            :key="row.kodepoli"
            v-close-popup
            clickable
            @click="gantiPoli(row)"
          >
            <q-item-section avatar>
              <q-avatar icon="icon-mat-medical_information" color="primary" text-color="white" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ row?.polirs }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div>
      <q-btn class="q-ml-sm" unelevated color="orange" flat size="sm" padding="xs" icon="icon-mat-refresh"
        @click="store.refresh">
        <q-tooltip class="primary" :offset="[10, 10]">
          Refresh Data
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useKlaimPenjaminanStore } from 'src/stores/simrs/penjaminan/klaim'
import { useSettingsAplikasi } from 'src/stores/simrs/settings'

const store = useKlaimPenjaminanStore()
const setting = useSettingsAplikasi()
const tahun = ref([])

const poli = ref({
  kodepoli: 'SEMUA POLI',
  polirs: 'SEMUA POLI'
})

const polis = computed(() => {
  const arr = setting.polis ? [...setting.polis] : []
  const adaSemua = arr.some(x => x?.kodepoli === 'SEMUA POLI')
  if (!adaSemua) {
    arr.push({
      kodepoli: 'SEMUA POLI',
      polirs: 'SEMUA POLI'
    })
  }
  return arr
})

const searchPoli = ref('')
const filteredPolis = computed(() => {
  if (!searchPoli.value) return polis.value
  const q = searchPoli.value.toLowerCase()
  return polis.value.filter(x => x?.polirs?.toLowerCase().includes(q))
})

function gantiPoli(row) {
  poli.value = row
  store.params.kodepoli = row?.kodepoli === 'SEMUA POLI' ? '' : row?.kodepoli
  store.params.page = 1
  store.getData()
}

function gantiPelayanan(val) {
  store.params.pelayanan = val
  store.params.page = 1
  if (val === 2) {
    store.params.kodepoli = poli.value?.kodepoli === 'SEMUA POLI' ? '' : (poli.value?.kodepoli ?? '')
  } else {
    store.params.kodepoli = ''
  }
  store.getData()
}

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
  { value: 12, label: 'Desember' },

])

const pelayanan = ref([
  { value: 1, label: 'IGD' },
  { value: 2, label: 'RAWAT JALAN' }
])


onMounted(() => {
  setting.getHeaderPoli()
  const tahunSekarang = new Date().getFullYear()
  const tahunMulai = 2024

  // Buat array tahun
  for (let i = tahunMulai; i <= tahunSekarang; i++) {
    tahun.value.push(i)
  }

  // const per = {
  //   bulan: bulan.value,
  //   tahun: tahun.value,
  // }
  // emits('setPeriode', per)
})

</script>
