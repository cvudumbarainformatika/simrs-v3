<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Header Page & Filter Periode -->
    <div class="row items-center justify-between q-mb-md bg-white q-pa-md rounded-borders shadow-1">
      <div class="row items-center">
        <q-avatar color="primary" text-color="white" icon="icon-mat-dashboard" size="42px" class="q-mr-md shadow-2" />
        <div>
          <div class="text-h6 text-weight-bold text-primary">Dashboard SatuSehat Kemkes</div>
          <div class="text-caption text-grey-7">Monitoring Kepatuhan & Integrasi Modul Rawat Jalan, Rawat Inap, dan IGD</div>
        </div>
      </div>

      <!-- Filter Rentang Tanggal -->
      <div class="row items-center q-gutter-sm">
        <q-input
          v-model="store.tglAwal"
          type="date"
          dense
          outlined
          label="Tgl Awal"
          class="bg-white"
          style="width: 150px;"
        />
        <q-input
          v-model="store.tglAkhir"
          type="date"
          dense
          outlined
          label="Tgl Akhir"
          class="bg-white"
          style="width: 150px;"
        />

        <q-btn-group outline>
          <q-btn size="sm" outline color="primary" label="Hari Ini" @click="setFilterCepat('hari_ini')" />
          <q-btn size="sm" outline color="primary" label="7 Hari" @click="setFilterCepat('7_hari')" />
          <q-btn size="sm" outline color="primary" label="Bulan Ini" @click="setFilterCepat('bulan_ini')" />
        </q-btn-group>

        <q-btn
          color="primary"
          icon="icon-mat-refresh"
          label="Terapkan"
          dense
          class="q-px-md"
          :loading="store.loadingSummary"
          @click="store.initDashboard()"
        />
      </div>
    </div>

    <!-- KPI Summary Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Total Kunjungan -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-primary text-white shadow-2 full-height">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-uppercase text-weight-medium">Total Kunjungan SIMRS</div>
                <div class="text-h4 text-weight-bolder q-mt-xs">{{ formatNumber(store.summary.total_kunjungan) }}</div>
                <div class="text-caption text-grey-3 q-mt-xs">Periode terpilih</div>
              </div>
              <q-icon name="icon-mat-people" size="48px" style="opacity: 0.3;" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Terkirim Sukses & Compliance Rate -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-positive text-white shadow-2 full-height">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-uppercase text-weight-medium">Terkirim SatuSehat</div>
                <div class="text-h4 text-weight-bolder q-mt-xs">{{ formatNumber(store.summary.total_terkirim) }}</div>
                <div class="text-caption text-weight-bold q-mt-xs">
                  Kepatuhan: {{ store.summary.compliance_rate }}
                </div>
              </div>
              <q-icon name="icon-mat-cloud_done" size="48px" style="opacity: 0.3;" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gagal / Error Respon -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-negative text-white shadow-2 full-height">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-uppercase text-weight-medium">Gagal / Error Respon</div>
                <div class="text-h4 text-weight-bolder q-mt-xs">{{ formatNumber(store.summary.total_error) }}</div>
                <div class="text-caption text-grey-3 q-mt-xs">Perlu penanganan/retry</div>
              </div>
              <q-icon name="icon-mat-warning" size="48px" style="opacity: 0.3;" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Total Resource Terkirim -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-indigo-9 text-white shadow-2 full-height">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-uppercase text-weight-medium">Total Resource FHIR</div>
                <div class="text-h4 text-weight-bolder q-mt-xs">{{ formatNumber(store.totalResourceTerkirim) }}</div>
                <div class="text-caption text-grey-3 q-mt-xs">Dari {{ store.totalTransaksiBundle }} transaksi bundle</div>
              </div>
              <q-icon name="icon-mat-hub" size="48px" style="opacity: 0.3;" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modul Breakdown Cards (Rajal, Ranap, IGD) -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Rawat Jalan -->
      <div class="col-12 col-md-4">
        <q-card class="bg-white shadow-1">
          <q-card-section class="q-pb-sm">
            <div class="row items-center justify-between">
              <div class="row items-center">
                <q-avatar color="blue-1" text-color="primary" icon="icon-mat-local_hospital" size="32px" class="q-mr-sm" />
                <div class="text-subtitle1 text-weight-bold">Rawat Jalan (Rajal)</div>
              </div>
              <q-badge color="primary" :label="store.detailModul?.rajal?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.rajal?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-positive">{{ formatNumber(store.detailModul?.rajal?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.rajal?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.rajal?.rate)"
              color="primary"
              track-color="blue-1"
              class="q-mt-sm rounded-borders"
              size="8px"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Rawat Inap -->
      <div class="col-12 col-md-4">
        <q-card class="bg-white shadow-1">
          <q-card-section class="q-pb-sm">
            <div class="row items-center justify-between">
              <div class="row items-center">
                <q-avatar color="green-1" text-color="positive" icon="icon-mat-hotel" size="32px" class="q-mr-sm" />
                <div class="text-subtitle1 text-weight-bold">Rawat Inap (Ranap)</div>
              </div>
              <q-badge color="positive" :label="store.detailModul?.ranap?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.ranap?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-positive">{{ formatNumber(store.detailModul?.ranap?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.ranap?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.ranap?.rate)"
              color="positive"
              track-color="green-1"
              class="q-mt-sm rounded-borders"
              size="8px"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- IGD -->
      <div class="col-12 col-md-4">
        <q-card class="bg-white shadow-1">
          <q-card-section class="q-pb-sm">
            <div class="row items-center justify-between">
              <div class="row items-center">
                <q-avatar color="red-1" text-color="negative" icon="icon-mat-emergency" size="32px" class="q-mr-sm" />
                <div class="text-subtitle1 text-weight-bold">Gawat Darurat (IGD)</div>
              </div>
              <q-badge color="deep-orange" :label="store.detailModul?.igd?.rate || '0%'" />
            </div>
            <div class="row justify-between q-mt-md text-caption text-grey-8">
              <div>Total: <b>{{ formatNumber(store.detailModul?.igd?.total_kunjungan) }}</b></div>
              <div>Sukses: <b class="text-positive">{{ formatNumber(store.detailModul?.igd?.terkirim) }}</b></div>
              <div>Error: <b class="text-negative">{{ formatNumber(store.detailModul?.igd?.error) }}</b></div>
            </div>
            <q-linear-progress
              :value="getRateValue(store.detailModul?.igd?.rate)"
              color="deep-orange"
              track-color="red-1"
              class="q-mt-sm rounded-borders"
              size="8px"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tabs Container -->
    <q-card class="bg-white shadow-1">
      <q-tabs
        v-model="store.activeTab"
        dense
        class="text-grey-7 bg-grey-1"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="kunjungan" icon="icon-mat-view_list" label="Monitoring Kunjungan Pasien" />
        <q-tab name="error" icon="icon-mat-error_outline" label="Laporan Pengiriman Error">
          <q-badge v-if="store.summary.total_error > 0" color="negative" floating>{{ store.summary.total_error }}</q-badge>
        </q-tab>
        <q-tab name="resources" icon="icon-mat-bar_chart" label="Statistik Resource FHIR & Top Error" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="store.activeTab" animated>
        <!-- TAB 1: MONITORING KUNJUNGAN -->
        <q-tab-panel name="kunjungan" class="q-pa-md">
          <!-- Filter Modul & Search Bar -->
          <div class="row items-center justify-between q-mb-md">
            <div class="row items-center q-gutter-xs">
              <q-btn
                dense
                unelevated
                :color="store.filterJenis === 'all' ? 'primary' : 'grey-3'"
                :text-color="store.filterJenis === 'all' ? 'white' : 'dark'"
                label="Semua Modul"
                class="q-px-sm"
                @click="store.setFilterJenis('all')"
              />
              <q-btn
                dense
                unelevated
                :color="store.filterJenis === 'rajal' ? 'primary' : 'grey-3'"
                :text-color="store.filterJenis === 'rajal' ? 'white' : 'dark'"
                label="Rawat Jalan"
                class="q-px-sm"
                @click="store.setFilterJenis('rajal')"
              />
              <q-btn
                dense
                unelevated
                :color="store.filterJenis === 'ranap' ? 'positive' : 'grey-3'"
                :text-color="store.filterJenis === 'ranap' ? 'white' : 'dark'"
                label="Rawat Inap"
                class="q-px-sm"
                @click="store.setFilterJenis('ranap')"
              />
              <q-btn
                dense
                unelevated
                :color="store.filterJenis === 'igd' ? 'deep-orange' : 'grey-3'"
                :text-color="store.filterJenis === 'igd' ? 'white' : 'dark'"
                label="IGD"
                class="q-px-sm"
                @click="store.setFilterJenis('igd')"
              />
            </div>

            <div class="row items-center q-gutter-sm">
              <q-input
                v-model="store.searchQuery"
                dense
                outlined
                placeholder="Cari No Reg / RM / Pasien / NIK..."
                style="width: 300px;"
                @keyup.enter="store.getListKunjungan(1)"
              >
                <template #append>
                  <q-icon name="icon-mat-search" class="cursor-pointer" @click="store.getListKunjungan(1)" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Table Monitoring Kunjungan -->
          <q-markup-table flat bordered dense separator="horizontal" class="shadow-0">
            <thead class="bg-grey-2 text-weight-bold">
              <tr>
                <th class="text-left" style="width: 50px;">No</th>
                <th class="text-left">No. Registrasi</th>
                <th class="text-left">Pasien & NIK</th>
                <th class="text-left">Modul</th>
                <th class="text-left">Unit Layanan</th>
                <th class="text-left">Dokter DPJP</th>
                <th class="text-left">Tgl Kunjungan</th>
                <th class="text-center">Status SatuSehat</th>
                <th class="text-left">Resource Terkirim</th>
                <th class="text-center" style="width: 130px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="store.loadingListKunjungan">
                <td colspan="10" class="text-center q-pa-lg">
                  <q-spinner color="primary" size="30px" />
                  <div class="text-caption text-grey-7 q-mt-xs">Memuat data kunjungan...</div>
                </td>
              </tr>
              <tr v-else-if="!store.kunjunganList?.length">
                <td colspan="10" class="text-center q-pa-lg text-grey-6">
                  Tidak ada data kunjungan pada periode dan filter ini.
                </td>
              </tr>
              <tr v-for="(item, idx) in store.kunjunganList" :key="item.noreg">
                <td class="text-left text-caption text-grey-7">
                  {{ (store.kunjunganMeta.current_page - 1) * store.kunjunganMeta.per_page + (idx + 1) }}
                </td>
                <td class="text-left">
                  <div class="text-weight-bold text-primary">{{ item.noreg }}</div>
                  <div class="text-caption text-grey-7">RM: {{ item.norm }}</div>
                </td>
                <td class="text-left">
                  <div class="text-weight-bold">{{ item.nama_pasien || '-' }}</div>
                  <div class="text-caption text-grey-7">NIK: {{ item.nik || '-' }}</div>
                </td>
                <td class="text-left">
                  <q-badge
                    :color="item.jenis === 'ranap' ? 'positive' : (item.jenis === 'igd' ? 'deep-orange' : 'primary')"
                    :label="item.jenis?.toUpperCase()"
                  />
                </td>
                <td class="text-left text-caption">{{ item.unit_layanan || '-' }}</td>
                <td class="text-left text-caption">{{ item.dokter_dpjp || '-' }}</td>
                <td class="text-left text-caption">{{ item.tgl_kunjungan }}</td>
                <td class="text-center">
                  <q-badge
                    v-if="item.satset_terkirim"
                    color="positive"
                    icon="icon-mat-check_circle"
                    label="Terkirim"
                  />
                  <q-badge
                    v-else-if="item.satset_error"
                    color="negative"
                    icon="icon-mat-cancel"
                    label="Gagal / Error"
                  />
                  <q-badge
                    v-else
                    color="grey-6"
                    icon="icon-mat-schedule"
                    label="Belum Kirim"
                  />
                </td>
                <td class="text-left">
                  <div v-if="item.satset_terkirim" class="row q-gutter-xs">
                    <q-badge
                      v-for="(res, rIdx) in item.satset_terkirim.resources_summary"
                      :key="rIdx"
                      color="blue-1"
                      text-color="primary"
                      :label="res"
                      class="text-weight-bold"
                    />
                  </div>
                  <div v-else-if="item.satset_error" class="text-caption text-negative ellipsis" style="max-width: 200px;">
                    {{ item.satset_error.error_summary }}
                  </div>
                  <div v-else class="text-caption text-grey-5">-</div>
                </td>
                <td class="text-center">
                  <q-btn-group flat dense>
                    <q-btn
                      flat
                      round
                      dense
                      color="primary"
                      icon="icon-mat-visibility"
                      @click="store.getDetailKunjungan(item.noreg)"
                    >
                      <q-tooltip>Detail Log SatuSehat</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      color="deep-orange"
                      icon="icon-mat-send"
                      :loading="store.loadingRetry"
                      @click="store.retryKirim(item.noreg, item.jenis)"
                    >
                      <q-tooltip>Kirim Ulang (Retry)</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <!-- Pagination -->
          <div class="row items-center justify-between q-mt-md">
            <div class="text-caption text-grey-7">
              Menampilkan total <b>{{ formatNumber(store.kunjunganMeta.total) }}</b> data kunjungan
            </div>
            <q-pagination
              v-model="store.kunjunganMeta.current_page"
              :max="store.kunjunganMeta.last_page"
              :max-pages="7"
              direction-links
              boundary-links
              color="primary"
              dense
              @update:model-value="(val) => store.getListKunjungan(val)"
            />
          </div>
        </q-tab-panel>

        <!-- TAB 2: LAPORAN ERROR -->
        <q-tab-panel name="error" class="q-pa-md">
          <!-- Search Bar Error -->
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-negative row items-center">
              <q-icon name="icon-mat-error" size="24px" class="q-mr-xs" />
              Laporan Pengiriman Gagal & Tindak Lanjut
            </div>

            <q-input
              v-model="store.searchQueryError"
              dense
              outlined
              placeholder="Cari No Reg / Pesan Error..."
              style="width: 300px;"
              @keyup.enter="store.getListError(1)"
            >
              <template #append>
                <q-icon name="icon-mat-search" class="cursor-pointer" @click="store.getListError(1)" />
              </template>
            </q-input>
          </div>

          <!-- Table Laporan Error -->
          <q-markup-table flat bordered dense separator="horizontal">
            <thead class="bg-red-1 text-weight-bold">
              <tr>
                <th class="text-left" style="width: 50px;">No</th>
                <th class="text-left">No. Reg & Pasien</th>
                <th class="text-left">Modul</th>
                <th class="text-left">Waktu Error</th>
                <th class="text-left">Status Terkini</th>
                <th class="text-left">Penyebab Kesalahan (SatuSehat)</th>
                <th class="text-center" style="width: 120px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="store.loadingListError">
                <td colspan="7" class="text-center q-pa-lg">
                  <q-spinner color="negative" size="30px" />
                  <div class="text-caption text-grey-7 q-mt-xs">Memuat laporan error...</div>
                </td>
              </tr>
              <tr v-else-if="!store.errorList?.length">
                <td colspan="7" class="text-center q-pa-lg text-grey-6">
                  Tidak ada catatan error pada periode ini.
                </td>
              </tr>
              <tr v-for="(err, idx) in store.errorList" :key="err.id">
                <td class="text-left text-caption text-grey-7">
                  {{ (store.errorMeta.current_page - 1) * store.errorMeta.per_page + (idx + 1) }}
                </td>
                <td class="text-left">
                  <div class="text-weight-bold text-primary">{{ err.noreg }}</div>
                  <div v-if="err.pasien" class="text-caption text-grey-8">
                    {{ err.pasien.nama_pasien }} (RM: {{ err.pasien.norm }})
                  </div>
                  <div v-if="err.pasien?.nik" class="text-caption text-grey-7">NIK: {{ err.pasien.nik }}</div>
                </td>
                <td class="text-left">
                  <q-badge
                    :color="err.jenis === 'ranap' ? 'positive' : (err.jenis === 'igd' ? 'deep-orange' : 'primary')"
                    :label="err.jenis?.toUpperCase()"
                  />
                </td>
                <td class="text-left text-caption">{{ err.waktu_error }}</td>
                <td class="text-left">
                  <q-badge
                    :color="err.is_resolved ? 'positive' : 'negative'"
                    :label="err.status_terkini"
                  />
                </td>
                <td class="text-left">
                  <div class="text-caption text-weight-bold text-negative">{{ err.error_summary }}</div>
                  <div v-if="err.issues?.length" class="q-mt-xs">
                    <div
                      v-for="(iss, iIdx) in err.issues"
                      :key="iIdx"
                      class="text-caption text-grey-8 bg-grey-2 q-pa-xs rounded-borders q-mb-xs"
                    >
                      <q-icon name="icon-mat-arrow_right" color="negative" />
                      {{ iss.message }}
                      <span v-if="iss.expression?.length" class="text-primary">[{{ iss.expression.join(', ') }}]</span>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <q-btn-group flat dense>
                    <q-btn
                      flat
                      round
                      dense
                      color="primary"
                      icon="icon-mat-visibility"
                      @click="store.getDetailKunjungan(err.noreg)"
                    >
                      <q-tooltip>Detail Log</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      dense
                      color="deep-orange"
                      icon="icon-mat-send"
                      :loading="store.loadingRetry"
                      @click="store.retryKirim(err.noreg, err.jenis)"
                    >
                      <q-tooltip>Kirim Ulang</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <!-- Pagination Error -->
          <div class="row items-center justify-between q-mt-md">
            <div class="text-caption text-grey-7">
              Total <b>{{ formatNumber(store.errorMeta.total) }}</b> catatan pengiriman gagal
            </div>
            <q-pagination
              v-model="store.errorMeta.current_page"
              :max="store.errorMeta.last_page"
              :max-pages="7"
              direction-links
              boundary-links
              color="negative"
              dense
              @update:model-value="(val) => store.getListError(val)"
            />
          </div>
        </q-tab-panel>

        <!-- TAB 3: STATISTIK RESOURCE & TOP ERRORS -->
        <q-tab-panel name="resources" class="q-pa-md">
          <div class="row q-col-gutter-lg">
            <!-- Breakdown Resource FHIR -->
            <div class="col-12 col-md-6">
              <q-card flat bordered class="q-pa-md">
                <div class="text-subtitle1 text-weight-bold text-primary q-mb-md row items-center">
                  <q-icon name="icon-mat-pie_chart" size="24px" class="q-mr-xs" />
                  Rincian Resource FHIR Terkirim
                </div>

                <div v-if="store.loadingResource" class="text-center q-pa-lg">
                  <q-spinner color="primary" size="30px" />
                </div>
                <div v-else-if="!store.resourceStats?.length" class="text-center q-pa-lg text-grey-6">
                  Belum ada resource terkirim pada periode ini.
                </div>
                <div v-else>
                  <div
                    v-for="res in store.resourceStats"
                    :key="res.resource_type"
                    class="q-mb-md"
                  >
                    <div class="row items-center justify-between text-caption text-weight-bold q-mb-xs">
                      <div class="row items-center">
                        <q-badge color="indigo-8" :label="res.resource_type" class="q-mr-xs" />
                      </div>
                      <div>
                        {{ formatNumber(res.total_terkirim) }} resource
                        <span class="text-grey-6">({{ res.persentase }})</span>
                      </div>
                    </div>
                    <q-linear-progress
                      :value="getRateValue(res.persentase)"
                      color="indigo-8"
                      track-color="indigo-1"
                      size="8px"
                      class="rounded-borders"
                    />
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Top 10 Errors -->
            <div class="col-12 col-md-6">
              <q-card flat bordered class="q-pa-md">
                <div class="text-subtitle1 text-weight-bold text-negative q-mb-md row items-center">
                  <q-icon name="icon-mat-analytics" size="24px" class="q-mr-xs" />
                  Top 10 Penyebab Kegagalan Pengiriman
                </div>

                <div v-if="store.loadingErrorStats" class="text-center q-pa-lg">
                  <q-spinner color="negative" size="30px" />
                </div>
                <div v-else-if="!store.topErrors?.length" class="text-center q-pa-lg text-grey-6">
                  Tidak ada catatan kegagalan pada periode ini.
                </div>
                <div v-else>
                  <q-list separator dense>
                    <q-item v-for="(top, tIdx) in store.topErrors" :key="tIdx" class="q-py-sm">
                      <q-item-section avatar>
                        <q-avatar color="red-1" text-color="negative" size="28px" class="text-weight-bold text-caption">
                          {{ tIdx + 1 }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-caption text-weight-bold text-dark">
                          {{ top.pesan_error }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge color="negative" :label="`${top.total} Kasus`" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Dialog Detail Kunjungan Modal -->
    <q-dialog v-model="store.dialogDetail" persistent>
      <q-card style="width: 800px; max-width: 95vw;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="icon-mat-info" size="24px" class="q-mr-xs" />
            Detail Pengiriman SatuSehat: {{ store.selectedKunjunganDetail?.noreg }}
          </div>
          <q-btn flat round dense icon="icon-mat-close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md scroll" style="max-height: 70vh;">
          <div v-if="store.loadingDetail" class="text-center q-pa-xl">
            <q-spinner color="primary" size="40px" />
            <div class="text-caption text-grey-7 q-mt-md">Memuat detail log...</div>
          </div>
          <div v-else-if="store.selectedKunjunganDetail">
            <!-- Status Badges -->
            <div class="row q-gutter-sm items-center q-mb-md">
              <q-badge
                v-if="store.selectedKunjunganDetail.is_terkirim"
                color="positive"
                label="SUKSES TERKIRIM"
                class="q-pa-xs text-weight-bold"
              />
              <q-badge
                v-if="store.selectedKunjunganDetail.is_error"
                color="negative"
                label="ADA CATATAN ERROR"
                class="q-pa-xs text-weight-bold"
              />
            </div>

            <!-- List Resource Sukses -->
            <div v-if="store.selectedKunjunganDetail.satset" class="q-mb-md">
              <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">
                Resource Terkirim (Total: {{ store.selectedKunjunganDetail.satset.total_resource }})
              </div>
              <div class="row q-gutter-xs q-mb-sm">
                <q-badge
                  v-for="(sum, sIdx) in store.selectedKunjunganDetail.satset.summary_resource"
                  :key="sIdx"
                  color="blue-1"
                  text-color="primary"
                  :label="sum"
                  class="text-weight-bold"
                />
              </div>

              <q-markup-table dense flat bordered separator="cell">
                <thead class="bg-grey-2">
                  <tr>
                    <th class="text-left">Resource Type</th>
                    <th class="text-left">Resource ID (SatuSehat)</th>
                    <th class="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, iIdx) in store.selectedKunjunganDetail.satset.list_resource" :key="iIdx">
                    <td class="text-left text-weight-bold text-primary">{{ item.resource_type }}</td>
                    <td class="text-left text-caption font-mono">{{ item.resource_id }}</td>
                    <td class="text-center text-caption"><q-badge color="positive" :label="item.status" /></td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>

            <!-- Raw Response Error jika ada -->
            <div v-if="store.selectedKunjunganDetail.satset_error">
              <div class="text-subtitle2 text-weight-bold text-negative q-mb-xs">Log Respon Error Terakhir:</div>
              <div class="text-caption text-grey-8 bg-red-1 q-pa-sm rounded-borders q-mb-sm">
                {{ store.selectedKunjunganDetail.satset_error.error_summary }}
              </div>
              <pre class="bg-grey-10 text-white q-pa-sm rounded-borders text-caption" style="overflow-x: auto;">{{ JSON.stringify(store.selectedKunjunganDetail.satset_error.response_raw, null, 2) }}</pre>
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
import { useSatsetDashboardStore } from 'src/stores/satset/dashboard'
import { date } from 'quasar'
import { onMounted } from 'vue'

const store = useSatsetDashboardStore()

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
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style>
