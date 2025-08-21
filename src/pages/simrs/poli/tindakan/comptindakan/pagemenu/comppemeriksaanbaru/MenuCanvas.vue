<template>
  <q-menu ref="refMenu" :touch-position="touchPosition" :target="target ?? false" @show="onShowInp" @hide="onHideInp">


    <form-menu @saveShape="saveShape" @cancelShape="cancelShape" :lokalisparus="lokalisparus" :options="options"
      @filterFn="filterFn" />

  </q-menu>

</template>

<script setup>
import { usePemeriksaanFisik } from 'src/stores/simrs/pelayanan/poli/pemeriksaanfisik'
import { onMounted, ref } from 'vue'
import { useMenuPemeriksaan } from '../../forjs/menupemeriksaan'

import FormMenu from './khusus/FormMenu.vue'

const store = usePemeriksaanFisik()
const { menus } = useMenuPemeriksaan()
const options = ref([])
const refMenu = ref()
defineExpose({ refMenu })
const emits = defineEmits(['showMenu', 'hideMenu', 'saveShape', 'cancelShape'])
defineProps({
  target: {
    type: String,
    default: null
  },
  touchPosition: {
    type: Boolean,
    default: true
  }
})
function onShowInp() {
  emits('showMenu')
}

function onHideInp() {
  emits('hideMenu')
}

function saveShape() {
  emits('saveShape')
}
function cancelShape() {
  emits('cancelShape')
}

const lokalisparus = ref([
  'Normal', 'Infiltrat', 'Cavitas', 'Cairan', 'Massa', 'Nodul', 'Konsolidasi', 'Air Bronchogram', 'Clear Zone (Pneumothorax)',
  'Fibrosis', 'Fibroinfiltrat', 'Kalsifikasi', 'Fibrokalsifikasi', 'Schwarte', 'Bronchitis', 'Bronchiectasis (Honeycomb appearance)',
  'Tuberkuloma', 'Acute Lung Oedema', 'Bronchovaskular pattern meningkat'
])

onMounted(() => {
  const opt = menus.value.filter(x => x.nama !== 'Body').map(x => x.nama)
  options.value = opt
  // console.log('mounted', opt)
  // store.setDialogForm('anatomy', store.templateActive ?? '')
})

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      options.value = menus.value.filter(x => x.nama !== 'Body').map(x => x.nama)
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    const arr = menus.value.map(x => x.nama)
    options.value = arr.filter(v => v.toLowerCase().indexOf(needle) > -1 && v !== 'Body')
  })
}

</script>
