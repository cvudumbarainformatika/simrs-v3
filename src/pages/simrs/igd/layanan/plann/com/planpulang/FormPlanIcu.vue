<template>
  <q-dialog v-model="store.fixedicu" persistent maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="bg-grey-2 column" style="height:100vh;">
      <!-- HEADER -->
      <q-bar class="bg-primary text-white">
        <q-icon name="medical_services" />

        <div class="text-weight-bold">
          Kriteria Pasien Masuk ICU
        </div>

        <q-space />

        <q-btn dense flat round icon="close" @click="tutupDialog" />
      </q-bar>

      <!-- INFORMASI -->
      <q-card-section class="bg-white q-pa-md">
        <div class="text-h6 text-primary text-weight-bold">
          Kriteria Pasien Masuk ICU
        </div>

        <div class="text-caption text-grey-7 q-mt-xs">
          Pilih satu atau lebih indikasi pasien masuk ICU.
        </div>
      </q-card-section>

      <q-separator />

      <!-- ISI KRITERIA -->
      <q-card-section class="col scroll q-pa-md">
        <div v-for="kategori in kriteriaIcu" :key="kategori.kode" class="q-mb-md">
          <q-card flat bordered class="bg-white">
            <q-card-section class="q-pa-md">
              <div class="row items-center q-mb-sm">
                <q-avatar size="34px" color="primary" text-color="white" class="q-mr-sm">
                  {{ kategori.kode }}
                </q-avatar>

                <div class="text-subtitle1 text-weight-bold text-primary">
                  {{ kategori.nama }}
                </div>
              </div>

              <q-separator class="q-mb-sm" />

              <div v-for="(item, index) in kategori.items" :key="`${kategori.kode}-${index}`"
                class="row no-wrap items-start q-py-xs">
                <div class="text-caption text-grey-7 q-mr-sm q-pt-xs">
                  {{ index + 1 }}.
                </div>

                <q-checkbox v-model="store.form.isi" :val="`${kategori.kode} | ${kategori.nama} | ${item}`"
                  :label="item" color="primary" keep-color class="col" />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <q-select label="Dokter Penerima" :options="options" v-model="store.form.dokterpenerima" outlined dense
          option-label="nama" option-value="kdpegsimrs" clearable use-input @filter="filterOptions" emit-value
          map-options lazy-rules :rules="[
            val => !!val || 'Dokter penerima wajib dipilih'
          ]" />
      </q-card-section>

      <q-separator />

      <!-- ACTION -->
      <q-card-actions align="right" class="bg-white q-pa-md">
        <div class="text-caption text-grey-7 q-mr-auto">
          Terpilih: {{ store.form.isi?.length || 0 }} kriteria
        </div>

        <q-btn unelevated label="Batal" color="negative" icon="close" @click="tutupDialog" />
        <q-btn unelevated label="Simpan" color="negative" icon="close" @click="simpan" />

        <!-- <q-btn unelevated label="Simpan" color="primary" icon="save" :disable="!store.form.isi?.length"
          @click="simpanIndikasi" /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { usePlannStore } from 'src/stores/simrs/igd/plann'
import { ref } from 'vue'

const $q = useQuasar()
const store = usePlannStore()
const options = ref([])

async function filterOptions(val, update) {
  if (!val) {
    update(() => {
      options.value = []
    })
    return
  }
  const params = {
    params: {
      q: val
    }
  }
  // console.log('q :', val)
  const resp = await api.get('/v1/settings/appmenu/cari_dokter', params)
  console.log('cari', resp)
  update(
    () => (options.value = resp.data),
    ref => {
      if (val !== '' && ref.options?.length) {
        ref.setOptionIndex(-1)
        ref.moveOptionSelection(1, true)
      }
    }
  )
}

const kriteriaIcu = [
  {
    kode: 'A',
    nama: 'Sistem Cardio Vasculair',
    items: [
      'Gagal jantung akut dengan gagal napas dan/atau memerlukan bantuan hemodinamik',
      'Hipertensi krisis atau hipertensi emergency',
      'Syok hipovolemia',
      'Syok septikemia',
      'Syok anafilaksis',
    ],
  },
  {
    kode: 'B',
    nama: 'Sistem Pulmonal',
    items: [
      'Gagal napas akut yang memerlukan ventilasi',
      'Emboli paru dengan kondisi hemodinamik yang tidak stabil',
      'Pasien dari unit intermediet yang menunjukkan gangguan respirasi',
      'Gagal napas yang memerlukan intubasi segera',
      'Edema paru akut dengan distress napas',
    ],
  },
  {
    kode: 'C',
    nama: 'Sistem Neurologi',
    items: [
      'Stroke akut yang disertai perubahan status mental',
      'Koma metabolik, toksik, atau anoksik',
      'Perdarahan intrakranial yang berpotensi menyebabkan herniasi',
      'Meningitis dengan perubahan status mental atau gangguan pernapasan',
      'Gangguan sistem saraf pusat atau neuromuskular dengan fungsi pulmonal atau neurologi yang memburuk',
      'Status epileptikus',
      'Vasospasme',
      'Cedera kepala berat',
      'Cedera kepala sedang yang kemungkinan memburuk',
      'Multiple trauma atau multiple injury',
    ],
  },
  {
    kode: 'D',
    nama: 'Overdosis Obat',
    items: [
      'Overdosis disertai hemodinamik tidak stabil',
      'Overdosis disertai penurunan kesadaran yang signifikan dan proteksi jalan napas yang tidak adekuat',
      'Overdosis dengan kejang yang tidak teratasi',
    ],
  },
  {
    kode: 'E',
    nama: 'Sistem Gastrointestinal',
    items: [
      'Perdarahan gastrointestinal yang mengancam jiwa disertai hipotensi, angina, perdarahan, atau komorbid lain',
      'Pankreatitis berat',
    ],
  },
  {
    kode: 'F',
    nama: 'Sistem Endokrinologi',
    items: [
      'Ketoasidosis diabetik disertai hemodinamik tidak stabil, penurunan kesadaran, insufisiensi pernapasan, atau asidosis berat',
      'Krisis tiroid atau koma miksedema dengan hemodinamik tidak stabil',
      'Status hiperosmolar dengan koma atau hemodinamik tidak stabil',
      'Krisis adrenal yang disertai hemodinamik tidak stabil',
      'Hipokalsemia, hiperkalsemia, hiponatremia, hipernatremia, hipomagnesemia, hipermagnesemia, hipofosfatemia, atau hiperfosfatemia yang memerlukan koreksi',
    ],
  },
  {
    kode: 'G',
    nama: 'Pembedahan',
    items: [
      'Pasien pascaoperatif yang memerlukan pemantauan hemodinamik, bantuan ventilasi, perawatan intensif, analgetik kontinu, atau memiliki komorbid multipel',
      'Pascaoperatif pembedahan mayor',
    ],
  },
  {
    kode: 'H',
    nama: 'Pediatrik',
    items: [
      'Dengue shock syndrome dengan syok berulang',
      'Meningoensefalitis dengan hemodinamik tidak stabil',
      'Status konvulsi dengan hemodinamik tidak stabil',
      'Cyanotic congenital heart disease',
      'Infeksi saluran pernapasan dengan pernapasan tidak adekuat',
    ],
  },
  {
    kode: 'I',
    nama: 'Maternitas',
    items: [
      'Pra atau pascamelahirkan dengan distress napas dan gangguan hemodinamik',
      'Pra atau pascamelahirkan dengan perdarahan masif dan hemodinamik tidak stabil',
      'Preeklamsia atau eklamsia dengan HELLP syndrome',
    ],
  },
]

function tutupDialog() {
  store.fixedicu = false
}

const simpan = () => {
  if (!store.form.dokterpenerima) {
    $q.notify({
      type: 'negative',
      message: 'Dokter penerima wajib dipilih',
      position: 'top-right'
    })
    return
  }

  // proses simpan...

  store.fixedicu = false // tutup dialog setelah valid
}

// function simpanIndikasi() {
//   console.log('xxx', store.form.isi)
//   store.simpanicu()
// }
</script>
