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
        <q-btn :outline="path !== '/siasik/panjar/npkup/listbelum'" glossy size="md" color="teal" label="Create NPK"
          @click="goTo('/siasik/panjar/npkup/listbelum')" />
        <q-btn :outline="path !== '/siasik/panjar/npkup/listsudah'" glossy size="md" color="dark" label="Data NPK"
          @click="goTo('/siasik/panjar/npkup/listsudah')" />

        <!-- <q-btn
          :outline="path!=='/akuntansi/laporan/lo'"
          glossy
          push
          color="teal"
          label="LO"
          size="md"
          @click="goTo('/akuntansi/laporan/lo')"
        />
        <q-btn
          :outline="path!=='/pendaftaran/igd/kunjungan'"
          glossy
          push
          color="deep-orange"
          label="Master  Pasien"
          size="md"
          @click="goTo('/pendaftaran/igd/kunjungan')"
        /> -->
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
