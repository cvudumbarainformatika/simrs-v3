<template>
  <div class="column full-height q-ma-sm" style="overflow: hidden;">
    <div class="column full-height">
      <div class="col-auto bg-red">
        <q-tabs v-model="store.tab" no-caps inline-label class=" bg-grey-4 shadow-2 text-grey-8" align="left" dense
          active-color="yellow" active-bg-color="primary">
          <q-tab v-for="(item, i) in tabs" :key="i" :name="item" :label="item"
            style="border-top-left-radius: 100px;border-bottom-right-radius: 100px;width: 100%;" />
        </q-tabs>
      </div>
      <div class="col full-height" style="overflow: hidden;">
        <q-tab-panels v-model="store.tab" animated class="full-height">
          <q-tab-panel name="Pra Anastesi" class="full-height q-pa-none">
            <Suspense>
              <PraAnastesiPage :pasien="props.pasien" />
              <template #fallback>
                <div class="fit flex flex-center">
                  <q-spinner color="primary" size="2em" />
                </div>
              </template>
            </Suspense>
          </q-tab-panel>
          <q-tab-panel v-if="store.tab === 'Pra Bedah'" name="Pra Bedah" class="full-height q-pa-none">
            <Suspense>
              <PraBedah :key="props.pasien" :pasien="props.pasien" />
              <template #fallback>
                <q-spinner color="primary" size="2em" />
              </template>
            </Suspense>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>

import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useDiagnosaDokter } from 'src/stores/simrs/igd/diagnosadokter'
import { useasessmenbedahigdstore } from 'src/stores/simrs/igd/asessmenbedah.js'


const PraAnastesiPage = defineAsyncComponent(() => import('src/pages/simrs/igd/layanan/assesmentbedah/praanastesi/PraAnastesiPage.vue'))
const PraBedah = defineAsyncComponent(() => import('src/pages/simrs/kamaroperasi/pelayanan/comppelayanan/pagemenu/compAssasement/comp/PraBedahPage.vue'))
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useasessmenbedahigdstore()
const storetindakan = useDiagnosaDokter()
const tabs = ref(['Pra Anastesi', 'Pra Bedah'])

// const inacbg = useInacbgPoli()
onMounted(() => {
  store.tab = tabs.value[0]
  // console.log('tabs', store.tabs)
  // store.getNota(props.pasien)
  storetindakan.getNota(props.pasien)
  store.getTipeDiagnosa()
})

</script>
