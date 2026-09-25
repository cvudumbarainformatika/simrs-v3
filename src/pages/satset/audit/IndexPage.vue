<template>
  <q-page class="q-pa-md bg-grey-1 satset-audit-page">
    <div class="row q-col-gutter-md">

      <!-- Premium SatuSehat Audit Header Card -->
      <div class="col-12">
        <q-card flat class="audit-header-card text-white overflow-hidden shadow-10">
          <q-card-section class="q-pa-lg relative-position">
            <div class="z-index-1 row items-center justify-between q-col-gutter-md">
              <div class="col-12 col-md-7">
                <div class="row items-center q-gutter-sm q-mb-xs">
                  <q-avatar size="38px" color="white" text-color="teal-9" icon="icon-mat-fact_check" />
                  <div class="text-h5 text-weight-bold">Audit Log & Rekonsiliasi SatuSehat 🇮🇩</div>
                </div>
                <div class="text-subtitle2 opacity-85">
                  Monitoring ketidaksesuaian input demografi pasien (SIMRS vs BPJS/Dukcapil) serta status pengiriman SatuSehat Kemenkes.
                </div>
                <div class="q-mt-md flex q-gutter-sm">
                  <!-- Button Dashboard Utama -->
                  <q-btn
                    unelevated
                    rounded
                    color="white"
                    text-color="primary"
                    label="Dashboard Kepatuhan"
                    icon="icon-mat-dashboard"
                    no-caps
                    to="/satset/dashboard"
                  />
                  <!-- Button Audit Pasien Ganda -->
                  <q-btn
                    unelevated
                    rounded
                    color="indigo-9"
                    text-color="white"
                    label="Audit Pasien Ganda"
                    icon="icon-mat-people_alt"
                    no-caps
                    to="/satset/audit-ganda"
                  />
                  <!-- Button Filter Periode Header -->
                  <q-btn
                    outline
                    rounded
                    color="white"
                    :label="periodeBtnLabel"
                    icon="icon-mat-event"
                    no-caps
                  >
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <div class="q-pa-md bg-white" style="min-width: 280px;">
                        <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">Pilih Rentang Tanggal</div>
                        <div class="q-gutter-sm">
                          <q-input v-model="store.tglAwal" type="date" dense outlined label="Tgl Awal" />
                          <q-input v-model="store.tglAkhir" type="date" dense outlined label="Tgl Akhir" />
                        </div>
                        <div class="row q-gutter-xs q-mt-sm">
                          <q-btn size="xs" color="grey-3" text-color="dark" label="Hari Ini" no-caps @click="setFilterCepat('hari_ini')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="7 Hari" no-caps @click="setFilterCepat('7_hari')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="30 Hari" no-caps @click="setFilterCepat('30_hari')" />
                          <q-btn size="xs" color="grey-3" text-color="dark" label="Bulan Ini" no-caps @click="setFilterCepat('bulan_ini')" />
                        </div>
                        <div class="row justify-end q-mt-md">
                          <q-btn v-close-popup label="Terapkan" color="primary" dense class="q-px-md" @click="store.initPage()" />
                        </div>
                      </div>
                    </q-popup-proxy>
                  </q-btn>
                  <!-- Button Refresh Data -->
                  <q-btn
                    outline
                    rounded
                    color="white"
                    label="Refresh Data"
                    icon="icon-mat-refresh"
                    no-caps
                    :loading="store.loadingStats || store.loadingList"
                    @click="store.initPage()"
                  />
                </div>
              </div>

              <!-- Right Stat Box -->
              <div class="col-12 col-md-5 text-right">
                <div class="header-stat-box text-left inline-block">
                  <div class="text-caption text-uppercase opacity-80 letter-spacing-1">Status Koreksi SIMRS</div>
                  <div class="row items-center q-gutter-md q-mt-xs">
                    <div>
                      <div class="text-h4 text-weight-bolder text-warning">{{ store.stats.total_pending }}</div>
                      <div class="text-caption opacity-80">Pending Koreksi</div>
                    </div>
                    <q-separator vertical dark class="opacity-30" style="height: 38px;" />
                    <div>
                      <div class="text-h4 text-weight-bolder text-green-3">{{ store.stats.total_diperbaiki }}</div>
                      <div class="text-caption opacity-80">Sudah Diperbaiki</div>
                    </div>
                    <q-separator vertical dark class="opacity-30" style="height: 38px;" />
                    <div>
                      <div class="text-h4 text-weight-bolder">{{ store.stats.total_temuan }}</div>
                      <div class="text-caption opacity-80">Total Temuan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Background Decorative Shapes -->
            <div class="header-shape shape-1" />
            <div class="header-shape shape-2" />
          </q-card-section>
        </q-card>
      </div>

      <!-- KPI Summary Cards Grid -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer" @click="setFilterKategori('all')">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">Semua Temuan Audit</div>
                <div class="text-h5 text-weight-bold text-dark q-mt-xs">{{ store.stats.total_temuan }}</div>
                <div class="text-caption text-grey-6 q-mt-xs">Semua jenis ketidaksesuaian</div>
              </div>
              <q-avatar size="44px" color="teal-1" text-color="teal-8" icon="icon-mat-analytics" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer" @click="setFilterKategori('PASIEN_MISMATCH_BPJS')">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">Mismatch Pasien BPJS</div>
                <div class="text-h5 text-weight-bold text-amber-9 q-mt-xs">{{ store.stats.pasien_mismatch }}</div>
                <div class="text-caption text-amber-8 q-mt-xs">NIK dummy / beda nama</div>
              </div>
              <q-avatar size="44px" color="amber-1" text-color="amber-9" icon="icon-mat-person_search" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer" @click="setFilterKategori('PEGAWAI_NIK_KOSONG')">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">Pegawai NIK Kosong</div>
                <div class="text-h5 text-weight-bold text-negative q-mt-xs">{{ store.stats.pegawai_nik_kosong }}</div>
                <div class="text-caption text-negative q-mt-xs">Dokter / nakes belum NIK</div>
              </div>
              <q-avatar size="44px" color="red-1" text-color="negative" icon="icon-mat-no_accounts" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer" @click="setFilterKategori('PEGAWAI_UNREGISTERED_SATSET')">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">Pegawai Belum Terdaftar SS</div>
                <div class="text-h5 text-weight-bold text-indigo-8 q-mt-xs">{{ store.stats.pegawai_unregistered }}</div>
                <div class="text-caption text-indigo-7 q-mt-xs">IHS Practitioner not found</div>
              </div>
              <q-avatar size="44px" color="indigo-1" text-color="indigo-8" icon="icon-mat-cloud_off" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Main Content Card with Filters & Table -->
      <div class="col-12">
        <q-card flat class="border-radius-12 shadow-1 bg-white overflow-hidden">
          
          <!-- Filter Controls Toolbar -->
          <q-card-section class="q-pa-md border-bottom-grey">
            <div class="row q-col-gutter-sm items-center">
              
              <!-- Kategori Filter Tabs / Chips -->
              <div class="col-12 col-md-auto">
                <q-btn-toggle
                  v-model="store.filterKategori"
                  dense
                  no-caps
                  unelevated
                  toggle-color="primary"
                  color="grey-2"
                  text-color="dark"
                  :options="[
                    { label: 'Semua', value: 'all' },
                    { label: 'Pasien Mismatch', value: 'PASIEN_MISMATCH_BPJS' },
                    { label: 'Pegawai NIK Kosong', value: 'PEGAWAI_NIK_KOSONG' },
                    { label: 'Pegawai Non-SS', value: 'PEGAWAI_UNREGISTERED_SATSET' },
                  ]"
                  @update:model-value="store.applyFilter()"
                />
              </div>

              <!-- Unit Filter -->
              <div class="col-6 col-sm-3 col-md-2">
                <q-select
                  v-model="store.filterUnit"
                  dense
                  outlined
                  emit-value
                  map-options
                  label="Unit"
                  :options="[
                    { label: 'Semua Unit', value: 'all' },
                    { label: 'Rawat Jalan', value: 'rajal' },
                    { label: 'Rawat Inap', value: 'ranap' },
                    { label: 'IGD', value: 'igd' },
                    { label: 'Kepegawaian', value: 'kepegawaian' },
                  ]"
                  @update:model-value="store.applyFilter()"
                />
              </div>

              <!-- Status Filter -->
              <div class="col-6 col-sm-3 col-md-2">
                <q-select
                  v-model="store.filterStatus"
                  dense
                  outlined
                  emit-value
                  map-options
                  label="Koreksi SIMRS"
                  :options="[
                    { label: 'Semua Status', value: 'all' },
                    { label: 'Pending Koreksi', value: 'PENDING' },
                    { label: 'Sudah Diperbaiki', value: 'DIPERBAIKI' },
                    { label: 'Diabaikan', value: 'DIABAIKAN' },
                  ]"
                  @update:model-value="store.applyFilter()"
                />
              </div>

              <!-- Search Input -->
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="store.searchQuery"
                  dense
                  outlined
                  placeholder="Cari Nama, No. RM, NIK, Keterangan..."
                  clearable
                  @keyup.enter="store.applyFilter()"
                  @clear="store.applyFilter()"
                >
                  <template #prepend>
                    <q-icon name="icon-mat-search" />
                  </template>
                  <template #append>
                    <q-btn flat round dense icon="icon-mat-arrow_forward" size="sm" @click="store.applyFilter()" />
                  </template>
                </q-input>
              </div>

            </div>
          </q-card-section>

          <!-- Table Content -->
          <q-card-section class="q-pa-none">
            <q-table
              flat
              dense
              :rows="store.auditList"
              :columns="columns"
              row-key="id"
              :loading="store.loadingList"
              hide-pagination
              :pagination="{ rowsPerPage: 20 }"
              no-data-label="Tidak ada data audit log yang sesuai filter"
              class="audit-table"
            >
              <!-- Slot Header -->
              <template #header="props">
                <q-tr :props="props" class="bg-grey-2 text-weight-bold">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-dark">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <!-- Slot Body -->
              <template #body="props">
                <q-tr :props="props" class="hover-row">
                  
                  <!-- No -->
                  <q-td key="no" :props="props" class="text-center" style="width: 45px;">
                    {{ (store.meta.current_page - 1) * store.meta.per_page + props.rowIndex + 1 }}
                  </q-td>

                  <!-- Waktu & Unit -->
                  <q-td key="waktu" :props="props" style="min-width: 120px;">
                    <div class="text-caption text-weight-bold text-grey-8">{{ formatTgl(props.row.created_at) }}</div>
                    <div class="q-mt-xs">
                      <q-badge
                        :color="getUnitBadgeColor(props.row.unit)"
                        :label="props.row.unit?.toUpperCase() || '-'"
                        text-color="white"
                        class="text-weight-bold"
                      />
                    </div>
                  </q-td>

                  <!-- Kategori -->
                  <q-td key="kategori" :props="props" style="min-width: 160px;">
                    <q-badge
                      :color="getKategoriBadgeColor(props.row.kategori)"
                      class="q-pa-xs q-px-sm border-radius-6 text-weight-medium"
                    >
                      <q-icon :name="getKategoriIcon(props.row.kategori)" class="q-mr-xs" />
                      {{ formatKategori(props.row.kategori) }}
                    </q-badge>
                  </q-td>

                  <!-- Identitas (Ref ID & Nama) -->
                  <q-td key="identitas" :props="props" style="min-width: 180px;">
                    <div class="text-weight-bold text-dark text-subtitle2">{{ props.row.nama || '-' }}</div>
                    <div class="row items-center q-gutter-xs text-caption text-grey-7 q-mt-xs">
                      <span class="text-weight-medium">ID/RM:</span>
                      <q-badge color="grey-3" text-color="dark" class="font-mono text-weight-bold">{{ props.row.ref_id }}</q-badge>
                      <span v-if="props.row.noreg" class="text-grey-5">|</span>
                      <span v-if="props.row.noreg" class="text-grey-6 text-caption">{{ props.row.noreg }}</span>
                    </div>
                  </q-td>

                  <!-- Perbandingan NIK / Data -->
                  <q-td key="perbandingan" :props="props" style="min-width: 200px;">
                    <div class="column q-gutter-xs">
                      <div class="row items-center no-wrap text-caption">
                        <span class="text-grey-7 text-weight-medium q-mr-xs" style="width: 48px;">SIMRS:</span>
                        <q-badge
                          :color="isNikDummy(props.row.nik_simrs) ? 'red-2' : 'grey-3'"
                          :text-color="isNikDummy(props.row.nik_simrs) ? 'negative' : 'dark'"
                          class="font-mono text-weight-bold"
                        >
                          {{ props.row.nik_simrs || '(KOSONG)' }}
                        </q-badge>
                      </div>
                      <div v-if="props.row.nik_valid" class="row items-center no-wrap text-caption">
                        <span class="text-teal-8 text-weight-medium q-mr-xs" style="width: 48px;">BPJS:</span>
                        <q-badge color="teal-1" text-color="teal-9" class="font-mono text-weight-bold">
                          {{ props.row.nik_valid }}
                        </q-badge>
                      </div>
                    </div>
                  </q-td>

                  <!-- Status SatuSehat (INFO PENGIRIMAN) -->
                  <q-td key="satset_status" :props="props" class="text-center" style="min-width: 130px;">
                    <q-badge
                      v-if="props.row.satset_terkirim"
                      color="teal-9"
                      icon="icon-mat-check_circle"
                      label="Terkirim (Sukses)"
                      class="q-pa-xs q-px-sm border-radius-6 text-weight-bold"
                    >
                      <q-tooltip>Transaksi Bundle SatuSehat Berhasil Terkirim</q-tooltip>
                    </q-badge>
                    <q-badge
                      v-else-if="props.row.satset_ihs_uuid"
                      color="indigo-8"
                      icon="icon-mat-verified_user"
                      label="IHS Terdaftar"
                      class="q-pa-xs q-px-sm border-radius-6 text-weight-bold"
                    >
                      <q-tooltip>IHS ID Terdaftar: {{ props.row.satset_ihs_uuid }}</q-tooltip>
                    </q-badge>
                    <q-badge
                      v-else-if="props.row.satset_error"
                      color="negative"
                      icon="icon-mat-error"
                      label="Error Kirim"
                      class="q-pa-xs q-px-sm border-radius-6 text-weight-bold"
                    >
                      <q-tooltip>Gagal Kirim ke SatuSehat</q-tooltip>
                    </q-badge>
                    <q-badge
                      v-else
                      color="grey-5"
                      text-color="dark"
                      icon="icon-mat-hourglass_empty"
                      label="Belum Kirim"
                      class="q-pa-xs q-px-sm border-radius-6 text-weight-medium"
                    />
                  </q-td>

                  <!-- Status Koreksi SIMRS -->
                  <q-td key="status" :props="props" class="text-center" style="width: 140px;">
                    <q-badge
                      :color="getStatusBadgeColor(props.row.status_perbaikan)"
                      class="q-pa-xs q-px-sm border-radius-6 text-weight-bold"
                    >
                      <q-icon :name="getStatusIcon(props.row.status_perbaikan)" class="q-mr-xs" />
                      {{ props.row.status_perbaikan === 'PENDING' ? 'Pending Koreksi' : (props.row.status_perbaikan === 'DIPERBAIKI' ? 'Sudah Diperbaiki' : 'Diabaikan') }}
                    </q-badge>
                    <div v-if="props.row.user_perbaikan" class="text-caption text-grey-6 text-2xs q-mt-xs">
                      oleh: {{ props.row.user_perbaikan }}
                    </div>
                  </q-td>

                  <!-- Aksi -->
                  <q-td key="aksi" :props="props" class="text-center" style="width: 100px;">
                    <div class="row items-center justify-center q-gutter-xs">
                      <!-- Tombol Detail / Komparasi -->
                      <q-btn
                        flat
                        round
                        dense
                        color="primary"
                        icon="icon-mat-visibility"
                        size="sm"
                        @click="store.openDetail(props.row)"
                      >
                        <q-tooltip>Lihat Detail Komparasi Data</q-tooltip>
                      </q-btn>

                      <!-- Quick Action Dropdown -->
                      <q-btn-dropdown flat round dense color="grey-7" icon="icon-mat-more_vert" size="sm">
                        <q-list dense style="min-width: 160px;">
                          <q-item
                            v-if="props.row.status_perbaikan !== 'DIPERBAIKI'"
                            v-close-popup
                            clickable
                            class="text-positive"
                            @click="store.updateStatus(props.row.id, 'DIPERBAIKI')"
                          >
                            <q-item-section avatar>
                              <q-icon name="icon-mat-check_circle" size="xs" />
                            </q-item-section>
                            <q-item-section>Tandai Diperbaiki</q-item-section>
                          </q-item>

                          <q-item
                            v-if="props.row.status_perbaikan !== 'DIABAIKAN'"
                            v-close-popup
                            clickable
                            class="text-grey-8"
                            @click="store.updateStatus(props.row.id, 'DIABAIKAN')"
                          >
                            <q-item-section avatar>
                              <q-icon name="icon-mat-do_not_disturb_on" size="xs" />
                            </q-item-section>
                            <q-item-section>Tandai Diabaikan</q-item-section>
                          </q-item>

                          <q-item
                            v-if="props.row.status_perbaikan !== 'PENDING'"
                            v-close-popup
                            clickable
                            class="text-warning"
                            @click="store.updateStatus(props.row.id, 'PENDING')"
                          >
                            <q-item-section avatar>
                              <q-icon name="icon-mat-replay" size="xs" />
                            </q-item-section>
                            <q-item-section>Kembalikan Pending</q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </q-td>

                </q-tr>
              </template>
            </q-table>

            <!-- Pagination Bar -->
            <div class="row items-center justify-between q-pa-md border-top-grey bg-white">
              <div class="text-caption text-grey-7">
                Menampilkan {{ (store.meta.current_page - 1) * store.meta.per_page + 1 }} - 
                {{ Math.min(store.meta.current_page * store.meta.per_page, store.meta.total) }} 
                dari {{ store.meta.total }} temuan audit
              </div>
              <q-pagination
                v-model="store.meta.current_page"
                :max="store.meta.last_page || 1"
                :max-pages="6"
                direction-links
                boundary-links
                color="primary"
                active-color="primary"
                size="sm"
                @update:model-value="store.getList($event)"
              />
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- Dialog Detail Komparasi Data -->
    <q-dialog v-model="store.dialogDetail" transition-show="scale" transition-hide="scale">
      <q-card style="width: 720px; max-width: 95vw;" class="border-radius-15 overflow-hidden">
        
        <!-- Dialog Header -->
        <q-card-section class="bg-primary text-white q-pa-md">
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-sm">
              <q-avatar size="32px" color="white" text-color="primary" icon="icon-mat-compare_arrows" />
              <div class="text-h6 text-weight-bold">Detail & Rekonsiliasi Data</div>
            </div>
            <q-btn v-close-popup flat round dense icon="icon-mat-close" text-color="white" />
          </div>
        </q-card-section>

        <!-- Dialog Body -->
        <q-card-section v-if="store.selectedItem" class="q-pa-md">
          
          <!-- Status SatuSehat Banner di Modal -->
          <div
            class="q-pa-sm border-radius-8 q-mb-md row items-center justify-between"
            :class="store.selectedItem.satset_terkirim ? 'bg-teal-1 text-teal-10 border-teal' : (store.selectedItem.satset_ihs_uuid ? 'bg-indigo-1 text-indigo-10 border-indigo' : 'bg-grey-2 text-dark')"
          >
            <div class="row items-center q-gutter-xs text-caption">
              <q-icon :name="store.selectedItem.satset_terkirim ? 'icon-mat-check_circle' : (store.selectedItem.satset_ihs_uuid ? 'icon-mat-verified_user' : 'icon-mat-info')" size="sm" />
              <span>
                <strong>Status Pengiriman SatuSehat:</strong> 
                {{ store.selectedItem.satset_terkirim ? 'Sudah Berhasil Terkirim ke SatuSehat Kemkes' : (store.selectedItem.satset_ihs_uuid ? 'IHS Patient ID Terdaftar di SatuSehat' : 'Belum Ada Riwayat Sukses Kirim') }}
              </span>
            </div>
            <q-badge v-if="store.selectedItem.satset_ihs_uuid" color="indigo-9" class="font-mono">
              IHS: {{ store.selectedItem.satset_ihs_uuid }}
            </q-badge>
          </div>

          <!-- Summary Info Banner -->
          <div class="q-pa-sm bg-grey-2 border-radius-8 q-mb-md">
            <div class="row q-col-gutter-sm text-caption">
              <div class="col-6 col-md-3">
                <span class="text-grey-7">Kategori:</span>
                <div class="text-weight-bold">{{ formatKategori(store.selectedItem.kategori) }}</div>
              </div>
              <div class="col-6 col-md-3">
                <span class="text-grey-7">Unit Layanan:</span>
                <div class="text-weight-bold">{{ store.selectedItem.unit?.toUpperCase() || '-' }}</div>
              </div>
              <div class="col-6 col-md-3">
                <span class="text-grey-7">No. RM / ID:</span>
                <div class="text-weight-bold font-mono">{{ store.selectedItem.ref_id }}</div>
              </div>
              <div class="col-6 col-md-3">
                <span class="text-grey-7">Koreksi SIMRS:</span>
                <q-badge :color="getStatusBadgeColor(store.selectedItem.status_perbaikan)" class="text-weight-bold">
                  {{ store.selectedItem.status_perbaikan === 'PENDING' ? 'Pending Koreksi' : (store.selectedItem.status_perbaikan === 'DIPERBAIKI' ? 'Sudah Diperbaiki' : 'Diabaikan') }}
                </q-badge>
              </div>
            </div>
          </div>

          <!-- Keterangan Temuan Alert -->
          <div class="q-pa-sm bg-amber-1 border-amber-light border-radius-8 q-mb-md row items-start q-gutter-sm">
            <q-icon name="icon-mat-warning" color="amber-9" size="sm" class="q-mt-xs" />
            <div class="col">
              <div class="text-caption text-weight-bold text-amber-10">Catatan Temuan:</div>
              <div class="text-caption text-grey-9">{{ store.selectedItem.keterangan }}</div>
            </div>
          </div>

          <!-- Side-by-Side Comparison Table (Jika Data Pasien Mismatch) -->
          <div v-if="store.selectedItem.data_simrs || store.selectedItem.data_pembanding">
            <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm row items-center q-gutter-xs">
              <q-icon name="icon-mat-table_chart" />
              <span>Komparasi Data Input SIMRS vs Data Resmi BPJS/Dukcapil</span>
            </div>

            <q-markup-table flat bordered dense class="comparison-table border-radius-8">
              <thead>
                <tr class="bg-grey-3">
                  <th class="text-left" style="width: 140px;">Parameter</th>
                  <th class="text-left bg-red-1 text-negative">Data Input SIMRS</th>
                  <th class="text-left bg-teal-1 text-teal-9">Data Resmi BPJS / Dukcapil</th>
                </tr>
              </thead>
              <tbody>
                <!-- Nama -->
                <tr>
                  <td class="text-weight-medium">Nama Pasien</td>
                  <td :class="isDiff(store.selectedItem.data_simrs?.nama, store.selectedItem.data_pembanding?.nama) ? 'bg-red-1 text-negative text-weight-bold' : ''">
                    {{ store.selectedItem.data_simrs?.nama || '-' }}
                  </td>
                  <td class="text-weight-bold text-teal-9">
                    {{ store.selectedItem.data_pembanding?.nama || '-' }}
                  </td>
                </tr>

                <!-- NIK -->
                <tr>
                  <td class="text-weight-medium">NIK</td>
                  <td :class="isDiff(store.selectedItem.data_simrs?.nik, store.selectedItem.data_pembanding?.nik) ? 'bg-red-1 text-negative text-weight-bold font-mono' : 'font-mono'">
                    {{ store.selectedItem.data_simrs?.nik || '(KOSONG)' }}
                    <q-badge v-if="isNikDummy(store.selectedItem.data_simrs?.nik)" color="negative" class="q-ml-xs">DUMMY</q-badge>
                  </td>
                  <td class="text-weight-bold text-teal-9 font-mono">
                    {{ store.selectedItem.data_pembanding?.nik || '-' }}
                  </td>
                </tr>

                <!-- Tgl Lahir -->
                <tr>
                  <td class="text-weight-medium">Tanggal Lahir</td>
                  <td :class="isDiff(store.selectedItem.data_simrs?.tgllahir, store.selectedItem.data_pembanding?.tglLahir) ? 'bg-red-1 text-negative text-weight-bold' : ''">
                    {{ store.selectedItem.data_simrs?.tgllahir || '-' }}
                  </td>
                  <td class="text-weight-bold text-teal-9">
                    {{ store.selectedItem.data_pembanding?.tglLahir || '-' }}
                  </td>
                </tr>

                <!-- Jenis Kelamin -->
                <tr v-if="store.selectedItem.data_pembanding?.sex">
                  <td class="text-weight-medium">Jenis Kelamin</td>
                  <td>{{ store.selectedItem.data_simrs?.sex || '-' }}</td>
                  <td class="text-weight-bold text-teal-9">
                    {{ store.selectedItem.data_pembanding?.sex === 'L' ? 'Laki-laki' : (store.selectedItem.data_pembanding?.sex === 'P' ? 'Perempuan' : store.selectedItem.data_pembanding?.sex) }}
                  </td>
                </tr>

                <!-- No Kartu BPJS -->
                <tr v-if="store.selectedItem.data_pembanding?.noKartu">
                  <td class="text-weight-medium">No. Kartu BPJS</td>
                  <td class="font-mono">{{ store.selectedItem.data_simrs?.noka || '-' }}</td>
                  <td class="text-weight-bold text-teal-9 font-mono">{{ store.selectedItem.data_pembanding?.noKartu }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <!-- Tindakan Rekonsiliasi Petunjuk -->
          <div class="q-mt-md q-pa-sm bg-blue-1 border-radius-8 text-caption text-primary">
            <q-icon name="icon-mat-info" size="xs" class="q-mr-xs" />
            <span><strong>Tanggung Jawab Administrator:</strong> Harap lakukan pembaruan data yang tidak valid di Master Pasien / Master SIMPEG SIMRS agar data master selalu akurat dan valid.</span>
          </div>

        </q-card-section>

        <!-- Dialog Actions -->
        <q-card-section class="bg-grey-1 q-pa-md border-top-grey row items-center justify-between">
          <div class="text-caption text-grey-6">
            Ditemukan: {{ formatTgl(store.selectedItem?.created_at) }}
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              v-if="store.selectedItem?.status_perbaikan !== 'DIABAIKAN'"
              outline
              color="grey-7"
              label="Tandai Diabaikan"
              icon="icon-mat-do_not_disturb_on"
              no-caps
              :loading="store.loadingAction"
              @click="store.updateStatus(store.selectedItem.id, 'DIABAIKAN')"
            />
            <q-btn
              v-if="store.selectedItem?.status_perbaikan !== 'DIPERBAIKI'"
              unelevated
              color="positive"
              label="Tandai Sudah Diperbaiki"
              icon="icon-mat-check_circle"
              no-caps
              :loading="store.loadingAction"
              @click="store.updateStatus(store.selectedItem.id, 'DIPERBAIKI')"
            />
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSatsetAuditStore } from 'src/stores/satset/audit'
import { date } from 'quasar'

const store = useSatsetAuditStore()

const columns = [
  { name: 'no', label: 'No', align: 'center' },
  { name: 'waktu', label: 'Waktu & Unit', align: 'left' },
  { name: 'kategori', label: 'Kategori', align: 'left' },
  { name: 'identitas', label: 'Identitas (Nama & ID)', align: 'left' },
  { name: 'perbandingan', label: 'Perbandingan NIK', align: 'left' },
  { name: 'satset_status', label: 'Status SatuSehat', align: 'center' },
  { name: 'status', label: 'Koreksi SIMRS', align: 'center' },
  { name: 'aksi', label: 'Aksi', align: 'center' },
]

const periodeBtnLabel = computed(() => {
  if (store.tglAwal === store.tglAkhir) {
    return date.formatDate(store.tglAwal, 'DD MMM YYYY')
  }
  return `${date.formatDate(store.tglAwal, 'DD MMM')} - ${date.formatDate(store.tglAkhir, 'DD MMM YYYY')}`
})

onMounted(() => {
  store.initPage()
})

function setFilterKategori(val) {
  store.filterKategori = val
  store.applyFilter()
}

function setFilterCepat(jenis) {
  const today = new Date()
  if (jenis === 'hari_ini') {
    store.tglAwal = date.formatDate(today, 'YYYY-MM-DD')
    store.tglAkhir = date.formatDate(today, 'YYYY-MM-DD')
  } else if (jenis === '7_hari') {
    store.tglAwal = date.formatDate(date.subtractFromDate(today, { days: 7 }), 'YYYY-MM-DD')
    store.tglAkhir = date.formatDate(today, 'YYYY-MM-DD')
  } else if (jenis === '30_hari') {
    store.tglAwal = date.formatDate(date.subtractFromDate(today, { days: 30 }), 'YYYY-MM-DD')
    store.tglAkhir = date.formatDate(today, 'YYYY-MM-DD')
  } else if (jenis === 'bulan_ini') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    store.tglAwal = date.formatDate(startOfMonth, 'YYYY-MM-DD')
    store.tglAkhir = date.formatDate(today, 'YYYY-MM-DD')
  }
}

function formatTgl(val) {
  if (!val) return '-'
  return date.formatDate(val, 'DD/MM/YYYY HH:mm')
}

function formatKategori(kat) {
  if (kat === 'PASIEN_MISMATCH_BPJS') return 'Mismatch Pasien BPJS'
  if (kat === 'PEGAWAI_NIK_KOSONG') return 'Pegawai NIK Kosong'
  if (kat === 'PEGAWAI_UNREGISTERED_SATSET') return 'Pegawai Non-SatuSehat'
  return kat || 'Temuan Audit'
}

function getKategoriBadgeColor(kat) {
  if (kat === 'PASIEN_MISMATCH_BPJS') return 'amber-9'
  if (kat === 'PEGAWAI_NIK_KOSONG') return 'negative'
  if (kat === 'PEGAWAI_UNREGISTERED_SATSET') return 'indigo-8'
  return 'primary'
}

function getKategoriIcon(kat) {
  if (kat === 'PASIEN_MISMATCH_BPJS') return 'icon-mat-person_search'
  if (kat === 'PEGAWAI_NIK_KOSONG') return 'icon-mat-no_accounts'
  if (kat === 'PEGAWAI_UNREGISTERED_SATSET') return 'icon-mat-cloud_off'
  return 'icon-mat-info'
}

function getUnitBadgeColor(unit) {
  if (unit === 'rajal') return 'primary'
  if (unit === 'ranap') return 'purple-8'
  if (unit === 'igd') return 'deep-orange'
  if (unit === 'kepegawaian') return 'blue-grey-8'
  return 'grey-7'
}

function getStatusBadgeColor(st) {
  if (st === 'DIPERBAIKI') return 'positive'
  if (st === 'DIABAIKAN') return 'grey-6'
  return 'warning'
}

function getStatusIcon(st) {
  if (st === 'DIPERBAIKI') return 'icon-mat-check_circle'
  if (st === 'DIABAIKAN') return 'icon-mat-do_not_disturb_on'
  return 'icon-mat-schedule'
}

function isNikDummy(nik) {
  if (!nik) return true
  const s = String(nik).trim()
  return s.length < 16 || s.startsWith('8888') || s.startsWith('9999') || s.startsWith('0000')
}

function isDiff(a, b) {
  if (!a || !b) return true
  return String(a).trim().toLowerCase() !== String(b).trim().toLowerCase()
}
</script>

<style lang="scss" scoped>
.satset-audit-page {
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.audit-header-card {
  background: linear-gradient(135deg, #005C53 0%, #042940 100%);
  border-radius: 16px;
  position: relative;
}

.header-stat-box {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.header-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  pointer-events: none;
}

.shape-1 {
  width: 260px;
  height: 260px;
  right: -40px;
  top: -80px;
}

.shape-2 {
  width: 180px;
  height: 180px;
  right: 180px;
  bottom: -60px;
}

.stat-card {
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #E2E8F0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
    border-color: #00A896;
  }
}

.border-radius-6 {
  border-radius: 6px;
}

.border-radius-8 {
  border-radius: 8px;
}

.border-radius-12 {
  border-radius: 12px;
}

.border-radius-15 {
  border-radius: 15px;
}

.border-bottom-grey {
  border-bottom: 1px solid #ECEFF1;
}

.border-top-grey {
  border-top: 1px solid #ECEFF1;
}

.border-amber-light {
  border: 1px solid rgba(255, 179, 0, 0.3);
}

.border-teal {
  border: 1px solid rgba(0, 168, 150, 0.3);
}

.border-indigo {
  border: 1px solid rgba(63, 81, 181, 0.3);
}

.font-mono {
  font-family: monospace;
}

.hover-row {
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #F8FAFC !important;
  }
}

.white-space-normal {
  white-space: normal !important;
}

.text-2xs {
  font-size: 0.65rem;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-85 {
  opacity: 0.85;
}

.opacity-30 {
  opacity: 0.3;
}

.letter-spacing-1 {
  letter-spacing: 0.5px;
}
</style>
