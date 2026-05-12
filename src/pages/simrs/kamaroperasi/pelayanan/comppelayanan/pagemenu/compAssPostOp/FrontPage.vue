<template>
  <div class="row fit relative-position ">
    <div>Halaman Assasement post op. ini sama dengan halaman assasement ulang di rananp. persis sama</div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})


</script>
<style lang="scss" scoped>
.q-tab {
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
