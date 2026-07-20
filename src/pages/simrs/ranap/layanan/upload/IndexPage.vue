<script setup>
// import { useTindakanRanapStore } from 'src/stores/simrs/ranap/tindakan'
import { defineAsyncComponent, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const BaseLayout = defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/components/BaseLayout.vue'))
const FormUpload = defineAsyncComponent(() => import('./comp/FormUpload.vue'))
const ListUpload = defineAsyncComponent(() => import('./comp/ListUpload.vue'))

const route = useRoute()
const isMppOrRm = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  return pathSegments.includes('rekammedik') || pathSegments.includes('mpp')
})

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

// const store = useTindakanRanapStore()

onMounted(() => {
  Promise.all([
    // store.getNota(props?.pasien),
    // store.getTindakan(props?.pasien)
  ])
})

</script>

<template>
  <div v-if="isMppOrRm" class="fit">
    <ListUpload :pasien="props.pasien" />
  </div>
  <BaseLayout
    v-else
    :pasien="props.pasien" :kasus="props.kasus" :nakes="props.nakes" :split="60" nota
    title-before="UPLOAD DOKUMEN LUAR"
    title-after="List Upload"
  >
    <template #form>
      <FormUpload :pasien="props.pasien" />
    </template>
    <template #list>
      <div class="fit">
        <ListUpload :pasien="props.pasien" />
      </div>
    </template>

    <template #nota>
      <!-- <q-select
        v-model="store.notaTindakan"
        outlined
        standout="bg-yellow-3"
        bg-color="white"
        dense
        :options="store.notaTindakans"
        :display-value="`NOTA: ${store.notaTindakan==='' || store.notaTindakan === 'BARU'? 'BARU': store.notaTindakan}`"
        style="min-width: 200px;"
      /> -->
    </template>
  </BaseLayout>
</template>
