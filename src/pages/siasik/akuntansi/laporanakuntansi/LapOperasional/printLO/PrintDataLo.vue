<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Cetak LAPORAN OPERASIONAL</div>
            <q-space />

            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div id="printMe" class="row justify-between full-width q-pt-md">
            <!-- <div class="row"> -->
            <div class="col-2 flex-start">
              <div class="row justify-center">
                <q-img src="~assets/images/logo_kota_original.png" spinner-color="white"
                  style="height: 3.3cm; width: 2.6cm" />
              </div>
            </div>
            <div class="col-6">
              <div class="row justify-center text-center text-h6">
                PEMERINTAH KOTA PROBOLINGGO
              </div>
              <div class="row justify-center text-center text-h7 text-weight-bold">
                DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
              </div>
              <div class="row justify-center text-center text-h5 text-weight-bold">
                UOBK RSUD DOKTER MOHAMAD SALEH
              </div>
              <div class="row justify-center text-center text-h8">
                Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335)
                432702
              </div>
              <div class="row justify-center text-center text-h8 text-weight-bold">
                PROBOLINGGO 67219
              </div>
            </div>
            <div class="col-2 flex-end">
              <div class="row justify-center">
                <q-img src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 3cm; width: 3cm" />
              </div>
            </div>

            <div class="col-12 q-pt-md">
              <div class="row justify-center text-weight-bold q-py-xs">
                LAPORAN OPERASIONAL
              </div>
              <div class="row justify-center text-weight-bold q-py-xs">
                Periode {{ store.display.dari + ' - ' + store.display.sampai }}
              </div>
            </div>
            <q-card-section>
              <div class="row full-width">
                <div class="items-center full-width">
                  <template
                    v-if="store.reqs.jenislo === 1 || (store.hasilpendapatan?.length > 0 && store.hasilbeban?.length > 0)">
                    <listData />
                  </template>
                  <template
                    v-else-if="store.reqs.jenislo === 2 || (store.psappendapatan?.length > 0 || store.psapbeban?.length > 0 || store.psapnonoperasional > 0 || store.psapbebanluarbiasa > 0)">
                    <listDataPsap />
                  </template>
                  <template v-else>
                    <div class="row q-pa-md full-width text-subtitle1 flex-center">
                      <q-icon class="q-pr-sm" size="sm" name="icon-mat-warning" />
                      Silahkan Pilih Parameter Dulu
                    </div>
                  </template>
                </div>
              </div>
            </q-card-section>

            <div class="row q-pa-xl full-width justify-end">
              <div class="q-py-xs text-center" v-for="it in tt.ttd" :key="it">
                Probolinggo {{ store.display.sekarang }}
                <div class="text-bold">
                  Pengguna Anggaran
                </div>
                <div style="padding-bottom: 40px" />
                <div class="underline text-bold q-py-xs">
                  {{ it.nama }}
                  <div class="garis-bawah" style="text-decoration-line: underline;" />
                </div>
                <div>
                  {{ it.nip }}
                </div>
              </div>
            </div>
            <!-- </div> -->
          </div>
        </q-page-container>
        <q-footer elevated>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                  <q-tooltip class="primary" :offset="[10, 10]">
                    Print
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useBukubesarStore } from 'src/stores/siasik/akuntansi/bukubesar/bukubesar'
import { onMounted, ref } from 'vue'
import { useLaporanOperasionalStore } from 'src/stores/siasik/laporan/laporanoperasional/lapoperasional'

import listData from '../inpage/ListDataLo.vue'
import listDataPsap from '../inpage/ListDataLoPsap.vue'
const tt = useBukubesarStore()
const store = useLaporanOperasionalStore()
onMounted(() => {
  tt.getTtd()
  // store.getDataBukubesar()
})
const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Operasional | SIASIK',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}

// const init = () => {
//   store.dataTersimpan()
// }
// const cetakNPD = ref(false)
// function hitungSubtotal () {
//   const arr = store.form.rincians
//   const obj = arr?.length ? arr.map((x) => x.nominalpembayaran) : []
//   const subtotal = obj.reduce((x, y) => x + y, 0)
//   // console.log('jumlah', obj)
//   // const total = nominal.reduce((x, y) => x + y, 0)
//   return subtotal
// }
</script>
<style lang="scss" scoped>
.kop {
  border-bottom: 1px solid grey;
  width: fit-content;
}

.logo_kanan {
  right: 5%;
  position: relative;
}

.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.underline {
  text-decoration-line: underline;

}
</style>
