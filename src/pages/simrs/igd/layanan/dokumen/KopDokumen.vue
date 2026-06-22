<template>
  <div class="col-auto print-page">
    <div class="b1">
      <div class="row justify-between full-width full-height">
        <div class="col-2 q-px-xs flex items-center justify-center text-center">
          <q-img src="~assets/logos/logo-rsud.png" style="width: 2.5cm;" fit="contain" :ratio="1" />
        </div>
        <div class=" col q-py-sm flex items-center justify-center text-center">
          <!-- <div class="row flex-center"> -->
          <div class="flex-center text-center">
            <div class="text-bold">PEMERINTAH KOTA PROBOLINGGO</div>
            <div class="text-bold">
              DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
            </div>
            <div class="text-bold" style="font-size: 16px">
              UOBK RSUD DOKTER MOHAMAD SALEH
            </div>
            <div class="row  justify-center">
              Jl. Mayjend Panjaitan No. 65 Telp. (0335) 433119,421118 Fax. (0335) 432705
            </div>
            <div class="row justify-center ">
              E-mail : rsudprob@probolinggokota.go.id
            </div>
            <div class="row justify-center ">
              PROBOLINGGO 67219
            </div>
          </div>
          <!-- </div> -->
        </div>
        <div class="b5 col-2 flex items-center justify-center text-center">
          <div class="text-bold q-px-sm" style="font-size: 12px;">{{ props?.judul }} {{ props?.kelas }}
            {{ props?.dasarpulang }}</div>
        </div>
      </div>
    </div>

    <div v-if="props?.jangantampil !== true" class="col b4 q-pa-sm">
      <div class="row flex-center">
        <div class="col-3">
          No. RM
        </div>
        <div class="col-3">
          : {{ pasien?.norm }}
        </div>
        <div class="col-3">
          No. Reg
        </div>
        <div class="col-3">
          : {{ pasien?.noreg }}
        </div>
      </div>
      <div class="row flex-center">
        <div class="col-3">
          Nama Pasien
        </div>
        <div class="col-3">
          : {{ pasien?.nama }}
        </div>
        <div class="col-3">
          Ruangan
        </div>
        <div class="col-3">
          : {{ pasien?.poli }}
        </div>
      </div>

      <div class="row flex-center">
        <div class="col-3">
          Jenis Kelamin
        </div>
        <div class="col-3">
          : {{ pasien?.kelamin }}
        </div>
        <div class="col-3">
          Tanggal Masuk
        </div>
        <div class="col-3">
          : {{ dateFull(pasien?.tgl_kunjungan) }}
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          Tanggal Lahir
        </div>
        <div class="col-3">
          : {{ pasien?.tgllahir }}
        </div>
        <div class="col-3">
          Sistem Bayar
        </div>
        <div class="col-3">
          : {{ pasien?.sistembayar }}
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          Umur
        </div>
        <div class="col-3">
          : {{ usia(pasien?.usia) }} Tahun
        </div>
        <div class="col-3">
          DPJP
        </div>
        <div class="col-3">
          : {{ pasien?.dokter }}
        </div>
      </div>
      <div class="q-px-sm b_double"></div>
    </div>
  </div>
</template>
<script setup>
import { dateFullFormat, dateFull } from 'src/modules/formatter';
const props = defineProps({
  judul: {
    type: String,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  },
  jangantampil: {
    type: Boolean,
    default: true
  },
  kelas: {
    type: String,
    default: null
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
function usia(val) {
  const x = val.split(' ')
  return x[0]
}
</script>
<style lang="scss" scoped>
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
  border-width: 2px;
  border-style: solid;
  border-collapse: collapse;
}

td {
  padding-left: 10px;
  padding-right: 10px;
}

/* Font size adjustment for A4 paper */

.print-page {
  // width: 100%;
  // height: 100%;
  background-color: #ffffff;
  // padding: 20px !important;
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
      content: "Dokumen Sah dari RSUD MOH SALEH KOTA PROBOLINGGO | Hal Ke-" counter(page);
    }
  }

  .contentx {
    page-break-after: auto;
    // break-after: page;
  }

}
</style>
