<template>
  <table style="width: calc(100vw - 80px);">
    <thead class="my-sticky-header-table">
      <template v-if="store?.params?.tipe == 'noreg'">
        <tr>
          <th width="5%" class="q-px-sm">
            No
          </th>
          <th class="q-px-sm">
            Noreg
          </th>
          <th class="q-px-sm">
            Poli
          </th>
          <th class="q-px-sm">
            Dokter
          </th>
          <th class="q-px-sm" v-if="store.params.jenis === 'detail'">
            Noresep
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Tgl Resep
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Nama Obat
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Jumlah Obat
          </th>
          <th v-if="store.params.jenis !== 'detail'" class="q-px-sm">
            Jumalah Resep
          </th>
        </tr>
      </template>
      <template v-else>
        <tr>
          <th width="5%" class="q-px-sm">
            No
          </th>
          <th class="q-px-sm">
            Noreg
          </th>
          <th class="q-px-sm">
            Nama Dokter
          </th>
          <th class="q-px-sm">
            Poli
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Nomor Resep
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Tgl Resep
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Kode Obat
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Nama Obat
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Jumlah Resep
          </th>
          <th v-if="store.params.jenis === 'detail'" class="q-px-sm">
            Jumlah Diberikan
          </th>
          <th v-if="store.params.jenis !== 'detail'" class="q-px-sm">
            Jumlah Item
          </th>
        </tr>
      </template>
    </thead>
    <tbody>
      <template v-if="store.loading">
        <tr v-for="n in store.params.per_page" :key="n">
          <td width="5%">
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
          <td>
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
          <td>
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
          <td v-if="store.params.jenis === 'detail'">
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
          <td v-if="store.params.jenis === 'detail'">
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
          <td v-if="store.params.jenis === 'detail'">
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
          <template v-if="store?.params?.tipe == 'item'">
            <td v-if="store.params.jenis === 'detail'">
              <q-skeleton type="text" width="60px" height="25px" />
            </td>
            <td v-if="store.params.jenis === 'detail'">
              <q-skeleton type="text" width="60px" height="25px" />
            </td>
            <td v-if="store.params.jenis === 'detail'">
              <q-skeleton type="text" width="60px" height="25px" />
            </td>
            <td v-if="store.params.jenis !== 'detail'">
              <q-skeleton type="text" width="60px" height="25px" />
            </td>

          </template>

        </tr>
      </template>
      <template v-else-if="!store.items?.length">
        <tr v-if="store.params.jenis === 'rekap'">
          <td colspan="8">
            <app-no-data />
          </td>
        </tr>
        <tr v-else>
          <td colspan="10">
            <app-no-data />
          </td>
        </tr>
      </template>
      <template v-else>
        <template v-for="(item, n) in store.items" :key="n">
          <tr :class="n % 2 === 0 ? 'even' : 'odd'">
            <td width="5%" :rowspan="rowspanObat(item)">
              <div class="row items-center justify-center">
                {{ n + 1 }}
              </div>
            </td>
            <template v-if="store?.params?.tipe == 'noreg'">
              <td :rowspan="rowspanObat(item)">{{ item.noreg }}</td>
              <td :rowspan="rowspanObat(item)">{{ item.poli }}</td>
              <td :rowspan="rowspanObat(item)">{{ item.dokter }}</td>
              <template v-if="store.params.jenis === 'rekap'">
                <td :rowspan="rowspanObat(item)">{{ item.total_resep }}</td>
              </template>
              <template v-else>
                <td :rowspan="rowspanObat(item)">{{ item.noresep }}</td>
                <td :rowspan="rowspanObat(item)">{{ item.tgl_permintaan }}</td>
                <td v-if='item.detail?.length == 0'>-</td>
                <td v-if='item.detail?.length == 0'>-</td>
              </template>
            </template>
          </tr>
          <template v-for="det in item.detail" :key="det.id">
            <tr>
              <td>{{ det.mobat?.nama_obat }}</td>
              <td>{{ det.jumlah }}</td>
            </tr>
          </template>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>

// eslint-disable-next-line no-unused-vars
import { dateFullFormat, formatDouble } from 'src/modules/formatter'
import { useLaporanEvaluasiResepStore } from 'src/stores/simrs/laporan/farmasi/evaluasiResep/evaluasi'

const store = useLaporanEvaluasiResepStore()

function rowspanObat (val) {
  const salLength = val?.detail?.length
  const panj = salLength + 1
  // console.log('panj', panj)

  return panj
}
function cekNan (val) {
  return isNaN(parseFloat(val)) ? '' : val
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
