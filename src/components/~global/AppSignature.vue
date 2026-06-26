<template>
  <!-- Preview -->
  <div class="q-mx-auto" :style="`width:${width}px;`">

    <q-btn :color="ttd ? 'teal' : 'primary'" class="full-width q-mb-sm"
      :label="ttd ? 'Ubah ' + labelTtd : `${labelTtd}`" @click="showChooseMethod = true" />

    <div class="rounded-borders q-mb-md flex flex-center relative-position overflow-hidden" 
      style="border: 1px solid #ddd; min-height: 120px; background-color: #fafafa;">
      
      <!-- Loading / Active Wacom -->
      <TtdWacom v-if="selectedMethod === 'wacom'" uuid="ttdpasien"
        :ttd-name="pasien?.nama_panggil ?? 'nama pasien / keluarga'" @signature:ttdpasien="(val) => {
          handleSignature(val)
        }" />
      
      <!-- Hasil Preview TTD -->
      <div v-else-if="ttd" class="full-width flex flex-center q-pa-sm">
        <img :src="getImageUrl(ttd)" :style="`max-width: 100%; max-height: ${height}px; object-fit: contain;`" />
      </div>
      
      <!-- Placeholder Belum TTD -->
      <div v-else class="text-grey-5 text-caption q-pa-md text-center">
        Belum ada tanda tangan
      </div>
    </div>

  </div>

  <!-- Dialog PILIH METODE -->
  <q-dialog v-model="showChooseMethod">
    <q-card class="q-pa-md" :style="`width: ${width}px; max-width: 90vw;`">

      <div class="text-h6 text-center q-mb-md">Pilih Metode TTD</div>

      <q-btn color="green" class="full-width q-mb-sm q-py-sm" label="TTD Biasa (HP / Tablet)" @click="choose('normal')" />

      <q-btn color="purple" class="full-width q-mb-sm q-py-sm" label="TTD Wacom (Alat Tambahan)" @click="choose('wacom')" />

      <q-btn flat color="grey-8" class="full-width" label="Batal" @click="showChooseMethod = false" />

    </q-card>
  </q-dialog>

  <!-- Dialog TTD Biasa (Popup Canvas untuk mencegah layar gerak/scroll) -->
  <q-dialog v-model="showNormalTtdDialog" persistent>
    <q-card class="q-pa-md" :style="`width: ${width + 40}px; max-width: 95vw;`">
      <div class="text-subtitle1 text-bold q-mb-sm row justify-between items-center">
        <span>Gambarkan Tanda Tangan ({{ labelTtd }})</span>
        <q-btn flat round dense icon="icon-mat-close" @click="closeNormalTtd()" />
      </div>
      
      <div class="bg-grey-1 rounded-borders flex flex-center q-pa-sm" style="border: 1px dashed #bbb;">
        <AppTtd 
          :ttd="null" 
          @save-ttd="handleNormalTtdSave" 
          :id="uuid" 
          :uuid="uuid"
          :width="width" 
          :height="height" 
        />
      </div>
      
      <div class="text-caption text-grey-7 q-mt-sm text-center">
        * Gunakan jari/stylus Anda pada kotak di atas. <br/>
        Klik tombol <strong>Save</strong> (ikon simpan) di kanan bawah setelah selesai.
      </div>
    </q-card>
  </q-dialog>

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
  labelTtd: {
    type: String,
    default: 'TTD'
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
const showNormalTtdDialog = ref(false)

const TtdWacom = defineAsyncComponent(() => {
  return import('src/components/~static/TtdWacomStu540.vue')
})

const choose = (method) => {
  if (method === 'normal') {
    showNormalTtdDialog.value = true
  } else {
    selectedMethod.value = method
  }
  showChooseMethod.value = false
}

const handleNormalTtdSave = (val) => {
  emit('save-ttd', val)
  showNormalTtdDialog.value = false
}

const closeNormalTtd = () => {
  showNormalTtdDialog.value = false
}

const handleSignature = (val) => {
  emit(`signature`, val)
  selectedMethod.value = null
}

const getImageUrl = (img) => {
  if (!img) return ''
  if (img.startsWith('data:image')) {
    return img
  }
  return pathImg + img
}
</script>
