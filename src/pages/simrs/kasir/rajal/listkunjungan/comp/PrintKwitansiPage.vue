<template>
  <q-page class="q-pa-md karcis-print">
    <kop-surat-new-page />
    <div class="row text-right text-weight-bold q-mb-md">
      <div class="col-12 text-center">
        Karcis Pendaftaran
      </div>

    </div>
    <div class="row text-right text-weight-bold q-mb-md">
      <div class="col-5">
        No. Karcis
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ isikwitansi[0]?.nokarcis }}
      </div>
      <div class="col-5">
        Tanggal Masuk
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ humanDate(isikwitansi[0]?.tgl) }}
      </div>
      <div class="col-5">
        No. RM
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ isikwitansi[0]?.norm }}
      </div>
      <div class="col-5">
        No. Registrasi
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ isikwitansi[0]?.noreg }}
      </div>
      <div class="col-5">
        Nama
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ isikwitansi[0]?.nama }}
      </div>
      <div class="col-5">
        Kelamin
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ isikwitansi[0]?.kelamin }}
      </div>
      <div class="col-5">
        Poli Tujuan
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ isikwitansi[0]?.poli }}
      </div>
      <div class="col-5">
        No. Antrian
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        -
      </div>
      <div class="col-5">
        Sisyem Bayar
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{ isikwitansi[0]?.sistembayar }}
      </div>
      <div class="col-5">
        Total
      </div>
      <div class="col-2 text-center">
        :
      </div>
      <div class="col-5 text-left">
        {{formatRpDouble(isikwitansi[0].rincian.reduce((a, x) => a + Number(x.jml), 0), 2)}}
      </div>
    </div>
    <div class="row q-pa-xl justify-between items-center">
      <div class="kiri text-center">
      </div>
      <div class="kanan text-center">
        <div><b>Probolinggo, {{ dateFullFormat(new Date()) }}</b></div>
        <div><b>Petugas Kasir</b></div>
        <div class="column flex-center">
          <div style="width: 100px;">
            <vue-qrcode :value="qrUrl" tag="svg" :options="{
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
          <b>{{ isikwitansi[0]?.pegawai?.nama }}</b>
        </div>
      </div>
    </div>
    <div class="row q-pa-xl justify-between items-center">
      <div class="col-12 text-center">
        🏥 Karcis ini adalah bukti pembayaran resmi.
        Terima kasih atas kepercayaan Anda kepada layanan RSUD Mohamad Saleh Kota Probolinggo.
        Semoga sehat selalu.
      </div>
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

onMounted(async () => {
  console.log("✅ Masuk ke onMounted")

  try {
    console.log("Isi kwitansikarcis (raw):", route.query.kwitansikarcis)

    // amanin parse JSON
    isikwitansi.value = JSON.parse(route.query.kwitansikarcis || '[]')
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
<style scoped>
.karcis-print {
  font-size: 13px;
  /* default Quasar ±14px */
}

.karcis-print .text-weight-bold {
  font-size: 16px;
}

.karcis-print b {
  font-size: 15.5px;
}
</style>
