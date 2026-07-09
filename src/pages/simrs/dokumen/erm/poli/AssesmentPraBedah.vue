<template>
  <div class="fit bg-grey-4 q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <my-kop-surat v-if="!history" title1="ASSESMEN" title2="PRA - BEDAH" />

        <!-- Dropdown Nota Pilihan (Hanya muncul di preview layar jika ada > 1 data asesmen) -->
        <div v-if="!history && assessments?.length > 1" class="row items-center q-mb-md hide-on-print">
          <div class="col-auto text-weight-bold q-mr-sm">Pilih Nota Operasi:</div>
          <div class="col-3">
            <q-select v-model="selectedNota" :options="assessments" option-value="nota" option-label="nota" emit-value
              map-options dense outlined @update:model-value="updateSelectedAssessment" />
          </div>
        </div>

        <div v-if="!history" class="biodata-pasien q-my-md">
          <div class="flex justify-between">
            <div class="flex q-gutter-md kiri">
              <div style="width: 58px;" class="text-weight-bold">
                NO. RM
              </div>
              <div style="width: 70px;">
                : {{ pasien.norm }}
              </div>
              <div class="text-weight-bold">
                NAMA PASIEN
              </div>
              <div>
                : {{ pasien.nama_panggil }}
              </div>
            </div>
            <div class="flex q-gutter-md kanan">
              <div class="text-weight-bold">
                TGL. LAHIR
              </div>
              <div>
                : {{ pasien.tgllahir }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="column full-width">
              <div>
                <span class="q-mr-lg text-weight-bold">ALAMAT</span> : {{ pasien.alamat ?? '-' }}
              </div>
              <div class="flex justify-between full-width">
                <div class="flex">
                  <div style="width:72px;" class="text-weight-bold">
                    J.Kelamin
                  </div>
                  <div> : {{ pasien.kelamin }}</div>
                </div>
                <div class="text-right justify-end">
                  <span class="text-weight-bold">Petugas : </span> {{ petugas() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="diisi-dokter q-mb-md">
          <div v-if="!history">
            <b>Diisi oleh Petugas</b>
          </div>

          <!-- Section 1: Kajian Kedokteran & Riwayat -->
          <div class="text-weight-bold f-14 q-mt-md q-mb-sm" style="text-decoration: underline;">
            KAJIAN KEDOKTERAN & RIWAYAT
          </div>

          <div class="q-my-sm">
            <div class="row q-col-gutter-xs">
              <div class="col-12">
                <span class="text-weight-bold">Riwayat Penyakit Dahulu :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.riwayat_penyakit ? 'dotted-line' : ''">
                  {{ form?.riwayat_penyakit ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Riwayat Operasi :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.riwayat_operasi ? 'dotted-line' : ''">
                  {{ form?.riwayat_operasi ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Riwayat Pengobatan :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.riwayat_pengobatan ? 'dotted-line' : ''">
                  {{ form?.riwayat_pengobatan ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Alergi Obat dan Makanan :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.alergi ? 'dotted-line' : ''">
                  {{ form?.alergi ?? '.' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Pemeriksaan Fisik General & Spesifik -->
          <div class="text-weight-bold f-14 q-mt-lg q-mb-sm" style="text-decoration: underline;">
            PEMERIKSAAN FISIK
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-auto flex">
              <div>Tinggi : </div>
              <div> {{ pasien?.pemeriksaanfisik?.length ? pasien?.pemeriksaanfisik[0]?.tinggibadan : '..........' }} cm
              </div>
            </div>
            <div class="col-auto flex">
              <div>Berat : </div>
              <div> {{ pasien?.pemeriksaanfisik?.length ? pasien?.pemeriksaanfisik[0]?.beratbadan : '..........' }} kg
              </div>
            </div>
            <div class="col-auto flex">
              <div>Tekanan Darah : </div>
              <div> {{ pasien?.pemeriksaanfisik?.length ? pasien?.pemeriksaanfisik[0]?.sistole + '/' +
                pasien?.pemeriksaanfisik[0]?.diastole : '..........' }}</div>
            </div>
            <div class="col-auto flex">
              <div>Nadi : </div>
              <div> {{ pasien?.pemeriksaanfisik?.length ? pasien?.pemeriksaanfisik[0]?.rs4 : '..........' }}</div>
            </div>
            <div class="col-auto flex">
              <div>Suhu : </div>
              <div> {{ pasien?.pemeriksaanfisik?.length ? pasien?.pemeriksaanfisik[0]?.suhutubuh : '..........' }}
                <span>&#8451;</span>C
              </div>
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <table class="pemeriksaan-tabel">
                <tr>
                  <td style="width: 150px;" class="text-weight-bold">Kepala & Leher</td>
                  <td>: {{ form?.kepala_leher ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Mulut & Gigi</td>
                  <td>: {{ form?.mulut_gigi ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Kardiovaskuler</td>
                  <td>: {{ form?.kardiovaskuler ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Genito Urinaria</td>
                  <td>: {{ form?.genito_urinaria ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
              </table>
            </div>
            <div class="col-6">
              <table class="pemeriksaan-tabel">
                <tr>
                  <td style="width: 150px;" class="text-weight-bold">Abdomen</td>
                  <td>: {{ form?.abdomen ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Alat Reproduksi</td>
                  <td>: {{ form?.alat_reproduksi ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Thorax</td>
                  <td>: {{ form?.thorax ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
                <tr>
                  <td class="text-weight-bold">Muskuloskeletal</td>
                  <td>: {{ form?.muskuloskeletal ?? 'Tidak Ada Kelainan' }}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Section 3: Hasil Penunjang & Diagnosa -->
          <div class="text-weight-bold f-14 q-mt-lg q-mb-sm" style="text-decoration: underline;">
            HASIL PENUNJANG & DIAGNOSA
          </div>

          <div class="q-my-sm">
            <div class="row q-col-gutter-xs">
              <div class="col-12">
                <span class="text-weight-bold">Komplikasi :</span>
                <div class="q-pl-sm q-py-xs" :class="!formatKomplikasi(form?.komplikasi) ? 'dotted-line' : ''">
                  {{ formatKomplikasi(form?.komplikasi) ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Hasil Laboratorium :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.hasil_lab ? 'dotted-line' : ''">
                  {{ form?.hasil_lab ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Hasil Pemeriksaan Penunjang Lain :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.hasil_pen_lain ? 'dotted-line' : ''">
                  {{ form?.hasil_pen_lain ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Diagnosa Pre Operasi :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.diagnosa_pre_op ? 'dotted-line' : ''">
                  {{ form?.diagnosa_pre_op ?? '.' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Perencanaan & Tindakan -->
          <div class="text-weight-bold f-14 q-mt-lg q-mb-sm" style="text-decoration: underline;">
            PERENCANAAN & TINDAKAN
          </div>

          <div class="q-my-sm">
            <div class="row q-col-gutter-xs">
              <div class="col-12">
                <span class="text-weight-bold">Rencana Tindakan Bedah/Operasi :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.rencana_tindakan_bedah ? 'dotted-line' : ''">
                  {{ form?.rencana_tindakan_bedah ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Rencana Pemasangan Implan :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.rencana_pasang_implan ? 'dotted-line' : ''">
                  {{ form?.rencana_pasang_implan ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Rencana Pasca Bedah :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.rencana_pasca_bedah ? 'dotted-line' : ''">
                  {{ form?.rencana_pasca_bedah ?? '.' }}
                </div>
              </div>
              <div class="col-12 q-mt-sm">
                <span class="text-weight-bold">Catatan Khusus Dokter :</span>
                <div class="q-pl-sm q-py-xs" :class="!form?.catatan_khusus_dokter ? 'dotted-line' : ''">
                  {{ form?.catatan_khusus_dokter ?? '.' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Signature / QR Section -->
          <div v-if="!history" class="q-my-lg row justify-end">
            <div class="col-auto text-center" style="min-width: 200px;">
              <div class="f-12 q-mb-xs">
                Petugas
              </div>

              <div style="height: 120px;" class="flex flex-center">
                <figure v-if="form?.id" class="qrcode" style="width: 100px; height: 100px; margin: 0 auto;">
                  <vue-qrcode :value="qrUrl" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: {
                      dark: '#000000',
                      light: '#ffffff',
                    },
                    margin: 2
                  }" />
                </figure>
                <div v-else class="text-grey-5 text-italic">
                  Belum Ditandatangani
                </div>
              </div>
              <div class="text-weight-bold">({{ petugas() }})</div>
            </div>
          </div>

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

const refPrint = ref()

const loading = ref(false)
const assessments = ref([])
const selectedNota = ref(null)
const form = ref({})

function petugas () {
  if (form.value?.user?.nama) return form.value.user.nama
  if (form.value?.user_input) return form.value.user_input

  const keys = Object.keys(props.pasien?.dokter ?? {})
  if (keys.length) return props.pasien?.dokter?.nama ?? props.pasien?.dokter
  else return props.pasien?.dokter ?? '..................................................'
}

function formatKomplikasi (val) {
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

function updateSelectedAssessment (nota) {
  const found = assessments.value.find(item => item.nota === nota)
  if (found) {
    form.value = { ...found }
  }
}

async function loadData () {
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

onMounted(() => {
  if (props.pasien) {
    loadData()
  }
})

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
  previewTitle: 'PRA-BEDAH',
  popTitle: 'PRA-BEDAH'
}
</script>

<style lang="scss" scoped>
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
  width: 100%;

  td {
    vertical-align: top;
    padding: 3px 0;
  }
}

.pemeriksaan-tabel {
  td {
    padding: 6px 0;
  }
}

.dotted-line {
  border-bottom: 1px dotted black;
  width: 100%;
  min-height: 20px;
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;
    box-shadow: none;
    margin: 0;

    .contentx {
      padding: 0;
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
