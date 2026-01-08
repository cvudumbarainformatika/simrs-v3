<template>
  <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <FormHeader />
      </div>
      <div class="q-pt-md">
        <ListRincian :store="store.rincianSaved" />
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
import { usePrioritasAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/penyesuaianprioritas';
const store = usePrioritasAnggaranStore()
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
    kodepptk: '',
    pptk: '',
    kodebidang: '',
    namabidang: '',
    kodekegiatan: '',
    kegiatan: '',
    kdruang_pengusul: '',
    ruang_pengusul: '',
    capaianprogram: '',
    masukan: 'Dana yang Dibutuhkan',
    keluaran: '',
    hasil: '',
    targetcapaian: '',
    targetkeluaran: '',
    targethasil: '',
    kunci: '',
    tgltrans: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    tahun: date.formatDate(Date.now(), 'YYYY'),

    usulan: '',
    jumalhacc: 0,
    volume: 0,
    harga: 0,
    nilai: 0,
    satuan: '',
    koderek108: '',
    uraian108: '',
    koderek50: '',
    uraian50: '',
    nousulan: '',
    koders: '',
  }
  store.rincianSaved = []
}

</script>
