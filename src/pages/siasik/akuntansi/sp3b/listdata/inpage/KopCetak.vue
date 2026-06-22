<template>
  <div class="row b1 justify-between content-center full-width">
    <div class="col-auto q-pl-md q-py-sm flex-start">
      <q-img src="~assets/images/Pemkot.svg" style="height: 2.6cm; width: 2cm" />
    </div>
    <div class="justify-center content-center col full-width">
      <div class="row q-pt-sm justify-center text-center text-weight-bold" style="font-size: 15px">
        PEMERINTAH KOTA PROBOLINGGO
      </div>
      <div class="row justify-center text-center text-weight-bold" style="font-size: 15px">
        SURAT PERMINTAAN PENGESAHAN PENDAPATAN, BELANJA DAN PEMBIAYAAN
      </div>
      <div class="row justify-center text-center text-weight-bold" style="font-size: 15px">
        BADAN LAYANAN UMUM DAERAH
      </div>
      <div class="row q-pb-sm justify-center text-center q-pt-sm">
        Tanggal : {{ dateFullFormat(store.viewData?.bulan_realisasi) }} Nomor: {{ store.viewData?.nosp3b }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { dateFullFormat } from 'src/modules/formatter';
import { useSp3bStore } from 'src/stores/siasik/akuntansi/sp3b/sp3b';

const store = useSp3bStore()
</script>
<style>
.b {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  border-top: none;
}

.b_double {
  border-bottom: 4px double rgb(30, 30, 30);
  border-left: none;
  border-right: none;
  border-top: none;
  padding-top: 8px;
}

.b1 {
  border: 2px solid #000;
}

.b2 {
  border-right: 2px solid #000;
  border-left: none;
  border-bottom: none;
  border-top: none;
}

.b3 {
  border-bottom: 2px solid #000;
  border-left: none;
  border-right: none;
  border-top: none;
}

.b4 {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: none;
  border-top: none;
}

.b5 {
  border-left: 2px solid #000;
  border-right: none;
  border-bottom: none;
  border-top: none;
}
</style>
