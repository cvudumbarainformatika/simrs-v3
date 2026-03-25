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
            <div class="row justify-between items-center">
              <div class="text-bold f-14 q-mr-sm col-auto">Pemakaian Implant </div>
              <div class="q-mr-sm col-auto"><q-btn flat
                  :icon="tampilImplant ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="tampilImplant = !tampilImplant" round dense /> </div>
            </div>
            <q-separator class="q-my-sm" size="1px" />
            <!-- pemakaian implant -->
            <div v-if="tampilImplant">
              <!-- <div class="row items-end justify-end q-my-sm">
                <app-btn label="Ambil ulang data implant" @click="store.getImplants" :loading="store.loading"
                  :disable="store.loading" />
              </div> -->
              <div v-if="store.implants?.length" class="bg-white">
                <ImplatTable />
                <div class="row items-end justify-end q-my-xs">
                  <app-btn label="Simpan Implant" @click="store.simpanImplants" :loading="store.loading"
                    :disable="store.loading || bisaSimpan()" />
                </div>
              </div>
              <div v-else>
                <app-no-data text="Data Implant belum ada" />
              </div>
              <q-separator class="q-my-sm" size="2px" />
              <div class="row justify-between">
                <div class="col-4"><q-file outlined v-model="store.seri" label="seri Implant" dense /></div>
                <div class="col-2 text-end"> <app-btn label="Simpan Gambar" @click="store.simpanGambar"
                    :loading="store.loading" :disable="store.loading" /> </div>
              </div>
              <div v-if="store.pasien?.implant_seri?.length">
                <q-card v-for="(file, i) in store.pasien?.implant_seri" :key="i" flat bordered class="q-mb-sm">
                  <q-card-section>
                    <div style="border: 1px solid grey;" class="q-mb-md">
                      <!-- {{ getImg(file?.url) }} -->
                      <q-img :src="getImg(file?.url)" :key="file.url" style="height: 170px; max-width: 300px">
                        <div class="absolute-bottom">

                          <div class="row items-center justify-between">
                            <q-btn class="gt-xs" size="md" color="yellow" flat dense round icon="icon-mat-visibility"
                              :href="pathImg + file.url" target="_blank" />
                            <q-btn class="gt-xs" size="md" color="negative" flat dense round icon="icon-mat-delete"
                              @click="store.hapusGambar(file)" />
                          </div>
                        </div>
                      </q-img>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <q-separator class="q-my-sm" size="2px" />
            </div>
            <div class="row justify-between items-center">
              <div class="text-bold f-14 q-mr-sm col-auto">Inventaris Kasa </div>
              <div class="q-mr-sm col-auto"><q-btn flat :icon="tampilKasa ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="tampilKasa = !tampilKasa" round dense /> </div>
            </div>
            <q-separator class="q-my-sm" size="1px" />
            <!-- Inventaris kasa -->
            <div v-if="tampilKasa">
              <div>
                <KasaTable />
              </div>

              <q-separator class="q-my-sm" size="1px" />
            </div>
            <div class="row justify-between items-center">
              <div class="text-bold f-14 q-mr-sm col-auto">Inventaris Instrumen </div>
              <div class="q-mr-sm col-auto"><q-btn flat :icon="tampilInst ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="tampilInst = !tampilInst" round dense /> </div>
            </div>
            <q-separator class="q-my-sm" size="1px" />
            <!-- Inventaris Instrumen -->
            <div v-if="tampilInst">
              <InstrumenTable />

              <q-separator class="q-my-sm" size="1px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { pathImg } from 'src/boot/axios'
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
import { defineAsyncComponent, onMounted, ref } from 'vue'


const Info = defineAsyncComponent(() => import('./InfoPasienPage.vue'))
const ImplatTable = defineAsyncComponent(() => import('./subComp/ImplantTable.vue'))
const KasaTable = defineAsyncComponent(() => import('./subComp/KasaTable.vue'))
const InstrumenTable = defineAsyncComponent(() => import('./subComp/InstrumenTable.vue'))
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const tampilImplant = ref(true)
const tampilKasa = ref(true)
const tampilInst = ref(true)
const store = useSurgicalSafetyStore()
function bisaSimpan () {
  return (store.implants?.length > 0) && store.implants?.every(item => item.flag != '4')
}

const getImg = (file) => {
  const spl = file.split('.')
  const ext = spl[spl?.length - 1]
  // console.log(ext)

  if (ext === 'pdf') {
    return new URL('../../../../../../../assets/images/PDF_file_icon.png', import.meta.url).href
  }
  else {
    return pathImg + file
  }
}
onMounted(() => {
  store.ambilMasterkasa()
  store.resetFormKasa()
  store.resetFormInstrumen()
})
</script>
