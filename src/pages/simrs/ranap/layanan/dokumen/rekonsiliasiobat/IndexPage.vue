<script setup>
import { computed } from 'vue'
import { pathImg } from 'src/boot/axios'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

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

const getImageUrl = (img) => {
  if (!img) return ''
  if (img.startsWith('data:image')) {
    return img
  }
  return pathImg + img
}

const listMrs = computed(() => {
  const all = props.pasien?.rekonsiliasiobats || []
  return all.filter(x => x.tipe === 'mrs')
})

const listPindah = computed(() => {
  const all = props.pasien?.rekonsiliasiobats || []
  return all.filter(x => x.tipe === 'pindah')
})

const listKrs = computed(() => {
  const all = props.pasien?.rekonsiliasiobats || []
  return all.filter(x => x.tipe === 'krs')
})

const persetujuan = computed(() => {
  return props.pasien?.rekonsiliasi_obat_persetujuan ?? null
})

const hasData = computed(() => {
  return listMrs.value.length > 0 || listPindah.value.length > 0 || listKrs.value.length > 0 || persetujuan.value !== null
})

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

const printObj = {
  id: 'print-rekonsiliasiobat-doc',
  popTitle: 'Rekonsiliasi Obat Pasien'
}
</script>

<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN REKONSILIASI OBAT (RM IRNA 41)</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="hasData">
            Tersimpan
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="hasData">
          <q-btn
            v-print="printObj"
            color="indigo-10"
            icon="print"
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
      
      <!-- Empty Placeholder -->
      <div v-if="!hasData" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders border-panel shadow-1" style="max-width: 500px;">
        <q-icon name="history_edu" size="64px" class="q-mb-sm text-indigo-10" />
        <div class="text-bold text-subtitle1 text-indigo-10">Belum Ada Dokumen</div>
        <div class="text-caption text-grey-7 q-mt-xs">Rekonsiliasi obat & lembar persetujuan sentralisasi belum diisi oleh petugas Farmasi.</div>
      </div>

      <!-- Printable A4 sheet -->
      <div v-else id="print-rekonsiliasiobat-doc" class="bg-white print-area q-pa-md shadow-3 text-black font-body font-print border-print" style="width: 210mm; min-height: 297mm; box-sizing: border-box; font-size: 11px;">
        
        <!-- Kop Surat Standard RS -->
        <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['REKONSILIASI OBAT', 'RAWAT INAP']" />

        <!-- Patient Profile -->
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
          DOKUMEN REKONSILIASI OBAT PASIEN (RM IRNA 41)
        </div>

        <!-- Section I: Sebelum MRS -->
        <div class="q-mt-sm">
          <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print" style="font-size: 10px;">
            I. Penggunaan Obat Sebelum MRS (Medications Brought from Home)
          </div>
          <table class="table-print full-width q-mt-xs text-center f-9">
            <thead>
              <tr class="bg-grey-2 text-weight-bold">
                <th width="5%">No</th>
                <th width="25%" class="text-left">Nama Obat / Alkes</th>
                <th width="15%">Dosis / Kekuatan</th>
                <th width="15%">Lama Pemakaian</th>
                <th width="10%">Dibawa MRS?</th>
                <th width="10%">Lanjut Ranap?</th>
                <th width="10%">Lanjut KRS?</th>
                <th width="15%">Ruangan / Petugas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!listMrs.length">
                <td colspan="8" class="text-center text-grey-6 py-sm">Tidak ada data obat sebelum MRS</td>
              </tr>
              <tr v-for="(item, index) in listMrs" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td class="text-left">{{ item.nama_obat }}</td>
                <td>{{ item.dosis }}</td>
                <td>{{ item.lama_pakai }}</td>
                <td>{{ item.dibawa_saat_mrs }}</td>
                <td>{{ item.berlanjut_ke_ranap }}</td>
                <td>{{ item.berlanjut_saat_krs }}</td>
                <td>
                  <div class="f-8 text-bold">{{ item.nama_ruangan }}</div>
                  <div class="f-8 text-grey-7">{{ item.user_petugas?.nama || '-' }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section II: Pindah Ruangan -->
        <div class="q-mt-sm">
          <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print" style="font-size: 10px;">
            II. Rekonsiliasi Saat Pindah Ruangan
          </div>
          <table class="table-print full-width q-mt-xs text-center f-9">
            <thead>
              <tr class="bg-grey-2 text-weight-bold">
                <th width="5%">No</th>
                <th width="20%" class="text-left">Nama Obat / Alkes</th>
                <th width="10%">Dosis</th>
                <th width="10%">Frekuensi</th>
                <th width="10%">Cara Pemberian</th>
                <th width="15%">Pemberian Terakhir</th>
                <th width="15%">Tindak Lanjut</th>
                <th width="15%">Ruangan / Petugas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!listPindah.length">
                <td colspan="8" class="text-center text-grey-6 py-sm">Tidak ada data obat pindah ruangan</td>
              </tr>
              <tr v-for="(item, index) in listPindah" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td class="text-left">{{ item.nama_obat }}</td>
                <td>{{ item.dosis }}</td>
                <td>{{ item.frekuensi }}</td>
                <td>{{ item.cara_pemberian }}</td>
                <td>{{ item.waktu_pemberian_terakhir }}</td>
                <td>
                  <div>{{ item.tindak_lanjut }}</div>
                  <div v-if="item.perubahan_aturan_pakai" class="f-8 text-italic text-amber-9">Ubah: {{ item.perubahan_aturan_pakai }}</div>
                </td>
                <td>
                  <div class="f-8 text-bold">{{ item.nama_ruangan }}</div>
                  <div class="f-8 text-grey-7">{{ item.user_petugas?.nama || '-' }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section III: KRS -->
        <div class="q-mt-sm">
          <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print" style="font-size: 10px;">
            III. Rekonsiliasi Saat Pulang (Discharge)
          </div>
          <table class="table-print full-width q-mt-xs text-center f-9">
            <thead>
              <tr class="bg-grey-2 text-weight-bold">
                <th width="5%">No</th>
                <th width="25%" class="text-left">Nama Obat / Alkes</th>
                <th width="15%">Dosis</th>
                <th width="20%">Aturan Pakai</th>
                <th width="20%">Tindak Lanjut</th>
                <th width="15%">Ruangan / Petugas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!listKrs.length">
                <td colspan="6" class="text-center text-grey-6 py-sm">Tidak ada data obat saat pulang</td>
              </tr>
              <tr v-for="(item, index) in listKrs" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td class="text-left">{{ item.nama_obat }}</td>
                <td>{{ item.dosis }}</td>
                <td>{{ item.aturan_pakai }}</td>
                <td>
                  <div>{{ item.rekonsiliasi }}</div>
                  <div v-if="item.aturan_pakai_saat_pulang" class="f-8 text-italic text-amber-9">Aturan: {{ item.aturan_pakai_saat_pulang }}</div>
                </td>
                <td>
                  <div class="f-8 text-bold">{{ item.nama_ruangan }}</div>
                  <div class="f-8 text-grey-7">{{ item.user_petugas?.nama || '-' }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Section IV: Persetujuan Sentralisasi -->
        <div class="q-mt-md" style="page-break-inside: avoid;">
          <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print" style="font-size: 10px;">
            IV. Lembar Pernyataan Persetujuan Sentralisasi Obat
          </div>
          <div v-if="!persetujuan" class="q-pa-sm border-print q-mt-xs text-center text-grey-6 rounded-borders">
            Tidak ada data persetujuan sentralisasi obat yang disimpan.
          </div>
          <div v-else class="q-pa-sm border-print q-mt-xs rounded-borders f-10 line-height-normal text-grey-9">
            <div class="text-justify q-mb-sm">
              Yang bertanda tangan di bawah ini, <strong>{{ persetujuan.pernyataan_nama }}</strong>, Lahir tanggal: <strong>{{ persetujuan.pernyataan_tgl_lahir }}</strong>, hubungan dengan pasien adalah <strong>{{ persetujuan.pernyataan_hubungan }}</strong>, beralamat di: <strong>{{ persetujuan.pernyataan_alamat }}</strong>.
            </div>
            <div class="text-justify q-mb-sm">
              Dengan ini menyatakan persetujuan untuk dilakukannya tindakan sentralisasi obat yang dibawa sendiri dari rumah dan disimpan di ruang perawat untuk pasien: 
              <strong>{{ persetujuan.pasien_nama }}</strong> (No. RM: <strong>{{ persetujuan.pasien_norm }}</strong>), yang beralamat di: <strong>{{ persetujuan.pasien_alamat }}</strong>.
            </div>

            <!-- Signatures Row -->
            <q-separator class="q-my-sm" />
            <div class="row text-center q-mt-sm">
              <div class="col-4">
                <div class="text-weight-bold">Yang Menyatakan</div>
                <div class="q-my-xs flex flex-center" style="height: 50px;">
                  <img v-if="persetujuan.ttd_yang_menyatakan" :src="getImageUrl(persetujuan.ttd_yang_menyatakan)" style="max-height: 45px; max-width: 100%; object-fit: contain;" />
                  <div v-else class="text-grey-4 text-italic f-8">Belum Tanda Tangan</div>
                </div>
                <div class="text-weight-bold text-black border-top-dotted q-pt-xs q-mx-sm">{{ persetujuan.pernyataan_nama }}</div>
              </div>

              <div class="col-4">
                <div class="text-weight-bold">Saksi I (Petugas)</div>
                <div class="q-my-xs flex flex-center" style="height: 50px;">
                  <img v-if="persetujuan.ttd_saksi" :src="getImageUrl(persetujuan.ttd_saksi)" style="max-height: 45px; max-width: 100%; object-fit: contain;" />
                  <div v-else class="text-grey-4 text-italic f-8">Belum Tanda Tangan</div>
                </div>
                <div class="text-weight-bold text-black border-top-dotted q-pt-xs q-mx-sm">{{ persetujuan.user_petugas?.nama || 'Petugas Saksi' }}</div>
              </div>

              <div class="col-4">
                <div class="text-weight-bold">Saksi II (Keluarga)</div>
                <div class="q-my-xs flex flex-center" style="height: 50px;">
                  <img v-if="persetujuan.ttd_saksi_2" :src="getImageUrl(persetujuan.ttd_saksi_2)" style="max-height: 45px; max-width: 100%; object-fit: contain;" />
                  <div v-else class="text-grey-4 text-italic f-8">Belum Tanda Tangan</div>
                </div>
                <div class="text-weight-bold text-black border-top-dotted q-pt-xs q-mx-sm">Saksi Keluarga</div>
              </div>
            </div>

            <!-- Room and Date Footer -->
            <div class="row justify-between items-center q-mt-sm f-9 text-grey-7 border-top-print q-pt-xs">
              <div>Petugas Saksi: <strong>{{ persetujuan.user_petugas?.nama || '-' }}</strong> ({{ persetujuan.nama_ruangan }})</div>
              <div>Tanggal Cetak: {{ formatDateTime(persetujuan.created_at) }}</div>
            </div>
          </div>
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
.line-height-normal { line-height: 1.3; }
.border-print { border: 1px solid #000; }
.border-bottom-double { border-bottom: 3px double #000; }
.border-top-print { border-top: 1px solid #000; }
.border-top-dotted { border-top: 1px dotted #000; }

.table-print {
  border-collapse: collapse;
  width: 100%;
}
.table-print th,
.table-print td {
  border: 1px solid #000;
  padding: 3px 5px;
  line-height: 1.2;
}
</style>

<style>
@media print {
  body, html {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

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

  .q-dialog, .q-dialog__inner {
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
  }

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
    margin: 6mm;
  }
}
</style>
