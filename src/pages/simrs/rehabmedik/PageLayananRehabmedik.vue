<template>
  <q-dialog ref="refDialog" persistent :maximized="true" transition-show="slide-left" transition-hide="slide-right"
    @hide="emits('tutup')">
    <q-card square flat class="container-no-header">
      <q-layout view="lHr Lpr lFf" container class="shadow-2 rounded-borders z-top">
        <q-header elevated class="bg-primary">
          <HeaderLayout :pasien="pasien" @toggle-left-drawer="() => drawer = !drawer" />
        </q-header>
        <!-- LEFT DRAWER ======================================================================================-->
        <q-drawer v-model="drawer" elevated bordered show-if-above :width="230" :breakpoint="400">
          <LeftDrawer :key="pasien" :pasien="pasien" :menus="menus" :menu="menu"
            @click-menu="(val) => menuDiganti(val)" />
        </q-drawer>

        <!-- CONTAINER ============================================================================================-->
        <q-page-container>
          <q-page class="contain bg-grey-3">
            <Suspense :key="menu.comp" timeout="0">
              <template #default>
                <!-- <div
                  v-if="pasien?.dokter==='' || pasien?.dokter === null"
                  class="column full-height flex-center absolute-center z-top full-width"
                  style="background-color: black; opacity: .9;"
                >
                  <div class="text-white">
                    Maaf, DPJP Pasien Ini Belum Ada ... Harap Input DPJP Terlebih dahulu
                  </div>
                </div> -->
                <component :is="menu.comp" :key="pasien" :pasien="pasien" :depo="pasien?.flagdepo" :store="store"
                  :loading-terima="store.loadingTerima" />
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
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue'
import HeaderLayout from './layoutcomp/HeaderLayout.vue'
import LeftDrawer from './layoutcomp/LeftDrawer.vue'

import { useLaboratPoli } from 'src/stores/simrs/pelayanan/poli/laborat'
import { useRadiologiPoli } from 'src/stores/simrs/pelayanan/poli/radiologi'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'

const drawer = ref(false)
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  }
})

const lab = useLaboratPoli()
const radiologi = useRadiologiPoli()
const storeRanap = usePengunjungRanapStore()

onMounted(() => {
  console.log('pasien rehabmedik', props.pasien)
  // console.log('store rehabmedik', props.store)
  Promise.all([
    // penunjang

    lab?.getMasterLaborat(),
    radiologi?.getRadiologi(),
    radiologi?.getJenisRadiologi(),
    storeRanap.getNakes(),
    storeRanap.getNonNakes()
  ])
})

const emits = defineEmits(['tutup'])

const menus = ref([
  {
    name: 'AnamnesisPage',
    label: 'Anamnesis & Riwayat',
    icon: 'icon-mat-medical_information',
    route: ['poli'],
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/AnamnesisPage.vue')))
  },
  {
    name: 'PemeriksaanPage',
    label: 'Pemeriksaan Umum & Fisik',
    icon: 'icon-my-stethoscope',
    route: ['poli'],
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/PemeriksaanPageBaru.vue')))
  },
  {
    name: 'PengkajianPage',
    label: 'Pengkajian Rehab Medik',
    icon: 'icon-mat-medical_information',
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/pengkajian/comp/pengkajian/IndexPage.vue')))
  },
  {
    name: 'DiagnosaPage',
    label: 'Diagnosa & Tindakan',
    icon: 'icon-mat-medical_information',
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/diagnosadantindakan/IndexPage.vue')))
  },

  {
    name: 'e-resep-page',
    label: 'EResep',
    icon: 'icon-mat-receipt',
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/eresep/EresepPage.vue')))
  },
  {
    name: 'Penunjang',
    label: 'Penunjang',
    icon: 'icon-mat-post_add',
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/penunjang/IndexPage.vue')))
  },
])
const menu = ref(menus.value[0])

function menuDiganti(val) {
  menu.value = val
}
</script>

<style lang="scss">
.contain {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  overflow: hidden;
}
</style>
