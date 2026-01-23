<template>
  <q-page class="q-pa-xl bg-white print:bg-white kwitansi-print">

    <!-- KOP RUMAH SAKIT -->
    <div class="column items-center text-center q-mb-sm full-width">
      <kop-surat-new-page class="full-width" />
      <!-- <div class="text-h6 text-weight-bold">UO</div>
      <div class="text-caption">Jl. Bengawan Raya No. 12 – Probolinggo</div>
      <div class="text-caption">Telp: (0335) 123456 – Email: info@rsbengawan.co.id</div> -->
      <q-separator spaced />
    </div>

    <!-- BOX KWITANSI -->
    <div class="kwitansi-box q-pa-md">

      <div class="row q-mb-md">
        <div class="col text-h6 text-weight-bold text-center">
          KWITANSI PEMBAYARAN
        </div>
      </div>

      <!-- Nomor Kwitansi -->
      <div class="row q-mb-sm">
        <div class="col-3 text-weight-bold">No. Kwitansi</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ isikwitansi[0]?.nokwitansi }}</div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-3 text-weight-bold">Sudah diterima dari</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ isikwitansi[0]?.nama }} ({{ isikwitansi[0]?.norm }})</div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-3 text-weight-bold">No. RM</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ isikwitansi[0]?.noreg }}</div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-3 text-weight-bold">Sistem Bayar</div>
        <div class="col-1">:</div>
        <div class="col-8">{{ isikwitansi[0]?.sistembayar }}</div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-3 text-weight-bold">Untuk Pembayaran</div>
        <div class="col-1">:</div>
        <div class="col-8">
          <pre>{{ isikwitansi[0]?.rincian[0]?.jenis }}</pre>
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-3 text-weight-bold">Nominal</div>
        <div class="col-1">:</div>
        <div class="col-8"> {{formatRpDouble(isikwitansi[0]?.rincian.reduce((a, x) => a + Number(x.jml), 0), 2)}}</div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-3 text-weight-bold">Terbilang</div>
        <div class="col-1">:</div>
        <div class="col-8"> {{terbilang(isikwitansi[0]?.rincian.reduce((a, x) => a + Number(x.jml), 0), 2)}} Rupiah
        </div>
      </div>



      <div class="q-my-md" style="border-top: 1px dashed #000;"></div>

      <!-- Tanggal -->
      <div class="row q-mt-lg">
        <div class="col text-right">
          Probolinggo, {{ dateFullFormat(new Date()) }}
        </div>
      </div>

      <!-- TTD -->
      <div class="row text-right q-mt-md q-pr-lg">
        <div class="col text-right text-weight-bold">Petugas Kasir</div>
      </div>

      <div class="row justify-end q-mt-md">
        <div style="width: 120px;">
          <vue-qrcode :value="qrUrl" tag="svg" :options="{
            errorCorrectionLevel: 'Q',
            color: { dark: '#000000', light: '#ffffff' },
            margin: 0
          }" />
        </div>
      </div>

      <div class="row q-mt-sm q-pr-md">
        <div class="col text-right text-weight-bold">
          {{ isikwitansi[0]?.pegawai?.nama }}
        </div>
      </div>
    </div>

    <div class="text-center q-mt-xl">
      🏥 Terima kasih telah mempercayai layanan kami. Semoga lekas sembuh.
    </div>

  </q-page>
</template>

<script setup>
import { dateFullFormat, formatRpDouble, humanDate } from 'src/modules/formatter'
import KopSuratNewPage from 'src/pages/simrs/dokumen/KopSuratNewPage.vue'
import { onMounted, ref, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
// import VueQrcode from 'vue-qrcode'

const route = useRoute()

const nomor = ref('')
const poli = ref('')
const norm = ref('')
const isikwitansi = ref('')
const lastPart = ref('')
const belakang = ref('')

const qrUrl = computed(() => {

  // console.log('pasien', props?.pasien)

  const noreg = 'asasa'// noreg
  const dok = 'RESUME-MEDIS.png'
  const asal = 'HEMODDIALISA'
  const enc = btoa(`${noreg}|${dok}|${asal}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})

function terbilang(n) {
  const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];

  n = Math.floor(n);

  if (n < 12) return angka[n];
  if (n < 20) return terbilang(n - 10) + " Belas";
  if (n < 100) return terbilang(Math.floor(n / 10)) + " Puluh " + terbilang(n % 10);
  if (n < 200) return "seratus " + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + " Ratus " + terbilang(n % 100);
  if (n < 2000) return "seribu " + terbilang(n - 1000);
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " Ribu " + terbilang(n % 1000);
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " Juta " + terbilang(n % 1000000);
  if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + " Milyar " + terbilang(n % 1000000000);

  return "jumlah terlalu besar";
}


onMounted(async () => {
  console.log("✅ Masuk ke onMounted")

  try {
    console.log("Isi kwitansikarcis (raw):", route.query.kwitansinonkarcis)

    // amanin parse JSON
    isikwitansi.value = JSON.parse(route.query.kwitansinonkarcis || '[]')
    console.log("✅ Hasil parse:", isikwitansi.value)

    const rincian = isikwitansi.value[0]?.rincian
    console.log("✅ rincian:", rincian)

    if (Array.isArray(rincian)) {
      jumlah.value = rincian.reduce((a, x) => a + Number(x.jml), 0)
    }

    console.log("✅ Total rincian:", jumlah.value)
  } catch (err) {
    console.error("❌ Gagal parse atau error lain:", err)
  }

  await nextTick()
  setTimeout(() => {
    window.print()
  }, 200)
})

// onMounted(async () => {
//   // ambil query params
//   console.log("Total rincian:", 'xxxx')
//   isikwitansi.value = JSON.parse(route.query.kwitansikarcis)
//   nomor.value = route.query.noreg || ''
//   poli.value = route.query.poli || ''
//   norm.value = route.query.norm || ''
//   console.log("Total rincian:", 'sasas')
//   const rincian = isikwitansi.value[0]?.rincian
//   console.log("Total rincian:", 'wew')
//   if (Array.isArray(rincian)) {
//     jumlah.value = rincian.reduce((a, x) => a + Number(x.jml), 0)
//   }

//   console.log("Total rincian:", jumlah.value)
//   // if (rinci) {
//   //   let clean = rinci.replace(/\r?\n/g, "")
//   //   console.log("clean:", clean)

//   //   // ambil bagian terakhir setelah koma
//   //   let last = clean.split(",").pop().trim()

//   //   lastPart.value = last //

//   //   belakang.value = lastPart.value.split(":").pop().trim()
//   //   console.log('belakang:', belakang.value)
//   // }

//   // tunggu DOM render dulu
//   await nextTick()

//   // otomatis print
//   window.print()
// })
</script>
<style>
.kwitansi-box {
  border: 2px solid #000;
  border-radius: 6px;
  background: #fff;
}

.tabel-kwitansi {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 14px;
}

.tabel-kwitansi th,
.tabel-kwitansi td {
  border: 1px solid #000;
  padding: 6px;
}

/* --- PRINT KHUSUS KERTAS 3-PLY (9.5 x 5.5 inch) --- */
@media print {
  @page {
    size: auto !important;
    margin: 0 !important;
  }

  html,
  body {
    height: auto !important;
    overflow: visible !important;
    background: #fff !important;
  }

  * {
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }

  .q-page {
    padding: 10px !important;
  }
}
</style>
