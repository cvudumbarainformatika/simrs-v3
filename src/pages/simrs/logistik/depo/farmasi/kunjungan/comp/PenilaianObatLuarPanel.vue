<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import CetakPenilaianObatLuarDialog from './CetakPenilaianObatLuarDialog.vue'

const props = defineProps({
  pasien: { type: Object, default: null },
  apotekers: { type: Array, default: () => [] }
})

const $q = useQuasar()
const isOpenCetak = ref(false)

// Form State
const form = reactive({
  tanggal: new Date().toISOString().substring(0, 10),
  lembar_resep: '',
  detail: {
    evaluasi_obat: [],
    check_1: '',
    double_check_2: ''
  }
})

// Add new drug evaluation row
const tambahObat = () => {
  form.detail.evaluasi_obat.push({
    nama_obat: '',
    sediaan: '',
    kondisi_fisik: 'Layak',
    identifikasi: 'Ya',
    keaslian: 'Ya',
    mutu: 'Layak',
    keputusan: 'Layak'
  })
}

// Remove drug evaluation row
const hapusObat = (index) => {
  form.detail.evaluasi_obat.splice(index, 1)
}

// Handle prescription image upload (convert to base64)
const uploadResep = (file) => {
  if (!file) {
    form.lembar_resep = ''
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.lembar_resep = e.target.result
  }
  reader.readAsDataURL(file)
}

// Load data from backend
const loadData = async () => {
  if (!props.pasien) return
  $q.loading.show({ message: 'Memuat data penilaian...' })
  try {
    const resp = await api.get('v1/simrs/farmasinew/kunjungan/get-penilaian-obat-luar', {
      params: { norm: props.pasien.norm, noreg: props.pasien.noreg }
    })
    if (resp.data) {
      form.tanggal = resp.data.tanggal ? resp.data.tanggal.substring(0, 10) : new Date().toISOString().substring(0, 10)
      form.lembar_resep = resp.data.lembar_resep || ''
      if (resp.data.detail) {
        form.detail = typeof resp.data.detail === 'string' ? JSON.parse(resp.data.detail) : resp.data.detail
      } else {
        form.detail = { evaluasi_obat: [], check_1: '', double_check_2: '' }
      }
      // If empty evaluasi_obat, push one default row
      if (!form.detail.evaluasi_obat?.length) {
        tambahObat()
      }
    } else {
      resetForm()
    }
  } catch (err) {
    console.error('Gagal memuat data penilaian obat luar', err)
    resetForm()
  } finally {
    $q.loading.hide()
  }
}

// Save data to backend
const simpanData = async () => {
  if (!props.pasien) return
  if (!form.detail.check_1) {
    $q.notify({ type: 'warning', message: 'Verifier Check 1 wajib dipilih!' })
    return
  }

  const payload = {
    norm: props.pasien.norm,
    noreg: props.pasien.noreg,
    tanggal: form.tanggal,
    lembar_resep: form.lembar_resep,
    detail: form.detail,
    check_1: form.detail.check_1,
    double_check_2: form.detail.double_check_2
  }

  $q.loading.show({ message: 'Menyimpan data penilaian...' })
  try {
    const resp = await api.post('v1/simrs/farmasinew/kunjungan/simpan-penilaian-obat-luar', payload)
    $q.notify({ type: 'positive', message: resp.data?.message || 'Penilaian obat luar berhasil disimpan!' })
  } catch (err) {
    console.error('Gagal menyimpan data', err)
    $q.notify({ type: 'negative', message: 'Gagal menyimpan data penilaian obat luar' })
  } finally {
    $q.loading.hide()
  }
}

const resetForm = () => {
  form.tanggal = new Date().toISOString().substring(0, 10)
  form.lembar_resep = ''
  form.detail = {
    evaluasi_obat: [],
    check_1: '',
    double_check_2: ''
  }
  tambahObat()
}

onMounted(() => {
  loadData()
})
</script>

<template>

  <div class="q-pa-md">
    <!-- Header panel -->
    <div class="row justify-between items-center q-mb-md print-hide">
      <div class="text-h6 text-teal text-weight-bold">Penilaian Obat Dari Luar Rumah Sakit</div>
      <div class="row q-gutter-sm">
        <q-btn color="dark" icon="print" label="Cetak Penilaian" no-caps @click="isOpenCetak = true" />
        <q-btn color="teal" icon="save" label="Simpan Penilaian" no-caps @click="simpanData()" />
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white q-pa-lg shadow-1 border-radius-4">
      <div class="row items-center q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-3 text-weight-bold">Tanggal Penilaian :</div>
        <div class="col-12 col-sm-4">
          <app-input-date :model="form.tanggal" outlined label="Tanggal Penilaian" @set-model="form.tanggal = $event" />
        </div>
      </div>

      <!-- Penilaian Obat Section -->
      <div class="text-subtitle1 text-weight-bold text-teal q-mb-md">Daftar Penilaian Obat</div>
      
      <div v-for="(row, index) in form.detail.evaluasi_obat" :key="index" class="q-mb-md q-pa-md drug-card relative-position">
        <!-- Card Header -->
        <div class="row justify-between items-center q-mb-md border-bottom-divider q-pb-sm">
          <div class="text-subtitle2 text-teal text-weight-bold row items-center q-gutter-xs">
            <q-icon name="medication" size="xs" />
            <span>Obat #{{ index + 1 }}</span>
          </div>
          <div>
            <q-btn flat round color="red" icon="delete" size="sm" @click="hapusObat(index)">
              <q-tooltip>Hapus Obat #{{ index + 1 }}</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Nama Obat & Sediaan Grid -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-8">
            <q-input v-model="row.nama_obat" label="Nama Obat" outlined dense placeholder="Nama obat luar..." />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="row.sediaan" label="Sediaan" outlined dense placeholder="Sediaan (Tab/Sirup/dll)..." />
          </div>
        </div>

        <!-- 5 Questions Responsive Grid -->
        <div class="row q-col-gutter-md">
          <!-- Kondisi Fisik -->
          <div class="col-12 col-sm-6 col-md">
            <div class="text-caption text-grey-8 text-weight-bold q-mb-xs">Kondisi Fisik</div>
            <div class="row q-gutter-sm items-center">
              <q-radio v-model="row.kondisi_fisik" val="Layak" label="Layak" color="teal" dense />
              <q-radio v-model="row.kondisi_fisik" val="Tidak" label="Tidak" color="red" dense />
            </div>
          </div>

          <!-- Identifikasi Jelas -->
          <div class="col-12 col-sm-6 col-md">
            <div class="text-caption text-grey-8 text-weight-bold q-mb-xs">Identifikasi Jelas</div>
            <div class="row q-gutter-sm items-center">
              <q-radio v-model="row.identifikasi" val="Ya" label="Ya" color="teal" dense />
              <q-radio v-model="row.identifikasi" val="Tidak" label="Tidak" color="red" dense />
            </div>
          </div>

          <!-- Keaslian Terverifikasi -->
          <div class="col-12 col-sm-6 col-md">
            <div class="text-caption text-grey-8 text-weight-bold q-mb-xs">Keaslian Terverifikasi</div>
            <div class="row q-gutter-sm items-center">
              <q-radio v-model="row.keaslian" val="Ya" label="Ya" color="teal" dense />
              <q-radio v-model="row.keaslian" val="Tidak" label="Tidak" color="red" dense />
            </div>
          </div>

          <!-- Mutu Obat -->
          <div class="col-12 col-sm-6 col-md">
            <div class="text-caption text-grey-8 text-weight-bold q-mb-xs">Mutu Obat</div>
            <div class="row q-gutter-sm items-center">
              <q-radio v-model="row.mutu" val="Layak" label="Layak" color="teal" dense />
              <q-radio v-model="row.mutu" val="Tidak" label="Tidak" color="red" dense />
            </div>
          </div>

          <!-- Keputusan -->
          <div class="col-12 col-sm-6 col-md">
            <div class="text-caption text-grey-8 text-weight-bold q-mb-xs">Keputusan</div>
            <div class="row q-gutter-sm items-center">
              <q-radio v-model="row.keputusan" val="Layak" label="Layak" color="teal" dense />
              <q-radio v-model="row.keputusan" val="Tidak" label="Tidak" color="red" dense />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button: Tambah Obat -->
      <div class="row q-mb-lg justify-start">
        <q-btn outline color="teal" icon="add" label="Tambah Obat" no-caps @click="tambahObat()" />
      </div>

      <!-- Lembar Resep & Double Check Section -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <div class="text-subtitle1 text-weight-bold text-teal q-mb-sm">Lembar Resep</div>
          <q-file outlined dense label="Unggah Gambar Lembar Resep (JPEG/PNG)" accept="image/*"
            @update:model-value="uploadResep" class="q-mb-md">
            <template v-slot:prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>

          <!-- Image preview block -->
          <div class="border rounded q-pa-sm flex flex-center bg-grey-1"
            style="min-height: 220px; border: 1px dashed #ccc;">
            <img v-if="form.lembar_resep" :src="form.lembar_resep"
              style="max-height: 200px; max-width: 100%; object-fit: contain;" />
            <div v-else class="text-grey-5 text-italic text-center">
              Belum ada unggahan gambar lembar resep<br>
              <span class="text-caption text-grey-4">(Pilih file gambar di atas untuk mengunggah)</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 flex column justify-between">
          <div>
            <div class="text-subtitle1 text-weight-bold text-teal q-mb-sm">Petugas Verifikasi (Double Check)</div>

            <div class="q-mb-md">
              <div class="text-weight-bold text-grey-7 q-mb-xs">Check 1 (Apoteker):</div>
              <app-autocomplete v-model="form.detail.check_1" label="Pilih Apoteker Verifikator 1" autocomplete="nama"
                option-label="nama" option-value="kdpegsimrs" outlined dense :source="apotekers" />
            </div>

            <div class="q-mb-md">
              <div class="text-weight-bold text-grey-7 q-mb-xs">Double Check 2 (Apoteker):</div>
              <app-autocomplete v-model="form.detail.double_check_2" label="Pilih Apoteker Verifikator 2"
                autocomplete="nama" option-label="nama" option-value="kdpegsimrs" outlined dense :source="apotekers" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Print dialog component -->
    <CetakPenilaianObatLuarDialog v-model="isOpenCetak" :pasien="pasien" :form="form" :apotekers="apotekers" />
  </div>
</template>

<style scoped>
.border-radius-4 {
  border-radius: 4px;
}
.drug-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}
.drug-card:hover {
  border-color: #009688;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.border-bottom-divider {
  border-bottom: 1px solid #e0e0e0;
}
</style>
