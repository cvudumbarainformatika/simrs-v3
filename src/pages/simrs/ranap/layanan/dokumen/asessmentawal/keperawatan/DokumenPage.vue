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
        <div class="data-item">6. Keluhan Nyeri : {{ anamnesisAwal?.keluhannyeri?.skor > 0 ? 'Ada' : 'Tidak ada' || '-'
          }}
        </div>
      </div>
    </div>
    <!-- Pemeriksaan : umum -->
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
    </div>
    <!-- Pemeriksaan : kultural -->
    <div class="section">
      <div class="section-title">Kultural : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Penyebab Penyakit</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.penyebabSakit || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Pola Komunikasi</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.komunikasi || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Makanan Pokok</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              (pemeriksaanUmum?.makananPokokLain ?? pemeriksaanUmum?.makananPokok) || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Pantangan Makanan</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.pantanganMkanan || ' - ' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pemeriksaan : psikologi dll -->
    <div class="section">
      <div class="section-title">Pemeriksaan Psikologi, Sosial Ekonomi, Spriritual : </div>
      <table border="0" style="border: none !important; margin-left: 10px; margin-top: -5px;">
        <tbody>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Sosial</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.sosial || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Spiritual</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.spiritual || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Status Psikologis</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.statusPsikologis || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Punya Ansuransi</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;"> : {{
              pemeriksaanUmum?.ansuransi || ' - ' }}</td>
          </tr>
          <tr style="border: none !important; padding: 0px !important;">
            <td style="border: none !important; padding: 0px !important; width:15%;"> - Edukasi</td>
            <td style="border: none !important; padding: 0px !important; width: 35%;">
              <div class="row no-wrap">
                <div class="col-auto" style="width:2%">:</div>
                <div v-if="edukasi" class="col-auto">
                  <div class="row items-center">
                    <div class="col-10">Apakah pasien / keluarga tahu mengenai penyakit dan perawatannya?</div>
                    <div class="col-2">{{ edukasi?.tahuPenanganan?.value }}</div>
                  </div>
                  <div class="row items-center">
                    <div class="col-10">Apakah membutuhkan edukasi?</div>
                    <div class="col-2">{{ edukasi?.butuhEdukasi?.value }}</div>
                  </div>
                </div>
                <div v-else> - </div>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pemeriksaan : Fisik -->
    <div class="section">
      <div class="section-title">Pemeriksaan Fisik : </div>
      <table>
        <thead>
          <tr>
            <th>Bagian</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kepala (Head)</td>
            <td> {{ pemeriksaanUmum?.rs5 }} </td>
          </tr>
          <tr>
            <td>Leher (Neck)</td>
            <td> {{ pemeriksaanUmum?.rs6 }} </td>
          </tr>
          <tr>
            <td>Dada & Payudara (Chest & Breast)</td>
            <td> {{ pemeriksaanUmum?.rs7 }} </td>
          </tr>
          <tr>
            <td>Punggung (Back)</td>
            <td> {{ pemeriksaanUmum?.rs8 }} </td>
          </tr>
          <tr>
            <td>Perut (Abdomen)</td>
            <td> {{ pemeriksaanUmum?.rs9 }} </td>
          </tr>
          <tr>
            <td>Urogenital</td>
            <td> {{ pemeriksaanUmum?.rs13 }} </td>
          </tr>
          <tr>
            <td>Tangan (Hand)</td>
            <td> {{ pemeriksaanUmum?.rs10 }} </td>
          </tr>
          <tr>
            <td>Kaki (Foot)</td>
            <td> {{ pemeriksaanUmum?.rs11 }} </td>
          </tr>
          <tr>
            <td>Status Neurologis (Neurological Status)</td>
            <td> {{ pemeriksaanUmum?.rs12 }} </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Diagnosa keperawatan -->
    <div class="section">
      <div class="section-title">Diagnosis Keperawatan</div>
      <table style="margin-top: -5px;">
        <thead>
          <tr>
            <th>DIAGNOSA KEPERAWATAN</th>
            <th>PLANN</th>
            <th>INTERVENSI</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, i) in pasien?.diagnosakeperawatan" :key="i">
            <tr>
              <td>
                <div> - {{ item?.nama }}</div>
              </td>
              <td>
                <div v-for="plann in kepPlann(item)" :key="plann">
                  <div class="row no-wrap">
                    <div class="col-auto q-mr-xs">-</div>
                    <div class="col-auto">{{ plann?.masterintervensi?.nama }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div v-for="plann in kepInter(item)" :key="plann">
                  <div class="row no-wrap">
                    <div class="col-auto q-mr-xs">-</div>
                    <div class="col-auto">{{ plann?.masterintervensi?.nama }}</div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

    </div>



    <div class="section">

      <div class="flex justify-between q-mx-xl">

        <div>
          <table border="0" style="border: none !important; margin-left: 10px; margin-top:  5px;">
            <tbody>
              <tr style="border: none !important; padding: 0px !important;">
                <td style="border: none !important; padding: 0px !important; width: 17%">
                  <div class="text-weight-bold">TANGGAL</div>
                </td>
                <td valign="top" style="border: none !important; padding: 0px !important;"> :
                  {{ dateFullFormat(pasien?.tglmasuk) }} </td>
              </tr>
              <tr style="border: none !important; padding: 0px !important;">
                <td style="border: none !important; padding: 0px !important; width: 17%">
                  <div class="text-italic">JAM</div>
                </td>
                <td valign="top" style="border: none !important; padding: 0px !important;"> : {{
                  jamTnpDetik(pasien?.tglmasuk) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column flex-center">
          <div>
            Pasien / Keluarga
          </div>
          <div class="relative-position" style="width: 80px;">
            <vue-qrcode :value="qrPenerima" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: {
                dark: '#000000',
                light: '#ffffff',
              },
              margin: 0
            }" />
            <!-- <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH"> -->
          </div>
          <div class="text-wrap text-center">{{ penerimanEdu?.namaPenerima }}</div>
        </div>


        <div class="column flex-center">

          <div>PERAWAT / BIDAN</div>
          <!-- <div style="margin-top: -5px; margin-bottom: 10px;">DOCTOR</div> -->

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
          <div class="text-wrap text-center">{{ anamnesisAwal?.petugas?.nama }}</div>
        </div>
      </div>
    </div>


  </div>
</template>
<script setup>
import { api } from 'src/boot/axios'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi'
import { computed, onMounted, ref } from 'vue'

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

// const dpjp = ref(null)
const impEdukasi = useImplementasiEdukasiRanapStore()
onMounted(() => {
  // getDpjpData()
  if (impEdukasi?.items?.length === 0) impEdukasi.getList(props?.pasien)
})


// const getDpjpData = async () => {
//   const res = await api.get(`/v1/pegawai/master/pegawai-by-kdpegsimrs?kdpegsimrs=${props?.pasien?.kodedokter}`)
//   // console.log('res', res);
//   if (res.status === 200) {
//     dpjp.value = res.data

//   }

// }
const penerimanEdu = computed(() => {
  const ttd = impEdukasi?.items[0]

  // console.log('ttd', ttd)
  return ttd
})
const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASESSMENT-AWAL-KEPERAWATAN.png'
  const asal = 'RANAP'
  const petugas = anamnesisAwal.value?.petugas?.nik || null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `${enc}`
})
const qrPenerima = computed(() => {
  // console.log('user', user);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASESSMENT-AWAL-KEPERAWATAN.png'
  const asal = 'RANAP'
  const ttdPenerima = penerimanEdu.value?.ttdPenerima ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${ttdPenerima}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})
function kepPlann (item) {
  const inter = item?.intervensi?.filter(x => x?.masterintervensi?.group === 'plann')
  // console.log('item', item, inter)
  return inter
}
function kepInter (item) {
  const inter = item?.intervensi?.filter(x => x?.masterintervensi?.group !== 'plann')
  // console.log('item', item, inter)
  return inter
}

const anamnesisAwal = computed(() => {
  const awal = props?.pasien?.anamnesis?.find(x => x?.awal === '1' && x?.nakes === '2') || null
  console.log('awal anam', awal?.petugas)

  return awal
})
const edukasi = computed(() => {
  const edu = JSON.parse(pemeriksaanUmum.value?.edukasi)
  // console.log('edu', edu)

  return edu
})
const pemeriksaanUmum = computed(() => {
  const awal = props?.pasien?.pemeriksaan?.find(x => x?.awal === '1' && x?.nakes === '2') || null
  // console.log('awal pemerikasaan', awal)

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
