<template>
  <q-page padding>
    <q-table flat dense bordered :rows="formattedData" :columns="columns" :pagination="{ rowsPerPage: 0 }" row-key="no"
      separator="cell" :rows-per-page-options="[0]">
      <template #header="props">
        <q-tr :props="props">
          <q-th auto-width>NO</q-th>
          <q-th>PEMERIKSAAN</q-th>
          <template v-for="i in 31" :key="i">
            <q-th colspan="2" class="text-center">{{ i }}</q-th>
          </template>
        </q-tr>
        <q-tr>
          <q-th auto-width></q-th>
          <q-th></q-th>
          <template v-for="i in 31" :key="i">
            <q-th class="text-center">L</q-th>
            <q-th class="text-center">P</q-th>
          </template>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td key="no" :props="props" :class="props.row.isCategory ? 'bg-grey-2 text-weight-bold' : ''"
            class="text-center">
            {{ props.row.no }}
          </q-td>
          <q-td key="name" :props="props" :class="props.row.isCategory ? 'bg-grey-2 text-weight-bold' : ''">
            {{ props.row.name }}
          </q-td>
          <template v-for="i in 31" :key="i">
            <q-td class="text-center">{{ props.row[`day${i}L`] || '' }}</q-td>
            <q-td class="text-center">{{ props.row[`day${i}P`] || '' }}</q-td>
          </template>
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
  ...Array.from({ length: 31 }, (_, i) => [
    {
      name: `day${i + 1}L`,
      label: 'L',
      field: row => row.dailyData?.[i + 1]?.L || '',
      align: 'center'
    },
    {
      name: `day${i + 1}P`,
      label: 'P',
      field: row => row.dailyData?.[i + 1]?.P || '',
      align: 'center'
    }
  ]).flat()
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

<style scoped>
.q-table th {
  font-size: 12px;
  padding: 4px 8px;
}

.q-table td {
  padding: 4px 8px;
}
</style>
