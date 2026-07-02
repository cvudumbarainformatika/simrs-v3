<template>
  <span class="blink-dot vertical-middle">
    <q-popup-proxy class="bg-red-1" style="max-width: 350px;">
      <q-card flat bordered class="bg-red-1 text-red-9" style="border-color: #ef5350;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 text-bold">⚠️ RIWAYAT ALERGI PASIEN</div>
        </q-card-section>
        
        <q-card-section class="q-pt-sm">
          <q-list dense separator class="text-caption">
            <q-item v-for="(alergi, idx) in alergis" :key="idx" class="q-px-none">
              <q-item-section>
                <div class="text-bold text-dark">{{ idx + 1 }}. {{ formatAlergi(alergi?.riwayatalergi) }}</div>
                <div class="text-grey-8">Keterangan: {{ alergi?.keteranganalergi || '-' }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </span>
</template>

<script setup>
defineProps({
  alergis: {
    type: Array,
    default: () => []
  }
})

const formatAlergi = (val) => {
  if (Array.isArray(val)) {
    return val.join(', ')
  }
  return val || '-'
}
</script>

<style lang="scss" scoped>
.blink-dot {
  width: 14px;
  height: 14px;
  background-color: #ef5350;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 0 0 0 rgba(239, 83, 80, 0.7);
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 83, 80, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(239, 83, 80, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 83, 80, 0);
  }
}
</style>
