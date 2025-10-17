<template>
  <div id="pdfDoc" class="bg-white relative-position">

    <div v-if="store.loading" class="full-height">
      <div class="full-height column flex-center">
        Harap Tunggu ...
      </div>
    </div>

    <div v-else>
      <div v-if="store.historys?.length === 0" class="full-height column flex-center" style="min-height: 400px;">
        <div class="full-height column flex-center">
          Belum Ada Data
        </div>
      </div>

    </div>
    <template v-else>
      <div v-for="item in store.historys" :key="item" class="looping-page">
        <!-- KOP SURAT -->
        <div class="col-grow kotak">
          <div class="row items-center">

            <div class="col-9 sisi-kanan">
              <div class="row q-pa-sm">
                <div class="col-auto">
                  <img src="~assets/images/logo-rsud.png" style="width: 80px;">
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
                {{ menu?.desc }}
              </div>
              <!-- <div class="text-center text-bold">
              {{ kasus?.uraian.toUpperCase() }}
            </div> -->
            </div>
          </div>
        </div>


        <div class="section">
          <table border="0" style="width:100% ; border: none !important; margin-left: 10px; margin-top: -5px;">
            <tbody>
              <tr style="border: none !important; padding: 0px !important;">
                <td style="border: none !important; padding: 0px !important; width:15%;"> NAMA PASIEN</td>
                <td style="border: none !important; padding: 0px !important; width:45%"> : {{
                  pasien?.nama_panggil }}
                </td>
                <td style="border: none !important; padding: 0px !important; width:15%;"> DPJP</td>
                <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{ pasien?.dokter }}
                </td>
              </tr>
              <tr style="border: none !important; padding: 0px !important;">
                <td style="border: none !important; padding: 0px !important; width:15%;"> NO RM</td>
                <td style="border: none !important; padding: 0px !important; width:45%"> : {{ pasien?.norm }}
                </td>
                <td style="border: none !important; padding: 0px !important; width:15%;"> Tgl Serah Terima</td>
                <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                  dateFullFormat(item?.tglmasuk) }}
                </td>
              </tr>
              <tr style="border: none !important; padding: 0px !important;">
                <td style="border: none !important; padding: 0px !important; width:15%;"> TANGGAL LAHIR</td>
                <td style="border: none !important; padding: 0px !important; width:45%"> : {{ pasien?.tgllahir }}</td>
                <td style="border: none !important; padding: 0px !important; width:15%;"> Jam</td>
                <td style="border: none !important; padding: 0px !important; width: 30%;"> : {{
                  jamTnpDetik(item?.tglmasuk) }}
                </td>
              </tr>
              <tr style="border: none !important; padding: 0px !important;">
                <td style="border: none !important; padding: 0px !important; width:15%;"> Jenis Kelamin</td>
                <td style="border: none !important; padding: 0px !important; "> : {{ pasien?.kelamin }}</td>
              </tr>
              <tr style="border: none !important; padding: 0px !important;">
                <td style="border: none !important; padding: 0px !important; width:15%; vertical-align: top;"> Alamat
                </td>
                <td style="border: none !important; padding: 0px !important; " colspan="3"> : {{ pasien?.alamat }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section q-mb-xs" style="margin-top: -5px;">
          <hr>
          <div class="row q-col-gutter-x-sm">
            <div class="col-12 relative-position">
              <div class="row q-col-gutter-x-sm">
                <div class="col-2">Alasan dirawat</div>
                <div class="col-10"> : {{ pasien?.anamnesis[0]?.riwayatpenyakitsekarang || ' - ' }}</div>
              </div>
              <div class="absolute-right">
                <div class="column text-center kotak q-pa-sm">
                  <div>Derajat Pasien</div>
                  <div class="text-bold f-14 q-mt-xs ">{{ item?.serah_terima?.derajatPasien }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 text-bold q-mt-sm">DATA FOKUS</div>
            <div class="col-6">
              <div class="row">
                <div class="col-2">Subyektif</div>
                <div class="col-10"> : {{ pasien?.anamnesis[0]?.riwayatalergi }} {{
                  pasien?.anamnesis[0]?.keteranganalergi
                  }}</div>
              </div>
            </div>
            <div class="col-6 ">
              <div class="row">
                <div class="col-2">Alergi</div>
                <div class="col-10"> : {{ pasien?.anamnesis[0]?.riwayatalergi }} {{
                  pasien?.anamnesis[0]?.keteranganalergi
                  }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-2">Obyektif</div>
                <div class="col-10 ">
                  :
                </div>
              </div>
            </div>
            <div class="col-6 ">
              <div class="flex q-gutter-x-sm">
                <div>Skala Nyeri</div>
                <div> : {{ item?.serah_terima?.skalaNyeri }}</div>
              </div>
            </div>
            <div class="col-12 ">
              <div class="flex q-gutter-x-sm">
                <div class="text-bold">Tensi</div>
                <div> : {{ item?.serah_terima?.sistole || '-' }} / {{ item?.serah_terima?.diastole || '-' }} mMHg,
                </div>
                <div class="text-bold">Nadi</div>
                <div> : {{ item?.serah_terima?.nadi || '-' }} x/menit, </div>
                <div class="text-bold">Suhu</div>
                <div> : {{ item?.serah_terima?.suhu || '-' }} &#8451;, </div>
                <div class="text-bold">RR</div>
                <div> : {{ item?.serah_terima?.rr || '-' }} x/menit, </div>
                <div class="text-bold">SPO2</div>
                <div> : {{ item?.serah_terima?.spo2 || '-' }} %, </div>
              </div>
            </div>

            <div class="col-12">
              <div class="flex q-gutter-x-md">
                <div>Diagnosa</div>
                <div> : {{ pasien?.manymemo?.length ? pasien?.manymemo[0]?.diagnosa : '-' }}</div>
              </div>
            </div>


            <div class="col-12 text-bold q-mt-sm">MASALAH KEPERAWATAN</div>
            <div class="col-12 column q-pl-lg">
              <template v-if="pasien?.diagnosakeperawatan?.length">

                <div v-for="(item, index) in pasien?.diagnosakeperawatan" :key="index" class="flex q-gutter-x-sm">
                  <div>{{ index + 1 }} . </div>
                  <div> {{ item?.nama }}</div>
                </div>
              </template>
              <template v-else>
                <div class="flex q-gutter-x-sm">
                  -
                </div>
              </template>

            </div>

            <div class="col-12 text-bold q-mt-sm">TINDAKAN KEPERAWATAN</div>
            <div class="col-12 column q-pl-lg">
              <template v-if="pasien?.diagnosakeperawatan?.length">

                <div v-for="(item, index) in pasien?.diagnosakeperawatan[0]?.intervensi" :key="index"
                  class="flex q-gutter-x-sm">
                  <div>{{ index + 1 }} . </div>
                  <div> {{ item?.masterintervensi?.nama }}</div>
                </div>
              </template>
              <template v-else>
                <div class="flex q-gutter-x-sm">
                  -
                </div>
              </template>

            </div>

            <div class="col-12 text-bold q-mt-sm">TERAPI DAN OBAT</div>
            <div class="col-12">
              <q-markup-table separator="cell" flat dense bordered>
                <thead class="">
                  <tr>
                    <th class="text-left">Terapi dan Obat</th>
                    <th class="text-right">Dosis</th>
                    <th class="text-right">Jam Masuk</th>
                    <th class="text-right">Sisa Obat</th>
                    <th class="text-right">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="item?.serah_terima?.terapis?.length">
                    <tr v-for="(rinci, index) in item?.serah_terima?.terapis" :key="index">
                      <td class="text-left">
                        {{ rinci.obat }}
                      </td>
                      <td class="text-right">
                        {{ rinci.dosis }}
                      </td>
                      <td class="text-right">
                        {{ rinci.jamMasuk }}
                      </td>
                      <td class="text-right">
                        {{ rinci.sisa }}
                      </td>
                      <td class="text-right">
                        {{ rinci.ket }}
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="5" class="text-center">Tidak Ada Data Terapi</td>
                    </tr>
                  </template>
                </tbody>
              </q-markup-table>

            </div>

            <div class="col-12 q-mt-sm">
              <div class="flex q-gutter-x-md">
                <div>Rencana Terapi / Tindakan /Pemeriksaan</div>
                <div class="col-10"> : {{ item?.serah_terima?.plann }}</div>
              </div>
            </div>
            <div class="col-12">
              <div class="column">
                <div>Pemeriksaan yang disertakan : </div>
                <div class="row q-col-gutter-x-sm">
                  <div class="col-2">RO </div>
                  <div class="col-10">: {{ item?.serah_terima?.ro || '-' }} </div>
                  <div class="col-2">LAB </div>
                  <div class="col-10"> : {{ item?.serah_terima?.lab || '-' }} </div>
                  <div class="col-2">ECG </div>
                  <div class="col-10"> : {{ item?.serah_terima?.ecg || '-' }} </div>
                  <div class="col-2">Lain-lain </div>
                  <div class="col-10"> : {{ item?.lainlain || '-' }}</div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="flex q-gutter-x-md">
                <div>Kelengkapan yang disertakan </div>
                <div class="col-10"> : {{ item?.serah_terima?.kelengkapan || '-' }}</div>
              </div>
            </div>
            <div class="col-12 q-mt-sm">
              <div class="flex q-gutter-x-md">
                <div>Kondisi Pasien Saat Terima </div>
              </div>
              <div class="col-12 row">
                <div class="col-6">
                  <div class="row">
                    <div class="col-3">Keadaan Umum</div>
                    <div class="col-9 ">
                      : {{ item?.serah_terima?.keadaanUmum || '-' }}
                    </div>
                  </div>
                </div>
                <div class="col-6 ">
                  <div class="row">
                    <div class="col-2">Kesadaran</div>
                    <div class="col-10"> : {{ item?.serah_terima?.kesadaran || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 ">
              <div class="flex q-gutter-x-sm">
                <div class="text-bold">Tensi</div>
                <div> : {{ item?.serah_terima?.sistole_trm || '-' }} / {{ item?.serah_terima?.diastole_trm || '-' }}
                  mMHg, </div>
                <div class="text-bold">Nadi</div>
                <div> : {{ item?.serah_terima?.nadi_trm || '-' }} x/menit, </div>
                <div class="text-bold">Suhu</div>
                <div> : {{ item?.serah_terima?.suhu_trm || '-' }} &#8451;, </div>
                <div class="text-bold">RR</div>
                <div> : {{ item?.serah_terima?.rr_trm || '-' }} x/menit, </div>
                <div class="text-bold">SPO2</div>
                <div> : {{ item?.serah_terima?.spo2_trm || '-' }} %, </div>
              </div>
            </div>

            <div class="col-12 q-mt-sm">

              <div class="row">
                <div class="col-6">
                  <div class="row">
                    <div class="col-3">Ruangan Asal</div>
                    <div class="col-9 ">
                      : {{ item?.nm_ruanglm || '-' }}
                    </div>
                  </div>
                </div>
                <div class="col-6 ">
                  <div class="flex q-gutter-x-sm">
                    <div class="">Ruangan Penerima</div>
                    <div class=""> : {{ item?.nm_ruang || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>


          <div class="row q-px-lg q-pt-md justify-between items-center">
            <div class="kiri text-center">
              <div><b>PERAWAT PENERIMA </b></div>
              <div class="column flex-center">
                <div style="width: 80px;">
                  <vue-qrcode :value="getUrl(item)" tag="svg" :options="{
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
                <b>{{ item?.serah_terima?.nmuser_serah }}</b>
              </div>
            </div>
            <div class="kanan text-center">
              <div><b>PERAWAT PENGIRIM</b></div>
              <div class="column flex-center">
                <div style="width: 80px;">
                  <vue-qrcode :value="getUrl2(item)" tag="svg" :options="{
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
                <b>{{ item?.serah_terima?.nmuser_trm }}</b>
              </div>
            </div>
          </div>
        </div>

        <!-- Separator tampil di browser, disembunyikan saat print -->
        <q-separator class="q-my-xl hide-when-print" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useMutasiRanapStore } from 'src/stores/simrs/ranap/mutasi';
import { useDiagnosaKeperawatan } from 'src/stores/simrs/pelayanan/poli/diagnosakeperawatan'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter';

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

const store = useMutasiRanapStore()
const diag = useDiagnosaKeperawatan()

onMounted(() => {
  // console.log('props', props?.pasien);
  Promise.all([
    store.getHistory(props?.pasien),
    store.getData(props?.pasien),
    diag.getDiagnosaByNoreg(props?.pasien)
  ])

  // console.log('store', store.items);
})

const qrUrl = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SERAH-TERIMA.png'
  const asal = 'RANAP'
  const petugas = props?.pasien?.dokter
  const enc = btoa(`${noreg}|${dok}|${asal}|${props?.pasien?.dokter}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})

const getUrl2 = (item) => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SERAH-TERIMA.png'
  const asal = 'RANAP'
  const petugas = item?.user_serah
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
const getUrl = (item) => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SERAH-TERIMA.png'
  const asal = 'RANAP'
  const petugas = item?.user_serah
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
