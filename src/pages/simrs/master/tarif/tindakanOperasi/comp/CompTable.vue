<template>
  <!-- {{ loading }} -->
  <table style="width: calc(100vw - 70px); margin-right: 7px; margin-left: 5px;">
    <thead class="my-sticky-header-table">
      <tr class="baris-1">
        <th rowspan="2" width="5%" class="q-px-sm">
          No
        </th>
        <th rowspan="2" class="q-px-sm">
          Kode
        </th>
        <th rowspan="2" class="q-px-sm">
          Nama
        </th>
        <th colspan="4" class="q-px-sm">
          Tarif 1
        </th>
        <th colspan="4" class="q-px-sm">
          Tarif 2
        </th>
        <th colspan="3" class="q-px-sm">
          Poli
        </th>
        <th colspan="4" class="q-px-sm">
          Presidensial
        </th>
        <th rowspan="2" class="q-px-sm">
          Tgl Update Tarif
        </th>
        <th rowspan="2" class="q-px-sm">
          Tgl Hapus
        </th>
        <th rowspan="2" class="q-px-sm">
          Dasar Perubahan
        </th>
        <th rowspan="2" class="q-px-sm">
          #
        </th>
      </tr>
      <tr class="baris-2">
        <th>JS</th>
        <th>JP</th>
        <th>Anastesi</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>Anastesi</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>Anastesi</th>
        <th>Tarif</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="loading">
        <tr v-for="n in params.per_page" :key="n">
          <td width="5%">
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>

          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>

          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>

          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>

          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
          <td>
            <q-skeleton type="text" width="20px" height="14px" />
          </td>
        </tr>
      </template>
      <template v-else-if="!items?.length">
        <tr>
          <td colspan="22">
            <app-no-data />
          </td>
        </tr>
      </template>
      <template v-else>
        <template v-for="(item, n) in items" :key="n">
          <tr :class="n % 2 === 0 ? 'even' : 'odd'">
            <td width="5%">
              <div class="row items-center justify-center">
                {{ n + 1 }}
              </div>
            </td>
            <td>
              {{ item?.rs1 }}
            </td>
            <td>
              {{ item?.rs2 }}
            </td>

            <td class="text-end">
              <div v-if="item?.rs6">
                {{ formatRp(item?.rs6 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.rs7">
                {{ formatRp(item?.rs7 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.rs8">
                {{ formatRp(item?.rs8 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div>
                {{ formatRp(((item?.rs6 ?? 0) + (item?.rs7 ?? 0) + (item?.rs8 ?? 0)) ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.rs9">
                {{ formatRp(item?.rs9 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.rs10">
                {{ formatRp(item?.rs10 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.rs11">
                {{ formatRp(item?.rs11 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div>
                {{ formatRp(((item?.rs9 ?? 0) + (item?.rs10 ?? 0) + (item?.rs11 ?? 0)) ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.rs12">
                {{ formatRp(item?.rs12 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.rs13">
                {{ formatRp(item?.rs13 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div>
                {{ formatRp(((item?.rs12 ?? 0) + (item?.rs13 ?? 0)) ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.ssp">
                {{ formatRp(item?.ssp ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.psp">
                {{ formatRp(item?.psp ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.asp">
                {{ formatRp(item?.asp ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div>
                {{ formatRp(((item?.ssp ?? 0) + (item?.psp ?? 0) + (item?.asp ?? 0)) ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.tgl_mulai_berlaku">
                {{ dateFullFormat(item?.tgl_mulai_berlaku) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tgl_hapus">
                {{ dateFullFormat(item?.tgl_hapus) }}
              </div>
            </td>
            <td class="text-end">
              <div>
                {{ item?.dasar_perubahan }}
              </div>
            </td>
            <td class="text-end">
              <div class="row no-wrap q-col-gutter-x-xs justify-end">
                <q-btn v-if="sudahDiHapus(item) && lewatBerlaku(item)" flat class="" size="sm" round color="grey"
                  icon="icon-mat-edit" @click="emits('editData', item)">
                  <q-tooltip anchor="top middle" self="center middle">
                    Edit Data
                  </q-tooltip>
                </q-btn>
                <q-btn v-if="sudahDiHapus(item) && lewatBerlaku(item)" flat class="" size=" sm" round color="grey"
                  icon="icon-mat-delete_sweep" @click="deleteOne(item)">
                  <q-tooltip anchor="top middle" self="center middle">
                    Delete Data
                  </q-tooltip>
                </q-btn>
                <q-btn v-if="!sudahDiHapus(item)" flat class="" size=" sm" round color="grey" icon="icon-mat-check"
                  @click="undeleteOne(item)">
                  <q-tooltip anchor="top middle" self="center middle">
                    Tampilkan lagi
                  </q-tooltip>
                </q-btn>

              </div>
            </td>

          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { date, Dialog } from 'quasar'
import { dateFullFormat, formatRp } from 'src/modules/formatter'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  polis: {
    type: Array,
    default: () => { }
  },
  ruangRanap: {
    type: Array,
    default: () => { }
  },
  params: {
    type: Object,
    default: () => { }
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['editData', 'delete', 'undelete'])

function deleteOne (item) {
  Dialog.create({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true
    // persistent: true
  }).onOk(() => {
    emits('delete', item)
  }).onCancel(() => {
    console.log('Cancel')
    selected.value = []
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
function undeleteOne (item) {
  Dialog.create({
    title: 'Peringatan',
    message: 'Apakah Data ini akan di tampilkan kembali?',
    cancel: true
    // persistent: true
  }).onOk(() => {
    emits('undelete', item)
  }).onCancel(() => {
    console.log('Cancel')
    selected.value = []
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
function sudahDiHapus (item) {
  let tampil = true
  if (item?.tgl_hapus) {
    const hariIni = new Date()
    const tglHapus = new Date(item?.tgl_hapus)
    const diff = date.getDateDiff(tglHapus, hariIni, 'days')
    // console.log('diff', diff, tglHapus, item?.tgl_hapus)
    if (diff < 0) tampil = false
  }
  return tampil
}
function lewatBerlaku (item) {
  let tampil = true
  if (item?.tgl_mulai_berlaku) {
    const hariIni = new Date()
    const tglBErlaku = new Date(item?.tgl_mulai_berlaku)
    const diff = date.getDateDiff(tglBErlaku, hariIni, 'days')
    // console.log('diff', diff, tglHapus, item?.tgl_hapus)
    if (diff <= 0) tampil = false
  }
  return tampil
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
  padding-left: 2px;
  padding-right: 2px;
}


table {
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
  // top: 100px;
  z-index: 5;
  border: inherit;
}

thead tr.row-1 th {
  position: -webkit-sticky;
  position: sticky;
  top: 100px;
  z-index: 5;
  border: inherit;
}

thead tr.row-2 th {
  position: -webkit-sticky;
  position: sticky;
  top: 180px;
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
