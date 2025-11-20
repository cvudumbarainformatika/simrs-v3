<template>
  <q-bar dense class="bg-white q-mb-md">
    <q-space />
    <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
      <q-tooltip class="primary" :offset="[10, 10]">
        Print
      </q-tooltip>
    </q-btn>
  </q-bar>
  <div class="tinggi">
    <div id="printMe" class="full-width">
      <KopSurat />
      <IdentitasPage :pasien="props.pasien" />
      <!-- <div class="row justify-end text-weight-bold q-gutter-sm" style="margin-right: 20px;">
        <div class="col-1">
          RM IRJA-1a
        </div>
      </div> -->
      <div class="row justify-center f-20 text-weight-bold q-mb-md">
        ASESMEN AWAL KEPERAWATAN RAWAT JALAN
      </div>
      <div v-if="store.loading">
        <app-loading />
      </div>
      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Riwayat Kesehatan</u></b>
      </div>

      <div class="row">
        <div v-for="(erm, e) in store.item" :key="e">
          <div v-for="(anamnesis, anm) in erm?.anamnesis" :key="anm">
            <div class="col-5" style="margin-left: 20px;">
              1. Riwayat Kesehatan Sekarang (Alasan masuk RS/Keluhan Utama) :
            </div>
            <div class="row">
              <div class="col-8" style="margin-left: 30px;">
                - Keluhan Utama: {{ anamnesis?.rs4 ?? '' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Riwayat Penyakit (Sekarang) : {{ anamnesis?.riwayatpenyakitsekarang ?? '' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Riwayat Penyakit : {{ anamnesis?.riwayatpenyakit ?? '' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Riwayat Penyakit Keluarga: {{ anamnesis?.riwayatpenyakitkeluarga ?? '' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Riwayat Alergi : {{ anamnesis?.riwayatalergi ?? '' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Reaksi berupa : {{ anamnesis?.keteranganalergi ?? '' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Riwayat Pengobatan : {{ anamnesis?.riwayatpengobatan ?? '' }}
              </div>
              <br>
              <div class="col-8" style="margin-left: 30px;">
                - Skreening Gizi : Skor {{ anamnesis?.skreeninggizi }} Ket {{ skorgizi(anamnesis?.skreeninggizi) }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Keluhan Nyeri : Skor {{ anamnesis?.scorenyeri }} Ket {{ skornyeri(parseInt(anamnesis?.scorenyeri)) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Pemeriksaan Fisik</u></b>
      </div>

      <div class="row">
        <div v-for="(erm, e1) in store.item" :key="e1">
          <div v-for="(pfisik, e1x) in erm.pemeriksaanfisik" :key="e1x">
            <div class="col-5" style="margin-left: 20px;">
              1. Keadaan Umum dan Tanda Vital
            </div>
            <div class="row">
              <div class="col-8" style="margin-left: 30px;">
                - Keadaan Umum: {{ pfisik?.keadaan_umum ?? '-' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Kesadaran: {{ pfisik?.kesadaran }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Suhu: {{ pfisik?.suhutubuh }} <span class="f-8" style="vertical-align: top;">o</span>C
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Nadi: {{ pfisik?.rs4 }} x/menit
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - TD: {{ pfisik?.sistole }}/{{ pfisik?.diastole }} mmHg
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Pernafasan: {{ pfisik?.pernapasan
                }} x/menit
              </div>
            </div>
            <div class="col-5" style="margin-left: 20px;">
              2. Data psikologi, edukasi, ekonomi, spiritual, dan kultural
            </div>
            <div class="row">
              <div class="col-8" style="margin-left: 30px;">
                - Psikologis: {{ pfisik?.statuspsikologis }}
              </div>
              <!-- <div class="col-8" style="margin-left: 30px;">
                - Sosial Ekonomi: ????????????????????
              </div> -->
              <div class="col-8" style="margin-left: 30px;">
                <div class="row">
                  <div class="col-2">
                    - Edukasi:
                  </div>
                  <template v-for="ed in erm?.edukasi" :key="ed">
                    <div class="col-10">
                      <div class="column">
                        <div>{{ ed?.perlupenerjemah === 'Iya' ? 'Pasien Perlu Penerjemah' :
                          'Pasien Tidak Perlu Penerjemah'
                        }}</div>
                        <div>{{ ed?.bahasaisyarat === 'Iya' ? 'Pasien Memakai Bahasa Isyarat' :
                          'Pasien Tidak Memakai Bahasa Isyarat' }}</div>
                        <div>{{ ed?.caraedukasi === 'Lisan' ? 'Edukasi Memakai Lisan' : 'Edukasi Memakai Tulisan' }}
                        </div>
                        <div>{{ (ed?.kesediaan === 'Iya' ? 'Pasien Bersedia' : 'Pasien Tidak Bersedia') +
                          ' menerima edukasi dan informasi dari Petugas' }}</div>
                        <div> Kebutuhan : <b><em>{{ ed?.kebutuhanedukasi }}</em></b> </div>
                        <div> Penerima Edukasi : <b><em>{{ ed?.rs9 }}</em></b> </div>
                      </div>
                    </div>

                  </template>
                </div>
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Sosial Ekonomi: {{ pfisik?.sosialekonomi ?? '-' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Spiritual: {{ pfisik?.spiritual ?? '-' }}
              </div>
              <div class="col-8" style="margin-left: 30px;">
                - Kultural: {{ pfisik?.muakuloskeletal ?? '-' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Skrining Gizi</u></b>
      </div>

      <div class="row">
        <div v-for="(erm, e1) in store.item" :key="e1">
          <div v-for="(anamx, e2x) in erm.anamnesis" :key="e2x">
            <div class="col-5" style="margin-left: 20px;">
              - Pasian <span v-if="anamx?.skreeninggizi == 0" class="text-weight-bold">{{
                skorgizi(anamx?.skreeninggizi)
                }}</span> mengalami penurunan / peningkatan BB yang tidak
              diinginkan dalam 6 Bulan terakhir
            </div>
            <div class="col-5" style="margin-left: 20px;">
              - Asupan Makan <span v-if="anamx?.asupanmakan == 0" class="text-weight-bold">{{
                skorgizi(anamx?.asupanmakan)
                }}</span> berkurang karena tidak nafsu makan
            </div>
            <div class="col-5" style="margin-left: 20px;">
              - Kondisi Khusus : {{ anamx?.kondisikhusus ?? '-' }}
            </div>
            <div class="col-12" style="margin-left: 20px;">
              <div class="flex">
                - Skor Skreening Gizi : <div class="q-mx-sm">
                  <b>{{ anamx?.skor }}</b>
                </div>
                <div>
                  Keterangan : {{ keteranganSkorGizi(anamx?.skor) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Daftar Masalah Keperawatan</u></b>
      </div>
      <div class="row">
        <div v-for="(erm, e1) in store.item" :key="e1">
          <div v-for="(kep, e3x) in erm.diagnosakeperawatan" :key="e3x">
            <div class="col-5" style="margin-left: 20px;">
              - {{ kep?.nama }}
            </div>
          </div>
        </div>
      </div>

      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Rencana Keperawatan</u></b>
      </div>
      <div class="row">
        <div class="col-5" style="margin-left: 20px;">
          <div v-for="(erm, e1) in store.item" :key="e1">
            <div v-for="(kep, e3x) in erm.diagnosakeperawatan" :key="e3x">
              <div v-if="kep.intervensi?.filter(x => x.masterintervensi.group === 'plann')?.length"
                style="margin-left: 20px;">
                <div v-for="item in kep.intervensi?.filter(x => x.masterintervensi.group === 'plann')" :key="item">
                  - {{ item?.masterintervensi?.nama }}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Implementasi / Tindakan</u></b>
      </div>
      <div class="row">
        <div class="col-5" style="margin-left: 20px;">
          <div v-for="(erm, e1) in store.item" :key="e1">
            <div v-for="(kep, e3x) in erm.diagnosakeperawatan" :key="e3x">
              <div v-if="kep.intervensi?.filter(x => x.masterintervensi.group !== 'plann')?.length"
                style="margin-left: 20px;">
                <div v-for="item in kep.intervensi?.filter(x => x.masterintervensi.group !== 'plann')" :key="item">
                  - {{ item?.masterintervensi?.nama }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Evaluasi</u></b>
      </div>
      <div class="row">
        <div v-for="(erm, e1) in store.item" :key="e1">
          <div v-for="(kep, e3x) in erm.diagnosakeperawatan" :key="e3x">
            <div class="col-5" style="margin-left: 20px;">
              <span v-html="getNewLine(kep?.evaluasi ?? '-')" />

            </div>
          </div>
        </div>
      </div>

      <q-separator />
      <div style="margin-left: 10px;">
        <b><u>Catatan Kie</u></b>
      </div>
      <div class="row">
        <div v-for="(erm, e1) in store.item" :key="e1">
          <div v-for="item in erm?.rs239_implementasi" :key="item">
            <div>
              <div class="col-5" style="margin-left: 20px;" v-if="!item?.materi?.length">
                -
              </div>
              <div v-else>
                <div v-for="mat in item?.materi" :key="mat">
                  <div class="flex no-wrap" style="margin-left: 20px;">{{ mat }}, </div>
                </div>
              </div>

              <div v-html="getNewLine(item?.materiLain)" class="text-italic" style="margin-left: 20px;" />
            </div>
          </div>
        </div>

      </div>
      <!-- <div class="row">
        <div v-for="(erm, e1) in store.item" :key="e1">
          <div v-for="(plan, e10) in erm.planning" :key="e10">
            <div class="col-5" style="margin-left: 20px;">
              - {{ plan?.rs4 }}
            </div>
          </div>
        </div>
      </div> -->
      <div class="q-mt-md">
        <div class="row">
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Pasien / Keluarga
            </div>
          </div>
          <div class="col-6">
            <div class="text-center text-weight-bold">
              Perawat
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6 q-mt-xl">
            <div class="text-center text-weight-bold">
              (.........................)
            </div>
          </div>
          <div class="col-6 text-center">
            <div class="text-center text-weight-bold">
              <div class="row justify-center">
                <div class="flex-center " style="width: 80px;">
                  <div class="relative-position">
                    <vue-qrcode :value="qrPetugas(petugas)" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff',
                      },
                      margin: 0
                    }" />
                    <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
                  </div>
                </div>
              </div>
              <div class="f-12 text-wrap row justify-center">{{ petugas?.nama }}</div>


            </div>
          </div>
        </div>
      </div>
      <div v-if="store.loading">
        <app-loading />
      </div>
    </div>
  </div>
</template>

<script setup>
import { date } from 'quasar'
import KopSurat from '../../comppoli/KopSurat.vue'
import IdentitasPage from '../../comppoli/IdentitasPage.vue'
import { useDokumenpengkajianawalmedisrjStore } from 'src/stores/simrs/dokumen/erm/pengkajianawalmedisrj'
import { getNewLine, humanDate, jamTnpDetik } from 'src/modules/formatter'
import { computed } from 'vue'
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
const printObj = {
  id: 'printMe',
  popTitle: 'Asesmen Awal Keperawatan'

}
const store = useDokumenpengkajianawalmedisrjStore()
// eslint-disable-next-line no-use-before-define
store.setParams('noreg', props.pasien?.noreg)
// eslint-disable-next-line no-use-before-define
// console.log('noreg', props.pasien?.noreg)
store.getData()

function skorgizi (val) {
  if (val > 0) {
    return 'Ya'
  } else {
    return 'Tidak'
  }
}
function keteranganSkorGizi (nilai) {
  const skor = nilai || 0
  if (skor < 2) {
    return 'tidak beresiko malnutrisi'
  }
  else {
    return 'Beresiko malnutrisi'
  }
}

const jenisPPA = (val) => {
  if (val === '1') {
    return 'Dokter'
  }
  else if (val === '2') {
    return 'Perawat'
  }
  else if (val === '3') {
    return 'Bidan'
  }
  else if (val === '4') {
    return 'Apoteker'
  }
  else if (val === '5') {
    return 'Ahli Gizi'
  }
  else {
    return 'Fisoterapis'
  }
}
// function getYT(val) {
//   if (val === 1 || val === '1') {
//     return 'Ya'
//   } else if (val === 0 || val === '0') {
//     return 'Tidak'
//   } else {
//     return '-'
//   }
// }
const petugas = computed(() => {
  const petugas = store.item[0]?.diagnosakeperawatan[0]?.petugas
  console.log('petugas', petugas)
  return petugas

})
const qrPetugas = (user) => {
  // console.log('user', user);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'ASSESMENT PERAWAT.png'
  const asal = 'RAWAT JALAN'
  const petugas = user?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
const qrPenerima = (ttd) => {
  // console.log('user', user);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'KIE.png'
  const asal = 'RAWAT JALAN'
  const ttdPenerima = ttd ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${ttdPenerima}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
function skornyeri (val) {
  if (val === 0) {
    return 'Tidak Ada Nyeri'
  } else if (val >= 1) {
    return 'Nyeri Ringan'
  } else if (val >= 4) {
    return 'Nyeri Sedang'
  } else if (val >= 7) {
    return 'Nyeri Berat'
  }
}


</script>

<style lang="scss" scoped>
.qrcode__image {
  // background-color: #fff;
  // border: 0.05rem solid #fff;
  // border-radius: 0.25rem;
  // box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 20%;
  width: 20%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

table {
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border: 1px solid black;
}

.kotak {
  border: 1px solid black;
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  padding: 20px !important;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: letter;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD MOH SALEH KOTA PROBOLINGGO | Hal Ke-" counter(page);
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}

.t-vertical {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
</style>
