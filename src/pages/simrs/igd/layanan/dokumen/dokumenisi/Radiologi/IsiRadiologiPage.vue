<template>
  <div class="b q-pa-md">
    * Pemeriksasan Radiologi
    <div>
      <div class="q-ma-sm text-bold" v-for="(item, i) in props.pasien?.radiologi" :key="i">
        {{ item?.rs4 }} <br>
      </div>
    </div>
    * Hasil Bacaan Radiologi
    <div>
      <div v-for="(item, x) in props.pasien?.hasilradiologi" :key="x">
        {{ item?.rs3 }}
      </div>
    </div>
    <div class="row justify-end q-mt-xl">
      <div class="col-6 text-center">
        <div>Dokter Radiologi</div>
        <div class="column items-center q-mt-sm">
          <div class="radiologi-doctor-qr">
            <vue-qrcode :value="qrDokter" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: {
                dark: '#000000',
                light: '#ffffff'
              },
              margin: 0
            }" />
          </div>
          <div class="q-mt-sm text-weight-bold">
            {{ dokterRadiologi?.nama ?? props.pasien?.dokter ?? '-' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const dokterRadiologi = computed(() =>
  props.pasien?.radiologi?.find(item => item?.dokter?.kdpegsimrs)?.dokter ?? null
)

const qrDokter = computed(() => {
  const noreg = props.pasien?.noreg
  const petugas = dokterRadiologi.value?.kdpegsimrs ?? props.pasien?.kodedokter ?? null
  if (!noreg || !petugas) return ''

  const enc = btoa(`${noreg}|RADIOLOGI.png|PENUNJANG|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})
</script>
<style scoped>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.radiologi-doctor-qr {
  width: 100px;
}
</style>
