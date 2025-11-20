<template>
  <!-- Preview -->
  <div class=" q-mx-auto" :style="`width:${width}px;`">

    <div v-if="ttd" class="q-pa-sm bg-grey-3 rounded-borders q-mb-md">
      <img :src="pathImg + ttd" class="full-width" />
    </div>

    <q-btn color="primary" class="full-width q-mb-xs" :label="ttd ? 'Ubah TTD' : 'Buat TTD'"
      @click="showChooseMethod = true" />
  </div>

  <!-- Dialog PILIH METODE -->
  <q-dialog v-model="showChooseMethod">
    <q-card class="q-pa-md" :style="`width: ${width}px`">

      <div class="text-h6 text-center q-mb-sm">Pilih Metode TTD</div>

      <q-btn color="green" class="full-width q-mb-sm" label="TTD Biasa" @click="choose('normal')" />

      <q-btn color="purple" class="full-width q-mb-sm" label="TTD Wacom" @click="choose('wacom')" />

      <q-btn flat color="grey-8" class="full-width" label="Batal" @click="showChooseMethod = false" />

    </q-card>
  </q-dialog>

  <!-- Dynamic Component -->
  <component v-if="activeComponent" :is="activeComponent" :ttd="ttd" @save-ttd="handleSave" />
</template>

<script setup>
import { pathImg } from 'src/boot/axios'
import { ref, computed } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 320
  },
  height: {
    type: Number,
    default: 200
  },
  ttd: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['save-ttd'])

const showChooseMethod = ref(false)
const selectedMethod = ref(null)

const choose = (method) => {
  selectedMethod.value = method
  showChooseMethod.value = false
}

const activeComponent = computed(() => {
  if (selectedMethod.value === 'normal') return 'app-ttd'
  if (selectedMethod.value === 'wacom') return 'app-ttd-wacom'
  return null
})

const handleSave = (val) => {
  emit('save-ttd', val)
  selectedMethod.value = null
}
</script>
