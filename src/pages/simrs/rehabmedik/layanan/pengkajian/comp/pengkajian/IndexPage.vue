<template>
  <div class="full-height q-pa-sm">
    <div class="row q-col-gutter-x-xs full-height">
      <div class="col-6 full-height">
        <FormPage :pasien="props.pasien" :store-kunjungan="store" />
      </div>
      <div class="col-6 full-height">
        <ListPage :pasien="props.pasien" :store-kunjungan="store" :loading-terima="loadingTerima" />
      </div>
    </div>
    <!-- <app-drawer-right-new :key="props.pasien" :seamless="seamless" :pasien="props.pasien" @click-btn="clickslideRight">
      <template #content>
        <HistoryKanan :key="pasien" :pasien="pasien" title="HISTORY ANAMNESSIS LALU" />
      </template>
</app-drawer-right-new> -->
  </div>
</template>

<script setup>
// import ListAnamnesis from './companamnesis/ListAnamnesis.vue'
// import FormAnamnesis from './companamnesis/FormAnamnesis.vue'
import FormPage from './comp/FormPage.vue'
import ListPage from './comp/ListPage.vue'
import { onMounted, onUnmounted, ref } from 'vue'

// const store = useAnamnesis()
const seamless = ref(false)
// const text = ref('')

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  },
  loadingTerima: {
    type: Boolean,
    default: false
  }
})
onMounted(() => {
  // console.log(text.value)
  document.addEventListener('keypress', handleKeypress, false)
})

onUnmounted(() => {
  document.removeEventListener('keypress', handleKeypress, true)
})

const handleKeypress = (evt) => {
  if (evt.key === 'H' && evt.shiftKey) {
    seamless.value = !seamless.value
  }
}

const clickslideRight = () => {
  // console.log('ok')
  seamless.value = !seamless.value
}

</script>
