<template>
  <div class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header">
      <HeaderComp ada-per-page ada-refresh use-full label-cari="Cari noreg / norm" :search="store.params.q"
        :per-page="store.params.per_page" @cari="store.setSearch" @refresh="store.refresh"
        @set-per-page="store.setPerPage" />
    </div>
    <q-card flat no-shadow square class="my-flex-1 scroll">
      <q-scroll-area style=" height:calc( 100% - 80px);">
        <ListPermintaan @buka="emit('buka', $event)" />
      </q-scroll-area>
      <div v-if="Object.keys(store.meta)?.length" class="absolute-bottom bg-primary text-white">
        <BottomComp :meta="store.meta" @go-to="store.setPage" />
      </div>
    </q-card>
  </div>
</template>
<script setup>
import { useStyledStore } from 'src/stores/app/styled'
import { usePemintaanReturDepoStore } from 'src/stores/simrs/farmasi/retur/depo/permintaan'
import { defineAsyncComponent, onMounted } from 'vue'

const style = useStyledStore()
const store = usePemintaanReturDepoStore()
const emit = defineEmits(['buka'])

const HeaderComp = defineAsyncComponent(() => import('./comp/HeaderComp.vue'))
const BottomComp = defineAsyncComponent(() => import('./comp/BottomComp.vue'))
const ListPermintaan = defineAsyncComponent(() => import('./comp/ListPermintaanPage.vue'))
onMounted(() => {
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
