<template>
  <!-- <pre> {{ store.itemskuitansi }}</pre> -->
  <q-card flat bordered class="table-container">
    <!-- <pre>{{ store.form.no_kwitansi }}</pre> -->
    <div class="text-h6 text-weight-bold">Rincian Kwitansi</div>
    <div class="text-caption text-grey-7 q-mt-xs q-mb-md">
      Pilih kwitansi yang ingin dimasukkan ke TBP
    </div>
    <div class="row justify-between text-weight-bold" v-if="store.form.no_tbp === undefined">
      <div class="col-4 text-center text-red">
        Piutang: {{ formatRpDouble(store.itemspiutang) }}
      </div>
      <div class="col-4 text-center text-orange">
        kwitansi: {{
          formatRpDouble(totalkwitansi)
        }}
      </div>
      <div class="col-4 text-center text-green">
        Yang Akan DiSetor : {{
          formatRpDouble(totalSelected) }}
      </div>
    </div>
    <div class="row justify-between text-weight-bold" v-else>
      <div class="col-12 text-center text-h6 text-weight-bold text-green">
        Total Setor : {{ formatRpDouble(totalkwitansi) }}
      </div>
    </div>
    <q-table :rows="store.itemskuitansi" :columns="columns" row-key="nokwitansi" selection="multiple"
      v-model:selected="selected" :pagination="{ rowsPerPage: 0 }" flat bordered>
      <!-- GANTI CHECKBOX DENGAN BADGE -->
      <template #body-selection="props">
        <div class="text-center">
          <q-checkbox v-if="props.row.no_tbp === null || props.row.no_tbp === ''" v-model="props.selected" />
          <q-badge v-else-if="store.verifikasi === '1'" color="green-7" outline label="TBP Sudah Diverif" />
          <q-btn v-else icon="delete" dense size="sm" color="red" rounded @click="store.batal(props.row.nokwitansi)"
            :loading="store.loadingbatalkwitansi && props.row.nokwitansi === store.nokwitansi" />
        </div>
      </template>
    </q-table>

    <div class="q-mt-md text-right text-weight-bold text-primary">
      Total item dipilih: {{ selected.length }} kwitansi
    </div>

  </q-card>
</template>

<script setup>
import { formatRpDouble } from 'src/modules/formatter';
import { useTbpKasirStore } from 'src/stores/simrs/kasir/tbp';
import { computed, ref, watch } from 'vue';

const store = useTbpKasirStore()

// --- KWITANSI TABLE ---
const columns = [
  { name: 'nota', label: 'No Kuitansi', field: 'nokwitansi', align: 'left' },
  { name: 'tgl', label: 'Tanggal', field: 'tgl_cetak', align: 'center', sortable: true, sort: (a, b) => new Date(a) - new Date(b) },
  { name: 'pasien', label: 'Nama Pasien', field: 'nama', align: 'left' },
  { name: 'kasir', label: 'Nama Kasir', field: row => row?.pegawai?.nama || '-', align: 'left' },
  { name: 'total', label: 'Total (Rp)', field: 'total', align: 'right', format: val => val.toLocaleString() }
]
const sasa = defineProps({
  verifikasi: {
    type: String,
    default: null
  }
})
// const kwitansi = ref([
//   { id: 1, nota: 'KW001', tgl: '02/12/2025', pasien: 'Budi Raharjo', total: 125000 },
//   { id: 2, nota: 'KW002', tgl: '02/12/2025', pasien: 'Siti Aminah', total: 98000 },
//   { id: 3, nota: 'KW003', tgl: '03/12/2025', pasien: 'Rahmat', total: 45000 },
// ])

const selected = ref([])
const totalSelected = ref(0)
watch(() => selected.value, (obj) => {
  totalSelected.value = obj.reduce((acc, cur) => acc + cur.total, 0)
  store.form.no_kwitansi = obj.map(x => x.nokwitansi)

}, { deep: true })

const totalkwitansi = computed(() => {
  if (store.itemskuitansi.length === 0) return 0
  return store.itemskuitansi.reduce((acc, cur) => acc + cur.total, 0) ?? 0
})
</script>
