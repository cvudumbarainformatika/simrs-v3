<template>
  <div class="row fit" style="min-height: 600px;">
    <div class="col fit">
      <div class="full-height row q-col-gutter-x-xs">
        <div class=" full-height col-8">
          kiri
        </div>
        <div class="full-height col-4">kanam</div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
</script>
