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
              <!-- <div class="text-weight-bold">Probolinggo, {{ humanDate(item?.tgl) }}</div> -->
              <div class="text-weight-bold">Probolinggo, {{ humanDate(item?.rs3) || humanDate(pasien?.tglentri) }}</div>
            </div>
          </div>




          <app-input-simrs-mode view v-model="item.hasilhtml" :disable="true" class="col-12 q-mb-md" />
          <!-- <app-input-simrs-mode view v-model="item.kesimpulanhtml" :disable="true" class="col-12 q-mb-md" /> -->

        </div>




        <!-- <BottomTtd :pasien="props.pasien" /> -->

        <div class="row q-pa-sm justify-between items-center">
          <div class="kiri text-center">
            .
          </div>
          <div class="kanan text-center">
            <!-- <div><b>Probolinggo, {{ humanDate(item?.tgl) }}</b></div> -->
            <!-- INI DISURUH UBAH SAMA MBAK ANE (DISURUH MANAGEMENT) -->
            <div><b>Probolinggo, {{ humanDate(item?.rs3) }}</b></div>
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


const qrUrl = computed(() => {
  const noreg = props?.item?.rs2 // noreg
  const dok = 'RADIOLOGI.png'
  const asal = 'RADIOLOGI'
  const petugas = props?.item?.kdPelaksana ?? null

  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
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
