<template>
  <div id="pdfDoc" class="f-12">
    <!-- page 1 -->
    <div class="page-1">
      <!-- KOP SURAT -->
      <div class="col-auto">
        <AppKopSuratStandard
          :dataHeader="[
            'PEMERINTAH KOTA PROBOLINGGO',
            'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
            'UOBK RSUD DOKTER MOHAMAD SALEH',
            'Jl. Mayjend Panjaitan No.65 Telp: (0335)433119 Fax.(0335)432702',
            'email: rsudprob@probolinggokota.go.id',
            'PROBOLINGGO – 67219'
          ]"
          :pasien="pasien"
          :header="['PERSETUJUAN', menu?.title, '']"
        />
      </div>
      <!-- section-1 -->
      <div class="ba-black f-12 q-mt-xs">
        <div class="q-pa-sm">
          Saya Dokter pelaksana tindakan Colonoscopy menyatakan bahwa telah menerangkan hal yang berkaitan dengan
          tindakan Colonoscopy secara benar dan jelas, dan sudah memberi kesempatan pada pasien / keluarga untuk
          bertanya dan berdiskus
        </div>

        <div class="section-2">
          <q-markup-table dense separator="cell" flat bordered wrap-cells>
            <thead>
              <tr>
                <th colspan="2" class="text-left f-12" width="30%">
                  JENIS INFORMASI
                </th>
                <th class="text-left f-12">
                  ISI INFORMASI
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left f-12 f-12">
                  1
                </td>
                <td class="text-left f-12 f-12">
                  Pengertian
                </td>
                <td class="text-left f-12 f-12">
                  <div class="flex">
                    <div v-html="getNewLine(item?.indikasi)" />
                  </div>

                  <!-- <div v-for="diag in item?.diagnosis" :key="diag" class="flex">
                    <div>- {{ diag }} </div>
                    <div class="q-ml-sm">
                      {{ pasien?.diagnosamedis?.find(x => x?.rs3 === diag)?.masterdiagnosa?.rs4 ?? '-' }}
                    </div>
                  </div> -->
                </td>
              </tr>

              <tr>
                <td class="text-left f-12">
                  2
                </td>
                <td class="text-left f-12">
                  Tujuan
                </td>
                <td class="text-left f-12">
                  <div v-html="getNewLine(item?.tujuanLain)" />
                </td>
              </tr>

              <tr>
                <td class="text-left f-12">
                  3
                </td>
                <td class="text-left f-12">
                  Resiko
                </td>
                <td class="text-left f-12">
                  <div v-html="getNewLine(item?.resikoLain)" />
                </td>
              </tr>

              <tr>
                <td class="text-left f-12">
                  4
                </td>
                <td class="text-left f-12">
                  Komplikasi
                </td>
                <td class="text-left f-12">
                  <div v-html="getNewLine(item?.komplikasi)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>

      <div class="section-3 ba-black">
        <!-- section-3 -->
        <div class="q-pa-sm">
          <div>Saya yang bertanda tangan dibawah ini :</div>

          <div>
            <div class="row q-mt-xs">
              <div class="col-4">
                Nama
              </div>
              <div class="col-8">
                <div class="flex justify-between">
                  <div>: {{ item?.nama }} <span class="q-ml-lg">({{ item?.lp === 'Perempuan' ? 'P' : 'L' }})*</span>
                  </div>
                  <div class="self-end">
                    Tanggal Lahir : {{ item?.tglLahir }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-mt-xs">
              <div class="col-4">
                No KTP / SIM / PASPOR
              </div>
              <div class="col-8">
                <div class="flex">
                  : {{ item?.noKtp }}
                </div>
              </div>
            </div>

            <div class="row q-mt-xs">
              <div class="col-4">
                Alamat
              </div>
              <div class="col-8">
                <div class="row">
                  <div class="col-auto q-mr-xs">
                    :
                  </div>
                  <div class="col full-width">
                    {{ item?.alamat }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-mt-xs">
              <div class="col-4">
                Hubungan Dengan Pasien
              </div>
              <div class="col-8">
                <div class="flex q-gutter-sm">
                  <!-- : {{ item?.hubunganDgPasien }} <span v-if="item?.hubunganDgPasien === 'Keluarga'"> {{ item?.keluarga }}</span> -->
                  <div v-for="n in store.hubunganDgPasiens" :key="n">
                    <div class="flex">
                      <div class="ba-black relative-position" style="width: 15px; height: 15px;">
                        <q-icon v-if="n === item?.hubunganDgPasien" name="icon-mat-check" class="absolute-center"
                          size="sm" />
                      </div>
                      <div class="q-ml-sm">
                        {{ n }} <span v-if="n === 'Keluarga'">..................................</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="q-mt-lg">
            Dengan ini menyatakan sesungguhnya bahwa saya telah menerima informasi yang diberikan oleh dokter sebagai
            mana diatas dan telah memahaminya. Untuk itu saya memberikan <b>PERSETUJUAN</b> untuk melaksanakan tindakan
            Colonoscopy terhadap :
          </div>

          <div class="q-mt-lg">
            <div class="row q-mt-xs">
              <div class="col-4">
                Nama
              </div>
              <div class="col-8">
                <div class="flex justify-between">
                  <div>: {{ pasien?.nama }} <span class="q-ml-lg">({{ pasien?.kelamin === 'Perempuan' ? 'P' : 'L'
                  }})*</span></div>
                </div>
              </div>
            </div>

            <div class="row q-mt-xs">
              <div class="col-4">
                No KTP / SIM / PASPOR
              </div>
              <div class="col-8">
                <div class="flex">
                  : {{ pasien?.nktp }}
                </div>
              </div>
            </div>

            <div class="row q-mt-xs">
              <div class="col-4">
                Alamat
              </div>
              <div class="col-8">
                <div class="row">
                  <div class="col-auto q-mr-xs">
                    :
                  </div>
                  <div class="col full-width">
                    {{ pasien?.alamat }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-mt-xs">
              <div class="col-4">
                RM
              </div>
              <div class="col-8">
                <div class="flex">
                  : {{ pasien?.norm }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="q-mt-lg q-pa-sm">
          Saya memahami perlunya tindakan Colonoscopy termasuk resiko dan komplikasi yang akan timbul akibat
          tindakan Colonoscopy. Saya akan bertanggung jawab secara penuh atas segala akibat yang mungkin terjadi dan
          tidak akan menyalahkan pihak manapun.
        </div>

        <!-- end section-3 -->

        <div class="section-3 q-mt-lg">
          <div class="text-right f-12 q-mb-lg q-mr-sm">
            Probolinggo, {{ humanDate(item?.tanggal) }}, pukul : {{ jamTnpDetik(item?.tanggal) }}
          </div>
          <q-markup-table dense separator="cell" flat bordered wrap-cells>
            <thead>
              <tr>
                <th class="text-left f-12" width="20%" />
                <th class="text-center f-12" width="20%">
                  Dokter
                </th>
                <th class="text-center f-12" width="20%">
                  Saksi RS
                </th>
                <th class="text-center" width="20%">
                  Saksi Pasien
                </th>
                <th class="text-center" width="20%">
                  Yang Menyatakan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left f-12">
                  Nama Jelas
                </td>
                <td class="text-center f-12">
                  {{ item?.pelaksana }}
                </td>
                <td class="text-center f-12">
                  {{ item?.pengedukasi }}
                </td>
                <td class="text-center">
                  {{ item?.saksiPasien }}
                </td>
                <td class="text-center">
                  {{ item?.nama }}
                </td>
              </tr>
              <tr>
                <td class="text-left f-12">
                  Tanda Tangan
                </td>
                <td class="text-center f-12">
                  <!-- <img :src="item?.ttd_dokter" alt="ttd dokter" width="70"> -->
                  <div class="full-width flex justify-center">
                    <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-COLONOSCOPY.png'" :asal="'RANAP'"
                      :kdpegsimrs="item?.kdDokter" width="70px" height="70px" />
                  </div>
                </td>
                <td class="text-center f-12">
                  <!-- <img :src="item?.ttd_petugas" alt="ttd-petugas" width="70"> -->
                  <div class="full-width flex justify-center">
                    <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-COLONOSCOPY.png'" :asal="'RANAP'"
                      :kdpegsimrs="item?.kdPetugas" width="70px" height="70px" />
                  </div>
                </td>
                <td class="text-center">
                  <img :src="item?.ttd_saksi_pasien" alt="ttd-saksi-pasien" width="70">
                </td>
                <td class="text-center">
                  <img :src="item?.ttd_yg_menyatakan" alt="ttd-yg-menyatakan" width="70">
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { pathImg } from 'src/boot/axios'
import html2pdf from 'html2pdf.js'
import { pathImg } from 'src/boot/axios'
import { humanDate, jamTnpDetik } from 'src/modules/formatter'
import { imageToBase64 } from 'src/modules/imgBase64'
import { useConcernOperasiInvasifRanapStore } from 'src/stores/simrs/ranap/concernoperasiinvasif'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'
import { onMounted, ref } from 'vue'
const store = useConcernOperasiInvasifRanapStore()

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  },
  coba: {
    type: String,
    default: null
  }
})

onMounted(() => {
  hubDgPas()
  initImage(props.item)
})

function initImage(item) {
  const ttdPetugas = pathImg + item?.ttdPetugas
  const ttdDokter = pathImg + item?.ttdDokter
  const ttdSaksiPasien = pathImg + item?.ttdSaksiPasien
  const ttdYgMenyatakan = pathImg + item?.ttdYgMenyatakan

  Promise.all([
    imageToBase64(ttdPetugas, (base64Image) => {
      // document.getElementsByClassName('ttd-petugas')[0].src = base64Image
      // document.getElementsByClassName('ttd-petugas')[1].src = base64Image
      item.ttd_petugas = base64Image ?? ''
    }),
    imageToBase64(ttdDokter, (base64Image) => {
      // document.getElementsByClassName('ttd-dokter')[0].src = base64Image
      item.ttd_dokter = base64Image ?? ''
    }),
    imageToBase64(ttdSaksiPasien, (base64Image) => {
      // document.getElementsByClassName('ttd-saksi-pasien')[0].src = base64Image
      item.ttd_saksi_pasien = base64Image ?? ''
    }),
    imageToBase64(ttdYgMenyatakan, (base64Image) => {
      // document.getElementsByClassName('ttd-yg-menyatakan')[0].src = base64Image
      // document.getElementsByClassName('ttd-yg-menyatakan')[1].src = base64Image
      item.ttd_yg_menyatakan = base64Image ?? ''
    })
  ])
}

const modP = ref([])

function hubDgPas() {
  const a = []
  a.push(props.item?.hubunganDgPasien)
  modP.value = a
}

function getNewLine(text) {
  // console.log('text', text)

  return text?.replace(/\n/g, '<br/>')
}

// const exportPdf = () => {
//   const concern = document.getElementById('pdfDoc')
//
//   const pdfConfig = {
//     margin: 0,
//     filename: 'inform-consent-' + props?.item?.jenis + '.pdf',
//     image: {
//       type: 'jpeg',
//       quality: 0.98
//     },
//     html2canvas: {
//       scale: 2,
//       logging: true,
//       dpi: 192,
//       letterRendering: true
//     },
//     jsPDF: {
//       unit: 'mm', // mm | pt | in
//       format: 'a4', // a4 | letter
//       orientation: 'portrait' // landscape | portrait
//     },
//     pagebreak: { mode: ['css', 'legacy'] }
//   }
//
//   html2pdf().set(pdfConfig).from(concern).save()
// }
// defineExpose({ exportPdf })
</script>

<style lang="scss" scoped>
/* Tampilan preview per page di layar browser (seperti layout kertas A4) */
#pdfDoc {
  background-color: #e0e0e0 !important;
  /* warna abu-abu untuk background desktop workspace */
  padding: 30px 10px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  /* jarak antar halaman */
  box-sizing: border-box;
}

.page-1 {
  background-color: #ffffff !important;
  width: 210mm;
  min-height: 297mm;
  /* memaksa tinggi minimum A4 */
  padding: 8mm;
  /* margin halaman minimum */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  /* efek shadow agar mirip lembaran kertas nyata */
  border-radius: 4px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Sembunyikan garis separator horizontal di layar browser karena sudah dipisah oleh gap & shadow */
.pemisah {
  display: none !important;
}

/* CSS khusus untuk menetralisir margin/padding/shadow saat html2pdf melakukan rendering/cloning */
/*
:global(.html2pdf__container) {
  #pdfDoc {
    background-color: transparent !important;
    padding: 0 !important;
    gap: 0 !important;
  }
  .page-1 {
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    height: 297mm !important;
  }
}
*/

/* Pengaturan CSS khusus saat Cetak (Print) dan Ekspor PDF */
@media print {
  @page {
    size: A4;
    margin: 0;
  }

  #pdfDoc {
    background-color: transparent !important;
    padding: 0 !important;
    gap: 0 !important;
  }

  .page-1 {
    width: 210mm !important;
    height: 297mm !important;
    /* Memaksa tinggi pas A4 */
    padding: 8mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    page-break-after: avoid !important;
    /* memaksa pemisahan halaman */
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
  }
}
</style>
