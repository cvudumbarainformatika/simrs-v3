<template>
  <div v-if="kdpegsimrs" :style="{ height, width }" class="relative-position">
    <div class="absolute-center" :style="{ width }">
      <vue-qrcode :value="qrPetugas" tag="svg" :options="{
        errorCorrectionLevel: 'Q',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        margin: 0
      }" />
      <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
    </div>
  </div>
  <div v-else :style="{ height }" class="relative-position">
    <div class="column flex-center full-height" :style="{ width }">
      <div>ttd</div>
    </div>
  </div>
</template>

<script setup>
// import VueQrcode from 'vue-qrcode'
import { ref, computed, watch } from 'vue'
import { pathImg } from 'src/boot/axios'
const props = defineProps({
  height: {
    type: String,
    default: '80px'
  },
  width: {
    type: String,
    default: '80px'
  },
  noreg: {
    type: String,
    default: ''
  },
  jnssurat: {
    type: String,
    default: '' // SURAT-KEMATIAN.png
  },
  asal: {
    type: String,
    default: '' // RANAP
  },
  kdpegsimrs: {
    type: String,
    default: '' //
  },
})

const qrPetugas = computed(() => {
  const noreg = props?.noreg || ''// noreg
  const dok = props?.jnssurat || ''
  const asal = props?.asal || ''
  const kdpeg = props?.kdpegsimrs || ''
  const enc = btoa(`${noreg}|${dok}|${asal}|${kdpeg}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})
</script>

<style lang="scss" scoped>
.qrcode__image {
  // background-color: #fff;
  // border: 0.05rem solid #fff;
  // border-radius: 0.25rem;
  // box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 25%;
  width: 25%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
