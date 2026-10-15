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
          <RightDrawer :key="`${pasien?.noreg}-${drawerRight}`" :pasien="pasien" @close="drawerRight = false" />
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
            <div v-else class="fit relative-position">
              <div class="fit" :class="{ 'layanan-locked-container': isReadOnlyUser }" ref="contentContainerRef">
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
                  :nakes="nakes" depo="rnp" :is-locked="isReadOnlyUser" />
              </div>

              <!-- Floating Notification Pojok Kanan Bawah (Sementara & Bisa Di-close) -->
              <transition name="fade-notif">
                <div
                  v-if="showReadOnlyNotif"
                  class="floating-read-only-notif shadow-5 q-pa-sm rounded-borders no-print"
                >
                  <div class="row items-center no-wrap q-gutter-x-sm">
                    <q-avatar size="32px" color="amber-2" text-color="dark" icon="lock" />
                    <div class="column">
                      <div class="text-weight-bold text-negative f-12">
                        MODE HANYA LIHAT (READ-ONLY)
                      </div>
                      <div class="text-caption text-grey-8 f-11" style="max-width: 320px; line-height: 1.2;">
                        <span v-if="isSa">
                          Akun Programmer (SA). Mode simpan default MATI. Aktifkan switch di header kanan jika ingin simpan.
                        </span>
                        <span v-else-if="isMppRoute">
                          Akses MPP (Manajer Pelayanan Pasien). Seluruh menu klinis ranap dalam mode Hanya Lihat (Read-Only), kecuali FORM MPP.
                        </span>
                        <span v-else-if="isRekamMedikRoute">
                          Akses Rekam Medis. Seluruh berkas rekam medis ranap dalam mode Hanya Lihat (Read-Only).
                        </span>
                        <span v-else>
                          Akun bukan Tenaga Kesehatan 1-6. Tombol simpan, ubah, dan hapus dinonaktifkan.
                        </span>
                      </div>
                    </div>
                    <q-btn flat round dense size="sm" icon="close" color="grey-7" @click="showReadOnlyNotif = false">
                      <q-tooltip class="bg-dark text-white">Tutup Notifikasi</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </transition>
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
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch, watchEffect } from 'vue'

import { useAnamnesisRanapStore } from 'src/stores/simrs/ranap/anamnesis'
import useLayanan from './useLayanan'
import { useHistoryPasienRanapStore } from 'src/stores/simrs/ranap/history'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
const auth = useAplikasiStore()


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

const { filterredMenus, menu, store, nakes, isNakesValid, isMppRoute, isRekamMedikRoute, menuDiganti } = useLayanan(props.pasien)

const isSa = computed(() => auth?.user?.username === 'sa')

const isMppForm = computed(() => {
  return menu.value?.name === 'mpp-page' || menu.value?.mpp === true || menu.value?.name === 'mpp'
})

const isReadOnlyUser = computed(() => {
  // 1. Khusus user 'sa' (Programmer): default hanya lihat, kecuali mode simpan diaktifkan
  if (isSa.value) {
    return !store.saEditMode
  }

  // 2. Khusus di rute MPP:
  // Petugas MPP di DB kdgroupnakes = '2' (perawat), tapi di ranap hanya bisa lihat (Read-Only)
  // TERKECUALI Form Mereka sendiri (FORM MPP) mereka bisa simpan!
  if (isMppRoute.value) {
    if (isMppForm.value) {
      return false // BISA SIMPAN DI FORM MPP!
    }
    return true // READ-ONLY untuk menu ranap lainnya
  }

  // 3. Khusus di rute Rekam Medik:
  if (isRekamMedikRoute.value) {
    return true // READ-ONLY untuk seluruh rekam medis ranap
  }

  // 4. User reguler ranap: hanya nakes 1..6 yang bisa simpan/edit
  return !isNakesValid.value
})

provide('isReadOnlyRanap', isReadOnlyUser)

const contentContainerRef = ref(null)
let lockObserver = null

const showReadOnlyNotif = ref(false)
let readOnlyNotifTimer = null

function triggerReadOnlyNotif() {
  if (!isReadOnlyUser.value) {
    showReadOnlyNotif.value = false
    return
  }
  showReadOnlyNotif.value = true
  if (readOnlyNotifTimer) clearTimeout(readOnlyNotifTimer)
  // Otomatis hilang sendiri setelah 5 detik
  readOnlyNotifTimer = setTimeout(() => {
    showReadOnlyNotif.value = false
  }, 5000)
}

function applyLockToElements(container) {
  if (!container || !isReadOnlyUser.value) return

  const btns = container.querySelectorAll('button, .q-btn')
  btns.forEach(btn => {
    // Pengecualian: tombol tab, pagination, close, atau print
    if (
      btn.classList.contains('q-tab') ||
      btn.closest('.q-tabs') ||
      btn.closest('.q-pagination') ||
      btn.classList.contains('close-btn') ||
      btn.querySelector('.icon-mat-print') ||
      btn.classList.contains('btn-print')
    ) {
      return
    }

    const isSubmit = btn.getAttribute('type') === 'submit'
    const hasSaveIcon = btn.querySelector('.icon-mat-save, [class*="save"]')
    const hasDeleteIcon = btn.querySelector('.icon-mat-delete, [class*="delete"], [class*="trash"]')
    const hasEditIcon = btn.querySelector('.icon-mat-edit, [class*="edit"]')
    const hasAddIcon = btn.querySelector('.icon-mat-add, .icon-mat-post_add')

    const text = (btn.textContent || '').trim().toLowerCase()
    const actionWords = ['simpan', 'save', 'update', 'hapus', 'delete', 'tambah', 'batal', 'reset']
    const hasActionText = actionWords.some(w => text.startsWith(w) || text === w)

    if (isSubmit || hasSaveIcon || hasDeleteIcon || hasEditIcon || hasAddIcon || hasActionText) {
      btn.style.setProperty('display', 'none', 'important')
      btn.style.setProperty('pointer-events', 'none', 'important')
    }
  })

  // Sembunyikan elemen ikon delete/trash murni (misal q-icon dengan @click)
  const delIcons = container.querySelectorAll('.icon-mat-delete, .icon-mat-delete_forever, .icon-mat-delete_outline, .icon-mat-delete_sweep, .q-icon[name*="delete"], .q-icon[name*="trash"], [class*="delete"].cursor-pointer')
  delIcons.forEach(icon => {
    icon.style.setProperty('display', 'none', 'important')
    icon.style.setProperty('pointer-events', 'none', 'important')
  })
}

function startLockObserver() {
  if (!isReadOnlyUser.value || !contentContainerRef.value) return
  applyLockToElements(contentContainerRef.value)

  if (lockObserver) lockObserver.disconnect()
  lockObserver = new MutationObserver(() => {
    if (contentContainerRef.value && isReadOnlyUser.value) {
      applyLockToElements(contentContainerRef.value)
    }
  })

  lockObserver.observe(contentContainerRef.value, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'disabled']
  })
}

onMounted(() => {
  if (isReadOnlyUser.value) {
    nextTick(() => {
      startLockObserver()
      triggerReadOnlyNotif()
    })
  }
})

watch(() => isReadOnlyUser.value, (newVal) => {
  if (newVal) {
    nextTick(() => {
      startLockObserver()
      triggerReadOnlyNotif()
    })
  } else {
    showReadOnlyNotif.value = false
    if (lockObserver) {
      lockObserver.disconnect()
    }
  }
})

watch(() => menu.value, () => {
  if (isReadOnlyUser.value) {
    nextTick(() => {
      if (contentContainerRef.value) {
        applyLockToElements(contentContainerRef.value)
      }
    })
    const delays = [50, 150, 300, 600, 1000]
    delays.forEach(d => {
      setTimeout(() => {
        if (contentContainerRef.value && isReadOnlyUser.value) {
          applyLockToElements(contentContainerRef.value)
        }
      }, d)
    })
  }
})

onBeforeUnmount(() => {
  if (lockObserver) {
    lockObserver.disconnect()
  }
})

const emit = defineEmits(['layanan-closed'])

const onShow = () => {
  triggerReadOnlyNotif()
  if (isReadOnlyUser.value) {
    nextTick(() => {
      startLockObserver()
    })
    const delays = [50, 150, 300, 600, 1000]
    delays.forEach(d => {
      setTimeout(() => {
        if (contentContainerRef.value && isReadOnlyUser.value) {
          applyLockToElements(contentContainerRef.value)
        }
      }, d)
    })
  }
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

/* KUNCI TOMBOL AKSI SIMPAN, UPDATE, DAN DELETE JIKA READ ONLY */
.layanan-locked-container {
  button[type="submit"],
  .q-btn[type="submit"],
  .btn-simpan,
  .btn-hapus,
  .btn-update,
  .q-btn:has(.icon-mat-save),
  .q-btn:has(.icon-mat-delete),
  .q-btn:has(.icon-mat-edit),
  .q-btn:has(.icon-mat-add),
  .q-btn:has(.icon-mat-post_add),
  .q-btn:has(i[class*="delete"]),
  .q-btn:has(i[class*="save"]),
  .q-btn:has(i[class*="trash"]),
  .icon-mat-delete,
  .icon-mat-delete_forever,
  .icon-mat-delete_outline,
  .icon-mat-delete_sweep,
  .q-icon[name*="delete"],
  .q-icon[name*="trash"],
  i[class*="delete"].cursor-pointer,
  i[class*="trash"].cursor-pointer {
    display: none !important;
    pointer-events: none !important;
  }

  /* Pengecualian mutlak: Tombol Print dan Preview tetap aktif */
  .q-btn:has(.icon-mat-print),
  .q-btn:has([class*="print"]),
  .btn-print {
    display: inline-flex !important;
    pointer-events: auto !important;
    opacity: 1 !important;
  }
}


.floating-read-only-notif {
  position: absolute;
  bottom: 24px;
  right: 24px;
  background: #ffffff;
  border-left: 4px solid #f2c037;
  border-radius: 8px;
  z-index: 99999;
  max-width: 440px;
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.fade-notif-enter-active,
.fade-notif-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-notif-enter-from,
.fade-notif-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

</style>
