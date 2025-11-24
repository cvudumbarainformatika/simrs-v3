<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <q-input v-model="store.form.kode" dense outlined standout="bg-yellow-3" label="Kode Klasifikasi"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.kelasifikasi" dense outlined standout="bg-yellow-3" label="Klasifikasi"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.retensi" dense outlined standout="bg-yellow-3" label="Retensi Aktif (Satuan Tahun)"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.retensiinaktif" dense outlined standout="bg-yellow-3"
      label="Retensi Inaktif (Satuan Tahun)" :rules="[val => !!val || 'Harap diisi']" />
    <q-select :options="optionspenyelesaian" v-model="store.form.penyelesaian" dense outlined standout="bg-yellow-3"
      label="Penyelesaian Akhir" :rules="[val => !!val || 'Harap diisi']" />
    <q-select :options="optionshakakses" v-model="store.form.hakakses" dense outlined standout="bg-yellow-3"
      label="Hak Akses" :rules="[val => !!val || 'Harap diisi']" />
    <q-select :options="optionkeamanan" v-model="store.form.keamanan" dense outlined standout="bg-yellow-3"
      label="Keamanan Informasi" :rules="[val => !!val || 'Harap diisi']" />

    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" />
    </div>
  </q-form>
</template>
<script setup>
import { useArsipMasterKelasifikasiStore } from 'src/stores/arsip/master/mkelasifikasi';
import { ref } from 'vue';

const store = useArsipMasterKelasifikasiStore()
const formRef = ref()

const optionspenyelesaian = ref(['MUSNAH', 'PERMANEN'])
const optionshakakses = ref(['EKSELON III/KEATAS', 'EKSESLON II'])
const optionkeamanan = ref(['TERBATAS', 'RAHASIA', 'BIASA'])

function simpan() {
  store.simpanMaster().then(() => {
    formRef.value.resetValidation()
  })
}
</script>
