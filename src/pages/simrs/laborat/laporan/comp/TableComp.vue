<template>
  <div class="table-container q-mt-none">
    <q-table flat dense bordered :loading="store.loading" :rows="formattedData" :columns="columns"
      :pagination="{ rowsPerPage: 0 }" row-key="no" separator="cell" :rows-per-page-options="[0]" virtual-scroll
      :virtual-scroll-sticky-size-start="48" class="pemeriksaan-table">
      <!-- Loading slot -->
      <template #loading>
        <div class="row full-width flex-center q-pa-lg">
          <div class="column items-center">
            <!-- <q-spinner-cube color="primary" size="40px" /> -->
            <!-- <div class="text-primary q-mt-sm">
              harap bersabar, menunggu...
            </div> -->
          </div>
        </div>
      </template>

      <!-- Existing header template -->
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

      <!-- Rest of your existing template remains the same -->
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
  </div>
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

<style lang="scss">
.table-container {
  width: 100%;

  .pemeriksaan-table {
    height: 100%;

    /* Sticky header */
    thead tr th {
      position: sticky;
      z-index: 2;
      background: white;
    }

    thead tr:first-child th {
      top: 0;
    }

    thead tr:nth-child(2) th {
      top: 49px;
      /* Sesuaikan dengan tinggi row header pertama */
    }

    /* Sticky columns (NO dan PEMERIKSAAN) */
    th:nth-child(1),
    td:nth-child(1) {
      position: sticky;
      left: 0;
      z-index: 1;
      background: white;
    }

    th:nth-child(2),
    td:nth-child(2) {
      position: sticky;
      left: 48px;
      /* Sesuaikan dengan lebar kolom NO */
      z-index: 1;
      background: white;
    }

    /* Z-index lebih tinggi untuk header yang sticky di kedua arah */
    thead th:nth-child(1),
    thead th:nth-child(2) {
      z-index: 3;
    }

    /* Tambahkan shadow untuk indikator scroll */
    th:nth-child(2),
    td:nth-child(2) {
      box-shadow: 4px 0 4px -2px rgba(0, 0, 0, 0.15);
    }

    /* Style untuk row kategori */
    td.bg-grey-2 {
      background: #f5f5f5 !important;
    }

    /* Memastikan konten dalam sel tidak overflow */
    .pemeriksaan-column {
      max-width: 200px;
      white-space: normal;
      word-wrap: break-word;
    }
  }
}
</style>
