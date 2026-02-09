<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width: 80vw;">
      <q-bar class="bg-primary text-white">
        <div>Cetak Permintaan Darah</div>

        <q-space />

        <q-btn dense flat icon="icon-mat-close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-separator />
      <div id="printMe" class="f-12">
        <q-card-section class="q-pa-none">
          <div class="full-width q-pa-md">
            <div class="headerx full-width relative-position">
              <img src="~assets/images/logo-kota-grey.png" width="50">
              <div class="absolute-top full-width" style="left:0%">
                <div class="column full-width flex-center">
                  <div class="f-14 text-weight-bold">
                    NOTA PERMINTAAN DARAH
                  </div>
                  <div class="f-14 text-weight-bold">
                    RUANGAN RAWAT INAP
                  </div>
                  <div class="f-14 text-weight-bold">
                    RSUD MOHAMAD SALEH
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator style="margin-top: -10px;" />
        <q-card-section class="q-pa-md row q-col-gutter-md">
          <div class="col-6">
            <div class="row q-col-gutter-md full-width">
              <div class="col-auto">
                <div>NO. NOTA</div>
                <div>Tgl. Permintaan</div>
                <div>NOREG</div>
                <div>NORM</div>
                <div>Nama Pasien</div>
                <div>Tanggal Lahir</div>
                <div>Alamat</div>
                <!-- <div>Ruangan</div> -->
              </div>
              <div class="col full-width">
                <div>: {{ item?.rs2 }}</div>
                <div>: {{ item?.rs3 }}</div>
                <div>: {{ item?.rs1 }}</div>
                <div>: {{ pasien?.norm }}</div>
                <div>: {{ pasien?.nama }}</div>
                <div>: {{ pasien?.tgllahir }}</div>
                <div>: {{ pasien?.alamat }}</div>
                <!-- <div>: {{dokters?.find(x => x?.kdpegsimrs === item?.rs10)?.nama}}</div>
                <div>: {{ pasien?.ruangan }}</div> -->
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="row q-col-gutter-md full-width">
              <div class="col-auto">
                <div>Dokter yg Meminta</div>
                <div>Ruang dan Kelas</div>
              </div>
              <div class="col full-width">
                <div>: {{dokters?.find(x => x?.kdpegsimrs === item?.rs10)?.nama}}</div>
                <div>: {{ pasien?.ruangan }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-md ">
          <div class="col-auto">
            <div><b>jenis :</b> <em>{{ item?.rs4 }}</em></div>
            <div><b>Golongan :</b> <em>{{ item?.rs5 ?? '-' }} {{ item?.rs15 }}</em></div>
            <div><b>u/p :</b> <em>{{ item?.rs7 }}</em></div>
            <div><em>Qty :</em> <b>{{ item?.rs6 }}</b> <em>Transfusi Ke -</em> <b>{{ item?.rs13 }}</b></div>
            <div><em>Keterangan :</em> <b>{{ item?.ket ?? '-' }}</b> </div>
          </div>
          <div class="col-1">
          </div>
          <q-separator class="q-my-sm" />
          <div class="row justify-between ">
            <div class="col-auto">
              <div class="column flex-center" style="width:200px; ">
                <!-- <div class="relative-position"> -->
                <div>Petugas / Perawat</div>
                <div style="width: 80px;" class="q-mb-xs">
                  <vue-qrcode :value="qrUrl" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: {
                      dark: '#000000',
                      light: '#ffffff',
                    },
                    margin: 2
                  }" />
                </div>
                <div class="">
                  {{perawats?.find(x => x?.kdpegsimrs === item?.rs17)?.nama}}
                </div>
                <!-- </div> -->
              </div>

            </div>

            <div class="col-auto ">
              <div style="width:200px; " class="column flex-center items-center">
                <div>Petugas / Perawat</div>
                <div style="width: 80px;" class="q-mb-xs">
                  <vue-qrcode :value="qrDokter" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: {
                      dark: '#000000',
                      light: '#ffffff',
                    },
                    margin: 2
                  }" />
                </div>
                <div class="">
                  {{dokters?.find(x => x?.kdpegsimrs === item?.rs10)?.nama}}
                </div>
              </div>
            </div>
          </div>

        </q-card-section>
      </div>
      <q-card-section class="q-pa-none bg-primary text-white">
        <div class="q-pa-md row justify-between items-center">
          <div><q-btn label="Tutup" color="dark" text-color="white" v-close-popup /></div>
          <div>
            <q-btn v-print="printObj" label="Print" color="yellow-3" text-color="dark" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  item: {
    type: Object,
    default: null
  },
  dokters: {
    type: Array,
    default: () => []
  },
  perawats: {
    type: Array,
    default: () => []
  }
})


// console.log('perawat', props.perawats?.find(x => x?.kdpegsimrs === props.item?.rs17));

const qrUrl = computed(() => {

  const noreg = props.pasien?.noreg// noreg
  const dok = 'BANKDARAH.png'
  const asal = 'RAWAT INAP'
  const petugas = props.perawats?.find(x => x?.kdpegsimrs === props.item?.rs17)?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  // return `${noka}`
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

const qrDokter = computed(() => {

  const noreg = props.pasien?.noreg// noreg
  const dok = 'BANKDARAH.png'
  const asal = 'RAWAT INAP'
  const petugas = props.dokters?.find(x => x?.kdpegsimrs === props.item?.rs10)?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  // return `${noka}`
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'CETAK PERMINTAAN DARAH',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}
</script>

<style lang="scss" scoped></style>
