<template>
  <div class="fit column relative-position bg-grey-2">
    <!-- Header Toolbar -->
    <div class="col-auto bg-primary text-white q-px-md q-py-sm shadow-1">
      <div class="row justify-between items-center">
        <div class="text-subtitle1 text-weight-bold row items-center q-gutter-x-sm">
          <q-icon name="icon-my-monitor_heart" color="white" size="sm" />
          <span>Daftar Asesmen Nyeri Ulang</span>
        </div>
        <div>
          <q-btn rounded outline color="white" :loading="storeUlang.loading" @click="bukaForm">
            <q-icon name="icon-mat-add" size="xs" />
            <span class="q-ml-xs">Tambah</span>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- List Data -->
    <div class="col q-pa-md scroll relative-position">
      <div v-if="!mappedItems.length" class="fit flex flex-center bg-white" style="border-radius: 8px; border: 1px solid #ddd; min-height: 350px;">
        <div class="text-center">
          <q-icon name="icon-my-monitor_heart" size="80px" color="grey-4" />
          <div class="text-h6 text-grey-5 q-mt-md">Belum Ada Riwayat Asesmen Nyeri</div>
          <div class="text-caption text-grey-4">Silakan klik tombol Tambah untuk membuat penilaian baru</div>
        </div>
      </div>

      <div v-else class="q-gutter-y-sm">
        <q-card v-for="(item, idx) in mappedItems" :key="item.id || idx" flat bordered class="q-mb-sm">
          <q-list class="rounded-borders">
            <q-expansion-item>
              <template #header>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="32px">
                    <div>{{ item.petugas ? item.petugas.slice(0,2).toUpperCase() : 'N' }}</div>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="row items-center q-gutter-x-sm">
                    <span class="text-weight-bold text-dark">PPA</span>
                    <span class="text-grey-7">- {{ item.petugas }}</span>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-x-sm">
                    <q-btn 
                      v-if="String(currentUserPegawai) === String(item.kdpegsimrs) || currentUserPegawai === 'sa'"
                      flat round dense color="primary" 
                      icon="icon-mat-edit" size="sm" 
                      @click.stop="bukaEdit(item)" 
                    />
                    <q-btn 
                      v-if="String(currentUserPegawai) === String(item.kdpegsimrs) || currentUserPegawai === 'sa'"
                      flat round dense color="negative" 
                      icon="icon-mat-delete" size="sm" 
                      @click.stop="hapusItem(item)" 
                    />
                    <q-icon v-if="item.icon" :name="item.icon" size="sm" color="teal" />
                    <q-badge 
                      color="teal-6" 
                      text-color="white" 
                      class="q-pa-sm text-weight-bold text-subtitle2"
                    >
                      {{ item.ket }} - Skor: {{ item.skor }}
                    </q-badge>
                  </div>
                </q-item-section>

                <q-item-section side class="q-pl-md border-left">
                  <div class="text-right">
                    <div class="text-grey-8" style="font-size: 11px;">
                      <span class="text-weight-bold">Tgl</span> <em class="text-weight-medium">{{ dateFullFormat(item.tanggal) }}</em>
                    </div>
                    <div class="text-grey-8 q-mt-xs">
                      <q-badge class="q-px-sm q-py-xs" outline color="primary">
                        <div class="flex q-gutter-xs" style="font-size: 10px;">
                          <div>Jam</div>
                          <div>:</div>
                          <div class="text-weight-bold">{{ jamTnpDetik(item.tanggal) }}</div>
                        </div>
                      </q-badge>
                    </div>
                  </div>
                </q-item-section>
              </template>

              <q-separator />

              <q-card class="bg-grey-1">
                <q-card-section class="q-pa-md">
                  <div class="text-weight-bold text-grey-8 q-mb-sm">Rincian Penilaian Nyeri Ulang ({{ item.metode.toUpperCase() }}):</div>
                  <div class="row q-col-gutter-sm">
                    <div v-for="(val, kIdx) in item.details" :key="kIdx" class="col-12 col-sm-6">
                      <div class="row justify-between border-b q-py-xs">
                        <div class="text-grey-7">{{ val.label }}:</div>
                        <div class="text-weight-bold text-dark">{{ val.value }} <span v-if="val.skor !== null">(Skor: {{ val.skor }})</span></div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>

      <!-- Loading overlay yang halus -->
      <q-inner-loading :showing="storeUlang.loading" class="bg-white-5">
        <q-spinner-dots size="50px" color="primary" />
      </q-inner-loading>
    </div>

    <!-- Dialog Input Form -->
    <q-dialog v-model="dialogForm" persistent max-width="700px" width="100%">
      <q-card style="min-width: 600px; max-width: 750px;">
        <q-card-section class="row items-center bg-primary text-white q-py-sm">
          <div class="text-h6 text-weight-bold">Form Input Asesmen Nyeri Ulang</div>
          <q-space />
          <q-btn icon="icon-mat-close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="scroll" style="max-height: 70vh;">
          <div class="row q-col-gutter-sm">
            
            <!-- Tipe Skala Nyeri -->
            <div class="col-12 q-mb-md">
              <div class="text-weight-bold text-grey-9 q-mb-xs">Pilih Instrumen Kajian Nyeri:</div>
              <q-option-group
                v-model="kajianNyeri"
                :options="pilihanNyeri"
                color="primary"
                inline
                dense
              />
            </div>

            <!-- Wong Baker Face Scale / Numeric Rating Scale -->
            <div v-if="kajianNyeri === 'Wong Baker Face Scale'" class="col-12">
              <q-separator class="q-mb-md" />
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-md">Wong Baker Face Scale (Skor 0 - 10)</div>
              
              <div class="row items-center q-col-gutter-md q-px-md">
                <div class="col-8">
                  <q-slider
                    v-model="skorWongBaker"
                    color="primary"
                    thumb-color="primary"
                    label-color="primary"
                    label-text-color="yellow"
                    markers
                    label-always
                    :min="0"
                    :max="10"
                    :step="1"
                    style="width: 100%;"
                  />
                  <div class="row justify-between text-caption text-grey-6 q-mt-sm q-px-xs">
                    <div v-for="n in 11" :key="n-1">{{ n-1 }}</div>
                  </div>
                </div>
                
                <div class="col-4">
                  <div class="column items-center q-gutter-y-xs bg-grey-1 q-pa-md rounded-borders border-borders">
                    <q-icon size="50px" color="teal" :name="wongBakerIcon" />
                    <div class="text-weight-bold text-teal text-subtitle1">{{ skorWongBaker }}</div>
                    <div class="text-caption text-center text-primary text-bold">{{ wongBakerKeterangan }}</div>
                  </div>
                </div>
              </div>

              <!-- Input Tambahan Wong Baker -->
              <div class="row q-col-gutter-sm q-mt-md q-px-md">
                <!-- Lokasi Nyeri -->
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="formWongBaker.lokasi"
                    label="Lokasi Nyeri"
                    outlined
                    dense
                    placeholder="Contoh: Kaki kanan, Perut"
                  />
                </div>
                <!-- Durasi Nyeri -->
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="formWongBaker.durasi"
                    label="Durasi Nyeri"
                    outlined
                    dense
                    placeholder="Contoh: 5-10 menit, Terus-menerus"
                  />
                </div>
                <!-- Faktor Pencetus -->
                <div class="col-12">
                  <q-input
                    v-model="formWongBaker.pencetus"
                    label="Faktor Pencetus / Presipitasi"
                    outlined
                    dense
                    placeholder="Contoh: Diskontinuitas jaringan tulang, Gerakan"
                  />
                </div>
                <!-- Kualitas Nyeri -->
                <div class="col-12 col-sm-6">
                  <q-select
                    v-model="formWongBaker.kualitas"
                    label="Kualitas Nyeri"
                    :options="filteredKualitasOptions"
                    outlined
                    dense
                    use-input
                    hide-selected
                    fill-input
                    @input-value="(val) => { tempKualitas = val }"
                    @blur="if (tempKualitas) { formWongBaker.kualitas = tempKualitas; tempKualitas = '' }"
                    @filter="filterKualitas"
                    @update:model-value="onSelectKualitas"
                    placeholder="Pilih atau ketik bebas..."
                  />
                </div>
                <!-- Pola Serangan -->
                <div class="col-12 col-sm-6">
                  <q-select
                    v-model="formWongBaker.pola"
                    label="Pola Serangan"
                    :options="filteredPolaOptions"
                    outlined
                    dense
                    use-input
                    hide-selected
                    fill-input
                    @input-value="(val) => { tempPola = val }"
                    @blur="if (tempPola) { formWongBaker.pola = tempPola; tempPola = '' }"
                    @filter="filterPola"
                    @update:model-value="onSelectPola"
                    placeholder="Pilih atau ketik bebas..."
                  />
                </div>
                <!-- Hal-hal yang menyebabkan Nyeri Hilang -->
                <div class="col-12">
                  <q-select
                    ref="selectPenghilang"
                    v-model="formWongBaker.penghilang"
                    label="Hal-hal yang Menyebabkan Nyeri Hilang"
                    :options="filteredPenghilangOptions"
                    outlined
                    multiple
                    use-chips
                    use-input
                    @new-value="onNewValuePenghilang"
                    @filter="filterPenghilang"
                    @update:model-value="onSelectPenghilang"
                    placeholder="Pilih beberapa atau ketik baru (Tekan Enter)"
                  />
                </div>
              </div>
            </div>

            <!-- Behavioral Pain Scale (BPS) -->
            <div v-if="kajianNyeri === 'Behavioral Pain Scale (BPS)'" class="col-12">
              <q-separator class="q-mb-md" />
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">Behavioral Pain Scale (BPS)</div>
              
              <div class="row q-col-gutter-sm">
                <!-- Kriteria BPS (Grid 2 Kolom) -->
                <div v-for="obj in formNyeris" :key="obj.kode" class="col-12 col-sm-6 border-b q-pb-xs">
                  <div class="text-weight-bold text-grey-9 text-caption q-mb-none">{{ obj.label }} :</div>
                  <div class="column q-gutter-y-none">
                    <q-radio
                      v-for="val in obj.values"
                      :key="val.text"
                      v-model="bpsForm[obj.kode]"
                      :val="val"
                      :label="`${val.text} (Skor: ${val.skor})`"
                      dense
                      class="text-caption q-my-xs"
                    />
                  </div>
                </div>
              </div>

              <!-- Hasil BPS -->
              <div class="bg-grey-3 q-pa-sm rounded-borders flex justify-between items-center q-mt-md">
                <div class="text-subtitle1 text-weight-bold text-accent">Total Skor BPS: {{ totalSkorBps }}</div>
                <div class="text-subtitle1 text-weight-bold text-negative">Kategori: {{ bpsKeterangan }}</div>
              </div>
            </div>

            <!-- NIPS (Neonatal Infant Pain Scale) -->
            <div v-if="kajianNyeri === 'Neonatal Infant Pain Scale (NIPS)'" class="col-12">
              <q-separator class="q-mb-md" />
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">Neonatal Infant Pain Scale (NIPS)</div>
              
              <div class="row q-col-gutter-sm">
                <!-- Kriteria NIPS (Grid 2 Kolom) -->
                <div v-for="obj in formNyeriNeonatals" :key="obj.kode" class="col-12 col-sm-6 border-b q-pb-xs">
                  <div class="text-weight-bold text-grey-9 text-caption q-mb-none">{{ obj.label }} :</div>
                  <div class="column q-gutter-y-none">
                    <q-radio
                      v-for="val in obj.values"
                      :key="val.text"
                      v-model="nipsForm[obj.kode]"
                      :val="val"
                      :label="`${val.text} (Skor: ${val.skor})`"
                      dense
                      class="text-caption q-my-xs"
                    />
                  </div>
                </div>
              </div>

              <!-- Hasil NIPS -->
              <div class="bg-grey-3 q-pa-sm rounded-borders flex justify-between items-center q-mt-md">
                <div class="text-subtitle1 text-weight-bold text-accent">Total Skor NIPS: {{ totalSkorNips }}</div>
                <div class="text-subtitle1 text-weight-bold text-negative">Kategori: {{ nipsKeterangan }}</div>
              </div>
            </div>

            <!-- FLACC Scale (1 - 3 Tahun) -->
            <div v-if="kajianNyeri === 'FLACC Scale'" class="col-12">
              <q-separator class="q-mb-md" />
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">FLACC Pain Scale (Skor 0 - 10)</div>
              
              <div class="row q-col-gutter-sm">
                <!-- Kriteria FLACC (Grid 2 Kolom) -->
                <div v-for="obj in formFlaccs" :key="obj.kode" class="col-12 col-sm-6 border-b q-pb-xs">
                  <div class="text-weight-bold text-grey-9 text-caption q-mb-none">{{ obj.label }} :</div>
                  <div class="column q-gutter-y-none">
                    <q-radio
                      v-for="val in obj.values"
                      :key="val.text"
                      v-model="flaccForm[obj.kode]"
                      :val="val"
                      :label="`${val.text} (Skor: ${val.skor})`"
                      dense
                      class="text-caption q-my-xs"
                    />
                  </div>
                </div>
              </div>

              <!-- Hasil FLACC -->
              <div class="bg-grey-3 q-pa-sm rounded-borders flex justify-between items-center q-mt-md">
                <div class="text-subtitle1 text-weight-bold text-accent">Total Skor FLACC: {{ totalSkorFlacc }}</div>
                <div class="text-subtitle1 text-weight-bold text-negative">Kategori: {{ flaccKeterangan }}</div>
              </div>
            </div>

          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Batal" color="grey" flat v-close-popup />
          <q-btn label="Simpan Penilaian" color="primary" :loading="storeUlang.loadingSave" @click="simpanPenilaian" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri.js'
import { useAuthStore } from 'src/stores/auth'
import * as storage from 'src/modules/storage'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const $q = useQuasar()
const storeUlang = useAsesmenJatuhNyeriStore()
const authStore = useAuthStore()

const currentUserPegawai = computed(() => {
  const userFromStorage = storage.getUser()
  if (userFromStorage?.pegawai?.kdpegsimrs) {
    return userFromStorage.pegawai.kdpegsimrs
  }
  if (userFromStorage?.kdpegsimrs) {
    return userFromStorage.kdpegsimrs
  }
  
  const userFromAuth = authStore.user
  if (userFromAuth && typeof userFromAuth === 'object') {
    if (userFromAuth?.pegawai?.kdpegsimrs) {
      return userFromAuth.pegawai.kdpegsimrs
    }
    if (userFromAuth?.kdpegsimrs) {
      return userFromAuth.kdpegsimrs
    }
  }
  return null
})

const dialogForm = ref(false)
const editId = ref(null)

// Kajian Nyeri selection options
const pilihanNyeri = [
  { label: 'Wong Baker Face Scale', value: 'Wong Baker Face Scale' },
  { label: 'Behavioral Pain Scale (BPS)', value: 'Behavioral Pain Scale (BPS)' },
  { label: 'Neonatal Infant Pain Scale (NIPS)', value: 'Neonatal Infant Pain Scale (NIPS)' },
  { label: 'FLACC Scale', value: 'FLACC Scale' }
]
const kajianNyeri = ref('Wong Baker Face Scale')

// 1. Wong Baker state
const skorWongBaker = ref(0)
const formWongBaker = ref({
  lokasi: '',
  durasi: '',
  pencetus: '',
  kualitas: '',
  pola: '',
  penghilang: []
})
const tempKualitas = ref('')
const tempPola = ref('')
const wongBakerIcon = computed(() => {
  const val = skorWongBaker.value
  if (val < 2) return 'icon-my-emoticon-excited-outline'
  if (val >= 2 && val < 4) return 'icon-my-emoticon-outline'
  if (val >= 4 && val < 6) return 'icon-my-emoticon-neutral-outline'
  if (val >= 6 && val < 8) return 'icon-my-emoticon-confused-outline'
  if (val >= 8 && val < 10) return 'icon-my-emoticon-angry-outline'
  return 'icon-my-emoticon-cry-outline'
})
const wongBakerKeterangan = computed(() => {
  const val = skorWongBaker.value
  if (val === 0) return 'Tidak ada nyeri'
  if (val > 0 && val <= 3) return 'Nyeri Ringan'
  if (val > 3 && val <= 6) return 'Nyeri Sedang'
  return 'Nyeri Berat'
})

// 2. BPS state
const formNyeris = [
  {
    kode: 'ekspresiWajah',
    label: 'Ekspresi Wajah',
    values: [
      { text: 'Santai, tanpa ketegangan', skor: 1 },
      { text: 'Sedikit tegang, seperti dahi berkerut', skor: 2 },
      { text: 'Sangat tegang, mata tertutup rapat', skor: 3 },
      { text: 'Ekspresi menunjukkan nyeri parah, seperti menangis atau mengerutkan wajah', skor: 4 }
    ]
  },
  {
    kode: 'gerakanTangan',
    label: 'Gerakan Tangan',
    values: [
      { text: 'Tidak ada gerakan', skor: 1 },
      { text: 'Ada gerakan ringan, seperti mengerutkan atau menggerakkan telapak tangan tanpa arah ', skor: 2 },
      { text: 'Ada gerakan kuat, seperti menarik tangan atau berusaha melepas alat medis', skor: 3 },
      { text: 'Gerakan tidak terkendali, seperti upaya melarikan diri', skor: 4 }
    ]
  },
  {
    kode: 'kebutuhanVentilasi',
    label: 'Kepatuhan terhadap ventilasi mekanik',
    values: [
      { text: 'Toleran. tidak ada perlawanan', skor: 1 },
      { text: 'Sedikit tidak toleran, batuk sekali atau melawan sedikit', skor: 2 },
      { text: 'Sering batuk atau melawan ventilasi', skor: 3 },
      { text: 'Tidak toleran sama sekali, melawan ventilasi secara konstan', skor: 4 }
    ]
  }
]
const bpsForm = ref({
  ekspresiWajah: formNyeris[0].values[0],
  gerakanTangan: formNyeris[1].values[0],
  kebutuhanVentilasi: formNyeris[2].values[0]
})
const totalSkorBps = computed(() => {
  return parseInt(bpsForm.value.ekspresiWajah?.skor ?? 0) +
         parseInt(bpsForm.value.gerakanTangan?.skor ?? 0) +
         parseInt(bpsForm.value.kebutuhanVentilasi?.skor ?? 0)
})
const bpsKeterangan = computed(() => {
  const val = totalSkorBps.value
  if (val === 0) return 'Tidak ada nyeri'
  if (val > 0 && val <= 3) return 'Nyeri minimal atau tidak ada nyeri.'
  if (val > 3 && val <= 6) return 'Nyeri ringan hingga sedang.'
  if (val > 6 && val <= 9) return 'Nyeri sedang hingga berat.'
  return 'Nyeri berat hingga sangat berat.'
})

// 3. NIPS state
const formNyeriNeonatals = [
  {
    kode: 'ekspresiWajah',
    label: 'Ekspresi Wajah',
    values: [
      { text: 'Santai', skor: 0 },
      { text: 'Meringis', skor: 1 }
    ]
  },
  {
    kode: 'menangis',
    label: 'Menangis',
    values: [
      { text: 'Tidak Menangis', skor: 0 },
      { text: 'Merengek/Merintih', skor: 1 },
      { text: 'Menangis', skor: 2 }
    ]
  },
  {
    kode: 'polaNafas',
    label: 'Pola Nafas',
    values: [
      { text: 'Santai', skor: 0 },
      { text: 'Perubahan Pola Nafas', skor: 1 }
    ]
  },
  {
    kode: 'lengan',
    label: 'Lengan',
    values: [
      { text: 'Santai', skor: 0 },
      { text: 'Fleksi/Extensi', skor: 1 }
    ]
  },
  {
    kode: 'kaki',
    label: 'Kaki',
    values: [
      { text: 'Santai', skor: 0 },
      { text: 'Fleksi/Extensi', skor: 1 }
    ]
  },
  {
    kode: 'keadaanRangsangan',
    label: 'Keadaan Rangsangan',
    values: [
      { text: 'Tertidur/Bangun', skor: 0 },
      { text: 'Rewel', skor: 1 }
    ]
  }
]
const nipsForm = ref({
  ekspresiWajah: formNyeriNeonatals[0].values[0],
  menangis: formNyeriNeonatals[1].values[0],
  polaNafas: formNyeriNeonatals[2].values[0],
  lengan: formNyeriNeonatals[3].values[0],
  kaki: formNyeriNeonatals[4].values[0],
  keadaanRangsangan: formNyeriNeonatals[5].values[0]
})
const totalSkorNips = computed(() => {
  return parseInt(nipsForm.value.ekspresiWajah?.skor ?? 0) +
         parseInt(nipsForm.value.menangis?.skor ?? 0) +
         parseInt(nipsForm.value.polaNafas?.skor ?? 0) +
         parseInt(nipsForm.value.lengan?.skor ?? 0) +
         parseInt(nipsForm.value.kaki?.skor ?? 0) +
         parseInt(nipsForm.value.keadaanRangsangan?.skor ?? 0)
})
const nipsKeterangan = computed(() => {
  const val = totalSkorNips.value
  if (val === 0) return 'Tidak nyeri'
  if (val > 0 && val < 2) return 'Tidak nyaman'
  if (val >= 2 && val <= 4) return 'Nyeri Ringan - Sedang'
  return 'Nyeri Sedang - Berat'
})

// 4. FLACC state
const formFlaccs = [
  {
    kode: 'ekspresiWajah',
    label: 'Ekspresi Wajah',
    values: [
      { text: 'Tidak ada ekspresi tertentu/senyum', skor: 0 },
      { text: 'Sesekali meringis / mengerutkan dahi, menarik diri, tidak tertarik', skor: 1 },
      { text: 'Sering sampai konstan mengerutkan kening, rahang terkatup, dagu gemetaran', skor: 2 }
    ]
  },
  {
    kode: 'kaki',
    label: 'Kaki',
    values: [
      { text: 'Normal posisi atau santai', skor: 0 },
      { text: 'Tidak nyaman, cemas, gelisah, tegang', skor: 1 },
      { text: 'Menendang atau menarik kaki', skor: 2 }
    ]
  },
  {
    kode: 'aktivitas',
    label: 'Aktivitas',
    values: [
      { text: 'Berbaring dg tenang, posisi normal bergerak dg mudah', skor: 0 },
      { text: 'Menggeliat, menggeser maju mundur, tegang', skor: 1 },
      { text: 'Melengkung, kaku atau menyentak', skor: 2 }
    ]
  },
  {
    kode: 'menangis',
    label: 'Menangis',
    values: [
      { text: 'Tdk ada teriakan (terjaga atau tertidur)', skor: 0 },
      { text: 'Erangan atau rengekan, merintih, keluhan sesekali', skor: 1 },
      { text: 'Menangis terus, teriakan atau isak tangis, keluhan sering', skor: 2 }
    ]
  },
  {
    kode: 'konsolabilitas',
    label: 'Konsolabilitas / Respon',
    values: [
      { text: 'Tenang, santai, senang/puas', skor: 0 },
      { text: 'Bisa disentuh sesekali memegang/memeluk, diajak bicara, dialihkan', skor: 1 },
      { text: 'Sulit untuk dihibur/dibuat nyaman', skor: 2 }
    ]
  }
]
const flaccForm = ref({
  ekspresiWajah: formFlaccs[0].values[0],
  kaki: formFlaccs[1].values[0],
  aktivitas: formFlaccs[2].values[0],
  menangis: formFlaccs[3].values[0],
  konsolabilitas: formFlaccs[4].values[0]
})
const totalSkorFlacc = computed(() => {
  return parseInt(flaccForm.value.ekspresiWajah?.skor ?? 0) +
         parseInt(flaccForm.value.kaki?.skor ?? 0) +
         parseInt(flaccForm.value.aktivitas?.skor ?? 0) +
         parseInt(flaccForm.value.menangis?.skor ?? 0) +
         parseInt(flaccForm.value.konsolabilitas?.skor ?? 0)
})
const flaccKeterangan = computed(() => {
  const val = totalSkorFlacc.value
  if (val === 0) return 'TIDAK NYERI'
  if (val >= 1 && val <= 3) return 'NYERI RINGAN'
  if (val >= 4 && val <= 6) return 'NYERI SEDANG'
  return 'NYERI BERAT'
})

onMounted(() => {
  const tgllahir = props.pasien?.tgllahir
  if (tgllahir) {
    const birthDate = new Date(tgllahir)
    const today = new Date()
    const diffMonth = today.getFullYear() * 12 + today.getMonth() - birthDate.getFullYear() * 12 - birthDate.getMonth()
    if (diffMonth < 1) {
      kajianNyeri.value = 'Neonatal Infant Pain Scale (NIPS)'
    } else if (diffMonth >= 12 && diffMonth <= 36) {
      kajianNyeri.value = 'FLACC Scale'
    }
  }
  storeUlang.getData(props.pasien)
})

const mappedItems = computed(() => {
  return storeUlang.itemsNyeri.map(item => {
    let detailsArr = []
    let parsed = null
    if (item.details) {
      parsed = typeof item.details === 'string' ? JSON.parse(item.details) : item.details
      if (parsed && typeof parsed === 'object') {
        detailsArr = Object.keys(parsed).map(k => ({
          label: parsed[k]?.label ?? k,
          value: parsed[k]?.value ?? '-',
          skor: parsed[k]?.skor !== undefined ? parsed[k].skor : null
        }))
      }
    }
    return {
      id: item.id,
      kdpegsimrs: item.kdpegsimrs,
      tanggal: item.created_at || item.tanggal,
      petugas: item.pegawai?.nama || item.kdpegsimrs || 'Petugas',
      metode: item.metode,
      skor: item.skor,
      ket: item.ket,
      icon: getIconForScore(item.metode, item.skor),
      details: detailsArr,
      detailsRaw: parsed
    }
  })
})

function getIconForScore(metode, score) {
  if (metode !== 'Wong Baker Face Scale') return null
  if (score < 2) return 'icon-my-emoticon-excited-outline'
  if (score >= 2 && score < 4) return 'icon-my-emoticon-outline'
  if (score >= 4 && score < 6) return 'icon-my-emoticon-neutral-outline'
  if (score >= 6 && score < 8) return 'icon-my-emoticon-confused-outline'
  if (score >= 8 && score < 10) return 'icon-my-emoticon-angry-outline'
  return 'icon-my-emoticon-cry-outline'
}

function bukaForm() {
  editId.value = null
  
  // Reset ke default dahulu
  skorWongBaker.value = 0
  bpsForm.value = {
    ekspresiWajah: formNyeris[0].values[0],
    gerakanTangan: formNyeris[1].values[0],
    kebutuhanVentilasi: formNyeris[2].values[0]
  }
  nipsForm.value = {
    ekspresiWajah: formNyeriNeonatals[0].values[0],
    menangis: formNyeriNeonatals[1].values[0],
    polaNafas: formNyeriNeonatals[2].values[0],
    lengan: formNyeriNeonatals[3].values[0],
    kaki: formNyeriNeonatals[4].values[0],
    keadaanRangsangan: formNyeriNeonatals[5].values[0]
  }
  flaccForm.value = {
    ekspresiWajah: formFlaccs[0].values[0],
    kaki: formFlaccs[1].values[0],
    aktivitas: formFlaccs[2].values[0],
    menangis: formFlaccs[3].values[0],
    konsolabilitas: formFlaccs[4].values[0]
  }

  // 1. Cek dari riwayat Asesmen Ulang Nyeri terakhir
  if (storeUlang.itemsNyeri && storeUlang.itemsNyeri.length > 0) {
    const latest = storeUlang.itemsNyeri[0]
    kajianNyeri.value = latest.metode

    const parsedDetails = latest.detailsRaw
    if (parsedDetails && typeof parsedDetails === 'object') {
      if (latest.metode === 'Wong Baker Face Scale') {
        skorWongBaker.value = latest.skor
        formWongBaker.value = {
          lokasi: parsedDetails.lokasi?.value ?? '',
          durasi: parsedDetails.durasi?.value ?? '',
          pencetus: parsedDetails.pencetus?.value ?? '',
          kualitas: parsedDetails.kualitas?.value ?? '',
          pola: parsedDetails.pola?.value ?? '',
          penghilang: Array.isArray(parsedDetails.penghilang?.value) 
            ? parsedDetails.penghilang.value 
            : (parsedDetails.penghilang?.value ? [parsedDetails.penghilang.value] : [])
        }
      } else if (latest.metode === 'Behavioral Pain Scale (BPS)') {
        Object.keys(bpsForm.value).forEach(key => {
          const val = parsedDetails[key]
          const field = formNyeris.find(x => x.kode === key)
          if (field && val) {
            const matched = field.values.find(v => v.skor === val.skor || v.text === val.value)
            if (matched) bpsForm.value[key] = matched
          }
        })
      } else if (latest.metode === 'Neonatal Infant Pain Scale (NIPS)') {
        Object.keys(nipsForm.value).forEach(key => {
          const val = parsedDetails[key]
          const field = formNyeriNeonatals.find(x => x.kode === key)
          if (field && val) {
            const matched = field.values.find(v => v.skor === val.skor || v.text === val.value)
            if (matched) nipsForm.value[key] = matched
          }
        })
      } else if (latest.metode === 'FLACC Scale') {
        Object.keys(flaccForm.value).forEach(key => {
          const val = parsedDetails[key]
          const field = formFlaccs.find(x => x.kode === key)
          if (field && val) {
            const matched = field.values.find(v => v.skor === val.skor || v.text === val.value)
            if (matched) flaccForm.value[key] = matched
          }
        })
      }
    }
  }
  // 2. Jika tidak ada history, ambil dari keluhan nyeri awal / CPPT (dari relation anamnesis)
  else {
    const sortedAnamnesis = props.pasien?.anamnesis?.length
      ? [...props.pasien.anamnesis].sort((a, b) => b.id - a.id)
      : []
    const latestAnamnesis = sortedAnamnesis.find(a => a.keluhannyeri)
    if (latestAnamnesis && latestAnamnesis.keluhannyeri) {
      const kn = latestAnamnesis.keluhannyeri
      
      let activeObj = null
      let activeMetode = null
      
      const parsedDewasa = typeof kn.dewasa === 'string' ? JSON.parse(kn.dewasa) : kn.dewasa
      const parsedNeonatal = typeof kn.neonatal === 'string' ? JSON.parse(kn.neonatal) : kn.neonatal
      const parsedPediatrik = typeof kn.pediatrik === 'string' ? JSON.parse(kn.pediatrik) : kn.pediatrik
      const parsedKebidanan = typeof kn.kebidanan === 'string' ? JSON.parse(kn.kebidanan) : kn.kebidanan
      
      if (parsedDewasa) { activeObj = parsedDewasa; activeMetode = parsedDewasa.kajianNyeri }
      else if (parsedPediatrik) { activeObj = parsedPediatrik; activeMetode = parsedPediatrik.kajianNyeri }
      else if (parsedKebidanan) { activeObj = parsedKebidanan; activeMetode = parsedKebidanan.kajianNyeri }
      else if (parsedNeonatal) { activeObj = parsedNeonatal; activeMetode = parsedNeonatal.kajianNyeri || 'Neonatal Infant Pain Scale (NIPS)' }
      
      if (activeMetode) {
        kajianNyeri.value = activeMetode
      } else {
        setSkoringOtomatis()
      }

      if (kajianNyeri.value === 'Wong Baker Face Scale') {
        skorWongBaker.value = kn.skor ?? 0
        formWongBaker.value = {
          lokasi: kn.lokasi || '',
          durasi: kn.durasi || '',
          pencetus: kn.pencetus || '',
          kualitas: kn.kualitas || '',
          pola: kn.pola || '',
          penghilang: Array.isArray(kn.penghilang) ? kn.penghilang : (kn.penghilang ? [kn.penghilang] : [])
        }
      } else if (kajianNyeri.value === 'Behavioral Pain Scale (BPS)') {
        const formObj = activeObj?.form || activeObj
        if (formObj && typeof formObj === 'object') {
          Object.keys(bpsForm.value).forEach(key => {
            const val = formObj[key]
            const field = formNyeris.find(x => x.kode === key)
            if (field && val) {
              const valSkor = typeof val === 'object' ? val.skor : null
              const valText = typeof val === 'object' ? val.text : (typeof val === 'string' ? val : null)
              const matched = field.values.find(v => (valSkor !== null && v.skor === valSkor) || (valText !== null && v.text === valText))
              if (matched) bpsForm.value[key] = matched
            }
          })
        }
      } else if (kajianNyeri.value === 'Neonatal Infant Pain Scale (NIPS)') {
        const formObj = activeObj?.form || activeObj
        if (formObj && typeof formObj === 'object') {
          Object.keys(nipsForm.value).forEach(key => {
            const val = formObj[key]
            const field = formNyeriNeonatals.find(x => x.kode === key)
            if (field && val) {
              const valSkor = typeof val === 'object' ? val.skor : null
              const valText = typeof val === 'object' ? val.text : (typeof val === 'string' ? val : null)
              const matched = field.values.find(v => (valSkor !== null && v.skor === valSkor) || (valText !== null && v.text === valText))
              if (matched) nipsForm.value[key] = matched
            }
          })
        }
      } else if (kajianNyeri.value === 'FLACC Scale') {
        const formObj = activeObj?.form || activeObj
        if (formObj && typeof formObj === 'object') {
          Object.keys(flaccForm.value).forEach(key => {
            const val = formObj[key]
            const field = formFlaccs.find(x => x.kode === key)
            if (field && val) {
              const valSkor = typeof val === 'object' ? val.skor : null
              const valText = typeof val === 'object' ? val.text : (typeof val === 'string' ? val : null)
              const matched = field.values.find(v => (valSkor !== null && v.skor === valSkor) || (valText !== null && v.text === valText))
              if (matched) flaccForm.value[key] = matched
            }
          })
        }
      }
    } else {
      setSkoringOtomatis()
    }
  }

  dialogForm.value = true
}

async function simpanPenilaian() {
  let skor = 0
  let ket = ''
  let detailsObj = {}

  if (kajianNyeri.value === 'Wong Baker Face Scale') {
    skor = skorWongBaker.value
    ket = wongBakerKeterangan.value
    detailsObj = {
      kajian: { label: 'Metode Kajian', value: 'Wong Baker Face Scale', skor: null },
      skorNyeri: { label: 'Skor Skala Nyeri', value: wongBakerKeterangan.value, skor: skorWongBaker.value },
      lokasi: { label: 'Lokasi Nyeri', value: formWongBaker.value.lokasi, skor: null },
      durasi: { label: 'Durasi Nyeri', value: formWongBaker.value.durasi, skor: null },
      pencetus: { label: 'Faktor Pencetus / Presipitasi', value: formWongBaker.value.pencetus, skor: null },
      kualitas: { label: 'Kualitas Nyeri', value: formWongBaker.value.kualitas, skor: null },
      pola: { label: 'Pola Serangan', value: formWongBaker.value.pola, skor: null },
      penghilang: { label: 'Hal-hal yang Menyebabkan Nyeri Hilang', value: formWongBaker.value.penghilang, skor: null }
    }
  } else if (kajianNyeri.value === 'Behavioral Pain Scale (BPS)') {
    skor = totalSkorBps.value
    ket = bpsKeterangan.value
    Object.keys(bpsForm.value).forEach(key => {
      const field = formNyeris.find(x => x.kode === key)
      if (field && bpsForm.value[key]) {
        detailsObj[key] = {
          label: field.label,
          value: bpsForm.value[key].text,
          skor: bpsForm.value[key].skor
        }
      }
    })
  } else if (kajianNyeri.value === 'Neonatal Infant Pain Scale (NIPS)') {
    skor = totalSkorNips.value
    ket = nipsKeterangan.value
    Object.keys(nipsForm.value).forEach(key => {
      const field = formNyeriNeonatals.find(x => x.kode === key)
      if (field && nipsForm.value[key]) {
        detailsObj[key] = {
          label: field.label,
          value: nipsForm.value[key].text,
          skor: nipsForm.value[key].skor
        }
      }
    })
  } else if (kajianNyeri.value === 'FLACC Scale') {
    skor = totalSkorFlacc.value
    ket = flaccKeterangan.value
    Object.keys(flaccForm.value).forEach(key => {
      const field = formFlaccs.find(x => x.kode === key)
      if (field && flaccForm.value[key]) {
        detailsObj[key] = {
          label: field.label,
          value: flaccForm.value[key].text,
          skor: flaccForm.value[key].skor
        }
      }
    })
  }

  const payload = {
    id: editId.value,
    noreg: props.pasien?.noreg,
    norm: props.pasien?.norm,
    kdruang: props.pasien?.kdruangan,
    metode: kajianNyeri.value,
    skor,
    ket,
    details: detailsObj
  }

  const success = await storeUlang.simpanNyeri(props.pasien, payload)
  if (success) {
    dialogForm.value = false
  }
}

function bukaEdit(item) {
  editId.value = item.id
  kajianNyeri.value = item.metode

  // Reset formWongBaker first
  formWongBaker.value = {
    lokasi: '',
    durasi: '',
    pencetus: '',
    kualitas: '',
    pola: '',
    penghilang: []
  }

  const parsedDetails = item.detailsRaw
  if (parsedDetails && typeof parsedDetails === 'object') {
    if (item.metode === 'Wong Baker Face Scale') {
      skorWongBaker.value = item.skor
      formWongBaker.value = {
        lokasi: parsedDetails.lokasi?.value ?? '',
        durasi: parsedDetails.durasi?.value ?? '',
        pencetus: parsedDetails.pencetus?.value ?? '',
        kualitas: parsedDetails.kualitas?.value ?? '',
        pola: parsedDetails.pola?.value ?? '',
        penghilang: Array.isArray(parsedDetails.penghilang?.value) 
          ? parsedDetails.penghilang.value 
          : (parsedDetails.penghilang?.value ? [parsedDetails.penghilang.value] : [])
      }
    } else if (item.metode === 'Behavioral Pain Scale (BPS)') {
      Object.keys(bpsForm.value).forEach(key => {
        const val = parsedDetails[key]
        const field = formNyeris.find(x => x.kode === key)
        if (field && val) {
          const matched = field.values.find(v => v.skor === val.skor || v.text === val.value)
          if (matched) bpsForm.value[key] = matched
        }
      })
    } else if (item.metode === 'Neonatal Infant Pain Scale (NIPS)') {
      Object.keys(nipsForm.value).forEach(key => {
        const val = parsedDetails[key]
        const field = formNyeriNeonatals.find(x => x.kode === key)
        if (field && val) {
          const matched = field.values.find(v => v.skor === val.skor || v.text === val.value)
          if (matched) nipsForm.value[key] = matched
        }
      })
    } else if (item.metode === 'FLACC Scale') {
      Object.keys(flaccForm.value).forEach(key => {
        const val = parsedDetails[key]
        const field = formFlaccs.find(x => x.kode === key)
        if (field && val) {
          const matched = field.values.find(v => v.skor === val.skor || v.text === val.value)
          if (matched) flaccForm.value[key] = matched
        }
      })
    }
  }

  dialogForm.value = true
}

function hapusItem(item) {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data riwayat asesmen nyeri ini?',
    cancel: {
      flat: true,
      color: 'grey'
    },
    ok: {
      flat: true,
      color: 'negative',
      label: 'Hapus'
    },
    persistent: true
  }).onOk(() => {
    storeUlang.hapusNyeri(props.pasien, item.id)
  })
}
function setSkoringOtomatis() {
  const tgllahir = props.pasien?.tgllahir
  if (tgllahir) {
    const birthDate = new Date(tgllahir)
    const today = new Date()
    const diffMonth = today.getFullYear() * 12 + today.getMonth() - birthDate.getFullYear() * 12 - birthDate.getMonth()
    if (diffMonth < 1) {
      kajianNyeri.value = 'Neonatal Infant Pain Scale (NIPS)'
      return
    }
  }
  kajianNyeri.value = 'Wong Baker Face Scale'
}

function onNewValuePenghilang(val, done) {
  const cleanVal = val?.trim()
  if (cleanVal) {
    if (!Array.isArray(formWongBaker.value.penghilang)) {
      formWongBaker.value.penghilang = []
    }
    done(cleanVal, 'add-unique')
    onSelectPenghilang()
  }
}

// Smart Filtering & Auto-Reset Combo Box
const selectPenghilang = ref(null)
const defaultPenghilangOptions = ['Istirahat', 'Panas', 'Dingin', 'Obat-obatan', 'Teknik relaksasi', 'Lain-lain']
const filteredPenghilangOptions = ref([...defaultPenghilangOptions])

function filterPenghilang(val, update) {
  update(() => {
    const needle = val.toLowerCase().trim()
    filteredPenghilangOptions.value = defaultPenghilangOptions.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    )
  })
}

function onSelectPenghilang() {
  if (selectPenghilang.value) {
    selectPenghilang.value.updateInputValue('')
    selectPenghilang.value.hidePopup()
  }
}

const defaultKualitasOptions = ['Terbakar', 'Tumpul', 'Tertekan', 'Berat', 'Tajam', 'Kram']
const filteredKualitasOptions = ref([...defaultKualitasOptions])

function filterKualitas(val, update) {
  update(() => {
    const needle = val.toLowerCase().trim()
    filteredKualitasOptions.value = defaultKualitasOptions.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    )
  })
}

function onSelectKualitas() {
  tempKualitas.value = ''
}

const defaultPolaOptions = ['Menetap', 'Intermitten']
const filteredPolaOptions = ref([...defaultPolaOptions])

function filterPola(val, update) {
  update(() => {
    const needle = val.toLowerCase().trim()
    filteredPolaOptions.value = defaultPolaOptions.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    )
  })
}

function onSelectPola() {
  tempPola.value = ''
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #ddd;
}
.border-borders {
  border: 1px solid #e0e0e0;
}
.border-left {
  border-left: 1px solid #ddd;
}
</style>
