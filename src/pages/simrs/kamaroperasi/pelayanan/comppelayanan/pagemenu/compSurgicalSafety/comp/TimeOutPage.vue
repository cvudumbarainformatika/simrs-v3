<template>
  <div class="row bg-white">
    <div class=" col fit">
      <div class="full-height columm q-col-gutter-x-xs">
        <div class="">
          <Info :pasien="pasien" />
          <q-separator class="q-my-sm" size="2px" />
        </div>
        <div class=" ">
          <div class="q-px-sm">
            <div class="row ">
              <div class="text-bold f-14 q-mr-sm">Time Out </div>
              ( Sebelum Insisi ) oleh instrumen, anastesi, dan operator
            </div>
            <q-separator class="q-my-sm" size="1px" />
            <div v-for="item in store.form.timeOut" :key="item">
              <div class="row">
                <div class="col-12">
                  <div class="row">
                    {{ item?.tanya }}
                  </div>
                  <div class="row">
                    <div v-if="item?.type == 'checkbox'">
                      <q-option-group v-model="item.jawab" type="checkbox" :options="item.options" color="primary"
                        inline dense @update:model-value="gantiJawaban(item)" />
                    </div>
                    <div v-else>
                      <q-option-group v-model="item.jawab" :options="item.options" color="primary" inline dense
                        @update:model-value="gantiJawaban(item)" />
                    </div>
                    <span v-if="item.adaInput && item.jawab == '1'" class="q-ml-xs text-bold">{{ item?.input }} </span>
                    <span v-if="item.adaInput && item.jawab == '1' && item?.ket" class="q-ml-xs">{{ item?.ket }} </span>
                  </div>
                  <div v-if="item.adaInput && item.jawab == '1'" class="row">
                    <q-input v-model="item.input" label=" " dense class="col-12" outlined />
                  </div>
                  <div v-if="item.adaInputArray && item.jawab == '1'" class="row">
                    <div class="col-12">
                      <div v-for="ada in item.inputArray" :key="ada">
                        <div class="row items-center">
                          <div class="col-2">{{ ada?.label }}</div>
                          <div class="col-10">
                            <q-input v-model="ada.input" label=" " dense class="col-12" outlined />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-my-sm" size="1px" />
            </div>
            <div class="row q-my-md print-hide">
              <div class="col-6">
                <app-autocomplete v-model="store.form.dokter_operator" valid label="Pilih Dokter Operator"
                  :source="dokters" option-label="nama" option-value="kdpegsimrs" outlined clearable />
              </div>
              <div class="col-6">
                <app-autocomplete v-model="store.form.perawat_instrumen" valid label="Pilih Perawat Instrumen"
                  :source="perawats" option-label="nama" option-value="kdpegsimrs" outlined clearable />
              </div>
            </div>
            <div class="row">
              <div class="col-6 text-center">Dokter Operator</div>
              <div class="col-6 text-center">Perawat instrumen</div>
            </div>
            <div class="row q-my-md">
              <div class="col-6 text-center ">
                <div class="column flex-center">
                  <div style="width: 100px;">
                    <vue-qrcode :value="qrUrl(store.form.dokter_operator)" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff',
                      },
                      margin: 0
                    }" />
                  </div>
                </div>
              </div>
              <div class="col-6 text-center">
                <div class="column flex-center">
                  <div style="width: 100px;">
                    <vue-qrcode :value="qrUrl(store.form.perawat_instrumen)" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff',
                      },
                      margin: 0
                    }" />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6 text-center">{{ getNakesNya(store.form.dokter_operator)?.nama ?? 'belum dipilih' }}
              </div>
              <div class="col-6 text-center">{{ getNakesNya(store.form.perawat_instrumen)?.nama ?? 'belum dipilih' }}
              </div>
            </div>
            <div class="row q-ma-md justify-end">
              <app-btn label="Simpan" :loading="store.loading" :disable="store.loading" @click="store.simpan(pasien)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
import { computed, defineAsyncComponent, onMounted } from 'vue'

const Info = defineAsyncComponent(() => import('./InfoPasienPage.vue'))
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useSurgicalSafetyStore()
function gantiJawaban (val) {
  if (val?.adaInput && val.jawab == '0') val.input = ''
}
const dokters = computed(() => {
  return store.nakes?.filter(i => i.kdgroupnakes == '1')
})
const perawats = computed(() => {
  return store.nakes?.filter(i => i.kdgroupnakes == '2')
})
function getNakesNya (val) {
  return store.nakes?.find(i => i.kdpegsimrs == val)
}

function qrUrl (val) {
  // console.log('pasien', props?.pasien)

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SIGN IN CHECKLIST SEFETY.png'
  const asal = props?.pasien?.rs13?.includes('POL0') ? 'RAWAT JALAN' : 'RAWAT INAP'
  const petugas = getNakesNya(val)?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
}
onMounted(() => {

  store.resetForm()
})
</script>
