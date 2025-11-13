<template>
  <div class="justify-content-center full-width">
    <q-table style="height: 100%" :rows="store.listdataverif" :columns="columnsdata" row-key="name" dense flat bordered
      wrap-cells :filter="store.params.q" :loading="store.loading || !store.listdataverif.length"
      :rows-per-page-options="[10, 50, 100]">
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
                store.dataVerif()
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
                <q-btn flat round size="xs" class="bg-red-10 text-white" icon="icon-fa-check-to-slot-solid" :auth="user"
                  @click="viewRincian(props?.row)">
                  <q-tooltip> Lihat Rincian </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <app-dialog-rincian v-model="store.openDialogRinci" :nota="nota" />
  </div>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { formatRpDouble } from 'src/modules/formatter';
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { listdataNotadinasStore } from 'src/stores/siasik/transaksi/ls/notadinas/list';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';


const AppDialogRincian = defineAsyncComponent(() => import('./DialogViewRincian.vue'))
const store = listdataNotadinasStore()

const auth = useAplikasiStore()
const user = computed(() => auth.user?.pegawai?.kdpegsimrs)
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

  store.listrinci = nota.value
}

const clearSearch = () => {
  store.params.q = ''
  store.goToPage(1)
}




</script>
