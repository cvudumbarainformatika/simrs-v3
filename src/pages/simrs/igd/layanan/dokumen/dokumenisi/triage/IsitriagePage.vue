<template>
  <div v-if="loadingaja" class="column full-height flex-center">
    <div class="text-white">
      Harap Tunggu .....
    </div>
    <div class="text-white">
      Sinkron Data Ke DATABASE
    </div>
  </div>
  <div v-if="pasien?.triage?.length <= 0" class="column full-height flex-center">
    <div class="text-white">
      Belum Ada data tersimpan
    </div>
  </div>
  <div v-else class="full-height">
    <div v-for="(item, n) in lists" :key="n" class="list-move full-height">
      <table class="triage-table q-mt-sm">
        <!-- Tanggal -->
        <tr>
          <td class="label">Tanggal Triase</td>
          <td class="value">{{ dateFullFormat(item?.tanggal) }}</td>
          <td class="label">Jam</td>
          <td class="value">{{ tgltriage(item?.tanggal) }}</td>
          <td colspan="2"></td>
        </tr>

        <!-- Section -->
        <tr class="triage-header">
          <td colspan="3">DOA / PRIMARY SURVEY</td>
          <td colspan="3">SECONDARY SURVEY</td>
        </tr>

        <!-- Vital Sign -->
        <tr class="triage-header">
          <td colspan="3">Tanda Kehidupan</td>
          <td>Tanda Vital</td>
          <td class="center">Nilai</td>
          <td class="center">Skor</td>
        </tr>

        <tr>
          <td colspan="3">Nadi</td>
          <td class="center">{{ item?.nadi }} x/mnt</td>
          <td class="score">{{ item?.scorenadi }}</td>
          <td></td>
        </tr>

        <tr>
          <td colspan="3">Pernapasan</td>
          <td class="center">{{ item?.pernapasanx }} x/mnt</td>
          <td class="score">{{ item?.scorepernapasanx }}</td>
          <td></td>
        </tr>

        <tr>
          <td colspan="3">Tekanan Darah</td>
          <td class="center">{{ item?.sistole }}/{{ item?.diastole }} mmHg</td>
          <td class="score">
            {{ item?.scoresistole }} / {{ item?.scorediastole }}
          </td>
          <td></td>
        </tr>

        <tr>
          <td colspan="3">Suhu</td>
          <td class="center">{{ item?.suhu }} °C</td>
          <td class="score">{{ item?.scoresuhu }}</td>
          <td></td>
        </tr>

        <tr>
          <td colspan="3">SpO₂</td>
          <td class="center">{{ item?.spo2 }} %</td>
          <td class="score">{{ item?.scorespo2 }}</td>
          <td></td>
        </tr>

        <!-- Neurologi -->
        <tr class="triage-header">
          <td colspan="6">NEUROLOGI</td>
        </tr>

        <tr>
          <td class="label">Kesadaran</td>
          <td colspan="2">{{ item?.kesadaran }}</td>
          <td class="label">GCS</td>
          <td colspan="2" class="center">
            {{ item?.eye }} / {{ item?.verbal }} / {{ item?.motorik }}
          </td>
        </tr>

        <!-- Skor -->
        <tr class="triage-header">
          <td colspan="4">TOTAL SKOR</td>
          <td colspan="2" class="right">{{ item?.totalscore }}</td>
        </tr>

        <!-- Kategori -->
        <tr>
          <td colspan="4" class="triage-header">KATEGORI TRIASE</td>
          <td colspan="2" class="center text-bold">
            {{ item?.kategoritriage }}
          </td>
        </tr>

        <!-- Lain-lain -->
        <tr>
          <td>BB / TB</td>
          <td colspan="2">{{ item?.bb }} Kg / {{ item?.tb }} Cm</td>
          <td>Hamil</td>
          <td colspan="2">{{ hamil(item?.flaghamil) }}</td>
        </tr>

        <tr>
          <td>Alergi</td>
          <td colspan="5">
            {{ props.pasien?.anamnesis?.riwayatalergi ?? '-' }} —
            {{ props.pasien?.anamnesis?.keteranganalergi ?? '-' }}
          </td>
        </tr>

        <tr>
          <td>Anamnesa</td>
          <td colspan="5">
            {{ props.pasien?.anamnesis?.[0]?.rs4 ?? '-' }}
          </td>
        </tr>
      </table>

      <div class="row items-center no-wrap q-mt-xl">
        <div class="col-6 text-right" />
        <div class="col-6 text-weight-bold text-center">
          Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
        </div>
      </div>
      <div class="row items-center no-wrap">
        <div class="col-6 text-right" />
        <div class="col-6 text-weight-bold text-center">
          Dokter
        </div>
      </div>
      <div class="row items-center no-wrap q-mt-lg">
        <div class="col-6 text-right" />
        <div class="col-6 text-weight-bold text-center">
          {{ pasien?.dokter }}
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
  border: 1px solid #ccc;
  padding: 4px 6px;
}

.triage-header {
  background: #f0f0f0;
  font-weight: bold;
  text-align: center;
}

.label {
  width: 18%;
}

.value {
  width: 15%;
}

.score {
  width: 10%;
  text-align: right;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}
</style>
