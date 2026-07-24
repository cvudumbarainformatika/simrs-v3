<script setup>
import { useQuasar } from 'quasar'
import { usePraSedasiRanapStore } from 'src/stores/simrs/ranap/prasedasi'
import { defineAsyncComponent, onMounted } from 'vue'

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

const store = usePraSedasiRanapStore()

onMounted(() => {
  store.getData(props.pasien)
  store.initForm()
})

function lihat(val) {
  store.initForm(val)
}

const $q = useQuasar()
function hapusData(val) {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data Asesmen Pra Sedasi ini akan dihapus?',
    cancel: true
  }).onOk(() => {
    store.deleteData(props.pasien, val)
  })
}
</script>

<template>
  <BaseLayout
    :pasien="props.pasien"
    :kasus="props.kasus"
    :nakes="props.nakes"
    :split="60"
    title-before="FORM PRA SEDASI (RM IRNA - 38d)"
    title-after="List Pra Sedasi"
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
          @hapus="(val) => hapusData(val)"
          @edit="(val) => lihat(val)"
        />
      </div>
    </template>
  </BaseLayout>
</template>
