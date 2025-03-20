<template>
  <q-table flat dense bordered :rows="formattedData" :columns="columns" :pagination="{ rowsPerPage: 0 }" row-key="no"
    separator="cell" :rows-per-page-options="[0]" class="pemeriksaan-table">
    <template #header="props">
      <q-tr :props="props">
        <q-th auto-width rowspan="2" class="text-center text-weight-bold">NO</q-th>
        <q-th rowspan="2" class="text-center text-weight-bold pemeriksaan-column">PEMERIKSAAN</q-th>
        <template v-for="i in 31" :key="i">
          <q-th colspan="2" class="text-center text-weight-bold">{{ i }}</q-th>
        </template>
        <q-th rowspan="2" class="text-center text-weight-bold">TOTAL</q-th>
      </q-tr>
      <q-tr :props="props">
        <template v-for="i in 31" :key="i">
          <q-th class="text-center text-weight-bold">L</q-th>
          <q-th class="text-center text-weight-bold">P</q-th>
        </template>
      </q-tr>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="no" :props="props" :class="props.row.isCategory ? 'bg-grey-2 text-weight-bold' : ''"
          class="text-center">
          {{ props.row.no }}
        </q-td>
        <q-td key="name" :props="props"
          :class="[props.row.isCategory ? 'bg-grey-2 text-weight-bold' : '', 'pemeriksaan-column']">
          {{ props.row.name }}
        </q-td>
        <template v-for="i in 31" :key="i">
          <q-td class="text-center">{{ props.row[`day${i}L`] || '' }}</q-td>
          <q-td class="text-center">{{ props.row[`day${i}P`] || '' }}</q-td>
        </template>
        <q-td class="text-center text-weight-bold">{{ calculateTotal(props.row) }}</q-td>
      </q-tr>
    </template>
  </q-table>
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
    align: 'right'
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
  ]).flat(),
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    align: 'center'
  }
]

// Function to calculate total for a row (L + P)
const calculateTotal = (row) => {
  let total = 0;
  for (let i = 1; i <= 31; i++) {
    const valueL = parseInt(row[`day${i}L`]) || 0;
    const valueP = parseInt(row[`day${i}P`]) || 0;
    total += valueL + valueP;
  }
  return total || '';
}

onMounted(() => {
  store.getMaster()
})

// Mengubah data menjadi format No - Pemeriksaan sesuai permintaan
const formattedData = computed(() => {
  let result = [];
  let categoryIndex = 65; // ASCII 'A'

  // Mendefinisikan urutan yang diinginkan dan mapping nama kategori
  const categoryMapping = {
    'PK': 'PATOLOGI KLINIK',
    'PA': 'PATOLOGI ANATOMI',
    'Uncategorized': 'Uncategorized'
  };

  const desiredOrder = ['PK', 'PA', 'Uncategorized'];

  // Membuat array entries yang diurutkan
  const sortedEntries = Object.entries(store.groupedItems).sort(([a], [b]) => {
    const indexA = desiredOrder.indexOf(a);
    const indexB = desiredOrder.indexOf(b);
    return indexA - indexB;
  });

  sortedEntries.forEach(([category, subcategories]) => {
    let categoryCode = String.fromCharCode(categoryIndex);
    // Menggunakan nama kategori yang sudah dimapping
    result.push({
      no: categoryCode,
      name: categoryMapping[category] || category,
      isCategory: true
    });

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

<style lang="scss" scoped>
.pemeriksaan-table {
  .q-table th {
    font-size: 12px;
    padding: 4px 8px;
  }

  .q-table td {
    padding: 4px 8px;
  }

  /* Menambahkan style untuk vertical alignment pada header */
  .q-table th[rowspan="2"] {
    vertical-align: middle;
  }

  /* Style untuk kolom pemeriksaan */
  .pemeriksaan-column {
    max-width: 200px !important;
    width: 200px !important;
    min-width: 200px !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }

  /* Memastikan konten dalam sel tidak overflow */
  td.pemeriksaan-column,
  th.pemeriksaan-column {
    max-width: 200px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}
</style>
