<template>
  <q-form ref="myForm">
    <q-card-section>
      <div class="text-bold text-subtitle1">
        FORM {{ menu?.title }}
      </div>
      <q-separator class="q-my-md" />
      <div class="row full-width">
        <div class="row q-col-gutter-sm full-width">
          
          <!-- Tanggal & Pelaksana -->
          <app-input-date :model="store.form.tanggal" label="Tanggal" icon="icon-mat-event" outlined
            @set-model="val => store.form.tanggal = val" :autofocus="true" class="col-md-4 col-sm-12" />
          
          <app-autocomplete-new ref="refDokter" :model="store.form.kdDokter" label="Pelaksana Tindakan (Dokter)"
            autocomplete="nama" option-value="kdpegsimrs" option-label="nama" outlined :source="store.dokters"
            class="col-md-8 col-sm-12" @on-select="(val) => {
              store.form.kdDokter = val
              store.form.pelaksana = store.dokters?.find(item => item.kdpegsimrs === val)?.nama
            }" @clear="() => {
              store.form.kdDokter = null
              store.form.pelaksana = null
            }" />

          <!-- Pemberi Informasi / Pengedukasi (Saksi RS) -->
          <app-autocomplete-new ref="refPerawat" :model="store.form.kdPetugas" label="Pemberi Informasi / Saksi RS (Saksi I)"
            autocomplete="nama" option-value="kdpegsimrs" option-label="nama" outlined :source="store.perawats"
            class="col-md-6 col-sm-12" @on-select="(val) => {
              store.form.kdPetugas = val
              store.form.pengedukasi = store.perawats?.find(item => item?.kdpegsimrs === val)?.nama
            }" @clear="() => {
              store.form.kdPetugas = null
              store.form.pengedukasi = null
            }" />

          <!-- Hubungan dengan Pasien -->
          <q-select label="Pilih Penerima Informasi / Pemberi Pernyataan" outlined standout="bg-yellow-3" dense
            class="col-md-6 col-sm-12" :options="store.hubunganDgPasiens" v-model="store.form.hubunganDgPasien"
            @update:model-value="cekHubunganPasien" />

          <app-input-simrs v-if="store.form.hubunganDgPasien === 'Keluarga'" v-model="store.form.keluarga"
            label="Jelaskan Hubungan Keluarga dengan Pasien" class="col-12" />

          <!-- Identitas Pemberi Pernyataan -->
          <app-input-simrs v-model="store.form.nama" label="Nama Penerima Informasi / Pemberi Pernyataan"
            class="col-md-8 col-sm-12" />
          
          <div class="col-md-4 col-sm-12 flex items-center">
            <span class="q-mr-sm">Jenis Kelamin:</span>
            <q-radio size="md" v-model="store.form.lp" v-for="aa in store.jekels" :key="aa"
              :label="aa?.label" :val="aa?.value" />
          </div>

          <app-input-simrs v-model="store.form.noKtp" label="No. KTP / SIM / PASPOR" class="col-md-4 col-sm-12" />
          
          <app-input-date :model="store.form.tglLahir" label="Tanggal Lahir" icon="icon-mat-event" outlined
            @set-model="val => store.form.tglLahir = val" :autofocus="false" class="col-md-4 col-sm-12" />
          
          <app-input-simrs v-model="store.form.telepon" label="No Telp / HP" class="col-md-4 col-sm-12" />
          
          <q-input v-model="store.form.alamat" label="Alamat Lengkap" outlined standout="bg-yellow-3" rows="2" type="textarea"
            class="col-12" />

          <q-separator class="col-12 q-my-md" />

          <!-- INTERACTIVE CANVAS LOKASI OPERASI -->
          <div class="col-12">
            <div class="row justify-between items-center q-mb-xs">
              <div class="text-bold text-subtitle2 flex items-center">
                <q-icon name="icon-mat-palette" size="xs" class="q-mr-xs" color="primary" />
                Coret / Tandai Lokasi Operasi di Bawah ini :
              </div>
              <q-btn label="Reset Coretan" icon="icon-mat-refresh" size="sm" color="negative" outline @click="resetCanvas" />
            </div>
            <div class="canvas-container flex flex-center bg-grey-2 q-pa-md rounded-borders relative-position" style="max-width: 100%;">
              <div class="relative-position shadow-1 bg-white" style="width: 100%; max-width: 800px; aspect-ratio: 1024 / 601; flex-shrink: 0;">
                <!-- Background Template -->
                <img :src="bodyMarkerImg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;" />
                
                <!-- Drawing Canvas (Transparent) -->
                <canvas
                  ref="canvasRef"
                  width="1024"
                  height="601"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; background: transparent; cursor: crosshair; touch-action: none;"
                  @mousedown="startDrawing"
                  @mousemove="draw"
                  @mouseup="stopDrawing"
                  @mouseleave="stopDrawing"
                  @touchstart="startDrawing"
                  @touchmove="draw"
                  @touchend="stopDrawing"
                />
              </div>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              *Gunakan pointer (mouse/jari Anda) untuk melingkari atau mencentang area tindakan operasi pada gambar anatomi di atas.
            </div>
          </div>

          <q-separator class="col-12 q-my-md" />

          <!-- Saksi Pasien (Saksi II) -->
          <app-input-simrs v-model="store.form.saksiPasien" label="Nama Saksi Pasien / Keluarga (Saksi II)" class="col-12"
            :valid="{ required: false }" />

          <q-separator class="col-12 q-my-md" />

          <!-- Tanda Tangan -->
          <div class="col-12">
            <div class="text-bold q-mb-sm">Tanda Tangan Pernyataan</div>
            <div class="row q-col-gutter-sm">
              <!-- TTD Pasien (Yang Menyatakan) -->
              <div class="col-md-6 col-sm-12" style="min-height: 180px;">
                <q-card flat bordered class="column full-height flex-center q-pa-sm bg-grey-1">
                  <app-signature :ttd="store.form.ttdYgMenyatakan" :width="300" :height="150"
                    label-ttd="Tanda Tangan Pasien / Yang Menyatakan" @save-ttd="(val) => store.form.ttdYgMenyatakan = val"
                    :pasien="pasien" uuid="ttdYgMenyatakan" @signature="(val) => {
                      store.form.ttdYgMenyatakan = val
                    }" />
                </q-card>
              </div>
              
              <!-- TTD Saksi II (Saksi Pasien) -->
              <div class="col-md-6 col-sm-12" style="min-height: 180px;">
                <q-card flat bordered class="column full-height flex-center q-pa-sm bg-grey-1">
                  <app-signature :ttd="store.form.ttdSaksiPasien" :width="300" :height="150"
                    label-ttd="Tanda Tangan Saksi Pasien (Saksi II)" @save-ttd="(val) => store.form.ttdSaksiPasien = val"
                    :pasien="pasien" uuid="ttdSaksiPasien" @signature="(val) => {
                      store.form.ttdSaksiPasien = val
                    }" />
                </q-card>
              </div>
            </div>
          </div>

        </div>
      </div>
    </q-card-section>

    <!-- Simpan Button -->
    <q-card-actions align="right" class="q-pa-md ">
      <q-btn :loading="store.loadingSave" :disable="store.loadingSave" label="Simpan Inform Concern" type="button"
        color="primary" class="q-mb-xl" @click="onSubmit" />
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { notifErrVue } from 'src/modules/utils'
import { useConcernOperasiInvasifRanapStore } from 'src/stores/simrs/ranap/concernoperasiinvasif'
import { onMounted, ref, watch } from 'vue'
import bodyMarkerImg from 'src/assets/human/anatomys/body-marker-irna37.png'

const store = useConcernOperasiInvasifRanapStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  }
})

const myForm = ref(null)
const canvasRef = ref(null)
const context = ref(null)
const isDrawing = ref(false)

onMounted(() => {
  store.initReset(props?.pasien, 'PenandaanLokasiOperasi')
  cekHubunganPasien()
  setTimeout(() => {
    initCanvas()
  }, 300)
})

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  context.value = ctx

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Draw old layout if editing
  if (store.form.alternatif && store.form.alternatif.startsWith('data:image')) {
    const savedImg = new Image()
    savedImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(savedImg, 0, 0, canvas.width, canvas.height)
    }
    savedImg.src = store.form.alternatif
  }
}

const resetCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const startDrawing = (e) => {
  isDrawing.value = true
  const rect = canvasRef.value.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  
  const x = (clientX - rect.left) * scaleX
  const y = (clientY - rect.top) * scaleY
  
  context.value.beginPath()
  context.value.moveTo(x, y)
}

const draw = (e) => {
  if (!isDrawing.value) return
  e.preventDefault()
  
  const rect = canvasRef.value.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  
  const x = (clientX - rect.left) * scaleX
  const y = (clientY - rect.top) * scaleY
  
  context.value.lineTo(x, y)
  context.value.strokeStyle = '#ff0000'
  context.value.lineWidth = 3
  context.value.lineCap = 'round'
  context.value.stroke()
}

const stopDrawing = () => {
  isDrawing.value = false
}

const cekHubunganPasien = () => {
  const pasien = props.pasien
  const val = store.form.hubunganDgPasien
  if (val === 'Diri Sendiri') {
    store.form.nama = pasien?.nama
    store.form.noKtp = pasien?.nktp
    store.form.tglLahir = pasien?.tgllahir
    store.form.alamat = pasien?.alamat
    store.form.telepon = pasien?.nohp
    const kel = pasien?.kelamin
    if (kel) {
      if (kel.toLowerCase() === 'l' || kel.toLowerCase().startsWith('laki')) {
        store.form.lp = 'Laki-Laki'
      } else if (kel.toLowerCase() === 'p' || kel.toLowerCase().startsWith('perempuan')) {
        store.form.lp = 'Perempuan'
      } else {
        store.form.lp = kel
      }
    } else {
      store.form.lp = null
    }
  } else {
    store.form.nama = null
    store.form.noKtp = null
    store.form.tglLahir = null
    store.form.alamat = null
    store.form.telepon = null
    store.form.lp = null
  }
}

// Watch store.form.alternatif (e.g. on editing load)
watch(() => store.form.alternatif, (newVal) => {
  if (newVal && newVal.startsWith('data:image')) {
    initCanvas()
  }
})

function onSubmit() {
  const canvas = canvasRef.value
  if (canvas) {
    store.form.alternatif = canvas.toDataURL('image/png')
  }

  if (!store.form.kdDokter) {
    return notifErrVue('Pelaksana Tindakan (Dokter) wajib dipilih!')
  }
  if (!store.form.kdPetugas) {
    return notifErrVue('Pemberi Informasi (Petugas) wajib dipilih!')
  }
  if (!store.form.nama) {
    return notifErrVue('Nama Penerima Informasi wajib diisi!')
  }
  
  store.saveData(props?.pasien, props?.menu?.name)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
.canvas-container {
  overflow: hidden;
  max-width: 100%;
}
.body-marker-canvas {
  background-color: #fff;
  border: 1px solid #ccc;
  cursor: crosshair;
  max-width: 100%;
  height: auto;
  touch-action: none; /* Disable scrolling when drawing on touch screens */
}
</style>
