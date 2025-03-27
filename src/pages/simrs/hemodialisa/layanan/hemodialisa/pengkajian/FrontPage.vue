<template>
  <div class="bg-red row q-col-gutter-x-xs" style="height: calc(100vh - 95px);">
    pengkajian
  </div>
</template>
<script setup>
defineProps({
  pasien: {
    type: Object,
    default: () => null
  }
})
</script>
