<template>
  <div class="bg-white q-pa-xs">
    <div ref="refTop" class="fixed-top bg-white" style="margin-top:50px; margin-left: 60px; z-index: 10">
      <div class="row bg-primary text-white q-pa-sm q-mb-sm print-hide">
        <div class="f-14 text-weight-bold">
          Laporan Telaah Resep
        </div>
      </div>
      <div class="row justify-between print-hide">
        <div class="col-grow">
          <div class="row q-col-gutter-sm q-my-sm">
            <div class="col-2">
              <app-autocomplete v-model="store.params.kode_ruang" label="Pilih Gudang / Depo" autocomplete="nama"
                option-label="nama" option-value="value" outlined :source="store.gudangs" :loading="store.loading" />
            </div>
            <div class="col-2">
              <app-autocomplete v-model="store.params.bulan" label="Pilih Bulan" autocomplete="nama" option-label="nama"
                option-value="value" outlined :source="store.bulans" :loading="store.loading" />
            </div>
            <div class="col-2">
              <app-input v-model="store.params.tahun" label="Tahun" outlined :loading="store.loading" />
            </div>
            <div class="col-2">
              <app-btn label="Ambil Data" :disable="store.loading" :loading="store.loading"
                @click="store.getDataTable" />
            </div>
          </div>
        </div>
        <div class="col-auto q-mr-md">
          <div class="row items-center">
            <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useLaporanTelaahResepObatStore } from 'src/stores/simrs/laporan/farmasi/telaah/telaah'
import { onMounted, ref } from 'vue'
const store = useLaporanTelaahResepObatStore()
const refTop = ref(null)
const h = ref(0)
onMounted(() => {
  // console.log('h', refTop.value.clientHeight)
  h.value = refTop.value?.clientHeight
})
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Persediaan Farmasi'

}
</script>
