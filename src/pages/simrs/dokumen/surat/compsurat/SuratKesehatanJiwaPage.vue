<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="store.dialog" persistent :maximized="true" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card class="bg-grey-4 text-white">
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
            <q-tooltip class="primary" :offset="[10, 10]">
              Print
            </q-tooltip>
          </q-btn>
          <q-btn dense flat icon="icon-mat-close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <div class="page-a4 text-black " id="printMe">
          <KopSurat />
          <div class="garis-bawah-dblue q-pb-sm q-mb-sm">
            <div class="row justify-center f-16 text-weight-bold" style="text-decoration: underline;">
              SURAT KETERANGAN PEMERIKSAAN KESEHATAN JIWA
            </div>
            <div class="row justify-center f-16 text-weight-bold q-mb-md">
              Nomor: {{ props.data?.nosurat }}
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-12">
                Yang bertanda tangan di bawah ini:
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Nama
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.pasien?.dokter }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                NIP
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.pasien?.datasimpeg?.nip }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Jabatan
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                Dokter Umum
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Instansi
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                RSUD dr. Mohammad Saleh Kota Probolinggo
              </div>
            </div>

            <div class="row q-col-gutter-sm f-16 q-mt-md">
              <div class="col-12">
                Telah melakukan pemeriksaan psikiatri pada {{ tanggalEjaIndonesia(pasien?.tgl_kunjungan) }}, Terhadap :

              </div>
            </div>
            <div class="flex q-gutter-sm f-16">
              <div class="" style="width: 20%">
                Nama
              </div>
              <div class="">
                :
              </div>
              <div class="">
                {{ props.pasien?.nama_panggil }}
              </div>
            </div>
            <div class="flex q-gutter-sm f-16">
              <div class="" style="width: 20%">
                Tempat, Tgl Lahir
              </div>
              <div class="">
                :
              </div>
              <div class="">
                {{ pasien?.templahir }}, {{ dateFullFormat(pasien?.tgllahir) }}
              </div>
            </div>
            <div class="flex q-gutter-sm f-16">
              <div class="" style="width: 20%">
                Jenis Kelamin
              </div>
              <div class="">
                :
              </div>
              <div class="">
                {{ props.pasien?.kelamin }}
              </div>
            </div>
            <div class="flex q-gutter-sm f-16">
              <div class="" style="width: 20%">
                Pekerjaan
              </div>
              <div class="">
                :
              </div>
              <div class="">
                {{ props.data?.pekerjaan }}
              </div>
            </div>
            <div class="flex q-gutter-sm f-16">
              <div class="" style="width: 20%">
                Pendidikan
              </div>
              <div class="">
                :
              </div>
              <div class="">
                {{ data?.pendidikan || '-' }}
              </div>
            </div>
            <div class="flex q-gutter-sm f-16">
              <div class="" style="width: 20%">
                Status Perkawinan
              </div>
              <div class="">
                :
              </div>
              <div class="">
                {{ data?.statusperkawinan || '-' }}
              </div>
            </div>






            <!-- <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Status Perkawinan
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.data?.statusperkawinan }}
              </div>
            </div> -->


            <!-- <div class="row q-col-gutter-sm q-mb-lg f-16">
              <div class="col-2">
                Alamat
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.pasien?.alamat }}
              </div>
            </div> -->
            <div class="row q-col-gutter-sm f-16 q-mt-sm">
              <div class="col-12">
                Dengan Hasil Pemeriksaan Kesehatan Jiwa pada saat ini :
              </div>
            </div>

            <!-- <div class="row q-col-gutter-sm f-16">
              <div class="col-12">
                ---------------------------------------------- {{ props.data?.kesimpulan }}
                ---------------------------------------------
              </div>
            </div> -->

            <div class="column f-16">
              <div class="flex q-gutter-sm">
                <div>1.</div>
                <div>Psikopatologi</div>
              </div>
              <div class="column flex q-ml-md">
                <div class="text-weight-bold">{{ props.data?.psikatopologi || '-' }}</div>
              </div>
              <div class="flex q-gutter-sm">
                <div>2.</div>
                <div>Kepribadian</div>
              </div>
              <div class="column flex q-ml-md">
                <div v-for="(item, index) in props.data?.kepribadian" :key="index" class="text-weight-bold">
                  {{ String.fromCharCode(97 + index) }}. {{ item.form }} : {{ item?.nilai || '-' }}
                </div>
              </div>

              <div class="flex q-gutter-sm">
                <div>3.</div>
                <div>Kecerdasan</div>
              </div>
              <div class="column flex q-ml-md">
                <div class="text-weight-bold">{{ props.data?.kecerdasan || '-' }}</div>
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mb-lg f-16 q-mt-sm">
              <div class="col-12">
                Demikian Surat Keterangan Pemeriksaan Kesehatan Jiwa ini dibuat dengan sebenar-benarnya untuk keperluan
                Administrasi <b>{{ props.data?.untukKeperluan }}</b>
              </div>
            </div>

          </div>
          <div class="row q-col-gutter-sm f-16">
            <div class="col-6">
            </div>
            <div class="col-6">
              <div style="margin-top: 60px; text-align: center;" class="f-16">
                <p style="margin-bottom: 60px;">
                  Probolinggo, <span id="tanggal-sekarang">{{ tanggal }}</span><br />
                  Dokter yang memeriksa,
                </p>
                <br>
                <div class="col-6 text-weight-bold text-center">
                  <div class="column flex-center">
                    <div style="width: 100px;">
                      <vue-qrcode :value="qrUrl" tag="svg" :options="{
                        errorCorrectionLevel: 'Q',
                        color: {
                          dark: '#000000',
                          light: '#ffffff',
                        },
                        margin: 0
                      }" />
                    </div>
                  </div>
                </div>
                <br>
                <p style="font-weight: bold; margin: 0;"><u>{{ props.pasien?.dokter }}</u></p>
                <p style="margin: 0;">NIP. {{ props.pasien?.datasimpeg?.nip }}</p>
              </div>
            </div>
          </div>


        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useDokumenSuratSehatStore } from 'src/stores/simrs/dokumen/erm/suratsehat';
import KopSurat from 'src/pages/simrs/dokumen/KopSuratNewPage.vue';
import { dateFullFormat, tanggalEjaIndonesia } from 'src/modules/formatter';

const store = useDokumenSuratSehatStore()
const props = defineProps({
  pasien: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: null
  },
})

// console.log('sasasa', props.data, props.pasien);

const qrUrl = computed(() => {
  // console.log('pasien', props?.pasien)

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'SKD.png'
  const asal = 'RAWAT JALAN'
  const petugas = props?.pasien?.kddpjp ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})


const tanggal = new Date().toLocaleDateString('id-ID', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
const hari = new Date().toLocaleDateString('id-ID', {
  weekday: 'long'
})
const bulan = new Date().toLocaleDateString('id-ID', {
  month: 'long'
})
const printObj = {
  id: 'printMe',
  popTitle: 'Surat Keterangan Dokter'

}
</script>
<style scoped>
.page-a4 {
  width: 794px;
  min-height: 1123px;
  padding-right: 40px;
  padding-left: 40px;
  padding-top: 10px;
  margin: auto;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  font-family: "Times New Roman", serif;
  font-size: 14px;
  position: relative;
}
</style>
