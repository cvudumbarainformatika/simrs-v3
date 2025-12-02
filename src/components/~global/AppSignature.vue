<template>
  <!-- Preview -->
  <div class=" q-mx-auto" :style="`width:${width}px;`">

    <q-btn :color="ttd ? 'teal' : 'primary'" class="full-width q-mb-sm" :label="ttd ? 'Ubah TTD' : 'Buat TTD'"
      @click="showChooseMethod = true" />

    <div class="rounded-borders q-mb-md">
      <!-- <component :is="activeComponent" :ttd="ttd" @save-ttd="handleSave" :id="uuid" :uuid="uuid"
        @signature:ttdpasien="handleSignature" /> -->
      <!-- <img v-else :src="ttd || pathImg + ttd" class="full-width full-height" /> -->

      <AppTtd v-if="selectedMethod === 'normal'" :ttd="ttd" @save-ttd="handleSave" :id="uuid" :uuid="uuid" />

      <TtdWacom v-else-if="selectedMethod === 'wacom'" uuid="ttdpasien"
        :ttd-name="pasien?.nama_panggil ?? 'nama pasien / keluarga'" @signature:ttdpasien="(val) => {
          handleSignature(val)
        }" />
      <div v-else class="full-width full-height">
        <img :src="ttd || pathImg + ttd" />
      </div>
    </div>


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

</template>

<script setup>
import { pathImg } from 'src/boot/axios'
import { ref, computed, defineAsyncComponent } from 'vue'

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
  },
  uuid: {
    type: String,
    default: '00000000-0000-0000-0000-000000000000'
  },
  pasien: {
    type: Object,
    default: null
  }
})

console.log('uuid', props.uuid);


const emit = defineEmits(['save-ttd', 'signature'])

const showChooseMethod = ref(false)
const selectedMethod = ref(null)

const TtdWacom = defineAsyncComponent(() => {
  return import('src/components/~static/TtdWacomStu540.vue')
})

const choose = (method) => {
  selectedMethod.value = method
  showChooseMethod.value = false
}

const activeComponent = computed(() => {
  if (selectedMethod.value === 'normal') return 'app-ttd'
  if (selectedMethod.value === 'wacom') return TtdWacom
  return null
})

const handleSave = (val) => {
  emit('save-ttd', val)
  selectedMethod.value = null
}

const handleSignature = (val) => {
  // console.log('handleSignature', val);

  emit(`signature`, val)
  selectedMethod.value = null
}


</script>
