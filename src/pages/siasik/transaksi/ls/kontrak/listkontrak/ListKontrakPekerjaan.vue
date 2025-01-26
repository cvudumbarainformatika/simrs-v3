<template>
  <div class="justify-content-center full-width">
    <q-table class="my-sticky-table" bordered flat wrap-cells :rows="store.kontraks" :columns="columns" row-key="name"
      @request="store.onRequest" v-model:pagination="store.reqs" :filter="store.reqs.q" :loading="store.loading"
      :rows-per-page-options="[10, 50, 100, 500]">
      <template #top-left>
        <div class="flex q-qutter-sm z-top">
          <div>
            <q-input v-model="store.reqs.q" outlined dark color="white" dense placeholder="Cari Kontrak ..."
              debounce="500" style="min-width: 200px;" @keyup.enter="store.goToPage(1)">
              <template v-if="store.reqs.q" #append>
                <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click.stop.prevent="clearSearch" />
              </template>
              <template #prepend>
                <q-icon size="sm" name="icon-mat-search" />
              </template>
            </q-input>
          </div>
          <div class="q-mx-sm">
            <q-select v-model="store.reqs.tahun" :options="tahuns" outlined dark dense color="white" style="width:100px"
              @update:model-value="(val) => {
                console.log('Tahun berapa?', val)
                store.reqs.tahun = val
                store.getlistKontrak()
              }" />
          </div>
        </div>
      </template>
      <template #top-right>

        <q-btn flat icon="icon-my-file-excel" size="sm" padding="sm" round no-caps
          @click="store.exportExcel = !store.exportExcel">
          <q-tooltip>Export Ke Excel</q-tooltip>
        </q-btn>
      </template>
      <template #no-data="{ message, filter }">
        <div class="absolute-top fit row flex-center bg-transparent items-center text-dark">
          <div class="row items-center q-gutter-sm">
            <q-icon size="2em" name="icon-mat-eye" />
            <div>
              Data tidak ditemukan... {{ message }}
            </div>
            <div class="text-h4">
              {{ filter ? '🏷️' : '🏷️' }}
            </div>
          </div>
          <!-- <q-icon size="2em" :name="filter ? 'icon-mat-list' : icon" /> -->
        </div>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td key="noregister" :props="props">
            {{ props.row.nokontrak }}
          </q-td>
          <q-td key="namaperusahaan" :props="props">
            {{ props.row.namaperusahaan }}
          </q-td>
          <q-td key="tgltrans" :props="props">
            {{ props.row.nokontrakx }}
          </q-td>
          <q-td key="tgltrans" :props="props">
            {{ props.row.tgltrans }}
          </q-td>
          <q-td key="kegiatanblud" :props="props">
            {{ props.row.kegiatanblud }}
          </q-td>
          <q-td key="namapptk" :props="props">
            {{ props.row.namapptk }}
          </q-td>
          <q-td key="nilaikontrak" :props="props">
            {{ formattanpaRp(props.row.nilaikontrak) }}
          </q-td>
          <q-td>
            <div class="row justify-center">
              <q-btn flat round class="bg-dark" size="xs" color="warning" icon="icon-fa-file-regular">
                <q-menu dark style="min-width: 150px">
                  <q-list style="min-width: 150px;">
                    <q-item clickable @click="editKontrak(props?.row)">
                      <q-item-section>Edit Kontrak</q-item-section>
                    </q-item>
                    <q-item clickable @click="deleteData(props?.row?.nokontrak)">
                      <q-item-section>Delete Kontrak</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { uselistKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/listkontrak'
import { onMounted, ref, watchEffect } from 'vue'
import { formattanpaRp } from 'src/modules/formatter'
import { useRouter } from 'vue-router'
import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak'

const store = uselistKontrakPekerjaan()
const form = formKontrakPekerjaan()
const tahuns = ref([])
const $q = useQuasar()
const router = useRouter()
const columnsx = [
  {
    name: 'noregister',
    label: 'Nomer Transaksi',
    align: 'left',
    field: 'noregister'
  },
  {
    name: 'namaperusahaan',
    label: 'Nama',
    align: 'left',
    field: 'namaperusahaan'
  },
  {
    name: 'nokontrakx',
    label: 'Kontrak',
    align: 'left',
    field: 'nokontrakx'
  },
  {
    name: 'tgltrans',
    label: 'Tanggal',
    align: 'left',
    field: 'tgltrans'
  },
  {
    name: 'kegiatanblud',
    label: 'KegiatanBLUD',
    align: 'left',
    field: 'kegiatanblud'
  },
  {
    name: 'namapptk',
    label: 'Pejabat Teknis',
    align: 'left',
    field: 'namapptk'
  },
  {
    name: 'nilaikontrak',
    label: 'Nilai (Rp.)',
    align: 'right',
    field: 'nilaikontrak'
  },
  {
    label: 'Aksi',
    name: 'aksi',
    align: 'center',
  }
]
const columns = ref(columnsx)
onMounted(() => {
  init()

})
function init() {
  const d = new Date()
  // store.setTahun(d.getFullYear())
  store.reqs.tahun = d.getFullYear()
  generateArrayOfYears()
}
function generateArrayOfYears() {
  const max = new Date().getFullYear()
  const min = max - 5
  const years = []

  for (let i = max; i >= min; i--) {
    years.push(i)
  }
  tahuns.value = years
}
const clearSearch = () => {
  store.reqs.q = ''
  store.goToPage(1)
}

const editkntr = ref(null)
function editKontrak(row) {
  router.push({ path: '/siasik/ls/kontrak/form', replace: true })
  editkntr.value = row
  form.form = editkntr.value
  console.log('formxx', form.form)
}

const selected = ref([])
function deleteData(row) {
  // console.log('row', row)
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {

    const payload = {
      nokontrak: row,
    }
    console.log('payload', payload)
    store.deleteData(payload).then(() => {
      store.loading = true
      store.refreshTable()
    })
  }).onCancel(() => {
    console.log('Cancel')
    selected.value = []
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function exportToExcel(tableId, filename) {
  // const el = document.getElementById(tableId)
  // const filenames = filename ? filename + '.xls' : 'KartuStokFarmasi.xls'
  // const columns = store.items
  // const content = [columns.map(col => wrapCsvValue(col.label))].concat(
  //   rows.map(row => columns.map(col => wrapCsvValue(
  //     typeof col.field === 'function'
  //       ? col.field(row)
  //       : row[col.field === void 0 ? col.name : col.field],
  //     col.format,
  //     row
  //   )).join(','))
  // ).join('\r\n')

  // const status = exportFile(
  //   'table-export.csv',
  //   content,
  //   'text/csv'
  // )
  // console.log('mulai export', el?.parentElement)
  $q.notify({
    message: 'Masih dibuatkan ... harap tunggu',
    color: 'negative',
    icon: 'icon-mat-warning'
  })
}

watchEffect(() => {
  if (store.exportExcel) {
    // console.log('store.exportExcel', store.exportExcel)
    exportToExcel('tableItem', 'KartuStokFarmasi')
  }
})
</script>

<style lang="scss">
.my-sticky-table {


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
