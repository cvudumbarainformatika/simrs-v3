<template>
  <BaseLayout :pasien="props.pasien" :kasus="props.kasus" :nakes="props.nakes" :split="40"
    title-before="JASA KEPERAWATAN" title-after="LIST JS KEPERAWATAN">
    <template #form>
      <!-- <FormKonsul :pasien="props.pasien" :kasus="props.kasus" /> -->
    </template>
    <template #list>
      <div class="fit">
        <!-- <ListKonsul v-if="!isDetail" :pasien="props.pasien" :auth="user" @detail="lihatDetail" />
        <DetailForm v-else :item="detail" :auth="user" :pasien="props.pasien" @to-list="isDetail = false" /> -->
      </div>
    </template>
  </BaseLayout>
</template>


<script setup>

import BaseLayout from 'src/pages/simrs/ranap/layanan/components/BaseLayout.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  nakes: {
    type: String,
    default: null
  }
})
</script>