<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto full-width bg-white q-py-sm q-px-md shadow-1 no-print">
      <div class="row justify-between items-center full-width">
        <!-- KIRI: Judul FAKTUR DETAIL dan Badge di bawahnya -->
        <div class="column">
          <div class="row items-center q-gutter-xs">
            <q-icon name="icon-mat-receipt_long" size="20px" color="teal" />
            <div class="text-subtitle2 text-bold text-teal">FAKTUR DETAIL</div>
          </div>
          <div v-if="headerData?.ruangan" class="q-mt-xs">
            <q-badge color="teal" outline class="q-py-none text-caption" style="font-size: 11px;">
              {{ headerData?.sistembayar || '-' }} ({{ headerData?.ruangan }})
            </q-badge>
          </div>
        </div>

        <!-- KANAN: Refresh, Tombol Cetak Bulat Icon Teal -->
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
            <q-tooltip>Cetak Faktur Detail</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Progress Bar Halus saat Background Sync / Update Data -->
    <q-linear-progress v-if="store.loadingFakturDetail && store.fakturDetailData" indeterminate color="teal" class="absolute-top" style="z-index: 10;" />

    <!-- Container Isi Dokumen Faktur Detail -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <!-- Loading State (Hanya jika data belum ada) -->
      <div v-if="store.loadingFakturDetail && !store.fakturDetailData" class="column flex-center q-pa-xl text-teal">
        <q-spinner-dots size="48px" />
        <div class="q-mt-md text-bold">Memuat Rincian Faktur Detail...</div>
      </div>

      <!-- Empty / Not Found State -->
      <div v-else-if="!store.fakturDetailData" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-mat-receipt" size="64px" class="q-mb-sm" />
        <div class="text-bold">Data Faktur Detail Tidak Tersedia</div>
        <div class="text-caption">Belum ada rincian data transaksi untuk pasien ini.</div>
      </div>

      <!-- Sheet Dokumen Kertas Cetak A4 / Faktur -->
      <div v-else id="print-faktur-detail" class="document-card print-page bg-white q-pa-md shadow-2 text-dark font-billing">
        
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
            <div class="badge-faktur q-mt-xs">FAKTUR DETAIL RAWAT INAP</div>
          </div>
        </div>

        <!-- HEADER IDENTITAS PASIEN -->
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
                <td class="val-col">{{ headerData?.pekerjaan }}</td>
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
                <td class="val-col">Rp. {{ rp(headerData?.ongkos_per_hari) }}</td>
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
                <td colspan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- GARIS DOUBLE ATAS TABEL -->
        <div class="border-top-double q-my-xs"></div>

        <!-- TABEL RINCIAN ITEM FAKTUR DETAIL -->
        <table class="table-billing full-width">
          <tbody>
            <template v-for="(section, secKey, index) in activeSections" :key="secKey">
              <!-- Baris Judul Kategori -->
              <tr class="row-header-item">
                <td class="col-no text-bold">{{ index + 1 }}.</td>
                <td class="col-desc text-bold" colspan="2">{{ section.title }}</td>
                <td class="col-curr text-bold" width="35">Rp.</td>
                <td class="col-val text-bold">{{ rp(section.total) }}</td>
              </tr>

              <!-- Sub-tabel Rincian jika ada item -->
              <tr v-if="section.items && section.items.length" class="row-subtable">
                <td></td>
                <td colspan="4" class="q-py-xs">
                  <table class="sub-table-detail full-width">
                    <thead>
                      <tr>
                        <th width="30">No.</th>
                        <th v-if="hasColumn(secKey, 'tgl')">Tanggal</th>
                        <th v-if="hasColumn(secKey, 'nota')">No. Nota</th>
                        <th v-if="hasColumn(secKey, 'nokantong')">No. Kantong</th>
                        <th v-if="hasColumn(secKey, 'noresep')">No. Resep</th>
                        <th v-if="hasColumn(secKey, 'jenis')">Jenis</th>
                        <th v-if="hasColumn(secKey, 'golda')">Golda</th>
                        <th v-if="hasColumn(secKey, 'keterangan')">Keterangan / Tindakan</th>
                        <th v-if="hasColumn(secKey, 'obat')">Nama Obat</th>
                        <th v-if="hasColumn(secKey, 'aturan')">Aturan</th>
                        <th v-if="hasColumn(secKey, 'konsumsi')">Konsumsi</th>
                        <th v-if="hasColumn(secKey, 'dokter')">Dokter</th>
                        <th v-if="hasColumn(secKey, 'pelaksana')">Pelaksana</th>
                        <th v-if="hasColumn(secKey, 'ruang')">Ruang</th>
                        <th v-if="hasColumn(secKey, 'harga')" class="text-right">Harga</th>
                        <th v-if="hasColumn(secKey, 'jml')" class="text-right">Jumlah</th>
                        <th v-if="hasColumn(secKey, 'nilair')" class="text-right">Nilai R</th>
                        <th class="text-right" width="100">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, iIdx) in section.items" :key="iIdx">
                        <td class="text-center">{{ iIdx + 1 }}</td>
                        <td v-if="hasColumn(secKey, 'tgl')">{{ item.tgl }}</td>
                        <td v-if="hasColumn(secKey, 'nota')">{{ item.nota }}</td>
                        <td v-if="hasColumn(secKey, 'nokantong')">{{ item.nokantong }}</td>
                        <td v-if="hasColumn(secKey, 'noresep')">{{ item.noresep }}</td>
                        <td v-if="hasColumn(secKey, 'jenis')">{{ item.jenis }}</td>
                        <td v-if="hasColumn(secKey, 'golda')">{{ item.golda }}</td>
                        <td v-if="hasColumn(secKey, 'keterangan')">{{ item.keterangan }}</td>
                        <td v-if="hasColumn(secKey, 'obat')">{{ item.obat }}</td>
                        <td v-if="hasColumn(secKey, 'aturan')">{{ item.aturan }}</td>
                        <td v-if="hasColumn(secKey, 'konsumsi')">{{ item.konsumsi }}</td>
                        <td v-if="hasColumn(secKey, 'dokter')">{{ item.dokter }}</td>
                        <td v-if="hasColumn(secKey, 'pelaksana')">{{ item.pelaksana }}</td>
                        <td v-if="hasColumn(secKey, 'ruang')">{{ item.ruang }}</td>
                        <td v-if="hasColumn(secKey, 'harga')" class="text-right">{{ rp(item.harga || item.biaya) }}</td>
                        <td v-if="hasColumn(secKey, 'jml')" class="text-right">{{ item.jml || item.jumlah || 1 }}</td>
                        <td v-if="hasColumn(secKey, 'nilair')" class="text-right">{{ rp(item.nilair) }}</td>
                        <td class="text-right">{{ rp(item.subtotal || item.harga || item.biaya) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td :colspan="getSubtableColspan(secKey)" class="text-right text-bold">Total :</td>
                        <td class="text-right text-bold">{{ rp(section.total) }}</td>
                      </tr>
                    </tfoot>
                  </table>
                </td>
              </tr>
            </template>

            <!-- TOTAL KESELURUHAN -->
            <tr class="row-grand-total">
              <td colspan="3" class="text-right text-bold font-large q-pr-md">
                TOTAL
              </td>
              <td class="col-curr text-bold font-large">Rp.</td>
              <td class="col-val text-bold font-large">
                {{ formatRp(store.fakturDetailData?.grand_total) }}
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useBillingRanapStore } from 'src/stores/simrs/ranap/billing'
import { formatRp } from 'src/modules/formatter'
import { date } from 'quasar'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  },
  menu: {
    type: Object,
    default: () => null
  }
})

const store = useBillingRanapStore()

const headerData = computed(() => store.fakturDetailData?.header || {})
const details = computed(() => store.fakturDetailData?.details || {})

/**
 * Filter seksi-seksi detail yang relevan
 */
const activeSections = computed(() => {
  const d = details.value
  if (!d) return {}
  return d
})

const printObj = {
  id: 'print-faktur-detail',
  popTitle: 'Faktur Detail Billing Pasien Ranap'
}

function rp(value) {
  if (!value || Number(value) === 0) {
    return ''
  }
  return formatRp(value)
}

function formatTanggalSekarang() {
  return date.formatDate(new Date(), 'DD/MM/YYYY HH:mm:ss')
}

function onImgError(e) {
  e.target.style.display = 'none'
}

function hasColumn(secKey, col) {
  switch (secKey) {
    case 'akomodasi':
      return ['tgl', 'keterangan', 'ruang', 'harga'].includes(col)
    case 'tindakan_dokter':
      return ['tgl', 'nota', 'keterangan', 'dokter'].includes(col)
    case 'visite_dokter':
      return ['tgl', 'dokter', 'keterangan'].includes(col)
    case 'tindakan_perawat':
      return ['tgl', 'nota', 'keterangan', 'pelaksana', 'ruang'].includes(col)
    case 'asuhan_gizi':
    case 'makan_pasien':
    case 'oksigen':
      return ['tgl', 'keterangan'].includes(col)
    case 'jasa_keperawatan':
      return ['tgl', 'keterangan', 'ruang'].includes(col)
    case 'laboratorium':
      return ['tgl', 'nota', 'keterangan'].includes(col)
    case 'radiologi':
      return ['tgl', 'nota', 'jenis', 'keterangan'].includes(col)
    case 'kamar_operasi':
      return ['tgl', 'nota', 'jenis', 'keterangan'].includes(col)
    case 'ruang_rr':
      return ['tgl', 'nota', 'keterangan'].includes(col)
    case 'fisioterapi':
    case 'endoscopy':
    case 'cardio':
    case 'eeg':
    case 'anestesi_luar_ok':
      return ['tgl', 'nota', 'keterangan'].includes(col)
    case 'hemodialisa':
      return ['tgl', 'nota', 'keterangan', 'pelaksana'].includes(col)
    case 'bank_darah':
      return ['tgl', 'nota', 'nokantong', 'jenis', 'golda'].includes(col)
    case 'farmasi':
      return ['tgl', 'nota', 'obat', 'harga', 'jml'].includes(col)
    case 'eresep_non_racikan':
      return ['tgl', 'noresep', 'obat', 'aturan', 'konsumsi', 'harga', 'jml', 'nilair'].includes(col)
    case 'eresep_racikan':
      return ['tgl', 'noresep', 'obat', 'konsumsi', 'harga', 'jml'].includes(col)
    default:
      return ['tgl', 'keterangan'].includes(col)
  }
}

function getSubtableColspan(secKey) {
  const checkCols = ['tgl', 'nota', 'nokantong', 'noresep', 'jenis', 'golda', 'keterangan', 'obat', 'aturan', 'konsumsi', 'dokter', 'pelaksana', 'ruang', 'harga', 'jml', 'nilair']
  let count = 1 // kolom No.
  checkCols.forEach(col => {
    if (hasColumn(secKey, col)) count++
  })
  return count
}

function loadData() {
  if (props.pasien?.noreg) {
    store.getFakturDetail(props.pasien)
  }
}

watch(() => props.pasien?.noreg, (newVal) => {
  if (newVal) {
    loadData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.pasien?.noreg && !store.fakturDetailData) {
    loadData()
  }
})
</script>

<style lang="scss" scoped>
.document-card {
  width: 210mm;
  min-height: 297mm;
  padding: 8mm;
  margin: 0 auto;
  border-radius: 2px;
  box-sizing: border-box;
}

.font-billing {
  font-family: 'Tahoma', 'Segoe UI', Arial, sans-serif;
  font-size: 11px;
  color: #000;
  line-height: 1.35;
}

.logo-kop {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.border-kop {
  border-bottom: 2px solid #999;
}

.border-top-double {
  border-top: 3px double #006699;
}

.badge-faktur {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 3px 5px;
  font-size: 11px;
  background: #fff;
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

.table-billing {
  border-collapse: collapse;
  font-size: 11px;
  line-height: 1.35;

  tr {
    vertical-align: top;
  }

  td {
    padding: 2px 2px;
  }

  .col-no {
    width: 25px;
    text-align: left;
  }

  .col-desc {
    text-align: left;
  }

  .col-curr {
    width: 35px;
    text-align: left;
  }

  .col-val {
    width: 120px;
    text-align: right;
    border-bottom: 1px dotted #006699;
    white-space: nowrap;
  }

  .row-header-item td {
    border-bottom: 1px solid #006699;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .row-grand-total td {
    padding-top: 6px;
    padding-bottom: 6px;
    border-top: 3px double #006699;
    border-bottom: 1px dotted #006699;
  }

  .font-large {
    font-size: 14px;
  }
}

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
