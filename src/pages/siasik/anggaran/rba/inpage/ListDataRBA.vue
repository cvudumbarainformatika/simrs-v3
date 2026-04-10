<template>

  <div class="q-pa-md full-width">
    <table style="width: 100%;" wrap-cells>
      <thead>
        <tr class="text-bold">
          <td class="text-center">KODE REKENING</td>
          <td class="text-center">URAIAN</td>
          <td class="text-center" colspan="2">PAGU AWAL (Rp.)</td>
          <td class="text-center" colspan="2">PAGU PERGESERAN (Rp.)</td>
          <td class="text-center">SELISIH (Rp.)</td>
        </tr>

      </thead>
      <tbody>
        <template v-for="item in store.items" :key="item">
          <tr>
            <td class="text-bold text-left q-px-sm"> {{ item.kode }} </td>
            <td class="text-bold text-left q-px-sm"> {{ item.uraian }} </td>
            <td class="text-bold text-right q-px-sm" colspan="2">
              {{ formattanpaRp(item.paguawal) }}
            </td>
            <td class="text-bold text-right q-px-sm" colspan="2">
              {{ formattanpaRp(item.pagu) }}
            </td>
            <td class="text-bold text-right q-px-sm">
              {{ formattanpaRp(item.selisih) }}
            </td>
          </tr>
          <template v-if="item.rincian && item.rincian?.length > 0">
            <template v-for="(rincian, index) in item.rincian" :key="index">
              <tr>
                <td class="text-right text-bold q-px-sm"> > </td>
                <td>
                  <div class="text-bold text-left q-px-sm">{{ rincian.bidang }}</div>
                  <div class="text-left q-px-sm">Sub Kegiatan: {{ rincian.kegiatan }}</div>
                </td>
                <td class="q-px-sm text-right" colspan="2">
                  {{ formattanpaRp(rincian.paguawal) }}
                </td>

                <td class="q-px-sm text-right" colspan="2">
                  {{ formattanpaRp(rincian.pagu) }}
                </td>
                <td class="q-px-sm text-right">
                  {{ formattanpaRp(rincian.selisih) }}
                </td>
              </tr>
              <template v-if="store.reqs.jenis === '2'">
                <tr v-for="(item, n) in rincian.items" :key="n">
                  <td></td>
                  <td class="text-left q-px-sm text-grey-8">- {{ item.item }} </td>
                  <td class="text-right q-px-sm text-grey-8" style="width: 20%"> {{ item.volumeawal }} {{ item.satuan }}
                    x
                    {{ formattanpaRp(item.hargaawal) }}
                  </td>
                  <td class="text-right q-px-sm text-grey-8">
                    {{ formattanpaRp(item.paguawal) }}
                  </td>
                  <td class="text-right q-px-sm text-grey-8" style="width: 20%"> {{ item.volume }} {{ item.satuan }}
                    x
                    {{ formattanpaRp(item.harga) }}
                  </td>
                  <td class="text-right q-px-sm text-grey-8">
                    {{ formattanpaRp(item.pagu) }}
                    <!-- <div class="row justify-between">
                      <div class="col-auto flex-start text-grey-8">Rp. </div>
                      <div class="flex-end text-right q-pr-sm text-grey-8">{{ formattanpaRp(item.pagu) }}</div>
                    </div> -->
                  </td>
                  <td class="text-right q-px-sm text-grey-8">
                    {{ formattanpaRp(item.selisih) }}
                  </td>
                </tr>
              </template>
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
table,
tr,
td {
  border-collapse: collapse;
  border: 1px solid #000000;
  height: 30px;
  /* Garis hitam dengan ketebalan 1px */
}
</style>
