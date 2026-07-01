<template>
  <div v-if="props?.pasien?.planheder?.length">
    <!-- <div class="row q-mb-md">
      <div class="col-12">
        <app-autocomplete v-model="plan" label="Pilih Surat" autocomplete="rs4" option-label="rs4" option-value="id"
          outlined :source="props?.pasien?.planheder" @selected="terpilih" />
      </div>
    </div> -->
    <div class="q-mb-lg">
      <!-- <div v-if="toItem?.rs4 === 'Rawat Inap'" class="row no-wrap">
        <app-input v-model="ket" class="col-11" valid outlined label="Keterangan" />
      </div> -->
      <!-- <q-bar dense class="bg-white">
        <q-space />
        <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
          <q-tooltip class="primary" :offset="[10, 10]">
            Print
          </q-tooltip>
        </q-btn>
      </q-bar> -->
      <div class="full-width">
        <div>
          <div class="row items-center justify-between q-mb-sm">
            <div>
              <img v-if="pasien?.groups === '1'" src="~assets/logos/logobpjs.svg" spinner-color="white" class="q-mb-sm">
              <img v-else src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 2cm; max-width: 2cm">
              <!-- style="height: 3.56cm; max-width: 2.86cm" -->
            </div>
            <div class="column flex">
              <div :key="toItem" class="row flex-center">
                Surat Rencana {{ setNama(toItem) }}
              </div>
              <div class="row flex-center">
                UOBK RSUD Dokter Mohamad Saleh
              </div>
            </div>
            <div>No. {{ setNomor(toItem) }}</div>
          </div>
          <!-- <div class="row items-center justify-between q-mb-sm">
            <div class="col-3">
              Kepada Yth
            </div>
            <div class="col-9">
              : {{ setKepada(toItem) }}
            </div>
          </div> -->
          <div class="row items-center justify-between q-my-md">
            <div>
              Mohon Rawat Inap untuk :
            </div>
          </div>
          <!-- <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              No Kartu
            </div>
            <div class="col-9">
              : {{ pasien?.noka }}
            </div>
          </div> -->
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
              Nama Pasien
            </div>
            <div class="col-9">
              : {{ pasien?.nama }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Umur
            </div>
            <div class="col-9">
              : {{ pasien?.usia }}
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
              Alamat
            </div>
            <div class="col-9">
              : {{ pasien?.alamat }}
            </div>
          </div>
          <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Dengan diagnosa
            </div>
            <div class="col-9">
              : {{ diagnosa(toItem) }}
            </div>
          </div>
          <!-- <div class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Tanggal Rencana {{ setNama(toItem) }}
            </div>
            <div class="col-9">
              : {{ setTgl(toItem) }}
            </div>
          </div> -->
          <div v-if="toItem?.rs4 === 'Rawat Inap'" class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Ruang Tujuan
            </div>
            <div class="col-9">
              :
              {{ toItem?.planranap?.ruangranap?.rs2 ?? '-' }}
            </div>
          </div>
          <div v-if="toItem?.rs4 === 'Rawat Inap'" class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Tujuan {{ setNama(toItem) }}
            </div>
            <div class="col-9">
              : {{ toItem?.planranap?.keterangan ?? '-' }}
            </div>
          </div>
          <!-- <div v-if="toItem?.rs4 === 'Kontrol'" class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Keterangan
            </div>
            <div class="col-9">
              : {{ toItem?.kontrol?.keterangan }}
            </div>
          </div> -->
          <!-- <div v-if="toItem?.rs4 === 'Rujuk Ke Rumah Sakit Lain'" class="row items-center justify-between q-mb-xs">
            <div class="col-3">
              Keterangan
            </div>
            <div class="col-9">
              : {{ toItem?.planrujukan?.keterangan }}
            </div>
          </div> -->
          <!-- <div class="row items-center justify-between q-my-md">
            <div class="col-12">
              Demikian atas bantuaannya, diucapkan banyak terimakasih.
            </div>
          </div> -->
          <div class="row items-center justify-between q-mb-xl">
            <div class="col-6 f-10 q-mt-auto">
              Tgl Terbit {{ date.formatDate(toItem?.created_at, 'DD/MM/YYYY') }} | Tgl Cetak {{
                date.formatDate(Date.now(), 'DD/MM/YYYY') }} <span class="text-italic">dari RS</span>
            </div>
            <div class="col-6">
              <div class="text-center text-weight-bold q-pt-xs">
                Poliklinik/Ruangan
              </div>
              <div class="column flex-center q-mt-sm">
                <div style="width: 70px;">
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
      <q-separator class="q-my-md" />
    </div>
  </div>
  <div v-if="!props?.pasien?.planheder?.length">
    <app-no-data />
  </div>
</template>
<script setup>
import { date } from 'quasar'
import { computed, onMounted, ref } from 'vue'
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
function terpilih(val) {
  const temp = props?.pasien?.planheder?.find(a => a.id === val)
  if (temp) {
    toItem.value = temp
  }
  console.log('val', toItem.value, val)
}
onMounted(() => {
  // console.log('totItem', toItem.value)
  console.log('Pasien', props.pasien)
  toItem.value = props?.pasien?.planheder[0]
  plan.value = props?.pasien?.planheder[0].rs4
})


const qrUrl = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Surat Rawat Inap.png'
  const asal = 'RAWAT JALAN'
  const petugas = props?.pasien?.kodedokter ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})
function diagnosa(item) {
  console.log(item)

  const dariPasien = props?.pasien?.memodiagnosa ?? '-'

  // const transrujukan = item?.planrujukan?.diagnosa?.rs1 + ' - ' + item?.transrujukan?.diagnosa?.rs4

  return item?.planrujukan ? dariPasien : dariPasien
}
function setKepada(val) {
  // if (val?.rs4 === 'Kontrol') {
  //   if (val?.kontrol) {
  //     return val?.kontrol?.namaDokter
  //   }
  //   else { return '-' }
  // }
  // else if (val?.rs4 === 'Konsultasi') {
  //   if (val?.masterpoli) {
  //     return val?.masterpoli?.rs2
  //   }
  //   else { return '-' }
  // }
  // else if (val?.rs4 === 'Rujukan Internal' || val?.rs4 === 'Konsultasi Internal') {
  //   if (val?.masterpoli) {
  //     return val?.masterpoli?.rs2
  //   }
  //   else { return '-' }
  // }
  if (val?.rs4 === 'Rawat Inap') {
    if (props.pasien) {
      return props.pasien.dokter
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rujuk Ke Rumah Sakit Lain') {
    if (val?.planrujukan) {
      if (val?.planrujukan?.rs11 == '2') return 'Faskes ' + val?.planrujukan?.di_rujuk_ke
      else return 'Poli ' + val?.planrujukan?.poli_rujukan + ', ' + val?.planrujukan?.di_rujuk_ke
    }
    else { return '-' }
  }
}
function setNomor(val) {
  // if (val?.rs4 === 'Kontrol') {
  //   if (val?.kontrol) {
  //     return val?.kontrol?.noSuratKontrol
  //   }
  //   else { return '-' }
  // }
  // else if (val?.rs4 === 'Konsultasi') {
  //   if (val?.listkonsul) {
  //     return val?.listkonsul?.noreg_lama
  //   }
  //   else if (val?.rekomdpjp) {
  //     return val?.rekomdpjp?.noreg
  //   }
  //   else { return '-' }
  // }
  // else if (val?.rs4 === 'Rujukan Internal' || val?.rs4 === 'Konsultasi Internal') {
  //   if (val?.listkonsul) {
  //     return val?.listkonsul?.noreg_lama
  //   }
  //   else if (val?.rekomdpjp) {
  //     return val?.rekomdpjp?.noreg
  //   }
  //   else { return '-' }
  // }
  if (val?.rs4 === 'Rawat Inap') {
    if (val?.planranap) {
      return val?.planranap?.noreg
    }
    else { return '-' }
  }
  // else if (val?.rs4 === 'Rujuk Ke Rumah Sakit Lain') {
  //   if (val?.planrujukan) {
  //     return val?.planrujukan?.noreg
  //   }
  //   else { return '-' }
  // }
}
function setTgl(val) {
  // if (val?.rs4 === 'Kontrol') {
  //   if (val?.kontrol) {
  //     return date.formatDate(val?.kontrol?.tglRencanaKontrol, 'DD MMMM YYYY')
  //   }
  //   else { return '-' }
  // }
  // else if (val?.rs4 === 'Konsultasi') {
  //   if (val?.listkonsul) {
  //     return date.formatDate(val?.listkonsul?.tgl_rencana_konsul, 'DD MMMM YYYY')
  //   }
  //   else if (val?.rekomdpjp) {
  //     return date.formatDate(val?.rekomdpjp?.tglKontrol, 'DD MMMM YYYY')
  //   }
  //   else { return '-' }
  // }
  // else if (val?.rs4 === 'Rujukan Internal' || val?.rs4 === 'Konsultasi Internal') {
  //   if (val?.rekomdpjp) {
  //     return date.formatDate(val?.rekomdpjp?.tglKontrol, 'DD MMMM YYYY')
  //   }
  //   else { return '-' }
  // }
  if (val?.rs4 === 'Rawat Inap') {
    if (val?.planranap) {
      return date.formatDate(val?.planranap?.created_at, 'DD MMMM YYYY')
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rujuk Ke Rumah Sakit Lain') {
    if (val?.planrujukan) {
      return date.formatDate(val?.planrujukan?.tgl_rujukan, 'DD MMMM YYYY')
    }
    else { return '-' }
  }
}
function setNama(val) {
  console.log('val rencana', val)
  // if (val?.rs4 === 'Konsultasi') {
  //   const nama = val?.listkonsul ? 'Konsultasi' : 'Konsultasi Internal'
  //   // console.log(val, props.pasien)
  //   return nama
  // }
  // if (val?.rs4 === 'Rujuk Ke Rumah Sakit Lain') {
  //   // if (val?.transrujukan) {
  //   //   if (val?.transrujukan?.rs11 == '2') return val?.transrujukan?.rs7
  //   //   else return 'Poli ' + val?.transrujukan?.poli + ', ' + val?.transrujukan?.rs7
  //   // }
  //   // else { return '-' }
  //   const nama = val?.planrujukan?.rs11 == '2' ? 'Rujuk Balik (Non PRB)' : val?.rs4
  //   // console.log(val, props.pasien)
  //   return nama
  // } else {
  return val?.rs4
  // }
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
