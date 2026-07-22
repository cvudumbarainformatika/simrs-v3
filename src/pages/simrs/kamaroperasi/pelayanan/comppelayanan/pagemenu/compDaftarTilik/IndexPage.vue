<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
import { useDaftarTilikStore } from 'src/stores/simrs/ranap/daftartilik'
import { useQuasar } from 'quasar'

const ListPage = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/prabedah/daftartilik/comp/ListPage.vue'))
const DaftarTilikOkDialog = defineAsyncComponent(() => import('src/pages/simrs/kamaroperasi/permintaanoperasi/comp/DaftarTilikOkDialog.vue'))

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  }
})

const store = useDaftarTilikStore()
const $q = useQuasar()

const openDialog = ref(false)

const loadData = () => {
  if (props.pasien) {
    store.getData(props.pasien)
  }
}

onMounted(() => {
  loadData()
})

watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    loadData()
  }
})

function onEdit(item) {
  store.initForm(item)
  openDialog.value = true
}

function onHapus(item) {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah Data Daftar Tilik ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteData(props.pasien, item.id)
  })
}

function onSaved() {
  loadData()
}
</script>

<template>
  <div class="fit column relative-position bg-grey-1 q-pa-md">
    <!-- Header Title -->
    <div class="bg-indigo-10 text-white q-pa-sm rounded-borders text-weight-bold q-mb-md flex items-center justify-between">
      <div class="row items-center q-gutter-x-sm">
        <q-icon name="icon-mat-fact_check" size="20px" />
        <span>DAFTAR TILIK PRE-OPERASI (DARI RUANGAN)</span>
      </div>
      <div class="text-caption text-indigo-2 font-weight-normal">
        *Klik tombol Edit pada riwayat untuk meninjau, mengedit checklist, dan konfirmasi penerimaan di OK
      </div>
    </div>

    <!-- Full-Width List Page -->
    <div class="col scroll relative-position bg-white rounded-borders border-panel">
      <ListPage
        :key="props.pasien?.noreg || 'ok-list'"
        :pasien="props.pasien"
        :items="store.items"
        @edit="onEdit"
        @hapus="onHapus"
      />
    </div>

    <!-- Dialog Edit & Penerimaan OK -->
    <DaftarTilikOkDialog
      v-model="openDialog"
      :pasien="props.pasien"
      @saved="onSaved"
    />
  </div>
</template>

<style scoped>
.border-panel {
  border: 1px solid #e0e0e0;
}
</style>
