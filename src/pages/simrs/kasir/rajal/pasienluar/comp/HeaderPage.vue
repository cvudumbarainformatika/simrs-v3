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
      <q-select v-model="txt" dense outlined dark color="white" :options="txts" label="status pembayaran"
        class="q-ml-sm" emit-value map-options style="min-width: 200px;" @update:model-value="gantiStatus" />
      <q-select v-model="store.params.jenislayanan" dense outlined dark color="white" :options="txtslayanan"
        label="pelayanan" class="q-ml-sm" emit-value map-options style="min-width: 200px;"
        @update:model-value="gantilayamama" />
      <app-input-date-human :model="store.formatdisplay.daritgl" label="Tgl Dari" dark color="white" dense outlined
        class="q-ml-sm" @set-model="setToDisp" @db-model="setTo" />
      <app-input-date-human :model="store.formatdisplay.sampaitgl" label="Sampai Tgl" dark color="white" dense outlined
        class="q-ml-sm" @set-model="setToDispx" @db-model="setTox" />
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
import { date } from 'quasar'
import { dateDbFormat } from 'src/modules/formatter'
import { onMounted, ref } from 'vue'
import AppInputDateHuman from 'src/components/~global/AppInputDateHuman.vue'
import { usePasienLuarStore } from 'src/stores/simrs/kasir/pasienluar'
const store = usePasienLuarStore()
const txt = ref('SEMUA')
const txts = ref(['SEMUA', 'BELUM TERBAYAR', 'SUDAH TERBAYAR'])
const txtslayanan = ref(['LABORAT', 'RADIOLOGI', 'FARMASI',])
const periode = ref(1)
const to = ref(dateDbFormat(new Date()))
const from = ref(dateDbFormat(new Date()))
const emits = defineEmits(['fullscreen', 'setTanggal', 'setSearch', 'setRow', 'setPeriode', 'refresh', 'filter'])


function gantiStatus(val) {
  console.log('val', val)
  if (val === 'BELUM TERBAYAR') {
    store.params.status = ''
  } else if (val === 'SUDAH TERBAYAR') {
    store.params.status = '1'
  } else {
    store.params.status = 'SEMUA'
  }
  store.getData()
}

function gantilayamama(val) {
  store.params.jenislayanan = val
  store.getData()
}

function setToDisp(vaal) {
  store.formatdisplay.daritgl = vaal
}

function setTo(val) {
  store.params.daritgl = val
  store.getData()
}

function setToDispx(vaal) {
  store.formatdisplay.sampaitgl = vaal
}

function setTox(val) {
  store.params.sampaitgl = val
  store.getData()
}

onMounted(() => {
  store.getData()
})
</script>
