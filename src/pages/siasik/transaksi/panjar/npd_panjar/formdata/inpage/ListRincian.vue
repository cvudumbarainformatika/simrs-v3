<template>
  <q-card flat class="col full-height q-pt-sm">
    <q-table class="my-sticky-table" :rows="displayRows" :columns="columns" row-key="name" hide-pagination hide-bottom
      wrap-cells :rows-per-page-options="[0]" :rows-number="[0]">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="rincianbelanja" :props="props" class="text-left">
            <div>{{ props.row.rincianbelanja50 }}</div>
          </q-td>
          <q-td key="koderek50" :props="props" class="text-left">
            {{ props.row.koderek50 }}
            <div class="q-pl-sm">{{ props.row.koderek108 }}</div>
          </q-td>
          <q-td key="itembelanja" :props="props" class="text-left">
            {{ props.row.itembelanja }}
          </q-td>
          <q-td key="nominalpembayaran" :props="props" class="text-right">
            {{ formattanpaRp(props.row.totalpermintaanpanjar) }}
          </q-td>
          <q-td style="width: 5%">
            <div class="row justify-center">
              <q-btn size="sm" class="q-pl-md" color="negative" icon="icon-mat-delete" @click="deleteData(props?.row)"
                :loading="loadingRowdelete[props.row.id] === true" />
            </div>
          </q-td>
        </q-tr>
      </template>
      <template #bottom-row>
        <q-tr class="full-width text-bold">
          <q-td colspan="3" class="text-center" style="font-size: 4em">
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
import { storeNpdPanjar } from 'src/stores/siasik/transaksi/panjar/npd_panjar/store_npd_panjar';
// import { onMounted } from 'vue';
import { computed, onMounted, ref } from 'vue';

onMounted(() => {
  store.getRincianBelanja()
})

const loadingRow = ref({})
const loadingRowdelete = ref({})
const store = storeNpdPanjar()
const tablerinci = [
  {
    label: 'Rincian Belanja',
    name: 'rincianbelanja',
    align: 'left',
    field: 'rincianbelanja50'
  },
  {
    label: 'Rekening',
    name: 'koderek50',
    align: 'left',
    field: 'koderek50'
  },
  {
    label: 'Item Belanja',
    name: 'itembelanja',
    align: 'left',
    field: 'itembelanja'
  },
  {
    label: 'Jumlah (Rp)',
    name: 'nominalpembayaran',
    align: 'right',
    field: 'totalpermintaanpanjar'
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
  return store.rincians
});


function subtotal() {
  const subtotalrinci = displayRows.value
    .map((x) => parseFloat(x.totalpermintaanpanjar))
    .reduce((a, b) => a + b, 0);
  return subtotalrinci;
}


function deleteData(row) {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const payload = {
      nonpdpanjar: row?.nonpdpanjar,
      id: row?.id,
      // nopenerimaan: store.form.noserahterima
    }
    console.log('payload delete', payload)

    loadingRowdelete.value[row] = true

    try {
      await store.hapusRinci(payload)

      if (store.rincians?.length === 0) {
        store.initForm()
      }
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menghapus data'
      })
    } finally {
      store.refreshTable()
      loadingRowdelete.value[row] = false
    }
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
