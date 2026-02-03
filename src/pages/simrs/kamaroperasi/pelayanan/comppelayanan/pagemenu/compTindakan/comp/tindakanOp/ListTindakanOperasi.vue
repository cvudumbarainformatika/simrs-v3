<template>
  <div class="bg-white full-height column">

    <div class="col-auto bg-teal text-white">
      <div class="q-pa-sm">
        Tindakan Operasi tersimpan
      </div>
    </div>
    <div class="col full-height relative-position">
      <div v-if="!!pasien?.tindakanop" class="cursor-pointer" @click="assignForm(pasien?.tindakanop)">
        <div class="row">
          <div class="col-4">Tanggal</div>
          <div class="col-8">{{ dateFull(pasien?.tindakanop?.rs3) }}</div>
        </div>
        <div class="row">
          <div class="col-4">Tindakan</div>
          <div class="col-8">{{ pasien?.tindakanop?.mastertindakanoperasi?.rs2 }}</div>
        </div>
        <div class="row">
          <div class="col-4">Tarif</div>
          <div class="col-8">{{
            formatDouble((pasien?.tindakanop?.rs5 ?? 0) + (pasien?.tindakanop?.rs6 ?? 0) + (pasien?.tindakanop?.rs7 ??
              0))
          }}</div>
        </div>
        <div class="row q-mt-lg justify-end">
          <q-btn icon="delete" flat dense color="negative" :loading="store.loading"
            :disable="store.loading || !!pasien?.laporanop" @click="store.hapusTindakanOp(pasien?.tindakanop)" />
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
function assignForm (data) {
  console.log('data', data)

}
</script>
