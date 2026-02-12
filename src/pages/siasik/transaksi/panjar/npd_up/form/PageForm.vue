<template>
  <div class="container full-width full-height">
    <q-card class="items-center q-pa-sm full-width full-height">
      <div class="row">
        <FormHeader />
      </div>
      <!-- <div class="q-pt-sm">
        <ListData />
      </div> -->
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
<script setup>
import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak';
import { onBeforeMount } from 'vue';
import FormHeader from './inpage/FormData.vue'
// import ListData from './inpage/ListData.vue'
import { onUnmounted } from 'vue';
import { date } from 'quasar';
import { useTransaksiNPDUP } from 'src/stores/siasik/transaksi/panjar/npd_up/store_npd_up';
const store = useTransaksiNPDUP()
onBeforeMount(() => {
  store.getData()
})

onUnmounted(() => {
  resetFormData()
})


function resetFormData() {
  // Call the resetFORM method from your store
  // store.resetFORM()

  // Set initial values after reset
  // store.params.tgl = date.formatDate(Date.now(), 'YYYY-MM-DD')
  // store.form.tglnpdls = date.formatDate(Date.now(), 'YYYY-MM-DD')
  // store.reqs.tgl = date.formatDate(Date.now(), 'YYYY-MM-DD')
  store.disabled = false
  // store.disabledx = false
  store.form.rincians = []
  store.transall = []
  store.transallserahterima = []
  // Load initial data
  // store.getDataBidang()
}
// onMounted(() => {
//   // console.log(compSigna.value)
//   initForm()
// })

// function initForm() {
//   store.form.nonpdls = ''
//   store.form.kodepptk = ''
//   store.form.pptk = ''
//   store.form.kodebidang = ''
//   store.form.bidang = ''
//   store.form.bast = ''
//   store.form.serahterimapekerjaan = ''
//   store.form.noserahterima = ''
//   store.form.nokontrak = ''
//   store.form.kodepenerima = ''
//   store.form.kegiatanblud = ''
//   store.form.kodekegiatanblud = ''
//   store.form.keterangan = ''
//   store.form.biayatransfer = 0
//   store.form.rincians = []

//   store.transall = []
//   store.disabled = false
// }
</script>
