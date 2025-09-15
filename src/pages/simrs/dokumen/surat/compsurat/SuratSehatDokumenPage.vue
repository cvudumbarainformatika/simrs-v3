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
              SURAT KETERANGAN DOKTER
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
            <div class="row q-col-gutter-sm q-mb-xl f-16">
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
            <div class="row q-col-gutter-sm f-16">
              <div class="col-12">
                Dengan ini menerangkan bahwa telah melakukan pemeriksaan terhadap :
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
                {{ props.pasien?.nama }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Tempat, Tgl Lahir
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.pasien?.templahir }}, {{ dateFullFormat(props.pasien?.tgllahir) }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Jenis Kelamin
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.pasien?.kelamin }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Pekerjaan
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.data?.pekerjaan }}
              </div>
            </div>
            <div class="row q-col-gutter-sm q-mb-lg f-16">
              <div class="col-2">
                Alamat
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-9">
                {{ props.pasien?.alamat }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-12">
                berdasarkan pemeriksaan kesehatan kepada bersangkutan pada saat ini dinyatakan :
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-12">
                ---------------------------------------------- {{ props.data?.kesimpulan }}
                ---------------------------------------------
              </div>
            </div>
            <div class="row q-col-gutter-sm q-mb-lg f-16">
              <div class="col-12">
                Surat Keterangan Dokter ini digunakan untuk keperluan : {{ props.data?.untukKeperluan }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-12">
                Keterangan :
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Penglihatan
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-2 text-left">
                Kiri VOS
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.data?.pengliatanKiri }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">

              </div>
              <div class="col-1">

              </div>
              <div class="col-2 text-left">
                Kanan VOD
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.data?.pengliatanKanan }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Pendengaran
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-2 text-left">
                Kiri
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.data?.pendengaranKiri }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">

              </div>
              <div class="col-1">

              </div>
              <div class="col-2 text-left">
                Kanan
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.data?.pendengaranKanan }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Gigi Dan Mulut
              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-2 text-left">
                {{ props.data?.gimut ?? '-' }}
              </div>
            </div>

            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Perbedaan Warna
              </div>
              <div class="col-1">

              </div>
              <div class="col-2 text-left">

              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.data?.perbedaanWarna }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Tinggi Badan
              </div>
              <div class="col-1">

              </div>
              <div class="col-2">

              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.pasien?.pemeriksaanfisik[0]?.tinggibadan ?? 0 }} cm
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Berat Badan
              </div>
              <div class="col-1">

              </div>
              <div class="col-2">

              </div>
              <div class="col-1">

              </div>
              <div class="col-6 text-left">
                {{ props.pasien?.pemeriksaanfisik[0]?.beratbadan ?? 0 }} kg
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Golongan Darah
              </div>
              <div class="col-1">

              </div>
              <div class="col-2">

              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.data?.golonganDarah }}
              </div>
            </div>
            <div class="row q-col-gutter-sm f-16">
              <div class="col-2">
                Tekanan Darah
              </div>
              <div class="col-1">

              </div>
              <div class="col-2">

              </div>
              <div class="col-1">
                :
              </div>
              <div class="col-6 text-left">
                {{ props.pasien?.pemeriksaanfisik[0]?.sistole }} / {{ props.pasien?.pemeriksaanfisik[0]?.diastole }}
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
import { dateFullFormat } from 'src/modules/formatter';

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
  padding: 40px;
  margin: auto;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  font-family: "Times New Roman", serif;
  font-size: 14px;
  position: relative;
}
</style>
