<template>
  <div v-if="loadingaja" class="column flex-center">
    <div class="text-white">
      Harap Tunggu .....
    </div>
    <div class="text-white">
      Sinkron Data Ke DATABASE
    </div>
  </div>
  <div v-if="pasien?.triage?.length <= 0" class="column flex-center">
    <div class="text-white">
      Belum Ada data tersimpan
    </div>
  </div>
  <div v-else class="full-height">
    <div v-for="(item, n) in lists" :key="n" class="list-move">
      <table class="triage-table q-mt-sm">

        <!-- TANGGAL -->
        <tr>
          <td>TANGGAL TRIASE</td>
          <td>:</td>
          <td>{{ dateFullFormat(item?.tanggal) }}</td>
          <td>JAM TRIASE</td>
          <td>:</td>
          <td>{{ tgltriage(item?.tanggal) }}</td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td colspan="3" class="center bold">DOA</td>
          <td colspan="3" class="center bold">SECONDARY SURVEI</td>
        </tr>

        <!-- TANDA KEHIDUPAN -->
        <tr>
          <td colspan="3" rowspan="5">
            Tanda Kehidupan : {{ item?.doa ?? '-' }}
          </td>
          <td colspan="2" class="center">Tanda Tanda Vital</td>
          <td class="center">SKOR</td>
        </tr>

        <tr>
          <td>Nadi</td>
          <td>: {{ item?.nadi ?? '-' }} x/mnt</td>
          <td class="center">{{ item?.scorenadi ?? '-' }}</td>
        </tr>

        <tr>
          <td>Pernapasan</td>
          <td>: {{ item?.pernapasanx ?? '-' }} x/mnt</td>
          <td class="center">{{ item?.scorepernapasanx ?? '-' }}</td>
        </tr>

        <tr>
          <td>Sistole</td>
          <td>: {{ item?.sistole ?? '-' }} mmHg</td>
          <td class="center">{{ item?.scoresistole ?? '-' }}</td>
        </tr>

        <tr>
          <td>Diastole</td>
          <td>: {{ item?.diastole ?? '-' }} mmHg</td>
          <td class="center">{{ item?.scorediastole ?? '-' }}</td>
        </tr>

        <!-- PRIMARY -->
        <tr>
          <td colspan="3" class="center bold">PRIMARY SURVEI</td>
          <td>Suhu</td>
          <td>: {{ item?.suhu ?? '-' }} °C</td>
          <td class="center">{{ item?.scoresuhu ?? '-' }}</td>
        </tr>

        <tr>
          <td colspan="3" rowspan="2">
            Jalan Napas : {{ item?.jalannapas ?? '-' }}
          </td>
          <td>SpO2</td>
          <td>: {{ item?.spo2 ?? '-' }} %</td>
          <td class="center">{{ item?.scorespo2 ?? '-' }}</td>
        </tr>

        <tr>
          <td>Kesadaran</td>
          <td>: {{ item?.kesadaran ?? '-' }}</td>
          <td class="center">{{ item?.scorekesadaran ?? '-' }}</td>
        </tr>

        <tr>
          <td colspan="3" rowspan="2">
            Pernafasan : {{ item?.pernapasanq ?? '-' }}
          </td>
          <td>Eye/Verbal/Motorik</td>
          <td>: {{ item?.eye ?? '-' }}/{{ item?.verbal ?? '-' }}/{{ item?.motorik ?? '-' }}</td>
          <td></td>
        </tr>

        <tr>
          <td>Nyeri</td>
          <td>: {{ item?.nyeri ?? '-' }}</td>
          <td class="center">{{ item?.scorenyeri ?? '-' }}</td>
        </tr>

        <tr>
          <td colspan="3" rowspan="2">
            Sirkulasi : {{ item?.sirkulasi ?? '-' }}
          </td>
          <td>Lochea</td>
          <td>: {{ item?.lochea ?? '-' }}</td>
          <td class="center">{{ item?.scorelochea ?? '-' }}</td>
        </tr>

        <tr>
          <td>Protein Urine</td>
          <td>: {{ item?.proteinurin ?? '-' }}</td>
          <td class="center">{{ item?.scoreproteinurin ?? '-' }}</td>
        </tr>

        <tr>
          <td colspan="3">
            Disability : {{ item?.disability ?? '-' }}
          </td>
          <td colspan="2" class="right">Jumlah</td>
          <td class="center">{{ item?.totalscore ?? '-' }}</td>
        </tr>

        <!-- KATEGORI -->
        <tr>
          <td>BB : {{ item?.bb ?? '-' }} Kg</td>
          <td colspan="2">Riwayat Alergi :</td>
          <td>{{ props.pasien?.anamnesis?.[0]?.riwayatalergi ?? '-' }}</td>
          <td rowspan="5" class="center bold">KATEGORI TRIASE</td>
          <td rowspan="5" class="center bold">{{ item?.kategoritriage ?? '-' }}</td>
        </tr>

        <tr>
          <td></td>
          <td colspan="2">Keterangan Alergi :</td>
          <td>{{ props.pasien?.anamnesis?.[0]?.keteranganalergi ?? '-' }}</td>
        </tr>

        <tr>
          <td>TB : {{ item?.tb ?? '-' }} Cm</td>
          <td colspan="2"></td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td colspan="2">Gangguan Perilaku :</td>
          <td>{{ item?.gangguanperilaku ?? '-' }}</td>
        </tr>

        <tr>
          <td colspan="1">Hamil : {{ hamil(item?.flaghamil) }}</td>
          <td colspan="2"></td>
          <td colspan="1"></td>
        </tr>

        <tr>
          <td colspan="1">HPHT : {{ item?.haidterakir ?? '-' }}</td>
          <td colspan="5" rowspan="4">
            Anamnesa : {{ props.pasien?.anamnesis?.[0]?.rs4 ?? '-' }}
          </td>
        </tr>

        <tr>
          <td>G : {{ item?.gravida ?? '-' }}</td>
        </tr>
        <tr>
          <td>P : {{ item?.partus ?? '-' }}</td>
        </tr>

        <tr>
          <td>A : {{ item?.abortus ?? '-' }}</td>
        </tr>

        <tr>
          <td colspan="6">Jam Serah Terima :</td>
        </tr>

      </table>
      <div class="row q-mt-xl q-mb-xl">
        <div class="col-6">
          <div class="text-center text-weight-bold">
            Pasien/Keluarga
          </div>
          <div class="text-center" style="height: 120px;">
            <div class="signature-line">(..........................)</div>
          </div>
        </div>
        <div class="col-6">
          <div class="text-center text-weight-bold">
            Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
          </div>
          <div class="text-center text-weight-bold q-mt-xs">
            Dokter
          </div>
          <div class="column flex-center q-mt-md">
            <div style="width: 100px;">
              <vue-qrcode :value="qrUrl" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff'
                },
                margin: 0
              }" />
            </div>
            <div class="q-mt-sm text-weight-bold text-center">
              {{ pasien?.dokter }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup>
import { date } from 'quasar';
import { dateFullFormat } from 'src/modules/formatter';
import { computed } from 'vue';

const loadingaja = false
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const qrUrl = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Reseume-Medis.png'
  const asal = 'RAWAT JALAN'
  const enc = btoa(`${noreg}|${dok}|${asal}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})

const lists = computed(() => {
  const arr = props.pasien?.triage
  return arr?.sort((a, b) => { return b.id - a.id })
})

function tgltriage(val) {
  const x = val.split(' ')
  console.log('val', x)
  return x[1]
}

function hamil(val) {
  if (val === '0') {
    return 'Tidak'
  } else {
    return 'Ya'
  }
}
</script>
<style scoped>
.triage-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.triage-table td {
  border: 1px solid #000;
  padding: 4px;
  vertical-align: top;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}

.bold {
  font-weight: bold;
}

.resume-scroll {
  max-height: 100vh;
  overflow-y: auto;
  padding-bottom: 80px;
  /* penting buat kasih ruang tanda tangan */
}

.signature-line {
  padding-top: 95px;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 5mm;
  }

  .triage-table {
    font-size: 10px;
  }

  .triage-table td {
    padding: 2px;
  }

  table {
    page-break-inside: avoid;
  }
}
</style>
