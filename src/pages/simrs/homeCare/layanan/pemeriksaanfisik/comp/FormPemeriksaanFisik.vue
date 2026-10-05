<template>
  <q-card flat bordered square class="full-height column">
    <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto">
      <div class="row items-center justify-between">
        <div class="f-12 text-weight-bold">
          {{ store.edited ? 'Edit Pemeriksaan Fisik & TTV' : 'Form Pemeriksaan Fisik & TTV' }}
        </div>
        <div v-if="store.edited">
          <q-btn flat dense size="sm" icon="icon-mat-close" label="Batal Edit" color="white" @click="store.initReset()" />
        </div>
      </div>
    </q-card-section>
    <q-separator />

    <q-card-section class="col scroll q-pa-md">
      <q-form ref="refForm" class="q-gutter-y-sm" @submit.prevent="onSubmit">
        <!-- Tanda Vital -->
        <div class="text-weight-bold f-12 text-primary">
          1. Tanda-Tanda Vital (TTV)
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-4">
            <q-select
              v-model="store.formVital.keadaan_umum"
              dense
              outlined
              label="Keadaan Umum"
              :options="store.keadaanUmums"
              standout="bg-yellow-3"
              :rules="[val => !!val || 'Harap diisi']"
              hide-bottom-space
            />
          </div>
          <div class="col-6 col-md-4">
            <q-input
              v-model="store.formVital.sistole"
              dense
              outlined
              label="Sistole (mmHg)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'sistole')"
            />
          </div>
          <div class="col-6 col-md-4">
            <q-input
              v-model="store.formVital.diastole"
              dense
              outlined
              label="Diastole (mmHg)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'diastole')"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="store.formVital.denyutjantung"
              dense
              outlined
              label="Nadi / Denyut Jantung (x/m)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'denyutjantung')"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="store.formVital.pernapasan"
              dense
              outlined
              label="Pernapasan / RR (x/m)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'pernapasan')"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="store.formVital.suhutubuh"
              dense
              outlined
              label="Suhu Tubuh (°C)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'suhutubuh')"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="store.formVital.vas"
              dense
              outlined
              label="Skor Nyeri / VAS (0-10)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'vas')"
            />
          </div>
          <div class="col-6 col-md-6">
            <q-input
              v-model="store.formVital.beratbadan"
              dense
              outlined
              label="Berat Badan (kg)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'beratbadan')"
            />
          </div>
          <div class="col-6 col-md-6">
            <q-input
              v-model="store.formVital.tinggibadan"
              dense
              outlined
              label="Tinggi Badan (cm)"
              standout="bg-yellow-3"
              :rules="[val => !val || !isNaN(val) || 'Harus angka']"
              hide-bottom-space
              @update:model-value="store.setNumber($event, 'tinggibadan')"
            />
          </div>
        </div>

        <q-separator class="q-my-sm" />

        <!-- Kesadaran & GCS -->
        <div class="text-weight-bold f-12 text-primary">
          2. Kesadaran & GCS
        </div>
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-6">
            <q-select
              v-model="store.formVital.tingkatkesadaran"
              dense
              outlined
              label="Tingkat Kesadaran"
              :options="store.optionsTingkatkesadaran"
              emit-value
              map-options
              standout="bg-yellow-3"
              @update:model-value="store.setTingkatKesadaran($event)"
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-8">
              Hasil Kesadaran: <b class="text-primary">{{ store.formVital.kesadaran }}</b> (Total GCS: {{ store.formVital.tingkatkesadaran }})
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-caption">Eye (E): {{ store.formVital.kesadarane }}</div>
            <q-slider
              v-model="store.formVital.kesadarane"
              :min="1"
              :max="4"
              markers
              label
              color="primary"
              @update:model-value="store.sumKesadaran"
            />
          </div>
          <div class="col-12 col-md-4">
            <div class="text-caption">Verbal (V): {{ store.formVital.kesadaranv }}</div>
            <q-slider
              v-model="store.formVital.kesadaranv"
              :min="1"
              :max="5"
              markers
              label
              color="teal"
              @update:model-value="store.sumKesadaran"
            />
          </div>
          <div class="col-12 col-md-4">
            <div class="text-caption">Motorik (M): {{ store.formVital.kesadaranm }}</div>
            <q-slider
              v-model="store.formVital.kesadaranm"
              :min="1"
              :max="6"
              markers
              label
              color="orange"
              @update:model-value="store.sumKesadaran"
            />
          </div>
        </div>

        <q-separator class="q-my-sm" />

        <!-- Status Fisik & Psikologis -->
        <div class="text-weight-bold f-12 text-primary">
          3. Status Fisik, Neurologis & Psikososial
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <div class="text-caption text-weight-medium">Status Psikologis:</div>
            <q-option-group
              v-model="store.selectStatusPsikologi"
              :options="psikologisOptions"
              color="primary"
              inline
              dense
              type="checkbox"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="store.formVital.statusneurologis"
              outlined
              label="Status Neurologis"
              standout="bg-yellow-3"
              autogrow
              rows="2"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="store.formVital.muakuloskeletal"
              outlined
              label="Muskuloskeletal"
              standout="bg-yellow-3"
              autogrow
              rows="2"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="store.formVital.sosialekonomi"
              outlined
              label="Sosial Ekonomi"
              standout="bg-yellow-3"
              autogrow
              rows="2"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="store.formVital.spiritual"
              outlined
              label="Spiritual"
              standout="bg-yellow-3"
              autogrow
              rows="2"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-md q-gutter-sm">
          <q-btn
            v-if="store.edited"
            flat
            label="Batal"
            color="grey-8"
            @click="store.initReset()"
          />
          <q-btn
            type="submit"
            :loading="store.loadingForm"
            color="primary"
            :icon="store.edited ? 'icon-mat-edit' : 'icon-mat-save'"
            :label="store.edited ? 'Simpan Perubahan' : 'Simpan Pemeriksaan Fisik'"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { usePemeriksaanFisikHomeCare } from 'src/stores/simrs/homeCare/pemeriksaanfisik'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePemeriksaanFisikHomeCare()
const refForm = ref(null)

const psikologisOptions = [
  { label: 'Tenang', value: 'Tenang' },
  { label: 'Cemas', value: 'Cemas' },
  { label: 'Takut', value: 'Takut' },
  { label: 'Marah', value: 'Marah' },
  { label: 'Sedih', value: 'Sedih' },
  { label: 'Kecenderungan Bunuh Diri', value: 'Kecenderungan Bunuh Diri' }
]

function onSubmit () {
  store.saveData(props.pasien)
}
</script>
