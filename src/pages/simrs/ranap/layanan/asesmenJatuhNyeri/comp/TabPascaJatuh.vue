<template>
  <div class="fit column relative-position bg-grey-2">
    <!-- Header Toolbar -->
    <div class="col-auto bg-primary text-white q-px-md q-py-sm shadow-1">
      <div class="row justify-between items-center">
        <div class="text-subtitle1 text-weight-bold row items-center q-gutter-x-sm">
          <q-icon name="icon-mat-warning" color="white" size="sm" />
          <span>Monitoring & Evaluasi Pasien Pasca Jatuh (Setelah Jatuh)</span>
        </div>
        <div>
          <q-btn rounded outline color="white" :loading="storeUlang.loading" @click="bukaForm">
            <q-icon name="icon-mat-add" size="xs" />
            <span class="q-ml-xs">Input Form Baru</span>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- List Data Riwayat -->
    <div class="col q-pa-md scroll relative-position">
      <div v-if="!mappedItems.length" class="fit flex flex-center bg-white"
        style="border-radius: 8px; border: 1px solid #ddd; min-height: 350px;">
        <div class="text-center">
          <q-icon name="icon-mat-warning" size="80px" color="grey-4" />
          <div class="text-h6 text-grey-5 q-mt-md">Belum Ada Riwayat Monitoring Pasca Jatuh</div>
          <div class="text-caption text-grey-4">Silakan klik tombol "Input Form Baru" untuk mencatat pemantauan pasca jatuh</div>
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
                  <div class="text-caption text-grey-6">
                    Insiden: {{ dateFullFormat(item.tgl_jatuh) }} | Jam: {{ item.jam_jatuh || '-' }}
                  </div>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-x-sm">
                    <q-btn flat round dense color="primary" icon="icon-mat-edit" size="sm" @click.stop="bukaEdit(item)">
                      <q-tooltip>Lengkapi / Edit Form Monitoring</q-tooltip>
                    </q-btn>
                    <q-btn v-if="String(currentUserPegawai) === String(item.kdpegsimrs) || currentUserPegawai === 'sa'"
                      flat round dense color="negative" icon="icon-mat-delete" size="sm"
                      @click.stop="hapusItem(item)" />
                    <q-badge color="teal-7" text-color="white" class="q-pa-sm text-weight-bold">
                      {{ item.total_tindakan || 0 }} Tindakan Dievaluasi
                    </q-badge>
                  </div>
                </q-item-section>

                <q-item-section side class="q-pl-md border-left">
                  <div class="text-right">
                    <div class="text-grey-8" style="font-size: 11px;">
                      <span class="text-weight-bold">Tgl Input</span> <em class="text-weight-medium">{{ dateFullFormat(item.created_at || item.tanggal) }}</em>
                    </div>
                    <div class="text-grey-8 q-mt-xs">
                      <q-badge class="q-px-sm q-py-xs" outline color="primary">
                        <div class="flex q-gutter-xs" style="font-size: 10px;">
                          <div>Jam</div>
                          <div>:</div>
                          <div class="text-weight-bold">{{ jamTnpDetik(item.created_at || item.tanggal) }}</div>
                        </div>
                      </q-badge>
                    </div>
                  </div>
                </q-item-section>
              </template>

              <q-separator />

              <q-card class="bg-grey-1">
                <q-card-section class="q-pa-md">
                  <div class="text-weight-bold text-grey-9 q-mb-sm">Rincian Lembar Monitoring Pasca Jatuh:</div>
                  <q-markup-table dense separator="cell" flat bordered wrap-cells class="bg-white">
                    <thead>
                      <tr class="bg-blue-grey-1 text-blue-grey-9">
                        <th class="text-left" width="18%">Rentang Waktu</th>
                        <th class="text-left">Tindakan / Intervensi</th>
                        <th class="text-center" width="8%">Jam</th>
                        <th class="text-center" width="8%">Status</th>
                        <th class="text-left" width="25%">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(group, gKey) in item.details_grouped" :key="gKey">
                        <tr v-for="(tdk, tIdx) in group.list" :key="tIdx">
                          <td v-if="tIdx === 0" :rowspan="group.list.length" class="text-weight-bold bg-grey-2 text-dark align-top">
                            {{ group.label }}
                          </td>
                          <td class="text-caption">
                            <span v-if="tdk.code" class="text-weight-bold q-mr-xs">{{ tdk.code }}.</span>
                            {{ tdk.label }}
                          </td>
                          <td class="text-center text-caption">{{ tdk.jam || '-' }}</td>
                          <td class="text-center">
                            <q-badge :color="tdk.ya ? 'green-8' : (tdk.tidak ? 'red-8' : 'grey-5')" text-color="white" dense>
                              {{ tdk.ya ? 'Ya' : (tdk.tidak ? 'Tidak' : '-') }}
                            </q-badge>
                          </td>
                          <td class="text-caption text-grey-8">{{ tdk.keterangan || '-' }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </q-markup-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- DIALOG FORM MONITORING PASCA JATUH -->
    <q-dialog v-model="formOpen" persistent max-width="950px" width="95vw">
      <q-card style="min-width: 900px; max-width: 98vw; height: 90vh;" class="column">
        <q-card-section class="bg-primary text-white row items-center justify-between col-auto q-py-sm">
          <div class="text-subtitle1 text-weight-bold row items-center q-gutter-x-sm">
            <q-icon name="icon-mat-warning" size="sm" />
            <span>Form Monitoring Pasien Setelah Jatuh</span>
          </div>
          <q-btn flat round dense icon="icon-mat-close" v-close-popup />
        </q-card-section>

        <!-- Informasi Tanggal & Jam Kejadian -->
        <q-card-section class="bg-blue-1 col-auto q-py-sm border-bottom">
          <div class="row q-col-gutter-md items-center">
            <div class="col-12 col-md-4">
              <app-input-date
                v-model="form.tgl_jatuh"
                label="Tanggal Kejadian Jatuh"
                outlined
                dense
                bg-color="white"
                icon="icon-mat-event"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.jam_jatuh"
                label="Jam Kejadian Jatuh (HH:mm)"
                outlined
                dense
                bg-color="white"
                mask="time"
                placeholder="14:30"
                @update:model-value="updateDefaultTimesFromJamJatuh"
              >
                <template #append>
                  <q-icon name="icon-mat-schedule" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-4 text-caption text-grey-8">
              * Isi tanggal dan jam saat pasien mengalami insiden jatuh di ruangan.
            </div>
          </div>
        </q-card-section>

        <!-- Form Tabel Intervensi Pasca Jatuh -->
        <q-card-section class="col scroll q-pa-sm">
          <q-markup-table dense separator="cell" flat bordered wrap-cells class="full-width font-body">
            <thead>
              <tr class="bg-primary text-white">
                <th class="text-center" width="16%">Rentang Waktu</th>
                <th class="text-left">Tindakan / Observasi</th>
                <th class="text-center" width="10%">Jam</th>
                <th class="text-center" width="7%">Ya</th>
                <th class="text-center" width="7%">Tidak</th>
                <th class="text-left" width="25%">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <!-- Tindakan Segera -->
              <tr v-for="(item, idx) in masterTindakanSegera" :key="'segera-' + idx">
                <td v-if="idx === 0" :rowspan="masterTindakanSegera.length" class="text-weight-bold text-center bg-grey-2 align-middle">
                  Tindakan Segera
                </td>
                <td class="text-caption">
                  <span class="text-weight-bold q-mr-xs">{{ item.code }}.</span>
                  {{ item.label }}
                </td>
                <td>
                  <q-input v-model="form.details[item.id].jam" dense outlined bg-color="white" mask="time" placeholder="14:35" style="font-size: 11px;" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].ya" dense @update:model-value="val => { if(val) form.details[item.id].tidak = false }" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].tidak" dense @update:model-value="val => { if(val) form.details[item.id].ya = false }" />
                </td>
                <td>
                  <q-input v-model="form.details[item.id].keterangan" dense outlined bg-color="white" placeholder="Catatan/hasil observasi" style="font-size: 11px;" />
                </td>
              </tr>

              <!-- 6 Jam Setelah Jatuh -->
              <tr v-for="(item, idx) in master6Jam" :key="'6jam-' + idx">
                <td v-if="idx === 0" :rowspan="master6Jam.length" class="text-weight-bold text-center bg-grey-2 align-middle">
                  6 Jam Setelah Jatuh
                </td>
                <td class="text-caption">
                  <span class="text-weight-bold q-mr-xs">{{ item.code }}.</span>
                  {{ item.label }}
                </td>
                <td>
                  <q-input v-model="form.details[item.id].jam" dense outlined bg-color="white" mask="time" placeholder="HH:mm" style="font-size: 11px;" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].ya" dense @update:model-value="val => { if(val) form.details[item.id].tidak = false }" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].tidak" dense @update:model-value="val => { if(val) form.details[item.id].ya = false }" />
                </td>
                <td>
                  <q-input v-model="form.details[item.id].keterangan" dense outlined bg-color="white" placeholder="Catatan/hasil observasi" style="font-size: 11px;" />
                </td>
              </tr>

              <!-- 6-12 Jam Setelah Jatuh -->
              <tr v-for="(item, idx) in master612Jam" :key="'612jam-' + idx">
                <td v-if="idx === 0" :rowspan="master612Jam.length" class="text-weight-bold text-center bg-grey-2 align-middle">
                  6 - 12 Jam Setelah Jatuh
                </td>
                <td class="text-caption">
                  <span v-if="item.code" class="text-weight-bold q-mr-xs">{{ item.code }}.</span>
                  <span :class="{'text-weight-bold text-primary': !item.code}">{{ item.label }}</span>
                </td>
                <td>
                  <q-input v-model="form.details[item.id].jam" dense outlined bg-color="white" mask="time" placeholder="HH:mm" style="font-size: 11px;" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].ya" dense @update:model-value="val => { if(val) form.details[item.id].tidak = false }" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].tidak" dense @update:model-value="val => { if(val) form.details[item.id].ya = false }" />
                </td>
                <td>
                  <q-input v-model="form.details[item.id].keterangan" dense outlined bg-color="white" placeholder="Catatan/hasil observasi" style="font-size: 11px;" />
                </td>
              </tr>

              <!-- 12-48 Jam Setelah Jatuh -->
              <tr v-for="(item, idx) in master1248Jam" :key="'1248jam-' + idx">
                <td v-if="idx === 0" :rowspan="master1248Jam.length" class="text-weight-bold text-center bg-grey-2 align-middle">
                  12 - 48 Jam Setelah Jatuh
                </td>
                <td class="text-caption">
                  <span v-if="item.code" class="text-weight-bold q-mr-xs">{{ item.code }}.</span>
                  <span :class="{'text-weight-bold text-primary': !item.code}">{{ item.label }}</span>
                </td>
                <td>
                  <q-input v-model="form.details[item.id].jam" dense outlined bg-color="white" mask="time" placeholder="HH:mm" style="font-size: 11px;" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].ya" dense @update:model-value="val => { if(val) form.details[item.id].tidak = false }" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].tidak" dense @update:model-value="val => { if(val) form.details[item.id].ya = false }" />
                </td>
                <td>
                  <q-input v-model="form.details[item.id].keterangan" dense outlined bg-color="white" placeholder="Catatan/hasil observasi" style="font-size: 11px;" />
                </td>
              </tr>

              <!-- 48-72 Jam Setelah Jatuh -->
              <tr v-for="(item, idx) in master4872Jam" :key="'4872jam-' + idx">
                <td v-if="idx === 0" :rowspan="master4872Jam.length" class="text-weight-bold text-center bg-grey-2 align-middle">
                  48 - 72 Jam Setelah Jatuh
                </td>
                <td class="text-caption">
                  {{ item.label }}
                </td>
                <td>
                  <q-input v-model="form.details[item.id].jam" dense outlined bg-color="white" mask="time" placeholder="HH:mm" style="font-size: 11px;" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].ya" dense @update:model-value="val => { if(val) form.details[item.id].tidak = false }" />
                </td>
                <td class="text-center">
                  <q-checkbox v-model="form.details[item.id].tidak" dense @update:model-value="val => { if(val) form.details[item.id].ya = false }" />
                </td>
                <td>
                  <q-input v-model="form.details[item.id].keterangan" dense outlined bg-color="white" placeholder="Catatan/hasil observasi" style="font-size: 11px;" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <!-- Footer Actions -->
        <q-card-actions align="right" class="bg-grey-2 col-auto q-pa-sm border-top">
          <q-btn flat label="Batal" color="dark" v-close-popup />
          <q-btn color="primary" icon="icon-mat-save" label="Simpan Monitoring" :loading="storeUlang.loadingSave" @click="simpanData" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'
import { Dialog } from 'quasar'

import { useAplikasiStore } from 'src/stores/app/aplikasi'

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

const storeUlang = useAsesmenJatuhNyeriStore()
const appStore = useAplikasiStore()

// PPA User Login
const currentUserPegawai = computed(() => {
  return localStorage.getItem('kdpegsimrs') || 'PPA'
})

// Form Dialog Control & Model State
const formOpen = ref(false)
const form = ref({
  id: null,
  tgl_jatuh: new Date().toISOString().slice(0, 10),
  jam_jatuh: new Date().toTimeString().slice(0, 5),
  details: {}
})

// Definition Master Items Form
const masterTindakanSegera = [
  { id: 'segera_1', code: '1', label: 'Jangan langsung memindahkan pasien, tenangkan pasien', category: 'segera' },
  { id: 'segera_2', code: '2', label: 'Panggil bantuan', category: 'segera' },
  { id: 'segera_3', code: '3', label: 'Immobilisasi tulang servical (beri penyangga leher) jika dicurigai atau didapatkan nyeri kepala dan nyeri leher dan periksa untuk resiko cedera yang lain', category: 'segera' },
  { id: 'segera_4', code: '4', label: 'Pindahkan ke tempat yang aman', category: 'segera' },
  { id: 'segera_5', code: '5', label: 'Observasi tanda-tanda vital (TD, RR, SpO2, GDA, suhu, nyeri) bila didapatkan cedera. Pemeriksaan SpO2 dan GDA disesuaikan dengan keadaan pasien (kolaborasi dengan medis)', category: 'segera' },
  { id: 'segera_6', code: '6', label: 'Observasi dan pengkajian neurologis meliputi GCS, gaya bicara, abnormalitas pergerakan mata dan pupil, ketidak simetrisan wajah, kekuatan otot, refleks dan respon', category: 'segera' },
  { id: 'segera_7', code: '7', label: 'Observasi bila ada delirium dan tanda-tanda kebingungan, nyeri kepala, amnesia, muntah atau perubahan tingkat kesadaran', category: 'segera' },
  { id: 'segera_8', code: '8', label: 'Bila ada luka, bersihkan dan balut luka, pertimbangkan status imunisasi tetanus', category: 'segera' },
  { id: 'segera_9', code: '9', label: 'Batasi pergerakan pasien', category: 'segera' },
  { id: 'segera_10a', code: '10.a', label: 'Laporkan pada DPJP dan mintalah advis: Pertimbangkan kebutuhan pengurangan nyeri dan analgesik sesuai indikasi', category: 'segera' },
  { id: 'segera_10b', code: '10.b', label: 'Laporkan pada DPJP dan mintalah advis: Lakukan pemeriksaan lain yang relevan bila diperlukan (tes darah WBC/leukosit, PTT/KPTT, ECG, foto rontgen, CT scan kepala)', category: 'segera' },
  { id: 'segera_10c', code: 'Catatan', label: 'Catatan: Bila ada cedera, observasi dilanjutkan ke tahap berikutnya. Bila tidak ada cedera, intervensi pengurangan jatuh dilakukan seperti sebelumnya', category: 'segera' }
]

const master6Jam = [
  { id: 'jam6_1', code: '1', label: 'Catat TTV dan observasi status neurologi tiap 30-60 menit selama 4 jam dan tinjau kembali', category: 'jam6' },
  { id: 'jam6_2', code: '2', label: 'Laporkan pada DPJP/PP dan mintalah advis bila ada perubahan visual, gangguan bicara, dan perubahan motorik/sensorik', category: 'jam6' },
  { id: 'jam6_3', code: '3', label: 'Lanjutkan investigasi dan pengobatan cedera', category: 'jam6' },
  { id: 'jam6_4', code: '4', label: 'Persiapkan pasien dan keluarga untuk edukasi ulang manajemen resiko jatuh', category: 'jam6' },
  { id: 'jam6_5', code: '5', label: 'Catat di CPPT', category: 'jam6' },
  { id: 'jam6_6', code: '6', label: 'Bantu kebutuhan dasar pasien dengan strategi manajemen setelah jatuh', category: 'jam6' },
  { id: 'jam6_7', code: '7', label: 'Laporkan kejadian jatuh, hasil dan perencanaan perawatan kepada PMKP', category: 'jam6' }
]

const master612Jam = [
  { id: 'jam612_A', code: '', label: 'A. Jatuh yang tidak disaksikan mengenai kepala ATAU dalam pengobatan antikoagulan / antiplatelet', category: 'jam612' },
  { id: 'jam612_A1', code: '-', label: 'Lanjutkan observasi neurologis berdasarkan kondisi pasien, 30-60 menit sesuai indikasi dengan parameter di lembar observasi; tiap 4 jam jika stabil', category: 'jam612' },
  { id: 'jam612_B', code: '', label: 'B. Jatuh yang disaksikan dan tidak mengenai kepala DAN tidak dalam pengobatan antikoagulan / antiplatelet', category: 'jam612' },
  { id: 'jam612_B1', code: '-', label: 'Lanjutkan observasi TTV paling tidak tiap shift selama 72 jam lalu tinjau ulang', category: 'jam612' },
  { id: 'jam612_B2', code: '-', label: 'Laporkan pada DPJP dan mintalah advis bila ada perubahan visual, gangguan bicara, dan perubahan motorik/sensorik', category: 'jam612' },
  { id: 'jam612_B3', code: '-', label: 'Pastikan semua hasil pemeriksaan telah dilaporkan pada DPJP dan telah ditindaklanjuti', category: 'jam612' },
  { id: 'jam612_B4', code: '-', label: 'Modifikasi lingkungan pasien untuk mengurangi jatuh', category: 'jam612' },
  { id: 'jam612_B5', code: '-', label: 'Lanjutkan edukasi pada pasien dan keluarga tentang manajemen resiko jatuh dan evaluasi tingkat keberhasilan edukasi', category: 'jam612' },
  { id: 'jam612_B6', code: '-', label: 'Catatan: Bila ada perubahan kondisi pasien, observasi dilanjutkan sampai 72 jam setelah jatuh', category: 'jam612' }
]

const master1248Jam = [
  { id: 'jam1248_A', code: '', label: 'A. Jatuh yang tidak disaksikan mengenai kepala ATAU dalam pengobatan antikoagulan / antiplatelet', category: 'jam1248' },
  { id: 'jam1248_A1', code: '-', label: 'Lanjutkan observasi neurologis berdasarkan kondisi pasien, 30-60 menit sesuai indikasi dengan parameter di lembar observasi; tiap 4 jam jika stabil', category: 'jam1248' },
  { id: 'jam1248_B', code: '', label: 'B. Jatuh yang disaksikan dan tidak mengenai kepala DAN tidak dalam pengobatan antikoagulan / antiplatelet', category: 'jam1248' },
  { id: 'jam1248_B1', code: '-', label: 'Laporkan pada DPJP/PP dan mintalah advis bila ada perubahan visual, gangguan bicara, dan perubahan motorik/sensorik', category: 'jam1248' },
  { id: 'jam1248_B2', code: '-', label: 'Pastikan semua hasil pemeriksaan telah dilaporkan pada DPJP dan telah ditindaklanjuti', category: 'jam1248' },
  { id: 'jam1248_B3', code: '-', label: 'Pastikan rencana perawatan berjalan efektif', category: 'jam1248' },
  { id: 'jam1248_B4', code: '-', label: 'Lanjutkan edukasi pada pasien dan keluarga tentang manajemen resiko jatuh', category: 'jam1248' }
]

const master4872Jam = [
  { id: 'jam4872_1', code: '1', label: 'Jika pasien stabil dalam 72 jam setelah jatuh, kembali pada observasi tingkat sebelum jatuh', category: 'jam4872' },
  { id: 'jam4872_2', code: '2', label: 'Dokter dan perawat harus melengkapi rencana perawatan pada lembar observasi pasien', category: 'jam4872' }
]

const allMasterItems = [
  ...masterTindakanSegera,
  ...master6Jam,
  ...master612Jam,
  ...master1248Jam,
  ...master4872Jam
]

// Helper untuk menambah menit/jam ke jam_jatuh
function calcOffsetTime(baseJam, addMinutes) {
  if (!baseJam || !baseJam.includes(':')) return ''
  const [h, m] = baseJam.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''
  const date = new Date()
  date.setHours(h, m + addMinutes, 0, 0)
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// Inisialisasi Form Model
function resetForm() {
  const defaultJamJatuh = new Date().toTimeString().slice(0, 5)
  const defaultTglJatuh = new Date().toISOString().slice(0, 10)

  const detailsObj = {}
  allMasterItems.forEach(item => {
    let jamDefault = ''
    if (item.category === 'segera') {
      // Tindakan segera: default jam saat kejadian
      jamDefault = defaultJamJatuh
    } else if (item.category === 'jam6') {
      // 6 jam setelah jatuh: default 6 jam (360 menit) setelah jam kejadian
      jamDefault = calcOffsetTime(defaultJamJatuh, 360)
    }

    detailsObj[item.id] = {
      jam: jamDefault,
      tgl: defaultTglJatuh,
      ya: false,
      tidak: false,
      keterangan: '',
      label: item.label,
      code: item.code,
      category: item.category
    }
  })

  form.value = {
    id: null,
    tgl_jatuh: defaultTglJatuh,
    jam_jatuh: defaultJamJatuh,
    details: detailsObj
  }
}

// Update otomatis jam default di tabel bila User mengubah Jam Kejadian Jatuh (jam_jatuh)
function updateDefaultTimesFromJamJatuh(newJam) {
  if (!newJam || form.value.id) return // Jangan overwrite jika mode Edit
  masterTindakanSegera.forEach(item => {
    if (form.value.details[item.id]) {
      form.value.details[item.id].jam = newJam
    }
  })
  master6Jam.forEach(item => {
    if (form.value.details[item.id]) {
      form.value.details[item.id].jam = calcOffsetTime(newJam, 360)
    }
  })
}

function bukaForm() {
  resetForm()
  formOpen.value = true
}

function bukaEdit(item) {
  resetForm()
  form.value.id = item.id
  form.value.tgl_jatuh = item.tgl_jatuh || item.tanggal?.slice(0, 10)
  form.value.jam_jatuh = item.jam_jatuh || item.tanggal?.slice(11, 16)
  
  if (item.details && typeof item.details === 'object') {
    Object.keys(item.details).forEach(key => {
      if (form.value.details[key]) {
        form.value.details[key] = {
          ...form.value.details[key],
          ...item.details[key]
        }
      }
    })
  }
  formOpen.value = true
}

async function simpanData() {
  const currentKdPeg = localStorage.getItem('kdpegsimrs') || ''
  const currentNamaPeg = appStore.user?.pegawai?.nama || appStore.user?.nama || localStorage.getItem('nama') || 'Perawat'

  // Injeksikan identitas PPA/Perawat per poin jika poin tersebut diisi/diupdate
  const updatedDetails = { ...form.value.details }
  Object.keys(updatedDetails).forEach(k => {
    const d = updatedDetails[k]
    if (d.ya || d.tidak || d.keterangan || d.jam) {
      if (!d.kdpegsimrs) {
        d.kdpegsimrs = currentKdPeg
        d.petugas = currentNamaPeg
      }
    }
  })

  const payload = {
    id: form.value.id,
    noreg: props.pasien?.noreg,
    norm: props.pasien?.norm,
    kdruang: props.pasien?.kdruang || props.pasien?.koderuangan,
    tgl_jatuh: form.value.tgl_jatuh,
    jam_jatuh: form.value.jam_jatuh,
    details: updatedDetails
  }

  const success = await storeUlang.simpanPascaJatuh(props.pasien, payload)
  if (success) {
    formOpen.value = false
  }
}

function hapusItem(item) {
  Dialog.create({
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data monitoring pasca jatuh ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    storeUlang.hapusPascaJatuh(props.pasien, item.id)
  })
}

// Map Item Data untuk Tampilan List
const mappedItems = computed(() => {
  if (!storeUlang.itemsPascaJatuh) return []
  return storeUlang.itemsPascaJatuh.map(raw => {
    const details = typeof raw.details === 'string' ? JSON.parse(raw.details || '{}') : (raw.details || {})
    
    // Grouping rincian per rentang waktu untuk tampilan list
    const detailsGrouped = {
      segera: { label: 'Tindakan Segera', list: [] },
      jam6: { label: '6 Jam Setelah Jatuh', list: [] },
      jam612: { label: '6 - 12 Jam Setelah Jatuh', list: [] },
      jam1248: { label: '12 - 48 Jam Setelah Jatuh', list: [] },
      jam4872: { label: '48 - 72 Jam Setelah Jatuh', list: [] }
    }

    let totalTindakan = 0

    Object.keys(details).forEach(key => {
      const itemDetail = details[key]
      if (itemDetail.ya || itemDetail.tidak || itemDetail.keterangan || itemDetail.jam) {
        totalTindakan++
        const catKey = itemDetail.category || 'segera'
        if (detailsGrouped[catKey]) {
          detailsGrouped[catKey].list.push(itemDetail)
        }
      }
    })

    return {
      ...raw,
      petugas: raw.pegawai?.nama || 'Petugas',
      tanggal: raw.created_at || raw.tgl_jatuh,
      total_tindakan: totalTindakan,
      details_grouped: detailsGrouped
    }
  })
})

onMounted(() => {
  if (props.pasien) {
    storeUlang.getData(props.pasien)
  }
})
</script>

<style lang="scss" scoped>
.border-left {
  border-left: 1px solid #e0e0e0;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
.align-middle {
  vertical-align: middle;
}
</style>
