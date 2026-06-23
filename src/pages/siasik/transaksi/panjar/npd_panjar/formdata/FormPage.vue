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
import FormHeader from './inpage/FormHeader.vue'
import ListRincian from './inpage/ListRincian.vue'
import { onUnmounted } from 'vue';
import { date } from 'quasar';
import { storeNpdPanjar } from 'src/stores/siasik/transaksi/panjar/npd_panjar/store_npd_panjar';
const store = storeNpdPanjar()
const ambil = formKontrakPekerjaan()
onBeforeMount(() => {
  store.getDataBidang()
  ambil.getPihaktiga()
})

onUnmounted(() => {
  resetFormData()
})


function resetFormData() {
  // Call the resetFORM method from your store
  store.resetFORM()

  // Set initial values after reset
  store.params.tgl = date.formatDate(Date.now(), 'YYYY-MM-DD')
  store.form.tglnpdpanjar = date.formatDate(Date.now(), 'YYYY-MM-DD')
  store.reqs.tgl = date.formatDate(Date.now(), 'YYYY-MM-DD')
  store.disabled = false
  store.disabledx = false
  // store.form.rincians = []
  store.form.nopp = null
  store.form.koderek50 = null
  store.form.rincianbelanja50 = null
  store.form.koderek108 = null
  store.form.uraian108 = null
  store.form.itembelanja = null
  store.form.volume = 0
  store.form.harga = 0
  store.form.total = 0
  store.form.satuan = null
  store.form.volumepermintaanpanjar = 0
  store.form.hargapermintaanpanjar = 0
  store.form.totalpermintaanpanjar = 0
  store.form.idpp = null
  store.transall = []
  store.rincians = []
  // Load initial data
  store.getDataBidang()
}

</script>
