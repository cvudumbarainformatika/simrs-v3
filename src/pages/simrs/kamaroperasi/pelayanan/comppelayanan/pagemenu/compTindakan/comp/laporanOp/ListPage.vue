<template>
  <div class="bg-white full-height column scroll q-pb-xl">

    <div class="col-auto bg-teal text-white">
      <div class="q-pa-sm">
        Laporan Operasi tersimpan
      </div>
    </div>
    <div class="col full-height relative-position">
      <div v-if="!!pasien?.laporanop">
        <div class="row">
          <div class="col-4">Tanggal</div>
          <div class="col-8">{{ dateFull(pasien?.laporanop?.rs3) }}</div>
        </div>
        <div class="row">
          <div class="col-4">Tindakan</div>
          <div class="col-8">{{ pasien?.laporanop?.mastertindakanoperasi?.rs2 }}</div>
        </div>
        <div class="row">
          <div class="col-4">Tarif</div>
          <div class="col-8">{{
            formatDouble((pasien?.laporanop?.rs5 ?? 0) + (pasien?.laporanop?.rs6 ?? 0) + (pasien?.laporanop?.rs7 ??
              0))
          }}</div>
        </div>
        <div class="row q-mx-xl justify-end">
          <q-btn icon="delete" flat dense color="negative" :loading="store.loading" :disable="store.loading"
            @click="store.hapusTindakanOp(pasien?.laporanop)" />
        </div>

      </div>
      <div v-else> <app-no-data-small /></div>
      <!-- {{ pasien?.tindakanop }} -->
    </div>
  </div>
</template>
<script setup>
import { dateFull, formatDouble } from 'src/modules/formatter'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const store = useLaporanOperasiStore()
</script>
