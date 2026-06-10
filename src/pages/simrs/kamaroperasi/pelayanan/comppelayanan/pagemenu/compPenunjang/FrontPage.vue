<template>
  <div class="column full-height q-ma-sm" style="overflow: hidden;">
    <div class="column full-height">
      <div class="col-auto bg-red">
        <q-tabs v-model="tab" no-caps inline-label class="bg-primary text-white shadow-2" align="left" dense
          active-color="yellow" active-bg-color="dark" @update:model-value="cekPanel">
          <q-tab v-for="(item, i) in comp" :key="i" :name="item.name" :label="item.name" />
        </q-tabs>
      </div>
      <div class="col-grow bg-yellow">
        <q-tab-panels v-model="tab" animated class="full-height">
          <q-tab-panel v-for="(panel, n) in comp" :key="n" :name="panel.name" class="full-height q-pa-none">
            <!-- <q-tab-panel
            name="Laborat"
            class="full-height q-pa-none"
          > -->
            <component :is="cekPanel()" :key="props.pasien" :pasien="props.pasien" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { findWithAttr } from 'src/modules/utils'
import { useLaboratPoli } from 'src/stores/simrs/pelayanan/poli/laborat'
import { usePenunjangPoli } from 'src/stores/simrs/pelayanan/poli/penunjang'
// import PageLaborat from './comppenunjang/PageLaborat.vue'

import { defineAsyncComponent, onMounted, ref } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePenunjangPoli() // untuk tab
const lab = useLaboratPoli()
const tab = ref('Laborat')
const comp = [
  { name: 'Laborat', page: defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/PageLaborat.vue')) },
  // { name: 'Radiologi', page: defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/PageRadiologi.vue')) },
  // { name: 'Operasi', page: defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/PageOperasi.vue')) },
  // { name: 'Fisio', page: defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/PageFisio.vue')) },
  // { name: 'Diet', page: defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/PageDiet.vue')) },
  // { name: 'PenunjangLain', page: defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/PagePenunjangLain.vue')) }
]

// console.log('comp', comp)
const cekPanel = () => {
  const val = tab.value
  const ganti = val.replace(/ /g, '')
  const arr = comp.findIndex(x => x.name == ganti)
  return arr >= 0 ? comp[arr].page : ''
}

onMounted(() => {
  // console.log('coba');

  const isRanap = false
  lab.getMasterLaborat()
  lab.getNota(props.pasien, isRanap)
})
</script>
