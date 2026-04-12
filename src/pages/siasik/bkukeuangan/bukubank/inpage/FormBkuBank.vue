<template>
  <div class="row full-width justify-center">
    <div class="q-pa-sm" style="width:25%">
      <app-autocomplete v-model="store.params.bulan" label="Pilih Bulan" autocomplete="nama" option-label="nama"
        option-value="value" outlined :source="store.bulans" @update:model-value="store.hasilArray = []" />
    </div>
    <div class="q-pa-sm" style="width:25%">
      <app-input v-model="store.params.tahun" label="Tahun" outlined @update:model-value="store.hasilArray = []" />
    </div>
    <div class="q-pa-sm">
      <app-btn label="Ambil Data" :loading="store.loading" @click="ambilData()" />
    </div>
    <div class="q-pa-sm">
      <q-btn icon="icon-mat-print" color="orange" round size="sm" :loading="store.loading" @click="cetakData()">
        <q-tooltip class="bg-orange" :offset="[10, 10]">
          Cetak
        </q-tooltip>
      </q-btn>
    </div>
    <div class="q-pa-sm">
      <q-btn icon="icon-mat-download" color="green" round size="sm" push :disable="store.loading"
        :loading="store.loading" @click="exportToExcel">
        <q-tooltip class="bg-green" :offset="[10, 10]">
          Export to Excel
        </q-tooltip>
      </q-btn>
    </div>
  </div>
  <cetak-bkuppk v-model="store.dialogCetak" :printpdf="printpdf" />
</template>
<script setup>
import { useLaporanBukuBankStore } from 'src/stores/siasik/laporan/buku_pembantu/bukubank';
import { defineAsyncComponent } from 'vue';
import { ref } from 'vue';
import * as XLSX from 'xlsx'
const CetakBkuppk = defineAsyncComponent(() => import('./PrintPdf.vue'))

const store = useLaporanBukuBankStore()

const printpdf = ref(null)
function ambilData() {
  // store.hitungharidalamBulan();
  store.getDataTable()
}

function cetakData() {
  store.dialogCetak = true
}


async function exportToExcel() {
  if (!store.hasilArray?.length) {
    notifErrVue('Tidak ada data untuk diekspor!');
    return;
  }

  const data = [];

  // Header
  data.push([
    'NO',
    'TANGGAL',
    'REGISTER/REKENING',
    'URAIAN',
    'PENERIMAAN (Rp)',
    'PENGELUARAN (Rp)',
    'SALDO (Rp)',
  ]);

  store.hasilArray.forEach((item, n) => {

    // 🔹 ROW UTAMA
    data.push([
      n + 1,
      item.tgl,
      item.notrans,
      item.uraian,
      item.penerimaan,
      item.pengeluaran,
      item.total,
    ]);

    // 🔹 NONPD
    (Array.isArray(item.nonpd) ? item.nonpd : []).forEach(it => {
      data.push([
        '',
        '',
        it.nonpd,
        it.uraianNPD,
        0,
        it.totalRincian,
        ''
      ]);

      it?.rincian?.forEach(rek => {
        data.push([
          '',
          '',
          `* ${rek.koderek50}`,
          `* ${rek.rincianbelanja}`,
          '',
          '',
          ''
        ]);
      });
    });

    // 🔹 BANK → KAS
    (Array.isArray(item.bank_kas) ? item.bank_kas : []).forEach(it => {
      data.push([
        '',
        '',
        it.nonpd,
        it.uraianNPD,
        0,
        it.nilai,
        ''
      ]);
    });

    // 🔹 KAS → BANK
    (Array.isArray(item.kas_bank) ? item.kas_bank : []).forEach(it => {
      data.push([
        '',
        '',
        it.nonpd,
        it.uraianNPD,
        it.nilai,
        0,
        ''
      ]);
    });

    // // 🔹 PJR
    // (Array.isArray(item.pjr) ? item.pjr : []).forEach(it => {
    //   data.push([
    //     '',
    //     '',
    //     it.nonpd,
    //     it.uraianNPD,
    //     0,
    //     it.totalRincian,
    //     ''
    //   ]);

    //   it?.rincian?.forEach(rek => {
    //     data.push([
    //       '',
    //       '',
    //       `* ${rek.koderek50}`,
    //       `* ${rek.rincianbelanja}`,
    //       '',
    //       '',
    //       ''
    //     ]);
    //   });
    // });

    // // 🔹 SPJ PANJAR
    // (Array.isArray(item.spjpanjar) ? item.spjpanjar : []).forEach(it => {
    //   data.push([
    //     '',
    //     '',
    //     `* ${it.koderek50}`,
    //     `* ${it.rincianbelanja}`,
    //     0,
    //     it.totalRincian,
    //     ''
    //   ]);
    // });

    // // 🔹 SISA PANJAR
    // (Array.isArray(item.sisapanjar) ? item.sisapanjar : []).forEach(it => {
    //   data.push([
    //     '',
    //     '',
    //     `* ${it.koderek50}`,
    //     `* ${it.rincianbelanja}`,
    //     it.totalRincian,
    //     it.totalRincian,
    //     ''
    //   ]);
    // });

    // // 🔹 CPPJR
    // (Array.isArray(item.cppjr) ? item.cppjr : []).forEach(it => {
    //   data.push([
    //     '',
    //     '',
    //     it.nonpd,
    //     it.uraianNPD,
    //     it.totalRincian,
    //     0,
    //     ''
    //   ]);

    //   it?.rincian?.forEach(rek => {
    //     data.push([
    //       '',
    //       '',
    //       `* ${rek.koderek50}`,
    //       `* ${rek.rincianbelanja}`,
    //       '',
    //       '',
    //       ''
    //     ]);
    //   });
    // });

  });

  // 🔹 TOTAL
  data.push([
    '',
    '',
    '',
    'TOTAL',
    totaldebit(),
    totalkredit(),
    totalsaldo(),
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Buku Bank');

  // Auto width
  worksheet['!cols'] = data[0].map((_, colIndex) => ({
    wch: Math.max(
      ...data.map(row => (row[colIndex] ? row[colIndex].toString().length : 0)),
      10
    )
  }));

  XLSX.writeFile(workbook, `Buku Bank_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function totaldebit() {
  const debit = store.hasilArray
  // console.log("njaaias", debit);
  const totaldebit = debit?.length
    ? debit?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totaldebit
}
function totalkredit() {
  const kredit = store.hasilArray
  // console.log("njaaias", debit);
  const totalkredit = kredit?.length
    ? kredit?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalkredit
}

function totalsaldo() {
  const saldo = store.hasilArray
  // console.log("njaaias", debit);
  const totalsaldo = saldo?.length
    ? saldo?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0) -
    saldo?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalsaldo
}
</script>
