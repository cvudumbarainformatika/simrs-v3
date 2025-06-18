<template>
  <!-- <div v-if="store?.loadingTerima">
    <app-loading />
  </div>
  <div v-else-if="pasien?.konsultasi?.length <= 0 && !store.loadingTerima">
    <app-no-data />
  </div> -->
  <div class="q-pa-md" style="max-width: 100%">
    <div class="col-4 full-height ">
      <div v-if="store?.loadingTerima">
        <app-loading />
      </div>
      <div v-else-if="pasien?.dokumenluar?.length <= 0 && !store.loadingTerima" class="full-height column flex-center">
        <app-no-data />
      </div>
      <div v-else class="full-height scroll">
        <div class="q-pa-sm q-gutter-sm row items-start bg-grey-4">
          <ListComp :items="pasien?.dokumenluar" @hapus="hapusItem" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

import ListComp from 'src/pages/simrs/igd/layanan/uploaddokumen/compDokUpload/ListComp.vue';
import { useKlaimPenjaminanStore } from 'src/stores/simrs/penjaminan/klaim';

const store = useKlaimPenjaminanStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

</script>
