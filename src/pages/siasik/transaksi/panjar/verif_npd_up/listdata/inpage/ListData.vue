<template>
  <div class="justify-content-center full-width">
    <q-table style="height: 100%" :rows="store.items" :columns="columnsdata" row-key="name" dense flat bordered
      wrap-cells :filter="store.params.q" :loading="store.loading" :rows-per-page-options="[10, 50, 100]">
      <template #loading>
        <q-inner-loading showing color="warning" />
      </template>
      <template #top-left>
        <div class="flex q-gutter-sm z-top">
          <div>
            <q-input v-model="store.params.q" outlined dense placeholder="Cari Data NPD-UP ..." debounce="500"
              style="min-width: 300px">
              <template v-if="store.params.q" #append>
                <q-icon name="icon-mat-close" size="xs" class="cursor-pointer" @click.stop.prevent="clearSearch" />
              </template>
              <template #prepend>
                <q-icon size="sm" name="icon-mat-search" />
              </template>
            </q-input>
          </div>
          <!-- <div class="q-pl-sm">
            <q-input outlined dense label="Tahun" v-model="store.params.tahun" debounce="400"
              :disable="store.disabled && store.loading" :loading="store.loading" :autofocus="false"
              @update:model-value="(val) => {
                console.log('Tahun berapa?', val)
                store.params.tahun = val
                store.getDatabelumVerif()
              }" />
          </div> -->
        </div>
      </template>
      <template #body="props">
        <q-tr>
          <q-td key="nosppup" :props="props">
            <div>
              {{ props.row.nosppup }}
            </div>
          </q-td>
          <q-td key="tglTrans" :props="props">
            {{ props.row?.tglTrans }}
          </q-td>
          <q-td key="bendahara" :props="props">
            {{ props.row.bendaharaKeluar }}
          </q-td>
          <q-td key="uraian" :props="props">
            {{ props.row?.uraian }}
          </q-td>
          <q-td key="total" :props="props">
            {{ formatDenganRp(props.row?.jumlahspp) }}
          </q-td>
          <q-td>
            <div class="row justify-center">
              <div class="q-pr-xs">
                <q-btn flat size="sm" class="bg-yellow-9 text-white" label="VERIF" :auth="user"
                  @click="verifData(props?.row)">

                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { formatDenganRp, formatRpDouble } from 'src/modules/formatter';
import { useAplikasiStore } from 'src/stores/app/aplikasi';
import { useTransaksiNPDUP } from 'src/stores/siasik/transaksi/panjar/npd_up/store_npd_up';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useTransaksiNPDUP()

const auth = useAplikasiStore()
const user = computed(() => auth.user?.pegawai?.kdpegsimrs)
const router = useRouter()
onMounted(() => {
  store.getDatabelumVerif()
})
const listdatanota = [
  {
    name: 'nosppup',
    label: 'No Transaksi',
    align: 'left',
    field: 'nosppup',
    // field: row => [row.nosppup, row.total],
    sortable: true,
    headerStyle: 'height:50px; font-weight: bold;'
  },
  {
    name: 'tglTrans',
    label: 'Tanggal',
    align: 'left',
    field: 'tglTrans',
    sortable: true,
    headerStyle: 'height:50px; font-weight: bold;'
  },
  {
    name: 'bendahara',
    label: 'Bendahara Pengeluaran',
    align: 'left',
    field: 'bendaharaKeluar',
    // field: row => [row.nonpk],
    sortable: true,
    // style: 'width: 200px',
    headerStyle: 'height:50px; font-weight: bold;'
  },
  {
    name: 'uraian',
    label: 'Keterangan',
    align: 'left',
    field: 'uraian',
    sortable: true,
    headerStyle: 'width: 10%; max-width:30%; height:50px; font-weight: bold;'
  },
  // {
  //   name: 'kegiatan',
  //   label: 'Kegiatan BLUD',
  //   align: 'left',
  //   field: 'kegiatan',
  //   sortable: true,
  //   headerStyle: 'width: 20%; max-width:30%; height:50px; font-weight: bold;'
  // },
  {
    name: 'total',
    label: 'Nilai',
    align: 'right',
    field: 'jumlahspp',
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

const clearSearch = () => {
  store.params.q = ''
  store.goToPage(1)
}



const $q = useQuasar()
const selected = ref([])
function verifData(row) {
  console.log('row verif', row)
  if (row.verif === "") {
    // Validasi: hanya user super admin yang bisa buka kunci
    if (auth.user?.pegawai?.kdpegsimrs !== 'sa') {
      $q.notify({
        type: 'negative',
        message: 'Anda tidak Memiliki Izin Memverifikasi Data ini, Silahkan Hubungi Admin'
      })
      return
    }
    $q.dialog({
      title: 'Peringatan',
      message: 'Apakah Anda yakin akan Memverifikasi Data?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      const payload = {
        nosppup: row.nosppup,
        verif: row.verif,
      }
      console.log('payload', payload)
      store.verifData(payload)
      // .then(() => {
      //   row.kunci = row.kunci === '1' ? '' : '1'
      // })
    }).onCancel(() => {
      console.log('Cancel')
      selected.value = []
    }).onDismiss(() => {
    })
  }

}



</script>
