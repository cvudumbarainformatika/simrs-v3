<script setup>
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useMutasiRanapStore } from 'src/stores/simrs/ranap/mutasi'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

const BaseLayout = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/BaseLayout.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
// const DetailForm = defineAsyncComponent(() => import('./comp/DetailForm.vue'))

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

const store = useMutasiRanapStore()

const auth = useAplikasiStore()
const user = computed(() => auth.user?.pegawai?.kdpegsimrs)

const detail = ref(null)
const isDetail = ref(false)

onMounted(() => {
  // console.log('onMounted', props.pasien);

  // store.initReset()
  Promise.all([
    store.getHistory(props?.pasien),
    store.getData(props?.pasien),
    store.getMasterAlasanMutasi(),
    store.getKamar()
    // store.getTindakan(props?.pasien)
  ])
})

const lihatDetail = (data) => {
  console.log('detail', data)

}

</script>

<template>
  <BaseLayout :pasien="props.pasien" :kasus="props.kasus" :nakes="props.nakes" :split="60" title-before="MUTASI PASIEN"
    title-after="History Mutasi Pasien">
    <template #form>
      <FormPage :pasien="props.pasien" :kasus="props.kasus" :store="store" />
    </template>
    <template #list>
      <div class="fit">
        <ListPage v-if="!isDetail" :pasien="props.pasien" :auth="user" :store="store" @detail="lihatDetail" />
        <!-- <DetailForm v-else :item="detail" :auth="user" :pasien="props.pasien" @to-list="isDetail = false" /> -->
      </div>
    </template>
  </BaseLayout>
</template>
