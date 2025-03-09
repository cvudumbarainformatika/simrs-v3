<template>
  <div class="row justify-between content-center full-width">
    <div class="col-auto q-pl-md flex-start">
      <q-img src="~assets/images/Pemkot.svg" style="height: 2.6cm; width: 2cm" />
    </div>
    <div class="flex-end justify-center content-center col full-width">
      <div class="row justify-center text-center text-weight-bold" style="font-size: 15px">
        PEMERINTAH KOTA PROBOLINGGO
      </div>
      <div class="row justify-center text-center text-weight-bold" style="font-size: 15px">
        SURAT PERMINTAAN PENGESAHAN PENDAPATAN, BELANJA DAN PEMBIAYAAN
      </div>
      <div class="row justify-center text-center text-weight-bold" style="font-size: 15px">
        BADAN LAYANAN UMUM DAERAH
      </div>
      <div class="row justify-center text-center q-pt-md">
        Tanggal : {{ store.viewData?.bulan_realisasi }} Nomor: {{ store.viewData?.nosp3b }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSp3bStore } from 'src/stores/siasik/akuntansi/sp3b/sp3b';

const store = useSp3bStore()
</script>
