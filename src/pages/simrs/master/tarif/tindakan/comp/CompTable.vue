<template>
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
        <th rowspan="2" class="q-px-sm">
          Berlaku di Ruangan
        </th>
        <th colspan="4" class="q-px-sm">
          Kelas 3
        </th>
        <th colspan="4" class="q-px-sm">
          Kelas 2
        </th>
        <th colspan="4" class="q-px-sm">
          Kelas 1
        </th>
        <th colspan="4" class="q-px-sm">
          Utama
        </th>
        <th colspan="4" class="q-px-sm">
          VIP
        </th>
        <th colspan="4" class="q-px-sm">
          VVIP
        </th>
        <th colspan="4" class="q-px-sm">
          Presidential
        </th>
        <th colspan="4" class="q-px-sm">
          HCU
        </th>
        <th colspan="4" class="q-px-sm">
          Home Care
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
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
        <th>Tarif</th>
        <th>JS</th>
        <th>JP</th>
        <th>HP</th>
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
          <td colspan="43">
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
              {{ item?.kdtindakan }}
            </td>
            <td>
              {{ item?.nmtindakan }}
            </td>
            <td>
              {{ BerlakuDiRuangan(item) }}
            </td>

            <td class="text-end">
              <div v-if="item?.js3">
                {{ formatRp(item?.js3 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jp3">
                {{ formatRp(item?.jp3 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispake3">
                {{ formatRp(item?.habispake3 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarif3">
                {{ formatRp(item?.tarif3 ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.js2">
                {{ formatRp(item?.js2 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jp2">
                {{ formatRp(item?.jp2 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispake2">
                {{ formatRp(item?.habispake2 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarif2">
                {{ formatRp(item?.tarif2 ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.js1">
                {{ formatRp(item?.js1 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jp1">
                {{ formatRp(item?.jp1 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispake1">
                {{ formatRp(item?.habispake1 ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarif1">
                {{ formatRp(item?.tarif1 ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.jsutama">
                {{ formatRp(item?.jsutama ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jputama">
                {{ formatRp(item?.jputama ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispakeutama">
                {{ formatRp(item?.habispakeutama ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarifutama">
                {{ formatRp(item?.tarifutama ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.jsvip">
                {{ formatRp(item?.jsvip ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jpvip">
                {{ formatRp(item?.jpvip ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispakevip">
                {{ formatRp(item?.habispakevip ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarifvip">
                {{ formatRp(item?.tarifvip ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.jsvvip">
                {{ formatRp(item?.jsvvip ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jpvvip">
                {{ formatRp(item?.jpvvip ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispakevvip">
                {{ formatRp(item?.habispakevvip ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarifvvip">
                {{ formatRp(item?.tarifvvip ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.js_presidential">
                {{ formatRp(item?.js_presidential ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jp_presidential">
                {{ formatRp(item?.jp_presidential ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispake_presidential">
                {{ formatRp(item?.habispake_presidential ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarif_presidential">
                {{ formatRp(item?.tarif_presidential ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.js_hcu">
                {{ formatRp(item?.js_hcu ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jp_hcu">
                {{ formatRp(item?.jp_hcu ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispake_hcu">
                {{ formatRp(item?.habispake_hcu ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarif_hcu">
                {{ formatRp(item?.tarif_hcu ?? 0) }}
              </div>
            </td>

            <td class="text-end">
              <div v-if="item?.js_hc">
                {{ formatRp(item?.js_hc ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.jp_hc">
                {{ formatRp(item?.jp_hc ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.habispake_hc">
                {{ formatRp(item?.habispake_hc ?? 0) }}
              </div>
            </td>
            <td class="text-end">
              <div v-if="item?.tarif_hc">
                {{ formatRp(item?.tarif_hc ?? 0) }}
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
                <q-btn v-if="sudahDiHapus(item)" flat class="" size="sm" round color="grey" icon="icon-mat-edit"
                  @click="emits('editData', item)">
                  <q-tooltip anchor="top middle" self="center middle">
                    Edit Data
                  </q-tooltip>
                </q-btn>
                <q-btn v-if="sudahDiHapus(item)" flat class="" size=" sm" round color="grey"
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
function BerlakuDiRuangan (item) {
  const ruangans = item?.ruangan.split('|')
  const ruang = []
  if (ruangans?.length > 1) {
    ruangans.forEach(element => {
      if (element != '') {
        const poli = props?.polis?.find(x => x?.kodepoli == element)
        const ranap = props?.ruangRanap?.find(x => x?.groups == element)
        if (poli) ruang.push({ kode: poli?.kodepoli, nama: poli?.polirs })
        if (ranap) ruang.push({ kode: ranap?.groups, nama: ranap?.groups_nama })
      }
      // console.log('poli', props?.polis, element, poli, ranap)

    })
  }
  // console.log('berlaku', ruang)
  return ruang.map(x => x?.nama).join(', ')
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
