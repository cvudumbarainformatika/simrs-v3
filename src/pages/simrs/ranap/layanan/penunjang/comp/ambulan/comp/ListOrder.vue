<template>
  <div class="fit column">
    <div v-if="filterredTable?.length" class="fit scroll q-pa-sm">
      <q-card v-for="item in filterredTable" :key="item" flat bordered class="full-width q-mb-sm">
        <q-card-section>
          <div class="row items-center full-width justify-between relative-position">
            <div class="col-auto" style="max-width: 85%;">
              <div>NOTA : <b>{{ item?.nota }}</b></div>
              <div><em>Tujuan :</em> <b>{{ store?.tujuans?.find(x => x?.rs1 === item?.rs10)?.rs2 ?? '-' }}</b> </div>
              <div><em>Ket :</em> <b>{{ item?.rs11 ?? '-' }}</b> </div>
              <div><em>Driver :</em> <b>{{ store.drivers?.find(x => x?.kdpegsimrs === item?.kd_driver)?.nama ?? item?.kd_driver ?? '-' }}</b> </div>
              <div><em>Perawat1 :</em> <b>{{ store.perawats?.find(x => x?.kdpegsimrs === item?.rs13)?.nama ?? '-'
                  }}</b> </div>
              <div><em>Perawat2 :</em> <b>{{ store.perawats?.find(x => x?.kdpegsimrs === item?.rs14)?.nama ?? '-'
                  }}</b> </div>
              <div><em>dr pengirim :</em> <b>{{ store.dokters?.find(x => x?.kdpegsimrs === item?.rs9)?.nama ?? '-'
                  }}</b> </div>
              <div class="">
                <!-- <div>by : <em>{{ item?.userinput }}</em></div> -->
              </div>
              <div class="row items-center justify-between full-width q-mt-xs">
                <!-- Tombol History Log Activity (Kiri/Kanan sesuai request) -->
                <div>
                  <q-btn icon="icon-mat-history" outline color="teal-8" size="sm"
                    @click="bukaDialogLog(item)" title="History Perubahan / Log Activity" label="History" dense class="q-px-xs" />
                </div>

                <!-- Tombol CRUD Aksi -->
                <div class="row items-center q-gutter-xs">
                  <q-btn icon="icon-mat-edit" outline color="warning" round size="sm"
                    @click="editItem(item)" title="Edit Permintaan" />
                  <q-btn icon="icon-mat-print" outline color="primary" round size="sm"
                    @click="bukaDialogCetak(item)" title="Cetak Formulir Pemesanan Ambulance" />
                  <q-btn icon="icon-mat-delete" outline color="negative" round size="sm"
                    @click="hapusItem(item?.id)" title="Hapus" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="fit column flex-center">
      <div v-if="!loading" class="f-14">
        Belum ada data
      </div>
      <div v-else>
        Sedang memuat ...
      </div>
    </div>

    <!-- DIALOG LOG ACTIVITY KHUSUS PEMESANAN AMBULANCE -->
    <DialogLogAmbulan v-model="dialogLog" :pasien="pasien" :selected-item="selectedItem" />

    <!-- DIALOG CETAK FORMULIR PEMESANAN AMBULANCE -->
    <q-dialog v-model="dialogCetak" maximized persistent>
      <q-card class="column fit bg-grey-3">
        <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm">
          <div class="text-subtitle1 text-weight-bold flex items-center q-gutter-x-sm">
            <q-icon name="icon-mat-directions_car" size="24px" />
            <span>Formulir Pemesanan Ambulance</span>
          </div>
          <div class="row q-gutter-sm">
            <q-btn flat round dense icon="icon-mat-close" color="white" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="col scroll q-pa-none">
          <AmbulanceDoc :pasien="pasien" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { usePermintaanAmbulanStore } from 'src/stores/simrs/ranap/ambulance'
import { computed, defineAsyncComponent, ref } from 'vue'

const AmbulanceDoc = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/dokumen/ambulance/IndexPage.vue'))
const DialogLogAmbulan = defineAsyncComponent(() => import('./DialogLogAmbulan.vue'))

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pasien: {
    type: Object,
    default: null
  }
})
const store = usePermintaanAmbulanStore()

const dialogCetak = ref(false)
const dialogLog = ref(false)
const selectedItem = ref(null)

const printObj = {
  id: 'print-ambulance-document',
  popTitle: 'Formulir Pemesanan Ambulance'
}

function bukaDialogCetak(item) {
  selectedItem.value = item
  dialogCetak.value = true
}

function bukaDialogLog(item) {
  selectedItem.value = item
  dialogLog.value = true
}

function editItem(item) {
  store.setFormEdit(item)
}

const filterredTable = computed(() => {
  return props?.pasien?.permintaanambulan || []
})

const $q = useQuasar()
function hapusItem(id) {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusPermintaan(props?.pasien, id)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
</script>
