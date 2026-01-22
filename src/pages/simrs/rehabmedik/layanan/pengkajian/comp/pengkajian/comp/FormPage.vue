<template>
  <q-card flat bordered square class="full-height" style="overflow: hidden;">
    <q-form ref="refForm" class="full-height" @submit="onSubmit" @reset="initReset">
      <q-card-section class="q-px-md q-py-xs bg-primary text-white">
        <div class="row items-center justify-between">
          <div class="f-12 text-weight-bold q-py-sm">
            PENGKAJIAN REHABILITASI MEDIK
          </div>
          <div>
            <!-- <q-btn flat dense size="md" icon="icon-mat-history" @click="historyOpen">
              <q-tooltip class="bg-dark text-white">
                {{ tooltip }}
              </q-tooltip>
            </q-btn> -->
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="full-height scroll">

        <div class="text-weight-bold">
          DATA DASAR
        </div>
        <q-separator class="q-my-xs"></q-separator>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-input v-model="form.keluhan_utama" outlined autogrow stack-label standout="bg-yellow-3"
              label="Keluhan Utama" :lazy-rules="true" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']"
              hide-bottom-space />
          </div>
          <div class="col-12">
            <q-input v-model="form.riwayat_penyakit_sekarang" outlined autogrow stack-label standout="bg-yellow-3"
              label="Riwayat Penyakit Sekarang" />
          </div>
          <div class="col-12">
            <q-input v-model="form.riwayat_penyakit_dahulu" outlined autogrow stack-label standout="bg-yellow-3"
              label="Riwayat Penyakit Dahulu" />
          </div>
          <div class="col-12">
            <div class="text-weight-bold">
              Pemeriksaan Fisik
            </div>
            <div class="text-grey-8 f-10">
              Pemeriksaan Fisik pasien
            </div>
            <q-separator class="q-my-sm" />
            <div class="row q-col-gutter-sm">
              <q-input v-model="form.keadaan_umum" outlined autogrow stack-label standout="bg-yellow-3"
                label="Keadaan Umum" hide-bottom-space class="col-6" />
              <q-input v-model="form.vas" outlined autogrow stack-label standout="bg-yellow-3" label="VAS"
                hide-bottom-space class="col-6" />
              <q-input v-model="form.neurologis" outlined autogrow stack-label standout="bg-yellow-3" label="NEUROLOGIS"
                hide-bottom-space class="col-6" />
              <q-input v-model="form.muskuloskeletal" outlined autogrow stack-label standout="bg-yellow-3"
                label="Muskuloskeletal" hide-bottom-space class="col-6" />
            </div>

            <q-separator class="q-my-sm"></q-separator>
            <div class="row q-col-gutter-sm">
              <q-input v-model="form.pencitraan" outlined autogrow stack-label standout="bg-yellow-3" label="Pencitraan"
                hide-bottom-space class="col-6" />
              <q-input v-model="form.lain_lain" outlined autogrow stack-label standout="bg-yellow-3" label="Lain-lain"
                hide-bottom-space class="col-6" />
            </div>
          </div>
          <div class="col-12 q-mt-xs">
            <div class="text-weight-bold">
              DIAGNOSIS FUNGSIONAL
            </div>
            <q-separator class="q-my-xs" />

            <q-option-group v-model="form.diagnosis_fungsional" :options="optionDiagnosisFungsionals" color="primary"
              inline dense type="checkbox" />

          </div>
          <div class="col-12 q-mt-sm">
            <q-separator class="q-my-xs" />
            <div class="text-weight-bold">
              PROBLEM REHABILITASI MEDIK
            </div>
            <q-separator class="q-my-xs" />

            <q-option-group v-model="form.problem_rehabilitasimedik" :options="optionProblemRehailitas" color="primary"
              dense type="checkbox" />

            <q-input v-if="form.problem_rehabilitasimedik?.includes('LAIN-LAIN')" class="q-mt-sm"
              v-model="form.problem_rehabilitasimedik_lain" outlined dense standout="bg-yellow-3" label="Sebutkan"
              stack-label />

          </div>



        </div>
        <q-separator class="q-my-md" />
        <div class="q-mt-md flex q-gutter-lg justify-end" style="margin-bottom: 50px;">
          <app-btn color="dark" label="Reset" tooltip="Reset Form" type="reset" tip />
          <app-btn :loading="loading" :disabled="loading" color="primary" label="Simpan Anamnesis" tooltip="Simpan Data"
            type="submit" tip />

        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { api } from 'src/boot/axios'
import { notifSuccessVue } from 'src/modules/utils'
import { useRehabmedikPengkajianStore } from 'src/stores/simrs/pelayanan/rehabmedik/pengkajian'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  storeKunjungan: {
    type: Object,
    default: null
  }
})

const store = useRehabmedikPengkajianStore()

const form = ref({
  keluhan_utama: '',
  riwayat_penyakit_sekarang: '',
  riwayat_penyakit_dahulu: '',
  keadaan_umum: '',
  vas: '',
  neurologis: '',
  muskuloskeletal: '',
  pencitraan: '',
  lain_lain: '',
  diagnosis_fungsional: [],
  problem_rehabilitasimedik: [],
  problem_rehabilitasimedik_lain: '',
})

const loading = ref(false)
onMounted(() => {
  // console.log('props store', props.storeKunjungan);
  initReset()
})


const optionDiagnosisFungsionals = ref(
  [
    {
      label: 'IMPAIRMENT',
      value: 'IMPAIRMENT'
    },
    {
      label: 'DISABILITY',
      value: 'DISABILITY'
    },
    {
      label: 'HANDICAP',
      value: 'HANDICAP'
    }
  ]
)
const optionProblemRehailitas = ref(
  [
    {
      label: 'MOBILISASI',
      value: 'MOBILISASI'
    },
    {
      label: 'ADL',
      value: 'ADL'
    },
    {
      label: 'KOMUNIKASI',
      value: 'KOMUNIKASI'
    },
    {
      label: 'PSIKOLOGI',
      value: 'PSIKOLOGI'
    },
    {
      label: 'SOSIAL',
      value: 'SOSIAL'
    },
    {
      label: 'VOKASIONAL',
      value: 'VOKASIONAL'
    },
    {
      label: 'LAIN-LAIN',
      value: 'LAIN-LAIN'
    }
  ]
)

const onSubmit = async () => {
  loading.value = true

  form.value.noreg = props.pasien.noreg
  form.value.norm = props.pasien.norm

  try {
    const resp = await api.post('v1/simrs/rehabmedik/pengkajian/store', form.value)
    console.log('resp simpan', resp);

    if (resp.status === 200) {
      const data = resp?.data
      props.storeKunjungan?.injectDataPasien(props.pasien?.noreg, data, 'pengkajian')
      initReset()
      notifSuccessVue('Pengkajian berhasil disimpan')
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }


}

const initReset = () => {
  store.setItem(null)
  form.value = null
  form.value = {
    keluhan_utama: '',
    riwayat_penyakit_sekarang: '',
    riwayat_penyakit_dahulu: '',
    keadaan_umum: '',
    vas: '',
    neurologis: '',
    muskuloskeletal: '',
    pencitraan: '',
    lain_lain: '',
    diagnosis_fungsional: [],
    problem_rehabilitasimedik: [],
    problem_rehabilitasimedik_lain: '',
  }
}

watch(() => store.item, (obj) => {
  // console.log('watch', obj);

  if (obj) {
    form.value = {
      ...obj
    }
  }

  console.log('watch', obj, form.value);

}, { immediate: true })


</script>
