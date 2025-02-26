<template>
  Pasien yang membutuhkan perawatan NICU adalah semua bayi yang memerlukan monitor/observasi ketat : <br>
  <br>
  {{ store?.isiindikasimasuknicuinter }}
</template>
<script setup>
import { usePlannStore } from 'src/stores/simrs/igd/plann';

const store = usePlannStore();
</script>
