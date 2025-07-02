<template>
  <q-dialog id="endas" maximized @show="onShow">
    <div class="bg-white batang">
      <div id="printGueeee" class="column items-center bg-white page-x f-12">
        <div class="col no-wrap garis2 text-center">
          <div class="row no-wrap justify-center">
            <div class="q-mr-sm" style="min-width: 1cm;">
              <q-img src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 0.9cm; max-width: 0.9cm" />
            </div>
            <div class="">
              <div class="f-12">
                Instalasi Farmasi
              </div>
              <div class="">
                RSUD dr.Moh Saleh
              </div>
              <div class="f-10">
                (0335) 433478,433119,421118
              </div>
              <div class="f-10 q-mb-xs">
                Fax. (0335) 432702
              </div>
            </div>

            <div class="q-ml-sm text-right">
              <span class="text-weight-bolder f-26">{{ item?.nomor }}</span>
            </div>
          </div>
        </div>
        <div class="garis" />
        <div class="garis" />
        <div class=" q-mt-xs ">
          <span class="text-weight-bolder f-14">{{ item?.noresep }}</span> ({{ item?.sistembayar?.rs2 }}) / {{
            dateFull(item?.tgl_kirim) }}
        </div>
        <div class="f-12">
          {{ item?.norm }} - {{ item?.datapasien?.noka ?? 'tidak ada no BPJs' }} - {{ item?.datapasien?.nama }}
        </div>
        <div class="f-12">
          {{ item?.sep?.rs8 ?? '-' }}
        </div>
        <div class="text-italic f-10">
          {{ item?.datapasien?.usia }}
        </div>
        <div class="text-italic f-10">
          {{ item?.datapasien?.alamat }}
        </div>
        <div class="row ">
          <div class="col-shrink q-mr-xs">
            {{ item?.dokter?.nama }}
          </div>
          <div v-if="item?.poli" class="col-shrink ">
            - {{ item?.poli?.rs2 }}
          </div>
          <div v-if="item?.ruanganranap" class="col-shrink ">
            - {{ item?.ruanganranap?.rs2 }}
          </div>
          <div v-if="item?.kunjunganranap" class="col-shrink">
            <div v-if="!item?.kunjunganranap?.titipan">
              - {{ item?.kunjunganranap?.rs6 }}
            </div>
            <div v-else class="q-ml-xs">
              Dititipkan Di {{ item?.kunjunganranap?.ruangtitipan?.rs2 }} {{ item?.kunjunganranap?.rs6 }}
            </div>
          </div>
        </div>

        <div v-if="item?.diagnosaigd" class="row q-mb-xs">
          <div class="col-shrink q-mr-xs">
            diagnosa IGD :
          </div>
          <div class="col-grow">
            {{ item?.diagnosaigd }}
          </div>
        </div>
        <div v-if="item?.diagnosa" class="row q-mb-xs">
          <div class="col-shrink q-mr-xs">
            diagnosa :
          </div>
          <div class="col-grow">
            {{ item?.diagnosa }}
          </div>
        </div>
        <div class="garis q-mt-xs" />
        <div class="garis" />
        <div v-if="loading"> <app-loading /> </div>
        <div v-else-if="!loading && racikan?.length == 0 && nonRacikan?.length == 0"> <app-no-data /> </div>
        <div v-else>
          disini isinya
        </div>

        <div class="garis q-mt-xs" />
        <div class="garis" />
        <div class="row justify-between  text-weight-bold">
          <div>Subtotal</div>
          <div>{{ formatDouble(subtotal, 2) }}</div>
        </div>
        <div class="garis q-mt-xs" />
        <div class="garis" />
        <div class="row justify-between q-my-sm">
          <div class="ttd-pasien">
            <div>Penerima Resep</div>
          </div>
          <div class="ttd-petugas">
            <div>{{ dateFullFormat(new Date()) }} : {{ formatJam(new Date()) }}</div>
            <div>
              <vue-qrcode :value="qrUrl" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 2
              }" />
            </div>
            <div class="text-center">
              Petugas RS
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { api } from 'src/boot/axios'
import { dateFull, dateFullFormat, formatDouble, formatJam } from 'src/modules/formatter'
import { computed, ref } from 'vue'

const props = defineProps({
  item: { type: Object, default: () => { } }
})


function onShow () {
  console.log('show', props.item)
  getResep()
}
const racikan = ref([])
const nonRacikan = ref([])

const loading = ref(false)
const subtotal = ref(0)


async function getResep () {
  loading.value = true
  const param = { params: { noresep: props.item?.noresep } }
  try {
    const resp = await api.get('v1/simrs/pendaftaran/resep', param)
    console.log('get resep', resp)

  } catch {
    loading.value = false
  }
  finally {
    loading.value = false
  }


}

const qrUrl = computed(() => {
  const noreg = props?.item?.noresep// noresep
  const dok = 'E-RESEP.png'
  const asal = 'E-RESEP'
  const enc = btoa(`${noreg}|${dok}|${asal}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})
</script>
<style lang="scss" scoped>
.fnt-10 {
  font-size: 10px !important;
}

.page-x {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 27.94cm;
  height: fit-content;
  padding: 1mm;
  // font-size: 10px !important;
}

.garis {
  width: 100%;
  border-top: 1px dashed black;
  margin-bottom: 2px;
}

.garis2 {
  width: 90%;
}
</style>
