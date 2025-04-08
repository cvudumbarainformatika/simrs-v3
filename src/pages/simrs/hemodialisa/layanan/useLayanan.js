import { computed, defineAsyncComponent, onMounted, ref, shallowRef, watchEffect } from 'vue'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useListPasienHemodialisaStore } from 'src/stores/simrs/hemodialisa/hemodialisa'

export default function useLayanan (pasien) {
  const store = useListPasienHemodialisaStore()
  const auth = useAplikasiStore()

  const menus = ref([
    {
      name: 'AnamnesisPage',
      label: 'Anamnesse $ Riwayat',
      icon: 'icon-mat-medical_information',
      nakes: ['1', '2', '3'],
      comp: shallowRef(defineAsyncComponent(() => import('./anamnesis/IndexPage.vue')))
    },
    {
      name: 'PemeriksaanPage',
      label: 'Pemeriksaan',
      icon: 'icon-my-stethoscope',
      nakes: ['1', '2', '3'],
      comp: shallowRef(defineAsyncComponent(() => import('./pemeriksaan/IndexPage.vue')))
    },
    {
      name: 'DiagTindPage',
      label: 'Diagnosa & Tindakan',
      icon: 'icon-mat-health_and_safety',
      nakes: ['1', '2', '3', '4', '5', '6'],
      comp: shallowRef(defineAsyncComponent(() => import('./diagnosaDanTindakan/IndexPage.vue')))
    },
    {
      name: 'hemodialisa',
      label: 'Hemodialisa',
      icon: 'icon-mat-note_alt',
      nakes: ['1', '2'],
      comp: shallowRef(defineAsyncComponent(() => import('./hemodialisa/IndexPage.vue')))
    },
    {
      name: 'Penunjang',
      label: 'Penunjang',
      icon: 'icon-mat-post_add',
      nakes: ['1', '2', '3'],
      comp: shallowRef(defineAsyncComponent(() => import('./penunjang/IndexPage.vue')))
    },
    {
      name: 'konsulspesialis',
      label: 'Konsul Spesialis',
      icon: 'icon-mat-textsms',
      nakes: ['1', '2', '3'],
      comp: shallowRef(defineAsyncComponent(() => import('./konsul/IndexPage.vue')))
    },
    {
      name: 'edukasi-page',
      label: 'Edukasi',
      icon: 'icon-mat-people_alt',
      nakes: ['1', '2', '3', '4', '5', '6', '', null],
      comp: shallowRef(defineAsyncComponent(() => import('./edukasi/IndexPage.vue')))
    },
    {
      name: 'e-resep-page',
      label: 'EResep',
      icon: 'icon-mat-receipt',
      nakes: ['1'],
      comp: shallowRef(defineAsyncComponent(() => import('../../eresep/EresepPage.vue')))
    },
    // {
    //   name: 'discharge-planning-page',
    //   label: 'Discharge Planning',
    //   icon: 'icon-mat-send_time_extension',
    //   nakes: ['2', '3'],
    //   comp: shallowRef(defineAsyncComponent(() => import('./dischargeplanning/IndexPage.vue')))
    // },
    // {
    //   name: 'upload-page',
    //   label: 'Upload Dokumen Luar',
    //   icon: 'icon-mat-cloud_upload',
    //   nakes: ['1', '2', '3', '4', '5', '6'],
    //   comp: shallowRef(defineAsyncComponent(() => import('./upload/IndexPage.vue')))
    // },
    // {
    //   name: 'catatan-dan-dokumen',
    //   label: 'Catatan / Dokumen',
    //   icon: 'icon-my-file_sign',
    //   nakes: ['1', '2', '3', '4', '5', '6'],
    //   comp: shallowRef(defineAsyncComponent(() => import('./dokumen/IndexPage.vue')))
    // },
    // {
    //   name: 'mpp',
    //   label: 'MPP',
    //   icon: 'icon-fa-arrows-down-to-people-solid',
    //   nakes: ['2', '3'],
    //   comp: shallowRef(defineAsyncComponent(() => import('./mpp/IndexPage.vue')))
    // },
    // {
    //   name: 'page-pulang',
    //   label: 'Pulang / Pulangkan',
    //   icon: 'icon-eva-home',
    //   nakes: ['1', '2', '3'],
    //   comp: shallowRef(defineAsyncComponent(() => import('./pulang/IndexPage.vue')))
    // }

  ])

  const nakes = computed(() => {
    return auth?.user?.pegawai?.kdgroupnakes
  })

  // console.log('nakes', nakes.value);


  const filterredMenus = computed(() => {
    const byPass = ['sa']
    const user = auth?.user?.username
    if (byPass.includes(user)) {
      return menus.value
    }

    return menus.value.filter(menu => menu.nakes.includes(nakes.value))
  })

  const menu = ref(null)

  onMounted(() => {
    console.log('mounted pageLayananRanap', auth?.user?.username)

    menu.value = filterredMenus.value[0]
  })

  function menuDiganti (val) {
    menu.value = val
  }

  watchEffect(() => {
    if (!pasien) {
      console.log('no pasien')

      store.pageLayanan = false
    }
  })

  return {
    menu,
    store,
    filterredMenus,
    nakes,

    menuDiganti
  }
}
