<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar (non-print) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-teal">INDIKASI KELUAR / MASUK RUANG INTENSIF</div>
          <q-badge color="teal" outline class="q-ml-sm">
            {{ items.length }} Dokumen Terbuat
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="items.length">
          <q-btn
            v-print="printAllObj"
            color="teal"
            icon="icon-mat-print"
            label="Cetak Semua Dokumen"
            no-caps
            dense
            class="q-px-md"
          />
        </div>
      </div>
    </div>

    <!-- Container list dokumen -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="!items.length" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-mat-favorite" size="64px" class="q-mb-sm" />
        <div class="text-bold">Belum ada dokumen Indikasi Ruang Intensif</div>
        <div class="text-caption">Belum ada pengisian indikasi keluar/masuk ruang intensif yang dicatat untuk pasien ini.</div>
      </div>

      <div v-else id="print-all-indikasi-intensif" class="column items-center q-gutter-y-md full-width">
        <div
          v-for="(item, idx) in items"
          :key="item.id"
          class="document-container relative-position print-page bg-white q-pa-md shadow-2"
        >
          <!-- Tombol print satuan di atas kanan (non-print) -->
          <div class="absolute-top-right q-pa-md no-print z-top row items-center q-gutter-x-sm">
            <div class="text-caption text-bold text-teal bg-white q-px-sm q-py-xs rounded-borders shadow-1 border-teal">
              {{ item.kategori === 'masuk' ? 'RM IRNA-81' : 'RM IRNA-87' }}
            </div>
            <q-btn
              v-print="getPrintObj(item.id)"
              color="teal"
              round
              icon="icon-mat-print"
              size="sm"
            >
              <q-tooltip class="primary">Cetak Dokumen Ini Saja</q-tooltip>
            </q-btn>
          </div>

          <!-- Wrapper cetak satuan -->
          <div :id="'print-doc-intensif-' + item.id">
            <!-- Kop Surat Standard -->
            <AppKopSuratStandard
              :pasien="pasien"
              :header="[
                'INDIKASI PASIEN',
                item.kategori === 'masuk' ? 'MASUK RUANG' : 'KELUAR DARI RUANG',
                item.jenis_ruangan
              ]"
            />

            <!-- Identitas Pasien -->
            <div class="patient-info q-mt-sm q-pa-sm border-black">
              <div class="row q-col-gutter-xs text-caption-custom">
                <div class="col-6">
                  <div class="row"><div class="col-4 text-bold">Nama Pasien</div><div class="col-8">: {{ pasien?.nama }} ({{ pasien?.kelamin }})</div></div>
                  <div class="row"><div class="col-4 text-bold">Tanggal Lahir / Umur</div><div class="col-8">: {{ humanDate(pasien?.tgllahir) }} ({{ pasien?.usia }})</div></div>
                  <div class="row"><div class="col-4 text-bold">Jenis Kelamin</div><div class="col-8">: {{ pasien?.kelamin }}</div></div>
                  <div class="row"><div class="col-4 text-bold">Alamat</div><div class="col-8">: {{ pasien?.alamat }}</div></div>
                </div>
                <div class="col-6">
                  <div class="row"><div class="col-4 text-bold">No. RM</div><div class="col-8">: {{ pasien?.norm }}</div></div>
                  <div class="row"><div class="col-4 text-bold">Dx Medis</div><div class="col-8">: {{ item.dx_medis || '-' }}</div></div>
                  <div class="row"><div class="col-4 text-bold">Tanggal</div><div class="col-8">: {{ dateFullFormat(item.tanggal) }}</div></div>
                </div>
              </div>
            </div>

            <!-- Konten List Checklist Indikasi -->
            <div class="q-my-md border-black q-pa-md">
              <div class="text-subtitle2 text-bold q-mb-sm text-uppercase">
                Checklist Indikasi Pasien {{ item.kategori === 'masuk' ? 'Masuk' : 'Keluar' }} Ruang {{ item.jenis_ruangan }}:
              </div>

              <!-- Format tampilan Checklist Dinamis (Grouped vs Flat) -->
              <div v-if="isGroupedList(getDocKriteriaList(item))" class="column q-gutter-y-md f-12">
                <div v-for="(grp, gIdx) in getDocKriteriaList(item)" :key="gIdx">
                  <div class="text-bold text-subtitle2 q-mb-xs">{{ grp.groupTitle }}</div>
                  <div class="column q-gutter-y-xs q-pl-sm">
                    <div v-for="(kriteria, kIdx) in grp.items" :key="kIdx" class="row items-start q-gutter-x-xs">
                      <div class="q-mt-xs">
                        <span class="text-bold f-16 q-mr-xs">{{ isChecked(item, kriteria.label || kriteria) ? '☑' : '☐' }}</span>
                      </div>
                      <div :class="{ 'text-bold': isChecked(item, kriteria.label || kriteria) }">
                        {{ kriteria.label || kriteria }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="column q-gutter-y-sm f-12">
                <div v-for="(kriteria, kIdx) in getDocKriteriaList(item)" :key="kIdx" class="row items-start q-gutter-x-sm">
                  <div class="q-mt-xs">
                    <span class="text-bold f-16 q-mr-xs">{{ isChecked(item, kriteria.label || kriteria) ? '☑' : '☐' }}</span>
                  </div>
                  <div>
                    <div :class="{ 'text-bold': isChecked(item, kriteria.label || kriteria) }">{{ kriteria.label || kriteria }}</div>
                    <div v-if="kriteria.sub" class="q-ml-md text-caption text-grey-8">
                      <div v-for="(subItem, subIdx) in kriteria.sub" :key="subIdx">• {{ subItem }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="item.indikasi_lain" class="q-mt-md q-pt-sm border-top-dashed">
                <div class="text-bold text-caption">Indikasi Lain / Catatan Tambahan:</div>
                <div class="text-caption text-grey-9">{{ item.indikasi_lain }}</div>
              </div>
            </div>

            <!-- Tabel Tanda Tangan (Dokter & DPJP) -->
            <div class="q-mt-lg">
              <q-markup-table dense separator="cell" flat bordered wrap-cells class="f-11 text-center border-black">
                <thead>
                  <tr class="bg-grey-2">
                    <th width="33%" class="text-center text-bold">Nama Dokter</th>
                    <th width="34%" class="text-center text-bold">Dokter Penanggung Jawab {{ item.jenis_ruangan }}</th>
                    <th width="33%" class="text-center text-bold">DPJP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="height: 70px;">
                    <td class="vertical-middle">
                      <div class="text-caption text-bold">( Tanda Tangan )</div>
                    </td>
                    <td class="vertical-middle">
                      <div class="full-width flex justify-center q-my-xs" v-if="item.kddokter_pj">
                        <app-qr-petugas
                          :noreg="item.noreg"
                          :jnssurat="'INDIKASI-' + item.jenis_ruangan + '.png'"
                          :asal="'RANAP'"
                          :kdpegsimrs="item.kddokter_pj"
                          width="60px"
                          height="60px"
                        />
                      </div>
                      <div class="text-bold text-caption">{{ item.dokter_pj || '-' }}</div>
                    </td>
                    <td class="vertical-middle">
                      <div class="full-width flex justify-center q-my-xs" v-if="item.kddokter_dpjp">
                        <app-qr-petugas
                          :noreg="item.noreg"
                          :jnssurat="'INDIKASI-' + item.jenis_ruangan + '.png'"
                          :asal="'RANAP'"
                          :kdpegsimrs="item.kddokter_dpjp || pasien?.kodedokterdpjp || pasien?.kddokter"
                          width="60px"
                          height="60px"
                        />
                      </div>
                      <div class="text-bold text-caption">{{ item.dokter_dpjp || pasien?.dokterdpjp || pasien?.dokter || '-' }}</div>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>

          <!-- Pembatas halaman cetak semua -->
          <div class="page-break-after-always" v-if="idx < items.length - 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri'
import { humanDate, dateFullFormat } from 'src/modules/formatter'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  }
})

const store = useAsesmenJatuhNyeriStore()

const printAllObj = {
  id: 'print-all-indikasi-intensif',
  popTitle: 'Seluruh Indikasi Ruang Intensif Pasien'
}

function getPrintObj(itemId) {
  return {
    id: 'print-doc-intensif-' + itemId,
    popTitle: 'Indikasi Ruang Intensif Pasien'
  }
}

const items = computed(() => {
  return store.itemsIndikasiIntensif || []
})

// --- KRITERIA ICU (Sesuai Panduan Masuk & Keluar ICU) ---
const listIndikasiMasukIcu = [
  {
    groupTitle: 'A. Sistem Cardio Vasculair :',
    items: [
      '1) Gagal jantung akut dengan gagal nafas dan atau memerlukan bantuan haemodinamik',
      '2) Hipertensi krisis/Emergency',
      '3) Syock hipovolemia',
      '4) Syock septikemia',
      '5) Syock anafilaksis'
    ]
  },
  {
    groupTitle: 'B. Sistem Pulmonal :',
    items: [
      '1) Gagal nafas akut yang memerlukan ventilasi',
      '2) Emboli paru dengan kondisi hemodinamik yang tidak stabil',
      '3) Pasien dari unit intermediet yang menunjukkan gangguan respirasi',
      '4) Gagal nafas yang memerlukan intubasi segera',
      '5) Edema paru akut dengan distress nafas'
    ]
  },
  {
    groupTitle: 'C. Sistem Neurologi :',
    items: [
      '1) Stroke Akut yang disertai perubahan status mental',
      '2) Koma ; metabolik, toksik, anoksik',
      '3) Perdarahan Intra kranial yang potensial herniasi',
      '4) Meningitis dengan perubahan status mental atau gangguan pernafasan',
      '5) Gangguan sistem syaraf pusat/ neuromoskulair dengan fungsi pulmonal/ neurologi memburuk',
      '6) Status epileptikus',
      '7) Vasospasme',
      '8) Cidera kepala berat',
      '9) Cidera kepala sedang yang kemungkinan memburuk',
      '10) Multiple trauma/ injury'
    ]
  },
  {
    groupTitle: 'D. Overdosis Obat (Drug Ingestion and Drug Overdose) :',
    items: [
      '1) Overdosis disertai unstable haemodinamik',
      '2) Overdosis disertai penurunan kesadaran yang signifikan dan proteksi jalan nafas yang inadekuat',
      '3) Overdosis dengan kejang yang tidak teratasi'
    ]
  },
  {
    groupTitle: 'E. Sistem Gastero Intestinal :',
    items: [
      '1) Perdarahan gastrointestinal yang mengancam jiwa disertai hipotensi, angina, perdarahan, atau komorbid lain',
      '2) Pancreatitis berat'
    ]
  },
  {
    groupTitle: 'F. Sistem Endokrinologi :',
    items: [
      '1) Ketoasidosis diabetik disertai unstable haemodinamik, penurunan kesadaran, insufisiensi pernafasan atau acidosis berat',
      '2) Krisis tiroid atau koma miksedema dengan unstable haemodinamik',
      '3) Status hiperosmolar dengan koma atau unstable haemodinamik',
      '4) Krisis adrenalin yang disertai unstable haemodinamik'
    ]
  },
  {
    groupTitle: 'G. Pembedahan :',
    items: [
      '1) Pasien post operatif yang memerlukan pemantauann hamodinamik/ bantuan ventilasi/ memerlukan perawatan intensif/ analgetik continue/ komorbid multiple',
      '2) Post operatif pembedahan mayor'
    ]
  },
  {
    groupTitle: 'H. Pediatrik :',
    items: [
      '1) Dengoe syock syndroma dengan syock berulang',
      '2) Meningoencepalitis dengan unstable haemodinamik',
      '3) Status convulsi dengan unstable haemodinamik',
      '4) Cyanotic Congenital Hearth Deaseas',
      '5) Infeksi saluran pernafasan dengan pernafasan tidak adequat'
    ]
  },
  {
    groupTitle: 'I. Maternitas :',
    items: [
      '1) Pre/ Pasca melahirkan dengan distress nafas dan gangguan haemodinamik',
      '2) Pre/ Pasca melahirkan dengan perdarahan masif dan Unstable haemodinamik',
      '3) Pre Ekalmsia/ Eklamsia dengan HELLP Syndroma'
    ]
  },
  {
    groupTitle: 'J. Gangguan lain :',
    items: [
      '1) Syock septik disertai unstable haemodinamik',
      '2) Pemantauan haemodinamik',
      '3) Trauma lingkungan (listrik/ tenggelam/ hipotermia/ hipertermia/ chemis)'
    ]
  }
]

const listIndikasiKeluarIcu = [
  {
    groupTitle: 'Prioritas I :',
    items: [
      'Haemodinamik dan vital sign pasien stabil baik > 48 jam.',
      'Kegawatan dan resiko kegawatan acut telah terastasi.',
      'Tingkat kesadaran stabil ≥10 selama ≥72 jam dan tidak tampak tanda-tanda peningkatan tekanan Intra Cranial.',
      'Ditemukan penyakit Primer atau komorbid dengan penularan melalui airbone/ drop plet transmition.'
    ]
  },
  {
    groupTitle: 'Prioritas II :',
    items: [
      'Tingkat kesadaran ≥ 10 tanpa perkembangan yang berarti setelah mendapatkan perawatan ≥ 7 x 24 jam.',
      'Dengan kegagalan multiorgan (multi organ failur) yang tidak responsive dengan therapi intensif.',
      'Kondisi haemo dinamik dan vital sign tidak stabil namun keluarga/ pasien menolak therapi intensif.',
      'Pasien stadium terminal dengan kegawatan akut yang telah teratasi.'
    ]
  }
]

// --- KRITERIA ICCU ---
const listIndikasiMasukIccu = [
  { label: 'Sindrom Koroner Akut (UAP, NSTEMI, STEMI)', sub: null },
  {
    label: 'Edema Paru Akut',
    sub: ['Dyspnoe', 'RR > 28 x/mnt', 'Ronkhi +', 'Akral dingin, basah']
  },
  { label: 'Gagal Jantung Akut', sub: null },
  { label: 'Aritmia maligna atau dengan gangguan hemodinamik', sub: null },
  { label: 'Syokcardiogenik : HR > 100 x/mnt, TDS < 100 mmHg', sub: null },
  { label: 'Pasca tindakan Invasive kardiologi, post pemasangan TPM/PPM', sub: null },
  { label: 'Miokarditis', sub: null },
  { label: 'Penyakit lain yang memerlukan pemantauan hemodinamik', sub: null }
]

const listIndikasiKeluarIccu = [
  'Keadaan penderita sudah tidak memerlukan perawatan intensif dan bisa dirawat di ruangan',
  'Kegawatan penderita bukan disebabkan oleh penyakit jantung dan dipindahkan ke unit lain perawatan intensif',
  'Penderita yang meninggal dan dikeluarkan dari ICCU',
  'Penderita yang ingin dirawat di rumah sakit lain atas permintaan sendiri/keluarga',
  'Penderita yang pulang paksa setelah menandatangani pernyataan tidak ingin dirawat di RSUD Dr. Moh. Saleh Kota Probolinggo',
  'Pasien dirujuk dengan indikasi medis atas advis dokter',
  'Pasien/keluarga pindah ruangan atas permintaan sendiri setelah menandatangani pernyataan penolakan dirawat di ICCU'
]

// --- KRITERIA NICU (SS Masuk & Keluar NICU) ---
const listIndikasiMasukNicu = [
  {
    groupTitle: 'Pasien yang membutuhkan perawatan NICU adalah semua bayi yang memerlukan monitor/observasi ketat :',
    items: [
      'Memerlukan O2 > 60%',
      'Memerlukan CPAP/Ventilator',
      'NKB < 32mg, BBL < 1500gr',
      'Asfiksia berat, syok, sering apnoe/kejang, gangguan perdarahan',
      'Mengalami masalah metabolic',
      'Bayi dengan kelainan congenital berat'
    ]
  },
  {
    groupTitle: 'Kriteria pasien yang membutuhkan perawatan intermediate :',
    items: [
      'Bayi yang baru keluar dari NICU, masih perlu monitor dan observasi',
      'Bayi yang memerlukan O2 < 60%',
      'NKB 32-34mg, kondisi stabil, BBL > 1500gr',
      'NKB 34-36mg, kondisi stabil, reflek hisap lemah',
      'Bayi yang dipuasakan / EKN',
      'Bayi yang memerlukan tranfusi tukar',
      'Bayi yang sering muntah',
      'Bayi dengan kelainan kronik (CLD)',
      'Bayi yang memerlukan fototerapi dengan masalah lain : dehidrasi, minum personde',
      'Bayi dengan kelainan congenital ringan, missal celah bibir',
      'Bayi dengan ibu DM',
      'Bayi dengan asfiksia sedang, nilai APGAR pada 5 menit < 7'
    ]
  }
]

const listIndikasiKeluarNicu = [
  {
    groupTitle: 'KRITERIA KELUAR DARI NICU :',
    items: [
      '1. Kondisi bayi mulai stabil, tidak mengalami syock, apnu, kejang atau gangguan pendarahan',
      '2. Tidak memerlukan O2>60%, Ventilator, CPAP',
      '3. Tidak mengalami masalah metabolik',
      '4. Pasien pulang paksa',
      '5. Pasien dirujuk/alih rawat di rumah sakit lain',
      '6. Pasien meninggal'
    ]
  },
  {
    groupTitle: 'KRITERIA KELUAR DARI INTERMEDIATE :',
    items: [
      '1. Kondisi bayi stabil baik (TTV normal, tidak cyanosis, tidak ikterus, tidak anemis, tidak muntah)',
      '2. Tidak memerlukan O2',
      '3. Reflek hisap baik',
      '4. Program terapi sudah selesai',
      '5. Untuk BBLR, BB minimal 1800 gram, sudah tidak memerlukan penghangat',
      '6. Pasien pulang paksa',
      '7. Pasien dirujuk / alih rawat di rumah sakit lain'
    ]
  },
  {
    groupTitle: 'KRITERIA KELUAR DARI TRANSISI :',
    items: [
      '1. Kondisi bayi tetap stabil baik (TTV normal, tidak cyanosis, tidak ikterus, tidak anemis, tidak muntah)',
      '2. Reflek hisap baik',
      '3. Program terapi sudah selesai',
      '4. Untuk BBLR, BB minimal 1800 gram, sudah tidak memerlukan penghangat'
    ]
  }
]

// --- KRITERIA INTERMEDIATE ---
const listIndikasiMasukIntermediate = [
  'Bayi yang baru keluar dari NICU, masih perlu monitor dan observasi',
  'Bayi yang memerlukan O2 < 60%',
  'NKB 32-34mg, kondisi stabil, BBL > 1500gr',
  'NKB 34-36mg, kondisi stabil, reflek hisap lemah',
  'Bayi yang dipuasakan / EKN',
  'Bayi yang memerlukan tranfusi tukar',
  'Bayi yang sering muntah',
  'Bayi dengan kelainan kronik (CLD)',
  'Bayi yang memerlukan fototerapi dengan masalah lain : dehidrasi, minum personde',
  'Bayi dengan kelainan congenital ringan, missal celah bibir',
  'Bayi dengan ibu DM',
  'Bayi dengan asfiksia sedang, nilai APGAR pada 5 menit < 7'
]

const listIndikasiKeluarIntermediate = [
  '1. Kondisi bayi stabil baik (TTV normal, tidak cyanosis, tidak ikterus, tidak anemis, tidak muntah)',
  '2. Tidak memerlukan O2',
  '3. Reflek hisap baik',
  '4. Program terapi sudah selesai',
  '5. Untuk BBLR, BB minimal 1800 gram, sudah tidak memerlukan penghangat',
  '6. Pasien pulang paksa',
  '7. Pasien dirujuk / alih rawat di rumah sakit lain'
]

function isGroupedList(list) {
  return Array.isArray(list) && list.length > 0 && typeof list[0] === 'object' && 'groupTitle' in list[0]
}

function getDocKriteriaList(item) {
  const ruang = item.jenis_ruangan
  const kat = item.kategori
  if (ruang === 'ICU') {
    return kat === 'masuk' ? listIndikasiMasukIcu : listIndikasiKeluarIcu
  } else if (ruang === 'NICU') {
    return kat === 'masuk' ? listIndikasiMasukNicu : listIndikasiKeluarNicu
  } else if (ruang === 'INTERMEDIATE') {
    return kat === 'masuk' ? listIndikasiMasukIntermediate : listIndikasiKeluarIntermediate
  }
  return kat === 'masuk' ? listIndikasiMasukIccu : listIndikasiKeluarIccu
}

function isChecked(item, kriteriaLabel) {
  if (!item || !item.pilihan_indikasi || !Array.isArray(item.pilihan_indikasi)) return false
  return item.pilihan_indikasi.includes(kriteriaLabel)
}

onMounted(() => {
  if (props.pasien) {
    store.getData(props.pasien)
  }
})
</script>

<style lang="scss" scoped>
.z-top {
  z-index: 99;
}
.document-container {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
}
.border-teal {
  border: 1px solid var(--q-teal);
}
.border-black {
  border: 1px solid #000;
}
.border-top-dashed {
  border-top: 1px dashed #ccc;
}
.patient-info {
  border: 1px solid #000;
  border-radius: 4px;
}
.text-caption-custom {
  font-size: 11px;
  line-height: 1.3;
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-page {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    padding: 8mm !important;
    box-shadow: none !important;
  }
  .page-break-after-always {
    page-break-after: always !important;
    break-after: page !important;
    height: 0 !important;
    margin: 0 !important;
  }
}
</style>
