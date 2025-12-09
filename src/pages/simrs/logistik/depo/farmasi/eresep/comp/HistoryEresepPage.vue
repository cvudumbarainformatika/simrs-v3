<template>
  <q-dialog @show="getData()" persistent>
    <q-card flat class="fit" style="overflow: hidden;min-width: 700px;">
      <div class="column bg-red">
        <q-bar class="col-auto bg-primary text-white q-py-sm">
          <div class="f-12">
            History Eresep Pasien
          </div>
          <div>

            <!-- periode -->
            <q-btn outline class="bg-primary q-px-sm" padding="sm" size="sm" no-caps>
              <div class="flex items-center q-mx-xs">
                <div class="f-12 q-mr-sm">
                  {{ periode }}
                </div>
                <transition>
                  <q-icon :name="`${showMenuPeriode ? 'icon-mat-keyboard_arrow_up' : 'icon-mat-keyboard_arrow_down'}`"
                    size="16px" />
                </transition>
              </div>

              <q-menu @show="showMenuPeriode = true" @hide="showMenuPeriode = false">
                <div class="row no-wrap q-pa-sms">
                  <q-list style="min-width: 100px">
                    <q-item v-for="item in periods" :key="item" clickable :active="item === periode"
                      active-class="bg-primary text-white" :disable="item === 'Custom'" @click="setPeriode(item)">
                      <q-item-section>{{ item }}</q-item-section>
                    </q-item>
                  </q-list>
                  <q-separator vertical inset />

                  <div class="column">
                    <div class="row q-pa-sm q-col-gutter-sm">
                      <div class="col">
                        <q-date v-model="param.from" minimal bordered flat mask="YYYY-MM-DD"
                          @update:model-value="setPeriode('Custom')" />
                        <div class="f-10 text-grey-8 q-mt-xs">
                          DARI TANGGAL : <b>{{ param.from }}</b>
                        </div>
                      </div>
                      <div class="col">
                        <q-date v-model="param.to" minimal bordered flat mask="YYYY-MM-DD"
                          @update:model-value="setPeriode('Custom')" />
                        <div class="f-10 text-grey-8 q-mt-xs">
                          SAMPAI TANGGAL : <b>{{ param.to }}</b>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                    <div class="row q-pa-sm justify-end">
                      <q-btn v-close-popup color="primary" label="Terapkan" push size="sm" @click="getData()" />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>
          <q-space />

          <q-btn v-close-popup dense flat icon="icon-mat-close" @click="emits('close')">
            <q-tooltip class="bg-white text-primary">
              Close
            </q-tooltip>
          </q-btn>
        </q-bar>
      </div>
      <!-- body -->
      <div class="col fit column" style="padding-bottom: 60px; padding-top:0px">
        <div class="col full-height scroll">
          <app-loading v-if="loading" />
          <div v-else>
            <div v-if="items?.length <= 0">
              <div class="column flex-center" style="min-height:50vh">
                <div class="text-h3 q-mb-md">
                  🏷️
                </div>
                <div class="f-14">
                  Belum Ada Data
                </div>
              </div>
            </div>
            <q-list v-else separator>
              <q-separator spaced inset />
              <q-expansion-item v-for="(item, i) in items" :key="i" @show="showItem(item)">
                <template v-slot:header>
                  <q-item-section avatar>
                    <app-avatar-pasien :pasien="item" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ item?.datapasien?.rs2 }} | <span class="text-primary">{{ item.norm }}</span> | <span
                        class="text-teal">{{ item.noresep }}</span>
                    </q-item-label>
                    <q-item-label>
                      NOREG : <span class="text-weight-bold">{{ item.noreg }} </span> | Penjamin : <span
                        class="text-weight-bold"> {{ item.sistembayar?.rs2 }}</span>
                    </q-item-label>
                    <q-item-label>
                      DPJP : <span class="text-negative text-weight-bold">{{ item?.ketdokter?.nama }}</span> | RUANGAN :
                      <span class="text-teal text-weight-bold"> {{ item?.poli?.rs2 ?? item?.ruanganranap?.rs2 }}</span>
                    </q-item-label>
                    <q-item-label class=" text-accent">
                      Tgl Permintaan : <span class="text-weight-bold "> {{ dateFullFormat(item.tgl_permintaan)
                      }}
                      </span> | jam : {{ formatJam(item.tgl_permintaan) }}
                    </q-item-label>
                    <q-item-label class="text-primary">
                      Tgl Selesai : <span class="text-weight-bold"> {{ dateFullFormat(item.tgl_selesai)
                      }}
                      </span> | jam : {{ formatJam(item.tgl_selesai) }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>
                      <q-chip :color="getColor(item.flag)" text-color="white">
                        {{ getStatus(item.flag) }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section>
                    <app-loading v-if="(item.loading && !item.detail) || item.reloading" />
                    <div v-else>
                      <div v-if="!item?.detail">
                        <div class="column flex-center" style="min-height:50vh">
                          <div class="text-h3 q-mb-md">
                            🏷️
                          </div>
                          <div class="f-14">
                            Belum Ada Data
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div class="row justify-end">
                          <q-btn dense icon="icon-mat-refresh" flat round :loading="item?.loading || item.reloading"
                            @click="() => {
                              item.reloading = true
                              showItem(item)
                            }">
                            <q-tooltip class="bg-white text-primary">
                              Refresh rincian
                            </q-tooltip>
                          </q-btn>
                        </div>
                        <div v-if="item?.detail?.permintaan?.length > 0">
                          <div class="f-16 text-weight-bold q-mb-sm">
                            Non Racikan
                          </div>
                          <table>
                            <thead class="my-sticky-header-table">
                              <tr>
                                <th width="5%">
                                  No
                                </th>
                                <th>
                                  Kode Obat
                                </th>
                                <th>
                                  Nama Obat
                                </th>
                                <th>
                                  Minta
                                </th>
                                <th>
                                  Keluar
                                </th>
                                <th v-if="item?.flag == '4'">
                                  Retur
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <template v-for="(perm, n) in item?.detail?.permintaan" :key="n">
                                <tr>
                                  <td width="5%">
                                    {{ n + 1 }}
                                  </td>
                                  <td>
                                    {{ perm?.kdobat }}
                                  </td>
                                  <td>
                                    {{ perm?.mobat?.nama_obat }}
                                  </td>
                                  <td>
                                    {{ perm?.jumlah }}
                                  </td>
                                  <td>
                                    {{ keluarNon(perm, item?.detail) }}
                                  </td>
                                  <td v-if="item?.flag == '4'">
                                    {{ retur(perm, item?.detail, item) }}
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </div>
                        <div v-if="item?.detail?.permintaanIter?.length > 0">
                          <div class="f-16 text-purple text-weight-bold q-mb-sm">
                            Non Racikan Iter
                          </div>
                          <table>
                            <thead class="my-sticky-header-table">
                              <tr>
                                <th width="5%">
                                  No
                                </th>
                                <th>
                                  Kode Obat
                                </th>
                                <th>
                                  Nama Obat
                                </th>
                                <th>
                                  Minta
                                </th>
                                <th>
                                  Keluar
                                </th>
                                <th v-if="item?.flag == '4'">
                                  Retur
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <template v-for="(perm, n) in item?.detail?.permintaanIter" :key="n">
                                <tr>
                                  <td width="5%">
                                    {{ n + 1 }}
                                  </td>
                                  <td>
                                    {{ perm?.kdobat }}
                                  </td>
                                  <td>
                                    {{ perm?.mobat?.nama_obat }}
                                  </td>
                                  <td>
                                    {{ perm?.jumlah }}
                                  </td>
                                  <td>
                                    {{ keluarNonIter(perm, item?.detail, item) }}
                                  </td>
                                  <td v-if="item?.flag == '4'">
                                    {{ retur(perm, item?.detail, item) }}
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </div>
                        <div v-if="item?.detail?.permintaanRacikan?.length > 0">
                          <div class="f-16 text-teal text-weight-bold q-mb-sm">
                            Racikan
                          </div>
                          <table>
                            <thead class="my-sticky-header-table">
                              <tr>
                                <th width="5%">
                                  No
                                </th>
                                <th>
                                  Kode Obat
                                </th>
                                <th>
                                  Nama Obat
                                </th>
                                <th>
                                  Nama Racikan
                                </th>
                                <th>
                                  Jumlah Racikan
                                </th>
                                <th>
                                  Minta
                                </th>
                                <th>
                                  Keluar
                                </th>
                                <th v-if="item?.flag == '4'">
                                  retur
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <template v-for="(perm, n) in item?.detail?.permintaanRacikan" :key="n">
                                <tr>
                                  <td width="5%">
                                    {{ n + 1 }}
                                  </td>
                                  <td>
                                    {{ perm?.kdobat }}
                                  </td>
                                  <td>
                                    {{ perm?.mobat?.nama_obat }}
                                  </td>
                                  <td>
                                    {{ perm?.namaracikan }}
                                  </td>
                                  <td>
                                    {{ perm?.jumlahdibutuhkan }} ({{ perm?.satuan_racik }})
                                  </td>
                                  <td>
                                    {{ perm?.jumlah }}
                                  </td>
                                  <td>
                                    {{ keluarRacikan(perm, item?.detail) }}
                                  </td>
                                  <td v-if="item?.flag == '4'">
                                    {{ retur(perm, item?.detail, item) }}
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </div>
                        <div v-if="item?.detail?.permintaanIterRacikan?.length > 0">
                          <div class="f-16 text-deep-purple text-weight-bold q-mb-sm">
                            Racikan Iter
                          </div>
                          <table>
                            <thead class="my-sticky-header-table">
                              <tr>
                                <th width="5%">
                                  No
                                </th>
                                <th>
                                  Kode Obat
                                </th>
                                <th>
                                  Nama Obat
                                </th>
                                <th>
                                  Nama Racikan
                                </th>
                                <th>
                                  Jumlah Racikan
                                </th>
                                <th>
                                  Minta
                                </th>
                                <th>
                                  Keluar
                                </th>
                                <th v-if="item?.flag == '4'">
                                  retur
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <template v-for="(perm, n) in item?.detail?.permintaanIterRacikan" :key="n">
                                <tr>
                                  <td width="5%">
                                    {{ n + 1 }}
                                  </td>
                                  <td>
                                    {{ perm?.kdobat }}
                                  </td>
                                  <td>
                                    {{ perm?.mobat?.nama_obat }}
                                  </td>
                                  <td>
                                    {{ perm?.namaracikan }}
                                  </td>
                                  <td>
                                    {{ perm?.jumlahdibutuhkan }} ({{ perm?.satuan_racik }})
                                  </td>
                                  <td>
                                    {{ perm?.jumlah }}
                                  </td>
                                  <td>
                                    {{ keluarRacikanIter(perm, item?.detail, item) }}
                                  </td>
                                  <td v-if="item?.flag == '4'">
                                    {{ retur(perm, item?.detail, item) }}
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-separator spaced inset />
            </q-list>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { api } from 'src/boot/axios'
import { dateDbFormat, dateFullFormat, formatJam } from 'src/modules/formatter'
import { ref } from 'vue'

const emits = defineEmits(['close'])
const props = defineProps({
  norm: {
    type: String,
    default: ""
  }
})
const loading = ref(false)
const items = ref([])
const param = ref({
  norm: props.norm,
  from: null,
  to: null,
  periode: 'Semua'
})

const periods = ref([
  'Semua',
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
  'Custom'
])
const periode = ref('Semua')
const showMenuPeriode = ref(false)
function hariIni () {
  const cDate = new Date()
  param.value.to = dateDbFormat(cDate)
  param.value.from = dateDbFormat(cDate)
}
function mingguIni () {
  const now = new Date()

  // getDay() => 0 (Minggu) - 6 (Sabtu)
  const firstday = new Date(now)
  firstday.setDate(now.getDate() - now.getDay()) // Minggu

  const lastday = new Date(now)
  lastday.setDate(now.getDate() - now.getDay() + 6) // Sabtu

  param.value.from = dateDbFormat(firstday)
  param.value.to = dateDbFormat(lastday)
}
function bulanIni () {
  const now = new Date()

  // ambil tanggal pertama & terakhir bulan ini
  const firstday = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastday = new Date(now.getFullYear(), now.getMonth() + 1, 0) // tanggal terakhir bulan ini

  param.value.from = dateDbFormat(firstday)
  param.value.to = dateDbFormat(lastday)
}

function setPeriode (val) {
  periode.value = val
  if (val == 'Hari ini') {
    // console.log(val, 'hari')
    hariIni()
  } else if (val == 'Minggu ini') {
    // console.log(val, 'minggu')
    mingguIni()
  } else if (val == 'Bulan ini') {
    // console.log(val, 'bulan')
    bulanIni()
  } else if (val == 'Semua') {
    param.value.from = null
    param.value.to = null
  }

}
function getData () {
  // console.log('norm', props.norm)
  param.value.norm = props.norm
  param.value.periode = periode.value

  loading.value = true
  return new Promise(resolve => {
    api.post('v1/simrs/farmasinew/depo/list-eresep-pasien', param.value)
      .then(resp => {
        items.value = resp?.data?.data
        console.log('resp', resp?.data)
        loading.value = false
        resolve(resp?.data)
      })
      .catch(() => {
        loading.value = false
      })
  })
}

function getStatus (val) {
  let balik = ' Belum ada status'
  switch (val) {
    case '':
      balik = ' draft (belum dikirimkan)'
      break
    case '1':
      balik = 'Belum diterima'
      break
    case '2':
      balik = 'Siap di kerjakan'
      break
    case '3':
      balik = 'Selesai'
      break
    case '4':
      balik = 'Returned'
      break
    case '5':
      balik = 'Ditolak'
      break

    default:
      break
  }
  return balik
}

function getColor (val) {
  let balik = 'grey'
  switch (val) {
    case '':
      balik = 'grey'
      break
    case '1':
      balik = 'grey'
      break
    case '2':
      balik = 'green'
      break
    case '3':
      balik = 'dark'
      break
    case '4':
      balik = 'orange'
      break
    case '5':
      balik = 'negative'
      break

    default:
      break
  }
  return balik
}

function showItem (item) {
  if (!item.detail || item.reloading) {
    item.loading = true
    const param = {
      params: {
        noresep: item?.noresep,
        noresep_asal: item?.noresep_asal
      }
    }
    return new Promise(resolve => {
      api.get('v1/simrs/farmasinew/depo/rincian-resep', param)
        .then(resp => {
          // items.value = resp?.data?.data
          console.log('resp detail', resp)
          item.detail = resp?.data
          delete item.loading
          delete item.reloading

          resolve(resp?.data)
        })
        .catch(() => {
          delete item.loading
          delete item.reloading

        })
    })

  }
}
function keluarNon (permintaan, detail) {
  const keluar = detail?.rincian?.filter(x => x.kdobat == permintaan.kdobat && x.noresep == permintaan.noresep)?.reduce((a, b) => a + b.jumlah, 0)
  return keluar ?? 0
}
function keluarRacikan (permintaan, detail) {
  const keluar = detail?.rincianRacikan?.filter(x => x.kdobat == permintaan.kdobat && x.noresep == permintaan.noresep)?.reduce((a, b) => a + b.jumlah, 0)
  return keluar ?? 0
}
function keluarNonIter (permintaan, detail, item) {
  const keluar = detail?.rincian?.filter(x => x.kdobat == permintaan.kdobat && x.noresep == item.noresep)?.reduce((a, b) => a + b.jumlah, 0)
  return keluar ?? 0
}
function keluarRacikanIter (permintaan, detail, item) {
  const keluar = detail?.rincianRacikan?.filter(x => x.kdobat == permintaan.kdobat && x.noresep == item.noresep)?.reduce((a, b) => a + b.jumlah, 0)
  return keluar ?? 0
}
function retur (permintaan, detail, item) {
  const keluar = detail?.retur?.filter(x => x.kdobat == permintaan.kdobat && x.noresep == item.noresep)?.reduce((a, b) => a + b.jumlah_retur, 0)
  return keluar ?? 0
}
</script>

<style lang="scss" scoped>
.hv:hover {
  background-color: #0D5A86;
  color: #fff
}

.gt {
  border-top: 1px solid black;
}

.gka {
  border-right: 1px solid black;
}

.gki {
  border-left: 1px solid black;
}

.gb {
  border-bottom: 1px solid black;
}

//
.head {
  border: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
}

.child {
  border-bottom: 1px solid rgb(44, 43, 43);
  border-left: 1px solid rgb(44, 43, 43);
  border-right: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
}

.text-end {
  text-align: end;
}

/* Standard Tables */

table {
  // margin: 1em 0;
  border-collapse: collapse;
  border: 1px solid #d6d6d6;
  width: 100%;
  margin-bottom: 50px;
}

thead {
  border: 1px solid black;

  tr {
    th {
      border: 1px solid black;
      vertical-align: center !important;
      background-color: white;
      color: black;
    }
  }
}

.odd {
  background-color: rgba(255, 255, 255, 0.05);
}

.even {
  background-color: rgba(0, 0, 0, 0.05);
}

// th,
td {

  text-align: left;
  text-indent: 2px;
  border: 1px solid black;
  vertical-align: center;
  border: 1px solid black;
}

// td {
//   // padding: 0.5em 0.5em 0.5em 1.5em;
// padding: 0.5em 0.5em 0.5em 1em;
// }
// th {
// border: inherit;
// border: 1px solid black;
// }
// tr{
//   border: 1px solid black;
// }
tr:nth-child(even) th[scope=row] {
  background-color: #f2f2f2;
}

tr:nth-child(odd) th[scope=row] {
  background-color: #fff;
}

// tr:nth-child(even) {
//   background-color: rgba(0, 0, 0, 0.05);
// }

// tr:nth-child(odd) {
//   background-color: rgba(255, 255, 255, 0.05);
// }

// td:nth-of-type(2) {
//   font-style: italic;
// }

// th:nth-of-type(3),
// td:nth-of-type(3) {
//   text-align: right;
// }
/* Fixed Headers */

th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 5;
  border: inherit;
}

th[scope=row] {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
  border: inherit;
}

th[scope=row] {
  vertical-align: top;
  color: inherit;
  background-color: inherit;
  background: linear-gradient(90deg, transparent 0%, transparent calc(100% - .05em), #d6d6d6 calc(100% - .05em), #d6d6d6 100%);
  border: inherit;
}

table:nth-of-type(2) th:not([scope=row]):first-child {
  left: 0;
  z-index: 3;
  background: linear-gradient(90deg, #666 0%, #666 calc(100% - .05em), #ccc calc(100% - .05em), #ccc 100%);
}

/* Strictly for making the scrolling happen. */

th[scope=row]+td {
  min-width: 24em;
}

th[scope=row] {
  min-width: 20em;
}
</style>
