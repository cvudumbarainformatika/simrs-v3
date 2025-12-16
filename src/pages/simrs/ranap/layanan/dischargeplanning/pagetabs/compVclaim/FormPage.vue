<template>
  <div class="surat-kontrol-form">
    <div class="col-auto q-pa-lg">
      <div class="f-14 text-bold">
        PEMBUATAN SURAT KONTROL VCLAIM
      </div>
      <div>dibuat ketika Pasien disarankan Kontrol oleh Dokter</div>
      <q-separator class="q-mt-md" />
    </div>
    <q-form @submit="submitForm" @reset="onReset" class="q-gutter-sm q-pa-lg">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-3">No.Surat Kontrol (OTOMATIS)</div>
        <div class="col-9">
          <app-input-simrs readonly v-model="formData.noSuratKontrol" label="No.Surat Kontrol (OTOMATIS)"
            style="width: 80%;" />
        </div>
      </div>

      <div class="row q-col-gutter-sm items-center">
        <div class="col-3">No.SEP (OTOMATIS)</div>
        <div class="col-9 flex q-gutter-sm items-center">
          <app-input-simrs :valid="{ required: false }" readonly v-model="formData.noSEP" label="No.SEP (OTOMATIS)"
            style="width: 60%;" />
          <!-- <div v-if="!formData.noSEP">
            <q-btn rounded size="sm" color="primary" label="Cari SEP Jika Kosong" @click="cariSEP" />
          </div> -->
        </div>
      </div>
      <div class="row q-col-gutter-sm items-center">
        <div class="col-3">Tgl Rencana Kontrol</div>
        <div class="col-9 flex q-gutter-sm items-center">
          <app-input-date :model="formData.tglRencanaKontrol" label="Tgl Rencana Kontrol" outlined valid
            @set-model="val => formData.tglRencanaKontrol = val" :rules="[val => !!val || 'Harap diisi']" />
        </div>
      </div>

      <div class="row q-col-gutter-sm items-center q-mt-xs">
        <div class="col-3">Poli</div>
        <div class="col-9 flex q-gutter-sm items-center">
          <q-select :disable="!formData.tglRencanaKontrol" v-model="formData.poliKontrol" dense
            standout="bg-yellow-3 text-black" outlined label="Poli" hide-dropdown-icon
            :rules="[val => !!val || 'Harap diisi']" :options="store?.polis" option-label="polirs" clearable
            option-value="kodemapingbpjs" emit-value map-options input-class="ellipsis" fill-input hide-bottom-space
            style="min-width: 200px;" @update:model-value="val => handleGetPoli(val, formData?.tglRencanaKontrol)" />

          <div v-if="store.loadingCariDokter"> <q-spinner /> Cari Jadwal Dokter ...</div>
        </div>
      </div>

      <div class="row q-col-gutter-sm items-center q-mt-xs">
        <div class="col-3">Dokter</div>
        <div class="col-9 flex q-gutter-sm items-center">
          <q-select :loading="store.loadingCariDokter" :disable="!formData.poliKontrol" v-model="formData.kodeDokter"
            dense standout="bg-yellow-3 text-black" outlined label="Dokter" hide-dropdown-icon
            :rules="[val => !!val || 'Harap diisi']" :options="store.dokters" option-label="namaDokter"
            option-value="kodeDokter" emit-value map-options input-class="ellipsis" fill-input hide-bottom-space
            style="min-width: 300px;" />
        </div>
      </div>

      <div class="col-auto">

        <q-separator class="q-my-md" />

        <div class="flex q-gutter-sm justify-between">
          <div class="flex q-gutter-sm">
            <q-btn color="primary" type="submit" :loading="store.loadingSave"
              :disabled="store.loadingSave">Simpan</q-btn>
            <q-btn color="dark" type="reset">Cancel</q-btn>
          </div>
          <!-- <q-btn color="negative" type="button" :loading="store.loadingHapus" :disabled="store.loadingHapus"
            @click="handleHapus">Hapus</q-btn> -->
        </div>
      </div>

    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// export default {
const props = defineProps({
  noSuratKontrol: {
    type: String,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  }
})

const formData = ref({
  noSuratKontrol: '',
  norm: '',
  noreg: '',
  noSEP: '',
  nama: '',
  alamat: '',
  tglRencanaKontrol: '',
  kodePoli: '',
  poliKontrol: '',
  kodeDokter: ''
})



onMounted(() => {
  console.log('pasien', props?.pasien);
  resetForm()
  formData.value.noSEP = props?.pasien?.sep
  formData.value.norm = props?.pasien?.norm
  formData.value.noreg = props?.pasien?.noreg
  formData.value.nama = props?.pasien?.nama_panggil
  formData.value.alamat = props?.pasien?.alamat
  // formData.value.tglRencanaKontrol = props?.noSuratKontrol
  props.store.initReset()
})


const handleGetPoli = (val, tgl) => {
  formData.value.kodePoli = props.store.polis.find(poli => poli.kodemapingbpjs === val)?.kodepoli
  props.store.getDokterByPoli(val, tgl)
    .then((dokters) => {
      console.log('dokters', dokters);
      if (dokters.length) {
        formData.value.kodeDokter = dokters[0].kodeDokter || null
      } else {
        formData.value.kodeDokter = null
      }
    })
}

function submitForm() {
  console.log('submit');
  props.store.simpan(formData.value)
    .then(() => {
      resetForm()
    })

}

function handleHapus() {
  console.log('handleHapus', formData.value.noSuratKontrol);
  props.store.hapus(formData.value.noSuratKontrol)
}

function onReset() {
  console.log('reset');
  resetForm()
}

function cariSEP() {
  console.log('cariSEP');
}

function resetForm() {
  // console.log('resetForm');
  formData.value.noSuratKontrol = '',
    formData.value.norm = props.pasien?.norm,
    formData.value.noreg = props.pasien?.noreg,
    formData.value.noSEP = props.pasien?.sep,
    formData.value.nama = props.pasien?.nama_panggil,
    formData.value.alamat = props.pasien?.alamat,
    formData.value.tglRencanaKontrol = '',
    formData.value.poliKontrol = '',
    formData.value.kodeDokter = ''
}
</script>
