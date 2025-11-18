<template>
  <div class="column full-height">
    <!-- ===============================================================================KOLOM ISIAN PEMERIKSAAN -->
    <div v-if="!canvasFull" class="col-8">
      <!-- <div class="bg-primary text-white q-pa-md">
        <div class="f-12">
          Pemeriksaan (Vital Sign) <div class="text-white"> -->
      <!-- {{ store.templateActive }} -->
      <!-- </div>
        </div>
      </div> -->
      <q-card-section class="q-px-md q-py-xs bg-primary text-white">
        <div class="row items-center justify-between">
          <div class="f-12">
            Pemeriksaan (Vital Sign)
          </div>
          <div>
            <q-btn flat dense size="md" icon="icon-mat-history" @click="historyOpen">
              <q-tooltip class="bg-dark text-white">
                {{ tooltip }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-scroll-area style="height: calc(100% - 52px);">
        <q-form ref="formRef" class="row q-col-gutter-xs q-pa-lg" @submit.prevent.stop="onSubmit">
          <div class="col-4">
            <q-select ref="refKeadaanUmum" v-model="store.formVital.keadaan_umum" dense
              standout="bg-yellow-3 text-black" outlined label="Keadaan Umum" :options="store.keadaanUmums"
              input-class="ellipsis" fill-input :rules="[val => !!val || 'Harap diisi']" lazy-rules="ondemand"
              hide-bottom-space hide-dropdown-icon />
          </div>
          <div class="col-2">
            <q-input v-model="store.formVital.denyutjantung" dense standout="bg-yellow-3 text-black" outlined label="N"
              :rules="[val => !!val || 'Harap diisi']" hide-bottom-space
              @update:model-value="setNumber($event, 'denyutjantung')" />
          </div>
          <div class="col-2">
            <q-input v-model="store.formVital.pernapasan" dense standout="bg-yellow-3 text-black" outlined label="RR"
              :rules="[val => !!val || 'Harap diisi']" hide-bottom-space
              @update:model-value="setNumber($event, 'pernapasan')" />
          </div>
          <div class="col-2">
            <q-input v-model="store.formVital.sistole" dense standout="bg-yellow-3 text-black" outlined label="Sys"
              :rules="[
                val => !!val || 'Harap diisi',
                val => !isNaN(val) || 'Hrs Nomor',
              ]" hide-bottom-space @update:model-value="setNumber($event, 'sistole')" />
          </div>
          <div class="col-2">
            <q-input v-model="store.formVital.diastole" dense standout="bg-yellow-3 text-black" outlined label="Dia"
              :rules="[
                val => !!val || 'Hrp diisi',
                val => !isNaN(val) || 'Hrs Nomor',
              ]" hide-bottom-space @update:model-value="setNumber($event, 'diastole')" />
          </div>
          <div class="col-4">
            <q-input v-model="store.formVital.suhutubuh" dense standout="bg-yellow-3 text-black" outlined label="Suhu"
              :rules="[
                val => !!val || 'Hrp diisi',
                val => !isNaN(val) || 'Hrs Nomor',
              ]" hide-bottom-space @update:model-value="setNumber($event, 'suhutubuh')" />
          </div>
          <div class="col-4">
            <q-input v-model="store.formVital.tinggibadan" dense standout="bg-yellow-3 text-black" outlined
              label="Tinggi Badan /cm" :rules="[
                val => !isNaN(val) || 'Hrs Nomor',
              ]" hide-bottom-space @update:model-value="setNumber($event, 'tinggibadan')" />
          </div>
          <div class="col-4">
            <q-input v-model="store.formVital.beratbadan" dense standout="bg-yellow-3 text-black" outlined
              label="Berat Badan /kg" :rules="[
                val => !isNaN(val) || 'Hrs Nomor',
              ]" hide-bottom-space @update:model-value="setNumber($event, 'beratbadan')" />
          </div>
          <!-- <div class="col-4">
            <q-input
              v-model="store.formVital.vas"
              dense
              standout="bg-yellow-3 text-black"
              outlined
              label="VAS (Max 10)"
              :rules="[
                val => val <= 10 || 'Max 10',
                val => !isNaN(val) || 'Hrs Nomor',
              ]"
              hide-bottom-space
              @update:model-value="setNumber($event,'vas')"
            />
          </div> -->
          <div class="col-12">
            <q-select v-model="store.formVital.tingkatkesadaran" dense standout="bg-yellow-3 text-black" outlined
              label="Tingkat Kesadaran" :options="store.optionsTingkatkesadaran" stack-label emit-value map-options
              input-class="ellipsis" fill-input hide-dropdown-icon />
          </div>
          <div class="col-6">
            <div class="q-mt-sm">
              <q-input v-model="store.formVital.sosialekonomi" standout="bg-yellow-3 text-black" outlined
                label="Sosial Ekonomi" autogrow />
            </div>
            <div class="q-mt-sm">
              <q-input v-model="store.formVital.spiritual" standout="bg-yellow-3 text-black" outlined label="Spiritual"
                autogrow />
            </div>
          </div>

          <!-- <div
            class="col-6 f-12 text-weight-bold"
          >
            <q-separator class="q-my-xs" />
          </div> -->
          <div class="col-6">
            <div class="text-weight-bold">
              Status Psikologis
              <q-separator class="q-mb-md q-mt-xs" />
            </div>
            <div class="q-gutter-sm">
              <q-option-group v-model="store.selectStatusPsikologi" :options="opt" color="primary" inline dense
                type="checkbox" @update:model-value="updateSelectionPsikologis" />
            </div>

            <!-- <div class="q-mt-sm">
              <q-separator class="q-my-sm" />
              <div class="q-mb-sm">
                Nyeri ? <em class="text-primary">{{ store.formVital.keteranganskornyeri }}</em>
                <span class="q-ml-sm">
                  <q-icon
                    size="lg"
                    color="teal"
                    :name="iconNyeri"
                  />
                </span>
              </div>
              <q-separator class="q-mt-sm" />
              <div>
                <q-slider
                  v-model="store.formVital.skornyeri"
                  color="primary"
                  thumb-color="primary"
                  label-color="primary"
                  label-text-color="yellow"
                  markers
                  :marker-labels="(val)=> fnMarkerLabel"
                  marker-labels-class="text-primary"
                  label-always
                  switch-label-side
                  :min="0"
                  :max="10"
                  @update:model-value="store.setKeteranganSkornyeri"
                />
              </div>
            </div> -->
          </div>
          <div class="col-6">
            <q-input v-model="store.formVital.statusneurologis" standout="bg-yellow-3 text-black" outlined
              label="Status Neurologis" autogrow />
          </div>
          <div class="col-6">
            <q-input v-model="store.formVital.muakuloskeletal" standout="bg-yellow-3 text-black" outlined
              label="Kultural" autogrow />
          </div>
          <div class="col-12">
            <q-separator class="q-my-sm" />
            <div class="text-weight-bold">
              Kesadaran <span class="text-primary"> {{ store.formVital.kesadaran }}</span>
            </div>
            <q-separator class="q-my-sm" />
            <div class="col-12 row q-col-gutter-lg">
              <q-slider v-model="store.formVital.kesadarane" marker-labels label-always switch-label-side
                :label-value="'E ' + store.formVital.kesadarane" :min="0" :max="4" class="col-4"
                @update:model-value="sumKesadaran" />
              <q-slider v-model="store.formVital.kesadaranv" marker-labels
                :label-value="'V ' + store.formVital.kesadaranv" label-always switch-label-side :min="0" :max="5"
                class="col-4" color="green" @update:model-value="sumKesadaran" />
              <q-slider v-model="store.formVital.kesadaranm" marker-labels label-always
                :label-value="'M ' + store.formVital.kesadaranm" switch-label-side :min="0" :max="6" class="col-4"
                color="orange" @update:model-value="sumKesadaran" />
            </div>
          </div>

          <div class="col-12">
            <q-separator class="q-my-sm" />
          </div>
          <div v-if="pasien?.kodepoli === 'POL018'" class="col-12">
            <dada-paru-form-vue />
          </div>
        </q-form>


      </q-scroll-area>
    </div>
    <!-- =================================================================================KOLOM TABEL PENANDAAN -->
    <div :class="canvasFull ? 'col-12' : 'col-4'">
      <div class="full-height">
        <div class="column full-height">
          <div class="col-auto">
            <q-bar dense class="bg-teal text-white">
              <div class="f-12">
                Detail Kelainan Fisik / Penandaan Gambar
              </div>
            </q-bar>
          </div>
          <div class="col">
            <q-card flat square class="column-break full-height">
              <q-scroll-area v-if="filterShapes?.length" style="height: calc(100% - 52px);">
                <q-list separator>
                  <template v-for="(item, i) in filterShapes" :key="i">
                    <q-item clickable @click="handleClickItem(item, i)">
                      <q-item-section avatar side top>
                        <q-avatar size="18px" color="orange">
                          {{ i + 1 }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item.anatomy ? item.anatomy : '...' }}
                          <div v-if="store.mata[i]">
                            <div class="column q-ml-sm">
                              <!-- <div><em>Details Pemeriksaan (Khusus Mata)</em></div> -->
                              <div class="q-ml-sm">
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>VOD AWAL : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs4" @update:model-value="(val) => {
                                      store.mata[i].rs4 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>VOD REFR : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs5" @update:model-value="(val) => {
                                      store.mata[i].rs5 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>VOD AKHIR : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs6" @update:model-value="(val) => {
                                      store.mata[i].rs6 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>TOD : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs10" @update:model-value="(val) => {
                                      store.mata[i].rs10 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>FONDOS OD : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs12" @update:model-value="(val) => {
                                      store.mata[i].rs12 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>VOS AWAL : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs7" @update:model-value="(val) => {
                                      store.mata[i].rs7 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>VOS REFR : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs8" @update:model-value="(val) => {
                                      store.mata[i].rs8 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>VOS AKHIR : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs9" @update:model-value="(val) => {
                                      store.mata[i].rs9 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>TOS : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs11" @update:model-value="(val) => {
                                      store.mata[i].rs11 = val
                                    }" />
                                  </b>
                                </div>
                                <div class="flex items-center q-gutter-x-xs">
                                  <div>FONDOS OS : </div>
                                  <b>
                                    <text-edit :model-value="store.mata[i].rs13" @update:model-value="(val) => {
                                      store.mata[i].rs13 = val
                                    }" />
                                  </b>
                                </div>
                              </div>
                            </div>
                          </div>
                        </q-item-label>
                        <q-item-label caption lines="2">
                          Ket:
                          <!-- <span>
                            {{ item.ket ? item.ket : '...' }}
                          </span> -->
                          <text-area-edit class="full-width" :model-value="item.ket" @update:model-value="(val) => {
                            item.ket = val
                          }" />
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side top style="padding: 0;">
                        <q-btn flat icon="icon-mat-delete" size="xs" padding="xs" color="negative"
                          @click="store.deleteObjShapes(i)" />
                      </q-item-section>
                    </q-item>

                  </template>
                  <div style="margin-bottom: 100px;"></div>
                  <q-separator dark />
                </q-list>
              </q-scroll-area>
              <div v-else class="column flex-center items-center" style="height: calc(100% - 48px);">
                Data Belum Ada
              </div>
              <div v-if="!canvasFull" class="row justify-between bg-yellow-3 q-pa-sm">
                <div>
                  <q-btn v-if="store.edited" :label="store.edited ? 'Batal' : 'Simpan Pemeriksaan'"
                    :color="store.edited ? 'negative' : 'primary'" :loading="store.loadingform"
                    :disable="store.loadingform" dense class="q-px-md" @click="store.setNotEdit" />
                </div>
                <div>
                  <q-btn :label="store.edited ? 'Simpan Perubahan' : 'Simpan Pemeriksaan'"
                    :color="store.edited ? 'dark' : 'primary'" :loading="store.loadingform" :disable="store.loadingform"
                    dense class="q-px-md" @click="onSubmit" />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup>
import DadaParuFormVue from './khusus/DadaParuForm.vue'
import { usePemeriksaanFisik } from 'src/stores/simrs/pelayanan/poli/pemeriksaanfisik'
import { onMounted, ref, onBeforeMount, defineAsyncComponent } from 'vue'
import { useMenuPemeriksaan } from '../../forjs/menupemeriksaan'

import MenuCanvas from './MenuCanvas.vue'
const TextEdit = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/TextEdit.vue'))
const TextAreaEdit = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/TextAreaEdit.vue'))

const emits = defineEmits(['openHistory'])
const store = usePemeriksaanFisik()

const { menus } = useMenuPemeriksaan()
const formRef = ref()
const isEditFormDialog = ref(false)
const editIndex = ref(null)

const opt = ref([
  { value: 'Tidak ada kelainan', label: 'Tidak ada kelainan' },
  { value: 'Cemas', label: 'Cemas' },
  { value: 'Takut', label: 'Takut' },
  { value: 'Marah', label: 'Marah' },
  { value: 'Sedih', label: 'Sedih' },
  { value: 'Lain-lain', label: 'Lain-lain' }
])

const updateSelectionPsikologis = (val) => {
  // console.log(val)
  store.setFormVital('statuspsikologis', val.join(', '))
  // console.log(store.formVital.statuspsikologis)
}
// const icons = ref([
//   'icon-my-emoticon-excited-outline',
//   'icon-my-emoticon-outline',
//   'icon-my-emoticon-neutral-outline',
//   'icon-my-emoticon-sad-outline',
//   'icon-my-emoticon-confused-outline',
//   'icon-my-emoticon-cry-outline'
// ])

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  canvasFull: {
    type: Boolean,
    default: false
  },
  filterShapes: {
    type: Array,
    default: () => []
  },
  tooltip: {
    type: String,
    default: 'History Pemeriksaan'
  }
})

function setNumber (evt, key) {
  // console.log(evt, 'includes', evt.includes('.'), 'indexOf', evt.indexOf('.'), 'length', evt?.length)
  const inc = evt.includes('.')
  const ind = evt.indexOf('.')
  const panj = evt?.length
  const nilai = isNaN(parseFloat(evt)) ? 0 : (inc && (ind === (panj - 1)) ? evt : parseFloat(evt))
  // console.log('evt', evt, 'key', key)
  store.setFormVital(key, nilai)
}
function sumKesadaran () {
  const jml = parseInt(store.formVital.kesadarane) + parseInt(store.formVital.kesadaranm) + parseInt(store.formVital.kesadaranv)
  store.setTingkatKesadaran(jml)
}

onMounted(() => {
  // console.log('filterShapes', filterShapes.value)
  // getImage()
  // canvasWidth.value = canvasEl.value?.clientWidth
  store.initReset(false).then(() => {
    if (formRef.value) formRef.value.resetValidation()
  })
})

async function onSubmit () {
  const valid = await formRef.value?.validate()
  if (valid) {
    store.savePemeriksaan(props.pasien, menus.value).then(() => {
      if (formRef.value) formRef.value.resetValidation()
    })
  }
}

function historyOpen () {
  emits('openHistory')
  // store.getHistory(props.pasien?.norm)
}

const handleClickItem = (item, index) => {
  // console.log('handleClickItem', item, index);
  // console.log('handleClickItem2', store.dialogForm);
  store.isEdit = true
  editIndex.value = index

  // store.getHistory(props.pasien?.norm)
}

</script>
