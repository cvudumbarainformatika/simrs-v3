<template>
  <div v-if="props?.pasien?.planning?.length">
    <div class="row q-mb-md">
      <div class="col-12">
        <app-autocomplete v-model="plan" label="Pilih Surat" autocomplete="rs4" option-label="rs4" option-value="id"
          outlined :source="props?.pasien?.planning" @selected="terpilih" />
      </div>
    </div>
    <div class="q-mb-lg">
      <div v-if="toItem?.rs4 === 'Rawat Inap'" class="row no-wrap">
        <app-input v-model="ket" class="col-11" valid outlined label="Keterangan" />
      </div>
      <q-bar dense class="bg-white">
        <q-space />
        <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
          <q-tooltip class="primary" :offset="[10, 10]">
            Print
          </q-tooltip>
        </q-btn>
      </q-bar>
      <div :id="'printMe'" class="full-width">
        <div>
          <div class="row items-center justify-between q-mb-sm">
            <div>
              <img v-if="pasien?.groups === '1'" src="~assets/logos/logobpjs.svg" spinner-color="white" class="q-mb-sm">
              <img v-else src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 2cm; max-width: 2cm">
              <!-- style="height: 3.56cm; max-width: 2.86cm" -->
            </div>
            <div>
              <div :key="toItem" class="row">
                Surat Rencana {{ setNama(toItem) }}
              </div>
              <div class="row">
                UOBK RSUD dr. MOH SALEH
              </div>
            </div>
            <div>No. {{ setNomor(toItem) }}</div>
          </div>
          <div class="row items-center justify-between q-mb-sm">
            <div class="col-3">
              Kepada Yth
            </div>
            <div class="col-9">
              : {{ setKepada(toItem) }}
            </div>
          </div>
          <div class="row items-center justify-between q-my-md">
            <div>
              Mohon Pemeriksaan dan Penanganan lebih lanjut :
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              No Kartu
            </div>
            <div class="col-9">
              : {{ pasien?.noka }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              No RM
            </div>
            <div class="col-9">
              : {{ pasien?.norm }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Nama Peserta
            </div>
            <div class="col-9">
              : {{ pasien?.nama }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Tgl Lahir
            </div>
            <div class="col-9">
              : {{ date.formatDate(pasien?.tgllahir, 'DD MMMM YYYY') }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Jenis Kelamin
            </div>
            <div class="col-9">
              : {{ pasien?.kelamin }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Diagnosa
            </div>
            <div class="col-9">
              : {{ diagnosa(toItem) }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Tanggal Rencana {{ setNama(toItem) }}
            </div>
            <div class="col-9">
              : {{ setTgl(toItem) }}
            </div>
          </div>
          <div v-if="toItem?.rs4 === 'Rawat Inap'" class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Keterangan
            </div>
            <div class="col-9">
              : {{ ket }}
            </div>
          </div>
          <div v-if="toItem?.rs4 === 'Rumah Sakit Lain'" class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Keterangan
            </div>
            <div class="col-9">
              : {{ toItem?.transrujukan?.rs9 }}
            </div>
          </div>
          <div class="row items-center justify-between q-my-md">
            <div class="col-12">
              Demikian atas bantuaannya, diucapkan banyak terimakasih.
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xl">
            <div class="col-7" />
            <div class="col-4 text-center">
              Mengetahui DPJP
            </div>
          </div>
          <div class="row items-center justify-between ">
            <div class="col-7 f-10">
              Tgl Terbit {{ date.formatDate(toItem?.created_at, 'DD/MM/YYYY') }} | Tgl Cetak {{
                date.formatDate(Date.now(), 'DD/MM/YYYY') }} <span class="text-italic">dari RS</span>
            </div>
            <div class="col-4 text-center">
              {{ pasien?.dokter }}
            </div>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md" />
    </div>
  </div>
  <div v-if="!props?.pasien?.planning?.length">
    <app-no-data />
  </div>
</template>
<script setup>
import { date } from 'quasar'
import { onMounted, ref } from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
const ket = ref('')
const plan = ref('')
const toItem = ref(null)
function terpilih (val) {
  const temp = props?.pasien?.planning?.find(a => a.id === val)
  if (temp) {
    toItem.value = temp
  }
  console.log('val', toItem.value, val)
}
onMounted(() => {
  toItem.value = props?.pasien?.planning[0]
  plan.value = props?.pasien?.planning[0].rs4
})
function diagnosa (item) {
  console.log(item)

  const dariPasien = props?.pasien?.memodiagnosa ?? '-'

  const transrujukan = item?.transrujukan?.diagnosa?.rs1 + ' - ' + item?.transrujukan?.diagnosa?.rs4

  return item?.transrujukan ? transrujukan : dariPasien
}
function setKepada (val) {
  if (val?.rs4 === 'Kontrol') {
    if (val?.kontrol) {
      return val?.kontrol?.namaDokter
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Konsultasi') {
    if (val?.masterpoli) {
      return val?.masterpoli?.rs2
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rujukan Internal' || val?.rs4 === 'Konsultasi Internal') {
    if (val?.masterpoli) {
      return val?.masterpoli?.rs2
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rawat Inap') {
    if (props.pasien) {
      return props.pasien.dokter
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rumah Sakit Lain') {
    if (val?.transrujukan) {
      if (val?.transrujukan?.rs11 == '2') return 'Faskes ' + val?.transrujukan?.rs7
      else return 'Poli ' + val?.transrujukan?.poli + ', ' + val?.transrujukan?.rs7
    }
    else { return '-' }
  }
}
function setNomor (val) {
  if (val?.rs4 === 'Kontrol') {
    if (val?.kontrol) {
      return val?.kontrol?.noSuratKontrol
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Konsultasi') {
    if (val?.listkonsul) {
      return val?.listkonsul?.noreg_lama
    }
    else if (val?.rekomdpjp) {
      return val?.rekomdpjp?.noreg
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rujukan Internal' || val?.rs4 === 'Konsultasi Internal') {
    if (val?.listkonsul) {
      return val?.listkonsul?.noreg_lama
    }
    else if (val?.rekomdpjp) {
      return val?.rekomdpjp?.noreg
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rawat Inap') {
    if (val?.spri) {
      return val?.spri?.noSuratKontrol
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rumah Sakit Lain') {
    if (val?.transrujukan) {
      return val?.transrujukan?.rs3
    }
    else { return '-' }
  }
}
function setTgl (val) {
  if (val?.rs4 === 'Kontrol') {
    if (val?.kontrol) {
      return date.formatDate(val?.kontrol?.tglRencanaKontrol, 'DD MMMM YYYY')
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Konsultasi') {
    if (val?.listkonsul) {
      return date.formatDate(val?.listkonsul?.tgl_rencana_konsul, 'DD MMMM YYYY')
    }
    else if (val?.rekomdpjp) {
      return date.formatDate(val?.rekomdpjp?.tglKontrol, 'DD MMMM YYYY')
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rujukan Internal' || val?.rs4 === 'Konsultasi Internal') {
    if (val?.rekomdpjp) {
      return date.formatDate(val?.rekomdpjp?.tglKontrol, 'DD MMMM YYYY')
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rawat Inap') {
    if (val?.spri) {
      return date.formatDate(val?.spri?.tglRencanaKontrol, 'DD MMMM YYYY')
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rumah Sakit Lain') {
    if (val?.transrujukan) {
      return date.formatDate(val?.transrujukan?.tglRencanaKunjungan, 'DD MMMM YYYY')
    }
    else { return '-' }
  }
}
function setNama (val) {
  if (val?.rs4 === 'Konsultasi') {
    const nama = val?.listkonsul ? 'Konsultasi' : 'Konsultasi Internal'
    // console.log(val, props.pasien)
    return nama
  } if (val?.rs4 === 'Rumah Sakit Lain') {
    // if (val?.transrujukan) {
    //   if (val?.transrujukan?.rs11 == '2') return val?.transrujukan?.rs7
    //   else return 'Poli ' + val?.transrujukan?.poli + ', ' + val?.transrujukan?.rs7
    // }
    // else { return '-' }
    const nama = val?.transrujukan?.rs11 == '2' ? 'Rujuk Balik (Non PRB)' : val?.rs4
    // console.log(val, props.pasien)
    return nama
  } else {
    return val?.rs4
  }
}
// function tglEntry (val) {
//   // date.formatDate(pasien.tgl_kunjungan, 'DD/MM/YYYY')
//   console.log('tglEntry', val)
//   let tanggal = '-'
//   if (val?.rs4 == 'Kontrol') tanggal = date.formatDate(val?.kontrol?.created_at, 'DD/MM/YYYY')
//   else if (val?.rs4 == 'Konsultasi') tanggal = date.formatDate(val?.listkonsul?.created_at, 'DD/MM/YYYY')
//   else if (val?.rs4 == 'Konsultasi Internal' || val?.rs4 == 'Rujukan Internal') tanggal = date.formatDate(val?.rekomdpjp?.tglInsert, 'DD/MM/YYYY')
//   else if (val?.rs4 == 'Konsultasi') tanggal = date.formatDate(val?.listkonsul?.created_at, 'DD/MM/YYYY')

//   return tanggal

// }
// eslint-disable-next-line no-unused-vars
const printObj = {
  id: 'printMe',
  popTitle: 'Surat Rencana Pasien'

}
</script>
<style lang="scss" scoped>
.endas {
  border-bottom: 1px black solid;
  font-size: 24px;
}
</style>
