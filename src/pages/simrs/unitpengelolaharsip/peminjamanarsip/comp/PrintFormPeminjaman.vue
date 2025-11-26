<template>
  <q-dialog v-model="store.dialogprint" persistent>
    <div id="printMe">
      <div ref="slip" class="slip-container q-pa-md bg-white"
        style="width: 100%; margin:auto; font-family: Arial, sans-serif;">
        <table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse: collapse;">
          <tr>
            <td colspan="2" class="text-center">
              <div class="text-h6"><b>OUT SLIP</b></div>
              <div>(Form Peminjaman Arsip)</div>
              <div>DI RECORD CENTER RSUD DOKTER MOHAMAD SALEH</div>
              <div>KOTA PROBOLINGGO</div>
            </td>
          </tr>
          <!-- <pre>{{ store?.dataprint }}</pre> -->
          <tr>
            <td colspan="2"><b>DATA PEMINJAM</b></td>
          </tr>
          <tr>
            <td style="width:40%">Nama Peminjam</td>
            <td>{{ store?.dataprint?.userpeminjam?.nama }}</td>
          </tr>
          <tr>
            <td>Jabatan Peminjam</td>
            <td>{{ store?.dataprint?.jabatan }}</td>
          </tr>
          <tr>
            <td>Unit Pengolah</td>
            <td>{{ store?.dataprint?.unitpengolahx?.nama }}</td>
          </tr>

          <tr>
            <td colspan="2"><b>DATA ARSIP YANG DIPINJAM</b></td>
          </tr>
          <tr>
            <td>Nomor Arsip</td>
            <td>{{ store?.dataprint?.noarsip }}</td>
          </tr>
          <tr>
            <td>Nomor Box Arsip</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Jumlah Arsip</td>
            <td>1</td>
          </tr>

          <tr>
            <td colspan="2"><b>KEPERLUAN PEMINJAMAN</b></td>
          </tr>
          <tr>
            <td colspan="2">{{ store?.dataprint?.keperluan }}</td>
          </tr>

          <tr>
            <td>Tanggal Peminjaman Arsip</td>
            <td>{{ humanDate(store?.dataprint?.tgl) }}</td>
          </tr>
          <tr>
            <td class="text-center">Peminjam</td>
            <td class="text-center">Petugas</td>
          </tr>
          <tr>
            <td class="text-center">{{ store?.dataprint?.userpeminjam?.nama }}</td>
            <td class="text-center">{{ store?.dataprint?.user?.nama }}</td>
          </tr>

          <tr>
            <td>Tanggal Kembali Arsip</td>
            <td>{{ store?.dataprint?.tgl_kembali ?? '-' }}</td>
          </tr>
          <tr>
            <td class="text-center">Yang mengembalikan</td>
            <td class="text-center">Petugas</td>
          </tr>
          <tr>
            <td class="text-center">{{ store?.dataprint?.userpeminjam?.nama }}</td>
            <td class="text-center">{{ store?.dataprint?.user?.nama }}</td>
          </tr>

          <tr>
            <td colspan="2">
              <b>Catatan petugas :</b><br />
              Harap kembali tepat waktu dan pastikan kondisi fisik dan informasi arsip tetap terjaga
            </td>
          </tr>
        </table>

        <!-- FOOTER TOMBOL -->
        <div class="print-hide row justify-end q-mt-lg q-gutter-sm ">
          <q-btn label="Cetak Out Slip" color="primary" v-print="printObj" />
          <q-btn label="Cancel" color="red" v-close-popup />
        </div>

      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import html2pdf from 'html2pdf.js'
import { humanDate } from 'src/modules/formatter'
import { useUnitPengelolaharsippeminjamanStore } from 'src/stores/simrs/unitpengelolaarsip/peminjamanarsip'
import { ref } from 'vue'

const store = useUnitPengelolaharsippeminjamanStore()
const slip = ref(null)
const openPrint = ref(false)
// let title = ''
const printed = ref(false)
const item = ref({})
const printObj = {
  id: 'printMe',
  // popTitle: title,
  // extraCss: 'https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css',
  // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...', vue)
  },
  openCallback(vue) {
    console.log('opened', vue)
  },
  closeCallback(vue) {
    openPrint.value = false
    printed.value = false
    // changePeriode()
    item.value = {}
    console.log('closePrint')
  }
}



// 🔥 Cara cetak aman tanpa merusak Vue
function printSlip() {
  const concern = document.getElementById('printMe')
  const nama = store?.dataprint?.notrans
  const pdfConfig = {
    margin: 0,
    filename: 'pinjamankeunitpengolah-' + nama + '.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      logging: true,
      dpi: 192,
      letterRendering: true
    },
    jsPDF: {
      unit: 'mm', // mm | pt | in
      format: 'a4', // a4 | letter
      orientation: 'portrait' // landscape | portrait
    }
  }

  html2pdf().set(pdfConfig).from(concern).save()
}
</script>

<style scoped>
.slip-container table td {
  vertical-align: top;
}
</style>
