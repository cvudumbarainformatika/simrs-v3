<template>
  <div class="row items-center justify-between title-page q-mb-md">
    <div class="flex items-center">
      <!-- <div class="q-mr-md">
        <div class="f-16 text-weight-bold">
          Laporan AKUNTANSI
        </div>
      </div> -->
      <div class="left">
        <div class="text-h6">
          {{ title }}
        </div>
        <div class="f-12">
          <span>{{ subtitle }}</span>
        </div>
      </div>
    </div>

    <div class="row items-center">
      <q-btn-group outline>
        <q-btn :outline="path !== '/siasik/ls/kontrak/form'" glossy size="md" color="teal"
          label="Form Kontrak Pekerjaan" @click="goTo('/siasik/ls/kontrak/form')" />
        <q-btn :outline="path !== '/siasik/ls/kontrak/list'" glossy size="md" color="dark"
          label="List Kontrak Pekerjaan" @click="goTo('/siasik/ls/kontrak/list')" />
      </q-btn-group>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// const emits = defineEmits(['togleDraw'])
defineProps({
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  path: {
    type: String,
    default: null
  }
})

function goTo(val) {
  console.log('sasa', val)
  router.push({ path: val, replace: true })
}

</script>
