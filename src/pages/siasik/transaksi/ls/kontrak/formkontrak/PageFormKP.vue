<template>
  <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <FormInput />
      </div>
      <!-- <div class="q-pt-md">
        <ListRincian />
      </div> -->
    </q-card>
  </div>

</template>
<script setup>
import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak';
import { onBeforeMount, onMounted } from 'vue';
import FormInput from './FormInputKP.vue'
const store = formKontrakPekerjaan()
onBeforeMount(() => {
  // store.initReset(props.data)
  store.getPihaktiga()
  store.getDataBidang()
})

</script>
