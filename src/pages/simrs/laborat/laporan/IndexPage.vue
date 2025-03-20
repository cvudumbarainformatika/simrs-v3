<template>
  <q-page padding>
    <q-table flat dense bordered :rows="formattedData" :columns="columns" :pagination="{ rowsPerPage: 0 }" row-key="no"
      separator="cell" :rows-per-page-options="[0]">
      <template #body="props">
        <q-tr :props="props">
          <q-td key="no" :props="props" :class="props.row.isCategory ? 'bg-grey-2 text-weight-bold' : ''"
            class="text-center">
            {{ props.row.no }}
          </q-td>
          <q-td key="name" :props="props" :class="props.row.isCategory ? 'bg-grey-2 text-weight-bold' : ''">
            {{ props.row.name }}
          </q-td>
          <q-td v-for="day in 31" :key="day">
            1
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { useLaporanLaboratStore } from 'src/stores/simrs/penunjang/laborat/laporan';
import { onMounted, computed, ref } from 'vue';

const store = useLaporanLaboratStore()

const columns = [
  {
    name: 'no',
    label: 'NO',
    field: 'no',
    align: 'right',
    style: 'width: 100px'
  },
  {
    name: 'name',
    label: 'PEMERIKSAAN',
    field: 'name',
    align: 'left'
  },
  ...Array.from({ length: 31 }, (_, i) => ({
    name: `day${i + 1}`,
    label: `${i + 1}`,
    field: row => `${row.dailyData[i + 1].L}/${row.dailyData[i + 1].P}`,
    align: 'center'
  }))
]

onMounted(() => {
  store.getMaster()
})

// Mengubah data menjadi format No - Pemeriksaan sesuai permintaan
const formattedData = computed(() => {
  let result = [];
  let categoryIndex = 65; // ASCII 'A'

  // Mendefinisikan urutan yang diinginkan
  const desiredOrder = ['PK', 'PA', 'Uncategorized'];

  // Membuat array entries yang diurutkan
  const sortedEntries = Object.entries(store.groupedItems).sort(([a], [b]) => {
    const indexA = desiredOrder.indexOf(a);
    const indexB = desiredOrder.indexOf(b);
    return indexA - indexB;
  });

  sortedEntries.forEach(([category, subcategories]) => {
    let categoryCode = String.fromCharCode(categoryIndex);
    result.push({ no: categoryCode, name: category, isCategory: true });

    let subIndex = 1;

    // Urutkan subcategories
    const sortedSubcategories = Object.entries(subcategories).sort(([a, _], [b, __]) => {
      // Jika di dalam kategori PK, taruh Uncategorized di belakang
      if (category === 'PK') {
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
      }
      // Untuk kategori lain, urutkan berdasarkan abjad
      return a.localeCompare(b);
    });

    sortedSubcategories.forEach(([subcategory, items]) => {
      let subCategoryCode = `${subIndex}`;
      result.push({ no: subCategoryCode, name: subcategory, isCategory: true });

      items.forEach((item, itemIndex) => {
        let itemCode = `${subCategoryCode}.${itemIndex + 1}`;
        result.push({ no: itemCode, name: item.pemeriksaan, isCategory: false });
      });

      subIndex++;
    });

    categoryIndex++;
  });

  return result;
});
</script>
