<template>
  <div v-if="props.dasarpulang !== 'Paksa' && !props.loading">
    <app-no-data />
  </div>
  <div v-if="props.loading">
    <app-loading />
  </div>


  <div v-if="props.dasarpulang === 'Paksa' && !props.loading" class="b full-height q-pa-sm">
    <div class="row q-px-sm q-pb-xs full-width">
      <div class="col-12">
        Yang bertanda tangan di bawah ini Suami / Istri / Ibu / Ayah / Anak dari :
      </div>
    </div>
    <div class="row items-center q-px-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">Nama</div>
          <div class="col-9">: {{ pulang?.nama_penanggungjawab ?? '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">Umur / Kelamin</div>
          <div class="col-9">: {{ pulang?.umur_penanggungjawab ?? '-' }} / {{ pulang?.kelamin_penanggungjawab ?? '-' }}
          </div>
        </div>
        <div class="row">
          <div class="col-3">Alamat</div>
          <div class="col-9">: {{ pulang?.alamat_penanggungjawab ?? '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">Bukti diri / KTP</div>
          <div class="col-9">: {{ pulang?.identitas_penanggungjawab ?? '-' }}</div>
        </div>
      </div>
    </div>
    <div class="row q-px-sm q-pb-xs full-width">
      <div class="col-12 text-justify">
        Dengan ini menyatakan bahwa saya dari keluarga pasien atau pasien sendiri
      </div>
    </div>
    <div class="row items-center q-px-sm q-pb-xs full-width">
      <div class="col">
        <div class="row">
          <div class="col-3">Bernama</div>
          <div class="col-9">: {{ pasien?.nama ?? '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">Umur / Kelamin</div>
          <div class="col-9">: {{ pasien?.usia ?? '-' }} / {{ pasien?.kelamin ?? '-' }}</div>
        </div>
        <div class="row">
          <div class="col-3">Nomor Reg. / RM</div>
          <div class="col-9">: {{ pasien?.noreg ?? '-' }} / {{ pasien?.norm ?? '-' }}</div>
        </div>
        <div class="row">
          <div class="col text-justify">Menyatakan menolak nasehat Dokter / Petugas {{ pasien?.dokter }} untuk dirawat
            selanjutnya
            dan telah memaksa pulang atas
            kemauan sendiri dengan menanggung sendiri segala akibatnya.
          </div>

        </div>
      </div>
    </div>

    <div class="row full-width q-pb-sm">
      <div class="ttd-kanan">

        <div class="">
          Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
        </div>
        <div class="text-bold q-py-xs q-pt-sm">
          Yang membuat pernyataan
        </div>
        <div style="padding-bottom: 80px" />
        <div class="q-py-xs">
          {{ pulang?.nama_penanggungjawab ?? '(...............................................................)' }}
        </div>

      </div>
      <div class="ttd-kiri">
        <div class="q-py-xs invisible">
          .
        </div>
        <div class="text-bold">
          Dokter / Petugas
        </div>
        <div class="column flex-center">
          <div class="q-pt-xs" style="width: 80px;">
            <vue-qrcode :value="qrDokter" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: {
                dark: '#000000',
                light: '#ffffff',
              },
              margin: 0
            }" />
          </div>
        </div>
        <div>
          {{ pasien?.dokter }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { date } from 'quasar'
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
  },
  pulang: {
    type: Object,
    default: null
  },
  dasarpulang: {
    type: String,
    default: null
  }
})


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

.b {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  border-top: none;
}

.b_double {
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

.ttd-kanan {
  position: relative;
  top: 50px;
  text-align: center;
  justify-content: center;
  width: 60%;
  height: 100px;
  left: 40%;
}

.ttd-kiri {
  position: relative;
  bottom: 50px;
  text-align: center;
  justify-content: center;
  width: 50%;
  height: 100px;
}
</style>
