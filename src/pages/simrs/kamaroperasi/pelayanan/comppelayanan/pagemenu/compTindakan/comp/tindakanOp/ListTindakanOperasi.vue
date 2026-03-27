<template>
  <div class="bg-white full-height column">

    <div class="col-auto bg-teal text-white">
      <div class="q-pa-sm">
        Tindakan Operasi tersimpan
      </div>
    </div>
    <div class="col full-height relative-position">
      <div v-if="pasien?.manytindakanop?.length > 0">
        <div v-for="tindakanop in pasien?.manytindakanop" :key="tindakanop">
          <div class="row q-mt-sm">
            <div class="col-4">Nota</div>
            <div class="col-8 text-weight-bold">{{ tindakanop?.rs2 }}</div>
          </div>
          <div class="row">
            <div class="col-4">Tanggal</div>
            <div class="col-8">{{ dateFull(tindakanop?.rs3) }}</div>
          </div>
          <div class="row">
            <div class="col-4">Tindakan</div>
            <div class="col-8">{{ tindakanop?.mastertindakanoperasi?.rs2 }}</div>
          </div>
          <div class="row">
            <div class="col-4">Biaya</div>
            <div class="col-8">{{
              formatDouble((tindakanop?.rs5 ?? 0) + (tindakanop?.rs6 ?? 0) + (tindakanop?.rs7 ??
                0))
            }}</div>
          </div>
          <div class="row text-weight-bold">
            <div class="col-4">Dokter Operator</div>
            <div class="col-8">{{ cariNaker(tindakanop?.rs9) }}</div>
          </div>
          <div class="row">
            <div class="col-4">Asisten Operator</div>
            <div class="col-8">{{ cariNaker(tindakanop?.rs11) }}</div>
          </div>
          <div class="row text-weight-bold">
            <div class="col-4">Dokter Anastesi</div>
            <div class="col-8">{{ cariNaker(tindakanop?.rs12) }}</div>
          </div>
          <div class="row">
            <div class="col-4">Asisten Anastesi</div>
            <div class="col-8">{{ cariNaker(tindakanop?.rs13) }}</div>
          </div>
          <div class="row q-mt-lg justify-end">
            <q-btn icon="edit" flat dense color="primary" :loading="store.loading"
              :disable="store.loading || getLaporan(tindakanop)" @click="() => {
                emits('assignForm', tindakanop)
                store.assignFormTindakan(tindakanop)
              }" />
            <q-btn icon="delete" flat dense color="negative" :loading="store.loading"
              :disable="store.loading || getLaporan(tindakanop)" @click="store.hapusTindakanOp(tindakanop)" />
          </div>
          <q-separator class="q-mt-sm" />
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
const emits = defineEmits(['assignForm'])
const store = useLaporanOperasiStore()
function assignForm (data) {
  console.log('data', data)

}
function getLaporan (val) {
  console.log('get laporan', props.pasien?.laporanop?.find(x => x.rs2 === val?.rs2))

  return !!props.pasien?.laporanop?.find(x => x.rs2 === val?.rs2) ?? false
}
function cariNaker (val) {
  const dat = val?.split(';').filter(x => !!x)
  const nakes = []
  dat.forEach(x => {
    const nak = store.nakes.find(y => y.kdpegsimrs === x)
    if (nak) nakes.push(nak)
  })
  // console.log('cari nakes', dat)
  return nakes.length > 0 ? nakes.map(x => x.nama).join(', ') : ''


}
</script>
