<template>
  <div class="column full-height full-width bg-grey-2" style="overflow: hidden;">
    <!-- Patient Header Banner -->
    <div class="bg-dark text-white q-pa-md row items-center justify-between shadow-2">
      <div class="row items-center q-gutter-md">
        <q-avatar size="50px" color="teal" text-color="white" icon="person" />
        <div>
          <div class="text-h6 text-weight-bold row items-center">
            {{ store.selectedPasien?.nama ?? '-' }}
            <q-badge color="teal" class="q-ml-sm text-caption text-weight-bold">
              {{ store.selectedPasien?.norm ?? '-' }}
            </q-badge>
          </div>
          <div class="text-caption text-grey-4 row items-center q-gutter-x-md">
            <span>Noreg: <b class="text-yellow">{{ store.selectedPasien?.noreg ?? '-' }}</b></span>
            <span>|</span>
            <span>Usia: <b>{{ store.selectedPasien?.usia ?? '-' }}</b></span>
            <span>|</span>
            <span>Kelamin: <b>{{ store.selectedPasien?.kelamin === 'L' ? 'Laki-laki' : store.selectedPasien?.kelamin === 'P' ? 'Perempuan' : store.selectedPasien?.kelamin ?? '-' }}</b></span>
          </div>
        </div>
      </div>

      <div class="row items-center q-gutter-md">
        <div class="row q-gutter-md text-right text-caption">
          <div>
            <div>DPJP: <span class="text-yellow text-weight-bold">{{ store.selectedPasien?.dokter ?? '-' }}</span></div>
            <div>Unit/Poli: <span class="text-teal-4 text-weight-bold">{{ store.selectedPasien?.poli ?? store.selectedPasien?.ruangan ?? '-' }}</span></div>
          </div>
          <q-separator dark vertical />
          <div>
            <div>Sistem Bayar: <span class="text-orange text-weight-bold">{{ store.selectedPasien?.sistembayar ?? '-' }}</span></div>
            <div>Status Pasien: <span class="text-grey-4">{{ getStatus(store.selectedPasien?.status) }}</span></div>
          </div>
        </div>
        <q-separator dark vertical />
        <q-btn
          flat
          round
          color="white"
          icon="close"
          size="md"
          @click="store.closeWorkspace()"
        >
          <q-tooltip class="bg-red text-white text-weight-bold">Tutup Workspace</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Main Workspace Layout -->
    <div class="row no-wrap col" style="overflow: hidden; min-height: 0;">
      <!-- Sidebar Navigation -->
      <div class="col-auto bg-white border-right shadow-1 column" style="width: 260px;">
        <q-list padding class="text-grey-8">
          <q-item-label header class="text-weight-bold text-uppercase text-grey-6 f-10">Menu Farmasi Klinis</q-item-label>

          <q-item
            clickable
            v-ripple
            :active="store.activeMenu === 'edukasi'"
            active-class="bg-teal-1 text-teal text-weight-bold"
            @click="setMenu('edukasi')"
          >
            <q-item-section avatar>
              <q-icon name="menu_book" />
            </q-item-section>
            <q-item-section>Edukasi Farmasi</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="store.activeMenu === 'pio'"
            active-class="bg-teal-1 text-teal text-weight-bold"
            @click="setMenu('pio')"
          >
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>Info PIO</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="store.activeMenu === 'meso'"
            active-class="bg-teal-1 text-teal text-weight-bold"
            @click="setMenu('meso')"
          >
            <q-item-section avatar>
              <q-icon name="report_problem" />
            </q-item-section>
            <q-item-section>Monitoring ESO (MESO)</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Content Area -->
      <div class="col column bg-grey-1" style="overflow: auto; min-height: 0;">
        <!-- PANEL EDUKASI FARMASI -->
        <div v-if="store.activeMenu === 'edukasi'" class="q-pa-lg">
          <div class="row justify-between items-center q-mb-md print-hide sticky-header">
            <div class="text-h6 text-teal text-weight-bold">Formulir Edukasi Farmasi</div>
            <div class="row q-gutter-sm">
              <q-btn color="dark" icon="print" label="Cetak Edukasi" no-caps @click="cetakEdukasi()" />
              <q-btn color="teal" icon="save" label="Simpan Edukasi" no-caps @click="simpanEdukasi()" />
            </div>
          </div>

          <div id="print-area-edukasi" class="bg-white q-pa-lg shadow-1 border-radius-4">
            <!-- Kop Cetak (Only visible during printing) -->
            <div class="print-only text-center q-mb-md">
              <div class="text-h6 text-weight-bold">FORM EDUKASI FARMASI PASIEN</div>
              <div class="text-subtitle2 text-weight-medium">RSUD DOKTER MOHAMAD SALEH - KOTA PROBOLINGGO</div>
              <q-separator class="q-my-sm" color="black" />
              <!-- Patient Print Summary Info -->
              <div class="row q-col-gutter-sm text-left f-11 q-mb-md">
                <div class="col-6">
                  Nama Pasien: <b>{{ store.selectedPasien?.nama }}</b><br>
                  No RM: <b>{{ store.selectedPasien?.norm }}</b><br>
                  No Reg: <b>{{ store.selectedPasien?.noreg }}</b>
                </div>
                <div class="col-6">
                  Usia / Kelamin: <b>{{ store.selectedPasien?.usia }} / {{ store.selectedPasien?.kelamin }}</b><br>
                  Poli/Ruangan: <b>{{ store.selectedPasien?.poli ?? store.selectedPasien?.ruangan }}</b><br>
                  Sistem Bayar: <b>{{ store.selectedPasien?.sistembayar }}</b>
                </div>
              </div>
            </div>

            <!-- Tanggal Edukasi -->
            <div class="row items-center q-mb-md print-hide">
              <div class="col-12 col-sm-3 text-weight-bold">Tanggal Edukasi :</div>
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="formEdukasi.tanggal" type="date" />
              </div>
            </div>

            <!-- Table of Edukasi Items -->
            <q-markup-table flat bordered class="col" style="min-width: 600px;">
              <thead>
                <tr class="bg-teal text-white">
                  <th style="width: 50px;" class="text-center">No</th>
                  <th style="width: 250px;" class="text-left">Poin Edukasi</th>
                  <th style="width: 120px;" class="text-center">Status Jelaskan</th>
                  <th class="text-left">Keterangan / Catatan Tambahan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in edukasiItems" :key="item.key">
                  <td class="text-center text-weight-bold">{{ index + 1 }}</td>
                  <td class="text-weight-bold text-teal text-left">{{ item.label }}</td>
                  <td class="text-center">
                    <q-checkbox v-model="formEdukasi[item.key + '_chk']" color="teal" />
                  </td>
                  <td>
                    <q-input
                      v-model="formEdukasi[item.key + '_keterangan']"
                      outlined
                      dense
                      type="textarea"
                      rows="2"
                      placeholder="Masukkan catatan free text untuk edukasi ini..."
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <!-- Verifikasi Pemahaman & Tanda Tangan -->
            <div class="row q-col-gutter-lg q-mt-md">
              <div class="col-12 col-md-6 column justify-between">
                <div>
                  <div class="text-weight-bold text-teal q-mb-sm">Verifikasi Pemahaman Pasien / Keluarga :</div>
                  <q-option-group
                    v-model="formEdukasi.pemahaman"
                    :options="[
                      { label: 'Paham sepenuhnya', value: 'paham' },
                      { label: 'Belum Paham / Perlu Edukasi Ulang', value: 'tidak_paham' }
                    ]"
                    color="teal"
                    inline
                  />
                </div>

                <div class="q-mt-md">
                  <div class="text-weight-bold text-teal q-mb-sm">Nama Penerima / Pengambil Obat :</div>
                  <q-input v-model="formEdukasi.penerima" outlined dense placeholder="Masukkan nama keluarga / pengambil obat..." />
                </div>

                <div class="q-mt-md print-hide">
                  <div class="text-weight-bold text-teal q-mb-sm">Nama Petugas Farmasi :</div>
                  <app-autocomplete
                    v-model="formEdukasi.petugas"
                    label="Apoteker / Petugas"
                    autocomplete="nama"
                    option-label="nama"
                    option-value="kdpegsimrs"
                    outlined
                    dense
                    :source="eresepStore.apotekers"
                  />
                </div>
              </div>

              <!-- Signature Component -->
              <div class="col-12 col-md-6 column items-center">
                <div class="text-weight-bold text-teal q-mb-sm align-self-start">Tanda Tangan Penerima / Pengambil Obat :</div>
                <div class="print-hide full-width" style="max-width: 350px;">
                  <app-signature
                    :ttd="formEdukasi.tanda_tangan"
                    @save-ttd="(val) => formEdukasi.tanda_tangan = val"
                    :pasien="store.selectedPasien"
                    uuid="edukasifarmasi"
                    label-ttd="Tanda Tangan Penerima / Pengambil Obat"
                    :width="350"
                    :height="180"
                  />
                </div>
                <!-- Display Signature on Print -->
                <div class="print-only border q-pa-sm text-center" style="width: 250px; height: 120px;">
                  <img v-if="formEdukasi.tanda_tangan" :src="formEdukasi.tanda_tangan" style="max-height: 100px; max-width: 100%; object-fit: contain;" />
                  <div v-else class="text-grey-5 f-10 q-mt-xl">Tidak ada tanda tangan</div>
                </div>
              </div>
            </div>

            <!-- Print Signatures Names -->
            <div class="print-only row justify-between q-mt-xl" style="font-size: 11px;">
              <div class="text-center" style="width: 200px;">
                Petugas Farmasi,<br><br><br><br>
                <u><b>( {{ formEdukasi.petugas || '..................................' }} )</b></u>
              </div>
              <div class="text-center" style="width: 200px;">
                Penerima Edukasi / Obat,<br><br><br><br>
                <u><b>( {{ formEdukasi.penerima || '..................................' }} )</b></u>
              </div>
            </div>
          </div>
        </div>

        <!-- PANEL INFO PIO -->
        <div v-else-if="store.activeMenu === 'pio'" class="q-pa-lg bg-white">
          <InfoPage />
        </div>

        <!-- PANEL MONITORING ESO (MESO) -->
        <div v-if="store.activeMenu === 'meso'" class="q-pa-lg">
          <div class="row justify-between items-center q-mb-md print-hide sticky-header">
            <div class="text-h6 text-teal text-weight-bold">Monitoring Efek Samping Obat (MESO)</div>
            <div class="row q-gutter-sm">
              <q-btn color="dark" icon="print" label="Cetak MESO" no-caps @click="cetakMeso()" />
              <q-btn color="teal" icon="save" label="Simpan MESO" no-caps @click="simpanMeso()" />
            </div>
          </div>

          <div id="print-area-meso" class="bg-white q-pa-lg shadow-1 border-radius-4">
            <!-- Kop Cetak (Only visible during printing) -->
            <div class="print-only text-center q-mb-md">
              <div class="text-h6 text-weight-bold text-uppercase">FORM MONITORING EFEK SAMPING OBAT (MESO)</div>
              <div class="text-subtitle2 text-weight-medium">RSUD DOKTER MOHAMAD SALEH - KOTA PROBOLINGGO</div>
              <q-separator class="q-my-sm" color="black" />
              <!-- Patient Print Summary Info -->
              <div class="row q-col-gutter-sm text-left f-11 q-mb-md">
                <div class="col-6">
                  Nama Pasien: <b>{{ store.selectedPasien?.nama }}</b><br>
                  No RM: <b>{{ store.selectedPasien?.norm }}</b><br>
                  No Reg: <b>{{ store.selectedPasien?.noreg }}</b>
                </div>
                <div class="col-6">
                  Usia / Kelamin: <b>{{ store.selectedPasien?.usia }} / {{ store.selectedPasien?.kelamin }}</b><br>
                  Poli/Ruangan: <b>{{ store.selectedPasien?.poli ?? store.selectedPasien?.ruangan }}</b><br>
                  Sistem Bayar: <b>{{ store.selectedPasien?.sistembayar }}</b>
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <!-- Tanggal Monitoring -->
              <div class="col-12 col-sm-6">
                <div class="text-weight-bold text-teal q-mb-xs">Tanggal Monitoring :</div>
                <q-input dense outlined v-model="formMeso.tanggal" type="date" />
              </div>

              <!-- Petugas -->
              <div class="col-12 col-sm-6 print-hide">
                <div class="text-weight-bold text-teal q-mb-xs">Nama Petugas Farmasi :</div>
                <app-autocomplete
                  v-model="formMeso.petugas"
                  label="Apoteker / Petugas"
                  autocomplete="nama"
                  option-label="nama"
                  option-value="kdpegsimrs"
                  outlined
                  dense
                  :source="eresepStore.apotekers"
                />
              </div>

              <!-- Keluhan -->
              <div class="col-12">
                <div class="text-weight-bold text-teal q-mb-xs">Keluhan Efek Samping yang Terjadi :</div>
                <q-input
                  v-model="formMeso.keluhan"
                  outlined
                  type="textarea"
                  rows="3"
                  placeholder="Deskripsikan dengan detail keluhan efek samping obat yang dialami pasien..."
                />
              </div>

              <!-- Obat yang Dicurigai -->
              <div class="col-12">
                <div class="text-weight-bold text-teal q-mb-xs">Obat yang Dicurigai Menimbulkan Efek Samping :</div>
                <q-input
                  v-model="formMeso.obat_dicurigai"
                  outlined
                  placeholder="Masukkan nama obat, dosis, dan aturan pakai obat yang dicurigai..."
                />
              </div>

              <!-- Tindakan yang Diambil -->
              <div class="col-12">
                <div class="text-weight-bold text-teal q-mb-xs">Tindakan / Penanganan yang Diambil :</div>
                <q-input
                  v-model="formMeso.tindakan_diambil"
                  outlined
                  type="textarea"
                  rows="3"
                  placeholder="Masukkan tindakan medis / farmakologis yang telah diberikan..."
                />
              </div>

              <!-- Kondisi Akhir / Outcome -->
              <div class="col-12">
                <div class="text-weight-bold text-teal q-mb-xs">Kondisi Akhir Pasien / Outcome :</div>
                <q-input
                  v-model="formMeso.outcome"
                  outlined
                  placeholder="Contoh: Sembuh tanpa gejala sisa, membaik, keluhan berlanjut, obat dihentikan, dll..."
                />
              </div>
            </div>

            <!-- Print Signatures Names -->
            <div class="print-only row justify-end q-mt-xl" style="font-size: 11px;">
              <div class="text-center" style="width: 250px;">
                Probolinggo, {{ formMeso.tanggal ? dateFullFormat(formMeso.tanggal) : '.....................' }}<br>
                Petugas Farmasi yang Melaporkan,<br><br><br><br>
                <u><b>( {{ formMeso.petugas || '..................................' }} )</b></u>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Cetak/Dokumen Edukasi -->
    <CetakEdukasiDialog v-model="isOpenCetakEdukasi" :pasien="store.selectedPasien" :form="formEdukasi" :apotekers="eresepStore.apotekers" />

    <!-- Dialog Cetak/Dokumen MESO -->
    <CetakMesoDialog v-model="isOpenCetakMeso" :pasien="store.selectedPasien" :form="formMeso" :apotekers="eresepStore.apotekers" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineAsyncComponent, nextTick } from 'vue'
import { api } from 'src/boot/axios'
import { useKunjunganPasienDepoStore } from 'src/stores/simrs/farmasi/kunjungan/kunjunganPasien'
import { useEResepDepoFarmasiStore } from 'src/stores/simrs/farmasi/eresep/eresep'
import { dateFullFormat } from 'src/modules/formatter'
import { useQuasar } from 'quasar'

const InfoPage = defineAsyncComponent(() => import('../../eresep/comp/InfoPage.vue'))
const CetakEdukasiDialog = defineAsyncComponent(() => import('./CetakEdukasiDialog.vue'))
const CetakMesoDialog = defineAsyncComponent(() => import('./CetakMesoDialog.vue'))

const store = useKunjunganPasienDepoStore()
const eresepStore = useEResepDepoFarmasiStore()
const $q = useQuasar()

const isOpenCetakEdukasi = ref(false)
const isOpenCetakMeso = ref(false)

// Form States
const formEdukasi = reactive({
  tanggal: new Date().toISOString().substring(0, 10),
  indikasi_chk: false,
  indikasi_keterangan: '',
  aturan_chk: false,
  aturan_keterangan: '',
  antibiotik_chk: false,
  antibiotik_keterangan: '',
  penyimpanan_chk: false,
  penyimpanan_keterangan: '',
  jangka_chk: false,
  jangka_keterangan: '',
  interaksi_chk: false,
  interaksi_keterangan: '',
  efek_samping_chk: false,
  efek_samping_keterangan: '',
  pemahaman: 'paham',
  penerima: '',
  tanda_tangan: '',
  petugas: ''
})

const formMeso = reactive({
  tanggal: new Date().toISOString().substring(0, 10),
  keluhan: '',
  obat_dicurigai: '',
  tindakan_diambil: '',
  outcome: '',
  petugas: ''
})

const edukasiItems = [
  { key: 'indikasi', label: 'Indikasi / Kegunaan Obat' },
  { key: 'aturan', label: 'Aturan & Cara Pakai Obat' },
  { key: 'antibiotik', label: 'Aturan Khusus Antibiotik' },
  { key: 'penyimpanan', label: 'Cara Penyimpanan & Stabilitas Obat' },
  { key: 'jangka', label: 'Jangka Waktu Pemakaian Obat' },
  { key: 'interaksi', label: 'Potensi Interaksi Obat' },
  { key: 'efek_samping', label: 'Potensi Efek Samping Obat' }
]

function getStatus(val) {
  if (val === '') return 'BELUM TERLAYANI'
  if (val === '1') return 'TERLAYANI'
  if (val === '2') return 'SUDAH DITERIMA'
  return 'TIDAK HADIR'
}

function setMenu(val) {
  store.activeMenu = val
  if (val === 'pio') {
    eresepStore.setInfo(store.selectedPasien)
  } else if (val === 'edukasi') {
    loadEdukasi()
  } else if (val === 'meso') {
    loadMeso()
  }
}

// Loading Data from Backend
async function loadEdukasi() {
  try {
    const resp = await api.get('v1/simrs/farmasinew/depo/get-edukasi-farmasi', {
      params: { norm: store.selectedPasien?.norm, noreg: store.selectedPasien?.noreg }
    })
    if (resp.data) {
      Object.assign(formEdukasi, resp.data)
      // Parse database chk values to boolean
      edukasiItems.forEach(item => {
        formEdukasi[item.key + '_chk'] = !!resp.data[item.key + '_chk']
      })
      if (resp.data.tanggal) {
        formEdukasi.tanggal = resp.data.tanggal.substring(0, 10)
      }
    } else {
      resetEdukasiForm()
    }
  } catch (err) {
    console.error('Failed to load edukasi data', err)
  }
}

function resetEdukasiForm() {
  formEdukasi.indikasi_chk = false
  formEdukasi.indikasi_keterangan = ''
  formEdukasi.aturan_chk = false
  formEdukasi.aturan_keterangan = ''
  formEdukasi.antibiotik_chk = false
  formEdukasi.antibiotik_keterangan = ''
  formEdukasi.penyimpanan_chk = false
  formEdukasi.penyimpanan_keterangan = ''
  formEdukasi.jangka_chk = false
  formEdukasi.jangka_keterangan = ''
  formEdukasi.interaksi_chk = false
  formEdukasi.interaksi_keterangan = ''
  formEdukasi.efek_samping_chk = false
  formEdukasi.efek_samping_keterangan = ''
  formEdukasi.pemahaman = 'paham'
  formEdukasi.penerima = ''
  formEdukasi.tanda_tangan = ''
  formEdukasi.petugas = localStorage.getItem('nama_petugas') ?? ''
}

async function loadMeso() {
  try {
    const resp = await api.get('v1/simrs/farmasinew/depo/get-meso', {
      params: { norm: store.selectedPasien?.norm, noreg: store.selectedPasien?.noreg }
    })
    if (resp.data) {
      Object.assign(formMeso, resp.data)
      if (resp.data.tanggal) {
        formMeso.tanggal = resp.data.tanggal.substring(0, 10)
      }
    } else {
      resetMesoForm()
    }
  } catch (err) {
    console.error('Failed to load meso data', err)
  }
}

function resetMesoForm() {
  formMeso.keluhan = ''
  formMeso.obat_dicurigai = ''
  formMeso.tindakan_diambil = ''
  formMeso.outcome = ''
  formMeso.petugas = localStorage.getItem('nama_petugas') ?? ''
}

// Saving Data to Backend
async function simpanEdukasi() {
  const payload = {
    ...formEdukasi,
    norm: store.selectedPasien?.norm,
    noreg: store.selectedPasien?.noreg,
    // Convert boolean checkmarks to 1 or 0 for MySQL
    indikasi_chk: formEdukasi.indikasi_chk ? 1 : 0,
    aturan_chk: formEdukasi.aturan_chk ? 1 : 0,
    antibiotik_chk: formEdukasi.antibiotik_chk ? 1 : 0,
    penyimpanan_chk: formEdukasi.penyimpanan_chk ? 1 : 0,
    jangka_chk: formEdukasi.jangka_chk ? 1 : 0,
    interaksi_chk: formEdukasi.interaksi_chk ? 1 : 0,
    efek_samping_chk: formEdukasi.efek_samping_chk ? 1 : 0
  }

  // Save the pharmacist name locally for convenience
  if (formEdukasi.petugas) {
    localStorage.setItem('nama_petugas', formEdukasi.petugas)
  }

  $q.loading.show({ message: 'Menyimpan data edukasi...' })
  try {
    const resp = await api.post('v1/simrs/farmasinew/depo/simpan-edukasi-farmasi', payload)
    $q.notify({ type: 'positive', message: resp.data?.message || 'Edukasi farmasi berhasil disimpan!' })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal menyimpan data edukasi' })
  } finally {
    $q.loading.hide()
  }
}

async function simpanMeso() {
  const payload = {
    ...formMeso,
    norm: store.selectedPasien?.norm,
    noreg: store.selectedPasien?.noreg
  }

  if (formMeso.petugas) {
    localStorage.setItem('nama_petugas', formMeso.petugas)
  }

  $q.loading.show({ message: 'Menyimpan data MESO...' })
  try {
    const resp = await api.post('v1/simrs/farmasinew/depo/simpan-meso', payload)
    $q.notify({ type: 'positive', message: resp.data?.message || 'Monitoring ESO berhasil disimpan!' })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal menyimpan data MESO' })
  } finally {
    $q.loading.hide()
  }
}

// Print Handler Functionalities
function cetakEdukasi() {
  isOpenCetakEdukasi.value = true
}

function cetakMeso() {
  isOpenCetakMeso.value = true
}

onMounted(() => {
  eresepStore.getApoteker()
  setMenu('edukasi')
})
</script>

<style scoped>
.border-right {
  border-right: 1px solid #e0e0e0;
}
.border-radius-4 {
  border-radius: 4px;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f5f5; /* matches bg-grey-1 */
  margin-top: -24px;
  padding-top: 24px;
  padding-bottom: 16px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .print-only, .print-only * {
    visibility: visible;
  }
  #print-area-edukasi, #print-area-edukasi * {
    visibility: visible;
  }
  #print-area-meso, #print-area-meso * {
    visibility: visible;
  }
  .print-hide {
    display: none !important;
  }
  #print-area-edukasi, #print-area-meso {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
