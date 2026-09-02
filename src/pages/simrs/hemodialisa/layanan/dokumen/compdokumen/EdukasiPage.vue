<template>
  <q-bar dense class="bg-white q-my-md no-print">
    <q-space />
    <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
      <q-tooltip class="primary" :offset="[10, 10]">
        Print Dokumen Edukasi
      </q-tooltip>
    </q-btn>
  </q-bar>

  <div id="printEdukasiHd" class="bg-white print-page shadow-1 q-pa-md">
    <div class="page-1">
      <!-- KOP SURAT -->
      <div class="col-grow kotak q-mb-sm">
        <div class="row items-center">
          <div class="col-9 sisi-kanan">
            <div class="row q-pa-sm items-center">
              <div class="col-auto">
                <img src="~assets/images/logo-rsud.png" style="width: 75px;">
              </div>
              <div class="col flex-wrap q-px-md text-center">
                <div class="text-weight-bold f-11">
                  PEMERINTAH KOTA PROBOLINGGO
                </div>
                <div class="text-weight-bold f-10">
                  DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
                </div>
                <div class="text-weight-bold f-14">
                  UOBK RSUD DOKTER MOHAMAD SALEH
                </div>
                <div class="f-9 text-grey-9">
                  <div>Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335) 432702</div>
                  <div>E-mail : rsudprob@probolinggokota.go.id | PROBOLINGGO 67219</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3 f-12 q-pa-sm text-center">
            <div class="text-bold">
              CATATAN EDUKASI TERINTEGRASI
            </div>
            <div class="text-bold text-primary q-mt-xs">
              HEMODIALISA
            </div>
          </div>
        </div>
      </div>

      <!-- BIODATA PASIEN -->
      <div class="flex justify-between text-body2 q-mb-xs">
        <div class="q-py-xs text-left">
          <div class="flex q-gutter-sm">
            <div style="width: 100px;" class="text-weight-bold">Nama Pasien</div>
            <div>: {{ pasien?.nama_panggil ?? pasien?.nama ?? pasien?.pasien ?? '-' }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div style="width: 100px;" class="text-weight-bold">Usia</div>
            <div>: {{ pasien?.usia ?? '-' }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div style="width: 100px;" class="text-weight-bold">No. RM</div>
            <div>: {{ pasien?.norm ?? '-' }}</div>
          </div>
        </div>
        <div class="q-py-xs text-left">
          <div class="flex q-gutter-sm">
            <div style="width: 100px;" class="text-weight-bold">Jenis Kelamin</div>
            <div>: {{ pasien?.kelamin ?? '-' }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div style="width: 100px;" class="text-weight-bold">Tgl. Lahir</div>
            <div>: {{ pasien?.tgllahir ?? '-' }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div style="width: 100px;" class="text-weight-bold">No. Reg</div>
            <div>: {{ pasien?.noreg ?? '-' }}</div>
          </div>
        </div>
      </div>
      <div class="row no-wrap q-gutter-sm text-body2 q-mb-sm">
        <div style="width: 100px;" class="col-auto text-weight-bold">Alamat</div>
        <div class="col">: {{ pasien?.alamat ?? '-' }}</div>
      </div>

      <hr class="q-my-sm">

      <!-- CONTENT -->
      <div v-if="!EDUKASI?.length && !EDUKASIC" class="q-pa-md column full-height flex-center" style="min-height: 300px;">
        <div class="text-weight-bold text-center text-grey-7">
          BELUM TERSEDIA CATATAN EDUKASI TERINTEGRASI
        </div>
      </div>
      <div v-else class="full-width">
        <!-- SECTION A & B -->
        <div class="q-mb-md">
          <div class="flex q-gutter-sm text-bold text-subtitle2 text-primary">
            <div>A. </div>
            <div>ASESMEN KEBUTUHAN EDUKASI</div>
          </div>
          <div class="text-bold q-mt-xs q-mb-xs">Data Pasien :</div>
          <div class="row q-col-gutter-y-xs q-pl-md">
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 150px;">1. Tinggal Bersama</div>
              <div>: -</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 150px;">2. Tingkat Pendidikan</div>
              <div>: {{ pasien?.pendidikan || '-' }}</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 150px;">3. Kemampuan Bahasa</div>
              <div>: {{ pasien?.bahasa || '-' }}</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 150px;">4. Baca & Tulis</div>
              <div>: {{ pasien?.bacatulis === 'YA' ? 'BISA' : 'TIDAK' }}</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 150px;">5. Agama</div>
              <div>: {{ pasien?.agama || '-' }}</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 150px;">6. Nilai & Budaya</div>
              <div>: -</div>
            </div>
            <div class="col-12 flex q-gutter-sm">
              <div style="width: 150px;">7. Hambatan</div>
              <div>: {{ pasien?.hambatan || '-' }}</div>
            </div>
          </div>

          <div class="flex q-gutter-sm text-bold text-subtitle2 text-primary q-mt-md">
            <div>B. </div>
            <div>PERENCANAAN EDUKASI</div>
          </div>
          <div class="row q-col-gutter-y-xs q-pl-md q-mt-xs">
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 180px;">1. Perlu Penerjemah</div>
              <div>: {{ EDUKASIC?.perlupenerjemah || '-' }}</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 180px;">2. Bahasa Isyarat</div>
              <div>: {{ EDUKASIC?.bahasaisyarat || '-' }}</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 180px;">3. Cara Edukasi</div>
              <div>: {{ EDUKASIC?.caraedukasi || '-' }}</div>
            </div>
            <div class="col-12 col-md-6 flex q-gutter-sm">
              <div style="width: 180px;">4. Kesediaan Menerima</div>
              <div>: {{ EDUKASIC?.kesediaan || '-' }}</div>
            </div>
            <div class="col-12 row items-start q-gutter-x-sm no-wrap q-mt-xs">
              <div class="col-auto" style="width: 180px;">5. Kebutuhan Edukasi</div>
              <div class="col">
                <div>: {{ EDUKASIC?.kebutuhanedukasi || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="kotak f-10 q-pa-sm q-mt-sm bg-grey-1">
            <div class="text-bold">Catatan Edukasi:</div>
            <div class="row items-start q-gutter-xs">
              <div class="col-auto">1.</div>
              <div class="col">
                <em>Pemberi edukasi adalah semua petugas rumah sakit yang melayani pasien (dokter, perawat, ahli gizi, apoteker, fisioterapis, dan tenaga kesehatan lainnya).</em>
              </div>
            </div>
            <div class="row items-start q-gutter-xs">
              <div class="col-auto">2.</div>
              <div class="col">
                <em>Edukasi diberikan sesuai kebutuhan pasien berdasarkan pengkajian awal dan rencana penanganan pasien.</em>
              </div>
            </div>
            <div class="row items-start q-gutter-xs">
              <div class="col-auto">3.</div>
              <div class="col">
                <em>Pemberian edukasi dicatat kemudian dibubuhi tanda tangan/verifikasi digital pemberi edukasi serta penerima edukasi.</em>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION C: IMPLEMENTASI & EVALUASI -->
        <div class="text-bold text-subtitle2 text-primary q-mb-xs">
          C. IMPLEMENTASI DAN EVALUASI
        </div>
        <table class="table-edukasi" width="100%">
          <thead>
            <tr>
              <th rowspan="2" style="width: 11%;">
                <div>Hari / Tanggal</div>
                <div>Jam</div>
              </th>
              <th rowspan="2" style="width: 10%;">Metode</th>
              <th rowspan="2" style="width: 10%;">Profesi</th>
              <th rowspan="2" style="width: 25%;">Materi Edukasi & Informasi</th>
              <th rowspan="2" style="width: 6%;">Waktu</th>
              <th rowspan="2" style="width: 8%;">Media</th>
              <th rowspan="2" style="width: 10%;">Evaluasi</th>
              <th rowspan="2" style="width: 8%;">Pemahaman</th>
              <th colspan="2" style="width: 12%;">Nama & Tanda Tangan</th>
            </tr>
            <tr>
              <th>Penerima</th>
              <th>Pemberi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!EDUKASI?.length">
              <td colspan="10" class="text-center text-italic q-pa-md text-grey-7">
                Belum ada data implementasi edukasi yang tercatat
              </td>
            </tr>
            <tr v-for="item in EDUKASI" :key="item.id">
              <td class="text-center f-10">
                <div class="text-weight-bold">{{ humanDate(item?.tgl) }}</div>
                <div>pk. {{ jamTnpDetik(item?.tgl) }}</div>
              </td>
              <td class="f-10">
                <div v-if="!item?.metode?.length">-</div>
                <div v-else>
                  <div v-for="metode in item?.metode" :key="metode">{{ metode }}</div>
                </div>
              </td>
              <td class="text-center f-10">
                <div v-if="item?.petugas?.kdgroupnakes">
                  <span class="text-weight-bold">{{ jenisPPA(item?.petugas?.kdgroupnakes) }}</span>
                </div>
                <div v-else>-</div>
              </td>
              <td class="f-10">
                <div v-if="!item?.materi?.length">-</div>
                <div v-else>
                  <ul class="q-pl-sm q-my-none">
                    <li v-for="mat in item?.materi" :key="mat">{{ mat }}</li>
                  </ul>
                </div>
                <div v-if="item?.materiLain" class="text-italic q-mt-xs text-grey-8" v-html="getNewLine(item?.materiLain)" />
              </td>
              <td class="text-center f-10">
                {{ item?.estimasi || '-' }}
              </td>
              <td class="f-10">
                <div v-if="!item?.media?.length">-</div>
                <div v-else>
                  <div v-for="med in item?.media" :key="med">{{ med }}</div>
                </div>
              </td>
              <td class="f-10">
                {{ item?.evaluasi || '-' }}
              </td>
              <td class="text-center f-10">
                {{ item?.tingkatPemahaman || '-' }}
              </td>
              <td class="text-center" style="vertical-align: middle;">
                <div v-if="item?.ttdPenerima" class="column flex-center" style="min-width: 55px;">
                  <img :src="pathImg + item?.ttdPenerima" alt="ttd-penerima" style="max-width: 50px; max-height: 40px;">
                  <div class="f-8 text-wrap text-center text-weight-bold">{{ item?.namaPenerima }}</div>
                </div>
                <div v-else>-</div>
              </td>
              <td class="text-center" style="vertical-align: middle;">
                <div class="column flex-center" style="min-width: 55px;">
                  <div class="relative-position q-my-xs">
                    <vue-qrcode :value="qrPetugas(item?.petugas)" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: { dark: '#000000', light: '#ffffff' },
                      margin: 0,
                      width: 50
                    }" />
                  </div>
                  <div class="f-8 text-wrap text-center text-weight-bold">{{ item?.petugas?.nama || '-' }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { getNewLine, humanDate, jamTnpDetik } from 'src/modules/formatter'
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi'
import { pathImg } from 'src/boot/axios'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = useImplementasiEdukasiRanapStore()

onMounted(() => {
  store.getList(props?.pasien)
})

const EDUKASI = computed(() => {
  return store.items
})

const EDUKASIC = computed(() => {
  return props?.pasien?.edukasi?.length ? props?.pasien?.edukasi[0] : null
})

const jenisPPA = (val) => {
  if (val === '1') return 'Dokter'
  if (val === '2') return 'Perawat'
  if (val === '3') return 'Bidan'
  if (val === '4') return 'Apoteker'
  if (val === '5') return 'Ahli Gizi'
  return 'Fisioterapis'
}

const qrPetugas = (user) => {
  const noreg = props?.pasien?.noreg || ''
  const dok = 'KIE_HD.png'
  const asal = 'HEMODIALISA'
  const petugas = user?.kdpegsimrs || ''
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}

const printObj = {
  id: 'printEdukasiHd',
  popTitle: 'Catatan Edukasi Terintegrasi - Hemodialisa'
}
</script>

<style lang="scss" scoped>
table.table-edukasi {
  border-collapse: collapse;
  width: 100%;
  font-size: 11px;
}

table.table-edukasi th,
table.table-edukasi td {
  padding: 6px;
  border: 1px solid black;
}

table.table-edukasi th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: center;
}

.kotak {
  border: 1px solid black;
}

.sisi-kanan {
  border-right: 1px solid black;
}

.print-page {
  background-color: #ffffff;
  padding: 16px;
  font-size: 11px;
  line-height: 1.3;
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-page {
    padding: 0 !important;
    box-shadow: none !important;
  }
  @page {
    size: letter portrait;
    margin: 10mm;
  }
}
</style>
