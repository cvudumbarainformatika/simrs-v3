<script setup>
import { computed } from 'vue'
import { pathImg } from 'src/boot/axios'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  pasien: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

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
  <q-dialog
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    maximized
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-grey-3 fit column">
      <!-- Header Toolbar -->
      <q-card-section class="bg-indigo-10 text-white row items-center justify-between q-py-xs no-print shadow-2">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="print" size="22px" />
          <span class="text-subtitle1 text-weight-bold">Pratinjau Cetak: Rekonsiliasi Obat Pasien</span>
        </div>
        <div class="row items-center q-gutter-x-sm">
          <q-btn
            v-print="printObj"
            color="amber-9"
            text-color="dark"
            icon="print"
            label="Cetak Dokumen"
            no-caps
            class="text-weight-bold shadow-1"
          />
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </div>
      </q-card-section>

      <!-- Print Paper Container -->
      <q-card-section class="col scroll q-pa-md flex justify-center">
        <div id="print-rekonsiliasiobat-doc" class="bg-white print-area q-pa-md shadow-3 text-black text-body2 font-body font-print border-print" style="width: 210mm; min-height: 297mm; box-sizing: border-box;">
          
          <!-- Kop Surat Standard -->
          <AppKopSuratStandard :pasien="pasien" :header="['REKONSILIASI OBAT', 'RAWAT INAP']" />

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

          <div class="text-center text-weight-bold text-subtitle2 uppercase q-my-sm text-black border-bottom-double q-pb-xs">
            DOKUMEN REKONSILIASI OBAT PASIEN (RM IRNA 41)
          </div>

          <!-- Section I: Sebelum MRS -->
          <div class="q-mt-md">
            <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print">
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
                  <td colspan="8" class="text-center text-grey-6 py-md">Tidak ada data obat sebelum MRS</td>
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
          <div class="q-mt-md">
            <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print">
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
                  <td colspan="8" class="text-center text-grey-6 py-md">Tidak ada data obat pindah ruangan</td>
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
          <div class="q-mt-md">
            <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print">
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
                  <td colspan="6" class="text-center text-grey-6 py-md">Tidak ada data obat saat pulang</td>
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
          <div class="q-mt-lg" style="page-break-inside: avoid;">
            <div class="text-bold text-caption text-indigo-10 bg-grey-3 q-px-sm q-py-xs rounded-borders border-print">
              IV. Lembar Pernyataan Persetujuan Sentralisasi Obat
            </div>
            <div v-if="!persetujuan" class="q-pa-md border-print q-mt-xs text-center text-grey-6 rounded-borders">
              Tidak ada data persetujuan sentralisasi obat yang disimpan.
            </div>
            <div v-else class="q-pa-md border-print q-mt-xs rounded-borders f-11 line-height-normal text-grey-9">
              <div class="text-justify q-mb-md">
                Yang bertanda tangan di bawah ini, <strong>{{ persetujuan.pernyataan_nama }}</strong>, Lahir tanggal: <strong>{{ persetujuan.pernyataan_tgl_lahir }}</strong>, hubungan dengan pasien adalah <strong>{{ persetujuan.pernyataan_hubungan }}</strong>, beralamat di: <strong>{{ persetujuan.pernyataan_alamat }}</strong>.
              </div>
              <div class="text-justify q-mb-md">
                Dengan ini menyatakan persetujuan untuk dilakukannya tindakan sentralisasi obat yang dibawa sendiri dari rumah dan disimpan di ruang perawat untuk pasien: 
                <strong>{{ persetujuan.pasien_nama }}</strong> (No. RM: <strong>{{ persetujuan.pasien_norm }}</strong>), yang beralamat di: <strong>{{ persetujuan.pasien_alamat }}</strong>.
              </div>

              <!-- Signatures Row -->
              <q-separator class="q-my-md" />
              <div class="row text-center q-mt-md">
                <div class="col-4">
                  <div class="text-weight-bold">Yang Menyatakan</div>
                  <div class="q-my-sm flex flex-center" style="height: 60px;">
                    <img v-if="persetujuan.ttd_yang_menyatakan" :src="getImageUrl(persetujuan.ttd_yang_menyatakan)" style="max-height: 55px; max-width: 100%; object-fit: contain;" />
                    <div v-else class="text-grey-4 text-italic f-8">Belum Tanda Tangan</div>
                  </div>
                  <div class="text-weight-bold text-black border-top-dotted q-pt-xs q-mx-md">{{ persetujuan.pernyataan_nama }}</div>
                </div>

                <div class="col-4">
                  <div class="text-weight-bold">Saksi I (Petugas)</div>
                  <div class="q-my-sm flex flex-center" style="height: 60px;">
                    <img v-if="persetujuan.ttd_saksi" :src="getImageUrl(persetujuan.ttd_saksi)" style="max-height: 55px; max-width: 100%; object-fit: contain;" />
                    <div v-else class="text-grey-4 text-italic f-8">Belum Tanda Tangan</div>
                  </div>
                  <div class="text-weight-bold text-black border-top-dotted q-pt-xs q-mx-md">{{ persetujuan.user_petugas?.nama || 'Petugas Saksi' }}</div>
                </div>

                <div class="col-4">
                  <div class="text-weight-bold">Saksi II (Keluarga)</div>
                  <div class="q-my-sm flex flex-center" style="height: 60px;">
                    <img v-if="persetujuan.ttd_saksi_2" :src="getImageUrl(persetujuan.ttd_saksi_2)" style="max-height: 55px; max-width: 100%; object-fit: contain;" />
                    <div v-else class="text-grey-4 text-italic f-8">Belum Tanda Tangan</div>
                  </div>
                  <div class="text-weight-bold text-black border-top-dotted q-pt-xs q-mx-md">Saksi Keluarga</div>
                </div>
              </div>

              <!-- Room and Date Footer -->
              <div class="row justify-between items-center q-mt-lg f-9 text-grey-7 border-top-print q-pt-xs">
                <div>Petugas Saksi: <strong>{{ persetujuan.user_petugas?.nama || '-' }}</strong> ({{ persetujuan.nama_ruangan }})</div>
                <div>Tanggal Cetak: {{ formatDateTime(persetujuan.created_at) }}</div>
              </div>
            </div>
          </div>

        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.font-print {
  font-family: 'Arial', sans-serif;
  font-size: 11px;
}
.f-8 { font-size: 8px; }
.f-9 { font-size: 9px; }
.f-10 { font-size: 10px; }
.f-11 { font-size: 11px; }
.line-height-normal { line-height: 1.35; }
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
  line-height: 1.25;
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
