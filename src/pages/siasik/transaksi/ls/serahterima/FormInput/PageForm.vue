<template>
  <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <FormHeader />
      </div>
      <div class="q-pt-md">
        <ListRincian />
      </div>
    </q-card>
  </div>

</template>
<script setup>
// import { formInputNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formnpdls';
// import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak';
// import { onBeforeMount } from 'vue';
import FormHeader from './inpage/FormHeader.vue'
import ListRincian from './inpage/ListRincian.vue'
// const store = formInputNpdlsStore()
// const ambil = formKontrakPekerjaan()
// onBeforeMount(() => {
//   // store.initReset(props.data)
//   store.getDataBidang()
//   ambil.getPihaktiga()
// })

</script>
