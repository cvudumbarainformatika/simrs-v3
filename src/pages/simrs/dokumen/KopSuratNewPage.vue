<template>
  <div class="kop-surat row items-start q-mb-xs">
    <!-- Logo -->
    <div class="col-auto">
      <q-img src="~assets/images/logo-kota-grey.png" style="width: 80px; height: auto;" />
    </div>

    <!-- Teks -->
    <div class="col text-center text-black q-pl-md">
      <div class="text-bold kop-judul">PEMERINTAH KOTA PROBOLINGGO</div>
      <div class="text-bold kop-judul">DINAS KESEHATAN PENGENDALIAN PENDUDUK</div>
      <div class="text-bold kop-judul">DAN KELUARGA BERENCANA</div>
      <div class="text-bold kop-judul">UOBK RSUD DOKTER MOHAMAD SALEH</div>
      <div class="kop-subjudul">
        Jalan Mayjen Panjaitan No.65, Kota Probolinggo, Jawa Timur - 67215
      </div>
      <div class="kop-subjudul">
        Telepon (0335) 433119, Faksimile (0335) 432702
      </div>
      <div class="kop-subjudul">
        Laman: <a href="http://rsud.probolinggokota.go.id" target="_blank"
          class="text-primary">rsud.probolinggokota.go.id</a>,
        Pos-el: <a href="mailto:uobkrsuddmochsaleh@probolinggokota.go.id"
          class="text-primary">uobkrsuddmochsaleh@probolinggokota.go.id</a>
      </div>
    </div>

    <!-- Garis bawah -->
    <div class="col-12 q-mt-sm">
      <div class="garis-bawah"></div>
    </div>
  </div>
</template>

<style scoped>
.kop-surat {
  font-family: Arial, Helvetica, sans-serif;
}

/* Judul kop surat (bold, 14pt, uppercase) */
.kop-judul {
  font-size: 14px;
  line-height: 1.2;
  font-weight: bold;
  text-transform: uppercase;
}

/* Subjudul / alamat / kontak (regular, 12pt) */
.kop-subjudul {
  font-size: 12px;
  line-height: 1.2;
  margin-top: 2px;
}

/* Garis ganda bawah */
.garis-bawah {
  border-bottom: 3px double black;
  margin-top: 6px;
}
</style>
