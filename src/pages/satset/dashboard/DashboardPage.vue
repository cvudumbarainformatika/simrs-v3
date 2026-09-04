<template>
  <q-page class="q-pa-md bg-grey-1 style-dashboard">
    <div class="row q-col-gutter-lg">

      <!-- Premium Header Card (100% Identik Radiologi) -->
      <div class="col-12">
        <q-card flat class="welcome-card text-white overflow-hidden shadow-10">
          <q-card-section class="q-pa-xl relative-position">
            <div class="z-index-1 row items-center justify-between">
              <div class="col-12 col-md-7">
                <div class="text-h4 text-weight-bold q-mb-xs">Dashboard SatuSehat Kemkes 🇮🇩</div>
                <div class="text-subtitle1 opacity-80">
                  Ringkasan visual dan analitik kepatuhan pengiriman data Rawat Jalan, Rawat Inap, dan IGD ke platform SatuSehat (Periode {{ currentMonthYear }}).
                </div>
                <div class="q-mt-lg flex q-gutter-sm">
                  <!-- Button Filter Periode -->
                  <q-btn
                    unelevated
                    rounded
                    color="white"
                    text-color="primary"
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
                          <q-btn size="xs" color="grey-3" text-color="dark" label="Bulan Ini" no-caps @click="setFilterCepat('bulan_ini')" />
                        </div>
                        <div class="row justify-end q-mt-md">
                          <q-btn v-close-popup label="Terapkan" color="primary" dense class="q-px-md" @click="store.initDashboard()" />
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
                    :loading="store.loadingSummary"
                    @click="store.initDashboard()"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4 text-right q-mt-md-none q-mt-lg">
                <div class="header-stat-box">
                  <div class="text-overline">Kepatuhan Pengiriman</div>
                  <div class="text-h3 text-weight-bolder">{{ store.summary?.compliance_rate || '0%' }}</div>
                  <div class="text-caption text-weight-bold">Update: {{ currentTime }}</div>
                </div>
              </div>
            </div>
            <!-- Decorative Shapes -->
            <div class="header-shape shape-1"></div>
            <div class="header-shape shape-2"></div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-dots size="50px" color="white" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- 4 Status Cards (100% Identik Radiologi) -->
      <!-- Card 1: Total Kunjungan -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">TOTAL KUNJUNGAN</div>
              <div class="text-h5 text-weight-bolder text-primary">{{ formatNumber(store.summary?.total_kunjungan) }}</div>
              <div class="text-caption text-weight-bold text-blue items-center flex q-mt-xs">
                <q-icon name="icon-mat-receipt" size="xs" class="q-mr-xs" />
                Kunjungan SIMRS
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="primary" text-color="white" icon="icon-mat-receipt" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-oval size="20px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 2: Terkirim Sukses -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">TERKIRIM SUKSES</div>
              <div class="text-h5 text-weight-bolder text-teal-9">{{ formatNumber(store.summary?.total_terkirim) }}</div>
              <div class="text-caption text-weight-bold text-teal items-center flex q-mt-xs">
                <q-icon name="icon-mat-check_circle" size="xs" class="q-mr-xs" />
                Bundle Sukses (201)
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="teal" text-color="white" icon="icon-mat-cloud_done" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-oval size="20px" color="teal" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 3: Resource FHIR -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">RESOURCE FHIR</div>
              <div class="text-h5 text-weight-bolder text-purple-9">{{ formatNumber(store.totalResourceTerkirim) }}</div>
              <div class="text-caption text-weight-bold text-purple items-center flex q-mt-xs">
                <q-icon name="icon-mat-hub" size="xs" class="q-mr-xs" />
                Entry Resource Aktif
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="purple" text-color="white" icon="icon-mat-dataset" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingResource">
            <q-spinner-oval size="20px" color="purple" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Card 4: Gagal / Error -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat class="stat-card border-radius-15 transition-hover shadow-sm">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-overline text-grey-7">GAGAL / ERROR</div>
              <div class="text-h5 text-weight-bolder text-orange-9">{{ formatNumber(store.summary?.total_error) }}</div>
              <div class="text-caption text-weight-bold text-orange-9 items-center flex q-mt-xs">
                <q-icon name="icon-mat-warning" size="xs" class="q-mr-xs" />
                Perlu Tindak Lanjut
              </div>
            </div>
            <div class="col-auto">
              <q-avatar color="orange-9" text-color="white" icon="icon-mat-error_outline" size="50px" class="shadow-2" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingSummary">
            <q-spinner-oval size="20px" color="orange-9" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Visualizations Row (Identik 100% Radiologi 8 cols vs 4 cols) -->
      <!-- Left: Horizontal Bar Chart Resource FHIR (8 cols) -->
      <div class="col-12 col-md-8">
        <q-card flat class="border-radius-15 shadow-sm full-height">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Rincian Resource FHIR Terkirim ke SatuSehat</div>
            <q-space />
            <q-badge outline color="primary" :label="`${store.resourceStats.length} Resource`" />
          </q-card-section>
          <q-card-section>
            <div v-if="!store.resourceStats?.length && !store.loadingResource" class="text-center q-pa-xl text-grey-6">
              Belum ada data resource pada periode ini.
            </div>
            <div v-else>
              <apexchart type="bar" height="320" :options="chartOptionsResources" :series="seriesResources" />
            </div>
          </q-card-section>
          <q-inner-loading :showing="store.loadingResource">
            <q-spinner-box size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Right: Donut Chart & Top 5 Errors List (4 cols) -->
      <div class="col-12 col-md-4">
        <div class="column q-gutter-lg">
          <!-- Donut Chart Komposisi Pengiriman Modul -->
          <q-card flat class="border-radius-15 shadow-sm">
            <q-card-section class="q-pb-none text-center">
              <div class="text-subtitle1 text-weight-bold">Komposisi Pengiriman Modul</div>
            </q-card-section>
            <q-card-section>
              <apexchart type="donut" height="240" :options="chartOptionsDonutModul" :series="seriesDonutModul" />
            </q-card-section>
            <q-inner-loading :showing="store.loadingSummary">
              <q-spinner-pie size="50px" color="primary" />
            </q-inner-loading>
          </q-card>

          <!-- Top 5 Errors List (Identik Top Ruangan Radiologi) -->
          <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
            <q-card-section class="bg-teal-9 text-white q-pa-sm row items-center">
              <q-icon name="icon-mat-error_outline" size="sm" class="q-mr-sm" />
              <div class="text-subtitle2">Top 5 Penyebab Error</div>
            </q-card-section>
            <q-list separator class="scroll" style="max-height: 200px;">
              <div v-if="!store.topErrors?.length && !store.loadingErrorStats" class="text-center q-pa-md text-grey-6 text-caption">
                Tidak ada catatan error pada periode ini.
              </div>
              <q-item v-for="(err, idx) in top5Errors" :key="idx" class="q-py-sm">
                <q-item-section avatar style="min-width: 35px;">
                  <q-avatar size="28px" color="teal-1" text-color="teal-9" class="text-weight-bold f-12">
                    {{ idx + 1 }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold f-12 text-grey-9 ellipsis">{{ err.pesan_error }}</q-item-label>
                  <q-tooltip anchor="top middle" self="bottom middle">{{ err.pesan_error }}</q-tooltip>
                </q-item-section>
                <q-item-section side>
                  <q-chip dense color="orange-1" text-color="orange-9" class="text-weight-bold f-10" :label="`${err.total} Kasus`" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

      <!-- 3 Modul Cards (Rawat Jalan, Rawat Inap, IGD) -->
      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="blue-1" text-color="primary" icon="icon-mat-medical_services" size="36px" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Rawat Jalan (Rajal)</div>
                  <div class="text-caption text-grey-6">Poliklinik & Spesialis</div>
                </div>
              </div>
              <q-badge color="primary" class="q-pa-xs text-weight-bold f-12" :label="store.detailModul?.rajal?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.rajal?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.rajal?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.rajal?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.rajal?.rate)"
              color="primary"
              track-color="blue-1"
              size="8px"
              class="q-mt-sm rounded-borders"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="teal-1" text-color="teal-9" icon="icon-mat-hotel" size="36px" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Rawat Inap (Ranap)</div>
                  <div class="text-caption text-grey-6">Ruang Perawatan & Kelas</div>
                </div>
              </div>
              <q-badge color="teal-9" class="q-pa-xs text-weight-bold f-12" :label="store.detailModul?.ranap?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.ranap?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.ranap?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.ranap?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.ranap?.rate)"
              color="teal-9"
              track-color="teal-1"
              size="8px"
              class="q-mt-sm rounded-borders"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-15 shadow-sm transition-hover">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap">
                <q-avatar color="deep-orange-1" text-color="deep-orange" icon="icon-mat-emergency" size="36px" class="q-mr-sm" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-dark">Gawat Darurat (IGD)</div>
                  <div class="text-caption text-grey-6">Instalasi Rawat Darurat</div>
                </div>
              </div>
              <q-badge color="deep-orange" class="q-pa-xs text-weight-bold f-12" :label="store.detailModul?.igd?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.igd?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-teal-9">{{ formatNumber(store.detailModul?.igd?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.igd?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.igd?.rate)"
              color="deep-orange"
              track-color="deep-orange-1"
              size="8px"
              class="q-mt-sm rounded-borders"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Detail Table Container with Tabs -->
      <div class="col-12">
        <q-card flat class="border-radius-15 shadow-sm overflow-hidden">
          <q-tabs
            v-model="store.activeTab"
            dense
            class="text-grey-7 bg-grey-2 q-pa-xs"
            active-color="primary"
            active-bg-color="white"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="kunjungan" icon="icon-mat-view_list" label="Tabel Monitoring Kunjungan" no-caps class="rounded-borders q-mr-xs" />
            <q-tab name="error" icon="icon-mat-warning" label="Laporan Pengiriman Gagal / Error" no-caps class="rounded-borders">
              <q-badge v-if="store.summary?.total_error > 0" color="negative" floating>{{ store.summary?.total_error }}</q-badge>
            </q-tab>
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="store.activeTab" animated class="bg-white">
            <!-- TAB 1: MONITORING KUNJUNGAN -->
            <q-tab-panel name="kunjungan" class="q-pa-md">
              <div class="row items-center justify-between q-mb-md">
                <!-- Modul Filter Chips -->
                <div class="row items-center q-gutter-xs">
                  <q-btn
                    dense
                    unelevated
                    rounded
                    :color="store.filterJenis === 'all' ? 'primary' : 'grey-3'"
                    :text-color="store.filterJenis === 'all' ? 'white' : 'dark'"
                    label="Semua Modul"
                    no-caps
                    class="q-px-md"
                    @click="store.setFilterJenis('all')"
                  />
                  <q-btn
                    dense
                    unelevated
                    rounded
                    :color="store.filterJenis === 'rajal' ? 'primary' : 'grey-3'"
                    :text-color="store.filterJenis === 'rajal' ? 'white' : 'dark'"
                    label="Rawat Jalan"
                    no-caps
                    class="q-px-md"
                    @click="store.setFilterJenis('rajal')"
                  />
                  <q-btn
                    dense
                    unelevated
                    rounded
                    :color="store.filterJenis === 'ranap' ? 'teal-9' : 'grey-3'"
                    :text-color="store.filterJenis === 'ranap' ? 'white' : 'dark'"
                    label="Rawat Inap"
                    no-caps
                    class="q-px-md"
                    @click="store.setFilterJenis('ranap')"
                  />
                  <q-btn
                    dense
                    unelevated
                    rounded
                    :color="store.filterJenis === 'igd' ? 'deep-orange' : 'grey-3'"
                    :text-color="store.filterJenis === 'igd' ? 'white' : 'dark'"
                    label="IGD"
                    no-caps
                    class="q-px-md"
                    @click="store.setFilterJenis('igd')"
                  />
                </div>

                <!-- Search Input -->
                <q-input
                  v-model="store.searchQuery"
                  dense
                  outlined
                  rounded
                  placeholder="Cari No Reg / RM / Pasien / NIK..."
                  style="width: 320px;"
                  @keyup.enter="store.getListKunjungan(1)"
                >
                  <template #append>
                    <q-icon name="icon-mat-search" class="cursor-pointer" @click="store.getListKunjungan(1)" />
                  </template>
                </q-input>
              </div>

              <!-- Tabel Monitoring (q-table) -->
              <q-table
                flat
                bordered
                dense
                separator="horizontal"
                :rows="store.kunjunganList"
                :columns="columnsKunjungan"
                row-key="noreg"
                :loading="store.loadingListKunjungan"
                :pagination="{ rowsPerPage: store.kunjunganMeta.per_page }"
                hide-pagination
                class="border-radius-15"
              >
                <template #body-cell-nomor="props">
                  <q-td :props="props" class="text-grey-7">
                    {{ (store.kunjunganMeta.current_page - 1) * store.kunjunganMeta.per_page + props.rowIndex + 1 }}
                  </q-td>
                </template>

                <template #body-cell-noreg="props">
                  <q-td :props="props">
                    <div class="text-weight-bold text-primary">{{ props.row.noreg }}</div>
                    <div class="text-caption text-grey-7">RM: {{ props.row.norm }}</div>
                  </q-td>
                </template>

                <template #body-cell-pasien="props">
                  <q-td :props="props">
                    <div class="text-weight-bold">{{ props.row.nama_pasien || '-' }}</div>
                    <div class="text-caption text-grey-7 font-mono">NIK: {{ props.row.nik || '-' }}</div>
                  </q-td>
                </template>

                <template #body-cell-modul="props">
                  <q-td :props="props">
                    <q-badge
                      :color="props.row.modul === 'rajal' ? 'primary' : props.row.modul === 'ranap' ? 'teal-9' : 'deep-orange'"
                      :label="(props.row.modul || '').toUpperCase()"
                    />
                  </q-td>
                </template>

                <template #body-cell-status="props">
                  <q-td :props="props" class="text-center">
                    <q-badge v-if="props.row.satset" color="teal-9" icon="icon-mat-check_circle" label="Terkirim" />
                    <q-badge v-else-if="props.row.satset_error" color="negative" icon="icon-mat-error" label="Error" />
                    <q-badge v-else color="grey-6" label="Pending" />
                  </q-td>
                </template>

                <template #body-cell-resource="props">
                  <q-td :props="props">
                    <div v-if="props.row.satset?.list_resource?.length" class="row q-gutter-xs">
                      <q-chip
                        v-for="(res, rIdx) in props.row.satset.list_resource.slice(0, 4)"
                        :key="rIdx"
                        dense
                        color="blue-1"
                        text-color="primary"
                        class="f-10"
                        :label="res.resource_type"
                      />
                      <q-badge v-if="props.row.satset.list_resource.length > 4" color="grey-5" text-color="dark">
                        +{{ props.row.satset.list_resource.length - 4 }}
                      </q-badge>
                    </div>
                    <div v-else-if="props.row.satset_error" class="text-caption text-negative ellipsis" style="max-width: 250px;">
                      {{ props.row.satset_error.error_summary }}
                    </div>
                    <span v-else class="text-grey-5">-</span>
                  </q-td>
                </template>

                <template #body-cell-aksi="props">
                  <q-td :props="props" class="text-center">
                    <q-btn flat round dense color="primary" icon="icon-mat-visibility" @click="store.getDetailKunjungan(props.row.noreg, props.row.modul)">
                      <q-tooltip>Lihat Detail JSON</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense color="teal-9" icon="icon-mat-send" :loading="store.loadingRetry && store.retryNoreg === props.row.noreg" @click="store.retrySingle(props.row.noreg, props.row.modul)">
                      <q-tooltip>Kirim Ulang ke SatuSehat</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>

              <!-- Pagination Kunjungan -->
              <div class="row items-center justify-between q-mt-md">
                <div class="text-caption text-grey-7">
                  Menampilkan {{ store.kunjunganList.length }} dari {{ store.kunjunganMeta.total }} data
                </div>
                <q-pagination
                  v-model="store.kunjunganMeta.current_page"
                  :max="store.kunjunganMeta.last_page"
                  :max-pages="6"
                  direction-links
                  boundary-links
                  color="primary"
                  size="sm"
                  @update:model-value="(val) => store.getListKunjungan(val)"
                />
              </div>
            </q-tab-panel>

            <!-- TAB 2: LAPORAN ERROR -->
            <q-tab-panel name="error" class="q-pa-md">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-subtitle2 text-negative items-center flex">
                  <q-icon name="icon-mat-error_outline" size="sm" class="q-mr-xs" />
                  Daftar Respon Error SatuSehat
                </div>
                <q-input
                  v-model="store.searchQueryError"
                  dense
                  outlined
                  rounded
                  placeholder="Cari Error / No Reg / Pasien..."
                  style="width: 320px;"
                  @keyup.enter="store.getListError(1)"
                >
                  <template #append>
                    <q-icon name="icon-mat-search" class="cursor-pointer" @click="store.getListError(1)" />
                  </template>
                </q-input>
              </div>

              <!-- Tabel Laporan Error (q-table) -->
              <q-table
                flat
                bordered
                dense
                separator="horizontal"
                :rows="store.errorList"
                :columns="columnsError"
                row-key="id"
                :loading="store.loadingListError"
                :pagination="{ rowsPerPage: store.errorMeta.per_page }"
                hide-pagination
                class="border-radius-15"
              >
                <template #body-cell-nomor="props">
                  <q-td :props="props" class="text-grey-7">
                    {{ (store.errorMeta.current_page - 1) * store.errorMeta.per_page + props.rowIndex + 1 }}
                  </q-td>
                </template>

                <template #body-cell-noreg="props">
                  <q-td :props="props">
                    <div class="text-weight-bold text-primary">{{ props.row.noreg }}</div>
                    <div class="text-caption text-grey-8">{{ props.row.nama_pasien || '-' }} (RM: {{ props.row.norm || '-' }})</div>
                  </q-td>
                </template>

                <template #body-cell-modul="props">
                  <q-td :props="props">
                    <q-badge
                      :color="props.row.jenis === 'rajal' ? 'primary' : props.row.jenis === 'ranap' ? 'teal-9' : 'deep-orange'"
                      :label="(props.row.jenis || '').toUpperCase()"
                    />
                  </q-td>
                </template>

                <template #body-cell-error_summary="props">
                  <q-td :props="props">
                    <div class="text-weight-bold text-negative ellipsis" style="max-width: 320px;">
                      {{ props.row.error_summary || 'Error tidak teridentifikasi' }}
                    </div>
                    <div v-if="props.row.expression" class="text-caption text-grey-7 font-mono ellipsis" style="max-width: 320px;">
                      Lokasi: {{ props.row.expression }}
                    </div>
                  </q-td>
                </template>

                <template #body-cell-status="props">
                  <q-td :props="props" class="text-center">
                    <q-badge v-if="props.row.is_resolved" color="teal-9" icon="icon-mat-check" label="Terselesaikan" />
                    <q-badge v-else color="negative" icon="icon-mat-close" label="Belum Berhasil" />
                  </q-td>
                </template>

                <template #body-cell-aksi="props">
                  <q-td :props="props" class="text-center">
                    <q-btn flat round dense color="primary" icon="icon-mat-visibility" @click="store.getDetailKunjungan(props.row.noreg, props.row.jenis)">
                      <q-tooltip>Lihat Raw Payload & Error</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense color="teal-9" icon="icon-mat-refresh" :loading="store.loadingRetry && store.retryNoreg === props.row.noreg" @click="store.retrySingle(props.row.noreg, props.row.jenis)">
                      <q-tooltip>Kirim Ulang</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>

              <!-- Pagination Error -->
              <div class="row items-center justify-between q-mt-md">
                <div class="text-caption text-grey-7">
                  Menampilkan {{ store.errorList.length }} dari {{ store.errorMeta.total }} error
                </div>
                <q-pagination
                  v-model="store.errorMeta.current_page"
                  :max="store.errorMeta.last_page"
                  :max-pages="6"
                  direction-links
                  boundary-links
                  color="negative"
                  size="sm"
                  @update:model-value="(val) => store.getListError(val)"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>

    </div>

    <!-- Modal Dialog Detail Kunjungan & JSON Payload -->
    <q-dialog v-model="store.modalDetail" full-width>
      <q-card style="max-width: 900px; width: 100%; border-radius: 15px;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-h6">
            <q-icon name="icon-mat-receipt_long" class="q-mr-sm" />
            Detail Payload SatuSehat: {{ store.selectedKunjunganDetail?.noreg }}
          </div>
          <q-btn flat round dense icon="icon-mat-close" v-close-popup />
        </q-card-section>

        <q-card-section class="scroll" style="max-height: 70vh;">
          <div v-if="store.loadingDetail" class="text-center q-pa-xl">
            <q-spinner-dots color="primary" size="40px" />
            <div class="q-mt-sm text-caption">Memuat data payload...</div>
          </div>
          <div v-else-if="store.selectedKunjunganDetail">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7">Pasien:</div>
                <div class="text-subtitle1 text-weight-bold">{{ store.selectedKunjunganDetail.nama_pasien }} ({{ store.selectedKunjunganDetail.norm }})</div>
                <div class="text-caption text-grey-8 font-mono">NIK: {{ store.selectedKunjunganDetail.nik || '-' }}</div>
                <div class="text-caption text-grey-8 font-mono">IHS Number: {{ store.selectedKunjunganDetail.ihs_number || '-' }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7">Layanan:</div>
                <div class="text-weight-bold">{{ store.selectedKunjunganDetail.nama_poli || store.selectedKunjunganDetail.nama_ruangan || '-' }}</div>
                <div class="text-caption text-grey-8">DPJP: {{ store.selectedKunjunganDetail.nama_dokter || '-' }}</div>
                <div class="text-caption text-grey-8">Tgl: {{ store.selectedKunjunganDetail.tgl_kunjungan }}</div>
              </div>
            </div>

            <!-- List Resource Terkirim -->
            <div v-if="store.selectedKunjunganDetail.satset?.list_resource?.length" class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold text-teal-9 q-mb-xs">Resource FHIR Terdaftar di SatuSehat:</div>
              <q-markup-table dense flat bordered separator="horizontal" class="border-radius-15">
                <thead class="bg-grey-2">
                  <tr>
                    <th class="text-left">Resource Type</th>
                    <th class="text-left">Resource ID (Kemkes)</th>
                    <th class="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, iIdx) in store.selectedKunjunganDetail.satset.list_resource" :key="iIdx">
                    <td class="text-left text-weight-bold text-primary">{{ item.resource_type }}</td>
                    <td class="text-left text-caption font-mono">{{ item.resource_id }}</td>
                    <td class="text-center text-caption"><q-badge color="teal-9" :label="item.status" /></td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <!-- Log Error -->
            <div v-if="store.selectedKunjunganDetail.satset_error" class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold text-negative q-mb-xs">Log Respon Error:</div>
              <div class="text-caption text-grey-9 bg-red-1 q-pa-sm rounded-borders q-mb-sm">
                {{ store.selectedKunjunganDetail.satset_error.error_summary }}
              </div>
              <pre class="bg-grey-10 text-white q-pa-sm rounded-borders text-caption font-mono" style="overflow-x: auto;">{{ JSON.stringify(store.selectedKunjunganDetail.satset_error.response_raw, null, 2) }}</pre>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-grey-1">
          <q-btn flat label="Tutup" color="grey-8" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSatsetDashboardStore } from 'src/stores/satset/dashboard'
import { date } from 'quasar'

const store = useSatsetDashboardStore()

const columnsKunjungan = [
  { name: 'nomor', label: 'No', field: 'nomor', align: 'left', style: 'width: 50px;' },
  { name: 'noreg', label: 'No. Registrasi & RM', field: 'noreg', align: 'left' },
  { name: 'pasien', label: 'Nama Pasien & NIK', field: 'nama_pasien', align: 'left' },
  { name: 'modul', label: 'Modul', field: 'modul', align: 'left' },
  { name: 'unit', label: 'Unit Layanan', field: row => row.nama_poli || row.nama_ruangan || '-', align: 'left' },
  { name: 'dokter', label: 'Dokter DPJP', field: 'nama_dokter', align: 'left' },
  { name: 'tgl', label: 'Tgl Kunjungan', field: 'tgl_kunjungan', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'resource', label: 'Detail Resource Terkirim', field: 'resource', align: 'left' },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center', style: 'width: 110px;' }
]

const columnsError = [
  { name: 'nomor', label: 'No', field: 'nomor', align: 'left', style: 'width: 50px;' },
  { name: 'noreg', label: 'No. Reg & Pasien', field: 'noreg', align: 'left' },
  { name: 'modul', label: 'Modul', field: 'jenis', align: 'left' },
  { name: 'error_summary', label: 'Penyebab Error', field: 'error_summary', align: 'left' },
  { name: 'tgl', label: 'Waktu Terjadi', field: 'created_at', align: 'left' },
  { name: 'status', label: 'Status', field: 'is_resolved', align: 'center' },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center', style: 'width: 110px;' }
]

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
})

const currentMonthYear = computed(() => {
  const now = new Date()
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${months[now.getMonth()]} ${now.getFullYear()}`
})

const periodeBtnLabel = computed(() => {
  if (store.tglAwal === store.tglAkhir) {
    return `Periode: ${date.formatDate(store.tglAwal, 'DD MMM YYYY')}`
  }
  return `Periode: ${date.formatDate(store.tglAwal, 'DD/MM')} - ${date.formatDate(store.tglAkhir, 'DD/MM/YYYY')}`
})

const top5Errors = computed(() => {
  return (store.topErrors || []).slice(0, 5)
})

onMounted(() => {
  store.initDashboard()
})

function formatNumber(num) {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

function getRateValue(rateStr) {
  if (!rateStr) return 0
  const num = parseFloat(rateStr.replace('%', ''))
  return isNaN(num) ? 0 : num / 100
}

function setFilterCepat(tipe) {
  const now = Date.now()
  if (tipe === 'hari_ini') {
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(today, today)
  } else if (tipe === '7_hari') {
    const tujuhHariLalu = date.formatDate(date.subtractFromDate(now, { days: 7 }), 'YYYY-MM-DD')
    const today = date.formatDate(now, 'YYYY-MM-DD')
    store.setPeriode(tujuhHariLalu, today)
  } else if (tipe === 'bulan_ini') {
    const awalBulan = date.formatDate(date.startOfDate(now, 'month'), 'YYYY-MM-DD')
    const akhirBulan = date.formatDate(date.endOfDate(now, 'month'), 'YYYY-MM-DD')
    store.setPeriode(awalBulan, akhirBulan)
  }
}

/* =========================================================================
   APEXCHART 1: Rincian Resource FHIR Terkirim (Horizontal Bar)
   ========================================================================= */
const seriesResources = computed(() => [
  {
    name: 'Total Resource',
    data: (store.resourceStats || []).map(r => Number(r.total_terkirim) || 0)
  }
])

const chartOptionsResources = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, Roboto, sans-serif'
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%',
      borderRadius: 4,
      distributed: true
    }
  },
  colors: ['#027BE3', '#1565C0', '#1976D2', '#0288D1', '#0097A7', '#00897B', '#2E7D32', '#558B2F', '#F9A825', '#EF6C00'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '11px', fontWeight: 'bold' }
  },
  xaxis: {
    categories: (store.resourceStats || []).map(r => r.resource_type)
  },
  legend: { show: false }
}))

/* =========================================================================
   APEXCHART 2: Komposisi Pengiriman Modul (Donut Top 6)
   ========================================================================= */
const seriesDonutModul = computed(() => {
  const rajal = Number(store.detailModul?.rajal?.terkirim) || 0
  const ranap = Number(store.detailModul?.ranap?.terkirim) || 0
  const igd = Number(store.detailModul?.igd?.terkirim) || 0
  if (rajal === 0 && ranap === 0 && igd === 0) return [1]
  return [rajal, ranap, igd]
})

const chartOptionsDonutModul = computed(() => {
  const rajal = Number(store.detailModul?.rajal?.terkirim) || 0
  const ranap = Number(store.detailModul?.ranap?.terkirim) || 0
  const igd = Number(store.detailModul?.igd?.terkirim) || 0
  const isEmpty = rajal === 0 && ranap === 0 && igd === 0

  return {
    labels: isEmpty ? ['Belum Ada Data'] : ['Rawat Jalan', 'Rawat Inap', 'IGD'],
    colors: ['#027BE3', '#21BA45', '#EF6C00'],
    stroke: { width: 0 },
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Sukses',
              formatter: () => formatNumber(store.summary?.total_terkirim || 0)
            }
          }
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.welcome-card {
  background: linear-gradient(135deg, var(--q-primary) 0%, #0d47a1 100%);
  border-radius: 20px;
  position: relative;
}

.header-stat-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
}

.header-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.shape-1 {
  width: 300px;
  height: 300px;
  right: -50px;
  top: -100px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  right: 150px;
  bottom: -50px;
}

.border-radius-15 {
  border-radius: 15px;
}

.transition-hover {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
  }
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.opacity-80 {
  opacity: 0.8;
}
</style>
