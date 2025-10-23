<template>
  <div class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header">
      <HeaderComp ada-per-page ada-refresh use-full label-cari="Cari noreg / norm" label-cari-dua="Cari nama obat"
        label-tanggal="Retur dari tanggal" :search="store.params.q" :search-dua="store.params.nama"
        :per-page="store.params.per_page" :flag="store.params.flag" @cari="store.setSearch"
        @cari-dua="store.setSearchDua" @refresh="store.refresh" @set-per-page="store.setPerPage"
        @set-periode="(val) => store.setPeriodik(val)" ada-search-dua ada-tanggal />
    </div>
    <q-card flat no-shadow square class="my-flex-1 scroll">
      <q-scroll-area style=" height:calc( 100% - 80px);">
        <ListPermintaan />
      </q-scroll-area>
      <div v-if="Object.keys(store.meta)?.length" class="absolute-bottom bg-primary text-white">
        <BottomComp :meta="store.meta" @go-to="store.setPage" />
      </div>
    </q-card>
  </div>
</template>
<script setup>
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useStyledStore } from 'src/stores/app/styled'
import { useListReturDepoStore } from 'src/stores/simrs/farmasi/retur/depo/list'
import { defineAsyncComponent, onMounted, watch } from 'vue'

const style = useStyledStore()
const store = useListReturDepoStore()
const apps = useAplikasiStore()


const HeaderComp = defineAsyncComponent(() => import('./comp/HeaderComp.vue'))
const BottomComp = defineAsyncComponent(() => import('./comp/BottomComp.vue'))
const ListPermintaan = defineAsyncComponent(() => import('./comp/ListReturComp.vue'))
onMounted(() => {
  const depo = apps.depos.filter(a => a.value === apps?.user?.kdruangansim)
  if (depo?.length) store.setParams('kddepo', apps?.user?.kdruangansim)
  else notifErrVue('Yang bisa Melakukan retur hanya Depo Rawat Inap, Depo IGD dan Depo Rawat Jalan.')
  store.getData()
})
watch(() => apps?.user?.kdruangansim, (obj) => {
  const depo = apps.depos.filter(a => a.value === obj)
  if (depo?.length) store.setParams('kddepo', obj)
  else {
    notifErrVue('Yang bisa Melakukan retur hanya Depo Rawat Inap, Depo IGD dan Depo Rawat Jalan.')
    store.items = []
    store.meta = {}
  }
  store.getData()
})
</script>
<style lang="scss" scoped>
.container--q-header {
  display: flex;
  flex-direction: column;
  /*or min-height*/
  height: calc(100vh - 87px);
}

.container-no-header {
  display: flex;
  flex-direction: column;
  /*or min-height*/
  height: calc(100vh - 52px);
}
</style>
