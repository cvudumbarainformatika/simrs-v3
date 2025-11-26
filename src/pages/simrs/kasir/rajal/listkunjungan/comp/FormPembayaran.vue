<template>
  <q-page class="q-pa-md bg-grey-3">
    <q-card class="q-pa-md full-height shadow-2 rounded-borders">

      <!-- Header Info Pasien + Billing -->
      <div class="row q-col-gutter-sm items-start">

        <!-- Detail Pasien (50%) -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="shadow-2 rounded-borders q-mb-sm">
            <div class="row no-wrap items-start q-pa-sm">

              <div class="col-auto flex flex-center q-pa-xs bg-red">
                <app-avatar-pasien :key="pasien" :pasien="pasien" width="100px" height="100px"
                  style="background-color: #f44336; border-radius: 50%;" />
              </div>

              <!-- Detail Pasien -->
              <div class="col q-pl-sm q-pt-none">
                <q-card-section class="text-subtitle1 text-weight-bold text-primary q-pb-sm">
                  🧑‍⚕️ Detail Pasien
                </q-card-section>

                <q-separator style="width: 90%;" />

                <q-card-section class=" q-pa-none">
                  <div class="row q-col-gutter-md">
                    <!-- Kolom Kiri -->
                    <div class="col-6">
                      <div class="row rapat-row">
                        <div class="col-4 text-weight-bold text-grey-8">Nama</div>
                        <div class="col">{{ pasien?.nama ?? '-' }}</div>
                      </div>
                      <div class="row rapat-row">
                        <div class="col-4 text-weight-bold text-grey-8">No. RM</div>
                        <div class="col row items-center">
                          <div>{{ pasien?.norm ?? '-' }}</div>
                          <q-badge class="q-ml-sm" color="primary" outline>{{ pasien?.kelamin ?? '-' }}</q-badge>
                        </div>
                      </div>
                      <div class="row rapat-row">
                        <div class="col-4 text-weight-bold text-grey-8">No. Reg</div>
                        <div class="col">{{ pasien?.noreg ?? '-' }}</div>
                      </div>
                    </div>

                    <!-- Kolom Kanan -->
                    <div class="col-6">
                      <div class="row rapat-row">
                        <div class="col-4 text-weight-bold text-grey-8">Tgl Kunjungan</div>
                        <div class="col">{{ dateFullFormat(pasien?.tgl_kunjungan) ?? '-' }}</div>
                      </div>
                      <div class="row rapat-row">
                        <div class="col-4 text-weight-bold text-grey-8">Usia</div>
                        <div class="col">{{ pasien?.usia ?? '-' }}</div>
                      </div>
                      <div class="row rapat-row">
                        <div class="col-4 text-weight-bold text-grey-8">Poli</div>
                        <div class="col">{{ pasien?.poli ?? '-' }}</div>
                      </div>
                      <div class="row rapat-row">
                        <div class="col-4 text-weight-bold text-grey-8">DPJP</div>
                        <div class="col">{{ pasien?.dokter ?? '-' }}</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </div>

            </div>
          </q-card>
        </div>

        <!-- Billing (50%) -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="bg-white shadow-2 rounded-borders q-pa-sm full-height">
            <div class="row no-wrap items-stretch">

              <!-- Kolom QR -->
              <div class="col-auto q-pa-xs flex flex-center">

                <div class="q-mb-xs"
                  style="width: 100px; height: 110px; display: flex; justify-content: center; align-items: center;">
                  <q-spinner-ios v-if="storepembayaran.loadingbayar || storepembayaran.loadingpembayaran"
                    color=" primary" size="24px" />
                  <vue-qrcode v-else :value="qrUrl" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: {
                      dark: '#000000',
                      light: '#ffffff',
                    },
                    margin: 0
                  }" />
                </div>
              </div>

              <!-- Kolom kanan (billing + VA + tombol) -->
              <div class="col column justify-between q-pl-sm">

                <!-- Header Total Billing -->
                <q-card-section class="q-pa-none q-pb-sm">
                  <div class="row items-center justify-between">
                    <div class="text-subtitle2 text-grey-7">Total Billing</div>
                    <div v-if="storepembayaran.loadingbayar">
                      <q-spinner-facebook color="blue" size="24px" />
                    </div>
                    <div v-else class="text-h5 text-weight-bold text-negative">
                      {{ formatRpDouble(storepembayaran?.total) }}
                    </div>
                  </div>
                </q-card-section>

                <q-separator spaced />

                <!-- VA + Tombol Bayar -->
                <div class="row items-center justify-between q-mt-sm">
                  <div class="text-caption text-grey-9 bg-grey-2 q-px-sm q-py-xs rounded-borders"
                    style="font-family: monospace;"
                    v-if="storepembayaran.loadingbayar || storepembayaran.loadingpembayaran">
                    <q-spinner-facebook color="blue" size="24px" />
                  </div>
                  <div class="text-caption text-grey-9 bg-grey-2 q-px-sm q-py-xs rounded-borders"
                    style="font-family: monospace;" v-else>
                    VA: {{ storepembayaran.va }}
                  </div>
                  <div class="row items-center no-wrap">
                    <q-btn v-for="item in btnbilling" :key="item.value" flat dense no-caps glossy
                      class="btn-badge q-mr-xs" @click="billingRekap(item)">
                      <q-badge color="negative" class="q-pa-xs bill-anim">
                        {{ item.label }}
                        <q-icon name="payment" size="22px" class="q-ml-xs bill-icon" />
                      </q-badge>
                    </q-btn>
                  </div>

                </div>
              </div>
            </div>
          </q-card>
        </div>

      </div>
      <q-separator spaced />
      <!-- Content Split -->
      <div class="row q-col-gutter-md full-height">

        <!-- Form Pembayaran -->
        <div class="col-4">
          <form-pembayaran-detail :pasien="prop?.pasien" :jenislayanan="store.jenispembayaran" :billing="prop?.billing"
            :kwitansikarcis="prop?.kwitansikarcis" />
        </div>
        <!-- Data Pembayaran -->
        <div class="col-4">
          <DataFlagingNonTunai :kwitansikarcis="prop?.kwitansikarcis" :kwitansinontunai="prop?.kwitansinontunai"
            :pasien="prop?.pasien" />
        </div>
        <div class="col-4">
          <data-pembayaran :kwitansikarcis="prop?.kwitansikarcis" :getKwitansiTerbayar="prop?.getKwitansiTerbayar" />
        </div>
      </div>
    </q-card>
  </q-page>
  <q-dialog v-model="dialogBilling">
    <q-card style="width: 1000px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6 text-weight-bold text-center">{{ judul }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section style="max-height: 80vh;" class="scroll">
        <component :is="currentPage" :pasien="prop?.pasien" :btnclose="1" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat label="Decline" color="primary" v-close-popup />
        <q-btn flat label="Accept" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { dateFullFormat, formatRpDouble } from 'src/modules/formatter'
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan'

import FormPembayaranDetail from './FormPembayaranDetail.vue'
import DataPembayaran from './DataPembayaran.vue'
import { usePembayaranKasirRajalStore } from 'src/stores/simrs/kasir/rajal/pembayaran'
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'
import DataFlagingNonTunai from './DataFlagingNonTunai.vue'
import { Loading } from 'quasar'

const store = useKasirRajalListKunjunganStore()
const storepembayaran = usePembayaranKasirRajalStore()

const qrUrl = computed(() => {
  const qrvalue = storepembayaran.qrcode === '' ? '123456789' : storepembayaran.qrcode// noreg
  // const dok = 'GENERAL-CONSENT.png'
  // const asal = 'GENERAL-CONSENT'
  // const enc = btoa(`${noreg}|${dok}|${asal}`)
  return `${qrvalue}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})

const prop = defineProps({
  pasien: { type: Object, default: () => ({}) },
  billing: { type: Object, default: () => ({}) },
  kwitansikarcis: { type: Array, default: () => [] },
  kwitansinontunai: { type: Array, default: () => [] },
  getKwitansiTerbayar: { type: Array, default: () => [] }
})
const dialogBilling = ref(false)
const currentPage = shallowRef(null)
const judul = ref('')
const btnbilling = ref([
  {
    label: 'Billing Rekap',
    value: 'billingrekap',
    page: defineAsyncComponent(() =>
      import('../../../../kasir/rajal/listkunjungan/comp/CetakRekapBilling.vue')
    )
  },
  {
    label: 'Billing Detail',
    value: 'billingdetail',
    page: defineAsyncComponent(() =>
      import('../../../../dokumen/comppoli/BillingPage.vue')
    )
  }
])

function billingRekap(item) {
  console.log('billing rekap', item)
  currentPage.value = item.page
  judul.value = item.label
  console.log('current page', judul.value)
  dialogBilling.value = true
}

</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.list-rapat .q-item {
  min-height: 22px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

.billing-btn {
  background: linear-gradient(135deg, #4f8cff, #6a5af9, #8c3eff);
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: 0.25s ease;
  box-shadow: 0 2px 8px rgba(100, 70, 255, 0.4);
  border-radius: 14px;
}

.billing-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 16px rgba(120, 70, 255, 0.55);
}

.billing-btn:active {
  transform: scale(0.97);
}

.btn-badge {
  padding: 0 !important;
  min-width: auto !important;
}

/* Animasi badge pulse lembut */
.bill-anim {
  animation: pulse 1.8s infinite ease-in-out;
  cursor: pointer;
}

/* Animasi ikon blink */
.bill-icon {
  animation: iconBlink 1.2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes iconBlink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}
</style>
