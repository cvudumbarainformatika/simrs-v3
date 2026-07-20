<template>
  <div class="row fit relative-position">
    <div class="absolute-top columm fit q-pa-xs" style="padding-bottom: 41px;">
      
      <!-- Tab Headers -->
      <div class="col-auto">
        <q-tabs v-model="tab" dense no-caps inline-label narrow-indicator indicator-color="transparent" align="left"
          class="bg-transparent text-grey-8" active-color="white" active-bg-color="dark">
          <q-tab name="jatuh" :ripple="true">
            <template #default>
              <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">
                <q-icon name="icon-my-personal_injury" size="18px" />
                <div><strong>Asesmen Jatuh</strong></div>
              </div>
            </template>
          </q-tab>

          <q-tab name="nyeri" :ripple="true">
            <template #default>
              <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">
                <q-icon name="icon-my-monitor_heart" size="18px" />
                <div><strong>Asesmen Nyeri</strong></div>
              </div>
            </template>
          </q-tab>
        </q-tabs>
      </div>

      <!-- Tab Content Panels -->
      <div class="col full-height q-mt-xs">
        <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none relative-position fit">
          <q-tab-panel name="jatuh" class="q-pa-none">
            <TabAsesmenJatuh :pasien="pasien" :kasus="kasus" />
          </q-tab-panel>

          <q-tab-panel name="nyeri" class="q-pa-none">
            <TabAsesmenNyeri :pasien="pasien" :kasus="kasus" />
          </q-tab-panel>
        </q-tab-panels>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const TabAsesmenJatuh = defineAsyncComponent(() => import('./comp/TabAsesmenJatuh.vue'))
const TabAsesmenNyeri = defineAsyncComponent(() => import('./comp/TabAsesmenNyeri.vue'))

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
</script>

<style lang="scss" scoped>
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
