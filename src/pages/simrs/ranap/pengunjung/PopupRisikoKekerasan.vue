<template>
  <div class="stamp-kekerasan-absolute cursor-pointer" title="Klik untuk Informasi Perlindungan Kekerasan">
    <!-- Realistic Rubber Stamp SVG Symbol -->
    <div class="stamp-container transition-hover">
      <svg width="62" height="62" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="stamp-svg">
        <!-- Outer Stamp Rings (Double Ring + Rough Edges) -->
        <circle cx="30" cy="30" r="28" stroke="#6a1b9a" stroke-width="2.2" stroke-dasharray="5 1.5" opacity="0.85" />
        <circle cx="30" cy="30" r="25" stroke="#6a1b9a" stroke-width="1.8" opacity="0.9" />

        <!-- Hand Palm / Raised Hand Icon -->
        <g stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
          <!-- Fingers -->
          <path d="M22 17V27M26 14.5V27M30 13.5V27M34 15V27M38 19V27C38 32.5 34.5 37 30 37C25.5 37 22 32.5 22 27" />
        </g>

        <!-- Horizontal Bar across Palm (Peraturan Stempel Stop) -->
        <rect x="11" y="25.5" width="38" height="4.5" rx="1" fill="#6a1b9a" opacity="0.9" />

        <!-- Bottom Curved Text "KEKERASAN" along Round Arc -->
        <path id="stampArcPath" d="M 10,30 A 20,20 0 0,0 50,30" fill="none" />
        <text font-family="'Arial Black', 'Inter', sans-serif" font-size="6.2" font-weight="900" fill="#6a1b9a" letter-spacing="0.8" opacity="0.95">
          <textPath href="#stampArcPath" startOffset="50%" text-anchor="middle">
            KEKERASAN
          </textPath>
        </text>
      </svg>
    </div>

    <!-- Popup Info Proxy Card -->
    <q-popup-proxy class="bg-purple-1" style="max-width: 330px;">
      <q-card flat bordered class="bg-purple-1 text-purple-10 shadow-3" style="border-color: #8e24aa; width: 100%;">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="icon-mat-pan_tool" color="purple-9" text-color="white" size="28px" class="q-mr-xs" />
          <div class="text-subtitle2 text-bold">✋ PERLINDUNGAN &amp; RISIKO KEKERASAN</div>
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
  </div>
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
.stamp-kekerasan-absolute {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%) rotate(-12deg);
  z-index: 5;
  pointer-events: auto;
}

.stamp-container {
  display: inline-block;
  padding: 2px;
  border-radius: 50%;
  background: rgba(243, 229, 245, 0.4);
  backdrop-filter: blur(1px);
  box-shadow: 0 2px 8px rgba(106, 27, 154, 0.15);
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: scale(1.15) rotate(0deg);
    box-shadow: 0 6px 16px rgba(106, 27, 154, 0.3);
    background: rgba(243, 229, 245, 0.8);
  }
}

.stamp-svg {
  display: block;
  filter: drop-shadow(0px 1px 1px rgba(106, 27, 154, 0.25));
}
</style>
