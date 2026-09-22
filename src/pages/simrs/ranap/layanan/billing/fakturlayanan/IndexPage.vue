<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto full-width bg-white q-py-sm q-px-md shadow-1 no-print">
      <div class="row justify-between items-center full-width">
        <!-- KIRI: Judul Menu Faktur dan Badge di bawahnya -->
        <div class="column">
          <div class="row items-center q-gutter-xs">
            <q-icon name="icon-mat-receipt_long" size="20px" color="teal" />
            <div class="text-subtitle2 text-bold text-teal">
              {{ (menu?.label || menu?.title || 'FAKTUR LAYANAN').toUpperCase() }}
            </div>
          </div>
          <div v-if="headerData?.ruangan" class="q-mt-xs">
            <q-badge color="teal" outline class="q-py-none text-caption" style="font-size: 11px;">
              {{ headerData?.sistembayar || '-' }} ({{ headerData?.ruangan }})
            </q-badge>
          </div>
        </div>

        <!-- KANAN: Tombol Refresh dan Tombol Cetak (Hanya Ikon Print) -->
        <div class="row items-center q-gutter-sm">
          <!-- Tombol Refresh -->
          <q-btn
            icon="icon-mat-refresh"
            color="primary"
            flat
            round
            dense
            :loading="store.loadingFakturDetail"
            @click="loadData"
          >
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>

          <!-- Tombol Cetak (Hanya Ikon Print) -->
          <q-btn
            v-if="store.fakturDetailData"
            v-print="printObj"
            color="teal"
            icon="icon-mat-print"
            round
            dense
          >
            <q-tooltip>Cetak Faktur</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Progress Bar Halus saat Background Sync / Update Data -->
    <q-linear-progress v-if="store.loadingFakturDetail && store.fakturDetailData" indeterminate color="teal" class="absolute-top" style="z-index: 10;" />

    <!-- Container Isi Dokumen Faktur -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <!-- Loading State (Hanya jika data belum ada) -->
      <div v-if="store.loadingFakturDetail && !store.fakturDetailData" class="column flex-center q-pa-xl text-teal">
        <q-spinner-dots size="48px" />
        <div class="q-mt-md text-bold">Memuat Rincian {{ menu?.label }}...</div>
      </div>

      <!-- Empty / Not Found State -->
      <div v-else-if="!store.fakturDetailData" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-mat-receipt" size="64px" class="q-mb-sm" />
        <div class="text-bold">Data {{ menu?.label }} Tidak Tersedia</div>
        <div class="text-caption">Belum ada rincian data billing untuk pasien ini.</div>
      </div>

      <!-- Sheet Dokumen Kertas Cetak A4 / Faktur (Format Profesional Sesuai Faktur Detail SS2) -->
      <div v-else :id="'print-faktur-' + menu?.name" class="document-card print-page bg-white q-pa-md shadow-2 text-dark font-billing">
        
        <!-- KOP RUMAH SAKIT -->
        <div class="row items-center justify-between border-kop q-pb-sm q-mb-sm">
          <div class="row items-center q-gutter-x-md">
            <img src="~assets/logos/logo-rsud.png" class="logo-kop" alt="Logo RS" @error="onImgError" />
            <div>
              <div class="text-bold text-subtitle1" style="line-height: 1.2;">
                UOBK RSUD dr. MOHAMAD SALEH
              </div>
              <div class="text-caption text-grey-9" style="font-size: 11px; line-height: 1.2;">
                Jl. Mayjend Panjaitan No. 65 Probolinggo Jawa Timur
              </div>
              <div class="text-caption text-grey-9" style="font-size: 11px; line-height: 1.2;">
                Telp. (0335) 433478,433119,421118 Fax. (0335) 432702
              </div>
            </div>
          </div>
          <div class="text-right text-caption" style="font-size: 11px;">
            <div>{{ formatTanggalSekarang() }}</div>
            <div class="badge-faktur q-mt-xs">{{ (menu?.title || menu?.label).toUpperCase() }}</div>
          </div>
        </div>

        <!-- HEADER IDENTITAS PASIEN (Format Rapi Persis Faktur Detail SS2) -->
        <div class="q-mb-sm">
          <table class="table-identitas">
            <tbody>
              <tr>
                <td class="label-col">Nama</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.nama }}</td>
                <td class="label-col">No. RM</td>
                <td class="sep-col">:</td>
                <td class="val-col text-bold">{{ headerData?.norm }}</td>
              </tr>
              <tr>
                <td class="label-col">Pekerjaan</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.pekerjaan || '-' }}</td>
                <td class="label-col">Ruangan</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.ruangan }}</td>
              </tr>
              <tr>
                <td class="label-col">Umur</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.umur }}</td>
                <td class="label-col">Ongkos Perwt/hari</td>
                <td class="sep-col">:</td>
                <td class="val-col">Rp. {{ rp(headerData?.ongkos_perhari) }}</td>
              </tr>
              <tr>
                <td class="label-col">Alamat</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.alamat }}</td>
                <td class="label-col">Dokter</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.dokter }}</td>
              </tr>
              <tr>
                <td class="label-col">Tanggal Masuk</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.tglmasuk }}</td>
                <td class="label-col">Dipindahkan</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.dipindahkan || '-' }}</td>
              </tr>
              <tr>
                <td class="label-col">Tgl. Keluar/Hidup/Mati</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.tglkeluar }}</td>
                <td class="label-col">Sistem Bayar</td>
                <td class="sep-col">:</td>
                <td class="val-col">{{ headerData?.sistembayar || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- GARIS DOUBLE ATAS TABEL -->
        <div class="border-top-double q-my-xs"></div>

        <!-- BARIS JUDUL SEKSI & TOTAL (Format Persis Faktur Detail SS2) -->
        <div class="row items-center justify-between q-py-xs q-px-xs text-bold" style="border-bottom: 1px solid #006699;">
          <div class="text-subtitle2 text-bold" style="color: #004d73;">
            {{ currentConfig?.title || menu?.title }}
          </div>
          <div class="text-subtitle2 text-bold">
            Rp. {{ rp(computedTotal) }}
          </div>
        </div>

        <!-- TABEL RINCIAN TRANSAKSI (Class sub-table-detail Persis SS2) -->
        <div class="q-mt-xs">
          <table class="sub-table-detail full-width">
            <thead>
              <tr>
                <th v-for="col in currentConfig?.columns" :key="col.field"
                  :style="{ width: col.width || 'auto', textAlign: col.align || 'left' }">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!displayItems || displayItems.length === 0">
                <td :colspan="currentConfig?.columns?.length || 5" class="text-center text-grey-6 q-pa-md">
                  Tidak ada rincian transaksi untuk layanan ini
                </td>
              </tr>
              <tr v-for="(item, idx) in displayItems" :key="idx">
                <td v-for="col in currentConfig?.columns" :key="col.field"
                  :class="{ 'text-center': col.align === 'center', 'text-right': col.align === 'right' }">
                  <template v-if="col.field === '_index'">
                    {{ idx + 1 }}
                  </template>
                  <template v-else-if="col.field === 'resep_tgl'">
                    <div class="text-bold" style="font-size: 11px; line-height: 1.2;">{{ item.noresep || '-' }}</div>
                    <div class="text-grey-8" style="font-size: 10.5px; line-height: 1.2;">{{ item.tgl || '-' }}</div>
                  </template>
                  <template v-else-if="col.field === 'nota_tgl'">
                    <div class="text-bold" style="font-size: 11px; line-height: 1.2;">{{ item.nota || '-' }}</div>
                    <div class="text-grey-8" style="font-size: 10.5px; line-height: 1.2;">{{ item.tgl || '-' }}</div>
                  </template>
                  <template v-else-if="col.format === 'rp'">
                    {{ rp(item[col.field]) }}
                  </template>
                  <template v-else>
                    {{ item[col.field] ?? '-' }}
                  </template>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td :colspan="(currentConfig?.columns?.length || 5) - 1" class="text-right text-bold">
                  Total :
                </td>
                <td class="text-right text-bold">
                  {{ rp(computedTotal) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useBillingRanapStore } from 'src/stores/simrs/ranap/billing'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    required: true
  }
})

const store = useBillingRanapStore()

// Konfigurasi Kolom & Data Source untuk setiap Menu Faktur (Sesuai Struktur Subtable SS2)
const serviceConfigs = {
  'visite-dokter': {
    title: 'Biaya Visite, Konsul & Oncall',
    keys: ['visite_dokter'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Dokter', field: 'dokter' },
      { label: 'Ruang', field: 'ruangan', width: '140px' },
      { label: 'Subtotal', field: 'biaya', align: 'right', format: 'rp', width: '120px' }
    ]
  },
  'tindakan-dokter': {
    title: 'Jasa Pelayanan Dokter Umum/Spesialis',
    keys: ['tindakan_dokter'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Dokter', field: 'dokter' },
      { label: 'Harga', field: 'biaya', align: 'right', format: 'rp', width: '100px' },
      { label: 'Jumlah', field: 'jml', align: 'center', width: '50px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '110px' }
    ]
  },
  'tindakan-perawat': {
    title: 'Tindakan Keperawatan',
    keys: ['tindakan_perawat'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Pelaksana', field: 'pelaksana' },
      { label: 'Ruang', field: 'ruang', width: '110px' },
      { label: 'Harga', field: 'biaya', align: 'right', format: 'rp', width: '90px' },
      { label: 'Jumlah', field: 'jml', align: 'center', width: '50px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '100px' }
    ]
  },
  'gizi': {
    title: 'Instalasi Gizi (Asuhan Gizi & Makan Pasien)',
    keys: ['asuhan_gizi', 'makan_pasien'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '160px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Waktu', field: 'waktu', width: '120px' },
      { label: 'Subtotal', field: 'biaya', align: 'right', format: 'rp', width: '130px' }
    ]
  },
  'laboratorium': {
    title: 'Laboratorium',
    keys: ['laboratorium'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Harga', field: 'biaya', align: 'right', format: 'rp', width: '100px' },
      { label: 'Jumlah', field: 'jml', align: 'center', width: '50px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '120px' }
    ]
  },
  'oksigen': {
    title: 'Biaya Oksigen',
    keys: ['oksigen'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Subtotal', field: 'biaya', align: 'right', format: 'rp', width: '140px' }
    ]
  },
  'radiologi': {
    title: 'Radiologi',
    keys: ['radiologi'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Ukuran', field: 'ukuran', width: '90px', align: 'center' },
      { label: 'Harga', field: 'biaya', align: 'right', format: 'rp', width: '100px' },
      { label: 'Jumlah', field: 'jml', align: 'center', width: '50px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '110px' }
    ]
  },
  'jasa-keperawatan': {
    title: 'Jasa Keperawatan',
    keys: ['jasa_keperawatan'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '170px' },
      { label: 'Ruang', field: 'ruang', width: '180px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Subtotal', field: 'biaya', align: 'right', format: 'rp', width: '130px' }
    ]
  },
  'farmasi': {
    title: 'Biaya Farmasi / Obat',
    keys: ['farmasi'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'No. Nota / Tanggal', field: 'nota_tgl', width: '155px' },
      { label: 'Nama Obat', field: 'obat' },
      { label: 'Harga', field: 'harga', align: 'right', format: 'rp', width: '85px' },
      { label: 'Jumlah', field: 'jml', align: 'center', width: '50px' },
      { label: 'Embalage', field: 'embalage', align: 'right', format: 'rp', width: '75px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '95px' }
    ]
  },
  'hemodialisa': {
    title: 'Hemodialisa',
    keys: ['hemodialisa'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Pelaksana', field: 'pelaksana' },
      { label: 'Harga', field: 'biaya', align: 'right', format: 'rp', width: '100px' },
      { label: 'Jumlah', field: 'jml', align: 'center', width: '50px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '110px' }
    ]
  },
  'cardio': {
    title: 'Cardio',
    keys: ['cardio'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Pelaksana', field: 'pelaksana' },
      { label: 'Harga', field: 'biaya', align: 'right', format: 'rp', width: '100px' },
      { label: 'Jumlah', field: 'jml', align: 'center', width: '50px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '110px' }
    ]
  },
  'eeg': {
    title: 'EEG',
    keys: ['eeg'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '160px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Pelaksana', field: 'pelaksana' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '130px' }
    ]
  },
  'fisioterapi': {
    title: 'Fisioterapi',
    keys: ['fisioterapi'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '160px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '130px' }
    ]
  },
  'akomodasi': {
    title: 'Akomodasi / Kamar',
    keys: ['akomodasi'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '170px' },
      { label: 'Ruang', field: 'ruang', width: '180px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Subtotal', field: 'harga', align: 'right', format: 'rp', width: '130px' }
    ]
  },
  'operasi': {
    title: 'Kamar Operasi & Ruang RR',
    keys: ['kamar_operasi', 'ruang_rr'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Tanggal', field: 'tgl', width: '150px' },
      { label: 'No. Nota', field: 'nota', width: '170px' },
      { label: 'Jenis', field: 'jenis', width: '120px' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '120px' }
    ]
  },
  'eresep': {
    title: 'Biaya E-Resep (Non Racikan & Racikan)',
    keys: ['eresep_non_racikan', 'eresep_racikan'],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'No. Resep / Tanggal', field: 'resep_tgl', width: '155px' },
      { label: 'Nama Obat', field: 'obat' },
      { label: 'Aturan', field: 'konsumsi', width: '65px', align: 'center' },
      { label: 'Jumlah', field: 'jumlah', align: 'center', width: '50px' },
      { label: 'Harga', field: 'harga', align: 'right', format: 'rp', width: '85px' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '95px' }
    ]
  }
}

const currentConfig = computed(() => {
  return serviceConfigs[props.menu?.name] || {
    title: props.menu?.title || 'Faktur Layanan',
    keys: [],
    columns: [
      { label: 'No.', field: '_index', width: '35px', align: 'center' },
      { label: 'Keterangan / Tindakan', field: 'keterangan' },
      { label: 'Subtotal', field: 'subtotal', align: 'right', format: 'rp', width: '120px' }
    ]
  }
})

const headerData = computed(() => store.fakturDetailData?.header || {})

// Menggabungkan item transaksi dari satu atau lebih kategori
const displayItems = computed(() => {
  if (!store.fakturDetailData?.details) return []
  const cfg = currentConfig.value
  let result = []
  if (cfg.keys && cfg.keys.length > 0) {
    cfg.keys.forEach(k => {
      const section = store.fakturDetailData.details[k]
      if (section && section.items && Array.isArray(section.items)) {
        result = result.concat(section.items)
      }
    })
  }
  return result
})

// Menghitung grand total kategori dari items yang tampil
const computedTotal = computed(() => {
  if (!displayItems.value || displayItems.value.length === 0) return 0
  return displayItems.value.reduce((acc, item) => {
    const val = item.subtotal ?? item.biaya ?? item.harga ?? 0
    return acc + parseFloat(val || 0)
  }, 0)
})

// Obyek print v-print
const printObj = computed(() => ({
  id: 'print-faktur-' + props.menu?.name,
  popTitle: `${props.pasien?.noreg ? props.pasien.noreg.replace(/\//g, '') : ''}_${headerData.value?.nama || ''}_${props.menu?.label || 'FAKTUR'}`,
  extraCss: '',
  extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
}))

function rp(val) {
  if (val === null || val === undefined || isNaN(val)) return '0'
  return Math.round(val).toLocaleString('id-ID')
}

function formatTanggalSekarang() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function onImgError(e) {
  e.target.style.display = 'none'
}

function loadData() {
  if (props.pasien?.noreg) {
    store.getFakturDetail(props.pasien)
  }
}

// Menjamin 1 response faktur detail diambil saat komponen dimount
onMounted(() => {
  if (props.pasien?.noreg) {
    store.ensureFakturDetail(props.pasien)
  }
})

watch(() => props.pasien?.noreg, (newNoreg) => {
  if (newNoreg) {
    store.ensureFakturDetail(props.pasien)
  }
})
</script>

<style lang="scss" scoped>
.font-billing {
  font-family: Tahoma, Helvetica, Arial, sans-serif;
  color: #000;
}

.document-card {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
}

.logo-kop {
  height: 52px;
  width: auto;
  object-fit: contain;
}

.border-kop {
  border-bottom: 3px double #999999;
}

.badge-faktur {
  display: inline-block;
  font-weight: bold;
  font-size: 11px;
  color: #004d73;
}

.border-top-double {
  border-top: 3px double #006699;
  width: 100%;
}

.table-identitas {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  line-height: 1.35;

  td {
    padding: 1px 2px;
    vertical-align: top;
  }

  .label-col {
    white-space: nowrap;
    width: 1%;
    padding-right: 10px;
  }

  .sep-col {
    width: 10px;
    text-align: center;
    padding-right: 6px;
  }

  .val-col {
    width: 45%;
  }
}

// Class sub-table-detail identik dengan SS2 (Faktur Detail)
.sub-table-detail {
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
  margin: 2px 0 6px 0;

  th, td {
    border: 1px solid #777;
    padding: 2px 4px;
  }

  th {
    background-color: #f5f5f5;
    text-align: left;
    font-weight: bold;
  }

  tfoot td {
    border: 1px solid #777;
    padding: 3px 4px;
    background-color: #fafbfc;
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }

  .no-print {
    display: none !important;
  }

  .print-page {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 8mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
</style>
