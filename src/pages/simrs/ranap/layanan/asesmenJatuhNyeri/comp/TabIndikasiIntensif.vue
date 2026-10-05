<template>
  <div class="column fit bg-grey-2 relative-position">
    <div class="col full-height scroll q-pa-md">
      <!-- Toolbar Atas -->
      <div class="row justify-between items-center q-mb-md bg-white q-pa-md rounded-borders shadow-1">
        <div>
          <div class="text-subtitle1 text-weight-bold text-primary flex items-center q-gutter-x-xs">
            <q-icon name="icon-mat-favorite" size="22px" />
            <span>INDIKASI KELUAR MASUK RUANG INTENSIF</span>
          </div>
          <div class="text-caption text-grey-7">
            Pilih jenis ruangan intensif dan pengisian indikasi pasien masuk / keluar ruang intensif
          </div>
        </div>

        <div class="row q-gutter-x-sm items-center">
          <q-btn :label="'Tambah Indikasi ' + subTab" icon="icon-mat-add" color="primary" unelevated class="q-px-md text-weight-bold" @click="bukaForm" />
        </div>
      </div>

      <!-- Navigasi Tabs Jenis Ruangan Intensif -->
      <div class="q-mb-md">
        <q-tabs v-model="subTab" dense no-caps inline-label class="bg-white text-grey-7 rounded-borders shadow-1" active-color="primary" active-bg-color="blue-1">
          <q-tab name="ICCU" icon="icon-mat-favorite" label="ICCU" />
          <q-tab name="ICU" icon="icon-mat-local_hospital" label="ICU" />
          <q-tab name="NICU" icon="icon-mat-child_care" label="NICU" />
          <q-tab name="INTERMEDIATE" icon="icon-mat-bed" label="Intermediate" />
        </q-tabs>
      </div>

      <!-- Daftar Riwayat Indikasi ICCU -->
      <div v-if="items.length === 0" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1">
        <q-icon name="icon-mat-description" size="48px" class="q-mb-sm" />
        <div class="text-bold">Belum Ada Data Indikasi {{ subTab }}</div>
        <div class="text-caption">Klik tombol "Tambah Indikasi" di atas untuk menambahkan pengisian indikasi baru.</div>
      </div>

      <div v-else class="column q-gutter-y-md">
        <q-card v-for="item in items" :key="item.id" flat bordered class="rounded-borders shadow-1 overflow-hidden bg-white">
          <q-card-section class="bg-blue-grey-1 q-py-sm q-px-md flex items-center justify-between border-bottom">
            <div class="row items-center q-gutter-x-sm">
              <q-badge :color="item.kategori === 'masuk' ? 'teal' : 'orange-9'" class="text-weight-bold q-px-sm q-py-xs">
                INDIKASI {{ item.kategori === 'masuk' ? 'MASUK' : 'KELUAR' }} {{ item.jenis_ruangan }}
              </q-badge>
              <span class="text-caption text-weight-bold text-grey-8">
                Tanggal: {{ dateFullFormat(item.tanggal) }} (Jam {{ jamTnpDetik(item.tanggal) }})
              </span>
            </div>

            <div class="row items-center q-gutter-x-xs">
              <q-btn icon="icon-mat-edit" flat round dense size="sm" color="warning" @click="bukaEdit(item)">
                <q-tooltip>Edit Data</q-tooltip>
              </q-btn>
              <q-btn icon="icon-mat-delete" flat round dense size="sm" color="negative" @click="hapusItem(item)">
                <q-tooltip>Hapus Data</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-7 font-medium">Diagnosis Medis:</div>
                <div class="text-body2 text-weight-bold text-grey-9">{{ item.dx_medis || '-' }}</div>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-7 font-medium">DPJP:</div>
                <div class="text-body2 text-weight-bold text-grey-9">{{ item.dokter_dpjp || pasien?.dokterdpjp || pasien?.dokter || '-' }}</div>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-7 font-medium">Dokter PJ ICCU:</div>
                <div class="text-body2 text-weight-bold text-grey-9">{{ item.dokter_pj || '-' }}</div>
              </div>
            </div>

            <q-separator class="q-my-sm" />

            <div class="text-caption text-grey-7 font-medium q-mb-xs">Kriteria / Pilihan Indikasi yang Dicentang:</div>
            <div v-if="item.pilihan_indikasi && item.pilihan_indikasi.length" class="column q-gutter-y-xs q-pl-sm">
              <div v-for="(pilih, idx) in item.pilihan_indikasi" :key="idx" class="row items-start q-gutter-x-xs text-body2 text-grey-9">
                <q-icon name="icon-mat-check_circle" color="teal" size="16px" class="q-mt-xs" />
                <span>{{ pilih }}</span>
              </div>
            </div>
            <div v-else class="text-caption text-italic text-grey-6">- Tidak ada kriteria checklist yang dipilih -</div>

            <div v-if="item.indikasi_lain" class="q-mt-sm bg-amber-1 q-pa-sm rounded-borders border-amber">
              <div class="text-caption text-weight-bold text-amber-10">Catatan Indikasi Lain / Tambahan:</div>
              <div class="text-body2 text-grey-9">{{ item.indikasi_lain }}</div>
            </div>
          </q-card-section>

          <q-card-section class="bg-grey-1 q-py-xs q-px-md text-caption text-grey-7 flex justify-between items-center border-top">
            <div>Petugas Penginput: <span class="text-weight-bold text-grey-9">{{ item.petugas || '-' }}</span></div>
            <div>ID: #{{ item.id }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- DIALOG FORM INDIKASI ICCU -->
    <q-dialog v-model="dialogOpen" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="column fit bg-grey-3">
        <!-- Header Dialog -->
        <q-card-section class="bg-primary text-white col-auto q-py-sm q-px-md shadow-2">
          <div class="flex items-center justify-between">
            <div class="row items-center q-gutter-x-sm">
              <q-icon name="icon-mat-favorite" size="24px" />
              <div>
                <div class="text-subtitle1 text-weight-bold">
                  {{ isEdit ? 'EDIT' : 'FORM TAMBAH' }} INDIKASI RUANG {{ subTab }}
                </div>
                <div class="text-caption text-blue-2">
                  Pengkajian Kriteria Indikasi Pasien Masuk / Keluar {{ subTab }}
                </div>
              </div>
            </div>
            <q-btn icon="icon-mat-close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <!-- Body Form -->
        <q-card-section class="col scroll q-pa-md">
          <div class="row q-col-gutter-md fit">
            <!-- KIRI: Card Informasi Pasien Modern Glassmorphism & Compact -->
            <div class="col-12 col-md-4">
              <q-card flat class="rounded-borders shadow-3 bg-white overflow-hidden full-height column border-slate">
                <!-- Header Banner Gradient -->
                <div class="bg-gradient-dark text-white q-pa-sm q-px-md flex items-center justify-between border-bottom-teal">
                  <div class="row items-center q-gutter-x-xs">
                    <q-icon name="icon-mat-account_circle" size="18px" class="text-teal-4" />
                    <span class="text-caption text-weight-bold text-uppercase tracking-wider">PASIEN RAWAT INAP</span>
                  </div>
                  <q-chip dense color="amber-10" text-color="white" icon="icon-mat-stars" size="11px" class="text-weight-bold q-px-xs">
                    {{ pasien?.sistembayar || 'UMUM' }}
                  </q-chip>
                </div>

                <q-card-section class="q-pa-sm column q-gutter-y-xs col scroll">
                  <!-- Main Profile Box: Avatar & Identitas Utama -->
                  <div class="row items-center q-gutter-x-sm bg-gradient-profile q-pa-xs rounded-borders border-profile shadow-1">
                    <div class="col-auto flex justify-center">
                      <div class="avatar-wrapper border-avatar shadow-2 bg-white">
                        <AppAvatarPasien :pasien="pasien" width="65px" />
                      </div>
                    </div>
                    <div class="col">
                      <div class="text-subtitle2 text-weight-bolder text-dark leading-tight ellipsis-2-lines">
                        {{ pasien?.nama_panggil || pasien?.nama || '-' }}
                      </div>
                      <div class="text-caption text-teal-9 text-weight-bold q-mt-0 flex items-center q-gutter-x-xs">
                        <q-icon name="icon-mat-cake" size="12px" />
                        <span>{{ pasien?.kelamin || '-' }} ({{ pasien?.usia || '-' }})</span>
                      </div>
                    </div>
                  </div>

                  <!-- Grid RM & Noreg Badges -->
                  <div class="row q-col-gutter-xs">
                    <div class="col-6">
                      <div class="bg-grey-2 q-pa-xs rounded-borders text-center border-subtle">
                        <div class="text-micro text-grey-7 font-bold text-uppercase">NO. REKAM MEDIS (RM)</div>
                        <div class="text-subtitle2 text-weight-bolder text-primary">{{ pasien?.norm || '-' }}</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="bg-grey-2 q-pa-xs rounded-borders text-center border-subtle">
                        <div class="text-micro text-grey-7 font-bold text-uppercase">NO. REGISTRASI</div>
                        <div class="text-caption text-weight-bolder text-grey-9 ellipsis">{{ pasien?.noreg || '-' }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- List Details Compact Timeline Style -->
                  <div class="column q-gutter-y-xs q-mt-xs">
                    <!-- Ruangan & Bed -->
                    <div class="row items-center q-pa-xs bg-teal-50 rounded-borders border-teal-light">
                      <q-icon name="icon-mat-single_bed" size="18px" color=teal-9 class="q-mr-xs" />
                      <div class="col">
                        <div class="text-micro text-teal-8 font-bold text-uppercase">RUANG PERAWATAN & BED</div>
                        <div class="text-caption text-weight-bold text-teal-10 leading-none">
                          {{ pasien?.ruangan || pasien?.keterangan || '-' }} <span class="text-amber-9">• BED {{ pasien?.nobed || '-' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- DPJP Utama -->
                    <div class="row items-center q-pa-xs bg-indigo-50 rounded-borders border-indigo-light">
                      <q-icon name="icon-mat-stethoscope" size="18px" color=indigo-9 class="q-mr-xs" />
                      <div class="col">
                        <div class="text-micro text-indigo-8 font-bold text-uppercase">DOKTER DPJP UTAMA</div>
                        <div class="text-caption text-weight-bold text-indigo-10 leading-none">
                          {{ pasien?.dokterdpjp || pasien?.dokter || '-' }}
                        </div>
                      </div>
                    </div>

                    <!-- Memo Diagnosa Medis -->
                    <div class="row items-start q-pa-xs bg-amber-50 rounded-borders border-amber-light">
                      <q-icon name="icon-mat-notes" size="18px" color=amber-10 class="q-mr-xs q-mt-3xs" />
                      <div class="col">
                        <div class="text-micro text-amber-10 font-bold text-uppercase">DIAGNOSIS MEDIS (MEMO DIAGNOSA)</div>
                        <div class="text-caption text-weight-bold text-grey-10 leading-normal q-mt-3xs">
                          {{ pasien?.memodiagnosa || pasien?.memodiagnosaigd || '-' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- KANAN: Form Pengkajian Indikasi ICCU -->
            <div class="col-12 col-md-8">
              <q-form @submit.prevent="onSubmit" class="column q-gutter-y-md">
              
              <!-- Pilihan Kategori: Masuk vs Keluar -->
              <q-card flat class="rounded-borders shadow-1 bg-white overflow-hidden">
                <div class="bg-blue-grey-8 text-white q-px-md q-py-xs flex items-center q-gutter-x-sm">
                  <q-icon name="icon-mat-tune" size="18px" />
                  <span class="text-subtitle2 text-weight-bold">1. Kategori & Informasi Dokter</span>
                </div>
                <q-card-section class="q-pa-md column q-gutter-y-md">
                  <!-- Baris 1: Kategori & Tanggal Jam -->
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col-12 col-md-6">
                      <div class="text-subtitle2 text-weight-bold q-mb-xs">Jenis Form Indikasi {{ subTab }}:</div>
                      <div class="row q-gutter-x-md">
                        <q-radio v-model="form.kategori" val="masuk" :label="'Indikasi MASUK ' + subTab" color="teal" class="text-weight-bold" />
                        <q-radio v-model="form.kategori" val="keluar" :label="'Indikasi KELUAR ' + subTab" color="orange-9" class="text-weight-bold" />
                      </div>
                    </div>

                    <div class="col-12 col-md-3">
                      <app-input-date
                        :model="form.tgl_penilaian"
                        label="Tanggal Penilaian"
                        icon="icon-mat-event"
                        outlined
                        dense
                        @set-model="val => form.tgl_penilaian = val"
                      />
                    </div>
                    <div class="col-12 col-md-3">
                      <q-input
                        v-model="form.jam_penilaian"
                        label="Jam Penilaian"
                        outlined
                        dense
                        color="primary"
                        mask="##:##"
                        placeholder="hh:mm"
                        class="bg-grey-1"
                      >
                        <template #append>
                          <q-icon name="icon-mat-access_time" class="cursor-pointer" />
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <q-separator />

                  <!-- Baris 2: Pilihan Dokter Penanggung Jawab ICCU -->
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col-12">
                      <q-select
                        v-model="form.dokter_pj"
                        :label="'Pilih Dokter Penanggung Jawab ' + subTab"
                        outlined
                        dense
                        use-input
                        fill-input
                        hide-selected
                        input-debounce="0"
                        :options="optionsDoktersPj"
                        option-label="nama"
                        option-value="nama"
                        emit-value
                        map-options
                        color="primary"
                        class="bg-grey-1"
                        :loading="loadingDokters"
                        @filter="filterDoktersPj"
                        @update:model-value="(val) => onSelectPj(val)"
                      >
                        <template #no-option>
                          <q-item><q-item-section class="text-grey">Dokter tidak ditemukan</q-item-section></q-item>
                        </template>
                      </q-select>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Kriteria Checklist Indikasi MASUK / KELUAR Dinamis -->
              <q-card flat class="rounded-borders shadow-1 bg-white overflow-hidden">
                <div :class="form.kategori === 'masuk' ? 'bg-teal text-white' : 'bg-orange-9 text-white'" class="q-px-md q-py-xs flex items-center justify-between">
                  <div class="flex items-center q-gutter-x-sm">
                    <q-icon :name="form.kategori === 'masuk' ? 'icon-mat-login' : 'icon-mat-logout'" size="18px" />
                    <span class="text-subtitle2 text-weight-bold">2. Checklist Kriteria INDIKASI PASIEN {{ form.kategori === 'masuk' ? 'MASUK' : 'KELUAR' }} RUANG {{ form.jenis_ruangan || subTab }}</span>
                  </div>
                </div>

                <q-card-section class="q-pa-md">
                  <!-- Jika List Terbagi Subkategori (Grouping) Khusus ICU & Grouped: Dibuat Grid 2 Kolom, Compact & Rapat -->
                  <div v-if="isGroupedList(activeKriteriaList)" class="row q-col-gutter-xs">
                    <div v-for="(grp, gIdx) in activeKriteriaList" :key="gIdx" class="col-12 col-md-6">
                      <div class="bg-grey-1 q-pa-xs rounded-borders border-subtle full-height column justify-start">
                        <div class="text-caption text-weight-bolder text-primary q-px-xs q-py-3xs bg-blue-grey-1 rounded-borders flex items-center q-gutter-x-3xs">
                          <q-icon name="icon-mat-label_important" size="14px" color="primary" />
                          <span class="ellipsis leading-tight">{{ grp.groupTitle }}</span>
                        </div>
                        <div class="column q-mt-3xs">
                          <div v-for="(item, idx) in grp.items" :key="idx" class="q-px-xs q-py-none hover-bg rounded-borders dense-item">
                            <q-checkbox v-model="form.pilihan_indikasi" :val="item.label || item" :color="form.kategori === 'masuk' ? 'teal' : 'orange-9'" dense size="xs">
                              <template #default>
                                <span class="text-caption-compact text-grey-10 q-ml-xs leading-tight">{{ item.label || item }}</span>
                              </template>
                            </q-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Jika List Single (Flat) -->
                  <div v-else class="column q-gutter-y-sm">
                    <div v-for="(item, idx) in activeKriteriaList" :key="idx" class="q-pa-xs hover-bg rounded-borders">
                      <q-checkbox v-model="form.pilihan_indikasi" :val="item.label || item" :color="form.kategori === 'masuk' ? 'teal' : 'orange-9'">
                        <template #default>
                          <span class="text-weight-bold text-grey-9 q-ml-xs">{{ item.label || item }}</span>
                        </template>
                      </q-checkbox>
                      <div v-if="item.sub" class="q-ml-lg text-caption text-grey-7">
                        <div v-for="(subItem, subIdx) in item.sub" :key="subIdx">• {{ subItem }}</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Catatan Tambahan -->
              <q-card flat class="rounded-borders shadow-1 bg-white overflow-hidden">
                <div class="bg-grey-7 text-white q-px-md q-py-xs flex items-center q-gutter-x-sm">
                  <q-icon name="icon-mat-notes" size="18px" />
                  <span class="text-subtitle2 text-weight-bold">3. Catatan / Indikasi Tambahan</span>
                </div>
                <q-card-section class="q-pa-md">
                  <q-input v-model="form.indikasi_lain" type="textarea" rows="3" outlined color="grey-8" class="bg-grey-1" placeholder="Tuliskan keterangan indikasi tambahan jika ada..." />
                </q-card-section>
              </q-card>

              </q-form>
            </div>
          </div>
        </q-card-section>

        <!-- Footer Actions Bar -->
        <q-card-section class="bg-white col-auto q-py-sm q-px-lg shadow-2 border-top">
          <div class="max-width-container mx-auto flex items-center justify-between">
            <div class="text-caption text-grey-7 flex items-center q-gutter-x-xs">
              <q-icon name="icon-mat-info" color="primary" size="16px" />
              <span>Pastikan pilihan kriteria indikasi telah diperiksa sesuai foto formulir RS.</span>
            </div>
            <div class="row q-gutter-x-md">
              <q-btn label="Batal" flat color="grey-8" class="q-px-lg" v-close-popup />
              <q-btn :label="'Simpan Indikasi ' + subTab" icon="icon-mat-save" unelevated color="primary" class="q-px-xl text-weight-bold shadow-1" :loading="loadingSave" @click="onSubmit" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppAvatarPasien from 'src/components/~global/AppAvatarPasien.vue'
import { api } from 'src/boot/axios'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri'
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

const store = useAsesmenJatuhNyeriStore()
const appStore = useAplikasiStore()

const subTab = ref('ICCU')
const dialogOpen = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const loadingSave = ref(false)

const storeDokters = ref([])
const loadingDokters = ref(false)

const currentUserPegawai = computed(() => {
  return appStore.user?.pegawai?.kdpegsimrs || appStore.user?.kdpegsimrs || appStore.user?.username || ''
})

const items = computed(() => {
  return (store.itemsIndikasiIntensif || []).filter(x => x.jenis_ruangan === subTab.value)
})

// --- KRITERIA ICU (Sesuai Panduan Masuk & Keluar ICU) ---
const listIndikasiMasukIcu = [
  {
    groupTitle: 'A. Sistem Cardio Vasculair :',
    items: [
      '1) Gagal jantung akut dengan gagal nafas dan atau memerlukan bantuan haemodinamik',
      '2) Hipertensi krisis/Emergency',
      '3) Syock hipovolemia',
      '4) Syock septikemia',
      '5) Syock anafilaksis'
    ]
  },
  {
    groupTitle: 'B. Sistem Pulmonal :',
    items: [
      '1) Gagal nafas akut yang memerlukan ventilasi',
      '2) Emboli paru dengan kondisi hemodinamik yang tidak stabil',
      '3) Pasien dari unit intermediet yang menunjukkan gangguan respirasi',
      '4) Gagal nafas yang memerlukan intubasi segera',
      '5) Edema paru akut dengan distress nafas'
    ]
  },
  {
    groupTitle: 'C. Sistem Neurologi :',
    items: [
      '1) Stroke Akut yang disertai perubahan status mental',
      '2) Koma ; metabolik, toksik, anoksik',
      '3) Perdarahan Intra kranial yang potensial herniasi',
      '4) Meningitis dengan perubahan status mental atau gangguan pernafasan',
      '5) Gangguan sistem syaraf pusat/ neuromoskulair dengan fungsi pulmonal/ neurologi memburuk',
      '6) Status epileptikus',
      '7) Vasospasme',
      '8) Cidera kepala berat',
      '9) Cidera kepala sedang yang kemungkinan memburuk',
      '10) Multiple trauma/ injury'
    ]
  },
  {
    groupTitle: 'D. Overdosis Obat (Drug Ingestion and Drug Overdose) :',
    items: [
      '1) Overdosis disertai unstable haemodinamik',
      '2) Overdosis disertai penurunan kesadaran yang signifikan dan proteksi jalan nafas yang inadekuat',
      '3) Overdosis dengan kejang yang tidak teratasi'
    ]
  },
  {
    groupTitle: 'E. Sistem Gastero Intestinal :',
    items: [
      '1) Perdarahan gastrointestinal yang mengancam jiwa disertai hipotensi, angina, perdarahan, atau komorbid lain',
      '2) Pancreatitis berat'
    ]
  },
  {
    groupTitle: 'F. Sistem Endokrinologi :',
    items: [
      '1) Ketoasidosis diabetik disertai unstable haemodinamik, penurunan kesadaran, insufisiensi pernafasan atau acidosis berat',
      '2) Krisis tiroid atau koma miksedema dengan unstable haemodinamik',
      '3) Status hiperosmolar dengan koma atau unstable haemodinamik',
      '4) Krisis adrenalin yang disertai unstable haemodinamik'
    ]
  },
  {
    groupTitle: 'G. Pembedahan :',
    items: [
      '1) Pasien post operatif yang memerlukan pemantauann hamodinamik/ bantuan ventilasi/ memerlukan perawatan intensif/ analgetik continue/ komorbid multiple',
      '2) Post operatif pembedahan mayor'
    ]
  },
  {
    groupTitle: 'H. Pediatrik :',
    items: [
      '1) Dengoe syock syndroma dengan syock berulang',
      '2) Meningoencepalitis dengan unstable haemodinamik',
      '3) Status convulsi dengan unstable haemodinamik',
      '4) Cyanotic Congenital Hearth Deaseas',
      '5) Infeksi saluran pernafasan dengan pernafasan tidak adequat'
    ]
  },
  {
    groupTitle: 'I. Maternitas :',
    items: [
      '1) Pre/ Pasca melahirkan dengan distress nafas dan gangguan haemodinamik',
      '2) Pre/ Pasca melahirkan dengan perdarahan masif dan Unstable haemodinamik',
      '3) Pre Ekalmsia/ Eklamsia dengan HELLP Syndroma'
    ]
  },
  {
    groupTitle: 'J. Gangguan lain :',
    items: [
      '1) Syock septik disertai unstable haemodinamik',
      '2) Pemantauan haemodinamik',
      '3) Trauma lingkungan (listrik/ tenggelam/ hipotermia/ hipertermia/ chemis)'
    ]
  }
]

const listIndikasiKeluarIcu = [
  {
    groupTitle: 'Prioritas I :',
    items: [
      'Haemodinamik dan vital sign pasien stabil baik > 48 jam.',
      'Kegawatan dan resiko kegawatan acut telah terastasi.',
      'Tingkat kesadaran stabil ≥10 selama ≥72 jam dan tidak tampak tanda-tanda peningkatan tekanan Intra Cranial.',
      'Ditemukan penyakit Primer atau komorbid dengan penularan melalui airbone/ drop plet transmition.'
    ]
  },
  {
    groupTitle: 'Prioritas II :',
    items: [
      'Tingkat kesadaran ≥ 10 tanpa perkembangan yang berarti setelah mendapatkan perawatan ≥ 7 x 24 jam.',
      'Dengan kegagalan multiorgan (multi organ failur) yang tidak responsive dengan therapi intensif.',
      'Kondisi haemo dinamik dan vital sign tidak stabil namun keluarga/ pasien menolak therapi intensif.',
      'Pasien stadium terminal dengan kegawatan akut yang telah teratasi.'
    ]
  }
]

// --- KRITERIA ICCU ---
const listIndikasiMasukIccu = [
  { label: 'Sindrom Koroner Akut (UAP, NSTEMI, STEMI)', sub: null },
  {
    label: 'Edema Paru Akut',
    sub: ['Dyspnoe', 'RR > 28 x/mnt', 'Ronkhi +', 'Akral dingin, basah']
  },
  { label: 'Gagal Jantung Akut', sub: null },
  { label: 'Aritmia maligna atau dengan gangguan hemodinamik', sub: null },
  { label: 'Syokcardiogenik : HR > 100 x/mnt, TDS < 100 mmHg', sub: null },
  { label: 'Pasca tindakan Invasive kardiologi, post pemasangan TPM/PPM', sub: null },
  { label: 'Miokarditis', sub: null },
  { label: 'Penyakit lain yang memerlukan pemantauan hemodinamik', sub: null }
]

const listIndikasiKeluarIccu = [
  'Keadaan penderita sudah tidak memerlukan perawatan intensif dan bisa dirawat di ruangan',
  'Kegawatan penderita bukan disebabkan oleh penyakit jantung dan dipindahkan ke unit lain perawatan intensif',
  'Penderita yang meninggal dan dikeluarkan dari ICCU',
  'Penderita yang ingin dirawat di rumah sakit lain atas permintaan sendiri/keluarga',
  'Penderita yang pulang paksa setelah menandatangani pernyataan tidak ingin dirawat di RSUD Dr. Moh. Saleh Kota Probolinggo',
  'Pasien dirujuk dengan indikasi medis atas advis dokter',
  'Pasien/keluarga pindah ruangan atas permintaan sendiri setelah menandatangani pernyataan penolakan dirawat di ICCU'
]

// --- KRITERIA NICU (SS Masuk & Keluar NICU) ---
const listIndikasiMasukNicu = [
  {
    groupTitle: 'Pasien yang membutuhkan perawatan NICU adalah semua bayi yang memerlukan monitor/observasi ketat :',
    items: [
      'Memerlukan O2 > 60%',
      'Memerlukan CPAP/Ventilator',
      'NKB < 32mg, BBL < 1500gr',
      'Asfiksia berat, syok, sering apnoe/kejang, gangguan perdarahan',
      'Mengalami masalah metabolic',
      'Bayi dengan kelainan congenital berat'
    ]
  },
  {
    groupTitle: 'Kriteria pasien yang membutuhkan perawatan intermediate :',
    items: [
      'Bayi yang baru keluar dari NICU, masih perlu monitor dan observasi',
      'Bayi yang memerlukan O2 < 60%',
      'NKB 32-34mg, kondisi stabil, BBL > 1500gr',
      'NKB 34-36mg, kondisi stabil, reflek hisap lemah',
      'Bayi yang dipuasakan / EKN',
      'Bayi yang memerlukan tranfusi tukar',
      'Bayi yang sering muntah',
      'Bayi dengan kelainan kronik (CLD)',
      'Bayi yang memerlukan fototerapi dengan masalah lain : dehidrasi, minum personde',
      'Bayi dengan kelainan congenital ringan, missal celah bibir',
      'Bayi dengan ibu DM',
      'Bayi dengan asfiksia sedang, nilai APGAR pada 5 menit < 7'
    ]
  }
]

const listIndikasiKeluarNicu = [
  {
    groupTitle: 'KRITERIA KELUAR DARI NICU :',
    items: [
      '1. Kondisi bayi mulai stabil, tidak mengalami syock, apnu, kejang atau gangguan pendarahan',
      '2. Tidak memerlukan O2>60%, Ventilator, CPAP',
      '3. Tidak mengalami masalah metabolik',
      '4. Pasien pulang paksa',
      '5. Pasien dirujuk/alih rawat di rumah sakit lain',
      '6. Pasien meninggal'
    ]
  },
  {
    groupTitle: 'KRITERIA KELUAR DARI INTERMEDIATE :',
    items: [
      '1. Kondisi bayi stabil baik (TTV normal, tidak cyanosis, tidak ikterus, tidak anemis, tidak muntah)',
      '2. Tidak memerlukan O2',
      '3. Reflek hisap baik',
      '4. Program terapi sudah selesai',
      '5. Untuk BBLR, BB minimal 1800 gram, sudah tidak memerlukan penghangat',
      '6. Pasien pulang paksa',
      '7. Pasien dirujuk / alih rawat di rumah sakit lain'
    ]
  },
  {
    groupTitle: 'KRITERIA KELUAR DARI TRANSISI :',
    items: [
      '1. Kondisi bayi tetap stabil baik (TTV normal, tidak cyanosis, tidak ikterus, tidak anemis, tidak muntah)',
      '2. Reflek hisap baik',
      '3. Program terapi sudah selesai',
      '4. Untuk BBLR, BB minimal 1800 gram, sudah tidak memerlukan penghangat'
    ]
  }
]

// --- KRITERIA INTERMEDIATE ---
const listIndikasiMasukIntermediate = [
  'Bayi yang baru keluar dari NICU, masih perlu monitor dan observasi',
  'Bayi yang memerlukan O2 < 60%',
  'NKB 32-34mg, kondisi stabil, BBL > 1500gr',
  'NKB 34-36mg, kondisi stabil, reflek hisap lemah',
  'Bayi yang dipuasakan / EKN',
  'Bayi yang memerlukan tranfusi tukar',
  'Bayi yang sering muntah',
  'Bayi dengan kelainan kronik (CLD)',
  'Bayi yang memerlukan fototerapi dengan masalah lain : dehidrasi, minum personde',
  'Bayi dengan kelainan congenital ringan, missal celah bibir',
  'Bayi dengan ibu DM',
  'Bayi dengan asfiksia sedang, nilai APGAR pada 5 menit < 7'
]

const listIndikasiKeluarIntermediate = [
  '1. Kondisi bayi stabil baik (TTV normal, tidak cyanosis, tidak ikterus, tidak anemis, tidak muntah)',
  '2. Tidak memerlukan O2',
  '3. Reflek hisap baik',
  '4. Program terapi sudah selesai',
  '5. Untuk BBLR, BB minimal 1800 gram, sudah tidak memerlukan penghangat',
  '6. Pasien pulang paksa',
  '7. Pasien dirujuk / alih rawat di rumah sakit lain'
]

function isGroupedList(list) {
  return Array.isArray(list) && list.length > 0 && typeof list[0] === 'object' && 'groupTitle' in list[0]
}

const activeKriteriaList = computed(() => {
  const ruang = form.jenis_ruangan || subTab.value
  const kat = form.kategori
  if (ruang === 'ICU') {
    return kat === 'masuk' ? listIndikasiMasukIcu : listIndikasiKeluarIcu
  } else if (ruang === 'NICU') {
    return kat === 'masuk' ? listIndikasiMasukNicu : listIndikasiKeluarNicu
  } else if (ruang === 'INTERMEDIATE') {
    return kat === 'masuk' ? listIndikasiMasukIntermediate : listIndikasiKeluarIntermediate
  }
  // Default ICCU
  return kat === 'masuk' ? listIndikasiMasukIccu : listIndikasiKeluarIccu
})

const defaultForm = () => ({
  jenis_ruangan: subTab.value,
  kategori: 'masuk',
  tgl_penilaian: new Date().toISOString().split("T")[0],
  jam_penilaian: new Date().toTimeString().slice(0,5),
  tanggal: null,
  dx_medis: props.pasien?.memodiagnosa || props.pasien?.memodiagnosaigd || '',
  pilihan_indikasi: [],
  indikasi_lain: '',
  kddokter_dpjp: props.pasien?.kodedokterdpjp || props.pasien?.kddokter || '',
  dokter_dpjp: props.pasien?.dokterdpjp || props.pasien?.dokter || '',
  kddokter_pj: '',
  dokter_pj: ''
})

const form = reactive(defaultForm())

onMounted(() => {
  if (props.pasien) {
    store.getData(props.pasien)
  }
  fetchDokters()
})

const optionsDoktersDpjp = ref([])
const optionsDoktersPj = ref([])

function filterDoktersDpjp(val, update) {
  if (val === '') {
    update(() => {
      optionsDoktersDpjp.value = storeDokters.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    optionsDoktersDpjp.value = storeDokters.value.filter(v => v.nama && v.nama.toLowerCase().indexOf(needle) > -1)
  })
}

function filterDoktersPj(val, update) {
  if (val === '') {
    update(() => {
      optionsDoktersPj.value = storeDokters.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    optionsDoktersPj.value = storeDokters.value.filter(v => v.nama && v.nama.toLowerCase().indexOf(needle) > -1)
  })
}

function onSelectDpjp(val) {
  const found = storeDokters.value.find(d => d.nama === val)
  if (found) {
    form.dokter_dpjp = found.nama
    form.kddokter_dpjp = found.kdpegsimrs
  }
}

function onSelectPj(val) {
  const found = storeDokters.value.find(d => d.nama === val)
  if (found) {
    form.dokter_pj = found.nama
    form.kddokter_pj = found.kdpegsimrs
  }
}

async function fetchDokters() {
  loadingDokters.value = true
  try {
    const resp = await api.get('v1/simrs/master/pegawai/listdokters')
    if (resp.status === 200) {
      storeDokters.value = resp.data || []
    }
  } catch (err) {
    console.log(err)
  } finally {
    loadingDokters.value = false
  }
}

function resetForm() {
  Object.assign(form, defaultForm())
  isEdit.value = false
  editId.value = null
  
  // Set default DPJP jika ada di data pasien
  if (props.pasien?.dokterdpjp) {
    form.dokter_dpjp = props.pasien.dokterdpjp
    form.kddokter_dpjp = props.pasien.kodedokterdpjp || props.pasien.kddokter
  }
}

function bukaForm() {
  resetForm()
  form.jenis_ruangan = subTab.value
  dialogOpen.value = true
}

function bukaEdit(item) {
  resetForm()
  isEdit.value = true
  editId.value = item.id
  
  const itemTgl = item.tanggal ? item.tanggal.split(' ')[0] : new Date().toISOString().split('T')[0]
  const itemJam = item.tanggal && item.tanggal.includes(' ') ? item.tanggal.split(' ')[1].slice(0, 5) : new Date().toTimeString().slice(0, 5)

  Object.assign(form, {
    jenis_ruangan: item.jenis_ruangan || 'ICCU',
    kategori: item.kategori || 'masuk',
    tgl_penilaian: itemTgl,
    jam_penilaian: itemJam,
    tanggal: item.tanggal,
    dx_medis: item.dx_medis || props.pasien?.memodiagnosa || props.pasien?.memodiagnosaigd || '',
    pilihan_indikasi: Array.isArray(item.pilihan_indikasi) ? item.pilihan_indikasi : [],
    indikasi_lain: item.indikasi_lain || '',
    kddokter_dpjp: item.kddokter_dpjp || '',
    dokter_dpjp: item.dokter_dpjp || '',
    kddokter_pj: item.kddokter_pj || '',
    dokter_pj: item.dokter_pj || ''
  })
  
  dialogOpen.value = true
}

async function onSubmit() {
  loadingSave.value = true
  const combinedTanggal = `${form.tgl_penilaian || new Date().toISOString().split('T')[0]} ${form.jam_penilaian || '00:00'}:00`
  const payload = {
    ...form,
    tanggal: combinedTanggal,
    dx_medis: props.pasien?.memodiagnosa || props.pasien?.memodiagnosaigd || form.dx_medis || '',
    dokter_dpjp: form.dokter_dpjp || props.pasien?.dokterdpjp || props.pasien?.dokter || '',
    kddokter_dpjp: form.kddokter_dpjp || props.pasien?.kodedokterdpjp || props.pasien?.kddokter || '',
    id: editId.value,
    noreg: props.pasien?.noreg,
    norm: props.pasien?.norm,
    kdruangan: props.pasien?.kdruangan || props.pasien?.kodepoli || props.pasien?.kdruang || props.pasien?.koderuangan || props.pasien?.kdruangansim || props.pasien?.kdpoli || '',
    sumber: 'ranap',
    kdpegsimrs: currentUserPegawai.value,
    petugas: appStore.user?.pegawai?.nama || appStore.user?.nama || ''
  }

  const success = await store.simpanIndikasiIntensif(props.pasien, payload)
  loadingSave.value = false
  if (success) {
    dialogOpen.value = false
  }
}

async function hapusItem(item) {
  if (confirm(`Apakah Anda yakin ingin menghapus data indikasi ${item.kategori} ${item.jenis_ruangan} ini?`)) {
    await store.hapusIndikasiIntensif(props.pasien, item.id)
  }
}
</script>

<style lang="scss" scoped>
.max-width-container {
  max-width: 1000px;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
.border-amber {
  border: 1px solid #ffe082;
}
.hover-bg {
  transition: background-color 0.2s;
  &:hover {
    background-color: #f5f5f5;
  }
}
.font-medium {
  font-weight: 500;
}
.text-caption-compact {
  font-size: 11px;
  line-height: 1.25;
}
.dense-item {
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  min-height: 24px;
}
.q-py-3xs {
  padding-top: 2px;
  padding-bottom: 2px;
}
.q-gutter-x-3xs {
  gap: 2px;
}

.text-micro {
  font-size: 10px;
  letter-spacing: 0.5px;
}
.bg-gradient-dark {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}
.bg-gradient-profile {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
.border-slate {
  border: 1px solid #cbd5e1;
}
.border-bottom-teal {
  border-bottom: 2px solid #0d9488;
}
.border-avatar {
  border: 2px solid #0284c7;
  border-radius: 8px;
  overflow: hidden;
}
.border-subtle {
  border: 1px solid #e2e8f0;
}
.border-teal-light {
  border: 1px solid #ccfbf1;
}
.border-indigo-light {
  border: 1px solid #e0e7ff;
}
.border-amber-light {
  border: 1px solid #fef3c7;
}
.q-mt-3xs {
  margin-top: 2px;
}
</style>