<template>
  <div class="row fit relative-position">
    <div class="absolute-top columm fit q-pa-xs" style="padding-bottom: 41px;">
      <div class="col-auto">
        <q-tabs v-model="tab" dense no-caps inline-label narrow-indicator indicator-color="transparent" align="left"
          class=" bg-transparent text-grey-8" active-color="white" active-bg-color="dark">
          <q-tab v-for="tb in tabs" :key="tb.name" :ripple="true" :name="tb?.name" content-class="tab-classes">
            <template #default>
              <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">
                <div class="f-14 text-bold">{{ tb?.label }}</div>
              </div>
            </template>
          </q-tab>
        </q-tabs>
      </div>
      <div class="col full-height">
        <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none relative-position"
          style="height: calc(100vh - 100px);">

          <q-tab-panel :name="menu?.name" class="q-pa-none">
            <component :is="menu?.comp" :pasien="pasien" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const tab = ref('praBedah')
const tabs = ref([
  {
    label: 'Pra Bedah',
    name: 'praBedah',
    comp: shallowRef(defineAsyncComponent(() => import('./comp/PraBedahPage.vue')))
  },
  {
    label: 'Pra Induksi',
    name: 'praInduksi',
    comp: shallowRef(defineAsyncComponent(() => import('./comp/PraInduksiPage.vue')))
  },
])

const menu = computed(() => {
  const by = tab.value
  return tabs.value.find(i => i.name === by)
})

</script>
<style lang="scss" scoped>
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
