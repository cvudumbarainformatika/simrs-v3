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
              SURAT KETERANGAN PEMERIKSAAN NAPZA
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
                Dokter Spesialis Kedokteran Jiwa
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
                Telah melakukan pemeriksaan <b>NAPZA</b> Terhadap :

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
                Berdasarkan Pemeriksaan :
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
                <div>Laboratorium pada tanggal : {{ tanggalEjaIndonesia(pemeriksaanLaborat[0]?.rs3) }}</div>
              </div>
              <div class="column flex q-ml-lg">
                <div class="flex q-gutter-md">
                  <div>a.</div>
                  <div style="width:120px;">Amphetamin</div>
                  <div>: {{ getPemeriksaanLaborat('LAB218') || '...' }}</div>
                </div>
                <div class="flex q-gutter-md">
                  <div>b.</div>
                  <div style="width:120px;">Morphine</div>
                  <div>: {{ getPemeriksaanLaborat('LAB220') || '...' }}</div>
                </div>
                <div class="flex q-gutter-md">
                  <div>c.</div>
                  <div style="width:120px;">Metamphetamine</div>
                  <div>: {{ getPemeriksaanLaborat('LAB219') || '...' }}</div>
                </div>
                <div class="flex q-gutter-md">
                  <div>d.</div>
                  <div style="width:120px;">Benzodiazepin</div>
                  <div>: {{ getPemeriksaanLaborat('LAB222') || '...' }}</div>
                </div>
                <div class="flex q-gutter-md">
                  <div>e.</div>
                  <div style="width:120px;">Marijuana</div>
                  <div>: {{ getPemeriksaanLaborat('LAB221') || '...' }}</div>
                </div>
                <div class="flex q-gutter-md">
                  <div>f.</div>
                  <div style="width:120px;">Cocain</div>
                  <div>: {{ getPemeriksaanLaborat('LAB153') || '...' }}</div>
                </div>
              </div>
              <div class="flex q-gutter-sm q-mt-sm">
                <div>2.</div>
                <div>Keterangan riwayat penggunaan obat-obatan dalam seminggu terakhir.</div>
              </div>
              <div class="column flex q-ml-lg ">
                <div v-for="(item, index) in props.data?.riwayatObat" :key="index" class="flex q-gutter-x-sm">
                  {{ String.fromCharCode(97 + index) }}. {{ item.form }}
                  <div class="text-weight-bold">: {{ item?.nilai || '-' }}</div>
                </div>
              </div>


            </div>

            <div class="row q-col-gutter-sm q-mb-lg f-16 q-mt-sm">
              <div class="col-12">
                Berdasarkan hasil pemeriksaan di atas menunjukkan <b>{{ props.data?.kesimpulan }}</b> gejala-gejala
                penggunaan dan atau
                penyalahgunaan narkotika / zat psikoaktif
                <!-- <b>{{ props.data?.untukKeperluan }}</b> -->
              </div>
              <div class="col-12">
                Surat Keterangan Pemeriksaan Napza ini digunakan untuk keperluan :
                <b>{{ props.data?.untukKeperluan }}</b>
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

const pemeriksaanLaborat = computed(() => {
  const data = props?.pasien?.laboratold || []
  // const filt = data?.filter((item) => item?.pemeriksaanlab?.rs21?.toLowerCase()?.includes('fungsi hati'))
  // console.log('filt', filt);
  return data
})


const getPemeriksaanLaborat = (kode) => {
  const data = pemeriksaanLaborat.value?.find((item) => item?.rs4 === kode)
  console.log('data', data);

  return data?.rs21
}

// console.log('sasasa', props.pasien?.laboratold);

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
