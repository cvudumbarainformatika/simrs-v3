<template>
  <div class="full-height q-pa-sm">
    <div class="row q-col-gutter-x-xs full-height">
      <div class="col-8 full-height">
        <FormPage ref="refForm" :key="pasien" :pasien="pasien" />
      </div>
      <div class="col-4 full-height">
        <ListPage :key="pasien" :pasien="pasien" @assign-form="assign" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineAsyncComponent, ref } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const FormPage = defineAsyncComponent(() => import('./tindakanOp/FormTindakanOperasi.vue'))
const ListPage = defineAsyncComponent(() => import('./tindakanOp/ListTindakanOperasi.vue'))
const refForm = ref(null)
function assign (data) {
  refForm.value?.setTindakan(data)
  // console.log('assign', data)

}

</script>
