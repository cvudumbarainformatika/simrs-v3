<template>
  <div id="pdfDoc" class="bg-white print-page">
    <div v-if="store?.items.length" class="page-1">
      <!-- KOP SURAT -->
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
            <div class="text-center text-bold">
              RAWAT INAP
            </div>
            <!-- <div class="text-center text-bold">
              {{ kasus?.uraian.toUpperCase() }}
            </div> -->
          </div>
        </div>
      </div>
      <div class="contentx kotak q-mt-xs">
        <div class="full-width flex justify-between q-pa-sm">

          <!-- BIO -->
          <div class="kiri">
            <div class="flex q-gutter-sm">
              <div style="width:80px">Nomor RM </div>
              <div> : {{ pasien?.norm }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width:80px">Nama Pasien </div>
              <div> : {{ pasien?.nama_panggil }}</div>
            </div>
          </div>
          <div class="kanan text-right justify-end">
            <div class="flex q-gutter-sm">
              <div style="width:120px;">Tgl Pengisian </div>
              <div> : {{ humanDate(store?.items[0]?.created_at) }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width:120px;">Jam Pengisian </div>
              <div> : {{ jamTnpDetik(store?.items[0]?.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- ISI -->
        <div style="border-top: black 1px solid;" class="q-pa-md">

          <div class="flex q-gutter-sm">
            <div class="text-weight-bold">1.</div>
            <div class="column">
              <div class="text-weight-bold">ASSESMEN</div>
              <div class="flex q-gutter-md ">
                <div>A. </div>
                <div class="column">
                  <div class="flex q-gutter-sm">
                    <div>ANTROPOMETRI</div>
                    <div>{{ store?.items[0]?.antropometri }}</div>
                  </div>
                  <div class="flex q-gutter-sm">
                    <div>STATUS GIZI</div>
                    <div>: {{ store?.items[0]?.status_gizi }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


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
import { api } from 'src/boot/axios';
import { useDiagnosaStore } from 'src/stores/simrs/ranap/diagnosa';
import { usePagtStore } from 'src/stores/simrs/ranap/pagt';
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
const store = usePagtStore()


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

onBeforeMount(() => {
  // console.log('pasien', props?.pasien);
  Promise.all([store.getData(props?.pasien), getDpjpData()])
  getDiag()
})

const getDpjpData = async () => {
  const res = await api.get(`/v1/pegawai/master/pegawai-by-kdpegsimrs?kdpegsimrs=${props?.pasien?.kddrygmenyatakan}`)
  // console.log('res', res);
  if (res.status === 200) {
    dpjp.value = res.data

  }

}


const getDiag = () => {
  const dx = diag.listDiagnosa
  diagnosa.value = dx?.find(x => x?.kode === props?.pasien?.sebabkematian)?.keterangan ?? props?.pasien?.sebabkematian
}

</script>


<style lang="scss" scoped>
.kotak {
  border: 1px solid black;
}

.sisi-kanan {
  border-right: 1px solid black;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.section {
  margin-top: 20px;
}

.section-title {
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.data {
  margin-left: 20px;
}

.data-item {
  margin-bottom: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #000;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
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
