<template>
  <template v-if="store.datanpd">
    <div class="justify-content-center full-width">
      <q-table class="my-sticky-table" style="height: 100%;" :rows="store.datanpd" :columns="columnsnpd" row-key="name"
        dense flat bordered wrap-cells :filter="store.params.q" :loading="store.loading"
        :rows-per-page-options="[10, 50, 100]">
        <template #loading>
          <q-inner-loading showing color="warning" />
        </template>
        <template #top-left>
          <div class="flex q-qutter-sm z-top">
            <div>
              <q-input v-model="store.params.q" outlined dark color="warning" dense placeholder="Cari NPD-LS ..."
                debounce="500" style="min-width: 300px;">
                <template v-if="store.params.q" #append>
                  <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click.stop.prevent="clearSearch" />
                </template>
                <template #prepend>
                  <q-icon size="sm" name="icon-mat-search" />
                </template>
              </q-input>

            </div>
            <div class="q-pl-sm text-white">
              <q-input outlined dark color="warning" dense label="Tahun" v-model="store.params.tahun"
                :disable="store.disabled && store.loading" :loading="store.loading" :autofocus="false"
                @update:model-value="(val) => {
                  console.log('Tahun berapa?', val)
                  store.params.tahun = val
                  store.listdatanpd()
                }" />
            </div>
          </div>
        </template>
        <template #body="props">
          <q-tr>
            <q-td key="nonpdls" :props="props" class="text-left">
              <div>
                {{ props.row?.nonpdls }}
              </div>
              <q-td key="total">
                <q-badge color="green" @click="onRowClick(props.row)">
                  {{ formatRpDouble(props.row?.total) }}
                </q-badge>
              </q-td>
            </q-td>
            <q-td key="tglnpdls" :props="props" class="text-left">
              {{ props.row?.tglnpdls }}
            </q-td>
            <q-td key="pptk" :props="props" class="text-left">
              <div>{{ props.row?.bidang }}</div>
              <q-badge color="pink">
                {{ props.row?.pptk }}
              </q-badge>
            </q-td>
            <q-td key="kegiatanblud" :props="props" class="text-left">
              {{ props.row?.kegiatanblud }}
            </q-td>
            <q-td key="penerima" :props="props" class="text-left">
              {{ props.row?.penerima }}
            </q-td>
            <q-td key="keterangan" :props="props" class="text-left wrap-cells">
              <div>
                {{ props.row?.keterangan }}
              </div>
            </q-td>
            <q-td key="nopencairan" :props="props" class="text-left wrap-cells">
              <div>
                Pencairan Tanggal
              </div>
              <div>{{ props.row?.tglcair }}</div>
              <q-badge>
                {{ props.row?.nopencairan }}
              </q-badge>
            </q-td>
            <q-td>
              <div class="row justify-center">
                <div class="q-pr-xs">
                  <q-btn v-if="gantiKunci(props?.row)" flat round size="xs" class="bg-red" icon="icon-mat-lock"
                    @click="kunciData(props?.row?.nonpdls)" />
                  <q-btn v-else flat round size="xs" class="bg-orange" icon="icon-mat-lock_open"
                    @click="kunciData(props?.row?.nonpdls)" />
                </div>
                <div> <q-btn flat round class="bg-dark" size="xs" color="warning" icon="icon-fa-file-regular">
                    <q-menu dark style="min-width: 150px">
                      <q-list style="min-width: 150px;">
                        <q-item clickable v-close-popup @click="viewRincian(props?.row)">
                          <q-item-section>Lihat Rincian</q-item-section>
                        </q-item>
                        <q-item clickable @click="editNpdls(props?.row)">
                          <q-item-section>Edit NPD</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="viewCetakDataNpdls(props?.row)">
                          <q-item-section>Cetak NPD</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="PrintPencairan(props?.row)">
                          <q-item-section>Cetak Pencairan</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn> </div>

              </div>
            </q-td>
          </q-tr>

        </template>


      </q-table>
      <app-dialog-rincian v-model="store.openDialogRinci" :npd="npd" />
      <printdi-npdls v-model="store.dialogCetakNpd" :datanpds="datanpds" />
      <!-- <editdata-npdls v-model="store.dialogEditNpd" :editnpds="editnpds" /> -->
      <cetak-pencairan v-model="store.dialogPrintPencairan" :printcair="printcair" />
    </div>
  </template>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { formatRpDouble } from 'src/modules/formatter'
import { dataBastFarmasiStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastfarmasi'
import { formInputNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formnpdls'
import { listDataNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/listdatanpdls'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'



const AppDialogRincian = defineAsyncComponent(() => import('./DialogViewRincian.vue'))
const PrintdiNpdls = defineAsyncComponent(() => import('./DialogPrintData.vue'))
const CetakPencairan = defineAsyncComponent(() => import('./DialogPrintPencairan.vue'))
const store = listDataNpdlsStore()
const form = formInputNpdlsStore()
const router = useRouter()
const carisrt = dataBastFarmasiStore()
onMounted(() => {

})

const clearSearch = () => {
  store.params.q = ''
  store.goToPage(1)
}
const listnpdls = [
  {
    label: 'No NPD-LS',
    name: 'nonpdls',
    field: row => [row.nonpdls, row.total],
    align: 'center',
    headerStyle: 'width: 200px; height:50px'
  },
  {
    label: 'Tanggal',
    name: 'tglnpdls',
    align: 'center',
    field: 'tglnpdls',
    sortable: true,
    headerStyle: 'width: 90px;'
  },
  {
    label: 'Bidang',
    name: 'pptk',
    align: 'center',
    field: row => [row.pptk, row.bidang]
  },
  {
    label: 'Kegiatan BLUD',
    name: 'kegiatanblud',
    align: 'center',
    field: 'kegiatanblud',
    headerStyle: 'width: 200px;'
  },
  {
    label: 'Pihak Ketiga',
    name: 'penerima',
    align: 'center',
    field: 'penerima'
  },
  {
    label: 'Keterangan',
    name: 'keterangan',
    align: 'center',
    field: 'keterangan',
    headerStyle: 'width: 250px;'
  },
  {
    label: 'Status',
    name: 'nopencairan',
    align: 'center',
    field: row => [row.nopencairan, row.tglcair],
    headerStyle: 'width: 120px;'
  },
  {
    label: 'Aksi',
    name: 'aksi',
    align: 'center',
    headerStyle: 'width: 77px;'
  }
]
const columnsnpd = ref(listnpdls)

const npd = ref(null)
function viewRincian(row) {
  store.openDialogRinci = true
  npd.value = row.rincian
  store.listrinci = npd.value
}
const onRowClick = (row) =>
  alert([row?.nopencairan, row?.total])

const datanpds = ref(null)
function viewCetakDataNpdls(row) {
  store.dialogCetakNpd = true
  datanpds.value = row
  store.npddatasave = datanpds.value
}

const editnpds = ref(null)
function editNpdls(row) {
  router.push({ path: '/siasik/ls/npdls/newformnpd', replace: true, query: { id: row.id } })
  editnpds.value = row
  form.form = editnpds.value
  console.log('formxx', form.form)
  carisrt.reqs.kodepenerima = editnpds.value?.kodepenerima
  carisrt.reqs.kodekegiatanblud = editnpds.value?.kodekegiatanblud
  form.transall = editnpds.value?.rincian
  carisrt.selectbastFarmasi()
  form.reqs.kodekegiatan = editnpds.value?.kodekegiatanblud
  form.getRincianBelanja()
  form.form.rincians = []
  form.disabled = true
}
const printcair = ref(null)
function PrintPencairan(row) {
  store.dialogPrintPencairan = true
  printcair.value = row
  store.npddatasave = printcair.value
  // console.log('openNPD', store.npddatasave)
}
function gantiKunci(row) {
  const nonpdls = row.kunci === "1"
  let lockdata = true
  if (nonpdls) {
    lockdata = true
  } else {
    lockdata = false
  }
  return lockdata
}

const $q = useQuasar()
const selected = ref([])
function kunciData(row) {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dikunci?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // const kunci = store.datanpd.find((x) => x.nonpdls === row)

    const payload = {
      nonpdls: row,
      // kunci: kunci?.kunci
    }
    console.log('payload', payload)
    store.kunciData(payload)
  }).onCancel(() => {
    console.log('Cancel')
    selected.value = []
  }).onDismiss(() => {
  })
}
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
