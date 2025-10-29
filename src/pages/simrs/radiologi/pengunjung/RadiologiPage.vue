<template>
  <!-- <q-page> -->
  <q-page class="fit q-pa-md absolute">
    <template v-if="store.pasien">
      <!-- <DetailsPasien /> -->
      <page-tindakan :key="store.pasien" v-model="store.pageTindakan" :pasien="store.pasien"
        :loading-terima="store?.loadingTerima" />
    </template>
    <template v-else>
      <div class="fit column relative-position">
        <div class="col-auto">
          <HeaderComp />
        </div>
        <div class="col full-height">
          <div v-if="store.loading" class="fit column flex-center">
            <q-spinner-comment size="6em" color="grey"></q-spinner-comment>
            <div>Harap Tunggu ...</div>
          </div>
          <template v-else-if="store.items?.length && !store.loading > 0">
            <transition-group appear enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster">
              <list-pasien v-if="!store.isViewList" key="list-pasien" :items="store.items" :loading="store.loading"
                :loading-terima="store?.loadingTerima" :loading-batal="store?.loadingBatal"
                @details="(val) => store.getDataPasienRadiologiByNota(val)" @click="store.helperKdRuangan(store.pasien)"
                @terima="(val) => store.terimaPasien(val)" @batal="(val) => batalkanPasien(val)" jenis="dalam"
                @detail-item="(val) => detailPermintaan(val)" />
              <thumbnail-view v-else key="thumbnail-view" :items="store.items"
                @details="(val) => store.getDataPasienRadiologiByNota(val)" />
            </transition-group>
          </template>
          <div v-else class="fit column flex-center">
            <div class="text-h4 q-mb-xs">
              🏷️
            </div>
            <div class="text-grey-8">
              Data Tidak Ditemukan
            </div>
          </div>
        </div>
        <div class="absolute-bottom z-top">
          <app-paginate-simple v-if="store.meta" :key="store.meta" :meta="store.meta" color="bg-grey-8"
            @go-to="store.setPage" />
        </div>
      </div>
    </template>
  </q-page>
  <!-- </q-page> -->
</template>

<script setup>
import HeaderComp from './comp/HeaderComp.vue'
import ThumbnailView from './comp/ThumbnailView.vue'

import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ListPasien from './comp/ListPasien.vue'
// import DetailsPasien from '../pengunjung/comp/DetailsPasien.vue'
import PageTindakan from '../tindakan/IndexPage.vue'

const store = useListPasienRadiologiStore()

const $q = useQuasar()

onMounted(() => {
  store.getDataTable()
})

function batalkanPasien(dot) {
  // console.log('dot', dot);

  $q.dialog({
    title: 'Alasan Pembatalan',
    message: `Berikan Alasan Pembatalan Pada Pasien <b>${dot.nama} dengan </b> Nota Permintaan <b class="text-negative">${dot.nota_permintaan}</b> dari ruangan <b>${dot.ruangan}</b> ini`,
    prompt: {
      model: '',
      isValid: val => val.length > 2, // << here is the magic
      type: 'text' // optional
    },
    cancel: true,
    persistent: true,
    html: true
  }).onOk(data => {
    store.batalkanPasien(dot, data)
  })
}


function detailPermintaan(val) {
  console.log('details sementara', val);

  const items = val?.rinciansementara

  let rinci = []
  for (let i = 0; i < items.length; i++) {
    const el = items[i];
    rinci.push(`<div style="border-top: 1px solid #ddd; padding: 5px"> ${i + 1} .  ${el?.relmasterpemeriksaan?.rs2} (${el?.relmasterpemeriksaan?.rs3})</div>`)
  }

  $q.dialog({
    title: 'Details Permintaan',
    message: `Data Permintaan Radiologi dari <b class="text-primary"> ${val?.ruangan} </b> 
    <div style="margin-top: 10px; padding-bottom: 10px;">
      ${rinci}
    </div>
    `,
    persistent: true,
    html: true
  }).onOk(data => {
    // console.log('>>>> OK, received', data)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>

<style lang="scss" scoped>
.scroll {
  scrollbar-width: none;
  /* untuk Firefox */
}

.scroll::-webkit-scrollbar {
  display: none;
  /* untuk Chrome, Safari, dan Opera */
}
</style>
