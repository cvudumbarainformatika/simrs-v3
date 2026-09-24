<template>
  <div class="fit column flex-center bg-grey-2">
    <app-maintenance text="Formulir Klaim Rawat Inap sedang dalam proses pengembangan" />
  </div>
</template>

<script setup>
defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
</script>
