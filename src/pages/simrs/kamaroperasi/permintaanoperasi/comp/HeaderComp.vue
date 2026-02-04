<template>
  <div class="row items-center justify-between q-pa-sm" :class="`${color} text-${textColor}`">

    <div class="col-auto flex items-center">
      <div class="">
        <q-input v-model="q" outlined dark color="white" dense placeholder="Cari Kunjungan ..." debounce="500"
          style="min-width: 200px;">
          <template v-if="q" #append>
            <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click.stop.prevent="q = ''" />
          </template>
          <template #prepend>
            <q-icon size="sm" name="icon-mat-search" />
          </template>
        </q-input>
      </div>
      <div class="q-ml-sm">
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
                    <q-date dark v-model="store.params.from" minimal bordered flat mask="YYYY-MM-DD"
                      @update:model-value="store.setPeriode('Custom')" />
                    <div class="f-10 text-grey-8 q-mt-xs">
                      DARI TANGGAL : <b>{{ store.params.from }}</b>
                    </div>
                  </div>
                  <div class="col">
                    <q-date dark v-model="store.params.to" minimal bordered flat mask="YYYY-MM-DD"
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
      <div>
        <q-select v-model="txt" dense outlined dark color="white" :options="txts" label="status pasien" class="q-ml-sm"
          emit-value map-options style="min-width: 150px;" @update:model-value="gantiTxt" />
      </div>
    </div>
    <div>
      <q-btn class="q-ml-sm" unelevated color="orange" flat size="sm" padding="xs" icon="icon-mat-refresh"
        @click="emits('refresh')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Refresh Data
        </q-tooltip>
      </q-btn>
      <!-- <q-btn flat dense :color="textColor" icon="icon-mat-dashboard" size="sm" class="q-mx-sm" @click="emits('filter')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Filter Data
        </q-tooltip>
      </q-btn> -->

      <!-- fullscreen -->
      <q-btn flat :color="textColor" :icon="!full ? 'icon-mat-open_in_full' : 'icon-mat-close_fullscreen'" size="xs"
        padding="xs" @click="emits('fullscreen')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Fullscreen
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { date } from 'quasar'
import { dateDbFormat } from 'src/modules/formatter'
// import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { usePermintaanOperasistore } from 'src/stores/simrs/kamaroperasi/permintaanoperasi'
// import { useSettingsAplikasi } from 'src/stores/simrs/settings'
import { computed, onMounted, ref } from 'vue'

const txt = ref('BELUM TERLAYANI')
const txts = ref(['SEMUA', 'TERLAYANI', 'BELUM TERLAYANI'])

const showMenuPeriode = ref(false)
const emits = defineEmits(['fullscreen', 'setTanggal', 'setSearch', 'setRow', 'refresh', 'setPeriode', 'filter', 'normal', 'setPoli'])


// const setting = useSettingsAplikasi()
const store = usePermintaanOperasistore()
// const app = useAplikasiStore()
const periode = ref(1)

onMounted(() => {

  const params = {
    page: 1,
    q: '',
    status: '1',
    // to: dateDbFormat(new Date()),
    // from: dateDbFormat(new Date()),
    per_page: 100
    // kodepoli: poli.value?.kodepoli === 'SEMUA POLI' ? polis.value.map(x => x?.kodepoli) : [poli.value?.kodepoli ?? '']
  }
  // console.log('init poli', poli.value)
  // console.log('init pengunjung', params)
  store.init(params)
  // })
})
// const options = ref([5, 10, 20, 50, 100])
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
  full: { type: Boolean, default: false },
  custom: { type: Boolean, default: false }
})
const q = computed({
  get () {
    return props.search
  },
  set (newVal) {
    emits('setSearch', newVal)
  }
})



function gantiStatus (val) {
  if (val === 'BELUM TERLAYANI') {
    return '1'
  } else if (val === 'TERLAYANI') {
    return '2'
  } else {
    return 'all'
  }
}

function gantiTxt () {
  store.setPeriode(store.periode)
  store.params.status = gantiStatus(txt.value)

  store.getData()
}
const goTo = () => {
  store.params.page = 1
  store.getData()

  // console.log('store.params', store.params);
}

onMounted(() => {
})
</script>
