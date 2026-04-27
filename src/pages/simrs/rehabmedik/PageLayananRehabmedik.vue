<template>
  <q-dialog ref="refDialog" persistent :maximized="true" transition-show="slide-left" transition-hide="slide-right"
    @hide="emits('tutup')">
    <q-card square flat class="container-no-header">
      <q-layout view="lHr Lpr lFf" container class="shadow-2 rounded-borders z-top">
        <q-header elevated class="bg-primary">
          <HeaderLayout :pasien="pasien" :open-rehab-info="openRehabInfo" @toggle-left-drawer="() => drawer = !drawer"
            @gantidpjp="(val) => store.gantiDpjp(val, pasien)" @toggle-rehab-info="openRehabInfo = !openRehabInfo" />
        </q-header>
        <!-- LEFT DRAWER ======================================================================================-->
        <q-drawer v-model="drawer" elevated bordered show-if-above :width="230" :breakpoint="400">
          <LeftDrawer :key="pasien" :pasien="pasien" :menus="filterredMenus" :menu="menu"
            @click-menu="(val) => menuDiganti(val)" @history-pasien="historyPasien" @icare="getIcare" />
        </q-drawer>

        <!-- RIGHT DRAWER ======================================================================================-->
        <q-drawer v-model="drawerRight" side="right" show-if-above overlay bordered :width="845" :breakpoint="500">
          <RightDrawer :key="pasien" :pasien="pasien" @close="drawerRight = false" />
        </q-drawer>

        <!-- CONTAINER ============================================================================================-->
        <q-page-container>
          <q-page class="contain bg-grey-3">
            <!-- REHAB INFO AREA (OVERLAY - BISA DI-TOGGLE) -->
            <q-slide-transition>
              <div v-if="openRehabInfo" class="absolute-top full-height z-top bg-blur shadow-2">
                <div class="row full-height flex-center q-pa-lg">
                  <q-card class="rehab-card shadow-24 overflow-hidden">
                    <q-toolbar class="bg-primary text-white">
                      <q-icon name="icon-mat-medical_services" size="sm" class="q-mr-sm" />
                      <q-toolbar-title class="f-14 text-weight-bold">
                        Rangkaian Perawatan Rehabilitasi Medik
                      </q-toolbar-title>
                      <q-btn icon="icon-mat-close" flat round dense @click="openRehabInfo = false" />
                    </q-toolbar>

                    <q-card-section class="q-pa-md bg-grey-2">
                      <div class="row q-col-gutter-md">
                        <!-- STATS -->
                        <div class="col-md-4 col-sm-12">
                          <q-card flat bordered class="full-height bg-white">
                            <q-card-section class="column flex-center text-center">
                              <div class="text-caption text-grey-7 q-mb-sm">Status Rangkaian Perawatan</div>
                              <q-badge color="primary" label="Dalam Proses" class="q-mb-md" />
                              <div class="text-h2 text-weight-bolder text-primary">
                                {{ pasien?.kunjungan_rehab?.length ?? 0 }}
                              </div>
                              <div class="text-subtitle2 text-grey-9">Kunjungan Terhitung</div>
                            </q-card-section>
                          </q-card>
                        </div>

                        <!-- ACTIONS -->
                        <div class="col-md-8 col-sm-12 column justify-center">
                          <div class="text-subtitle1 text-weight-bold q-mb-xs">Kelola Rangkaian</div>
                          <div class="text-caption text-grey-8 q-mb-sm">
                            Informasi mengenai kunjungan pasien dalam rangkaian rehabilitasi ini.
                          </div>
                          <div class="row q-gutter-sm">
                            <q-btn flat color="negative" label="Selesaikan Rangkaian Perawatan Ini"
                              icon="icon-mat-done_all" class="text-underline" dense :loading="loadingSelesaiRehab"
                              @click="confirmSelesaikanRehab" />
                          </div>
                        </div>
                      </div>
                    </q-card-section>

                    <q-separator />

                    <!-- HISTORY LIST -->
                    <q-card-section class="q-pa-none">
                      <div class="q-pa-md text-weight-bold text-grey-8 bg-white border-bottom">
                        <q-icon name="icon-mat-history" class="q-mr-xs" />
                        Detail Riwayat Kunjungan dalam Rangkaian Ini
                      </div>
                      <q-scroll-area style="height: 350px;" class="bg-grey-1">
                        <div v-if="!pasien?.kunjungan_rehab?.length" class="column flex-center full-height text-grey-5">
                          <q-icon name="icon-mat-history_edu" size="xl" />
                          <div>Belum ada data kunjungan tercatat</div>
                        </div>
                        <q-list separator v-else class="bg-white">
                          <q-item v-for="(item, index) in pasien.kunjungan_rehab" :key="index">
                            <q-item-section avatar>
                              <q-avatar color="primary" text-white size="sm">
                                {{ index + 1 }}
                              </q-avatar>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label class="text-weight-bold">Kunjungan ke-{{ index + 1 }}</q-item-label>
                              <q-item-label caption>No. Reg: {{ item.noreg }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label class="text-primary text-weight-bold">
                                {{ item.tgl_kunjungan ? date.formatDate(item.tgl_kunjungan, 'DD MMMM YYYY') : '-' }}
                              </q-item-label>
                              <q-item-label caption>
                                {{ item.tgl_kunjungan ? date.formatDate(item.tgl_kunjungan, 'HH:mm') : '' }} WIB
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-scroll-area>
                    </q-card-section>

                    <q-card-actions align="right" class="bg-grey-2 q-pa-sm">
                      <q-btn flat label="Tutup Dashboard" color="primary" @click="openRehabInfo = false" />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </q-slide-transition>

            <!-- MAIN CONTENT AREA -->
            <Suspense :key="menu.comp" timeout="0">
              <template #default>
                <!-- CASE 1: NO DOCTOR (DPJP) -->
                <div v-if="pasien?.dokter === '' || pasien?.dokter === null"
                  class="column full-height flex-center absolute-center z-top full-width bg-black-opacity">
                  <q-card class="q-pa-lg text-center bg-white" style="border-radius: 15px;">
                    <q-icon name="icon-mat-warning" color="negative" size="80px" />
                    <div class="text-h6 q-mt-md">DPJP Belum Ada</div>
                    <div class="text-grey-7 q-mb-md">Harap Input DPJP Terlebih dahulu sebelum melanjutkan.</div>
                    <q-btn label="Tutup Halaman" color="primary" unelevated @click="emits('tutup')" />
                  </q-card>
                </div>

                <!-- CASE 2: NO REHAB SEQUENCE (MANDATORY CHECK) -->
                <div v-else-if="!pasien?.kunjungan_rehab?.length"
                  class="column full-height flex-center absolute-center z-top full-width bg-grey-3">
                  <q-card class="q-pa-xl shadow-10" style="width: 90%; max-width: 600px; border-radius: 20px;">
                    <div class="text-center q-mb-lg">
                      <q-icon name="icon-mat-medical_information" size="80px" color="primary" />
                      <div class="text-h5 text-weight-bold q-mt-md">Rangkaian Perawatan</div>
                      <div class="text-grey-7 q-mt-sm">
                        {{ props.store.riwayats?.length
                          ? `Ditemukan riwayat rangkaian aktif. Silakan pilih atau buat rangkaian baru.`
                          : `Klik tombol di bawah untuk mengecek apakah pasien ini memiliki riwayat rangkaian perawatan
                        yang masih aktif dalam database.` }}
                      </div>
                    </div>

                    <!-- LOADING STATE -->
                    <div v-if="loadingMulaiRehab" class="column flex-center q-pa-md">
                      <q-spinner-dots color="primary" size="40px" />
                      <div class="text-caption q-mt-sm">Mengecek Database...</div>
                    </div>

                    <!-- RESULT LIST FROM DATABASE -->
                    <div v-else-if="props.store.riwayats?.length" class="q-mb-md">
                      <div class="text-caption text-weight-bold q-mb-xs text-primary">RIWAYAT RANGKAIAN AKTIF:</div>
                      <q-list bordered separator class="rounded-borders bg-white shadow-1">
                        <q-item v-for="(item, index) in props.store.riwayats" :key="index">
                          <q-item-section>
                            <q-item-label class="text-weight-bold">Rangkaian # {{ item?.no }}</q-item-label>
                            <q-item-label caption>No. Reg: {{ item?.noreg }}</q-item-label>
                            <q-item-label caption>Mulai: {{ date?.formatDate(item?.created_at, 'DD MMMM YYYY')
                              }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-btn label="Hubungkan" color="primary" size="sm" unelevated
                              :loading="loadingPilih === item.id" @click="pilihRangkaian(item)" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <!-- ACTION BUTTONS -->
                    <div :key="props.pasien?.noreg" class="column q-gutter-sm justify-center q-mt-md">
                      <q-btn v-if="!props.store.riwayats?.length" unelevated color="primary" icon="icon-mat-search"
                        label="Cek Riwayat Rangkaian" class="full-width q-py-sm" :loading="loadingMulaiRehab"
                        @click="mulaiRehab" />
                      <q-btn v-if="props.store.riwayats !== null" outline color="primary" icon="icon-mat-add"
                        label="Mulai Sebagai Rehab Baru" class="full-width q-py-sm" :loading="loadingPilih === 'baru'"
                        @click="pilihRangkaian('baru')" />
                    </div>
                  </q-card>
                </div>

                <!-- CASE 3: NORMAL UI -->
                <component v-else :is="menu.comp" :key="pasien" :pasien="pasien" :depo="pasien?.flagdepo" :store="store"
                  :loading-terima="store.loadingTerima" :user="user" v-bind="menu.props" />
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
import RightDrawer from 'src/pages/simrs/poli/tindakan/complayout/RightDrawer.vue'

import { useLaboratPoli } from 'src/stores/simrs/pelayanan/poli/laborat'
import { useRadiologiPoli } from 'src/stores/simrs/pelayanan/poli/radiologi'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { useRoute } from 'vue-router'
import { useQuasar, date } from 'quasar'
import { usePengunjungPoliStore } from 'src/stores/simrs/pelayanan/poli/pengunjung'

const $q = useQuasar()
const drawer = ref(false)
const drawerRight = ref(false)
const openRehabInfo = ref(false)
const loadingSelesaiRehab = ref(false)
const loadingMulaiRehab = ref(false)
const loadingPilih = ref(null)
const storePoli = usePengunjungPoliStore()
// const props.store.riwayats = ref([])

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

const route = useRoute()
const lab = useLaboratPoli()
const radiologi = useRadiologiPoli()
const storeRanap = usePengunjungRanapStore()


const auth = useAplikasiStore();

const user = computed(() => {
  // console.log('auth', auth?.user?.pegawai);
  return auth?.user?.pegawai
})


const nakes = computed(() => {
  return auth?.user?.pegawai?.kdgroupnakes
})

function historyPasien() {
  drawerRight.value = !drawerRight.value
}

function getIcare() {
  storePoli.getDataIcare(props.pasien).then(resp => {
    if (resp) {
      console.log('anu', resp?.response?.url)
      window.open(resp?.response?.url, '_blank')
    }
  })
}

onMounted(() => {
  // console.log('pasien rehabmedik', props.pasien)
  // console.log('store rehabmedik', props.store)
  props.store.riwayats = null
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
    icon: 'icon-my-stethoscope',
    route: ['poli'],
    nakes: ['1', '2', '3', '4', '5', '6', null],
    props: { isDokter: true },
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/rehabmedik/layanan/asessment/IndexPage.vue')))
  },
  {
    name: 'AssesmentFisioterapis',
    label: 'Assesment Fisioterapis',
    icon: 'icon-mat-app_registration',
    route: ['poli'],
    nakes: ['1', '2', '3', '4', '5', '6', null],
    props: { isDokter: false },
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/rehabmedik/layanan/asessment/IndexPage.vue')))
  },
  // {
  //   name: 'AnamnesisPage',
  //   label: 'Anamnesis & Riwayat',
  //   icon: 'icon-mat-medical_information',
  //   nakes: ['1', '2', '3', '4', '5', '6'],
  //   comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/AnamnesisPage.vue')))
  // },
  // {
  //   name: 'PemeriksaanPage',
  //   label: 'Pemeriksaan Umum & Fisik',
  //   icon: 'icon-my-stethoscope',
  //   nakes: ['1', '2', '3', '4', '5', '6'],
  //   comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/PemeriksaanPageBaru.vue')))
  // },
  // {
  //   name: 'PengkajianPage',
  //   label: 'Pengkajian Rehab Medik',
  //   icon: 'icon-mat-medical_information',
  //   nakes: ['1', '2', '3', '4', '5', '6'],
  //   comp: shallowRef(defineAsyncComponent(() => import('./layanan/pengkajian/comp/pengkajian/IndexPage.vue')))
  // },
  {
    name: 'DiagnosaPage',
    label: 'Diagnosa & Tindakan',
    icon: 'icon-mat-medical_information',
    nakes: ['1', '2', '3', '4', '5', '6', null],
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/diagnosadantindakan/IndexPage.vue')))
  },

  {
    name: 'e-resep-page',
    label: 'EResep',
    icon: 'icon-mat-receipt',
    nakes: ['1', '2', '3', '4', '5', '6', null],
    comp: shallowRef(defineAsyncComponent(() => import('src/pages/simrs/eresep/EresepPage.vue')))
  },
  {
    name: 'Penunjang',
    label: 'Penunjang',
    icon: 'icon-mat-post_add',
    nakes: ['1', null],
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/penunjang/IndexPage.vue')))
  },
  {
    name: 'Plann',
    label: 'Plann',
    icon: 'icon-mat-app_registration',
    nakes: ['1', '2', '3', '4', '5', '6', null],
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/plann/IndexPage.vue')))
  },
  {
    name: 'Dokumen',
    label: 'Dokumen',
    icon: 'icon-mat-receipt',
    nakes: ['1', '2', '3', '4', '5', '6', null],
    comp: shallowRef(defineAsyncComponent(() => import('./layanan/dokumen/IndexPage.vue')))
  },
])

const filterredMenus = computed(() => {
  const link = route?.path
  const docOnly = ['mpp', 'rekammedik']
  const pathSegments = link.split('/').filter(Boolean)
  // console.log('pathSegments', pathSegments);


  // const mpp = route.matched?.map(a => a.path)?.includes('/mpp') ?? false
  const mpp = docOnly.some(menu => pathSegments.includes(menu))
  // console.log('pathSegments', pathSegments, mpp, docOnly.some(menu => pathSegments.includes(menu)))
  if (!mpp) {
    const byPass = ['sa']
    const user = auth?.user?.username
    if (byPass.includes(user)) {
      return menus.value.filter(menu => menu?.mpp !== true)
    }
    return menus.value.filter(menu => menu.nakes.includes(nakes.value) && menu?.mpp !== true)
  }
  else {

    return menus.value.filter(menu => menu.nakes.some(r => pathSegments.includes(r)))
  }
})
const menu = ref(filterredMenus.value[0])

function menuDiganti(val) {
  menu.value = val
}

function confirmSelesaikanRehab() {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah Anda yakin ingin menyelesaikan rangkaian rehabilitasi medik pasien ini? Setelah diselesaikan, kedatangan berikutnya akan dihitung sebagai rangkaian baru.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    selesaikanRehab()
  })
}

async function selesaikanRehab() {
  loadingSelesaiRehab.value = true
  try {
    const resp = await props.store.selesaikanRehab(props.pasien)
    if (resp) {
      openRehabInfo.value = false
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingSelesaiRehab.value = false
  }
}

async function mulaiRehab() {
  loadingMulaiRehab.value = true
  try {
    const resp = await props.store.mulaiRehab(props.pasien)
    if (resp.status === 200) {
      // props.store.riwayats = resp.data?.result ?? []
      // console.log('riwayats', props.store.riwayats);

      if (!props.store.riwayats?.length) {
        $q.notify({
          message: 'Tidak ditemukan riwayat rangkaian aktif.',
          color: 'info',
          position: 'top-right'
        })
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingMulaiRehab.value = false
  }
}

async function pilihRangkaian(item) {
  console.log('item', item);

  const isBaru = item === 'baru'
  loadingPilih.value = isBaru ? 'baru' : item.id

  const payload = isBaru ? { mode: 'baru' } : { mode: 'link', linked_id: item.id, link_noreg: item.noreg }

  try {
    const resp = await props.store.pilihRangkaian(props.pasien, payload)
    if (resp.status === 200) {

      $q.notify({
        color: 'positive',
        message: isBaru ? 'Berhasil memulai rangkaian rehab baru' : 'Berhasil menghubungkan ke rangkaian sebelumnya',
        icon: 'check'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingPilih.value = null
  }
}
</script>

<style lang="scss">
.contain {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  overflow: hidden;
}

.bg-blur {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.85);
}

.rehab-card {
  width: 90%;
  max-width: 800px;
  border-radius: 12px;
}

.border-bottom {
  border-bottom: 1px solid #ddd;
}

.text-underline {
  text-decoration: underline;
}
</style>
