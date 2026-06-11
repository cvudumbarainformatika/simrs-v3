<template>
  <div class="fit column">
    <div class="col-auto ">
      <div class="q-pa-md flex justify-between bg-teal text-white items-center">
        <div>{{ menu?.label || 'Billing' }}</div>
        <q-btn icon="icon-mat-print" flat dense size="md" v-print="printObj" />
      </div>
    </div>
    <div class="col full-height q-pa-md scroll">
      <!-- <DokPage id="serahterima" ref="refResume" :pasien="pasien" :menu="menu" :data-header="dataHeader" /> -->

      <div id="pdfDoc" class="bg-white relative-position">
        <!-- KOP SURAT -->
        <!-- <KopSurat :dataHeader="dataHeader" :pasien="pasien" /> -->
        <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['BILLING', 'FISIOTERAPI', '']" />
        <q-separator style="padding-bottom: 2px;" color="black"></q-separator>
        <div class="text-center q-py-sm text-bold">BILLING PASIEN</div>

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
              <tr class="text-bold">
                <td style="border: none; ">1.</td>
                <td style="border: none; ">Tindakan</td>
                <td style="border: none; width:120px;"></td>
              </tr>
              <tr v-for="(tindakan, n) in tindakans" :key="n">
                <td class="" style="border: none; "></td>
                <td style="border: none; ">{{ tindakan?.tindakan ?? '.........' }}</td>
                <td style="border: none; border-bottom: 1px solid black;" class="text-right">Rp. {{
                  formatRp(tindakan?.harga)
                  ?? 'Rp.0' }}
                </td>
              </tr>

              <tr class="text-bold">
                <td style="border: none; ">2.</td>
                <td style="border: none; ">Biaya Pelayanan Penunjang</td>
                <td style="border: none; "></td>
              </tr>
              <tr>
                <td style="border: none; "></td>
                <td style="border: none; ">Laborat</td>
                <td style="border: none; border-bottom: 1px solid black;" class="text-right">
                  <span class="text-right">Rp. {{ formatRp(totalLaborats || 0) }}</span>
                </td>
              </tr>
              <tr>
                <td style="border: none; "></td>
                <td style="border: none; ">Radiologi</td>
                <td style="border: none; border-bottom: 1px solid black;" class="text-right">Rp. {{
                  formatRp(totalRadiologi || 0) }}</td>
              </tr>

              <tr>
                <td style="border: none; " class="text-bold">3.</td>
                <td style="border: none; " class="text-bold">Biaya Farmasi</td>
                <td style="border: none; border-bottom: 1px solid black;" class="text-right">Rp. {{
                  formatRp(totalFarmasis || 0) }}</td>
              </tr>

              <tr class="text-bold">
                <td style="border: none; "></td>
                <td style="border: none; " class="text-right">TOTAL : </td>
                <td style="border: none; border-top: 1px solid black;" class=" text-right">Rp. {{
                  formatRp(total || 0) }}</td>
              </tr>




            </table>


          </div>

        </div>

        <div style="width: 300px; margin-left: auto; text-align: center;">

          <!-- Tanggal -->
          <div style=" margin-bottom: 4px; margin-top: 50px;">
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
import { humanDate, formatRp } from 'src/modules/formatter';
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
    ?.map(item => {
      return {
        tindakan: item?.mastertindakan?.rs2,
        harga: item?.subtotal
      }
    })
    ?.filter(Boolean) // hapus null/undefined/empty string
  // ?.join(', ') || '-' // fallback kalau kosong

  return list
})
const radiologis = computed(() => {
  const list = props?.pasien?.radiologi
    ?.flatMap(item => item?.rincians || [])

  return list
})

const totalRadiologi = computed(() => {
  const list = props?.pasien?.radiologi
    ?.flatMap(item => item?.rincians || [])
    ?.reduce((total, item) => total + Number(item?.subtotal || 0), 0)

  return list
})

const totalTindakans = computed(() => {
  const list = props?.pasien?.tindakan
    ?.map(item => {
      return {
        tindakan: item?.mastertindakan?.rs2,
        harga: item?.subtotal
      }
    })
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.reduce((total, item) => total + Number(item?.harga || 0), 0)

  return list
})

const totalFarmasis = computed(() => {
  const list = props?.pasien?.newapotekrajal
    ?.flatMap(item => item?.permintaanresep || [])
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.reduce((total, item) => total + Number(item?.hargajual || 0), 0)
  console.log('list', list);

  return list
})
const totalLaborats = computed(() => {
  const list = props?.pasien?.laborats
    ?.flatMap(item => item?.permintaanresep || [])
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.reduce((total, item) => total + Number(item?.hargajual || 0), 0)
  console.log('lab', list);

  return list
})

const total = computed(() => {
  const total = totalTindakans.value + totalRadiologi.value + totalFarmasis.value + totalLaborats.value
  return total
})


const laborats = computed(() => {
  const list = props?.pasien?.laborats
    ?.map(item => item?.rs4)
    ?.filter(Boolean) // hapus null/undefined/empty string
    ?.join(', ') || '-' // fallback kalau kosong

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