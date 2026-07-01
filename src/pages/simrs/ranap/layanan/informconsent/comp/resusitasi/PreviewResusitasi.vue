<template>
  <div id="pdfDoc" class="f-12">
    <!-- Halaman 1: Pemberian Informasi -->
    <div class="page-container page-1">
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
          :header="['PEMBERIAN INFORMASI', 'RESUSITASI (DNR)', '']"
        />
      </div>
      <!-- Tanggal Pemberian Informasi -->
      <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal">
        <div class="row">
          <div class="col-2 text-bold">Tanggal :</div>
          <div class="col-10">{{ humanDate(item?.tanggal) || '-' }}</div>
        </div>
      </div>

      <!-- Tabel Pemberian Informasi -->
      <div class="ba-black f-11 q-mt-xs overflow-hidden">
        <q-markup-table dense separator="cell" flat bordered wrap-cells class="table-info font-body text-black">
          <thead>
            <tr class="bg-grey-2">
              <th class="text-center text-bold f-11 text-black" width="5%">NO</th>
              <th class="text-center text-bold f-11 text-black" width="25%">JENIS INFORMASI</th>
              <th class="text-center text-bold f-11 text-black" width="60%">ISI INFORMASI YANG DIBERIKAN</th>
              <th class="text-center text-bold f-11 text-black" width="10%">TANDA (v)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">1</td>
              <td class="text-left text-bold">Diagnosis (WD & DD)</td>
              <td class="text-left text-justify line-height-tight">
                <div>{{ pasien?.memodiagnosa || '-' }}</div>
              </td>
              <td class="text-center text-bold text-h6">
                <span v-if="pasien?.memodiagnosa">✓</span>
                <span v-else>-</span>
              </td>
            </tr>
            <tr>
              <td class="text-center">2</td>
              <td class="text-left text-bold">Dasar Diagnosis</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.dasarDiagnosis || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">3</td>
              <td class="text-left text-bold">Tindakan Kedokteran</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.tindakanMedis || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">4</td>
              <td class="text-left text-bold">Indikasi</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.indikasi || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">5</td>
              <td class="text-left text-bold">Tujuan</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.tujuanLain || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">6</td>
              <td class="text-left text-bold">Tata Cara</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.tatacara || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">7</td>
              <td class="text-left text-bold">Risiko</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.resikoLain || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">8</td>
              <td class="text-left text-bold">Komplikasi</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.komplikasi || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">9</td>
              <td class="text-left text-bold">Prognosis</td>
              <td class="text-left text-justify line-height-tight">
                <div v-if="Array.isArray(item?.prognosis)">
                  {{ item?.prognosis.join(', ') }}
                </div>
                <div v-else v-html="getNewLine(item?.prognosis || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">10</td>
              <td class="text-left text-bold">Alternatif Tindakan</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.alternatif || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            <tr>
              <td class="text-center">11</td>
              <td class="text-left text-bold">Lain-Lain</td>
              <td class="text-left text-justify line-height-tight">
                <div v-html="getNewLine(item?.penerimaEdukasi || '-')" />
              </td>
              <td class="text-center text-bold text-h6">✓</td>
            </tr>
            
            <!-- Konfirmasi Edukasi Dokter -->
            <tr>
              <td colspan="3" class="text-left line-height-normal text-justify q-pa-sm">
                Dengan ini menyatakan bahwa saya telah menerangkan hal-hal di atas secara benar, jelas dan memberikan kesempatan untuk bertanya / berdiskusi
              </td>
              <td class="text-center q-pa-xs">
                <div class="full-width flex justify-center items-center" style="height: 50px;">
                  <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-RESUSITASI.png'" :asal="'RANAP'"
                    :kdpegsimrs="item?.kdDokter" width="45px" height="45px" />
                </div>
              </td>
            </tr>
            <!-- Konfirmasi Edukasi Penerima -->
            <tr>
              <td colspan="3" class="text-left line-height-normal text-justify q-pa-sm">
                Dengan ini menyatakan bahwa saya telah menerima informasi sebagaimana di atas yang diberi tanda dan telah memahaminya
              </td>
              <td class="text-center q-pa-xs">
                <div class="full-width flex justify-center items-center" style="height: 50px;">
                  <img v-if="item?.ttd_yg_menyatakan" :src="item?.ttd_yg_menyatakan" alt="ttd penerima" width="45">
                  <div v-else class="text-grey-4 f-8">Belum Ttd</div>
                </div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

    </div>

    <!-- Halaman 2: Surat Penolakan Resusitasi (DNR) -->
    <div class="page-container page-2 q-mt-xl">
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
          :header="['Surat Pernyataan', 'Penolakan Resusitasi', '']"
        />
      </div>
      <!-- Judul Dokumen Tengah -->
      <div class="text-center text-bold f-12 q-my-md uppercase tracking-wide">
        PENOLAKAN RESUSITASI (DNR)
      </div>

      <!-- Identitas Penolak Tindakan -->
      <div class="ba-black f-11 q-pa-sm line-height-normal">
        <div>Saya yang bertanda tangan di bawah ini:</div>
        <div class="q-mt-xs q-pl-sm">
          <div class="row q-mt-2">
            <div class="col-3">Nama</div>
            <div class="col-9">: {{ item?.nama || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">Jenis Kelamin</div>
            <div class="col-9">: {{ item?.lp || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">No. KTP / SIM / PASPOR</div>
            <div class="col-9">: {{ item?.noKtp || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">Alamat</div>
            <div class="col-9">: {{ item?.alamat || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">Hubungan dengan Pasien</div>
            <div class="col-9">: 
              {{ item?.hubunganDgPasien === 'Keluarga' ? `Keluarga (${item?.keluarga || '...........'})` : item?.hubunganDgPasien }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pernyataan Penolakan Terhadap Pasien -->
      <div class="ba-black f-11 q-mt-md q-pa-sm line-height-normal text-justify">
        <div class="text-center text-bold q-mb-sm">
          Dengan ini menyatakan PENOLAKAN untuk dilakukan tindakan resusitasi terhadap:
        </div>
        
        <div class="q-pl-sm">
          <div class="row q-mt-2">
            <div class="col-3 text-bold">Nama Pasien</div>
            <div class="col-9">: {{ pasien?.nama || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">Jenis Kelamin</div>
            <div class="col-9">: {{ pasien?.kelamin || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">No. Rekam Medis</div>
            <div class="col-9 flex items-center">
              <span class="q-mr-sm">:</span>
              <div class="flex" style="border: 1px solid #000; width: fit-content; background-color: #fff;">
                <div v-for="(digit, idx) in getNormDigits(pasien?.norm || item?.norm)" :key="idx" 
                  class="text-center flex flex-center text-bold" 
                  style="width: 25px; height: 25px; border-right: 1px solid #000; font-size: 13px;" 
                  :style="idx === 5 ? 'border-right: none;' : ''">
                  {{ digit }}
                </div>
              </div>
            </div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">No. Register (Noreg)</div>
            <div class="col-9">: {{ pasien?.noreg || item?.noreg || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">Umur / Usia</div>
            <div class="col-9">: {{ pasien?.usia || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">Alamat Pasien</div>
            <div class="col-9">: {{ pasien?.alamat || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Klausul Tanggung Jawab Penolakan -->
      <div class="ba-black f-11 q-mt-md q-pa-sm line-height-normal text-justify">
        Saya memahami perlunya dan manfaat tindakan tersebut sebagaimana telah dijelaskan seperti di atas kepada saya, termasuk risiko dan komplikasi yang timbul apabila tindakan tersebut tidak dilakukan. Saya bertanggung jawab secara penuh atas segala akibat yang mungkin timbul sebagai akibat tidak dilakukannya tindakan RESUSITASI tersebut.
      </div>

      <!-- Waktu Cetak & Lokasi -->
      <div class="row text-right f-11 q-mr-sm justify-end q-mt-md">
        <div class="col-auto">
          Probolinggo, {{ humanDate(item?.tanggal) }}, Pkl : {{ jamTnpDetik(item?.tanggal) }}
        </div>
      </div>

      <!-- TABEL TANDA TANGAN (STANDARD BER-BORDER) -->
      <q-markup-table dense separator="cell" flat bordered wrap-cells class="table-signature text-black font-body q-mt-sm">
        <thead>
          <tr class="bg-grey-2">
            <th class="text-left text-bold f-11 text-black" width="20%" />
            <th class="text-center text-bold f-11 text-black" width="20%">Dokter</th>
            <th class="text-center text-bold f-11 text-black" width="20%">Saksi RS</th>
            <th class="text-center text-bold f-11 text-black" width="20%">Saksi Pasien</th>
            <th class="text-center text-bold f-11 text-black" width="20%">Yang Menyatakan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left text-bold f-10 text-black">Nama Jelas</td>
            <td class="text-center f-10 text-black">{{ item?.pelaksana || '-' }}</td>
            <td class="text-center f-10 text-black">{{ item?.pelaksana || '-' }}</td>
            <td class="text-center f-10 text-black">{{ item?.saksiPasien || '-' }}</td>
            <td class="text-center f-10 text-black">{{ item?.nama || '-' }}</td>
          </tr>
          <tr>
            <td class="text-left text-bold f-10 text-black" style="height: 75px;">Tanda Tangan</td>
            <td class="text-center q-pa-xs">
              <div class="full-width flex justify-center items-center">
                <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-RESUSITASI.png'" :asal="'RANAP'"
                  :kdpegsimrs="item?.kdDokter" width="65px" height="65px" />
              </div>
            </td>
            <td class="text-center q-pa-xs">
              <div class="full-width flex justify-center items-center">
                <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-RESUSITASI.png'" :asal="'RANAP'"
                  :kdpegsimrs="item?.kdDokter" width="65px" height="65px" />
              </div>
            </td>
            <td class="text-center q-pa-xs">
              <img v-if="item?.ttd_saksi_pasien" :src="item?.ttd_saksi_pasien" alt="ttd saksi pasien" width="65">
              <div v-else class="text-grey-4 f-9">Belum Ttd</div>
            </td>
            <td class="text-center q-pa-xs">
              <img v-if="item?.ttd_yg_menyatakan" :src="item?.ttd_yg_menyatakan" alt="ttd yang menyatakan" width="65">
              <div v-else class="text-grey-4 f-9">Belum Ttd</div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- Catatan Kaki dan Footer rev -->
      <div class="f-9 text-grey-8 q-mt-sm">
        *Bila pasien tidak kompeten atau tidak mau menerima informasi, maka penerima informasi adalah wali atau keluarga terdekat.
      </div>

      <div class="row justify-between items-center q-mt-md">
        <div class="f-9 text-grey-8">
          *) Coret yang tidak perlu
        </div>
        <div class="f-8 text-bold text-grey-9 tracking-wide font-header uppercase">
          DOKUMEN RM REV. 2 Th. 2016
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
import { onMounted } from 'vue'

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

function initImage(item) {
  const ttdSaksiPasien = pathImg + item?.ttdSaksiPasien
  const ttdYgMenyatakan = pathImg + item?.ttdYgMenyatakan

  const promises = [
    imageToBase64(ttdSaksiPasien, (base64Image) => {
      item.ttd_saksi_pasien = base64Image ?? ''
    }),
    imageToBase64(ttdYgMenyatakan, (base64Image) => {
      item.ttd_yg_menyatakan = base64Image ?? ''
    })
  ]

  Promise.all(promises)
}

const getNormDigits = (norm) => {
  if (!norm) return ['', '', '', '', '', '']
  const clean = norm.replace(/\D/g, '') // remove non-digits
  const padded = clean.padStart(6, '0') // pad to 6 digits
  return padded.split('').slice(0, 6)
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

.page-container {
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
  color: #000 !important;
}

.ba-black {
  border: 1px solid #000;
}

.br-black {
  border-right: 1px solid #000;
}

.font-header {
  font-family: 'Arial', sans-serif;
}

.font-body {
  font-family: 'Arial', sans-serif;
}

.line-height-normal {
  line-height: 1.35;
}

.line-height-tight {
  line-height: 1.2;
}

.uppercase {
  text-transform: uppercase;
}

.tracking-wide {
  letter-spacing: 0.5px;
}

.table-info {
  border-collapse: collapse;
  width: 100%;
  td, th {
    border: 1px solid #000 !important;
    padding: 4px 6px !important;
  }
}

.table-signature {
  border-collapse: collapse;
  width: 100%;
  td, th {
    border: 1px solid #000 !important;
    padding: 3px 4px !important;
  }
}

.q-mt-2 {
  margin-top: 2px;
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

  .page-container {
    width: 210mm !important;
    height: 297mm !important;
    padding: 8mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
  }
  
  .page-1 {
    page-break-after: always !important;
  }
}
</style>
