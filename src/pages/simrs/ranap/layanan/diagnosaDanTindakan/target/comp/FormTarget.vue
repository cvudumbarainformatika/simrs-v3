<template>
  <q-form class="fit q-pa-lg bg-grey-3 scroll" @submit="onSubmit">
    <div class="row items-center justify-between">
      <div>
        <div class="f-20 text-weight-bold text-grey-9">
          Target & Planning Terhadap Pasien
        </div>
        <div class="text-caption text-grey-7 q-my-xs">
          Form ini Khusus untuk Dokter (DPJP / Dokter Ruangan)
        </div>
      </div>

      <!-- STATUS VERIFIKASI DPJP -->
      <div v-if="hasPlanning">
        <!-- Jika diisi bukan DPJP dan belum diverif -->
        <div v-if="bukanDpjpYangIsi && !isSudahVerif" class="row items-center q-gutter-x-sm">
          <q-chip color="orange-9" text-color="white" icon="icon-mat-hourglass_empty" label="Perlu Verifikasi DPJP" />
          <q-btn
            v-if="isCurrentUserDpjp"
            :loading="loadingVerif"
            :disable="loadingVerif"
            color="positive"
            unelevated
            icon="icon-mat-verified"
            label="Verifikasi Sebagai DPJP"
            class="q-px-md text-weight-bold"
            @click="onVerifDpjp"
          />
        </div>
        <!-- Jika sudah diverif DPJP -->
        <div v-else-if="isSudahVerif" class="row items-center q-gutter-x-sm">
          <q-chip color="positive" text-color="white" icon="icon-mat-check_circle">
            Diverifikasi DPJP {{ plannData?.tgl_verif_dpjp ? '(' + plannData?.tgl_verif_dpjp + ')' : '' }}
          </q-chip>
        </div>
      </div>
    </div>

    <!-- Alert jika diisi bukan DPJP dan belum diverif -->
    <div v-if="bukanDpjpYangIsi && !isSudahVerif" class="q-my-sm">
      <q-banner dense rounded class="bg-amber-2 text-dark border-amber">
        <template #avatar>
          <q-icon name="icon-mat-warning" color="warning" />
        </template>
        <div class="text-caption">
          Planning ini diinput oleh dokter ruangan/jaga (<b>{{ plannData?.user || 'Non-DPJP' }}</b>). Memerlukan verifikasi dan validasi dari DPJP Utama: <b>{{ pasien?.dokter || '-' }}</b>.
        </div>
      </q-banner>
    </div>

    <q-separator class="q-my-md" />

    <div class="row q-col-gutter-md">
      <!-- 1. RENCANA / TARGET DOKTER -->
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders shadow-1">
          <div class="bg-primary text-white q-px-md q-py-xs text-subtitle2 text-weight-bold flex items-center">
            <q-icon name="icon-mat-flag" size="18px" class="q-mr-xs" />
            <span>1. Rencana (Target Dokter)</span>
          </div>
          <q-card-section>
            <q-input
              v-model="target"
              type="textarea"
              placeholder="Target yang ingin dicapai terhadap pasien..."
              outlined
              standout="bg-yellow-3"
              rows="6"
              :rules="[val => !!val?.length || 'Harap diisi']"
              hide-bottom-space
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- 2. INSTRUKSI / MONITORING PASIEN -->
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders shadow-1">
          <div class="bg-indigo text-white q-px-md q-py-xs text-subtitle2 text-weight-bold flex items-center">
            <q-icon name="icon-mat-monitor_heart" size="18px" class="q-mr-xs" />
            <span>2. Instruksi (Monitoring Pasien)</span>
          </div>
          <q-card-section>
            <q-input
              v-model="monitor"
              type="textarea"
              placeholder="Instruksi medis dan parameter monitoring..."
              outlined
              standout="bg-yellow-3"
              rows="6"
              :rules="[val => !!val?.length || 'Harap diisi']"
              hide-bottom-space
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- 3. PENGOBATAN / RENCANA TERAPI -->
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders shadow-1">
          <div class="bg-teal text-white q-px-md q-py-xs text-subtitle2 text-weight-bold flex items-center">
            <q-icon name="icon-mat-medication" size="18px" class="q-mr-xs" />
            <span>3. Pengobatan (Rencana Terapi)</span>
          </div>
          <q-card-section>
            <q-input
              v-model="terapi"
              type="textarea"
              placeholder="Rencana terapi / pengobatan yang diberikan..."
              outlined
              standout="bg-yellow-3"
              rows="6"
              :rules="[val => !!val?.length || 'Harap diisi']"
              hide-bottom-space
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- 4. CATATAN KIE -->
      <div class="col-12 col-md-6">
        <q-card flat class="rounded-borders shadow-1">
          <div class="bg-deep-orange text-white q-px-md q-py-xs text-subtitle2 text-weight-bold flex items-center">
            <q-icon name="icon-mat-record_voice_over" size="18px" class="q-mr-xs" />
            <span>4. Catatan KIE (Komunikasi, Informasi & Edukasi)</span>
          </div>
          <q-card-section>
            <q-input
              v-model="kie"
              type="textarea"
              placeholder="Penjelasan edukasi yang disampaikan kepada pasien / keluarga..."
              outlined
              standout="bg-yellow-3"
              rows="6"
              hide-bottom-space
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-separator class="q-my-md" />
    <div class="row justify-between items-center">
      <div class="text-caption text-grey-7">
        <span v-if="plannData?.created_at">Diinput: {{ plannData?.created_at }} oleh {{ plannData?.user || '-' }}</span>
      </div>
      <div class="row q-gutter-x-sm">
        <q-btn :loading="loading" :disable="loading" label="Simpan Planning" color="primary" class="q-px-lg text-weight-bold" type="submit" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { notifSuccessVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  },
  kasus: {
    type: Object,
    default: () => null
  },
  nakes: {
    type: String,
    default: null
  }
})

const appStore = useAplikasiStore()
const target = ref('')
const terapi = ref('')
const monitor = ref('')
const kie = ref('')
const loading = ref(false)
const loadingVerif = ref(false)

const plannData = computed(() => props.pasien?.planningdokter || null)

const currentUserPegawai = computed(() => {
  return appStore.user?.pegawai?.kdpegsimrs || appStore.user?.kdpegsimrs || appStore.user?.username || ''
})

const dpjpKdPeg = computed(() => {
  return props.pasien?.kodedokter || props.pasien?.kddokter || props.pasien?.kodedokterdpjp || ''
})

const hasPlanning = computed(() => {
  return !!(plannData.value && (plannData.value?.target || plannData.value?.terapi || plannData.value?.monitor || plannData.value?.kie))
})

const bukanDpjpYangIsi = computed(() => {
  if (!hasPlanning.value || !plannData.value?.user || !dpjpKdPeg.value) return false
  return plannData.value?.user !== dpjpKdPeg.value
})

const isSudahVerif = computed(() => {
  return !!plannData.value?.verif_dpjp
})

const isCurrentUserDpjp = computed(() => {
  if (!currentUserPegawai.value || !dpjpKdPeg.value) return false
  return currentUserPegawai.value === dpjpKdPeg.value
})

function initData() {
  const plann = props?.pasien?.planningdokter
  if (plann) {
    target.value = plann?.target || ''
    terapi.value = plann?.terapi || ''
    monitor.value = plann?.monitor || ''
    kie.value = plann?.kie || ''
  } else {
    target.value = ''
    terapi.value = ''
    monitor.value = ''
    kie.value = ''
  }
}

onMounted(() => {
  initData()
})

watch(() => props.pasien?.planningdokter, () => {
  initData()
}, { deep: true })

const onSubmit = async () => {
  loading.value = true
  try {
    const form = {
      id: props.pasien?.planningdokter?.id || null,
      noreg: props?.pasien?.noreg,
      norm: props?.pasien?.norm,
      target: target.value,
      terapi: terapi.value,
      monitor: monitor.value,
      kie: kie.value,
      kdruang: props?.pasien?.kdruangan
    }

    const resp = await api.post('v1/simrs/ranap/layanan/target/simpan', form)

    if (resp.status === 200) {
      const pengunjung = usePengunjungRanapStore()
      const findPasien = pengunjung?.pasiens.filter(x => x?.noreg === props?.pasien?.noreg)
      if (findPasien?.length) {
        findPasien[0].planningdokter = resp?.data
      }
      if (props.pasien) {
        props.pasien.planningdokter = resp?.data
      }

      loading.value = false
      notifSuccessVue('Data planning sukses tersimpan')
    } else {
      loading.value = false
    }
  } catch (error) {
    loading.value = false
    console.error(error)
  }
}

const onVerifDpjp = async () => {
  if (!props.pasien?.planningdokter?.id) return
  loadingVerif.value = true
  try {
    const resp = await api.post('v1/simrs/ranap/layanan/target/verif', {
      id: props.pasien?.planningdokter?.id
    })
    if (resp.status === 200) {
      const pengunjung = usePengunjungRanapStore()
      const findPasien = pengunjung?.pasiens.filter(x => x?.noreg === props?.pasien?.noreg)
      if (findPasien?.length) {
        findPasien[0].planningdokter = resp?.data
      }
      if (props.pasien) {
        props.pasien.planningdokter = resp?.data
      }
      notifSuccessVue('Planning berhasil diverifikasi oleh DPJP')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingVerif.value = false
  }
}
</script>
