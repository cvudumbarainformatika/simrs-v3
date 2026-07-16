<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal v-if="!history" title1="SKOR ALDRETE" title2="" />

        <div v-if="!history" class="biodata-pasien q-my-md">
          <div class="flex justify-between">
            <div class="flex q-gutter-md kiri">
              <div style="width: 58px;" class="text-weight-bold">
                NO. RM
              </div>
              <div style="width: 70px;">
                : {{ pasien?.norm }}
              </div>
              <div class="text-weight-bold">
                NAMA PASIEN
              </div>
              <div>
                : {{ pasien?.nama_panggil }}
              </div>
            </div>
            <div class="flex q-gutter-md kanan">
              <div class="text-weight-bold">
                TGL. LAHIR
              </div>
              <div>
                : {{ dateFullFormat(pasien?.tgllahir) }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="column full-width">
              <div>
                <span class="q-mr-lg text-weight-bold">ALAMAT</span> : {{ pasien?.alamat ?? '-' }}
              </div>
            </div>
          </div>
        </div>

        <div class="dokumen-content q-mb-md">
          <!-- TABLE 1: ALDRETE MATRIX GRID -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="100" class="text-weight-bold title-th bg-grey-3">MATRIKS PENILAIAN SKOR ALDRETE</th>
              </tr>
              <tr class="bg-grey-2">
                <th width="30%">Kriteria Penilaian</th>
                <th v-for="(log, idx) in store.aldreteLogs" :key="'h-' + idx" class="text-center">
                  Waktu: {{ log.waktu }}
                </th>
                <th v-if="!store.aldreteLogs?.length" class="text-center text-grey">Belum Ada Data Penilaian</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="store.aldreteLogs?.length">
                <td class="text-weight-bold">Oksigenasi</td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'oks-' + idx" class="text-center">
                  {{ log.oksigenasi }}
                </td>
              </tr>
              <tr v-if="store.aldreteLogs?.length">
                <td class="text-weight-bold">Aktifitas</td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'akt-' + idx" class="text-center">
                  {{ log.aktifitas }}
                </td>
              </tr>
              <tr v-if="store.aldreteLogs?.length">
                <td class="text-weight-bold">Pernafasan</td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'nap-' + idx" class="text-center">
                  {{ log.pernafasan }}
                </td>
              </tr>
              <tr v-if="store.aldreteLogs?.length">
                <td class="text-weight-bold">Sirkulasi</td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'sir-' + idx" class="text-center">
                  {{ log.sirkulasi }}
                </td>
              </tr>
              <tr v-if="store.aldreteLogs?.length">
                <td class="text-weight-bold">Kesadaran</td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'kes-' + idx" class="text-center">
                  {{ log.kesadaran }}
                </td>
              </tr>
              <tr v-if="store.aldreteLogs?.length" class="bg-yellow-1 text-weight-bold">
                <td>TOTAL SKOR ALDRETE</td>
                <td v-for="(log, idx) in store.aldreteLogs" :key="'tot-' + idx" class="text-center text-primary">
                  {{ log.total }}
                </td>
              </tr>
              <tr v-else>
                <td colspan="100" class="text-center text-grey q-pa-md">Tidak ada log data Aldrete yang tercatat</td>
              </tr>
            </tbody>
          </table>

          <!-- CRITERIA BANNER (MEDICALLY FORMAL) -->
          <div class="q-mb-md border-box q-pa-sm bg-grey-1" style="border: 1px solid #000; font-size: 10px;">
            <div class="text-weight-bold">Kriteria Pemindahan Pasca Anestesi:</div>
            <ul class="q-my-none q-pl-md">
              <li>Skor 7 - 10: Pasien diperbolehkan dipindahkan ke ruang perawatan semula.</li>
              <li>Skor 6 ke bawah: Pasien dipindahkan ke ruang Intensive Care Unit (ICU).</li>
              <li>Maksimal waktu pemantauan di Ruang Pemulihan (RR) adalah selama 2 jam.</li>
            </ul>
          </div>

          <!-- TABLE 2: DATA KELUAR RUANG PEMULIHAN -->
          <table class="doc-table">
            <thead>
              <tr>
                <th colspan="4" class="text-weight-bold title-th bg-grey-3">PARAMETER KELUAR RUANG PEMULIHAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="25%" class="text-weight-bold">Jam Masuk RR</td>
                <td width="25%">{{ store.formKeluar?.jam_masuk || '-' }}</td>
                <td width="25%" class="text-weight-bold">Jam Keluar RR</td>
                <td width="25%">{{ store.formKeluar?.jam_keluar || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Tekanan Darah Keluar</td>
                <td>
                  {{ store.formKeluar?.td_sistolik && store.formKeluar?.td_diastolik ? store.formKeluar.td_sistolik + '/' + store.formKeluar.td_diastolik + ' mmHg' : '-' }}
                </td>
                <td class="text-weight-bold">Nadi / HR Keluar</td>
                <td>{{ store.formKeluar?.nadi ? store.formKeluar.nadi + ' x/menit' : '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Respirasi (RR) Keluar</td>
                <td>{{ store.formKeluar?.rr ? store.formKeluar.rr + ' x/menit' : '-' }}</td>
                <td class="text-weight-bold">Infus</td>
                <td>{{ store.formKeluar?.infus || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Urine</td>
                <td>{{ store.formKeluar?.urine || '-' }}</td>
                <td class="text-weight-bold">Muntah</td>
                <td>{{ store.formKeluar?.muntah || '-' }}</td>
              </tr>
              <tr>
                <td class="text-weight-bold">Dipindahkan Ke</td>
                <td colspan="3">{{ formatDipindahKe() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Signature Section -->
        <div class="row q-mt-xl justify-around">
          <div class="col-4 text-center">
            <div class="text-weight-bold q-mb-sm">Penata Anestesi</div>
            <div v-if="qrPenata" style="height: 90px; width: 90px; margin: 0 auto;" class="q-mb-sm">
              <vue-qrcode :value="qrPenata" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
            <div style="text-decoration: underline;" class="text-weight-bold">
              {{ penataAnestesi?.nama || 'Nama Penata Anestesi' }}
            </div>
            <div class="f-10">NIP. {{ penataAnestesi?.nip || '-' }}</div>
          </div>

          <div class="col-4 text-center">
            <div class="text-weight-bold q-mb-sm">Dokter Anestesi</div>
            <div v-if="qrDokter" style="height: 90px; width: 90px; margin: 0 auto;" class="q-mb-sm">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
            <div style="text-decoration: underline;" class="text-weight-bold">
              {{ dokterAnestesi?.nama || 'Nama Dokter Anestesi' }}
            </div>
            <div class="f-10">NIP. {{ dokterAnestesi?.nip || '-' }}</div>
          </div>
        </div>

      </div>
    </div>

    <q-btn v-if="!history" ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary"
      class="fixed-bottom-right" style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { useMonitoringSaatStore } from 'src/stores/simrs/kamaroperasi/assasement/monitoringSaat'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'
import { onMounted, ref, computed } from 'vue'
import { dateFullFormat } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  history: {
    type: Boolean,
    default: false
  }
})

const store = useMonitoringSaatStore()
const laporanOp = useLaporanOperasiStore()
const refPrint = ref()

const namaRuangan = computed(() => {
  const code = store.formKeluar?.ruangan
  if (!code) return ''
  const room = store.kamars?.find(k => k.rs1 === code)
  return room ? room.rs2 : code
})

function formatDipindahKe () {
  const dest = store.formKeluar?.dipindah_ke
  if (!dest) return '-'
  if (dest === 'Ruangan' && namaRuangan.value) {
    return `${dest} (${namaRuangan.value})`
  }
  return dest
}

const penataAnestesi = computed(() => {
  const code = store.formKeluar?.penata_anastesi || store.formKeluar?.penata_anestesi || props.pasien?.nakes || ''
  if (!code) return null
  return laporanOp.nakes?.find(x => x.kdpegsimrs === code) || { nama: code, nip: '-' }
})

const dokterAnestesi = computed(() => {
  const code = store.formKeluar?.dokter_anastesi || store.formKeluar?.dokter_anestesi || props.pasien?.pra_induksi?.dokter_anastesi || ''
  if (!code) return null
  return laporanOp.nakes?.find(x => x.kdpegsimrs === code) || { nama: code, nip: '-' }
})

function generateQRUrl (noreg, dokumen, petugas, asal) {
  if (!petugas) return ''
  try {
    const enc = btoa(`${noreg}|${dokumen}|${asal}|${petugas}`)
    return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  } catch (e) {
    return petugas
  }
}

const qrPenata = computed(() => {
  const code = penataAnestesi.value?.kdpegsimrs || penataAnestesi.value?.nip || penataAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Skor Aldrete - Penata', code, 'PENUNJANG')
})

const qrDokter = computed(() => {
  const code = dokterAnestesi.value?.kdpegsimrs || dokterAnestesi.value?.nip || dokterAnestesi.value?.nama || ''
  if (!code) return ''
  return generateQRUrl(props.pasien?.noreg, 'Skor Aldrete - Dokter', code, 'PENUNJANG')
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'SKOR ALDRETE',
  popTitle: 'SKOR ALDRETE'
}

onMounted(async () => {
  if (laporanOp.nakes.length === 0) {
    laporanOp.getNakes()
  }
  await store.getKamars()
  await store.getSkorAldrete(props.pasien)
})
</script>

<style lang="scss" scoped>
.page-legal {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 21.59cm;

  .contentx {
    padding: 10mm;
  }
}

.biodata-pasien {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.f-10 {
  font-size: 10px;
}

.f-12 {
  font-size: 12px;
}

.text-weight-bold {
  font-weight: bold;
}

.doc-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 11px;

  th, td {
    border: 1px solid #000;
    padding: 6px 10px;
    vertical-align: top;
  }

  th {
    background-color: #e0e0e0;
    font-weight: bold;
    text-align: left;
    font-size: 12px;
  }
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;

    .contentx {
      padding: 5mm;
    }
  }

  .hide-on-print {
    display: none;
  }

  @page {
    margin: 10mm;
  }
}
</style>
