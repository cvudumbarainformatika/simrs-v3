<template>
  <div class="row fit relative-position">
    <!-- Preview Document Overlay -->
    <div v-if="store.item" class="full-height bg-white absolute-top z-top" style="width: 75%;">
      <div class="column full-height">
        <div class="col-auto bg-primary text-white">
          <div class="row justify-between q-pa-sm items-center">
            <div>Preview Document {{ activeMenu?.label }}</div>
            <div class="q-gutter-sm">
              <q-btn v-print="printObj" flat round icon="icon-mat-print" size="sm">
                <q-tooltip class="primary">Cetak Dokumen</q-tooltip>
              </q-btn>
              <q-btn flat round icon="icon-mat-close" size="sm" @click="store.item = null" />
            </div>
          </div>
        </div>
        <div class="col full-height scroll">
          <component ref="refPreview" :is="previewComponent" :pasien="pasien" :menu="activeMenu" :item="store.item" :key="store.item.id" />
          <div style="margin-bottom: 100px;" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="absolute-top column fit q-pa-xs" style="padding-bottom: 41px;">
      <!-- Top Tabs -->
      <div class="col-auto">
        <q-tabs
          v-model="store.menuTab"
          dense
          no-caps
          inline-label
          narrow-indicator
          indicator-color="transparent"
          align="left"
          class="bg-transparent text-grey-8"
          active-color="white"
          active-bg-color="dark"
          @update:model-value="(val) => store.initReset(pasien)"
        >
          <q-tab v-for="tb in menus" :key="tb.name" :ripple="true" :name="tb?.name" content-class="tab-classes">
            <template #default>
              <div class="row q-gutter-x-xs items-center q-px-sm" style="border-radius: 10px;">
                <q-icon :name="tb?.icon" size="18px" />
                <div><strong>{{ tb?.label }}</strong></div>
              </div>
            </template>
          </q-tab>
        </q-tabs>
      </div>

      <!-- Splitter for Form & List -->
      <div class="col full-height">
        <q-splitter
          v-model="splitterModel"
          :limits="[0, 100]"
          before-class="overflow-hidden"
          after-class="overflow-hidden"
          class="fit"
        >
          <template #before>
            <q-tab-panels v-model="store.menuTab" animated class="bg-transparent q-pa-none relative-position fit">
              <!-- PANEL -->
              <q-tab-panel v-for="menu in menus" :key="menu.name" :name="menu?.name" class="q-pa-none fit">
                <div class="column full-height bg-grey-2">
                  <!-- Fixed Header -->
                  <div class="col-auto bg-dark text-white q-pa-md">
                    <div class="text-subtitle1 text-bold">
                      {{ menu?.label }}
                    </div>
                    <div class="text-grey-4 text-caption">{{ menu?.desc }}</div>
                  </div>
                  <!-- Scrollable Form Body -->
                  <div class="col full-height scroll q-pa-md">
                    <q-card class="full-width bg-white shadow-2" style="border-radius: 8px;">
                      <component :is="menu?.comp" :pasien="pasien" :menu="menu" />
                    </q-card>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>

          <template #after>
            <div class="column full-height">
              <div class="col-auto">
                <div class="q-pa-sm bg-dark text-white">
                  List Doc
                </div>
              </div>
              <div class="col full-height">
                <div class="full-height scroll" v-if="pasien?.informconcern?.length > 0">
                  <ListPage
                    :pasien="pasien" :menu="activeMenu" @preview="(val) => {
                      store.menuTab = val.jenis
                      store.initReset(pasien)
                      store.item = val
                    }"
                    @delete="(val) => {
                      hapusItem(val?.id)
                    }"
                  />
                </div>
                <div v-else class="column full-height flex-center bg-grey-1">
                  <div>No Data</div>
                </div>
              </div>
            </div>
          </template>
        </q-splitter>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useConcernOperasiInvasifRanapStore } from 'src/stores/simrs/ranap/concernoperasiinvasif'
import { defineAsyncComponent, onMounted, ref, shallowRef, computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useConcernOperasiInvasifRanapStore()
const $q = useQuasar()
const refPreview = ref(null)
const splitterModel = ref(75)

const printObj = {
  id: 'pdfDoc'
}

const menus = ref([
  {
    name: 'OperasiInvasif',
    label: 'IC Operasi Invasif',
    title: 'OPERASI / TINDAKAN INVASIF',
    desc: 'Surat Persetujuan Tindakan Operasi Invasif',
    icon: 'icon-my-file_sign',
    nakes: ['1', '2', '3'],
    comp: shallowRef(defineAsyncComponent(() => import('./comp/concernoperasi/FormPage.vue')))
  },
  {
    name: 'Sedasi',
    label: 'SP Anestesi Sedasi',
    title: 'TINDAKAN ANESTESI/SEDASI',
    desc: 'Surat Persetujuan Anestesi Sedasi',
    icon: 'icon-fa-file-regular',
    nakes: ['1', '2', '3'],
    comp: shallowRef(defineAsyncComponent(() => import('./comp/concernsedasi/FormComp.vue')))
  },
  {
    name: 'Colonoscopy',
    label: 'SPT Colonoscopy',
    title: 'TINDAKAN COLONOSCOPY',
    desc: 'Surat Persetujuan Tindakan Colonoscopy',
    icon: 'icon-fa-file-regular',
    nakes: ['1', '2', '3'],
    comp: shallowRef(defineAsyncComponent(() => import('./comp/colonoscopy/FormColonoscopy.vue')))
  }
])

const ListPage = defineAsyncComponent(() => {
  return import('./comp/concernoperasi/ListPage.vue')
})

const asyncComponentPreviews = {
  OperasiInvasif: defineAsyncComponent(() => import('./comp/concernoperasi/PreviewPage.vue')),
  Sedasi: defineAsyncComponent(() => import('./comp/concernsedasi/PreviewSedasi.vue')),
  Colonoscopy: defineAsyncComponent(() => import('./comp/colonoscopy/PreviewColonoscopy.vue'))
}

const activeMenu = computed(() => {
  return menus.value.find(i => i.name === store.menuTab)
})

const previewComponent = computed(() => {
  return asyncComponentPreviews[store.item?.jenis ?? 'OperasiInvasif']
})

function hapusItem (id) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteData(props.pasien, id)
  })
}

onMounted(() => {
  store.menuTab = menus.value[0].name
  store.item = null
})

</script>

<style lang="scss" scoped>
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
