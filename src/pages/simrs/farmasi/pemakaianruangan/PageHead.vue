<template>
  <div class="row items-center justify-between title-page q-mb-md">
    <div class="flex items-center">
      <div class="icon q-mr-md">
        <q-icon
          name="icon-mat-verified_user"
          size="lg"
        />
      </div>
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
        <q-btn
          :outline="path !== '/farmasi/pemakaianruangan/pemakaian'"
          glossy
          push
          color="cyan"
          label="Rencana Pemesanan"
          size="md"
          @click="goTo('/farmasi/pemakaianruangan/pemakaian')"
        />
        <q-btn
          :outline="path !== '/farmasi/pemakaianruangan/listpemakaian'"
          glossy
          push
          color="blue"
          label="List Rencana Pemesanan"
          size="md"
          @click="goTo('/farmasi/pemakaianruangan/listpemakaian')"
        />
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

function goTo (val) {
  router.push({ path: val, replace: true })
}

</script>
