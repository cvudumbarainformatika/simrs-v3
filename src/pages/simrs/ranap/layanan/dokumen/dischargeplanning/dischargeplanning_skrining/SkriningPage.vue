<template>
  <div id="pdfDoc" class="bg-white print-page">
    <div class="page-1">
      <!-- KOP SURAT -->
      <!-- <div class="col-grow">
        <div class="row items-center">
          <div class="col-12">
            <div class="flex justify-center">
              <div class="">
                <img src="~assets/logos/logo-rsud.png" width="50">
              </div>
              <div class="q-px-md">
                <div class="text-center">
                  <div class="text-weight-bold f-14">
                    UOBK RSUD DOKTER MOHAMAD SALEH
                  </div>
                  <div class="f-12">
                    <div>Jl. Mayjend Panjaitan No.65 Probolinggo Jawa Timur</div>
                    <div>Telp. (0335) 433478,433119,421118 Fax. (0335) 432702</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="col-grow kotak">
        <div class="row items-center">

          <div class="col-9 sisi-kanan">
            <div class="row q-pa-sm">
              <div class="col-auto">
                <img src="~assets/images/logo-rsud.png" width="80">
              </div>
              <div class="col flex-wrap q-px-lg">
                <div class="text-center">
                  <div class="text-weight-bold f-12">
                    {{ dataHeader[0] }}
                  </div>
                  <div class="text-weight-bold f-10">
                    {{ dataHeader[1] }}
                  </div>
                  <div class="text-weight-bold f-16">
                    {{ dataHeader[2] }}
                  </div>
                  <div class="f-10">
                    <div>{{ dataHeader[3] }}</div>
                    <div>{{ dataHeader[4] }}</div>
                    <div>{{ dataHeader[5] }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3 f-14">
            <div class="text-center text-bold">
              {{ menu?.title }}
            </div>
          </div>
        </div>
      </div>

      <div class="q-pt-sm" />
      <div class="contentx">
        <!-- <div class=" text-center text-bold q-mb-xs">
          {{ menu?.desc }}
        </div> -->
        <!-- <div class=" text-center text-bold q-mb-sm">
          <em>{{ menu?.title }}</em>
        </div> -->
        <div class="full-width">
          <!-- biodata -->
          <div class="row kotak q-pa-sm">
            <div class="col-6">
              <table class="model-1">
                <tbody>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        Nama
                      </div>
                      <!-- <i>Patient Name</i> -->
                    </td>
                    <td class="">
                      : {{ pasien?.nama_panggil }}
                    </td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        NO.RM
                      </div>
                      <!-- <i>Medical Record Number</i> -->
                    </td>
                    <td>: {{ pasien?.norm }}</td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        NO.REG
                      </div>
                      <!-- <i>Registration Number</i> -->
                    </td>
                    <td>: {{ pasien?.noreg }}</td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        KELAMIN
                      </div>
                      <!-- <i>Sex</i> -->
                    </td>
                    <td>
                      :
                      {{ pasien?.kelamin }}
                      <!-- <i>{{ pasien?.kelamin === 'Perempuan' ? 'Female' : 'Male' }}</i> -->
                    </td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        USIA
                      </div>
                      <!-- <i>Sex</i> -->
                    </td>
                    <td>
                      :
                      {{ pasien?.usia }}
                      <!-- <i>{{ pasien?.kelamin === 'Perempuan' ? 'Female' : 'Male' }}</i> -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-6">
              <table class="model-1">
                <tbody>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        Tanggal Masuk RS
                      </div>
                      <!-- <i>Admitted</i> -->
                    </td>
                    <td>: {{ humanDate(pasien?.tglmasuk) }} <b> Jam : </b> {{ jamTnpDetik(pasien?.tglmasuk) }}</td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        Tanggal Keluar RS
                      </div>
                      <!-- <i>Date of Discharge</i> -->
                    </td>
                    <td>: {{ humanDate(pasien?.tglkeluar) }} <b> Jam : </b> {{ jamTnpDetik(pasien?.tglkeluar) }}</td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        Ruangan / Kelas
                      </div>
                      <!-- <i>Room / Class</i> -->
                    </td>
                    <td>: {{ pasien?.ruangan }}</td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        DPJP
                      </div>
                      <!-- <i>Room / Class</i> -->
                    </td>
                    <td>: {{ pasien?.dokter }}</td>
                  </tr>
                  <tr valign="top">
                    <td>
                      <div style="text-decoration: underline;">
                        Sistem Bayar
                      </div>
                      <!-- <i>Room / Class</i> -->
                    </td>
                    <td>: {{ pasien?.sistembayar }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-12">
              <table class="model-1">
                <tbody>
                  <tr valign="top">
                    <td width="6%">
                      <div style="text-decoration: underline;">
                        Alamat
                      </div>
                      <!-- <i>Address</i> -->
                    </td>
                    <td>
                      <div class="flex flex-wrap">
                        {{ pasien?.alamat }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- CONTENT -->
          <div class="column kotak q-mt-sm q-pa-sm">
            <div class="row q-pb-sm">
              <div class="col-4">
                Perkiraan Lama Rawat :
              </div>
              <div class="col-8">
                Sudah bisa ditetapkan <span class="q-px-xs text-weight-bold">{{
                  jawabdischargeplanning?.rs20
                }}</span>hari; Rencana tanggal pulang : <span class="q-px-xs text-weight-bold">{{
                    jawabdischargeplanning?.tglRencanaPulang ?? '-' }}</span>
              </div>
              <div class="col-4">
              </div>
              <div class="col-8">
                Belum bisa ditetapkan, karena <span class="q-px-xs text-weight-bold">{{
                  jawabdischargeplanning?.rs21 ?? '-' }}</span>
              </div>
            </div>

            <table class="model-2">
              <tbody>
                <tr class="text-weight-bold">
                  <td>Faktor Resiko Pasien Pulang</td>
                  <td>Ya/Tidak</td>
                  <td>Keterangan</td>
                </tr>
                <template v-for="(item, i) in dischargeplanning" :key="i">

                  <tr>
                    <td>
                      {{ item?.label }}
                    </td>
                    <td>
                      <div class="flex no-wrap q-gutter-md">
                        <div class="flex">
                          {{ item?.value }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="flex no-wrap q-gutter-md">
                        <div class="flex">
                          {{ item?.ket ?? '-' }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="flex justify-around q-mt-lg">
            <div class="column flex-center">
              <div>Pasien / Keluarga</div>
              <div v-if="ttdPasien" class="flex-center relative-position" style="width: 60px;">
                <vue-qrcode :value="qrPasien" tag="svg" :options="{
                  errorCorrectionLevel: 'Q',
                  width: 60,
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                  margin: 0
                }" />
                <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
              </div>
              <div v-else class="column flex-center" style="height: 60px;">
                ttd
              </div>
              <div class="f-10">
                {{ pasien?.nama_panggil }}
              </div>
            </div>
            <div class="column flex-center">
              <div>Perawat</div>
              <div class="flex-center relative-position" style="width: 60px;">
                <vue-qrcode :value="qrPerawat" tag="svg" :options="{
                  errorCorrectionLevel: 'Q',
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                  margin: 0
                }" />
                <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
              </div>
              <div class="f-10">
                {{ perawat }}
              </div>
            </div>
            <div class="column flex-center">
              <div>Dokter</div>
              <div class="flex-center relative-position" style="width: 60px;">
                <vue-qrcode :value="qrDokter" tag="svg" :options="{
                  errorCorrectionLevel: 'Q',
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                  margin: 0
                }" />
                <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
              </div>
              <div class="f-10">
                {{ pasien?.dokter }}
              </div>
            </div>
          </div>
        </div>
        <!-- end -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { humanDate, jamTnpDetik, getNewLine } from 'src/modules/formatter.js'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
// import { pathImg } from 'src/boot/axios'
// import { imageToBase64 } from 'src/modules/imgBase64'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Array,
    default: null
  }
})

// console.log('props', props?.pasien);

const auth = useAplikasiStore()
const pengunjung = usePengunjungRanapStore()
const ttdPasien = ref(null)
const jawabdischargeplanning = props.pasien?.skriningdischargeplannings?.at(-1)

const dischargeplanning = computed(() => [
  { label: 'Apakah pasien tinggal sendiri', value: jawabdischargeplanning?.rs4, ket: jawabdischargeplanning?.rs4Ket },
  { label: 'Apakah pasien tinggal bersama keluarga', value: jawabdischargeplanning?.rs5, ket: jawabdischargeplanning?.rs5Ket },
  { label: 'Apakah pasien khawatir jika pulang ke rumah', value: jawabdischargeplanning?.rs6, ket: jawabdischargeplanning?.rs6Ket },
  { label: 'Apakah saat di rumah pasien ada yang merawat', value: jawabdischargeplanning?.rs7, ket: jawabdischargeplanning?.rs7Ket },
  { label: 'Bagaimana jenis tempat tinggal pasien', value: jawabdischargeplanning?.rs8, ket: '' },
  { label: 'Apakah tempat tinggal pasien ada tetangga', value: jawabdischargeplanning?.rs9, ket: jawabdischargeplanning?.rs9Ket },
  { label: 'Apakah pasien mempunyai tanggung jawab menafkahi keluarga/saudara', value: jawabdischargeplanning?.rs10, ket: jawabdischargeplanning?.rs10Ket },
  { label: 'Apakah pasien mempunyai tanggung jawab memelihara hewan peliharaan', value: jawabdischargeplanning?.rs11, ket: jawabdischargeplanning?.rs11Ket },
  { label: 'Apakah ketika pulang, masih ada perawatan lanjutan yang harus dilakukan', value: jawabdischargeplanning?.rs12, ket: jawabdischargeplanning?.rs12Ket },
  { label: 'Apakah ketika pulang, pasien harus kontrol ke lebih dari 2 dokter', value: jawabdischargeplanning?.rs13, ket: jawabdischargeplanning?.rs13Ket },
  { label: 'Apakah pasien pulang dengan membawa obat lebih dari 6 jenis obat', value: jawabdischargeplanning?.rs14, ket: jawabdischargeplanning?.rs14Ket },
  { label: 'Apakah pasien mengajukan permohonan untuk pendamping (care giver) dari rumah sakit', value: jawabdischargeplanning?.rs15, ket: jawabdischargeplanning?.rs15Ket },
  { label: 'Apakah pasien memiliki transportasi untuk pulang', value: jawabdischargeplanning?.rs22, ket: jawabdischargeplanning?.rs22Ket },
  { label: 'Apakah pasien memerlukan alat bantu', value: jawabdischargeplanning?.rs16, ket: jawabdischargeplanning?.rs16Ket },
  { label: 'Apakah pasien memerlukan pemantauan minum obat', value: jawabdischargeplanning?.rs17, ket: jawabdischargeplanning?.rs17Ket },
  { label: 'Apakah pasien memerlukan pemantauan diet/makanan', value: jawabdischargeplanning?.rs18, ket: jawabdischargeplanning?.rs18Ket },
  { label: 'Apakah pasien memerlukan latihan fisik', value: jawabdischargeplanning?.rs19, ket: jawabdischargeplanning?.rs19Ket },

])
onMounted(() => {
  const summ = props?.pasien?.summarydischargeplannings?.length ? props?.pasien?.summarydischargeplannings[0] : null
  ttdPasien.value = summ?.ttdPasien
  console.log('jawaban', jawabdischargeplanning)
  // initTtd(summ)
})
console.log('auth', auth.user?.pegawai?.kdpegsimrs);
const PRMRJ = computed(() => {
  const xx = props?.pasien?.skriningdischargeplannings?.length ? props?.pasien?.skriningdischargeplannings[0] : null
  const no9 = xx?.rs12 ?? null
  const no10 = xx?.rs13 ?? null
  let ket = 'Tidak'
  if (no9 === 'Ya' || no10 === 'Ya') {
    ket = 'Ya'
  }
  return ket
})

const SUMMARY = computed(() => {
  const diag = props?.pasien?.summarydischargeplannings?.length ? props?.pasien?.summarydischargeplannings[0] : null
  return diag
})
const perawat = computed(() => {
  const diag = props?.pasien?.summarydischargeplannings?.length ? props?.pasien?.summarydischargeplannings[0] : null
  const petugas = diag?.user_input ?? null
  // console.log('petugas', petugas, pengunjung?.nakes?.find(x => x?.kdpegsimrs === petugas)?.nama ?? null)

  let nama = null
  if (petugas) {
    nama = pengunjung?.nakes?.find(x => x?.kdpegsimrs === petugas)?.nama ?? null
  } else {
    nama = auth.user?.pegawai?.nama ?? null
  }
  return nama
})

const KRS = computed(() => {
  const cppt = props?.pasien?.cppt || []
  // console.log('CPPT', cppt)
  const cpptPerawat = cppt?.filter(x => (x?.nakes === '3' || x?.nakes === '2')) || []
  // console.log('KRS', cpptPerawat)

  const diag = cpptPerawat?.length ? cpptPerawat[0] : null
  // console.log('KRS', diag)

  return diag
})

// function initTtd (item) {
//   const ttdPas = pathImg + item?.ttdPasien

//   Promise.all([
//     imageToBase64(ttdPas, (base64Image) => {
//       ttdPasien.value = base64Image ?? null
//     })

//   ])

//   console.log('ttdPasien', ttdPasien.value, ttdPas)
// }

const qrPasien = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SUMMARY.png'
  const asal = 'RANAP'
  const pasien = SUMMARY?.value?.noreg ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${pasien}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})

const qrPerawat = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SUMMARY.png'
  const asal = 'RANAP'
  // const petugas = SUMMARY?.value?.user_input ?? null
  const petugas = auth.user?.pegawai?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  // console.log('enc', enc);

  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})
const qrDokter = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SUMMARY.png'
  const asal = 'RANAP'
  const petugas = props?.pasien?.kddokter ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})
</script>

<style lang="scss" scoped>
.qrcode__image {
  // background-color: #fff;
  // border: 0.05rem solid #fff;
  // border-radius: 0.25rem;
  // box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 20%;
  width: 20%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

table {
  border-collapse: collapse;
  border-spacing: 50px 0;
}

.sisi-kanan {
  border-right: 1px solid black;
}

.model-1 {

  tr,
  td {
    padding: -3px 0 !important;
  }
}

.model-2 {

  tr,
  td {
    padding-bottom: 5px !important;
    border-bottom: 1px solid rgb(139, 139, 139);
  }
}

table,
tr,
td {
  border: none;
}

td {
  text-align: left;
}

.kotak {
  border: 1px solid black;
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  padding: 20px !important;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: letter;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD MOH SALEH KOTA PROBOLINGGO | Hal Ke-" counter(page);
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}
</style>
