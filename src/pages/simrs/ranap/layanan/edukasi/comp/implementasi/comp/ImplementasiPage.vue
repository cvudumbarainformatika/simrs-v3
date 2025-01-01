<template>
  <q-card flat bordered class="bg-transparent full-height column">
    <div class="col-auto bg-primary text-white q-pa-md">
      <div class="row justify-between items-center">
        <div>
          .
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

    <!-- <DialogForm v-model="settings.isForm" :pasien="pasien" :kasus="kasus" :nakes="nakes" @exit="settings.isForm = false" /> -->
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  }
})

const isForm = ref(false)
</script>