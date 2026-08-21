<template>
  <q-form ref="myForm" class="column full-height" style="overflow: hidden;">
    <!-- Scrollable Form Area -->
    <q-scroll-area class="col q-px-md q-py-sm">
      <div class="row q-col-gutter-md q-mb-md">
        
        <!-- SECTION 1: INFORMASI UMUM -->
        <div class="col-12">
          <div class="text-bold text-subtitle2 text-primary q-mb-xs">I. INFORMASI UMUM</div>
          <q-separator class="q-mb-sm" />
        </div>

        <div class="col-md-6 col-sm-12">
          <app-input-date
            :model="store.form.tanggal"
            label="Tanggal Tindakan"
            icon="icon-mat-event"
            outlined
            @set-model="val => store.form.tanggal = val"
          />
        </div>

        <div class="col-md-6 col-sm-12">
          <app-autocomplete-new
            :model="store.form.kddokter"
            label="Dokter Operator (DPJP)"
            autocomplete="nama"
            option-value="kode"
            option-label="nama"
            outlined
            :source="store.listdokters"
            @on-select="(val) => store.form.kddokter = val"
            @clear="() => store.form.kddokter = null"
          />
        </div>

        <div class="col-md-6 col-sm-12">
          <app-autocomplete-new
            :model="store.form.asisten"
            label="Asisten Dokter (Perawat)"
            autocomplete="nama"
            option-value="kode"
            option-label="nama"
            outlined
            :source="store.listperawats"
            @on-select="(val) => store.form.asisten = val"
            @clear="() => store.form.asisten = null"
          />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-input
            v-model.number="store.form.berat_badan"
            label="Berat Badan (kg)"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-input
            v-model.number="store.form.tinggi_badan"
            label="Tinggi Badan (cm)"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-4 col-sm-6">
          <q-input
            v-model.number="store.form.sesi"
            label="Sesi Tindakan Ke-"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-8 col-sm-6">
          <q-input
            v-model="store.form.no_eswl"
            label="No. Pasien ESWL"
            outlined
            dense
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="store.form.riwayat"
            label="Catatan Riwayat Penyakit"
            outlined
            type="textarea"
            rows="2"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <!-- SECTION 2: INFORMASI TINDAKAN -->
        <div class="col-12 q-mt-md">
          <div class="text-bold text-subtitle2 text-primary q-mb-xs">II. INFORMASI TINDAKAN</div>
          <q-separator class="q-mb-sm" />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-input
            v-model="store.form.waktu_mulai"
            label="Waktu Mulai"
            outlined
            dense
            type="time"
            standout="bg-yellow-3 text-black"
            @update:model-value="calculateDuration"
          />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-input
            v-model="store.form.waktu_selesai"
            label="Waktu Selesai"
            outlined
            dense
            type="time"
            standout="bg-yellow-3 text-black"
            @update:model-value="calculateDuration"
          />
        </div>

        <div class="col-md-6 col-sm-12">
          <q-input
            v-model="store.form.elektrode_sn"
            label="Elektrode S/N"
            outlined
            dense
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-input
            v-model.number="store.form.td_sistol"
            label="TD Sistol Min (mmHg)"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-input
            v-model.number="store.form.td_diastol"
            label="TD Diastol Min (mmHg)"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-input
            v-model.number="store.form.nadi"
            label="Nadi (x/menit)"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-3 col-sm-6">
          <q-select
            v-model="store.form.posisi"
            label="Posisi Pasien"
            outlined
            dense
            :options="['Prone', 'Supine']"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <!-- BATU & LOKALISASI -->
        <div class="col-12 q-mt-sm">
          <div class="text-bold text-subtitle3 text-grey-8">Spesifikasi Batu & Lokalisasi</div>
        </div>

        <!-- Batu 1 & Batu 2 Inputs -->
        <div class="col-12 row q-col-gutter-sm bg-grey-1 q-py-sm rounded-borders border-grey-4">
          <div v-for="(batu, idx) in store.form.batu_detail" :key="idx" class="col-md-6 col-sm-12 row q-col-gutter-sm">
            <div class="col-12 text-bold text-caption text-grey-7">Batu {{ idx + 1 }}</div>
            <div class="col-6">
              <q-input
                v-model="batu.posisi"
                label="Posisi Batu"
                outlined
                dense
                placeholder="misal: Renal Sinistra"
                standout="bg-yellow-3 text-black"
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="batu.ukuran_x"
                label="Pjg (mm)"
                outlined
                dense
                type="number"
                standout="bg-yellow-3 text-black"
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="batu.ukuran_y"
                label="Lbr (mm)"
                outlined
                dense
                type="number"
                standout="bg-yellow-3 text-black"
              />
            </div>
          </div>
        </div>

        <!-- Lokalisasi Type & Lama -->
        <div class="col-md-4 col-sm-6">
          <q-select
            v-model="store.form.lokalisasi_type"
            label="Tipe Lokalisasi"
            outlined
            dense
            :options="['X-Ray', 'Ultrasound', 'Keduanya']"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-4 col-sm-6">
          <q-input
            v-model.number="store.form.lokalisasi_lama"
            label="Lama Lokalisasi (menit)"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-4 col-sm-12">
          <q-select
            v-model="store.form.lokalisasi_gambar"
            label="Kualitas Gambar"
            outlined
            dense
            :options="['Bagus', 'Cukup bagus', 'Tidak bagus']"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <!-- Conditional Lokalisasi Details -->
        <!-- X-Ray fields -->
        <div v-if="store.form.lokalisasi_type === 'X-Ray' || store.form.lokalisasi_type === 'Keduanya'" class="col-12 row q-col-gutter-sm bg-blue-1 rounded-borders q-py-xs">
          <div class="col-12 text-bold text-caption text-blue-9">Detail Lokalisasi X-Ray</div>
          <div class="col-md-4 col-sm-4">
            <q-input
              v-model="store.form.lokalisasi_xray.kv"
              label="KV"
              outlined
              dense
              standout="bg-yellow-3 text-black"
            />
          </div>
          <div class="col-md-4 col-sm-4">
            <q-input
              v-model="store.form.lokalisasi_xray.ma"
              label="mA"
              outlined
              dense
              standout="bg-yellow-3 text-black"
            />
          </div>
          <div class="col-md-4 col-sm-4">
            <q-input
              v-model.number="store.form.lokalisasi_xray.fluroscopy"
              label="Fluroscopy (menit)"
              outlined
              dense
              type="number"
              standout="bg-yellow-3 text-black"
            />
          </div>
        </div>

        <!-- Ultrasound (USG) fields -->
        <div v-if="store.form.lokalisasi_type === 'Ultrasound' || store.form.lokalisasi_type === 'Keduanya'" class="col-12 row q-col-gutter-sm bg-green-1 rounded-borders q-py-xs q-mt-xs">
          <div class="col-12 text-bold text-caption text-green-9">Detail Lokalisasi Ultrasound (U/S)</div>
          <div class="col-md-4 col-sm-4">
            <q-input
              v-model.number="store.form.lokalisasi_usg.probe_fokus"
              label="Jarak Probe-Fokus (mm)"
              outlined
              dense
              type="number"
              standout="bg-yellow-3 text-black"
            />
          </div>
          <div class="col-md-4 col-sm-4">
            <q-input
              v-model.number="store.form.lokalisasi_usg.probe_batu"
              label="Jarak Probe-Batu (mm)"
              outlined
              dense
              type="number"
              standout="bg-yellow-3 text-black"
            />
          </div>
          <div class="col-md-4 col-sm-4">
            <q-input
              v-model="store.form.lokalisasi_usg.perputaran"
              label="Perputaran U/S"
              outlined
              dense
              standout="bg-yellow-3 text-black"
            />
          </div>
        </div>

        <!-- INTERACTIVE CANVAS LOKASI BATU -->
        <div class="col-12 q-my-md">
          <div class="row justify-between items-center q-mb-xs">
            <div class="text-bold text-subtitle2 flex items-center">
              <q-icon name="icon-mat-palette" size="xs" class="q-mr-xs" color="primary" />
              Tandai / Gambar Lokasi Batu Ginjal & Ureter di bawah ini :
            </div>
            <q-btn
              label="Reset Coretan"
              icon="icon-mat-refresh"
              size="sm"
              color="negative"
              outline
              @click="resetCanvas"
            />
          </div>
          <div class="canvas-container flex flex-center bg-grey-2 q-pa-sm rounded-borders relative-position" style="max-width: 100%;">
            <div class="relative-position shadow-1 bg-white" style="width: 100%; max-width: 500px; overflow: hidden; flex-shrink: 0;">
              <!-- Background Template -->
              <img :src="bodyMarkerImg" style="display: block; width: 100%; height: auto; pointer-events: none;" />
              
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
            *Gunakan mouse atau jari Anda (di tablet/layar sentuh) untuk mencoret atau melingkari posisi batu pada diagram saluran kemih di atas.
          </div>
        </div>

        <!-- SECTION 3: PENEMBAKAN & MONITOR -->
        <div class="col-12 q-mt-md">
          <div class="text-bold text-subtitle2 text-primary q-mb-xs">III. PENEMBAKAN & MONITOR</div>
          <q-separator class="q-mb-sm" />
        </div>

        <div class="col-md-4 col-sm-6">
          <q-select
            v-model="store.form.sinkronisasi"
            label="Sinkronisasi"
            outlined
            dense
            :options="['ECG', 'Frekuensi']"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-8 col-sm-6">
          <q-select
            v-model="store.form.tingkat_kesakitan"
            label="Tingkat Kesakitan Pasien"
            outlined
            dense
            :options="['Tidak sakit', 'Sedikit sakit', 'Cukup sakit', 'Sakit sekali']"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <!-- Penembakan Details (3 batu) -->
        <div class="col-12">
          <div class="text-bold text-caption text-grey-8 q-mb-xs">Parameter Tembakan per Batu Target:</div>
          <div class="row q-col-gutter-sm bg-grey-1 q-py-sm rounded-borders">
            <div v-for="(detail, index) in store.form.penembakan_detail" :key="index" class="col-12 row q-col-gutter-sm items-center">
              <div class="col-md-3 col-sm-12 text-bold text-caption text-grey-7">Batu Target {{ index + 1 }} :</div>
              <div class="col-md-3 col-sm-4">
                <q-input
                  v-model.number="detail.tembakan"
                  label="Jml Tembakan"
                  outlined
                  dense
                  type="number"
                  standout="bg-yellow-3 text-black"
                />
              </div>
              <div class="col-md-3 col-sm-4">
                <q-input
                  v-model="detail.power"
                  label="Power (kV)"
                  outlined
                  dense
                  standout="bg-yellow-3 text-black"
                />
              </div>
              <div class="col-md-3 col-sm-4">
                <q-input
                  v-model="detail.energi"
                  label="Energi (Hz)"
                  outlined
                  dense
                  standout="bg-yellow-3 text-black"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Monitor USG & Rontgen -->
        <div class="col-md-6 col-sm-12 row q-col-gutter-sm bg-yellow-1 rounded-borders q-py-xs">
          <div class="col-4">
            <q-select
              v-model="store.form.monitor_usg"
              label="Monitor USG"
              outlined
              dense
              :options="['Ya', 'Tidak']"
              standout="bg-yellow-3 text-black"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="store.form.monitor_usg_catatan"
              label="Catatan USG"
              outlined
              dense
              :disable="store.form.monitor_usg === 'Tidak'"
              standout="bg-yellow-3 text-black"
            />
          </div>
        </div>

        <div class="col-md-6 col-sm-12 row q-col-gutter-sm bg-orange-1 rounded-borders q-py-xs">
          <div class="col-4">
            <q-select
              v-model="store.form.monitor_rontgen"
              label="Monitor Rontgen"
              outlined
              dense
              :options="['Ya', 'Tidak']"
              standout="bg-yellow-3 text-black"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="store.form.monitor_rontgen_catatan"
              label="Catatan Rontgen"
              outlined
              dense
              :disable="store.form.monitor_rontgen === 'Tidak'"
              standout="bg-yellow-3 text-black"
            />
          </div>
        </div>

        <!-- OBAT-OBATAN -->
        <div class="col-12 q-mt-md">
          <div class="text-bold text-subtitle2 text-primary q-mb-xs">IV. PENGGUNAAN OBAT-OBATAN</div>
          <q-separator class="q-mb-sm" />
        </div>

        <div class="col-md-4 col-sm-12">
          <q-input
            v-model="store.form.obat_pre"
            label="Sebelum Penembakan (Pre)"
            outlined
            type="textarea"
            rows="2"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-4 col-sm-12">
          <q-input
            v-model="store.form.obat_durante"
            label="Selama Penembakan (Durante)"
            outlined
            type="textarea"
            rows="2"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-4 col-sm-12">
          <q-input
            v-model="store.form.obat_post"
            label="Setelah Penembakan (Post)"
            outlined
            type="textarea"
            rows="2"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <!-- EVALUASI -->
        <div class="col-12 q-mt-md">
          <div class="text-bold text-subtitle2 text-primary q-mb-xs">V. EVALUASI AKHIR & KETERANGAN</div>
          <q-separator class="q-mb-sm" />
        </div>

        <div class="col-md-4 col-sm-6">
          <q-select
            v-model="store.form.kepecahan_batu"
            label="Tingkat Kepecahan Batu"
            outlined
            dense
            :options="['Terlihat jelas', 'Terlihat samar', 'Tidak terlihat']"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-md-4 col-sm-6">
          <q-input
            v-model.number="store.form.lama_penembakan"
            label="Lama Penembakan (menit)"
            outlined
            dense
            type="number"
            standout="bg-yellow-3 text-black"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="store.form.keterangan"
            label="Catatan / Keterangan Tambahan Evaluasi"
            outlined
            type="textarea"
            rows="2"
            standout="bg-yellow-3 text-black"
          />
        </div>

      </div>
    </q-scroll-area>

    <!-- Save Form Action Bar -->
    <q-card-actions align="right" class="bg-grey-2 q-pa-md border-top-grey-4">
      <q-btn
        v-if="store.form.id"
        label="Batal Edit"
        color="dark"
        flat
        class="q-mr-sm"
        @click="store.initForm"
      />
      <q-btn
        label="Simpan Laporan ESWL"
        color="primary"
        icon="icon-mat-save"
        :loading="store.loading"
        :disable="store.loading"
        @click="submitForm"
      />
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLaporanEswlPoliStore } from 'src/stores/simrs/pelayanan/poli/laporanEswl'
import bodyMarkerImg from 'src/assets/human/anatomys/body-marker-eswl.webp'

const store = useLaporanEswlPoliStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const myForm = ref(null)
const canvasRef = ref(null)
const context = ref(null)
const isDrawing = ref(false)

onMounted(() => {
  // Prefill BB & TB & Vital Signs from patient's latest physical examination (Pemeriksaan Fisik)
  if (!store.form.id) {
    store.initForm()
    
    // Auto-fill from latest physical exam if available
    const pf = props.pasien?.pemeriksaanfisik?.[0]
    if (pf) {
      store.form.berat_badan = pf.beratbadan || null
      store.form.tinggi_badan = pf.tinggibadan || null
      store.form.td_sistol = pf.sistole || null
      store.form.td_diastol = pf.diastole || null
      store.form.nadi = pf.nadi || null
    }

    // Auto-fill operator from DPJP doctor
    if (props.pasien?.kodedokter) {
      store.form.kddokter = props.pasien.kodedokter
    }
  }

  setTimeout(() => {
    initCanvas()
  }, 300)
})

// Recalculate duration automatically when start/end times change
function calculateDuration() {
  if (!store.form.waktu_mulai || !store.form.waktu_selesai) return
  try {
    const tgl = store.form.tanggal || new Date().toISOString().split('T')[0]
    const dateMulai = new Date(`${tgl}T${store.form.waktu_mulai}:00`)
    const dateSelesai = new Date(`${tgl}T${store.form.waktu_selesai}:00`)
    
    // Check if end time is next day
    if (dateSelesai < dateMulai) {
      dateSelesai.setDate(dateSelesai.getDate() + 1)
    }
    
    const diffMs = dateSelesai - dateMulai
    const diffMins = Math.floor(diffMs / 60000)
    
    if (!isNaN(diffMins) && diffMins >= 0) {
      store.form.lama_penembakan = diffMins
    }
  } catch (e) {
    console.error('Error calculating duration', e)
  }
}

// ========================================== INTERACTIVE CANVAS LOGIC
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  context.value = ctx

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Draw saved drawing if in edit mode
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
  context.value.lineWidth = 4
  context.value.lineCap = 'round'
  context.value.stroke()
}

const stopDrawing = () => {
  isDrawing.value = false
}

// Canvas kosong check
const isCanvasBlank = (canvas) => {
  if (!canvas) return true
  const ctx = canvas.getContext('2d')
  const pixelBuffer = new Uint32Array(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  )
  return !pixelBuffer.some(color => color !== 0)
}

// Downscale + Compress to WebP 512x304 (< 3-5 KB)
const getCompressedCanvasBase64 = (canvas) => {
  if (!canvas || isCanvasBlank(canvas)) return ''
  
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 512
  tempCanvas.height = 304
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(canvas, 0, 0, 512, 304)
  
  return tempCanvas.toDataURL('image/webp', 0.5)
}

// Watch store.form.alternatif (such as loading on edit)
watch(() => store.form.alternatif, (newVal) => {
  if (newVal && newVal.startsWith('data:image')) {
    initCanvas()
  } else if (!newVal) {
    resetCanvas()
  }
})

function submitForm() {
  const canvas = canvasRef.value
  if (canvas) {
    store.form.alternatif = getCompressedCanvasBase64(canvas)
  }

  store.simpanData(props.pasien)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 4px;
}
.border-grey-4 {
  border: 1px solid #e0e0e0;
}
.canvas-container {
  overflow: hidden;
  max-width: 100%;
}
.border-top-grey-4 {
  border-top: 1px solid #e0e0e0;
}
</style>
