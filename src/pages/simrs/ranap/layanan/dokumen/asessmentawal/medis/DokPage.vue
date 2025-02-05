<template>

  <div id="pdfDoc" class="bg-white print-page">


    <!-- KOP SURAT -->
    <div class="col-grow kotak">
      <div class="row items-center">

        <div class="col-9 sisi-kanan">
          <div class="row q-pa-sm">
            <div class="col-auto">
              <img src="~assets/images/logo-kota-grey.png" width="50">
            </div>
            <div class="col flex-wrap q-px-lg">
              <div class="text-left">
                <!-- <div class="text-weight-bold f-12">
                    PEMERINTAH KOTA PROBOLINGGO
                  </div> -->
                <!-- <div class="text-weight-bold f-10">
                    DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA
                  </div> -->
                <div class="text-weight-bold f-14">
                  UOBK RSUD DOKTER MOHAMAD SALEH
                </div>
                <div class="f-12">
                  <div>Jl. Mayjend Panjaitan No.65 Probolinggo Jawa Timur</div>
                  <div>Telp. (0335) 433478,433119,421118 Fax. (0335) 432702</div>
                  <!-- <div>PROBOLINGGO – 67219</div> -->
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
            RAWAT INAP
          </div>
          <div class="text-center text-bold">
            {{ kasus?.uraian.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pasien -->
    <div class="flex justify-between kotak q-mt-xs q-pa-sm" style="gap:0 10px">
      <div class="col-auto">Nama : {{ pasien?.nama_panggil }}</div>
      <div class="col-auto">No. Register : {{ pasien?.noreg }}</div>
      <div class="col-auto">Tanggal : {{ dateFullFormat(pasien?.tglmasuk) }}</div>
      <div class="col-auto">Jam : {{ jamTnpDetik(pasien?.tglmasuk) }}</div>
    </div>

    <!-- Anamnesis -->

    <div class="section">
      <div class="section-title">Anamnesis</div>
      <div class="data">
        <div class="data-item">1. Keluhan Utama / Chief Complaint : {{ anamnesisAwal?.keluhanUtama || '-' }}</div>
        <div class="data-item">2. Riwayat Penyakit Sekarang / Present Disease History : {{
          anamnesisAwal?.riwayatpenyakitsekarang || '-' }}</div>
        <div class="data-item">3. Riwayat Penyakit Dahulu / Past Disease History : {{ anamnesisAwal?.riwayatpenyakit ||
          '-' }}</div>
        <div class="data-item">4. Riwayat Penyakit Keluarga / History Disease in the Family : {{
          anamnesisAwal?.riwayatpenyakitkeluarga || '-' }}</div>
        <div class="data-item">5. Riwayat Pekerjaan / History of Job : {{
          anamnesisAwal?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya || '-' }}</div>
        <div class="data-item">6. Status Sosial / Social Status : {{ pemeriksaanUmum?.sosial || '-' }}</div>
        <div class="data-item">7. Status Ekonomi / Economic Status : {{ pemeriksaanUmum?.ansuransi || '-' }} {{
          pemeriksaanUmum?.ansuransi ? 'Ansuransi' : '' }}
        </div>
        <div class="data-item">8. Status Kejiwaan dan Kebiasaan / Psychological Status : {{
          pemeriksaanUmum?.statusPsikologis }}</div>
        <div class="data-item flex">9. Kultural / Cultural :
          <div class="q-ml-sm">
            <div>- Pola Komunikasi {{ pemeriksaanUmum?.komunikasi }}</div>
            <div>- Pantangan Makanan {{ pemeriksaanUmum?.pantanganMkanan }}</div>
            <div>- makanan Pokok : {{ pemeriksaanUmum?.makananPokok }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Pemeriksaan Umum</div>
      <div class="data">
        <div class="data-item">Kesadaran: ............................................</div>
        <div class="data-item">Tekanan Darah: ............................................ mmHg</div>
        <div class="data-item">Nadi: ............................................ x/menit</div>
        <div class="data-item">Suhu: ............................................ &deg;C</div>
        <div class="data-item">Pernapasan: ............................................ x/menit</div>
        <div class="data-item">Keadaan Umum: Baik / Sedang / Buruk</div>
        <div class="data-item">Keadaan Gizi: Baik / Sedang / Buruk</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Bagian</th>
          <th>Normal</th>
          <th>Jika Tidak Normal, Jelaskan</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Kepala (Head)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Mata (Eyes)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>THT (ENT)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Mulut (Mouth)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Leher (Neck)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Jantung (Heart)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Dada & Payudara (Chest & Breast)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Perut (Abdomen)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Urogenital</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Anggota Gerak (Extremities)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Status Neurologis (Neurological Status)</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
        <tr>
          <td>Muskuloskeletal</td>
          <td>............................................</td>
          <td>............................................</td>
        </tr>
      </tbody>
    </table>
  </div>



</template>

<script setup>
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter';
import { computed } from 'vue';




const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})



console.log('props', props?.pasien);

const anamnesisAwal = computed(() => {
  const awal = props?.pasien?.anamnesis?.find(x => x?.awal === '1' && x?.nakes === '1') || null
  console.log('awal', awal);

  return awal
})
const pemeriksaanUmum = computed(() => {
  const awal = props?.pasien?.pemeriksaan?.find(x => x?.awal === '1' && x?.nakes === '1') || null
  console.log('awal', awal);

  return awal
})

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