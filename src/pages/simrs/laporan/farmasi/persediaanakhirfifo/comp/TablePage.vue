<template>
  <table>
    <thead class="my-sticky-header-table">
      <tr>
        <th
          width="5%"
        >
          No
        </th>
        <th>
          Obat
        </th>
        <th>
          Sumber Dana
        </th>
        <th>
          Jumlah
        </th>
        <th>
          Harga
        </th>
        <th>
          Nilai
        </th>
        <th>
          Subtotal
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-if="store.loading">
        <tr
          v-for="n in store.params.per_page"
          :key="n"
        >
          <td width="5%">
            <q-skeleton
              type="text"
              width="20px"
              height="14px"
            />
          </td>
          <td>
            <q-skeleton
              type="text"
              width="150px"
              height="25px"
            />
          </td>
          <td>
            <q-skeleton
              type="text"
              width="100px"
              height="14px"
            />
          </td>
          <td>
            <q-skeleton
              type="text"
              width="100px"
              height="14px"
            />
          </td>
          <td>
            <q-skeleton
              type="text"
              width="100px"
              height="14px"
            />
          </td>
          <td>
            <q-skeleton
              type="text"
              width="100px"
              height="14px"
            />
          </td>
          <td>
            <q-skeleton
              type="text"
              width="100px"
              height="14px"
            />
          </td>
        </tr>
      </template>
      <template v-else-if="!store.items?.length">
        <tr>
          <td colspan="7">
            <app-no-data />
          </td>
        </tr>
      </template>
      <template v-else>
        <template
          v-for="(item, n) in store.items"
          :key="n"
        >
          <tr :class="n%2===0?'even':'odd'">
            <td width="5%" :rowspan="item?.stok?.length + 1">
              <div class="row items-center">
                {{ n+1 }}
              </div>
            </td>
            <td :rowspan="item?.stok?.length + 1">
              <div class="row text-weight-bold">
                {{ item?.nama_obat }}
              </div>
              <div class="row items-end">
                <div class="col-auto f-10 q-mr-md">
                  {{ item?.kd_obat }}
                </div>
                <div class="col-auto q-mr-md f-11">
                  {{ item?.jenis_perbekalan }}
                </div>
                <div class="col-auto q-mr-md f-10">
                  ({{ item?.satuan_k }})
                </div>
              </div>
            </td>
            <td>
              {{ jenisPenerimaan(item?.stok[0]) }}
            </td>
            <td>
              <div class="text-right q-mr-xs">
                {{ cekNan(formatDouble(parseFloat(item?.stok[0]?.jumlah),2)) }}
              </div>
            </td>
            <td>
              <div class="text-right q-mr-xs">
                {{ cekNan(formatDouble(parseFloat(item?.stok[0]?.harga),2)) }}
              </div>
            </td>
            <td>
              <div class="text-right q-mr-xs">
                {{ cekNan(formatDouble(parseFloat(item?.stok[0]?.sub),2)) }}
              </div>
            </td>
            <td :rowspan="item?.stok?.length + 1">
              <div class="text-right q-mr-xs">
                {{ formatDouble(parseFloat(item?.subtotal),2) }}
              </div>
            </td>
          </tr>
          <tr v-for="(stok, i) in item?.stok" :key="stok" :class="n%2===0?'even':'odd'">
            <template v-if="i>0">
              <td>
                {{ jenisPenerimaan(stok) }}
              </td>
              <td>
                <div class="text-right q-mr-xs">
                  {{ cekNan(formatDouble(parseFloat(stok?.jumlah),2)) }}
                </div>
              </td>
              <td>
                <div class="text-right q-mr-xs">
                  {{ formatDouble(parseFloat(stok?.harga),2) }}
                </div>
              </td>
              <td>
                <div class="text-right q-mr-xs">
                  {{ formatDouble(parseFloat(stok?.sub),2) }}
                </div>
              </td>
            </template>
          </tr>
        </template>
        <tr class="text-weight-bold">
          <td colspan="6">
            Total
          </td>
          <td> {{ formatDouble(parseFloat(store.total),2) }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>

import { formatDouble } from 'src/modules/formatter'
import { useLaporanPersediaanFiFoFarmasiStore } from 'src/stores/simrs/laporan/farmasi/persediaanfifo/persediaan'

const store = useLaporanPersediaanFiFoFarmasiStore()

function jenisPenerimaan (val) {
  if (!val?.jenis_penerimaan && !val?.jumlah) return ''
  else if (!val?.jenis_penerimaan && val?.nopenerimaan?.toLowerCase().includes('awal')) return 'Simrs Lama'
  else if (val?.jenis_penerimaan?.toLowerCase().includes('pesanan') || val?.jenis_penerimaan?.toLowerCase().includes('pembelian langsung')) return 'Pembelian'
  else return val?.jenis_penerimaan
}
function cekNan (val) {
  // console.log('nan', val, isNaN(parseFloat(val)))
  return isNaN(parseFloat(val)) ? 0 : val
}
</script>

<style lang="scss" scoped>
.gt{
  border-top: 1px solid black;
}
.gka{
  border-right: 1px solid black;
}
.gki{
  border-left: 1px solid black;
}
.gb{
  border-bottom: 1px solid black;
}
//
.head{
  border: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
  background-color:  rgba(0, 0, 0, 0.9);
  color: white;
}
.child{
  border-bottom: 1px solid rgb(44, 43, 43);
  border-left: 1px solid rgb(44, 43, 43);
  border-right: 1px solid rgb(44, 43, 43);
  padding-left: 10px;
}
.text-end{
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
thead{
  border: 1px solid black;
  tr{
    th{
      border: 1px solid black;
      vertical-align: center !important;
      background-color: white;
      color: black;
    }
  }
}
.odd{
  background-color: rgba(255, 255, 255, 0.05);
}
.even{
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

th[scope=row] + td {
  min-width: 24em;
}

th[scope=row] {
  min-width: 20em;
}

</style>
