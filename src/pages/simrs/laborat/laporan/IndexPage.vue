<template>
  <q-page padding>
    <TableComp />
  </q-page>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const TableComp = defineAsyncComponent(() => import('./comp/TableComp.vue'))
</script>
