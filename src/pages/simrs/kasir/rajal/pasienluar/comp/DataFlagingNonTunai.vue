<template>
  <q-form ref="refForm" class=" bg-grey-1 q-pa-sm" style="display: flex; flex-direction: column;">
    <q-card class="rounded-borders shadow-2" style="height: 610px; display: flex; flex-direction: column;">
      <!-- Header -->
      <div class="row q-ma-sm">
        <div class="col-12">
          <div
            class="full-width bg-grey-8 text-white text-weight-bold flex items-center justify-center q-px-md q-py-sm rounded-b-xl shadow-2 relative-position"
            style="height: 35px;">
            <span>Flaging Non Tunai</span>

            <!-- Tombol di kanan -->
            <q-btn class="absolute-right q-mr-sm" unelevated color="orange" flat size="sm" padding="xs"
              icon="icon-mat-refresh" @click="storekunjungan.getKwitansinontunai(props.pasien?.noreg)">
              <q-tooltip class="primary" :offset="[10, 10]">
                Refresh Data
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <q-scroll-area ref="scrollRef" class="full-height " @scroll="onScroll">
        <div v-if="store.loadingbayar || storekunjungan.loading" class="row items-center justify-center"
          style="height: 100%;">
          <q-spinner-facebook color="blue" size="64px" />
        </div>
        <div
          v-else-if="props?.kwitansinontunai.length === 0 && store.loadingbayar === false || props?.kwitansinontunai.length === 0 && storekunjungan.loading === false"
          class="row items-center justify-center" style="height: 100%;">
          <div class="text-h3 q-mb-md">
            🏷️
          </div>
          <div class="f-14">
            Belum Ada Data Pembayaran Flaging
          </div>
        </div>
        <div v-else style="flex: 1; overflow-y: auto; padding-bottom: 12px;">
          <q-list separator>
            <transition-group name="fade-slide" tag="div" class="column items-center">
              <div v-for="(item, q) in props?.kwitansinontunai" :key="q"
                class="q-pl-sm q-pr-sm q-pb-xs full-width flex flex-center">
                <q-list bordered class="rounded-borders shadow-2 bg-white kwitansi-card"
                  style="max-width: 900px; width: 100%;">
                  <q-item>
                    <q-item-section>
                      <q-item-label lines="1" class="text-body1">
                        <span class="text-weight-medium">
                          {{ item?.billNumber }} || {{ item?.pjsp }}
                        </span>
                        <span class="text-grey-8"> - {{ item?.nama }} </span>
                      </q-item-label>

                      <q-item-label caption lines="1">
                        {{ item?.invoice_number }} || {{ item?.core_reference }}
                      </q-item-label>

                      <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                        <span class="cursor-pointer">
                          {{ formatRpDouble(item?.amount) }}
                        </span>
                        ||
                        <q-badge outline color="teal" class="q-ml-xs">
                          {{ item?.rs22 !== '' ? 'Q-ris' : 'Virtual Account' }}
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
                        <q-btn flat round dense size="sm" icon="icon-mat-delete" color="red" @click="batal(item)" />
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
        <span v-if="store.loadingbayar === false">{{ formatRpDouble() }} </span>
        <span v-else="store.loadingbayar === true"><q-spinner-facebook /></span>
      </div>
    </q-card>
  </q-form>
</template>
<script setup>
import { formatRpDouble, humanDate } from 'src/modules/formatter';
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan';
import { usePembayaranKasirRajalStore } from 'src/stores/simrs/kasir/rajal/pembayaran';
import { ref } from 'vue';


const refForm = ref(null)
const store = usePembayaranKasirRajalStore()
const storekunjungan = useKasirRajalListKunjunganStore()

const props = defineProps({
  kwitansinontunai: {
    type: Array,
    default: () => []
  },
  pasien: { type: Object, default: () => { } },
})

function onScroll(info) {
  const { verticalPosition, verticalSize, verticalContainerSize } = info

  // Detect when scroll reaches bottom
  if (verticalPosition + verticalContainerSize >= verticalSize - 100) {
    // Trigger load more data here if needed
    console.log('Reached bottom of scroll')
  }
}

</script>
<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.kwitansi-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kwitansi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
}
</style>
