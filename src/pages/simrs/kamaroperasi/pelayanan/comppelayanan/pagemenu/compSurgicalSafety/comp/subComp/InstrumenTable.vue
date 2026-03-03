<template>
  <table style="width: calc(80vw + 10px); margin-bottom: 10px;">
    <thead class="my-sticky-header-table">
      <tr>
        <th width="5%">
          No
        </th>
        <th>
          Nama
        </th>
        <th>
          Persediaan Awal
        </th>
        <th>
          Penambahan
        </th>
        <th>
          Pemakaian
        </th>
        <th>
          Sisa
        </th>
        <th>
          Total
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-if="store.loading">
        <tr>
          <td>
            <app-loading />
          </td>
        </tr>
      </template>
      <template v-else-if="!store?.formInstrumen?.length">
        <tr>
          <td colspan="8">
            <app-no-data />
          </td>
        </tr>
      </template>
      <template v-else>
        <template v-for="(item, n) in store?.formInstrumen" :key="n">
          <tr :class="n % 2 === 0 ? 'even' : 'odd'">
            <td width="5%">
              <div class="row items-center">
                {{ n + 1 }}
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row  q-mr-sm">
                <div class="col-auto">
                  {{ item?.nama }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <app-input valid v-model="item.awal" label="" outlined dense
                @update:model-value="hitung($event, 'awal', item)" />
            </td>
            <td style="white-space: normal;">
              <app-input valid v-model="item.tambah" label="" outlined dense
                @update:model-value="hitung($event, 'tambah', item)" />
            </td>
            <td style="white-space: normal;">
              <app-input valid v-model="item.pakai" label="" outlined dense
                @update:model-value="hitung($event, 'pakai', item)" />
            </td>
            <td style="white-space: normal;">
              <div class="row q-mr-sm" :class="item.sisa < 0 ? 'bg-negative text-white' : ''">
                <div class="col-auto">
                  {{ item?.sisa }}
                </div>
              </div>
            </td>
            <td style="white-space: normal;">
              <div class="row  q-mr-sm" :class="item.akhir < 0 ? 'bg-negative text-white' : ''">
                <div class="col-auto">
                  {{ item?.akhir }}
                </div>
              </div>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
  <div class="row justify-end">
    <div class="col-auto">
      <q-btn icon="save" dense color="primary" no-caps label="Simpan" :loading="store.loading" :disable="store.loading"
        @click="store.simpanFormInstrumen" />
    </div>
  </div>
</template>
<script setup>
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
const store = useSurgicalSafetyStore()
function hitung (event, type, item) {
  // console.log('evt', event, type, item)
  item[type] = isNaN(parseInt(event)) ? 0 : parseInt(event)
  const awal = parseInt(item.awal ?? 0)
  const tambah = parseInt(item.tambah ?? 0)
  const pakai = parseInt(item.pakai ?? 0)
  item.sisa = awal + tambah - pakai
  item.akhir = item.sisa + pakai
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

td {

  text-align: left;
  text-indent: 2px;
  border: 1px solid black;
  vertical-align: center;
  border: 1px solid black;
}

tr:nth-child(even) th[scope=row] {
  background-color: #f2f2f2;
}

tr:nth-child(odd) th[scope=row] {
  background-color: #fff;
}

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
