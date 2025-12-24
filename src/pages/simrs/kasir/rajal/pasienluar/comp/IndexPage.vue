<template>
  <q-page class="" :class="style.componentfull ? 'container-no-header' : 'container--q-header q-pa-xs'">
    <div class="header bg-primary text-white">
      <header-page @fullscreen="style.setComponentFull" @set-search="store.setQ" @set-row="store.setPerPage"
        @refresh="store.getData" @filter="store.setFilters" />
    </div>

    <q-card flat no-shadow square class="my-flex-1" style="overflow: hidden;">
      <q-scroll-area style="height: calc(100% - 1px);">
        <list-pasien-luar v-if="store.meta !== null" :keloading-cesmixy="store.items" :items="store.items"
          :loading="store.loading" :loadingbayar="store.loadingbayar" @bayar="bayar" />
      </q-scroll-area>
      <div class=" absolute-bottom bg-primary text-white z-top">
        <footer-page :meta="store.meta" @go-to="store.goToPage" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import ListPasienLuar from './ListPasienLuarPage.vue'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
import { useStyledStore } from 'src/stores/app/styled'
import { onMounted, ref } from 'vue'

import { usePasienLuarStore } from 'src/stores/simrs/kasir/pasienluar'
import { usePembayaranKasirRajalStore } from 'src/stores/simrs/kasir/rajal/pembayaran'
import { useRouter } from 'vue-router'
const store = usePasienLuarStore()
const style = useStyledStore()
const router = useRouter()
const storebayar = usePembayaranKasirRajalStore()

function bayar(val) {
  console.log('terimapasien', val)
  if (!val) return
  const pasien = {
    ...val,
    // noreg: val?.nota,
    norm: '-',
    nama: val?.nama ?? '-',
    sapaan: '-',
    kelamin: '',
    kodepoli: '',
    poli: 'Penjualan Luar',
    sistembayar: 'UMUM',
    groupssistembayar: '',
    unit: val?.unit,
  }

  console.log('paaaaasss', pasien)
  const nota = val.nota
  const subtotal = val.subtotal
  const jenis = 'Farmasi'

  storebayar.savePembayarannonKarcis(pasien, nota, subtotal, jenis, router)
}

onMounted(() => {
  store.getData()
})
</script>
