<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="props?.loading" />
      <EmptyData v-else-if="!props?.items?.length && !props?.loading" />

      <div v-else class="row q-mt-sm q-ml-sm q-col-gutter-md justify-center items-start">
        <div v-for="(item, i) in datamap" :key="i" class="col-auto">
          <q-card class="cursor-pointer folder-card" flat bordered @click="dialogrincian(item.id)">
            <div class="flex justify-center q-pa-sm">
              <q-btn flat round dense size="sm"
                style="background: rgba(0,0,0,0.15); top: 0; left: 0; margin: 2px;z-index: 10;" class="absolute"
                @click.stop="editmap(item)">
                <q-icon name="icon-mat-edit" size="18px" color="primary" />
              </q-btn>
              <q-btn flat round dense size="sm"
                style="background: rgba(0,0,0,0.15); top: 0; right: 0; margin: 2px; z-index: 10;" class="absolute"
                @click="hapusmap(item)">
                <q-icon name="icon-mat-delete" size="18px" color="red" />
              </q-btn>
              <q-img :src="folderIcon" style="width:120px; height:130px" fit="contain" no-native-menu />
            </div>
            <q-card-section class="q-pa-xs text-center">
              <div class="text-subtitle2 text-weight-medium ellipsis" style="max-width: 120px" :title="item.namamap">
                {{ item?.namamap }}
              </div>
              <q-tooltip anchor="top middle" self="bottom middle">
                {{ item?.namamap }} <br> {{ item?.keterangan }}
              </q-tooltip>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <DialogRincianPage :hederdetail="props.items" :users="props.users" :organisasi="props.organisasi" />
    <DialogFormPage />
  </div>
</template>

<script setup>
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
import DialogRincianPage from './comp/DialogRincianPage.vue'
import { computed } from 'vue'
import folderIcon from 'src/assets/images/folderx.png'
import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap'
import DialogFormPage from './DialogFormPage.vue'

const store = useUnitPengelolaharsipMapStore()
const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  users: { type: String, default: '' },
  organisasi: {
    type: Array,
    default: () => []
  },
})

const datamap = computed(() => {
  return [...props?.items].sort((a, b) => a.namamap.localeCompare(b.namamap))
})

function editmap(item) {
  store.initreset()
  store.form.id = item.id
  store.form.namamap = item.namamap
  store.form.kodeorganisasi = item.kodeorganisasi
  store.form.keterangan = item.keterangan
  store.dialog = true
}

function dialogrincian(val) {
  store.dialogrincian = true
  store.formisi.idmap = val
  store.getrincianmap(val)
}
</script>

<style scoped>
.folder-card {
  width: 140px;
  transition: all 0.2s ease-in-out;
}

.folder-card:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
