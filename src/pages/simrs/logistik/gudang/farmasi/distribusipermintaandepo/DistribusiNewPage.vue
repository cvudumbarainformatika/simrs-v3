<template>
  <div class="q-pa-xs bg-white">
    <div class="row bg-primary text-white q-pa-sm q-mb-sm rouded-border">
      <div class="f-16 text-weight-bold">
        Halaman Distribusi Permintaan Depo
      </div>
    </div>
    <app-table-extend :columns="store.columns" :items="store.items" :meta="store.meta" :per-page="store.params.per_page"
      :loading="store.loading" :to-search="store.params.no_permintaan" :click-able="true" :default-btn="false"
      :ada-tambah="false" :ada-filter="false" row-no use-full text-cari="Cari ..." @find="store.setSearch"
      @goto="store.setPage" @set-row="store.setPerPage" @refresh="store.refreshTable" @on-click="onClick">
      <!-- @edit-data="store.editData" -->
      <!--
            row-image="image"
            @delete-ids="table.deletesData"
            -->

      <template #header-left-after-search>
        <div class="q-ml-md text-white">
          <!-- <div class="row q-mb-xs q-ml-xs items-center">
            <div class="q-mr-sm">
              Status :
            </div>
            <div class="q-mr-sm">
              <q-radio
                v-model="store.params.jenisdistribusi"
                checked-icon="icon-mat-task_alt"
                unchecked-icon="icon-mat-panorama_fish_eye"
                val="non-konsinyasi"
                label="Non-Konsinyasi"
                keep-color
                color="white"
                :disable="store.loading"
                @update:model-value="store.gantiJenisDistribusi"
              />
            </div>
            <div class="q-mr-sm">
              <q-radio
                v-model="store.params.jenisdistribusi"
                checked-icon="icon-mat-task_alt"
                unchecked-icon="icon-mat-panorama_fish_eye"
                val="konsinyasi"
                label="Konsinyasi"
                keep-color
                color="white"
                :disable="store.loading"
                @update:model-value="store.gantiJenisDistribusi"
              />
            </div>
          </div> -->
        </div>
      </template>
      <template #col-no_permintaan>
        <div>No Pemintaan</div>
      </template>
      <template #col-tgl_permintaan>
        <div>Tanggal Permintaan</div>
      </template>
      <template #col-dari>
        <div>Dari</div>
      </template>
      <template #col-jumlah>
        <div>Jumlah</div>
      </template>
      <template #col-user>
        <div>User Entri</div>
      </template>
      <template #col-act>
        <div>#</div>
      </template>
      <template #cell-tgl_permintaan="{ row }">
        <div class="row justify-between no-wrap">
          {{ row.tgl_permintaan ? dateFullFormat(row.tgl_permintaan) : '-' }}
        </div>
      </template>
      <template #cell-no_permintaan="{ row }">
        <div class="row justify-between no-wrap q-mt-xs">
          <div class=" text-weight-bold">
            {{ row.no_permintaan }}
          </div>
        </div>
      </template>
      <template #cell-dari="{ row }">
        <div class="row justify-between no-wrap">
          {{ row.dari ? depo(row?.dari) : '-' }}
        </div>
      </template>
      <template #cell-status="{ row }">
        <div class="row">
          <q-chip class="f-10" :color="color(row.flag)" :label="label(row.flag)" text-color="white" />
        </div>
      </template>
      <template #cell-user="{ row }">
        <div class="row">
          {{ row.user ? row.user.nama : '-' }}
        </div>
      </template>
      <template #cell-act="{ row }">
        <div v-if="parseInt(row.flag) >= 3 && parseInt(row.flag) < 5" class="row items-center">
          <div class="col-auto">
            <div v-if="row.flag === '3'">
              <q-btn flat icon="icon-mat-lock" dense color="negative"
                :loading="store.loadingKunci && row.no_permintaan === toloadBeli">
                <!-- @click="kunci(row)" -->
                <q-tooltip class="primary" :offset="[10, 10]">
                  Sudah di kirim ke depo
                </q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="col-auto">
            <q-btn round icon="icon-mat-print" dense color="dark" size="sm" @click="toPrint(row)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <div v-if="row.flag === '1'" class="row justify-between items-center" style="min-width: 150px;">
          <div class="col-auto">
            <q-btn flat icon="icon-mat-move_to_inbox" dense color="primary"
              :loading="store.loadingKunci && row.no_permintaan === toloadBeli" @click="kunci(row)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Terima
              </q-tooltip>
            </q-btn>
          </div>
          <div class="col-auto">
            <q-btn round icon="icon-mat-print" dense color="dark" size="sm" @click="toPrint(row)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
          </div>
          <div class="col-auto">
            <q-btn flat icon="icon-mat-hand-front-left" size="sm" dense color="negative" :loading="row?.loading"
              :disable="row?.loading" @click="tolak(row)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Tolak
              </q-tooltip>
            </q-btn>
          </div>
        </div>
        <!-- {{ row?.permintaanrinci?.map(x=>x.distribusi).reduce((a,b)=>a+b,0) }} -->
        <div v-if="row.flag === '2'" class="row justify-between items-center" style="min-width: 150px;">
          <div v-if="row?.permintaanrinci?.map(x => x.distribusi).reduce((a, b) => a + b, 0) > 0" class="col-auto">
            <q-btn flat icon="icon-mat-done_all" label="selesai" dense color="green"
              :loading="store.loadingKunci && row.no_permintaan === toloadBeli" @click="distribusikan(row)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Distribusikan
              </q-tooltip>
            </q-btn>
          </div>
          <div class="col-auto">
            <q-btn round icon="icon-mat-print" dense color="dark" size="sm" @click="toPrint(row)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
          </div>
        </div>
        <div v-else class="text-primary text-weight-bold">
          <q-tooltip class="primary" :offset="[10, 10]">
            Tidak Ada yang perlu dilakukan
          </q-tooltip>
        </div>
      </template>
      <template #expand="{ row }">
        <div v-if="row.permintaanrinci?.length">
          <div class="row items-center text-weight-bold">
            <div class="col-3 text-center">
              Obat
            </div>
            <div class="col-3 text-center">
              Stok
            </div>
            <div class="col-3 text-center">
              Jumlah
            </div>
            <div class="col-3 text-right">
              #
            </div>
          </div>
          <q-separator />
          <div v-for="(rin, i) in row.permintaanrinci" :key="i">
            <CompDistribusi :row="row" :rin="rin" @minta="setMinta($event, rin)" @distribusi="setDist($event, rin)"
              @editable="setEdit($event, rin)" />
            <q-separator />
          </div>
        </div>
        <div v-else>
          Tidak ada Rincian
        </div>
      </template>
    </app-table-extend>
  </div>
  <DialogPrintPage ref="dialogPrint" v-model="store.isOpen" :item="store.dataToPrint" />
  <TandaTanganPage v-model="tandatangan.isOpen" />
</template>

<script setup>
import { dateFullFormat } from 'src/modules/formatter'
// import { notifErrVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useDistribusiPermintaanDepoStore } from 'src/stores/simrs/farmasi/distribusipermintaandepo/distribusi'
import { useTandaTanganStore } from 'src/stores/simrs/logistik/sigarang/tantatangan/tandatangan'
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
const store = useDistribusiPermintaanDepoStore()
const apps = useAplikasiStore()
const tandatangan = useTandaTanganStore()

const CompDistribusi = defineAsyncComponent(() => import('./CompDistribusi.vue'))
const DialogPrintPage = defineAsyncComponent(() => import('./DialogPrintPage.vue'))
const TandaTanganPage = defineAsyncComponent(() => import('src/pages/simrs/sigarang/tandatangan/TandaTanganPage.vue'))

onMounted(() => {
  store.setForm('kdgudang', apps?.user?.kdruangansim)
  store.setParams('kdgudang', apps?.user?.kdruangansim)
  store.getInitialData()
})

const gud = ['Gd-03010100', 'Gd-05010100']
watch(() => apps?.user?.kdruangansim, (obj) => {
  store.setForm('kdgudang', obj)
  store.setParams('kdgudang', obj)
  const gd = gud.find(a => a === obj)
  if (gd) store.refreshTable()
})

const dialogPrint = ref(null)
// const data = ref({})
// const isOpen = ref(false)
function toPrint (val) {
  console.log('print ', val)
  store.dataToPrint = val
  val.expand = !val.expand
  val.highlight = !val.highlight
  store.isOpen = true
}
function depo (val) {
  const temp = store.depos.filter(a => a.value === val)
  // console.log('temp', temp)
  if (temp?.length) {
    return temp[0].nama
  }
  else {
    return val
  }
}
// function mutasi (row, rin) {
//   console.log('row', row)
//   console.log('rin', rin)
// }
// click
function onClick (val) {
  // console.log('click', val)
  val.item.expand = !val.item.expand
  val.item.highlight = !val.item.highlight
}
const toloadBeli = ref('')
function kunci (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  toloadBeli.value = val.no_permintaan
  const form = {
    no_permintaan: val.no_permintaan
  }
  console.log('val', val, form)

  store.kunci(form)
}
function tolak (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight

  store.tolak(val)
}
function distribusikan (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  toloadBeli.value = val.no_permintaan
  const form = {
    no_permintaan: val.no_permintaan
  }
  console.log('val', val, form)

  store.distribusi(form)
}
function setMinta (evt, rin) {
  // console.log('set minta', evt)
  rin.jumlah_minta = evt
}
function setDist (evt, rin) {
  // console.log('set dist', evt)
  rin.distribusi = evt
}
function setEdit (evt, rin) {
  // console.log('set edit', evt)
  rin.editable = evt
}
// function setEdit(val) {
//   console.log('edit ', val)
//   val.editable = true
// }
// const refInputVerif = ref(null)
// function kirim (val, i, row) {
//   console.log('ref', refInputVerif.value, i)
//   const valid = refInputVerif.value[i].$refs.refInput.validate()
//   console.log('kirim', val)
//   console.log('kirim row', row)
//   if (valid) {
//     store.setForm('id', val.id)
//     const form = {
//       id: val.id,
//       jumlahdiminta: val.jumlahdiminta,
//       jumlah_minta: val.jumlah_minta,
//       kodeobat: val.kdobat,
//       kdgudang: row.tujuan,
//       nopermintaan: row.no_permintaan

//     }
//     console.log('form', form)
//     store.simpanDetail(form).then(() => {
//       val.editable = false
//       val.distribusi = form.distribusi
//     })
//   }
//   val.editable = false
// }
// function gaKirim (val, i) {
//   console.log('ref', refInputVerif.value, i)
// }

// function setNol (val) {
//   const beli = !isNaN(parseFloat(val.jumlah_minta)) ? (parseFloat(val.jumlah_minta) <= 0 ? 0 : parseFloat(val.jumlah_minta)) : 0
//   val.jumlah_minta = beli
// }
// function setJumlah (evt, val) {
//   const inc = evt.includes('.')
//   const ind = evt.indexOf('.')
//   const panj = evt?.length
//   const beli = isNaN(parseFloat(evt)) ? 0 : (inc && (ind === (panj - 1)) ? evt : parseFloat(evt))
//   // const beli = !isNaN(parseFloat(evt)) ? (parseFloat(evt) <= 0 ? 0 : parseFloat(evt)) : 0
//   const max = parseFloat(val?.mak_stok)
//   const stok = parseFloat(val?.stok)
//   // jumlah total stok tidak boleh melebihi jumlah stok maksimal
//   const totalStok = stok + beli
//   if (totalStok > max) {
//     notifErrVue('Jumlah Stok Depo tidak boleh melebihi jumlah stok maksimal')
//     val.jumlah_minta = 0
//   }
//   else {
//     val.jumlah_minta = beli
//   }
//   console.log('beli', beli, evt, max, stok, totalStok)
// }
// function sudah (evt, val) {
//   const anu = val.jumlah_minta
//   val.jumlah_minta = anu
// }

const color = val => {
  switch (val) {
    case 99:
      return 'white'
      // eslint-disable-next-line no-unreachable
      break
    case '':
      return 'negative'
      // eslint-disable-next-line no-unreachable
      break
    case '1':
      return 'cyan'
      // eslint-disable-next-line no-unreachable
      break
    case '2':
      return 'blue'
      // eslint-disable-next-line no-unreachable
      break
    case '3':
      return 'orange'
      // eslint-disable-next-line no-unreachable
      break
    case '4':
      return 'grey'
      // eslint-disable-next-line no-unreachable
      break

    default:
      return 'red'
      // eslint-disable-next-line no-unreachable
      break
  }
}

const label = (status) => {
  switch (status) {
    case '':
      return 'Draft'
      // eslint-disable-next-line no-unreachable
      break
    case '1':
      return 'Permintaan dikirim ke Gudang'
      // eslint-disable-next-line no-unreachable
      break
    case '2':
      return 'Diterima Gudang'
      // eslint-disable-next-line no-unreachable
      break
    case '3':
      return 'Telah di distribusikan'
      // eslint-disable-next-line no-unreachable
      break
    case '4':
      return 'Diterima Depo'
      // eslint-disable-next-line no-unreachable
      break
    case '5':
      return 'Permintaan Ditolak'
      // eslint-disable-next-line no-unreachable
      break
    case 99:
      return 'Status belum di filter'
      // eslint-disable-next-line no-unreachable
      break

    default:
      return 'Belum di definisikan'
      // eslint-disable-next-line no-unreachable
      break
  }
}

</script>

<style>
.box {
  white-space: normal !important;
  inline-size: 170px;
  overflow-wrap: break-word;
}

.rouded-border {
  border-radius: 5px;
}

.space-normal {
  white-space: normal;
}
</style>
