<template>
  <q-dialog ref="refDialog" persistent :maximized="true" transition-show="slide-left" transition-hide="slide-right">
    <q-card square flat class="container-no-header">
      <q-layout view="lHr Lpr lFf" container class="shadow-2 rounded-borders z-top">
        <q-header elevated class="bg-primary">
          <HeaderLayout :pasien="pasien" :loading-save-dpjp="store.loadingSaveGantiDpjp" :loading-finish="store.loading"
            @toggle-left-drawer="() => drawer = !drawer" @gantidpjp="(val) => store.gantiDpjp(val, pasien)"
            @layanan-selesai="store.setLayananSelesai(pasien)" />
        </q-header>

        <!-- LEFT DRAWER ======================================================================================-->
        <q-drawer v-model="drawer" elevated bordered show-if-above :width="230" :breakpoint="400">
          <LeftDrawer :key="pasien" :pasien="pasien" :menus="menus" :menu="menu" @click-menu="(val) => menuDiganti(val)"
            @icare="getIcare" @history-pasien="historyPasien" />
        </q-drawer>

        <!-- RIGHT DRAWER ======================================================================================-->
        <q-drawer v-model="drawerRight" side="right" show-if-above overlay bordered :width="845" :breakpoint="500">
          <RightDrawer :key="pasien" :pasien="pasien" @close="drawerRight = false" />
        </q-drawer>

        <!-- CONTAINER ============================================================================================-->
        <q-page-container>
          <q-page class="contain bg-grey-3">
            <Suspense :key="menu.comp" timeout="0">
              <template #default>
                <component :is="menu.comp" :key="pasien" :pasien="pasien" :loadingaja="loadingaja"
                  :ruangranap="store.ruangranaps" depo="igd" />
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
import { defineAsyncComponent, onMounted, ref, shallowRef, watchEffect } from 'vue'
import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung'
import { useInacbgIgd } from 'src/stores/simrs/igd/inacbg'
import { usePemakaianObatStore } from 'src/stores/simrs/igd/pemakaianobat'
const store = usePengunjungIgdStore()
const storepemakaianobat = usePemakaianObatStore()

const HeaderLayout = defineAsyncComponent(() => import('./layoutcomp/HeaderLayout.vue'))
const LeftDrawer = defineAsyncComponent(() => import('./layoutcomp/LeftDrawer.vue'))
// const RightDrawer = defineAsyncComponent(() => import('./layoutcomp/RightDrawer.vue'))
const RightDrawer = defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/complayout/RightDrawer.vue'))

const drawer = ref(false)
const drawerRight = ref(false)

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingaja: {
    type: Boolean,
    default: false
  }
})

// defineProps({
//   pasien: {
//     type: Object,
//     default: null
//   },
//   loadingaja: {
//     type: Boolean,
//     default: false
//   }
// })

const menus = ref([
  {
    name: 'TriagePage',
    label: 'Triage',
    icon: 'icon-fa-warehouse-solid',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/triage/TriagePage.vue')))
  },
  {
    name: 'AnamnesisPage',
    label: 'Anamnesis',
    icon: 'icon-mat-medical_information',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/anamnesis/AnamnesisPage.vue')))
  },
  {
    name: 'PemeriksaanFisikPage',
    label: 'Pemeriksaan Umum & Fisik',
    icon: 'icon-my-stethoscope',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/pemeriksaanfisik/PemeriksaanfisikPage.vue')))
  },
  {
    name: 'AssesmentPage',
    label: 'Assesment',
    icon: 'icon-mat-analytics',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/assesment/AssesmentPage.vue')))
  },
  {
    name: 'penunjang-page',
    label: 'Penunjang',
    icon: 'icon-my-local_hospital',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/penunjang/PenunjangPage.vue')))
  },
  {
    name: 'konsulspesialis',
    label: 'Konsul Spesialis',
    icon: 'icon-mat-textsms',
    nakes: ['1'],
    comp: shallowRef(defineAsyncComponent(() => import('./konsul/IndexPage.vue')))
  },
  {
    name: 'tinjauanulang',
    label: 'Tinjauan Ulang',
    icon: 'icon-mat-transfer_within_a_station',
    nakes: ['1'],
    comp: shallowRef(defineAsyncComponent(() => import('./tinjauanulang/IndexPage.vue')))
  },
  {
    name: 'plann-page',
    label: 'Plan',
    icon: 'icon-mat-next_plan',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/plann/IndexPage.vue')))
  },
  {
    name: 'pemakaianobat-page',
    label: 'Pemaikaian Obat/Cairan',
    icon: 'icon-fa-mortar-pestle-solid',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/pemakaianobat/PemakaianObatPage.vue')))
  },
  {
    name: 'e-resep-page',
    label: 'EResep',
    icon: 'icon-mat-receipt',
    comp: shallowRef(defineAsyncComponent(() => import('../../eresep/EresepPage.vue')))
  },
  {
    name: 'upload-dokomen',
    label: 'Upload Dokumen',
    icon: 'icon-fa-folder-tree-solid',
    comp: shallowRef(defineAsyncComponent(() => import('../layanan/uploaddokumen/IndexPage.vue')))
  },
  {
    name: 'e-dokumen-page',
    label: 'Dokumen RM & Billing',
    icon: 'icon-mat-print',
    comp: shallowRef(defineAsyncComponent(() => import('../../igd/layanan/dokumen/DokumenPage.vue')))
  }
])
const menu = ref(menus.value[0])

const inacbg = useInacbgIgd()

function menuDiganti(val) {
  menu.value = val
}

function historyPasien() {
  drawerRight.value = !drawerRight.value
}

function getIcare() {
  store.getDataIcare(props.pasien).then(resp => {
    if (resp) {
      window.open(resp?.response?.url, '_blank')
    }
  })
}

onMounted(() => {
  store.getruangranap()
  store.getsistembayar()
  store.getsistembayarrinci()
  storepemakaianobat.carisatuan()
})

watchEffect(() => {
  // console.log('watch effect', store.loadingTerima)
  if (store.loadingTerima === false) {
    inacbg.getDataIna(props.pasien)
    inacbg.setTotalTindakan(props.pasien)
    inacbg.setTotalLaborat(props.pasien)
  }
})

</script>
<style lang="scss">
.contain {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  overflow: hidden;
}
</style>
