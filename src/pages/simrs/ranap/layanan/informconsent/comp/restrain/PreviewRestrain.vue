<template>
  <div id="pdfDoc" class="f-12">
    <!-- page 1 -->
    <div class="page-1">
      
      <!-- IDENTIFIKASI DOKUMEN -->
      <div class="text-right text-bold f-10 q-mb-xs">
        IRNA 101
      </div>
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
          :header="['Persetujuan Pemasangan', 'Restrain', '']"
        />
      </div>
      <!-- Dokter DPJP Statement -->
      <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
        Saya Dokter Penanggung Jawab Pelayanan menyatakan bahwa telah menerangkan hal yang berkaitan dengan tindakan pemasangan restrain secara benar dan jelas, dan sudah memberi kesempatan pada keluarga untuk bertanya dan berdiskusi.
      </div>

      <!-- Poin Informasi Restrain -->
      <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal">
        <div class="text-bold q-mb-xs uppercase text-grey-9">JENIS INFORMASI</div>
        
        <div class="row q-mt-sm">
          <div class="col-2 text-bold">1. Pengertian :</div>
          <div class="col-10 text-justify text-grey-10">
            <div v-html="getNewLine(item?.indikasi || 'Restrain adalah suatu metode atau cara pembatasan/restriksi yang disengaja terhadap gerakan/perilaku seseorang. Merupakan intervensi yang terakhir jika perilaku klien sudah tidak bisa diatasi atau dikontrol dengan strategi perilaku maupun modifikasi lingkungan.')" />
          </div>
        </div>

        <!-- Pilihan Tujuan dengan Checkbox -->
        <div class="row q-mt-sm">
          <div class="col-2 text-bold">2. Tujuan :</div>
          <div class="col-10 text-grey-10">
            <div v-for="(opt, idx) in tujuanOptions" :key="opt" class="row no-wrap items-start q-mt-xs">
              <div class="q-mr-xs text-bold text-center" style="width: 20px; font-size: 15px; line-height: 1.2;">
                {{ isSelectedTujuan(opt, item?.tujuan) ? '☑' : '☐' }}
              </div>
              <div class="col">{{ idx+1 }}. {{ opt }}</div>
            </div>
          </div>
        </div>

        <!-- Pilihan Komplikasi dengan Checkbox -->
        <div class="row q-mt-sm">
          <div class="col-2 text-bold">3. Komplikasi :</div>
          <div class="col-10 text-grey-10">
            <div v-for="(opt, idx) in komplikasiOptions" :key="opt" class="row no-wrap items-start q-mt-xs">
              <div class="q-mr-xs text-bold text-center" style="width: 20px; font-size: 15px; line-height: 1.2;">
                {{ isSelectedKomplikasi(opt, item?.komplikasi) ? '☑' : '☐' }}
              </div>
              <div class="col">{{ idx+1 }}. {{ opt }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Identitas Penerima Informasi / Pemberi Pernyataan -->
      <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal">
        <div>Saya yang bertanda tangan dibawah ini :</div>
        <div class="q-mt-xs q-pl-sm">
          <div class="row q-mt-2">
            <div class="col-3">Nama</div>
            <div class="col-9">: {{ item?.nama || '-' }} <span class="q-ml-md">({{ item?.lp === 'Perempuan' ? 'P' : 'L' }})*</span> <span class="q-ml-lg">Tgl. Lahir : {{ item?.tglLahir || '-' }}</span></div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">No KTP / SIM / PASPOR</div>
            <div class="col-9">: {{ item?.noKtp || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">Alamat</div>
            <div class="col-9">: {{ item?.alamat || '-' }} <span class="q-ml-lg">Telepon : {{ item?.telepon || '-' }}</span></div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">Hubungan dengan pasien</div>
            <div class="col-9">: 
              {{ item?.hubunganDgPasien === 'Keluarga' ? `Keluarga (${item?.keluarga || '...........'})` : item?.hubunganDgPasien }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pernyataan Persetujuan Pemasangan Restrain terhadap Pasien -->
      <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
        Dengan ini menyatakan sesungguhnya bahwa saya telah menerima informasi yang diberikan oleh dokter sebagaimana diatas dan telah memahaminya. Untuk itu saya memberikan <strong>PERSETUJUAN</strong> dilaksanakan tindakan pemasangan restrain terhadap :
        
        <div class="q-mt-sm q-pl-sm">
          <div class="row q-mt-2">
            <div class="col-3 text-bold">Nama Pasien</div>
            <div class="col-9">: {{ pasien?.nama || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">Tanggal Lahir</div>
            <div class="col-9">: {{ pasien?.tgllahir || '-' }} <span class="q-ml-sm">({{ pasien?.kelamin === 'Perempuan' ? 'P' : 'L' }})*</span></div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">No KTP / SIM / PASPOR</div>
            <div class="col-9">: {{ pasien?.nktp || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3 text-bold">Alamat</div>
            <div class="col-9">: {{ pasien?.alamat || '-' }}</div>
          </div>
          <div class="row q-mt-sm items-center">
            <div class="col-3 text-bold">RM</div>
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
        </div>
      </div>

      <!-- Klausul Pertanggungjawaban -->
      <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
        Saya memahami perlunya tindakan pemasangan restrain termasuk komplikasi yang akan timbul akibat tindakan pemasangan restrain. Saya akan bertanggung jawab secara penuh atas segala akibat yang mungkin terjadi dan tidak akan menyalahkan pihak manapun.
      </div>

      <!-- Waktu & Tempat Tanda Tangan -->
      <div class="row text-right f-11 q-mr-sm justify-end q-mt-sm">
        <div class="col-auto">
          Probolinggo, {{ humanDate(item?.tanggal) }}, Pkl : {{ jamTnpDetik(item?.tanggal) }}
        </div>
      </div>

      <!-- TABEL TANDA TANGAN (STANDARD BER-BORDER) -->
      <div class="q-mt-xs grow-1">
        <q-markup-table dense separator="cell" flat bordered wrap-cells class="table-signature text-black font-body q-mt-xs">
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
              <td class="text-center f-10 text-black">{{ item?.pengedukasi || '-' }}</td>
              <td class="text-center f-10 text-black">{{ item?.saksiPasien || '-' }}</td>
              <td class="text-center f-10 text-black">{{ item?.nama || '-' }}</td>
            </tr>
            <tr>
              <td class="text-left text-bold f-10 text-black" style="height: 70px;">Tanda Tangan</td>
              <td class="text-center q-pa-xs">
                <div class="full-width flex justify-center items-center">
                  <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-RESTRAIN.png'" :asal="'RANAP'"
                    :kdpegsimrs="item?.kdDokter" width="60px" height="60px" />
                </div>
              </td>
              <td class="text-center q-pa-xs">
                <div class="full-width flex justify-center items-center">
                  <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-RESTRAIN.png'" :asal="'RANAP'"
                    :kdpegsimrs="item?.kdPetugas" width="60px" height="60px" />
                </div>
              </td>
              <td class="text-center q-pa-xs">
                <img v-if="item?.ttd_saksi_pasien" :src="item?.ttd_saksi_pasien" alt="ttd saksi pasien" width="60">
                <div v-else class="text-grey-4 f-9">Belum Ttd</div>
              </td>
              <td class="text-center q-pa-xs">
                <img v-if="item?.ttd_yg_menyatakan" :src="item?.ttd_yg_menyatakan" alt="ttd yang menyatakan" width="60">
                <div v-else class="text-grey-4 f-9">Belum Ttd</div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <!-- Footer Rev -->
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

const tujuanOptions = [
  'Memberikan perlindungan dan menjamin keselamatan pasien dan lingkungan terhadap cidera',
  'Membantu dalam pelaksanaan pemeriksaan diagnostic dan prosedur terapeutik',
  'Untuk memberikan perawatan pada pasien yang mengalami gangguan kepribadian atau pasien yang tidak kooperatif atau gelisah'
]

const komplikasiOptions = [
  'Luka gesekan',
  'Atrofi otot',
  'Hilangnya/berkurangnya densitas tulang',
  'Ulkus dekubitus',
  'Penurunan fungsi tubuh'
]

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

function isSelectedTujuan(opt, selectedTujuan) {
  if (!selectedTujuan) return false
  if (Array.isArray(selectedTujuan)) {
    return selectedTujuan.includes(opt)
  }
  try {
    const parsed = JSON.parse(selectedTujuan)
    if (Array.isArray(parsed)) return parsed.includes(opt)
  } catch (e) {}
  return selectedTujuan.includes(opt)
}

function isSelectedKomplikasi(opt, selectedKomplikasi) {
  if (!selectedKomplikasi) return false
  if (Array.isArray(selectedKomplikasi)) {
    return selectedKomplikasi.includes(opt)
  }
  try {
    const parsed = JSON.parse(selectedKomplikasi)
    if (Array.isArray(parsed)) return parsed.includes(opt)
  } catch (e) {}
  return selectedKomplikasi.includes(opt)
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
  line-height: 1.25;
}

.uppercase {
  text-transform: uppercase;
}

.tracking-wide {
  letter-spacing: 0.5px;
}

.table-signature {
  border-collapse: collapse;
  width: 100%;
  td, th {
    border: 1px solid #000 !important;
    padding: 3px 4px !important;
  }
}

.grow-1 {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
