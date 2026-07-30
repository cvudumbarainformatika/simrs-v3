<template>
  <div class="q-pa-md relative-position">
    <q-card flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-subtitle1 text-weight-bold">
          Filter Laporan Rincian Per Unit
        </div>
        <div class="text-caption">
          Tentukan periode, pelayanan, dan jenis laporan.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form class="row q-col-gutter-md items-end" @submit.prevent="cariReport">
          <div class="col-12 col-sm-6 col-md-3">
            <q-input v-model="store.params.from" outlined dense readonly label="Tanggal Dari">
              <template #prepend>
                <q-icon name="icon-mat-event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="store.params.from" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Tutup" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-input v-model="store.params.to" outlined dense readonly label="Tanggal Sampai">
              <template #prepend>
                <q-icon name="icon-mat-event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="store.params.to" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Tutup" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select v-model="store.params.pelayanan" :options="pelayananOptions" outlined dense emit-value map-options
              clearable label="Pelayanan" option-label="label" option-value="value"
              @update:model-value="store.params.jenisLaporan = null" />
          </div>

          <div v-if="store.params.pelayanan !== 5" class="col-12 col-sm-6 col-md-3">
            <q-select v-model="store.params.jenisLaporan" :options="jenisLaporanOptions" outlined dense emit-value map-options
              clearable label="Jenis Laporan" option-label="label" option-value="value" />
          </div>

          <div class="col-12 row justify-end q-gutter-sm">
            <q-btn outline no-caps color="grey-7" icon="icon-mat-restart_alt" label="Reset" @click="resetFilter" />
            <q-btn
              unelevated
              no-caps
              color="primary"
              icon="icon-mat-search"
              label="Cari Report"
              type="submit"
              :loading="store.loading"
              :disable="store.loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card v-if="store.report" flat bordered class="q-mt-md">
      <q-card-section class="row items-center q-gutter-md q-py-sm">
        <div>
          <div class="text-subtitle1 text-weight-bold">
            {{ store.report.Title }}
          </div>
          <div class="text-caption text-grey-7">
            Periode {{ store.params.from }} s.d. {{ store.params.to }}
          </div>
        </div>
        <div class="row items-center q-gutter-sm">
          <q-badge color="primary" :label="`${store.report.Total || 0} baris`" />
          <download-excel
            :data="excelRows"
            :fields="excelFields"
            :name="excelFileName"
            :worksheet="store.report.Title || 'Rincian Per Unit'"
          >
            <q-btn
              unelevated
              no-caps
              color="green-7"
              icon="icon-mat-download"
              label="Download Excel"
            />
          </download-excel>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row q-col-gutter-sm">
        <div
          v-for="total in totalCards"
          :key="total.key"
          class="col-12 col-sm-6 col-md"
        >
          <q-card flat bordered class="bg-blue-grey-1 full-height">
            <q-card-section class="q-pa-sm">
              <div class="text-caption text-grey-7">
                {{ total.label }}
              </div>
              <div class="text-subtitle1 text-weight-bold text-primary">
                {{ formatNumber(total.value) }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>

      <q-table
        flat
        dense
        separator="cell"
        row-key="__index"
        :rows="reportRows"
        :columns="reportColumns"
        :loading="store.loading"
        :pagination="{ rowsPerPage: 0 }"
        hide-pagination
        no-data-label="Data laporan tidak ditemukan"
        class="report-table"
      />
    </q-card>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Notify } from 'quasar'
import { useLaporanRincianPerunit } from 'src/stores/simrs/laporan/keuangan/rincianperunit/rincianperunit'

const store = useLaporanRincianPerunit()

const pelayananOptions = [
  { value: 1, label: 'Instalasi Rawat Jalan' },
  { value: 2, label: 'Instalasi Gawat Darurat' },
  { value: 3, label: 'Instalasi Rawat Inap' },
  { value: 4, label: 'Penunjang' },
  { value: 5, label: 'Pendapatan Non Layanan' }
]
const jenisLaporanByPelayanan = {
  1: [
    { value: 1, label: 'Poli Klinik Spesialis' },
    { value: 2, label: 'Konsultasi Antar Poli' },
    { value: 3, label: 'Tindakan Rawat Jalan' }
  ],
  2: [
    { value: 1, label: 'Administrasi IGD' },
    { value: 2, label: 'Tindakan IGD' }
  ],
  3: [
    { value: 1, label: 'Administrasi Rawat Inap' },
    { value: 2, label: 'Akomodasi Kamar' },
    { value: 3, label: 'Tindakan Ranap' },
    { value: 4, label: 'Visite/Konsultasi/Oncall Dokter Ranap' },
    { value: 5, label: 'Jasa Keperawatan Ranap' },
    { value: 6, label: 'Oksigen Ranap' }
  ],
  4: [
    { value: 1, label: 'Laborat' },
    { value: 2, label: 'Laborat PA' },
    { value: 3, label: 'Radiologi' },
    { value: 4, label: 'Operasi' },
    { value: 5, label: 'Tindakan RR' },
    { value: 6, label: 'Fisioterapi' },
    { value: 7, label: 'Hemodialisa' },
    { value: 8, label: 'Cardio' },
    { value: 9, label: 'Eeg' },
    { value: 10, label: 'Endoscope' },
    { value: 11, label: 'Psikologi' },
    { value: 12, label: 'Gizi' },
    { value: 13, label: 'Penggunaan Darah' },
    { value: 14, label: 'Farmasi' },
    { value: 15, label: 'Jenazah' },
    { value: 16, label: 'Ambulan' },
    { value: 17, label: 'Anastesi Diluar OK' }
  ]
}

const jenisLaporanOptions = computed(() => {
  return jenisLaporanByPelayanan[store.params.pelayanan] || []
})
const numericColumns = ['jml', 'potjas', 'sarana', 'pelayanan', 'subtotal']
const reportColumns = computed(() => {
  const columns = store.report?.Columns || {}

  return Object.entries(columns).map(([name, label]) => ({
    name,
    label,
    field: name,
    align: numericColumns.includes(name) ? 'right' : 'left',
    sortable: true,
    format: value => numericColumns.includes(name)
      ? formatNumber(value)
      : normalizeValue(value)
  }))
})
const reportRows = computed(() => {
  return store.items.map((item, index) => ({
    ...item,
    __index: index
  }))
})
const excelFields = computed(() => {
  return Object.fromEntries(
    Object.entries(store.report?.Columns || {}).map(([key, label]) => {
      return [label, key]
    })
  )
})
const excelRows = computed(() => {
  const rows = store.items.map(item => {
    return Object.fromEntries(
      Object.keys(store.report?.Columns || {}).map(key => {
        const value = item[key]
        return [key, numericColumns.includes(key)
          ? Number(value || 0)
          : normalizeValue(value)]
      })
    )
  })

  const totalRow = Object.fromEntries(
    Object.keys(store.report?.Columns || {}).map(key => {
      if (key === 'namaTrans') return [key, 'TOTAL']
      if (numericColumns.includes(key)) {
        return [key, reportTotals.value[key] || 0]
      }
      return [key, '']
    })
  )

  return [...rows, totalRow]
})
const excelFileName = computed(() => {
  return `Rincian_Per_Unit_${store.params.from}_sd_${store.params.to}.xls`
})
const reportTotals = computed(() => {
  return numericColumns.reduce((totals, column) => {
    totals[column] = store.items.reduce((sum, item) => {
      return sum + Number(item[column] || 0)
    }, 0)
    return totals
  }, {})
})
const totalCards = computed(() => [
  { key: 'jml', label: 'Total Jumlah', value: reportTotals.value.jml },
  { key: 'potjas', label: 'Total Potongan Jasa', value: reportTotals.value.potjas },
  { key: 'sarana', label: 'Total Sarana', value: reportTotals.value.sarana },
  { key: 'pelayanan', label: 'Total Pelayanan', value: reportTotals.value.pelayanan },
  { key: 'subtotal', label: 'Total Keseluruhan', value: reportTotals.value.subtotal }
])

function normalizeValue(value) {
  return String(value ?? '-').replaceAll('&nbsp;', '')
}

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(Number(value || 0))
}

function cariReport() {
  const wajibDiisi = [
    { value: store.params.from, label: 'Tanggal Dari' },
    { value: store.params.to, label: 'Tanggal Sampai' },
    { value: store.params.pelayanan, label: 'Pelayanan' }
  ]

  if (store.params.pelayanan !== 5) {
    wajibDiisi.push({
      value: store.params.jenisLaporan,
      label: 'Jenis Laporan'
    })
  }

  const fieldKosong = wajibDiisi.find(field => {
    return field.value === null || field.value === undefined || field.value === ''
  })

  if (fieldKosong) {
    Notify.create({
      type: 'warning',
      message: `${fieldKosong.label} wajib dipilih.`
    })
    return
  }

  store.carireport()
}

function resetFilter() {
  store.resetFilter()
}
</script>

<style scoped>
.report-table {
  max-height: calc(100vh - 310px);
}

.report-table :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  top: 0;
  color: #fff;
  white-space: nowrap;
  background: var(--q-primary);
}

.report-table :deep(tbody td) {
  white-space: nowrap;
}
</style>
