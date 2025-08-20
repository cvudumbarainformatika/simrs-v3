<template>
  <div>
    <div class="bg-primary text-white text-weight-bold f-18 q-pa-sm q-mb-xs">Halaman Penyesuaian</div>
    <div>
      <div class="row fit relative-position">
        <div class="absolute-top columm fit q-pa-xs" style="padding-bottom: 41px;">
          <div class="col-auto">
            <q-tabs v-model="tab" dense no-caps inline-label narrow-indicator indicator-color="transparent" align="left"
              class=" bg-transparent text-grey-8" active-color="white" active-bg-color="dark">
              <q-tab v-for="tb in tabs" :key="tb.name" :ripple="true" :name="tb?.name" content-class="tab-classes">
                <template #default>
                  <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">

                    <div><strong>{{ tb?.label }}</strong></div>
                  </div>
                </template>
              </q-tab>
            </q-tabs>
          </div>
          <div class="col full-height" style="min-height: 300px;">
            <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none relative-position fit">
              <!-- PANEL -->
              <q-tab-panel :name="menu?.name" class="q-pa-none">
                <component :is="menu?.comp" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'


const tabs = ref([
  { label: 'Penerimaan', name: 'penerimaan', comp: shallowRef(defineAsyncComponent(() => import('./comp/PenerimaanPage.vue'))) },
  { label: 'Konsinyasi', name: 'konsinyasi', comp: shallowRef(defineAsyncComponent(() => import('./comp/KonsinyasiPage.vue'))) },
  { label: 'Distribusi', name: 'distribusi', comp: shallowRef(defineAsyncComponent(() => import('./comp/DistribusiPage.vue'))) },
  { label: 'Obat Operasi', name: 'obatoperasi', comp: shallowRef(defineAsyncComponent(() => import('./comp/ObatOperasiPage.vue'))) },
  { label: 'E-Resep', name: 'eresep', comp: shallowRef(defineAsyncComponent(() => import('./comp/EResepPage.vue'))) },
  { label: 'Bast', name: 'bast', comp: shallowRef(defineAsyncComponent(() => import('./comp/BastPage.vue'))) },
  { label: 'Opname', name: 'opname', comp: shallowRef(defineAsyncComponent(() => import('./comp/StokOpnamePage.vue'))) },
  { label: 'Stok Sekarang', name: 'stok', comp: shallowRef(defineAsyncComponent(() => import('./comp/StokSekarang.vue'))) },
])
const tab = ref('penerimaan')

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
