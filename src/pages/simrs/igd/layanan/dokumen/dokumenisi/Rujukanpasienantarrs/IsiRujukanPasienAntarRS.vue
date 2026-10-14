<template>
  <section class="rujukan-print">
    <div class="info-grid">
      <div class="cell full-row">
        <strong>Kepada Yth</strong
        ><span>: {{ rujukan.di_rujuk_ke || "-" }}</span>
      </div>
      <div class="cell">
        <strong>Tanggal Masuk</strong><span>: {{ tanggalMasuk }}</span>
      </div>
      <div class="cell">
        <strong>Tanggal Pindah</strong
        ><span>: {{ rujukan.tgl_rujukan || "-" }}</span>
      </div>
      <div class="cell">
        <strong>Status Pembayaran</strong><span>: {{ pasien.sistembayar ?? '-' }}</span>
      </div>
      <div class="cell response">
        <strong>Respon RS Rujukan</strong
        ><span
          >Tanggal: ............................ &nbsp; Jam:
          ............................</span
        ><span
          >Petugas penerima informasi rencana rujukan:
          ....................................</span
        >
      </div>
      <div class="cell">
        <strong>DPJP Pasien</strong
        ><span>: {{ pasien.dokter || pasien.namadokter || "-" }}</span>
      </div>
      <div class="cell"></div>
    </div>
    <div class="info-grid transport-grid">
      <div class="cell transport">
        <strong>Transportasi</strong>
        <div class="check-row">
          <span>□ Ambulance RS</span><span>□ Kendaraan Lain</span>
        </div>
        <div>
          No. Kendaraan:
          ...................................................................
        </div>
      </div>
      <div class="cell companion">
        <strong>Pendamping</strong>
        <div>
          □ Dokter &nbsp;:
          .....................................................................
        </div>
        <div>
          □ Perawat :
          .....................................................................
        </div>
      </div>
    </div>
    <div class="line-section">
      <strong>Alasan pindah RS</strong
      ><span
        >: {{ rujukan.alasan_pindah_rs || rujukan.atas_dasar || "-" }}</span
      >
    </div>
    <div class="section-title">
      Tanda Vital dan Pemeriksaan Fisik sebelum dirujuk
    </div>
    <div class="vital-row">
      <span>Tensi: {{ vital.sistole }}/{{ vital.diastole }} mmHg</span
      ><span>Nadi: {{ vital.nadi }} x/mnt</span
      ><span>Suhu: {{ vital.suhu }} °C</span
      ><span>RR: {{ vital.rr }} x/mnt</span><span>GCS: {{ vital.gcs }}</span>
    </div>
    <div class="allergy-grid">
      <div><strong>Riwayat Alergi</strong></div>
      <div class="allergy-content">
        <span>Obat: {{ alergi }}</span
        ><span>Makanan: {{ alergiMakanan }}</span>
      </div>
      <div class="degree">
        <strong>Derajat Pasien</strong><br />{{ derajatPasien }}
      </div>
    </div>
    <div class="line-section">
      <strong>Pemeriksaan Penunjang / Diagnostik</strong
      ><span>: {{ penunjang }}</span>
    </div>
    <div class="line-section">
      <strong>Diagnosa</strong><span>: {{ diagnosa }}</span>
    </div>
    <div class="line-section multiline">
      <strong
        >Terapi / Tindakan yang sudah diberikan selama di RSUD Dr. Moh.
        Saleh</strong
      ><span>{{ rujukan.terapi_tindakan || "-" }}</span>
    </div>
    <div class="line-section">
      <strong>Diet</strong><span>: {{ rujukan.diet || "-" }}</span>
    </div>
    <div class="line-section multiline">
      <strong>Rencana Perawatan Selanjutnya</strong
      ><span>: {{ rujukan.keterangan || "-" }}</span>
    </div>
    <div class="therapy-title">Terapi saat pindah</div>
    <table class="therapy-table">
      <thead>
        <tr>
          <th>Nama Obat</th>
          <th>Jumlah</th>
          <th>Dosis</th>
          <th>Frekuensi</th>
          <th>Cara Pemberian</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(obat, index) in rowsObat" :key="obat?.id || index">
          <td>{{ obat?.nama_obat || "" }}</td>
          <td>{{ obat?.jumlah || "" }}</td>
          <td>{{ obat?.dosis || "" }}</td>
          <td>{{ obat?.frekwensi || "" }}</td>
          <td>{{ obat?.cara_pemberian || "" }}</td>
        </tr>
      </tbody>
    </table>
    <div class="signature-dpjp">
      <div>Dokter Penanggung Jawab Pasien (DPJP)</div>
      <div v-if="pasien.kodedokter" class="qrcode-dpjp">
        <vue-qrcode
          :value="qrDokter"
          tag="svg"
          :options="{
            errorCorrectionLevel: 'Q',
            color: { dark: '#000000', light: '#ffffff' },
            margin: 0,
          }"
        />
      </div>
      <div class="doctor-name">{{ pasien.dokter || '................................' }}</div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ pasien: { type: Object, default: () => ({}) } });
const pasien = computed(() => props.pasien || {});
// Kolom database rs17.rs3 di API dikirim sebagai `tgl_kunjungan`.
const tanggalMasuk = computed(() => pasien.value.tgl_kunjungan ?? "-");
const plan = computed(
  () =>
    [...(pasien.value.planheder || [])]
      .filter((item) =>
        ["Rujuk Ke Rumah Sakit", "Rujuk Ke Rumah Sakit Lain"].includes(
          item?.rs4
        )
      )
      .sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0))[0] || {}
);
const rujukan = computed(() => plan.value.planrujukan || {});
const qrDokter = computed(() => {
  const noreg = pasien.value.noreg ?? "";
  const dokumen = "RUJUKAN-PASIEN-ANTAR-RS.png";
  const asal = "RAWAT JALAN";
  const petugas = pasien.value.kodedokter ?? "";
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${btoa(`${noreg}|${dokumen}|${asal}|${petugas}`)}`;
});
const derajatPasien = computed(
  () =>
    [...(pasien.value.skalatransfer || [])].sort(
      (a, b) => Number(b?.id || 0) - Number(a?.id || 0)
    )[0]?.scoretotal ?? "-"
);
const tinjauanUlang = computed(
  () =>
    [...(pasien.value.tinjauanulang || [])].sort(
      (a, b) => Number(b?.id || 0) - Number(a?.id || 0)
    )[0] || {}
);
const vital = computed(() => ({
  sistole: tinjauanUlang.value.sistole ?? "-",
  diastole: tinjauanUlang.value.diastole ?? "-",
  nadi: tinjauanUlang.value.nadi ?? "-",
  suhu: tinjauanUlang.value.suhu ?? "-",
  rr: tinjauanUlang.value.pernapasanx ?? "-",
  gcs: getGcs(tinjauanUlang.value),
}));
function getGcs(data) {
  const score = [data?.eye, data?.verbal, data?.motorik]
    .map(Number)
    .reduce((total, value) => total + value, 0);
  return score > 0 ? score : "-";
}
const anamnesis = computed(
  () =>
    [...(pasien.value.anamnesis || [])].sort(
      (a, b) => Number(b?.id || 0) - Number(a?.id || 0)
    )[0] || {}
);
const pilihanAlergi = computed(() => {
  const value = anamnesis.value.riwayatalergi;
  return Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
});
function alergiAnamnesis(jenis) {
  const adaAlergi = pilihanAlergi.value.some(
    (item) => item.toLowerCase() === jenis.toLowerCase()
  );
  if (!adaAlergi) return "-";
  return anamnesis.value.keteranganalergi || "Ada";
}
const alergi = computed(() => alergiAnamnesis("Obat"));
const alergiMakanan = computed(() => alergiAnamnesis("Makanan"));
const diagnosa = computed(() => {
  const memo = pasien.value.memodiagnosa;
  const icd = (pasien.value.diagnosa || [])
    .filter((item) => item?.rs13 === "POL014")
    .map((item) => [item?.rs3, item?.masterdiagnosa?.rs4].filter(Boolean).join(" - "))
    .filter(Boolean);
  const bagian = [];
  if (memo) bagian.push(`Memo: ${memo}`);
  if (icd.length) bagian.push(`ICD-10: ${[...new Set(icd)].join("; ")}`);
  return bagian.join(" | ") || "-";
});
const penunjang = computed(() => {
  const laborat = (pasien.value.laboratold || [])
    .map((item) => item?.pemeriksaanlab?.rs2 || item?.pemeriksaan)
    .filter(Boolean);
  const radiologi = (pasien.value.radiologi || [])
    .map((item) => item?.rs4)
    .filter(Boolean);
  const hasilRadiologi = (pasien.value.hasilradiologi || [])
    .map((item) => item?.rs3)
    .filter(Boolean);
  const bagian = [];
  if (laborat.length) bagian.push(`Laborat: ${[...new Set(laborat)].join(", ")}`);
  if (radiologi.length) bagian.push(`Radiologi: ${[...new Set(radiologi)].join(", ")}`);
  if (hasilRadiologi.length)
    bagian.push(`Hasil Radiologi: ${[...new Set(hasilRadiologi)].join(", ")}`);
  return bagian.join("; ") || "-";
});
const rowsObat = computed(() =>
  [...(rujukan.value.obatrujukan || []), ...Array(5)].slice(0, 5)
);
</script>

<style lang="scss" scoped>
.rujukan-print {
  border: 1px solid #000;
  color: #111;
  font-size: 12px;
  line-height: 1.45;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.cell {
  min-height: 43px;
  padding: 5px 9px;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.cell:nth-child(even) {
  border-right: 0;
}
.cell.full-row {
  grid-column: 1 / -1;
  border-right: 0;
}
.cell strong,
.section-title,
.line-section strong,
.therapy-title {
  font-weight: 700;
}
.response {
  min-height: 78px;
}
.transport-grid .cell {
  min-height: 96px;
}
.check-row {
  display: flex;
  gap: 30px;
  padding: 12px 0 5px;
  font-size: 13px;
}
.companion {
  gap: 8px;
}
.line-section {
  min-height: 29px;
  padding: 4px 9px;
  border-bottom: 1px solid #000;
  display: flex;
  gap: 6px;
}
.line-section.multiline {
  min-height: 39px;
  flex-direction: column;
  gap: 1px;
}
.section-title {
  padding: 5px 9px 1px;
}
.vital-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 8px 9px;
  border-bottom: 1px solid #000;
}
.allergy-grid {
  display: grid;
  grid-template-columns: 18% 1fr 17%;
  border-bottom: 1px solid #000;
}
.allergy-grid > div {
  padding: 5px 9px;
  border-right: 1px solid #000;
}
.allergy-grid > div:last-child {
  border-right: 0;
}
.allergy-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.degree {
  text-align: center;
}
.therapy-title {
  padding: 5px 9px;
}
.therapy-table {
  width: calc(100% - 18px);
  margin: 0 9px 10px;
  border-collapse: collapse;
}
.therapy-table th,
.therapy-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  height: 24px;
}
.therapy-table th {
  text-align: center;
}
.therapy-table th:first-child {
  width: 38%;
}
.therapy-table th:not(:first-child) {
  width: 15.5%;
}
.signature-dpjp {
  width: 38%;
  margin: 18px 18px 14px auto;
  text-align: center;
  font-weight: 700;
}
.qrcode-dpjp {
  width: 95px;
  margin: 10px auto 6px;
}
.doctor-name { min-height: 22px; text-decoration: underline; }
@media print {
  .rujukan-print {
    font-size: 11px;
  }
}
</style>
