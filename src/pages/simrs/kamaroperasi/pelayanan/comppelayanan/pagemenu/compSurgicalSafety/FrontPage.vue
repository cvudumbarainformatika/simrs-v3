<template>
  <div class="row fit relative-position">
    <div class="absolute-top columm fit q-pa-xs" style="padding-bottom: 41px;">
      <div class="col-auto">
        <q-tabs v-model="tab" dense no-caps inline-label narrow-indicator indicator-color="transparent" align="left"
          class=" bg-transparent text-grey-8" active-color="white" active-bg-color="dark">
          <q-tab v-for="tb in tabs" :key="tb.name" :ripple="true" :name="tb?.name" content-class="tab-classes">
            <template #default>
              <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">
                <q-icon :name="tb?.icon" size="16px" />
                <div class="f-14 text-bold">{{ tb?.label }}</div>
              </div>
            </template>
          </q-tab>
        </q-tabs>
      </div>
      <div class="col full-height">
        <q-tab-panels v-model="tab" animated class="bg-transparent q-pa-none relative-position"
          style="height: calc(100vh - 100px);">
          <!-- PANEL -->
          <q-tab-panel :name="menu?.name" class="q-pa-none">
            <component :is="menu?.comp" :pasien="pasien" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <!-- <div class="absolute-bottom bg-dark text-white">
        Footer
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
import { computed, defineAsyncComponent, onMounted, ref, shallowRef } from 'vue'

const auth = useAplikasiStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useSurgicalSafetyStore()
const tab = ref('signIn')

// const tabsxx = [
const tabs = ref([
  {
    label: 'Sign In',
    name: 'signIn',
    icon: 'login',
    comp: shallowRef(defineAsyncComponent(() => import('./comp/SignInPage.vue')))
  },
  {
    label: 'Time Out',
    name: 'timeOut',
    icon: 'timer_off',
    comp: shallowRef(defineAsyncComponent(() => import('./comp/TimeOutPage.vue')))
  },
  {
    label: 'Sign Out',
    name: 'signOut',
    icon: 'exit_to_app',
    // nakes: ['2', '3'],
    comp: shallowRef(defineAsyncComponent(() => import('./comp/SignOutPage.vue')))
  },
  {
    label: 'Implant',
    name: 'implant',
    icon: 'support',
    // nakes: ['2', '3'],
    comp: shallowRef(defineAsyncComponent(() => import('./comp/PemakaianImplantPage.vue')))
  },
])

const menu = computed(() => {
  const by = tab.value

  return tabs.value.find(i => i.name === by)
})

// const tabs = computed(() => {
//   return tabsxx.filter(i => i.nakes.includes(nakes.value))
// })
onMounted(() => {
  store.getNakes()
  store.pasien = props?.pasien
  store.setForm('noreg', props?.pasien?.noreg)
})

</script>

<style lang="scss" scoped>
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
