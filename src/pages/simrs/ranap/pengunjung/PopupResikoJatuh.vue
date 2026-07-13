<template>
  <span class="blink-dot-yellow vertical-middle">
    <q-popup-proxy class="bg-yellow-1" style="max-width: 350px;">
      <q-card flat bordered class="bg-yellow-1 text-yellow-10" style="border-color: #fbc02d;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2 text-bold">⚠️ PENILAIAN RISIKO JATUH</div>
        </q-card-section>
        
        <q-card-section class="q-pt-sm">
          <div v-for="(item, idx) in parsedResiko" :key="idx" class="q-mb-md">
            <div class="text-caption text-grey-8 text-bold">Penilaian #{{ idx + 1 }}</div>
            <q-list dense separator class="text-caption q-mt-xs">
              <q-item v-for="(det, dIdx) in item.details" :key="dIdx" class="q-px-none">
                <q-item-section>
                  <div class="text-bold text-dark">{{ det.nama }}</div>
                  <div class="text-grey-9">
                    Skor: <span class="text-bold text-primary">{{ det.skor }}</span> | 
                    Kategori: <span class="text-bold text-negative">{{ det.label }}</span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resikoJatuh: {
    type: Array,
    default: () => []
  }
})

const getDetailResiko = (res) => {
  const details = []
  
  if (res.morse_fall) {
    const morse = res.morse_fall
    const skor = morse?.skorMorse?.skor ?? morse?.skor ?? '-'
    const label = morse?.skorMorse?.label ?? morse?.label ?? '-'
    details.push({
      nama: 'Morse Fall (Dewasa)',
      skor,
      label
    })
  }
  
  if (res.humpty_dumpty) {
    const humpty = res.humpty_dumpty
    const skor = humpty?.skorHumpty?.skor ?? humpty?.skor?.skor ?? humpty?.skor ?? '-'
    const label = humpty?.skorHumpty?.label ?? humpty?.skor?.label ?? humpty?.label ?? '-'
    details.push({
      nama: 'Humpty Dumpty (Anak)',
      skor,
      label
    })
  }
  
  if (res.ontario) {
    const ontario = res.ontario
    const skor = ontario?.skorOntario?.skor ?? ontario?.skor ?? '-'
    const label = ontario?.skorOntario?.label ?? ontario?.label ?? '-'
    details.push({
      nama: 'Ontario (Geriatri)',
      skor,
      label
    })
  }
  
  return details
}

const parsedResiko = computed(() => {
  return props.resikoJatuh.map(item => ({
    id: item.id,
    details: getDetailResiko(item)
  })).filter(x => x.details.length > 0)
})
</script>

<style lang="scss" scoped>
.blink-dot-yellow {
  width: 14px;
  height: 14px;
  background-color: #fbc02d;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 0 0 0 rgba(251, 192, 45, 0.7);
  animation: pulse-yellow 1.5s infinite;
}

@keyframes pulse-yellow {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(251, 192, 45, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(251, 192, 45, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(251, 192, 45, 0);
  }
}
</style>
