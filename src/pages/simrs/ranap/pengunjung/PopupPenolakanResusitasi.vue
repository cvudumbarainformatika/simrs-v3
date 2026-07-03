<template>
  <span class="blink-dot-purple vertical-middle">
    <q-popup-proxy class="bg-purple-1" style="max-width: 350px;">
      <q-card flat bordered class="bg-purple-1 text-purple-10" style="border-color: #ba68c8;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 text-bold">⚠️ DO NOT RESUSCITATE (DNR)</div>
        </q-card-section>
        
        <q-card-section class="q-pt-sm">
          <div class="text-caption text-grey-8 q-mb-xs">
            Waspada! Pasien ini memiliki instruksi tertulis:
          </div>
          <q-list dense separator class="text-caption q-mt-xs">
            <q-item v-for="(dnr, idx) in penolakanResusitasi" :key="idx" class="q-px-none">
              <q-item-section>
                <div class="text-bold text-negative">PENOLAKAN RESUSITASI (DNR)</div>
                <div class="text-grey-9">
                  Jenis Form: <span class="text-bold">{{ dnr.jenis }}</span> | 
                  Persetujuan: <span class="text-bold text-red">{{ dnr.setuju === 'Tidak' ? 'MENOLAK (DNR)' : dnr.setuju }}</span>
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
  penolakanResusitasi: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.blink-dot-purple {
  width: 14px;
  height: 14px;
  background-color: #9c27b0;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.7);
  animation: pulse-purple 1.5s infinite;
}

@keyframes pulse-purple {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(156, 39, 176, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(156, 39, 176, 0);
  }
}
</style>
