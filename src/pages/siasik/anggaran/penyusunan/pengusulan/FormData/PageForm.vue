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
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan';
const store = usePengusulanAnggaranStore()
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
    notrans: '',
    kodeRuangan: '',
    ruangan: '',
    kodeKegiatan: '',
    kegiatan: '',
    kodebagian: '',
    organisasi_nama: '',
    kode50: '1.02.01.2.10.01',
    uraian: 'Pelayanan dan Penunjang Pelayanan BLUD',
    kunci: '',
    jenis: '',


    keterangan: '',
    volume: 0,
    harga: 0,
    nilai: 0,
    satuan: '',
    tglTransaksi: date.formatDate(Date.now(), 'YYYY-MM-DD')
  }
}

</script>
