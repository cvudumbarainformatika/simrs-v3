<template>
  <div class="col q-px-md q-pt-md full-width">
    <div class="row content-center q-pb-xs">
      <div class="col-2 text-weight-bold">
        Kepala SKPD
      </div>
      <div class="col-auto q-pr-sm">
        :
      </div>
      <div class="col-auto">
        DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA
      </div>
    </div>
    <div class="row content-center q-pb-xs">
      <div class="col-2 text-weight-bold">
        Memohon Kepada
      </div>
      <div class="col-auto q-pr-sm">
        :
      </div>
      <div class="col-auto">
        Bendahara Umum Daerah selaku PPKD
      </div>
    </div>
    <div class="row content-center q-pb-xs">
      <div class="col-auto">
        Agar mengesahkan dan membukukan pendapatan, belanja dan pelayanan BLUD sejumlah
      </div>
    </div>
    <div class="q-pl-md">
      <div class="row content-center q-pb-xs">
        <div class="col-2 text-weight-bold">
          1. Saldo Awal
        </div>
        <div class="col-auto q-pr-sm">
          :
        </div>
        <div class="col-auto">
          Rp.
        </div>
        <div class="text-right col-2">
          {{ formattanpaRp(store.viewData?.saldoawal) }}
        </div>
      </div>
      <div class="row content-center q-pb-xs">
        <div class="col-2 text-weight-bold">
          2. Pendapatan
        </div>
        <div class="col-auto q-pr-sm">
          :
        </div>
        <div class="col-auto">
          Rp.
        </div>
        <div class="text-right col-2">
          {{ formattanpaRp(store.viewData?.pendapatan) }}
        </div>
      </div>
      <div class="row content-center q-pb-xs">
        <div class="col-2 text-weight-bold">
          3. Belanja
        </div>
        <div class="col-auto q-pr-sm">
          :
        </div>
        <div class="col-auto">
          Rp.
        </div>
        <div class="text-right col-2">
          {{ formattanpaRp(store.viewData?.realisasi) }}
        </div>
      </div>
      <div class="row content-center q-pb-xs">
        <div class="col-2 text-weight-bold">
          4. Penerimaan
        </div>
        <div class="col-auto q-pr-sm">
          :
        </div>
        <div class="col-auto">
          Rp.
        </div>
        <div class="text-right col-2">
          {{ formattanpaRp(store.viewData?.pembiayaan) }}
        </div>
      </div>
      <div class="row content-center q-pb-xs">
        <div class="col-2 text-weight-bold">
          5. Pengeluaran
        </div>
        <div class="col-auto q-pr-sm">
          :
        </div>
        <div class="col-auto">
          Rp.
        </div>
        <div class="text-right col-2">
          {{ formattanpaRp(0) }}
        </div>
      </div>
      <div class="row content-center q-pb-xs">
        <div class="col-2 text-weight-bold">
          6. Saldo Akhir
        </div>
        <div class="col-auto q-pr-sm">
          :
        </div>
        <div class="col-auto">
          Rp.
        </div>
        <div class="text-right col-2">
          {{ formattanpaRp(totalsaldoAkhir()) }}
        </div>
      </div>
    </div>
    <div class="row content-center q-pb-xs">
      <div class="col-2 text-weight-bold">
        Untuk Bulan
      </div>
      <div class="col-auto q-pr-sm">
        :
      </div>
      <div class="col-auto">
        {{ setBulan() }}
      </div>
      <div class="col-2 q-pl-xl text-weight-bold">
        Tahun
      </div>
      <div class="col-auto q-pr-sm">
        :
      </div>
      <div class="col-auto">
        {{ setTahun() }}
      </div>
    </div>
    <div class="row content-center q-pb-xs">
      <div class="col-2 text-weight-bold">
        Dasar Pengesahan
      </div>
      <div class="col-auto q-pr-sm">
        :
      </div>
      <div class="col-auto">
        Dokumen Pelaksanaan Anggaran Tahun {{ setTahun() }}
      </div>
    </div>
    <div class="row content-center q-pb-xs">
      <div class="col-2 text-weight-bold">
        Urusan
      </div>
      <div class="col-auto q-pr-sm">
        :
      </div>
      <div class="col-2">
        1.02
      </div>
      <div class="col-auto q-pl-xl">
        URUSAN PEMERINTAHAN BIDANG KESEHATAN
      </div>
    </div>
    <div class="row content-center q-pb-xs">
      <div class="col-2 text-weight-bold">
        Organisasi
      </div>
      <div class="col-auto q-pr-sm">
        :
      </div>
      <div class="col-2">
        1.02.2.14.0.00.03.0301
      </div>
      <div class="col-auto q-pl-xl">
        RSUD DOKTER MOHAMAD SALEH
      </div>
    </div>
  </div>
  <div class="q-pa-sm full-width">
    <q-markup-table class="custom-table" wrap-cells flat bordered :separator="separator">
      <thead>
        <tr class="max-width">
          <th colspan="2"><span class="text-bold">PENDAPATAN</span></th>
          <th colspan="4"><span class="text-bold">BELANJA</span></th>
        </tr>
        <tr>
          <th>
            <span class="text-bold">Kode Rekening</span>
          </th>
          <th style="width: 20%"><span class="text-bold">Jumlah</span></th>
          <th colspan="2"><span class="text-bold">Program/Kegiatan/Rekening</span></th>
          <th><span class="text-bold">Uraian</span></th>
          <th style="width: 20%"><span class="text-bold">Jumlah</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cariDataPendapatan" :key="item">
          <td>{{ item?.kode }}</td>
          <td class="text-right">Rp. {{ formattanpaRp(item?.total) }}</td>
          <td colspan="2">1.02.01</td>
          <td>Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota</td>
          <td class="text-right">Rp. {{ formattanpaRp(store.viewData?.realisasi) }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td colspan="2">5-1.02.01.2.10</td>
          <td>Peningkatan Pelayanan BLUD</td>
          <td class="text-right">Rp. {{ formattanpaRp(store.viewData?.realisasi) }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td colspan="2">1.02.01.2.10.0001</td>
          <td>Pelayanan dan Penunjang Pelayanan BLUD</td>
          <td class="text-right">Rp. {{ formattanpaRp(store.viewData?.realisasi) }}</td>
        </tr>
        <tr v-for="(item, n) in cariDataBelanja" :key="n">
          <td></td>
          <td></td>
          <td style="width: 5px">{{ n + 1 }}. </td>
          <td> {{ item?.kode }} </td>
          <td> {{ item?.uraian }} </td>
          <td class="text-right"> Rp. {{ formattanpaRp(item?.total) }} </td>
        </tr>

        <tr>
          <td class="text-bold">JUMLAH</td>
          <td class="text-right text-bold">Rp. {{ formattanpaRp(store.viewData?.pendapatan) }}</td>
          <td class="text-right text-bold" colspan="3">JUMLAH</td>
          <td class="text-right text-bold">Rp. {{ formattanpaRp(store.viewData?.realisasi) }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
  <div class="row q-px-sm q-py-md full-width justify-between">
    <q-markup-table class="flex-start custom-table" wrap-cells flat bordered :separator="separator">
      <thead>
        <tr class="max-width">
          <th colspan="2"><span class="text-bold">PENERIMAAN PEMBIAYAAN</span></th>
          <th colspan="2"><span class="text-bold">PENGELUARAN PEMBIAYAAN</span></th>
        </tr>
        <tr class="max-width">
          <th><span class="text-bold">Kode Rekening</span></th>
          <th><span class="text-bold">Jumlah</span></th>
          <th><span class="text-bold">Kode Rekening</span></th>
          <th><span class="text-bold">Jumlah</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cariDataPembiayaan" :key="item">
          <td> {{ item.kode }} </td>
          <td class="text-right">Rp. {{ formattanpaRp(item.total) }} </td>
          <td></td>
          <td class="text-right"> {{ formattanpaRp(0) }} </td>
        </tr>
        <tr>
          <td class="text-bold">JUMLAH</td>
          <td class="text-right text-bold">Rp. {{ formattanpaRp(store.viewData?.pembiayaan) }} </td>
          <td class="text-bold">JUMLAH</td>
          <td class="text-right text-bold"> {{ formattanpaRp(0) }} </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="flex-end justify-center content-center col full-width" v-for="it in tt.ttd" :key="it">
      <div class="text-center">Probolinggo, {{ store.viewData.tanggal }} </div>
      <div class="text-center text-bold q-pb-xl">Direktur RSUD Dokter Mohamad Saleh</div>
      <div class="text-center text-bold"> {{ it.nama }}
        <div class="garis-bawah" :style="{ width: it.nama.length + 'ch' }"></div>
      </div>
      <div class="text-center"> NIP. {{ it.nip }} </div>
    </div>
  </div>
</template>
<script setup>
import { formattanpaRp } from 'src/modules/formatter';
import { useBukubesarStore } from 'src/stores/siasik/akuntansi/bukubesar/bukubesar';
import { useSp3bStore } from 'src/stores/siasik/akuntansi/sp3b/sp3b';
import { computed, ref } from 'vue';
import { onMounted } from 'vue';

const tt = useBukubesarStore()
const store = useSp3bStore()
const separator = ref('cell')
onMounted(() => {
  tt.getTtd()
  // store.getDataBukubesar()
})
function totalsaldoAkhir() {
  console.log('pendapatanxxx', store.viewData)
  const pendp = store.viewData.pendapatan || 0
  const blj = store.viewData.realisasi || 0
  const biaya = store.viewData.pembiayaan || 0
  const saldoawal = store.viewData.saldoawal || 0
  console.log('pendapatanxxx', pendp)
  const it = parseFloat(saldoawal) + (parseFloat(pendp) - parseFloat(blj)) + parseFloat(biaya)
  return it
}

function setBulan() {
  const tanggal = store.viewData.bulan_realisasi
  const date = new Date(tanggal);
  const bulan = date.toLocaleString('id-ID', { month: 'long' });
  return bulan
}
function setTahun() {
  const tanggal = store.viewData.bulan_realisasi
  const date = new Date(tanggal);
  const bulan = date.getFullYear();
  return bulan
}
const cariDataPendapatan = computed(() => {
  return store.viewData?.rincians?.filter(item => item.keterangan === 'PENDAPATAN');
});

const cariDataBelanja = computed(() => {
  return store.viewData?.rincians?.filter(item => item.keterangan === 'REALISASI');
});
const cariDataPembiayaan = computed(() => {
  return store.viewData?.rincians?.filter(item => item.keterangan === 'PEMBIAYAAN');
});
</script>

<style scoped>
/* Mengatur warna garis pada seluruh tabel termasuk garis luar */
.custom-table {
  border-color: #555555 !important;
}

/* Menargetkan tabel di dalam komponen q-markup-table */
.custom-table table {
  border-color: #555555 !important;
}

/* Mengatur warna garis pada sel header */
.custom-table th {
  border-color: #555555 !important;
}

/* Mengatur warna garis pada sel data */
.custom-table td {
  border-color: #555555 !important;
}

/* Pastikan garis tidak dobel */
.custom-table table {
  border-collapse: collapse;
}
</style>
