<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal title1="SKRINING" title2="RAWAT JALAN" />

        <div class="row justify-center f-18 text-weight-bold q-mb-md">
          SKRINING RAWAT JALAN
        </div>

        <div class="dokumen-content">
          <div class="biodata-pasien q-mb-md">
            <div class="row q-col-gutter-sm biodata-row">
              <div class="biodata-item">
                <span class="text-weight-bold">NO. RM</span> : {{ pasien?.norm || '-' }}
              </div>
              <div class="biodata-item">
                <span class="text-weight-bold">NO. REG</span> : {{ pasien?.noreg || '-' }}
              </div>
              <div class="biodata-item full-width q-mt-sm">
                <span class="text-weight-bold">NAMA PASIEN</span> : {{ pasien?.nama_panggil || pasien?.namapasien || '-'
                }}
              </div>
              <div class="biodata-item">
                <span class="text-weight-bold">JENIS KELAMIN</span> : {{ pasien?.kelamin || pasien?.jeniskelamin || '-'
                }}
              </div>
              <div class="biodata-item">
                <span class="text-weight-bold">USIA</span> : {{ pasien?.usia || '-' }}
              </div>
            </div>
          </div>

          <div class="data-list q-mb-md">
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Kesadaran</div>
              <div class="col-8">: {{ displayValue(latestPemeriksaan?.kesadaran) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Pernafasan</div>
              <div class="col-8">: {{ displayValue(latestSkrining?.pernafasan) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Nyeri Dada</div>
              <div class="col-8">: {{ displayValue(latestSkrining?.nyeri_dada) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Penilaian Nyeri</div>
              <div class="col-8">:
                {{ displayValue(latestAnamnesis?.scorenyeri) }}
                <span v-if="latestAnamnesis">({{ nyeriKeterangan(latestAnamnesis?.scorenyeri) }})</span>
              </div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Hambatan Fisik</div>
              <div class="col-8">: {{ yesNoLabel(latestSkrining?.hambatan_fisik) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Kursi Roda</div>
              <div class="col-8">: {{ yesNoLabel(latestSkrining?.hambatan_fisik_kursi_roda) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Hambatan Fisik Lain</div>
              <div class="col-8">: {{ displayValue(latestSkrining?.hambatan_fisik_lain) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Hambatan Bahasa</div>
              <div class="col-8">: {{ yesNoLabel(latestSkrining?.hambatan_bahasa) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Resiko Jatuh</div>
              <div class="col-8">: {{ latestSkrining ? hasilJatuh(latestSkrining) : '-' }}
                <span v-if="detailJatuh(latestSkrining)" class="f-10">({{ detailJatuh(latestSkrining) }})</span>

              </div>
            </div>
            <!-- <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Detail Jatuh</div>
              <div class="col-8">: {{ latestSkrining ? detailJatuh(latestSkrining) : '-' }}</div>
            </div> -->
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Batuk</div>
              <div class="col-8">: {{ displayValue(latestSkrining?.batuk) }}</div>
            </div>
            <div class="data-row row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Keputusan</div>
              <div class="col-8">: {{ displayValue(latestSkrining?.keputusan) }}</div>
            </div>
          </div>

          <div v-if="loading" class="text-center q-py-md text-grey">
            Memuat data skrining...
          </div>

          <div class="signature-block row q-col-gutter-md q-mt-lg justify-end items-center text-center">
            <div class="col-5 text-center">
              <div class="text-weight-bold row justify-center">Petugas</div>
              <div class="qr-signature q-mx-auto q-mt-sm q-mb-xs row justify-center">
                <AppQrPetugas :noreg="props.pasien?.noreg" :jnssurat="'SKRINING RAWAT JALAN'" :asal="'RAWAT JALAN'"
                  :kdpegsimrs="petugasKd" :height="'80px'" :width="'80px'" />
              </div>
              <div class="f-12 row justify-center">{{ petugasName || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-btn ref="refPrint" v-print="printObj" fab icon="icon-mat-print" color="primary" class="fixed-bottom-right"
      style="margin: 16px;">
      <q-tooltip>Print</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios'
import AppQrPetugas from 'src/components/~global/AppQrPetugas.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const loading = ref(false)
const skriningData = ref([])
const anamnesisData = ref([])
const pemeriksaanFisikData = ref([])
const refPrint = ref()

const displayData = computed(() => {
  const propData = props.pasien?.anamnesis_skrining
  if (Array.isArray(propData) && propData.length) {
    return propData
  }
  return skriningData.value
})

const latestAnamnesis = computed(() => {
  const propData = props.pasien?.anamnesis
  const source = Array.isArray(propData) && propData.length ? propData : anamnesisData.value
  return Array.isArray(source) && source.length ? source[0] : null
})

const latestPemeriksaan = computed(() => {
  const propData = props.pasien?.pemeriksaanfisik
  const source = Array.isArray(propData) && propData.length ? propData : pemeriksaanFisikData.value
  return Array.isArray(source) && source.length ? source[0] : null
})

const latestSkrining = computed(() => {
  const data = displayData.value
  return Array.isArray(data) && data.length ? data[0] : null
})

const petugasUser = computed(() => {
  const data = displayData.value

  return Array.isArray(data) && data.length ? data[0]?.user_input ?? null : null
})

const petugasName = computed(() => {
  return petugasUser.value?.nama || petugasUser.value?.nama_petugas || petugasUser.value?.nama_pekerja || null
})

const petugasKd = computed(() => {
  return petugasUser.value?.kdpegsimrs || petugasUser.value?.kdpeg || petugasUser.value?.id || ''
})

function displayValue (value) {
  if (value === null || value === undefined || value === '') return '-'
  return value
}

function yesNoLabel (value) {
  if (value === 1 || value === '1' || value === 'Iya' || value === 'iya' || value === 'Ya' || value === 'ya') {
    return 'Ya'
  }
  if (value === 0 || value === '0' || value === 'Tidak' || value === 'tidak') {
    return 'Tidak'
  }
  return '-'
}

function iconNyeri (anu) {
  const val = typeof anu === 'string' ? (isNaN(parseInt(anu)) ? 0 : parseInt(anu)) : 0
  if (val < 2) return 'icon-my-emoticon-excited-outline'
  if (val >= 2 && val < 4) return 'icon-my-emoticon-outline'
  if (val >= 4 && val < 6) return 'icon-my-emoticon-neutral-outline'
  if (val >= 6 && val < 8) return 'icon-my-emoticon-confused-outline'
  if (val >= 8 && val < 10) return 'icon-my-emoticon-angry-outline'
  if (val === 10) return 'icon-my-emoticon-cry-outline'
  return 'icon-my-emoticon-excited-outline'
}

function nyeriKeterangan (anu) {
  const val = typeof anu === 'string' ? (isNaN(parseInt(anu)) ? 0 : parseInt(anu)) : 0
  if (val === 0) return 'Tidak ada nyeri'
  if (val > 0 && val <= 3) return 'Nyeri ringan'
  if (val > 3 && val <= 6) return 'Nyeri sedang'
  if (val > 6 && val <= 10) return 'Nyeri berat'
  return '-'
}

function hasilJatuh (item) {
  const seimbang = parseInt(item?.seimbang)
  const penopang = parseInt(item?.penopang)
  if (seimbang > 0 && penopang > 0) return 'Tinggi'
  if (seimbang > 0 || penopang > 0) return 'Sedang'
  return 'Rendah'
}

function detailJatuh (item) {
  const seimbang = parseInt(item?.seimbang)
  const penopang = parseInt(item?.penopang)
  const seimbangText = seimbang > 0 ? 'tampak tidak seimbang (sempoyongan)' : 'tidak tampak seimbang (sempoyongan)'
  const penopangText = penopang > 0 ? 'memegang pinggiran kursi atau benda lain sebagai penopang' : 'tidak memegang pinggiran kursi atau benda lain sebagai penopang'
  return `Pasien ${seimbangText}. Pasien ${penopangText}.`
}

async function loadSkriningData () {
  if (!props.pasien?.noreg) {
    skriningData.value = []
    return
  }

  const propData = props.pasien?.anamnesis_skrining
  if (Array.isArray(propData) && propData.length) {
    skriningData.value = propData
    return
  }

  const propAnamnesis = Array.isArray(props.pasien?.anamnesis) ? props.pasien.anamnesis : []
  const propPemeriksaan = Array.isArray(props.pasien?.pemeriksaanfisik) ? props.pasien.pemeriksaanfisik : []

  if (propAnamnesis.length) anamnesisData.value = propAnamnesis
  if (propPemeriksaan.length) pemeriksaanFisikData.value = propPemeriksaan

  loading.value = true
  try {
    const response = await api.get('v1/simrs/pelayanan/skrining-rajal-kunjungan', {
      params: { noreg: props.pasien.noreg }
    })

    const payload = response?.data || {}
    const data = Array.isArray(payload?.data) ? payload.data : []
    const anamnesis = Array.isArray(payload?.anamnesis) ? payload.anamnesis : []
    const pemeriksaan = Array.isArray(payload?.pemeriksaanfisik) ? payload.pemeriksaanfisik : []

    skriningData.value = data
    anamnesisData.value = anamnesis
    pemeriksaanFisikData.value = pemeriksaan
  } catch (error) {
    console.error('Gagal memuat data skrining rawat jalan', error)
    skriningData.value = []
    anamnesisData.value = []
    pemeriksaanFisikData.value = []
  } finally {
    loading.value = false
  }
}

watch(() => [
  props.pasien?.noreg,
  props.pasien?.anamnesis_skrining,
  props.pasien?.anamnesis,
  props.pasien?.pemeriksaanfisik
], () => {
  loadSkriningData()
}, { immediate: true, deep: true })

const printObj = {
  id: 'pdfDoc',
  previewTitle: 'SKRINING RAWAT JALAN',
  popTitle: 'SKRINING RAWAT JALAN'
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
  padding: 14px;
  border-radius: 8px;
  background-color: #fafafa;
}

.dokumen-content {
  padding: 0;
}

.biodata-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.biodata-item {
  min-width: calc(50% - 6px);
}

.biodata-item.full-width {
  min-width: 100%;
}

.section-wrapper {
  border-left: 3px solid #1976d2;
  padding-left: 12px;
}

.data-list {
  padding: 8px 0;
}

.data-row {
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}

.data-row:last-child {
  border-bottom: none;
}

.data-row .text-weight-bold {
  color: #333;
}

.biodata-pasien {
  border: 1px solid #ddd;
  padding: 14px;
  border-radius: 8px;
  background-color: #fafafa;
  color: #555;
  margin-bottom: 10px;
}

.overview-card,
.assessment-card {
  border: 1px solid #dce4ee;
  border-radius: 8px;
  background: #f8fbff;
  padding: 12px 14px;
}

.assessment-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #205493;
}

.overview-text {
  font-size: 12px;
  line-height: 1.5;
  color: #444;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: #333;
}

.value-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e3f2fd;
  color: #1565c0;
  font-weight: 600;
}

.skrining-block {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;

  &:last-child {
    border-bottom: none;
  }
}

.user-input-footer {
  display: flex;
  justify-content: flex-end;
  font-size: 11px;
  color: #333;
  margin-top: 14px;
}

.qr-wrapper {
  min-width: 72px;
  min-height: 72px;
}

.user-input-footer {
  align-items: center;
}

.user-input-footer .text-right {
  text-align: right;
}

.text-weight-bold {
  font-weight: bold;
}

.text-grey {
  color: #999;
}

@media print {
  .page-legal {
    width: 21.59cm;
    height: auto;

    .contentx {
      padding: 5mm;
    }
  }

  @page {
    margin: 10mm;
  }
}
</style>
