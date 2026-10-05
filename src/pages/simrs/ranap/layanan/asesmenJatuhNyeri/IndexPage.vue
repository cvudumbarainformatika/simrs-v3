<template>
  <div class="row fit relative-position">
    <div class="absolute-top column fit q-pa-xs" style="padding-bottom: 41px;">
      <div class="col-auto full-width">
        <div class="full-width">
          <q-tabs
            ref="tabsRef"
            v-model="tab"
            dense
            no-caps
            inline-label
            narrow-indicator
            indicator-color="transparent"
            align="left"
            class="bg-transparent text-grey-8 mytabs"
            active-color="white"
            active-bg-color="dark"
            :mobile-arrows="false"
            :outside-arrows="false"
          >
            <q-tab v-for="tb in tabs" :key="tb.name" :ripple="true" :name="tb.name" content-class="tab-classes">
              <template #default>
                <div class="row q-gutter-x-xs items-center q-px-sm no-wrap" style="border-radius: 10px;">
                  <q-icon :name="tb.icon" size="18px" />
                  <div><strong>{{ tb.label }}</strong></div>
                </div>
              </template>
            </q-tab>
          </q-tabs>
        </div>
      </div>
      <div class="col full-height">
        <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none relative-position fit">
          <q-tab-panel :name="menu?.name" class="q-pa-none">
            <component :is="menu?.comp" :pasien="pasien" :kasus="kasus" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const tab = ref('jatuh')
const tabsRef = ref(null)

const tabs = [
  {
    label: 'Asesmen Jatuh',
    name: 'jatuh',
    icon: 'icon-my-personal_injury',
    comp: defineAsyncComponent(() => import('./comp/TabAsesmenJatuh.vue'))
  },
  {
    label: 'Asesmen Nyeri',
    name: 'nyeri',
    icon: 'icon-my-monitor_heart',
    comp: defineAsyncComponent(() => import('./comp/TabAsesmenNyeri.vue'))
  },
  {
    label: 'Pasca Jatuh / Setelah Jatuh',
    name: 'pasca_jatuh',
    icon: 'icon-mat-warning',
    comp: defineAsyncComponent(() => import('./comp/TabPascaJatuh.vue'))
  },
  {
    label: 'Asesmen Penyakit Menular',
    name: 'penyakit_menular',
    icon: 'icon-mat-coronavirus',
    comp: defineAsyncComponent(() => import('./comp/TabAsesmenPenyakitMenular.vue'))
  },
  {
    label: 'Monitoring Restrain',
    name: 'monitoring_restrain',
    icon: 'icon-mat-lock_clock',
    comp: defineAsyncComponent(() => import('./comp/TabMonitoringRestrain.vue'))
  },
  {
    label: 'Indikasi Ruang Intensif',
    name: 'indikasi_intensif',
    icon: 'icon-mat-favorite',
    comp: defineAsyncComponent(() => import('./comp/TabIndikasiIntensif.vue'))
  }
]

const menu = computed(() => {
  return tabs.find(i => i.name === tab.value)
})

onMounted(() => {
  tabsRef.value?.$el?.classList?.remove('no-wrap')
})
</script>

<style lang="scss" scoped>
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
