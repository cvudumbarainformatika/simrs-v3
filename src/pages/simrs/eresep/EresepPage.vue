<template>
  <div class="row full-height full-width bg-grey-4 shadow-1">
    <Transition enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
      <div v-if="!temp" class="fit row">
        <template v-if="depo == 'rnp' && nakes == 2">
          <div class="col-12">
            <listpage :depo="props?.depo" />
          </div>
        </template>
        <template v-else>
          <div class="col-8 full-height q-pa-xs">
            <form-resep :pasien="props?.pasien" :depo="props?.depo" tooltip="History EResep"
              @open-history="seamless = !seamless" @open-template="temp = !temp"
              @open-cari-template="dialogCari = !dialogCari" />
          </div>
          <div class="col-4 full-height q-pa-xs">
            <listpage :depo="props?.depo" />
          </div>
        </template>
      </div>

      <div v-else class="fit">
        <EresepTemplatePage :pasien="props?.pasien" :depo="props?.depo" :key="pasien"
          :is-cari="template.cariTemplate !== null" @back="kosonginTemplate" />
      </div>
    </Transition>

    <app-drawer-right-new :key="props?.pasien" style="width:60%;" :seamless="seamless" :pasien="props?.pasien"
      @click-btn="clickslideRight">
      <template #content>
        <HistoryEresep :key="props?.pasien" :pasien="props?.pasien" :depo="props?.depo" title="HISTORY E-RESEP" />
      </template>
    </app-drawer-right-new>

    <dialogCariTemplate v-model="dialogCari" :depo="depo" @close="closeDialog" />
    <formEditObat v-model="store.openEditItem" />
  </div>
</template>

<script setup>
import { usePermintaanEResepStore } from 'src/stores/simrs/farmasi/permintaanresep/eresep'
import { defineAsyncComponent, shallowRef, onUnmounted, ref, watchEffect } from 'vue'
import FormResep from './comp/FormResep.vue'
import HistoryEresep from './comp/HistoryEresep.vue'
import { useTemplateEResepStore } from 'src/stores/simrs/farmasi/permintaanresep/templateeresep'

const props = defineProps({
  pasien: { type: Object, default: null },
  depo: { type: String, default: '' },
  nakes: { type: String, default: '' },
  loadingTerima: { type: Boolean, default: false },
})

const seamless = ref(false)
const temp = ref(false)
const dialogCari = ref(false)
// const isTemplate = ref(false)
// const

const listpage = shallowRef(defineAsyncComponent(() => import('./comp/LitsPage.vue')))
const EresepTemplatePage = defineAsyncComponent(() => import('./EresepTemplatePage.vue'))
const dialogCariTemplate = shallowRef(defineAsyncComponent(() => import('./comp/DialogCariTemplate.vue')))
const formEditObat = shallowRef(defineAsyncComponent(() => import('./comp/FormEditObat.vue')))


const store = usePermintaanEResepStore()
const template = useTemplateEResepStore()
onUnmounted(() => {
  console.log('on mounted front page', props?.depo, props.nakes)
  store.listRacikan = []
  store.listPemintaanSementara = []
  store.noreseps = []
  store.noresep = ''
  store.setForm('jenisresep', '')
  store.resetForm()
})

const clickslideRight = () => {
  // console.log('ok')
  seamless.value = !seamless.value
}

const closeDialog = () => {
  dialogCari.value = false
  temp.value = true
  // isTemplate.value = true
}

const kosonginTemplate = () => {
  template.cariTemplate = null
  template.templateSelected = null
  template.items = []
  template.updateListItems()
  template.errorsOrder = []
  temp.value = !temp.value
}

watchEffect(() => {
  if (props.depo == 'rnp' && props.nakes == '2') {
    store.pasien = props?.pasien
    store.depo = props?.depo
    store.setNoreseps(props?.pasien?.newapotekrajal)
    // // console.log('form nya', store.form)
    if (store?.noresep === 'BARU') {
      store.listRacikan = []
      store.listPemintaanSementara = []
    }
  }

  // // console.log('pasi', props.pasien)
})
</script>
