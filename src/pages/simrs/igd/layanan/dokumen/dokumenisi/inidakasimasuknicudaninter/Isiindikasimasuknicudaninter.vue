<template>
  Pasien yang membutuhkan perawatan NICU adalah semua bayi yang memerlukan monitor/observasi ketat : <br>
  <br>
  <div v-for="(item, n) in isi" :key="n">
    - {{ item }}
  </div>
  <br>
  <div>
    Keterangan : {{ store?.isiindikasimasuknicu?.planranap?.keterangan }}
  </div>
</template>
<script setup>
import { usePlannStore } from 'src/stores/simrs/igd/plann';

const store = usePlannStore();
const isi = store?.isiindikasimasuknicu?.planranap?.dokumentransfer?.isi ? JSON.parse(store?.isiindikasimasuknicu?.planranap?.dokumentransfer?.isi) : '-'
</script>
