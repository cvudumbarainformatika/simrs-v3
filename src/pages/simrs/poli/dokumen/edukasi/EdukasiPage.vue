<template>
  <div class="fit bg-grey-4 q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <my-kop-surat v-if="!history" title1="EDUKASI PASIEN" title2="RAWAT JALAN" />

        <template v-if="!history">
          <div class="flex justify-between">
            <div class="q-py-xs text-left">
              <div class="flex q-gutter-sm ">
                <div style="width: 100px;">Nama Pasien </div>
                <div>: {{ pasien?.nama_panggil }}</div>
              </div>
              <div class="flex q-gutter-sm">
                <div style="width: 100px;">Usia </div>
                <div>: {{ pasien?.usia }}</div>
              </div>
              <div class="flex q-gutter-sm">
                <div style="width: 100px;">No RM </div>
                <div>: {{ pasien?.norm }}</div>
              </div>

            </div>
            <div class="q-py-xs text-left">
              <div class="flex q-gutter-sm ">
                <div style="width: 100px;">Kelamin </div>
                <div>: {{ pasien?.kelamin }}</div>
              </div>
              <div class="flex q-gutter-sm">
                <div style="width: 100px;">Tgl Lahir </div>
                <div>: {{ pasien?.tgllahir }}</div>
              </div>

            </div>


          </div>
          <div class="row no-wrap q-gutter-sm">
            <div style="width: 100px;" class="col-auto">Alamat </div>
            <div class="col">: {{ pasien?.alamat }}</div>
          </div>
        </template>



        <hr>
        <!-- CONTENT -->
        <div v-if="!EDUKASI?.length" class="q-pa-md column full-height flex-center" style="min-height: 400px;">
          <div class="text-weight-bold text-center ">
            BELUM TERSEDIA LAPORAN EDUKASI
          </div>
        </div>
        <div v-else class="full-width">
          <!-- A B -->
          <div class="q-gutter-sm">
            <div class="flex q-gutter-sm text-bold">
              <div>A. ASESMEN KEBUTUHAN EDUKASI</div>
            </div>
            <div class="q-pl-sm text-bold">Data Pasien</div>
            <div class="flex q-gutter-sm">
              <div style="width: 140px;">1. Tingkat Pendidikan</div>
              <div>: {{ pasien?.pendidikan }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width: 140px;">2. Agama</div>
              <div>: {{ pasien?.agama }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width: 140px;">3. Hambatan</div>
              <div>: {{ pasien?.hambatan }}</div>
            </div>



            <div class="flex q-gutter-sm text-bold q-mt-sm">
              <div>B. PERENCANAAN</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width: 120px;">1. Perlu Penerjemah</div>
              <div>: {{ EDUKASIC?.perlupenerjemah }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width: 120px;">2. Bahasa isyarat</div>
              <div>: {{ EDUKASIC?.bahasaisyarat }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div style="width: 120px;">3. Cara Edukasi</div>
              <div>: {{ EDUKASIC?.caraedukasi }}</div>
            </div>
            <div class="flex q-gutter-sm">
              <div>4. Ketersediaan menerima edukasi dan informasi</div>
              <div>: {{ EDUKASIC?.kesediaan }}</div>
            </div>
            <div class="row items-start q-gutter-x-sm no-wrap">
              <div class="col-auto no-wrap">5. Kebutuhan Edukasi : </div>
              <div class="col">
                <div>{{ EDUKASIC?.kebutuhanedukasi }}</div>
              </div>
            </div>
            <div class="kotak f-10 q-pa-sm">
              <div class="text-bold">Catatan : </div>
              <div class="row item-start q-gutter-sm">
                <div class="col-auto">
                  1.
                </div>
                <div class="col">
                  <em>
                    Pemberi edukasi adalah semua petugas rumah sakit yang melayani pasien (dokter, perawat, bidan, ahli
                    gizi, apoteker, fisioterapis, radiografer dan tenaga kesehatan lainnya)
                  </em>
                </div>


              </div>
              <div class="row item-start q-gutter-sm">
                <div class="col-auto">
                  2.
                </div>
                <div class="col">
                  <em>
                    Edukasi diberikan sesuai kebutuhan pasien berdasarkan pengkajian awal pasien dan rencana penanganan
                    pasien (assesmen data pasien diisi oleh perawat/bidan)
                  </em>
                </div>
              </div>
              <div class="row item-start q-gutter-sm">
                <div class="col-auto">
                  3.
                </div>
                <div class="col">
                  <em>
                    Pemberian edukasi dicatat kemudian dibubuhi tanda tangan dan nama jelas pemberi edukasi serta
                    ditandatangani pasien/keluarga
                  </em>
                </div>
              </div>
            </div>



          </div>

          <!-- C -->
          <table border="1" width="100%">
            <thead>
              <tr>
                <th colspan="10">
                  <div class="flex q-gutter-sm text-bold">
                    <div>C. </div>
                    <div>IMPLEMENTASI DAN EVALUASI</div>
                  </div>
                </th>
              </tr>
              <tr>
                <th rowspan="2" class="t-vertical">
                  <div>Hari / Tanggal</div>
                  <div>Jam</div>
                </th>
                <th rowspan="2" class="t-vertical">Metode</th>
                <th rowspan="2">Profesi</th>
                <th rowspan="2">Materi Edukasi dan Informasi</th>
                <th rowspan="2" class="t-vertical">
                  <div>Estimasi</div>
                  <div>Waktu</div>
                </th>
                <th rowspan="2" class="t-vertical">Media</th>
                <th rowspan="2" class="t-vertical">
                  <div>Evaluasi</div>
                  <div>Respon</div>
                </th>
                <th rowspan="2" class="t-vertical">
                  <div>Tingkat</div>
                  <div>Pemahaman</div>
                </th>
                <th colspan="2">
                  <div>Nama & </div>
                  <div>Tanda Tangan </div>
                </th>

              </tr>
              <tr>
                <th>
                  <div>Penerima</div>
                  <div>Edukasi</div>
                </th>
                <th>
                  <div>Pemberi</div>
                  <div>Edukasi</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in EDUKASI" :key="item.id">
                <td class="t-vertical">
                  <div class="text-right">{{ humanDate(item?.tgl) }}</div>
                  <div class="text-right"> jam {{ jamTnpDetik(item?.tgl) }}</div>
                </td>
                <td class="t-vertical">
                  <div v-if="!item?.metode?.length">
                    -
                  </div>
                  <div v-else>
                    <div v-for="metode in item?.metode" :key="metode">
                      <div class="text-right">{{ metode }}, </div>
                    </div>
                  </div>
                </td>
                <td valign="top">
                  <div v-if="item?.petugas?.kdgroupnakes && item?.petugas?.kdgroupnakes !== ''">
                    <div>{{ jenisPPA(item?.petugas?.kdgroupnakes) }}</div>
                  </div>
                </td>
                <td>
                  <div v-if="!item?.materi?.length">
                    -
                  </div>
                  <div v-else>
                    <div v-for="mat in item?.materi" :key="mat">
                      <div class="flex no-wrap">{{ mat }}, </div>
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div v-html="getNewLine(item?.materiLain)" class="text-italic" />
                </td>
                <td class="t-vertical">
                  <div class="text-right">{{ item?.estimasi }}</div>
                </td>
                <td class="t-vertical">
                  <div v-if="!item?.media?.length">
                    -
                  </div>
                  <div v-else>
                    <div v-for="med in item?.media" :key="med">
                      <div class="text-right"> {{ med }}, </div>
                    </div>
                  </div>
                </td>
                <td class="t-vertical">
                  <div class="text-right">{{ item?.evaluasi }}</div>
                </td>
                <td valign="top">{{ item?.tingkatPemahaman || '-' }}</td>
                <td valign="top">

                  <div v-if="item?.ttdPenerima" class="flex-center" style="width: 60px;">

                    <div class="f-8 column flex-center" style="height: 60px;">
                      <img :src="pathImg + item?.ttdPenerima" alt="ttd-penerima" width="60">
                    </div>
                    <div class="f-8 text-wrap text-center">{{ item?.namaPenerima }}</div>
                  </div>
                  <div v-else>
                    -
                  </div>



                </td>
                <td valign="top">

                  <div class="flex-center " style="width: 60px;">
                    <div class="relative-position">
                      <vue-qrcode :value="qrPetugas(item?.petugas)" tag="svg" :options="{
                        errorCorrectionLevel: 'Q',
                        color: {
                          dark: '#000000',
                          light: '#ffffff',
                        },
                        margin: 0
                      }" />
                      <img class="qrcode__image" src="~assets/logos/logo-rsud.png" alt="RSUD DOKTER MOHAMAD SALEH">
                    </div>
                    <div class="f-8 text-wrap text-center">{{ item?.petugas?.nama }}</div>
                  </div>

                </td>
              </tr>
            </tbody>
          </table>
        </div>




      </div>
    </div>

    <!-- Floating Print Button -->
    <q-btn v-if="!history" ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary"
      class="fixed-bottom-right" style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { humanDate, jamTnpDetik } from 'src/modules/formatter'
import { useImplementasiEdukasiRanapStore } from 'src/stores/simrs/ranap/implementasiEdukasi'
import { computed, onMounted, ref, watch } from 'vue'

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
const store = useImplementasiEdukasiRanapStore()
const refPrint = ref()

const loading = ref(false)
const assessments = ref([])
const selectedNota = ref(null)
const form = ref({})
const isOk = computed(() => {
  return props.pasien?.kodepoli === 'PEN001' || route?.path?.includes('kamaroperasi')
})

onMounted(() => {
  if (props.pasien) {
    store.getList(props?.pasien)
    console.log('Mounted with pasien:', props.pasien, 'EDUKASIC:', store.items)
    loadData()
  }
})
function petugas() {
  if (form.value?.user?.nama) return form.value.user.nama
  if (form.value?.user_input) return form.value.user_input

  const keys = Object.keys(props.pasien?.dokter ?? {})
  if (keys.length) return props.pasien?.dokter?.nama ?? props.pasien?.dokter
  else return props.pasien?.dokter ?? '..................................................'
}

function formatKomplikasi(val) {
  if (!val) return '-'
  if (Array.isArray(val)) {
    return val.length > 0 ? val.join(', ') : '-'
  }
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) {
      return parsed.length > 0 ? parsed.join(', ') : '-'
    }
  } catch (e) { }
  return val
}

function updateSelectedAssessment(nota) {
  const found = assessments.value.find(item => item.nota === nota)
  if (found) {
    form.value = { ...found }
  }
}
const getNewLine = (text) => {
  return text?.replace(/\n/g, '<br/>')
}
async function loadData() {
  if (!props.pasien || !props.pasien.noreg) return

  loading.value = true
  try {
    const params = { params: { noreg: props.pasien.noreg } }
    // Gantilah endpoint ini nanti sesuai kebutuhan backend Anda
    const resp = await api.get('/v1/simrs/penunjang/ok/assasement/pra-bedah/ambil-by-noreg', params)
    if (resp.status === 200) {
      console.log('Data dari backend:', resp.data)
      assessments.value = Array.isArray(resp.data) ? resp.data : (resp.data ? [resp.data] : [])

      // Jika data ditemukan, default pilih asesmen pertama
      if (assessments.value.length > 0) {
        selectedNota.value = assessments.value[0].nota
        form.value = { ...assessments.value[0] }
      } else {
        selectedNota.value = null
        form.value = {}
      }
    }
  } catch (err) {
    console.error('Error load data pra-bedah:', err)
  } finally {
    loading.value = false
  }
}
const EDUKASI = computed(() => {
  console.log('props edukasi', store?.items);
  return store.items
})
const EDUKASIC = computed(() => {
  // console.log('props', props?.pasien?.edukasi);
  return props?.pasien?.edukasi?.length ? props?.pasien?.edukasi[0] : null
})

const qrPetugas = (user) => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'KIE.png'
  const asal = isOk.value ? 'PENUNJANG' : 'RANAP'
  const petugas = user?.kdpegsimrs ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
const qrPenerima = (ttd) => {
  console.log('ttd', ttd);
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'KIE.png'
  const asal = isOk.value ? 'PENUNJANG' : 'RANAP'
  const ttdPenerima = ttd ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${ttdPenerima}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
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
watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    loadData()
  }
}, { deep: true, immediate: true })

const qrUrl = computed(() => {
  const noreg = props?.pasien?.noreg
  const dok = 'DOKUMEN PRA-BEDAH.png'
  const asal = 'PENUNJANG'
  const petugas = form.value?.user?.kdpegsimrs ?? form.value?.user_input ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'EDUKASI PASIEN',
  popTitle: 'EDUKASI PASIEN'
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

.kotak {
  border: 1px solid black;
}

.page-legal {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 21.59cm; // lebar kertas Legal
  height: auto;

  .contentx {
    padding: 10mm;
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

table {
  border-collapse: collapse;
}

th,
td {
  padding: 5px;
  border: 1px solid black;
}



.dotted-line {
  border-bottom: 1px dotted black;
  width: 100%;
  min-height: 20px;
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  padding: 20px !important;
  font-size: 12px;
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;
    box-shadow: none;
    margin: 0;

    .contentx {
      padding: 0;
      page-break-after: auto;
    }
  }

  .hide-on-print {
    display: none !important;
  }

  @page {
    margin: 10mm;
  }
}
</style>
