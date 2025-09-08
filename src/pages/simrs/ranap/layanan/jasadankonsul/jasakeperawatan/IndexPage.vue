<template>
  <BaseLayout :pasien="props.pasien" :kasus="props.kasus" :nakes="props.nakes" :split="40" title-before="KEPERAWATAN"
    title-after="List Jasa Keperawatan">
    <template #header-kanan>
      <div class="flex q-gutter-x-xs items-center justify-end">
        <q-btn color="white"
          :label="store?.filterRuangs?.find(item => item?.kdruang === store.filterByRuang)?.nama ?? 'Semua Ruang'"
          outline>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item v-for="item in store.filterRuangs" :key="item" clickable
                :active="item?.kdruang === store.filterByRuang" active-class="bg-primary text-white"
                @click="store.filterByRuang = item.kdruang">
                <q-item-section>{{ item.nama }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <app-input-date :model="store.filterTanggal" label="By Tgl / Semua" icon="icon-mat-event" dark outlined valid
          @set-model="val => store.filterTanggal = val" style="width: 150px;" />
        <div v-if="store.filterTanggal !== null">
          <q-icon name="icon-mat-close" size="md" class="cursor-pointer" @click="store.filterTanggal = null"></q-icon>
        </div>
      </div>
      <data class="flex q-gutter-x-sm justify-end q-mt-xs">

        <!-- <q-btn color="white" :label="store?.filterByJenis" outline>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item v-for="item in store.filterJenis" :key="item" clickable :active="item === store.filterByJenis"
                active-class="bg-primary text-white" @click="store.filterByJenis = item">
                <q-item-section>{{ item }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn> -->
      </data>
    </template>

    <template #form>
      <FormPage :pasien="props.pasien" :kasus="props.kasus" />
    </template>
    <template #list>
      <div class="fit">
        <ListPage v-if="store.filterByTgl.length" :key="pasien" :pasien="pasien" :items="store.filterByTgl"
          :store="store" />
        <app-no-data v-else title="Belum ada data" />
        <div class="absolute-bottom full-width bg-white">
          <div class="text-right q-pa-md f-16 text-weight-bold text-teal">
            TOTAL Rp. {{ formatRp(store.total) }}
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>


<script setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { formatRp } from 'src/modules/formatter'
// import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useJasaKeperawatanStore } from 'src/stores/simrs/ranap/jasakeperawatan'

import BaseLayout from 'src/pages/simrs/ranap/layanan/components/BaseLayout.vue'
import ListPage from './ListPage.vue'
import FormPage from './FormPage.vue'

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

// const app = useAplikasiStore()
const store = useJasaKeperawatanStore()

onMounted(() => {
  // store.getData(props.pasien)
  Promise.all([
    store.getTarif(props.pasien),
    store.getData(props.pasien)
  ])
})  
</script>