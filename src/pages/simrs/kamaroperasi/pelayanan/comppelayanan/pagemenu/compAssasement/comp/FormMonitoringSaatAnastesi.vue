<template>
  <div>
    <div class="row items-center q-col-gutter-x-xs">
      <div class="col-6">
        <app-input-date :model="store.form.waktu_mulai" label="Waktu Mulai" :type-date="false" dense outlined
          @set-model="(val) => {
            store.form.waktu_mulai = val
          }" />
      </div>
      <div class="col-6">
        <app-input v-model="store.form.konversi_anastesi" label="Konversi Anastesi" :rules="[
          val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
        ]" outlined />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMonitoringSaatStore } from 'src/stores/simrs/kamaroperasi/assasement/monitoringSaat'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useMonitoringSaatStore()

</script>
