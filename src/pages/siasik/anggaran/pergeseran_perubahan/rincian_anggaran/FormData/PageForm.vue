<template>
  <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <FormHeader />
      </div>
      <div class="q-pt-md">
        <ListRincian :store="store.rincians" />
      </div>
    </q-card>
  </div>
  <!-- <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <ListRincian />
      </div>
    </q-card>
  </div> -->
</template>
<script setup>import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak';
import { onBeforeMount } from 'vue';
import FormHeader from './comp/FormHeader.vue'
import ListRincian from './comp/listrincian/ListRincian.vue'
import { onUnmounted } from 'vue';
import { date } from 'quasar';
import { usePergeseranAnggaranStore } from 'src/stores/siasik/anggaran/pergeseran/pergeseranrincian';
const store = usePergeseranAnggaranStore()
onBeforeMount(() => {
})

onUnmounted(() => {
  resetFormData()
})


function resetFormData() {
  store.params = {
    q: '',
    tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    tahun: date.formatDate(Date.now(), 'YYYY'),
  }
  store.form = {
    noperubahan: '',
    notrans: '',
    usulan: '',
    volume: 0,
    harga: 0,
    nilai: 0,
    volumebaru: 0,
    hargabaru: 0,
    totalbaru: 0,
    selisih: 0,
    koderek108: '',
    uraian108: '',
    koderek50: '',
    uraian50: '',
    jumlahacc: 0,
    satuan: '',
    nousulan: '',
    kodekegiatanblud: '',
    uraianblud: '',
    kodebidang: '',
    bidang: '',
    koders: '',
    idpp: '',
    tglperubahan: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  }
  store.disableSaved = false
}

</script>
