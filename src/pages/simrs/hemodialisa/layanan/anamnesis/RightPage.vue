<script setup>
import { defineAsyncComponent, ref } from 'vue'
import useRightPanel from './use/useRightPanel'
import gsap from 'gsap'

const BarComp = defineAsyncComponent(() => import('../components/BarComp.vue'))
const ListIgd = defineAsyncComponent(() => import('../components/ListIgd.vue'))
const InfoInputRanap = defineAsyncComponent(() => import('../components/InfoInputRanap.vue'))

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

// eslint-disable-next-line no-unused-vars
const min = ref(false)

// eslint-disable-next-line no-unused-vars
const { store, settings, fields, nakes } = useRightPanel(props.pasien)

const beforeEnter = (el) => {
  el.style.opacity = 0
  el.style.transform = 'translateX(200px)'
}
const enter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    x: 0,
    duration: 0.2,
    onComplete: done
  })
}

</script>

<template>
  <q-splitter v-model="settings.splitMin" horizontal :limits="[5, 94]" style="height: 100%" separator-class="bg-grey-9"
    separator-style="height: 3px">
    <template #before>
      <div class="bg-transparent q-pa-sm">
        <info-input-ranap :items="store.items?.awal" :loading="store.loading">
          <transition-group appear tag="div" @before-enter="beforeEnter" @enter="enter">
            <div v-for="(item, i) in store.items?.awal" :key="i" v-ripple class="q-card q-pa-md q-mb-sm cursor-pointer">
              <q-item-section @click="() => {
                store.initReset(item)
              }">
                <q-item-label class="text-bold">
                  {{ item?.nakes === '1' ? 'ASESMENT AWAL MEDIS'
                    : item?.nakes === '2' ? 'ASESMENT AWAL KEPERAWATAN'
                      : item.nakes === '3' ? 'ASESMENT AWAL KEBIDANAN'
                        : 'ASESMENT AWAL ???' }}
                </q-item-label>
                <q-item-label>Data Anamnesis Tersimpan </q-item-label>
                <q-item-label caption>
                  Oleh : {{ item?.petugas?.nama }}
                </q-item-label>
                <q-item-label caption>
                  <div class="flex q-gutter-sm items-center">
                    <div><q-icon name="icon-ion-timer" size="sm" /></div>
                    <div>{{ item?.tgl }}</div>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section side bottom>
                <q-icon :name="item?.id ? 'icon-mat-done_all' : 'icon-mat-done'" color="teal" />
              </q-item-section>
            </div>
          </transition-group>
          <div style="margin-bottom:100px;" />
        </info-input-ranap>
      </div>
    </template>

    <template #after>
      <div class="column fit bg-grey-7 text-white">
        <div class="col-auto full-width">
          <bar-comp :btn-full="false" title="Pemeriksaan Umum IGD" bg-color="grey-10" btn-min="icon-mat-expand_more"
            :minimize="settings.splitMin > 50" @min="() => {
              settings.splitMin === 94 ? settings.splitMin = 50 : settings.splitMin = 95
            }" />
        </div>
        <div class="col full-height q-pa-sm scroll content">
          <list-igd :items="store.items.igd">
            <q-list v-for="dataIgd in store.items?.igd" :key="dataIgd" dark bordered separator>
              <q-item v-for="list in fields.igd" :key="list">
                <q-item-section>
                  <q-item-label>{{ list.label }}</q-item-label>
                  <q-item-label caption>
                    <em class="text-weight-bold">{{ dataIgd[list.row] }}</em>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </list-igd>
        </div>
      </div>
    </template>
  </q-splitter>
</template>
