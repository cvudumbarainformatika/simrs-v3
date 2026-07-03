<template>
  <div class="fit bg-grey-4 column q-pa-lg q-pb-xl scroll">
    <div id="pdfDoc" ref="rePdfDoc" class="page-legal f-12 bg-white">
      <div class="contentx">
        <app-kop-surat-Internal title1="SKRINING" title2="RAWAT JALAN" />

        <div class="biodata-pasien q-my-md">
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <span class="text-weight-bold">NO. RM</span> : {{ pasien?.norm || '-' }}
            </div>
            <div class="col-6">
              <span class="text-weight-bold">NO. REG</span> : {{ pasien?.noreg || '-' }}
            </div>
            <div class="col-12 q-mt-sm">
              <span class="text-weight-bold">NAMA PASIEN</span> : {{ pasien?.nama_panggil || pasien?.namapasien || '-'
              }}
            </div>
            <div class="col-6 q-mt-sm">
              <span class="text-weight-bold">JENIS KELAMIN</span> : {{ pasien?.kelamin || pasien?.jeniskelamin || '-' }}
            </div>
            <div class="col-6 q-mt-sm">
              <span class="text-weight-bold">USIA</span> : {{ pasien?.usia || '-' }}
            </div>
          </div>
        </div>

        <div class="overview-card q-mb-md">
          <div class="section-title">Tujuan Skrining</div>
          <div class="overview-text">
            Dokumen ini digunakan untuk menilai kondisi awal pasien rawat jalan secara sistematis, mencakup risiko
            klinis, nyeri, risiko jatuh, dan tingkat kesadaran. Hasil skrining membantu tenaga kesehatan menentukan
            tindakan pendukung yang aman dan sesuai kebutuhan pasien.
          </div>
        </div>

        <div class="assessment-grid q-mb-md">
          <div class="assessment-card">
            <div class="section-title">Penilaian Nyeri</div>
            <div v-if="latestAnamnesis" class="info-block">
              <div class="info-row">
                <span class="text-weight-bold">Skor Nyeri</span>
                <span class="value-pill">{{ displayValue(latestAnamnesis?.scorenyeri) }}</span>
              </div>
              <div class="info-row">
                <span class="text-weight-bold">Status</span>
                <span>{{ nyeriKeterangan(latestAnamnesis?.scorenyeri) }}</span>
              </div>
              <div class="info-row items-center">
                <span class="text-weight-bold">Skala</span>
                <span class="row items-center q-gutter-xs">
                  <q-icon :name="iconNyeri(latestAnamnesis?.scorenyeri)" size="sm" color="teal" />
                  <span>{{ nyeriKeterangan(latestAnamnesis?.scorenyeri) }}</span>
                </span>
              </div>
            </div>
            <div v-else class="text-grey">Belum ada data nyeri.</div>
          </div>

          <div class="assessment-card">
            <div class="section-title">Penilaian Risiko Jatuh</div>
            <div v-if="latestAnamnesis" class="info-block">
              <div class="info-row">
                <span class="text-weight-bold">Hasil</span>
                <span class="value-pill">{{ hasilJatuh(latestAnamnesis) }}</span>
              </div>
              <div class="info-row">
                <span class="text-weight-bold">Catatan</span>
                <span>{{ detailJatuh(latestAnamnesis) }}</span>
              </div>
            </div>
            <div v-else class="text-grey">Belum ada data risiko jatuh.</div>
          </div>

          <div class="assessment-card">
            <div class="section-title">Kesadaran</div>
            <div v-if="latestPemeriksaan" class="info-block">
              <div class="info-row">
                <span class="text-weight-bold">Status</span>
                <span>{{ displayValue(latestPemeriksaan?.kesadaran) }}</span>
              </div>
            </div>
            <div v-else class="text-grey">Belum ada data kesadaran.</div>
          </div>
        </div>

        <div v-if="loading" class="text-center q-py-md text-grey">
          Memuat data skrining...
        </div>

        <div v-else-if="displayData.length" class="section-wrapper">
          <div class="section-title q-mb-sm">Data Skrining Klinis</div>
          <div v-for="(item, idx) in displayData" :key="item?.id || idx" class="skrining-block q-mb-lg">
            <div class="text-weight-bold f-14 q-mb-sm">Skrining {{ idx + 1 }}</div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Pernafasan</div>
              <div class="col-8">: {{ displayValue(item?.pernafasan) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Hambatan Fisik</div>
              <div class="col-8">: {{ yesNoLabel(item?.hambatan_fisik) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Kursi Roda</div>
              <div class="col-8">: {{ yesNoLabel(item?.hambatan_fisik_kursi_roda) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Hambatan Fisik Lain</div>
              <div class="col-8">: {{ displayValue(item?.hambatan_fisik_lain) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Hambatan Bahasa</div>
              <div class="col-8">: {{ yesNoLabel(item?.hambatan_bahasa) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Hambatan Penerjemah</div>
              <div class="col-8">: {{ yesNoLabel(item?.hambatan_penerjemah) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Nyeri Dada</div>
              <div class="col-8">: {{ displayValue(item?.nyeri_dada) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Batuk</div>
              <div class="col-8">: {{ displayValue(item?.batuk) }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-xs">
              <div class="col-4 text-weight-bold">Keputusan</div>
              <div class="col-8">: {{ displayValue(item?.keputusan) }}</div>
            </div>

            <div v-if="item?.user_input?.nama" class="user-input-footer q-mt-sm">
              <span class="text-weight-bold">User Input</span> : {{ item.user_input.nama }}
            </div>
          </div>
        </div>
        <div v-else class="text-center text-grey q-py-md">
          Tidak ada data skrining rawat jalan.
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
  padding: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.section-wrapper {
  border-left: 3px solid #1976d2;
  padding-left: 12px;
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

.f-12 {
  font-size: 12px;
}

.f-14 {
  font-size: 14px;
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
