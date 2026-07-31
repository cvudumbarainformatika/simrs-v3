<template>
  <div id="prmrjDocument" class="prmrj-document bg-white">
    <div class="print-page-frame" aria-hidden="true" />

    <KopDokumen
      judul="PRMRJ"
      warna-badge="green"
      :pasien="props.pasien"
      :jangantampil="false"
    />

    <div class="document-body">
      <div class="document-title">
        PROFIL RINGKASAN MEDIS RAWAT JALAN
      </div>

      <table class="medical-summary-table">
        <thead>
          <tr>
            <th class="visit-column">
              Kunjungan
            </th>
            <th class="anamnesis-column">
              Anamnese
            </th>
            <th class="diagnosis-column">
              Diagnosa
            </th>
            <th class="therapy-column">
              Terapi
            </th>
            <th class="doctor-column">
              DPJP
            </th>
          </tr>
        </thead>
        <tbody v-for="visit in groupedItems" :key="visit.rs1" class="visit-table-group">
          <tr>
            <td>
              <div class="cell-title">
                {{ formatDate(visit.rs3) }}
              </div>
              <div class="cell-caption">
                {{ visit.rs1 }}
              </div>
            </td>
            <td>
              <ol v-if="visit.anamnesis?.length" class="document-list">
                <li v-for="anamnesis in visit.anamnesis" :key="anamnesis.id">
                  {{ anamnesis.rs4 || anamnesis.riwayatpenyakitsekarang || '-' }}
                </li>
              </ol>
              <div v-else class="empty-cell">
                -
              </div>
            </td>
            <td>
              <div v-if="diagnosisItems(visit).length" class="diagnosis-list">
                <div v-for="(diagnosis, index) in diagnosisItems(visit)"
                  :key="diagnosis.id || `${diagnosis.type}-${index}`" class="diagnosis-item">
                  <strong>{{ diagnosis.label }}</strong>
                  <span>{{ diagnosis.description }}</span>
                </div>
              </div>
              <div v-else class="empty-cell">
                -
              </div>
            </td>
            <td>
              <ol v-if="medicineItems(visit).length" class="document-list">
                <li v-for="(medicine, index) in medicineItems(visit)"
                  :key="medicine.id || medicine.kdobat || medicine.rs4 || index">
                  <div class="medicine-name">
                    {{ medicineName(medicine) }}
                  </div>
                  <div class="cell-caption">
                    {{ medicineDescription(medicine) }}
                  </div>
                </li>
              </ol>
              <div v-else class="empty-cell">
                -
              </div>
            </td>
            <td class="doctor-cell">
              <vue-qrcode
                :value="qrUrl(visit)"
                tag="svg"
                :options="qrOptions"
              />
              <div class="doctor-name">
                {{ doctorName(visit) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KopDokumen from '../../../igd/layanan/dokumen/KopDokumen.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  items: {
    type: Array,
    default: () => []
  }
})

const relationKeys = [
  'anamnesis',
  'diagnosa',
  'manymemo',
  'apotekrajalpolilalu',
  'apotekrajal',
  'apotekracikanrajallalu',
  'newapotekrajal'
]

const qrOptions = {
  width: 76,
  errorCorrectionLevel: 'Q',
  color: {
    dark: '#000000',
    light: '#ffffff'
  },
  margin: 0
}

const groupedItems = computed(() => {
  const groups = new Map()

  props.items.forEach(visit => {
    const noreg = visit.rs1 || visit.noreg
    if (!noreg) return

    if (!groups.has(noreg)) {
      const initialVisit = { ...visit, rs1: noreg }
      relationKeys.forEach(key => {
        initialVisit[key] = [...(visit[key] || [])]
      })
      groups.set(noreg, initialVisit)
      return
    }

    const groupedVisit = groups.get(noreg)
    relationKeys.forEach(key => {
      groupedVisit[key].push(...(visit[key] || []))
    })
  })

  return [...groups.values()].sort((first, second) => {
    return new Date(second.rs3).getTime() - new Date(first.rs3).getTime()
  })
})

function diagnosisItems(visit) {
  const diagnoses = (visit.diagnosa || []).map(item => ({
    ...item,
    type: 'diagnosis',
    label: item.rs3 || 'Diagnosis',
    description: item.masterdiagnosa?.rs4 || item.rs6 || '-'
  }))

  const memos = (visit.manymemo || []).map(item => ({
    ...item,
    type: 'memo',
    label: 'Memo',
    description: item.diagnosa || item.memo || item.keterangan || '-'
  }))

  return [...diagnoses, ...memos]
}

function medicineItems(visit) {
  const medicines = []

  for (const prescription of (visit.newapotekrajal || [])) {
    medicines.push(...(prescription.rincian || []))
  }

  medicines.push(
    ...(visit.apotekrajal || []),
    ...(visit.apotekrajalpolilalu || []),
    ...(visit.apotekracikanrajallalu || [])
  )

  return medicines
}

function medicineName(medicine) {
  return medicine.mobat?.nama_obat
    || medicine.mobatnew?.nama_obat
    || medicine.mObatnew?.nama_obat
    || medicine.m_obatnew?.nama_obat
    || medicine.nama_obat
    || medicine.namaobat
    || `Obat ${medicine.kdobat || medicine.rs4 || ''}`.trim()
}

function medicineDescription(medicine) {
  const quantity = medicine.jumlah_keluar
    ?? medicine.jumlah
    ?? medicine.jml
    ?? medicine.rs8
    ?? 0
  const unit = medicine.mobat?.satuan_k
    || medicine.mobatnew?.satuan_k
    || medicine.mObatnew?.satuan_k
    || medicine.satuan
    || ''
  const instruction = medicine.aturan
    || medicine.aturan_pakai
    || medicine.signa
    || medicine.keterangan
    || ''

  return [`${quantity} ${unit}`.trim(), instruction].filter(Boolean).join(' · ')
}

function doctorName(visit) {
  return visit.datasimpeg?.nama
    || visit.dokter?.nama
    || visit.dokter?.dokter
    || '-'
}

function qrUrl(visit) {
  const noreg = visit.rs1 || visit.noreg
  const documentName = 'Profil Ringkasan Medis Rawat Jalan.png'
  const origin = 'RAWAT JALAN'
  const officer = visit.datasimpeg?.kdpegsimrs
    || visit.datasimpeg?.kddpjp
    || visit.rs9
    || null
  const encoded = btoa(`${noreg}|${documentName}|${origin}|${officer}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${encoded}`
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
</script>

<style lang="scss" scoped>
.prmrj-document {
  width: 202mm;
  min-height: 29.7cm;
  margin: 0 auto;
  color: #000;
  font-size: 12px;
}

.print-page-frame {
  display: none;
}

.document-body {
  min-height: 19cm;
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  border-left: 2px solid #000;
}

.document-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.medical-summary-table {
  width: calc(100% - 24px);
  margin: 4px 12px 12px;
  table-layout: fixed;
  border-collapse: collapse;
}

.medical-summary-table th,
.medical-summary-table td {
  padding: 8px 6px;
  vertical-align: top;
  border: 1px solid #000;
}

.medical-summary-table th {
  font-weight: 700;
  text-align: center;
}

.medical-summary-table tbody tr {
  break-inside: avoid;
}

.cell-title {
  font-weight: 700;
  text-align: center;
}

.cell-caption {
  margin-top: 3px;
  color: #333;
  font-size: 9px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.document-list {
  padding-left: 16px;
  margin: 0;
}

.document-list li + li {
  margin-top: 5px;
}

.diagnosis-item {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.diagnosis-item + .diagnosis-item {
  padding-top: 5px;
  margin-top: 5px;
  border-top: 1px dashed #777;
}

.medicine-name {
  font-weight: 600;
}

.doctor-cell {
  text-align: center;
}

.doctor-cell svg {
  display: block;
  width: 76px;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}

.doctor-name {
  margin-top: 6px;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.empty-cell {
  text-align: center;
}

.visit-column {
  width: 18%;
}

.anamnesis-column {
  width: 25%;
}

.diagnosis-column {
  width: 23%;
}

.therapy-column {
  width: 19%;
}

.doctor-column {
  width: 15%;
}

.prmrj-document.pdf-export {
  :deep(.print-page > .b1) {
    border-top: 0;
    border-right: 0;
    border-left: 0;
  }

  :deep(.print-page > .b4) {
    border-right: 0;
    border-left: 0;
  }

  .document-body {
    border: 0;
  }

  .medical-summary-table {
    width: calc(100% - 8mm);
    margin: 3mm 4mm 4mm;
    border-collapse: separate;
    border-spacing: 0;
  }

  .medical-summary-table th,
  .medical-summary-table td {
    border: 0;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
  }

  .medical-summary-table th:first-child,
  .medical-summary-table td:first-child {
    border-left: 1px solid #000;
  }

  .medical-summary-table th {
    border-top: 1px solid #000;
  }

  .medical-summary-table .visit-table-group,
  .medical-summary-table tbody tr {
    break-inside: avoid-page;
    page-break-inside: avoid;
  }
}

@media print {
  @page prmrj {
    size: A4 portrait;
    margin: 10mm 4mm;

    @bottom-right {
      content: none;
    }
  }

  .prmrj-document {
    page: prmrj;
    width: auto;
    min-height: auto;
    margin: 0;
  }

  .prmrj-document :deep(.print-page > .b1) {
    border-top: 0;
    border-right: 0;
    border-left: 0;
  }

  .prmrj-document :deep(.print-page > .b4) {
    border-right: 0;
    border-left: 0;
  }

  .print-page-frame {
    position: fixed;
    z-index: 9999;
    inset: 0;
    display: block;
    border: 2px solid #000;
    pointer-events: none;
  }

  .document-body {
    min-height: 19cm;
    border: 0;
  }

  .medical-summary-table {
    width: calc(100% - 8mm);
    margin: 3mm 4mm 4mm;
    border-collapse: separate;
    border-spacing: 0;
  }

  .medical-summary-table th,
  .medical-summary-table td {
    border: 0;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
  }

  .medical-summary-table th:first-child,
  .medical-summary-table td:first-child {
    border-left: 1px solid #000;
  }

  .medical-summary-table th {
    border-top: 1px solid #000;
  }

  .medical-summary-table thead {
    display: table-header-group;
  }

  .medical-summary-table thead::before {
    display: table-row;
    height: 3mm;
    content: '';
  }

  .medical-summary-table .visit-table-group,
  .medical-summary-table tbody tr {
    break-inside: avoid-page;
    page-break-inside: avoid;
  }
}
</style>
