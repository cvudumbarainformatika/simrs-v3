<template>
  <div class="fit q-pa-xs">
    <q-splitter v-model="splitterModel" :limits="[0, 100]" before-class="overflow-hidden" after-class="overflow-hidden"
      class="fit">
      <template #before>
        <div class="column full-height bg-white scroll">
          <FormPage :pasien="pasien" :menu="menu" :store="store" />
        </div>
      </template>

      <template #after>
        <div class="column full-height">
          <div v-if="!store.items?.length" class="column full-height flex-center">
            <div>Belum Ada Data</div>
          </div>
          <div v-else class="full-height scroll">
            <LisComp :items="store.items" :pasien="pasien" :store="store" />
          </div>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted } from 'vue'
import { useKontrolRanapStore } from 'src/stores/simrs/ranap/kontrol'

const FormPage = defineAsyncComponent(() => {
  return import('./compVclaim/FormPage.vue')
})

const LisComp = defineAsyncComponent(() => {
  return import('./compVclaim/ListComp.vue')
})

const store = useKontrolRanapStore()

const splitterModel = ref(60)

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  }
})

onMounted(() => {
  store.initReset()
  store.getData(props?.pasien?.noreg)
  // store.getDataBpjs()
})
</script>
