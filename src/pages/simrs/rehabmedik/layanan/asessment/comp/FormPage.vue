<template>
  <q-card class="fit ">
    <q-form class="fit column" @submit="onSubmit" @reset="onReset">
      <q-card-section class="col-auto">
        <div class="column">
          <div class="text-bold">Form Asessment Dokter</div>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="col full-height scroll-y">
        <div class="row">
          <div class="col-2">
            <div class="text-weight-bold">Subjective</div>
          </div>
          <div class="col-10">
            <q-input v-model="form.subjective" outlined autogrow stack-label standout="bg-yellow-3" label="Subjective"
              :lazy-rules="true" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="col-2">
            <div class="text-weight-bold">Objective</div>
          </div>
          <div class="col-10">
            <q-input v-model="form.objective" outlined autogrow stack-label standout="bg-yellow-3" label="Objective"
              hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="col-2">
            <div class="text-weight-bold">Assesment</div>
          </div>
          <div class="col-10">
            <q-input v-model="form.assessment" outlined autogrow stack-label standout="bg-yellow-3" label="Assesment"
              hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="text-weight-bold">Planning</div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="col-3">
            <div class="q-pl-sm">a. Goal Of Threatment</div>
          </div>
          <div class="col-9">
            <q-input v-model="form.goal" outlined autogrow stack-label standout="bg-yellow-3" label="Goal Of Threatment"
              hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="col-3">
            <div class="q-pl-sm">b. Tindakan Program Rehabmedik</div>
          </div>
          <div class="col-9">
            <q-input v-model="form.tindakan" outlined autogrow stack-label standout="bg-yellow-3"
              label="Tindakan Program Rehabmedik" hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="col-3">
            <div class="q-pl-sm">c. Edukasi</div>
          </div>
          <div class="col-9">
            <q-input v-model="form.edukasi" outlined autogrow stack-label standout="bg-yellow-3" label="Edukasi"
              hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="col-3">
            <div class="q-pl-sm">d. Frekuensi Kunjungan</div>
          </div>
          <div class="col-9">
            <q-input v-model="form.edukasi" outlined autogrow stack-label standout="bg-yellow-3" label="Edukasi"
              hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row">
          <div class="col-3">
            <div class="text-weight-bold">Rencana Tindak Lanjut</div>
          </div>
          <div class="col-9">
            <q-input v-model="form.rencana" outlined autogrow stack-label standout="bg-yellow-3"
              label="Rencana Tindak Lanjut" hide-bottom-space />
          </div>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="col-auto">
        <div class="row justify-between">
          <q-btn unelevated color="dark" label="Reset / Cancel" type="reset"> </q-btn>
          <q-btn unelevated color="primary" label="Simpan Asessment" type="submit"> </q-btn>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})


const form = ref({
  subjective: null,
  objective: null,
  assessment: null,
  goal: null,
  tindakan: null,
  edukasi: null,
  frekuensi: null,
  rencana: null
})


const onSubmit = () => {
  console.log('submit')
}
const onReset = () => {
  console.log('reset')
}
</script>