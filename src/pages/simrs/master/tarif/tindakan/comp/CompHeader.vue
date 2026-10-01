<template>
  <div class="row items-center justify-between q-pa-sm" :class="`${color} text-${textColor}`">
    <div class="row items-center q-gutter-x-sm">
      <q-input
        v-model="q"
        outlined
        dark
        color="white"
        dense
        placeholder="Nama / Kode Tindakan..."
        debounce="500"
        style="min-width: 200px;"
        clearable
      >
        <template #prepend>
          <q-icon name="icon-mat-search" size="xs" />
        </template>
      </q-input>

      <!-- Filter Status Tarif -->
      <q-select
        v-model="selectStatus"
        :options="statusOptions"
        outlined
        dark
        dense
        emit-value
        map-options
        color="white"
        label="Status Tarif"
        style="min-width: 220px;"
      >
        <template #selected-item="scope">
          <div class="ellipsis">
            {{ scope.opt.label }}
          </div>
        </template>
      </q-select>

      <!-- Filter Ruangan -->
      <q-select
        v-model="selectRuangan"
        :options="filteredRuangs"
        outlined
        dark
        dense
        emit-value
        map-options
        clearable
        use-input
        input-debounce="200"
        color="white"
        label="Semua Ruangan"
        option-label="nama"
        option-value="kode"
        style="min-width: 200px;"
        @filter="filterRuanganFn"
      >
        <template #selected-item="scope">
          <div class="ellipsis">
            {{ scope.opt.nama }}
          </div>
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              Tidak ada data ruangan
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="row items-center">
      <q-btn flat color="orange" icon="icon-mat-refresh" size="xs" padding="xs" @click="emits('refresh')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Refresh
        </q-tooltip>
      </q-btn>
      <q-btn class="q-ml-sm" unelevated color="orange" flat size="sm" padding="xs" icon="icon-mat-layers">
        <q-tooltip class="primary" :offset="[10, 10]">
          per Baris List
        </q-tooltip>
        <q-menu transition-show="flip-left" transition-hide="flip-right" anchor="top left" self="top right">
          <q-list dense>
            <q-item v-for="(opt, i) in options" :key="i" v-ripple tag="label">
              <q-radio v-model="selectPerPage" size="xs" :val="opt" :label="opt + ' Baris'" color="primary" />
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <!-- data baru -->
      <q-btn class="q-ml-sm" unelevated round color="white" text-color="primary" size="sm" icon="icon-mat-add" @click="emits('newData')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Tambah Tindakan Baru
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'bg-primary'
  },
  textColor: {
    type: String,
    default: 'white'
  },
  search: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'aktif'
  },
  ruangan: {
    type: String,
    default: ''
  },
  ruangs: {
    type: Array,
    default: () => []
  },
  perPage: {
    type: Number,
    default: 10
  }
})

const emits = defineEmits([
  'newData',
  'setSearch',
  'setStatus',
  'setRuangan',
  'setRow',
  'refresh',
  'getData'
])

const options = ref([5, 10, 20, 50, 100])

const statusOptions = ref([
  { label: '🟢 Aktif Saat Ini', value: 'aktif' },
  { label: '🟢🟡 Aktif & Draft (Untuk Edit)', value: 'aktif_draft' },
  { label: '🟡 Akan Berlaku (Draft)', value: 'draft' },
  { label: '⚪ Riwayat / Usang', value: 'history' },
  { label: '🔴 Dihapus / Non-Aktif', value: 'dihapus' },
  { label: '📑 Semua Data', value: 'semua' }
])

const filteredRuangs = ref([])

watch(
  () => props.ruangs,
  (val) => {
    filteredRuangs.value = val || []
  },
  { immediate: true }
)

function filterRuanganFn (val, update) {
  if (val === '') {
    update(() => {
      filteredRuangs.value = props.ruangs
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    filteredRuangs.value = (props.ruangs || []).filter(
      v => v.nama.toLowerCase().indexOf(needle) > -1 || (v.kode && v.kode.toLowerCase().indexOf(needle) > -1)
    )
  })
}

const q = computed({
  get () {
    return props.search
  },
  set (newVal) {
    emits('setSearch', newVal ?? '')
  }
})

const selectStatus = computed({
  get () {
    return props.status
  },
  set (val) {
    emits('setStatus', val)
  }
})

const selectRuangan = computed({
  get () {
    return props.ruangan
  },
  set (val) {
    emits('setRuangan', val ?? '')
  }
})

const selectPerPage = computed({
  get () {
    return props.perPage
  },
  set (val) {
    emits('setRow', val)
  }
})
</script>
