<template>
  <template v-if="store.loading">
    <div class="row justify-center">
      <div class="q-gutter-md">
        <q-spinner-pie color="amber-13" type="circle" animation="pulse-x" size="40px" />
        <q-spinner-pie color="amber-13" type="circle" animation="pulse-x" size="60px" />
        <q-spinner-pie color="amber-13" type="circle" animation="pulse-x" size="40px" />
      </div>
    </div>
  </template>
  <template v-else-if="store.items.length === 0">
    <div class="row flex flex-center">
      <div class="kosong">
        <div>Data Belum Ada</div>
        <div>Silahkan Pilih Parameter</div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="row q-px-md full-width flex-center">
      <q-markup-table class="full-width" flat-bordered wrap-cells :separator="separator">
        <thead class="align-middle text-center" style="height: 40px">
          <tr style="font-size: 12px">
            <th width="30px">
              No
            </th>
            <th width="10%">
              Tanggal
            </th>
            <th width="25%">
              Register/Rekening
            </th>
            <th width="70%">
              Uraian
            </th>
            <th>Penerimaan (Rp.)</th>
            <th>Pengeluaran (Rp.)</th>
            <th>Saldo (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, n) in store.hasilArray" :key="item">
            <td data-th="No" class="text-bold" style="vertical-align: top; height:40px">
              {{ n + 1 }}
            </td>
            <td data-th="Tanggal" class="text-bold" style="vertical-align: top; height:40px">
              {{ item?.tgl }}
            </td>
            <td data-th="Register/Rekening" class="text-left q-pl-sm" style="vertical-align: top; height:40px">
              <div class="text-bold" style="vertical-align: top; height:40px">
                {{ item?.notrans }}
              </div>
              <template v-if="item?.nonpd?.length">
                <div v-for="npd in item?.nonpd" :key="npd">
                  <div style="font-size: 11px">
                    {{ npd?.nonpd }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px">
                      * {{ rincian?.koderek50 }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.geserDebit?.length">
                <div v-for="geser in item?.geserDebit" :key="geser">
                  <div style="font-size: 11px">
                    {{ geser?.nonpd }}
                  </div>
                </div>
              </template>
              <template v-if="item?.geserKredit?.length">
                <div v-for="geser in item?.geserKredit" :key="geser">
                  <div style="font-size: 11px">
                    {{ geser?.nonpd }}
                  </div>
                </div>
              </template>
              <template v-if="item?.pjr?.length">
                <div v-for="npd in item?.pjr" :key="npd">
                  <div style="font-size: 11px">
                    {{ npd?.nonpd }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px">
                      * {{ rincian?.koderek50 }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.spjpanjar?.length">
                <div v-for="spjp in item?.spjpanjar" :key="spjp">
                  <div style="font-size: 11px">
                    * {{ spjp?.koderek50 }}
                  </div>
                </div>
              </template>
              <template v-if="item?.sisapanjar?.length">
                <div v-for="cp in item?.sisapanjar" :key="cp">
                  <div style="font-size: 11px">
                    * {{ cp?.koderek50 }}
                  </div>
                </div>
              </template>
              <template v-if="item?.cppjr?.length">
                <div v-for="cp in item?.cppjr" :key="cp">
                  <div style="font-size: 11px">
                    {{ cp?.nonpd }}
                  </div>
                  <div v-for="rincian in cp?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px">
                      * {{ rincian?.koderek50 }}
                    </div>
                  </div>
                </div>
              </template>
            </td>

            <td data-th="Uraian" class="text-left q-pl-sm" style="vertical-align: top">
              <div class="text-bold" style="vertical-align: top; height:40px">
                {{ item?.uraian }}
              </div>
              <template v-if="item?.nonpd?.length">
                <div v-for="npd in item?.nonpd" :key="npd">
                  <div style="font-size: 11px">
                    {{ npd?.uraianNPD }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px">
                      * {{ rincian?.rincianbelanja }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.geserDebit?.length">
                <div v-for="geser in item?.geserDebit" :key="geser">
                  <div style="font-size: 11px">
                    {{ geser?.uraianNPD }}
                  </div>
                </div>
              </template>
              <template v-if="item?.geserKredit?.length">
                <div v-for="geser in item?.geserKredit" :key="geser">
                  <div style="font-size: 11px">
                    {{ geser?.uraianNPD }}
                  </div>
                </div>
              </template>
              <template v-if="item?.pjr?.length">
                <div v-for="npd in item?.pjr" :key="npd">
                  <div style="font-size: 11px">
                    {{ npd?.uraianNPD }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px">
                      * {{ rincian?.rincianbelanja }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.spjpanjar?.length">
                <div v-for="spjp in item?.spjpanjar" :key="spjp">
                  <div style="font-size: 11px">
                    * {{ spjp?.rincianbelanja }}
                  </div>
                </div>
              </template>
              <template v-if="item?.sisapanjar?.length">
                <div v-for="cp in item?.sisapanjar" :key="cp">
                  <div style="font-size: 11px">
                    * {{ cp?.rincianbelanja }}
                  </div>
                </div>
              </template>
              <template v-if="item?.cppjr?.length">
                <div v-for="cp in item?.cppjr" :key="cp">
                  <div style="font-size: 11px">
                    {{ cp?.uraianNPD }}
                  </div>
                  <div v-for="rincian in cp?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px">
                      * {{ rincian?.rincianbelanja }}
                    </div>
                  </div>
                </div>
              </template>
            </td>
            <td data-th="Penerimaan" class="text-right q-pr-sm" style="vertical-align: top">
              <div class="text-bold" style="vertical-align: top; height:40px">
                {{ formattanpaRp(item?.penerimaan) }}
              </div>
              <template v-if="item?.nonpd?.length">
                <div v-for="npd in item?.nonpd" :key="npd">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px" class="text invisible">
                      {{ formattanpaRp(0) }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.geserDebit?.length">
                <div v-for="geser in item?.geserDebit" :key="geser">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(geser?.nilai) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.geserKredit?.length">
                <div v-for="geser in item?.geserKredit" :key="geser">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(geser?.nilai) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.pjr?.length">
                <div v-for="npd in item?.pjr" :key="npd">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div class="text invisible" style="font-size: 11px; height:40px">
                      {{ formattanpaRp(0) }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.spjpanjar?.length">
                <div v-for="spjp in item?.spjpanjar" :key="spjp">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.sisapanjar?.length">
                <div v-for="cp in item?.sisapanjar" :key="cp">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(cp?.totalRincian) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.cppjr?.length">
                <div v-for="cp in item?.cppjr" :key="cp">
                  <div style="font-size: 11px">
                    {{ cp?.totalRincian }}
                  </div>
                  <div v-for="rincian in cp?.rincian" :key="rincian">
                    <div class="text invisible" style="font-size: 11px; height:40px">
                      {{ formattanpaRp(0) }}
                    </div>
                  </div>
                </div>
              </template>
            </td>
            <td data-th="Pengeluaran" class="text-right q-pr-sm" style="vertical-align: top">
              <div class="text-bold" style="vertical-align: top; height:40px">
                {{ formattanpaRp(item?.pengeluaran) }}
              </div>
              <template v-if="item?.nonpd?.length">
                <div v-for="npd in item?.nonpd" :key="npd">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(npd.totalRincian) }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div style="font-size: 11px; height:40px" class="text invisible">
                      {{ formattanpaRp(0) }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.geserDebit?.length">
                <div v-for="geser in item?.geserDebit" :key="geser">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.geserKredit?.length">
                <div v-for="geser in item?.geserKredit" :key="geser">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.pjr?.length">
                <div v-for="npd in item?.pjr" :key="npd">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(npd.totalRincian) }}
                  </div>
                  <div v-for="rincian in npd?.rincian" :key="rincian">
                    <div class="text invisible" style="font-size: 11px; height:40px">
                      {{ formattanpaRp(0) }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="item?.spjpanjar?.length">
                <div v-for="spjp in item?.spjpanjar" :key="spjp">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(spjp.totalRincian) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.sisapanjar?.length">
                <div v-for="cp in item?.sisapanjar" :key="cp">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </div>
                </div>
              </template>
              <template v-if="item?.cppjr?.length">
                <div v-for="cp in item?.cppjr" :key="cp">
                  <div style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </div>
                  <div v-for="rincian in cp?.rincian" :key="rincian">
                    <div class="text invisible" style="font-size: 11px; height:40px">
                      {{ formattanpaRp(0) }}
                    </div>
                  </div>
                </div>
              </template>
            </td>
            <td data-th="Saldo" class="text-right q-pr-sm text-bold" style="vertical-align: top">
              {{ formattanpaRp(item.total) }}
            </td>
          </tr>
          <tr>
            <th colspan="4">
              TOTAL
            </th>
            <th class="text-right text-weight-bolder q-pr-sm">
              {{ formattanpaRp(totaldebit()) }}
            </th>
            <th class="text-right text-weight-bolder q-pr-sm">
              {{ formattanpaRp(totalkredit()) }}
            </th>
            <th class="text-right text-weight-bolder q-pr-sm">
              {{ formattanpaRp(totalsaldo()) }}
            </th>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </template>
</template>

<script setup>
import { formattanpaRp } from 'src/modules/formatter';
import { useLaporanBkuPengeluaranStore } from 'src/stores/siasik/laporan/bku/bkupengeluaran';
import { ref } from 'vue';

const separator = ref('cell')
const store = useLaporanBkuPengeluaranStore()
function totaldebit() {
  const debit = store.hasilArray
  // console.log("njaaias", debit);
  const totaldebit = debit?.length
    ? debit?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totaldebit
}
function totalkredit() {
  const kredit = store.hasilArray
  // console.log("njaaias", debit);
  const totalkredit = kredit?.length
    ? kredit?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalkredit
}

function totalsaldo() {
  const saldo = store.hasilArray
  // console.log("njaaias", debit);
  const totalsaldo = saldo?.length
    ? saldo?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0) -
    saldo?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalsaldo
}

// const listDatabku = [
//   {
//     label: 'No',
//     name: 'no',
//     field: row => [row.rowIndex],
//     align: 'center',
//     headerStyle: 'height:50px; font-weight: bold; font-size: 11px'
//   },
//   {
//     label: 'Tanggal',
//     name: 'tgl',
//     field: row => [row.tgl],
//     align: 'center',
//     headerStyle: 'height:50px; font-weight: bold; font-size: 11px'
//   },
//   {
//     label: 'Registe/Rekening',
//     name: 'notrans',
//     field: row => [row.notrans],
//     align: 'left',
//     headerStyle: 'height:50px; font-weight: bold; font-size: 11px'
//   },
//   {
//     label: 'Uraian',
//     name: 'uraian',
//     field: row => [row.uraian],
//     align: 'left',
//     headerStyle: 'height:50px; font-weight: bold; font-size: 11px'
//   },
//   {
//     label: 'Penerimaan (Rp.)',
//     name: 'penerimaan',
//     field: row => [row.penerimaan],
//     align: 'right',
//     headerStyle: 'height:50px; font-weight: bold; font-size: 11px'
//   },
//   {
//     label: 'Pengeluaran (Rp.)',
//     name: 'pengeluaran',
//     field: row => [row.pengeluaran],
//     align: 'right',
//     headerStyle: 'height:50px; font-weight: bold; font-size: 11px'
//   },
//   {
//     label: 'Saldo (Rp.)',
//     name: 'total',
//     field: row => [row.total],
//     align: 'right',
//     headerStyle: 'height:50px; font-weight: bold; font-size: 11px'
//   }


// ]
// const columns = ref(listDatabku)

// const seedSize = store.hasilArray.length

// let rows = []
// for (let i = 0; i < 1000; i++) {
//   rows = rows.concat(store.hasilArray.map((r, j) => ({ ...r, index: i * seedSize + j + 1 })))
// }

// const tableRef = ref(null)

// onMounted(() => {
//   tableRef.value.scrollTo(5000)
// })

// const pagination = {
//   rowsPerPage: 0
// }
</script>
