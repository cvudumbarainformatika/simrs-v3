<template>
  <div :key="store.items">
    <q-card>
      <q-card-section>
        <div class="f-14 text-weight-bold">
          Stok Opname
        </div>
        <div class="title-desc">
          Halaman Stok Opname Barang Penunjang Non Medik
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <!-- tanggal -->
        <div class="row q-col-gutter-sm items-start">
          <div class="col-6">
            <div class="fit row no-wrap justify-between items-center q-my-sm">
              <div class="col-3">
                Tanggal Stok Opname otomatis
              </div>
              <div class="col-9">
                <!-- <app-input-date
                  v-model="tanggalStokOpname"
                  label="Tanggal Stok opname"
                  outlined
                /> -->
                {{ tanggalStokOpname }}
              </div>
            </div>
            <!-- gudang -->
            <div class="fit row no-wrap q-col-gutter-sm justify-between items-center q-mb-sm">
              <div class="col-3">
                Gudang
              </div>
              <div class="col-7">
                <app-autocomplete-new
                  :key="store.kode_tempat"
                  label="pilih "
                  :model="store.kode_tempat"
                  autocomplete="nama"
                  option-label="nama"
                  option-value="kode"
                  outlined
                  valid
                  :loading="store.loading"
                  :source="store.gudangDepo"
                  @on-select="gudangSelected"
                  @clear="gudangCleared"
                />
              </div>
              <div class="col-2">
                <app-btn
                  label="ambil data"
                  @click="store.getDataTable()"
                />
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="fit row no-wrap justify-start items-center q-col-gutter-sm">
              <div class="col-3">
                Periode
              </div>
              <div class="col-3">
                <app-autocomplete-new
                  v-model="store.params.bulan"
                  label="Pilih Bulan"
                  autocomplete="nama"
                  option-label="nama"
                  option-value="value"
                  outlined
                  :source="store.months"
                  @on-select="bulanSelected"
                />
              </div>
              <div class="col-3">
                <app-autocomplete
                  v-model="store.params.tahun"
                  label="Pilih Tahun"
                  outlined
                  :source="years"
                  @selected="tahunSelected"
                />
              </div>
            </div>
            <div class="fit row no-wrap justify-end items-center q-col-gutter-sm">
              <div class="col-3">
                <div>
                  <q-btn
                    v-print="printObj"
                    unelevated
                    color="dark"
                    round
                    size="sm"
                    icon="icon-mat-print"
                  >
                    <q-tooltip
                      class="primary"
                      :offset="[10, 10]"
                    >
                      Print
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
          <!-- button stok opname -->
          <!-- <div class="fit row no-wrap justify-end items-center q-mb-sm">
          <q-btn
            :label="!store.allItems?.length ? 'Mulai Opname':'Sudah ada data'"
            no-caps
            color="primary"
            :disable="!!store.allItems?.length || store.loading"
            @click="store.simpanOpname"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
            >
              <div v-if="!store.allItems?.length">
                Mulai stok opname
              </div>
              <div v-if="store.allItems?.length">
                Sudah dilakukan stok opname di bulan ini
              </div>
            </q-tooltip>
          </q-btn>
        </div> -->
        </div>
        <q-separator />
        <div
          id="printMe"

          class="q-mt-sm"
        >
          <!-- table -->
          <app-table
            :key="store.kode_tempat"
            title="Data Distribusi"
            :columns="store.columns"
            :column-hide="store.columnHide"
            :items="store.items"
            :meta="store.meta"
            :per-page="store.params.per_page"
            :order-by="store.params.order_by"
            :sort="store.params.sort"
            :loading="store.loading"
            :to-search="store.params.q"
            :ada-tambah="false"
            :default-btn="false"
            @goto="store.setPage"
            @set-row="store.setPerPage"
            @refresh="store.refreshTable"
            @find="store.setSearch"
            @set-order="store.setOder"
            @new-data="store.newData"
            @edit-data="store.editData"
            @delete="store.deletesData"
          >
            <!-- header -->
            <template #header-left-after-search>
              <div class="q-ml-md">
                <!-- store.meta -->
              </div>
            </template>
            <template #header-for-print>
              <div class="row justify-center f-16 text-weight-bold">
                Data Stok Opname Per {{ date.formatDate(tanggalStokOpname, 'DD MMMM YYYY') }}
              </div>
              <div class="row justify-center f-16 text-weight-bold">
                {{ namaTempat }}
              </div>
              <div class="row justify-center f-16 text-weight-bold">
                UOBK RSUD DR. MOHAMAD SALEH KOTA PROBOLINGGO
              </div>
            </template>
            <!-- kolom -->
            <template #col-tanggal>
              <div>Tanggal</div>
            </template>
            <template #col-kode>
              <div>Kode Barang</div>
            </template>
            <template #col-totalStok>
              <div>Total Stok</div>
            </template>
            <template #col-no_penerimaan>
              <div>No Penerimaan</div>
            </template>
            <template #col-barang>
              <div>Nama Barang</div>
            </template>
            <template #col-uraian>
              <div>Uraian 108</div>
            </template>
            <template #col-sisa_stok>
              <div>Stok Aplikasi</div>
            </template>
            <template #col-stok_transaksi>
              <div>Stok Transaksi</div>
            </template>
            <template #col-selisih>
              <div>Selisih</div>
            </template>
            <template #col-tempat>
              <div>Tempat</div>
            </template>

            <!-- cell -->

            <template #cell-tanggal="{row}">
              {{ dateFullFormat(row.tanggal) }}
            </template>
            <template #cell-kode="{row}">
              <div class="kode">
                {{ row.kode }}
              </div>
            </template>
            <template #cell-barang="{row}">
              <div>
                <div class="box">
                  {{ row.nama }}
                </div>
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  {{ row.nama }}
                </q-tooltip>
              </div>
            </template>
            <template #cell-tempat="{row}">
              <div>
                <div class="box">
                  {{ row.depo?row.depo.nama:(row.ruang?row.ruang.uraian:'-') }}
                </div>
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  {{ row.depo?row.depo.nama:(row.ruang?row.ruang.uraian:'-') }}
                </q-tooltip>
              </div>
            </template>
            <template #cell-totalStok="{row}">
              {{ stokGudang(row.monthly) }}
              <!-- <q-tooltip
                anchor="top middle"
                self="center middle"
              >
                Total stok di ruangan yang sama
              </q-tooltip> -->
            </template>

            <template #cell-sisa_stok="{row}">
              <div style="width:7vw;">
                <div>
                  {{ sisaStok(row.monthly) }}
                </div>
                <!-- <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  {{ row.barang?(row.barang.uraian_108):'Master barang tidak ditemukan' }}
                </q-tooltip> -->
              </div>
            </template>

            <template #cell-no_penerimaan="{row}">
              <div>
                <div class="box">
                  {{ noPenerimaanDepo(row.monthly) }}
                </div>
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  {{ noPenerimaanDepo(row.monthly) }}
                </q-tooltip>
              </div>
            </template>
            <template #cell-stok_transaksi="{row}">
              {{ row.stok_transaksi }}
            </template>
            <template #cell-selisih="{row}">
              <div>
                {{ row.totalStok - parseFloat(row.stok_fisik) }}
                <q-tooltip
                  anchor="top middle"
                  self="center middle"
                >
                  Stok aplikasi dikurangi stok fisik
                </q-tooltip>
              </div>
            </template>
            <!-- <template #cell-sisa_stok="{row}">
              {{ row.penyesuaian?row.penyesuaian.jumlah:row.sisa_stok }}
            </template> -->
            <template #left-acttion="{row,col}">
              <div class="row no-wrap fit items-center print-hide">
                <div style="width:5vw">
                  <app-input
                    v-model="row.stok_fisik"
                    label="stok Fisik"
                    outlined
                    valid
                    type="number"
                    :loading="row.loading"
                    @blur="store.updateStokFisik(row,col)"
                  />
                  <q-tooltip
                    anchor="top middle"
                    self="center middle"
                  >
                    Input stok fisik
                  </q-tooltip>
                </div>
                <!-- <div>
                  <q-btn
                    flat
                    class=""
                    size="sm"
                    round
                    color="grey"
                    icon="icon-mat-pencil"
                    @click="row.enableInput=true"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="center middle"
                    >
                      Tampilkan Input
                    </q-tooltip>
                  </q-btn>
                </div> -->
                <div>
                  <q-btn
                    flat
                    class=""
                    size="sm"
                    round
                    color="grey"
                    icon="icon-mat-visibility"
                    @click="kartuStok(row)"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="center middle"
                    >
                      Lihat kartu stok
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>
          </app-table>
          <div class="q-my-md f-10">
            <div class="row q-mb-md">
              <div class="col-4" />
              <div class="col-4" />
              <div class="col-4">
                <div class="text-center">
                  {{ pojokKananAtas }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="text-center">
                  {{ kiriAtasSatu }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ tengahAtasSatu }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ kananAtasSatu }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="text-center">
                  {{ kiriAtasDua }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ tengahAtasDua }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ kananAtasDua }}
                </div>
              </div>
            </div>
            <div class="row q-mt-xl text-weight-bold">
              <div class="col-4">
                <div class="text-center">
                  {{ kiriBawahSatu }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ tengahBawahSatu }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ kananBawahSatu }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <div class="text-center">
                  {{ kiriBawahDua }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ tengahBawahDua }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  {{ kananBawahDua }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-separator />
      </q-card-section>
    </q-card>
    <div>
      <div>
        <div class="q-my-md">
          <div class="row ">
            <div class="col-4" />
            <div class="col-4" />
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="pojokKananAtas"
                  label="tanggal"
                  valid
                  outlined
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kiriAtasSatu"
                  label="kiri atas satu"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="tengahAtasSatu"
                  label="tengah atas satu"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kananAtasSatu"
                  label="kanan atas satu"
                  valid
                  outlined
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kiriAtasDua"
                  label="kiri atas dua"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="tengahAtasDua"
                  label="tengah atas dua"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kananAtasDua"
                  label="kanan atas dua"
                  valid
                  outlined
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kiriBawahSatu"
                  label="kiri bawah satu"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="tengahBawahSatu"
                  label="tengah bawah satu"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kananBawahSatu"
                  label="kanan bawah satu"
                  valid
                  outlined
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kiriBawahDua"
                  label="kiri bawah dua"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="tengahBawahDua"
                  label="tengah bawah dua"
                  valid
                  outlined
                />
              </div>
            </div>
            <div class="col-4">
              <div class="text-center">
                <app-input
                  v-model="kananBawahDua"
                  label="kanan bawah dua"
                  valid
                  outlined
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <formDialog v-model="store.isOpen" />
    <kartuStokOpname v-model="store.kartuStokOpen" />
  </div>
</template>
<script setup>
// dibuat tabel
// tombol stok opname
// pilih bulan
import { date } from 'quasar'
import { ref, computed } from 'vue'
import { useStokOpnameStore } from 'stores/simrs/logistik/sigarang/laporan/stok/stokOpname'
import { dateFullFormat } from 'src/modules/formatter'
import formDialog from './FormDialog.vue'
import kartuStokOpname from './KartuStokOpname.vue'
import { daysInMonth } from 'src/modules/utils'

const store = useStokOpnameStore()
const tanggalStokOpname = ref('')
const dayInMonth = ref(0)
// text tanda tangan start

const kiriAtasSatu = ref('Mengetahui')
const kiriAtasDua = ref('Kepala Bagian Umum')
const kiriBawahSatu = ref('Jumadi, S.Sos, MM')
const kiriBawahDua = ref('NIP . 19691223 199302 1 002')

const tengahAtasSatu = ref('')
const tengahAtasDua = ref('Pejabat Teknik Kegiatan')
const tengahBawahSatu = ref('Yuliana, S.A.P')
const tengahBawahDua = ref('NIP. 19740304 200801 2 005')

const kananAtasSatu = ref('')
const kananAtasDua = ref('Petugas Bagian Barang')
const kananBawahSatu = ref('SARWANI')
const kananBawahDua = ref('NIP. 19760311 200801 1 008')

const pojokKananAtas = ref('Probolinggo, ' + date.formatDate(Date.now(), 'DD MMMM YYYY'))

// text tanda tangan end

const setDate = () => {
  // const tempDate = Date.now()
  const sekarang = new Date()
  sekarang.setMonth(parseInt(store.params.bulan) - 1)
  sekarang.setFullYear(parseInt(store.params.tahun))
  dayInMonth.value = daysInMonth(parseInt(store.params.bulan), parseInt(store.params.tahun))
  sekarang.setDate(dayInMonth.value)
  sekarang.setHours(23)
  sekarang.setMinutes(59)
  sekarang.setSeconds(59)
  tanggalStokOpname.value = date.formatDate(sekarang, 'DD MMMM YYYY HH:mm:ss')
  store.setParams('lastDay', dayInMonth.value)
  // console.log('params', store.params)
  // console.log('tanggal', date.formatDate(sekarang, 'DD MMMM YYYY HH:mm:ss'))
  // console.log('bulan selected', parseInt(store.params.bulan))
  // console.log('bulan selected day', daysInMonth(parseInt(store.params.bulan), parseInt(store.params.tahun)))
  // console.log('sekarang', sekarang)
}
function noPenerimaanDepo(val) {
  const depo = val.filter(x => x.kode_ruang === store.kode_tempat)
  return depo.map(m => m.no_penerimaan).toString()
}
function sisaStok(val) {
  if (val?.length > 0) {
    const depo = val.filter(m => m.kode_ruang === store.kode_tempat)
    let totalDepo = 0
    if (depo?.length > 0) {
      totalDepo = depo.map(x => x.sisa_stok).reduce((a, b) => a + b, 0)
    }
    return totalDepo
  }
  return 0
}
function stokGudang (val) {
  const gudang = 'Gd-02010100'
  if (val?.length > 0) {
    const depo = val.filter(m => m.kode_ruang === gudang)
    let totalDepo = 0
    if (depo?.length > 0) {
      totalDepo = depo.map(x => x.sisa_stok).reduce((a, b) => a + b, 0)
    }
    return totalDepo
  }
  return 0
}

store.getInitialData()
setDate()
const bulanSelected = (val) => {
  store.setParams('bulan', val)
  store.setParams('page', 1)
  setDate()
  store.getDataTable()
}
const tahunSelected = val => {
  // console.log('tahun', val)
  store.setParams('page', 1)
  store.setParams('tahun', val)
  setDate()
  store.getDataTable()
}
const namaTempat = computed(() => {
  const temp = store.gudangDepo.filter(a => a.kode === store.kode_tempat)
  if (temp?.length) {
    return temp[0].nama
  } else {
    return '-'
  }
})
const gudangSelected = (val) => {
  // console.log('gudang', val)
  store.kode_tempat = val
  store.setParams('search', val)
  store.params.search = val
  // if (val !== null) {
  // store.getDataByDepo()
  // } else {
  //   store.params.search = ''
  store.getDataTable()
  // }
}
const gudangCleared = () => {
  store.kode_tempat = null
  store.params.search = ''
  store.getDataTable()
}

// pilih range bulan dan tahun
// const months = ref()
const curY = parseInt(store.params.tahun)
const years = ref([])
for (let index = 0; index < 11; index++) {
  years.value[index] = curY - 5 + index
}

// kartu stok
const kartuStok = (val) => {
  // console.log(val)
  store.dataKartuStok = val
  store.kartuStokOpen = true
}
// const monthSelected = ref(null)
// const yearSelected = ref(null)

// const searchEnter = () => {
//   console.log(store.params.search)
// }

// print
const openPrint = ref(false)
// let title = ''
const printed = ref(false)
const item = ref({})
// function toPrint (val) {
//   // console.log('print', val)
//   item.value = val
//   // title = 'Print ' + val.nama
//   openPrint.value = true
// }
const printObj = {
  id: 'printMe',
  // popTitle: title,
  // extraCss: 'https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css',
  // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
  beforeOpenCallback (vue) {
    printed.value = true
    console.log('wait...', vue)
  },
  openCallback (vue) {
    console.log('opened', vue)
  },
  closeCallback (vue) {
    openPrint.value = false
    printed.value = false
    // changePeriode()
    item.value = {}
    console.log('closePrint')
  }
}
</script>
<style scoped>
.box {
  white-space: normal !important;
  inline-size: 170px;
  overflow-wrap: break-word;
}
.kode {
  white-space: normal !important;
  inline-size: 80px;
  overflow-wrap: break-word;
}
.q-table td box {
  white-space: normal !important;
    inline-size: 150px;
    overflow-wrap: break-word;
}
.q-table--no-wrap th, .q-table--no-wrap td {
  white-space: normal !important;
}
.print{
  position: absolute;
    left: 30px;
    right: 30px;
    top: 5px;
    z-index: 10;
}
.anu:hover {
  background-color: rgba(166, 173, 144, 0.548);
}

.anudua:hover {
  background-color: rgb(54, 196, 231);
}
</style>
