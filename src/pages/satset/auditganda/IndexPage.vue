<template>
  <q-page class="q-pa-md bg-grey-1 satset-audit-ganda-page">
    <div class="row q-col-gutter-md">

      <!-- Header Card (Konsisten dg Menu Audit) -->
      <div class="col-12">
        <q-card flat class="audit-header-card text-white overflow-hidden shadow-10">
          <q-card-section class="q-pa-lg relative-position">
            <div class="z-index-1 row items-center justify-between q-col-gutter-md">
              <div class="col-12 col-md-7">
                <div class="row items-center q-gutter-sm q-mb-xs">
                  <q-avatar size="38px" color="white" text-color="indigo-9" icon="icon-mat-people_alt" />
                  <div class="text-h5 text-weight-bold">Audit Data Pasien Terindikasi Ganda 🇮🇩</div>
                </div>
                <div class="text-subtitle2 opacity-85">
                  Deteksi, komparasi, dan verifikasi duplikasi data Master Rekam Medis (SIMRS & SatuSehat).
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
                  <!-- Button Audit Mismatch -->
                  <q-btn
                    unelevated
                    rounded
                    color="teal-8"
                    text-color="white"
                    label="Audit Mismatch Pasien"
                    icon="icon-mat-fact_check"
                    no-caps
                    to="/satset/audit"
                  />
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
                  <div class="text-caption text-uppercase opacity-80 letter-spacing-1">Ringkasan Duplikasi</div>
                  <div class="row items-center q-gutter-md q-mt-xs">
                    <div>
                      <div class="text-h4 text-weight-bolder text-amber-3">{{ formatNumber(store.stats.nik_ganda) }}</div>
                      <div class="text-caption opacity-80">NIK Ganda</div>
                    </div>
                    <q-separator vertical dark class="opacity-30" style="height: 38px;" />
                    <div>
                      <div class="text-h4 text-weight-bolder text-green-3">{{ formatNumber(store.stats.nama_rm_lama) }}</div>
                      <div class="text-caption opacity-80">Catatan RM Nama</div>
                    </div>
                    <q-separator vertical dark class="opacity-30" style="height: 38px;" />
                    <div>
                      <div class="text-h4 text-weight-bolder">{{ formatNumber(store.stats.total_grup_terdeteksi) }}</div>
                      <div class="text-caption opacity-80">Total Grup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Background Shapes -->
            <div class="header-shape shape-1" />
            <div class="header-shape shape-2" />
          </q-card-section>
        </q-card>
      </div>

      <!-- KPI Summary Cards Grid (5 Kategori) -->
      <div class="col-12 col-sm-6 col-md">
        <q-card
          flat
          class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer full-height"
          :class="{ 'border-active': store.kategori === 'nik_ganda' }"
          @click="store.setKategori('nik_ganda')"
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">NIK Ganda</div>
                <div class="text-h6 text-weight-bold text-primary q-mt-xs">{{ formatNumber(store.stats.nik_ganda) }}</div>
                <div class="text-caption text-grey-6">NIK sama di &ge;2 RM</div>
              </div>
              <q-avatar size="36px" color="blue-1" text-color="primary" icon="icon-mat-badge" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md">
        <q-card
          flat
          class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer full-height"
          :class="{ 'border-active': store.kategori === 'nama_rm_lama' }"
          @click="store.setKategori('nama_rm_lama')"
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">Pola RM di Nama</div>
                <div class="text-h6 text-weight-bold text-amber-9 q-mt-xs">{{ formatNumber(store.stats.nama_rm_lama) }}</div>
                <div class="text-caption text-grey-6">'UNTUNG 123456'</div>
              </div>
              <q-avatar size="36px" color="amber-1" text-color="amber-9" icon="icon-mat-history_edu" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md">
        <q-card
          flat
          class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer full-height"
          :class="{ 'border-active': store.kategori === 'bpjs_ganda' }"
          @click="store.setKategori('bpjs_ganda')"
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">BPJS Ganda</div>
                <div class="text-h6 text-weight-bold text-teal-8 q-mt-xs">{{ formatNumber(store.stats.bpjs_ganda) }}</div>
                <div class="text-caption text-grey-6">No. Kartu sama</div>
              </div>
              <q-avatar size="36px" color="teal-1" text-color="teal-8" icon="icon-mat-credit_card" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md">
        <q-card
          flat
          class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer full-height"
          :class="{ 'border-active': store.kategori === 'nama_tgllahir_ganda' }"
          @click="store.setKategori('nama_tgllahir_ganda')"
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">Nama + Tgl Lahir</div>
                <div class="text-h6 text-weight-bold text-purple-8 q-mt-xs">{{ formatNumber(store.stats.nama_tgllahir_ganda) }}</div>
                <div class="text-caption text-grey-6">Identitas sama</div>
              </div>
              <q-avatar size="36px" color="purple-1" text-color="purple-8" icon="icon-mat-cake" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md">
        <q-card
          flat
          class="stat-card border-radius-12 shadow-1 bg-white cursor-pointer full-height"
          :class="{ 'border-active': store.kategori === 'nama_tgllahir_ibu_ganda' }"
          @click="store.setKategori('nama_tgllahir_ibu_ganda')"
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-caption text-grey-7 text-weight-medium">Nama + Ibu</div>
                <div class="text-h6 text-weight-bold text-indigo-8 q-mt-xs">{{ formatNumber(store.stats.nama_tgllahir_ibu_ganda) }}</div>
                <div class="text-caption text-grey-6">Ibu kandung sama</div>
              </div>
              <q-avatar size="36px" color="indigo-1" text-color="indigo-8" icon="icon-mat-escalator_warning" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Filter Tabs & Search Bar Card -->
      <div class="col-12">
        <q-card flat class="border-radius-12 shadow-1 bg-white">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-col-gutter-md">
              <div class="col-12 col-md-8">
                <q-tabs
                  v-model="store.kategori"
                  dense
                  no-caps
                  active-color="primary"
                  indicator-color="primary"
                  class="text-grey-7 text-weight-bold"
                  @update:model-value="store.setKategori"
                >
                  <q-tab name="nik_ganda" icon="icon-mat-badge" label="NIK Ganda" />
                  <q-tab name="nama_rm_lama" icon="icon-mat-history_edu" label="Pola RM di Nama" />
                  <q-tab name="bpjs_ganda" icon="icon-mat-credit_card" label="BPJS Ganda" />
                  <q-tab name="nama_tgllahir_ganda" icon="icon-mat-cake" label="Nama & Tgl Lahir" />
                  <q-tab name="nama_tgllahir_ibu_ganda" icon="icon-mat-escalator_warning" label="Nama & Ibu Kandung" />
                </q-tabs>
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="store.searchQuery"
                  dense
                  outlined
                  rounded
                  bg-color="grey-1"
                  placeholder="Cari No. RM / Nama / NIK..."
                  clearable
                  @keyup.enter="store.getList(1)"
                  @clear="store.getList(1)"
                >
                  <template #append>
                    <q-btn flat round dense icon="icon-mat-search" color="primary" @click="store.getList(1)" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Content Area -->
      <div class="col-12">
        <div v-if="store.loadingList" class="q-pa-xl text-center bg-white border-radius-12 shadow-1">
          <q-spinner-dots color="primary" size="48px" />
          <div class="text-caption text-grey-7 q-mt-sm">Memuat daftar grup pasien terindikasi ganda...</div>
        </div>

        <div v-else-if="!store.groups || store.groups.length === 0" class="q-pa-xl text-center bg-white border-radius-12 shadow-1">
          <q-icon name="icon-mat-check_circle" size="64px" color="positive" class="q-mb-sm" />
          <div class="text-h6 text-weight-bold text-grey-8">Tidak Ada Temuan Pasien Ganda</div>
          <div class="text-caption text-grey-6">Semua data pada kategori ini dalam kondisi valid atau tidak ada data yang sesuai filter pencarian.</div>
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-for="(grp, idx) in store.groups" :key="grp.group_id || idx">
            <q-card flat class="border-radius-12 shadow-1 bg-white overflow-hidden group-card">
              <!-- Header Grup -->
              <div class="bg-grey-2 q-px-md q-py-sm row items-center justify-between border-bottom-grey">
                <div class="row items-center q-gutter-sm">
                  <q-badge color="primary" class="q-px-sm q-py-xs text-caption text-weight-bolder">
                    Grup #{{ (store.meta.current_page - 1) * store.meta.per_page + (idx + 1) }}
                  </q-badge>
                  <div class="text-subtitle2 text-weight-bolder text-grey-9">
                    <span v-if="store.kategori === 'nik_ganda'">NIK: <span class="text-primary">{{ grp.key_identifier }}</span></span>
                    <span v-else-if="store.kategori === 'bpjs_ganda'">No. BPJS: <span class="text-teal-8">{{ grp.key_identifier }}</span></span>
                    <span v-else-if="store.kategori === 'nama_rm_lama'">Catatan RM: <span class="text-amber-9">{{ grp.members[0]?.nama }}</span></span>
                    <span v-else>Identitas: <span class="text-purple-8">{{ grp.key_identifier }}</span></span>
                  </div>
                  <q-badge outline color="dark" class="q-ml-xs">
                    {{ grp.total_members }} No. RM Terkait
                  </q-badge>
                </div>
                <div class="row items-center q-gutter-sm">
                  <q-btn flat dense no-caps color="primary" icon="icon-mat-visibility" label="Bandingkan Detail" @click="store.openDetail(grp)" />
                </div>
              </div>

              <!-- Tabel Ringkas Anggota No. RM dalam Grup (Fixed Layout, Kompak, Tanpa Melebar) -->
              <q-card-section class="q-pa-none">
                <table class="member-compact-table">
                  <thead>
                    <tr>
                      <th style="width: 140px;">No. Rekam Medis</th>
                      <th style="width: 250px;">Nama & Identitas Pasien</th>
                      <th style="width: 170px;">Demografi & Ibu Kandung</th>
                      <th style="width: 200px;">Alamat Domisili</th>
                      <th style="width: 120px;" class="text-center">Keaktifan Berobat</th>
                      <th style="width: 90px;" class="text-center">Peran</th>
                      <th style="width: 90px;" class="text-center">Aksi Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="m in grp.members" :key="m.norm" :class="{ 'row-master-active': m.norm === grp.suggested_master_norm }">
                      <!-- No RM & SatuSehat -->
                      <td>
                        <div class="text-weight-bolder text-primary text-subtitle2">{{ m.norm }}</div>
                        <div class="q-mt-xs">
                          <q-badge v-if="m.has_satset" color="teal" size="xs" class="q-px-xs">
                            <q-icon name="icon-mat-check" size="10px" class="q-mr-xs" /> IHS Sinkron
                          </q-badge>
                          <q-badge v-else color="grey-3" text-color="grey-7" size="xs" class="q-px-xs">
                            Belum IHS
                          </q-badge>
                        </div>
                      </td>

                      <!-- Nama & Identitas (NIK / BPJS) -->
                      <td>
                        <div class="text-weight-bold text-grey-9 text-body2">{{ m.sapaan }} {{ m.nama }}</div>
                        <div class="row items-center q-gutter-xs q-mt-2xs">
                          <span class="text-caption text-grey-7 font-mono">NIK: <b :class="m.nik ? 'text-blue-9' : 'text-grey-5'">{{ m.nik || '-' }}</b></span>
                        </div>
                        <div v-if="m.noka_bpjs" class="text-caption text-grey-7 font-mono">
                          BPJS: <span class="text-teal-9">{{ m.noka_bpjs }}</span>
                        </div>
                      </td>

                      <!-- Demografi & Ibu -->
                      <td>
                        <div class="text-caption text-grey-9">
                          <b>{{ m.tgl_lahir || '-' }}</b>
                          <span class="text-grey-6 q-ml-xs">({{ m.kelamin || '-' }})</span>
                        </div>
                        <div class="text-caption text-grey-7 ellipsis q-mt-2xs" style="max-width: 160px;">
                          Ibu: <span class="text-weight-medium">{{ m.namaibu || '-' }}</span>
                          <q-tooltip v-if="m.namaibu">{{ m.namaibu }}</q-tooltip>
                        </div>
                      </td>

                      <!-- Alamat (Diberikan ellipsis terkontrol) -->
                      <td>
                        <div class="text-caption text-grey-8 ellipsis-2-lines" style="max-width: 190px;">
                          {{ m.alamat || '-' }}
                        </div>
                        <q-tooltip v-if="m.alamat">{{ m.alamat }}</q-tooltip>
                      </td>

                      <!-- Keaktifan Kunjungan -->
                      <td class="text-center">
                        <q-badge :color="m.total_kunjungan > 0 ? 'positive' : 'grey-5'" class="q-px-xs text-weight-bold">
                          {{ m.total_kunjungan }} Kunjungan
                        </q-badge>
                        <div v-if="m.kunjungan_terakhir" class="text-caption text-grey-7 q-mt-xs">
                          {{ formatDate(m.kunjungan_terakhir) }}
                        </div>
                      </td>

                      <!-- Peran / Saran Master -->
                      <td class="text-center">
                        <q-badge v-if="m.norm === grp.suggested_master_norm && grp.members.length > 1" color="primary" class="q-px-xs text-weight-bold">
                          RM Utama
                        </q-badge>
                        <span v-else-if="grp.members.length > 1" class="text-caption text-grey-6">Duplikat</span>
                        <span v-else class="text-caption text-grey-6">-</span>
                      </td>

                      <!-- Tombol Edit Pasien -->
                      <td class="text-center">
                        <q-btn
                          flat
                          dense
                          round
                          color="primary"
                          icon="icon-mat-edit"
                          :loading="loadingEditNorm === m.norm"
                          @click="bukaFormEditPasien(m.norm)"
                        >
                          <q-tooltip>Edit Master Pasien (RM {{ m.norm }})</q-tooltip>
                        </q-btn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </q-card-section>
            </q-card>
          </div>

          <!-- Pagination -->
          <div class="row items-center justify-between q-mt-md bg-white q-pa-md border-radius-12 shadow-1">
            <div class="text-caption text-grey-7">
              Menampilkan halaman {{ store.meta.current_page }} dari {{ store.meta.last_page }} (Total: {{ formatNumber(store.meta.total) }} grup terdeteksi)
            </div>
            <q-pagination
              v-model="store.meta.current_page"
              :max="store.meta.last_page"
              :max-pages="7"
              boundary-numbers
              direction-links
              color="primary"
              @update:model-value="store.getList"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Dialog Komparasi & Rekonsiliasi Detail -->
    <q-dialog v-model="store.dialogDetail" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-1" v-if="store.selectedGroup">
        <!-- Dialog Toolbar -->
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-avatar icon="icon-mat-compare_arrows" />
          <q-toolbar-title class="text-weight-bold">
            Detail Komparasi Grup Rekam Medis ({{ store.selectedGroup.total_members }} No. RM)
          </q-toolbar-title>
          <q-btn flat round dense icon="icon-mat-close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-lg">
          <div class="text-subtitle1 text-weight-bolder text-grey-9 q-mb-md">
            Komparasi Lengkap Data Pasien dalam Grup
          </div>

          <div class="row q-col-gutter-md">
            <div
              v-for="m in store.selectedGroup.members"
              :key="m.norm"
              :class="store.selectedGroup.members.length === 2 ? 'col-12 col-md-6' : 'col-12 col-md-4'"
            >
              <q-card flat class="bg-white shadow-2 border-radius-12 full-height" :class="{ 'border-primary': m.norm === store.selectedGroup.suggested_master_norm }">
                <div class="q-pa-md bg-grey-2 border-bottom-grey row items-center justify-between">
                  <div class="row items-center q-gutter-xs">
                    <q-icon name="icon-mat-folder_shared" size="20px" color="primary" />
                    <span class="text-h6 text-weight-bolder text-primary">RM {{ m.norm }}</span>
                  </div>
                  <div class="row items-center q-gutter-xs">
                    <q-badge v-if="m.norm === store.selectedGroup.suggested_master_norm" color="primary" class="q-px-sm q-py-xs">
                      Saran RM Utama
                    </q-badge>
                    <q-btn
                      flat
                      dense
                      round
                      size="sm"
                      color="primary"
                      icon="icon-mat-edit"
                      :loading="loadingEditNorm === m.norm"
                      @click="bukaFormEditPasien(m.norm)"
                    >
                      <q-tooltip>Edit Data Pasien Ini</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <q-card-section class="q-pa-md q-gutter-y-sm">
                  <div class="row">
                    <div class="col-4 text-caption text-grey-7">Nama Pasien:</div>
                    <div class="col-8 text-weight-bolder text-grey-9">{{ m.sapaan }} {{ m.nama }}</div>
                  </div>
                  <div class="row">
                    <div class="col-4 text-caption text-grey-7">NIK:</div>
                    <div class="col-8 text-weight-bold" :class="m.nik ? 'text-blue-9' : 'text-grey-5'">{{ m.nik || 'Belum diisi' }}</div>
                  </div>
                  <div class="row">
                    <div class="col-4 text-caption text-grey-7">No. BPJS:</div>
                    <div class="col-8">{{ m.noka_bpjs || '-' }}</div>
                  </div>
                  <div class="row">
                    <div class="col-4 text-caption text-grey-7">Tanggal Lahir:</div>
                    <div class="col-8">{{ m.tgl_lahir || '-' }} ({{ m.kelamin || '-' }})</div>
                  </div>
                  <div class="row">
                    <div class="col-4 text-caption text-grey-7">Nama Ibu:</div>
                    <div class="col-8 text-weight-medium">{{ m.namaibu || '-' }}</div>
                  </div>
                  <div class="row">
                    <div class="col-4 text-caption text-grey-7">Alamat:</div>
                    <div class="col-8 text-caption text-grey-8">{{ m.alamat || '-' }}</div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row items-center">
                    <div class="col-4 text-caption text-grey-7">Total Kunjungan:</div>
                    <div class="col-8">
                      <q-badge color="positive" class="text-weight-bold">{{ m.total_kunjungan }} Kunjungan</q-badge>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-4 text-caption text-grey-7">Terakhir Berobat:</div>
                    <div class="col-8 text-caption text-grey-9 text-weight-medium">{{ m.kunjungan_terakhir ? formatDate(m.kunjungan_terakhir) : 'Belum pernah berkunjung' }}</div>
                  </div>
                  <div class="row items-center">
                    <div class="col-4 text-caption text-grey-7">IHS SatuSehat:</div>
                    <div class="col-8">
                      <q-badge v-if="m.has_satset" color="teal">Terdaftar ({{ m.satset_uuid }})</q-badge>
                      <span v-else class="text-caption text-grey-5">Belum sinkron</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Petunjuk Rekonsiliasi -->
          <div class="q-mt-lg">
            <q-banner rounded class="bg-blue-1 text-primary q-pa-md shadow-1 border-radius-12">
              <template #avatar>
                <q-icon name="icon-mat-info" color="primary" size="32px" />
              </template>
              <div class="text-weight-bold text-subtitle2">Panduan Rekonsiliasi Rekam Medis:</div>
              <div class="text-caption text-grey-8">
                Gunakan tombol <b>Icon Pensil (Edit)</b> di atas untuk memperbaiki NIK, nama, atau alamat pasien langsung di master pendaftaran. No. RM dengan riwayat kunjungan paling aktif dan mutakhir disarankan sebagai <b>No. RM Utama</b>.
              </div>
            </q-banner>
          </div>
        </q-card-section>

        <!-- Aksi Footer -->
        <q-card-actions align="right" class="bg-white q-pa-md border-top-grey">
          <q-btn flat label="Tutup" color="grey-7" v-close-popup no-caps />
          <q-btn
            color="amber-9"
            outline
            icon="icon-mat-schedule"
            label="Tandai Sedang Ditinjau"
            no-caps
            :loading="store.loadingAction"
            @click="store.updateStatus(store.selectedGroup.group_id, 'SEDANG_DITINJAU')"
          />
          <q-btn
            color="positive"
            unelevated
            icon="icon-mat-check_circle"
            label="Tandai Sudah Direkonsiliasi"
            no-caps
            :loading="store.loadingAction"
            @click="store.updateStatus(store.selectedGroup.group_id, 'SUDAH_DIREKONSILIASI')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Edit Form Pasien Pendaftaran Master (Identik Menu Pendaftaran) -->
    <app-fullscreen
      v-model="editStore.openEdit"
      @close="tutupFormEdit"
    >
      <template #default>
        <div class="row items-center justify-between bg-primary text-white q-pa-sm shadow-2">
          <div class="text-subtitle1 text-weight-bolder row items-center q-gutter-xs">
            <q-icon name="icon-mat-person" size="20px" />
            <span>Form Identitas Pasien Master (Pendaftaran SIMRS)</span>
          </div>
          <q-btn flat round dense icon="icon-mat-close" color="white" @click="tutupFormEdit" />
        </div>
        <div class="q-pa-md">
          <DataPasien
            ref="refDataPasien"
            bpjs
            :not-edit="false"
            :tglsep="today"
          />
          <div class="row justify-end q-my-lg q-mx-md q-gutter-sm">
            <q-btn flat label="Batal" color="grey-7" no-caps @click="tutupFormEdit" />
            <q-btn
              unelevated
              color="primary"
              label="Simpan Perubahan Master Pasien"
              icon="icon-mat-save"
              no-caps
              :loading="editStore.loading"
              @click="simpanMasterPasien"
            />
          </div>
        </div>
      </template>
    </app-fullscreen>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSatsetAuditGandaStore } from 'src/stores/satset/auditganda'
import { usePendaftaranEditPasienStore } from 'src/stores/simrs/pendaftaran/table/editpasien'
import DataPasien from 'src/pages/simrs/pendaftaran/form/pasien/DataPasien.vue'
import { api } from 'src/boot/axios'
import { date } from 'quasar'
import { notifErr, notifSuccess } from 'src/modules/utils'

const store = useSatsetAuditGandaStore()
const editStore = usePendaftaranEditPasienStore()

const refDataPasien = ref(null)
const loadingEditNorm = ref(null)
const today = ref(date.formatDate(Date.now(), 'YYYY-MM-DD'))

onMounted(() => {
  store.initPage()
})

function formatNumber(val) {
  if (val === undefined || val === null) return '0'
  return new Intl.NumberFormat('id-ID').format(val)
}

function formatDate(val) {
  if (!val) return '-'
  try {
    const d = new Date(val)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return val
  }
}

async function bukaFormEditPasien(norm) {
  if (!norm) return
  loadingEditNorm.value = norm
  try {
    const resp = await api.get('/v1/simrs/pendaftaran/caripasienbyrm', {
      params: { norm }
    })
    if (resp?.data && Array.isArray(resp.data) && resp.data.length > 0) {
      const dataPasien = resp.data[0]
      editStore.openDialogEdit()
      editStore.editPasienIni(dataPasien)
    } else {
      notifErr({ message: 'Data master pasien tidak ditemukan' })
    }
  } catch (err) {
    notifErr(err)
  } finally {
    loadingEditNorm.value = null
  }
}

function tutupFormEdit() {
  editStore.clearFormPasien()
  editStore.openEdit = false
}

function simpanMasterPasien() {
  if (refDataPasien.value) {
    refDataPasien.value.set()
  }
  editStore.saveForm().then((res) => {
    if (res?.data?.status === 'success' || res?.status === 200) {
      notifSuccess({ message: 'Data master pasien berhasil diperbarui!' })
      tutupFormEdit()
      // Refresh list audit ganda
      store.getList(store.meta.current_page)
      store.getStats()
    }
  })
}
</script>

<style lang="scss" scoped>
.satset-audit-ganda-page {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.audit-header-card {
  position: relative;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%);
  border-radius: 16px;

  .header-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    pointer-events: none;

    &.shape-1 {
      top: -30px;
      right: -30px;
      width: 160px;
      height: 160px;
      background: rgba(255, 255, 255, 0.2);
    }

    &.shape-2 {
      bottom: -40px;
      left: 20%;
      width: 220px;
      height: 220px;
      background: rgba(59, 130, 246, 0.3);
    }
  }
}

.header-stat-box {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 20px;
}

.stat-card {
  border: 1px solid #e2e8f0;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.08);
    border-color: #93c5fd;
  }
}

.border-active {
  border: 2px solid #2563eb !important;
  background-color: #eff6ff !important;
}

.border-radius-12 {
  border-radius: 12px;
}

.border-bottom-grey {
  border-bottom: 1px solid #e2e8f0;
}

.border-top-grey {
  border-top: 1px solid #e2e8f0;
}

.border-primary {
  border: 2px solid #2563eb !important;
}

/* Fixed Table Layout agar 100% pas dan tidak pernah meluber */
.member-compact-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  thead tr {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;

    th {
      padding: 8px 12px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      text-align: left;
      white-space: nowrap;
    }
  }

  tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #f8fafc;
    }

    &.row-master-active {
      background-color: #f0f7ff;
    }

    td {
      padding: 10px 12px;
      font-size: 0.82rem;
      vertical-align: middle;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.font-mono {
  font-family: monospace;
}

.q-mt-2xs {
  margin-top: 2px;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.opacity-85 {
  opacity: 0.85;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-30 {
  opacity: 0.3;
}

.letter-spacing-1 {
  letter-spacing: 0.5px;
}
</style>
