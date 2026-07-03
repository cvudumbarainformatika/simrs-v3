<template>
  <span class="blink-dot-brown vertical-middle">
    <q-popup-proxy class="bg-brown-1" style="max-width: 350px;">
      <q-card flat bordered class="bg-brown-1 text-brown-10" style="border-color: #8d6e63;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 text-bold">⚠️ PASIEN NAMA SAMA / MIRIP</div>
        </q-card-section>
        
        <q-card-section class="q-pt-sm">
          <div class="text-caption text-grey-8 q-mb-xs">
            Waspada! Terdapat pasien lain dengan nama mirip di ruangan yang sama:
          </div>
          <q-list dense separator class="text-caption q-mt-xs">
            <q-item v-for="(ps, idx) in namaSamaMirip" :key="idx" class="q-px-none">
              <q-item-section>
                <div class="text-bold text-dark">{{ idx + 1 }}. {{ ps.nama }}</div>
                <div class="text-grey-9">
                  No. Bed: <span class="text-bold text-primary">{{ ps.nomorbed || '-' }}</span> | 
                  Noreg: <span class="text-grey-6">{{ ps.noreg }}</span>
                </div>
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
  namaSamaMirip: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.blink-dot-brown {
  width: 14px;
  height: 14px;
  background-color: #795548;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 0 0 0 rgba(121, 85, 72, 0.7);
  animation: pulse-brown 1.5s infinite;
}

@keyframes pulse-brown {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(121, 85, 72, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(121, 85, 72, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(121, 85, 72, 0);
  }
}
</style>
