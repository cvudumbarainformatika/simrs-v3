<template>
  <div class="fit column">
    <div class="col-auto ">
      <div class="q-pa-md flex justify-between bg-teal text-white items-center">
        <div>{{ menu?.label }}</div>
        <q-btn icon="icon-mat-print" flat dense size="md" v-print="printObj" />
      </div>
    </div>
    <div class="col full-height q-pa-md scroll">
      <!-- <DokPage id="serahterima" ref="refResume" :pasien="pasien" :menu="menu" :data-header="dataHeader" /> -->

      <div id="pdfDoc" class="bg-white relative-position">
        <!-- KOP SURAT -->
        <KopSurat :dataHeader="dataHeader" :pasien="pasien" />
        <q-separator style="padding-bottom: 2px;" color="black"></q-separator>
        <div class="text-center q-py-sm text-bold">Formulir Rawat Jalan KTR Asessment Re-Asessment Protokol Terapi</div>

        <div class="section-title">Identitas Pasien</div>
        <div class="section" style="margin-top: -25px;">
          <!-- <div class="row justify-between full-width">
            <div class="column q-ml-xs">
              <div class="row flex full-width">
                <div class="col-4 bg-red">Nama</div>
                <div class="col-8 bg-yellow"> : Nama</div>
              </div>
            </div>
            <div class="bg-yellow">Kanan</div>
          </div> -->


          <table class="full-width" style="border: none;">
            <thead>
              <tr>
                <td style="border: none;">
                  <div class="row full-width">
                    <div class="col-2">No. Rekam Medis</div>
                    <div class="col-10"> : {{ pasien?.norm }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-2">Nama</div>
                    <div class="col-10"> : {{ pasien?.nama }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-2"> Tanggal Lahir</div>
                    <div class="col-10"> : {{ pasien?.tgllahir }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-2">Alamat</div>
                    <div class="col-10"> : {{ pasien?.alamat }}</div>
                  </div>

                </td>

              </tr>

            </thead>
          </table>


          <div class="section">
            <div class="section-title">Asessment Dokter</div>
            <div class="section-title text-italic" style="margin-top:-10px; margin-bottom: -2px;">Subjective</div>
            <div class="q-ml-md q-mb-sm"> {{ asessmentDokter?.subjective ?? '.........' }} </div>
            <div class="section-title text-italic" style=" margin-bottom: -2px;">Objective</div>
            <div class="q-ml-md q-mb-sm"> {{ asessmentDokter?.objective ?? '.........' }} </div>
            <div class="section-title text-italic" style=" margin-bottom: -2px;">Assessment</div>
            <div class="q-ml-md q-mb-sm"> {{ asessmentDokter?.asessment ?? '.........' }} </div>
            <div class="section-title text-italic" style=" margin-bottom: -2px;">Planning</div>
            <table class="full-width " style="border: none; margin-top: 2px; table-layout: fixed;">
              <colgroup>
                <col style="width: 30px;">
                <col>
              </colgroup>
              <tr class="text-bold">
                <td class="" style="border: none; ">a.</td>
                <td style="border: none; ">goal of treatment</td>
              </tr>
              <tr>
                <td class="" style="border: none; "></td>
                <td style="border: none; ">{{ asessmentDokter?.goal ?? '.........'
                }}</td>
              </tr>
              <tr class="text-bold">
                <td class="" style="border: none; ">b.</td>
                <td style="border: none; ">Tindakan Program rehabiliasi Medik</td>
              </tr>
              <tr>
                <td class="" style="border: none; "></td>
                <td style="border: none; ">{{ asessmentDokter?.tindakan ?? '.........'
                }}</td>
              </tr>
              <tr class="text-bold">
                <td class="" style="border: none; ">c.</td>
                <td style="border: none; ">Edukasi</td>
              </tr>
              <tr>
                <td class="" style="border: none; "></td>
                <td style="border: none; ">{{ asessmentDokter?.edukasi ?? '.........'
                }}</td>
              </tr>
              <tr class="text-bold">
                <td class="" style="border: none; ">d.</td>
                <td style="border: none; ">Frekuensi Kunjungan</td>
              </tr>
              <tr>
                <td class="" style="border: none; "></td>
                <td style="border: none; ">{{ asessmentDokter?.frekuensi ?? '-'
                }}</td>
              </tr>
            </table>

            <div class="section-title text-italic" style=" margin-bottom: -2px;">Rencana Tindak Lanjut (Evaluasi Rujuk
              Selesai? )</div>
            <div class="q-ml-md q-mb-sm "> {{ asessmentDokter?.rencana ?? '.........' }} </div>
          </div>

        </div>

        <div style="width: 300px; margin-left: auto; text-align: center;">

          <!-- Tanggal -->
          <div style=" margin-bottom: 4px;">
            Probolinggo, {{ humanDate(props?.pasien?.tgl_kunjungan) }}
          </div>

          <!-- Jabatan -->
          <div style="font-weight: bold; margin-bottom: 10px;">
            Dokter Penanggung Jawab Pelayanan
          </div>

          <!-- QR -->
          <div style="display: flex; justify-content: center; margin: 10px 0;">
            <div style="width: 90px;">
              <vue-qrcode :value="getQr(asessmentDokter?.petugas)" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: { dark: '#000000', light: '#ffffff' },
                margin: 0
              }" />
            </div>
          </div>

          <!-- Nama Dokter -->
          <div style="margin-top: 10px; font-weight: 500;">
            <div>{{ asessmentDokter?.petugas?.nama }}</div>
          </div>

        </div>



      </div>


    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { humanDate } from 'src/modules/formatter';

const KopSurat = defineAsyncComponent(() => import('./compLembarKunjungan/KopSurat.vue'))
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
    type: Object,
    default: null
  }
})

const printObj = {
  id: 'pdfDoc',
  popTitle: 'Lembar Kunjungan Pasien Rehabmedik'

}


const asessmentDokter = computed(() => {

  const a = props?.pasien?.soap || props.pasien?.kunjungan_rehab
  return a?.length ? a?.find(item => item?.awal === '1' && item?.nakes === '1') ?? null : null
})

const lists = computed(() => {

  const a = props?.pasien?.kunjungan_rehab
  return a
})

const getQr = (item) => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASESSMENT-DOKTER-REHABILITASIMEDIK.png'
  const asal = 'RAJAL'
  const petugas = item?.kdpegsimrs
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
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
  // width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  // width: max-content;
}

th,
td {
  border: none;
  padding: 2px 4px;
  text-align: top;
  width: min-content;
}

th {
  background-color: #f2f2f2;
}

.looping-page {
  // background-color: #ffffff;
  padding: 20px !important;
  font-size: 12px;
}

/* Garis pemisah antar halaman di browser */
.looping-page:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 2px;
  // background: repeating-linear-gradient(to right,
  //     transparent,
  //     transparent 10px,
  //     #ccc 10px,
  //     #ccc 20px);
}

@media print {
  .looping-page {
    padding: 0px !important;
    -webkit-print-color-adjust: exact;
    page-break-after: always;
  }

  .hide-when-print {
    display: none !important;
  }

  .looping-page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }

  .looping-page:last-child {
    page-break-after: auto;
  }



  @page {
    size: letter;
    page-break-inside: always;

    @bottom-right {
      content: "Dokumen Sah dari RSUD MOH SALEH KOTA PROBOLINGGO | Hal Ke-" counter(page);
    }
  }

  .contentx {
    page-break-after: auto;
  }
}
</style>