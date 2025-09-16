<template>
  <div class="fit">
    <div v-if="store?.igdBefore === null" class="column full-height flex-center">
      Tidak Ada Data IGD Sebelumnya <br>
      Pasien Bukan Dari IGD
    </div>
    <div v-else class="column full-height">
      <!-- <ListAnamnesis :pasien="store.pasienIgd" :loadingaja="false" :key="store?.pasienIgd" :bisa-edit-hapus="false" /> -->
      <div class="col-auto">
        <q-tabs v-model="tab" dark dense class="bg-dark text-grey" active-color="white" indicator-color="white"
          align="justify">
          <q-tab name="resume" label="Resume Medis IRD" />
          <!-- <q-tab name="movies" label="Movies" /> -->
        </q-tabs>
      </div>
      <div class="col full-height">
        <q-tab-panels v-model="tab" animated class="full-height">
          <q-tab-panel name="resume" class="full-height q-pa-none">
            <ResumePage judul="Resume Medis" :pasien="pasien" />
          </q-tab-panel>

          <!-- <q-tab-panel name="kebidanan" class="full-height q-pa-none">
            
          </q-tab-panel> -->

          <!-- <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel> -->
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHistoryPasienRanapStore } from 'src/stores/simrs/ranap/history'
import { defineAsyncComponent, ref } from 'vue'



import ResumePage from 'pages/simrs/igd/layanan/dokumen/dokumenisi/Resume/ResumePage.vue';

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
const store = useHistoryPasienRanapStore()
const tab = ref('resume')
</script>
