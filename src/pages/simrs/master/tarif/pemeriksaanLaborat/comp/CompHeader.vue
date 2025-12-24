<template>
  <div class="row items-center justify-between q-pa-sm" :class="`${color} text-${textColor}`">
    <div class="row">
      <q-input v-model="q" outlined dark color="white" dense placeholder="Cari ..." debounce="500" />


    </div>
    <div>

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
      <!-- data baru -->
      <q-btn class="q-ml-sm" unelevated round color="primary" size="sm" icon="icon-mat-add" @click="emits('newData')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Data Baru
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { dateDbFormat } from 'src/modules/formatter'
import { date } from 'quasar'
import { computed, onMounted, ref } from 'vue'

const emits = defineEmits(['newData', 'setSearch', 'setRow', 'setPeriode', 'refresh', 'filter', 'flag', 'status', 'getData'])
const options = ref([5, 10, 20, 50, 100])


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

function getData () {

  emits('getData')
}

const selectPerPage = computed({
  get () { return props.perPage },
  set (val) { emits('setRow', val) }
})
onMounted(() => {
  // hariIni()
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
