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
              <div class="text-bold f-14 q-mr-sm">Pemakaian Implant </div>
            </div>
            <q-separator class="q-my-sm" size="1px" />
            <div class="row items-end justify-end q-my-sm">
              <app-btn label="Ambil ulang data implant" @click="store.getImplants" :loading="store.loading"
                :disable="store.loading" />
            </div>
            <div v-if="store.implants?.length" class="bg-white">
              <div class="row">
                <ImplatTable />
              </div>
              <div class="row items-end justify-end q-my-sm">
                <app-btn label="Simpan Implant" @click="store.simpanImplants" :loading="store.loading"
                  :disable="store.loading || bisaSimpan()" />
              </div>
            </div>
            <div v-else>
              <app-no-data text="Data Implant belum ada" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
import { defineAsyncComponent, onMounted } from 'vue'


const Info = defineAsyncComponent(() => import('./InfoPasienPage.vue'))
const ImplatTable = defineAsyncComponent(() => import('./subComp/ImplantTable.vue'))
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useSurgicalSafetyStore()
function bisaSimpan () {
  return (store.implants?.length > 0) && store.implants?.every(item => item.flag != '4')
}
// onMounted(() => {
//   store.getImplants()
// })
</script>
