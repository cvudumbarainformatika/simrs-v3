<template>
  <span class="stamp-kekerasan-wrapper vertical-middle cursor-pointer" title="Risiko & Perlindungan Kekerasan">
    <!-- Symbol Stempel Stop Kekerasan -->
    <div class="stamp-circle flex flex-center shadow-1">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Stamp Outer Ring -->
        <circle cx="12" cy="12" r="10.5" stroke="#6a1b9a" stroke-width="1.6" stroke-dasharray="3 1" />
        <circle cx="12" cy="12" r="9" stroke="#6a1b9a" stroke-width="1.2" />
        <!-- Hand Palm / Stop Hand -->
        <path d="M12 6V11M10 7V11M14 7V11M8 8.5V11.5C8 13.7 9.8 15.5 12 15.5C14.2 15.5 16 13.7 16 11.5V9.5" stroke="#6a1b9a" stroke-width="1.3" stroke-linecap="round" />
        <!-- Horizontal Bar across hand -->
        <line x1="4.5" y1="11.5" x2="19.5" y2="11.5" stroke="#6a1b9a" stroke-width="1.5" />
      </svg>
    </div>

    <!-- Popup Info Criteria -->
    <q-popup-proxy class="bg-purple-1" style="max-width: 320px;">
      <q-card flat bordered class="bg-purple-1 text-purple-10" style="border-color: #8e24aa; width: 100%;">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="icon-mat-pan_tool" color="purple-9" text-color="white" size="26px" class="q-mr-xs" />
          <div class="text-subtitle2 text-bold">✋ PERLINDUNGAN KEKERASAN</div>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-caption text-bold text-purple-10 q-mb-xs">
            Pasien Teridentifikasi Memerlukan Perlindungan Khusus Terhadap Kekerasan.
          </div>

          <div v-if="kriteriaKekerasan && kriteriaKekerasan.length > 0">
            <div class="text-caption text-grey-8 q-mb-xs text-weight-medium">
              Kriteria Terpenuhi:
            </div>
            <q-list dense class="q-mt-xs">
              <q-item v-for="(kriteria, idx) in kriteriaKekerasan" :key="idx" class="q-px-none q-py-xs">
                <q-item-section avatar style="min-width: 20px;">
                  <q-icon name="icon-mat-check_circle" color="purple-8" size="16px" />
                </q-item-section>
                <q-item-section>
                  <div class="text-caption text-bold text-purple-9">{{ kriteria }}</div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else class="text-caption text-grey-7">
            Teridentifikasi berisiko kekerasan berdasarkan skrining awal pasien.
          </div>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </span>
</template>

<script setup>
defineProps({
  kriteriaKekerasan: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.stamp-kekerasan-wrapper {
  display: inline-block;
  vertical-align: middle;
}

.stamp-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #f3e5f5;
  border: 1px solid #8e24aa;
  transition: all 0.2s ease-in-out;
  animation: pulse-stamp 1.8s infinite;

  &:hover {
    transform: scale(1.15);
    background-color: #e1bee7;
  }
}

@keyframes pulse-stamp {
  0% {
    box-shadow: 0 0 0 0 rgba(142, 36, 170, 0.6);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(142, 36, 170, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(142, 36, 170, 0);
  }
}
</style>
