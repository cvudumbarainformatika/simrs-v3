<template>
  <div id="pdfDoc" class="bg-white print-page">
    <div class="page-1">
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
              RAWAT INAP
            </div>
            <!-- <div class="text-center text-bold">
                      {{ kasus?.uraian.toUpperCase() }}
                    </div> -->
          </div>
        </div>


      </div>

      <div class="flex justify-between">
        <div class="q-py-xs text-left">
          <div class="flex q-gutter-sm ">
            <div style="width: 100px;">Nama Pasien </div>
            <div>: {{ pasien?.nama_panggil }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div style="width: 100px;">Usia </div>
            <div>: {{ pasien?.usia }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div style="width: 100px;">No RM </div>
            <div>: {{ pasien?.norm }}</div>
          </div>

        </div>
        <div class="q-py-xs text-left">
          <div class="flex q-gutter-sm ">
            <div style="width: 100px;">Kelamin </div>
            <div>: {{ pasien?.kelamin }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div style="width: 100px;">Tgl Lahir </div>
            <div>: {{ pasien?.tgllahir }}</div>
          </div>

        </div>


      </div>
      <div class="row no-wrap q-gutter-sm">
        <div style="width: 100px;" class="col-auto">Alamat </div>
        <div class="col">: {{ pasien?.alamat }}</div>
      </div>

      <hr>
      <!-- CONTENT -->
      <div v-if="!EDUKASI?.length" class="q-pa-md column full-height flex-center" style="min-height: 400px;">
        <div class="text-weight-bold text-center ">
          BELUM TERSEDIA LAPORAN EDUKASI
        </div>
      </div>
      <div v-else class="full-width">
        <!-- A B -->
        <div>
          <div class="flex q-gutter-sm text-bold">
            <div>A. </div>
            <div>ASESMEN KEBUTUHAN EDUKASI</div>
          </div>
          <div class="text-bold">Data Pasien</div>
          <div class="flex q-gutter-sm">
            <div>1. </div>
            <div style="width: 140px;">Tinggal Bersama</div>
            <div>: -</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>2. </div>
            <div style="width: 140px;">Tingkat Pendidikan</div>
            <div>: {{ pasien?.pendidikan }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>3. </div>
            <div style="width: 140px;">Kemampuan Bahasa</div>
            <div>: {{ pasien?.bahasa }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>4. </div>
            <div style="width: 140px;">Baca & Tulis</div>
            <div>: {{ pasien?.bacatulis === 'YA' ? 'BISA' : 'TIDAK' }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>5. </div>
            <div style="width: 140px;">Agama</div>
            <div>: {{ pasien?.agama }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>6. </div>
            <div>Nilai-nilai pasien dan Budaya</div>
            <div>: ...</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>7. </div>
            <div style="width: 120px;">Hambatan</div>
            <div>: {{ pasien?.hambatan }}</div>
          </div>



          <div class="flex q-gutter-sm text-bold q-mt-sm">
            <div>B. </div>
            <div>PERENCANAAN</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>1. </div>
            <div style="width: 120px;">Perlu Penerjemah</div>
            <div>: {{ EDUKASIC?.perlupenerjemah }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>2. </div>
            <div style="width: 120px;">Bahasa isyarat</div>
            <div>: {{ EDUKASIC?.bahasaisyarat }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>3. </div>
            <div style="width: 120px;">Cara Edukasi</div>
            <div>: {{ EDUKASIC?.caraedukasi }}</div>
          </div>
          <div class="flex q-gutter-sm">
            <div>4. </div>
            <div>Ketersediaan menerima edukasi dan informasi</div>
            <div>: {{ EDUKASIC?.kesediaan }}</div>
          </div>
          <div class="row items-start q-gutter-x-sm no-wrap">
            <div>5. </div>
            <div class="col-auto no-wrap">Kebutuhan Edukasi : </div>
            <div class="col">
              <div>{{ EDUKASIC?.kebutuhanedukasi }}</div>
            </div>
          </div>
          <div class="kotak f-10 q-pa-sm">
            <div class="text-bold">Catatan : </div>
            <div class="row item-start q-gutter-sm">
              <div class="col-auto">
                1.
              </div>
              <div class="col">
                <em>
                  Pemberi edukasi adalah semua petugas rumah sakit yang melayani pasien (dokter, perawat, bidan, ahli
                  gizi, apoteker, fisioterapis, radiografer dan tenaga kesehatan lainnya)
                </em>
              </div>


            </div>
            <div class="row item-start q-gutter-sm">
              <div class="col-auto">
                2.
              </div>
              <div class="col">
                <em>
                  Edukasi diberikan sesuai kebutuhan pasien berdasarkan pengkajian awal pasien dan rencana penanganan
                  pasien (assesmen data pasien diisi oleh perawat/bidan)
                </em>
              </div>
            </div>
            <div class="row item-start q-gutter-sm">
              <div class="col-auto">
                3.
              </div>
              <div class="col">
                <em>
                  Pemberian edukasi dicatat kemudian dibubuhi tanda tangan dan nama jelas pemberi edukasi serta
                  ditandatangani pasien/keluarga
                </em>
              </div>
            </div>
          </div>



        </div>

        <!-- C -->
        <table border="1" width="100%">
          <thead>
            <tr>
              <th colspan="10">
                <div class="flex q-gutter-sm text-bold">
                  <div>C. </div>
                  <div>IMPLEMENTASI DAN EVALUASI</div>
                </div>
              </th>
            </tr>
            <tr>
              <th rowspan="2" class="t-vertical">
                <div>Hari / Tanggal</div>
                <div>Jam</div>
              </th>
              <th rowspan="2" class="t-vertical">Metode</th>
              <th rowspan="2">Profesi</th>
              <th rowspan="2">Materi Edukasi dan Informasi</th>
              <th rowspan="2" class="t-vertical">
                <div>Estimasi</div>
                <div>Waktu</div>
              </th>
              <th rowspan="2" class="t-vertical">Media</th>
              <th rowspan="2" class="t-vertical">
                <div>Evaluasi</div>
                <div>Respon</div>
              </th>
              <th rowspan="2" class="t-vertical">
                <div>Tingkat</div>
                <div>Pemahaman</div>
              </th>
              <th colspan="2">
                <div>Nama & </div>
                <div>Tanda Tangan </div>
              </th>

            </tr>
            <tr>
              <th>
                <div>Penerima</div>
                <div>Edukasi</div>
              </th>
              <th>
                <div>Pemberi</div>
                <div>Edukasi</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in EDUKASI" :key="item">
              <td class="t-vertical">
                <div class="text-right">{{ humanDate(item?.tgl) }}</div>
                <div class="text-right"> jam {{ jamTnpDetik(item?.tgl) }}</div>
              </td>
              <td class="t-vertical">
                <div v-if="!item?.metode?.length">
                  -
                </div>
                <div v-else>
                  <div v-for="metode in item?.metode" :key="metode">
                    <div class="text-right">{{ metode }}, </div>
                  </div>
                </div>
              </td>
              <td valign="top">
                <div v-if="!item?.petugas?.kdgroupnakes !== ''">
                  <div>{{ jenisPPA(item?.petugas?.kdgroupnakes) }}</div>
                </div>
              </td>
              <td>
                <div v-if="!item?.materi?.length">
                  -
                </div>
                <div v-else>
                  <div v-for="mat in item?.materi" :key="mat">
                    <div class="flex no-wrap">{{ mat }}, </div>
                  </div>
                </div>
                <q-separator class="q-my-sm" />
                <div v-html="getNewLine(item?.materiLain)" class="text-italic" />
              </td>
              <td class="t-vertical">
                <div class="text-right">{{ item?.estimasi }}</div>
              </td>
              <td class="t-vertical">
                <div v-if="!item?.media?.length">
                  -
                </div>
                <div v-else>
                  <div v-for="med in item?.media" :key="med">
                    <div class="text-right"> {{ med }}, </div>
                  </div>
                </div>
              </td>
              <td class="t-vertical">
                <div class="text-right">{{ item?.evaluasi }}</div>
              </td>
              <td valign="top">{{ item?.tingkatPemahaman || '-' }}</td>
              <td valign="top">

                <div v-if="item?.ttdPenerima" class="flex-center " style="width: 60px;">
                  <div class="relative-position">
                    <vue-qrcode :value="qrPenerima(item?.ttdPenerima)" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff',
                      },
                      margin: 0
                    }" />
                    <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
                  </div>
                  <div class="f-8 text-wrap text-center">{{ item?.namaPenerima }}</div>
                </div>
                <div v-else>
                  -
                </div>



              </td>
              <td valign="top">

                <div class="flex-center " style="width: 60px;">
                  <div class="relative-position">
                    <vue-qrcode :value="qrPetugas(item?.petugas)" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff',
                      },
                      margin: 0
                    }" />
                    <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
                  </div>
                  <div class="f-8 text-wrap text-center">{{ item?.petugas?.nama }}</div>
                </div>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getNewLine, humanDate, jamTnpDetik } from 'src/modules/formatter';
import { computed, onMounted } from 'vue';
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi';
import { pathImg } from 'src/boot/axios';


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

const store = useImplementasiEdukasiRanapStore()

onMounted(() => {
  store.getList(props?.pasien)
})

// console.log('props', props.pasien);
const EDUKASI = computed(() => {
  // console.log('props', props?.pasien?.edukasi);
  return store.items
})

const EDUKASIC = computed(() => {
  // console.log('props', props?.pasien?.edukasi);
  return props?.pasien?.edukasi?.length ? props?.pasien?.edukasi[0] : null
})

const jenisPPA = (val) => {
  if (val === '1') {
    return 'Dokter'
  }
  else if (val === '2') {
    return 'Perawat'
  }
  else if (val === '3') {
    return 'Bidan'
  }
  else if (val === '4') {
    return 'Apoteker'
  }
  else if (val === '5') {
    return 'Ahli Gizi'
  }
  else {
    return 'Fisoterapis'
  }
}


const qrPetugas = (user) => {
  // console.log('user', user);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'KIE.png'
  const asal = 'RANAP'
  const petugas = user?.nik ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
const qrPenerima = (ttd) => {
  // console.log('user', user);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'KIE.png'
  const asal = 'RANAP'
  const ttdPenerima = ttd ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${ttdPenerima}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
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
}

th,
td {
  padding: 8px;
  border: 1px solid black;
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

.t-vertical {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
</style>

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



.print-page {
  background-color: #ffffff;
  padding: 20px !important;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    size: letter;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD MOH SALEH KOTA PROBOLINGGO | Hal Ke-" counter(page);
    }
  }

  .contentx {
    page-break-after: auto;
  }
}
</style>
