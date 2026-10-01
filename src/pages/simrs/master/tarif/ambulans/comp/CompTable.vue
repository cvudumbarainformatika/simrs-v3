<template>
  <div class="table-container q-px-sm">
    <table class="tabel-tarif full-width">
      <thead>
        <tr>
          <th style="width: 45px;" class="text-center">
            No
          </th>
          <th class="text-left" style="min-width: 250px;">
            Tujuan & Info Operasional
          </th>
          <th class="text-right" style="min-width: 180px;">
            Tarif Acuan Ambulans
          </th>
          <th class="text-left" style="min-width: 180px;">
            Status & Masa Berlaku
          </th>
          <th class="text-center" style="width: 160px;">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- SKELETON LOADING -->
        <template v-if="loading">
          <tr v-for="n in (params.per_page || 10)" :key="n">
            <td class="text-center">
              <q-skeleton type="text" width="20px" class="q-mx-auto" />
            </td>
            <td>
              <q-skeleton type="text" width="60px" height="18px" />
              <q-skeleton type="text" width="80%" height="20px" />
              <q-skeleton type="text" width="40%" height="14px" />
            </td>
            <td class="text-right">
              <q-skeleton type="text" width="90px" class="q-ml-auto" />
              <q-skeleton type="text" width="60px" class="q-ml-auto" />
            </td>
            <td>
              <q-skeleton type="text" width="60px" height="18px" />
              <q-skeleton type="text" width="100px" height="16px" />
            </td>
            <td class="text-center">
              <div class="row no-wrap justify-center q-gutter-x-xs">
                <q-skeleton type="QBtn" size="sm" width="60px" />
                <q-skeleton type="QAvatar" size="28px" />
              </div>
            </td>
          </tr>
        </template>

        <!-- DATA KOSONG -->
        <template v-else-if="!items || items.length === 0">
          <tr>
            <td colspan="5" class="text-center q-pa-lg text-grey-7">
              <q-icon name="icon-mat-sentiment_dissatisfied" size="36px" color="grey-5" class="q-mb-xs" />
              <div>Tidak ada data tarif ambulans yang ditemukan</div>
            </td>
          </tr>
        </template>

        <!-- DATA ITEMS -->
        <template v-else>
          <tr
            v-for="(item, index) in items"
            :key="item?.id || index"
            :class="{
              'row-deleted': !sudahDiHapus(item),
              'even': index % 2 === 1,
              'odd': index % 2 === 0
            }"
          >
            <!-- NO -->
            <td class="text-center text-weight-medium text-grey-8">
              {{ ((params.page - 1) * params.per_page) + index + 1 }}
            </td>

            <!-- TUJUAN & INFO OPERASIONAL -->
            <td class="q-py-sm">
              <div class="row items-center q-gutter-x-xs q-mb-xs">
                <span class="badge-kode">
                  {{ item?.rs1 }}
                </span>
              </div>
              <div class="text-weight-bold text-dark text-subtitle2 leading-tight">
                {{ item?.rs2 }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs row items-center q-gutter-x-sm">
                <span>
                  <q-icon name="icon-mat-straighten" size="14px" class="q-mr-xs text-grey-6" />
                  Jarak: <b>{{ item?.rs12 ?? 0 }} KM</b>
                </span>
                <span>•</span>
                <span>
                  <q-icon name="icon-mat-local_gas_station" size="14px" class="q-mr-xs text-grey-6" />
                  BBM: <b>{{ item?.rs13 ?? 0 }} Liter</b>
                </span>
              </div>
            </td>

            <!-- TARIF ACUAN AMBULANS -->
            <td class="text-right q-py-sm">
              <div class="text-caption text-grey-7">Standart / Rujukan:</div>
              <div class="text-weight-bolder text-primary text-subtitle2">
                {{ formatNominal(item?.rs9) }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                <span>Jenazah: {{ formatNominal(item?.rs10) }}</span>
              </div>
              <div class="text-caption text-grey-6">
                <span>Emergency: {{ formatNominal(item?.rs11) }}</span>
              </div>
            </td>

            <!-- STATUS & MASA BERLAKU -->
            <td class="q-py-sm">
              <div class="q-mb-xs">
                <q-badge
                  :color="getStatusInfo(item).color"
                  :text-color="getStatusInfo(item).textColor"
                  class="q-px-xs q-py-none text-caption text-weight-medium"
                >
                  {{ getStatusInfo(item).label }}
                </q-badge>
              </div>
              <div class="text-caption text-grey-9 text-weight-medium">
                {{ item?.tgl_mulai_berlaku ? dateFullFormat(item.tgl_mulai_berlaku) : '-' }}
              </div>
              <div v-if="item?.dasar_perubahan" class="text-caption text-grey-7 text-italic ellipsis" style="max-width: 250px;">
                {{ item?.dasar_perubahan }}
                <q-tooltip v-if="item?.dasar_perubahan?.length > 30">
                  {{ item?.dasar_perubahan }}
                </q-tooltip>
              </div>
            </td>

            <!-- AKSI -->
            <td class="text-center q-py-sm">
              <div class="row no-wrap items-center justify-center q-gutter-x-xs">
                <!-- Tombol Rincian -->
                <q-btn
                  unelevated
                  size="sm"
                  color="teal"
                  icon="icon-mat-visibility"
                  label="Rincian"
                  class="q-px-xs"
                  @click="openDetail(item)"
                >
                  <q-tooltip anchor="top middle" self="center middle">
                    Lihat Rincian Tarif & JP Petugas
                  </q-tooltip>
                </q-btn>

                <!-- Tombol Edit -->
                <q-btn
                  v-if="sudahDiHapus(item)"
                  flat
                  round
                  size="sm"
                  color="primary"
                  icon="icon-mat-edit"
                  @click="emits('editData', item)"
                >
                  <q-tooltip anchor="top middle" self="center middle">
                    Edit Tarif
                  </q-tooltip>
                </q-btn>

                <!-- Tombol Hapus / Arsip -->
                <q-btn
                  v-if="sudahDiHapus(item) && lewatBerlaku(item)"
                  flat
                  round
                  size="sm"
                  color="negative"
                  icon="icon-mat-delete_sweep"
                  @click="deleteOne(item)"
                >
                  <q-tooltip anchor="top middle" self="center middle">
                    Hapus / Arsipkan Data
                  </q-tooltip>
                </q-btn>

                <!-- Tombol Tampilkan Lagi -->
                <q-btn
                  v-if="!sudahDiHapus(item)"
                  flat
                  round
                  size="sm"
                  color="positive"
                  icon="icon-mat-settings_backup_restore"
                  @click="undeleteOne(item)"
                >
                  <q-tooltip anchor="top middle" self="center middle">
                    Tampilkan Kembali
                  </q-tooltip>
                </q-btn>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- MODAL RINCIAN TARIF -->
    <DialogRincianTarif
      v-model="isDetailOpen"
      :item="selectedItem"
      @edit="(it) => emits('editData', it)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { date, Dialog } from 'quasar'
import { dateFullFormat, formatRp } from 'src/modules/formatter'
import DialogRincianTarif from './DialogRincianTarif.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  polis: {
    type: Array,
    default: () => []
  },
  ruangRanap: {
    type: Array,
    default: () => []
  },
  params: {
    type: Object,
    default: () => ({ per_page: 10, page: 1 })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['editData', 'delete', 'undelete'])

const today = date.formatDate(new Date(), 'YYYY-MM-DD')

const isDetailOpen = ref(false)
const selectedItem = ref({})

function openDetail (item) {
  selectedItem.value = item
  isDetailOpen.value = true
}

function sudahDiHapus (item) {
  return item?.tgl_hapus === null || item?.tgl_hapus === '' || item?.flag !== '1'
}

function lewatBerlaku (item) {
  if (!item?.tgl_mulai_berlaku) return true
  const itemDate = date.formatDate(new Date(item.tgl_mulai_berlaku), 'YYYY-MM-DD')
  return itemDate > today
}

function getStatusInfo (item) {
  if (item?.tgl_hapus || item?.flag === '1') {
    return {
      label: 'DIHAPUS / NON-AKTIF',
      color: 'red-1',
      textColor: 'negative'
    }
  }

  if (item?.tgl_mulai_berlaku) {
    const itemDate = date.formatDate(new Date(item.tgl_mulai_berlaku), 'YYYY-MM-DD')
    if (itemDate > today) {
      return {
        label: 'DRAFT (AKAN BERLAKU)',
        color: 'amber-1',
        textColor: 'orange-10'
      }
    }
  }

  return {
    label: 'AKTIF',
    color: 'green-1',
    textColor: 'positive'
  }
}

function formatNominal (val) {
  const num = Number(val)
  if (isNaN(num) || num === 0) return 'Rp 0'
  return formatRp(num)
}

function deleteOne (item) {
  Dialog.create({
    title: 'Konfirmasi Penghapusan',
    message: `Pilih aksi penghapusan untuk tujuan "${item.rs2}":`,
    options: {
      type: 'radio',
      model: 'delete',
      items: [
        { label: 'Hapus Data Perubahan (Data draf/perubahan ini akan dihapus)', value: 'delete' },
        { label: 'Arsipkan Tarif (Jadikan data ini sebagai dasar penghapusan tarif)', value: 'archive' }
      ]
    },
    cancel: true
  }).onOk((val) => {
    emits('delete', item, val)
  })
}

function undeleteOne (item) {
  Dialog.create({
    title: 'Konfirmasi Pengaktifan Kembali',
    message: `Apakah Anda yakin ingin mengaktifkan kembali tarif tujuan "${item.rs2}"?`,
    cancel: true
  }).onOk(() => {
    emits('undelete', item)
  })
}
</script>

<style lang="scss" scoped>
.table-container {
  width: calc(100vw - 70px);
  margin-right: 7px;
  margin-left: 5px;
  overflow-x: auto;
}

.tabel-tarif {
  border-collapse: collapse;
  font-size: 13px;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  thead tr {
    background-color: #215e66;
    color: white;

    th {
      padding: 10px 12px;
      font-weight: 600;
      letter-spacing: 0.2px;
      border: none;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      transition: background-color 0.15s ease;
      border-bottom: 1px solid #f0f0f0;

      &.even {
        background-color: #ffffff;
      }

      &.odd {
        background-color: #fbfbfb;
      }

      &:hover {
        background-color: #f0f7f7;
      }

      &.row-deleted {
        background-color: #fff2f2 !important;
        opacity: 0.75;
      }

      td {
        padding: 8px 12px;
        vertical-align: middle;
      }
    }
  }
}

.badge-kode {
  display: inline-block;
  padding: 1px 6px;
  background-color: #e0f2f1;
  color: #00695c;
  font-weight: 700;
  font-size: 11px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.leading-tight {
  line-height: 1.25;
}
</style>
