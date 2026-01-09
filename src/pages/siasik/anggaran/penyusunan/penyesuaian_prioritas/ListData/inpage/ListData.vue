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
          <q-tr v-if="!store.loading">
            <q-td key="notrans" :props="props" class="text-left">
              <div>
                {{ props.row?.notrans }}
              </div>
            </q-td>
            <q-td key="pptk" :props="props" class="text-left">
              {{ props.row?.pptk }}
            </q-td>
            <q-td key="namabidang" :props="props" class="text-left">
              {{ props.row?.namabidang }}
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
            <q-td key="pagu" :props="props" class="text-left wrap-cells">
              <div class="text-weight-bold">
                Pagu : {{ formattanpaRp(props.row?.pagu) }}
              </div>
              <div>
                Nilai Prioritas : {{ formattanpaRp(hitungRincian(props.row?.rincian)) }}
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
                        </q-item> -->
                        <q-item clickable v-close-popup @click="PrintData(props?.row)">
                          <q-item-section>Cetak Data</q-item-section>
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
      <dialog-print-data v-model="store.dialogCetak" :datanpds="datanpds" />
      <!-- <editdata-npdls v-model="store.dialogEditNpd" :editData="editData" /> -->
      <!-- <cetak-pencairan v-model="store.dialogCetak" :printdatax="printdatax" /> -->
    </div>
  </template>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { formatRpDouble, formattanpaRp } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useAuthStore } from 'src/stores/auth'
import { usePrioritasAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/penyesuaianprioritas'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'



const AppDialogRincian = defineAsyncComponent(() => import('./DialogViewRincian.vue'))
const DialogPrintData = defineAsyncComponent(() => import('./DialogPrintData.vue'))
const store = usePrioritasAnggaranStore()
const router = useRouter()
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
    label: 'PPTK',
    name: 'pptk',
    align: 'left',
    field: 'pptk',
    sortable: true,
    // headerStyle: 'width: 90px;'
  },
  {
    label: 'Bidang/Bagian',
    name: 'namabidang',
    align: 'left',
    field: 'namabidang',
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
    label: 'Nilai (Rp)',
    name: 'pagu',
    align: 'right',
    field: row => [row.pagu, row.rincian],
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

const npd = ref(null)
function viewRincian(row) {

  npd.value = row.rincian
  store.rincianSaved = npd.value
  store.dataSaved = row
  // console.log('npd save', store.dataSaved)
  store.openDialogRinci = true
}
const onRowClick = (row) =>
  alert([row?.nopencairan, row?.total])

const datanpds = ref(null)
async function PrintData(row) {
  datanpds.value = row
  store.params.notrans = row.notrans

  await store.dataCetak()   // tunggu data siap
  store.dialogCetak = true  // buka dialog terakhir

}
const hitungRincian = (rincian = []) => rincian.reduce((sum, x) => sum + Number(x.nilai || 0), 0)

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

  store.rincianSaved = row.rincian
    ? row.rincian.map(r => ({ ...r }))
    : []
  console.log('form saat edit', store.rincianSaved)
  router.push({ path: '/anggaran/penyusunan/prioritas/form', replace: true, query: { id: row.id } })
  store.disableSaved = true
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
      if (row.rincian?.map((x) => Number(x.nilai)).reduce((a, b) => a + b, 0) !== Number(row.pagu)) {
        $q.notify({
          type: 'negative',
          message: 'Nilai Pagu dan Nilai Prioritas Tidak Sama'
        })
        return
      }
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
