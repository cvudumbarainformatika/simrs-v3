<template>
  <div class="ttd-pad-container column items-center full-width">
    <!-- Canvas Area -->
    <div class="canvas-wrapper relative-position bg-white shadow-1">
      <canvas
        v-show="imgTtd === null"
        ref="canvasRef"
        class="ttd-pad"
        :height="height"
        :width="width"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
      />
      <q-img v-show="imgTtd !== null" :src="imgTtd" :height="height" :width="width" />
    </div>

    <!-- Actions Area (Dipisah dari dalam canvas!) -->
    <div class="row justify-between items-center full-width q-mt-md q-col-gutter-x-sm">
      <div class="col-6">
        <q-btn
          outline
          color="negative"
          icon="icon-mat-refresh"
          label="Bersihkan"
          class="full-width"
          no-caps
          @click="clearPad()"
        />
      </div>
      <div class="col-6">
        <q-btn
          color="teal"
          icon="icon-mat-save"
          label="Simpan TTD"
          class="full-width"
          no-caps
          @click="savePad()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const canvasRef = ref()
const ctx = ref()
const writingMode = ref(false)
const positionX = ref()
const positionY = ref()

const props = defineProps({
  ttd: {
    type: String,
    default: null
  },
  uuid: {
    type: String,
    default: '00000000-0000-0000-0000-000000000000'
  },
  width: {
    type: [Number, String],
    default: 320
  },
  height: {
    type: [Number, String],
    default: 200
  }
})

const emits = defineEmits(['save-ttd', 'signature'])

const imgTtd = computed(() => props.ttd)

onMounted(() => {
  ctx.value = canvasRef.value.getContext('2d')
  ctx.value.lineWidth = 3
  ctx.value.lineJoin = ctx.value.lineCap = 'round'
  console.log('ttd', props.ttd)
})

const handlePointerDown = (event) => {
  if (event.cancelable) event.preventDefault()
  writingMode.value = true
  ctx.value.beginPath()
  getTargetPosition(event)
  ctx.value.moveTo(positionX.value, positionY.value)
}

const handlePointerUp = (event) => {
  writingMode.value = false
}

const handlePointerMove = (event) => {
  if (event.cancelable) event.preventDefault()
  if (writingMode.value === false) return
  const [posX, posY] = getTargetPosition(event)
  ctx.value.lineTo(posX, posY)
  ctx.value.stroke()
}

function getTargetPosition(event) {
  positionX.value = event.clientX - event.target.getBoundingClientRect().x
  positionY.value = event.clientY - event.target.getBoundingClientRect().y
  return [positionX.value, positionY.value]
}

const clearPad = () => {
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

const savePad = () => {
  const imageURL = canvasRef.value.toDataURL()
  
  // Cek apakah canvas kosong
  const ctxTemp = canvasRef.value.getContext('2d')
  const buffer = new Uint32Array(
    ctxTemp.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height).data.buffer
  )
  const isBlank = !buffer.some(color => color !== 0)

  if (isBlank) {
    emits('save-ttd', null)
  } else {
    emits('save-ttd', imageURL)
  }
}
</script>

<style lang="scss" scoped>
.ttd-pad-container {
  max-width: 100%;
}

.canvas-wrapper {
  border: 2px solid var(--q-teal);
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--q-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

canvas.ttd-pad {
  display: block;
  cursor: crosshair;
  touch-action: none !important; /* Mencegah scrolling browser saat tanda tangan */
}

@media(pointer:coarse) {
  body {
    overflow: hidden;
  }
}
</style>
