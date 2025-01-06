<template>
  <div>
    Tempat List
  </div>
</template>

<script setup>
defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  nakes: {
    type: Object,
    default: null
  },
  items: {
    type: Array,
    default: null
  }
})
</script>