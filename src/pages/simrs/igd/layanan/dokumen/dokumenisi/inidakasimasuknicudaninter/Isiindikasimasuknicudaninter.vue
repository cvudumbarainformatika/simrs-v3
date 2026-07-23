<template>
  <!-- LOADING -->
  <div v-if="props.loading">
    <app-loading />
  </div>

  <!-- TIDAK ADA DATA -->
  <div v-else-if="!props.kelas">
    <app-no-data />
  </div>

  <!-- DOKUMEN -->
  <div v-else class="b full-height q-pa-sm">
    <!-- ===================== ICCU ===================== -->
    <template v-if="kelasNormalized === 'ICCU'">
      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          Prioritas I
        </div>
      </div>

      <div v-for="item in iccu" :key="item">
        <div class="row q-px-sm q-py-xs">
          <div class="col-auto" style="width: 24px">
            {{ isChecked(item) ? '☑' : '☐' }}
          </div>

          <div class="col">
            {{ item }}
          </div>
        </div>

        <div v-if="item === 'Edema Paru Akut'" class="q-ml-xl q-mb-sm">
          <div>• Dyspnoe</div>
          <div>• RR &gt; 28 x/mnt</div>
          <div>• Ronkhi +</div>
          <div>• Akral dingin, basah</div>
        </div>
      </div>
    </template>

    <!-- ===================== NICU ===================== -->
    <template v-else-if="kelasNormalized === 'NICU'">
      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          Pasien yang membutuhkan perawatan NICU adalah semua bayi yang
          memerlukan monitor / observasi ketat:
        </div>
      </div>

      <div v-for="item in nicu.a" :key="item">
        <div class="row q-px-sm q-py-xs">
          <div class="col-auto" style="width: 24px">
            {{ isChecked(item) ? '☑' : '☐' }}
          </div>

          <div class="col">
            {{ item }}
          </div>
        </div>
      </div>

      <div class="row q-px-sm q-py-sm full-width">
        <div class="col-12 text-weight-bold">
          Kriteria pasien yang membutuhkan perawatan intermediate:
        </div>
      </div>

      <div v-for="item in nicu.b" :key="item">
        <div class="row q-px-sm q-py-xs">
          <div class="col-auto" style="width: 24px">
            {{ isChecked(item) ? '☑' : '☐' }}
          </div>

          <div class="col">
            {{ item }}
          </div>
        </div>
      </div>
    </template>

    <!-- ===================== ICU ===================== -->
    <template v-else-if="kelasNormalized === 'ICU'">
      <div class="text-center text-weight-bold text-subtitle1 q-mb-md">
        KRITERIA PASIEN MASUK ICU
      </div>

      <div v-for="kategori in kriteriaIcu" :key="kategori.kode" class="q-mb-md page-break">
        <!-- JUDUL KATEGORI -->
        <div class="row q-px-sm q-py-xs bg-grey-3">
          <div class="col-12 text-weight-bold">
            {{ kategori.kode }}. {{ kategori.nama }}
          </div>
        </div>

        <!-- DAFTAR KRITERIA -->
        <div v-for="(item, index) in kategori.items" :key="`${kategori.kode}-${index}`"
          class="row no-wrap q-px-sm q-py-xs items-start">
          <div class="col-auto q-mr-sm" style="width: 24px">
            {{ isCheckedIcu(kategori.kode, kategori.nama, item) ? '☑' : '☐' }}
          </div>

          <div class="col-auto q-mr-xs" style="width: 24px">
            {{ index + 1 }}.
          </div>

          <div class="col">
            {{ item }}
          </div>
        </div>
      </div>
    </template>

    <!-- KETERANGAN -->
    <div v-if="props.keterangan" class="q-px-sm q-py-md">
      <div class="text-weight-bold">
        Keterangan:
      </div>

      <div>
        {{ props.keterangan }}
      </div>
    </div>

    <!-- ===================== TANDA TANGAN ===================== -->
    <div class="row q-pb-xs q-pt-sm justify-center full-width page-break">
      <div class="row" style="width: 98%">
        <table class="items-center full-width">
          <thead>
            <tr>

              <th class="text-center">
                Dokter Penanggung Jawab {{ kelasNormalized }}
                <div class="text-subtitle2">
                  {{ props.pasien?.planheder[0]?.planranap?.dokumentransfer?.dokter?.nama }}
                </div>
              </th>

              <th class="text-center">
                <div>DPJP</div>

                <div class="text-subtitle2">
                  {{ props.pasien?.dokter }}
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="align-middle q-pl-sm">
            <tr>
              <td class="text-center">
                <div class="column flex-center">
                  <div v-if="props.pasien?.planheder[0]?.planranap?.dokumentransfer?.dokter" class="q-pt-xs"
                    style="width: 80px">
                    <vue-qrcode :value="qrDokterpenerima" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff'
                      },
                      margin: 0
                    }" />
                  </div>
                </div>
              </td>

              <td class="text-center">
                <div class="column flex-center">
                  <div v-if="props.pasien?.dokter" class="q-pt-xs" style="width: 80px">
                    <vue-qrcode :value="qrDokter" tag="svg" :options="{
                      errorCorrectionLevel: 'Q',
                      color: {
                        dark: '#000000',
                        light: '#ffffff'
                      },
                      margin: 0
                    }" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },

  kelas: {
    type: String,
    default: null
  },

  keterangan: {
    type: String,
    default: null
  },

  isi: {
    type: Array,
    default: () => []
  },

  loading: {
    type: Boolean,
    default: false
  }
})

const kelasNormalized = computed(() => {
  return String(props.kelas ?? '')
    .trim()
    .toUpperCase()
})

const iccu = [
  'Sindrom Koroner Akut (UAP, NSTEMI, STEMI)',
  'Edema Paru Akut',
  'Gagal jantung akut',
  'Aritmia maligna atau dengan gangguan hemodinamik',
  'Syokkardiogenik : HR > 100 x per mnt, TDS < 100 mmHg',
  'Pasca tindakan Invasive kardiologi, post pemasangan TPM/PPM',
  'Miokarditis',
  'Penyakit lain yang memerlukan pemantauan hemodinamik'
]

const nicu = {
  a: [
    'Memerlukan O2 > 60%',
    'Memerlukan CPAP/Ventilator',
    'NKB < 32 mg, BBL < 1500 gr',
    'Asfiksia berat, syok, sering apnoe atau kejang, gangguan perdarahan',
    'Mengalami masalah metabolic',
    'Bayi dengan kelainan congenital berat'
  ],

  b: [
    'Bayi yang baru keluar dari NICU, masih perlu monitor dan observasi',
    'Bayi yang memerlukan O2 < 60%',
    'NKB 32-34 mg, kondisi stabil, BBL > 1500 gr',
    'NKB 34-36 mg, kondisi stabil, reflek hisap lemah',
    'Bayi yang dipuasakan atau EKN',
    'Bayi yang memerlukan tranfusi tukar',
    'Bayi yang sering muntah',
    'Bayi dengan kelainan kronik (CLD)',
    'Bayi yang memerlukan foto terapi dengan masalah lain : dehidrasi, minum personde',
    'Bayi dengan kelainan congenital ringan, missal celah bibir',
    'Bayi dengan ibu DM',
    'Bayi dengan asfiksia sesdang, nilai APGAR pada 5 menit < 7'
  ]
}

const kriteriaIcu = [
  {
    kode: 'A',
    nama: 'Sistem Cardio Vasculair',
    items: [
      'Gagal jantung akut dengan gagal napas dan/atau memerlukan bantuan hemodinamik',
      'Hipertensi krisis atau hipertensi emergency',
      'Syok hipovolemia',
      'Syok septikemia',
      'Syok anafilaksis'
    ]
  },
  {
    kode: 'B',
    nama: 'Sistem Pulmonal',
    items: [
      'Gagal napas akut yang memerlukan ventilasi',
      'Emboli paru dengan kondisi hemodinamik yang tidak stabil',
      'Pasien dari unit intermediet yang menunjukkan gangguan respirasi',
      'Gagal napas yang memerlukan intubasi segera',
      'Edema paru akut dengan distress napas'
    ]
  },
  {
    kode: 'C',
    nama: 'Sistem Neurologi',
    items: [
      'Stroke akut yang disertai perubahan status mental',
      'Koma metabolik, toksik, atau anoksik',
      'Perdarahan intrakranial yang berpotensi menyebabkan herniasi',
      'Meningitis dengan perubahan status mental atau gangguan pernapasan',
      'Gangguan sistem saraf pusat atau neuromuskular dengan fungsi pulmonal atau neurologi yang memburuk',
      'Status epileptikus',
      'Vasospasme',
      'Cedera kepala berat',
      'Cedera kepala sedang yang kemungkinan memburuk',
      'Multiple trauma atau multiple injury'
    ]
  },
  {
    kode: 'D',
    nama: 'Overdosis Obat',
    items: [
      'Overdosis disertai hemodinamik tidak stabil',
      'Overdosis disertai penurunan kesadaran yang signifikan dan proteksi jalan napas yang tidak adekuat',
      'Overdosis dengan kejang yang tidak teratasi'
    ]
  },
  {
    kode: 'E',
    nama: 'Sistem Gastrointestinal',
    items: [
      'Perdarahan gastrointestinal yang mengancam jiwa disertai hipotensi, angina, perdarahan, atau komorbid lain',
      'Pankreatitis berat'
    ]
  },
  {
    kode: 'F',
    nama: 'Sistem Endokrinologi',
    items: [
      'Ketoasidosis diabetik disertai hemodinamik tidak stabil, penurunan kesadaran, insufisiensi pernapasan, atau asidosis berat',
      'Krisis tiroid atau koma miksedema dengan hemodinamik tidak stabil',
      'Status hiperosmolar dengan koma atau hemodinamik tidak stabil',
      'Krisis adrenal yang disertai hemodinamik tidak stabil',
      'Hipokalsemia, hiperkalsemia, hiponatremia, hipernatremia, hipomagnesemia, hipermagnesemia, hipofosfatemia, atau hiperfosfatemia yang memerlukan koreksi'
    ]
  },
  {
    kode: 'G',
    nama: 'Pembedahan',
    items: [
      'Pasien pascaoperatif yang memerlukan pemantauan hemodinamik, bantuan ventilasi, perawatan intensif, analgetik kontinu, atau memiliki komorbid multipel',
      'Pascaoperatif pembedahan mayor'
    ]
  },
  {
    kode: 'H',
    nama: 'Pediatrik',
    items: [
      'Dengue shock syndrome dengan syok berulang',
      'Meningoensefalitis dengan hemodinamik tidak stabil',
      'Status konvulsi dengan hemodinamik tidak stabil',
      'Cyanotic congenital heart disease',
      'Infeksi saluran pernapasan dengan pernapasan tidak adekuat'
    ]
  },
  {
    kode: 'I',
    nama: 'Maternitas',
    items: [
      'Pra atau pascamelahirkan dengan distress napas dan gangguan hemodinamik',
      'Pra atau pascamelahirkan dengan perdarahan masif dan hemodinamik tidak stabil',
      'Preeklamsia atau eklamsia dengan HELLP syndrome'
    ]
  },
  {
    kode: 'J',
    nama: 'Gangguan Lain',
    items: [
      'Syok septik disertai hemodinamik tidak stabil',
      'Memerlukan pemantauan hemodinamik',
      'Trauma lingkungan seperti tersengat listrik, tenggelam, hipotermia, hipertermia, atau paparan bahan kimia'
    ]
  }
]

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

/**
 * Digunakan untuk data ICCU dan NICU lama,
 * yaitu data props.isi yang hanya berisi teks.
 */
function isChecked(item) {
  if (!Array.isArray(props.isi)) return false

  return props.isi.some((nilai) => {
    if (typeof nilai !== 'string') return false

    return normalizeText(nilai) === normalizeText(item)
  })
}

/**
 * Format data ICU di database:
 *
 * A | Sistem Cardio Vasculair | Gagal jantung akut...
 */
function isCheckedIcu(kodeKategori, namaKategori, itemKriteria) {
  if (!Array.isArray(props.isi)) return false

  return props.isi.some((nilai) => {
    if (typeof nilai !== 'string') return false

    const bagian = nilai
      .split('|')
      .map((bagianItem) => bagianItem.trim())

    const kodeDb = bagian[0] ?? ''
    const namaDb = bagian[1] ?? ''
    const indikasiDb = bagian.slice(2).join(' | ')

    return (
      normalizeText(kodeDb) === normalizeText(kodeKategori) &&
      normalizeText(namaDb) === normalizeText(namaKategori) &&
      normalizeText(indikasiDb) === normalizeText(itemKriteria)
    )
  })
}

const qrDokterpenerima = computed(() => {
  const noreg = props.pasien?.noreg ?? ''
  const dok = 'RAWAT JALAN.png'
  const asal = 'RAWAT JALAN'
  const petugas = props.pasien?.planheder[0]?.planranap?.dokumentransfer?.dokter?.kdpegsimrs ?? ''

  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)

  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})

const qrDokter = computed(() => {
  const noreg = props.pasien?.noreg ?? ''
  const dok = 'RAWAT JALAN.png'
  const asal = 'RAWAT JALAN'
  const petugas = props.pasien?.kodedokter ?? ''

  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)

  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
})
</script>

<style lang="scss" scoped>
.b {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  border-top: none;
}

.b-double {
  border-bottom: 4px double rgb(30, 30, 30);
  border-left: none;
  border-right: none;
  border-top: none;
  padding-top: 8px;
}

.b1 {
  border: 2px solid #000;
}

.b2 {
  border-right: 2px solid #000;
  border-left: none;
  border-bottom: none;
  border-top: none;
}

.b3 {
  border-bottom: 2px solid #000;
  border-left: none;
  border-right: none;
  border-top: none;
}

.b4 {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: none;
  border-top: none;
}

.b5 {
  border-left: 2px solid #000;
  border-right: none;
  border-bottom: none;
  border-top: none;
}

table {
  border-color: black;
}

table,
th,
td {
  border-width: 1px;
  border-style: solid;
  border-collapse: collapse;
}

th,
td {
  padding: 6px 10px;
}

.page-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

.print-page {
  background-color: #ffffff;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0 !important;
  }

  @page {
    size: A4;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD Mohamad Saleh | Hal Ke-" counter(page);
      font-size: 8pt;
    }
  }

  .contentx {
    page-break-after: auto;
  }
}
</style>
