<template>
  <span class="blink-dot-sky vertical-middle">
    <q-popup-proxy class="bg-light-blue-1" style="width: 260px; max-width: 260px;">
      <q-card flat bordered class="bg-light-blue-1 text-light-blue-10" style="border-color: #29b6f6; width: 100%;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 text-bold">ℹ️ INFORMASI MPP</div>
        </q-card-section>
        
        <q-card-section class="q-pt-sm">
          <div class="text-caption text-grey-9 text-bold">
            Pasien ini merupakan PASIEN MPP.
          </div>
          <div class="text-caption text-grey-8 q-mt-xs">
            Berdasarkan hasil skrining terbaru, pasien memenuhi 3 atau lebih kriteria Manajemen Pelayanan Pasien (MPP).
          </div>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </span>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.blink-dot-sky {
  width: 14px;
  height: 14px;
  background-color: #0288d1;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 0 0 0 rgba(2, 136, 209, 0.7);
  animation: pulse-sky 1.5s infinite;
}

@keyframes pulse-sky {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(2, 136, 209, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(2, 136, 209, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(2, 136, 209, 0);
  }
}
</style>
