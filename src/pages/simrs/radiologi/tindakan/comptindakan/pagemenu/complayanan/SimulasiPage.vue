<template>
  <q-card
    flat
    square
    bordered
    class="column full-height"
    dark
  >
    <div class="col-auto">
      <q-bar
        class="bg-black text-white"
      >
        <div class="f-12 q-pa-xs">
          Simulasi InaCBG (Preview)
        </div>
      </q-bar>
    </div>
    <div class="col-grow">
      <div class="full-height">
        <q-scroll-area style="height:calc(100%)">
          <q-card-section>
            <div class="row justify-between">
              <div class="text-caption">
                Code InaCBG
              </div>
              <div
                v-if="ina.loading || store.loadingFormDiagnosa"
              >
                <q-skeleton
                  square
                  width="70px"
                  dark
                />
              </div>
              <div
                v-else
                class="text-subtitle2 text-orange"
              >
                {{ ina.kodeIna }}
              </div>
            </div>
          </q-card-section>
          <q-separator dark />
          <q-card-section>
            <div class="row justify-between">
              <div class="text-subtitle1">
                Tarif InaCBG
              </div>
              <div
                v-if="ina.loading || store.loadingFormDiagnosa"
              >
                <q-skeleton
                  square
                  width="70px"
                  dark
                />
              </div>
              <div
                v-else
                class="text-subtitle1 text-orange"
              >
                {{ formatRp(ina.tarifIna) }}
              </div>
            </div>
          </q-card-section>
          <q-separator dark />
          <q-card-section>
            <div class="row justify-between">
              <div class="text-subtitle1">
                Tarif Rumah Sakit
              </div>
              <div
                v-if="ina.loading || store.loadingFormDiagnosa"
              >
                <q-skeleton
                  square
                  width="70px"
                  dark
                />
              </div>
              <div
                v-else
                class="text-subtitle1 text-orange"
              >
                {{ formatRp(ina.tarifRs) }}
              </div>
            </div>
          </q-card-section>
          <q-separator dark />
          <q-card-section :class="minus?'bg-negative':'bg-primary'">
            <div class="row justify-between">
              <div class="text-subtitle1">
                Selisih
              </div>
              <div
                v-if="ina.loading || store.loadingFormDiagnosa"
              >
                <q-skeleton
                  square
                  width="70px"
                />
              </div>
              <div
                v-else
                class="text-subtitle1 text-white"
              >
                {{ formatRp(hitungSelisih()) }}
              </div>
            </div>
          </q-card-section>
        </q-scroll-area>
      </div>
    </div>
  </q-card>
</template>
<script setup>
import { formatRp } from 'src/modules/formatter'
import { useInacbgPoli } from 'src/stores/simrs/pelayanan/poli/inacbg'
import { useLayananPoli } from 'src/stores/simrs/pelayanan/poli/layanan'
import { computed, watch } from 'vue'

const store = useLayananPoli()
const ina = useInacbgPoli()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
// const totalPemeriksaan = computed(() => {
//   const arr = props?.pasien?.tindakan
//   return arr?.length ? arr.reduce((acc, cur) => acc + cur.subtotal, 0) : 0
// })

function hitungSelisih() {
  return ina.tarifIna - ina.tarifRs
}
const minus = computed(() => {
  return ina.tarifIna - ina.tarifRs < 0
})

watch(() => ina.tarifIna, (obj) => {
  console.log('watch tarifIna', obj)
  hitungSelisih()
}, { deep: true })
watch(() => props.pasien?.tindakan, (obj) => {
  console.log('watch tindakan', obj)
  ina.setTotalTindakan(props.pasien)
}, { deep: true })
watch(() => props.pasien?.laborats, (obj) => {
  console.log('watch laborat', obj)
  ina.setTotalLaborat(props.pasien)
}, { deep: true })

</script>
