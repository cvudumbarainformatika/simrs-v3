<template>
  <div class="bg-white q-pa-xs">
    <div ref="refTop" class="fixed-top bg-white" style="margin-top:50px; margin-left: 60px; z-index: 10">
      <div class="row bg-primary text-white q-pa-sm q-mb-sm print-hide">
        <div class="f-14 text-weight-bold">
          Laporan Mutasi
        </div>
      </div>

      <div class="row no-wrap justify-between items-center print-hide">
        <div class="col-grow">
          <div class="row q-col-gutter-sm q-my-sm">
            <div class="col-2">
              <app-input v-model="store.params.q" label="Cari obat" outlined valid :loading="store.loading"
                :disable="store.loading || !!store.ketProses" @keyup.enter="store.setSearch" />
            </div>
            <div class="col-2">
              <app-autocomplete v-model="store.params.jenis" label="Jenis" autocomplete="nama" option-label="nama"
                option-value="value" outlined :source="store.optionJenis" :loading="store.loading"
                :disable="store.loading || !!store.ketProses" @update:model-value="setJenis" />
            </div>
            <div class="col-2">
              <app-autocomplete v-model="store.params.kode_ruang" label="Pilih Gudang / Depo" autocomplete="nama"
                option-label="nama" option-value="value" outlined :source="store.gudangs" :loading="store.loading"
                :disable="store.loading || !!store.ketProses" />
            </div>
            <div class="col-2">
              <app-autocomplete v-model="store.params.bulan" label="Pilih Bulan" autocomplete="nama" option-label="nama"
                option-value="value" outlined :source="store.bulans" :loading="store.loading"
                :disable="store.loading || !!store.ketProses" @update:model-value="() => {
                  store.items = []
                  store.meta = {}
                  store.setParams('page', 1)
                }" />
            </div>
            <div class="col-1">
              <app-input v-model="store.params.tahun" label="Tahun" outlined :loading="store.loading"
                :disable="store.loading || !!store.ketProses" />
            </div>
            <div class="col-2">
              <app-btn label="Ambil Data" :disable="store.loading || !!store.ketProses" :loading="store.loading"
                @click="store.getInitialData(1)" />
            </div>
          </div>
        </div>

        <div class="col-grow q-mr-md">
          <div class="row items-center">
            <q-btn unelevated color="primary" round size="sm" icon="icon-mat-download"
              :loading="!!store.ketProses || store?.loadingNext" :disable="!!store.ketProses || store?.loadingNext"
              @click="store.getAllData()">
              <q-tooltip class="primary" :offset="[10, 10]">
                Ambil Semua Data
              </q-tooltip>
            </q-btn>
            <q-btn class="q-ml-sm" ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm"
              :disable="!!store.ketProses" icon="icon-mat-print">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
            <div class="q-ml-sm">
              <download-excel class="btn" :fields="store.fields" :fetch="store.fetch"
                :before-generate="store.startDownload" :before-finish="store.finishDownload"
                :name="'Mutasi Obat Bulan ' + bulan() + ' ' + store.params.tahun + jenis() + '.xls'">
                <q-btn color="green" round size="sm" icon="icon-mat-download" push :loading="store.loadingDownload"
                  :disable="store.loadingDownload || !!store.ketProses || store?.loadingNext">
                  <q-tooltip>Download Excel</q-tooltip>
                </q-btn>
              </download-excel>
            </div>
          </div>
        </div>
      </div>
      <div v-if="store.ketProses" class="row items-center justify-evenly print-hide q-mx-xl">
        <!-- <div  class="row items-center justify-center print-hide"> -->

        <div class="col-shrink">
          <div class="row justify-between items-center">
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="2em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="3em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="4em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="3em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="2em" />
            </div>
          </div>
        </div>
        <div class="col-shrink q-ml-sm text-weight-bold f-18 text-center">
          <p>
            {{ store.ketProses }}
            <span v-if="store?.meta" class="q-mx-sm f-20 text-blue">{{ store.meta?.current_page ?
              store.meta?.current_page + 1 : 1 }}</span>
            <span v-if="store?.meta" class="q-mx-sm">dari</span>
            <span v-if="store?.meta" class="q-mx-sm f-20 text-orange">{{ store.meta?.last_page ?? 1 }}</span>
            <span v-if="store?.meta" class="q-mx-sm">halaman</span>
          </p>
        </div>
        <div class="col-shrink">
          <div class="row justify-between items-center">
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="2em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="3em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="4em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="3em" />
            </div>
            <div class="col-shrink">
              <q-spinner-pie color="orange" size="2em" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :style="`margin-top:${h + 5}px;`" />

    <div id="printMe">
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
        Laporan Mutasi FIFO Farmasi periode {{ date.formatDate((store.params.tahun + '-' + store.params.bulan + '-02'),
          'MMMM YYYY') }}
      </div>
      <div>
        <!-- <q-scroll-observer @scroll="scrollHandler" /> -->
        <div ref="refScroll" class="q-pa-sm" v-scroll="onScroll">
          <TableComp />
        </div>
      </div>

      <div class="q-mt-md" ref="refTt">
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
      </div>
    </div>
  </div>
  <!-- <print v-model="printOpen" :html="isiHtml" /> -->
</template>
<script setup>
import { date } from 'quasar'
import { useLaporanMutasiFiFoFarmasiStore } from 'src/stores/simrs/laporan/farmasi/mutasififo/mutasi'
import { defineAsyncComponent, onMounted, ref } from 'vue'

const store = useLaporanMutasiFiFoFarmasiStore()

const TableComp = defineAsyncComponent(() => import('./comp/TablePage.vue'))
// eslint-disable-next-line no-unused-vars
function bulan () {
  const bul = store.bulans.find(a => a.value === store.params.bulan)
  return bul?.nama ?? '-'
}
function jenis () {
  const bul = store.optionJenis.find(a => a.value === store.params.jenis)
  return ' (' + bul?.nama + ')' ?? '-'
}
function setJenis (val) {
  // console.log(val)
  if (store.items?.length) store.getInitialData(1)
}
const refScroll = ref(null)
const refTt = ref(null)
function onScroll (pos) {
  const height = refScroll.value.clientHeight - (refTt.value.clientHeight + 30)
  const currPage = store.meta.current_page
  if ((store.meta.current_page < store.meta.last_page) && pos >= height) {
    if (!store.loadingNext && !store.ketProses) store.setPage(currPage + 1)
    // console.log('meta', store.meta)
    console.log('pos', pos, 'height', height, 'scroll client height', refScroll.value.clientHeight, 'tt height', refTt.value.clientHeight)
  }
  // console.log('pos', pos, 'height', height, 'scroll client height', refScroll.value.clientHeight, 'tt height', refTt.value.clientHeight)
}
// function scrollHandler (observ) {
// console.log('observ', observ)
// }
// const print = defineAsyncComponent(() => import('./print/IndexPage.vue'))
// const isiHtml = ref(null)
// const printOpen = ref(false)
// function exportExcel () {
//   const htmltable = document.getElementById('printMe')
//   printOpen.value = true
//   isiHtml.value = htmltable.outerHTML
//   // window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html), '_blank')

//   console.log(
//     'type',
//     // typeof isiHtml.value,
//     encodeURIComponent(isiHtml.value),
//     // 'html',
//     // isiHtml.value,
//     'encode',
//     encodeURIComponent(isiHtml.value)
//   )
// }
const refTop = ref(null)
const h = ref(0)
onMounted(() => {
  console.log('h', refTop.value.clientHeight)
  h.value = refTop.value.clientHeight
})
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Persediaan Farmasi'

}

// text tanda tangan start

const kiriAtasSatu = ref('')
const kiriAtasDua = ref('Kepala Bagian Keuangan')
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
<style scoped>
.box-mini {
  white-space: normal !important;
  inline-size: 50px;
  overflow-wrap: break-word;
}

.box {
  white-space: normal !important;
  inline-size: 150px;
  overflow-wrap: break-word;
}

.q-table td box {
  white-space: normal !important;
  inline-size: 100px;
  overflow-wrap: break-word;
}

.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: normal !important;
}
</style>
