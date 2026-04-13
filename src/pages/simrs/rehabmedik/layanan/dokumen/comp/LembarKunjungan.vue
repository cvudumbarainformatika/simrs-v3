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

        <div class="section" style="margin-top: -20px;">
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
                    <div class="col-5">NAMA</div>
                    <div class="col-7"> : {{ pasien?.nama_panggil }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-5">NO. KARTU</div>
                    <div class="col-7"> : {{ pasien?.noka }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-5">DIAGNOSIS MEDIS</div>
                    <div class="col-7"> : {{ pasien?.memodiagnosa }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-5">RENCANA TERAPI</div>
                    <div class="col-7"> : {{ asessmentDokter?.frekuensi }} {{ asessmentDokter?.rencana }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-5">GOL TERAPI</div>
                    <div class="col-7"> : {{ asessmentDokter?.goal }}</div>
                  </div>
                </td>
                <td style="border: none; vertical-align: top;">
                  <div class="row full-width">
                    <div class="col-3">NO. RM</div>
                    <div class="col-9"> : {{ pasien?.norm }}</div>
                  </div>
                  <div class="row full-width">
                    <div class="col-3">DOKTER</div>
                    <div class="col-9"> : {{ pasien?.dokter }}</div>
                  </div>
                </td>
              </tr>

            </thead>
          </table>


          <table class="full-width ">
            <thead>
              <tr>
                <th rowspan=" 2" class="border">NO</th>
                <th rowspan="2" class="border">TANGGAL</th>
                <th rowspan="2" class="border">NO.SEP</th>
                <th rowspan="2" class="border" style="text-align: center;">TINDAKAN</th>
                <th colspan="2" class="border" style="text-align: center;">PARAF</th>
              </tr>
              <tr>
                <th class="border px-2 py-1" style="text-align: center;">PASIEN</th>
                <th class="border px-2 py-1" style="text-align: center;">PETUGAS</th>
              </tr>
            </thead>
            <tbody v-if="lists?.length > 0">
              <tr class="border" v-for="(item, i) in lists">
                <td>{{ i + 1 }}</td>
                <td>{{ item?.tgl_kunjungan }}</td>
                <td>{{ item?.sep }}</td>
                <td>
                  <div v-for="(t, x) in item?.tindakan">
                    - {{ t?.mastertindakan?.rs2 }}
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
              <!-- FILLER -->
              <tr v-for="n in (10 - lists.length)" :key="'f' + n" class="border">
                <td>{{ lists.length + n }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr class="border" v-for="i in 8">
                <td>{{ i + 1 }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

        </div>



      </div>


    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';

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

  const a = props?.pasien?.soap
  return a?.length ? a?.find(item => item?.awal === '1' && item?.nakes === '1') ?? null : null
})

const lists = computed(() => {

  const a = props?.pasien?.kunjungan_rehab
  return a
})
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
  border: 1px solid #000;
  padding: 10px;
  text-align: left;
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