<script setup>
import { useQuasar } from 'quasar'
import { useDaftarTilikStore } from 'src/stores/simrs/ranap/daftartilik'
import { defineAsyncComponent, onMounted, watch } from 'vue'

const BaseLayout = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/BaseLayout.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))

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

onMounted(() => {
  store.getData(props.pasien)
  store.initForm()
})

watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    store.getData(newPasien)
    store.initForm()
  }
})

function lihat (val) {
  store.initForm(val)
}

const $q = useQuasar()
function hapusData (val) {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah Data Daftar Tilik ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteData(props.pasien, val.id)
  })
}
</script>

<template>
  <BaseLayout
    :pasien="props.pasien" :kasus="props.kasus" :nakes="props.nakes" :split="55"
    title-before="FORM DAFTAR TILIK (PRE-OPERASI)"
    title-after="List Riwayat Daftar Tilik"
  >
    <template #form>
      <FormPage :pasien="props.pasien" :kasus="props.kasus" />
    </template>
    
    <template #list>
      <div class="fit">
        <ListPage
          :key="pasien"
          :pasien="pasien"
          :items="store.items"
          @hapus="(val)=> hapusData(val)"
          @edit="(val)=> lihat(val)"
        />
      </div>
    </template>
  </BaseLayout>
</template>
