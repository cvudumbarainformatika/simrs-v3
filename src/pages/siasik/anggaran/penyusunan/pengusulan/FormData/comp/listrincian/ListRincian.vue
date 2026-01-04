<template>
  <q-card flat class="col full-height">
    <div class="col-6 q-pl-sm">
      <div class="q-pb-sm" style="width: 280px; display: grid; grid-template-columns: auto 10px 1fr; row-gap: 4px;">
        <div class="text-bold">Total Anggaran</div>
        <div class="text-bold text-center">:</div>
        <div class="text-bold text-right">
          {{ formattanpaRp(store.form.paguanggaran) }}
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
    <q-table class="my-sticky-table" :rows="displayRows" :columns="columns" row-key="name" hide-pagination hide-bottom
      wrap-cells :rows-per-page-options="[0]" :rows-number="[0]">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="kode" :props="props" class="text-left">
            {{ props.row.kode }}
          </q-td>
          <q-td key="keterangan" :props="props" class="text-left">
            {{ props.row.keterangan }}
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
            {{ formattanpaRp(props.row.nilai) }}
          </q-td>
          <q-td style="width: 5%">
            <div class="row justify-center">
              <template v-if="isTransaksiall(props.row)">
                <q-btn v-if="belumSave(props?.row)" size="sm" class="q-pl-md" color="green" icon="icon-mat-save"
                  @click="saveData(props?.row)" :loading="store.loadingDelete" />
              </template>
              <template v-else>
                <q-btn size="sm" class="q-pl-md" color="negative" icon="icon-mat-delete"
                  @click="deleteData(props?.row?.id)" :loading="store.loadingDelete" />
              </template>
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
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan';

import { computed, onMounted, ref } from 'vue';
const store = usePengusulanAnggaranStore()
const props = defineProps({
  store: {
    type: Array,
    default: () => []
  }
})
onMounted(() => {
})



const tablerinci = [
  {
    label: 'Kode RS',
    name: 'kode',
    align: 'left',
    field: 'kode'
  },
  {
    label: 'Item Pengusulan',
    name: 'keterangan',
    align: 'left',
    field: 'keterangan'
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
    field: 'nilai'
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
  console.log('displayRows', store.rincians)
  return store.rincians
});

function isTransaksiall(row) {
  console.log('row transall', row)
  // return store.transallserahterima.some((item) => item.id === row.id);
}

function subtotal() {
  const subtotalrinci = displayRows.value
    .map((x) => parseFloat(x.nilai))
    .reduce((a, b) => a + b, 0);
  return subtotalrinci;
}
function selisih() {
  return subtotal() - Number(store.form.paguanggaran);
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
      id: Number(row),

    }
    console.log('payload', payload)
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
