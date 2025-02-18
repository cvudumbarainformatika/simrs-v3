<template>
  <div class="fit row">
    <div class="row fit q-col-gutter-sm">
      <div class="col-4">
        <q-card flat class="fit bg-white">
          <q-card-section class="q-pa-md">
            <div>
              <div class="text-bold">TINDAKAN </div>
              <q-separator class="q-my-sm"></q-separator>
              <div class="text-bold">Tindakan : </div>
              <div class="q-ml-sm"> {{ item?.tindakan?.join(', ') || '-' }}
                <q-popup-edit fit buttons v-model="item.tindakan" :cover="false" :offset="[0, 10]" class="full-width"
                  v-slot="scope"></q-popup-edit>

              </div>
              <autocomplete-input-two v-model="item.tindakan" :options="store.tindakans" option-label="tindakan"
                option-value="tindakan" :filters-by="['tindakan']" label="Tindakan" multiple @set-model="(val) => {
                  console.log('val', val);

                }" />
            </div>
            <div>
              <div class="text-bold">Keterangan : </div>
              <div class="q-ml-sm"> {{ item?.keterangan || '-' }}</div>
            </div>
            <q-separator class="q-my-sm"></q-separator>
            <div class="text-bold">IMPLEMENTASI </div>
            <q-separator class="q-my-sm"></q-separator>
            <div>
              <div class="text-bold">Implementasi : </div>
              <div class="q-ml-sm column">
                <span v-html="getNewLine(item?.implementasi)" />
              </div>
            </div>
            <div>
              <div class="text-bold">Pemakaian Obat : </div>
              <div class="q-ml-sm"> {{ item?.reseps || '-' }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4">
        <q-card flat class="fit bg-white">
          <q-card-section class="q-pa-md">
            <div>
              <div class="text-bold">Observasi </div>
              <q-separator class="q-my-sm"></q-separator>
              <div class="q-ml-sm flex">
                <div class="text-bold">BB : </div>
                <div class="q-ml-sm"> {{ item?.bb }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">TB : </div>
                <div class="q-ml-sm"> {{ item?.tb }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">SUHU : </div>
                <div class="q-ml-sm"> {{ item?.suhu }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">NADI : </div>
                <div class="q-ml-sm"> {{ item?.nadi }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">Sis : </div>
                <div class="q-ml-sm"> {{ item?.sis }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">Dias : </div>
                <div class="q-ml-sm"> {{ item?.dia }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">RR : </div>
                <div class="q-ml-sm"> {{ item?.rr }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">SPO2 : </div>
                <div class="q-ml-sm"> {{ item?.spo2 }}</div>
              </div>
            </div>

            <q-separator class="q-my-sm"></q-separator>
            <div class="q-ml-sm flex">
              <div class="text-bold">NYERI : </div>
              <div class="q-ml-sm"> {{ item?.nyeri }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">SKORING : </div>
              <div class="q-ml-sm"> {{ item?.skor }}</div>
            </div>
            <q-separator class="q-my-sm"></q-separator>
            <div class="q-ml-sm flex">
              <div class="text-bold">CVP : </div>
              <div class="q-ml-sm"> {{ item?.cvp }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">ICP : </div>
              <div class="q-ml-sm"> {{ item?.icp }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">GCS : </div>
              <div class="q-ml-sm"> {{ item?.gcs }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">KEJANG, DURASI : </div>
              <div class="q-ml-sm"> {{ item?.kejang }}</div>
            </div>
            <q-separator class="q-my-sm"></q-separator>
            <div class="text-bold">VENTILATOR MENU </div>
            <q-separator class="q-my-sm"></q-separator>
            <div class="q-ml-sm flex">
              <div class="text-bold">MODE : </div>
              <div class="q-ml-sm"> {{ item?.mode }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">FRAKSI O2 : </div>
              <div class="q-ml-sm"> {{ item?.fraksio2 }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">FREKUENSI : </div>
              <div class="q-ml-sm"> {{ item?.frek }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">PEEP : </div>
              <div class="q-ml-sm"> {{ item?.peep }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">P INS : </div>
              <div class="q-ml-sm"> {{ item?.pins }}</div>
            </div>
            <div class="q-ml-sm flex">
              <div class="text-bold">RATIO : </div>
              <div class="q-ml-sm"> {{ item?.ratio }}</div>
            </div>

          </q-card-section>
        </q-card>
      </div>
      <div class="col-4">
        <q-card flat class="fit bg-white">
          <q-card-section class="q-pa-md">
            <div>
              <div class="text-bold">INTAKE </div>
              <q-separator class="q-my-sm"></q-separator>
              <div class="q-ml-sm flex">
                <div class="text-bold">INFUS : </div>
                <div class="q-ml-sm"> {{ item?.infus }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">PUMP : </div>
                <div class="q-ml-sm"> {{ item?.pump }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">OBAT2 AN : </div>
                <div class="q-ml-sm"> {{ item?.obat }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">ALBUMIN : </div>
                <div class="q-ml-sm"> {{ item?.albumin }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">MAKAN & MINUM : </div>
                <div class="q-ml-sm"> {{ item?.mamin }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">ZONDE : </div>
                <div class="q-ml-sm"> {{ item?.zonde }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">WATER MET : </div>
                <div class="q-ml-sm"> {{ item?.water }}</div>
              </div>

              <q-separator class="q-my-sm"></q-separator>
              <div class="text-bold">OUTPUT </div>
              <q-separator class="q-my-sm"></q-separator>


              <div class="q-ml-sm flex">
                <div class="text-bold">URINE : </div>
                <div class="q-ml-sm"> {{ item?.urine }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">DRAINE : </div>
                <div class="q-ml-sm"> {{ item?.drain }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">MUNTAH : </div>
                <div class="q-ml-sm"> {{ item?.muntah }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">FECES : </div>
                <div class="q-ml-sm"> {{ item?.feces }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">IWL : </div>
                <div class="q-ml-sm"> {{ item?.iwl }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">PENDARAHAN : </div>
                <div class="q-ml-sm"> {{ item?.pendarahan }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">UFG : </div>
                <div class="q-ml-sm"> {{ item?.ufg }}</div>
              </div>
              <div class="q-ml-sm flex">
                <div class="text-bold">PROD GC : </div>
                <div class="q-ml-sm"> {{ item?.produksigc }}</div>
              </div>
            </div>




          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 flex q-pa-sm bg-white q-mt-lg justify-end">
        <q-btn label="Simpan Perubahan" color="primary"></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getNewLine } from 'src/modules/formatter';
import { useNurseNoteRanapStore } from 'src/stores/simrs/ranap/nursenote';
import { defineAsyncComponent, onMounted, ref, watchEffect } from 'vue'


const AutocompleteInputTwo = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/AutocompleteInputTwo.vue'))
const store = useNurseNoteRanapStore()


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  item: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['openReseps'])

const splitterModel = ref(50)
const insideModel1 = ref(50)
const insideModel1a = ref(50)
const insideModel1aRef = ref(null)
const insideModel1b = ref(50)
const insideModel2 = ref(50)

const focusing = ref(null)

const setSplitter = (val, num) => {
  // console.log('val', val);
  if (val === 'insideModel1a') {
    insideModel1a.value = num

  } else if (val === 'insideModel1b') {
    insideModel1b.value = num
  }
}

const resetSplitter = () => {
  insideModel1a.value = 50
  insideModel1b.value = 50
}

onMounted(() => {
  // console.log('mounted', insideModel1aRef.value);

})

watchEffect(() => {
  // if (focusing.value) {
  //   setSplitter(focusing.value)
  // } else {
  //   resetSplitter()
  // }
  // console.log('focusing', focusing.value);

})
</script>