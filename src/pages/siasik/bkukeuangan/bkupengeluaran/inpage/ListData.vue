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
      <table class="bordered_table" style="width: 100%;" wrap-cells>
        <thead>
          <tr class="text-bold">
            <td class="text-center">No</td>
            <td class="text-center">Tanggal</td>
            <td class="text-center">Register/Rekening</td>
            <td class="text-center">Uraian</td>
            <td class="text-center">Penerimaan (Rp.)</td>
            <td class="text-center">Pengeluaran (Rp.)</td>
            <td class="text-center">Saldo (Rp.)</td>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, n) in store.hasilArray" :key="n">
            <tr>
              <td class="text-bold">
                {{ n + 1 }}
              </td>
              <td class="text-bold">
                {{ item?.tgl }}
              </td>
              <td class="text-left text-bold q-pl-sm q-pr-sm">
                {{ item?.notrans }}
              </td>
              <td class="text-left text-bold q-pl-sm q-pr-sm">
                {{ item?.uraian }}
              </td>
              <td class="text-right text-bold q-pl-sm q-pr-sm">
                {{ formattanpaRp(item?.penerimaan) }}
              </td>
              <td class="text-right text-bold q-pl-sm q-pr-sm">
                {{ formattanpaRp(item?.pengeluaran) }}
              </td>
              <td class="text-right text-bold q-pl-sm q-pr-sm">
                {{ formattanpaRp(item?.total) }}
              </td>
            </tr>
            <template v-if="item?.nonpd?.length">
              <template v-for="it in item?.nonpd" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px"> {{ it?.nonpd }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">{{ it?.uraianNPD }} </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.totalRincian) }}
                  </td>
                  <td></td>
                </tr>
                <template v-for="rek in it.rincian" :key="rek">
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.koderek50 }}</td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.rincianbelanja }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </template>
              </template>
            </template>
            <template v-if="item?.pjr?.length">
              <template v-for="it in item?.pjr" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px"> {{ it?.nonpd }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">{{ it?.uraianNPD }} </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.totalRincian) }}
                  </td>
                  <td></td>
                </tr>
                <template v-for="rek in it.rincian" :key="rek">
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.koderek50 }}</td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.rincianbelanja }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </template>
              </template>
            </template>
            <template v-if="item?.spjpanjar?.length">
              <template v-for="it in item?.spjpanjar" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">* {{ it?.koderek50 }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">* {{ it?.rincianbelanja }}</td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.totalRincian) }}
                  </td>
                  <td></td>
                </tr>
              </template>
            </template>
            <template v-if="item?.sisapanjar?.length">
              <template v-for="it in item?.sisapanjar" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">* {{ it?.koderek50 }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">* {{ it?.rincianbelanja }}</td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.totalRincian) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.totalRincian) }}
                  </td>
                  <td></td>
                </tr>
              </template>
            </template>
            <template v-if="item?.cppjr?.length">
              <template v-for="it in item?.cppjr" :key="it">
                <tr>
                  <td colspan="2"></td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">* {{ it?.nonpd }}</td>
                  <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px">* {{ it?.uraianNPD }} </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(it?.totalRincian) }}
                  </td>
                  <td class="text-right q-pl-sm q-pr-sm" style="font-size: 11px">
                    {{ formattanpaRp(0) }}
                  </td>
                  <td></td>
                </tr>
                <template v-for="rek in it.rincian" :key="rek">
                  <tr>
                    <td colspan="2"></td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.koderek50 }}</td>
                    <td class="text-left q-pl-sm q-pr-sm" style="font-size: 11px;"> * {{ rek?.rincianbelanja }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </template>
              </template>
            </template>
          </template>
          <tr>
            <td colspan="4" class="text-bold">TOTAL</td>
            <td class="text-right text-weight-bolder q-pl-sm q-pr-sm">
              {{ formattanpaRp(totaldebit()) }}
            </td>
            <td class="text-right text-weight-bolder q-pl-sm q-pr-sm">
              {{ formattanpaRp(totalkredit()) }}
            </td>
            <td class="text-right text-weight-bolder q-pl-sm q-pr-sm">
              {{ formattanpaRp(totalsaldo()) }}
            </td>
          </tr>
        </tbody>
      </table>

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
<style>
/* Tambahkan border pada setiap td dan th */
.bordered_table table,
.bordered_table tr,
.bordered_table td {
  border-collapse: collapse;
  border: 1px solid #000000;
  height: 30px;
  /* Garis hitam dengan ketebalan 1px */
}
</style>
