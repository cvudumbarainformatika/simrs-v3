<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal v-if="!history" title1="SURGICAL SAFETY" title2="CHECKLIST" />

        <div v-if="!history" class="biodata-pasien q-my-md">
          <div class="flex justify-between">
            <div class="flex q-gutter-md kiri">
              <div style="width: 58px;" class="text-weight-bold">
                NO. RM
              </div>
              <div style="width: 70px;">
                : {{ pasien?.norm }}
              </div>
              <div class="text-weight-bold">
                NAMA PASIEN
              </div>
              <div>
                : {{ pasien?.nama_panggil }}
              </div>
            </div>
            <div class="flex q-gutter-md kanan">
              <div class="text-weight-bold">
                TGL. LAHIR
              </div>
              <div>
                : {{ dateFullFormat(pasien?.tgllahir) }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="column full-width">
              <div>
                <span class="q-mr-lg text-weight-bold">ALAMAT</span> : {{ pasien?.alamat ?? '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- INFORMASI DIAGNOSA, TINDAKAN, TANGGAL & JAM OPERASI (2 Kolom) -->
        <div v-if="!history" class="biodata-pasien q-my-md">
          <div class="row q-col-gutter-md">
            <!-- Kolom Kiri -->
            <div class="col-6">
              <div class="row no-wrap">
                <div class="text-weight-bold" style="width: 90px;">DIAGNOSA</div>
                <div class="col">: {{ pasien?.rs4 || '-' }}</div>
              </div>
              <div class="row no-wrap q-mt-xs">
                <div class="text-weight-bold" style="width: 90px;">TINDAKAN</div>
                <div class="col">: {{ getTindakanOp(pasien?.manytindakanop) }}</div>
              </div>
            </div>
            <!-- Kolom Kanan -->
            <div class="col-6">
              <div class="row no-wrap">
                <div class="text-weight-bold" style="width: 110px;">TGL OPERASI</div>
                <div class="col">: {{ getTglLaporan(pasien?.laporanop) }}</div>
              </div>
              <div class="row no-wrap q-mt-xs">
                <div class="text-weight-bold" style="width: 110px;">JAM OPERASI</div>
                <div class="col">: {{ getJamLaporan(pasien?.laporanop) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dokumen-content q-mb-md">
          <!-- SIGN IN SECTION -->
          <div class="section-wrapper q-mb-lg">
            <div class="text-weight-bold f-14"
              style="text-decoration: underline; margin-bottom: 10px; background-color: #f5f5f5; padding: 8px;">
              SIGN IN CHECKLIST (SEBELUM INDUKSI)
            </div>
            <div class="section-subtitle f-12 q-mb-sm text-italic">
              Diisi oleh: Instrumen & Anestesi
            </div>

            <div v-if="surgicalSignIn?.length">
              <div v-for="(item, idx) in surgicalSignIn" :key="idx" class="checklist-item q-mb-sm">
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12">
                    <div class="f-12 text-weight-bold q-mb-xs">{{ idx + 1 }}. {{ item?.tanya }}</div>
                    <q-option-group :model-value="item?.jawab" :options="withChecklistIcon(item?.options)"
                      :type="item?.type === 'checkbox' ? 'checkbox' : 'radio'" color="primary" inline dense disable
                      class="q-mb-xs" />
                    <div
                      v-if="item?.adaInput && (Array.isArray(item?.jawab) ? item.jawab.includes('1') : item?.jawab === '1') && item?.input"
                      class="q-mt-xs">
                      <div class="text-italic" style="white-space: pre-line;" v-html="getNewLine(item?.input)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-my-md q-pt-md" style="border-top: 1px solid #ddd;">
              <div class="col-6 text-center">
                <div class="text-weight-bold q-mb-sm">Dokter Anestesi</div>
                <div v-if="surgical?.dokter_anastesi" style="height: 60px; width: 60px; margin: 0 auto;"
                  class="q-mb-sm">
                  <vue-qrcode :value="getNakesNya(surgical?.dokter_anastesi)?.kdpegsimrs || ''" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: { dark: '#000000', light: '#ffffff' },
                    margin: 0
                  }" />
                </div>
                <div class="f-10">{{ getNakesNya(surgical?.dokter_anastesi)?.nama ?? 'Belum dipilih' }}
                </div>
              </div>
              <div class="col-6 text-center">
                <div class="text-weight-bold q-mb-sm">Penata Anestesi</div>
                <div v-if="surgical?.penata_anastesi" style="height: 60px; width: 60px; margin: 0 auto;"
                  class="q-mb-sm">
                  <vue-qrcode :value="getNakesNya(surgical?.penata_anastesi)?.kdpegsimrs || ''" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: { dark: '#000000', light: '#ffffff' },
                    margin: 0
                  }" />
                </div>
                <div class="f-10">{{ getNakesNya(surgical?.penata_anastesi)?.nama ?? 'Belum dipilih' }}
                </div>
              </div>
            </div>
          </div>

          <!-- TIME OUT SECTION -->
          <div class="section-wrapper q-mb-lg">
            <div class="text-weight-bold f-14"
              style="text-decoration: underline; margin-bottom: 10px; background-color: #f5f5f5; padding: 8px;">
              TIME OUT CHECKLIST (SEBELUM INSISI)
            </div>
            <div class="section-subtitle f-12 q-mb-sm text-italic">
              Diisi oleh: Instrumen, Anestesi & Operator
            </div>

            <div v-if="surgicalTimeOut?.length">
              <div v-for="(item, idx) in surgicalTimeOut" :key="idx" class="checklist-item q-mb-sm">
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12">
                    <div class="f-12 text-weight-bold q-mb-xs">{{ idx + 1 }}. {{ item?.tanya }}</div>
                    <q-option-group :model-value="item?.jawab" :options="withChecklistIcon(item?.options)"
                      :type="item?.type === 'checkbox' ? 'checkbox' : 'radio'" color="primary" inline dense disable
                      class="q-mb-xs" />
                    <div
                      v-if="item?.adaInput && (Array.isArray(item?.jawab) ? item.jawab.includes('1') : item?.jawab === '1') && item?.input"
                      class="q-mt-xs">
                      <div class="text-italic" style="white-space: pre-line;" v-html="getNewLine(item?.input)"></div>
                    </div>
                    <div
                      v-if="item?.adaInputArray && (Array.isArray(item?.jawab) ? item.jawab.includes('1') : item?.jawab === '1')"
                      class="q-mt-xs">
                      <div v-for="(sub, subIdx) in item.inputArray" :key="subIdx" class="row q-col-gutter-md q-mb-xs">
                        <div class="col-3 f-11">{{ sub?.label }}</div>
                        <div class="col-9">
                          <div class="text-italic" style="white-space: pre-line;" v-html="getNewLine(sub?.input)"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-my-md q-pt-md" style="border-top: 1px solid #ddd;">
              <div class="col-6 text-center">
                <div class="text-weight-bold q-mb-sm">Dokter Operator</div>
                <div v-if="surgical?.dokter_operator" style="height: 60px; width: 60px; margin: 0 auto;"
                  class="q-mb-sm">
                  <vue-qrcode :value="getNakesNya(surgical?.dokter_operator)?.kdpegsimrs || ''" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: { dark: '#000000', light: '#ffffff' },
                    margin: 0
                  }" />
                </div>
                <div class="f-10">{{ getNakesNya(surgical?.dokter_operator)?.nama ?? 'Belum dipilih' }}
                </div>
              </div>
              <div class="col-6 text-center">
                <div class="text-weight-bold q-mb-sm">Perawat Instrumen</div>
                <div v-if="surgical?.perawat_instrumen" style="height: 60px; width: 60px; margin: 0 auto;"
                  class="q-mb-sm">
                  <vue-qrcode :value="getNakesNya(surgical?.perawat_instrumen)?.kdpegsimrs || ''" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: { dark: '#000000', light: '#ffffff' },
                    margin: 0
                  }" />
                </div>
                <div class="f-10">{{ getNakesNya(surgical?.perawat_instrumen)?.nama ?? 'Belum dipilih'
                  }}</div>
              </div>
            </div>
          </div>

          <!-- SIGN OUT SECTION -->
          <div class="section-wrapper q-mb-lg">
            <div class="text-weight-bold f-14"
              style="text-decoration: underline; margin-bottom: 10px; background-color: #f5f5f5; padding: 8px;">
              SIGN OUT CHECKLIST (SEBELUM KELUAR OK)
            </div>
            <div class="section-subtitle f-12 q-mb-sm text-italic">
              Diisi oleh: Instrumen, Anestesi & Operator
            </div>

            <div v-if="surgicalSignOut?.length">
              <div v-for="(item, idx) in surgicalSignOut" :key="idx" class="checklist-item q-mb-sm">
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12">
                    <div class="f-12 text-weight-bold q-mb-xs">{{ idx + 1 }}. {{ item?.tanya }}</div>
                    <q-option-group :model-value="item?.jawab" :options="withChecklistIcon(item?.options)"
                      :type="item?.type === 'checkbox' ? 'checkbox' : 'radio'" color="primary" inline dense disable
                      class="q-mb-xs" />
                    <div
                      v-if="item?.adaInput && (Array.isArray(item?.jawab) ? item.jawab.includes('1') : item?.jawab === '1') && item?.input"
                      class="q-mt-xs">
                      <div class="text-italic" style="white-space: pre-line;" v-html="getNewLine(item?.input)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-my-md q-pt-md" style="border-top: 1px solid #ddd;">
              <div class="col-12 text-center">
                <div class="text-weight-bold q-mb-sm">Perawat Sirkuler</div>
                <div v-if="surgical?.perawat_sirkuler" style="height: 60px; width: 60px; margin: 0 auto;"
                  class="q-mb-sm">
                  <vue-qrcode :value="getNakesNya(surgical?.perawat_sirkuler)?.kdpegsimrs || ''" tag="svg" :options="{
                    errorCorrectionLevel: 'Q',
                    color: { dark: '#000000', light: '#ffffff' },
                    margin: 0
                  }" />
                </div>
                <div class="f-10">{{ getNakesNya(surgical?.perawat_sirkuler)?.nama ?? 'Belum dipilih' }}
                </div>
              </div>
            </div>
          </div>

          <!-- IMPLANT SECTION -->
          <div class="section-wrapper q-mb-lg">
            <div class="text-weight-bold f-14"
              style="text-decoration: underline; margin-bottom: 10px; background-color: #f5f5f5; padding: 8px;">
              PEMAKAIAN IMPLANT
            </div>

            <div v-if="groupedImplants?.length">
              <div v-for="group in groupedImplants" :key="group.nota" class="q-mb-md">
                <div class="text-weight-bold f-12 q-mb-sm">Nota: {{ group.nota }}</div>
                <table class="implant-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Implant</th>
                      <th>Seri</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in group.items" :key="`${group.nota}-${idx}`">
                      <td class="text-center">{{ idx + 1 }}</td>
                      <td>{{ getImplantName(item) }}</td>
                      <td>{{ item?.seri || item?.rs3 }}</td>
                      <td class="text-center">{{ item?.pemakaian ?? (item?.rs4 ?? 0) }}</td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="group.images?.length" class="q-mt-sm">
                  <div class="text-weight-bold f-12 q-mb-xs">Gambar Implant untuk Nota {{ group.nota }}</div>
                  <div class="row q-col-gutter-sm">
                    <div v-for="(image, imgIdx) in group.images" :key="`${group.nota}-${imgIdx}`" class="col-auto">
                      <q-card flat bordered class="q-pa-sm" style="max-width: 180px;">
                        <q-card-section class="q-pa-none">
                          <template v-if="!isPdfFile(image?.url)">
                            <img :src="getImplantImage(image?.url)" :alt="image?.url?.split('/')?.pop()"
                              style="display: block; max-width: 180px; max-height: 120px; width: auto; height: auto;" />
                          </template>
                          <div v-else class="text-center q-pa-sm" style="min-width: 180px; min-height: 120px;">
                            PDF File<br />{{ image?.url?.split('/')?.pop() }}
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-grey f-12 q-py-md">
              Tidak ada data implant
            </div>
          </div>

          <!-- KASA SECTION -->
          <div class="section-wrapper q-mb-lg">
            <div class="text-weight-bold f-14"
              style="text-decoration: underline; margin-bottom: 10px; background-color: #f5f5f5; padding: 8px;">
              INVENTARIS KASA
            </div>

            <table v-if="inventarisKasa?.length" class="kasa-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kasa</th>
                  <th>Sebelum</th>
                  <th>Dipakai</th>
                  <th>Hilang</th>
                  <th>Sesudah</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in inventarisKasa" :key="idx">
                  <td class="text-center">{{ idx + 1 }}</td>
                  <td>{{ item?.masterkasa?.rs1 ?? item?.nama ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs3 ?? item?.awal ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs4 ?? item?.pakai ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs5 ?? item?.sisa ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs6 ?? item?.akhir ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center text-grey f-12 q-py-md">
              Tidak ada data kasa
            </div>
          </div>

          <!-- INSTRUMEN SECTION -->
          <div class="section-wrapper q-mb-lg">
            <div class="text-weight-bold f-14"
              style="text-decoration: underline; margin-bottom: 10px; background-color: #f5f5f5; padding: 8px;">
              INVENTARIS INSTRUMEN
            </div>

            <table v-if="inventarisInstrumen?.length" class="instrumen-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Instrumen</th>
                  <th>Sebelum</th>
                  <th>Dipakai</th>
                  <th>Hilang</th>
                  <th>Sesudah</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in inventarisInstrumen" :key="idx">
                  <td class="text-center">{{ idx + 1 }}</td>
                  <td>{{ item?.masterinstrumen?.rs1 ?? item?.nama ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs3 ?? item?.awal ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs4 ?? item?.pakai ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs5 ?? item?.sisa ?? '-' }}</td>
                  <td class="text-center">{{ item?.rs6 ?? item?.akhir ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center text-grey f-12 q-py-md">
              Tidak ada data instrumen
            </div>
          </div>
        </div>

        <!-- CATATAN SECTION -->
        <!-- <div v-if="!history" class="q-my-sm">
          <div class="text-weight-bold f-14" style="margin-bottom: 5px;">
            CATATAN / OBSERVASI
          </div>
          <q-input v-model="store.form.catatan" type="textarea" outlined standout="bg-yellow-3" rows="3" class="q-mb-xs"
            readonly dense />
        </div> -->
      </div>
    </div>

    <q-btn v-if="!history" ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary"
      class="fixed-bottom-right" style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
// import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
import { pathImg } from 'src/boot/axios'
import { dateFullFormat, formatJam, getNewLine } from 'src/modules/formatter'
import { useSurgicalSafetyStore } from 'src/stores/simrs/kamaroperasi/surgicalSafety'
import { onMounted, ref, computed } from 'vue'

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

const store = useSurgicalSafetyStore()
const refPrint = ref()

const surgical = computed(() => {
  return props.pasien?.surgical?.find(x => x.nota === props.pasien?.rs2) ?? null
})

const surgicalSignIn = computed(() => {
  const value = surgical.value?.signIn
  if (!value) return []
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (e) {
      return []
    }
  }
  return value
})

const surgicalTimeOut = computed(() => {
  const value = surgical.value?.timeOut
  if (!value) return []
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (e) {
      return []
    }
  }
  return value
})

const surgicalSignOut = computed(() => {
  const value = surgical.value?.signOut
  if (!value) return []
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (e) {
      return []
    }
  }
  return value
})

const implantNotes = computed(() => {
  const implants = store.pasien?.implant ?? props.pasien?.implant ?? []
  return [...new Set(implants.filter(item => item?.nota !== undefined && item?.nota !== null).map(item => String(item.nota)))]
})

const groupedImplants = computed(() => {
  const implants = store.pasien?.implant ?? props.pasien?.implant ?? []
  const series = store.pasien?.implant_seri ?? props.pasien?.implant_seri ?? []
  return implantNotes.value.map(nota => ({
    nota,
    items: implants.filter(item => String(item?.nota) === nota),
    images: series.filter(file => String(file?.nota) === nota)
  }))
})

const inventarisKasa = computed(() => {
  return props.pasien?.inventaris_kasa ?? store.pasien?.inventaris_kasa ?? []
})

const inventarisInstrumen = computed(() => {
  return props.pasien?.inventaris_instrumen ?? store.pasien?.inventaris_instrumen ?? []
})

function getImplantUrl (file) {
  if (!file) return ''
  const value = typeof file === 'string' ? file : file?.url || file?.path || ''
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/storage/')) {
    return process.env.PATHIMG + value
  }
  if (value.startsWith('storage/')) {
    return pathImg + value.replace(/^storage\//, '')
  }
  return pathImg + value
}

function getImplantImage (file) {
  const url = getImplantUrl(file)
  if (!url) return ''
  return url
}

function isPdfFile (file) {
  const value = typeof file === 'string' ? file : file?.url || file?.path || ''
  if (!value) return false
  return value.split('.').pop()?.toLowerCase() === 'pdf'
}

function getImplantName (item) {
  const distribusiId = item?.persiapan_operasi_distribusi_id ?? item?.distribusi_id
  const master = store.implants?.find(i => i?.distribusi_id === distribusiId)
  return master?.masterimplant?.rs1
    || master?.nama_obat
    || item?.masterimplant?.rs1
    || item?.nama_obat
    || '-'
}

function getNakesNya (kdpegsimrs) {
  return store.nakes?.find(i => i.kdpegsimrs === kdpegsimrs)
}

function withChecklistIcon (options) {
  if (!Array.isArray(options)) return options
  return options.map(option => ({
    ...option,
    checkedIcon: 'check_circle',
    uncheckedIcon: 'radio_button_unchecked'
  }))
}

function formatRupiah (value) {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

function generateQRUrl (noreg, dokumen, petugas, asal) {
  const enc = btoa(`${noreg}|${dokumen}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}

function getTindakanOp (val) {
  if (!val || !val.length) return '-'
  const list = val.map(x => x?.mastertindakanoperasi?.rs2 || x?.nama).filter(Boolean)
  return list.length > 0 ? list.join(', ') : '-'
}

function getTglLaporan (lap) {
  if (!lap) return '-'
  const obj = Array.isArray(lap) ? (lap.length > 0 ? lap[0] : null) : lap
  if (!obj || (!obj.rs3 && !obj.rs10)) return '-'
  return obj.rs10 ? dateFullFormat(obj.rs10) : dateFullFormat(obj.rs3)
}

function getJamLaporan (lap) {
  if (!lap) return '-'
  const obj = Array.isArray(lap) ? (lap.length > 0 ? lap[0] : null) : lap
  if (!obj || (!obj.rs3 && !obj.rs11)) return '-'
  return obj.rs11 ? obj.rs11 : formatJam(obj.rs3)
}

onMounted(async () => {
  await store.getNakes()
  store.pasien = props.pasien
  store.setForm('noreg', props?.pasien?.noreg)
  await store.getImplants()
  await store.ambilMasterkasa()
})

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'SURGICAL SAFETY CHECKLIST',
  popTitle: 'SURGICAL SAFETY CHECKLIST'
}
</script>

<style lang="scss" scoped>
.page-legal {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 21.59cm;

  .contentx {
    padding: 5mm;
  }
}

.biodata-pasien {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.section-wrapper {
  border-left: 3px solid #1976d2;
  padding-left: 12px;
}

.section-subtitle {
  color: #666;
  margin-left: 10px;
}

.checklist-item {
  padding: 6px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.badge-yes {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.badge-no {
  display: inline-block;
  background-color: #f44336;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.badge-neutral {
  display: inline-block;
  background-color: #9e9e9e;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.f-10 {
  font-size: 10px;
}

.f-11 {
  font-size: 11px;
}

.f-12 {
  font-size: 12px;
}

.f-14 {
  font-size: 14px;
}

.text-weight-bold {
  font-weight: bold;
}

table {
  width: 100%;

  td {
    vertical-align: top;
  }
}

.implant-table,
.kasa-table,
.instrumen-table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 11px;

  thead {
    background-color: #f0f0f0;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 6px;
    text-align: left;
  }

  th {
    font-weight: bold;
    background-color: #e8e8e8;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f0f0f0;
  }
}

.text-grey {
  color: #999;
}

.dotted-line {
  border-bottom: 1px dotted black;
  width: 100%;
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;

    .contentx {
      padding: 5mm;
    }
  }

  .hide-on-print {
    display: none;
  }

  @page {
    margin: 10mm;
  }
}
</style>
