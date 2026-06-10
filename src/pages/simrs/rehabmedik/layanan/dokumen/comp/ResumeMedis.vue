<template>
  <div class="fit column">
    <div class="col-auto ">
      <div class="q-pa-md flex justify-between bg-teal text-white items-center">
        <div>{{ menu?.label || 'Resume Medis' }}</div>
        <q-btn icon="icon-mat-print" flat dense size="md" v-print="printObj" />
      </div>
    </div>
    <div class="col full-height q-pa-md scroll">
      <!-- <DokPage id="serahterima" ref="refResume" :pasien="pasien" :menu="menu" :data-header="dataHeader" /> -->

      <div id="pdfDoc" class="bg-white relative-position">
        <!-- KOP SURAT -->
        <!-- <KopSurat :dataHeader="dataHeader" :pasien="pasien" /> -->
        <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['RESUME MEDIS', 'FISIOTERAPI', '']" />
        <q-separator style="padding-bottom: 2px;" color="black"></q-separator>
        <div class="text-center q-py-sm text-bold">RESUME MEDIS (Medical Discahrage Summary)</div>

        <!-- <div class="section-title">Identitas Pasien</div> -->
        <div class="section q-px-md" style="margin-top: -25px;">


          <table class="full-width" style="border: none;">
            <thead>
              <tr>
                <td style="border: none;">Nama</td>
                <td style="border: none;">: {{ pasien?.nama_panggil ?? '.........' }}</td>
                <td style="border: none;">No. RM</td>
                <td style="border: none;">: {{ pasien?.norm ?? '.........' }}</td>

              </tr>
              <tr>
                <td style="border: none; white-space: nowrap;">No. Registrasi</td>
                <td style="border: none;">: {{ pasien?.noreg ?? '.........' }}</td>
                <td style="border: none;">Umur</td>
                <td style="border: none;">: {{ pasien?.usia ?? '.........' }}</td>

              </tr>
              <tr>
                <td style="border: none;">Ruangan</td>
                <td style="border: none;">: {{ pasien?.ruangan ?? '.........' }}</td>
                <td style="border: none;">dokter</td>
                <td style="border: none;">: {{ pasien?.dokter ?? '.........' }}</td>

              </tr>
              <tr>
                <td style="border: none;">Tgl Masuk</td>
                <td style="border: none;">: {{ pasien?.tgl_kunjungan ?? '.........' }}</td>
                <td style="border: none;">Sistem Bayar</td>
                <td style="border: none;">: {{ pasien?.sistembayar ?? '.........' }}</td>

              </tr>

              <!-- Alamat full width -->
              <tr>
                <td style="border: none; vertical-align: top;">Alamat</td>
                <td colspan="3" style="border: none;">:
                  {{ pasien?.alamat ?? '.........' }}
                </td>
              </tr>

            </thead>
          </table>

          <hr>


          <div class="section q-px-sm">

            <table class="full-width " style="border: none; margin-top: 2px; table-layout: fixed;">
              <colgroup>
                <col style="width: 30px;">
                <col>
              </colgroup>
              <tr>
                <td class="" style="border: none; ">1.</td>
                <td style="border: none; width:160px;">Diagnosis (Assesment)</td>
                <td style="border: none; "> : {{ asessmentDokter?.asessment ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">2.</td>
                <td style="border: none; ">Anamnese (Subyektif)</td>
                <td style="border: none; ">: {{ asessmentDokter?.subjective ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">3.</td>
                <td style="border: none; ">Obyektif </td>
                <td style="border: none; ">: {{ asessmentDokter?.objective ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">4.</td>
                <td style="border: none; ">Edukasi </td>
                <td style="border: none; ">: {{ asessmentDokter?.edukasi ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">5.</td>
                <td style="border: none; ">Laborat </td>
                <td style="border: none; ">: {{ laborats ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">6.</td>
                <td style="border: none; ">Radiologi </td>
                <td style="border: none; ">: {{ radiologis ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">7.</td>
                <td style="border: none; ">Obat </td>
                <td style="border: none; ">: {{ farmasis ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">8.</td>
                <td style="border: none; ">Tindakan </td>
                <td style="border: none; ">: {{ tindakans ?? '.........' }}</td>
              </tr>
              <tr>
                <td class="" style="border: none; ">9.</td>
                <td style="border: none; ">Rencana Tindak Lanjut </td>
                <td style="border: none; ">: {{ asessmentDokter?.rencana ?? '.........' }}</td>
              </tr>



            </table>


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
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue';

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
  const data = a?.length ? a?.find(item => item?.awal === '1' && item?.nakes === '1') ?? null : null
  console.log('data asessment dokter', data);

  return data
})


const tindakans = computed(() => {
  const list = props?.pasien?.tindakan
    ?.map(item => item?.mastertindakan?.rs2)
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.join(', ') || '-' // fallback kalau kosong

  return list
})
const radiologis = computed(() => {
  const list = props?.pasien?.radiologi
    ?.map(item => item?.rs4)
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.join(', ') || '-' // fallback kalau kosong

  return list
})
const laborats = computed(() => {
  const list = props?.pasien?.laborats
    ?.map(item => item?.rs4)
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.join(', ') || '-' // fallback kalau kosong

  return list
})

const farmasis = computed(() => {
  const list = props?.pasien?.newapotekrajal
    ?.flatMap(item => item?.permintaanresep || [])
    ?.map(item => item?.mobat?.nama_obat)
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.join(', ') || '-' // fallback kalau kosong
  // console.log('list', list);

  return list
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
  padding: 1px 4px;
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