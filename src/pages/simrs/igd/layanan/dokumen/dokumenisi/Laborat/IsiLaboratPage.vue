<template>
  <div class="laborat-wrapper">

    <div v-for="(lab, l) in laborat" :key="l" class="laborat-paper">

      <!-- HEADER -->
      <div class="laborat-header">

        <div>
          <div class="header-title">
            HASIL PEMERIKSAAN LABORATORIUM
          </div>

          <div class="header-subtitle">
            Instalasi Laboratorium
          </div>
        </div>

        <div class="nota-box">
          {{ lab?.nota }}
        </div>

      </div>

      <!-- INFO -->
      <div class="info-wrapper">

        <div class="info-item">
          <div class="info-label">
            Tanggal Pemeriksaan
          </div>

          <div class="info-value">
            {{ dateFull(lab?.tanggal) }}
          </div>
        </div>

      </div>

      <!-- TABLE -->
      <table class="lab-table">

        <thead>
          <tr>
            <th width="6%">
              No
            </th>

            <th width="64%">
              Pemeriksaan
            </th>

            <th width="30%">
              Hasil
            </th>
          </tr>
        </thead>

        <tbody>

          <tr v-for="(rinci, r) in lab?.pemeriksaan" :key="r">

            <td class="text-center">
              {{ r + 1 }}
            </td>

            <td>

              <div class="pemeriksaan-title">
                {{ rinci?.nama ?? '-' }}
              </div>

              <div v-if="rinci?.paket" class="pemeriksaan-paket">
                Paket : {{ rinci?.paket }}
              </div>

            </td>

            <td class="hasil-cell">
              {{ rinci?.hasil ?? '-' }}
            </td>

          </tr>

        </tbody>

      </table>

      <!-- FOOTER -->
      <div class="footer-section">

        <div class="footer-box">

          <div class="footer-title">
            INTERPRETASI
          </div>

          <div class="footer-content">
            {{ lab?.interpretasi || '-' }}
          </div>

        </div>

        <div class="footer-box">

          <div class="footer-title">
            SARAN
          </div>

          <div class="footer-content">
            {{ lab?.saran || '-' }}
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { dateFull } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const laborat = computed(() => {

  const data = props?.pasien?.laboratold || []

  const hasilglobal = []

  data.forEach(x => {

    hasilglobal.push({
      nota: x?.rs2,
      tanggal: x?.rs3,
      pemeriksaan: x?.pemeriksaanlab?.rs2,
      paket: x?.paket,
      hasil: x?.rs21,
      interpretasi: x?.interpretasi?.rs3,
      saran: x?.interpretasi?.rs4
    })

  })

  const groupedData = hasilglobal.reduce((acc, item) => {

    if (!acc[item.nota]) {

      acc[item.nota] = {
        nota: item.nota,
        tanggal: item.tanggal,
        paket: item.paket,
        interpretasi: item.interpretasi,
        saran: item.saran,
        pemeriksaan: []
      }

    }

    acc[item.nota].pemeriksaan.push({
      nama: item.pemeriksaan,
      hasil: item.hasil,
      paket: item.paket
    })

    return acc

  }, {})

  return Object.values(groupedData)

})
</script>

<style lang="scss" scoped>
.laborat-wrapper {
  padding: 12px;
  background: #f4f7fb;
}

.laborat-paper {

  background: white;

  border: 1px solid #d9e2ec;

  border-radius: 14px;

  overflow: hidden;

  margin-bottom: 18px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* HEADER */

.laborat-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 16px 20px;

  background: linear-gradient(135deg, #878f9b, #b7b8b9);

  color: white;
}

.header-title {

  font-size: 18px;

  font-weight: 700;

  letter-spacing: 0.5px;
}

.header-subtitle {

  margin-top: 4px;

  font-size: 12px;

  opacity: 0.9;
}

.nota-box {

  background: white;

  color: #1565c0;

  padding: 6px 12px;

  border-radius: 8px;

  font-size: 12px;

  font-weight: 700;
}

/* INFO */

.info-wrapper {

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 14px;

  padding: 18px 20px;

  background: #f8fafc;

  border-bottom: 1px solid #e5edf5;
}

.info-label {

  font-size: 11px;

  color: #64748b;

  margin-bottom: 3px;

  text-transform: uppercase;

  letter-spacing: 0.4px;
}

.info-value {

  font-size: 14px;

  font-weight: 600;

  color: #0f172a;
}

/* TABLE */

.lab-table {

  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;
}

.lab-table thead th {

  background: #8f9399;

  color: white;

  padding: 10px;

  font-size: 12px;

  border: 1px solid #d0d7de;
}

.lab-table td {

  padding: 10px;

  border: 1px solid #e2e8f0;

  vertical-align: top;

  font-size: 13px;
}

.lab-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.pemeriksaan-title {

  font-weight: 600;

  color: #0f172a;
}

.pemeriksaan-paket {

  margin-top: 4px;

  font-size: 11px;

  color: #7f858d;
}

.hasil-cell {

  text-align: center;

  font-weight: 700;

  color: #1565c0;
}

/* FOOTER */

.footer-section {

  padding: 16px 20px 20px;
}

.footer-box {

  margin-top: 14px;
}

.footer-title {

  font-size: 11px;

  font-weight: 700;

  color: #64748b;

  margin-bottom: 6px;

  letter-spacing: 0.4px;
}

.footer-content {

  border-left: 4px solid #1565c0;

  background: #f8fafc;

  padding: 10px 12px;

  font-size: 13px;

  border-radius: 6px;
}

/* PRINT */

@media print {

  .laborat-wrapper {

    padding: 0 !important;

    background: white !important;
  }

  .laborat-paper {

    box-shadow: none !important;

    border-radius: 0 !important;

    border: 1px solid #999 !important;

    margin-bottom: 12px !important;

    overflow: visible !important;

    break-inside: auto !important;

    page-break-inside: auto !important;
  }

  .laborat-header {

    padding: 10px 14px !important;

    -webkit-print-color-adjust: exact;

    print-color-adjust: exact;
  }

  .header-title {
    font-size: 14px !important;
  }

  .header-subtitle {
    font-size: 10px !important;
  }

  .nota-box {
    font-size: 10px !important;
  }

  .info-wrapper {

    display: block !important;

    padding: 10px 14px !important;

    background: white !important;
  }

  .info-item {
    margin-bottom: 8px;
  }

  .info-label {
    font-size: 10px !important;
  }

  .info-value {
    font-size: 11px !important;
  }

  .lab-table {

    width: 100% !important;

    border-collapse: collapse !important;
  }

  .lab-table thead {

    display: table-header-group;
  }

  .lab-table tr {

    page-break-inside: avoid !important;

    break-inside: avoid !important;
  }

  .lab-table th {

    background: #7d848d !important;

    color: white !important;

    font-size: 10px !important;

    padding: 5px !important;

    border: 1px solid #999 !important;

    -webkit-print-color-adjust: exact;

    print-color-adjust: exact;
  }

  .lab-table td {

    font-size: 10px !important;

    padding: 5px !important;

    border: 1px solid #999 !important;
  }

  .footer-section {

    padding: 10px 14px !important;
  }

  .footer-content {

    font-size: 10px !important;

    padding: 6px 8px !important;

    border-radius: 0 !important;
  }

}
</style>
