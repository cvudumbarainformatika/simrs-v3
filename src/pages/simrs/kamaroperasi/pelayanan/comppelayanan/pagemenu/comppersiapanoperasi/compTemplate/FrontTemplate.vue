<template>
  <div class="bg-white full-height column">
    <div class="col-auto bg-yellow text-red f-14 q-mb-md">
      <div class="q-pa-sm">
        Template Obat Operasi
      </div>
    </div>
    <div class="col full-height relative-position">
      <!-- Nama header template -->
      <div class="row items-center ">
        <div class="col-6">
          <q-input v-model="store.form.nama" label="Nama Template" dense :rules="[val => !!val || 'tidak boleh kosong']"
            lazy-rules no-error-icon hide-bottom-space standout="bg-yellow-3" outlined />
        </div>
        <div class="col-6">
          <app-autocomplete v-model="store.form.user" label="Jenis" autocomplete="nama" option-label="nama" outlined
            option-value="value" :source="store.typeOptions" @update:model-value="logging" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useTemplatePersiapanOperasiStore } from 'src/stores/simrs/farmasi/kamaroperasi/template'

const store = useTemplatePersiapanOperasiStore()

function logging (val) {
  console.log(val)
}
</script>
