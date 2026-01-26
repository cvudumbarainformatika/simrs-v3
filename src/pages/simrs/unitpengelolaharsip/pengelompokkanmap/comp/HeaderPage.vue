<template>
  <div class="row justify-between items-center q-pa-sm">
    <div class="row items-center">
      <div>
        <q-input v-model="store.params.q" placeholder="Cari Map ..." dense outlined dark color="white"
          style="min-width:200px" debounce="800" :loading="store.loading"
          @update:model-value="store.search(store.params.q, store.params.tahunmap)">
          <template #prepend>
            <q-icon name="icon-mat-search" />
          </template>
        </q-input>
      </div>
      <div>
        <q-select v-model="store.params.tahunmap" dense outlined dark color="white" :options="tahun" label="Tahun"
          class="q-ml-sm" emit-value map-options style="min-width: 150px;" @update:model-value="store.searchtahun" />
      </div>
      <div v-if="users === '' || users === null">
        <q-select v-model="store.params.bidangbagian" dense outlined dark color="white" :options="organisasi"
          label="Unit Pengelolah.." option-label="nama" option-value="kode" class="q-ml-sm" emit-value map-options
          style="min-width: 300px;" @update:model-value="getUnit" />
      </div>
    </div>
    <div>
      <q-btn class="q-ml-sm" unelevated color="orange" flat size="sm" padding="xs" icon="icon-mat-add"
        @click="emits('tambahmap')">
        <q-tooltip class="primary" :offset="[10, 10]">
          Tambah Data
        </q-tooltip>
      </q-btn>
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
import { computed, ref } from 'vue'
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap'
const store = useUnitPengelolaharsipMapStore()
// const txt = ref('BELUM TERLAYANI')
// const txts = ref(['SEMUA', 'BELUM TERLAYANI', 'MASIH DILAYANI', 'SUDAH TERLAYANI'])
// const periode = ref(1)
// const to = ref(dateDbFormat(new Date()))
// const from = ref(dateDbFormat(new Date()))
const emits = defineEmits(['tambahmap'])

const props = defineProps({
  users: {
    type: String,
    default: ""
  },
  organisasi: {
    type: Array,
    default: () => []
  },
})

function getUnit(val) {
  store.params.bidangbagian = val
  store.search()
}


const tahun = computed(() => {
  const currentYear = new Date().getFullYear()
  const yearList = []

  for (let i = 0; i < 3; i++) {
    yearList.push(currentYear - i)
  }

  return yearList
})


</script>
