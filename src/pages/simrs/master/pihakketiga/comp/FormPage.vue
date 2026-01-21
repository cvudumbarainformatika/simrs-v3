<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pt-sm">
    <q-input v-model="store.form.nama" dense outlined standout="bg-yellow-3" label="Nama"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.alamat" dense outlined standout="bg-yellow-3" label="Alamat"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.telepon" dense outlined standout="bg-yellow-3" label="Telepon"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.npwp" dense outlined standout="bg-yellow-3" label="NPWP"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.bank" dense outlined standout="bg-yellow-3" label="Bank"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.norek" dense outlined standout="bg-yellow-3" label="No. Rekening"
      :rules="[val => !!val || 'Harap diisi']" />
    <q-input v-model="store.form.cp" dense outlined standout="bg-yellow-3" label="Contact Person"
      :rules="[val => !!val || 'Harap diisi']" />

    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" :loading="store.loadingSave" />
    </div>
  </q-form>
</template>
<script setup>

import { useMasterPihakketigaStore } from 'src/stores/simrs/master/pihakketiga/pihakketiga';
import { ref } from 'vue';

const store = useMasterPihakketigaStore()
const formRef = ref()

const options = ref([
  { label: 'BPJS', value: '1' },
  { label: 'UMUM', value: '2' },
  { label: 'TAGIHAN', value: '3' }
])

function simpan() {
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}
</script>
