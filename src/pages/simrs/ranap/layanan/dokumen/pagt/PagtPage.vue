<template>
  <div id="pdfDoc" class="bg-white print-page">
    <div v-if="store?.items.length" class="page-1">
      <!-- KOP SURAT -->
      <div class="col-grow kotak">
        <div class="row items-center">

          <div class="col-9 sisi-kanan">
            <div class="row q-pa-sm">
              <div class="col-auto">
                <img src="~assets/images/logo-rsud.png" width="80">
              </div>
              <div class="col flex-wrap q-px-lg">
                <div class="text-center">
                  <div class="text-weight-bold f-12">
                    {{ dataHeader[0] }}
                  </div>
                  <div class="text-weight-bold f-10">
                    {{ dataHeader[1] }}
                  </div>
                  <div class="text-weight-bold f-16">
                    {{ dataHeader[2] }}
                  </div>
                  <div class="f-10">
                    <div>{{ dataHeader[3] }}</div>
                    <div>{{ dataHeader[4] }}</div>
                    <div>{{ dataHeader[5] }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-3 f-14">
            <div class="text-center text-bold">
              {{ menu?.title }}
            </div>
            <div class="text-center text-bold">
              {{ menu?.desc }}
            </div>
            <div class="text-center text-bold">
              RAWAT INAP
            </div>
            <!-- <div class="text-center text-bold">
              {{ kasus?.uraian.toUpperCase() }}
            </div> -->
          </div>
        </div>
      </div>
      <div class="contentx kotak q-mt-xs">
        <div class="full-width flex justify-between q-pa-sm">

          <!-- BIO -->
          <div class="kiri">
            <div class="flex q-gutter-sm">
              <div style="width:80px">Nomor RM </div>
              <div> : {{ pasien?.norm }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width:80px">Nama Pasien </div>
              <div> : {{ pasien?.nama_panggil }}</div>
            </div>
          </div>
          <div class="kanan text-right justify-end">
            <div class="flex q-gutter-sm">
              <div style="width:120px;">Tgl Pengisian </div>
              <div> : {{ humanDate(store?.items[0]?.created_at) }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width:120px;">Jam Pengisian </div>
              <div> : {{ jamTnpDetik(store?.items[0]?.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- ISI -->
        <div style="border-top: black 1px solid;" class="q-pa-md">

          <div class="row q-col-gutter-md">
            <div class="col-auto text-weight-bold">1. </div>
            <div class="col full-width column">
              <div class="text-weight-bold">ASSESMEN</div>


              <div class="row q-col-gutter-md">
                <div class="col-auto text-weight-bold">A .</div>
                <div class="col full-width column">
                  <div>ANTROPOMETRI</div>
                  <div>{{ store?.items[0]?.status_gizi }}</div>
                </div>
              </div>


              <q-separator class="q-my-sm"></q-separator>
              <div class="row q-col-gutter-md">
                <div class="col-auto text-weight-bold">B .</div>
                <div class="col full-width column">
                  <div>BIOKIMIA</div>
                  <div>
                    <q-radio disable v-model="store.items[0].biokima" v-for="dd in store.normals" :key="dd" :label="dd"
                      :val="dd" size="xs" checked-icon="icon-mat-done" />
                  </div>
                  <div>{{ store?.items[0]?.biokimia_ket }}</div>
                </div>
              </div>

              <q-separator class="q-my-sm"></q-separator>
              <div class="row q-col-gutter-md">
                <div class="col-auto text-weight-bold">C .</div>
                <div class="col full-width column">
                  <div>KLINIK / FISIK</div>
                  <div>
                    <q-radio disable v-model="store.items[0].klinis" v-for="dd in store.normals" :key="dd" :label="dd"
                      :val="dd" size="xs" />
                  </div>
                  <div>{{ store?.items[0]?.klinis_ket }}</div>
                </div>
              </div>


              <q-separator class="q-my-sm"></q-separator>
              <div class="row q-col-gutter-md">
                <div class="col-auto text-weight-bold">D .</div>
                <div class="col full-width column">
                  <div>RIWAYAT GIZI</div>
                  <div>DAHULU</div>
                  <div class="flex q-gutter-md items-center q-pa-none q-ml-lg" style="margin-top:-20px;">
                    <div>ALERGI MAKANAN</div>
                    <div>
                      <q-radio disable v-model="store.items[0].alergi_makanan" v-for="dd in store.yaTidaks" :key="dd"
                        :label="dd" :val="dd" size="xs" />
                    </div>
                    <div class="text-weight-italic">
                      {{ store?.items[0]?.alergi_makanan_ket }}
                    </div>
                  </div>
                  <div class="flex q-gutter-md items-center q-pa-none q-ml-lg" style="margin-top:-25px;">
                    <div>POLA MAKAN TERATUR (3 x SEHARI)</div>
                    <div>
                      <q-radio disable v-model="store.items[0].pola_makan" v-for="dd in store.yaTidaks" :key="dd"
                        :label="dd" :val="dd" size="xs" />
                    </div>
                    <div class="text-weight-italic">
                      {{ store?.items[0]?.pola_makan_ket }}
                    </div>
                  </div>
                  <div class="flex q-gutter-md items-center q-pa-none q-ml-lg" style="margin-top:-25px;">
                    <div>LAIN-LAIN, SEBUTKAN</div>

                    <div class="text-weight-italic">
                      {{ store?.items[0]?.lain_lain || '.............' }}
                    </div>
                  </div>

                  <q-separator class="q-my-sm"></q-separator>
                  <div>SEKARANG</div>

                  <div class="flex q-gutter-md items-center q-pa-none q-ml-lg" style="margin-top:-20px;">
                    <div>NAFSU MAKAN BAIK</div>
                    <div>
                      <q-radio disable v-model="store.items[0].nafsu_makan" v-for="dd in store.yaTidaks" :key="dd"
                        :label="dd" :val="dd" size="xs" />
                    </div>
                    <div class="text-weight-italic">
                      {{ store?.items[0]?.nafsu_makan_ket }}
                    </div>
                  </div>
                  <div class="flex q-gutter-md items-center q-pa-none q-ml-lg" style="margin-top:-20px;">
                    <div>SULIT MENELAN</div>
                    <div>
                      <q-radio disable v-model="store.items[0].sulit_nelan" v-for="dd in store.yaTidaks" :key="dd"
                        :label="dd" :val="dd" size="xs" />
                    </div>
                    <div class="text-weight-italic">
                      {{ store?.items[0]?.sulit_nelan_ket }}
                    </div>
                  </div>
                  <div class="flex q-gutter-md items-center q-pa-none q-ml-lg" style="margin-top:-20px;">
                    <div>SULIT MENGUNYAH</div>
                    <div>
                      <q-radio disable v-model="store.items[0].sulit_ngunyah" v-for="dd in store.yaTidaks" :key="dd"
                        :label="dd" :val="dd" size="xs" />
                    </div>
                    <div class="text-weight-italic">
                      {{ store?.items[0]?.sulit_ngunyah_ket }}
                    </div>
                  </div>
                  <div class="flex q-gutter-md items-center q-pa-none q-ml-lg" style="margin-top:-20px;">
                    <div>MUAL</div>
                    <div>
                      <q-radio disable v-model="store.items[0].mual" v-for="dd in store.yaTidaks" :key="dd" :label="dd"
                        :val="dd" size="xs" />
                    </div>
                    <div class="text-weight-italic">
                      {{ store?.items[0]?.mual_ket }}
                    </div>
                  </div>


                </div>

              </div>


              <q-separator class="q-my-sm"></q-separator>
              <div class="row q-col-gutter-md">
                <div class="col-auto text-weight-bold">E .</div>
                <div class="col full-width column">
                  <div>RIWAYAT PERSONAL</div>
                  <div>RIWAYAT PENYAKIT DAHULU</div>
                  <div>
                    <q-checkbox disable v-model="store.items[0].rw_peny_dhl" v-for="dd in store.riwayats" :key="dd"
                      :label="dd" :val="dd" size="xs" />
                  </div>
                  <div>LAIN-LAIN, SEBUTKAN : {{ store?.items[0]?.rw_peny_dhl_ket }}</div>


                  <q-separator class="q-my-sm"></q-separator>
                  <div>RIWAYAT PENYAKIT SEKARANG</div>
                  <div>{{ store?.items[0]?.rw_peny_skr }}</div>
                </div>
              </div>


            </div>

          </div>


        </div>

        <div style="border-top: black 1px solid;" class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-auto text-weight-bold">2. </div>
            <div class="col full-width column">
              <div class="text-weight-bold">DIAGNOSA GIZI</div>
              <div v-for="AA in pasien?.diagnosagizi" :key="AA?.id" class="row q-col-gutter-md"
                style="margin-bottom: 10px !important; line-height: 8px;">
                <div class="col full-width column">
                  <div class="flex q-gutter-sm">
                    <div>{{ AA?.kode }}</div>
                    <div> - {{ AA?.nama }}
                    </div>
                    <div class="text-primary"> <em>berkaitan dengan</em></div>
                    <div v-for="DIAG in getGroupIntervensi(pasien?.diagnosagizi[0]?.intervensi, 'Etiologi')">
                      {{ DIAG?.masterintervensi?.nama }},
                    </div>
                    <div class="text-primary">ditandai dengan</div>
                    <div v-for="DIAG in getGroupIntervensi(pasien?.diagnosagizi[0]?.intervensi, 'Sign/Symptoms')">
                      {{ DIAG?.masterintervensi?.nama }}
                    </div>
                  </div>


                </div>
              </div>



            </div>
          </div>
        </div>
        <div style="border-top: black 1px solid;" class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-auto text-weight-bold">3. </div>
            <div class="col full-width column">
              <div class="text-weight-bold">INTERVENSI GIZI</div>
              <div class="row q-col-gutter-md">
                <div class="col full-width column">
                  <div v-for="DIAG in getGroupIntervensi(pasien?.diagnosagizi[0]?.intervensi, 'intervensi')">
                    - {{ DIAG?.masterintervensi?.nama }}
                  </div>



                </div>
              </div>

              <div class="row q-col-gutter-xs">
                <div>DIET : </div>
                <div v-for="DIET in getGroupIntervensi(pasien?.diagnosagizi[0]?.intervensi, 'Diet')">
                  {{ DIET?.masterintervensi?.nama }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="border-top: black 1px solid;" class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-auto text-weight-bold">4. </div>
            <div class="col full-width column">
              <div class="text-weight-bold">A. MONITORING</div>
              <div class="row q-col-gutter-md">
                <div class="col full-width column">
                  <div v-for="DIAG in getGroupIntervensi(pasien?.diagnosagizi[0]?.intervensi, 'monitoring')">
                    - {{ DIAG?.masterintervensi?.nama }}
                  </div>



                </div>
              </div>
              <div class="text-weight-bold">B. EVALUASI</div>
              <div class="row q-col-gutter-md">
                <div class="col full-width column">
                  <div v-for="DIAG in getGroupIntervensi(pasien?.diagnosagizi[0]?.intervensi, 'evaluasi')">
                    - {{ DIAG?.masterintervensi?.nama }}
                  </div>



                </div>
              </div>
            </div>
          </div>
        </div>




        <!-- end -->
      </div>

      <div class="row q-pa-lg justify-between items-center">
        <div class="kiri text-center">
          <div><b>Mengetahui DPJP</b></div>
          <div class="q-mb-md">Dokter Penanggung Jawab Pelayanan</div>
          <div class="column flex-center">
            <div style="width: 100px;">
              <vue-qrcode :value="qrDokter" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
            </div>
            <div>
              <b>{{ pasien?.dokter }}</b>
            </div>
          </div>
        </div>


        <div class="kanan text-center">
          <div>TTD / NAMA TERANG</div>
          <div class="q-mb-md">AHLI GIZI / DIETESIEN</div>
          <div class="column flex-center">
            <div style="width: 100px;">
              <vue-qrcode :value="qrPetugas" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
            </div>
            <div>
              <b>{{ store?.items[0]?.petugas?.nama || '-' }}</b>
            </div>
          </div>
        </div>

      </div>

    </div>
    <div v-else>
      <div class="column flex-center" style="height: 500px;">
        <div class="f-20">TIDAK ADA DOKUMEN</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { humanDate, jamTnpDetik, getNewLine } from 'src/modules/formatter.js'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'
import { api } from 'src/boot/axios';
import { useDiagnosaStore } from 'src/stores/simrs/ranap/diagnosa';
import { usePagtStore } from 'src/stores/simrs/ranap/pagt';
// import { pathImg } from 'src/boot/axios'
// import { imageToBase64 } from 'src/modules/imgBase64'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Array,
    default: null
  }
})


const store = usePagtStore()


console.log('props', props.pasien);


const dpjp = ref(null)
const nomor = ref(null)
const diagnosa = ref(null)

const diag = useDiagnosaStore()

const qrDokter = computed(() => {

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'FORM-PAGT.png'
  const asal = 'RANAP'
  const petugas = props?.pasien?.kodedokter ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})
const qrPetugas = computed(() => {

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'FORM-PAGT.png'
  const asal = 'RANAP'
  const petugas = store?.items[0]?.petugas?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})

onBeforeMount(() => {
  // console.log('pasien', props?.pasien);
  Promise.all([store.getData(props?.pasien), getDpjpData()])
  getDiag()
})

const getDpjpData = async () => {
  const res = await api.get(`/v1/pegawai/master/pegawai-by-kdpegsimrs?kdpegsimrs=${props?.pasien?.kddrygmenyatakan}`)
  // console.log('res', res);
  if (res.status === 200) {
    dpjp.value = res.data

  }

}


const getDiag = () => {
  const dx = diag.listDiagnosa
  diagnosa.value = dx?.find(x => x?.kode === props?.pasien?.sebabkematian)?.keterangan ?? props?.pasien?.sebabkematian
}


const getGroupIntervensi = (arr, val) => {
  const dx = arr
  const intervensi = dx?.filter(x => x?.masterintervensi?.group?.toLowerCase() === val?.toLowerCase())
  return intervensi
}

</script>


<style lang="scss" scoped>
.kotak {
  border: 1px solid black;
}

.sisi-kanan {
  border-right: 1px solid black;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.section {
  margin-top: 20px;
}

.section-title {
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.data {
  margin-left: 20px;
}

.data-item {
  margin-bottom: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #000;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
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
</style>
