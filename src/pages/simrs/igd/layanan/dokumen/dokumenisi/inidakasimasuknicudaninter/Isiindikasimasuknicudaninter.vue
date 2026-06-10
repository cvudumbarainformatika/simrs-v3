<template>
  <div v-if="!props.keterangan && !props.loading">
    <app-no-data />
  </div>
  <div v-if="props.loading">
    <app-loading />
  </div>
  <div v-if="props.keterangan && !props.loading" class="b full-height q-pa-sm">
    <!-- Pasien yang membutuhkan perawatan Di Ruang {{
      props?.kelas }}
    dengan kesimpulan : <br>
    <br>
    <div v-for="(item, n) in props.isi" :key="n">
      - {{ item }}
    </div>
    <br>
    <div>
      Keterangan : {{ props?.keterangan }}
    </div> -->


    <template v-if="props.kelas === 'ICCU' && !props.loading">
      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          Prioritas I
        </div>
      </div>

      <div v-for="item in iccu" :key="item">
        <div class="row q-px-sm q-py-xs">
          <div class="col-auto" style="width:24px">
            {{ isChecked(item) ? '☑' : '☐' }}
          </div>

          <div class="col">
            {{ item }}
          </div>
        </div>

        <!-- selalu tampil tepat di bawah Edema Paru Akut -->
        <div v-if="item === 'Edema Paru Akut'" class="q-ml-xl q-mb-sm">
          <div>• Dyspnoe</div>
          <div>• RR &gt; 28 x/mnt</div>
          <div>• Ronkhi +</div>
          <div>• Akral dingin, basah</div>
        </div>
      </div>
    </template>
    <template v-if="props.kelas === 'NICU' && !props.loading">
      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          Pasien yang membutuhkan perawatan NICU adalah semua bayi yang memerlukan monitor / observasi ketat :
        </div>
      </div>

      <div v-for="item in nicu?.a" :key="item">
        <div class="row q-px-sm q-py-xs">
          <div class="col-auto" style="width:24px">
            {{ isChecked(item) ? '☑' : '☐' }}
          </div>

          <div class="col">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="row q-px-sm q-pb-xs full-width">
        <div class="col-12 text-weight-bold">
          Kriteria pasien yang membutuhkan perawatan intermediate :
        </div>
      </div>
      <div v-for="item in nicu?.b" :key="item">
        <div class="row q-px-sm q-py-xs">
          <div class="col-auto" style="width:24px">
            {{ isChecked(item) ? '☑' : '☐' }}
          </div>

          <div class="col">
            {{ item }}
          </div>
        </div>
      </div>
    </template>
    <!-- <template v-else>
      <div class="row q-pb-xs q-pt-sm justify-center full-width full-height">
        Tidak Ada Data
      </div>
    </template> -->

    <div class="row q-pb-xs q-pt-sm justify-center full-width full-height ">
      <div class="row" style="width: 98%;">
        <table class="items-center full-width">
          <thead>
            <tr style="">
              <th class="text-center">
                Nama Dokter
              </th>
              <th class="text-center">
                Dokter Penanggung Jawab ICCU
              </th>
              <th class="text-center">
                <div>DPJP</div>
                <div class="text-subtitle2">{{ pasien?.dokter }}</div>
              </th>
            </tr>
          </thead>
          <tbody class="align-middle q-pl-sm">
            <tr>
              <td class="text-center text-italic">
                {{ 'Tanda Tangan' }}
              </td>
              <td class="text-rigth">
                <span class="text-h7"></span>
              </td>
              <td class="text-rigth">
                <div class="column flex-center">
                  <div class="q-pt-xs" style="width: 80px;">
                    <template v-if="pasien?.dokter">
                      <vue-qrcode :value="qrDokter" tag="svg" :options="{
                        errorCorrectionLevel: 'Q',
                        color: {
                          dark: '#000000',
                          light: '#ffffff',
                        },
                        margin: 0
                      }" />
                    </template>
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
    'Bayi dengan kelainan congenital berat',
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
    'Bayi dengan asfiksia sesdang, nilai APGAR pada 5 menit < 7',
  ]
}

const isChecked = (item) => props.isi?.includes(item)


const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  // const enc = btoa(`${petugas}`)
  // return `${enc}`

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Indikasi Masuk Rawat Inap.png'
  const asal = 'RAWAT JALAN'
  const petugas = props.pasien?.kodedokter
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})
// const store = usePlannStore();
// const isi = store?.isiindikasimasuknicu?.planranap?.dokumentransfer?.isi ? JSON.parse(store?.isiindikasimasuknicu?.planranap?.dokumentransfer?.isi) : '-'
</script>
<style lang="scss" scoped>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.b1 {
  border-style: solid;
  border-width: 2px;
}

.b2 {
  border-right-style: solid;
  border-width: 2px;
}

.b3 {
  border-bottom-style: solid;
  border-width: 2px;
}

.b4 {
  border-right-style: solid;
  border-left-style: solid;
  border-width: 2px;
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

td {
  padding-left: 10px;
  padding-right: 10px;
}

.page-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  font-size: 12px;
}

@media print {
  .print-page {
    padding: 0px !important;
  }

  @page {
    // size: 8.5in 9in;
    size: a4;
    page-break-inside: avoid;

    @bottom-right {
      content: "Dokumen Sah dari RSUD Mohamad Saleh | Hal Ke-" counter(page);
      font-size: 8pt;
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}
</style>
