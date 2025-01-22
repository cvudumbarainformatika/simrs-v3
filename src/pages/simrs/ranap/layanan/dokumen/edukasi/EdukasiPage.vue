<template>
  <div id="pdfDoc" class="bg-white print-page">
    <div class="page-1">
      <!-- KOP SURAT -->
      <div class="col-grow">
        <div class="row items-center">
          <div class="col-12">
            <div class="flex justify-center">
              <div class="">
                <img src="~assets/logos/logo-rsud.png" width="50">
              </div>
              <div class="q-px-md">
                <div class="text-center">
                  <div class="text-weight-bold f-14">
                    UOBK RSUD DOKTER MOHAMAD SALEH
                  </div>
                  <div class="f-12">
                    <div>Jl. Mayjend Panjaitan No.65 Probolinggo Jawa Timur</div>
                    <div>Telp. (0335) 433478,433119,421118 Fax. (0335) 432702</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="col-3">
            <div class="flex justify-end items-center">
              RM.
            </div>
            <div class="flex justify-end items-center">
              <div v-for="n in NORM" :key="n" class="q-pa-sm f-14 text-bold" style="border: 1px solid black;">
                {{ n }}
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <hr>
      <!-- CONTENT -->
      <div class="text-center">
        MASIH DITAHAP PENGGARAPAN
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.qrcode__image {
  // background-color: #fff;
  // border: 0.05rem solid #fff;
  // border-radius: 0.25rem;
  // box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 20%;
  width: 20%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

table {
  border-collapse: collapse;
  border-spacing: 50px 0;
}

.model-1 {

  tr,
  td {
    padding: -3px 0 !important;
  }
}

.model-2 {

  tr,
  td {
    padding-bottom: 5px !important;
    border-bottom: 1px solid rgb(139, 139, 139);
  }
}

table,
tr,
td {
  border: none;
}

td {
  text-align: left;
}

.kotak {
  border: 1px solid black;
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
