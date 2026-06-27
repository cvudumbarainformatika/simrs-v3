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
    <q-card style="border-radius: 16px; width: 340px; max-width: 90vw; overflow: hidden;" class="shadow-5">
      <div class="bg-teal text-white q-px-md q-py-sm text-subtitle1 text-bold text-center">
        Pilih Metode TTD
      </div>

      <q-card-section class="q-pa-md column q-gutter-y-md">
        <!-- Metode TTD Biasa -->
        <q-btn
          color="positive"
          class="full-width q-py-md text-weight-bold"
          no-caps
          unelevated
          icon="icon-mat-gesture"
          label="TTD Biasa"
          @click="choose('normal')"
        />

        <!-- Metode TTD Wacom -->
        <q-btn
          color="deep-purple-7"
          class="full-width q-py-md text-weight-bold"
          no-caps
          unelevated
          icon="icon-mat-tablet"
          label="TTD Wacom"
          @click="choose('wacom')"
        />
      </q-card-section>

      <q-card-actions align="center" class="q-px-md q-pb-md">
        <q-btn flat color="grey-8" label="Batal" no-caps class="full-width" @click="showChooseMethod = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog TTD Biasa (Popup Canvas untuk mencegah layar gerak/scroll) -->
  <q-dialog v-model="showNormalTtdDialog" persistent>
    <q-card style="border-radius: 16px; overflow: hidden; width: 400px; max-width: 95vw;" class="shadow-5 bg-white text-black">
      
      <!-- Custom Header Dialog -->
      <div class="row items-center justify-between q-px-md q-py-sm bg-teal text-white">
        <div class="text-subtitle1 text-bold">Gambarkan Tanda Tangan</div>
        <q-btn flat round dense icon="icon-mat-close" color="white" @click="closeNormalTtd()" />
      </div>

      <div class="q-pa-md">
        <!-- Subtitle Info -->
        <div class="text-caption text-grey-8 q-mb-md">
          Peran Penandatangan: <span class="text-bold text-teal">{{ labelTtd }}</span>
        </div>

        <!-- Canvas Container -->
        <div class="bg-grey-1 rounded-borders flex flex-center q-pa-sm" style="border: 1px dashed #ccc; border-radius: 8px;">
          <AppTtd
            :ttd="null"
            @save-ttd="handleNormalTtdSave"
            :id="uuid"
            :uuid="uuid"
            :width="width || 320"
            :height="height || 200"
          />
        </div>

        <!-- Hint / Keterangan -->
        <div class="text-caption text-grey-6 q-mt-md text-center">
          <q-icon name="icon-mat-info" size="16px" class="q-mr-xs" />
          Gunakan jari atau stylus Anda pada kotak di atas, kemudian tekan tombol <strong>Simpan TTD</strong>.
        </div>
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
