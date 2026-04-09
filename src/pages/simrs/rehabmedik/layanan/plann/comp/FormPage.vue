<template>
  <q-card class="fit ">
    <q-form class="fit column" @submit="onSubmit" @reset="onReset">
      <q-card-section class="col-auto">
        <div class="column">
          <div class="text-bold"> Plann & Kondisi Akhir</div>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="col full-height scroll-y">
        <div class="row q-col-gutter-md">
          <!-- Tanggal -->
          <div class="col-12">
            <q-input v-model="form.tanggal_akhir" label="Tanggal/Waktu" outlined dense readonly>
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>

          <!-- Keadaan Akhir -->
          <div class="col-12 ">
            <q-select v-model="form.keadaan" :options="keadaanOptions" label="Keadaan Akhir *" outlined dense emit-value
              map-options :rules="[val => !!val || 'Keadaan akhir wajib dipilih']">
              <template v-slot:prepend>
                <q-icon name="health_and_safety" />
              </template>
            </q-select>
          </div>

          <!-- Poliklinik Tujuan (Muncul jika Konsultasi) -->
          <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div v-if="showPoliklinikDropdown" class="col-12">
              <q-select v-model="form.kodepolilain" :options="poliklinikOptions" label="Poliklinik Tujuan *" outlined
                dense emit-value map-options use-input input-debounce="300" @filter="filterPoliklinik" :rules="[
                  val => !!val || 'Poliklinik tujuan wajib dipilih'
                ]" :loading="loadingPoliklinik">
                <template v-slot:prepend>
                  <q-icon name="local_hospital" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Tidak ada data
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </transition>

          <!-- Info Tambahan -->
          <div class="col-12">
            <q-banner v-if="form.keadaan === 'Konsultasi'" class="bg-warning text-white rounded-borders">
              <template v-slot:avatar>
                <q-icon name="warning" color="white" />
              </template>
              Pasien akan dibuatkan nomor registrasi baru untuk konsultasi ke poliklinik tujuan.
            </q-banner>

            <q-banner v-if="form.keadaan === 'Melanjutkan Program Di Fisioterapi'"
              class="bg-info text-white rounded-borders">
              <template v-slot:avatar>
                <q-icon name="info" color="white" />
              </template>
              Pasien akan ditandai dengan flag fisioterapi aktif.
            </q-banner>

            <q-banner v-if="form.keadaan === 'Kembali Ke Ruang Sebelumnya'"
              class="bg-negative text-white rounded-borders">
              <template v-slot:avatar>
                <q-icon name="exit_to_app" color="white" />
              </template>
              Flag fisioterapi pasien akan dihapus.
            </q-banner>
          </div>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="col-auto">
        <div class="row justify-between">
          <q-btn flat label="Reset" color="grey" type="reset" :disable="loading" />
          <q-btn unelevated label="Simpan Kondisi Akhir" color="primary" icon="save" type="submit" :loading="loading"
            :disable="!isFormValid" />
        </div>
      </q-card-section>
    </q-form>





    <!-- Dialog Konfirmasi -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" size="sm" />
          <span class="q-ml-sm">Konfirmasi Simpan</span>
        </q-card-section>

        <q-separator></q-separator>
        <q-card-section class="q-pa-lg">
          <div>Apakah Anda yakin ingin menyimpan kondisi akhir?</div>
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label caption>Keadaan</q-item-label>
                <q-item-label>{{ form?.keadaan }} ? </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="form.keadaan === 'Konsultasi'">
              <q-item-section>
                <q-item-label caption>Poli Tujuan</q-item-label>
                <q-item-label>{{ store.getNamaPoliklinik(form.kodepolilain) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn unelevated label="Ya, Simpan" color="primary" @click="confirmSave" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { api } from 'src/boot/axios'
import { notifSuccessVue } from 'src/modules/utils'
import { useRehabmedikPlannStore } from 'src/stores/simrs/pelayanan/rehabmedik/plann'
import { useQuasar } from 'quasar'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  user: {
    type: Object,
    default: null
  },
  storeKunjungan: {
    type: Object,
    default: null
  },
  isDokter: {
    type: Boolean,
    default: false
  }
})

const store = useRehabmedikPlannStore()

const formatTanggal = (date) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// const loading = ref(false)
const loadingPoliklinik = ref(false)
const showConfirmDialog = ref(false)
const poliklinikFiltered = ref([])

const $q = useQuasar()

console.log('pasien', props.pasien);


const form = ref({
  noreg: props.pasien.noreg,
  norm: props.pasien.norm,
  kd_akun: '',
  keadaan: null,
  kodepolilain: null,
  sistembayar: props.pasien?.kodesistembayar,
  kodepoli_asal: props.pasien.kodepoli,
  tanggal_akhir: formatTanggal(new Date())
})

const keadaanOptions = [
  {
    label: 'Melanjutkan Program Di Fisioterapi',
    value: 'Melanjutkan Program Di Fisioterapi'
  },
  {
    label: 'Kembali Ke Ruang Sebelumnya',
    value: 'Kembali Ke Ruang Sebelumnya'
  },
  {
    label: 'Konsultasi',
    value: 'Konsultasi'
  }
]

const loading = ref(false)

const showPoliklinikDropdown = computed(() => {
  return form.value.keadaan === 'Konsultasi'
})
const isFormValid = computed(() => {
  if (!form.value.keadaan) return false
  if (form.value.keadaan === 'Konsultasi' && !form.value.kodepolilain) return false
  return true
})
const poliklinikOptions = computed(() => {
  return poliklinikFiltered.value.map(p => ({
    label: p.nama,
    value: p.kode
  }))
  // console.log('poliklinikOptions', store.polikliniks);

})


const filterPoliklinik = (val, update) => {
  if (val === '') {
    update(() => {
      poliklinikFiltered.value = store.polikliniks
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    poliklinikFiltered.value = store.polikliniks?.filter(
      v => v?.nama?.toLowerCase().indexOf(needle) > -1
    )
  })
}

onMounted(() => {
  initReset(),
    Promise.all([
      store.getPoliklinik(),
    ])
})


const onSubmit = () => {
  // Validasi manual
  if (!form.value.keadaan) {
    $q.notify({
      type: 'warning',
      message: 'Keadaan akhir wajib dipilih'
    })
    return
  }

  if (form.value.keadaan === 'Konsultasi' && !form.value.kodepolilain) {
    $q.notify({
      type: 'warning',
      message: 'Poliklinik tujuan wajib dipilih'
    })
    return
  }

  // Tampilkan dialog konfirmasi
  showConfirmDialog.value = true
}


const confirmSave = async () => {
  try {
    loading.value = true
    showConfirmDialog.value = false

    const payload = {
      noreg: form.value.noreg,
      norm: form.value.norm,
      kd_akun: form.value.kd_akun,
      keadaan: form.value.keadaan,
      kodepolilain: form.value.kodepolilain,
      sistembayar: form.value.sistembayar,
      kodepoli_asal: form.value.kodepoli_asal,
      tanggal_akhir: form.value.tanggal_akhir
    }

    store.simpanPlann(payload)
  } finally {
    loading.value = false
  }
}


const initReset = () => {
  // store.setItem(null)
  form.value = {
    noreg: props.pasien.noreg,
    norm: props.pasien.norm,
    kd_akun: '',
    keadaan: null,
    kodepolilain: null,
    sistembayar: props.pasien.kodesistembayar,
    kodepoli_asal: props.pasien.kodepoli,
    tanggal_akhir: formatTanggal(new Date())
  }
}

const onReset = () => {
  initReset()
}

watch(() => store.item, (obj) => {
  console.log('obj watch store item', obj);

  if (obj) {
    form.value = {
      ...obj
    }
  }
}, { deep: true })
</script>