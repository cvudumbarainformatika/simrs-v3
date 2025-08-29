<script setup>
import { defineAsyncComponent, ref } from 'vue'
import useRightPanel from './use/useRightPanel'
import { humanDate, jamTnpDetik } from 'src/modules/formatter'
import gsap from 'gsap'

// const BarComp = defineAsyncComponent(() => import('../components/BarComp.vue'))
// const ListIgd = defineAsyncComponent(() => import('../components/ListIgd.vue'))
// const InfoInputRanap = defineAsyncComponent(() => import('../components/InfoInputRanap.vue'))

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  items: {
    type: Array,
    default: () => []
  }
})

// eslint-disable-next-line no-unused-vars
const min = ref(false)

// eslint-disable-next-line no-unused-vars
const { store, settings, nakes } = useRightPanel(props.pasien)

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



const handleClick = (item) => {
  // console.log('handleClick', item);
  store.initReset(item)
}
</script>

<template>
  <q-splitter v-model="settings.splitMin" horizontal :limits="[5, 94]" style="height: 100%" separator-class="bg-grey-9"
    separator-style="height: 3px">
    <template #before>
      <div class="bg-transparent q-pa-sm">
        <q-list bordered separator class="">
          <transition-group appear tag="div" @before-enter="beforeEnter" @enter="enter">
            <div v-for="(item, i) in items" :key="item?.id" v-ripple class="q-card q-pa-md q-mb-sm cursor-pointer"
              @click="handleClick(item)">
              <q-item-section>
                <q-item-label class="text-bold">PAGT</q-item-label>
                <q-item-label caption>
                  Oleh : {{ item?.petugas?.nama }}
                </q-item-label>
                <q-item-label caption>
                  <div>Dibuat Tanggal : </div>
                  <div class="flex q-gutter-sm items-center">
                    <div><q-icon name="icon-ion-timer" size="sm" /></div>
                    <div>{{ humanDate(item?.created_at) }}, Jam : {{ jamTnpDetik(item?.created_at) }}</div>
                  </div>
                </q-item-label>
                <q-item-label v-if="item?.updated_at !== item?.created_at" caption>
                  <div>DiEdit Tanggal : </div>
                  <div class="flex q-gutter-sm items-center">
                    <div><q-icon name="icon-ion-timer" size="sm" /></div>
                    <div>{{ humanDate(item?.updated_at) }}, Jam : {{ jamTnpDetik(item?.updated_at) }}</div>
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section side bottom>
                <q-icon :name="item?.id ? 'icon-mat-done_all' : 'icon-mat-done'" color="teal" />
              </q-item-section>
            </div>
          </transition-group>
        </q-list>

      </div>
    </template>


  </q-splitter>
</template>
