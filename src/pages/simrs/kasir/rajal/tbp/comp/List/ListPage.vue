<template>
  <div class="fit">
    <q-page class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
      <div class="header bg-primary text-white">
        <HeaderComp :tanggal="store.params.tgl" :search="store.params.q" :per-page="store.params.per_page"
          :masterkasir="props.masterkasir" @fullscreen="style.setComponentFull"
          @set-tanggal="(val) => store.setDate(val)" @set-search="store.setQ" @set-row="store.setPerPage"
          @add="emits('add')" />
      </div>

      <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
        <q-scroll-area style="height: calc(100% - 1px);">
          <ListTbp :key="store.items" :items="store.items" :loading="store.loading" @edit="edit($event)"
            @hapus="hapus($event)" />
        </q-scroll-area>
        <!-- <div class=" absolute-bottom bg-primary text-white z-top">
          <BottomComp :meta="store?.meta" @go-to="store.goToPage" />
        </div> -->
      </q-card>
      <BottomComp :meta="store?.meta" @go-to="store.goToPage" />
    </q-page>
  </div>
</template>
<script setup>
import { useStyledStore } from 'src/stores/app/styled';
import HeaderComp from './HeaderComp.vue'
import ListTbp from './ListTbp.vue'
import BottomComp from './BottomComp.vue'
import { useTbpKasirStore } from 'src/stores/simrs/kasir/tbp';

const style = useStyledStore()
const store = useTbpKasirStore()
const emits = defineEmits(['add', 'edit', 'hapus'])
const props = defineProps({
  masterkasir: {
    type: Array,
    default: () => []
  }
})

function hapus(val) {
  emits('hapus', val)
}

function edit(val) {
  emits('edit', val)
}
</script>
