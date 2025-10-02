<template>
  <table>
    <thead>
      <tr>
        <th width="5%">
          No
        </th>
        <th>
          Nomor
        </th>
        <th>
          Pasien
        </th>
        <th>
          Dokter
        </th>
        <th>
          Ruangan
        </th>
        <th class="text-end">
          Aksi
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-if="store.loading">
        <tr v-for="n in store.params.per_page" :key="n">
          <td width="5%">
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="50px" height="14px" />
            <q-skeleton type="text" width="40px" height="10px" />
          </td>
          <td>
            <div class="row q-mb-xs q-col-gutter-sm">
              <q-skeleton type="text" width="100px" height="14px" />
            </div>
            <div class="row q-col-gutter-sm items-center">
              <q-skeleton type="text" width="40px" height="14px" />
              <div class="text-grey q-pt-none">
                ||
              </div>
              <q-skeleton type="text" width="40px" height="14px" class="q-ml-xs" />
            </div>
          </td>
          <td>
            <q-skeleton type="text" width="100px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="100px" height="14px" />
          </td>
          <td class="text-end">
            <div class="row justify-end">
              <q-skeleton type="text" width="100px" height="14px" />
            </div>
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
        <template v-for="(item, n) in store.items" :key="n">
          <tr :class="item?.expand ? 'bg-green-2' : ''">
            <td width="5%">
              {{ n + 1 }}
            </td>
            <td>
              <div class="row ">
                {{ item?.noretur }}
              </div>
              <div class="row text-grey f-10">
                {{ dateFullFormat(item?.tgl_retur) }}
              </div>
              <div class="row f-10">
                {{ item?.noresep }}
              </div>

              <div class="row text-grey f-10">
                {{ dateFullFormat(item?.tgl_permintaan) }}
              </div>
            </td>
            <td>
              <div class="row text-weight-bold">
                {{ item?.datapasien?.rs2 }}
              </div>
              <div class="row">
                {{ item?.noreg }} || {{ item?.norm }}
              </div>
            </td>
            <td>
              {{ item?.dokter?.nama }}
            </td>
            <td>
              <div v-if="item?.poli">
                {{ item?.poli?.rs2 }}
              </div>
              <div v-if="item?.ruanganranap">
                {{ item?.ruanganranap?.rs2 }}
              </div>
            </td>
            <td class="text-end q-mr-sm">
              <q-btn square class="f-10" color="primary" text-color="white" no-caps @click="buka(item)">
                Lihat Rinci
              </q-btn>
            </td>
          </tr>
          <template v-if="item?.expand">
            <tr>
              <td colspan="6">
                <div class="row bg-primary text-white q-px-sm q-py-xs q-ml-sm">
                  <div class="col-auto" style="width: 5%;">
                    No
                  </div>
                  <div class="col-auto" style="width: 45%;">
                    Obat
                  </div>
                  <div class="col-auto" style="width: 25%;">
                    Obat Keluar
                  </div>
                  <div class="col-auto" style="width: 25%;">
                    Retur
                  </div>

                </div>

              </td>

            </tr>
            <template v-for="(detail, i) in item?.rinci" :key="i">
              <tr :class="i % 2 == 0 ? 'bg-light-blue-2' : 'bg-yellow-2'">
                <td colspan="6">
                  <div class="row q-px-sm q-py-xs q-ml-sm">
                    <div class="col-auto" style="width: 5%;">
                      {{ i + 1 }}
                    </div>
                    <div class="col-auto" style="width: 45%;">
                      <div class="row">
                        {{ detail?.mobatnew?.nama_obat }}
                      </div>
                      <div class="row f-10">
                        {{ detail?.mobatnew?.kd_obat }}
                      </div>
                    </div>
                    <div class="col-auto" style="width: 25%;">
                      {{ detail?.jumlah_keluar }}
                    </div>
                    <div class="col-auto" style="width: 25%;">
                      {{ detail?.jumlah_retur }}

                    </div>

                  </div>

                </td>
              </tr>
            </template>
          </template>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { dateFullFormat } from 'src/modules/formatter'
import { useListReturDepoStore } from 'src/stores/simrs/farmasi/retur/depo/list'

const store = useListReturDepoStore()

function buka (val) {
  console.log('buka', val)
  if (val?.expand === undefined) val.expand = true
  else val.expand = !val.expand
}


</script>

<style lang="scss" scoped>
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

th,
td {

  vertical-align: text-top;
  text-align: left;
  text-indent: -0.5em;
}

td {
  padding: 0.5em 0.5em 0.5em 1.5em;
}

th {
  padding: 0.5em 0.5em 0.5em 1em;
  vertical-align: bottom;
  background-color: $dark;
  color: $white;
}

tr:nth-child(even) th[scope=row] {
  background-color: #f2f2f2;
}

tr:nth-child(odd) th[scope=row] {
  background-color: #fff;
}

tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
}

tr:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.05);
}

td:nth-of-type(2) {
  font-style: italic;
}

// th:nth-of-type(3),
// td:nth-of-type(3) {
//   text-align: right;
// }
/* Fixed Headers */

th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
}

th[scope=row] {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
}

th[scope=row] {
  vertical-align: top;
  color: inherit;
  background-color: inherit;
  background: linear-gradient(90deg, transparent 0%, transparent calc(100% - .05em), #d6d6d6 calc(100% - .05em), #d6d6d6 100%);
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
