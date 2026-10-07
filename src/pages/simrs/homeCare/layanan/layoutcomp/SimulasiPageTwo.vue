<template>
  <q-card flat square bordered class="homecare-bill-preview" dark>
    <q-bar class="col-auto bg-black text-white">
      <div class="f-12 q-pa-xs">Tagihan Homecare (Preview)</div>
      <q-space />
      <q-btn
        flat
        dense
        round
        size="sm"
        :loading="loading"
        :disable="!pasien?.noreg"
        icon="icon-mat-refresh"
        @click="muatTagihan"
      >
        <q-tooltip>Muat ulang tagihan</q-tooltip>
      </q-btn>
    </q-bar>

    <div class="homecare-bill-preview__content">
      <div v-if="error" class="q-pa-sm text-negative text-caption">
        {{ error }}
        <q-btn flat dense color="negative" label="Coba lagi" @click="muatTagihan" />
      </div>
      <div v-else-if="loading && !rincian.length" class="row justify-center q-pa-md">
        <q-spinner color="primary" size="24px" />
      </div>
      <div v-else-if="!pasien?.noreg" class="q-pa-sm text-grey-5 text-caption">
        Pilih pasien untuk melihat tagihan.
      </div>
      <div v-else>
        <div class="homecare-bill-preview__total bg-primary text-white">
          <div class="text-caption text-weight-bold">Total Tagihan</div>
          <div class="f-14 text-weight-bold">{{ formatRp(totalTagihan) }}</div>
        </div>
        <div
          v-for="item in rincian"
          :key="item.nama"
          class="homecare-bill-preview__row text-caption"
        >
          <span>{{ item.nama }}</span>
          <span class="text-orange text-weight-bold">{{ formatRp(item.nominal) }}</span>
        </div>
        <div v-if="!rincian.length && !loading" class="q-pa-sm text-grey-5 text-caption">
          Belum ada rincian tagihan.
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { formatRp } from 'src/modules/formatter'
import { useKasirHomecareStore } from 'src/stores/simrs/kasir/homecare/homecare'

const store = useKasirHomecareStore()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const rincian = ref([])
const totalTagihan = ref(0)
const loading = ref(false)
const error = ref('')
let requestId = 0

watch(
  () => [
    props.pasien?.noreg,
    props.pasien?.tindakan,
    props.pasien?.laborats,
    props.pasien?.fisio,
    props.pasien?.newapotekrajal
  ],
  muatTagihan,
  { deep: true, immediate: true }
)

async function muatTagihan () {
  const currentRequest = ++requestId
  const noreg = props.pasien?.noreg
  error.value = ''

  if (!noreg) {
    rincian.value = []
    totalTagihan.value = 0
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await store.fetchRincianPembayaran(noreg)
    if (currentRequest !== requestId) return
    rincian.value = response.data?.data ?? []
    totalTagihan.value = Number(response.data?.total ?? 0)
  } catch (err) {
    if (currentRequest !== requestId) return
    error.value = err.response?.data?.message || 'Rincian tagihan Homecare gagal dimuat.'
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.homecare-bill-preview {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  &__content {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    min-width: 0;
    padding: 5px 8px;
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 5px 8px;
  }
}
</style>
