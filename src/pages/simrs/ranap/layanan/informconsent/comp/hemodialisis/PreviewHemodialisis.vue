<template>
  <div class="column full-height full-width flex-center">
    <div id="pdfDoc" class="full-width">
      <div class="page-1">
        <!-- Kop Surat Standard -->
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
          :header="['PERSETUJUAN', '( HEMODIALISIS )']"
        />

        <div class="text-center f-14 text-bold q-mt-md">
          PERSETUJUAN
        </div>
        <div class="text-center f-14 text-bold q-mb-md">
          ( HEMODIALISIS )
        </div>

        <!-- Edukasi Pelaksana -->
        <div class="section-1 q-mb-sm f-12">
          Saya, Pelaksana tindakan menyatakan bahwa telah menerangkan hal dibawah ini secara benar dan jelas dan sudah memberi kesempatan kepada pasien/keluarga untuk bertanya dan berdiskusi :
        </div>

        <!-- Tabel 9 Informasi -->
        <q-markup-table dense separator="cell" flat bordered wrap-cells class="q-mb-md f-11">
          <thead>
            <tr class="bg-grey-2">
              <th class="text-center" width="5%">
                No
              </th>
              <th class="text-left" width="25%">
                JENIS INFORMASI
              </th>
              <th class="text-left" width="70%">
                ISI INFORMASI YANG BENAR
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">
                1
              </td>
              <td class="text-bold">
                Diagnosis (WD&DD)
              </td>
              <td v-html="getNewLine(item?.dasarDiagnosis || 'Penyakit Ginjal Kronik (PGK/CKD) Stadium V, Akut Kidney Injury (AKI)')" />
            </tr>
            <tr>
              <td class="text-center">
                2
              </td>
              <td class="text-bold">
                Dasar Diagnosis
              </td>
              <td v-html="getNewLine(item?.indikasi || 'Anamnesa, Pemeriksaan Fisik, Laboratorium, USG')" />
            </tr>
            <tr>
              <td class="text-center">
                3
              </td>
              <td class="text-bold">
                Tindakan Kedokteran
              </td>
              <td v-html="getNewLine(item?.tindakanMedis || 'Hemodialisis')" />
            </tr>
            <tr>
              <td class="text-center">
                4
              </td>
              <td class="text-bold">
                Indikasi Tindakan
              </td>
              <td v-html="getNewLine(item?.tujuanLain || 'Hiperkalemia, Enselopati, Uremikum, Asidosis Metabolik, Edema Paru, Overhidrasi, Azotemia')" />
            </tr>
            <tr>
              <td class="text-center">
                5
              </td>
              <td class="text-bold">
                Tata Cara
              </td>
              <td v-html="getNewLine(item?.tatacara || 'Darah dikeluarkan dari tubuh dan diedarkan oleh mesin diluar tubuh, proses pencucian oleh tabung (dialyzer) diluar mesin, selama penyaringan darah terjadi Difusi dan Ultrafiltrasi')" />
            </tr>
            <tr>
              <td class="text-center">
                6
              </td>
              <td class="text-bold">
                Tujuan
              </td>
              <td v-html="getNewLine(item?.resikoLain || 'Mengeluarkan Toksin uremik dan mengatur cairan akibat penurunan Laju Filtrasi Glomerulus')" />
            </tr>
            <tr>
              <td class="text-center">
                7
              </td>
              <td class="text-bold">
                Risiko/Komplikasi
              </td>
              <td v-html="getNewLine(item?.komplikasi || 'Hipotensi, Hipoglikemi, Kram otot, mual, muntah, sakit kepala, kejang , perdarahan, emboli udara, gatal, kematian')" />
            </tr>
            <tr>
              <td class="text-center">
                8
              </td>
              <td class="text-bold">
                Prognosis
              </td>
              <td v-html="getNewLine(item?.golonganDarah || 'Dubia ad Bonam')" />
            </tr>
            <tr>
              <td class="text-center">
                9
              </td>
              <td class="text-bold">
                Alternatif & Risiko
              </td>
              <td v-html="getNewLine(item?.alternatif || 'Peritoneal Dialisis ( CAPD ), Transplantasi Ginjal')" />
            </tr>
          </tbody>
        </q-markup-table>

        <!-- Identitas Yang Menyatakan -->
        <div class="f-12 q-mb-xs">
          Saya yang bertandatangan dibawah ini :
        </div>
        <div class="f-11 q-ml-sm q-mb-xs">
          <div class="row">
            <div class="col-3">
              Nama
            </div>
            <div class="col-9">
              : {{ item?.nama || '-' }} ( {{ item?.lp || '-' }} ) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Tgl. Lahir : {{ humanDate(item?.tglLahir) }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">
              No KTP/SIM/PASPOR
            </div>
            <div class="col-9">
              : {{ item?.noKtp || '-' }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">
              Alamat
            </div>
            <div class="col-9">
              : {{ item?.alamat || '-' }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">
              Hubungan dengan pasien
            </div>
            <div class="col-9">
              : {{ item?.hubunganDgPasien || '-' }}
            </div>
          </div>
        </div>

        <div class="f-12 q-my-xs text-justify">
          Dengan ini menyatakan <b>{{ item?.setuju === 'Tidak' ? 'PENOLAKAN' : 'PERSETUJUAN' }}</b> bahwa saya telah menerima informasi yang diberikan oleh dokter sebagaimana diatas dan telah memahaminya. Untuk itu saya memberikan {{ item?.setuju === 'Tidak' ? 'PENOLAKAN' : 'PERSETUJUAN' }} untuk dilakukan tindakan kedokteran tersebut terhadap :
        </div>

        <!-- Identitas Pasien -->
        <div class="f-11 q-ml-sm q-mb-xs">
          <div class="row">
            <div class="col-3">
              Nama
            </div>
            <div class="col-9">
              : {{ pasien?.nama_panggil || pasien?.nama }} ( {{ pasien?.kelamin }} ) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Tgl. Lahir : {{ humanDate(pasien?.tgllahir) }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">
              No KTP/SIM/PASPOR
            </div>
            <div class="col-9">
              : {{ pasien?.nktp || '-' }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">
              Alamat
            </div>
            <div class="col-9">
              : {{ pasien?.alamat || '-' }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">
              RM
            </div>
            <div class="col-9">
              : {{ pasien?.norm }}
            </div>
          </div>
        </div>

        <div class="f-11 q-mb-md text-justify">
          Saya memahami perlunya dan manfaat tindakan tersebut termasuk risiko dan komplikasi yang akan timbul. Saya juga menyadari bahwa ilmu kedokteran bukanlah ilmu pasti, maka keberhasilan tindakan kedokteran bukanlah keniscayaan, melainkan tergantung kepada ijin Tuhan Yang Maha Esa.
        </div>

        <!-- Tabel Tanda Tangan -->
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
                  <div class="full-width flex justify-center">
                    <app-qr-petugas
                      :noreg="item?.noreg"
                      :jnssurat="'IC-HEMODIALISIS.png'"
                      :asal="'RANAP'"
                      :kdpegsimrs="item?.kdDokter"
                      width="70px"
                      height="70px"
                    />
                  </div>
                </td>
                <td class="text-center f-12">
                  <div class="full-width flex justify-center">
                    <app-qr-petugas
                      :noreg="item?.noreg"
                      :jnssurat="'IC-HEMODIALISIS.png'"
                      :asal="'RANAP'"
                      :kdpegsimrs="item?.kdPetugas"
                      width="70px"
                      height="70px"
                    />
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
import { pathImg } from 'src/boot/axios'
import { humanDate, jamTnpDetik } from 'src/modules/formatter'
import { imageToBase64 } from 'src/modules/imgBase64'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'
import { onMounted, watch } from 'vue'

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
  }
})

onMounted(() => {
  initImage(props.item)
})

watch(() => props.item, (val) => {
  if (val) {
    initImage(val)
  }
}, { deep: true })

function initImage(item) {
  if (!item) return
  const ttdSaksiPasien = pathImg + item?.ttdSaksiPasien
  const ttdYgMenyatakan = pathImg + item?.ttdYgMenyatakan

  Promise.all([
    imageToBase64(ttdSaksiPasien, (base64Image) => {
      item.ttd_saksi_pasien = base64Image ?? ''
    }),
    imageToBase64(ttdYgMenyatakan, (base64Image) => {
      item.ttd_yg_menyatakan = base64Image ?? ''
    })
  ])
}

function getNewLine(text) {
  return text?.replace(/\n/g, '<br/>')
}
</script>

<style lang="scss" scoped>
#pdfDoc {
  background-color: #e0e0e0 !important;
  padding: 30px 10px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
}

.page-1 {
  background-color: #ffffff !important;
  width: 210mm;
  min-height: 297mm;
  padding: 8mm;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

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
    padding: 8mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
  }
}
</style>
