<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDaftarTilikStore } from 'src/stores/simrs/ranap/daftartilik'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'
import bodyMarkerMale from 'src/assets/human/anatomys/body-marker-male.webp'
import bodyMarkerFemale from 'src/assets/human/anatomys/body-marker-female.webp'
import { dateFullFormat } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Object,
    default: null
  }
})

const store = useDaftarTilikStore()
const loading = ref(false)
const route = useRoute()

// Banner konfirmasi penerimaan pasien paska operasi hanya muncul jika diakses di modul Ruang Rawat (Ranap)
const isRuanganPage = computed(() => {
  const path = route?.path || ''
  return !path.includes('kamaroperasi')
})

const item = computed(() => {
  return store.items && store.items.length > 0 ? store.items[0] : null
})

// Helper parse checklist (JSON string / Object) & pengecekan status Ya / Tidak
const parseChecklist = (checklist) => {
  if (!checklist) return {}
  if (typeof checklist === 'string') {
    try {
      return JSON.parse(checklist)
    } catch (e) {
      return {}
    }
  }
  return checklist
}

const isStatusYa = (checklist, masterKode) => {
  const data = parseChecklist(checklist)
  const val = data?.[masterKode]
  const status = typeof val === 'object' ? val?.status : val
  if (!status) return false
  const s = String(status).toLowerCase().trim()
  return s === 'ya' || s === 'y' || s === '1' || s === 'true'
}

const isStatusTidak = (checklist, masterKode) => {
  const data = parseChecklist(checklist)
  const val = data?.[masterKode]
  const status = typeof val === 'object' ? val?.status : val
  if (!status) return false
  const s = String(status).toLowerCase().trim()
  return s === 'tidak' || s === 'tdk' || s === 't' || s === '0' || s === 'false'
}

const getKeterangan = (checklist, masterKode) => {
  const data = parseChecklist(checklist)
  const val = data?.[masterKode]
  return typeof val === 'object' ? (val?.keterangan || '') : ''
}

// Otomatis tentukan gambar anatomi tubuh sesuai jenis kelamin pasien (Pria / Wanita)
const bodyMarkerImg = computed(() => {
  const k = (props.pasien?.kelamin || item.value?.kelamin || '').toLowerCase()
  if (k.includes('perempuan') || k === 'p' || k.includes('wanita') || k.includes('female')) {
    return bodyMarkerFemale
  }
  return bodyMarkerMale
})

onMounted(async () => {
  if (props.pasien) {
    loading.value = true
    await store.getData(props.pasien)
    loading.value = false
  }
})

const qrUrl = (kdpeg) => {
  if (!kdpeg) return ''
  const noreg = props.pasien?.noreg || item.value?.noreg || ''
  const dok = 'DAFTAR TILIK PRE DAN PASKA OPERASI.png'
  const asal = 'RAWAT INAP'
  const petugas = kdpeg
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}

const printObj = {
  id: 'print-daftartilik-doc',
  popTitle: 'Daftar Tilik Pre dan Paska Operasi'
}
</script>

<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN DAFTAR TILIK PRE & PASKA OPERASI</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="item">
            Tersimpan
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="item">
          <q-btn
            v-print="printObj"
            color="indigo-10"
            icon="icon-mat-print"
            label="Cetak Dokumen"
            no-caps
            dense
            class="q-px-md text-weight-bold"
          />
        </div>
      </div>
    </div>

    <!-- Container preview dokumen -->
    <div class="col full-height scroll q-py-md q-px-md flex flex-center bg-grey-4">
      <div v-if="loading" class="text-center text-grey-6 q-pa-xl">
        <q-spinner-dots color="indigo-10" size="40px" />
        <div class="q-mt-sm">Memuat dokumen...</div>
      </div>

      <div v-else-if="!item" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders border-panel shadow-1" style="max-width: 500px;">
        <q-icon name="icon-my-file_sign" size="64px" class="q-mb-sm text-indigo-10" />
        <div class="text-bold text-subtitle1 text-indigo-10">Belum Ada Dokumen</div>
        <div class="text-caption text-grey-7 q-mt-xs">Daftar Tilik Pre dan Paska Operasi pasien ini belum diisi oleh petugas.</div>
      </div>

      <div v-else id="print-daftartilik-doc" class="bg-white print-area q-pa-sm shadow-3 text-black font-body font-print border-print" style="width: 210mm; box-sizing: border-box; font-size: 11px;">
        
        <!-- Kop Surat Standard RS -->
        <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['DAFTAR TILIK', 'VERIFIKASI PASIEN OPERASI']" />

        <!-- Data Pasien Box (Di bawah Kop Surat, di atas Judul Dokumen) -->
        <table class="table-print patient-info-table full-width q-my-xs">
          <tbody>
            <tr>
              <td width="15%" class="bg-grey-2 text-weight-bold">Nama Pasien</td>
              <td width="35%">: <strong>{{ pasien?.nama || '-' }}</strong></td>
              <td width="18%" class="bg-grey-2 text-weight-bold">No. RM / Noreg</td>
              <td width="32%">: <strong>{{ pasien?.norm || '-' }} / {{ pasien?.noreg || '-' }}</strong></td>
            </tr>
            <tr>
              <td class="bg-grey-2 text-weight-bold">Tgl. Lahir / Usia</td>
              <td>: {{ pasien?.tgllahir || '-' }} ({{ pasien?.usia || '-' }})</td>
              <td class="bg-grey-2 text-weight-bold">Jenis Kelamin</td>
              <td>: {{ pasien?.kelamin || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="text-center text-weight-bold uppercase tracking-wide q-my-xs text-black border-bottom-double q-pb-xs" style="font-size: 11px;">
          DAFTAR TILIK PRE DAN PASKA OPERASI
        </div>

        <!-- Header Metadata Operasi -->
        <table class="table-print header-table full-width q-mb-xs">
          <tbody>
            <tr>
              <td width="50%">
                <strong>Jam tiba di kamar operasi:</strong> {{ item?.pre_jam_tiba || '-' }}
              </td>
              <td width="50%">
                <strong>Jam keluar dari Ruang Operasi:</strong> {{ item?.paska_jam_keluar || '-' }}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Ruang Rawat:</strong> {{ item?.ruang_rawat || pasien?.ruang || pasien?.ruangan || '-' }}
              </td>
              <td>
                <strong>Tanggal Operasi:</strong> {{ item?.created_at ? dateFullFormat(item.created_at) : '-' }}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Urutan Jadwal Operasi:</strong> {{ item?.pre_urutan_jadwal || '-' }}
              </td>
              <td>
                <strong>Lokasi Operasi (Sisi):</strong> 
                <span class="q-ml-xs">
                  [{{ item?.paska_lokasi_sisi === 'Kanan' ? '✓' : ' ' }}] Kanan &nbsp;&nbsp;
                  [{{ item?.paska_lokasi_sisi === 'Kiri' ? '✓' : ' ' }}] Kiri &nbsp;&nbsp;
                  [{{ item?.paska_lokasi_sisi === 'Keduanya' ? '✓' : ' ' }}] Keduanya
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Main 2-Column Table: PRE OPERASI (Kiri) & PASKA OPERASI (Kanan) -->
        <table class="table-print main-table full-width">
          <thead>
            <tr class="bg-grey-3">
              <th width="50%" class="text-center text-weight-bold text-uppercase">PRE OPERASI</th>
              <th width="50%" class="text-center text-weight-bold text-uppercase">PASKA OPERASI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <!-- Kiri: PRE OPERASI -->
              <td class="align-top q-pa-xs">
                <table class="table-print sub-table full-width">
                  <thead>
                    <tr class="bg-grey-2">
                      <th width="8%" class="text-center">No</th>
                      <th width="54%">Kelengkapan</th>
                      <th width="10%" class="text-center">Ya</th>
                      <th width="10%" class="text-center">Tdk</th>
                      <th width="18%">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="master in store.checklistMasters" :key="master.kode">
                      <td class="text-center text-weight-bold">{{ master.no }}</td>
                      <td>{{ master.label }}</td>
                      <td class="text-center text-weight-bold">
                        {{ isStatusYa(item?.checklist, master.kode) ? '✓' : '' }}
                      </td>
                      <td class="text-center text-weight-bold">
                        {{ isStatusTidak(item?.checklist, master.kode) ? '✓' : '' }}
                      </td>
                      <td class="f-9">{{ getKeterangan(item?.checklist, master.kode) }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Catatan Pre Op -->
                <div class="border-top-print q-mt-xs q-pt-xs f-9">
                  <strong>Catatan Pre-Op:</strong>
                  <div class="f-9 text-italic" style="min-height: 15px;">{{ item?.catatan || '-' }}</div>
                </div>
              </td>

              <!-- Kanan: PASKA OPERASI -->
              <td class="align-top q-pa-xs">
                <table class="table-print sub-table full-width">
                  <thead>
                    <tr class="bg-grey-2">
                      <th width="8%" class="text-center">No</th>
                      <th width="54%">Kelengkapan</th>
                      <th width="10%" class="text-center">Ya</th>
                      <th width="10%" class="text-center">Tdk</th>
                      <th width="18%">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="master in store.checklistMastersPaska" :key="master.kode">
                      <td class="text-center text-weight-bold">{{ master.no }}</td>
                      <td>{{ master.label }}</td>
                      <td class="text-center text-weight-bold">
                        {{ isStatusYa(item?.paska_checklist, master.kode) ? '✓' : '' }}
                      </td>
                      <td class="text-center text-weight-bold">
                        {{ isStatusTidak(item?.paska_checklist, master.kode) ? '✓' : '' }}
                      </td>
                      <td class="f-9">{{ getKeterangan(item?.paska_checklist, master.kode) }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Gambar Penandaan Lokasi Operasi (Anatomi Tubuh WebP) -->
                <div class="border-top-print q-mt-xs q-pt-xs">
                  <div class="text-weight-bold text-center f-9 q-mb-xs">PENANDAAN LOKASI OPERASI</div>
                  <div class="relative-position bg-white border-print overflow-hidden q-mx-auto" style="width: 100%; aspect-ratio: 1024 / 608;">
                    <!-- Latar Belakang WebP Anatomi Tubuh (Male/Female) -->
                    <img :src="bodyMarkerImg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: fill; z-index: 1;" />
                    <!-- Overlay Coretan WebP Penandaan Transparan Pasien -->
                    <img v-if="item?.paska_gambar_penandaan" :src="item.paska_gambar_penandaan" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: fill; z-index: 2;" />
                  </div>

                  <!-- Keterangan Gambar -->
                  <div class="f-8 text-grey-9 q-mt-xs line-height-tight" style="font-size: 7.5px;">
                    <strong>Keterangan gambar:</strong><br />
                    1. Area/sisi tubuh yang dilakukan tindakan operasi<br />
                    2. Beri tanda panah (&rarr;) guna mendeskripsikan secara singkat tindakan operasi<br />
                    3. Penulisan tindakan operasi harus singkat, jelas & akurat
                  </div>
                </div>

                <!-- Catatan Paska Op -->
                <div class="border-top-print q-mt-xs q-pt-xs f-9">
                  <strong>Catatan Paska-Op:</strong>
                  <div class="f-9 text-italic" style="min-height: 15px;">{{ item?.paska_catatan || '-' }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tabel Tanda Tangan Lurus 4 Kolom (Pre & Paska Op Sejajar Lurus di Bawah Dokumen) -->
        <table class="table-print ttd-table full-width q-mt-xs text-center f-9">
          <thead>
            <tr class="bg-grey-2">
              <th colspan="2" width="50%" class="text-center text-weight-bold">Nama & Tanda Tangan Petugas Pre-Op</th>
              <th colspan="2" width="50%" class="text-center text-weight-bold">Nama & Tanda Tangan Petugas Paska-Op</th>
            </tr>
            <tr class="bg-grey-1">
              <th width="25%">Pengantar (Ruangan)</th>
              <th width="25%">Penerima (Kamar OK)</th>
              <th width="25%">Pengantar (Kamar OK)</th>
              <th width="25%">Penerima (Ruangan)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <!-- Pre-Op Pengantar -->
              <td style="height: 54px; vertical-align: bottom;" class="q-pa-xs text-center">
                <div v-if="item?.petugas_pengantar" class="flex flex-center q-mb-xs">
                  <div style="width: 42px; height: 42px;">
                    <vue-qrcode :value="qrUrl(item.petugas_pengantar)" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }" />
                  </div>
                </div>
                <strong>{{ item?.petugas_pengantar_nama || '-' }}</strong>
              </td>
              <!-- Pre-Op Penerima -->
              <td style="height: 54px; vertical-align: bottom;" class="q-pa-xs text-center">
                <div v-if="item?.petugas_penerima" class="flex flex-center q-mb-xs">
                  <div style="width: 42px; height: 42px;">
                    <vue-qrcode :value="qrUrl(item.petugas_penerima)" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }" />
                  </div>
                </div>
                <strong>{{ item?.petugas_penerima_nama || '-' }}</strong>
              </td>
              <!-- Paska-Op Pengantar -->
              <td style="height: 54px; vertical-align: bottom;" class="q-pa-xs text-center">
                <div v-if="item?.paska_petugas_pengantar" class="flex flex-center q-mb-xs">
                  <div style="width: 42px; height: 42px;">
                    <vue-qrcode :value="qrUrl(item.paska_petugas_pengantar)" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }" />
                  </div>
                </div>
                <strong>{{ item?.paska_petugas_pengantar_nama || '-' }}</strong>
              </td>
              <!-- Paska-Op Penerima -->
              <td style="height: 54px; vertical-align: bottom;" class="q-pa-xs text-center">
                <div v-if="item?.paska_petugas_penerima" class="flex flex-center q-mb-xs">
                  <div style="width: 42px; height: 42px;">
                    <vue-qrcode :value="qrUrl(item.paska_petugas_penerima)" tag="svg" :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }" />
                  </div>
                </div>
                <strong>{{ item?.paska_petugas_penerima_nama || '-' }}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer Petunjuk Pengisian -->
        <div class="f-8 text-grey-8 q-mt-xs border-top-print q-pt-xs">
          <strong>Petunjuk pengisian:</strong> Beri tanda (✓) bila dilakukan, (-) bila tidak dilakukan. Bila ada catatan yang perlu ditambah bisa mengisi pada kolom catatan.
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.font-print {
  font-family: 'Arial', sans-serif;
  font-size: 11px;
}
.f-8 { font-size: 8px; }
.f-9 { font-size: 9px; }
.f-10 { font-size: 10px; }
.line-height-tight { line-height: 1.18; }
.border-print { border: 1px solid #000; }
.border-bottom-double { border-bottom: 3px double #000; }
.border-top-print { border-top: 1px solid #000; }

.table-print {
  border-collapse: collapse;
  width: 100%;
}
.table-print th,
.table-print td {
  border: 1px solid #000;
  padding: 2px 4px;
  line-height: 1.18;
}
.align-top { vertical-align: top; }
.align-bottom { vertical-align: bottom; }
</style>

<!-- Style un-scoped khusus untuk menyembunyikan seluruh Layout/Sidebar Quasar saat cetak -->
<style>
@media print {
  body, html {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  /* Sembunyikan seluruh komponen Quasar Layout, Header, Sidebar, Drawer, Backdrop secara global */
  .q-header,
  .q-footer,
  .q-drawer,
  .q-drawer-container,
  .q-page-container > header,
  .q-page-container > div:not(.print-area),
  .q-menu,
  .q-backdrop,
  .q-notifications,
  .no-print {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    width: 0 !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  /* HANYA .print-area yang tampil bersih melayang paling atas */
  .print-area {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 210mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
    visibility: visible !important;
    z-index: 99999 !important;
  }

  .print-area * {
    visibility: visible !important;
  }

  @page {
    size: A4 portrait;
    margin: 4mm;
  }
}
</style>
