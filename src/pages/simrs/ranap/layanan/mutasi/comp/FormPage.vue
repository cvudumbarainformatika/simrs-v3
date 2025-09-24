<template>
  <div class="fit column scroll">
    <q-form ref="formRef" @submit="onSubmit" class="">
      <div class="q-pa-md">
        <b>Ruangan Asal</b>
      </div>
      <q-separator class="" />

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-4">Asal Ruangan </div>
        <div class="col-8">: {{ asalRuangan?.kamar }}</div>
        <div class="col-4">Kamar </div>
        <div class="col-8">: {{ asalRuangan?.kd_kmr }}</div>
        <div class="col-4">Nomor Bed </div>
        <div class="col-8">: {{ asalRuangan?.no_bed }}</div>
        <div class="col-4">Tarip </div>
        <div class="col-8">: Rp. {{ formatRp(store?.tarip) }}</div>
      </div>


      <q-separator class="" />
      <div class="q-pa-md">
        <b>Ruangan Tujuan</b>
      </div>
      <q-separator class="" />

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-4">Ruangan Tujuan </div>
        <div class="col-8 flex q-gutter-x-sm ">
          <div class="flex-1 full-width">
            <app-autocomplete-new ref="refRuangan" :model="store.form.ruanganTujuan" label="Tujuan" autocomplete="rs2"
              option-value="rs1" option-label="rs2" outlined :source="store.ruangans" @on-select="(val) => {
                // console.log('val', val);

                store.form.ruanganTujuan = val
                store.showKamar(val)
                store.selectRuangan = store?.ruangans?.find((x) => x?.rs1 === val)?.rs2 || null
                store.form.kamar = null
                store.form.noBed = null
              }" @clear="() => {
                store.form.ruanganTujuan = null
                store.form.kamar = null
                store.selectRuangan = null
                store.form.noBed = null
              }" />
          </div>
        </div>
        <div class="col-4">Kamar </div>
        <div class="col-8 flex q-gutter-x-sm">
          <div class="flex-1 full-width">
            <app-autocomplete-new ref="refKamar" :model="store.form.kamar" label="Kamar" autocomplete="rs1"
              option-value="rs1" option-label="rs1" outlined :source="store.kamars" @on-select="(val) => {
                // console.log('val', val);

                store.form.kamar = val


                store.showBed(store.selectRuangan, val)
                // ])
                store.form.noBed = null
              }" @clear="() => {
                store.form.kamar = null
                store.selectRuangan = null
                store.form.noBed = null
              }" />
          </div>
        </div>
        <div class="col-4">Nomor Bed </div>
        <div class="col-8 flex q-gutter-x-sm">
          <div class="flex-1 full-width">
            <app-autocomplete-new ref="refBed" :model="store.form.noBed" label="No Bed" autocomplete="rs2"
              option-value="rs2" option-label="rs2" outlined :source="store.beds" @on-select="(val) => {
                // console.log('val', val);

                store.form.noBed = val
                // store.showKamar(val)
                // store.showBed(store.selectRuangan, val)
              }" @clear="() => {
                store.form.kamar = null
                store.selectRuangan = null
                store.form.noBed = null
              }" />
          </div>
        </div>
        <!-- <div class="col-4">Tarip </div>
        <div class="col-8">: Rp. tarrrrr</div> -->
      </div>
      <q-separator class="q-my-md" />
      <div class="row full-width justify-end q-pa-md">
        <q-btn :loading="store.loadingOrder" :disable="store.loadingOrder" label="Simpan Mutasi Pasien" type="submit"
          color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { formatRp } from 'src/modules/formatter'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  }
})

const formRef = ref(null)
const asalRuangan = computed(() => {
  return props.store?.ruanganAsal
})

console.log('props', props?.pasien);


function onSubmit() {
  console.log('onSubmit', props.store.form)

  props.store.simpanMutasi(props.pasien)
}

watchEffect(() => {
  // if (props.store?.form?.ruanganTujuan) {
  //   props.store.showKamar(props.store.form.ruanganTujuan)
  // }
})

</script>
