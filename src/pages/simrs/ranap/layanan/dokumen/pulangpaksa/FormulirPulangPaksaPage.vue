<template>
  <div id="pdfDoc" class="bg-white print-page">
    <div v-if="pasien?.carakeluar === 'C010' || pasien?.carakeluar === 'C002'" class="page-1">
      <!-- KOP SURAT -->
      <div class="col-grow">
        <div class="row items-center">
          <div class="col-12">
            <div class="flex justify-center">
              <div class="">
                <img src="~assets/images/logo-kota-grey.png" width="50">
              </div>
              <div class="q-px-md">
                <div class="text-center">
                  <div class="text-weight-bold f-14">
                    PEMERINTAH KOTA PROBOLINGGO
                  </div>
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
      </div>

      <hr class="q-mt-md">
      <hr style="margin-top:-5px;" class="q-mb-md">
      <div class="contentx">
        <div class="f-16 text-center text-bold q-mb-xs" style="text-decoration: underline; text-underline-offset: 5px;">
          {{ menu?.title }}
        </div>
        <div class="f-12 text-center text-bold q-my-sm">
          <span>NOMOR : <span>{{ pasien?.noreg }}</span></span>
        </div>
        <div class="full-width q-mt-lg">
          <!-- biodata -->
          <div class="row q-px-sm q-pb-xs full-width">
            <div class="col-12">
              Yang bertanda tangan di bawah ini :
            </div>
          </div>
          <div class="row items-center q-px-md q-pb-xs full-width">
            <div class="col">
              <div class="row">
                <div class="col-3">Nama</div>
                <div class="col-9">: {{ pasien?.nama_penanggungjawab ?? '-' }}</div>
              </div>
              <div class="row">
                <div class="col-3">Umur / Kelamin</div>
                <div class="col-9">: {{ pasien?.umur_penanggungjawab ?? '-' }} / {{ pasien?.kelamin_penanggungjawab ??
                  '-' }} </div>
              </div>
              <div class="row">
                <div class="col-3">Alamat</div>
                <div class="col-9">: {{ pasien?.alamat_penanggungjawab ?? '-' }}</div>
              </div>
              <div class="row">
                <div class="col-3">Bukti diri / KTP</div>
                <div class="col-9">: {{ pasien?.identitas_penanggungjawab ?? '-' }}</div>
              </div>
            </div>
          </div>
          <div class="row q-px-sm q-pb-xs full-width">
            <div class="col-12 text-justify">
              Dengan ini menyatakan bahwa saya dari keluarga pasien atau pasien sendiri
            </div>
          </div>

          <div class="row items-center q-px-md q-pb-xs full-width">
            <div class="col">
              <div class="row">
                <div class="col-3">Bernama</div>
                <div class="col-9">: {{ pasien?.nama ?? '-' }}</div>
              </div>
              <div class="row">
                <div class="col-3">Umur / Kelamin</div>
                <div class="col-9">: {{ pasien?.usia ?? '-' }} / {{ pasien?.kelamin ?? '-' }}</div>
              </div>
              <div class="row">
                <div class="col-3">Nomor Reg. / RM</div>
                <div class="col-9">: {{ pasien?.noreg ?? '-' }} / {{ pasien?.norm ?? '-' }}</div>
              </div>
            </div>
          </div>
          <div class="row q-px-sm q-pb-xs full-width">
            <div class="col text-justify">Menyatakan menolak nasehat Dokter / Petugas {{ pasien?.dokter }} untuk
              dirawat
              selanjutnya
              dan telah memaksa pulang atas
              kemauan sendiri dengan menanggung sendiri segala akibatnya, dengan alasan karena <span
                class="text-weight-bold">{{
                  pasien?.alasan_pulangpaksa ?? '-' }}</span>.
            </div>
          </div>

          <div class="row full-width q-pb-sm">
            <div class="ttd-kanan">

              <div class="">
                Probolinggo, {{ humanDate(pasien?.tglkeluar) }}
              </div>
              <div class="text-bold q-py-xs q-pt-sm">
                Yang membuat pernyataan
              </div>
              <div style="padding-bottom: 20px" />
              <div>
                <img v-if="pasien?.ttd_yg_menyatakan" :src="pasien?.ttd_yg_menyatakan" alt="ttd yang menyatakan"
                  width="80">
                <div v-else>ttd</div>
              </div>
              <div class="q-py-xs">
                {{ pasien?.nama_penanggungjawab ?? '(...............................................................)'
                }}
              </div>

            </div>
            <div class="ttd-kiri">
              <div class="q-py-xs invisible">
                .
              </div>
              <div class="text-bold">
                Dokter / Petugas
              </div>
              <div class="column flex-center">
                <div class="q-pt-xs" style="width: 80px;">
                  <vue-qrcode :value="qrDokter" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: {
                      dark: '#000000',
                      light: '#ffffff',
                    },
                    margin: 0
                  }" />
                </div>
              </div>
              <div>
                {{ pasien?.dokter }}
              </div>
            </div>
          </div>
          <!-- <div class="row justify-between q-mt-xl">
            <div class="col-grow"></div>
            <div class="col-auto">
              <div class="column flex-center">
                <div>Probolinggo, Tgl {{ humanDate(pasien?.tglkeluar) }}</div>
                <div>Mengetahui</div>
                <div class="q-mb-sm">Dokter, </div>

                <div v-if="dpjp?.nama" style="height: 80px;" class="relative-position">
                  <div class="absolute-center" style="width: 80px;">
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
                </div>
                <div v-else style="height: 80px;" class="relative-position">
                  <div class="column flex-center full-height" style="width: 80px;">
                    <div>ttd</div>
                  </div>
                </div>

                <div class="q-mt-md">
                  {{ dpjp?.nama || '................................' }}
                </div>
              </div>
            </div>

          </div> -->

        </div>
        <!-- end -->
      </div>
    </div>
    <div v-else>
      <div class="column flex-center" style="height: 500px;">
        <div class="f-20">TIDAK ADA DOKUMEN</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { humanDate, jamTnpDetik, getNewLine } from 'src/modules/formatter.js'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { api, pathImg } from 'src/boot/axios';
import { useDiagnosaStore } from 'src/stores/simrs/ranap/diagnosa';
import { imageToBase64 } from 'src/modules/imgBase64';
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
  item: {
    type: Object,
    default: null
  },
})

// console.log('props', props?.pasien);


// const pengunjung = usePengunjungRanapStore()
// const ttdPasien = ref(null)


// const qrDokter = computed(() => {
//   const noreg = props?.pasien?.noreg// noreg
//   const dok = 'SUMMARY.png'
//   const asal = 'RANAP'
//   const petugas = props?.pasien?.kddokter ?? null
//   const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
//   return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
// })


const dpjp = ref(null)
const nomor = ref(null)
const diagnosa = ref(null)

const diag = useDiagnosaStore()

const qrDokter = computed(() => {

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SURAT-KEMATIAN.png'
  const asal = 'RANAP'
  const petugas = props?.pasien?.kddrygmenyatakan ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})
onMounted(() => {
  initImage(props?.pasien)
})

onBeforeMount(() => {
  // console.log('pasien', props?.pasien);
  Promise.all([getSurat(), getDpjpData()])
  getDiag()
})

const getDpjpData = async () => {
  const res = await api.get(`/v1/pegawai/master/pegawai-by-kdpegsimrs?kdpegsimrs=${props?.pasien?.kddrygmenyatakan}`)
  // console.log('res', res);
  if (res.status === 200) {
    dpjp.value = res.data

  }

}

function initImage(item) {
  console.log('item imgeee', item);
  if (!item?.ttdYgMenyatakan) {
    item.ttd_yg_menyatakan = null
    return
  }
  const ttdYgMenyatakan = pathImg + item?.ttdYgMenyatakan

  Promise.all([
    imageToBase64(ttdYgMenyatakan, (base64Image) => {
      // document.getElementsByClassName('ttd-yg-menyatakan')[0].src = base64Image
      // document.getElementsByClassName('ttd-yg-menyatakan')[1].src = base64Image
      item.ttd_yg_menyatakan = base64Image ?? ''
    })
  ])
}

const getSurat = async () => {
  const res = await api.get(`/v1/simrs/ranap/ruangan/no-surat?noreg=${props?.pasien?.noreg}`)
  console.log('res nomor', res);
  if (res.status === 200) {
    nomor.value = res.data
  }

}

const getDiag = () => {
  const dx = diag.listDiagnosa
  diagnosa.value = dx?.find(x => x?.kode === props?.pasien?.sebabkematian)?.keterangan ?? props?.pasien?.sebabkematian
}

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
    padding: 25px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: a4;
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

.ttd-kanan {
  position: relative;
  top: 50px;
  text-align: center;
  justify-content: center;
  width: 60%;
  height: 100px;
  left: 40%;
}

.ttd-kiri {
  position: relative;
  bottom: 50px;
  text-align: center;
  justify-content: center;
  width: 50%;
  height: 100px;
}
</style>
