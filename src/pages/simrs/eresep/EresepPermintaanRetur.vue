<template>
  <div class="row full-height full-width bg-grey-4 shadow-1">
    <Transition enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
      <div class="fit row">
        <div class="col-7 full-height q-pa-xs">
          <formpage :pasien="props?.pasien" :depo="props?.depo" />
        </div>
        <div class="col-5 full-height q-pa-xs">
          <listpage :depo="props?.depo" />
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { usePermintaanEResepStore } from 'src/stores/simrs/farmasi/permintaanresep/eresep'
import { usePermintaanReturEresepStore } from 'src/stores/simrs/farmasi/permintaanresep/permintaanretur'
import { defineAsyncComponent, onMounted, shallowRef, watchEffect } from 'vue'
import { laravelEcho } from 'src/modules/newsockets'

const props = defineProps({
  pasien: { type: Object, default: null },
  depo: { type: String, default: '' },
  nakes: { type: String, default: '' },
  kasus: { type: Object, default: null },
  loadingTerima: { type: Boolean, default: false },
})


const store = usePermintaanEResepStore()
const form = usePermintaanReturEresepStore()

const formpage = shallowRef(defineAsyncComponent(() => import('./compPermintaanRetur/FormPermintaanRetur.vue')))
const listpage = shallowRef(defineAsyncComponent(() => import('./compPermintaanRetur/ListPermintaanRetur.vue')))


watchEffect(() => {
  store.pasien = props?.pasien
  store.depo = props?.depo
  form.getObatKeluar({ noreg: props?.pasien?.noreg })
})

function subscribedChannel () {
  const channel = laravelEcho.private('private.notif.ruang-ranap')
  channel.subscribed(() => {
    console.log('subscribed private.notif.ruang-ranap channel !!!')
  }).listen('.notif-message', (e) => {
    console.log('listen notif', e)
  })
}
onMounted(() => {
  subscribedChannel()
})
</script>
