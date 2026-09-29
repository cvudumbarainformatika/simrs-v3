<template>
  <div class="table-container q-px-sm">
    <table class="tabel-tarif full-width">
      <thead>
        <tr>
          <th style="width: 45px;" class="text-center">
            No
          </th>
          <th class="text-left" style="min-width: 250px;">
            Tindakan & Ruangan
          </th>
          <th class="text-right" style="min-width: 140px;">
            Tarif Acuan (Kelas 3)
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
              <q-skeleton type="text" width="70px" class="q-ml-auto" />
              <q-skeleton type="text" width="50px" class="q-ml-auto" />
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
              <div>Tidak ada data tindakan yang ditemukan</div>
            </td>
          </tr>
        </template>

        <!-- DATA ITEMS -->
        <template v-else>
          <tr
            v-for="(item, index) in items"
            :key="item?.idx || index"
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

            <!-- TINDAKAN & RUANGAN -->
            <td class="q-py-sm">
              <div class="row items-center q-gutter-x-xs q-mb-xs">
                <span class="badge-kode">
                  {{ item?.kdtindakan }}
                </span>
              </div>
              <div class="text-weight-bold text-dark text-subtitle2 leading-tight">
                {{ item?.nmtindakan }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                <q-icon name="icon-mat-meeting_room" size="14px" class="q-mr-xs text-grey-6" />
                <span>{{ BerlakuDiRuangan(item) }}</span>
              </div>
            </td>

            <!-- TARIF ACUAN (KELAS 3) -->
            <td class="text-right q-py-sm">
              <div class="text-weight-bolder text-primary text-subtitle2">
                {{ formatNominal(item?.tarif3) }}
              </div>
              <div class="text-caption text-grey-6">
                <span>JS: {{ formatNominal(item?.js3) }}</span> | <span>JP: {{ formatNominal(item?.jp3) }}</span>
              </div>
              <div v-if="item?.anastesi" class="text-caption text-orange-9">
                AN: {{ formatNominal(item?.anastesi) }}
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
                    Lihat Rincian Tarif 9 Kelas
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
      :polis="polis"
      :ruang-ranap="ruangRanap"
      @edit="onEditFromDetail"
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
    default: () => ({ page: 1, per_page: 10 })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['editData', 'delete', 'undelete'])

const isDetailOpen = ref(false)
const selectedItem = ref(null)

function openDetail (item) {
  selectedItem.value = item
  isDetailOpen.value = true
}

function onEditFromDetail (item) {
  emits('editData', item)
}

function formatNominal (val) {
  const num = parseInt(val)
  if (isNaN(num) || num === 0) return 'Rp 0'
  return formatRp(num)
}

function getStatusInfo (item) {
  if (item?.tgl_hapus) {
    const hariIni = new Date()
    const tglHapus = new Date(item?.tgl_hapus)
    const diff = date.getDateDiff(tglHapus, hariIni, 'days')
    if (diff <= 0) {
      return { label: 'Dihapus', color: 'negative', textColor: 'white' }
    }
  }
  if (item?.tgl_mulai_berlaku) {
    const hariIni = new Date()
    const tglBerlaku = new Date(item?.tgl_mulai_berlaku)
    const diff = date.getDateDiff(tglBerlaku, hariIni, 'days')
    if (diff > 0) {
      return { label: 'Akan Berlaku', color: 'warning', textColor: 'dark' }
    }
  }
  return { label: 'Aktif', color: 'positive', textColor: 'white' }
}

function BerlakuDiRuangan (item) {
  if (!item?.ruangan) return 'Semua Ruangan'
  const ruangans = item?.ruangan.split('|')
  const ruang = []
  if (ruangans?.length >= 1) {
    ruangans.forEach(element => {
      if (element !== '') {
        const poli = props?.polis?.find(x => x?.kodepoli === element)
        const ranap = props?.ruangRanap?.find(x => x?.groups === element)
        if (poli) ruang.push(poli?.polirs)
        if (ranap) ruang.push(ranap?.groups_nama)
      }
    })
  }
  return ruang.length ? ruang.join(', ') : 'Semua Ruangan'
}

function sudahDiHapus (item) {
  let tampil = true
  if (item?.tgl_hapus) {
    const hariIni = new Date()
    const tglHapus = new Date(item?.tgl_hapus)
    const diff = date.getDateDiff(tglHapus, hariIni, 'days')
    if (diff <= 0) tampil = false
  }
  return tampil
}

function lewatBerlaku (item) {
  let tampil = true
  if (item?.tgl_mulai_berlaku) {
    const hariIni = new Date()
    const tglBerlaku = new Date(item?.tgl_mulai_berlaku)
    const diff = date.getDateDiff(tglBerlaku, hariIni, 'days')
    if (diff <= 0) tampil = false
  }
  return tampil
}

function deleteOne (item) {
  Dialog.create({
    title: 'Konfirmasi Hapus / Arsip',
    message: `Pilih tindakan untuk tarif: "${item?.nmtindakan}"`,
    options: {
      type: 'radio',
      model: 'delete',
      items: [
        { label: 'Hapus Data Perubahan (Hapus record draft ini secara permanen)', value: 'delete' },
        { label: 'Set Hapus (Arsipkan tindakan ini mulai tanggal berlaku)', value: 'archive' }
      ]
    },
    cancel: true
  }).onOk((val) => {
    emits('delete', item, val)
  })
}

function undeleteOne (item) {
  Dialog.create({
    title: 'Konfirmasi Pemulihan',
    message: `Apakah tindakan "${item?.nmtindakan}" akan ditampilkan kembali?`,
    cancel: true
  }).onOk(() => {
    emits('undelete', item)
  })
}
</script>

<style lang="scss" scoped>
.table-container {
  width: calc(100vw - 70px);
  margin-bottom: 50px;
}

.tabel-tarif {
  border-collapse: collapse;
  border: 1px solid #dcdcdc;
  background-color: #ffffff;

  thead tr {
    th {
      border: 1px solid #c2c2c2;
      background-color: #f4f6f8;
      color: #333333;
      font-weight: 700;
      font-size: 13px;
      padding: 10px 8px;
      position: sticky;
      top: 102px;
      z-index: 5;
    }
  }

  tbody tr {
    transition: background-color 0.15s ease;

    td {
      border: 1px solid #e5e5e5;
      padding: 8px 10px;
      vertical-align: middle;
      font-size: 13px;
    }

    &:hover {
      background-color: #eaf3fb !important;
    }
  }

  .even {
    background-color: #fbfbfb;
  }

  .odd {
    background-color: #ffffff;
  }

  .row-deleted {
    background-color: #fff1f0 !important;
    opacity: 0.75;
  }
}

.badge-kode {
  background-color: #e3f2fd;
  color: #1565c0;
  font-family: monospace;
  font-weight: 700;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #bbdefb;
}

.leading-tight {
  line-height: 1.25;
}
</style>
