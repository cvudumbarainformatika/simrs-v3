<template>
  <q-dialog ref="refDialog" persistent :maximized="true" transition-show="slide-left" transition-hide="slide-right"
    @hide="emits('tutup')">
    <q-card square flat class="container-no-header">
      <q-layout view="lHr Lpr lFf" container class="shadow-2 rounded-borders z-top">
        <q-header elevated class="bg-primary">
          <HeaderLayout :pasien="pasien" @toggle-left-drawer="() => drawer = !drawer"
            @gantidpjp="(val) => store.gantiDpjp(val, pasien)" />
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
                <div v-if="pasien?.dokter === '' || pasien?.dokter === null"
                  class="column full-height flex-center absolute-center z-top full-width"
                  style="background-color: black; opacity: .9;">
                  <div class="text-white">
                    Maaf, DPJP Pasien Ini Belum Ada ... Harap Input DPJP Terlebih dahulu
                  </div>
                </div>
                <component v-else :is="menu.comp" :key="pasien" :pasien="pasien" :depo="pasien?.flagdepo" :store="store"
                  :loading-terima="store.loadingTerima" :user="user" />
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
import { defineAsyncComponent, onMounted, ref, shallowRef, computed } from 'vue'
import HeaderLayout from './layoutcomp/HeaderLayout.vue'
import LeftDrawer from './layoutcomp/LeftDrawer.vue'

import { useLaboratPoli } from 'src/stores/simrs/pelayanan/poli/laborat'
import { useRadiologiPoli } from 'src/stores/simrs/pelayanan/poli/radiologi'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { useAplikasiStore } from 'src/stores/app/aplikasi';

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


const auth = useAplikasiStore();

const user = computed(() => {
  return auth?.user?.pegawai
})

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
    name: 'AssesmentDokter',
    label: 'Assesment Dokter',
    icon: 'icon-mat-medical_information',
    route: ['poli'],
    nakes: ['1', '2', '3', '4', '5', '6'],
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/rehabmedik/layanan/asessment/IndexPage.vue')))
  },
  {
    name: 'AnamnesisPage',
    label: 'Anamnesis & Riwayat',
    icon: 'icon-mat-medical_information',
    nakes: ['1', '2', '3', '4', '5', '6'],
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/AnamnesisPage.vue')))
  },
  {
    name: 'PemeriksaanPage',
    label: 'Pemeriksaan Umum & Fisik',
    icon: 'icon-my-stethoscope',
    nakes: ['1', '2', '3', '4', '5', '6'],
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/PemeriksaanPageBaru.vue')))
  },
  {
    name: 'PengkajianPage',
    label: 'Pengkajian Rehab Medik',
    icon: 'icon-mat-medical_information',
    nakes: ['1', '2', '3', '4', '5', '6'],
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/pengkajian/comp/pengkajian/IndexPage.vue')))
  },
  {
    name: 'DiagnosaPage',
    label: 'Diagnosa & Tindakan',
    icon: 'icon-mat-medical_information',
    nakes: ['1', '2', '3', '4', '5', '6'],
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/diagnosadantindakan/IndexPage.vue')))
  },

  {
    name: 'e-resep-page',
    label: 'EResep',
    icon: 'icon-mat-receipt',
    nakes: ['1', '2', '3', '4', '5', '6'],
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/eresep/EresepPage.vue')))
  },
  {
    name: 'Penunjang',
    label: 'Penunjang',
    icon: 'icon-mat-post_add',
    nakes: ['1', '2', '3', '4', '5', '6'],
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
