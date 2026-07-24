<template>
  <div class="bg-white q-pa-xs">
    <div ref="refTop" class="fixed-top bg-white" style="margin-top:50px; margin-left: 60px; z-index: 10">
      <div class="row bg-primary text-white q-pa-sm q-mb-sm print-hide">
        <div class="f-14 text-weight-bold">
          Laporan Dead Stok Farmasi
        </div>
      </div>

      <div class="row no-wrap justify-between items-center print-hide">
        <div class="col-grow">
          <div class="row q-col-gutter-sm q-my-sm items-center">
            <div class="col-4">
              <div class="row items-center q-col-gutter-xs">
                <div class="col-2 text-center text-weight-bold">Dari</div>
                <div class="col-6">
                  <app-autocomplete v-model="store.params.dari_bulan" label="Bulan" autocomplete="nama"
                    option-label="nama" option-value="value" outlined :source="store.bulans" :loading="store.loading" :disable="store.loading" />
                </div>
                <div class="col-4">
                  <app-input v-model="store.params.dari_tahun" label="Tahun" outlined :loading="store.loading" :disable="store.loading" />
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="row items-center q-col-gutter-xs">
                <div class="col-2 text-center text-weight-bold">S/D</div>
                <div class="col-6">
                  <app-autocomplete v-model="store.params.sampai_bulan" label="Bulan" autocomplete="nama"
                    option-label="nama" option-value="value" outlined :source="store.bulans" :loading="store.loading" :disable="store.loading" />
                </div>
                <div class="col-4">
                  <app-input v-model="store.params.sampai_tahun" label="Tahun" outlined :loading="store.loading" :disable="store.loading" />
                </div>
              </div>
            </div>

            <div class="col-2">
              <app-autocomplete v-model="store.params.kode_ruang" label="Pilih Gudang / Depo" autocomplete="nama"
                option-label="nama" option-value="value" outlined :source="store.gudangs" :loading="store.loading" :disable="store.loading" />
            </div>
            <div class="col-2">
              <app-btn label="Ambil Data" :disable="store.loading" :loading="store.loading" @click="store.getData()" />
            </div>
          </div>
        </div>
        <div class="col-auto q-mr-md">
          <div class="row items-center">
            <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print" :disable="store.loading">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
            <div class="q-ml-sm">
              <download-excel
                class="btn"
                :fields="store.fields"
                :fetch="store.fetch"
                :before-generate="store.startDownload"
                :before-finish="store.finishDownload"
                :name="'Laporan Dead Stok Farmasi ' + dariKeString() + '.xls'"
              >
                <q-btn
                  color="green"
                  round
                  size="sm"
                  icon="icon-mat-download"
                  push
                  :loading="store.loadingDownload"
                  :disable="store.loadingDownload || store.loading"
                >
                  <q-tooltip>Download Excel</q-tooltip>
                </q-btn>
              </download-excel>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :style="`margin-top:${h + 5}px;`" />
    <div id="printMe" class="q-pa-md">

      <div class="row items-center garis-bawah">
        <div class="col-2">
          <q-img src="~assets/images/logo-kota-grey.png" spinner-color="white"
            style="height: 3.5cm; max-width: 2.8cm" />
        </div>
        <div class="col-8">
          <div class="row justify-center f-18">
            PEMERINTAH KOTA PROBOLINGGO
          </div>
          <div class="row justify-center f-12 text-weight-bold">
            DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
          </div>
          <div class="row justify-center f-20 text-weight-bold">
            UOBK RSUD DOKTER MOHAMAD SALEH
          </div>
          <div class="row justify-center f-14">
            Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335) 432702
          </div>
          <div class="row justify-center f-14">
            E-mail : rsudprob@probolinggokota.go.id
          </div>
          <div class="row justify-center f-14 text-weight-bold">
            PROBOLINGGO 67219
          </div>
        </div>
        <div class="col-2">
          <q-img src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 3cm; max-width: 3cm" />
        </div>
      </div>

      <div class="row justify-center f-16 text-weight-bold q-my-sm text-uppercase">
        Laporan Dead Stok Farmasi
      </div>
      <div class="row justify-center f-12 q-mb-md">
        Periode: {{ dariKeString() }}
      </div>
      <div class="row justify-center f-12 q-mb-md">
        Tempat: {{ getTempatName() }}
      </div>

      <!-- Table Section -->
      <div class="q-my-md">
        <table class="full-width-table" :style="{ '--sticky-top-1': stickyTop1, '--sticky-top-2': stickyTop2 }">
          <thead>
            <tr>
              <th width="5%" rowspan="2" class="text-center">No</th>
              <th rowspan="2" class="text-left">Nama Obat</th>
              <th rowspan="2" class="text-left">Kode Belanja</th>
              <th colspan="2" class="text-center">Saldo Akhir</th>
              <th rowspan="2" class="text-center">Expired Date</th>
              <th rowspan="2" class="text-center">Keterangan</th>
            </tr>
            <tr>
              <th class="text-right">Jumlah</th>
              <th class="text-right">Nominal (Rupiah)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="store.loading">
              <td colspan="7" class="text-center q-pa-md">
                <q-spinner color="primary" size="2em" />
                <div class="q-mt-sm">Memuat data...</div>
              </td>
            </tr>
            <tr v-else-if="!store.items.length">
              <td colspan="7" class="text-center q-pa-md text-grey">
                Tidak ada data. Silakan klik tombol "Ambil Data".
              </td>
            </tr>
            <template v-else>
              <tr v-for="(item, index) in store.items" :key="item.kd_obat" :class="{'bg-red-1': item.total_transaksi === 0}">
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  <div class="text-weight-bold">{{ item.nama_obat }}</div>
                  <div class="text-grey-7 f-11">{{ item.kd_obat }}</div>
                </td>
                <td>{{ item.kode_belanja || '-' }}</td>
                <td class="text-right">{{ formatQty(item.saldo_akhir_qty) }} {{ item.satuan_k }}</td>
                <td class="text-right">{{ formatRupiah(item.saldo_akhir_val) }}</td>
                <td class="text-center">{{ item.expired_date ? formatDate(item.expired_date) : '-' }}</td>
                <td class="text-center">
                  <span v-if="item.total_transaksi === 0" class="text-negative text-weight-bold">DEAD STOCK</span>
                  <span v-else class="text-positive">Aktif</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Summary / Percentage Section -->
      <div v-if="store.items.length > 0" class="q-mt-lg q-pa-md bg-grey-2 border-rounded print-card">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-weight-bold f-14 q-mb-xs">Ringkasan Persediaan Dead Stock</div>
            <div class="row justify-between q-py-xs border-bottom">
              <div>Total Jenis Obat Tersedia:</div>
              <div class="text-weight-bold">{{ store.total_tersedia }} item</div>
            </div>
            <div class="row justify-between q-py-xs border-bottom">
              <div>Total Jenis Obat Dead Stock:</div>
              <div class="text-weight-bold text-negative">{{ store.total_dead_stok }} item</div>
            </div>
            <div class="row justify-between q-py-xs text-weight-bold f-14 text-primary">
              <div>Persentase Obat Dead Stock:</div>
              <div>{{ store.persentase_dead_stok }}%</div>
            </div>
          </div>
          <div class="col-12 col-md-6 text-center border-left">
            <div class="text-grey-7 q-mb-sm">Rumus Persentase Dead Stock:</div>
            <div class="f-13 font-mono bg-white q-pa-sm border-rounded shadow-1">
              % Dead Stock = (Jenis Obat Dead Stock / Jenis Obat Tersedia) x 100%
            </div>
            <div class="q-mt-sm text-weight-bold text-primary f-18">
              ({{ store.total_dead_stok }} / {{ store.total_tersedia }}) x 100% = {{ store.persentase_dead_stok }}%
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
<script setup>
import { useDeadStokReportStore } from 'src/stores/simrs/laporan/farmasi/deadStok/deadStok'
import { computed, onMounted, ref, watch } from 'vue'
import { date } from 'quasar'

const store = useDeadStokReportStore()

const refTop = ref(null)
const h = ref(0)
onMounted(() => {
  console.log('h', refTop.value.clientHeight)
  h.value = refTop.value.clientHeight
})

const stickyTop1 = computed(() => `${50 + h.value}px`)
const stickyTop2 = computed(() => `${50 + h.value + 32}px`)

// Auto-adjust S/D (to) date to 3 months after Dari (from) date
watch(
  () => [store.params.dari_bulan, store.params.dari_tahun],
  ([newBulan, newTahun]) => {
    const dariBul = parseInt(newBulan)
    const dariTah = parseInt(newTahun)
    if (!isNaN(dariBul) && !isNaN(dariTah)) {
      const targetDate = new Date(dariTah, dariBul - 1 + 2, 1)
      store.params.sampai_bulan = String(targetDate.getMonth() + 1).padStart(2, '0')
      store.params.sampai_tahun = String(targetDate.getFullYear())
    }
  }
)

const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Dead Stok Farmasi'
}

function formatRupiah (val) {
  if (val === null || val === undefined || isNaN(val)) return 'Rp. 0,00'
  return 'Rp. ' + parseFloat(val).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatQty (val) {
  if (val === null || val === undefined || isNaN(val)) return '0'
  return parseFloat(val).toLocaleString('id-ID')
}

function formatDate (val) {
  if (!val) return '-'
  if (typeof val === 'string' && (val.includes(',') || /^\d{2}-\d{2}-\d{4}$/.test(val))) {
    return val
  }
  return date.formatDate(val, 'DD-MM-YYYY')
}

function dariKeString () {
  const dariBul = store.bulans.find(a => a.value === store.params.dari_bulan)?.nama ?? ''
  const sampaiBul = store.bulans.find(a => a.value === store.params.sampai_bulan)?.nama ?? ''
  return `${dariBul} ${store.params.dari_tahun} s.d. ${sampaiBul} ${store.params.sampai_tahun}`
}

function getTempatName () {
  return store.gudangs.find(a => a.value === store.params.kode_ruang)?.nama ?? '-'
}
</script>
<style scoped lang="scss">
.full-width-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.full-width-table th, .full-width-table td {
  border: 1px solid #ccc;
  padding: 8px 10px;
  font-size: 12px;
}
.full-width-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-transform: uppercase;
}
.full-width-table thead tr:first-child th {
  position: sticky;
  top: var(--sticky-top-1);
  z-index: 5;
  background-color: #f5f5f5;
  box-shadow: inset 0 -1px 0 #ccc, inset 0 1px 0 #ccc;
  height: 32px;
}
.full-width-table thead tr:last-child th {
  position: sticky;
  top: var(--sticky-top-2);
  z-index: 5;
  background-color: #f5f5f5;
  box-shadow: inset 0 -1px 0 #ccc, inset 0 1px 0 #ccc;
  height: 32px;
}
.bg-red-1 {
  background-color: #ffebee !important;
}
.border-rounded {
  border-radius: 4px;
}
.print-card {
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-left {
  border-left: 1px solid #e0e0e0;
}
.garis-bawah {
  border-bottom: 3px double #000;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
@media print {
  .print-hide {
    display: none !important;
  }
  .bg-red-1 {
    background-color: #ffebee !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-card {
    background-color: #f9f9f9 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid #000;
  }
  .full-width-table thead tr th {
    position: static !important;
  }
  .full-width-table th {
    background-color: #e0e0e0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color: #000 !important;
  }
}
</style>
