<template>
  <q-dialog ref="refDialog" persistent :maximized="true" transition-show="slide-left" transition-hide="slide-right">
    <q-card square flat class="container-no-header">
      <q-layout view="lHr Lpr lFf" container class="shadow-2 rounded-borders z-top">
        <q-header elevated class="bg-primary">
          <HeaderLayout :pasien="pasien" @toggle-left-drawer="drawer = !drawer" />
        </q-header>

        <!-- LEFT DRAWER ======================================================================================-->
        <q-drawer v-model="drawer" elevated bordered show-if-above :width="230" :breakpoint="400">
          <LeftDrawer
            :key="pasien?.noreg"
            :pasien="pasien"
            :menus="menus"
            :menu="menu"
            @click-menu="(val) => menuDiganti(val)"
            @history-pasien="historyPasien"
          />
        </q-drawer>

        <!-- RIGHT DRAWER ======================================================================================-->
        <q-drawer v-model="drawerRight" side="right" show-if-above overlay bordered :width="845" :breakpoint="500">
          <RightDrawer :key="pasien?.noreg" :pasien="pasien" @close="drawerRight = false" />
        </q-drawer>

        <!-- CONTAINER ============================================================================================-->
        <q-page-container>
          <q-page class="contain bg-grey-3">
            <Suspense :key="menu.name" timeout="0">
              <template #default>
                <component
                  :is="menu.comp"
                  :key="pasien?.noreg"
                  :pasien="pasien"
                  :loadingaja="loadingaja"
                />
              </template>
              <template #fallback>
                <AppLoader />
              </template>
            </Suspense>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const HeaderLayout = defineAsyncComponent(() => import('./layoutcomp/HeaderLayout.vue'))
const LeftDrawer = defineAsyncComponent(() => import('./layoutcomp/LeftDrawer.vue'))
const RightDrawer = defineAsyncComponent(() => import('./layoutcomp/RightDrawer.vue'))

const drawer = ref(false)
const drawerRight = ref(false)

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingaja: {
    type: Boolean,
    default: false
  }
})

const menus = ref([
  {
    name: 'KlaimPage',
    label: 'Klaim',
    icon: 'icon-fa-file-invoice-solid',
    comp: shallowRef(defineAsyncComponent(() => import('./klaim/KlaimPage.vue')))
  },
  {
    name: 'BerkasPage',
    label: 'Berkas/Dokumen',
    icon: 'icon-fa-warehouse-solid',
    comp: shallowRef(defineAsyncComponent(() => import('./berkas/BerkasPage.vue')))
  }
])

const menu = ref(menus.value[0])

function menuDiganti(val) {
  menu.value = val
}

function historyPasien() {
  drawerRight.value = !drawerRight.value
}
</script>

<style lang="scss" scoped>
.contain {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  overflow: hidden;
}
</style>
