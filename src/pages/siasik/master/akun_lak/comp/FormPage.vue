<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <app-autocomplete label="Jenis" v-model="store.form.jenis" autocomplete="nama" option-value="value"
      option-label="nama" outlined :disable="store.disabled" :source="store.jenis" @update:model-value="(val) => {
        console.log('valdada', val)
        const jenis = store.jenis?.length ? store.jenis.find(x => x.value === val) : null
        store.form.jenis = jenis?.nama
        store.form.kodejenis = jenis?.value
      }" />
    <!-- <q-input v-model="store.form.kode" dense outlined standout="bg-yellow-3" label="Kode" disable /> -->
    <q-input v-model="store.form.uraian" dense outlined standout="bg-yellow-3" label="Uraian"
      :rules="[val => !!val || 'Harap diisi']" />


    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" :loading="store.loadingSave" />
    </div>
  </q-form>
</template>
<script setup>

import { api } from 'src/boot/axios';
import { useMasterAkunLakStore } from 'src/stores/siasik/master/akun_lak/akunlak';
import { onMounted, ref } from 'vue';

const store = useMasterAkunLakStore()
const formRef = ref(null)

const options = ref([])

function simpan() {
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}

onMounted(() => {
})

</script>
