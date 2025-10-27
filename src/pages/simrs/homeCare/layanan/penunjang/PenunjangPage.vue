<template>
  <div class="column full-height q-ma-sm" style="overflow: hidden;">
    <div class="column full-height">
      <div class="col-auto bg-red">
        <q-tabs v-model="tab" no-caps inline-label rounded class=" bg-grey-4 shadow-2 text-grey-8" align="left" dense
          active-color="yellow" active-bg-color="primary" @update:model-value="cekPanel">
          <q-tab v-for="(item, i) in tabs" :key="i" :name="item.nama" :label="item.nama"
            style="border-top-left-radius: 100px;border-bottom-right-radius: 100px;width: 100%;" />
        </q-tabs>
      </div>
      <div class="col-grow bg-yellow">
        <q-tab-panels v-model="tab" animated class="full-height">
          <q-tab-panel v-for="(panel, n) in tabs" :key="n" :name="panel.nama" class="full-height q-pa-none">
            <component :is="cekPanel()" :key="props.pasien" :pasien="props.pasien" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLaboratHomeCare } from 'src/stores/simrs/homeCare/laborat'
import { usePenunjangHomeCare } from 'src/stores/simrs/homeCare/penunjang'

import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePenunjangHomeCare() // untuk tab
const lab = useLaboratHomeCare()
const tab = ref('Laborat')
const tabs = ref([
  { nama: 'Laborat', page: shallowRef(defineAsyncComponent(() => import('./laborat/PageLaborat.vue'))) },
  { nama: 'Fisioterapi', page: shallowRef(defineAsyncComponent(() => import('./fisioterapi/PageFisio.vue'))) },
  // { nama: 'Radiologi', page: shallowRef(defineAsyncComponent(() => import('./radiologi/PageRadiologi.vue'))) },
  // { nama: 'Operasi', page: shallowRef(defineAsyncComponent(() => import('./ok/PageOperasi.vue'))) },
  // { nama: 'Jenazah', page: shallowRef(defineAsyncComponent(() => import('./jenazah/PageJenazah.vue'))) },
  // { nama: 'Ambulan', page: shallowRef(defineAsyncComponent(() => import('./ambulan/PageAmbulan.vue'))) },
  // { nama: 'BankDarah', page: shallowRef(defineAsyncComponent(() => import('./bankdarah/PageBankDarah.vue'))) },
  // { nama: 'PenunjangLain', page: shallowRef(defineAsyncComponent(() => import('./penunjanglain/PagePenunjangLain.vue'))) }
])

// console.log('comp', comp)
const cekPanel = () => {
  const val = tab.value
  const ganti = val.replace(/ /g, '')
  const arr = tabs.value.find(x => x.nama == ganti)
  // console.log('arr', arr)

  return arr ? arr?.page : ''
}

onMounted(() => {
  lab.getMasterLaborat()
  lab.getNota(props.pasien)
  lab.getNotaold(props.pasien)
  console.log('tabs', tabs.value)

})
</script>
