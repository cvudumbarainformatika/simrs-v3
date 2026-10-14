<template>
  <div id="pdfDoc" ref="rePdfDoc" class="page-A4 f-12 bg-white">
    <div class="contentx">
      <app-kop-surat />
      <div class="q-mt-sm q-pa-sm">
        <div class="column">
          <div class="b-a q-pa-sm">
            <div class="f-14 text-weight-bold text-center">
              INSTALASI RADIOLOGI
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12">
              <div class="flex full-width">
                <div class="flex flex-1 q-gutter-sm q-mb-xs">
                  <div style="width:100px;" class="text-weight-bold">NAMA</div>
                  <div>: {{ pasien?.nama }}</div>
                </div>

              </div>
              <div class="flex full-width">
                <div class="flex flex-1 q-gutter-sm q-mb-xs">
                  <div style="width:100px;" class="text-weight-bold">UMUR / JENIS</div>
                  <div>: {{ pasien?.usia }} / {{ pasien?.kelamin }}</div>
                </div>

              </div>
              <div class="flex full-width">
                <div class="flex flex-1 q-gutter-sm q-mb-xs">
                  <div style="width:100px;" class="text-weight-bold">NOMOR RM / NIK</div>
                  <div>: {{ pasien?.norm || pasien?.nik }}</div>
                </div>

              </div>
            </div>
            <div class="col-12 text-right">
              <!-- INI DISURUH UBAH SAMA MBAK ANE (DISURUH MANAGEMENT) -->
              <!-- <div class="text-weight-bold">Probolinggo, {{ printDate }}</div> -->
              <!-- INI DISURUH GANTI LAGI SAMA MAS SUBHAN (DISURUH MANAGEMENT) tgl 6 maret 2026 -->
              <!-- <div class="text-weight-bold">Probolinggo, {{ humanDate(item?.rs3) || humanDate(pasien?.tglentri) }}</div> -->
              <div class="text-weight-bold">Probolinggo, {{ printDate }}</div>
            </div>
          </div>




          <app-input-simrs-mode view v-model="html" :disable="true" class="col-12 q-mb-md" />
          <!-- <app-input-simrs-mode view v-model="item.kesimpulanhtml" :disable="true" class="col-12 q-mb-md" /> -->
          <!-- <div class="laporan-rad" v-html="html"></div> -->
        </div>




        <!-- <BottomTtd :pasien="props.pasien" /> -->

        <div class="row q-pa-sm justify-between items-end">
          <div class="kiri text-center">
            <div v-if="hasPacs && qrPacsUrl" class="column items-center">
              <div class="f-10 text-weight-bold q-mb-xs">Hasil Citra Radiologi :</div>
              <div style="width: 100px;">
                <vue-qrcode :value="qrPacsUrl" tag="svg" :options="{
                  errorCorrectionLevel: 'M',
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },
                  margin: 0
                }" />
              </div>
              <div class="f-10 text-grey-9 q-mt-xs text-weight-medium">
                Scan untuk melihat citra
              </div>
            </div>
            <div v-else style="visibility: hidden;">
              .
            </div>
          </div>
          <div class="kanan text-center">
            <!-- <div><b>Probolinggo, {{ printDate }}</b></div> -->
            <!-- INI DISURUH UBAH SAMA MBAK ANE (DISURUH MANAGEMENT) -->
            <!-- <div><b>Probolinggo, {{ printDate }}</b></div> -->
            <!-- INI DISURUH GANTI LAGI SAMA MAS SUBHAN (DISURUH MANAGEMENT) tgl 6 maret 2026 -->
            <div><b>Probolinggo, {{ printDate }}</b></div>
            <div class="q-mb-sm">Dokter Penanggung Jawab Pelayanan</div>
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

            <div class="q-mt-md">
              <b>{{ item?.pelaksana }}</b>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { humanDate } from 'src/modules/formatter'
import { formatRadiologi } from 'src/modules/formatRadiologi'
const printDate = computed(() => {
  const d = props.item?.tgl || props.item?.rs2 || props.item?.rs11 || props.item?.rs3 || props.pasien?.permintaan?.trmtgl || props.pasien?.tglentri || props.pasien?.tgl_kunjungan || props.pasien?.tgl_masuk
  if (!d) return ''
  return humanDate(d)
})

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  }
})

// console.log('props', props.item);
const html = computed(() => {
  console.log(formatRadiologi(props?.item?.hasilhtml));

  // return formatRadiologi(props?.item?.hasilhtml)
  return props?.item?.hasilhtml
})

const qrUrl = computed(() => {
  const noreg = props?.item?.rs2 // noreg
  const dok = 'RADIOLOGI.png'
  const asal = 'RADIOLOGI'
  const petugas = props?.item?.kdPelaksana ?? null

  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

const nota = computed(() => {
  return (
    props.item?.notrans ||
    props.item?.nota ||
    props.pasien?.nota_permintaan ||
    props.pasien?.notrans ||
    props.pasien?.permintaan?.nota_permintaan ||
    props.pasien?.permintaan?.rs2 ||
    props.item?.rs2 ||
    props.pasien?.rs2 ||
    props.item?.rs1 ||
    ''
  )
})

const hasPacs = computed(() => {
  const itemHasAlat = !!(props.item?.relmasterpemeriksaan?.alat || props.item?.alat)
  const itemHasUrl = !!(props.item?.view_url || props.item?.view_url_local || props.item?.pacs?.view_url)
  if (itemHasAlat || itemHasUrl) return true

  const fromRinciSementara = props.pasien?.rinciansementara?.some(r => !!r?.relmasterpemeriksaan?.alat || !!r?.view_url)
  const fromPermintaanRinci = props.pasien?.permintaan?.rincians?.some(r => !!r?.alat || !!r?.view_url)
  const fromPasienUrl = !!(props.pasien?.view_url || props.pasien?.pacs?.view_url)

  return fromRinciSementara || fromPermintaanRinci || fromPasienUrl || false
})

const qrPacsUrl = computed(() => {
  if (!nota.value) return ''
  return `https://orthanc.xenter.my.id/hasil/${nota.value}`
})
</script>

<style lang="scss" scoped>
.page-A4 {
  // background: white;
  display: block;
  margin-left: auto;
  margin-right: auto;

  //width: 21cm;
  width: 21.59cm;
  height: 33cm;

  // margin: 30mm 45mm
  .contentx {
    padding: 5mm 5mm
  }

  .b-a {
    border: 1px solid black;
  }

  .b-l {
    border-left: 1px solid black;
  }

  .b-r {
    border-right: 1px solid black;
  }
}

// .pt12 {
//   font-size: 12pt !important;
// }

table {
  width: 100%;

  td {
    vertical-align: top;
  }
}
</style>
