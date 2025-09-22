<template>
  <q-card class="rounded-borders shadow-2" style="height: 530px; display: flex; flex-direction: column;">
    <div class="full-height full-width bg-grey-1 q-pa-xs">
      <div class="row q-ma-sm">
        <div class="col-12">
          <div
            class="full-width bg-grey-8 text-white text-weight-bold flex items-center justify-center q-px-md q-py-sm rounded-b-xl shadow-2"
            style="height: 35px;">
            <span>Detail Pembayaran</span>
          </div>
        </div>
      </div>

      <q-scroll-area ref="scrollRef" class="full-height " @scroll="onScroll">
        <q-list separator>
          <transition-group name="fade-slide" tag="div" class="column items-center">
            <div v-for="(item, i) in prop?.getKwitansiTerbayar" :key="i" class="q-pa-sm full-width flex flex-center">
              <q-list bordered class="rounded-borders shadow-2 bg-white kwitansi-card"
                style="max-width: 900px; width: 100%;">
                <q-item-label header class="text-primary text-weight-bold">
                  {{ item?.nota }}
                </q-item-label>

                <q-item>
                  <!-- Info Pasien -->
                  <q-item-section>
                    <q-item-label lines="1" class="text-body1">
                      <span class="text-weight-medium">
                        [ {{ item?.noreg }} || {{ item?.norm }} ]
                      </span>
                      <span class="text-grey-8"> - {{ item?.nama }} </span>
                    </q-item-label>

                    <q-item-label caption lines="1">
                      {{ item?.tgl_pembayaran }} || {{ item?.batal }}
                    </q-item-label>

                    <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                      <span class="cursor-pointer">
                        {{ formatRpDouble(item?.total) }}
                      </span>
                      ||
                      <q-badge outline color="teal" class="q-ml-xs">
                        {{ item?.nota }}
                      </q-badge>
                    </q-item-label>
                  </q-item-section>

                  <!-- Aksi -->
                  <q-item-section side top>
                    <div v-if="item.batal === '1'" class="q-gutter-xs">
                      <q-badge color="red" class="text-white text-weight-bold">
                        BATAL
                      </q-badge>
                    </div>
                    <div v-else class="q-gutter-xs row">
                      <!-- <q-btn flat round dense size="sm" icon="icon-mat-print" color="primary" /> -->
                      <q-btn flat round dense size="sm" icon="icon-mat-delete" color="red" @click="batal(item)" />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </transition-group>
        </q-list>
      </q-scroll-area>
      <div
        class="bg-grey-8 text-white text-weight-bold flex items-center justify-between q-px-md q-py-sm rounded-b-xl shadow-2"
        style="height: 40px; margin-top: auto;">
        <span>Total :</span>
        <span v-if="store.loadingbayar === false">{{ formatRpDouble(totalbill) }} </span>
        <span v-else="store.loadingbayar === true"><q-spinner-facebook /></span>
      </div>
    </div>
  </q-card>
</template>
<script setup>
import { ref } from 'vue'
import { formatRpDouble } from 'src/modules/formatter'
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan'

const store = useKasirRajalListKunjunganStore()
const scrollRef = ref(null)
const prop = defineProps({
  getKwitansiTerbayar: { type: Array, default: () => [] }
})

function onScroll(info) {
  const { verticalPosition, verticalSize, verticalContainerSize } = info

  // Detect when scroll reaches bottom
  if (verticalPosition + verticalContainerSize >= verticalSize - 100) {
    // Trigger load more data here if needed
    console.log('Reached bottom of scroll')
  }
}

function batal(val) {
  console.log('batal', val)
}

const printObj = {
  id: 'printMe',
  popTitle: 'Resume Medik'

}
</script>

<style scoped>
.kwitansi-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kwitansi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
}

/* Animasi muncul list */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
