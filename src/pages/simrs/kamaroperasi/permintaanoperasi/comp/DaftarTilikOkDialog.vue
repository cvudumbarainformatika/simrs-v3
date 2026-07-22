<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useDaftarTilikStore } from 'src/stores/simrs/ranap/daftartilik'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { notifErrVue, notifSuccess } from 'src/modules/utils'
import bodyMarkerMale from 'src/assets/human/anatomys/body-marker-male.webp'
import bodyMarkerFemale from 'src/assets/human/anatomys/body-marker-female.webp'

const CetakDaftarTilikDialog = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/prabedah/daftartilik/comp/CetakDaftarTilikDialog.vue'))

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  pasien: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const store = useDaftarTilikStore()
const auth = useAplikasiStore()
const activeTab = ref('paska') // default Tab 2: PASKA-OPERASI & PENANDAAN
const refJamTiba = ref(null)
const dialogCetak = ref(false)

// Otomatis tentukan gambar anatomi tubuh sesuai jenis kelamin pasien (Pria / Wanita)
const bodyMarkerImg = computed(() => {
  const k = (props.pasien?.kelamin || '').toLowerCase()
  if (k.includes('perempuan') || k === 'p' || k.includes('wanita') || k.includes('female')) {
    return bodyMarkerFemale
  }
  return bodyMarkerMale
})

const canvasRef = ref(null)
const context = ref(null)
const isDrawing = ref(false)

// Inisialisasi Canvas Gambar Penandaan
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  context.value = ctx
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (store.form.paska_gambar_penandaan && store.form.paska_gambar_penandaan.startsWith('data:image')) {
    const savedImg = new Image()
    savedImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(savedImg, 0, 0, canvas.width, canvas.height)
    }
    savedImg.src = store.form.paska_gambar_penandaan
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

// Ambil & Load Data saat dialog terbuka
const loadData = async () => {
  activeTab.value = 'paska' // Default ke Tab 2 (PASKA-OPERASI & PENANDAAN)
  if (!props.pasien) return
  store.loading = true
  await store.getData(props.pasien)
  
  if (store.items.length > 0) {
    // Muat data terakhir
    store.initForm(store.items[0], props.pasien)
  } else {
    // Form Baru jika belum ada sama sekali
    store.initForm(null, props.pasien)
  }
  
  store.loading = false
  
  // Berikan jeda untuk render canvas
  setTimeout(() => {
    initCanvas()
  }, 400)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadData()
  }
})

// Fungsi Cek Apakah Canvas Kosong
const isCanvasBlank = (canvas) => {
  if (!canvas) return true
  const ctx = canvas.getContext('2d')
  const pixelBuffer = new Uint32Array(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  )
  return !pixelBuffer.some(color => color !== 0)
}

// Fungsi Kompresi Canvas ke WebP 512x304 (Ukuran Super Ringan < 3-5 KB)
const getCompressedCanvasBase64 = (canvas) => {
  if (!canvas || isCanvasBlank(canvas)) return ''
  
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = 512
  tempCanvas.height = 304
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(canvas, 0, 0, 512, 304)
  
  return tempCanvas.toDataURL('image/webp', 0.5)
}

const onSubmit = async () => {
  const canvas = canvasRef.value
  if (canvas) {
    store.form.paska_gambar_penandaan = getCompressedCanvasBase64(canvas)
  }

  // Otomatis simpan petugas penerima (Kamar Operasi) dari akun user login jika kosong
  if (!store.form.petugas_penerima) {
    store.form.petugas_penerima = auth.user?.pegawai?.kdpegsimrs || auth.user?.karyawan?.kdpegsimrs || 'Petugas OK'
  }

  // Otomatis set petugas pengantar (Kamar OK) dari akun user login jika belum dipilih
  if (!store.form.paska_petugas_pengantar) {
    const defaultOkUser = auth.user?.pegawai?.kdpegsimrs || auth.user?.karyawan?.kdpegsimrs || ''
    if (defaultOkUser) {
      store.form.paska_petugas_pengantar = defaultOkUser
    }
  }

  // Validasi Jam Tiba wajib diisi oleh Kamar Operasi saat terima pasien
  if (!store.form.pre_jam_tiba) {
    activeTab.value = 'paska'
    notifErrVue('Jam Tiba di Kamar Operasi wajib diisi!')
    setTimeout(() => {
      if (refJamTiba.value) {
        const el = refJamTiba.value.$el || refJamTiba.value
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        refJamTiba.value.focus?.()
      }
    }, 100)
    return
  }

  // Validasi Petugas Pengantar (Kamar OK) wajib diisi
  if (!store.form.paska_petugas_pengantar) {
    activeTab.value = 'paska'
    notifErrVue('Petugas Pengantar (Kamar OK) wajib dipilih/diisi!')
    return
  }

  const success = await store.simpanData(props.pasien)
  if (success) {
    emit('update:modelValue', false)
    emit('saved')
  }
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)" persistent max-width="1200px" width="90vw">
    <q-card style="min-width: 80vw; max-height: 95vh;" class="column fit">
      
      <!-- Header Dialog -->
      <q-card-section class="bg-indigo-10 text-white row items-center justify-between q-py-sm">
        <div class="row items-center q-gutter-x-sm">
          <q-avatar color="indigo-8" size="32px">
            <q-icon name="icon-mat-fact_check" />
          </q-avatar>
          <div>
            <div class="text-weight-bold text-subtitle1">Lembar TILIK Pasien</div>
            <div class="text-xxs text-grey-4">Pasien: {{ pasien?.nama }} (RM: {{ pasien?.norm }}) | Ruang: {{ pasien?.ruangan }}</div>
          </div>
        </div>
        <div class="row items-center q-gutter-x-sm">
          <!-- Tombol cetak disembunyikan dari dialog karena pencetakan berada di menu Dokumen OK -->
          <!-- <q-btn
            color="amber-9"
            text-color="dark"
            icon="icon-mat-print"
            label="Cetak Dokumen"
            dense
            no-caps
            class="q-px-sm text-weight-bold"
            @click="dialogCetak = true"
          >
            <q-tooltip>Cetak Dokumen Lembar Tilik Resmi</q-tooltip>
          </q-btn> -->
          <q-btn flat round dense icon="icon-mat-close" color="white" v-close-popup />
        </div>
      </q-card-section>

      <!-- Tab Menu (High Contrast & Premium Pill Styling) -->
      <div class="bg-grey-3 q-px-md q-py-xs border-bottom">
        <q-tabs
          v-model="activeTab"
          dense
          indicator-color="transparent"
          align="left"
          class="text-grey-8 font-weight-bold"
          inline-label
        >
          <q-tab
            name="pre"
            icon="icon-mat-assignment"
            label="1. PRE-OPERASI"
            no-caps
            class="q-px-lg rounded-borders transition-all q-mr-xs text-weight-bold"
            :class="activeTab === 'pre' ? 'bg-indigo-10 text-white shadow-2' : 'bg-white text-grey-8 border-panel'"
          />
          <q-tab
            name="paska"
            icon="icon-mat-palette"
            label="2. PASKA-OPERASI & PENANDAAN"
            no-caps
            class="q-px-lg rounded-borders transition-all text-weight-bold"
            :class="activeTab === 'paska' ? 'bg-indigo-10 text-white shadow-2' : 'bg-white text-grey-8 border-panel'"
          />
        </q-tabs>
      </div>

      <!-- Area Form Content -->
      <q-card-section class="col scroll q-pa-md bg-grey-1">
        <div v-if="store.loading" class="fit flex flex-center">
          <q-spinner-dots size="48px" color="indigo-10" />
        </div>

        <div v-else>
          <!-- TAB 1: PRE-OPERASI -->
          <div v-show="activeTab === 'pre'">
            <div class="bg-indigo-1 text-indigo-10 q-pa-md rounded-borders q-mb-md border-left-small flex items-center">
              <q-icon name="icon-mat-info" size="20px" class="q-mr-sm" />
              <div class="text-caption">
                Anda dapat meninjau dan menyesuaikan (mengedit) seluruh checklist Pre-Operasi dari Ruangan di bawah ini jika terdapat perubahan kondisi pasien saat serah terima.
              </div>
            </div>

            <!-- Header Informasi Operasi (Ruang Rawat) -->
            <div class="bg-white q-pa-md rounded-borders border-panel q-mb-md">
              <div class="row q-col-gutter-sm">
                <!-- Ruang Rawat -->
                <div class="col-12">
                  <q-input
                    :model-value="pasien?.ruang || pasien?.ruangan || store.form.ruang_rawat || '-'"
                    label="Ruang Rawat Inap Pasien"
                    dense
                    outlined
                    readonly
                    bg-color="grey-2"
                  />
                </div>
              </div>
            </div>

            <!-- Tabel Checklist Pre-Op (Editable) -->
            <q-markup-table dense flat bordered class="q-mb-md bg-white">
              <thead class="bg-indigo-10 text-white">
                <tr>
                  <th style="width: 50px;" class="text-center">No</th>
                  <th class="text-left">Kelengkapan Pre-Operasi</th>
                  <th style="width: 130px;" class="text-center">Ya / Tidak</th>
                  <th class="text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="master in store.checklistMasters" :key="master.kode">
                  <td class="text-center text-weight-bold">{{ master.no }}</td>
                  <td class="text-wrap">{{ master.label }}</td>
                  <td class="text-center">
                    <div v-if="store.form?.checklist?.[master.kode]" class="row no-wrap justify-center q-gutter-x-sm">
                      <q-radio v-model="store.form.checklist[master.kode].status" val="Ya" label="Ya" dense size="xs" color="green" />
                      <q-radio v-model="store.form.checklist[master.kode].status" val="Tidak" label="Tdk" dense size="xs" color="red" />
                    </div>
                  </td>
                  <td>
                    <q-input
                      v-if="store.form?.checklist?.[master.kode]"
                      v-model="store.form.checklist[master.kode].keterangan"
                      dense
                      borderless
                      class="q-px-xs bg-grey-1 rounded-borders"
                      placeholder="..."
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <!-- Catatan Pre-Op -->
            <div class="bg-white q-pa-md rounded-borders border-panel q-mb-md">
              <div class="text-weight-bold text-indigo-10 q-mb-xs">Catatan Ruangan:</div>
              <q-input
                v-model="store.form.catatan"
                outlined
                autogrow
                dense
                rows="2"
                placeholder="Catatan tambahan..."
                class="bg-white"
              />
            </div>

            <!-- Serah Terima Petugas -->
            <div class="bg-white q-pa-md rounded-borders border-panel">
              <div class="row q-col-gutter-md">
                <!-- Petugas Pengantar (Readonly) -->
                <div class="col-12 col-sm-6">
                  <q-input
                    :model-value="store.form.petugas_pengantar_nama"
                    label="Petugas Pengantar (Ruangan)"
                    dense
                    outlined
                    readonly
                    bg-color="grey-2"
                  />
                </div>

                <!-- Petugas Penerima (Otomatis Akun Login) -->
                <div class="col-12 col-sm-6">
                  <q-input
                    :model-value="store.form.petugas_penerima_nama || auth.user?.pegawai?.nama || ''"
                    label="Petugas Penerima (Kamar Operasi)"
                    dense
                    outlined
                    readonly
                    bg-color="grey-2"
                  />
                  <div class="text-caption text-indigo-10 q-mt-xs font-weight-medium">
                    *Nama Anda otomatis tercatat sebagai Petugas Penerima saat menyetujui lembar tilik ini.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: PASKA-OPERASI -->
          <div v-show="activeTab === 'paska'">
            <!-- Header Informasi Operasi (Jam Tiba, Jam Keluar, Urutan, Sisi Lokasi) -->
            <div class="bg-white q-pa-md rounded-borders border-panel q-mb-md">
              <div class="row q-col-gutter-sm items-center">
                <!-- Ruang Rawat -->
                <div class="col-12 col-sm-3">
                  <q-input
                    :model-value="pasien?.ruang || pasien?.ruangan || store.form.ruang_rawat || '-'"
                    label="Ruang Rawat"
                    dense
                    outlined
                    readonly
                    bg-color="grey-2"
                  />
                </div>
                <!-- Jam Tiba -->
                <div class="col-12 col-sm-3">
                  <q-input
                    ref="refJamTiba"
                    v-model="store.form.pre_jam_tiba"
                    label="Jam Tiba di OK *"
                    dense
                    outlined
                    type="time"
                  />
                </div>
                <!-- Jam Keluar dari OK -->
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="store.form.paska_jam_keluar"
                    label="Jam Keluar OK"
                    dense
                    outlined
                    placeholder="HH:mm"
                  >
                    <template #append>
                      <q-icon name="icon-mat-access_time" size="18px" />
                    </template>
                  </q-input>
                </div>
                <!-- Urutan Jadwal Operasi -->
                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="store.form.pre_urutan_jadwal"
                    label="Urutan Jadwal Operasi"
                    dense
                    outlined
                    type="number"
                  />
                </div>
                <!-- Lokasi Operasi (Sisi Kanan / Kiri) -->
                <div class="col-12 q-mt-xs">
                  <div class="row items-center bg-grey-1 q-px-sm q-py-xs rounded-borders border-panel">
                    <span class="text-caption text-weight-bold text-indigo-10 q-mr-md">Lokasi Operasi (Sisi):</span>
                    <div class="row q-gutter-x-md items-center">
                      <q-radio v-model="store.form.paska_lokasi_sisi" val="Kanan" label="Kanan" dense size="xs" color="indigo-10" />
                      <q-radio v-model="store.form.paska_lokasi_sisi" val="Kiri" label="Kiri" dense size="xs" color="indigo-10" />
                      <q-radio v-model="store.form.paska_lokasi_sisi" val="Keduanya" label="Keduanya / Dua Sisi" dense size="xs" color="indigo-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <!-- Kiri: Checklist Paska Operasi -->
              <div class="col-12 col-md-6">
                <div class="bg-indigo-10 text-white q-px-md q-py-sm rounded-borders text-weight-bold q-mb-sm flex items-center q-gutter-x-sm">
                  <q-icon name="icon-mat-done_all" size="18px" />
                  <span>CHECKLIST PASKA OPERASI</span>
                </div>

                <q-markup-table dense flat bordered class="bg-white q-mb-md">
                  <thead class="bg-indigo-10 text-white">
                    <tr>
                      <th style="width: 40px;" class="text-center">No</th>
                      <th class="text-left">Kelengkapan Paska-Operasi</th>
                      <th style="width: 130px;" class="text-center">Ya / Tidak</th>
                      <th class="text-left">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="master in store.checklistMastersPaska" :key="master.kode">
                      <td class="text-center text-weight-bold">{{ master.no }}</td>
                      <td class="text-wrap" style="max-width: 250px;">{{ master.label }}</td>
                      <td class="text-center">
                        <div v-if="store.form?.paska_checklist?.[master.kode]" class="row no-wrap justify-center q-gutter-x-sm">
                          <q-radio v-model="store.form.paska_checklist[master.kode].status" val="Ya" label="Ya" dense size="xs" color="green" />
                          <q-radio v-model="store.form.paska_checklist[master.kode].status" val="Tidak" label="Tdk" dense size="xs" color="red" />
                        </div>
                      </td>
                      <td>
                        <q-input
                          v-if="store.form?.paska_checklist?.[master.kode]"
                          v-model="store.form.paska_checklist[master.kode].keterangan"
                          dense
                          borderless
                          class="q-px-xs bg-grey-1 rounded-borders"
                          placeholder="..."
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>

                <!-- Catatan Paska Operasi -->
                <q-input
                  v-model="store.form.paska_catatan"
                  label="Catatan Khusus Paska-Operasi"
                  outlined
                  autogrow
                  rows="3"
                  class="bg-white q-mb-md"
                />

                <!-- Petugas Paska Operasi (Pengantar OK) -->
                <div class="bg-white q-pa-md rounded-borders border-panel">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <app-autocomplete-new
                        :model="store.form.paska_petugas_pengantar"
                        label="Petugas Pengantar (Kamar OK) *"
                        autocomplete="nama"
                        option-value="kdpegsimrs"
                        option-label="nama"
                        outlined
                        :source="store.perawats"
                        @on-select="(val) => store.form.paska_petugas_pengantar = val"
                        @clear="store.form.paska_petugas_pengantar = ''"
                      />
                    </div>
                  </div>
                  <div class="text-caption text-indigo-10 q-mt-xs font-italic" style="font-size: 11px;">
                    * Petugas Penerima (Ruangan) akan otomatis tercatat saat perawat Ruang Rawat mengeklik konfirmasi notifikasi penerimaan pasien.
                  </div>
                </div>
              </div>

              <!-- Kanan: Anatomy Lokasi Operasi (Canvas Drawing) -->
              <div class="col-12 col-md-6">
                <div class="bg-indigo-10 text-white q-px-md q-py-sm rounded-borders text-weight-bold q-mb-sm flex items-center justify-between">
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-palette" size="18px" class="q-mr-xs" />
                    <span>PENANDAAN LOKASI OPERASI</span>
                  </div>
                  <q-btn label="Reset Canvas" icon="icon-mat-refresh" size="xs" color="negative" outline @click="resetCanvas" />
                </div>

                <div class="canvas-container flex flex-center bg-grey-2 q-pa-sm rounded-borders relative-position border-panel" style="max-width: 100%;">
                  <div class="relative-position shadow-1 bg-white" style="width: 100%; aspect-ratio: 1024 / 608; flex-shrink: 0;">
                    <!-- Gambar Anatomi Tubuh template -->
                    <img :src="bodyMarkerImg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;" />
                    
                    <!-- Canvas interaktif untuk mencoret area lokasi operasi -->
                    <canvas
                      ref="canvasRef"
                      width="1024"
                      height="608"
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
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Footer Dialog Actions -->
      <q-card-actions align="right" class="q-pa-md bg-grey-2">
        <q-btn label="Batal" color="grey-6" flat v-close-popup />
        <q-btn
          :label="activeTab === 'pre' ? 'Simpan & Terima Pasien' : 'Simpan Data Tilik'"
          icon="icon-mat-save"
          color="indigo-10"
          :loading="store.loadingSave"
          @click="onSubmit"
        />
      </q-card-actions>
      
    </q-card>
  </q-dialog>

  <!-- Dialog Cetak Dokumen Resmi -->
  <CetakDaftarTilikDialog
    v-model="dialogCetak"
    :pasien="props.pasien"
    :item="store.form"
  />
</template>

<style scoped>
.border-panel {
  border: 1px solid #ddd;
}
.border-amber {
  border: 1px solid #ffe082;
}
.text-wrap {
  white-space: normal;
  word-break: break-word;
}
.canvas-container {
  overflow: hidden;
  max-width: 100%;
}
.bg-indigo-gradient {
  background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);
}
.text-xxs {
  font-size: 10px;
}
.border-left-small {
  border-left: 2px solid #ddd;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
