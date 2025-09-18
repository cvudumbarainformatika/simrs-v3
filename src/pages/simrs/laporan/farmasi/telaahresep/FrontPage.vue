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
              <app-autocomplete v-model="store.params.jenis" label="Jenis" autocomplete="nama" option-label="nama"
                option-value="nama" outlined :source="store.jenises" :loading="store.loading"
                @selected="jenisSelected" />
            </div>
            <div class="col-2">
              <app-autocomplete v-model="store.params.kode_ruang" label="Pilih Gudang / Depo" autocomplete="nama"
                option-label="nama" option-value="value" outlined :source="store.gudangs" :loading="store.loading" />
            </div>
            <div class="col-2">
              <app-input-date-human :model="store.disp.from" label="dari tanggal" outlined @db-model="setFrom"
                @set-display="setFromDisp" />
            </div>
            <div class="col-2">
              <app-input-date-human :model="store.disp.to" label="sampai tanggal" outlined @db-model="setTo"
                @set-display="setToDisp" />
            </div>
            <div class="col-2">
              <app-btn label="Ambil Data" :disable="store.loading" :loading="store.loading"
                @click="store.getDataTable" />
            </div>
          </div>
        </div>
        <div class="col-auto q-mr-md">
          <div class="row items-center justify-bentween q-mr-md">
            <div class="col-auto text-weight-bold">Total Data : {{ store.meta?.total }}</div>
          </div>
          <!--
          <div class="row items-center">
            <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
          </div>
          -->
        </div>
      </div>
    </div>
    <div :style="`margin-top:${h + 5}px;`" />
    <div>
      <div class="row items-center garis-bawah">
        <div class="col-2">
          <q-img src="~assets/images/logo-kota-grey.png" spinner-color="white"
            style="height: 3.56cm; max-width: 2.86cm" />
        </div>
        <div class="col-8">
          <div class="row justify-center f-18">
            PEMERINTAH KOTA PROBOLINGGO
          </div>
          <div class="row justify-center f-12 text-weight-bold">
            DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
          </div>
          <div class="row justify-center f-20 text-weight-bold">
            UOBK RSUD DOKTER MOHAMAD SALEH
          </div>
          <div class="row justify-center f-14">
            Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335) 432702
          </div>
          <div class="row justify-center f-14">
            E-mail : rsudprob@probolinggokota.go.id
          </div>
          <div class="row justify-center f-14 text-weight-bold">
            PROBOLINGGO 67219
          </div>
        </div>
        <div class="col-2">
          <q-img src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 3cm; max-width: 3cm" />
        </div>
      </div>

      <div class="row justify-center f-16 text-weight-bold q-my-sm">
        Laporan Telaah Resep {{ depo() }}
      </div>
      <div class="row justify-center f-16 text-weight-bold q-my-sm">
        Periode {{ store.disp.from }} s/d {{ store.disp.to }}
      </div>

      <div>
        <!-- <q-scroll-observer @scroll="scrollHandler" /> -->
        <div ref="refScroll" class="q-pa-sm" v-scroll="onScroll">
          <TableComp />
        </div>
      </div>

      <!-- <div class="q-mt-md" ref="refTt">
        <div class="q-my-md">
          <div class="row q-mb-md">
            <div class="col-4" />
            <div class="col-4" />
            <div class="col-4">
              <div class="text-center f-10">
                {{ pojokKananAtas }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center f-10">
                {{ kiriAtasSatu }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ tengahAtasSatu }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ kananAtasSatu }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center f-10">
                {{ kiriAtasDua }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ tengahAtasDua }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ kananAtasDua }}
              </div>
            </div>
          </div>
          <div class="row q-mt-xl text-weight-bold">
            <div class="col-4">
              <div class="text-center f-10">
                {{ kiriBawahSatu }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ tengahBawahSatu }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ kananBawahSatu }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center f-10">
                {{ kiriBawahDua }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ tengahBawahDua }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                {{ kananBawahDua }}
              </div>
            </div>
          </div>
        </div>
        <div class="q-my-md print-hide">
          <div class="row ">
            <div class="col-4" />
            <div class="col-4" />
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="pojokKananAtas" label="tanggal" valid outlined />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kiriAtasSatu" label="kiri atas satu" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="tengahAtasSatu" label="tengah atas satu" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kananAtasSatu" label="kanan atas satu" valid outlined />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kiriAtasDua" label="kiri atas dua" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="tengahAtasDua" label="tengah atas dua" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kananAtasDua" label="kanan atas dua" valid outlined />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kiriBawahSatu" label="kiri bawah satu" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="tengahBawahSatu" label="tengah bawah satu" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kananBawahSatu" label="kanan bawah satu" valid outlined />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kiriBawahDua" label="kiri bawah dua" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="tengahBawahDua" label="tengah bawah dua" valid outlined />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center f-10">
                <app-input v-model="kananBawahDua" label="kanan bawah dua" valid outlined />
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
  <DialogPrint v-model="store.isOpen" />
</template>
<script setup>
import { date } from 'quasar'
import { useLaporanTelaahResepObatStore } from 'src/stores/simrs/laporan/farmasi/telaah/telaah'
import { defineAsyncComponent, onMounted, ref } from 'vue'
const store = useLaporanTelaahResepObatStore()
const refTop = ref(null)
const h = ref(0)


const TableComp = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const DialogPrint = defineAsyncComponent(() => import('./comp/DialogPrint.vue'))
function jenisSelected (val) {
  // console.log('jenis', val)
  store.setParams('jenis', val)
  store.setParams('page', 1)
  store.getDataTable()

}
function setFrom (val) {
  store.params.from = val
}
function setFromDisp (val) {
  store.disp.from = val
}
function setTo (val) {
  store.params.to = val
}
function setToDisp (val) {
  store.disp.to = val
}

function depo () {
  if (store.params.kode_ruang == 'all') {
    return 'Semua Depo Rumah Sakit'
  }
  else {
    const depo = store.gudangs.find(a => a.value === store.params.kode_ruang)
    return depo ? depo?.nama : 'Depo tidak ditemukan'
  }
}


const refScroll = ref(null)
const refTt = ref(null)
function onScroll (pos) {
  const height = refScroll.value.clientHeight - 1000//- (refTt.value.clientHeight + 30)
  const currPage = store.meta.current_page
  if ((store.meta.current_page < store.meta.last_page) && pos >= height) {
    if (!store.loadingNext && !store.ketProses) store.setPage(currPage + 1)
    // console.log('meta', store.meta)
    // console.log('pos', pos, 'height', height, 'scroll client height', refScroll.value.clientHeight,)
  }
  // console.log('pos', pos, 'height', height, 'scroll client height', refScroll.value.clientHeight)
}
onMounted(() => {
  // console.log('h', refTop.value.clientHeight)
  h.value = refTop.value?.clientHeight
  store.getInitialData()
})
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Persediaan Farmasi'

}


// text tanda tangan start

const kiriAtasSatu = ref('Penelaah Resep')
const kiriAtasDua = ref('jabatan')
const kiriBawahSatu = ref('')
const kiriBawahDua = ref('')

const tengahAtasSatu = ref('')
const tengahAtasDua = ref('Kepala Instalasi Farmasi')
const tengahBawahSatu = ref('')
const tengahBawahDua = ref('')

const kananAtasSatu = ref('')
const kananAtasDua = ref('Petugas Bagian Barang')
const kananBawahSatu = ref('')
const kananBawahDua = ref('')

const pojokKananAtas = ref('Probolinggo, ' + date.formatDate(Date.now(), 'DD MMMM YYYY'))

// text tanda tangan end
</script>
