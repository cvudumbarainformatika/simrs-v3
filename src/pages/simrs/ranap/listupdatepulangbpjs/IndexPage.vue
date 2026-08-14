<template>
  <q-page
    class="q-pa-sm"
    :class="style.componentfull ? 'container-no-header' : 'container--q-header'"
  >
    <q-card flat bordered class="fit column no-wrap">
      <!-- Header Section -->
      <q-card-section class="bg-primary text-white q-py-sm q-px-md">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-avatar
              size="36px"
              color="white"
              text-color="primary"
              icon="icon-mat-assignment_turned_in"
            />
            <div>
              <div class="text-subtitle1 text-weight-bold">
                List Update Pulang BPJS (Rawat Inap)
              </div>
              <div class="text-caption text-blue-2">
                Daftar histori update status kepulangan pasien rawat inap ke sistem BPJS
              </div>
            </div>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-btn
              round
              flat
              dense
              icon="icon-mat-refresh"
              color="white"
              @click="store.refresh()"
            >
              <q-tooltip>Refresh Data</q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              dense
              :icon="!style.componentfull ? 'icon-mat-open_in_full' : 'icon-mat-close_fullscreen'"
              color="white"
              @click="style.setComponentFull"
            >
              <q-tooltip>Fullscreen</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <!-- Banner Informasi Whitelist BPJS -->
      <q-banner inline-actions class="bg-amber-2 text-amber-10 q-px-md q-py-sm border-bottom">
        <template #avatar>
          <q-icon name="icon-mat-warning" color="warning" size="md" />
        </template>
        <div class="text-weight-bold text-subtitle2">Pemberitahuan Sinkronisasi BPJS</div>
        <div class="text-caption">
          Fitur ini belum di-whitelist pada BPJS... <b>Tunggu tanggal mainnya! 🚀</b>
        </div>
      </q-banner>

      <!-- Filter Section -->
      <q-card-section class="q-py-sm q-px-md bg-grey-2 border-bottom">
        <div class="row q-col-gutter-sm items-center">
          <!-- Filter Bulan -->
          <div class="col-12 col-sm-3 col-md-2">
            <q-select
              v-model="store.params.bulan"
              :options="store.months"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              dense
              outlined
              bg-color="white"
              label="Bulan"
              @update:model-value="store.setBulan"
            >
              <template #prepend>
                <q-icon name="icon-mat-calendar_month" size="xs" />
              </template>
            </q-select>
          </div>

          <!-- Filter Tahun -->
          <div class="col-12 col-sm-3 col-md-2">
            <q-select
              v-model="store.params.tahun"
              :options="store.years"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              dense
              outlined
              bg-color="white"
              label="Tahun"
              @update:model-value="store.setTahun"
            >
              <template #prepend>
                <q-icon name="icon-mat-event" size="xs" />
              </template>
            </q-select>
          </div>

          <!-- Input Filter Keyword -->
          <div class="col-12 col-sm-4 col-md-4">
            <q-input
              v-model="store.params.filter"
              dense
              outlined
              bg-color="white"
              placeholder="Cari Nama / No. RM / No. SEP / No. Reg..."
              clearable
              @keyup.enter="store.searchData()"
              @clear="onClearFilter"
            >
              <template #prepend>
                <q-icon name="icon-mat-search" size="xs" />
              </template>
            </q-input>
          </div>

          <!-- Tombol Cari -->
          <div class="col-12 col-sm-2 col-md-2">
            <q-btn
              color="primary"
              unelevated
              class="full-width"
              style="height: 40px;"
              :loading="store.loading"
              @click="store.searchData()"
            >
              <q-icon name="icon-mat-search" class="q-mr-xs" />
              Cari
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <!-- Table Section -->
      <q-card-section class="col q-pa-none relative-position">
        <q-scroll-area class="fit">
          <q-markup-table
            flat
            bordered
            square
            dense
            separator="cell"
            class="fit text-grey-9"
          >
            <thead>
              <tr class="bg-grey-3 text-weight-bold text-left">
                <th style="width: 50px;" class="text-center">No</th>
                <th style="width: 220px;">Data Pasien</th>
                <th style="width: 180px;">No. SEP</th>
                <th style="width: 130px;">Tgl. Keluar</th>
                <th style="width: 150px;">Cara Keluar</th>
                <th style="width: 180px;">Diagnosa / Ket</th>
                <th style="width: 180px;">Status / Respon BPJS</th>
                <th style="width: 150px;">Waktu Update</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading Skeleton -->
              <template v-if="store.loading">
                <tr v-for="n in 5" :key="'skel-' + n">
                  <td class="text-center"><q-skeleton type="text" width="20px" class="q-mx-auto" /></td>
                  <td>
                    <q-skeleton type="text" width="140px" />
                    <q-skeleton type="text" width="90px" size="10px" />
                  </td>
                  <td><q-skeleton type="text" width="130px" /></td>
                  <td><q-skeleton type="text" width="90px" /></td>
                  <td><q-skeleton type="text" width="100px" /></td>
                  <td><q-skeleton type="text" width="120px" /></td>
                  <td><q-skeleton type="text" width="130px" /></td>
                  <td><q-skeleton type="text" width="100px" /></td>
                </tr>
              </template>

              <!-- Data Items -->
              <template v-else-if="filteredOrRawItems.length > 0">
                <tr
                  v-for="(row, idx) in filteredOrRawItems"
                  :key="row.id || row.noreg || idx"
                  class="hover-row"
                >
                  <!-- No -->
                  <td class="text-center text-weight-medium">
                    {{ idx + 1 }}
                  </td>

                  <!-- Data Pasien -->
                  <td>
                    <div class="text-weight-bold text-primary">
                      {{ getNamaPasien(row) }}
                    </div>
                    <div class="text-caption text-grey-7 row q-gutter-x-xs">
                      <span>RM: <b>{{ getNoRm(row) }}</b></span>
                      <span>|</span>
                      <span>Reg: {{ getNoReg(row) }}</span>
                    </div>
                    <div v-if="row.ruangan || row.koderuangan" class="text-caption text-indigo-7">
                      Ruang: {{ row.ruangan || row.koderuangan }}
                    </div>
                  </td>

                  <!-- No. SEP -->
                  <td>
                    <q-chip
                      square
                      dense
                      color="blue-1"
                      text-color="blue-9"
                      class="text-weight-bold text-caption"
                    >
                      <q-icon name="icon-mat-subtitles" size="12px" class="q-mr-xs" />
                      {{ getNoSep(row) }}
                    </q-chip>
                  </td>

                  <!-- Tgl Keluar -->
                  <td>
                    <div class="text-weight-medium">
                      {{ getTglKeluar(row) }}
                    </div>
                    <div v-if="row.jamkeluar || row.jam_keluar" class="text-caption text-grey-6">
                      Jam: {{ row.jamkeluar || row.jam_keluar }}
                    </div>
                  </td>

                  <!-- Cara Keluar -->
                  <td>
                    <q-chip
                      dense
                      square
                      :color="getCaraKeluarColor(row)"
                      text-color="white"
                      class="text-caption text-weight-medium"
                    >
                      {{ getCaraKeluar(row) }}
                    </q-chip>
                  </td>

                  <!-- Diagnosa / Ket -->
                  <td>
                    <div class="ellipsis-2-lines text-caption" :title="getDiagnosa(row)">
                      {{ getDiagnosa(row) }}
                    </div>
                  </td>

                  <!-- Status / Respon BPJS -->
                  <td>
                    <div class="row items-center q-gutter-x-xs">
                      <q-icon
                        :name="isSuccessBpjs(row) ? 'icon-mat-check_circle' : 'icon-mat-info'"
                        :color="isSuccessBpjs(row) ? 'positive' : 'warning'"
                        size="16px"
                      />
                      <span
                        class="text-caption text-weight-bold"
                        :class="isSuccessBpjs(row) ? 'text-positive' : 'text-warning'"
                      >
                        {{ getStatusBpjs(row) }}
                      </span>
                    </div>
                    <div v-if="getKetBpjs(row)" class="text-caption text-grey-7 ellipsis-2-lines" :title="getKetBpjs(row)">
                      {{ getKetBpjs(row) }}
                    </div>
                  </td>

                  <!-- Waktu Update -->
                  <td>
                    <div class="text-caption text-weight-medium">
                      {{ getWaktuUpdate(row) }}
                    </div>
                    <div v-if="getPetugas(row)" class="text-caption text-grey-6">
                      by: {{ getPetugas(row) }}
                    </div>
                  </td>
                </tr>
              </template>

              <!-- Empty State -->
              <tr v-else>
                <td colspan="8" class="text-center q-pa-xl">
                  <div class="column items-center justify-center text-grey-6">
                    <q-icon name="icon-mat-find_in_page" size="48px" class="q-mb-sm" />
                    <div class="text-subtitle1 text-weight-bold">Tidak ada data</div>
                    <div class="text-caption">
                      Tidak ada histori update pulang BPJS pada bulan {{ store.selectedMonthLabel }} tahun {{ store.params.tahun }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-scroll-area>
      </q-card-section>

      <!-- Footer / Summary Section -->
      <q-card-section class="q-py-xs q-px-md bg-grey-2 border-top">
        <div class="row items-center justify-between text-caption text-grey-8">
          <div>
            Total Pasien: <b class="text-primary">{{ filteredOrRawItems.length }}</b> Data
          </div>
          <div>
            Bulan: <b>{{ store.selectedMonthLabel }} {{ store.params.tahun }}</b>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStyledStore } from 'src/stores/app/styled'
import { useListUpdatePulangBpjsStore } from 'src/stores/simrs/ranap/listupdatepulangbpjs'

const style = useStyledStore()
const store = useListUpdatePulangBpjsStore()

onMounted(() => {
  store.getData()
})

const filteredOrRawItems = computed(() => {
  return store.items || []
})

function onClearFilter() {
  store.setFilter('')
  store.searchData()
}

// Helper Extractors for Dynamic Fields
function getNamaPasien(row) {
  return row.nama || row.nama_pasien || row.pasien?.nama || row.pasien || '-'
}

function getNoRm(row) {
  return row.norm || row.no_rm || row.pasien?.norm || '-'
}

function getNoReg(row) {
  return row.noreg || row.no_reg || row.no_registrasi || '-'
}

function getNoSep(row) {
  return row.sep || row.no_sep || row.nosep || row.pasien?.sep || '-'
}

function getTglKeluar(row) {
  return row.tgl_keluar || row.tglkeluar || row.tgl_pulang || row.tglpulang || '-'
}

function getCaraKeluar(row) {
  return row.carakeluar || row.cara_keluar || row.status_pulang || row.ket_carakeluar || '-'
}

function getCaraKeluarColor(row) {
  const val = (getCaraKeluar(row) || '').toLowerCase()
  if (val.includes('sembuh') || val.includes('izinkan') || val.includes('membaik')) {
    return 'positive'
  }
  if (val.includes('meninggal')) {
    return 'negative'
  }
  if (val.includes('paksa') || val.includes('permintaan sendiri')) {
    return 'warning'
  }
  if (val.includes('rujuk')) {
    return 'info'
  }
  return 'primary'
}

function getDiagnosa(row) {
  return row.diagnosa || row.diagnosa_akhir || row.diagakhir || row.keterangan || '-'
}

function getStatusBpjs(row) {
  if (row.status_bpjs) return row.status_bpjs
  if (row.status) return row.status
  if (row.code === '200' || row.status_code === '200' || row.success) return 'Sukses'
  return 'Ter-update'
}

function isSuccessBpjs(row) {
  const status = (getStatusBpjs(row) || '').toLowerCase()
  return status.includes('sukses') || status.includes('ter-update') || status.includes('200') || status.includes('berhasil')
}

function getKetBpjs(row) {
  return row.respon_bpjs || row.ket_bpjs || row.pesan_bpjs || row.message || row.ket || ''
}

function getWaktuUpdate(row) {
  return row.created_at || row.updated_at || row.tgl_update || row.waktu_update || row.tgl || '-'
}

function getPetugas(row) {
  return row.user || row.petugas || row.user_update || ''
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
.hover-row:hover {
  background-color: #f5f8ff;
}
</style>
