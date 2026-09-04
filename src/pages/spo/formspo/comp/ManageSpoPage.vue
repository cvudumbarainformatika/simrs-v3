<template>
  <q-card flat bordered class="manage-card">
    <q-card-section class="row items-center q-col-gutter-md">
      <div class="col"><div class="text-h6 text-weight-bold">Kelola SPO</div><div class="text-caption text-grey-7">Ubah atau hapus dokumen SPO yang sudah terdaftar.</div></div>
      <div class="col-auto"><q-btn color="primary" unelevated no-caps icon="add" label="Tambah SPO" :to="{ name: 'spo.form', query: { mode: 'form' } }" /></div>
    </q-card-section>
    <q-separator />
    <q-card-section class="row q-col-gutter-sm">
      <div class="col"><q-input v-model="filter" outlined dense clearable debounce="400" placeholder="Cari nomor, judul, pemilik, atau unit" @update:model-value="load"><template #prepend><q-icon name="search" /></template></q-input></div>
      <div class="col-auto"><q-btn outline color="primary" icon="refresh" :loading="loading" @click="load"><q-tooltip>Muat ulang</q-tooltip></q-btn></div>
    </q-card-section>
    <q-table flat table-style="table-layout: fixed; width: 100%" :rows="rows" :columns="columns" row-key="id" :loading="loading" hide-bottom :pagination="{ rowsPerPage: 0 }" no-data-label="SPO tidak ditemukan">
      <template #body-cell-nomor="props"><q-td :props="props"><q-badge outline color="primary">{{ props.row.kode || '-' }}</q-badge><div class="text-caption q-mt-xs">Rev. {{ props.row.nomor_revisi || '-' }}</div></q-td></template>
      <template #body-cell-judul="props"><q-td :props="props"><div class="text-weight-medium">{{ props.row.judul }}</div><div class="text-caption text-grey-7">{{ props.row.pemilik || '-' }}</div></q-td></template>
      <template #body-cell-tanggal="props"><q-td :props="props">{{ formatDate(props.row.tanggal) }}</q-td></template>
      <template #body-cell-aksi="props"><q-td :props="props" class="text-right q-gutter-xs"><q-btn round flat dense color="primary" icon="edit" @click="edit(props.row)"><q-tooltip>Ubah</q-tooltip></q-btn><q-btn round flat dense color="negative" icon="delete" @click="confirmDelete(props.row)"><q-tooltip>Hapus</q-tooltip></q-btn></q-td></template>
    </q-table>
    <div class="row items-center justify-between q-pa-md"><div class="text-caption text-grey-7">{{ total }} SPO</div><q-pagination v-if="lastPage > 1" v-model="page" color="primary" :max="lastPage" :max-pages="6" boundary-numbers @update:model-value="load" /></div>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const rows = ref([])
const filter = ref('')
const loading = ref(false)
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const columns = [
  { name: 'nomor', label: 'Nomor SPO', field: 'kode', align: 'left', sortable: false, style: 'width: 260px', headerStyle: 'width: 260px' },
  { name: 'judul', label: 'Dokumen SPO', field: 'judul', align: 'left', sortable: false },
  { name: 'tanggal', label: 'Tanggal', field: 'tanggal', align: 'left', sortable: false, style: 'width: 150px', headerStyle: 'width: 150px' },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'right', sortable: false, style: 'width: 120px', headerStyle: 'width: 120px' },
]

onMounted(load)

async function load () {
  loading.value = true
  try {
    const response = await api.get('v1/spo/spo/getsoplist', { params: { q: filter.value, page: page.value } })
    rows.value = response.data.data ?? []
    lastPage.value = response.data.last_page ?? 1
    total.value = response.data.total ?? 0
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.response?.data?.message ?? 'Daftar SPO gagal dimuat.' })
  } finally {
    loading.value = false
  }
}

function edit (item) { router.push({ name: 'spo.form', query: { mode: 'form', id: item.id } }) }
function confirmDelete (item) {
  $q.dialog({ title: 'Hapus SPO?', message: `Dokumen “${item.judul}” akan dihapus permanen.`, cancel: true, persistent: true, ok: { color: 'negative', label: 'Hapus' } }).onOk(() => remove(item))
}
async function remove (item) {
  try {
    const response = await api.delete(`v1/spo/spo/form/${item.id}`)
    $q.notify({ type: 'positive', message: response.data.message ?? 'SPO berhasil dihapus.' })
    if (rows.value.length === 1 && page.value > 1) page.value -= 1
    await load()
  } catch (error) {
    $q.notify({ type: 'negative', message: error?.response?.data?.message ?? 'SPO gagal dihapus.' })
  }
}
function formatDate (value) { return value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`)) : '-' }
</script>

<style scoped>
.manage-card { min-height: 420px; }
.manage-card :deep(.q-table th),
.manage-card :deep(.q-table td) { overflow: hidden; text-overflow: ellipsis; }
.manage-card :deep(.q-table td:nth-child(2)) { white-space: normal; }
</style>
