<template>
  <q-page
    ref="pageRef"
    class="column full-height full-width"
    :class="!style.componentfull?'q-pa-md':'q-pa-xs'"
  >
    <div class="col-auto">
      <PageHead
        v-if="!style.componentfull"
        :title="title"
        :subtitle="subtitle"
        :path="page.path"
        @togle-draw="togleDraw()"
      />
    </div>
    <q-card
      flat
      class="col full-width full-height"
      :style="`max-height: ${!style.componentfull? h-60:h+40}px; overflow:hidden`"
    >
      <q-scroll-area
        :style="`height: ${!style.componentfull? h-95:h+40}px; max-width: 100%;`"
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
      >
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'">
            <component
              :is="Component"
              transition
            />
          </transition>
        </router-view>
      </q-scroll-area>
    </q-card>
  </q-page>
</template>

<script setup>
import { useStyledStore } from 'src/stores/app/styled'
import PageHead from './PageHead.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const style = useStyledStore()
const pageRef = ref()
const h = ref(0)
const thumbStyle = ref({
  right: '0px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '2px',
  opacity: 0.75
})
const barStyle = ref({
  right: '0px',
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: 0.2
})

const page = useRoute()
const title = computed(() => {
  if (page.path === '/pendaftaran/igd/form') {
    return 'PENDAFTARAN IGD'
  } else if (page.path === '/pendaftaran/igd/kunjungan') {
    return 'LIST KUNJUNGAN'
  // } else if (page.path === '/pendaftaran/umum/listmjkn') {
  //   return 'LIST MOBILE JKN'
  } else {
    return 'MASTER PASIEN'
  }
})

const subtitle = computed(() => {
  if (page.path === '/pendaftaran/igd/form') {
    return 'Pendaftaran Pasien Igd'
  } else if (page.path === '/pendaftaran/igd/kunjungan') {
    return 'List Kunjungan Pasien Tanpa Ansuransi / Umum'
  // } else if (page.path === '/pendaftaran/umum/listmjkn') {
  //   return 'List Kunjungan dari m-JKN'
  } else {
    return 'Daftar Pasien'
  }
})

onMounted(() => {
  h.value = pageRef.value.$el.clientHeight
})
</script>
