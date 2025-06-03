<template>
  <AdminitrasiPage :pasien="props?.pasien" ref="adminRef" />
  <LaboratPage :pasien="props?.pasien" ref="laboratRef" />
  <RadiologiPage :pasien="props?.pasien" ref="radioRef" />
  <Tindakan :pasien="props?.pasien" ref="tindakanRef" />
  <BankDarahPage :pasien="props?.pasien" ref="bankdarahRef" />
  <OperasiPage :pasien="props?.pasien" ref="operasiRef" />
  <KamarJenazahPage :pasien="props?.pasien" ref="kamarjenazahRef" />
  <div>
    <div class="row q-gutter-sm q-mr-lg items-center no-wrap ">
      <q-separator style="color: red;" />
      <div class="col-10 text-right">
        Total
      </div>
      <div class="col-2 garis-bawah-dablue text-right">
        {{ formatRp(totalall) }}
      </div>
    </div>
  </div>
</template>
<script setup>
import AdminitrasiPage from './comp/AdminitrasiPage.vue';
import LaboratPage from './comp/LaboratPage.vue';
import RadiologiPage from './comp/RadiologiPage.vue';
import Tindakan from './comp/TindakanPage.vue';
import BankDarahPage from './comp/BankDarahPage.vue';
import OperasiPage from './comp/OperasiPage.vue';
import KamarJenazahPage from './comp/KamarJenazahPage.vue';
import { computed, onMounted, ref } from 'vue';
import { formatRp } from 'src/modules/formatter';


const laboratRef = ref(0);
const adminRef = ref(0);
const radioRef = ref(0);
const tindakanRef = ref(0);
const bankdarahRef = ref(0);
const operasiRef = ref(0);
const kamarjenazahRef = ref(0);

const totalall = computed(() => {
  const administrasi = adminRef.value.administrasi?.subtotal ?? 0;
  const laborat = laboratRef.value.rincianlaborat?.total ?? 0;
  const radiologi = radioRef.value.rincianradiologi?.total ?? 0;
  const bankdarah = bankdarahRef.value.rincianbankdarah?.total ?? 0;
  const tindakan = tindakanRef.value.rinciantindakan?.total ?? 0;
  const oktrans = operasiRef.value.rincianoktrans?.total ?? 0;
  const kamarjenazah = kamarjenazahRef.value.rinciankamarjenazah?.total ?? 0;
  const total = parseInt(laborat) + parseInt(administrasi) + parseInt(radiologi) + parseInt(tindakan) + parseInt(bankdarah) + parseInt(oktrans) + parseInt(kamarjenazah)
  return total
})

onMounted(() => {
  console.log('Laborat Data:', tindakanRef.value.rinciantindakan);
});



const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
</script>
<style lang="scss" scoped>
.garis-bawah-dablue {
  border-bottom: 1px solid rgb(56, 150, 239);
  border-bottom-style: dashed;
}
</style>
