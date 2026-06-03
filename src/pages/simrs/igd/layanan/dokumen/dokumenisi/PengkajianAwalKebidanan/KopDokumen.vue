<template>
  <div class="col-auto print-page">
    <div class="row b1 justify-between full-width full-height ">
      <div class="row full-width">
        <div class="col-2 q-px-xs flex items-center justify-center text-center">
          <q-img src="~assets/logos/logo-rsud.png" style="width: 2.5cm;" fit="contain" :ratio="1" />
        </div>
        <div class="col q-py-sm flex items-center justify-center text-center">
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
        <div class="col-2 b5 flex items-center justify-center text-center">
          <div class="text-bold q-px-sm" style="font-size: 12px;">PENGKAJIAN AWAL KEBIDANAN IGD</div>
        </div>
      </div>
    </div>
    <div class="col b4 q-pa-sm">
      <div class="row flex-center">
        <div class="col-3">
          No. RM
        </div>
        <!-- <div class="q-px-md" /> -->
        <div class="col-9">
          : {{ pasien?.norm }}
        </div>
      </div>
      <div class="row flex-center">
        <div class="col-3">
          Nama Pasien
        </div>
        <div class="col-9">
          : {{ pasien?.nama }}
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          Alamat
        </div>
        <div class="col-9">
          : {{ pasien?.alamat }}
        </div>
      </div>
      <div class="row flex-center">
        <div class="col-3">
          Jenis Kelamin
        </div>
        <div class="col-9">
          : {{ pasien?.kelamin }}
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          Tanggal Lahir/Umur
        </div>
        <div class="col-9">
          : {{ pasien?.tgllahir }} / {{ usia(pasien?.usia) }} Tahun
        </div>
      </div>
      <div class="q-px-sm b_double"></div>
    </div>
  </div>
</template>
<script setup>
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
    type: Object,
    default: null
  },
})
function usia(val) {
  const x = val.split(' ')
  return x[0]
}
</script>
<style lang="scss" scoped>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.b_double {
  border-bottom: 4px double rgb(30, 30, 30);
  padding-top: 8px;
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

.b5 {
  border-left-style: solid;
  border-width: 2px;
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
