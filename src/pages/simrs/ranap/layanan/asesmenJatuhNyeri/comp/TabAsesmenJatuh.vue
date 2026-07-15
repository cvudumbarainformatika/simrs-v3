<template>
  <div class="fit column relative-position bg-grey-2">
    <!-- Header Toolbar -->
    <div class="col-auto bg-primary text-white q-px-md q-py-sm shadow-1">
      <div class="row justify-between items-center">
        <div class="text-subtitle1 text-weight-bold row items-center q-gutter-x-sm">
          <q-icon name="icon-my-personal_injury" color="white" size="sm" />
          <span>Daftar Asesmen Risiko Jatuh Ulang</span>
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
    <div class="col q-pa-md scroll">
      <div v-if="storeUlang.loading" class="fit flex flex-center bg-white"
        style="border-radius: 8px; border: 1px solid #ddd; min-height: 350px;">
        <q-spinner color="primary" size="3em" />
        <div class="text-grey-6 q-ml-md">Memuat data riwayat....</div>
      </div>

      <div v-else-if="!mappedItems.length" class="fit flex flex-center bg-white"
        style="border-radius: 8px; border: 1px solid #ddd; min-height: 350px;">
        <div class="text-center">
          <q-icon name="icon-my-personal_injury" size="80px" color="grey-4" />
          <div class="text-h6 text-grey-5 q-mt-md">Belum Ada Riwayat Asesmen Jatuh</div>
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
                    <div>{{ item.petugas ? item.petugas.slice(0, 2).toUpperCase() : 'N' }}</div>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="row items-center q-gutter-x-sm">
                    <span class="text-weight-bold text-dark">PPA</span>
                    <span class="text-grey-7">- {{ item.petugas }}</span>
                  </div>
                  <div class="text-caption text-grey-6">{{ item.tanggal }}</div>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-x-sm">
                    <q-badge :color="item.kuning ? 'yellow-9' : 'grey-5'" :text-color="item.kuning ? 'black' : 'white'"
                      class="q-pa-sm text-weight-bold text-subtitle2">
                      {{ item.kategori }} - Skor: {{ item.skor }}
                    </q-badge>
                    <q-btn v-if="String(currentUserPegawai) === String(item.kdpegsimrs) || currentUserPegawai === 'sa'"
                      flat round dense color="primary" icon="icon-mat-edit" size="sm" @click.stop="bukaEdit(item)" />
                    <q-btn v-if="String(currentUserPegawai) === String(item.kdpegsimrs) || currentUserPegawai === 'sa'"
                      flat round dense color="negative" icon="icon-mat-delete" size="sm"
                      @click.stop="hapusItem(item)" />
                  </div>
                </q-item-section>
              </template>

              <q-separator />

              <q-card class="bg-grey-1">
                <q-card-section class="q-pa-md">
                  <div class="text-weight-bold text-grey-9 q-mb-md">Rincian Penilaian Risiko Jatuh ({{
                    item.metode.toUpperCase() }}):
                  </div>
                  <div class="row q-col-gutter-md">
                    <div v-for="(cat, cIdx) in item.details" :key="cIdx" class="col-12 col-md-6 q-mb-sm">
                      <q-card flat bordered class="bg-white rounded-borders">
                        <q-card-section class="q-pa-sm bg-blue-grey-1 text-blue-grey-10 text-weight-bold text-caption">
                          {{ cat.title.toUpperCase() }}
                        </q-card-section>
                        <q-list dense separator class="q-py-none">
                          <q-item v-for="(sub, sIdx) in cat.items" :key="sIdx" class="q-px-sm q-py-xs min-height-auto">
                            <q-item-section>
                              <div class="text-caption text-grey-8" style="line-height: 1.2;">{{ sub.label }}</div>
                            </q-item-section>
                            <q-item-section side class="text-right">
                              <div class="text-weight-bold text-dark text-caption">{{ sub.value }}</div>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Dialog Input Form -->
    <q-dialog v-model="dialogForm" persistent max-width="800px" width="100%">
      <q-card style="min-width: 750px; max-width: 850px;">
        <q-card-section class="row items-center bg-primary text-white q-py-sm">
          <div class="text-h6 text-weight-bold">Form Input Asesmen Risiko Jatuh Ulang</div>
          <q-space />
          <q-btn icon="icon-mat-close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="scroll" style="max-height: 70vh;">
          <div class="row q-col-gutter-sm">
            <div class="col-12 q-mb-md">
              <div class="bg-indigo-1 q-pa-sm rounded-borders text-indigo-10">
                <div>Usia Pasien: <strong>{{ store.usia }} Tahun</strong></div>
                <div>Metode Skoring Otomatis: <strong class="text-uppercase text-negative">{{ openSkoringJatuh ||
                  'BelumDitentukan' }}</strong></div>
              </div>
            </div>

            <!-- Humpty Dumpty Form -->
            <div v-if="openSkoringJatuh === 'humpty'" class="col-12">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">{{ store?.humptys?.desc }}</div>
              <q-separator class="q-mb-md" />
              <div v-if="store.formHumpty" class="q-gutter-y-md">
                <div v-for="obj in store.humptys?.form" :key="obj.kode" class="border-b q-pb-sm">
                  <div class="row items-center">
                    <div class="col-3 text-weight-bold text-grey-9">{{ obj?.label }}</div>
                    <div class="col-9 row q-col-gutter-xs">
                      <div v-for="(item, i) in obj?.categories" :key="i" class="col-6">
                        <q-radio dense size="sm" v-model="store.formHumpty[obj.kode]" :val="item"
                          :label="`${item?.label} (Skor: ${item?.skor})`"
                          @update:model-value="store.hitungSkorHumpty" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="store.formHumpty?.skorHumpty"
                  :class="['q-pa-md rounded-borders flex justify-between items-center q-mt-md transition-bg', store.formHumpty.skorHumpty?.kuning ? 'blink-yellow-bg text-black text-weight-bold' : 'bg-grey-3']">
                  <div class="text-h6 text-accent">Total Skor: {{ store.formHumpty.skorHumpty?.skor }}</div>
                  <div class="text-h6 text-negative">Kategori: {{ store.formHumpty.skorHumpty?.label }}</div>
                </div>
              </div>
            </div>

            <!-- Morse Fall Scale Form -->
            <div v-if="openSkoringJatuh === 'morse'" class="col-12">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">{{ store?.morses?.desc }}</div>
              <q-separator class="q-mb-md" />
              <div v-if="store.formMorse" class="q-gutter-y-md">
                <div v-for="obj in store.morses?.form" :key="obj.kode" class="border-b q-pb-sm">
                  <div class="row items-center">
                    <div class="col-3 text-weight-bold text-grey-9">{{ obj?.label }}</div>
                    <div class="col-9 row q-col-gutter-xs">
                      <div v-for="(item, i) in obj?.categories" :key="i" class="col-6">
                        <q-radio dense size="sm" v-model="store.formMorse[obj.kode]" :val="item"
                          :label="`${item?.label} (Skor: ${item?.skor})`" @update:model-value="store.hitungSkorMorse" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="store.formMorse?.skorMorse"
                  :class="['q-pa-md rounded-borders flex justify-between items-center q-mt-md transition-bg', store.formMorse.skorMorse?.kuning ? 'blink-yellow-bg text-black text-weight-bold' : 'bg-grey-3']">
                  <div class="text-h6 text-accent">Total Skor: {{ store.formMorse.skorMorse?.skor }}</div>
                  <div class="text-h6 text-negative">Kategori: {{ store.formMorse.skorMorse?.label }}</div>
                </div>
              </div>
            </div>

            <!-- Ontario / Sidney Scale Form -->
            <div v-if="openSkoringJatuh === 'ontario'" class="col-12">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">{{ store?.ontarios?.desc }}</div>
              <q-separator class="q-mb-md" />
              <div v-if="store.formOntario" class="q-gutter-y-md">
                <div v-for="obj in store.ontarios?.form" :key="obj.kode" class="border-b q-pb-sm">
                  <div v-if="obj.submenu?.length">
                    <div class="text-weight-bold text-grey-9 q-mb-xs">{{ obj?.label }} :</div>
                    <q-list bordered separator class="rounded-borders">
                      <q-item v-for="item in obj.submenu" :key="item.kode">
                        <q-item-section>
                          <q-item-label>{{ item?.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <div class="flex q-gutter-x-sm">
                            <q-radio dense size="sm" v-for="n in item.categories" :key="n.label"
                              v-model="store.formOntario[item.kode]" :val="n" :label="`${n?.label} (${n?.skor})`"
                              @update:model-value="store.hitungSkorOntario()" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div v-else class="row items-center">
                    <div class="col-5 text-weight-bold text-grey-9">{{ obj?.label }}</div>
                    <div class="col-7 column q-gutter-y-xs">
                      <q-radio dense size="sm" v-for="n in obj.categories" :key="n.label"
                        v-model="store.formOntario[obj.kode]" :val="n" :label="`${n?.label} (Skor: ${n?.skor})`"
                        @update:model-value="store.hitungSkorOntario()" />
                    </div>
                  </div>
                </div>
                <div v-if="store.formOntario?.skorOntario"
                  :class="['q-pa-md rounded-borders flex justify-between items-center q-mt-md transition-bg', store.formOntario.skorOntario?.kuning ? 'blink-yellow-bg text-black text-weight-bold' : 'bg-grey-3']">
                  <div class="text-h6 text-accent">Total Skor: {{ store.formOntario.skorOntario?.skor }}</div>
                  <div class="text-h6 text-negative">Kategori: {{ store.formOntario.skorOntario?.label }}</div>
                </div>
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
import { usePenilaianRanapStore } from 'src/stores/simrs/ranap/penilaian.js'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri.js'
import { useAuthStore } from 'src/stores/auth'
import * as storage from 'src/modules/storage'

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
const store = usePenilaianRanapStore()
const storeUlang = useAsesmenJatuhNyeriStore()
const authStore = useAuthStore()

const currentUserPegawai = computed(() => {
  const userObj = authStore.user || storage.getUser()
  return userObj?.pegawai?.kdpegsimrs || null
})

const dialogForm = ref(false)
const editId = ref(null)

onMounted(async () => {
  await store.getMaster()
  store.getUsia(props.pasien)
  storeUlang.getData(props.pasien)
})

const mapOntario = (details) => {
  const categories = []
  const getValStr = (obj) => {
    if (!obj) return '-'
    const ans = obj.value ?? obj.label ?? '-'
    const skor = obj.skor ?? 0
    return `${ans} (Skor: ${skor})`
  }

  // 1. Riwayat Jatuh
  if (details.riwayatJth_a || details.riwayatJth_b) {
    const items = []
    if (details.riwayatJth_a) {
      items.push({
        label: 'a. Apakah pasien datang ke rumah sakit karena jatuh?',
        value: getValStr(details.riwayatJth_a)
      })
    }
    if (details.riwayatJth_b) {
      items.push({
        label: 'b. Jika tidak, apakah pasien mengalami jatuh dalam 2 bulan terakhir ini?',
        value: getValStr(details.riwayatJth_b)
      })
    }
    categories.push({ title: 'Riwayat Jatuh', items })
  }

  // 2. Status Mental
  if (details.statusMental_a || details.statusMental_b || details.statusMental_c) {
    const items = []
    if (details.statusMental_a) {
      items.push({
        label: 'a. Apakah pasien delirium? (tidak dapat membuat keputusan, dll)',
        value: getValStr(details.statusMental_a)
      })
    }
    if (details.statusMental_b) {
      items.push({
        label: 'b. Apakah pasien disorientasi? (salah menyebutkan waktu, dll)',
        value: getValStr(details.statusMental_b)
      })
    }
    if (details.statusMental_c) {
      items.push({
        label: 'c. Apakah pasien agitasi? (ketakutan, gelisah dan cemas)',
        value: getValStr(details.statusMental_c)
      })
    }
    categories.push({ title: 'Status Mental', items })
  }

  // 3. Penglihatan
  if (details.penglihatan_a || details.penglihatan_b || details.penglihatan_c) {
    const items = []
    if (details.penglihatan_a) {
      items.push({
        label: 'a. Apakah pasien memakai kacamata?',
        value: getValStr(details.penglihatan_a)
      })
    }
    if (details.penglihatan_b) {
      items.push({
        label: 'b. Apakah pasien mengeluh adanya penglihatan buram?',
        value: getValStr(details.penglihatan_b)
      })
    }
    if (details.penglihatan_c) {
      items.push({
        label: 'c. Apakah pasien memiliki glaukoma, katarak, atau degenerasi makula?',
        value: getValStr(details.penglihatan_c)
      })
    }
    categories.push({ title: 'Penglihatan', items })
  }

  // 4. Kebiasaan Berkemih
  if (details.berkemih_a) {
    categories.push({
      title: 'Kebiasaan Berkemih',
      items: [{
        label: 'Apakah terdapat perubahan perilaku berkemih? (frekuensi, urgensi, dll)',
        value: getValStr(details.berkemih_a)
      }]
    })
  }

  // 5. Transfer
  if (details.transfertk) {
    categories.push({
      title: 'Transfer',
      items: [{
        label: 'Transfer (dari tempat tidur ke kursi & sebaliknya)',
        value: getValStr(details.transfertk)
      }]
    })
  }

  // 6. Mobilitas
  if (details.mobilitas) {
    categories.push({
      title: 'Mobilitas',
      items: [{
        label: 'Mobilitas / Gaya Berjalan',
        value: getValStr(details.mobilitas)
      }]
    })
  }

  return categories
}

const mapMorse = (details) => {
  const getValStr = (obj) => {
    if (!obj) return '-'
    const ans = obj.value ?? obj.label ?? '-'
    const skor = obj.skor ?? 0
    return `${ans} (Skor: ${skor})`
  }

  const friendlyLabels = {
    riwayatJatuh: 'Riwayat Jatuh (baru-baru ini / dalam 3 bulan)',
    diagnosisSekunder: 'Diagnosis Sekunder (>= 2 diagnosis medis)',
    alatBantu: 'Alat Bantu Jalan',
    heparin: 'Terapi Intravena / Heparin Lock',
    gayaBerjalan: 'Gaya Berjalan / Transfer',
    statusMental: 'Status Mental / Kognitif'
  }

  return Object.keys(details).map(key => ({
    title: friendlyLabels[key] || key,
    items: [{
      label: 'Penilaian',
      value: getValStr(details[key])
    }]
  }))
}

const mapHumpty = (details) => {
  const getValStr = (obj) => {
    if (!obj) return '-'
    const ans = obj.value ?? obj.label ?? '-'
    const skor = obj.skor ?? 0
    return `${ans} (Skor: ${skor})`
  }

  const friendlyLabels = {
    usia: 'Usia',
    kelamin: 'Jenis Kelamin',
    diagnosa: 'Diagnosis',
    gangguanKognitif: 'Gangguan Kognitif',
    faktorLingkungan: 'Faktor Lingkungan',
    responBedah: 'Respon terhadap Operasi / Sedasi / Anestesi',
    penggunaanObat: 'Penggunaan Obat-obatan'
  }

  return Object.keys(details).map(key => ({
    title: friendlyLabels[key] || key,
    items: [{
      label: 'Penilaian',
      value: getValStr(details[key])
    }]
  }))
}

const mappedItems = computed(() => {
  return storeUlang.itemsJatuh.map(item => {
    let detailsArr = []
    let parsed = null
    if (item.details) {
      parsed = typeof item.details === 'string' ? JSON.parse(item.details) : item.details
      if (parsed && typeof parsed === 'object') {
        if (item.metode === 'ontario') {
          detailsArr = mapOntario(parsed)
        } else if (item.metode === 'morse') {
          detailsArr = mapMorse(parsed)
        } else if (item.metode === 'humpty') {
          detailsArr = mapHumpty(parsed)
        } else {
          detailsArr = [{
            title: 'Rincian',
            items: Object.keys(parsed).map(k => ({
              label: k,
              value: `${parsed[k]?.value ?? parsed[k]?.label ?? '-'} (Skor: ${parsed[k]?.skor ?? 0})`
            }))
          }]
        }
      }
    }
    return {
      id: item.id,
      kdpegsimrs: item.kdpegsimrs,
      tanggal: item.created_at || item.tanggal,
      petugas: item.pegawai?.nama || item.kdpegsimrs || 'Petugas',
      metode: item.metode,
      skor: item.skor,
      kategori: item.kategori,
      kuning: !!item.kuning,
      details: detailsArr,
      detailsRaw: parsed
    }
  })
})

const openSkoringJatuh = ref(null)

function setSkoringOtomatis() {
  if (store.usia >= 60) {
    openSkoringJatuh.value = 'ontario'
  } else if (store.usia >= 18 && store.usia < 60) {
    openSkoringJatuh.value = 'morse'
  } else if (store.usia < 18) {
    openSkoringJatuh.value = 'humpty'
  }
}

function bukaForm() {
  editId.value = null
  setSkoringOtomatis()
  let targetData = null

  // 1. Cek history Asesmen Ulang Jatuh terakhir
  if (storeUlang.itemsJatuh && storeUlang.itemsJatuh.length > 0) {
    const latestHistory = storeUlang.itemsJatuh[0]

    let parsedDetails = latestHistory.details
    if (typeof parsedDetails === 'string') {
      try { parsedDetails = JSON.parse(parsedDetails) } catch (e) { parsedDetails = {} }
    }

    // Map ke format yang diharapkan oleh store.initReset
    const mappedDetails = {}
    if (parsedDetails && typeof parsedDetails === 'object') {
      Object.keys(parsedDetails).forEach(key => {
        const val = parsedDetails[key]
        mappedDetails[key] = {
          label: val.value ?? val.label ?? '',
          skor: val.skor ?? 0
        }
      })
    }

    // Buat mock objek Penilaian
    const mockPenilaian = {
      id: null,
      barthel: null,
      norton: null,
      humpty_dumpty: latestHistory.metode === 'humpty' ? JSON.stringify(mappedDetails) : null,
      morse_fall: latestHistory.metode === 'morse' ? JSON.stringify(mappedDetails) : null,
      ontario: latestHistory.metode === 'ontario' ? JSON.stringify(mappedDetails) : null
    }

    targetData = mockPenilaian
  }
  // 2. Jika tidak ada history, ambil dari Penilaian awal terbaru
  else {
    const excludes = ['POL014', 'PEN001']
    const dataPenilaian = props.pasien?.penilaian?.length
      ? [...props.pasien.penilaian]
        .filter(a => !excludes.includes(a?.kdruang))
        .sort((a, b) => b.id - a.id) // Urutkan ID terbesar (terbaru) dahulu
      : []

    if (dataPenilaian.length > 0) {
      targetData = dataPenilaian[0]
    }
  }

  // 3. Panggil initReset
  store.initReset(props.pasien, targetData)
  dialogForm.value = true
}

async function simpanPenilaian() {
  let skor = 0
  let kategori = 'Risiko Rendah'
  let kuning = false
  let detailsObj = {}

  if (openSkoringJatuh.value === 'humpty') {
    skor = store.formHumpty?.skorHumpty?.skor ?? 0
    kategori = store.formHumpty?.skorHumpty?.label ?? 'Risiko Rendah'
    kuning = store.formHumpty?.skorHumpty?.kuning ?? false
    Object.keys(store.formHumpty).forEach(key => {
      if (key !== 'skorHumpty' && store.formHumpty[key]) {
        detailsObj[key] = {
          label: store.humptys?.form?.find(x => x.kode === key)?.label || key,
          value: store.formHumpty[key].label,
          skor: store.formHumpty[key].skor
        }
      }
    })
  } else if (openSkoringJatuh.value === 'morse') {
    skor = store.formMorse?.skorMorse?.skor ?? 0
    kategori = store.formMorse?.skorMorse?.label ?? 'Risiko Rendah'
    kuning = store.formMorse?.skorMorse?.kuning ?? false
    Object.keys(store.formMorse).forEach(key => {
      if (key !== 'skorMorse' && store.formMorse[key]) {
        detailsObj[key] = {
          label: store.morses?.form?.find(x => x.kode === key)?.label || key,
          value: store.formMorse[key].label,
          skor: store.formMorse[key].skor
        }
      }
    })
  } else if (openSkoringJatuh.value === 'ontario') {
    skor = store.formOntario?.skorOntario?.skor ?? 0
    kategori = store.formOntario?.skorOntario?.label ?? 'Risiko Rendah'
    kuning = store.formOntario?.skorOntario?.kuning ?? false
    Object.keys(store.formOntario).forEach(key => {
      if (key !== 'skorOntario' && store.formOntario[key]) {
        let field = store.ontarios?.form?.find(x => x.kode === key)
        if (!field) {
          store.ontarios?.form?.forEach(f => {
            if (f.submenu) {
              const sub = f.submenu.find(s => s.kode === key)
              if (sub) field = sub
            }
          })
        }
        detailsObj[key] = {
          label: field?.label || key,
          value: store.formOntario[key].label,
          skor: store.formOntario[key].skor
        }
      }
    })
  }

  const payload = {
    id: editId.value,
    noreg: props.pasien?.noreg,
    norm: props.pasien?.norm,
    kdruang: props.pasien?.kdruangan,
    metode: openSkoringJatuh.value,
    skor,
    kategori,
    kuning: kuning ? 1 : 0,
    details: detailsObj
  }

  const success = await storeUlang.simpanJatuh(props.pasien, payload)
  if (success) {
    dialogForm.value = false
  }
}

function bukaEdit(item) {
  editId.value = item.id
  openSkoringJatuh.value = item.metode

  // Map ke format yang diharapkan oleh store.initReset
  const mappedDetails = {}
  const parsedDetails = item.detailsRaw
  if (parsedDetails && typeof parsedDetails === 'object') {
    Object.keys(parsedDetails).forEach(key => {
      const val = parsedDetails[key]
      mappedDetails[key] = {
        label: val.value ?? val.label ?? '',
        skor: val.skor ?? 0
      }
    })
  }

  // Buat mock objek Penilaian
  const mockPenilaian = {
    id: null,
    barthel: null,
    norton: null,
    humpty_dumpty: item.metode === 'humpty' ? JSON.stringify(mappedDetails) : null,
    morse_fall: item.metode === 'morse' ? JSON.stringify(mappedDetails) : null,
    ontario: item.metode === 'ontario' ? JSON.stringify(mappedDetails) : null
  }

  store.initReset(props.pasien, mockPenilaian)
  dialogForm.value = true
}

function hapusItem(item) {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data riwayat asesmen jatuh ini?',
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
    storeUlang.hapusJatuh(props.pasien, item.id)
  })
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #ddd;
}

.transition-bg {
  transition: background-color 0.3s ease;
}

@keyframes blink-yellow {

  0%,
  100% {
    background-color: #fffde7;
    /* kuning sangat muda */
  }

  50% {
    background-color: #fff176;
    /* kuning menyala */
  }
}

.blink-yellow-bg {
  animation: blink-yellow 1.5s infinite ease-in-out;
  border: 2px solid #fbc02d;
  /* border kuning gelap agar kontras */
}

.min-height-auto {
  min-height: auto !important;
}
</style>
