<template>
  <q-card flat class="col full-height">
    <div class="row items-start justify-between q-pb-sm">

      <div class="col-6 q-pl-sm">
        <div class="q-pb-sm" style="width: 280px; display: grid; grid-template-columns: auto 10px 1fr; row-gap: 4px;">
          <div class="text-bold">Total Anggaran</div>
          <div class="text-bold text-center">:</div>
          <div class="text-bold text-right">
            {{ formattanpaRp(store.form.pagu || 0) }}
          </div>

          <div class="text-bold">Total Pengusulan</div>
          <div class="text-bold text-center">:</div>
          <div class="text-bold text-right">
            {{ formattanpaRp(subtotal()) }}
          </div>

          <div class="text-bold">Selisih</div>
          <div class="text-bold text-center">:</div>
          <div class="text-bold text-right">
            {{ formattanpaRp(selisih()) }}
          </div>
        </div>
      </div>
      <div class="col-auto q-pa-sm self-end">
        <q-input v-model="search" dense outlined debounce="300" placeholder="Cari item / rekening / uraian..."
          style="width: 300px">
          <template #prepend>
            <q-icon name="icon-mat-search" />
          </template>
          <template v-if="search" #append>
            <q-icon name="icon-mat-close" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>
      </div>
    </div>
    <q-table class="my-sticky-table" :rows="displayRows" :columns="columns" row-key="name" hide-pagination hide-bottom
      wrap-cells :rows-per-page-options="[0]" :rows-number="[0]">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="kode" :props="props" class="text-left">
            {{ props.row.koders }}
          </q-td>
          <q-td key="keterangan" :props="props" class="text-left">
            {{ props.row.usulan }}
          </q-td>
          <q-td key="kode50" :props="props" class="text-left">
            <div>{{ props.row.koderek50 }}</div>
            <div>{{ props.row.uraian50 }}</div>
          </q-td>
          <q-td key="kode108" :props="props" class="text-left">
            <div>{{ props.row.koderek108 || '-' }}</div>
            <div>{{ props.row.uraian108 }}</div>
          </q-td>
          <q-td key="volume" :props="props" class="text-left">
            {{ props.row.volume }}
          </q-td>
          <q-td key="satuan" :props="props" class="text-left">
            {{ props.row.satuan }}
          </q-td>
          <q-td key="harga" :props="props" class="text-right">
            {{ formattanpaRp(props.row.harga) }}
          </q-td>
          <q-td key="nilai" :props="props" class="text-right">
            {{ formattanpaRp(props.row.pagu) }}
          </q-td>
          <q-td>
            <div class="row items-center justify-center q-gutter-x-sm">
              <q-btn size="xs" round class="items-center" color="green" icon="icon-mat-edit"
                @click="editData(props?.row)" :loading="store.loadingSave" />

              <!-- <q-btn size="xs" round class="items-center" color="negative" icon="icon-mat-delete"
                @click="deleteData(props?.row?.id)" :loading="store.loadingDelete" /> -->
            </div>
          </q-td>
        </q-tr>
      </template>
      <template #bottom-row>
        <q-tr class="full-width text-bold">
          <q-td colspan="4" class="text-center" style="font-size: 4em">
            SUBTOTAL
          </q-td>
          <q-td colspan="2" class="text-right text-bold" style="font-size: 4em">
            {{ formattanpaRp(subtotal()) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

  </q-card>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { formattanpaRp } from 'src/modules/formatter';
import { notifErrVue, notifSuccess } from 'src/modules/utils';
import { usePergeseranAnggaranStore } from 'src/stores/siasik/anggaran/pergeseran/pergeseranrincian';

import { computed, onMounted, ref } from 'vue';
const store = usePergeseranAnggaranStore()
const props = defineProps({
  store: {
    type: Array,
    default: () => []
  }
})
onMounted(() => {
})

const search = ref('')

const tablerinci = [
  {
    label: 'Kode RS',
    name: 'kode',
    align: 'left',
    field: 'koders'
  },
  {
    label: 'Item Pengusulan',
    name: 'keterangan',
    align: 'left',
    field: 'usulan'
  },
  {
    label: 'Kode Rekening',
    name: 'kode50',
    align: 'left',
    field: row => [row.koderek50, row.uraian50],
  },
  {
    label: 'Kode Aset/Barang ',
    name: 'kode108',
    align: 'left',
    field: row => [row.koderek108, row.uraian108],
  },
  {
    label: 'Volume',
    name: 'volume',
    align: 'left',
    field: 'volume'
  },
  {
    label: 'Satuan',
    name: 'satuan',
    align: 'left',
    field: 'satuan'
  },
  {
    label: 'Harga (Rp)',
    name: 'harga',
    align: 'right',
    field: 'harga'
  },
  {
    label: 'Total (Rp)',
    name: 'nilai',
    align: 'right',
    field: 'pagu'
  },
  {
    label: 'Opsi',
    name: 'opsi',
    align: 'center',
  }
]
const columns = ref(tablerinci)
const $q = useQuasar()
const selected = ref([])

const displayRows = computed(() => {
  const rows = store.rincians || []
  const q = search.value.toLowerCase().trim()

  if (!q) return rows

  return rows.filter(row =>
    [
      row.koders,
      row.usulan,
      row.koderek50,
      row.uraian50,
      row.koderek108,
      row.uraian108,
      row.satuan,
      row.pagu
    ]
      .filter(Boolean)
      .some(val =>
        String(val).toLowerCase().includes(q)
      )
  )
})
// console.log('display rows', displayRows.value)
function isTransaksiall(row) {
  console.log('row transall', row)
  // return store.transallserahterima.some((item) => item.id === row.id);
}

function subtotal() {
  const subtotalrinci = store.rincians
    .map((x) => parseFloat(x.pagu))
    .reduce((a, b) => a + b, 0);
  return Number(subtotalrinci);
}

function selisih() {
  return subtotal() - Number(store.form.pagu || 0);
}

function editData(row) {
  store.form.nousulan = row.nousulan
  store.form.usulan = row.usulan
  store.form.volume = row.volume
  store.form.harga = row.harga
  store.form.nilai = row.pagu
  store.form.satuan = row.satuan
  store.form.idpp = row.idpp
  store.form.koders = row.koders
  store.form.koderek50 = row.koderek50
  store.form.uraian50 = row.uraian50
  store.form.koderek108 = row.koderek108
  store.form.uraian108 = row.uraian108
  store.form.jenis = row.jenis
  store.params.jenis = row.jenis

  store.form.volumebaru = 0
  store.form.hargabaru = 0
  store.form.totalbaru = 0
  store.form.jumlahacc = 0

  store.form.realisasi = row.realisasi?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
    row.realisasi_spjpanjar?.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
    row.contrapost?.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0)
  store.form.sisapagu = parseFloat(row.pagu) - (row.realisasi?.map((x) => parseFloat(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
    row.realisasi_spjpanjar?.map((x) => parseFloat(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
    row.contrapost?.map((x) => parseFloat(x.nominalcontrapost)).reduce((a, b) => a + b, 0))

}

function deleteData(row) {
  console.log('row delete', row)
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {

    const payload = {
      notrans: store.form.notrans,
      noperubahan: store.form.noperubahan,
      id: Number(row),

    }
    // console.log('payload', payload)
    store.deleteData(payload)
      .then(() => {
        //   store.loadingHapus = true
        // carisrt.refreshTable()
        if (store.rincians?.length === 0) {
          store.initForm()

        }
        // console.log('data hapus', store.transall)
      })
    // store.setForm = props?.row
    // console.log('vv', store.hapusRinci(row))
    // const params = { id: selected.value }
    // emits('deleteIds', selected.value)
  }).onCancel(() => {
    console.log('Cancel')
    selected.value = []
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>
<style lang="scss">
.my-sticky-table {
  min-height: 300px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #000000;
    color: $white;

  }

  thead tr th {
    position: sticky;
    z-index: 1;
    font-weight: bold;
  }

  /* this will be the loading indicator */
  thead tr:last-child th {
    top: 48px;

  }

  /* height of all previous header rows */

  thead tr:first-child th {
    top: 0;
  }

  .q-td {
    font-size: 3mm;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    scroll-margin-top: 48px;
    font-size: 1mm;
  }

  .q-table__bottom .q-field__native,
  .q-table__bottom .q-field__inner .q-field__control .q-anchor--skip,
  i.q-icon {
    color: $white;
  }
}
</style>
