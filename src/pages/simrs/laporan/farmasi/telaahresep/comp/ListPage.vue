<template>
  <table style="width: calc(100vw - 80px);">
    <thead class="my-sticky-header-table">
      <tr v-if="store.params.jenis == 'Rinci'">
        <th width="5%">
          No
        </th>
        <th>
          Nomor Resep
        </th>
        <th>
          Nama Pasien
        </th>
        <th>
          Aspek Administratif
        </th>
        <th>
          Aspek Farmasetik
        </th>
        <th>
          Aspek Klinis
        </th>
        <th>
          Penelaah
        </th>
        <th>
          #
        </th>
      </tr>
      <tr v-else>
        <th width="5%">
          No
        </th>
        <th>
          Penelaah
        </th>
        <th>
          Jumlah
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-if="store.loading">
        <tr v-for="n in store.params.per_page" :key="n">
          <td width="5%">
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <template v-if="store.params.jenis == 'Rinci'">
            <td>
              <q-skeleton type="text" width="60px" height="25px" />
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
            <td>
              <q-skeleton type="text" width="60px" height="25px" />
            </td>
          </template>
          <td>
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
          <td>
            <q-skeleton type="text" width="60px" height="25px" />
          </td>
        </tr>
      </template>
      <template v-else-if="!store.items?.length">
        <tr>
          <td :colspan="store.params.jenis == 'Rinci' ? '8' : '3'">
            <app-no-data />
          </td>
        </tr>
      </template>
      <template v-else>
        <template v-for="(item, n) in store.items" :key="n">
          <tr :class="n % 2 === 0 ? 'even' : 'odd'">
            <td width="5%">
              <div class="row items-center">
                {{ n + 1 }}
              </div>
            </td>
            <template v-if="store.params.jenis == 'Rinci'">
              <td>
                {{ item?.noresep }}
              </td>
              <td>
                {{ item?.pasien?.rs2 }}
              </td>
              <td>
                <div v-for="(adm, j) in item?.administrasi" :key="adm">
                  <div class="row items-center" :class="j % 2 === 0 ? 'even' : 'odd'">
                    <div class="col-9">
                      Kode {{ adm?.kode }} Tentang {{ adm?.label }}
                    </div>
                    <div class="col-3">
                      : {{ adm?.value }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div v-for="(adm, j) in item?.komponen_resep" :key="adm">
                  <div class="row  items-center" :class="j % 2 === 0 ? 'even' : 'odd'">
                    <div class="col-9">
                      Kode {{ adm?.kode }} Tentang {{ adm?.label }}
                    </div>
                    <div class="col-3">
                      : {{ adm?.value }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div v-for="(adm, j) in item?.farmasi_klinis" :key="adm">
                  <div class="row  items-center" :class="j % 2 === 0 ? 'even' : 'odd'">
                    <div class="col-10">
                      Kode {{ adm?.kode }} Tentang {{ adm?.label }}
                    </div>
                    <div class="col-2">
                      : {{ adm?.value == false ? 'Tidak' : 'Ya' }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {{ item?.petugas?.nama }}
              </td>
              <td>
                <q-btn flat round dense color="primary" icon="icon-mat-print" @click="setPrint(item)" />
              </td>
            </template>
            <template v-else>
              <td>
                <div class="row items-center q-pa-sm">
                  {{ item?.nama }}
                </div>
              </td>
              <td>
                <div class="row items-center q-pa-sm">
                  {{ item?.total_telaah }}
                </div>
              </td>
            </template>
          </tr>
        </template>
        <template v-if="store.loadingNext">
          <tr v-for="n in store.params.per_page" :key="n">
            <td width="5%">
              <q-skeleton type="text" width="20px" height="14px" />
            </td>
            <template v-if="store.params.jenis == 'Rinci'">
              <td>
                <q-skeleton type="text" width="60px" height="25px" />
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
              <td>
                <q-skeleton type="text" width="60px" height="25px" />
              </td>
            </template>
            <td>
              <q-skeleton type="text" width="60px" height="25px" />
            </td>
            <td>
              <q-skeleton type="text" width="10px" height="25px" />
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { useLaporanTelaahResepObatStore } from 'src/stores/simrs/laporan/farmasi/telaah/telaah'

const store = useLaporanTelaahResepObatStore()
function setPrint (item) {
  store.dataToPrint = item
  store.isOpen = true
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
