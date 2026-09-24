<template>
  <RightDrawerComp :pasien="pasien" @close="emits('close')" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const RightDrawerComp = defineAsyncComponent(() =>
  import('src/pages/simrs/penjaminan/klaim/grouping/layoutcomp/RightDrawer.vue')
)

const emits = defineEmits(['close'])
defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
</script>
