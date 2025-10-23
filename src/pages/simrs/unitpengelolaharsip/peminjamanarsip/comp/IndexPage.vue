<template>
  <div class="column full-height q-ma-xs" style="overflow: hidden;">
    <div class="column full-height">
      <div class="col-auto bg-red">
        <q-tabs v-model="store.tab" no-caps inline-label rounded class=" bg-grey-4 shadow-2 text-grey-8" align="left"
          dense active-color="yellow" active-bg-color="primary" @update:model-value="cekPanel">
          <q-tab v-for="(item, i) in store.tabs" :key="i" :name="item.page" :label="item.name"
            style="border-top-left-radius: 100px;border-bottom-right-radius: 100px;width: 100%;" />
        </q-tabs>
      </div>
      <div class="col-grow">
        <q-tab-panels v-model="store.tab" animated class="full-height">
          <q-tab-panel v-for="(panel, n) in store.tabs" :key="n" :name="panel.page" class="full-height q-pa-none">
            <component :is="cekPanel()" :organisasi="storeorganisasi.itemsorganisasi"
              :kelasifikasi="storeklaisifikasi.items" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script setup>
import { findWithAttr } from 'src/modules/utils';
import { useArsipMasterKelasifikasiStore } from 'src/stores/arsip/master/mkelasifikasi';
import { useUnitPengelolaharsippeminjamanStore } from 'src/stores/simrs/unitpengelolaarsip/peminjamanarsip';
import { defineAsyncComponent, onMounted } from 'vue';

const store = useUnitPengelolaharsippeminjamanStore()
const storeorganisasi = useUnitPengelolaharsippeminjamanStore()
const storeklaisifikasi = useArsipMasterKelasifikasiStore()
const comp = [
  { nama: 'formpeminjamandokumen', page: defineAsyncComponent(() => import('./FormPeminjaman.vue')) },
  { nama: 'listpeminjamandokumen', page: defineAsyncComponent(() => import('./PageListPeminjaman.vue')) }
]
const cekPanel = () => {
  const val = store.tab
  const ganti = val.replace(/ /g, '')
  const arr = findWithAttr(comp, 'nama', ganti)
  return arr >= 0 ? comp[arr].page : ''
}

onMounted(() => {
  // store.getdatapegawai()
  storeorganisasi.getDataorganisasi()
  storeklaisifikasi.getMkelasifikasi()
})

</script>
