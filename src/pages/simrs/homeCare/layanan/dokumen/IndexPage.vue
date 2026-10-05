<template>
  <div ref="main" class="column flex-center full-height bg-white">
    <div class="container full-height">
      <div class="column full-height">
        <div class="col-grow">
          <KumpulanSurat :key="doc" :items="filterDokumen" @go-to="(item) => goTo(item)" />
        </div>
      </div>
    </div>

    <app-fullscreen-blue v-model="open">
      <template #default>
        <component :is="cekPanel()" :key="props.pasien" :pasien="props.pasien" />
      </template>
    </app-fullscreen-blue>
  </div>
</template>

<script setup>
import KumpulanSurat from 'src/pages/simrs/dokumen/comppoli/KumpulanSurat.vue'
import { findWithAttr } from 'src/modules/utils'
import { ref, defineAsyncComponent, computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  depo: {
    type: String,
    default: ''
  }
})

const open = ref(false)
const doc = ref('')

const documents = ref([
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'RM IRJA-2',
    label: 'Catatan Rawat Jalan',
    value: 'Catatan'
  }
])

const filterDokumen = computed(() => {
  return documents.value
})

const comp = [
  { nama: 'Catatan', page: defineAsyncComponent(() => import('./comp/CatatanRawatJalanHcPage.vue')) }
]

const cekPanel = () => {
  const val = doc.value
  const ganti = val.replace(/ /g, '')
  const arr = findWithAttr(comp, 'nama', ganti)
  return arr >= 0 ? comp[arr].page : ''
}

function goTo (val) {
  doc.value = val.value
  open.value = true
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: calc(100vw - 250px);
  min-height: 90vh;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  font-size: 10px;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-right: 3px solid rgba(255, 255, 255, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
}
</style>
