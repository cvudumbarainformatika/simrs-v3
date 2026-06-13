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
  <div v-else class="b full-height">
    <div v-for="(item, n) in lists" :key="n" class="row justify-center full-width list-move">
      <table class="triage-table q-pa-sm" style="width: 97%">

        <!-- TANGGAL -->
        <tr>
          <td>TANGGAL TRIASE</td>
          <td>:</td>
          <td>{{ dateFullFormat(item?.tanggal) }}</td>
          <td>JAM TRIASE</td>
          <td>:</td>
          <td>{{ tgltriage(item?.tanggal) }}</td>
        </tr>

        <tr>
          <td colspan="3" class="center bold">PRIMARY SURVEY</td>
          <td colspan="3" class="center bold">SECONDARY SURVEY</td>
        </tr>

        <tr>
          <td class="center bold">PEMERIKSAAN</td>
          <td class="center bold">RESUSITASI</td>
          <td class="center bold">P1</td>
          <td colspan="2" class="center bold">TANDA-TANDA VITAL</td>
          <td class="center bold">SKOR</td>
        </tr>

        <tr>
          <td rowspan="2">Jalan Napas</td>
          <td rowspan="2">
            <div v-for="pilihan in jalannafas.resusitasi" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'jalannafas', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td rowspan="2">
            <div v-for="pilihan in jalannafas.p1" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'jalannafas', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td>Tensi</td>
          <td>: {{ item?.sistole ?? '-' }} / {{ item?.diastole ?? '-' }} mmHg</td>
          <td class="center">{{ item?.scoresistole ?? '-' }}</td>
        </tr>

        <tr>
          <td>Nadi</td>
          <td>: {{ item?.nadi ?? '-' }} x/mnt</td>
          <td class="center">{{ item?.scorenadi ?? '-' }}</td>
        </tr>
        <tr>
          <td rowspan="2">Pernapasan</td>
          <td rowspan="2">
            <div v-for="pilihan in pernapasan.resusitasi" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'pernapasan', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td rowspan="2">
            <div v-for="pilihan in pernapasan.p1" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'pernapasan', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td>Pernapasan</td>
          <td>: {{ item?.pernapasanx ?? '-' }} x/mnt</td>
          <td class="center">{{ item?.scorepernapasanx ?? '-' }}</td>
        </tr>
        <tr>
          <td>Suhu</td>
          <td>: {{ item?.suhu ?? '-' }} °C</td>
          <td class="center">{{ item?.scoresuhu ?? '-' }}</td>
        </tr>

        <tr>
          <td rowspan="3">Sirkulasi</td>
          <td rowspan="3">
            <div v-for="pilihan in sirkulasi.resusitasi" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'sirkulasi', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td rowspan="3">
            <div v-for="pilihan in sirkulasi.p1" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'sirkulasi', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td>Kesadaran</td>
          <td>: {{ item?.kesadaran ?? '-' }}</td>
          <td class="center">{{ item?.scorekesadaran ?? '-' }}</td>

        </tr>
        <tr>
          <td>SpO2</td>
          <td>: {{ item?.spo2 ?? '-' }} %</td>
          <td class="center">{{ item?.scorespo2 ?? '-' }}</td>
        </tr>
        <tr>
          <td colspan="2" class="text-bold right">Jumlah</td>
          <td class="center">{{ item?.totalscore ?? '-' }}</td>

        </tr>

        <!-- HEADER -->
        <tr>
          <td rowspan="3">Disability</td>
          <td rowspan="3">
            <div v-for="pilihan in disability.resusitasi" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'disability', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td rowspan="3">
            <div v-for="pilihan in disability.p1" :key="pilihan">
              <div class="row q-px-xs">
                <div class="col-auto" style="width:24px">
                  {{ isChecked(item, 'disability', pilihan) ? '☑' : '☐' }}
                </div>
                <div class="col">
                  {{ pilihan }}
                </div>
              </div>
            </div>
          </td>
          <td colspan="3" class="center bold">KATEGORI TRIASE</td>
        </tr>
        <tr>
          <td rowspan="2" colspan="2">
            <div class="row">
              <div class="col">
                <div v-for="pilihan in kategoritriage" :key="pilihan">
                  <div class="row q-px-xs">
                    <div class="col-auto" style="width:24px">
                      {{ isChecked(item, 'kategoritriage', pilihan) ? '☑' : '☐'
                      }}
                    </div>
                    <div class="col">
                      {{ pilihan }}
                      <span v-if="pilihan === 'Resusitasi'" class="q-ml-xs q-mb-sm">: > 7</span>
                      <span v-if="pilihan === 'P1'" class="q-ml-xl q-mb-sm">: 4 - 5 </span>
                      <span v-if="pilihan === 'P2'" class="q-ml-xl q-mb-sm">: 2 - 3 </span>
                      <span v-if="pilihan === 'P3'" class="q-ml-xl q-mb-sm">: 0 - 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td class="center">Skala Nyeri</td>
        </tr>
        <tr>
          <td>
            <div>
              Ket : {{ item?.nyeri ?? '-' }}
            </div>
            <div>
              Skor : {{ item?.scorenyeri ?? '-' }}
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="3" class="center bold">DOA</td>
          <td rowspan="1" class="">Pemeriksaan GDA : </td>
          <td colspan="2" class="">Hamil : {{ hamil(item?.flaghamil) }}</td>
        </tr>
        <tr>
          <td colspan="3">
            <!-- Tanda Kehidupan : {{ item?.doa ?? '-' }} -->
            <div class="row ">
              <div class="col-6">
                Tanda Kehidupan :
              </div>
              <div class="col-6">
                <div v-for="pilihan in store.doak" :key="pilihan">
                  <div class="row q-px-xs">
                    <div class="col-auto" style="width:24px">
                      {{ isChecked(item, 'doa', pilihan) ? '☑' : '☐' }}
                    </div>
                    <div class="col">
                      {{ pilihan }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="col">BB : {{ item?.bb ?? '-' }} Kg</div>
            <div class="col">TB : {{ item?.tb ?? '-' }} Cm</div>
          </td>
          <td colspan="2">
            <div class="col">HPHT : {{ item?.haidterakir ?? '-' }}</div>
            <div class="col">G : {{ item?.gravida ?? '-' }}</div>
            <div class="col">P : {{ item?.partus ?? '-' }}</div>
            <div class="col">A : {{ item?.abortus ?? '-' }}</div>
          </td>
        </tr>

        <tr>
          <td colspan="6">
            <div class="row">
              <div class="col-6">
                Riwayat Alergi :
              </div>
              <div class="col-6">
                <div v-for="pilihan in alergis" :key="pilihan">
                  <div class="row q-px-xs">
                    <div class="col-auto" style="width:24px">
                      {{ CheckedAlergi(pilihan) ? '☑' : '☐'
                      }}
                    </div>
                    <div class="col">
                      {{ pilihan }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div> Keterangan Alergi : {{ props.pasien?.anamnesis?.[0]?.keteranganalergi ?? '-' }}</div>
          </td>
        </tr>

        <tr>
          <td colspan="6">
            <div class="row">
              <div class="col-6">
                Gangguan Perilaku :
              </div>
              <div class="col-6">
                <div v-for="pilihan in gangguanperilaku" :key="pilihan">
                  <div class="row q-px-xs">
                    <div class="col-auto" style="width:24px">
                      {{ isChecked(item, 'gangguanperilaku', pilihan) ? '☑' : '☐' }}
                    </div>
                    <div class="col">
                      {{ pilihan }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            Anamnesa : {{ props.pasien?.anamnesis?.[0]?.rs4 ?? '-' }}
          </td>
        </tr>


        <tr>
          <td colspan="6">Jam Serah Terima : {{ date.formatDate(Date.now(), 'hh:mm:ss') }}</td>
        </tr>

      </table>

    </div>

    <div class="row q-mt-xl q-mb-xl">
      <div class="col-6">
        <div class="text-center text-weight-bold q-pt-xs">
          TIM TRIASE
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
      <div class="col-6">
        <div class="text-center text-weight-bold q-mt-xs">
          TIM P1/P2/P3
        </div>
        <div class="column flex-center q-mt-md">
          <!-- <div style="width: 100px;">
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
          </div> -->
          BELUM ADA DATA PETUGAS DI TRIASE
        </div>
      </div>
    </div>
  </div>

</template>
<script setup>
import { date } from 'quasar';
import { dateFullFormat } from 'src/modules/formatter';
import { computed, ref } from 'vue';
import { useTriageIgd } from 'src/stores/simrs/igd/triage'

const loadingaja = false
const pernapasan = ref({
  resusitasi: ['Sianosis', 'Bradipnoe', 'Henti Nafas'],
  p1: ['Normal', 'Sumbatan Parsial', 'Trakipnone']
})
const jalannafas = ref({
  resusitasi: ['Sumbatan'],
  p1: ['Bebas', 'Ancaman']
})
const sirkulasi = ref({
  resusitasi: ['Nadi Tidak Teraba', 'Henti Jantung', 'Akral Dingin'],
  p1: ['Nadi Normal', 'CRT > 2 dtk', 'Pucat', 'Takikardia', 'Bradikardia', 'Nadi Teraba Lemah']
})
const disability = ref({
  resusitasi: ['Disability Normal', 'Hemiplegi', 'Tidak Ada Respon', 'Kejang', 'GCS < 8'],
  p1: ['Hemiparesis', 'Gelisah', 'GCS 8 - 12']
})
const alergis = ref(['Obat', 'Makanan', 'Udara', 'Lain-lain', 'Tidak ada Alergi'])
const kategoritriage = ref(['Resusitasi', 'P1', 'P2', 'P3', 'False Triage'])

const kesadaran = ref(['Alert', 'Verbal', 'Pain', 'Unrespon'])
const nyeri = ref(['Normal', 'Abnormal'])
const lochea = ref(['Normal', 'Abnormal', 'NA'])
const proteinurin = ref(['+', '++>', 'NA'])
const gangguanperilaku = ref(['Tidak Terganggu', 'Tidak Membahayakan', 'Ada Gangguan', 'Membahayakan Diri Sendiri/Orang Lain'])

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
const store = useTriageIgd()
const qrUrl = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Triage.png'
  const asal = 'RAWAT JALAN'
  const petugas = props?.pasien?.kodedokter ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})

const lists = computed(() => {
  const arr = props.pasien?.triage
  return arr?.sort((a, b) => { return b.id - a.id })
})

const isChecked = (triage, field, value) => {
  return triage?.[field] === value
}

const CheckedAlergi = (item) => props.pasien?.anamnesis?.[0]?.riwayatalergi?.includes(item)
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
  padding-top: 130px;
}

.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
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
