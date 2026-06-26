<template>
  <div id="pdfDoc" class="f-12">
    <!-- page 1 -->
    <div class="page-1">
      
      <!-- IDENTIFIKASI DOKUMEN (RM IRNA-18 / RM IRNA-19) -->
      <div class="text-right text-bold f-10 q-mb-xs">
        <span v-if="item?.setuju === 'Iya'">RM IRNA-18</span>
        <span v-else>RM IRNA-19</span>
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
          :header="[
            item?.setuju === 'Iya' ? 'Persetujuan Tindakan' : 'Penolakan / Pembatalan',
            item?.setuju === 'Iya' ? 'Transfusi Darah' : 'Tindakan Transfusi Darah',
            ''
          ]"
        />
      </div>
      <!-- ==================== LAYOUT PERSETUJUAN (RM IRNA-18) ==================== -->
      <div v-if="item?.setuju === 'Iya'" class="column fit">
        <!-- Dokter Pelaksana Statement -->
        <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
          Saya, Dokter Pelaksana transfusi menyatakan bahwa telah menerangkan hal terkait dengan transfusi darah dibawah ini secara benar dan jelas, dan sudah memberi kesempatan pada Pasien/ keluarga untuk bertanya dan berdiskusi.
        </div>

        <!-- Tabel Informasi Tindakan -->
        <div class="ba-black f-11 q-mt-xs overflow-hidden">
          <q-markup-table dense separator="cell" flat bordered wrap-cells class="table-info font-body text-black">
            <thead>
              <tr class="bg-grey-2">
                <th class="text-center text-bold f-11 text-black" width="25%">JENIS INFORMASI</th>
                <th class="text-center text-bold f-11 text-black">ISI INFORMASI YANG DIBERIKAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left text-bold f-11 text-black">1. Pengertian Transfusi</td>
                <td class="text-left f-11 text-black text-justify line-height-tight">
                  <div v-html="getNewLine(item?.indikasi || 'Suatu proses pemindahan darah dari orang sehat ( Donor) ke tubuh orang sakit (Pasien)')" />
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold f-11 text-black">2. Jenis Darah</td>
                <td class="text-left f-11 text-black text-justify line-height-tight">
                  <div v-html="getNewLine(item?.tindakanMedis || 'Darah yang dipindahkan dapat berupa darah lengkap atau hanya komponen darah')" />
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold f-11 text-black">3. Tujuan Transfusi</td>
                <td class="text-left f-11 text-black text-justify line-height-tight">
                  <div v-html="getNewLine(item?.tujuanLain || 'Untuk menolong pasien yang mengalami kurang darah baik dalam bentuk sel darah maupun komponen-komponennya')" />
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold f-11 text-black">4. Risiko</td>
                <td class="text-left f-11 text-black text-justify line-height-tight">
                  <div v-html="getNewLine(item?.resikoLain || 'Pemindahan darah selain dapat menolong orang dapat juga menimbulkan penyulit tergantung pada masing-masing individu penerimanya, terlebih pada pasien yang ada riwayat alergi')" />
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold f-11 text-black">5. Komplikasi</td>
                <td class="text-left f-11 text-black text-justify line-height-tight">
                  <div v-html="getNewLine(item?.komplikasi || 'Penyulit atau komplikasi yang biasa timbul sifatnya dapat terjadi cepat (akut) atau lambat, selain itu bila dilakukan Tranfusi dalam jumlah banyak dan cepat juga dapat menimbulkan akibat seperti Hipotermi yaitu suhu tubuh menurun, dan beberapa penyakit lainnya.')" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <!-- Identitas Pemberi Pernyataan (Yang Menyatakan) -->
        <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal">
          <div>Saya yang bertanda tangan dibawah ini :</div>
          <div class="q-mt-xs">
            <div class="row q-mt-2">
              <div class="col-3">Nama</div>
              <div class="col-9">: {{ item?.nama }} <span class="q-ml-sm">({{ item?.lp === 'Perempuan' ? 'P' : 'L' }})*</span> <span class="q-ml-lg">Tgl. Lahir : {{ item?.tglLahir || '-' }}</span></div>
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
              <div class="col-3">Telepon</div>
              <div class="col-9">: {{ item?.telepon || '-' }}</div>
            </div>
            <div class="row q-mt-xs items-center">
              <div class="col-3">Hubungan dengan Pasien</div>
              <div class="col-9 flex items-center q-gutter-x-sm">
                <div v-for="hub in store.hubunganDgPasiens" :key="hub" class="flex items-center q-mr-sm">
                  <div class="border-box flex items-center justify-center text-bold" style="width: 14px; height: 14px; border: 1px solid #000; font-size: 10px; margin-right: 4px;">
                    <q-icon v-if="hub === item?.hubunganDgPasien" name="icon-mat-check" size="10px" color="black" />
                  </div>
                  <span>{{ hub === 'Keluarga' ? `Keluarga : ${item?.keluarga || '...........'}` : hub }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pernyataan Persetujuan Tindakan -->
        <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
          Dengan ini menyatakan sesungguhnya, bahwa saya telah menerima informasi yang diberikan oleh Petugas sebagaimana diatas dan telah memahaminya. Untuk itu saya memberikan <strong>PERSETUJUAN</strong> untuk diberikan <strong>TRANSFUSI DARAH</strong> terhadap :
          <div class="q-mt-sm">
            <div class="row q-mt-2">
              <div class="col-3 text-bold">Nama Pasien</div>
              <div class="col-9">: {{ pasien?.nama }}</div>
            </div>
            <div class="row q-mt-2">
              <div class="col-3 text-bold">No. KTP Pasien</div>
              <div class="col-9">: {{ pasien?.nktp || '-' }}</div>
            </div>
            <div class="row q-mt-2">
              <div class="col-3 text-bold">Golongan Darah</div>
              <div class="col-9">: {{ item?.golonganDarah || '-' }}</div>
            </div>
            <div class="row q-mt-sm items-center">
              <div class="col-3 text-bold">RM</div>
              <div class="col-9 flex items-center">
                <span class="q-mr-sm">:</span>
                <div class="flex" style="border: 1px solid #000; width: fit-content;">
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

        <!-- Footer Pernyataan & Klausul Tanggung Jawab -->
        <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
          Saya memahami perlunya dan manfaat tindakan tersebut termasuk risiko dan komplikasi yang akan timbul bila tidak dilakukan tindakan tersebut, dan bila pada saat atau dikemudian hari terjadi keadaan penyulit akibat tindakan TRANSFUSI DARAH, saya tidak menyalahkan siapapun.
        </div>
      </div>


      <!-- ==================== LAYOUT PENOLAKAN (RM IRNA-19) ==================== -->
      <div v-else class="column fit">
        <!-- Identitas Pemberi Pernyataan (Yang Menyatakan Penolakan) -->
        <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal">
          <div>Saya yang bertanda tangan dibawah ini :</div>
          <div class="q-mt-xs">
            <div class="row q-mt-2">
              <div class="col-3">Nama</div>
              <div class="col-9">: {{ item?.nama }} <span class="q-ml-sm">({{ item?.lp === 'Perempuan' ? 'P' : 'L' }})*</span></div>
            </div>
            <div class="row q-mt-2">
              <div class="col-3">Tgl. Lahir</div>
              <div class="col-9">: {{ item?.tglLahir || '-' }}</div>
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
              <div class="col-3">Telepon</div>
              <div class="col-9">: {{ item?.telepon || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- Pernyataan Penolakan / Pembatalan Tindakan -->
        <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
          Dengan Ini menyatakan sesungguhnya, bahwa saya telah menerima informasi yang diberikan oleh petugas sebagaimana di atas dan telah memahaminya. Untuk itu saya memberikan <strong>PENOLAKAN / PEMBATALAN</strong> untuk diberikan <strong>TRANSFUSI</strong> terhadap :
          
          <div class="row q-mt-sm items-center">
            <div class="col-12 flex items-center q-gutter-x-sm bg-grey-1 q-pa-xs rounded">
              <div v-for="hub in store.hubunganDgPasiens.filter(x => x !== 'Orang Tua')" :key="hub" class="flex items-center q-mr-sm">
                <div class="border-box flex items-center justify-center text-bold" style="width: 14px; height: 14px; border: 1px solid #000; font-size: 10px; margin-right: 4px;">
                  <q-icon v-if="hub === item?.hubunganDgPasien" name="icon-mat-check" size="10px" color="black" />
                </div>
                <span>{{ hub === 'Keluarga' ? 'Keluarga' : hub }}</span>
              </div>
            </div>
          </div>

          <div class="q-mt-sm">
            <div class="row q-mt-2">
              <div class="col-3">Nama Pasien</div>
              <div class="col-9">: {{ pasien?.nama }} <span class="q-ml-sm">({{ pasien?.kelamin === 'Perempuan' ? 'P' : 'L' }})*</span></div>
            </div>
            <div class="row q-mt-2">
              <div class="col-3">Tgl. Lahir Pasien</div>
              <div class="col-9">: {{ pasien?.tgllahir || '-' }}</div>
            </div>
            <div class="row q-mt-2">
              <div class="col-3">No. KTP / SIM / PASPOR</div>
              <div class="col-9">: {{ pasien?.nktp || '-' }}</div>
            </div>
            <div class="row q-mt-2">
              <div class="col-3">Alamat Pasien</div>
              <div class="col-9">: {{ pasien?.alamat || '-' }}</div>
            </div>
            <div class="row q-mt-sm items-center">
              <div class="col-3 text-bold">REKAM MEDIS</div>
              <div class="col-9 flex items-center">
                <span class="q-mr-sm">:</span>
                <div class="flex" style="border: 1px solid #000; width: fit-content;">
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

        <!-- Footer Pernyataan & Klausul Tanggung Jawab Penolakan -->
        <div class="ba-black f-11 q-mt-xs q-pa-sm line-height-normal text-justify">
          Saya memahami perlunya dan manfaat tindakan tersebut termasuk risiko dan komplikasi yang akan timbul bila tidak dilakukan tindakan tersebut. Saya akan bertanggung jawab secara penuh atas segala akibat yang mungkin timbul akibat penolakan dilakukan tindakan tersebut.
        </div>
      </div>


      <!-- ==================== SIGNATURE & DATE (SHARED) ==================== -->
      <div class="q-mt-sm">
        <div class="text-right f-11 q-mb-xs q-mr-sm font-header">
          Probolinggo, {{ humanDate(item?.tanggal) }}, Pkl : {{ jamTnpDetik(item?.tanggal) }}
        </div>
        
        <q-markup-table dense separator="cell" flat bordered wrap-cells class="table-signature text-black font-body">
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
                  <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-TRANSFUSI.png'" :asal="'RANAP'"
                    :kdpegsimrs="item?.kdDokter" width="65px" height="65px" />
                </div>
              </td>
              <td class="text-center q-pa-xs">
                <div class="full-width flex justify-center items-center">
                  <app-qr-petugas :noreg="item?.noreg" :jnssurat="'IC-TRANSFUSI.png'" :asal="'RANAP'"
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

        <div class="f-9 text-grey-8 q-mt-xs">
          *) Coret yang tidak perlu
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
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
  }
})

onMounted(() => {
  initImage(props.item)
})

function initImage(item) {
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

.line-height-normal {
  line-height: 1.35;
}

.line-height-tight {
  line-height: 1.2;
}

.q-mt-2 {
  margin-top: 2px;
}

.uppercase {
  text-transform: uppercase;
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
