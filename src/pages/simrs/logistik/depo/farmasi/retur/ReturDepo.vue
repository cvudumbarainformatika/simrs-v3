<template>
  <div class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header">
      <HeaderComp ada-per-page ada-refresh use-full label-cari="Cari noreg / norm" label-cari-dua="Cari nama obat"
        :search="store.params.q" :search-dua="store.params.nama" :per-page="store.params.per_page"
        :flag="store.params.flag" @cari="store.setSearch" @cari-dua="store.setSearchDua" @refresh="store.refresh"
        @set-per-page="store.setPerPage" @set-flag="store.setFlag" @set-periode="(val) => store.setPeriodik(val)"
        ada-flag ada-search-dua ada-tanggal />
    </div>
    <q-card flat no-shadow square class="my-flex-1 scroll">
      <q-scroll-area style=" height:calc( 100% - 80px);">
        <ListComp />
      </q-scroll-area>
      <div v-if="Object.keys(store.meta)?.length" class="absolute-bottom bg-primary text-white">
        <BottomComp :meta="store.meta" @go-to="store.setPage" />
      </div>
    </q-card>

    <!-- dialogPage -->
    <app-fullscreen-blue v-model="store.isOpen" @close="store.setClose">
      <template #default>
        <DialogPage />
      </template>
    </app-fullscreen-blue>
  </div>
</template>

<script setup>
import { notifErrVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useStyledStore } from 'src/stores/app/styled'
import { usePemintaanReturDepoStore } from 'src/stores/simrs/farmasi/retur/depo/permintaan'
import { useReturDepoStore } from 'src/stores/simrs/farmasi/retur/depo/returdepo'
import { defineAsyncComponent, onMounted, watch } from 'vue'

const style = useStyledStore()
const store = useReturDepoStore()
const apps = useAplikasiStore()
const permintaan = usePemintaanReturDepoStore()

const HeaderComp = defineAsyncComponent(() => import('./comp/HeaderComp.vue'))
const BottomComp = defineAsyncComponent(() => import('./comp/BottomComp.vue'))
const ListComp = defineAsyncComponent(() => import('./comp/ListComp.vue'))
const DialogPage = defineAsyncComponent(() => import('./comp/DialogPage.vue'))

onMounted(() => {
  const depoRet = ['Gd-04010102', 'Gd-02010104', 'Gd-05010101']
  const depos = apps.depos.filter(a => depoRet.includes(a.value))
  const depo = depos.filter(a => a.value === apps?.user?.kdruangansim)
  if (depo?.length) store.setParams('kddepo', apps?.user?.kdruangansim)
  else notifErrVue('Yang bisa Melakukan retur hanya Depo Rawat Inap, Depo IGD dan Depo Rawat Jalan.')
  store.getDataTable()
})
watch(() => apps?.user?.kdruangansim, (obj) => {
  const depoRet = ['Gd-04010102', 'Gd-02010104', 'Gd-05010101']
  const depos = apps.depos.filter(a => depoRet.includes(a.value))
  const depo = depos.filter(a => a.value === obj)
  console.log('depos', depos)
  if (depo?.length) store.setParams('kddepo', obj)
  else {
    notifErrVue('Yang bisa Melakukan retur hanya Depo Rawat Inap, Depo IGD dan Depo Rawat Jalan.')
    store.items = []
    store.meta = {}
  }
  store.getDataTable()
  permintaan.getData()
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
