<template>
  <template v-if="store.items">
    <div class="justify-content-center full-width">
      <q-table class="my-sticky-table" style="height: 100%;" :rows="store.items" :columns="columnsData" row-key="name"
        dense flat bordered wrap-cells :filter="store.params.q" :loading="store.loading"
        :rows-per-page-options="[10, 50, 100]">
        <template #loading>
          <q-inner-loading showing color="warning" />
        </template>
        <template #top-left>
          <div class="flex q-qutter-sm z-top">
            <div>
              <q-input v-model="store.params.q" outlined dark color="warning" dense placeholder="Cari Data ..."
                debounce="500" style="min-width: 300px;">
                <template v-if="store.params.q" #append>
                  <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click.stop.prevent="clearSearch" />
                </template>
                <template #prepend>
                  <q-icon size="sm" name="icon-mat-search" />
                </template>
              </q-input>

              <!-- <q-input v-model="store.params.q" color="warning" placeholder="Cari Data ..." dense dark outlined
                style="min-width:200px" debounce="800" :loading="store.loading" @update:model-value="store.search">
                <template #prepend>
                  <q-icon name="icon-mat-search" />
                </template>
              </q-input> -->

            </div>
            <div class="q-pl-sm text-white">
              <q-input outlined dark color="warning" dense label="Tahun" v-model="store.params.tahun"
                :disable="store.disabled && store.loading" :loading="store.loading" debounce="500" :autofocus="false"
                @update:model-value="(val) => {
                  console.log('Tahun berapa?', val)
                  store.params.tahun = val
                  store.getData()
                }" />
            </div>
          </div>
        </template>
        <template #body="props">
          <q-tr>
            <q-td key="notrans" :props="props" class="text-left">
              <div>
                {{ props.row?.notrans }}
              </div>
            </q-td>
            <q-td key="ruangan" :props="props" class="text-left">
              {{ props.row?.ruangan }}
            </q-td>
            <q-td key="kegiatan" :props="props" class="text-left q-gutter-y-sm">
              {{ props.row?.kegiatan }}

            </q-td>
            <q-td key="penerima" :props="props" class="text-left">
              {{ props.row?.penerima }}
            </q-td>
            <q-td key="keterangan" :props="props" class="text-left wrap-cells">
              <div>
                {{ props.row?.keterangan }}
              </div>
            </q-td>
            <q-td key="paguanggaran" :props="props" class="text-left wrap-cells">
              <div>
                {{ formattanpaRp(props.row?.paguanggaran) }}
              </div>
            </q-td>
            <q-td key="nilaipengusulan" :props="props" class="text-left wrap-cells">
              <div>
                <q-badge color="green">
                  {{ formattanpaRp(props.row?.nilaipengusulan) }}
                </q-badge>
              </div>
            </q-td>
            <q-td>
              <div class="row justify-center">
                <div class="q-pr-xs">
                  <q-btn :auth="user" v-if="gantiKunci(props?.row)" flat round size="xs" class="bg-red-10 text-white"
                    icon="icon-mat-lock" @click="kunciData(props?.row)">
                    <q-tooltip> Buka Kunci </q-tooltip>
                  </q-btn>
                  <q-btn v-else flat round size="xs" class="bg-orange" icon="icon-mat-key"
                    @click="kunciData(props?.row)">
                    <q-tooltip> Kunci Data </q-tooltip>
                  </q-btn>
                </div>
                <div> <q-btn flat round class="bg-dark" size="xs" color="warning" icon="icon-fa-file-regular">
                    <q-menu dark style="min-width: 150px">
                      <q-list style="min-width: 150px;">
                        <q-item clickable v-close-popup @click="viewRincian(props?.row)">
                          <q-item-section>Lihat Rincian</q-item-section>
                        </q-item>
                        <q-item v-if="props?.row?.kunci !== '1'" clickable @click="editDataPangusulan(props?.row)">
                          <q-item-section>Edit Data</q-item-section>
                        </q-item>
                        <!-- <q-item clickable v-close-popup @click="viewCetakDataNpdls(props?.row)">
                          <q-item-section>Cetak Data</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="PrintPencairan(props?.row)">
                          <q-item-section>Cetak Pencairan</q-item-section>
                        </q-item> -->
                      </q-list>
                    </q-menu>
                  </q-btn> </div>

              </div>
            </q-td>
          </q-tr>

        </template>


      </q-table>
      <app-dialog-rincian v-model="store.openDialogRinci" :dataRinci="dataRinci" />
      <printdi-npdls v-model="store.dialogCetak" :datanpds="datanpds" />
      <!-- <editdata-npdls v-model="store.dialogEditNpd" :editData="editData" /> -->
      <cetak-pencairan v-model="store.dialogPrintPencairan" :printcair="printcair" />
    </div>
  </template>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { formatRpDouble, formattanpaRp } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useAuthStore } from 'src/stores/auth'
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan'
import { dataBastFarmasiStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastfarmasi'
import { formInputNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formnpdls'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'



const AppDialogRincian = defineAsyncComponent(() => import('./DialogViewRincian.vue'))
const PrintdiNpdls = defineAsyncComponent(() => import('./DialogPrintData.vue'))
const CetakPencairan = defineAsyncComponent(() => import('./DialogPrintPencairan.vue'))
const store = usePengusulanAnggaranStore()
const form = formInputNpdlsStore()
const router = useRouter()
const carisrt = dataBastFarmasiStore()
const auth = useAplikasiStore()
const user = computed(() => auth.user?.pegawai?.kdpegsimrs)
onMounted(() => {

})

const clearSearch = () => {
  store.params.q = ''
  store.goToPage(1)
}
const listData = [
  {
    label: 'No Transaksi',
    name: 'notrans',
    field: row => [row.notrans, row.total],
    align: 'left',
    // headerStyle: 'width: 200px; height:50px'
  },
  {
    label: 'Bidang/Bagian',
    name: 'ruangan',
    align: 'left',
    field: 'ruangan',
    sortable: true,
    // headerStyle: 'width: 90px;'
  },
  {
    label: 'Kegiatan BLUD',
    name: 'kegiatan',
    align: 'left',
    field: row => [row.kegiatan],
    // headerStyle: 'width: 200px;'
  },
  {
    label: 'Pagu Kegiatan (Rp)',
    name: 'paguanggaran',
    align: 'right',
    field: 'paguanggaran',
    // headerStyle: 'width: 250px;'
  },
  {
    label: 'Nilai Pengusulan (Rp)',
    name: 'nilaipengusulan',
    align: 'right',
    field: 'nilaipengusulan',
    // headerStyle: 'width: 250px;'
  },
  {
    label: 'Aksi',
    name: 'aksi',
    align: 'center',
    headerStyle: 'width: 100px;'
  }
]
const columnsData = ref(listData)

const dataRinci = ref(null)
function viewRincian(row) {

  dataRinci.value = row.rincian
  store.rincians = dataRinci.value
  store.dataSaved = row
  console.log('npd save', store.dataSaved, 'rinci', store.rincians)
  store.openDialogRinci = true
}
const onRowClick = (row) =>
  alert([row?.nopencairan, row?.total])

const datanpds = ref(null)
function viewCetakDataNpdls(row) {
  store.dialogCetak = true
  datanpds.value = row
  store.dataSaved = datanpds.value
}

function editDataPangusulan(row) {
  // if (auth.user?.pegawai?.kdpegsimrs !== 'sa') {
  //   $q.notify({
  //     type: 'negative',
  //     message: 'Anda tidak Memiliki Akses Edit Data ini, Silahkan Hubungi Admin'
  //   })
  //   return
  // }
  if (row?.kunci === '1') {
    $q.notify({
      type: 'negative',
      message: 'Data Masih Terkunci, Silahkan Buka Kunci Terlebih Dahulu'
    })
    return
  }

  store.form = {
    ...store.form,
    ...row
  }
  store.rincians = row.rincian ? [...row.rincian] : []

  router.push({ path: '/anggaran/penyusunan/pengusulan/form', replace: true, query: { id: row.id } })
  store.disableSaved = true
}
const printcair = ref(null)
function PrintPencairan(row) {
  // store.dialogPrintPencairan = true
  // printcair.value = row
  // store.dataSaved = printcair.value
  // console.log('openNPD', store.dataSaved)
}
function gantiKunci(row) {
  const data = row.kunci === "1"
  let lockdata = true
  if (data) {
    lockdata = true
  } else {
    lockdata = false
  }
  return lockdata
}

const $q = useQuasar()
const selected = ref([])
function kunciData(row) {
  if (row.kunci === "1") {
    // Validasi: hanya user super admin yang bisa buka kunci
    if (auth.user?.pegawai?.kdpegsimrs !== 'sa') {
      $q.notify({
        type: 'negative',
        message: 'Anda tidak Memiliki Izin Membuka Kunci Data ini, Silahkan Hubungi Admin'
      })
      return
    }
    $q.dialog({
      title: 'Peringatan',
      message: 'Apakah Anda yakin akan Membuka Kunci?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      // const payload = {
      //   notrasn: row.notrasn,
      //   kunci: row.kunci,
      //   nonotadinas: row.nonotadinas
      // }
      // console.log('payload', payload)
      store.kunciData(row.id).then(() => {
        row.kunci = row.kunci === '1' ? '' : '1'
      })
    }).onCancel(() => {
      console.log('Cancel')
      selected.value = []
    }).onDismiss(() => {
    })
  } else {
    $q.dialog({
      title: 'Peringatan',
      message: 'Apakah Anda yakin akan Mengunci Data?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      // const payload = {
      //   notrans: row.notrans,
      //   kunci: row.kunci
      // }
      // console.log('payload', payload)
      store.kunciData(row.id).then(() => {
        row.kunci = row.kunci === '1' ? '' : '1'
      })
    }).onCancel(() => {
      console.log('Cancel')
      selected.value = []
    }).onDismiss(() => {
    })
  }
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
