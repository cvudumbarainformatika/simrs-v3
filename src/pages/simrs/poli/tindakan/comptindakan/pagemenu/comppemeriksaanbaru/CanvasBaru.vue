<template>
  <div ref="el" class="column full-height full-width flex-center scroll bg-grey" style="border: 1px solid grey;">
    <div class="relative">
      <!-- Hidden image untuk source -->
      <img ref="imgRef" class="hidden" :src="`${tab !== null ? pathImg + tab : store.fileGambar}`" alt="gambar medis" />

      <!-- Canvas area -->
      <canvas ref="canvasRef"></canvas>

      <div class="absolute">
        <!-- Menu overlay -->
        <MenuCanvas v-if="target" ref="refMenu" :target="target || null" @show-menu="onMenuShow"
          @cancel-shape="cancelShape" @save-shape="saveShapes" />
      </div>

    </div>


    <!-- Header -->
    <div class="absolute-top">
      <HeaderCanvas v-if="tab === null" :is-btn="objectSelected !== null" :canvas="cvn" @ok="deselectObject" />
    </div>

    <!-- Bottom menu -->
    <div class="absolute-bottom">
      <BottomCanvas :tab="!!tab" @reset="resetShapes" @save-image="saveImage" @is-template="emits('openTemplate')"
        @new-editor="tabDiNullkan" @list-images="tabOpenned" @delete-image="hapusGambar" />
      <div v-if="pasien?.gambars?.length && openTab">
        <div class="flex">
          <div class="q-py-xs q-px-sm f-10 bg-dark text-white">Gambar Tersimpan</div>
        </div>
        <q-tabs v-model="tab" dense class="bg-dark text-white q-pa-none" align="center" :breakpoint="0"
          indicator-color="transparent" mobile-arrows outside-arrows @update:model-value="lihatTab">
          <q-tab v-for="(src, i) in pasien.gambars" :key="i" :name="src.gambar" class="q-pa-xs">
            <q-img :src="`${pathImg + src.gambar}`" loading="lazy" spinner-color="white" width="100px" />
          </q-tab>
        </q-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch, defineAsyncComponent, computed } from 'vue'
// import { fabric } from 'fabric'
// import { markRaw } from 'vue'
import { pathImg } from 'src/boot/axios'
import { usePemeriksaanFisik } from 'src/stores/simrs/pelayanan/poli/pemeriksaanfisik'
import { useFabricCanvas } from './compossableCanvasBaru/useFabricCanvas'
import { useMenuPemeriksaan } from '../../forjs/menupemeriksaan'


const MenuCanvas = defineAsyncComponent(() => import('./MenuCanvas.vue'))
const HeaderCanvas = defineAsyncComponent(() => import('./HeaderCanvas.vue'))
const BottomCanvas = defineAsyncComponent(() => import('./BottomCanvas.vue'))



const store = usePemeriksaanFisik()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
const emits = defineEmits(['openTemplate'])

const tab = ref(null)
const openTab = ref(true)
const el = ref(null)

const canvasRef = ref(null)
const imgRef = ref(null)
const cvn = ref(null)
const widthEl = ref(0)
const heightEl = ref(0)


const refMenu = ref()
const target = ref(null)
const writingMode = ref(false)
const start = ref(null)
const showMenu = ref(false)


const objectSelected = ref(null) // bisa jadi reactive state untuk HeaderCanvas
const canvasScale = ref(1)
const SCALE_FACTOR = ref(1)
const options = ref([])
const { menus } = useMenuPemeriksaan()

const arr = computed(() => {
  return store?.shapes?.filter(x => x?.templategambar === store?.fileGambar)
})

const {
  initCanvas,
  setBackground,
  addCustomControls,
  drawall,
  onChangeImg,

} = useFabricCanvas(canvasRef, cvn, imgRef, widthEl, heightEl, store, arr, objectSelected, writingMode, tab, openTab, start, target, showMenu,
  canvasScale, SCALE_FACTOR, options, menus)




// Resize logic
let resizeTimeout

const resizeCanvas = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    if (!el.value || !imgRef.value || !cvn.value) return

    const canvas = cvn.value
    const containerWidth = el.value.offsetWidth
    const imgW = imgRef.value.naturalWidth
    const imgH = imgRef.value.naturalHeight

    if (!imgW || !imgH) return

    const scale = Math.min(containerWidth / imgW, containerWidth / imgH)
    widthEl.value = containerWidth - 20
    heightEl.value = imgH * scale

    // Resize canvas
    canvas.setDimensions({ width: widthEl.value, height: heightEl.value })
    const bg = canvas.backgroundImage
    if (bg) {
      const center = canvas.getCenter()
      bg.scaleX = scale
      bg.scaleY = scale
      bg.left = center.left
      bg.top = center.top
      bg.originX = 'center'
      bg.originY = 'center'
      canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas))
    }
  }, 100)
}

onMounted(() => {

  store.initReset(false, props.pasien)
  initCanvas()
  addCustomControls(deleteHandler, cloneHandler)
  window.addEventListener('resize', resizeCanvas)
})

const deleteHandler = () => {
  // console.log('deleteHandler');
  const x = objectSelected.value?.left
  const y = objectSelected.value?.top
  store.deleteObjectOnShapes(x, y).then(() => {
    drawall()
  })
}

const cloneHandler = (target) => {
  // const target = transform.target
  const obj = arr.value[target.ids]
  console.log('clone', target)
  const clone = {
    penanda: obj?.penanda,
    x: obj?.x + 10,
    y: obj?.y + 10,
    anatomy: obj?.anatomy,
    ket: obj?.ket,
    ketebalan: obj?.ketebalan,
    panjang: obj?.panjang,
    width: obj?.width,
    height: obj?.height,
    warna: obj?.warna,
    fill: obj?.fill,
    angle: obj?.angle,
    tinggi: obj?.tinggi,
    templatemenu: store.templateActive,
    templategambar: store.fileGambar,
    templateindex: store.gambarActive,
    noreg: props.pasien ? props.pasien.noreg : '',
    norm: props.pasien ? props.pasien.norm : ''
  }
  store.pushShapes(clone).then((x) => {
    // console.log('shapes', writingMode.value)
    drawall()
    // objectSelected.value = obj
    // canvas.setActiveObject(obj)
    // setTimeout(() => {
    // }, 100)
  })
}


onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})

watch(() => imgRef.value?.src, (src) => {
  if (src) {
    // console.log('Detected image src:', src)
    nextTick(() => {
      resizeCanvas()
      setBackground()
    })
  }
})



function onMenuShow() {
  console.log('onMenuShow');

  writingMode.value = false
}

function cancelShape() {
  // console.log('cancelShape');

  store.resetDialogForm(store.templateActive, store.dialogForm.penanda)
  refMenu.value?.refMenu?.hide()
  drawall()
}

function saveShapes() {
  // console.log('saveShapes');
  const obj = {
    penanda: store.dialogForm.penanda,
    x: store.dialogForm.x,
    y: store.dialogForm.y,
    anatomy: store.dialogForm.anatomy,
    ket: store.dialogForm.ket,
    ketebalan: store.dialogForm.ketebalan,
    panjang: store.dialogForm.panjang,
    width: store.dialogForm.width,
    height: store.dialogForm.height,
    warna: store.dialogForm.warna,
    fill: store.dialogForm.fill,
    angle: store.dialogForm.angle,
    tinggi: store.dialogForm.tinggi,
    templatemenu: store.templateActive,
    templategambar: store.fileGambar,
    templateindex: store.gambarActive,
    noreg: props.pasien ? props.pasien.noreg : '',
    norm: props.pasien ? props.pasien.norm : ''
  }
  store.pushShapes(obj).then((x) => {
    // console.log('shapes', writingMode.value)
    drawall()
    setTimeout(() => {
      refMenu.value?.refMenu?.hide()
    }, 300)
  })
}

function deselectObject() {
  // console.log('deselectObject');

  const canvas = cvn.value
  canvas.discardActiveObject()
  canvas.renderAll()
  objectSelected.value = null
}


// untuk bottom

function resetShapes() {
  store.resetShapes()
  setTimeout(() => {
    drawall()
  }, 300)
}

const saveImage = () => {
  const imageURL = canvasRef.value.toDataURL('image/jpeg', 1)
  store.saveImage(imageURL, props.pasien, arr?.value)
  openTab.value = true
}

function tabDiNullkan() {
  const canvas = cvn.value
  // console.log('baruuuuuuuuuuuuuuuuu')
  if (canvas) {
    canvas.defaultCursor = 'crosshair'
    canvas.selectionBorderColor = 'red'
    canvas.selectionLineWidth = 3
    canvas.eventBound = true
    canvas.selectable = true
  }

  tab.value = null
  openTab.value = false

  // onChangeImg()
  // drawall()
  setTimeout(() => {
    onChangeImg()
    drawall()
  }, 500)
}

function tabOpenned() {
  openTab.value = !openTab.value
}

function hapusGambar() {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Gambar ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteGambar(props.pasien, tab.value).then(() => {
      tabDiNullkan()
    })
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function lihatTab(val) {
  const canvas = cvn.value
  // console.log('tab', canvas)
  canvas.discardActiveObject()
  canvas.defaultCursor = 'default'
  canvas.selectionBorderColor = 'white'
  canvas.selectionLineWidth = 1
  canvas.eventBound = false
  canvas.selectable = false
  canvas.remove(...canvas.getObjects())
  setTimeout(() => onChangeImg(), 500)
}





watch(() => arr?.value, (newVal, oldVal) => {
  // console.log('watch on shapes', newVal)
  // console.log('watch on shapes-old', oldVal)
  if (newVal?.length !== oldVal?.length) {
    console.log('watch on shapes', newVal);

    drawall()
  }
}, { deep: true })

watch(() => store?.fileGambar, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    // setTimeout(() => onChangeImg(), 300)
    tabDiNullkan()
  }
}, { deep: true })

watch(() => store.isEdit, (val) => {

  if (val) {
    console.log('watch on store.isEdit', val);

    objectSelected.value = null
    writingMode.value = true
    target.value = '.upper-canvas'
    showMenu.value = val
  }

  // }

}, { deep: true })

</script>
