<template>
  <div class="row full-width justify-center">
    <div class="q-pa-sm" style="width:25%">
      <app-autocomplete v-model="refData" label="Pilih Rekening" autocomplete="nama" option-value="value"
        option-label="nama" outlined :disable="store.loading" :loading="store.loading" :source="store.level"
        :key="ambilData" @update:model-value="(val) => {
          const valx = parseInt(val)
          store.reqs.levelberapa = valx
          store.hasildata = []
        }" />
    </div>
    <div class="q-pa-sm" style="width:25%">
      <app-input-date-human :model="store.reqs.tgl" label="dari tangal" outlined :disable="store.loading"
        :loading="store.loading" @db-model="tglDari" @set-display="setDari" />
    </div>
    <div class="q-pa-sm" style="width:25%">
      <app-input-date-human :model="store.reqs.tglx" label="sampai tangal" outlined :disable="store.loading"
        :loading="store.loading" @db-model="tglSampai" @set-display="setSampai" />
    </div>
    <div class="q-pa-sm">
      <app-btn label="Ambil Data" :disable="store.loading" :loading="store.loading" @click="ambilData()" />
    </div>
    <div class="q-pa-sm">
      <q-btn icon="icon-mat-print" color="orange" round size="sm" :disable="store.loading" :loading="store.loading"
        @click="cetakData()">
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
  <cetak-neraca v-model="store.dialogCetak" :printneraca="printneraca" />
</template>
<script setup>
import { useQuasar } from 'quasar'
import { useNeracaStore } from 'src/stores/siasik/laporan/neraca/neraca'
import { ref, defineAsyncComponent, watchEffect } from 'vue'
import * as XLSX from 'xlsx'

const CetakNeraca = defineAsyncComponent(() => import('../printNeraca/PrintDataNeraca.vue'))
const store = useNeracaStore()
const $q = useQuasar()
// Model berdasarkan ref agar tidak updte
const refData = ref('')

function tglDari(val) {
  store.setParameter('tgl', val)
}
function setDari(val) {
  store.display.dari = val
}
function tglSampai(val) {
  store.setParameter('tglx', val)
}
function setSampai(val) {
  store.display.sampai = val
}
function ambilData() {
  store.getDataNeraca()
}
const printneraca = ref(null)
function cetakData() {
  store.dialogCetak = true
}

// const jenisData = (val) => {
//   console.log('jenisData', val)
//   if (val === '1') {
//     return store.kodeakun
//   }
//   else if (val === '2') {
//     console.log('kode2', store.kodekelompok)
//     return store.kodekelompok
//   }
//   else if (val === '3') {
//     console.log('kode3', store.kodejenis)
//     return store.kodejenis
//   }
// }
async function exportToExcel() {
  if (!store.hasilaset?.length && !store.hasilkewajiban?.length && !store.hasilekuitas?.length) {
    notifErrVue('Tidak ada data untuk diekspor!');
    return;
  }

  // Siapkan data untuk Excel
  const data = [];

  // Header tabel
  const headers = [
    'KODE REKENING',
    'URAIAN',
    `NILAI TAHUN ${tahunsekarang()} (Rp) `,
    `NILAI TAHUN ${tahunsekarang() - 1} (Rp) `,
  ];
  data.push(headers);


  // ASET
  store.hasilaset.map((item) => {
    data.push([
      item.kode,
      item.uraian,
      item.nilai,
      item.nilai_lalu,
    ])
  });

  // Tambahkan total Pendapatan (tebal)
  data.push([
    '',
    'JUMLAH ASET',
    jumlahAset(),
    jumlahAset_lalu(),
  ])

  // Data Kewajiban
  store.hasilkewajiban.forEach((item) => {
    data.push([
      item.kode,
      item.uraian,
      item.nilai,
      item.nilai_lalu,
    ])
  });

  // Tambahkan total Pendapatan (tebal)
  data.push([
    '',
    'JUMLAH KEWAJIBAN DAN EKUITAS',
    jumlahWajibEkuitas(),
    jumlahWajibEkuitas_lalu(),
  ])

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Neraca');

  // Atur lebar kolom (opsional)
  const colWidths = data[0].map((_, colIndex) => {
    return Math.max(
      ...data.map((row) => (row[colIndex] ? row[colIndex].toString()?.length : 0)),
      10
    );
  });
  worksheet['!cols'] = colWidths.map((width) => ({ wch: width }));

  // Download file Excel
  XLSX.writeFile(workbook, `Neraca_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function tahunsekarang() {
  const tahun = store.reqs.tgl ? new Date(store.reqs.tgl).getFullYear() : new Date().getFullYear()
  return tahun
}


function jumlahAset() {
  const totalaset = store.hasilaset.map((x) => parseFloat(x.nilai))[0]
  return totalaset
}
function jumlahAset_lalu() {
  const totalaset = store.hasilaset.map((x) => parseFloat(x.nilai_lalu))[0]
  return totalaset
}
function jumlahWajibEkuitas() {
  const totalwajib = store.hasilkewajiban.map((x) => parseFloat(x.nilai))[0]
  const totalekuitas = store.hasilekuitas.map((x) => parseFloat(x.nilai))[0]
  return totalwajib + totalekuitas
}
function jumlahWajibEkuitas_lalu() {
  const totalwajib = store.hasilkewajiban.map((x) => parseFloat(x.nilai_lalu))[0]
  const totalekuitas = store.hasilekuitas.map((x) => parseFloat(x.nilai_lalu))[0]
  return totalwajib + totalekuitas
}

watchEffect(() => {
  if (store.exportExcel) {
    // console.log('store.exportExcel', store.exportExcel)
    exportToExcel('tableItem', 'KartuStokFarmasi')
  }
})
</script>
