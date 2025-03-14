<!-- <template>
  <div>
    <list-data />
  </div>
  <div id="printMe" style="width: 100%; height: 900px; overflow-y: auto;">
    <q-table :rows="rows" :columns="columns" row-key="id" flat bordered :pagination="pagination">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td class="text-bold">{{ props.row.kode }}</q-td>
          <q-td class="text-bold" colspan="2">{{ props.row.uraian }}</q-td>
          <q-td class="text-bold text-right">Rp. {{ formattanpaRp(props.row.pagu) }}</q-td>
        </q-tr>

        <template v-if="props.row.rincian && props.row.rincian.length > 0">
          <template v-for="(rincian, rIndex) in props.row.rincian" :key="rIndex">

            <q-tr>
              <q-td></q-td>
              <q-td colspan="2" class="bq-white">
                <div class="text-bold">{{ rincian.bidang }}</div>
                <div>Sub Kegiatan: {{ rincian.kegiatan }}</div>
              </q-td>
              <q-td class="text-right text-bold">Rp. {{ formattanpaRp(rincian.pagu) }} </q-td>
            </q-tr>
            <q-tr v-for="(item, n) in rincian.items" :key="n">
              <q-td></q-td>
              <q-td>- {{ item.item }} </q-td>
              <q-td class="text-right"> {{ item.volume }} {{ item.satuan }} x {{ formattanpaRp(item.harga)
                }}</q-td>
              <q-td class="text-right">Rp. {{ formattanpaRp(item.pagu) }}</q-td>
            </q-tr>

          </template>
        </template>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { formattanpaRp } from 'src/modules/formatter';
import { useRbaStore } from 'src/stores/siasik/anggaran/storerba';
import { computed, ref } from 'vue';
import ListData from './DataCetak.vue'
// Ambil data dari store
const store = useRbaStore();

// Format data untuk QTable
const rows = computed(() => {
  return store.items.map((item, index) => ({
    id: index + 1,
    kode: item.kode,
    uraian: item.uraian,
    pagu: item.pagu,
    rincian: item.rincian || [], // Pastikan rincian selalu ada
  }));
});

// Kolom untuk QTable
const columns = [
  { name: 'kode', label: 'Kode', field: 'kode', align: 'left' },
  { name: 'uraian', label: 'Uraian', field: 'uraian', align: 'left' },
  { name: '', label: '', field: '', align: '' },
  { name: 'pagu', label: 'Pagu', field: 'pagu', align: 'right' },
];

const pagination = ref({
  rowsPerPage: 10, // Jumlah baris per halaman
});
</script>


<style>
@media print {

  .q-btn {
    display: none;
  }

  .q-table {
    width: 100%;
    max-width: 100%;
  }

  .q-table td,
  .q-table th {
    border: 1px solid #000;
    padding: 5px;
  }
}
</style> -->


<template>

  <div class="q-pa-md full-width">
    <table class="bordered-table" style="width: 100%;" wrap-cells>
      <thead>
        <tr class="text-bold">
          <td class="text-center" style="width: 10%">KODE REKENING</td>
          <td class="text-center" style="width: 70%" colspan="2">URAIAN</td>
          <td class="text-center" style="width: 20%">PAGU</td>
        </tr>

      </thead>
      <tbody>
        <template v-for="item in store.items" :key="item">
          <tr>
            <td class="text-bold"> {{ item.kode }} </td>
            <td class="text-bold" colspan="2"> {{ item.uraian }} </td>
            <td class="text-bold text-right">
              <div class="row full-width justify-between">
                <div class="col-auto flex-start">Rp. </div>
                <div class="flex-end text-right">{{ formattanpaRp(item.pagu) }}</div>
              </div>
            </td>
          </tr>
          <template v-if="item.rincian && item.rincian.length > 0">
            <template v-for="(rincian, index) in item.rincian" :key="index">
              <tr>
                <td class="text-right text-bold"> > </td>
                <td colspan="2">
                  <div class="text-bold">{{ rincian.bidang }}</div>
                  <div>Sub Kegiatan: {{ rincian.kegiatan }}</div>
                </td>
                <td class="text-weight-bold">
                  <div class="row justify-between">
                    <div class="col-auto flex-start">Rp. </div>
                    <div class="flex-end text-right">{{ formattanpaRp(rincian.pagu) }}</div>
                  </div>
                </td>
              </tr>
              <tr v-for="(item, n) in rincian.items" :key="n">
                <td></td>
                <td>- {{ item.item }} </td>
                <td class="text-right"> {{ item.volume }} {{ item.satuan }} x {{ formattanpaRp(item.harga) }}
                </td>
                <td class="text-right">
                  <div class="row justify-between">
                    <div class="col-auto flex-start">Rp. </div>
                    <div class="flex-end text-right">{{ formattanpaRp(item.pagu) }}</div>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </template>
      </tbody>
    </table>
  </div>

</template>
<script setup>
import { formattanpaRp } from 'src/modules/formatter';
import { useRbaStore } from 'src/stores/siasik/anggaran/storerba';
// import { ref } from 'vue';


const store = useRbaStore()
// const separator = ref('cell')
</script>

<style>
/* Tambahkan border pada setiap td dan th */
.bordered-table th,
.bordered-table td {
  border: 1px solid #000000;
  height: 30px;
  /* Garis hitam dengan ketebalan 1px */
}
</style>
