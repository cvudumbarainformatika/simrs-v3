<template>
  <div class="column full-height full-width bg-grey-2" style="overflow: hidden;">
    <!-- Patient Header Banner -->
    <div class="bg-dark text-white q-pa-md row items-center justify-between shadow-2">
      <div class="row items-center q-gutter-md">
        <q-avatar size="50px" color="teal" text-color="white" icon="person" />
        <div>
          <div class="text-h6 text-weight-bold row items-center">
            {{ store.selectedPasien?.nama ?? '-' }}
            <q-badge color="teal" class="q-ml-sm text-caption text-weight-bold">
              {{ store.selectedPasien?.norm ?? '-' }}
            </q-badge>
          </div>
          <div class="text-caption text-grey-4 row items-center q-gutter-x-md">
            <span>Noreg: <b class="text-yellow">{{ store.selectedPasien?.noreg ?? '-' }}</b></span>
            <span>|</span>
            <span>Usia: <b>{{ store.selectedPasien?.usia ?? '-' }}</b></span>
            <span>|</span>
            <span>Kelamin: <b>{{ store.selectedPasien?.kelamin === 'L' ? 'Laki-laki' : store.selectedPasien?.kelamin === 'P' ? 'Perempuan' : store.selectedPasien?.kelamin ?? '-' }}</b></span>
          </div>
        </div>
      </div>

      <div class="row items-center q-gutter-md">
        <div class="row q-gutter-md text-right text-caption">
          <div>
            <div>DPJP: <span class="text-yellow text-weight-bold">{{ store.selectedPasien?.dokter ?? '-' }}</span></div>
            <div>Unit/Poli: <span class="text-teal-4 text-weight-bold">{{ store.selectedPasien?.poli ?? store.selectedPasien?.ruangan ?? '-' }}</span></div>
          </div>
          <q-separator dark vertical />
          <div>
            <div>Sistem Bayar: <span class="text-orange text-weight-bold">{{ store.selectedPasien?.sistembayar ?? '-' }}</span></div>
            <div>Status Pasien: <span class="text-grey-4">{{ getStatus(store.selectedPasien?.status) }}</span></div>
          </div>
        </div>
        <q-separator dark vertical />
        <q-btn
          flat
          round
          color="white"
          icon="close"
          size="md"
          @click="store.closeWorkspace()"
        >
          <q-tooltip class="bg-red text-white text-weight-bold">Tutup Workspace</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Main Workspace Layout -->
    <div class="row no-wrap col" style="overflow: hidden; min-height: 0;">
      <!-- Sidebar Navigation -->
      <div class="col-auto bg-white border-right shadow-1 column" style="width: 260px;">
        <q-list padding class="text-grey-8">
          <q-item-label header class="text-weight-bold text-uppercase text-grey-6 f-10">Menu Farmasi Klinis</q-item-label>

          <q-item
            clickable
            v-ripple
            :active="store.activeMenu === 'edukasi'"
            active-class="bg-teal-1 text-teal text-weight-bold"
            @click="setMenu('edukasi')"
          >
            <q-item-section avatar>
              <q-icon name="menu_book" />
            </q-item-section>
            <q-item-section>Edukasi Farmasi</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="store.activeMenu === 'pio'"
            active-class="bg-teal-1 text-teal text-weight-bold"
            @click="setMenu('pio')"
          >
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>Info PIO</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="store.activeMenu === 'meso'"
            active-class="bg-teal-1 text-teal text-weight-bold"
            @click="setMenu('meso')"
          >
            <q-item-section avatar>
              <q-icon name="report_problem" />
            </q-item-section>
            <q-item-section>Monitoring ESO (MESO)</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="store.activeMenu === 'penilaian_obat_luar'"
            active-class="bg-teal-1 text-teal text-weight-bold"
            @click="setMenu('penilaian_obat_luar')"
          >
            <q-item-section avatar>
              <q-icon name="assignment" />
            </q-item-section>
            <q-item-section>Penilaian Obat Luar</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Content Area -->
      <div class="col column bg-grey-1" style="overflow: auto; min-height: 0;">
        <!-- PANEL EDUKASI FARMASI -->
        <div v-if="store.activeMenu === 'edukasi'" class="q-pa-lg">
          <div class="row justify-between items-center q-mb-md print-hide sticky-header">
            <div class="text-h6 text-teal text-weight-bold">Formulir Edukasi Farmasi</div>
            <div class="row q-gutter-sm">
              <q-btn color="dark" icon="print" label="Cetak Edukasi" no-caps @click="cetakEdukasi()" />
              <q-btn color="teal" icon="save" label="Simpan Edukasi" no-caps @click="simpanEdukasi()" />
            </div>
          </div>

          <div id="print-area-edukasi" class="bg-white q-pa-lg shadow-1 border-radius-4">
            <!-- Kop Cetak (Only visible during printing) -->
            <div class="print-only text-center q-mb-md">
              <div class="text-h6 text-weight-bold">FORM EDUKASI FARMASI PASIEN</div>
              <div class="text-subtitle2 text-weight-medium">RSUD DOKTER MOHAMAD SALEH - KOTA PROBOLINGGO</div>
              <q-separator class="q-my-sm" color="black" />
              <!-- Patient Print Summary Info -->
              <div class="row q-col-gutter-sm text-left f-11 q-mb-md">
                <div class="col-6">
                  Nama Pasien: <b>{{ store.selectedPasien?.nama }}</b><br>
                  No RM: <b>{{ store.selectedPasien?.norm }}</b><br>
                  No Reg: <b>{{ store.selectedPasien?.noreg }}</b>
                </div>
                <div class="col-6">
                  Usia / Kelamin: <b>{{ store.selectedPasien?.usia }} / {{ store.selectedPasien?.kelamin }}</b><br>
                  Poli/Ruangan: <b>{{ store.selectedPasien?.poli ?? store.selectedPasien?.ruangan }}</b><br>
                  Sistem Bayar: <b>{{ store.selectedPasien?.sistembayar }}</b>
                </div>
              </div>
            </div>

            <!-- Tanggal Edukasi -->
            <div class="row items-center q-mb-md print-hide">
              <div class="col-12 col-sm-3 text-weight-bold">Tanggal Edukasi :</div>
              <div class="col-12 col-sm-4">
                <app-input-date :model="formEdukasi.tanggal" outlined label="Tanggal Edukasi" @set-model="formEdukasi.tanggal = $event" />
              </div>
            </div>

            <!-- Table of Edukasi Items -->
            <q-markup-table flat bordered class="col" style="min-width: 600px;">
              <thead>
                <tr class="bg-teal text-white">
                  <th style="width: 50px;" class="text-center">No</th>
                  <th style="width: 250px;" class="text-left">Poin Edukasi</th>
                  <th style="width: 120px;" class="text-center">Status Jelaskan</th>
                  <th class="text-left">Keterangan / Catatan Tambahan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in edukasiItems" :key="item.key">
                  <td class="text-center text-weight-bold">{{ index + 1 }}</td>
                  <td class="text-weight-bold text-teal text-left">{{ item.label }}</td>
                  <td class="text-center">
                    <q-checkbox v-model="formEdukasi[item.key + '_chk']" color="teal" />
                  </td>
                  <td>
                    <q-input
                      v-model="formEdukasi[item.key + '_keterangan']"
                      outlined
                      dense
                      type="textarea"
                      rows="2"
                      placeholder="Masukkan catatan free text untuk edukasi ini..."
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <!-- Verifikasi Pemahaman & Tanda Tangan -->
            <div class="row q-col-gutter-lg q-mt-md">
              <div class="col-12 col-md-6 column justify-between">
                <div>
                  <div class="text-weight-bold text-teal q-mb-sm">Verifikasi Pemahaman Pasien / Keluarga :</div>
                  <q-option-group
                    v-model="formEdukasi.pemahaman"
                    :options="[
                      { label: 'Paham sepenuhnya', value: 'paham' },
                      { label: 'Belum Paham / Perlu Edukasi Ulang', value: 'tidak_paham' }
                    ]"
                    color="teal"
                    inline
                  />
                </div>

                <div class="q-mt-md">
                  <div class="text-weight-bold text-teal q-mb-sm">Nama Penerima / Pengambil Obat :</div>
                  <q-input v-model="formEdukasi.penerima" outlined dense placeholder="Masukkan nama keluarga / pengambil obat..." />
                </div>

                <div class="q-mt-md print-hide">
                  <div class="text-weight-bold text-teal q-mb-sm">Nama Petugas Farmasi :</div>
                  <app-autocomplete
                    v-model="formEdukasi.petugas"
                    label="Apoteker / Petugas"
                    autocomplete="nama"
                    option-label="nama"
                    option-value="kdpegsimrs"
                    outlined
                    dense
                    :source="eresepStore.apotekers"
                  />
                </div>
              </div>

              <!-- Signature Component -->
              <div class="col-12 col-md-6 column items-center">
                <div class="text-weight-bold text-teal q-mb-sm align-self-start">Tanda Tangan Penerima / Pengambil Obat :</div>
                <div class="print-hide full-width" style="max-width: 350px;">
                  <app-signature
                    :ttd="formEdukasi.tanda_tangan"
                    @save-ttd="(val) => formEdukasi.tanda_tangan = val"
                    :pasien="store.selectedPasien"
                    uuid="edukasifarmasi"
                    label-ttd="Tanda Tangan Penerima / Pengambil Obat"
                    :width="350"
                    :height="180"
                  />
                </div>
                <!-- Display Signature on Print -->
                <div class="print-only border q-pa-sm text-center" style="width: 250px; height: 120px;">
                  <img v-if="formEdukasi.tanda_tangan" :src="formEdukasi.tanda_tangan" style="max-height: 100px; max-width: 100%; object-fit: contain;" />
                  <div v-else class="text-grey-5 f-10 q-mt-xl">Tidak ada tanda tangan</div>
                </div>
              </div>
            </div>

            <!-- Print Signatures Names -->
            <div class="print-only row justify-between q-mt-xl" style="font-size: 11px;">
              <div class="text-center" style="width: 200px;">
                Petugas Farmasi,<br><br><br><br>
                <u><b>( {{ formEdukasi.petugas || '..................................' }} )</b></u>
              </div>
              <div class="text-center" style="width: 200px;">
                Penerima Edukasi / Obat,<br><br><br><br>
                <u><b>( {{ formEdukasi.penerima || '..................................' }} )</b></u>
              </div>
            </div>
          </div>
        </div>

        <!-- PANEL INFO PIO -->
        <div v-else-if="store.activeMenu === 'pio'" class="q-pa-lg bg-white">
          <InfoPage />
        </div>

        <!-- PANEL MONITORING ESO (MESO) -->
        <div v-if="store.activeMenu === 'meso'" class="q-pa-lg">
          <div class="row justify-between items-center q-mb-md print-hide sticky-header">
            <div class="text-h6 text-teal text-weight-bold">Monitoring Efek Samping Obat (MESO)</div>
            <div class="row q-gutter-sm">
              <q-btn color="dark" icon="print" label="Cetak MESO" no-caps @click="cetakMeso()" />
              <q-btn color="teal" icon="save" label="Simpan MESO" no-caps @click="simpanMeso()" />
            </div>
          </div>

          <div class="bg-white q-pa-lg shadow-1 border-radius-4 column q-gutter-y-md">
            
            <!-- Section 1: Informasi Pelayanan -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">1. Informasi Pelayanan & Pelapor</div>
              <div class="col-12 col-sm-6">
                <div class="text-weight-bold text-teal q-mb-xs">Tanggal Monitoring :</div>
                <app-input-date :model="formMeso.tanggal" outlined label="Tanggal Monitoring" @set-model="formMeso.tanggal = $event" />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-weight-bold text-teal q-mb-xs">Nama Petugas Farmasi :</div>
                <app-autocomplete
                  v-model="formMeso.petugas"
                  label="Apoteker / Petugas"
                  autocomplete="nama"
                  option-label="nama"
                  option-value="kdpegsimrs"
                  outlined
                  dense
                  :source="eresepStore.apotekers"
                />
              </div>
            </div>

            <q-separator />

            <!-- Section 2: Demografi & Kondisi Pasien -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">2. Demografi & Kondisi Pasien</div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="formMeso.detail.bb" label="Berat Badan (kg)" type="number" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="formMeso.detail.suku" label="Suku Bangsa" />
              </div>
              <div class="col-12 col-sm-3">
                <q-input dense outlined v-model="formMeso.detail.pekerjaan" label="Pekerjaan" />
              </div>
              <div class="col-12 col-sm-3 column justify-center" v-if="store.selectedPasien?.kelamin !== 'L'">
                <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Kehamilan:</div>
                <q-option-group
                  v-model="formMeso.detail.kehamilan"
                  :options="[
                    { label: 'Hamil', value: 'hamil' },
                    { label: 'Tidak Hamil', value: 'tidak_hamil' },
                    { label: 'Tidak Tahu', value: 'tidak_tahu' }
                  ]"
                  inline
                  color="teal"
                  dense
                />
              </div>
            </div>

            <q-separator />

            <!-- Section 3: Diagnosis & Penyakit Utama -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">3. Diagnosis & Penyakit Utama</div>
              <div class="col-12">
                <q-input outlined v-model="formMeso.detail.penyakit_utama" label="Penyakit Utama (Diagnosis Utama):" type="textarea" rows="2" />
              </div>
              <div class="col-12 col-sm-6 column justify-center">
                <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Kondisi Penyakit Utama :</div>
                <q-option-group
                  v-model="formMeso.detail.kondisi_penyakit_utama"
                  :options="[
                    { label: 'Sembuh', value: 'sembuh' },
                    { label: 'Sembuh dg Gejala Sisa', value: 'sembuh_gejala_sisa' },
                    { label: 'Belum Sembuh', value: 'belum_sembuh' },
                    { label: 'Meninggal', value: 'meninggal' },
                    { label: 'Tidak Tahu', value: 'tidak_tahu' }
                  ]"
                  inline
                  color="teal"
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Penyakit / Kondisi yang Menyertai :</div>
                <div class="row q-gutter-md items-center">
                  <q-checkbox v-model="formMeso.detail.penyakit_penyerta_chk.gangguan_ginjal" label="Gangguan Ginjal" color="teal" />
                  <q-checkbox v-model="formMeso.detail.penyakit_penyerta_chk.gangguan_hati" label="Gangguan Hati" color="teal" />
                  <q-checkbox v-model="formMeso.detail.penyakit_penyerta_chk.alergi" label="Alergi" color="teal" />
                </div>
                <q-input dense outlined v-model="formMeso.detail.kondisi_lain" label="Kondisi Lain-lain (jika ada):" class="q-mt-sm" />
              </div>
            </div>

            <q-separator />

            <!-- Section 4: Efek Samping Obat (ESO) -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">4. Manifestasi Efek Samping Obat (ESO)</div>
              <div class="col-12">
                <q-input outlined v-model="formMeso.keluhan" label="Bentuk / Manifestasi ESO / Keluhan Lain:" type="textarea" rows="3" placeholder="Deskripsikan dengan detail keluhan efek samping obat yang dialami pasien..." />
              </div>
              <div class="col-12 col-sm-6">
                <q-input outlined v-model="formMeso.detail.mutu_obat" label="Keterangan Mutu / Kualitas Produk Obat (jika ada):" type="textarea" rows="2" />
              </div>
              <div class="col-12 col-sm-6 column justify-center">
                <div class="text-weight-bold f-10 text-grey-7 q-mb-xs">Kesudahan ESO (Outcome):</div>
                <q-option-group
                  v-model="formMeso.detail.kesudahan_eso"
                  :options="[
                    { label: 'Sembuh', value: 'sembuh' },
                    { label: 'Sembuh dg Gejala Sisa', value: 'sembuh_gejala_sisa' },
                    { label: 'Belum Sembuh', value: 'belum_sembuh' },
                    { label: 'Meninggal', value: 'meninggal' },
                    { label: 'Tidak Tahu', value: 'tidak_tahu' }
                  ]"
                  inline
                  color="teal"
                  dense
                  @update:model-value="(val) => formMeso.outcome = val"
                />
              </div>
              <div class="col-12">
                <q-input outlined v-model="formMeso.detail.riwayat_eso" label="Riwayat ESO yang Pernah Dialami Sebelumnya:" type="textarea" rows="2" />
              </div>
            </div>

            <q-separator />

            <!-- Section 5: Tindakan & Data Laboratorium -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">5. Tindakan Medis & Pemeriksaan Lab</div>
              <div class="col-12">
                <q-input outlined v-model="formMeso.tindakan_diambil" label="Tindakan / Penanganan yang Diambil untuk Mengatasi ESO:" type="textarea" rows="2" />
              </div>
              <div class="col-12 col-sm-8">
                <q-input outlined v-model="formMeso.detail.data_lab" label="Data Laboratorium Pendukung (jika ada):" type="textarea" rows="2" />
              </div>
              <div class="col-12 col-sm-4">
                <div class="text-weight-bold text-teal q-mb-xs">Tanggal Pemeriksaan Lab:</div>
                <app-input-date :model="formMeso.detail.tgl_pemeriksaan_lab" outlined label="Tgl Periksa" @set-model="formMeso.detail.tgl_pemeriksaan_lab = $event" />
              </div>
            </div>

            <q-separator />

            <!-- Section 6: Dynamic Medication Table -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">6. Daftar Penggunaan Obat Selama Monitoring</div>
              <div class="col-12">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-caption text-grey-7">Daftar obat yang dikonsumsi pasien, beri tanda ceklis pada kolom **Dicurigai** jika obat tersebut dicurigai pemicu ESO.</div>
                  <q-btn color="teal" icon="add" label="Tambah Baris Obat" no-caps dense class="q-px-sm" @click="tambahObat()" />
                </div>
                <q-markup-table dense flat bordered class="bg-white">
                  <thead>
                    <tr class="bg-teal-1 text-teal text-weight-bold">
                      <th width="3%">No</th>
                      <th width="20%">Nama Obat</th>
                      <th width="10%">Bentuk Sediaan</th>
                      <th width="8%">No. Bets</th>
                      <th width="6%">Dicurigai?</th>
                      <th width="10%">Cara Pemberian</th>
                      <th width="8%">Waktu</th>
                      <th width="8%">Dosis</th>
                      <th width="10%">Tgl Mulai</th>
                      <th width="10%">Tgl Akhir</th>
                      <th width="12%">Indikasi</th>
                      <th width="5%">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(obat, index) in formMeso.detail.penggunaan_obat" :key="index">
                      <td class="text-center">{{ index + 1 }}</td>
                      <td><q-input v-model="obat.nama" dense outlined /></td>
                      <td><q-input v-model="obat.sediaan" dense outlined /></td>
                      <td><q-input v-model="obat.bets" dense outlined /></td>
                      <td class="text-center"><q-checkbox v-model="obat.dicurigai" color="teal" @update:model-value="(val) => { if (val) formMeso.obat_dicurigai = obat.nama }" /></td>
                      <td><q-input v-model="obat.cara" dense outlined /></td>
                      <td><q-input v-model="obat.waktu" dense outlined /></td>
                      <td><q-input v-model="obat.dosis" dense outlined /></td>
                      <td><app-input-date :model="obat.tgl_mulai" outlined label="Mulai" @set-model="obat.tgl_mulai = $event" /></td>
                      <td><app-input-date :model="obat.tgl_akhir" outlined label="Akhir" @set-model="obat.tgl_akhir = $event" /></td>
                      <td><q-input v-model="obat.indikasi" dense outlined /></td>
                      <td class="text-center">
                        <q-btn flat round color="red" icon="delete" size="sm" dense @click="hapusObat(index)" />
                      </td>
                    </tr>
                    <tr v-if="!formMeso.detail.penggunaan_obat?.length">
                      <td colspan="12" class="text-center text-grey-5 q-py-md">Belum ada data obat. Silakan klik tombol **Tambah Baris Obat**.</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </div>

            <q-separator />

            <!-- Section 7: Lain-lain -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">7. Keterangan Tambahan Lain-lain</div>
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="formMeso.detail.kecepatan_eso" label="Kecepatan timbulnya efek samping obat:" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="formMeso.detail.reaksi_dihentikan" label="Reaksi efek samping setelah obat dihentikan:" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input dense outlined v-model="formMeso.detail.pengobatan_eso" label="Tindakan/Pengobatan untuk mengatasi efek samping:" />
              </div>
            </div>

            <q-separator />

            <!-- Section 8: Algoritma Naranjo -->
            <div class="row q-col-gutter-md">
              <div class="col-12 text-subtitle2 text-weight-bold text-teal text-uppercase">8. Algoritma Naranjo (Evaluasi Kausalitas)</div>
              <div class="col-12">
                <q-markup-table dense flat bordered class="bg-white">
                  <thead>
                    <tr class="bg-teal-1 text-teal text-weight-bold">
                      <th width="3%">No</th>
                      <th class="text-left">Pertanyaan Evaluasi</th>
                      <th width="12%">Ya</th>
                      <th width="12%">Tidak</th>
                      <th width="12%">Tidak Tahu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(q, idx) in NaranjoQuestions" :key="q.key">
                      <td class="text-center">{{ idx + 1 }}</td>
                      <td class="text-left text-wrap">{{ q.label }}</td>
                      <td class="text-center">
                        <q-radio v-model="formMeso.detail.naranjo[q.key]" val="Ya" color="teal" />
                      </td>
                      <td class="text-center">
                        <q-radio v-model="formMeso.detail.naranjo[q.key]" val="Tidak" color="teal" />
                      </td>
                      <td class="text-center">
                        <q-radio v-model="formMeso.detail.naranjo[q.key]" val="Tidak Tahu" color="teal" />
                      </td>
                    </tr>
                    <tr class="bg-grey-2">
                      <td colspan="2" class="text-right text-weight-bold">TOTAL SKOR NARANJO :</td>
                      <td colspan="3" class="text-center text-h6 text-teal text-weight-bold">{{ naranjoScore }}</td>
                    </tr>
                    <tr class="bg-grey-3">
                      <td colspan="2" class="text-right text-weight-bold">HASIL EVALUASI (KAUSALITAS):</td>
                      <td colspan="3" class="text-center text-weight-bold text-uppercase">
                        <q-badge :color="naranjoScore >= 9 ? 'red' : naranjoScore >= 5 ? 'amber-9' : naranjoScore >= 1 ? 'teal' : 'grey-7'" class="q-px-md q-py-xs text-subtitle2">
                          {{ hasilEvaluasi }} (Skor: {{ naranjoScore }})
                        </q-badge>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </div>

          </div>
        </div>

        <!-- PANEL PENILAIAN OBAT LUAR -->
        <div v-if="store.activeMenu === 'penilaian_obat_luar'" class="q-pa-lg">
          <PenilaianObatLuarPanel :pasien="store.selectedPasien" :apotekers="eresepStore.apotekers" />
        </div>
      </div>
    </div>

    <!-- Dialog Cetak/Dokumen Edukasi -->
    <CetakEdukasiDialog v-model="isOpenCetakEdukasi" :pasien="store.selectedPasien" :form="formEdukasi" :apotekers="eresepStore.apotekers" />

    <!-- Dialog Cetak/Dokumen MESO -->
    <CetakMesoDialog v-model="isOpenCetakMeso" :pasien="store.selectedPasien" :form="formMeso" :apotekers="eresepStore.apotekers" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineAsyncComponent, nextTick, computed, watch } from 'vue'
import { api } from 'src/boot/axios'
import { useKunjunganPasienDepoStore } from 'src/stores/simrs/farmasi/kunjungan/kunjunganPasien'
import { useEResepDepoFarmasiStore } from 'src/stores/simrs/farmasi/eresep/eresep'
import { dateFullFormat } from 'src/modules/formatter'
import { useQuasar } from 'quasar'

const InfoPage = defineAsyncComponent(() => import('../../eresep/comp/InfoPage.vue'))
const CetakEdukasiDialog = defineAsyncComponent(() => import('./CetakEdukasiDialog.vue'))
const CetakMesoDialog = defineAsyncComponent(() => import('./CetakMesoDialog.vue'))
const PenilaianObatLuarPanel = defineAsyncComponent(() => import('./PenilaianObatLuarPanel.vue'))

const store = useKunjunganPasienDepoStore()
const eresepStore = useEResepDepoFarmasiStore()
const $q = useQuasar()

const isOpenCetakEdukasi = ref(false)
const isOpenCetakMeso = ref(false)

// Form States
const formEdukasi = reactive({
  tanggal: new Date().toISOString().substring(0, 10),
  indikasi_chk: false,
  indikasi_keterangan: '',
  aturan_chk: false,
  aturan_keterangan: '',
  antibiotik_chk: false,
  antibiotik_keterangan: '',
  penyimpanan_chk: false,
  penyimpanan_keterangan: '',
  jangka_chk: false,
  jangka_keterangan: '',
  interaksi_chk: false,
  interaksi_keterangan: '',
  efek_samping_chk: false,
  efek_samping_keterangan: '',
  pemahaman: 'paham',
  penerima: '',
  tanda_tangan: '',
  petugas: ''
})

const formMeso = reactive({
  tanggal: new Date().toISOString().substring(0, 10),
  keluhan: '',
  obat_dicurigai: '',
  tindakan_diambil: '',
  outcome: '',
  petugas: '',
  detail: {
    bb: '',
    suku: '',
    pekerjaan: '',
    kehamilan: 'tidak_hamil',
    penyakit_utama: '',
    penyakit_penyerta_chk: {
      gangguan_ginjal: false,
      gangguan_hati: false,
      alergi: false
    },
    kondisi_lain: '',
    kondisi_penyakit_utama: 'sembuh',
    mutu_obat: '',
    kesudahan_eso: 'sembuh',
    riwayat_eso: '',
    data_lab: '',
    tgl_pemeriksaan_lab: '',
    penggunaan_obat: [],
    kecepatan_eso: '',
    reaksi_dihentikan: '',
    pengobatan_eso: '',
    naranjo: {
      q1: 'Tidak Tahu',
      q2: 'Tidak Tahu',
      q3: 'Tidak Tahu',
      q4: 'Tidak Tahu',
      q5: 'Tidak Tahu',
      q6: 'Tidak Tahu',
      q7: 'Tidak Tahu',
      q8: 'Tidak Tahu',
      q9: 'Tidak Tahu',
      q10: 'Tidak Tahu'
    },
    hasil_evaluasi: 'Meragukan'
  }
})

const NaranjoQuestions = [
  { key: 'q1', label: 'Apakah terdapat laporan lengkap tentang reaksi tersebut sebelumnya?' },
  { key: 'q2', label: 'Apakah kejadian yang tidak dikehendaki muncul setelah obat yang dicurigai digunakan?' },
  { key: 'q3', label: 'Apakah ROTD membaik ketika obat dihentikan atau setelah pemberian suatu antagonis yang spesifik?' },
  { key: 'q4', label: 'Apakah ROTD muncul kembali setelah obatnya digunakan kembali?' },
  { key: 'q5', label: 'Adakah penyebab lain yang dapat menyebabkan reaksi dengan sendirinya?' },
  { key: 'q6', label: 'Apakah reaksi muncul kembali setelah pemberian plasebo?' },
  { key: 'q7', label: 'Apakah kadar obat dalam darah berada dalam rentang yang dianggap toksik?' },
  { key: 'q8', label: 'Apakah reaksi menjadi lebih parah ketika dosis ditingkatkan atau menjadi kurang parah ketika dosis diturunkan?' },
  { key: 'q9', label: 'Apakah pasien memiliki reaksi serupa terhadap obat-obatan yang sama atau serupa pada paparan sebelumnya?' },
  { key: 'q10', label: 'Apakah ROTD telah dipastikan dengan suatu bukti yang objektif? (misal: hasil uji laboratorium, dsb)?' }
]

const naranjoScore = computed(() => {
  const n = formMeso.detail?.naranjo
  if (!n) return 0
  let score = 0

  if (n.q1 === 'Ya') score += 1
  if (n.q2 === 'Ya') score += 2; else if (n.q2 === 'Tidak') score -= 1
  if (n.q3 === 'Ya') score += 1; else if (n.q3 === 'Tidak') score -= 1
  if (n.q4 === 'Ya') score += 2; else if (n.q4 === 'Tidak') score -= 1
  if (n.q5 === 'Ya') score -= 1; else if (n.q5 === 'Tidak') score += 2
  if (n.q6 === 'Ya') score -= 1
  if (n.q7 === 'Ya') score += 1
  if (n.q8 === 'Ya') score += 1
  if (n.q9 === 'Ya') score += 1
  if (n.q10 === 'Ya') score += 1

  return score
})

const hasilEvaluasi = computed(() => {
  const s = naranjoScore.value
  if (s >= 9) return 'Pasti'
  if (s >= 5 && s <= 8) return 'Lebih Mungkin'
  if (s >= 1 && s <= 4) return 'Mungkin'
  return 'Meragukan'
})

watch(hasilEvaluasi, (newVal) => {
  if (formMeso.detail) {
    formMeso.detail.hasil_evaluasi = newVal
  }
}, { immediate: true })

const tambahObat = () => {
  if (!formMeso.detail.penggunaan_obat) {
    formMeso.detail.penggunaan_obat = []
  }
  formMeso.detail.penggunaan_obat.push({
    nama: '',
    sediaan: '',
    bets: '',
    dicurigai: false,
    cara: '',
    waktu: '',
    dosis: '',
    tgl_mulai: '',
    tgl_akhir: '',
    indikasi: ''
  })
}

const hapusObat = (index) => {
  if (formMeso.detail.penggunaan_obat) {
    formMeso.detail.penggunaan_obat.splice(index, 1)
  }
}

const resetMesoDetail = () => {
  formMeso.detail = {
    bb: '',
    suku: '',
    pekerjaan: '',
    kehamilan: 'tidak_hamil',
    penyakit_utama: '',
    penyakit_penyerta_chk: {
      gangguan_ginjal: false,
      gangguan_hati: false,
      alergi: false
    },
    kondisi_lain: '',
    kondisi_penyakit_utama: 'sembuh',
    mutu_obat: '',
    kesudahan_eso: 'sembuh',
    riwayat_eso: '',
    data_lab: '',
    tgl_pemeriksaan_lab: '',
    penggunaan_obat: [],
    kecepatan_eso: '',
    reaksi_dihentikan: '',
    pengobatan_eso: '',
    naranjo: {
      q1: 'Tidak Tahu',
      q2: 'Tidak Tahu',
      q3: 'Tidak Tahu',
      q4: 'Tidak Tahu',
      q5: 'Tidak Tahu',
      q6: 'Tidak Tahu',
      q7: 'Tidak Tahu',
      q8: 'Tidak Tahu',
      q9: 'Tidak Tahu',
      q10: 'Tidak Tahu'
    },
    hasil_evaluasi: 'Meragukan'
  }
}

const edukasiItems = [
  { key: 'indikasi', label: 'Indikasi / Kegunaan Obat' },
  { key: 'aturan', label: 'Aturan & Cara Pakai Obat' },
  { key: 'antibiotik', label: 'Aturan Khusus Antibiotik' },
  { key: 'penyimpanan', label: 'Cara Penyimpanan & Stabilitas Obat' },
  { key: 'jangka', label: 'Jangka Waktu Pemakaian Obat' },
  { key: 'interaksi', label: 'Potensi Interaksi Obat' },
  { key: 'efek_samping', label: 'Potensi Efek Samping Obat' }
]

function getStatus(val) {
  if (val === '') return 'BELUM TERLAYANI'
  if (val === '1') return 'TERLAYANI'
  if (val === '2') return 'SUDAH DITERIMA'
  return 'TIDAK HADIR'
}

function setMenu(val) {
  store.activeMenu = val
  if (val === 'pio') {
    eresepStore.setInfo(store.selectedPasien)
  } else if (val === 'edukasi') {
    loadEdukasi()
  } else if (val === 'meso') {
    loadMeso()
  } else if (val === 'penilaian_obat_luar') {
    // Handled in subcomponent PenilaianObatLuarPanel
  }
}

// Loading Data from Backend
async function loadEdukasi() {
  try {
    const resp = await api.get('v1/simrs/farmasinew/depo/get-edukasi-farmasi', {
      params: { norm: store.selectedPasien?.norm, noreg: store.selectedPasien?.noreg }
    })
    if (resp.data) {
      Object.assign(formEdukasi, resp.data)
      // Parse database chk values to boolean
      edukasiItems.forEach(item => {
        formEdukasi[item.key + '_chk'] = !!resp.data[item.key + '_chk']
      })
      if (resp.data.tanggal) {
        formEdukasi.tanggal = resp.data.tanggal.substring(0, 10)
      }
    } else {
      resetEdukasiForm()
    }
  } catch (err) {
    console.error('Failed to load edukasi data', err)
  }
}

function resetEdukasiForm() {
  formEdukasi.indikasi_chk = false
  formEdukasi.indikasi_keterangan = ''
  formEdukasi.aturan_chk = false
  formEdukasi.aturan_keterangan = ''
  formEdukasi.antibiotik_chk = false
  formEdukasi.antibiotik_keterangan = ''
  formEdukasi.penyimpanan_chk = false
  formEdukasi.penyimpanan_keterangan = ''
  formEdukasi.jangka_chk = false
  formEdukasi.jangka_keterangan = ''
  formEdukasi.interaksi_chk = false
  formEdukasi.interaksi_keterangan = ''
  formEdukasi.efek_samping_chk = false
  formEdukasi.efek_samping_keterangan = ''
  formEdukasi.pemahaman = 'paham'
  formEdukasi.penerima = ''
  formEdukasi.tanda_tangan = ''
  formEdukasi.petugas = localStorage.getItem('nama_petugas') ?? ''
}

async function loadMeso() {
  try {
    const resp = await api.get('v1/simrs/farmasinew/depo/get-meso', {
      params: { norm: store.selectedPasien?.norm, noreg: store.selectedPasien?.noreg }
    })
    if (resp.data) {
      Object.assign(formMeso, resp.data)
      if (resp.data.tanggal) {
        formMeso.tanggal = resp.data.tanggal.substring(0, 10)
      }
      if (resp.data.detail) {
        if (typeof resp.data.detail === 'string') {
          formMeso.detail = JSON.parse(resp.data.detail)
        } else {
          formMeso.detail = { ...formMeso.detail, ...resp.data.detail }
        }
      } else {
        resetMesoDetail()
      }
    } else {
      resetMesoForm()
    }
  } catch (err) {
    console.error('Failed to load meso data', err)
  }
}

function resetMesoForm() {
  formMeso.keluhan = ''
  formMeso.obat_dicurigai = ''
  formMeso.tindakan_diambil = ''
  formMeso.outcome = ''
  formMeso.petugas = localStorage.getItem('nama_petugas') ?? ''
  resetMesoDetail()
}

// Saving Data to Backend
async function simpanEdukasi() {
  const payload = {
    ...formEdukasi,
    norm: store.selectedPasien?.norm,
    noreg: store.selectedPasien?.noreg,
    // Convert boolean checkmarks to 1 or 0 for MySQL
    indikasi_chk: formEdukasi.indikasi_chk ? 1 : 0,
    aturan_chk: formEdukasi.aturan_chk ? 1 : 0,
    antibiotik_chk: formEdukasi.antibiotik_chk ? 1 : 0,
    penyimpanan_chk: formEdukasi.penyimpanan_chk ? 1 : 0,
    jangka_chk: formEdukasi.jangka_chk ? 1 : 0,
    interaksi_chk: formEdukasi.interaksi_chk ? 1 : 0,
    efek_samping_chk: formEdukasi.efek_samping_chk ? 1 : 0
  }

  // Save the pharmacist name locally for convenience
  if (formEdukasi.petugas) {
    localStorage.setItem('nama_petugas', formEdukasi.petugas)
  }

  $q.loading.show({ message: 'Menyimpan data edukasi...' })
  try {
    const resp = await api.post('v1/simrs/farmasinew/depo/simpan-edukasi-farmasi', payload)
    $q.notify({ type: 'positive', message: resp.data?.message || 'Edukasi farmasi berhasil disimpan!' })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal menyimpan data edukasi' })
  } finally {
    $q.loading.hide()
  }
}

async function simpanMeso() {
  const payload = {
    ...formMeso,
    norm: store.selectedPasien?.norm,
    noreg: store.selectedPasien?.noreg
  }

  if (formMeso.petugas) {
    localStorage.setItem('nama_petugas', formMeso.petugas)
  }

  $q.loading.show({ message: 'Menyimpan data MESO...' })
  try {
    const resp = await api.post('v1/simrs/farmasinew/depo/simpan-meso', payload)
    $q.notify({ type: 'positive', message: resp.data?.message || 'Monitoring ESO berhasil disimpan!' })
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal menyimpan data MESO' })
  } finally {
    $q.loading.hide()
  }
}

// Print Handler Functionalities
function cetakEdukasi() {
  isOpenCetakEdukasi.value = true
}

function cetakMeso() {
  isOpenCetakMeso.value = true
}

onMounted(() => {
  eresepStore.getApoteker()
  setMenu('edukasi')
})
</script>

<style scoped>
.border-right {
  border-right: 1px solid #e0e0e0;
}
.border-radius-4 {
  border-radius: 4px;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f5f5; /* matches bg-grey-1 */
  margin-top: -24px;
  padding-top: 24px;
  padding-bottom: 16px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .print-only, .print-only * {
    visibility: visible;
  }
  #print-area-edukasi, #print-area-edukasi * {
    visibility: visible;
  }
  #print-area-meso, #print-area-meso * {
    visibility: visible;
  }
  .print-hide {
    display: none !important;
  }
  #print-area-edukasi, #print-area-meso {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
