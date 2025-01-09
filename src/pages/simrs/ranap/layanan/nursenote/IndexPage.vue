<template>
  <q-card flat bordered class="bg-transparent full-height column q-ma-xs">
    <div class="col-auto bg-primary text-white q-pa-md">
      <div class="row justify-between items-center">
        <div>
          <div class="f-20">
            LIST NURSE NOTE
          </div>
          <div class="caption text-grey-4">
            Sebagai Catatan Perkembangan Pasien
          </div>
        </div>
        <div>
          <q-btn rounded outline color="white" @click="isForm = !isForm">
            <q-icon name="icon-mat-add" size="xs" /><span class="q-ml-xs">Tambah</span>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="col full-height">
      <!-- <ListSoap :pasien="pasien" :kasus="kasus" :nakes="nakes" :items="store.items" /> -->
    </div>

    <DialogFormAdd v-model="isForm" />
  </q-card>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useTindakanRanapStore } from 'src/stores/simrs/ranap/tindakan'

// const ListSoap = defineAsyncComponent(() => import('./comp/ListSoap.vue'))
const DialogFormAdd = defineAsyncComponent(() => import('./comp/DialogFormAdd.vue'))

const tindakan = useTindakanRanapStore()

const props = defineProps({
  pasien: { type: Object, default: () => null },
  kasus: { type: Object, default: () => null },
  nakes: { type: String, default: null }
})

const isForm = ref(false)


onMounted(() => {
  Promise.all([
    tindakan.getTindakan(props?.pasien)
  ])
})

</script>
