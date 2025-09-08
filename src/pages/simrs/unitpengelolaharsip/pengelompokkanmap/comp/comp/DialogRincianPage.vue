<template>
  <div class="q-pa-md q-gutter-sm ">
    <q-dialog v-model="store.dialogrincian" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-space />

          <q-btn dense flat icon="icon-mat-close" v-close-popup>
            <q-tooltip class="bg-black text-white">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-xs">
          <div class="header bg-primary text-white">
            <HeaderPage @tambaharsip="dialogtambaharsip()" />
          </div>
          <ListArsipPage />
          <div class="q-pa-sm">
            <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
              <q-scroll-area style="height: calc(100% - 1px);">
                <ListArsipPage />
              </q-scroll-area>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <DialogCariArsip :items="storearsip.itemsuntukmap" :users="props.users" :organisasi="props.organisasi" />
</template>
<script setup>
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap';
import { onMounted, ref } from 'vue';
import HeaderPage from './HeaderPage.vue';
import ListArsipPage from './ListArsipPage.vue';
import DialogCariArsip from './DialogCariArsip.vue';
import { useUnitPengelolahArsipStore } from 'src/stores/simrs/unitpengelolaarsip/arsip';

const maximizedToggle = ref(true)
const store = useUnitPengelolaharsipMapStore()
const storearsip = useUnitPengelolahArsipStore()

const props = defineProps({
  users: { type: String, default: '' },
  organisasi: {
    type: Array,
    default: () => []
  },
})

onMounted(() => {
  //storearsip.params.bidangbagian = props.users
  storearsip.getDataarsip()
})

function dialogtambaharsip() {
  storearsip.itemsuntukmap = []
  store.dialogtambaharsip = true
}
</script>
