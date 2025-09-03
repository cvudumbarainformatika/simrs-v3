<template>
  <div class="fit column scroll">
    <q-form ref="formRef" @submit="onSubmit" class="q-pa-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12">


          <div class="flex q-gutter-sm q-mb-md">
            <app-input-date :model="store.form.tanggal" label="Tanggal" icon="icon-mat-event" outlined
              @set-model="val => store.form.tanggal = val" />
          </div>

          <div><b>Harap Pilih Keterangan dibawah berikut : </b></div>
          <app-autocomplete-new ref="refPerawat" :model="store.form.kode_biaya" label="Keterangan" autocomplete="label"
            option-value="kode_biaya" option-label="label" outlined :source="store.tarifs" @on-select="(val) => {
              store.form.kode_biaya = val
              store.form.keterangan = store.tarifs?.find(e => e?.kode_biaya === val)?.rs2 || null
              store.form.harga_sarana = store.tarifs?.find(e => e?.kode_biaya === val)?.sarana
              store.form.harga_pelayanan = store.tarifs?.find(e => e?.kode_biaya === val)?.pelayanan
              store.form.tarif = store.tarifs?.find(e => e?.kode_biaya === val)?.tarif
            }" @clear="() => {
              store.form.kode_biaya = null
              store.form.keterangan = null
              store.form.harga_sarana = 0
              store.form.harga_pelayanan = 0
              store.form.tarif = 0
            }" />



          <div class="q-mt-lg">
            <b>Tarif : </b> <span>(Auto)</span>
          </div>
          <app-input-simrs v-model="store.form.tarif" label="" readonly />
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
import { useJasaKeperawatanStore } from 'src/stores/simrs/ranap/jasakeperawatan'


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


const store = useJasaKeperawatanStore()
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