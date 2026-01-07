<template>
  <div>
    <div class="q-pb-xl">
      <ListLoading v-if="loading" />
      <empty-data v-else-if="!items?.length && !loading" />
      <q-list v-else separator>
        <q-item v-for="(item, i) in items" :key="i">
          <!-- <pre>{{ item }}</pre> -->
          <q-item-section class="q-col-gutter-xs">
            <q-item-label>
              NO. Nota : <span class="text-negative text-weight-bold">{{ item?.nota }}</span>
            </q-item-label>
            <q-item-label>
              Nama : <span class="text-weight-bold">{{ item?.nama ?? '-' }}</span>
            </q-item-label>
            <q-item-label>
              Tanggal : <span class="text-teal text-weight-bold"> {{ humanDate(item?.tgl) }}</span>
            </q-item-label>
            <q-item-label>
              Jenis Layanan : <span class="text-teal text-weight-bold"> {{ item?.jenislayanan }}</span>
            </q-item-label>
          </q-item-section>
          <q-separator vertical class="q-mx-md" />
          <q-item-section class="q-col-gutter-xs">
            <q-item-label class="text-weight-bold">
              Total Nota : <span class="text-weight-bold"><q-badge color="red"> {{ formatRpDouble(item?.subtotal) ??
                '-'
                  }}</q-badge></span>
            </q-item-label>
            <!-- <q-item-label>
              Tanggal Bayar : <span class="text-teal text-weight-bold"> {{ humanDate(item?.tglx) ??
                '-' }}</span>
            </q-item-label> -->
            <!-- <div v-for="value in item?.kwitansi" :key="value">
              <q-badge outline color="primary">
                {{ value?.nokwitansi }} || {{ dateFullFormat(value?.tglx)
                }}
              </q-badge>
            </div> -->
          </q-item-section>
          <q-item-section side>

            <q-btn dense size="sm" no-caps color="red" label="Buka" class="q-mb-sm" style="min-width: 100px;"
              :loading="item?.loadingbayar" @click="bukax(item)" />

          </q-item-section>
        </q-item>
      </q-list>
      <app-fullscreen-blue v-model="billOpen" @close="store.notas = {}">
        <template #default>
          <!-- <BillingPage :pasien="pasien" @print="openPrint($event)" @rekap="openFaktur" @nota="getNota" /> -->
          <FormPembayaran :pasien="pasien" :getKwitansiTerbayar="store.kwitansiterbayar" />
        </template>
      </app-fullscreen-blue>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// eslint-disable-next-line no-unused-vars
// import BillingPage from './BillingPage.vue'
import ListLoading from './ListLoading.vue'
import EmptyData from './EmptyData.vue'
import FormPembayaran from './FormPembayaran.vue'
import { dateFullFormat, formatRpDouble, humanDate } from 'src/modules/formatter'
import { usePasienLuarStore } from 'src/stores/simrs/kasir/pasienluar'

const store = usePasienLuarStore()
const emits = defineEmits(['buka', 'batal'])
const pasien = ref(null)
const billOpen = ref(false)
function bukax(val) {
  billOpen.value = true
  pasien.value = val
  store.getparams.noreg = val?.noreg
  // store.getKwitansinontunai()
  store.getKwitansiTerbayar()
}

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingTerima: {
    type: Boolean,
    default: false
  },
  loadingCall: {
    type: Boolean,
    default: false
  },
  loadingTidakhadir: {
    type: Boolean,
    default: false
  },
  loadingcesmix: {
    type: Boolean,
    default: false
  }
})

</script>
