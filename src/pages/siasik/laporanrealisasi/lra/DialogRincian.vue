<template>
  <q-dialog :model-value="modelValue" @update:model-value="val => emits('update:modelValue', val)" persistent
    backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Rincian Rekening Belanja</div>
            <q-space />

            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>

          <div id="printR" class="row justify-center q-pt-md">
            <div class="text-h6 q-mb-md q-px-xl">
              <q-icon name="icon-mat-layers" size="sm" class="q-mr-sm" />
              {{ listrincian.kode }} - {{ listrincian.uraian || 'Tanpa Uraian' }}
            </div>
            <q-separator />
            <div class="col-12 col-md-10">
              <q-card-section class="q-pa-md">

                <div class="responsive-table-container">
                  <table class="custom-print-table full-width">
                    <thead>
                      <tr>
                        <th class="text-left q-pa-sm">Kode Rekening</th>
                        <th class="text-left q-pa-sm">Item Belanja</th>
                        <th class="text-right q-pa-sm">Volume</th>
                        <th class="text-right q-pa-sm">Satuan</th>
                        <th class="text-right q-pa-sm">Harga</th>
                        <th class="text-right q-pa-sm">Pagu Anggaran</th>
                        <th class="text-right q-pa-sm">Realisasi</th>
                        <th class="text-right q-pa-sm">Sisa Anggaran</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in listrincian?.rincian" :key="index" class="hover-row">
                        <td class="text-left q-pa-sm text-weight-medium text-grey-9">
                          {{ item?.koderek108 || '-' }}
                        </td>
                        <td class="text-left q-pa-sm text-weight-medium text-grey-9">
                          {{ item?.usulan || '-' }}
                        </td>
                        <td class="text-right q-pa-sm text-primary text-weight-bold">
                          {{ item?.volume }}
                        </td>
                        <td class="text-right q-pa-sm text-primary text-weight-bold">
                          {{ item?.satuan }}
                        </td>
                        <td class="text-right q-pa-sm text-primary text-weight-bold">
                          {{ formattanpaRp(item?.harga) }}
                        </td>
                        <td class="text-right q-pa-sm text-primary text-weight-bold">
                          {{ formattanpaRp(item?.pagu) }}
                        </td>
                        <td class="text-right q-pa-sm text-positive text-weight-bold">
                          {{ formattanpaRp(item?.total) }}
                        </td>
                        <td :class="[
                          'text-right q-pa-sm text-weight-bold',
                          (item?.sisa_pagu < 0) ? 'text-negative' : 'text-grey-8'
                        ]">
                          {{ formattanpaRp(item?.sisa_pagu) }}
                        </td>
                      </tr>

                      <tr v-if="!listrincian || listrincian.length === 0">
                        <td colspan="4" class="text-center q-pa-xl text-grey-6">
                          Tidak ada data rincian belanja.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </q-card-section>
            </div>
          </div>
        </q-page-container>
        <q-footer elevated>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                  <q-tooltip class="primary" :offset="[10, 10]">
                    Print
                  </q-tooltip>
                </q-btn>
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
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  listrincian: {
    type: Object,
    default: () => ({})
  }
})

const printed = ref(false)
const printObj = {
  id: 'printR',
  popTitle: 'Rincian Realisasi Anggaran | SIASIK',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}


const emits = defineEmits(['update:modelValue'])

const close = () => emits('update:modelValue', false)

const formatRupiah = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
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
