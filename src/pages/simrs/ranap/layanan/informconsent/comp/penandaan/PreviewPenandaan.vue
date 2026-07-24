<template>
  <div id="pdfDoc" class="f-12">
    <!-- page 1 -->
    <div class="page-1">
      <!-- KOP SURAT -->
      <div class="col-auto">
        <AppKopSuratStandard :dataHeader="[
          'PEMERINTAH KOTA PROBOLINGGO',
          'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
          'UOBK RSUD DOKTER MOHAMAD SALEH',
          'Jl. Mayjend Panjaitan No.65 Telp: (0335)433119 Fax.(0335)432702',
          'email: rsudprob@probolinggokota.go.id',
          'PROBOLINGGO – 67219'
        ]" :pasien="pasien" :header="['Persetujuan Penandaan', 'Lokasi Operasi', '']" />
      </div>
      <!-- Identitas Pemberi Pernyataan -->
      <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal">
        <div>Yang bertanda tangan di bawah ini saya,</div>
        <div class="q-mt-xs">
          <div class="row q-mt-2">
            <div class="col-3">Nama</div>
            <div class="col-9">: {{ item?.nama || '-' }}</div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">Tanggal lahir</div>
            <div class="col-9">: {{ item?.tglLahir || '-' }} <span class="q-ml-sm">({{ item?.lp === 'Perempuan' ? 'P' :
                'L' }})*</span></div>
          </div>
          <div class="row q-mt-2">
            <div class="col-3">Alamat</div>
            <div class="col-9">: {{ item?.alamat || '-' }}</div>
          </div>
          <div class="row q-mt-sm items-center">
            <div class="col-3">No. RM</div>
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
            <div class="col-3">Ruang</div>
            <div class="col-9">: {{ pasien?.ruangan || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- Pernyataan & Gambar Lokasi Operasi (Disatukan) -->
      <div class="ba-black f-11 q-mt-xs line-height-normal text-justify">
        <!-- Teks Atas -->
        <div class="q-pa-sm">
          Dengan ini saya menyatakan dengan sesungguhnya telah dilibatkan dalam penandaan lokasi operasi dan memberikan
          persetujuan dilakukan penandaan lokasi operasi seperti yang tergambar di bawah ini. Adapun tujuan dari
          penandaan lokasi operasi ini adalah untuk menghindari kesalahan lokasi, kesalahan prosedur dan kesalahan
          pasien saat operasi.
        </div>

        <!-- Gambar Tengah -->
        <div class="q-pa-sm flex flex-center bg-white"
          style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
          <div class="overflow-hidden bg-white relative-position"
            style="width: 100%; max-width: 100%; aspect-ratio: 1024/601; margin: 0 auto;">
            <!-- Background Template -->
            <img :src="bodyMarkerImg"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1;" />

            <!-- Coretan Merah -->
            <img v-if="item?.alternatif" :src="item?.alternatif_base64 || getImageUrl(item?.alternatif)"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 2;" />
          </div>
        </div>

        <!-- Teks Bawah -->
        <div class="q-pa-sm">
          Demikian pernyataan persetujuan ini saya buat dengan penuh kesadaran dan tanpa paksaan.
        </div>
      </div>

      <!-- SIGNATURE LAYOUT -->
      <div class="q-mt-sm grow-1">
        <div class="row text-right f-11 q-mr-sm justify-end">
          <div class="col-auto">
            Probolinggo, {{ humanDate(item?.tanggal) }}, Pkl : {{ jamTnpDetik(item?.tanggal) }}
          </div>
        </div>

        <q-markup-table dense separator="cell" flat bordered wrap-cells
          class="table-signature text-black font-body q-mt-sm">
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
              <td class="text-left text-bold f-10 text-black" style="height: 75px;">Tanda Tangan</td>
              <td class="text-center q-pa-xs">
                <div class="full-width flex justify-center items-center">
                  <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-PENANDAAN-LOKASI.png'" :asal="'RANAP'"
                    :kdpegsimrs="item?.kdDokter" width="65px" height="65px" />
                </div>
              </td>
              <td class="text-center q-pa-xs">
                <div class="full-width flex justify-center items-center">
                  <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-PENANDAAN-LOKASI.png'" :asal="'RANAP'"
                    :kdpegsimrs="item?.kdPetugas" width="65px" height="65px" />
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

        <!-- Footer rev -->
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
import { onMounted, watch } from 'vue'
import bodyMarkerImg from 'src/assets/human/anatomys/body-marker-irna37.webp'

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

  if (item?.alternatif && !item.alternatif.startsWith('data:image')) {
    const alternatifUrl = pathImg + item.alternatif
    promises.push(
      imageToBase64(alternatifUrl, (base64Image) => {
        item.alternatif_base64 = base64Image ?? ''
      })
    )
  }

  Promise.all(promises)
}

const getImageUrl = (img) => {
  if (!img) return ''
  if (img.startsWith('data:image')) {
    return img
  }
  return pathImg + img
}

const getNormDigits = (norm) => {
  if (!norm) return ['', '', '', '', '', '']
  const clean = norm.replace(/\D/g, '') // remove non-digits
  const padded = clean.padStart(6, '0') // pad to 6 digits
  return padded.split('').slice(0, 6)
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

.uppercase {
  text-transform: uppercase;
}

.marked-anatomy-img {
  max-width: 100%;
  height: auto;
  max-height: 380px;
  object-fit: contain;
}

.grow-1 {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.signature-area {
  margin-top: auto;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.tracking-wide {
  letter-spacing: 0.5px;
}

.q-mt-2 {
  margin-top: 2px;
}

.table-signature {
  border-collapse: collapse;
  width: 100%;

  td,
  th {
    border: 1px solid #000 !important;
    padding: 3px 4px !important;
  }
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
