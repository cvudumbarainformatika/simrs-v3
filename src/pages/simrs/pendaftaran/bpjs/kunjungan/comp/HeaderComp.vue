<template>
  <div class="row items-center justify-between q-pa-sm" :class="`${color} text-${textColor}`">
    <div class="row">
      <q-input v-model="q" outlined dark color="white" dense placeholder="Cari Kunjungan ..." debounce="500" />
      <q-btn outline class="bg-primary q-px-xs" padding="sm" size="sm" no-caps>
        <div class="flex items-center q-mx-xs">
          <div class="f-12 q-mr-sm">
            {{ periode }}
          </div>
          <transition>
            <q-icon :name="`${showMenuPeriode ? 'icon-mat-keyboard_arrow_up' : 'icon-mat-keyboard_arrow_down'}`"
              size="16px" />
          </transition>
        </div>

        <q-menu @show="showMenuPeriode = true" @hide="showMenuPeriode = false">
          <div class="row no-wrap q-pa-sms">
            <q-list style="min-width: 100px">
              <q-item v-for="item in periods" :key="item" clickable :active="item === periode"
                active-class="bg-primary text-white" :disable="item === 'Custom'" @click="setPeriode(item)">
                <q-item-section>{{ item }}</q-item-section>
              </q-item>
            </q-list>
            <q-separator vertical inset />

            <div class="column">
              <div class="row q-pa-sm q-col-gutter-sm">
                <div class="col">
                  <q-date v-model="from" minimal bordered flat mask="YYYY-MM-DD"
                    @update:model-value="setPeriode('Custom')" />
                  <div class="f-10 text-grey-8 q-mt-xs">
                    DARI TANGGAL : <b>{{ from }}</b>
                  </div>
                </div>
                <div class="col">
                  <q-date v-model="to" minimal bordered flat mask="YYYY-MM-DD"
                    @update:model-value="setPeriode('Custom')" />
                  <div class="f-10 text-grey-8 q-mt-xs">
                    SAMPAI TANGGAL : <b>{{ to }}</b>
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row q-pa-sm justify-end">
                <q-btn v-close-popup color="primary" label="Terapkan" push size="sm" @click="getData()" />
              </div>
            </div>
          </div>
        </q-menu>
      </q-btn>
      <!-- <q-select v-model="periode" dense outlined dark color="white" :options="periods" label="Periode" class="q-ml-sm"
        emit-value map-options style="min-width: 150px;" @update:model-value="gantiPeriode" /> -->
      <q-select v-model="txt" dense outlined dark color="white" :options="txts" label="status pasien" class="q-ml-sm"
        emit-value map-options style="min-width: 150px;" @update:model-value="gantiFlag" />
      <q-select v-model="bpjs" dense outlined dark color="white" :options="txts" label="status antrian bpjs"
        class="q-ml-sm" emit-value map-options style="min-width: 150px;" @update:model-value="gantiSatus"
        :disable="loadingBpjs" :loading="loadingBpjs" />
    </div>
    <div>
      <!-- <q-btn
        flat
        :color="textColor"
        icon-right="icon-mat-event"
        :label="tanggal"
        size="sm"
        padding="xs"
        class="q-mr-sm"
      >
        <q-popup-proxy ref="popup">
          <q-date

            v-model="dateX"
            minimal
            mask="YYYY-MM-DD"
            @update:model-value="lihatRef"
          />
        </q-popup-proxy>
      </q-btn> -->
      <!-- <q-btn
        flat
        :color="textColor"
        icon-right="icon-mat-dataset"
        :label="txt"
        size="sm"
        padding="xs"
        class="q-mr-sm"
      >
        <q-menu
          transition-show="flip-left"
          transition-hide="flip-right"
          :offset="[0,10]"
        >
          <q-list style="min-width: 150px">
            <q-item
              v-for="(item, i) in txts"
              :key="i"
              v-close-popup
              clickable
              :class="item===txt?'bg-secondary text-white':''"
              @click="txt=item"
            >
              <q-item-section>{{ item }}</q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-menu>
      </q-btn> -->

      <!-- per_page -->
      <!-- <q-btn flat :color="textColor" icon="icon-mat-dashboard" size="xs" padding="xs" @click="emits('filter')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Filter
        </q-tooltip>
      </q-btn> -->
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
const bpjs = ref('SEMUA')
const txts = ref(['SEMUA', 'TERLAYANI', 'BELUM TERLAYANI'])
const emits = defineEmits(['fullscreen', 'setTanggal', 'setSearch', 'setRow', 'setPeriode', 'refresh', 'filter', 'flag', 'status', 'getData'])
const options = ref([5, 10, 20, 50, 100])
const periods = ref([
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
  'Custom'
  // { value: 4, label: 'Tahun Ini' }
])

const periode = ref('Hari ini')

const showMenuPeriode = ref(false)
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
  loadingBpjs: { type: Boolean, default: false },
  params: { type: Object, default: () => { } }
})

// const popup = ref()

const to = ref(dateDbFormat(new Date()))
const from = ref(dateDbFormat(new Date()))

function hariIni () {
  const cDate = new Date()
  to.value = dateDbFormat(cDate)
  from.value = dateDbFormat(cDate)
}
function mingguIni () {
  const now = new Date()

  // getDay() => 0 (Minggu) - 6 (Sabtu)
  const firstday = new Date(now)
  firstday.setDate(now.getDate() - now.getDay()) // Minggu

  const lastday = new Date(now)
  lastday.setDate(now.getDate() - now.getDay() + 6) // Sabtu

  from.value = dateDbFormat(firstday)
  to.value = dateDbFormat(lastday)
}

function bulanIni () {
  const now = new Date()

  // ambil tanggal pertama & terakhir bulan ini
  const firstday = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastday = new Date(now.getFullYear(), now.getMonth() + 1, 0) // tanggal terakhir bulan ini

  from.value = dateDbFormat(firstday)
  to.value = dateDbFormat(lastday)
}
// function mingguIni () {
//   const curr = new Date()
//   const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()))
//   const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6))
//   from.value = dateDbFormat(firstday)
//   to.value = dateDbFormat(lastday)
// }
// function bulanIni () {
//   const curr = new Date()
//   const firstday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-01'
//   const lastday = date.formatDate(curr, 'YYYY') + '-' + date.formatDate(curr, 'MM') + '-31'
//   from.value = dateDbFormat(firstday)
//   to.value = dateDbFormat(lastday)
// }

function tahunIni () {
  const curr = new Date()
  const firstday = date.formatDate(curr, 'YYYY') + '-01' + '-01'
  const lastday = date.formatDate(curr, 'YYYY') + '-12' + '-31'
  from.value = dateDbFormat(firstday)
  to.value = dateDbFormat(lastday)
}

function setPeriode (val) {
  periode.value = val
  if (val == 'Hari ini') {
    console.log(val, 'hari')
    hariIni()
  } else if (val == 'Minggu ini') {
    console.log(val, 'minggu')
    mingguIni()
  } else if (val == 'Bulan ini') {
    console.log(val, 'bulan')
    bulanIni()
  }

}
function getData () {
  const per = {
    to: to.value,
    from: from.value
  }
  bpjs.value = 'SEMUA'
  emits('setPeriode', per)
  // emits('getData')
}
function gantiFlag (val) {
  // console.log('val', val)
  emits('flag', val)
}
function gantiSatus (val) {
  // console.log('val', val)
  emits('status', val)
}

onMounted(() => {
  hariIni()
})

// function lihatRef() {
//   popup.value.hide()
// }
// const selectPerPage = computed({
//   get () { return props.perPage },
//   set (val) { emits('setRow', val) }
// })
// const dateX = computed({
//   get() {
//     return props.tanggal
//   },
//   set(newVal) {
//     emits('setTanggal', newVal)
//   }
// })
const q = computed({
  get () {
    return props.search
  },
  set (newVal) {
    emits('setSearch', newVal)
  }
})
</script>
