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
import FormHeader from './inpage/FormHeader.vue'
import ListRincian from './inpage/ListRincian.vue'
import { onBeforeMount, onUnmounted } from 'vue'
import { date } from 'quasar'
import { useFormNPKlangsungStore } from 'src/stores/siasik/transaksi/ls/npkls/form'
const store = useFormNPKlangsungStore()

onBeforeMount(() => {
  // store.initReset(props.data)
})
onUnmounted(() => {
  resetFormData()
})
function resetFormData() {
  store.resetFORM()

  store.formheader.tglnpk = date.formatDate(Date.now(), 'YYYY-MM-DD')

}

</script>
