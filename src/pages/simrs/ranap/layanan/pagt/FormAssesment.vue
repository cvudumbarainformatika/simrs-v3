<template>
  <div class="row q-col-gutter-md">
    <div class="col-8">
      <q-input ref="refInputKu" v-model="store.form.status_gizi" outlined autogrow stack-label standout="bg-yellow-3"
        label="Status Gizi" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" lazy-rules="ondemand"
        hide-bottom-space />
    </div>

    <div class="col-6">
      <b>BIOKIMIA :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.biokima" v-for="dd in store.normals" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.biokimiaKet" outlined autogrow stack-label standout="bg-yellow-3" label="Keterangan"
        hide-bottom-space />
    </div>
    <div class="col-6">
      <b>KLINIS/FISIK :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.klinis" v-for="dd in store.normals" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.klinisKet" outlined autogrow stack-label standout="bg-yellow-3" label="Keterangan"
        hide-bottom-space />
    </div>
    <div class="col-12">
      <b>RIWAYAT GIZI DAHULU </b>
      <q-separator></q-separator>
    </div>
    <div class="col-6">
      <b>ALERGI MAKANAN :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.alergiMakanan" v-for="dd in store.yaTidaks" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.alergiMakananKet" outlined autogrow stack-label standout="bg-yellow-3"
        label="Keterangan" hide-bottom-space />
    </div>
    <div class="col-6">
      <b>POLA MAKAN :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.polaMakan" v-for="dd in store.yaTidaks" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.polaMakanKet" outlined autogrow stack-label standout="bg-yellow-3" label="Keterangan"
        hide-bottom-space />
    </div>
    <div class="col-12">
      <q-input v-model="store.form.lainlain" outlined autogrow stack-label standout="bg-yellow-3"
        label="Lain-lain, Sebutkan" hide-bottom-space />
    </div>


    <div class="col-12">
      <b>RIWAYAT GIZI SEKARANG </b>
      <q-separator></q-separator>
    </div>
    <div class="col-6">
      <b>NAFSU MAKAN BAIK :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.nafsuMakan" v-for="dd in store.yaTidaks" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.nafsuMakanKet" outlined autogrow stack-label standout="bg-yellow-3"
        label="Keterangan" hide-bottom-space />
    </div>
    <div class="col-6">
      <b>SULIT MENELAN :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.sulitNelan" v-for="dd in store.yaTidaks" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.sulitNelanKet" outlined autogrow stack-label standout="bg-yellow-3"
        label="Keterangan" hide-bottom-space />
    </div>
    <div class="col-6">
      <b>SULIT MENGUNYAH :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.sulitNgunyah" v-for="dd in store.yaTidaks" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.sulitNgunyahKet" outlined autogrow stack-label standout="bg-yellow-3"
        label="Keterangan" hide-bottom-space />
    </div>
    <div class="col-6">
      <b>MUAL :</b>
      <q-separator></q-separator>
      <q-radio v-model="store.form.mual" v-for="dd in store.yaTidaks" :key="dd" :label="dd" :val="dd"
        @update:model-value="(val) => {

        }" />
      <q-input v-model="store.form.mualKet" outlined autogrow stack-label standout="bg-yellow-3" label="Keterangan"
        hide-bottom-space />
    </div>

    <div class="col-12">
      <b>RIWAYAT PERSONAL </b>
      <q-separator></q-separator>

    </div>
    <div class="col-6">
      <b>RIWAYAT PENYAKIT DAHULU :</b>
      <q-separator></q-separator>
      <q-checkbox class="q-my-sm q-mr-sm" dense v-for="(g, x) in store.riwayats" :key="x" v-model="store.form.rwPenyDhl"
        :val="g" :label="g" color="primary" />
      <q-input v-model="store.form.rwPenyDhlKet" outlined autogrow stack-label standout="bg-yellow-3"
        label="Lain-lain, Sebutkan" hide-bottom-space />
    </div>
    <div class="col-6">
      <q-input v-model="store.form.rwPenySkr" outlined autogrow stack-label standout="bg-yellow-3"
        label="Riwayat Penyakit Sekarang" hide-bottom-space />
    </div>


    <!-- DIALOG -->
    <!-- <DialogFormRiwayat v-model="store.openDialogFormRiwayat" :pasien="pasien" /> -->
  </div>
</template>

<script setup>
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { usePagtStore } from 'src/stores/simrs/ranap/pagt'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

// const TableRiwayatKehamilan = defineAsyncComponent(() => import('./comp/TableRiwayatKehamilan.vue'))
// const DialogFormRiwayat = defineAsyncComponent(() => import('./comp/DialogFormRiwayat.vue'))

const store = usePagtStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  ulang: {
    type: Boolean,
    default: false
  }
})

const auth = useAplikasiStore()



const nakes = computed(() => {
  return auth?.user?.pegawai?.kdgroupnakes
})

const refInputKu = ref(null)
defineExpose({
  refInputKu
})



onMounted(() => {
  Promise.all([
    // store.getRiwayatKehamilan()
    // store.initReset(null)
  ])
})


</script>
