<template>
  <q-tabs v-model="tab" dense no-caps inline-label narrow-indicator indicator-color="transparent" align="left"
    class=" bg-transparent text-grey-8" active-color="white" active-bg-color="dark">
    <q-tab v-for="tb in tabs" :key="tb.name" :ripple="true" :name="tb?.name" content-class="tab-classes">
      <template #default>
        <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">
          <q-icon :name="tb?.icon" size="18px" />
          <div><strong>{{ tb?.label }}</strong></div>
        </div>
      </template>
    </q-tab>
  </q-tabs>

  <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none relative-position fit"
    style=" height:calc( 100% - 80px);">
    <!-- PANEL -->
    <q-tab-panel :name="menu?.name" class="q-pa-none">
      <!-- <PemeriksaanUmumPage :pasien="props?.pasien" /> -->
      <component :is="menu?.comp" @buka="buka" />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup>
import { useReturDepoStore } from 'src/stores/simrs/farmasi/retur/depo/returdepo'
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'
const store = useReturDepoStore()
const tab = ref('retur')
const tabs = ref([
  {
    label: 'Permintaan Retur',
    name: 'permintaan',
    comp: shallowRef(defineAsyncComponent(() => import('./PermintaanPage.vue')))
  },
  {
    label: 'Halaman Retur',
    name: 'retur',
    comp: shallowRef(defineAsyncComponent(() => import('./ReturDepo.vue')))
  },
  {
    label: 'Halaman List Retur',
    name: 'list',
    comp: shallowRef(defineAsyncComponent(() => import('./ListReturPage.vue')))
  },
])
const menu = computed(() => {
  // console.log('tab.value', tab.value)
  const by = tab.value ?? null

  return tabs.value.find(i => i?.name === by)
})
function buka (val) {
  store.setParams('q', val?.noresep)
  store.setParams('flag', ['3', '4'])
  tab.value = 'retur'
  console.log('buka front', val)

}
</script>

<style lang="scss" scoped>
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
