<template>
  <div class="row items-center justify-between q-pa-sm" :class="`${color} text-${textColor}`">
    <div class="row">
      <q-input v-model="q" outlined dark color="white" dense placeholder="Cari Kunjungan ..." debounce="500" />

      <q-select v-model="store.params.status" dense outlined dark color="white" :options="store.statuses" label="Status"
        class="q-ml-sm" emit-value map-options style="min-width: 150px;" @update:model-value="(val) => {
          // console.log('header status val ', val);
          store.params.page = 1
          store.getKunjunganRanap()
        }" />
      <div class="q-ml-sm" v-if="store.params.status === 'Pulang'">
        <q-btn outline color="white" class="bg-primary" size="md" no-caps>
          <div class="flex items-center q-mx-xs">
            <div class="f-12 q-mr-sm">
              {{ store?.periode }}
            </div>
            <transition>
              <q-icon :name="`${showMenuPeriode ? 'icon-mat-keyboard_arrow_up' : 'icon-mat-keyboard_arrow_down'}`"
                size="16px" />
            </transition>
          </div>

          <q-menu dark @show="showMenuPeriode = true" @hide="showMenuPeriode = false">
            <div class="row no-wrap q-pa-sm">
              <q-list style="min-width: 100px">
                <q-item v-for="item in store?.periods" :key="item" clickable :active="item === store?.periode"
                  active-class="bg-primary text-white" :disable="item === 'Custom'" @click="store.setPeriode(item)">
                  <q-item-section>{{ item }}</q-item-section>
                </q-item>
              </q-list>
              <q-separator vertical inset />

              <div class="column">
                <div class="row q-pa-sm q-col-gutter-sm">
                  <div class="col">
                    <q-date dark v-model="store.params.to" minimal bordered flat mask="YYYY-MM-DD"
                      @update:model-value="store.setPeriode('Custom')" />
                    <div class="f-10 text-grey-8 q-mt-xs">
                      DARI TANGGAL : <b>{{ store.params.to }}</b>
                    </div>
                  </div>
                  <div class="col">
                    <q-date dark v-model="store.params.from" minimal bordered flat mask="YYYY-MM-DD"
                      @update:model-value="store.setPeriode('Custom')" />
                    <div class="f-10 text-grey-8 q-mt-xs">
                      SAMPAI TANGGAL : <b>{{ store.params.to }}</b>
                    </div>
                  </div>
                </div>
                <q-separator />
                <div class="row q-pa-sm justify-end">
                  <q-btn v-close-popup color="primary" label="Terapkan" push size="sm" @click="goTo" />
                </div>
              </div>
            </div>
          </q-menu>
        </q-btn>

      </div>

      <q-select v-model="store.ruangan" dense outlined dark color="white" :options="store.ruangans" label="Ruangan"
        class="q-ml-sm" emit-value map-options option-value="groups" option-label="groups_nama"
        style="min-width: 150px;" @update:model-value="store.gantiRuangan" />

      <!-- <q-select v-model="periode" dense outlined dark color="white" :options="periods" label="Periode" class="q-ml-sm"
        emit-value map-options style="min-width: 150px;" @update:model-value="gantiPeriode" /> -->
      <!-- <q-select v-model="txt" dense outlined dark color="white" :options="txts" label="status pasien" class="q-ml-sm"
        emit-value map-options style="min-width: 150px;" /> -->
    </div>
    <div>

      <!-- per_page -->
      <q-btn flat :color="textColor" icon="icon-mat-dashboard" size="xs" padding="xs" @click="emits('filter')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Filter
        </q-tooltip>
      </q-btn>
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
              <!-- <q-item-section> -->
              <q-radio v-model="selectPerPage" size="xs" :val="opt" :label="opt + ' Baris'" color="primary" />
              <!-- </q-item-section> -->
              <!-- <q-item-label /> -->
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <!-- fullscreen -->
      <q-btn flat :color="textColor" :icon="!fullscreen ? 'icon-mat-open_in_full' : 'icon-mat-close_fullscreen'"
        size="xs" padding="xs" @click="emits('fullscreen')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Fullscreen
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { dateDbFormat } from 'src/modules/formatter'
import { date } from 'quasar'
import { computed, onMounted, ref } from 'vue'
const txt = ref('SEMUA')
const txts = ref(['SEMUA', 'TERLAYANI', 'BELUM TERLAYANI'])
const emits = defineEmits(['fullscreen', 'setTanggal', 'setSearch', 'setRow', 'setPeriode', 'refresh', 'filter'])
const options = ref([5, 10, 20, 50, 100])
const periods = ref([
  { value: 1, label: 'Hari ini' },
  { value: 2, label: 'Minggu Ini' },
  { value: 3, label: 'Bulan Ini' },
  { value: 4, label: 'Tahun Ini' }
])
const showMenuPeriode = ref(false)

const periode = ref(1)
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
  perPage: { type: Number, default: 10 },
  tanggal: {
    type: String,
    default: dateDbFormat(new Date())
  },
  fullscreen: { type: Boolean, default: false },
  store: { type: Object, default: null }
})

// const popup = ref()

const to = ref(dateDbFormat(new Date()))
const from = ref(dateDbFormat(new Date()))

function hariIni() {
  const cDate = new Date()
  to.value = dateDbFormat(cDate)
  from.value = dateDbFormat(cDate)
}
function mingguIni() {
  const curr = new Date()
  const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
  const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
  to.value = dateDbFormat(firstday)
  from.value = dateDbFormat(lastday)
}
function bulanIni() {
  const curr = new Date()
  const firstday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-01'
  const lastday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-31'
  to.value = dateDbFormat(firstday)
  from.value = dateDbFormat(lastday)
}

function tahunIni() {
  const curr = new Date()
  const firstday = date.formatDate(curr, 'YYYY') + '-01' + '-01'
  const lastday = date.formatDate(curr, 'YYYY') + '-12' + '-31'
  to.value = dateDbFormat(firstday)
  from.value = dateDbFormat(lastday)
}

function gantiPeriode(val) {
  if (val === 1) {
    hariIni()
  } else if (val === 2) {
    mingguIni()
  } else if (val === 3) {
    bulanIni()
  } else {
    tahunIni()
  }

  console.log(to.value)
  console.log(from.value)
  const per = {
    to: to.value,
    from: from.value
  }
  emits('setPeriode', per)
}

onMounted(() => {
  hariIni()
})

onMounted(() => {
  Promise.all([
    props.store.getRuangan()
  ])
})

const q = computed({
  get() {
    return props.search
  },
  set(newVal) {
    emits('setSearch', newVal)
  }
})


const goTo = () => {
  props.store.params.page = 1
  props.store.getKunjunganRanap()
}
</script>
