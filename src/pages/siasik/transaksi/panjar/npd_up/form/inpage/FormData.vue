<template>
  <q-card class="falt col full-height">
    <q-form @submit="onSubmit" ref="formInput" class="full-height">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-4 q-gutter-y-md">
          <app-input-simrs v-model="store.form.nosppup" label="Nomer Transaksi" readonly outlined dense />
        </div>
        <div class="col-4 q-gutter-y-md">
          <app-input-date-human label="Tanggal Transaksi" :model="store.form.tglTrans" icon="icon-mat-event" outlined
            :autofocus="false" :disable="store.disabled || store.loading" @db-model="tglTransaksi"
            :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
          <!-- <app-input-date :model="store.formheader.tgltrans" label="Tanggal Transaksi" icon="icon-mat-event" outlined
            @set-model="tglTransaksi" /> -->
        </div>
        <div class="col-4 q-gutter-y-md">
          <app-input-simrs label="Bendahara Pengeluaran" readonly outlined dense v-model="store.form.bendaharaKeluar" />

        </div>
      </div>
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-4 q-gutter-y-md">
          <app-input-simrs v-model="store.form.rekening" label="Rekening" readonly outlined dense />
        </div>
        <div class="col-4 q-gutter-y-md">
          <app-input-simrs v-model="store.form.bank" label="Bank" readonly outlined dense />
        </div>
        <div class="col-4 q-gutter-y-md">
          <app-input-simrs v-model="store.form.kodeRek" label="Nomor Rekening" readonly outlined dense />
        </div>
      </div>
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Uraian" v-model="store.form.uraian" outlined :autofocus="false"
            :valid="{ required: false }" :disable="store.loading || store.disabled" />
        </div>
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs type="Number" label="Nilai UP" v-model="store.form.jumlahspp" outlined :autofocus="false"
            :valid="{ required: true, number: true }" :disable="store.loading || store.disabled" />
        </div>
      </div>

      <div class="row q-pb-sm justify-center">
        <app-btn label="Simpan" rounded color="teal-8" :disable="store.loadingSave" :loading="store.loadingSave"
          type="submit" />
      </div>
    </q-form>

  </q-card>
</template>

<script setup>
import { useTransaksiNPDUP } from 'src/stores/siasik/transaksi/panjar/npd_up/store_npd_up';
import { defineAsyncComponent, onMounted, ref } from 'vue';


// const SelectKontrak = defineAsyncComponent(() => import('./SelectKontrakPekerjaan.vue'))
const store = useTransaksiNPDUP()

onMounted(() => {
  store.getBendahara()
  store.getBank()
})
const formInput = ref(null)

function onSubmit() {
  // console.log('submit', store.form);
  store.simpanData()
  formInput.value.resetValidation()
}

function tglTransaksi(val) {
  console.log('tglTransaksi', val)
  store.form.tglTrans = val


}




</script>
