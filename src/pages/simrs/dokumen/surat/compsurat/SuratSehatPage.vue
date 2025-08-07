<template>
  <div class="q-pa-md row">
    <div class="col-6">
      <q-form ref="refForm" @submit="onSubmit" class="q-gutter-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.nomorSurat" label="Nomor Surat" outlined dense disable />
          </div>
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.pekerjaan" label="Pekerjaan" outlined dense />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.keperluan" label="Untuk Keperluan" outlined dense />
          </div>
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.golDar" label="Golongan Darah" outlined dense />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.penglihatankiri" label="Penglihatan Kiri" outlined dense />
          </div>
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.penglihatankanan" label="Penglihatan Kanan" outlined
              dense />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.pendengarankiri" label="Pendengaran Kiri" outlined dense />
          </div>
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.pendengarankanan" label="Pendengaran Kanan" outlined
              dense />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.warna" label="Perbedaan warna" outlined dense />
          </div>
          <div class="col-6">
            <q-option-group v-if="store.form" v-model="store.form.doc" :options="documents" inline
              :rules="[val => !!val || 'Harap pilih salah satu']" />
          </div>
          <!-- <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.tinggi" label="Tinggi Badan" outlined dense />
          </div> -->
        </div>
        <div class="row q-col-gutter-sm q-mb-sm">
          <!-- <div class="col-6">
            <app-input v-if="store.form" v-model="store.form.berat" label="Berat Badan" outlined dense />
          </div> -->


        </div>
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12">
            <q-btn color="primary" icon-right="icon-mat-save" label="Simpan" type="submit" unelevated
              :loading="store.loading" class="full-width">
              <q-tooltip class="primary" :offset="[10, 10]">
                Simpan
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-form>
    </div>
    <q-separator vertical class="q-mx-sm" />
    <div class="col-5">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <ListSuratPage :kdsurat="suhats" :pasien="props.pasien" @delete="deleteData" @print="cetakData" />
        </div>
      </div>
    </div>
  </div>
  <SuratSehatDokumenPage :pasien="props.pasien" :data="store.cetakdata" />
</template>
<script setup>
import { ref } from 'vue';
import { useDokumenSuratSehatStore } from '../../../../../stores/simrs/dokumen/erm/suratsehat';
import ListSuratPage from './ListSuratPage.vue'
import SuratSehatDokumenPage from './SuratSehatDokumenPage.vue';

const store = useDokumenSuratSehatStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const suhats = ref('SRT01')

const documents = ref([
  {
    label: 'BAIK',
    value: 'BAIK'
  },
  {
    label: 'TIDAK BAIK',
    value: 'TIDAK BAIK'
  }
])
function onSubmit() {
  // Handle form submission logic here
  store.form.noreg = props.pasien?.noreg
  store.form.norm = props.pasien?.norm
  store.form.dokter = props.pasien?.kodedokter
  store.form.kdsurat = suhats.value
  store.form.kdpoli = props.pasien?.kodepoli
  store.form.sistembayar = props.pasien?.sistembayar
  store.form.kddpjp = props.pasien?.kodedokter
  store.simpan(props.pasien)
}

function deleteData(item) {
  // console.log('delete item', item)
  store.batalsurat(props.pasien, item)
  // store.deleteSurat(props.pasien, item)
}

function cetakData(val) {
  store.cekpembayaran(props.pasien, val)
  // store.cetakdata = val
  // store.dialog = true
}


</script>
