<template>
  <div class="fit column bg-grey-4 relative-position ">
    <div class="bg-grey-4 q-pa-sm">
      <info-input-ranap :items="store?.pasien?.pengkajian" class="scroll">
        <transition-group appear tag="div" @before-enter="beforeEnter" @enter="enter">
          <div v-for="(item, i) in store?.pasien?.pengkajian" :key="item" v-ripple
            class="q-card q-pa-md q-mb-sm cursor-pointer">
            <div class="row items-center">
              <div class="col-1">{{ i + 1 }}</div>
              <div class="col-11">

                <div class="row items-center">
                  <div class="col-4">Alasan</div>
                  <div class="col-8">{{ item?.rs4 }}</div>
                </div>
                <div class="row items-center bg-blue-2">
                  <div class="col-4">Riwayat Psikososial</div>
                  <div class="col-8">{{ item?.rs5 }}</div>
                </div>
                <div class="row items-center ">
                  <div class="col-4">Hubungan Keluarga</div>
                  <div class="col-8">{{ item?.rs6 }}</div>
                </div>
                <div class="row items-center bg-blue-2">
                  <div class="col-4">Psikologis</div>
                  <div class="col-8">{{ item?.rs7 }}</div>
                </div>
                <div v-if="item?.rs7 == 'Lain-lain'" class="row items-center bg-blue-2">
                  <div class="col-4">yaitu</div>
                  <div class="col-8">{{ item?.rs8 }}</div>
                </div>
                <div class="row items-center ">
                  <div class="col-4 f-12">Tekanan Darah</div>
                  <div class="col-8">{{ item?.rs9 }}</div>
                </div>
                <div class="row items-center bg-blue-2">
                  <div class="col-4">Nadi</div>
                  <div class="col-8">{{ item?.rs10 }}</div>
                </div>
                <div class="row items-center ">
                  <div class="col-4">Suhu</div>
                  <div class="col-8">{{ item?.rs11 }}</div>
                </div>
                <div class="row items-center bg-blue-2">
                  <div class="col-4">Tinggi Badan</div>
                  <div class="col-8">{{ item?.rs12 }}</div>
                </div>
                <div class="row items-center ">
                  <div class="col-4">Berat Badan</div>
                  <div class="col-8">{{ item?.rs13 }}</div>
                </div>
                <div class="row items-center bg-blue-2">
                  <div class="col-4">Penuruan Berat Badan</div>
                  <div class="col-8">{{ item?.rs14 }}</div>
                </div>
                <div class="row items-center ">
                  <div class="col-4">Diagnosa Khusus</div>
                  <div class="col-8">{{ item?.rs15 }}</div>
                </div>
                <div class="row items-center bg-blue-2">
                  <div class="col-4">Berkurang asupan akibat Nafsu makan</div>
                  <div class="col-8"><span class="q-ml-xs">{{ item?.rs16 }}</span></div>
                </div>
                <div class="row items-center ">
                  <div class="col-4">Status Fungsional</div>
                  <div class="col-8">{{ item?.rs17 }}</div>
                </div>
                <div v-if="item?.rs17 == 'Perlu Bantuan'" class="row items-center ">
                  <div class="col-4">Dibantu dengan</div>
                  <div class="col-8">{{ item?.rs18 }}</div>
                </div>
              </div>
            </div>
            <div class="row justify-end q-ma-xs q-col-gutter-x-xs">

              <q-btn flat dense color="primary" icon="icon-mat-edit"
                @click="edit(item)"><q-tooltip>edit</q-tooltip></q-btn>
              <q-btn flat dense color="red" icon="icon-mat-delete" @click="remove(item)" :loading="item.loading"
                :disable="item.loading"><q-tooltip>hapus</q-tooltip></q-btn>
            </div>
          </div>
        </transition-group>

      </info-input-ranap>
    </div>
  </div>
</template>
<script setup>
import { useListPasienHemodialisaStore } from "src/stores/simrs/hemodialisa/hemodialisa"
import { defineAsyncComponent, onMounted } from "vue"
import { gsap } from 'gsap'
import { usePengkajianHemodialisaStore } from "src/stores/simrs/hemodialisa/pengkajian"

const store = useListPasienHemodialisaStore()
const storeForm = usePengkajianHemodialisaStore()
const InfoInputRanap = defineAsyncComponent(() => import('../../../components/InfoInputRanap.vue'))

function edit (item) {
  // console.log('edit', item)
  storeForm.setForm('id', item.id)
  storeForm.setForm('alasan', item.rs4)
  storeForm.setForm('riwayat', item.rs5)
  storeForm.setForm('hubungan', item.rs6)
  storeForm.setForm('psikologis', item.rs7)
  storeForm.setForm('lain', item.rs8)
  storeForm.setForm('td', item.rs9)
  storeForm.setForm('nadi', item.rs10)
  storeForm.setForm('suhu', item.rs11)
  storeForm.setForm('tb', item.rs12)
  storeForm.setForm('bb', item.rs13)
  storeForm.setForm('penurunanBB', item.rs14)
  storeForm.setForm('asupanNafsu', item.rs15)
  storeForm.setForm('diagKhus', item.rs16)
  storeForm.setForm('fungsional', item.rs17)
  storeForm.setForm('lainx', item.rs18)
}
function remove (item) {
  console.log('remove', item)
  storeForm.hapus(item)
}
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
onMounted(() => {
  console.log('pasien', store?.pasien)

})
</script>
