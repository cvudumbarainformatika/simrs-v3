<template>
  <q-dialog ref="refDialog" persistent :maximized="true" transition-show="slide-left" transition-hide="slide-right"
    @show="onShow" @hide="onHide">
    <q-card square flat class="container-no-header">
      <q-layout view="lHr Lpr lFf" container class="shadow-2 rounded-borders z-top">
        <q-header elevated class="bg-primary">
          <HeaderLayout :pasien="pasien" @toggle-left-drawer="() => drawer = !drawer"
            @update:jeniskasus="(val) => store.gantiJenisKasus(val, pasien)"
            @gantidpjp="(val) => store.gantiDpjp(val, pasien)" />
        </q-header>
        <!-- LEFT DRAWER ======================================================================================-->
        <q-drawer v-model="drawer" elevated bordered show-if-above :width="230" :breakpoint="400">
          <LeftDrawer :key="pasien?.noreg" :pasien="pasien" :menus="filterredMenus" :menu="menu"
            @click-menu="(val) => menuDiganti(val)" @history-pasien="historyPasien" @log-activity="logActivity" />
        </q-drawer>

        <!-- RIGHT DRAWER ======================================================================================-->
        <q-drawer v-model="drawerRight" side="right" show-if-above overlay bordered :width="845" :breakpoint="500">
          <RightDrawer :key="pasien?.noreg" :pasien="pasien" @close="drawerRight = false" />
        </q-drawer>

        <!-- LOG ACTIVITY DRAWER ===============================================================================-->
        <q-drawer v-model="drawerLog" side="right" show-if-above overlay bordered :width="drawerLogWidth" :breakpoint="500">
          <LogActivityDrawer :key="pasien?.noreg" :pasien="pasien" @close="drawerLog = false" />
        </q-drawer>

        <!-- CONTAINER ============================================================================================-->
        <q-page-container>
          <q-page class="contain bg-grey-3">

            <div class="fit" v-if="loading">
              <AppLoader />
            </div>
            <div v-else class="fit">
              <div v-if="pasien?.status === '1'"
                class="column full-height flex-center absolute-center z-top full-width scroll"
                style="background-color: black; opacity: .8;">
                <TerimaPasien :key="pasien" :pasien="pasien" :store="store" />
              </div>
              <div v-else-if="pasien?.dokter === '' || pasien?.dokter === null"
                class="column full-height flex-center absolute-center z-top full-width"
                style="background-color: black; opacity: .9;">
                <div class="text-white">
                  Maaf, DPJP Pasien Ini Belum Ada ... Harap Input DPJP Terlebih dahulu
                </div>
              </div>
              <div v-else-if="pasien?.kd_jeniskasus === '' || pasien?.kd_jeniskasus === null"
                class="column full-height flex-center absolute-center z-top full-width"
                style="background-color: black; opacity: .9;">
                <div class="text-white">
                  MAAF, HARAP TENTUKAN DAHULU JENIS KASUS PASIEN
                </div>
              </div>
              <component v-else :is="menu?.comp" :key="pasien?.noreg" :pasien="pasien" :kasus="store?.jnsKasusPasien"
                :nakes="nakes" depo="rnp" />
            </div>

          </q-page>
          <!-- <q-page v-else>
            <AppLoader />
          </q-page> -->
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { computed, defineAsyncComponent, onMounted, ref, shallowRef, watchEffect } from 'vue'

import { useAnamnesisRanapStore } from 'src/stores/simrs/ranap/anamnesis'
import useLayanan from './useLayanan'
import { useHistoryPasienRanapStore } from 'src/stores/simrs/ranap/history'


import TerimaPasien from './components/TerimaPasien.vue'
const HeaderLayout = defineAsyncComponent(() => import('./layoutcomp/HeaderLayout.vue'))
const LeftDrawer = defineAsyncComponent(() => import('./layoutcomp/LeftDrawer.vue'))
const RightDrawer = defineAsyncComponent(() => import('./layoutcomp/RightDrawer.vue'))
const LogActivityDrawer = defineAsyncComponent(() => import('./layoutcomp/LogActivityDrawer.vue'))
const AppLoader = defineAsyncComponent(() => import('src/components/~global/AppLoader.vue'))

const drawer = ref(false)
const drawerRight = ref(false)
const drawerLog = ref(false)
const drawerLogWidth = computed(() => {
  return window.innerWidth * 0.9
})

const anamnesis = useAnamnesisRanapStore()
const history = useHistoryPasienRanapStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const { filterredMenus, menu, store, nakes, menuDiganti } = useLayanan(props.pasien)

const emit = defineEmits(['layanan-closed'])

const onShow = () => {
  Promise.all([
    anamnesis.getRiwayatKehamilan(props.pasien),
    history.historyIgdBefore(props.pasien)
  ])
}

function onHide() {
  emit('layanan-closed')
}

function historyPasien() {
  drawerRight.value = !drawerRight.value
}

function logActivity() {
  drawerLog.value = !drawerLog.value
}
// function getIcare () {
//   store.getDataIcare(props.pasien).then(resp => {
//     if (resp) {
//       console.log('anu', resp?.response?.url)
//       window.open(resp?.response?.url, '_blank')
//     }
//   })
// }
</script>

<style lang="scss">
.contain {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  overflow: hidden;
}

.close-btn {
  width: 25px;
  // height: 64px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  position: absolute;
  right: 0;
  z-index: 100000;
  top: 50%;
  margin-top: -10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  .vertical-xxx {
    // writing-mode:tb-rl;
    // -webkit-transform:rotate(180deg);
    // -moz-transform:rotate(180deg);
    // -o-transform: rotate(180deg);
    // -ms-transform:rotate(180deg);
    // transform: rotate(180deg);
    // white-space:nowrap;
    writing-mode: vertical-lr;
    text-orientation: upright;
  }

}
</style>
