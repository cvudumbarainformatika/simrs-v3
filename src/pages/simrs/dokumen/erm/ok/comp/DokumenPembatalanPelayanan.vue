<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-internal v-if="!history" title1="PEMBATALAN" title2="PELAYANAN" />

        <div v-if="!history" class="biodata-pasien q-my-md">
          <div class="flex justify-between">
            <div class="flex q-gutter-md kiri">
              <div style="width: 58px;" class="text-weight-bold">
                NO. RM
              </div>
              <div style="width: 70px;">
                : {{ pasien?.norm }}
              </div>
              <div class="text-weight-bold">
                NAMA PASIEN
              </div>
              <div>
                : {{ pasien?.nama_panggil }}
              </div>
            </div>
            <div class="flex q-gutter-md kanan">
              <div class="text-weight-bold">
                TGL. LAHIR
              </div>
              <div>
                : {{ dateFullFormat(pasien?.tgllahir) }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="column full-width">
              <div>
                <span class="q-mr-lg text-weight-bold">ALAMAT</span> : {{ pasien?.alamat ?? '-' }}
              </div>
            </div>
          </div>
        </div>

        <div class="dokumen-content q-mb-md">
          <div class="section-wrapper q-mb-lg">
            <div class="text-weight-bold f-14 text-center"
              style="text-decoration: underline; margin-bottom: 20px; background-color: #f5f5f5; padding: 8px;">
              SURAT PERNYATAAN PEMBATALAN PELAYANAN OPERASI
            </div>

            <div class="q-px-md q-gutter-y-sm">
              <p>Saya yang bertanda tangan di bawah ini yang menerima informasi (Pasien sendiri / keluarga pasien atau penanggung jawab pasien):</p>
              
              <table class="data-table">
                <tr>
                  <td style="width: 250px;">Nama</td>
                  <td>: {{ pembatalanData?.nama_penerima_informasi ?? '-' }}</td>
                </tr>
                <tr>
                  <td>Tanggal Lahir / Umur</td>
                  <td>: {{ pembatalanData?.tgllahir_penerima_informasi ? dateFullFormat(pembatalanData?.tgllahir_penerima_informasi) : '-' }} / {{ pembatalanData?.umur_penerima_informasi ?? '-' }} Tahun</td>
                </tr>
                <tr>
                  <td>Hubungan dengan Pasien</td>
                  <td>: {{ pembatalanData?.hubungan_penerima_informasi ?? '-' }}</td>
                </tr>
              </table>

              <p class="q-mt-md">Menyatakan atas nama Pasien berikut:</p>

              <table class="data-table">
                <tr>
                  <td style="width: 250px;">Nama Pasien</td>
                  <td>: {{ pasien?.nama_panggil ?? '-' }}</td>
                </tr>
                <tr>
                  <td>Tanggal Lahir / Jenis Kelamin</td>
                  <td>: {{ pasien?.tgllahir ? dateFullFormat(pasien?.tgllahir) : '-' }} / {{ pasien?.kelamin ?? '-' }}</td>
                </tr>
                <tr>
                  <td>No. Rekam Medis (No. RM)</td>
                  <td>: {{ pasien?.norm ?? '-' }}</td>
                </tr>
                <tr>
                  <td>NIK Pasien</td>
                  <td>: {{ pasien?.noka ?? '-' }}</td>
                </tr>
                <tr>
                  <td>Poli / Ruangan Asal</td>
                  <td>: {{ pasien?.kodepoli ?? '-' }} - {{ pasien?.namapoli ?? '-' }}</td>
                </tr>
                <tr>
                  <td>Nama Dokter Pengirim</td>
                  <td>: {{ typeof pasien?.dokter === 'object' ? pasien?.dokter?.nama : (pasien?.dokter ?? '-') }}</td>
                </tr>
                <tr>
                  <td>Pelayanan yang akan Dilakukan</td>
                  <td>: {{ tindakanOperasi }}</td>
                </tr>
              </table>

              <p class="q-mt-md">
                Dengan ini menyatakan bahwa saya telah menerima informasi terhadap <strong>pembatalan pelayanan operasi</strong> dikarenakan:
              </p>
              <div class="q-pa-sm q-mb-md" style="border: 1px solid #ccc; background-color: #fafafa; border-radius: 4px; min-height: 50px;">
                {{ pembatalanData?.alasan_pembatalan ?? '-' }}
              </div>

              <p>
                Maka dengan ini saya <strong>SETUJU</strong> untuk dilakukan pembatalan pelayanan dengan alternatif yang diberikan:
              </p>
              
              <div class="q-px-sm q-py-xs bg-grey-2 rounded q-mb-sm" style="border-left: 4px solid #027be3;">
                <div v-if="pembatalanData?.alternatif_pilihan === 'rujuk'">
                  <strong>Dirujuk ke layanan kesehatan lain:</strong>
                  <div class="q-pl-md q-pt-xs text-italic">
                    Ke: {{ pembatalanData?.alternatif_rujuk_ke ?? '-' }}
                  </div>
                </div>
                <div v-else-if="pembatalanData?.alternatif_pilihan === 'kembali'">
                  <strong>Dikembalikan kepada dokter pengirim dengan rencana Tindakan:</strong>
                  <div class="q-pl-md q-pt-xs text-italic" style="white-space: pre-line;">
                    {{ pembatalanData?.alternatif_kembali_rencana ?? '-' }}
                  </div>
                </div>
                <div v-else>
                  <em class="text-grey">Belum ada alternatif rencana yang dipilih</em>
                </div>
              </div>
            </div>

            <!-- Tanda Tangan Section -->
            <div class="row q-my-xl q-pt-md" style="border-top: 1px solid #ddd;">
              <div class="col-6 text-center">
                <div class="text-weight-bold q-mb-sm">Menyetujui<br>Pasien/Keluarga Pasien</div>
                <div v-if="pembatalanData?.ttd_penanggung_jawab" style="height: 100px; margin: 0 auto;" class="q-mb-sm flex flex-center">
                  <img :src="getImageUrl(pembatalanData?.ttd_penanggung_jawab)" style="max-height: 100px; max-width: 100%; object-fit: contain;" />
                </div>
                <div v-else style="height: 100px;"></div>
                <div class="text-weight-bold text-underline">
                  ( {{ pembatalanData?.nama_penerima_informasi ?? '..........................................' }} )
                </div>
                <div class="f-10">Nama Jelas & Tanda tangan</div>
              </div>
              <div class="col-6 text-center">
                <div class="text-weight-bold q-mb-sm">Mengetahui<br>DPJP</div>
                <div v-if="pembatalanData?.dpjp_kodesimrs || pasien?.kodedokter" style="height: 100px; width: 100px; margin: 0 auto;" class="q-mb-sm">
                  <vue-qrcode :value="qrUrl(pembatalanData?.dpjp_kodesimrs || pasien?.kodedokter)" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: { dark: '#000000', light: '#ffffff' },
                    margin: 0
                  }" />
                </div>
                <div v-else style="height: 100px;"></div>
                <div class="text-weight-bold text-underline">
                  ( {{ pembatalanData?.dpjp?.nama ?? (typeof pasien?.dokter === 'object' ? pasien?.dokter?.nama : (pasien?.dokter ?? '..........................................')) }} )
                </div>
                <div class="f-10">Nama Jelas & Tanda tangan</div>
              </div>
            </div>

            <div class="q-mt-lg text-right text-italic f-10 text-grey">
              RM IRNA- 36
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-btn v-if="!history" ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary"
      class="fixed-bottom-right" style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { pathImg } from 'src/boot/axios'
import { dateFullFormat } from 'src/modules/formatter'
import { usePembatalanOperasiStore } from 'src/stores/simrs/kamaroperasi/pembatalan'
import { onMounted, ref, computed } from 'vue'

const getImageUrl = (img) => {
  if (!img) return ''
  if (img.startsWith('data:image')) {
    return img
  }
  return pathImg + img
}

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  history: {
    type: Boolean,
    default: false
  }
})

const store = usePembatalanOperasiStore()
const refPrint = ref()

const pembatalanData = computed(() => {
  return store.form
})

const tindakanOperasi = computed(() => {
  return props.pasien?.rs4 ?? props.pasien?.tindakan ?? '-'
})

function qrUrl(val) {
  const noreg = props?.pasien?.noreg
  const dok = 'PEMBATALAN PELAYANAN.png'
  const asal = 'PENUNJANG'
  const petugas = val ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}

const printObj = {
  id: 'pdfDoc',
  popTitle: 'Pembatalan Pelayanan',
  extraCss: '',
  extraHead: '<meta http-equiv="Content-Language" content="id">'
}

onMounted(() => {
  store.getDataPembatalan(props.pasien)
})
</script>

<style lang="scss" scoped>
.page-legal {
  width: 21.59cm;
  min-height: 29.7cm;
  padding: 10mm;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-family: 'Times New Roman', Times, serif;
}

.contentx {
  padding: 5mm;
}

.biodata-pasien {
  border: 1px solid #000;
  padding: 8px;
  margin-bottom: 20px;
  font-size: 11px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 5px 0;
  
  td {
    padding: 4px 0;
    vertical-align: top;
  }
}

.text-underline {
  text-decoration: underline;
}

.f-10 {
  font-size: 10px;
}

.f-12 {
  font-size: 12px;
}

.f-14 {
  font-size: 14px;
}

.text-weight-bold {
  font-weight: bold;
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;
    box-shadow: none;
    padding: 0;
    margin: 0;

    .contentx {
      padding: 5mm;
    }
  }

  @page {
    margin: 10mm;
  }
}
</style>
