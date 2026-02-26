<template>
  <q-card class="fit ">
    <q-form class="fit column" @submit="onSubmit" @reset="onReset">
      <q-card-section class="col-auto">
        <div class="column">
          <div class="text-bold"> {{ isDokter ? 'Form Asessment Dokter' : 'Form Asessment Fisioterapis' }}</div>
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
        <q-separator class="q-my-sm"></q-separator>
        <div class="row">
          <div class="col-2">
            <div class="text-weight-bold">Objective</div>
          </div>
          <div class="col-10">
            <q-input v-model="form.objective" outlined autogrow stack-label standout="bg-yellow-3" label="Objective"
              hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-sm"></q-separator>
        <div class="row">
          <div class="col-2">
            <div class="text-weight-bold">Assesment</div>
          </div>
          <div class="col-10">
            <q-input v-model="form.assessment" outlined autogrow stack-label standout="bg-yellow-3" label="Assesment"
              hide-bottom-space />
          </div>
        </div>
        <q-separator class="q-my-sm"></q-separator>
        <div v-if="isDokter">
          <div class="row">
            <div class="text-weight-bold">Planning</div>
          </div>
          <q-separator class="q-my-xs"></q-separator>
          <div class="row">
            <div class="col-3">
              <div class="q-pl-sm">a. Goal Of Threatment</div>
            </div>
            <div class="col-9">
              <q-input v-model="form.goal" outlined autogrow stack-label standout="bg-yellow-3"
                label="Goal Of Threatment" hide-bottom-space />
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
              <!-- <q-input v-model="form.frekuensi" outlined autogrow stack-label standout="bg-yellow-3" label="Frekuensi"
              hide-bottom-space /> -->
              <div>
                <q-select v-model="form.frekuensi" :options="store.frekuensis" dense map-options emit-value
                  option-label="nama" option-value="nama" outlined standout="bg-yellow-3" label="Frekuensi"
                  hide-bottom-space />
              </div>
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
        </div>
        <div v-else>
          <div class="row">
            <div class="col-2">
              <div class="text-weight-bold">Procedure</div>
            </div>
            <div class="col-10">
              <q-input v-model="form.procedure" outlined autogrow stack-label standout="bg-yellow-3" label="Procedure"
                hide-bottom-space />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="col-auto">
        <div class="row justify-between">
          <q-btn unelevated color="dark" label="Reset / Cancel" type="reset"> </q-btn>
          <q-btn unelevated :loading="loading" :disabled="loading" color="primary" label="Simpan Asessment"
            type="submit"> </q-btn>
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { api } from 'src/boot/axios'
import { notifSuccessVue } from 'src/modules/utils'
import { useRehabmedikSoapStore } from 'src/stores/simrs/pelayanan/rehabmedik/soap'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    default: null
  },
  storeKunjungan: {
    type: Object,
    default: null
  },
  isDokter: {
    type: Boolean,
    default: false
  }
})

const store = useRehabmedikSoapStore()

const form = ref({
  subjective: null,
  objective: null,
  assessment: null,
  goal: null,
  tindakan: null,
  edukasi: null,
  frekuensi: null,
  rencana: null,
  procedure: null
})

const loading = ref(false)

onMounted(() => {
  initReset(),
    Promise.all([
      store.getMasterFrekuensis(),
    ])
})


const onSubmit = async () => {
  loading.value = true

  form.value.noreg = props.pasien.noreg
  form.value.norm = props.pasien.norm

  try {
    const resp = await api.post('v1/simrs/rehabmedik/soap/store', form.value)
    // console.log('resp simpan', resp);

    if (resp.status === 200) {
      const data = resp?.data
      props.storeKunjungan?.injectDataPasien(props.pasien?.noreg, data, 'soap')
      initReset()
      notifSuccessVue('SOAP berhasil disimpan')
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const initReset = () => {
  store.setItem(null)
  form.value = {
    subjective: null,
    objective: null,
    assessment: null,
    goal: null,
    tindakan: null,
    edukasi: null,
    frekuensi: null,
    rencana: null,
  }
}

const onReset = () => {
  initReset()
}

watch(() => store.item, (obj) => {
  console.log('obj watch store item', obj);

  if (obj) {
    form.value = {
      ...obj
    }
  }
}, { deep: true })
</script>