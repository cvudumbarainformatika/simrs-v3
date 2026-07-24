<template>
  <q-dialog :model-value="modelValue" @update:model-value="val => emits('update:modelValue', val)" persistent
    backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; height: 300px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Form Input Batasan Pagu</div>
            <q-space />

            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>

          <div class="row justify-center q-pt-md">
            <div class="text-h6 q-mb-md q-px-xl">
              <q-icon name="icon-mat-layers" size="sm" class="q-mr-sm" />
              {{ datas.kode }} - {{ datas.uraian || 'Tanpa Uraian' }}
            </div>
            <q-separator />
            <div class="col-12 col-md-10">
              <div class="row q-col-gutter-md">
                <app-input-simrs label="Pagu Saat ini" :model-value="formattanpaRp(datas.pagu || 0)"
                  standout="bg-yellow-3" outlined dense style="width: 50%" />
                <app-input-simrs label="Batasan Realisasi" v-model="store.form_batasan.batasan" standout="bg-yellow-3"
                  outlined dense style="width: 50%" />
                <q-select v-model="store.form_batasan.flag" outlined standout="bg-yellow-3" dense emit-value map-options
                  option-value="value" label="Status" class="ellipsis-2-lines" :options="optionsAktif"
                  option-label="label" :disable="store.loadingSave" :loading="store.loadingSave" />

              </div>
              <div class="row flex justify-end q-pt-sm">
                <app-btn label="Simpan" class="bg-black" type="submit" :disable="store.loadingSave"
                  :loading="store.loadingSave" @click="simpanData(datas)" />
              </div>
            </div>

          </div>

        </q-page-container>
        <q-footer elevated>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <!-- <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                  <q-tooltip class="primary" :offset="[10, 10]">
                    Print
                  </q-tooltip>
                </q-btn> -->
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { formattanpaRp } from 'src/modules/formatter'
import { notifErrVue } from 'src/modules/utils'
import { usePergeseranAnggaranStore } from 'src/stores/siasik/anggaran/pergeseran/pergeseranrincian'
import { onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  datas: {
    type: Object,
    default: () => ({})
  }
})

const store = usePergeseranAnggaranStore()
const emits = defineEmits(['update:modelValue'])

const close = () => emits('update:modelValue', false)
const optionsAktif = [
  { label: 'Aktif', value: '1' },
  { label: 'Non Aktif', value: '' }
]

// onMounted(() => {
//   console.log('batasan', store.form_batasan?.batasan)
// })
const formatRupiah = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

function simpanData(val) {

  store.form_batasan.notrans = val.notrans
  store.form_batasan.pagu = val.pagubaru
  store.form_batasan.koderek50 = val.kode
  store.form_batasan.uraian50 = val.uraian
  store.form_batasan.kodekegiatanblud = val.kodekegiatanblud
  store.form_batasan.kodebidang = val.kodebidang
  store.form_batasan.tahun = val.tahun
  if (Number(store.form_batasan.batasan) > Number(store.form_batasan.pagu)) {
    return notifErrVue('Batasan Melebihi Pagu Saat ini')
  } else {
    store.simpanBatasan()
  }

  console.log('form batasan', store.form_batasan)
}
</script>
<style scoped>
.responsive-table-container {
  overflow-x: auto;
  width: 100%;
}

/* Styling Tabel Utama */
.custom-print-table {
  border-collapse: collapse;
  font-size: 13px;
  /* Sedikit dinaikkan dari f-12 agar lebih terbaca */
  font-family: inherit;
}

/* Styling Header Tabel */
.custom-print-table thead tr {
  background-color: #f5f5f5;
  color: #2c3e50;
  border-top: 2px solid #bdc3c7;
  border-bottom: 2px solid #bdc3c7;
}

.custom-print-table th {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

/* Styling Baris Tabel */
.custom-print-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

/* Efek Hover di Aplikasi (Otomatis hilang saat di-print) */
@media screen {
  .hover-row:hover {
    background-color: #f9f9f9;
    cursor: default;
  }
}

/* Optimasi Khusus Saat Print Cetak Dokumen */
@media print {
  #printMe {
    padding-top: 0 !important;
  }

  .custom-print-table thead tr {
    background-color: #e0e0e0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
