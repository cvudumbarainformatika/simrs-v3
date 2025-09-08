<template>
  <div class="fit column scroll">
    <q-form ref="formRef" @submit="onSubmit" class="q-pa-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12">


          <div class="flex q-gutter-sm q-mb-md">
            <q-option-group v-model="store.form.jenis" :options="store.jenisx" label="Harap Pilih Salah Satu"
              :rules="[val => val !== null || 'Harap Pilih terlebih dahulu']" inline />
          </div>

          <div><b>Dokter : </b></div>
          <app-autocomplete-new ref="refPerawat" :model="store.form.kddokter" label="Dokter" autocomplete="nama"
            option-value="kdpegsimrs" option-label="nama" outlined :source="store.dokters" @on-select="(val) => {
              store.form.kddokter = val
            }" @clear="store.form.kddokter = null" />


          <!-- <div class="q-mt-lg">
            <b>Split Sistem Bayar : </b>
          </div>
          <app-autocomplete-new ref="refSistemBayar" :model="store.form.splitsistembayar" label="Split"
            autocomplete="nama" option-value="kode" option-label="nama" outlined :source="store.sistembayars" valid
            @on-select="(val) => {
              store.form.splitsistembayar = val
            }" @clear="store.form.splitsistembayar = null" />
          <div class="q-mt-lg">
            <b>Biaya Split : </b>
          </div>
          <app-input-simrs v-model="store.form.biayasplit" label="Biaya Split" /> -->
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="row full-width justify-end">
        <q-btn :loading="store.loadingSave" :disable="store.loadingSave" label="Simpan" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useJasaVisitedanKonsulStore } from 'src/stores/simrs/ranap/jasavisitekonsul'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
})


const store = useJasaVisitedanKonsulStore()
const formRef = ref(null)
// const refPerawat = ref(null)

const onSubmit = () => {
  store.simpan(props?.pasien)
}

onMounted(() => {
  // console.log('store', store.sistembayars);
  store.initReset()
})
</script>