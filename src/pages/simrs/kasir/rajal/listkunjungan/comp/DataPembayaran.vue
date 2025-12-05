<template>
  <q-form ref="refForm" class=" bg-grey-1 q-pa-sm" style="display: flex; flex-direction: column;">
    <q-card class="rounded-borders shadow-2" style="height: 610px; display: flex; flex-direction: column;">
      <!-- Header -->
      <div class="row q-ma-sm">
        <div class="col-12">
          <div
            class="full-width bg-grey-8 text-white text-weight-bold flex items-center justify-center q-px-md q-py-sm rounded-b-xl shadow-2 relative-position"
            style="height: 35px;">
            <span>Detail Pembayaran</span>

            <!-- Tombol di kanan -->
            <q-btn class="absolute-right q-mr-sm" unelevated color="orange" flat size="sm" padding="xs"
              icon="icon-mat-refresh" @click="refreshdatapembayaran(prop.pasien?.noreg)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Refresh Data
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <q-scroll-area ref="scrollRef" class="full-height " @scroll="onScroll">
        <div v-if="store.loading" class="row items-center justify-center" style="height: 100%;">
          <q-spinner-facebook color="blue" size="64px" />
        </div>
        <div
          v-else-if="prop?.getKwitansiTerbayar.length === 0 && store.loading === false || prop?.getKwitansiTerbayar.length === 0 && store.loading === false"
          class="row items-center justify-center" style="height: 100%;">
          <div class="text-h3 q-mb-md">
            🏷️
          </div>
          <div class="f-14">
            Belum Ada Data Pembayaran
          </div>
        </div>
        <div v-else style="flex: 1; overflow-y: auto; padding-bottom: 12px;">
          <q-list separator>
            <transition-group name="fade-slide" tag="div" class="column items-center">
              <div v-for="(item, q) in prop?.getKwitansiTerbayar" :key="q"
                class="q-pl-sm q-pr-sm q-pb-xs full-width flex flex-center">
                <q-list bordered class="rounded-borders shadow-2 bg-white kwitansi-card"
                  style="max-width: 900px; width: 100%;">
                  <q-item>
                    <q-item-section>
                      <q-item-label lines="1" class="text-body1">
                        <span class="text-weight-medium">
                          {{ item?.nota }}
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

                    <q-item-section side top>
                      <div v-if="item.batal === '1'" class="q-gutter-xs">
                        <q-badge color="red" class="text-white text-weight-bold">
                          BATAL
                        </q-badge>
                      </div>
                      <div v-else class="q-gutter-xs row">
                        <!-- <q-btn flat round dense size="sm" icon="icon-mat-print" color="primary" /> -->
                        <q-btn flat round dense size="sm" icon="icon-mat-delete" color="red" @click="batal(item)"
                          :loading="store.loadingbatalkwitansi === item.nota" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </transition-group>
          </q-list>
        </div>
      </q-scroll-area>
      <div
        class="bg-grey-8 text-white text-weight-bold flex items-center justify-between q-px-md q-py-sm rounded-b-xl shadow-2"
        style="height: 40px; margin-top: auto;">
        <span>Total :</span>
        <span v-if="store.loading === false">{{ formatRpDouble(total) }} </span>
        <span v-else="store.loading === true"><q-spinner-facebook /></span>
      </div>
    </q-card>
  </q-form>
</template>
<script setup>
import { computed, ref } from 'vue'
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

const refreshdatapembayaran = (val) => {
  store.getKwitansiTerbayar(val)
}

const total = computed(() => {
  return prop?.getKwitansiTerbayar
    ?.filter(x => x.batal !== '1')               // hanya yang tidak batal
    .reduce((acc, cur) => acc + Number(cur.total), 0) ?? 0
})

function batal(val) {
  store.batalkwitansi(val)
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
