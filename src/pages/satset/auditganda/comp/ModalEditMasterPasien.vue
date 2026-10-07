<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-grey-1 flex column no-wrap edit-master-dialog">
      <!-- Top Header Modern -->
      <div class="edit-header-bar text-white q-py-md q-px-lg shadow-3 row items-center justify-between no-wrap">
        <div class="row items-center q-gutter-md no-wrap">
          <div class="header-icon-box">
            <q-icon name="icon-mat-edit_note" size="28px" />
          </div>
          <div>
            <div class="row items-center q-gutter-sm">
              <span class="text-h6 text-weight-bold">Edit Master Rekam Medis Pasien</span>
              <q-badge color="amber-4" text-color="dark" class="text-weight-bold text-caption q-px-sm font-mono">
                RM: {{ form.norm || '-' }}
              </q-badge>
              <q-badge v-if="form.nik" color="blue-2" text-color="primary" class="text-weight-bold text-caption q-px-sm font-mono">
                NIK: {{ form.nik }}
              </q-badge>
            </div>
            <div class="text-caption opacity-85 q-mt-xs">
              Form Rekonsiliasi & Perbaikan Data Master Pasien SIMRS (Khusus Audit Data Ganda)
            </div>
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-btn
            flat
            round
            dense
            icon="icon-mat-refresh"
            color="white"
            :loading="loadingData"
            @click="loadDataPasien(props.norm)"
          >
            <q-tooltip>Muat Ulang Data Pasien</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="icon-mat-close"
            color="white"
            @click="tutupDialog"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingData" class="column items-center justify-center flex-grow q-pa-xl bg-white">
        <q-spinner-dots color="primary" size="48px" />
        <div class="text-weight-medium text-grey-7 q-mt-md">Mengambil data master pasien & master wilayah...</div>
      </div>

      <!-- Main Form Content -->
      <q-scroll-area v-else class="col flex-grow q-pa-lg">
        <div class="q-mx-auto" style="max-width: 1200px;">
          <!-- Navigation Tabs -->
          <div class="bg-white q-pa-xs border-radius-12 shadow-1 q-mb-md">
            <q-tabs
              v-model="activeTab"
              dense
              class="text-grey-7 custom-tabs"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="identitas" icon="icon-mat-badge" label="1. Identitas Pribadi & Kependudukan" no-caps class="text-weight-bold" />
              <q-tab name="sosial" icon="icon-mat-groups" label="2. Sosial, Kontak & Bahasa" no-caps class="text-weight-bold" />
              <q-tab name="alamat" icon="icon-mat-pin_drop" label="3. Alamat KTP & Domisili" no-caps class="text-weight-bold" />
            </q-tabs>
          </div>

          <q-tab-panels v-model="activeTab" animated class="bg-transparent">
            <!-- PANEL 1: IDENTITAS PRIBADI -->
            <q-tab-panel name="identitas" class="q-pa-none">
              <q-card flat class="border-radius-12 shadow-1 bg-white q-pa-lg">
                <div class="row items-center justify-between border-bottom-grey q-pb-sm q-mb-md">
                  <div class="text-subtitle1 text-weight-bolder text-primary row items-center q-gutter-xs">
                    <q-icon name="icon-mat-person" size="22px" />
                    <span>Identitas Utama Pasien</span>
                  </div>
                  <div class="text-caption text-grey-6">* Wajib diisi dengan data valid</div>
                </div>

                <div class="row q-col-gutter-md">
                  <!-- No RM -->
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-input
                      v-model="form.norm"
                      outlined
                      dense
                      readonly
                      bg-color="grey-2"
                      label="No. Rekam Medis (No. RM)"
                      hint="Identifikasi unik (tidak dapat diubah)"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-tag" color="primary" />
                      </template>
                    </q-input>
                  </div>

                  <!-- NIK -->
                  <div class="col-12 col-sm-6 col-md-5">
                    <q-input
                      v-model="form.nik"
                      outlined
                      dense
                      label="Nomor Induk Kependudukan (NIK) *"
                      maxlength="16"
                      counter
                      :rules="[
                        val => !val || val.length === 16 || 'NIK harus 16 digit angka',
                        val => !val || /^[0-9]+$/.test(val) || 'Hanya angka yang diperbolehkan'
                      ]"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-fingerprint" color="primary" />
                      </template>
                      <template #append>
                        <q-btn
                          v-if="form.nik?.length === 16"
                          unelevated
                          dense
                          color="teal-7"
                          text-color="white"
                          size="xs"
                          label="Cek BPJS"
                          class="q-px-xs"
                          :loading="loadingBpjsNik"
                          @click="cekBpjsByNik"
                        >
                          <q-tooltip>Cek Kepesertaan BPJS via NIK</q-tooltip>
                        </q-btn>
                      </template>
                    </q-input>
                  </div>

                  <!-- No BPJS / NOKA -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      v-model="form.nokabpjs"
                      outlined
                      dense
                      label="No. Kartu BPJS / Askes (NOKA)"
                      maxlength="13"
                      hint="13 digit nomor kartu BPJS Kesehatan"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-fingerprint" color="teal" />
                      </template>
                      <template #append>
                        <q-btn
                          v-if="form.nokabpjs"
                          unelevated
                          dense
                          color="teal-7"
                          text-color="white"
                          size="xs"
                          label="Cek BPJS"
                          class="q-px-xs"
                          :loading="loadingBpjsNoka"
                          @click="cekBpjsByNoka"
                        >
                          <q-tooltip>Cek Kepesertaan BPJS via No. Kartu</q-tooltip>
                        </q-btn>
                      </template>
                    </q-input>
                  </div>

                  <!-- Sapaan -->
                  <div class="col-12 col-sm-4 col-md-2">
                    <app-autocomplete-new
                      :model="form.sapaan"
                      label="Sapaan"
                      autocomplete="sapaan"
                      option-value="sapaan"
                      option-label="sapaan"
                      outlined
                      :source="listSapaan"
                      @on-select="form.sapaan = $event"
                      @clear="form.sapaan = ''"
                    />
                  </div>

                  <!-- Gelar Depan -->
                  <div class="col-12 col-sm-4 col-md-2">
                    <q-input
                      v-model="form.gelardepan"
                      outlined
                      dense
                      label="Gelar Depan"
                      placeholder="dr., Prof., dll"
                    />
                  </div>

                  <!-- Nama Lengkap Pasien -->
                  <div class="col-12 col-sm-8 col-md-6">
                    <q-input
                      v-model="form.nama"
                      outlined
                      dense
                      label="Nama Lengkap Pasien *"
                      :rules="[val => !val || val.trim().length > 0 || 'Nama lengkap wajib diisi']"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-person" color="primary" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Gelar Belakang -->
                  <div class="col-12 col-sm-4 col-md-2">
                    <q-input
                      v-model="form.gelarbelakang"
                      outlined
                      dense
                      label="Gelar Belakang"
                      placeholder="S.Kep, M.Kes, dll"
                    />
                  </div>

                  <!-- Jenis Kelamin -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <app-autocomplete-new
                      :model="form.kelamin"
                      label="Jenis Kelamin *"
                      autocomplete="kelamin"
                      option-value="kelamin"
                      option-label="kelamin"
                      outlined
                      :source="listKelamin"
                      @on-select="onKelaminSelected"
                      @clear="form.kelamin = ''; form.kodekelamin = ''"
                    />
                  </div>

                  <!-- Tempat Lahir -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      v-model="form.templahir"
                      outlined
                      dense
                      label="Tempat Lahir *"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-location_city" color="blue-7" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Tanggal Lahir (Format Terpisah: Hari, Bulan, Tahun - Identik Form Pendaftaran) -->
                  <div class="col-12 col-sm-12 col-md-4">
                    <div class="text-caption text-grey-7 q-mb-xs">Tanggal Lahir (Hari / Bulan / Tahun) *</div>
                    <div class="row q-col-gutter-xs no-wrap">
                      <div class="col-4">
                        <q-input
                          v-model="tanggal.hari"
                          type="number"
                          outlined
                          dense
                          label="Hari"
                          placeholder="01"
                          max="31"
                          min="1"
                          @update:model-value="onTanggalChange"
                        />
                      </div>
                      <div class="col-4">
                        <q-input
                          v-model="tanggal.bulan"
                          type="number"
                          outlined
                          dense
                          label="Bulan"
                          placeholder="01"
                          max="12"
                          min="1"
                          @update:model-value="onTanggalChange"
                        />
                      </div>
                      <div class="col-4">
                        <q-input
                          v-model="tanggal.tahun"
                          type="number"
                          outlined
                          dense
                          label="Tahun"
                          placeholder="1990"
                          max="2099"
                          min="1900"
                          @update:model-value="onTanggalChange"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Informasi Usia Realtime -->
                  <div class="col-12">
                    <div class="bg-blue-1 border-radius-8 q-pa-sm row items-center justify-between text-primary">
                      <div class="row items-center q-gutter-xs">
                        <q-icon name="icon-mat-info" size="18px" />
                        <span class="text-caption text-weight-bold">Estimasi Usia Saat Ini:</span>
                        <span class="text-caption text-weight-bolder text-indigo-9">{{ calculatedAge || '-' }}</span>
                      </div>
                      <q-badge color="primary" outline label="Kalkulasi Otomatis SIMRS" />
                    </div>
                  </div>

                  <!-- Nama Ibu Kandung -->
                  <div class="col-12 col-sm-6 col-md-6">
                    <q-input
                      v-model="form.namaibukandung"
                      outlined
                      dense
                      label="Nama Ibu Kandung"
                      hint="Penting untuk verifikasi SatuSehat & Dukcapil"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-family_restroom" color="deep-purple" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Nomor Identitas Lain (Paspor/SIM/dll) -->
                  <div class="col-12 col-sm-6 col-md-6">
                    <q-input
                      v-model="form.nomoridentitaslain"
                      outlined
                      dense
                      label="Nomor Identitas Lain (Paspor / SIM / KITAS)"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-badge" color="grey-7" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card>
            </q-tab-panel>

            <!-- PANEL 2: SOSIAL, KONTAK & BAHASA -->
            <q-tab-panel name="sosial" class="q-pa-none">
              <q-card flat class="border-radius-12 shadow-1 bg-white q-pa-lg">
                <div class="row items-center justify-between border-bottom-grey q-pb-sm q-mb-md">
                  <div class="text-subtitle1 text-weight-bolder text-primary row items-center q-gutter-xs">
                    <q-icon name="icon-mat-groups" size="22px" />
                    <span>Status Sosial, Komunikasi & Kontak Pasien</span>
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <!-- Agama -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <app-autocomplete-new
                      :model="form.agama"
                      label="Agama"
                      autocomplete="keterangan"
                      option-value="keterangan"
                      option-label="keterangan"
                      outlined
                      :source="listAgama"
                      @on-select="onAgamaSelected"
                      @clear="form.agama = ''; form.kodemapagama = ''"
                    />
                  </div>

                  <!-- Status Pernikahan -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <app-autocomplete-new
                      :model="form.statuspernikahan"
                      label="Status Pernikahan"
                      autocomplete="statuspernikahan"
                      option-value="statuspernikahan"
                      option-label="statuspernikahan"
                      outlined
                      :source="listStatusPernikahan"
                      @on-select="form.statuspernikahan = $event"
                      @clear="form.statuspernikahan = ''"
                    />
                  </div>

                  <!-- Pendidikan -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <app-autocomplete-new
                      :model="form.pendidikan"
                      label="Pendidikan Terakhir"
                      autocomplete="pendidikan"
                      option-value="pendidikan"
                      option-label="pendidikan"
                      outlined
                      :source="listPendidikan"
                      @on-select="onPendidikanSelected"
                      @clear="form.pendidikan = ''; form.kodependidikan = ''"
                    />
                  </div>

                  <!-- Pekerjaan -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <app-autocomplete-new
                      :model="form.pekerjaan"
                      label="Pekerjaan"
                      autocomplete="pekerjaan"
                      option-value="pekerjaan"
                      option-label="pekerjaan"
                      outlined
                      :source="listPekerjaan"
                      @on-select="form.pekerjaan = $event"
                      @clear="form.pekerjaan = ''"
                    />
                  </div>

                  <!-- Suku Bangsa -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      v-model="form.suku"
                      outlined
                      dense
                      label="Suku Bangsa"
                      placeholder="Jawa, Madura, Sunda, dll"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-diversity_3" color="indigo" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Bahasa Sehari-hari -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <app-autocomplete-new
                      :model="form.bahasa"
                      label="Bahasa Sehari-hari"
                      autocomplete="bahasa"
                      option-value="bahasa"
                      option-label="bahasa"
                      outlined
                      :source="listBahasa"
                      @on-select="form.bahasa = $event"
                      @clear="form.bahasa = ''"
                    />
                  </div>

                  <!-- Hambatan Komunikasi -->
                  <div class="col-12 col-sm-6 col-md-6">
                    <app-autocomplete-new
                      :model="form.kdhambatan"
                      label="Hambatan Komunikasi"
                      autocomplete="hambatan"
                      option-value="kode"
                      option-label="hambatan"
                      outlined
                      :source="listHambatan"
                      @on-select="form.kdhambatan = $event"
                      @clear="form.kdhambatan = '0'"
                    />
                  </div>

                  <!-- Kemampuan Baca Tulis -->
                  <div class="col-12 col-sm-6 col-md-6 flex items-center q-gutter-md">
                    <div class="text-caption text-grey-7">Kemampuan Baca Tulis:</div>
                    <q-radio v-model="form.bacatulis" val="Bisa Membaca & Menulis" label="Bisa Membaca & Menulis" dense color="primary" />
                    <q-radio v-model="form.bacatulis" val="Tidak Bisa (Buta Huruf)" label="Tidak Bisa (Buta Huruf)" dense color="negative" />
                  </div>

                  <!-- No. HP / WhatsApp -->
                  <div class="col-12 col-sm-6 col-md-6">
                    <q-input
                      v-model="form.noteleponhp"
                      outlined
                      dense
                      label="No. Handphone / WhatsApp *"
                      placeholder="08xxxxxxxxxx"
                      :rules="[val => !val || /^[0-9+]+$/.test(val) || 'Format nomor tidak valid']"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-smartphone" color="positive" />
                      </template>
                      <template #append>
                        <q-btn
                          flat
                          dense
                          round
                          icon="icon-mat-auto_fix_high"
                          color="primary"
                          size="sm"
                          @click="formatNomorHp"
                        >
                          <q-tooltip>Format Standar Awalan 08</q-tooltip>
                        </q-btn>
                      </template>
                    </q-input>
                  </div>

                  <!-- No. Telepon Rumah -->
                  <div class="col-12 col-sm-6 col-md-6">
                    <q-input
                      v-model="form.noteleponrumah"
                      outlined
                      dense
                      label="No. Telepon Rumah"
                      placeholder="0335xxxxxx"
                    >
                      <template #prepend>
                        <q-icon name="icon-mat-phone" color="grey-7" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card>
            </q-tab-panel>

            <!-- PANEL 3: ALAMAT KTP & DOMISILI -->
            <q-tab-panel name="alamat" class="q-pa-none">
              <div class="row q-col-gutter-md">
                <!-- Alamat Sesuai KTP -->
                <div class="col-12">
                  <q-card flat class="border-radius-12 shadow-1 bg-white q-pa-lg">
                    <div class="row items-center justify-between border-bottom-grey q-pb-sm q-mb-md">
                      <div class="text-subtitle1 text-weight-bolder text-primary row items-center q-gutter-xs">
                        <q-icon name="icon-mat-home" size="22px" />
                        <span>Alamat Sesuai KTP</span>
                      </div>
                      <q-badge color="blue-1" text-color="primary" label="Alamat Resmi Pasien" />
                    </div>

                    <div class="row q-col-gutter-md">
                      <!-- Provinsi -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodepropinsi"
                          label="Provinsi"
                          autocomplete="wilayah"
                          option-value="propinsi"
                          option-label="wilayah"
                          outlined
                          :source="listProvinsi"
                          :loading="loadingPropinsi"
                          @on-select="onProvinsiSelected"
                          @clear="clearProvinsi"
                        />
                      </div>

                      <!-- Kabupaten / Kota -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodekabupatenkota"
                          label="Kabupaten / Kota"
                          autocomplete="wilayah"
                          option-value="kotakabupaten"
                          option-label="wilayah"
                          outlined
                          :source="listKota"
                          :loading="loadingKota"
                          :disable="!listKota?.length"
                          @on-select="onKotaSelected"
                          @clear="clearKota"
                        />
                      </div>

                      <!-- Kecamatan -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodekecamatan"
                          label="Kecamatan"
                          autocomplete="wilayah"
                          option-value="kotakabupaten"
                          option-label="wilayah"
                          outlined
                          :source="listKecamatan"
                          :loading="loadingKecamatan"
                          :disable="!listKecamatan?.length"
                          @on-select="onKecamatanSelected"
                          @clear="clearKecamatan"
                        />
                      </div>

                      <!-- Kelurahan -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodekelurahan"
                          label="Kelurahan / Desa"
                          autocomplete="wilayah"
                          option-value="kotakabupaten"
                          option-label="wilayah"
                          outlined
                          :source="listKelurahan"
                          :loading="loadingKelurahan"
                          :disable="!listKelurahan?.length"
                          @on-select="onKelurahanSelected"
                          @clear="clearKelurahan"
                        />
                      </div>

                      <!-- RT -->
                      <div class="col-6 col-sm-3 col-md-2">
                        <q-input
                          v-model="form.rt"
                          outlined
                          dense
                          label="RT"
                          placeholder="001"
                          @update:model-value="onRtRwChange"
                        />
                      </div>

                      <!-- RW -->
                      <div class="col-6 col-sm-3 col-md-2">
                        <q-input
                          v-model="form.rw"
                          outlined
                          dense
                          label="RW"
                          placeholder="001"
                          @update:model-value="onRtRwChange"
                        />
                      </div>

                      <!-- Kode Pos -->
                      <div class="col-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="form.kodepos"
                          outlined
                          dense
                          label="Kode Pos"
                          placeholder="672xx"
                          @update:model-value="onKodePosChange"
                        />
                      </div>

                      <!-- Alamat Jalan Detail -->
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="form.alamat"
                          outlined
                          dense
                          label="Alamat Lengkap / Nama Jalan / No. Rumah"
                          placeholder="Jl. Merdeka No. 12"
                          @update:model-value="onAlamatChange"
                        >
                          <template #prepend>
                            <q-icon name="icon-mat-home" color="primary" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </q-card>
                </div>

                <!-- Alamat Domisili Section -->
                <div class="col-12">
                  <q-card flat class="border-radius-12 shadow-1 bg-white q-pa-lg">
                    <div class="row items-center justify-between border-bottom-grey q-pb-sm q-mb-md">
                      <div class="text-subtitle1 text-weight-bolder text-primary row items-center q-gutter-xs">
                        <q-icon name="icon-mat-place" size="22px" />
                        <span>Alamat Domisili / Tempat Tinggal Saat Ini</span>
                      </div>
                      <q-toggle
                        v-model="isDomisiliSamaKtp"
                        color="primary"
                        label="Sama dengan Alamat KTP"
                        left-label
                        class="text-weight-bold"
                        @update:model-value="onToggleDomisiliSama"
                      />
                    </div>

                    <div v-if="!isDomisiliSamaKtp" class="row q-col-gutter-md q-mt-xs">
                      <!-- Provinsi Domisili -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodepropinsidomisili"
                          label="Provinsi Domisili"
                          autocomplete="wilayah"
                          option-value="propinsi"
                          option-label="wilayah"
                          outlined
                          :source="listProvinsiDomisili"
                          :loading="loadingPropinsiDom"
                          @on-select="onProvinsiDomSelected"
                          @clear="clearProvinsiDom"
                        />
                      </div>

                      <!-- Kabupaten / Kota Domisili -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodekabupatenkotadomisili"
                          label="Kabupaten / Kota Domisili"
                          autocomplete="wilayah"
                          option-value="kotakabupaten"
                          option-label="wilayah"
                          outlined
                          :source="listKotaDomisili"
                          :loading="loadingKotaDom"
                          :disable="!listKotaDomisili?.length"
                          @on-select="onKotaDomSelected"
                          @clear="clearKotaDom"
                        />
                      </div>

                      <!-- Kecamatan Domisili -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodekecamatandomisili"
                          label="Kecamatan Domisili"
                          autocomplete="wilayah"
                          option-value="kotakabupaten"
                          option-label="wilayah"
                          outlined
                          :source="listKecamatanDomisili"
                          :loading="loadingKecamatanDom"
                          :disable="!listKecamatanDomisili?.length"
                          @on-select="onKecamatanDomSelected"
                          @clear="clearKecamatanDom"
                        />
                      </div>

                      <!-- Kelurahan Domisili -->
                      <div class="col-12 col-sm-6 col-md-3">
                        <app-autocomplete-new
                          :model="form.kodekelurahandomisili"
                          label="Kelurahan / Desa Domisili"
                          autocomplete="wilayah"
                          option-value="kotakabupaten"
                          option-label="wilayah"
                          outlined
                          :source="listKelurahanDomisili"
                          :loading="loadingKelurahanDom"
                          :disable="!listKelurahanDomisili?.length"
                          @on-select="onKelurahanDomSelected"
                          @clear="clearKelurahanDom"
                        />
                      </div>

                      <!-- RT Domisili -->
                      <div class="col-6 col-sm-3 col-md-2">
                        <q-input
                          v-model="form.rtdomisili"
                          outlined
                          dense
                          label="RT Domisili"
                        />
                      </div>

                      <!-- RW Domisili -->
                      <div class="col-6 col-sm-3 col-md-2">
                        <q-input
                          v-model="form.rwdomisili"
                          outlined
                          dense
                          label="RW Domisili"
                        />
                      </div>

                      <!-- Kode Pos Domisili -->
                      <div class="col-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="form.kodeposdomisili"
                          outlined
                          dense
                          label="Kode Pos Domisili"
                        />
                      </div>

                      <!-- Alamat Jalan Detail Domisili -->
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="form.alamatdomisili"
                          outlined
                          dense
                          label="Alamat Lengkap Domisili"
                        >
                          <template #prepend>
                            <q-icon name="icon-mat-place" color="amber-9" />
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <div v-else class="bg-grey-1 q-pa-md border-radius-8 text-grey-7 text-center">
                      <q-icon name="icon-mat-check_circle" color="positive" size="20px" class="q-mr-xs" />
                      <span>Alamat Domisili diatur otomatis identik dengan Alamat KTP.</span>
                    </div>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-scroll-area>

      <!-- Bottom Actions Bar -->
      <div class="bg-white q-py-md q-px-lg border-top-grey row items-center justify-between no-wrap shadow-2">
        <div class="row items-center q-gutter-sm text-caption text-grey-7">
          <q-icon name="icon-mat-security" color="primary" size="18px" />
          <span>Perubahan data akan disimpan langsung ke tabel master SIMRS & memicu audit ulang data ganda.</span>
        </div>
        <div class="row items-center q-gutter-sm">
          <q-btn
            flat
            label="Batal"
            color="grey-8"
            no-caps
            @click="tutupDialog"
          />
          <q-btn
            unelevated
            color="primary"
            icon="icon-mat-save"
            label="Simpan Perubahan Master Pasien"
            no-caps
            class="q-px-md text-weight-bold"
            :loading="simpanLoading"
            @click="simpanData"
          />
        </div>
      </div>
    </q-card>

    <!-- Dialog Bridging BPJS (Hasil Pengecekan Peserta VClaim) -->
    <q-dialog v-model="dialogBpjs" persistent>
      <q-card style="min-width: 540px; max-width: 90vw;" class="border-radius-12">
        <q-card-section class="bg-teal-8 text-white row items-center justify-between q-py-sm">
          <div class="row items-center q-gutter-xs text-subtitle1 text-weight-bold">
            <q-icon name="icon-mat-verified_user" size="22px" />
            <span>Hasil Bridging BPJS Kesehatan (VClaim)</span>
          </div>
          <q-btn flat round dense icon="icon-mat-close" color="white" v-close-popup />
        </q-card-section>

        <q-card-section v-if="dataPesertaBpjs" class="q-pa-md q-gutter-y-sm">
          <div class="row items-center justify-between bg-teal-1 border-radius-8 q-pa-sm text-teal-10">
            <div>
              <div class="text-caption">Status Kepesertaan:</div>
              <div class="text-subtitle2 text-weight-bolder">
                {{ dataPesertaBpjs.statusPeserta?.keterangan || '-' }}
              </div>
            </div>
            <q-badge
              :color="dataPesertaBpjs.statusPeserta?.keterangan === 'AKTIF' ? 'positive' : 'negative'"
              class="text-weight-bold text-caption q-px-sm"
            >
              {{ dataPesertaBpjs.statusPeserta?.keterangan || '-' }}
            </q-badge>
          </div>

          <div class="row border-bottom-grey q-py-xs">
            <div class="col-4 text-caption text-grey-7">No. Kartu BPJS:</div>
            <div class="col-8 text-weight-bold text-teal-9 font-mono">{{ dataPesertaBpjs.noKartu || '-' }}</div>
          </div>
          <div class="row border-bottom-grey q-py-xs">
            <div class="col-4 text-caption text-grey-7">NIK:</div>
            <div class="col-8 text-weight-bold font-mono">{{ dataPesertaBpjs.nik || '-' }}</div>
          </div>
          <div class="row border-bottom-grey q-py-xs">
            <div class="col-4 text-caption text-grey-7">Nama Peserta:</div>
            <div class="col-8 text-weight-bold text-primary">{{ dataPesertaBpjs.nama || '-' }}</div>
          </div>
          <div class="row border-bottom-grey q-py-xs">
            <div class="col-4 text-caption text-grey-7">Jenis Kelamin:</div>
            <div class="col-8">{{ dataPesertaBpjs.sex === 'L' ? 'Laki-laki' : (dataPesertaBpjs.sex === 'P' ? 'Perempuan' : '-') }}</div>
          </div>
          <div class="row border-bottom-grey q-py-xs">
            <div class="col-4 text-caption text-grey-7">Tanggal Lahir:</div>
            <div class="col-8">{{ dataPesertaBpjs.tglLahir || '-' }} (Usia: {{ dataPesertaBpjs.umur?.umurSekarang || '-' }})</div>
          </div>
          <div class="row border-bottom-grey q-py-xs">
            <div class="col-4 text-caption text-grey-7">Jenis Peserta:</div>
            <div class="col-8 text-weight-medium">{{ dataPesertaBpjs.jenisPeserta?.keterangan || '-' }}</div>
          </div>
          <div class="row border-bottom-grey q-py-xs">
            <div class="col-4 text-caption text-grey-7">Hak Kelas:</div>
            <div class="col-8">{{ dataPesertaBpjs.hakKelas?.keterangan || '-' }}</div>
          </div>
          <div class="row q-py-xs">
            <div class="col-4 text-caption text-grey-7">Faskes Asal (PPK 1):</div>
            <div class="col-8 text-caption text-grey-9">{{ dataPesertaBpjs.provUmum?.nmProvider || '-' }}</div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md border-top-grey">
          <q-btn flat label="Batal" color="grey-7" no-caps v-close-popup />
          <q-btn
            unelevated
            color="teal-8"
            icon="icon-mat-check_circle"
            label="Terapkan Data BPJS ke Form"
            no-caps
            @click="terapkanDataBpjs"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Payload JSON (Review & Debugging - Dicomment Sementara)
    <q-dialog v-model="dialogPayload" persistent>
      <q-card style="min-width: 650px; max-width: 90vw;" class="border-radius-12 bg-white">
        <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm">
          <div class="row items-center q-gutter-xs text-subtitle1 text-weight-bold">
            <q-icon name="icon-mat-code" size="22px" />
            <span>Payload Data Siap Kirim (Review Mode)</span>
          </div>
          <q-btn flat round dense icon="icon-mat-close" color="white" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="text-caption text-grey-8 q-mb-sm">
            Berikut adalah object <b>Payload JSON</b> yang dibentuk saat tombol Simpan diklik. Data <b>belum disimpan ke database</b> sehingga dapat Anda copy dan berikan ke asisten untuk dianalisis kecocokan formatnya dengan database SIMRS.
          </div>

          <div class="relative-position">
            <pre class="bg-grey-10 text-green-4 q-pa-md rounded-borders font-mono" style="max-height: 400px; overflow-y: auto; font-size: 12px; line-height: 1.4; border-radius: 8px;">{{ payloadString }}</pre>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md border-top-grey q-gutter-sm">
          <q-btn
            flat
            label="Tutup"
            color="grey-8"
            no-caps
            v-close-popup
          />
          <q-btn
            unelevated
            color="secondary"
            icon="icon-mat-content_copy"
            label="Copy Payload JSON"
            no-caps
            class="text-weight-bold q-px-md"
            @click="copyPayloadJson"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    -->
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { api } from 'src/boot/axios'
import { date } from 'quasar'
import { notifSuccess, notifErr } from 'src/modules/utils'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  norm: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const activeTab = ref('identitas')
const loadingData = ref(false)
const simpanLoading = ref(false)
const isDomisiliSamaKtp = ref(true)

// Bridging BPJS States
const loadingBpjsNoka = ref(false)
const loadingBpjsNik = ref(false)
const dialogBpjs = ref(false)
const dataPesertaBpjs = ref(null)

// Dialog Payload Inspection (Dicomment)
// const dialogPayload = ref(false)
// const payloadString = ref('')

// Tanggal Lahir (Hari, Bulan, Tahun - Identik Form Pendaftaran Lama)
const tanggal = ref({
  hari: '01',
  bulan: '01',
  tahun: '1990'
})

// Master Option Lists
const listSapaan = ref([])
const listKelamin = ref([])
const listAgama = ref([])
const listStatusPernikahan = ref([])
const listPendidikan = ref([])
const listPekerjaan = ref([])
const listBahasa = ref([])
const listHambatan = ref([])

// Wilayah Lists KTP
const listProvinsi = ref([])
const listKota = ref([])
const listKecamatan = ref([])
const listKelurahan = ref([])
const loadingPropinsi = ref(false)
const loadingKota = ref(false)
const loadingKecamatan = ref(false)
const loadingKelurahan = ref(false)

// Wilayah Lists Domisili
const listProvinsiDomisili = ref([])
const listKotaDomisili = ref([])
const listKecamatanDomisili = ref([])
const listKelurahanDomisili = ref([])
const loadingPropinsiDom = ref(false)
const loadingKotaDom = ref(false)
const loadingKecamatanDom = ref(false)
const loadingKelurahanDom = ref(false)

// Main Form Reactive
const form = ref({
  norm: '',
  nik: '',
  nokabpjs: '',
  sapaan: '',
  gelardepan: '',
  nama: '',
  gelarbelakang: '',
  kelamin: '',
  kodekelamin: '',
  templahir: '',
  tgllahir: '',
  namaibukandung: '',
  nomoridentitaslain: '',
  agama: '',
  kodemapagama: '',
  statuspernikahan: '',
  pendidikan: '',
  kodependidikan: '',
  pekerjaan: '',
  suku: '',
  bahasa: '',
  kdhambatan: '0',
  bacatulis: 'Bisa Membaca & Menulis',
  noteleponhp: '',
  noteleponrumah: '',
  negara: '62',
  kodepropinsi: '35',
  propinsi: 'JAWA TIMUR',
  kodekabupatenkota: '',
  kabupatenkota: '',
  kodekecamatan: '',
  kecamatan: '',
  kodekelurahan: '',
  kelurahan: '',
  rt: '',
  rw: '',
  kodepos: '',
  alamat: '',
  negaradomisili: '62',
  kodepropinsidomisili: '35',
  propinsidomisili: 'JAWA TIMUR',
  kodekabupatenkotadomisili: '',
  kabupatenkotadomisili: '',
  kodekecamatandomisili: '',
  kecamatandomisili: '',
  kodekelurahandomisili: '',
  kelurahandomisili: '',
  rtdomisili: '',
  rwdomisili: '',
  kodeposdomisili: '',
  alamatdomisili: ''
})

const calculatedAge = computed(() => {
  if (!form.value.tgllahir) return '-'
  try {
    const birth = new Date(form.value.tgllahir)
    if (isNaN(birth.getTime())) return '-'
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) {
      months -= 1
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years -= 1
      months += 12
    }
    return `${years} Tahun ${months} Bulan ${days} Hari`
  } catch {
    return '-'
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.norm) {
    activeTab.value = 'identitas'
    loadMasterOptions()
    loadDataPasien(props.norm)
  }
})

function onTanggalChange() {
  const h = String(tanggal.value.hari || '01').padStart(2, '0')
  const b = String(tanggal.value.bulan || '01').padStart(2, '0')
  const t = String(tanggal.value.tahun || '1990').padStart(4, '1900')
  form.value.tgllahir = `${t}-${b}-${h}`
}

async function loadMasterOptions() {
  try {
    const [
      sapaanRes,
      kelaminRes,
      agamaRes,
      nikahRes,
      didikRes,
      kerjaRes,
      bahasaRes,
      provRes
    ] = await Promise.allSettled([
      api.get('v1/simrs/master/sapaan'),
      api.get('v1/simrs/master/kelamin'),
      api.get('v1/simrs/master/agama'),
      api.get('v1/simrs/master/statuspernikahan'),
      api.get('v1/simrs/master/pendidikan'),
      api.get('v1/simrs/master/pekerjaan'),
      api.get('v1/simrs/master/listbahasa'),
      api.get('v1/simrs/master/getpropinsi', { params: { kd_negara: '62' } })
    ])

    if (sapaanRes.status === 'fulfilled' && sapaanRes.value?.data) {
      listSapaan.value = sapaanRes.value.data
    }
    if (kelaminRes.status === 'fulfilled' && kelaminRes.value?.data) {
      listKelamin.value = kelaminRes.value.data
    } else {
      listKelamin.value = [
        { kelamin: 'Laki-laki', kode: 'L' },
        { kelamin: 'Perempuan', kode: 'P' }
      ]
    }
    if (agamaRes.status === 'fulfilled' && agamaRes.value?.data) {
      listAgama.value = agamaRes.value.data
    }
    if (nikahRes.status === 'fulfilled' && nikahRes.value?.data) {
      listStatusPernikahan.value = nikahRes.value.data
    }
    if (didikRes.status === 'fulfilled' && didikRes.value?.data) {
      listPendidikan.value = didikRes.value.data
    }
    if (kerjaRes.status === 'fulfilled' && kerjaRes.value?.data) {
      listPekerjaan.value = kerjaRes.value.data
    }
    if (bahasaRes.status === 'fulfilled' && bahasaRes.value?.data) {
      listBahasa.value = bahasaRes.value.data
    }
    if (provRes.status === 'fulfilled' && provRes.value?.data?.[0]) {
      listProvinsi.value = provRes.value.data[0]
      listProvinsiDomisili.value = provRes.value.data[0]
    }

    listHambatan.value = [
      { hambatan: 'Tidak Ada Hambatan', kode: '0' },
      { hambatan: 'Tunarungu / Gangguan Pendengaran', kode: '1' },
      { hambatan: 'Tunawicara / Gangguan Bicara', kode: '2' },
      { hambatan: 'Tunanetra / Gangguan Penglihatan', kode: '3' },
      { hambatan: 'Gangguan Kognitif / Memori', kode: '4' },
      { hambatan: 'Kendala Bahasa Daerah', kode: '5' }
    ]
  } catch (err) {
    console.warn('Gagal memuat sebagian master options:', err)
  }
}

async function loadDataPasien(norm) {
  if (!norm) return
  loadingData.value = true
  try {
    const resp = await api.get('/v1/simrs/pendaftaran/caripasienbyrm', {
      params: { norm }
    })

    let data = null
    if (Array.isArray(resp?.data) && resp.data.length > 0) {
      data = resp.data[0]
    } else if (resp?.data && typeof resp.data === 'object' && !Array.isArray(resp.data)) {
      data = resp.data
    }

    if (!data) {
      notifErr({ message: `Data master pasien No. RM ${norm} tidak ditemukan di database.` })
      return
    }

    // Kode wilayah default / parsing
    const kdNeg = data.negara || '62'
    const kdProp = data.kodepropinsi || '35'
    const kdKota = data.kodekabupatenkota || ''
    const kdKec = data.kodekecamatan || ''
    const kdKel = data.kodekelurahan || ''

    // Parsing Tanggal Lahir ke Hari, Bulan, Tahun
    if (data.tgllahir) {
      const parts = data.tgllahir.substring(0, 10).split('-')
      if (parts.length === 3) {
        tanggal.value.tahun = parts[0]
        tanggal.value.bulan = parts[1]
        tanggal.value.hari = parts[2]
      }
    }

    // Populate Data
    form.value = {
      norm: data.norm || norm,
      nik: data.nik || '',
      nokabpjs: data.nokabpjs || data.noka || '',
      sapaan: data.sapaan || 'Bpk.',
      gelardepan: data.gelardepan || '',
      nama: data.nama || '',
      gelarbelakang: data.gelarbelakang || '',
      kelamin: data.kelamin || '',
      kodekelamin: data.kodekelamin || '',
      templahir: data.templahir || '',
      tgllahir: data.tgllahir ? data.tgllahir.substring(0, 10) : '',
      namaibukandung: data.namaibukandung || data.namaibu || '',
      nomoridentitaslain: data.nomoridentitaslain || '',
      agama: data.agama || '',
      kodemapagama: data.kodemapagama || '',
      statuspernikahan: data.statuspernikahan || '',
      pendidikan: data.pendidikan || '',
      kodependidikan: data.kodependidikan || '',
      pekerjaan: data.pekerjaan || '',
      suku: data.suku || '',
      bahasa: data.bahasa || 'Indonesia',
      kdhambatan: data.kdhambatan || '0',
      bacatulis: data.bacatulis || 'Bisa Membaca & Menulis',
      noteleponhp: data.noteleponhp || data.nohp || '',
      noteleponrumah: data.noteleponrumah || '',
      negara: kdNeg,
      kodepropinsi: kdProp,
      propinsi: data.propinsi || 'JAWA TIMUR',
      kodekabupatenkota: kdKota,
      kabupatenkota: data.kabupatenkota || '',
      kodekecamatan: kdKec,
      kecamatan: data.kecamatan || '',
      kodekelurahan: kdKel,
      kelurahan: data.kelurahan || '',
      rt: data.rt || '',
      rw: data.rw || '',
      kodepos: data.kodepos || '',
      alamat: data.alamat || '',
      negaradomisili: data.negaradomisili || kdNeg,
      kodepropinsidomisili: data.kodepropinsidomisili || kdProp,
      propinsidomisili: data.propinsidomisili || data.propinsi || 'JAWA TIMUR',
      kodekabupatenkotadomisili: data.kodekabupatenkotadomisili || kdKota,
      kabupatenkotadomisili: data.kabupatenkotadomisili || data.kabupatenkota || '',
      kodekecamatandomisili: data.kodekecamatandomisili || kdKec,
      kecamatandomisili: data.kecamatandomisili || data.kecamatan || '',
      kodekelurahandomisili: data.kodekelurahandomisili || kdKel,
      kelurahandomisili: data.kelurahandomisili || data.kelurahan || '',
      rtdomisili: data.rtdomisili || data.rt || '',
      rwdomisili: data.rwdomisili || data.rw || '',
      kodeposdomisili: data.kodeposdomisili || data.kodepos || '',
      alamatdomisili: data.alamatdomisili || data.alamat || ''
    }

    // Cek apakah domisili sama
    if (data.alamatdomisili && data.alamatdomisili !== data.alamat) {
      isDomisiliSamaKtp.value = false
    } else {
      isDomisiliSamaKtp.value = true
    }

    // Cascade load wilayah KTP dengan parameter lengkap
    if (kdProp) {
      await fetchKota(kdProp, kdNeg)
    }
    if (kdKota) {
      await fetchKecamatan(kdKota, kdProp, kdNeg)
    }
    if (kdKec) {
      await fetchKelurahan(kdKec, kdKota, kdProp, kdNeg)
    }

    // Cascade load domisili jika berbeda
    if (!isDomisiliSamaKtp.value) {
      const dNeg = form.value.negaradomisili || '62'
      const dProp = form.value.kodepropinsidomisili || '35'
      const dKota = form.value.kodekabupatenkotadomisili || ''
      const dKec = form.value.kodekecamatandomisili || ''

      if (dProp) await fetchKotaDom(dProp, dNeg)
      if (dKota) await fetchKecamatanDom(dKota, dProp, dNeg)
      if (dKec) await fetchKelurahanDom(dKec, dKota, dProp, dNeg)
    }
  } catch (err) {
    notifErr(err)
  } finally {
    loadingData.value = false
  }
}

// Bridging BPJS (Cek by NOKA & Cek by NIK)
async function cekBpjsByNoka() {
  if (!form.value.nokabpjs) {
    notifErr({ message: 'Nomor Kartu BPJS belum diisi' })
    return
  }
  loadingBpjsNoka.value = true
  try {
    const tglsep = date.formatDate(Date.now(), 'YYYY-MM-DD')
    const resp = await api.post('v1/simrs/bridgingbpjs/pendaftaran/cekpsertabpjsbynoka', {
      noka: form.value.nokabpjs,
      tglsep
    })

    const peserta = resp?.data?.result?.peserta || resp?.data?.result || resp?.data?.peserta
    if (peserta && peserta.nama) {
      dataPesertaBpjs.value = peserta
      dialogBpjs.value = true
    } else {
      const msg = resp?.data?.metadata?.message || resp?.data?.message || 'Data Peserta BPJS tidak ditemukan'
      notifErr({ message: msg })
    }
  } catch (err) {
    notifErr(err)
  } finally {
    loadingBpjsNoka.value = false
  }
}

async function cekBpjsByNik() {
  if (!form.value.nik || form.value.nik.length !== 16) {
    notifErr({ message: 'NIK harus 16 digit angka' })
    return
  }
  loadingBpjsNik.value = true
  try {
    const tglsep = date.formatDate(Date.now(), 'YYYY-MM-DD')
    const resp = await api.post('v1/simrs/bridgingbpjs/pendaftaran/cekpsertabpjsbynik', {
      nik: form.value.nik,
      tglsep
    })

    const peserta = resp?.data?.result?.peserta || resp?.data?.result || resp?.data?.peserta
    if (peserta && peserta.nama) {
      dataPesertaBpjs.value = peserta
      dialogBpjs.value = true
    } else {
      const msg = resp?.data?.metadata?.message || resp?.data?.message || 'Data Peserta BPJS dengan NIK tersebut tidak ditemukan'
      notifErr({ message: msg })
    }
  } catch (err) {
    notifErr(err)
  } finally {
    loadingBpjsNik.value = false
  }
}

function terapkanDataBpjs() {
  if (!dataPesertaBpjs.value) return
  const p = dataPesertaBpjs.value
  if (p.nama) form.value.nama = p.nama
  if (p.nik) form.value.nik = p.nik
  if (p.noKartu) form.value.nokabpjs = p.noKartu
  if (p.sex === 'L') {
    form.value.kelamin = 'Laki-laki'
    form.value.kodekelamin = 'L'
  } else if (p.sex === 'P') {
    form.value.kelamin = 'Perempuan'
    form.value.kodekelamin = 'P'
  }
  if (p.tglLahir) {
    form.value.tgllahir = p.tglLahir.substring(0, 10)
    const parts = form.value.tgllahir.split('-')
    if (parts.length === 3) {
      tanggal.value.tahun = parts[0]
      tanggal.value.bulan = parts[1]
      tanggal.value.hari = parts[2]
    }
  }
  dialogBpjs.value = false
  notifSuccess({ message: 'Data pasien berhasil disinkronkan dengan data BPJS Kesehatan!' })
}

// Handlers Wilayah KTP (Mengirim semua parameter yang dibutuhkan backend WilayahController)
async function fetchKota(kdProp, kdNeg = '62') {
  if (!kdProp) return
  loadingKota.value = true
  try {
    const res = await api.get('v1/simrs/master/getkotakabupaten', {
      params: { kd_negara: kdNeg, kd_propinsi: kdProp }
    })
    if (res?.data?.[0]) {
      listKota.value = res.data[0]
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingKota.value = false
  }
}

async function fetchKecamatan(kdKota, kdProp = '35', kdNeg = '62') {
  if (!kdKota) return
  loadingKecamatan.value = true
  try {
    const res = await api.get('v1/simrs/master/getkecamatan', {
      params: {
        kd_negara: kdNeg,
        kd_propinsi: kdProp,
        kd_kotakabupaten: kdKota
      }
    })
    if (res?.data?.[0]) {
      listKecamatan.value = res.data[0]
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingKecamatan.value = false
  }
}

async function fetchKelurahan(kdKec, kdKota, kdProp = '35', kdNeg = '62') {
  if (!kdKec) return
  loadingKelurahan.value = true
  try {
    const res = await api.get('v1/simrs/master/getkelurahan', {
      params: {
        kd_negara: kdNeg,
        kd_propinsi: kdProp,
        kd_kotakabupaten: kdKota,
        kd_kecamatan: kdKec
      }
    })
    if (res?.data?.[0]) {
      listKelurahan.value = res.data[0]
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingKelurahan.value = false
  }
}

function onProvinsiSelected(val) {
  form.value.kodepropinsi = val
  const selected = listProvinsi.value.find(p => p.propinsi === val)
  form.value.propinsi = selected ? selected.wilayah : ''
  clearKota()
  if (val) fetchKota(val, form.value.negara)
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

function clearProvinsi() {
  form.value.kodepropinsi = ''
  form.value.propinsi = ''
  clearKota()
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

function onKotaSelected(val) {
  form.value.kodekabupatenkota = val
  const selected = listKota.value.find(k => k.kotakabupaten === val)
  form.value.kabupatenkota = selected ? selected.wilayah : ''
  clearKecamatan()
  if (val) fetchKecamatan(val, form.value.kodepropinsi, form.value.negara)
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

function clearKota() {
  form.value.kodekabupatenkota = ''
  form.value.kabupatenkota = ''
  listKota.value = []
  clearKecamatan()
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

function onKecamatanSelected(val) {
  form.value.kodekecamatan = val
  const selected = listKecamatan.value.find(k => k.kotakabupaten === val)
  form.value.kecamatan = selected ? selected.wilayah : ''
  clearKelurahan()
  if (val) fetchKelurahan(val, form.value.kodekabupatenkota, form.value.kodepropinsi, form.value.negara)
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

function clearKecamatan() {
  form.value.kodekecamatan = ''
  form.value.kecamatan = ''
  listKecamatan.value = []
  clearKelurahan()
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

function onKelurahanSelected(val) {
  form.value.kodekelurahan = val
  const selected = listKelurahan.value.find(k => k.kotakabupaten === val)
  form.value.kelurahan = selected ? selected.wilayah : ''
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

function clearKelurahan() {
  form.value.kodekelurahan = ''
  form.value.kelurahan = ''
  listKelurahan.value = []
  if (isDomisiliSamaKtp.value) syncDomisiliToKtp()
}

// Handlers Wilayah Domisili
async function fetchKotaDom(kdProp, kdNeg = '62') {
  if (!kdProp) return
  loadingKotaDom.value = true
  try {
    const res = await api.get('v1/simrs/master/getkotakabupaten', {
      params: { kd_negara: kdNeg, kd_propinsi: kdProp }
    })
    if (res?.data?.[0]) listKotaDomisili.value = res.data[0]
  } catch (e) {
    console.error(e)
  } finally {
    loadingKotaDom.value = false
  }
}

async function fetchKecamatanDom(kdKota, kdProp = '35', kdNeg = '62') {
  if (!kdKota) return
  loadingKecamatanDom.value = true
  try {
    const res = await api.get('v1/simrs/master/getkecamatan', {
      params: { kd_negara: kdNeg, kd_propinsi: kdProp, kd_kotakabupaten: kdKota }
    })
    if (res?.data?.[0]) listKecamatanDomisili.value = res.data[0]
  } catch (e) {
    console.error(e)
  } finally {
    loadingKecamatanDom.value = false
  }
}

async function fetchKelurahanDom(kdKec, kdKota, kdProp = '35', kdNeg = '62') {
  if (!kdKec) return
  loadingKelurahanDom.value = true
  try {
    const res = await api.get('v1/simrs/master/getkelurahan', {
      params: { kd_negara: kdNeg, kd_propinsi: kdProp, kd_kotakabupaten: kdKota, kd_kecamatan: kdKec }
    })
    if (res?.data?.[0]) listKelurahanDomisili.value = res.data[0]
  } catch (e) {
    console.error(e)
  } finally {
    loadingKelurahanDom.value = false
  }
}

function onProvinsiDomSelected(val) {
  form.value.kodepropinsidomisili = val
  const selected = listProvinsiDomisili.value.find(p => p.propinsi === val)
  form.value.propinsidomisili = selected ? selected.wilayah : ''
  clearKotaDom()
  if (val) fetchKotaDom(val, form.value.negaradomisili)
}

function clearProvinsiDom() {
  form.value.kodepropinsidomisili = ''
  form.value.propinsidomisili = ''
  clearKotaDom()
}

function onKotaDomSelected(val) {
  form.value.kodekabupatenkotadomisili = val
  const selected = listKotaDomisili.value.find(k => k.kotakabupaten === val)
  form.value.kabupatenkotadomisili = selected ? selected.wilayah : ''
  clearKecamatanDom()
  if (val) fetchKecamatanDom(val, form.value.kodepropinsidomisili, form.value.negaradomisili)
}

function clearKotaDom() {
  form.value.kodekabupatenkotadomisili = ''
  form.value.kabupatenkotadomisili = ''
  listKotaDomisili.value = []
  clearKecamatanDom()
}

function onKecamatanDomSelected(val) {
  form.value.kodekecamatandomisili = val
  const selected = listKecamatanDomisili.value.find(k => k.kotakabupaten === val)
  form.value.kecamatandomisili = selected ? selected.wilayah : ''
  clearKelurahanDom()
  if (val) fetchKelurahanDom(val, form.value.kodekabupatenkotadomisili, form.value.kodepropinsidomisili, form.value.negaradomisili)
}

function clearKecamatanDom() {
  form.value.kodekecamatandomisili = ''
  form.value.kecamatandomisili = ''
  listKecamatanDomisili.value = []
  clearKelurahanDom()
}

function onKelurahanDomSelected(val) {
  form.value.kodekelurahandomisili = val
  const selected = listKelurahanDomisili.value.find(k => k.kotakabupaten === val)
  form.value.kelurahandomisili = selected ? selected.wilayah : ''
}

function clearKelurahanDom() {
  form.value.kodekelurahandomisili = ''
  form.value.kelurahandomisili = ''
  listKelurahanDomisili.value = []
}

function onToggleDomisiliSama(val) {
  if (val) {
    syncDomisiliToKtp()
  }
}

function onRtRwChange() {
  if (isDomisiliSamaKtp.value) {
    form.value.rtdomisili = form.value.rt
    form.value.rwdomisili = form.value.rw
  }
}

function onKodePosChange(val) {
  if (isDomisiliSamaKtp.value) {
    form.value.kodeposdomisili = val
  }
}

function onAlamatChange(val) {
  if (isDomisiliSamaKtp.value) {
    form.value.alamatdomisili = val
  }
}

function syncDomisiliToKtp() {
  form.value.negaradomisili = form.value.negara
  form.value.kodepropinsidomisili = form.value.kodepropinsi
  form.value.propinsidomisili = form.value.propinsi
  form.value.kodekabupatenkotadomisili = form.value.kodekabupatenkota
  form.value.kabupatenkotadomisili = form.value.kabupatenkota
  form.value.kodekecamatandomisili = form.value.kodekecamatan
  form.value.kecamatandomisili = form.value.kecamatan
  form.value.kodekelurahandomisili = form.value.kodekelurahan
  form.value.kelurahandomisili = form.value.kelurahan
  form.value.rtdomisili = form.value.rt
  form.value.rwdomisili = form.value.rw
  form.value.kodeposdomisili = form.value.kodepos
  form.value.alamatdomisili = form.value.alamat
}

function onKelaminSelected(val) {
  form.value.kelamin = val
  const item = listKelamin.value.find(k => k.kelamin === val)
  form.value.kodekelamin = item?.kode || (val === 'Laki-laki' ? 'L' : 'P')
}

function onAgamaSelected(val) {
  form.value.agama = val
  const item = listAgama.value.find(a => a.keterangan === val)
  form.value.kodemapagama = item?.kodemapping || item?.kode || ''
}

function onPendidikanSelected(val) {
  form.value.pendidikan = val
  const item = listPendidikan.value.find(p => p.pendidikan === val)
  form.value.kodependidikan = item?.kode || item?.id || ''
}

function formatNomorHp() {
  if (!form.value.noteleponhp) return
  let hp = form.value.noteleponhp.trim()
  if (hp.startsWith('+62')) {
    hp = '0' + hp.substring(3)
  } else if (hp.startsWith('62')) {
    hp = '0' + hp.substring(2)
  }
  form.value.noteleponhp = hp
}

async function simpanData() {
  if (!form.value.norm) {
    notifErr({ message: 'Nomor RM tidak boleh kosong' })
    return
  }
  if (!form.value.nama) {
    notifErr({ message: 'Nama lengkap pasien wajib diisi' })
    activeTab.value = 'identitas'
    return
  }
  if (!form.value.tgllahir) {
    notifErr({ message: 'Tanggal lahir pasien wajib diisi' })
    activeTab.value = 'identitas'
    return
  }

  if (form.value.nik && form.value.nik.length !== 16) {
    notifErr({ message: 'NIK harus berjumlah 16 digit angka' })
    activeTab.value = 'identitas'
    return
  }

  if (isDomisiliSamaKtp.value) {
    syncDomisiliToKtp()
  }

  const payload = {
    ...form.value,
    barulama: 'lama',
    tglmasuk: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
  }

  simpanLoading.value = true
  try {
    const res = await api.post('v1/simrs/master/simpan-pasien', payload)
    if (res?.data?.status === 'success' || res?.status === 200) {
      notifSuccess({ message: `Data master pasien ${form.value.nama} (RM: ${form.value.norm}) berhasil disimpan!` })
      isOpen.value = false
      emit('saved', form.value)
    } else {
      notifSuccess({ message: 'Data master pasien berhasil diperbarui!' })
      isOpen.value = false
      emit('saved', form.value)
    }
  } catch (err) {
    notifErr(err)
  } finally {
    simpanLoading.value = false
  }
}

function tutupDialog() {
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
.edit-master-dialog {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
}

.edit-header-bar {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%);
}

.header-icon-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-radius-12 {
  border-radius: 12px;
}

.border-radius-8 {
  border-radius: 8px;
}

.border-bottom-grey {
  border-bottom: 1px solid #e2e8f0;
}

.border-top-grey {
  border-top: 1px solid #e2e8f0;
}

.font-mono {
  font-family: monospace;
}

.opacity-85 {
  opacity: 0.85;
}

.custom-tabs {
  :deep(.q-tab__label) {
    font-size: 0.88rem;
  }
}
</style>
