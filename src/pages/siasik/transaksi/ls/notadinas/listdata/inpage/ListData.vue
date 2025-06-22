<template>
  <div class="justify-content-center full-width">
    <q-table style="height: 100%" :rows="store.datanotadinas" :columns="columnsdata" row-key="name" dense flat bordered
      wrap-cells :filter="store.params.q" :loading="store.loading" :rows-per-page-options="[10, 50, 100]">
      <template #loading>
        <q-inner-loading showing color="warning" />
      </template>
      <template #top-left>
        <div class="flex q-gutter-sm z-top">
          <div>
            <q-input v-model="store.params.q" outlined dense placeholder="Cari Data Nota Dinas ..." debounce="500"
              style="min-width: 300px">
              <template v-if="store.params.q" #append>
                <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click.stop.prevent="clearSearch" />
              </template>
              <template #prepend>
                <q-icon size="sm" name="icon-mat-search" />
              </template>
            </q-input>
          </div>
          <div class="q-pl-sm">
            <q-input outlined dense label="Tahun" v-model="store.params.tahun" debounce="400"
              :disable="store.disabled && store.loading" :loading="store.loading" :autofocus="false"
              @update:model-value="(val) => {
                console.log('Tahun berapa?', val)
                store.params.tahun = val
                store.listData()
              }" />
          </div>
        </div>
      </template>
      <template #body="props">
        <q-tr>
          <q-td key="nonotadinas" :props="props">
            <div>
              {{ props.row.nonotadinas }}
            </div>
            <div class="q-pl-sm" key="total">
              <q-badge color="green">
                {{ formatRpDouble(props.row?.total) }}
              </q-badge>
            </div>
          </q-td>
          <q-td key="tglnotadinas" :props="props">
            {{ props.row?.tglnotadinas }}
          </q-td>
          <q-td key="nonpk" :props="props">
            <div>
              <template v-if="props.row?.nonpk">
                <q-badge color="brown-6">
                  NPK-LS: {{ props.row?.nonpk }}
                </q-badge>
              </template>
              <template v-else>
                <q-badge color="pink">
                  Belum NPK-LS
                </q-badge>
              </template>
            </div>
          </q-td>
          <q-td key="bidang" :props="props">
            {{ props.row?.bidang }}
          </q-td>
          <q-td key="kegiatan" :props="props">
            {{ props.row?.kegiatan }}
          </q-td>
          <q-td key="namapptk" :props="props">
            {{ props.row?.namapptk }}
          </q-td>
          <q-td>
            <div class="row justify-center">
              <div class="q-pr-xs">
                <q-btn v-if="gantiKunci(props?.row)" flat round size="xs" class="bg-red-10 text-white"
                  icon="icon-mat-lock" :auth="user" @click="kunciData(props?.row)">
                  <q-tooltip> Buka Kunci </q-tooltip>
                </q-btn>
                <q-btn v-else flat round size="xs" class="bg-orange" icon="icon-mat-key" @click="kunciData(props?.row)">
                  <q-tooltip> Kunci Data </q-tooltip>
                </q-btn>
              </div>
              <div> <q-btn flat round size="xs" class="bg-black" color="white" icon="icon-fa-file-regular">
                  <q-menu dark style="min-width: 150px">
                    <q-list style="min-width: 150px;">
                      <q-item clickable v-close-popup @click="viewRincian(props?.row)">
                        <q-item-section>Lihat Rincian</q-item-section>
                      </q-item>
                      <q-item clickable @click="editdata(props?.row)">
                        <q-item-section :auth="user">Edit Notadinas</q-item-section>
                      </q-item>
                      <template v-if="props?.row.kunci === '1'">
                        <q-item clickable v-close-popup @click="viewCetakData(props?.row)">
                          <q-item-section>Cetak Nota Dinas</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="viewLembarverif(props?.row)">
                          <q-item-section>Cetak Lembar Verif</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="viewCetakSptj(props?.row)">
                          <q-item-section>Cetak SPTJ</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="viewCetakVerifikasi(props?.row)">
                          <q-item-section>Cetak Verifikasi</q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <app-dialog-rincian v-model="store.openDialogRinci" :nota="nota" />
    <print-data v-model="store.dialogCetak" :cetakdata="cetakdata" />
    <cetak-sptj v-model="store.dialogCetakSptj" :cetaksptj="cetaksptj" />
    <cetak-verif v-model="store.dialogCetakPernyataan" :cetakverif="cetakverif" />
    <lembar-verif v-model="store.dialogLembarverif" :lembarverif="lembarverif" />
  </div>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { formatRpDouble } from 'src/modules/formatter';
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { useFormNotadinasStore } from 'src/stores/siasik/transaksi/ls/notadinas/form';
import { listdataNotadinasStore } from 'src/stores/siasik/transaksi/ls/notadinas/list';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const AppDialogRincian = defineAsyncComponent(() => import('./DialogViewRincian.vue'))
const PrintData = defineAsyncComponent(() => import('./DialogCetakdata.vue'))
const CetakSptj = defineAsyncComponent(() => import('./DialogCetakSptj.vue'))
const CetakVerif = defineAsyncComponent(() => import('./DialogCetakVerif.vue'))
const LembarVerif = defineAsyncComponent(() => import('./DialogLembarVerif.vue'))
const store = listdataNotadinasStore()
const form = useFormNotadinasStore()

const auth = useAplikasiStore()
const user = computed(() => auth.user?.pegawai?.kdpegsimrs)
const router = useRouter()
const listdatanota = [
  {
    name: 'nonotadinas',
    label: 'No Nota Dinas',
    align: 'left',
    // field: 'noserahterimapekerjaan',
    field: row => [row.nonotadinas, row.total],
    sortable: true,
    headerStyle: 'height:50px; font-weight: bold;'
  },
  {
    name: 'tglnotadinas',
    label: 'Tanggal',
    align: 'left',
    field: 'tglnotadinas',
    sortable: true,
    headerStyle: 'height:50px; font-weight: bold;'
  },
  {
    name: 'nonpk',
    label: 'No NPK-LS',
    align: 'left',
    field: 'nonpk',
    // field: row => [row.nonpk],
    sortable: true,
    // style: 'width: 200px',
    headerStyle: 'height:50px; font-weight: bold;'
  },
  {
    name: 'bidang',
    label: 'Bidang/Bagian',
    align: 'left',
    field: 'bidang',
    sortable: true,
    headerStyle: 'width: 10%; max-width:30%; height:50px; font-weight: bold;'
  },
  {
    name: 'kegiatan',
    label: 'Kegiatan BLUD',
    align: 'left',
    field: 'kegiatan',
    sortable: true,
    headerStyle: 'width: 20%; max-width:30%; height:50px; font-weight: bold;'
  },
  {
    name: 'namapptk',
    label: 'Pejabat Teknis Kegiatan',
    align: 'left',
    field: 'namapptk',
    sortable: true,
    headerStyle: 'height:50px; font-weight: bold;'
  },
  {
    name: 'aksi',
    label: 'Aksi',
    align: 'center',
    headerStyle: 'width: 77px; height:50px; font-weight: bold;'
  }
]
const columnsdata = ref(listdatanota)
const nota = ref(null)
function viewRincian(row) {
  store.openDialogRinci = true
  nota.value = row.rincians
  // console.log('nota', nota.value)
  store.listrinci = nota.value
}

const clearSearch = () => {
  store.params.q = ''
  store.goToPage(1)
}

const cetakdata = ref([])
function viewCetakData(row) {
  // console.log('row cetak', row)
  store.dialogCetak = true
  cetakdata.value = row
  store.cetaknotadinas = cetakdata.value
}

const lembarverif = ref([])
function viewLembarverif(row) {
  // console.log('row cetak', row)
  store.dialogLembarverif = true
  lembarverif.value = row
  store.cetaknotadinas = lembarverif.value
}

const cetaksptj = ref([])
function viewCetakSptj(row) {
  // console.log('row cetak', row)
  store.dialogCetakSptj = true
  cetaksptj.value = row
  store.cetaknotadinas = cetaksptj.value
}

const cetakverif = ref([])
function viewCetakVerifikasi(row) {
  // console.log('row cetak', row)
  store.dialogCetakPernyataan = true
  cetakverif.value = row
  store.cetaknotadinas = cetakverif.value
}

function gantiKunci(row) {
  // console.log('row kunci', row)
  const notadinas = row.kunci === "1"
  let lockdata = true
  if (notadinas) {
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
      const payload = {
        nonotadinas: row.nonotadinas,
        kunci: row.kunci,
        nonpdls: row.nonpdls
      }
      console.log('payload', payload)
      store.kunciData(payload).then(() => {
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
      const payload = {
        nonotadinas: row.nonotadinas,
        kunci: row.kunci,
        // nonpdls: row.nonpdls
      }
      console.log('payload', payload)
      store.kunciData(payload).then(() => {
        row.kunci = row.kunci === '1' ? '' : '1'
      })
    }).onCancel(() => {
      console.log('Cancel')
      selected.value = []
    }).onDismiss(() => {
    })
  }
}

const editDataref = ref(null)
function editdata(row) {

  if (auth.user?.pegawai?.kdpegsimrs !== 'sa') {
    $q.notify({
      type: 'negative',
      message: 'Anda tidak Memiliki Akses Edit Data ini, Silahkan Hubungi Admin'
    })
    return
  }
  if (row?.kunci === '1') {
    $q.notify({
      type: 'negative',
      message: 'Data Masih Terkunci, Silahkan Buka Kunci Terlebih Dahulu'
    })
    return
  }

  router.push({ path: '/siasik/ls/notadinas/formdata', replace: true, query: { id: row.id } })
  editDataref.value = row
  form.formheader = editDataref.value
  form.transrinci = editDataref.value?.rincians



  form.params.kodekegiatan = editDataref.value?.kodekegiatan ?? ''
  form.params.kodepptk = editDataref.value?.kodepptk ?? ''
  // console.log('formptks', form.ptks);
  console.log('editDataref', editDataref.value)
  form.getDataNpdls()
  form.formheader.rincians = []

}

</script>
