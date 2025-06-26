<template>
  <div id="pdfDoc" class="bg-white print-page">
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
          <div class="text-center text-bold">
            {{ kasus?.uraian.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pasien -->
    <div class="flex justify-between kotak q-mt-xs q-pa-sm" style="gap:0 10px">
      <div class="col-auto">Nama : {{ pasien?.nama_panggil }}</div>
      <div class="col-auto">No. Register : {{ pasien?.noreg }}</div>
      <div class="col-auto">Tanggal : {{ dateFullFormat(pasien?.tglmasuk) }}</div>
      <div class="col-auto">Jam : {{ jamTnpDetik(pasien?.tglmasuk) }}</div>
    </div>

    <!-- Riwayat Kesehatan -->
    <div class="section">
      <div class="section-title">Riwayat Kesehatan : </div>
      <div class="data">
        <div class="data-item">1. Diagnosa masuk : {{ pasien?.memodiagnosa || '-' }}</div>
        <div class="data-item">2. Riwayat Kesehatan Sekarang : {{ anamnesisAwal?.riwayatpenyakitsekarang || '-' }}</div>
        <div class="data-item">3. Riwayat Penyakit Dahulu : {{ anamnesisAwal?.riwayatpenyakit || '-' }}</div>
        <div class="data-item">4. Riwayat Penyakit Keluarga : {{ anamnesisAwal?.riwayatpenyakitkeluarga || '-' }}</div>
        <div class="data-item">5. Riwayat Pekerjaan : {{
          anamnesisAwal?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya || '-' }}</div>
        <div class="data-item">6. Kelulah Nyeri : {{ anamnesisAwal?.keluhannyeri?.keluhan || '-' }}</div>
      </div>
    </div>
    <!-- Pemeriksaan Fisik -->
    <div class="section">
      <div class="section-title">Pemeriksaan Umum : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Kesadaran</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.tkKesadaranKet || ' - ' }}</td>
            <td style="border: none !important; padding: 0px !important; width: 15%;"> - Keadaan Umum </td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.keadaanUmum || ' - ' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Tekanan Darah</td>
            <td style="border: none !important; padding: 0px !important;">: {{
              pemeriksaanUmum?.sistole || ' -' }} / {{ pemeriksaanUmum?.diastole || ' -' }} mmHg</td>
            <td style="border: none !important; padding: 0px !important;"> - Keadaan Gizi</td>
            <td style="border: none !important; padding: 0px !important;">:
              {{ anamnesisAwal?.skreeninggizi?.dewasa?.keterangan || ' - ' }}
            </td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Nadi</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.nadi || ' - ' }} x/menit
            </td>
            <td style="border: none !important; padding: 0px !important;"></td>
            <td style="border: none !important; padding: 0px !important;"></td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Suhu </td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.suhu || ' - ' }} &deg;C
            </td>
            <td style="border: none !important; padding: 0px !important;"></td>
            <td style="border: none !important; padding: 0px !important;"></td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important;"> - Pernapasan</td>
            <td style="border: none !important; padding: 0px !important;">: {{ pemeriksaanUmum?.pernapasan || ' - ' }}
              x/menit</td>
            <td style="border: none !important; padding: 0px !important;"></td>
            <td style="border: none !important; padding: 0px !important;"></td>
          </tr>


        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>Bagian</th>
            <th>Normal</th>
            <th>Jika Tidak Normal, Jelaskan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kepala (Head)</td>
            <td>{{ pemeriksaanUmum?.rs5?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs5?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs5 : '' }} </td>
          </tr>
          <tr>
            <td>Leher (Neck)</td>
            <td>{{ pemeriksaanUmum?.rs6?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs6?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs6 : '' }} </td>
          </tr>
          <tr>
            <td>Dada & Payudara (Chest & Breast)</td>
            <td>{{ pemeriksaanUmum?.rs7?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs7?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs7 : '' }} </td>
          </tr>
          <tr>
            <td>Punggung (Back)</td>
            <td>{{ pemeriksaanUmum?.rs8?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs8?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs8 : '' }} </td>
          </tr>
          <tr>
            <td>Perut (Abdomen)</td>
            <td>{{ pemeriksaanUmum?.rs9?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs9?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs9 : '' }} </td>
          </tr>
          <tr>
            <td>Urogenital</td>
            <td>{{ pemeriksaanUmum?.rs13?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs13?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs13 : '' }} </td>
          </tr>
          <tr>
            <td>Tangan (Hand)</td>
            <td>{{ pemeriksaanUmum?.rs10?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs10?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs10 : '' }} </td>
          </tr>
          <tr>
            <td>Kaki (Foot)</td>
            <td>{{ pemeriksaanUmum?.rs11?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs11?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs11 : '' }} </td>
          </tr>
          <tr>
            <td>Status Neurologis (Neurological Status)</td>
            <td>{{ pemeriksaanUmum?.rs12?.toUpperCase() === 'TAK' ? 'TAK' : '' }}</td>
            <td> {{ pemeriksaanUmum?.rs12?.toUpperCase() !== 'TAK' ? pemeriksaanUmum?.rs12 : '' }} </td>
          </tr>
        </tbody>
      </table>

      <div class="section">
        <div class="section-title">Diagnosis Keperawatan</div>
        <table style="margin-top: -5px;">
          <thead>
            <tr>

              <th>DIAGNOSA KEPERAWATAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div v-for="(item, i) in pasien?.diagnosakeperawatan" :key="i">
                  <div> - {{ item?.nama }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>



      <div class="section">
        <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 17%">
                <div class="text-weight-bold">PENGOBATAN</div>
                <div class="text-italic">THERAPY</div>
              </td>
              <td valign="top" style="border: none !important; padding: 0px !important;"> : {{
                pasien?.planningdokter?.terapi }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 17%">
                <div class="text-weight-bold">RENCANA</div>
                <div class="text-italic">PLANNING</div>
              </td>
              <td valign="top" style="border: none !important; padding: 0px !important;">
                <div class="flex">
                  <div class="q-mr-sm">: </div>
                  <div>
                    <div>Monitoring : {{ pasien?.planningdokter?.monitor || '-' }}</div>
                    <div>Target : {{ pasien?.planningdokter?.target || '-' }}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 17%">
                <div class="text-weight-bold">CATATAN KIE</div>
                <div class="text-italic">EDUCATION NOTE</div>
              </td>
              <td valign="top" style="border: none !important; padding: 0px !important;"> : - </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
          <tbody>
            <tr style="border: none !important; padding: 0px !important;">
              <td style="border: none !important; padding: 0px !important; width: 17%">
                <div class="text-weight-bold">TANGGAL / DATE</div>
                <div class="text-italic">JAM / TIME</div>
              </td>
              <td valign="top" style="border: none !important; padding: 0px !important;"> : <b>Tanggal</b> {{
                dateFullFormat(pasien?.tglmasuk) }} / <b>Jam</b> {{ jamTnpDetik(pasien?.tglmasuk) }}</td>
            </tr>
          </tbody>
        </table>
      </div>


      <div class="section">

        <div class="flex justify-between q-mx-xl">
          <!-- <div class="flex-center " style="width: 60px;">
          <div class="relative-position">
            <vue-qrcode :value="qrDokter" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: {
                dark: '#000000',
                light: '#ffffff',
              },
              margin: 0
            }" />
          </div>
          <div class="f-8 text-wrap text-center">{{ dpjp?.nama }}</div>
        </div> -->

          <div></div>


          <div class="column flex-center ">

            <div>DOKTER</div>
            <div style="margin-top: -5px; margin-bottom: 10px;">DOCTOR</div>

            <div class="relative-position" style="width: 80px;">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
              <!-- <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH"> -->
            </div>
            <div class="text-wrap text-center">{{ dpjp?.nama }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'
import { computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Array,
    default: null
  }
})


const anamnesisAwal = computed(() => {
  const awal = props?.pasien?.anamnesis?.find(x => x?.awal === '1' && x?.nakes === '2') || null
  // console.log('awal', awal)

  return awal
})

const pemeriksaanUmum = computed(() => {
  const awal = props?.pasien?.pemeriksaan?.find(x => x?.awal === '1' && x?.nakes === '2') || null
  console.log('awal pemerikasaan', awal)

  return awal
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
