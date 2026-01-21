<template>
  <q-card flat class="col full-height q-pt-sm">
    <q-table class="my-sticky-table" :rows="displayRows" :columns="columns" row-key="name" hide-pagination hide-bottom
      wrap-cells :rows-per-page-options="[0]" :rows-number="[0]">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="rincianbelanja" :props="props" class="text-left">
            <template v-if="props.row.uraianrek50 || props.row.pagu">
              <div>{{ props?.row?.uraianrek50 ||
                props?.row?.pagu?.uraian50 }} </div>

            </template>
            <template v-else>
              <div v-if="store.form.bast !== 'Sigarang'" class="text-bold">{{ props.row.nopenerimaan }}</div>
              <div>{{ props.row.rincianbelanja }}</div>
            </template>
          </q-td>
          <q-td key="koderek50" :props="props" class="text-left">
            <!-- <div class="text-bold text-red" v-if="tidakAdapagu(props?.row)">
              BELUM DIANGGARKAN
            </div>
            <div v-else> -->
            {{ props.row.koderek50 || props?.row?.pagu?.koderek50 }}
            <div class="q-pl-sm">{{ props.row.koderek108 || props?.row?.pagu?.koderek108 }}</div>

            <!-- </div> -->
          </q-td>
          <q-td key="itembelanja" :props="props" class="text-left">
            {{ props.row.itembelanja || props.row.nama_barang }}
          </q-td>
          <q-td key="nominalpembayaran" :props="props" class="text-right">
            {{ formattanpaRp(props.row.nominalpembayaran || props?.row?.sub_total) }}
          </q-td>
          <q-td style="width: 5%">
            <div class="row justify-center">
              <template v-if="isTransallSerahterima(props.row)">
                <q-btn v-if="belumSave(props?.row) && !tidakAdapagu(props?.row)" size="sm" class="q-pl-md" color="green"
                  icon="icon-mat-save" @click="saveRinciSerahterima(props?.row)"
                  :loading="loadingRow[props.row.id] === true" />
                <div v-if="tidakAdapagu(props?.row)" class="text-center text-bold text-red"> BELUM DIANGGARKAN </div>

              </template>

              <template v-else>
                <q-btn size="sm" class="q-pl-md" color="negative" icon="icon-mat-delete"
                  @click="deleteData(props?.row?.id)" :loading="loadingRowdelete[props.row.id] === true" />
              </template>
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
import { formInputNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formnpdls';
// import { onMounted } from 'vue';
import { computed, onMounted, ref } from 'vue';

onMounted(() => {
  // console.log(compSigna.value)
  store.getRincianBelanja()
})

const loadingRow = ref({})
const loadingRowdelete = ref({})
const store = formInputNpdlsStore()
const tablerinci = [
  {
    label: 'Rincian Belanja',
    name: 'rincianbelanja',
    align: 'left',
    field: 'rincianbelanja'
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
    field: 'itembelanja || nama_barang'
  },
  {
    label: 'Jumlah (Rp)',
    name: 'nominalpembayaran',
    align: 'right',
    field: 'nominalpembayaran'
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
  const savedIds = store.transall.map((item) => item.bast_r_id);
  const unsavedRows = store.transallserahterima.filter(
    (item) => !savedIds.includes(item.id)
  );

  // Gabungkan transall (yang sudah disimpan) dengan transallserahterima (yang belum disimpan)
  return [...store.transall, ...unsavedRows];
});

function isTransallSerahterima(row) {
  return store.transallserahterima.some((item) => item.id === row.id);
}

function subtotal() {
  const subtotalrinci = displayRows.value
    .map((x) => parseFloat(x.nominalpembayaran || x?.sub_total))
    .reduce((a, b) => a + b, 0);
  return subtotalrinci;
}

function belumSave(row) {
  const bast_id = row?.id
  const transall = store.transall
  // console.log('transall', store.transall)

  const rinciannpd = transall.find((x) => x?.bast_r_id === bast_id) ?? null

  // console.log('row belumSave', rinciannpd)
  let gantitombol = true
  if (rinciannpd) {
    gantitombol = false
  } else {
    gantitombol = true
  }
  return gantitombol
}
function tidakAdapagu(row) {
  if (store.form.bast === 'Sigarang') {
    const pagu = row?.pagu
    return !pagu
  }

}

function resetRinci() {
  Object.assign(store.rinci, {
    koderek50: '',
    rincianbelanja: '',
    koderek108: '',
    uraian108: '',
    itembelanja: '',
    idserahterima_rinci: '',
    volume: '',
    satuan: '',
    harga: '',
    total: '',
    sisapagu: '',
    volumels: '',
    hargals: '',
    totalls: '',
    nominalpembayaran: '',
    nopenerimaan: '',
    bast_r_id: ''
  })
}
async function saveRinciSerahterima(row) {
  loadingRow.value[row.id] = true
  try {
    // console.log('row', row)
    store.reqs.rekening50 = row.koderek50
    store.filterItemBelanja()
    const arrblj = store.itembelanja
    const cari = arrblj.find(x => x.idpp === row.idserahterima_rinci)

    if (cari) {
      store.rinci.sisapagu = cari.sisapagu
    } else {
      store.rinci.sisapagu = Number(row.pagu?.pagu) -
        (
          row?.pagu?.realisasi.map((x) => Number(x.nominalpembayaran)).reduce((a, b) => a + b, 0) +
          row?.pagu?.realisasi_spjpanjar.map((x) => Number(x.jumlahbelanjapanjar)).reduce((a, b) => a + b, 0) -
          row?.pagu?.contrapost.map((x) => Number(x.nominalcontrapost)).reduce((a, b) => a + b, 0)
        )
    }

    store.rinci.nopenerimaan = row?.reff ? row?.reff : store.form.noserahterima
    store.rinci.koderek50 = row.koderek50 || row?.pagu?.koderek50
    store.rinci.rincianbelanja = row.uraianrek50 || row?.pagu?.uraian50
    store.rinci.koderek108 = row.koderek108 || row?.pagu?.koderek108
    store.rinci.uraian108 = row.uraian108 || row?.pagu?.uraian108
    store.rinci.itembelanja = row.itembelanja || row?.nama_barang

    store.rinci.bast_r_id = row.id
    store.rinci.idserahterima_rinci = row.pagu ? row?.pagu?.idpp : row.idserahterima_rinci

    store.rinci.volume = row.pagu ? row?.pagu?.volume : row.volume
    store.rinci.satuan = row.pagu ? row?.pagu?.satuan : row.satuan
    store.rinci.harga = row.pagu ? row?.pagu?.harga : row.harga
    store.rinci.total = row.pagu ? row?.pagu?.pagu : row.total

    store.rinci.volumels = row.volumels || row?.qty
    store.rinci.hargals = row.hargals || row?.harga_jadi
    store.rinci.totalls = row.totalls || row?.sub_total
    store.rinci.nominalpembayaran = row.nominalpembayaran || row?.sub_total
    // console.log('row rinci', store.rinci)
    // console.log('store.rinci', store.rinci.nominalpembayaran > store.rinci.sisapagu)

    if (store.rinci.nominalpembayaran > store.rinci.sisapagu) {
      store.form.rincians = []
      // console.log('jumlah', store.rinci.nominalpembayaran > store.rinci.sisapagu)
      notifErrVue('Maaf Pengajuan Lebih dari Sisa Pagu')
      return
    }

    store.form.rincians.push(store.rinci)
    await store.simpanNpdls()
    store.refreshTable()
    store.disabledx = true
    resetRinci()
  } catch (e) {
    notifErrVue('Gagal menyimpan data')
  } finally {
    loadingRow.value[row.id] = false
  }
}
function deleteData(row) {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const payload = {
      nonpdls: store.form.nonpdls,
      id: row,
      nopenerimaan: store.form.noserahterima
    }

    loadingRowdelete.value[row] = true

    try {
      await store.hapusRinci(payload)

      if (store.transall?.length === 0) {
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
