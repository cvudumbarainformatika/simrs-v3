<template>
  <div class="column full-height">
    <div class="col-auto fixed-top" style="z-index:1 ;">
      <HeaderComp :search="store.params.q" :per-page="store.params.per_page" @fullscreen="style.setComponentFull"
        @set-search="store.setQ" @set-row="store.setPerPage" @set-periode="store.setPeriode" @refresh="store.getList" />
    </div>
    <div class="col full-height" style="padding-bottom: 60px; padding-top:60px">
      <listForm />
    </div>
    <div class="fixed-bottom">
      <BottomComp v-if="store.meta !== null" :key="store.meta" :meta="store.meta" @go-to="store.setPage" />
    </div>
  </div>
</template>

<script setup>
import { useStyledStore } from 'src/stores/app/styled'
import { defineAsyncComponent, onMounted, watch, ref } from 'vue'
import { useLogActivityFarmasiStore } from 'src/stores/simrs/farmasi/activity/activity'

const style = useStyledStore()

const store = useLogActivityFarmasiStore()

const BottomComp = defineAsyncComponent(() => import('./comp/CompBottom.vue'))
const HeaderComp = defineAsyncComponent(() => import('./comp/CompHeader.vue'))
const listForm = defineAsyncComponent(() => import('./comp/CompList.vue'))


onMounted(() => {
  store.hariIni()
  store.getList()
})
</script>
