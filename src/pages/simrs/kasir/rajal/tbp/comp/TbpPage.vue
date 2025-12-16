<template>
  <div class="fit">
    <ListPage :masterkasir="store.masterkasir" v-if="isList" @add="
      () => {
        store.items = null
        isList = false
      }
    " @edit="
      (data) => {
        store.item = data
        store.verifikasi = data?.status_verif
        isList = false
      }
    " />

    <FormPage v-else :data="store?.item" @back="isList = true" />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'

import ListPage from './List/ListPage.vue'
import FormPage from './Form/FormPage.vue'
import { useTbpKasirStore } from 'src/stores/simrs/kasir/tbp'

const store = useTbpKasirStore()
const isList = ref(true)
store.item = []

onMounted(() => {

  store.getmasterkasir()
  store.getDataTbp()

})
</script>
