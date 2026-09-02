<template>
  <div class="fit column relative-position bg-grey-2">
    <!-- Header Toolbar -->
    <div class="col-auto bg-primary text-white q-px-md q-py-sm shadow-2">
      <div class="row justify-between items-center">
        <div class="text-subtitle1 text-weight-bold row items-center q-gutter-x-sm">
          <q-avatar size="32px" color="white" text-color="primary" icon="icon-mat-coronavirus" />
          <div>
            <div class="lh-1 text-weight-bold">Asesmen Penyakit Menular & Imunosupresed</div>
            <div class="text-caption text-blue-2" style="font-size: 11px;">Pengkajian Risiko Penularan Daya Tahan Tubuh Pasien</div>
          </div>
        </div>
        <div>
          <q-btn rounded unelevated color="positive" class="q-px-md shadow-1" :loading="store.loading" @click="bukaForm">
            <q-icon name="icon-mat-add" size="xs" />
            <span class="q-ml-xs text-weight-bold">Tambah Asesmen Baru</span>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- List Data Riwayat -->
    <div class="col q-pa-md scroll relative-position">
      <div v-if="!items.length" class="fit flex flex-center bg-white rounded-borders shadow-1"
        style="border: 2px dashed #cfd8dc; min-height: 380px;">
        <div class="text-center q-pa-lg">
          <q-avatar size="90px" color="blue-1" text-color="primary" class="q-mb-md">
            <q-icon name="icon-mat-coronavirus" size="50px" />
          </q-avatar>
          <div class="text-h6 text-weight-bold text-grey-8">Belum Ada Riwayat Asesmen</div>
          <div class="text-subtitle2 text-grey-6 q-mt-xs q-mb-md" style="max-width: 400px;">
            Belum ada catatan pengkajian penyakit menular & imunosupresed untuk pasien ini.
          </div>
          <q-btn rounded unelevated color="primary" icon="icon-mat-add" label="Buat Asesmen Sekarang" class="q-px-lg" @click="bukaForm" />
        </div>
      </div>

      <div v-else class="q-gutter-y-md">
        <q-card v-for="(item, idx) in items" :key="item.id || idx" flat bordered class="shadow-1 rounded-borders overflow-hidden bg-white">
          <q-list class="rounded-borders">
            <q-expansion-item default-opened header-class="bg-blue-grey-1 text-blue-grey-10">
              <template #header>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="38px" class="text-weight-bold shadow-1">
                    {{ item.petugas ? item.petugas.slice(0, 2).toUpperCase() : 'P' }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <div class="row items-center q-gutter-x-sm">
                    <span class="text-weight-bold text-subtitle1 text-dark">{{ item.petugas || item.user?.nama || 'Petugas Medis' }}</span>
                    <q-badge color="blue-1" text-color="primary" class="text-weight-bold q-px-sm">PPA / Pengkaji</q-badge>
                  </div>
                  <div class="text-caption text-grey-7 flex items-center q-gutter-x-xs q-mt-xs">
                    <q-icon name="icon-mat-event" size="14px" color="primary" />
                    <span>{{ dateFullFormat(item.tanggal || item.created_at) }}</span>
                    <span class="q-mx-xs">•</span>
                    <q-icon name="icon-mat-schedule" size="14px" color="primary" />
                    <span>Pukul {{ jamTnpDetik(item.tanggal || item.created_at) }} WIB</span>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-x-sm">
                    <q-btn v-if="String(currentUserPegawai) === String(item.kdpegsimrs) || currentUserPegawai === 'sa'"
                      outline round dense color="primary" icon="icon-mat-edit" size="sm" @click.stop="bukaEdit(item)">
                      <q-tooltip class="bg-primary">Edit Data</q-tooltip>
                    </q-btn>
                    <q-btn v-if="String(currentUserPegawai) === String(item.kdpegsimrs) || currentUserPegawai === 'sa'"
                      outline round dense color="negative" icon="icon-mat-delete" size="sm" @click.stop="hapusItem(item)">
                      <q-tooltip class="bg-negative">Hapus Data</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </template>

              <q-separator />

              <q-card-section class="bg-grey-1 q-pa-md">
                <div class="row q-col-gutter-md">
                  <!-- Section A Display Card -->
                  <div class="col-12 col-md-6">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-primary text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center justify-between">
                        <div class="flex items-center q-gutter-x-xs">
                          <q-icon name="icon-mat-warning" size="18px" />
                          <span>A. PENYAKIT MENULAR</span>
                        </div>
                        <q-badge color="white" text-color="primary" class="text-weight-bold">
                          Diag: {{ item.diagnosis || '-' }}
                        </q-badge>
                      </div>
                      <q-card-section class="q-pa-md text-caption text-grey-9">
                        <div class="grid-details q-gutter-y-xs">
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Status Diagnosis:</span> <span class="col-7 text-weight-bold text-uppercase">{{ item.status_diag }} {{ item.status_diag === 'lama' ? '(' + item.lama_sejak + ')' : '' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Pasien Mengetahui:</span> <span class="col-7 text-weight-bold">{{ item.tahu_penyakit === 'tahu' ? 'Ya (Mengetahui)' : 'Tidak' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Sumber Informasi:</span> <span class="col-7 text-weight-bold text-capitalize">{{ item.sumber_info }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Info Jangka Waktu:</span> <span class="col-7 text-weight-bold">{{ item.info_jangka === 'ya' ? 'Ya (' + item.durasi_pengobatan + ')' : 'Tidak' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Pemeriksaan Rutin:</span> <span class="col-7 text-weight-bold">{{ item.pemeriksaan_rutin === 'ya' ? 'Ya (di ' + item.tempat_rutin + ')' : 'Tidak' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Cara Penularan:</span> <span class="col-7 text-weight-bold text-primary">{{ (item.cara_penularan || []).join(', ') || '-' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Ruang Isolasi Negatif:</span> <span class="col-7 text-weight-bold text-negative">{{ item.ruang_isolasi }} {{ item.ruang_isolasi_ket ? '(' + item.ruang_isolasi_ket + ')' : '' }} {{ item.rujuk_ke ? '→ Rujukan: ' + item.rujuk_ke : '' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Penggunaan APD:</span> <span class="col-7 text-weight-bold">{{ (item.apd || []).join(', ') || 'Tidak Pakai APD' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Penyakit Penyerta:</span> <span class="col-7 text-weight-bold">{{ item.penyakit_penyerta === 'ya' ? 'Ya (' + item.ket_penyakit_penyerta + ')' : 'Tidak Ada' }}</span></div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- Section B Display Card -->
                  <div class="col-12 col-md-6">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-teal text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center justify-between">
                        <div class="flex items-center q-gutter-x-xs">
                          <q-icon name="icon-mat-shield" size="18px" />
                          <span>B. IMUNOSUPRESED (DAYA TAHAN TUBUH)</span>
                        </div>
                      </div>
                      <q-card-section class="q-pa-md text-caption text-grey-9">
                        <div class="grid-details q-gutter-y-xs">
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Pasien Mengetahui:</span> <span class="col-7 text-weight-bold">{{ item.b_tahu_penyakit === 'tahu' ? 'Ya (Mengetahui)' : 'Tidak' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Sumber Informasi:</span> <span class="col-7 text-weight-bold text-capitalize">{{ item.b_sumber_info }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Info Jangka Waktu:</span> <span class="col-7 text-weight-bold">{{ item.b_info_jangka === 'ya' ? 'Ya (' + item.b_durasi_pengobatan + ')' : 'Tidak' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Pemeriksaan Rutin:</span> <span class="col-7 text-weight-bold">{{ item.b_pemeriksaan_rutin === 'ya' ? 'Ya (di ' + item.b_tempat_rutin + ')' : 'Tidak' }}</span></div>
                          <div class="row"><span class="col-5 text-grey-7 font-medium">Dirawat Terpisah:</span> <span class="col-7 text-weight-bold text-teal-9">{{ item.b_dirawat_terpisah === 'ya' ? 'Ya (di ' + item.b_tempat_terpisah + ')' : 'Tidak' }}</span></div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- Section C & D Display -->
                  <div class="col-12">
                    <q-card flat bordered class="bg-white rounded-borders shadow-xs">
                      <q-card-section class="q-pa-md">
                        <div class="row q-col-gutter-md">
                          <div class="col-12 col-md-6">
                            <div class="text-subtitle2 text-weight-bold text-grey-9 flex items-center q-mb-xs">
                              <q-icon name="icon-mat-analytics" color="primary" class="q-mr-xs" />
                              <span>C. Analisa Masalah</span>
                            </div>
                            <div class="text-caption text-grey-9 bg-blue-1 q-pa-sm rounded-borders border-blue-2" style="white-space: pre-line; min-height: 60px;">
                              {{ item.analisa_masalah || 'Tidak ada catatan analisa masalah.' }}
                            </div>
                          </div>
                          <div class="col-12 col-md-6">
                            <div class="text-subtitle2 text-weight-bold text-grey-9 flex items-center q-mb-xs">
                              <q-icon name="icon-mat-medical_services" color="positive" class="q-mr-xs" />
                              <span>D. Tindakan Pelayanan</span>
                            </div>
                            <div class="text-caption text-grey-9 bg-green-1 q-pa-sm rounded-borders border-green-2" style="white-space: pre-line; min-height: 60px;">
                              {{ item.tindakan || 'Tidak ada catatan tindakan.' }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- DIALOG FORM INPUT ELEGAN -->
    <q-dialog v-model="dialogOpen" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-3 column fit">
        <!-- Header Dialog Pro -->
        <q-card-section class="bg-primary text-white col-auto q-py-sm q-px-lg shadow-3">
          <div class="row justify-between items-center">
            <div class="row items-center q-gutter-x-sm">
              <q-avatar size="36px" color="white" text-color="primary" icon="icon-mat-assignment" class="shadow-1" />
              <div>
                <div class="text-subtitle1 text-weight-bold lh-1">Form Pengkajian Khusus Penyakit Menular & Imunosupresed</div>
                <div class="text-caption text-blue-2" style="font-size: 11px;">Lembar Penilaian Risiko Penularan Daya Tahan Tubuh</div>
              </div>
            </div>
            <q-btn flat round dense icon="icon-mat-close" color="white" v-close-popup size="md" />
          </div>
        </q-card-section>

        <!-- Dynamic Header Badge Info Pasien -->
        <div class="bg-white col-auto q-px-lg q-py-sm shadow-1 border-bottom">
          <div class="row items-center justify-between">
            <div class="row items-center q-gutter-x-md">
              <q-chip icon="icon-mat-badge" color="blue-1" text-color="primary" class="text-weight-bold" dense>
                RM: {{ pasien?.norm || '-' }}
              </q-chip>
              <div class="text-subtitle2 text-weight-bold text-dark">
                {{ pasien?.nama_panggil || pasien?.nama }}
              </div>
              <div class="text-caption text-grey-7">
                ({{ pasien?.kelamin === 'L' || pasien?.kelamin === 'Laki-Laki' ? 'Laki-Laki' : 'Perempuan' }}, {{ pasien?.usia || '-' }})
              </div>
            </div>
            <div class="row items-center q-gutter-x-sm">
              <q-badge color="grey-3" text-color="grey-9" class="q-px-sm q-py-xs text-weight-medium">
                Ruangan: {{ pasien?.ruangan || pasien?.kamar || '-' }}
              </q-badge>
              <q-badge color="primary" class="q-px-sm q-py-xs text-weight-bold">
                No Reg: {{ pasien?.noreg || '-' }}
              </q-badge>
            </div>
          </div>
        </div>

        <!-- Form Body Scrollable with Grid Layout -->
        <q-card-section class="col scroll q-pa-lg">
          <div class="max-width-container mx-auto">
            <q-form ref="formRef" @submit="onSubmit" class="q-gutter-y-lg">
              
              <!-- CARD SECTION A: PENYAKIT MENULAR -->
              <q-card flat class="rounded-borders shadow-1 bg-white overflow-hidden">
                <div class="bg-primary text-white q-px-lg q-py-sm flex items-center justify-between">
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-coronavirus" size="20px" />
                    <span class="text-subtitle1 text-weight-bold">A. Penyakit Menular</span>
                  </div>
                  <span class="text-caption text-blue-2 font-medium">Skrining Gejala & Risiko Transmisi</span>
                </div>

                <q-card-section class="q-pa-lg">
                  <div class="row q-col-gutter-md">
                    <!-- Diagnosis Utama -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Diagnosis Penyakit Menular</div>
                      <q-input v-model="form.diagnosis" placeholder="Masukkan nama diagnosis (misal: TB Paru, Hepatitis B, COVID-19)" outlined dense stack-label color="primary" class="bg-grey-1" />
                    </div>

                    <!-- Status Diagnosis -->
                    <div class="col-12 col-md-3">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Status Diagnosis</div>
                      <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-around" style="height: 40px;">
                        <q-radio v-model="form.status_diag" val="baru" label="Baru" dense color="primary" />
                        <q-radio v-model="form.status_diag" val="lama" label="Lama" dense color="primary" />
                      </div>
                    </div>

                    <!-- Sejak Kapan jika Lama -->
                    <div class="col-12 col-md-3" v-if="form.status_diag === 'lama'">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Ditegakkan Sejak</div>
                      <q-input v-model="form.lama_sejak" placeholder="Misal: 6 Bulan / 2 Tahun lalu" outlined dense stack-label color="primary" class="bg-grey-1" />
                    </div>

                    <div class="col-12"><q-separator class="q-my-xs" /></div>

                    <!-- Pasien Mengetahui Penyakit -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Pasien Mengetahui Penyakit Saat Ini?</div>
                      <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center q-gutter-x-lg" style="height: 40px;">
                        <q-radio v-model="form.tahu_penyakit" val="tahu" label="Ya, Mengetahui" dense color="primary" class="q-ml-sm" />
                        <q-radio v-model="form.tahu_penyakit" val="tidak" label="Tidak Mengetahui" dense color="primary" />
                      </div>
                    </div>

                    <!-- Sumber Informasi -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Sumber Informasi Diperoleh Dari</div>
                      <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center q-gutter-x-md" style="height: 40px;">
                        <q-radio v-model="form.sumber_info" val="dokter" label="Dokter" dense color="primary" class="q-ml-xs" />
                        <q-radio v-model="form.sumber_info" val="perawat" label="Perawat" dense color="primary" />
                        <q-radio v-model="form.sumber_info" val="keluarga" label="Keluarga" dense color="primary" />
                        <q-radio v-model="form.sumber_info" val="lain-lain" label="Lain-lain" dense color="primary" />
                      </div>
                    </div>

                    <!-- Menerima Informasi Jangka Waktu -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Menerima Informasi Jangka Waktu Pengobatan?</div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-around" style="height: 40px;">
                            <q-radio v-model="form.info_jangka" val="tidak" label="Tidak" dense color="primary" />
                            <q-radio v-model="form.info_jangka" val="ya" label="Ya" dense color="primary" />
                          </div>
                        </div>
                        <div class="col-6" v-if="form.info_jangka === 'ya'">
                          <q-input v-model="form.durasi_pengobatan" placeholder="Misal: 6 Bulan" outlined dense stack-label color="primary" class="bg-grey-1" />
                        </div>
                      </div>
                    </div>

                    <!-- Melakukan Pemeriksaan Rutin -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Melakukan Pemeriksaan Rutin?</div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-around" style="height: 40px;">
                            <q-radio v-model="form.pemeriksaan_rutin" val="tidak" label="Tidak" dense color="primary" />
                            <q-radio v-model="form.pemeriksaan_rutin" val="ya" label="Ya" dense color="primary" />
                          </div>
                        </div>
                        <div class="col-6" v-if="form.pemeriksaan_rutin === 'ya'">
                          <q-input v-model="form.tempat_rutin" placeholder="Nama faskes / RS" outlined dense stack-label color="primary" class="bg-grey-1" />
                        </div>
                      </div>
                    </div>

                    <div class="col-12"><q-separator class="q-my-xs" /></div>

                    <!-- Cara Penularan Checkboxes -->
                    <div class="col-12">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Cara Penularan (Transmisi)</div>
                      <div class="q-pa-sm border-grey rounded-borders bg-grey-1 row q-col-gutter-sm">
                        <div class="col-6 col-sm-3">
                          <q-checkbox v-model="form.cara_penularan" val="airborne" label="Airborne (Udara)" dense color="primary" class="text-weight-medium" />
                        </div>
                        <div class="col-6 col-sm-3">
                          <q-checkbox v-model="form.cara_penularan" val="droplet" label="Droplet (Percikan)" dense color="primary" class="text-weight-medium" />
                        </div>
                        <div class="col-6 col-sm-3">
                          <q-checkbox v-model="form.cara_penularan" val="kontak langsung" label="Kontak Langsung" dense color="primary" class="text-weight-medium" />
                        </div>
                        <div class="col-6 col-sm-3">
                          <q-checkbox v-model="form.cara_penularan" val="cairan tubuh" label="Cairan Tubuh" dense color="primary" class="text-weight-medium" />
                        </div>
                      </div>
                    </div>

                    <!-- Ruang Isolasi -->
                    <div class="col-12">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Dirawat Di Ruang Isolasi Bertekanan Negatif / Khusus</div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-8">
                          <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-between" style="min-height: 40px;">
                            <q-radio v-model="form.ruang_isolasi" val="ya" label="Ya" dense color="primary" class="q-ml-xs" />
                            <q-radio v-model="form.ruang_isolasi" val="tidak" label="Tidak" dense color="primary" />
                            <q-radio v-model="form.ruang_isolasi" val="kohorting" label="Kohorting" dense color="primary" />
                            <q-radio v-model="form.ruang_isolasi" val="ruang tersendiri" label="Ruang Tersendiri" dense color="primary" />
                            <q-radio v-model="form.ruang_isolasi" val="lain-lain" label="Lain-lain" dense color="primary" class="q-mr-xs" />
                          </div>
                        </div>
                        <div class="col-12 col-md-4" v-if="form.ruang_isolasi === 'lain-lain'">
                          <q-input v-model="form.ruang_isolasi_ket" placeholder="Keterangan ruang isolasi" outlined dense stack-label color="primary" class="bg-grey-1" />
                        </div>
                        <div class="col-12 col-md-12 q-mt-xs">
                          <q-input v-model="form.rujuk_ke" placeholder="Jika ruang isolasi penuh, dirujuk ke faskes mana?" outlined dense stack-label color="primary" class="bg-grey-1">
                            <template #prepend><q-icon name="icon-mat-alt_route" size="18px" color="primary" /></template>
                          </q-input>
                        </div>
                      </div>
                    </div>

                    <!-- APD -->
                    <div class="col-12">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Penggunaan Alat Pelindung Diri (APD)</div>
                      <div class="q-pa-sm border-grey rounded-borders bg-grey-1">
                        <div class="row items-center q-gutter-x-lg q-mb-xs">
                          <span class="text-caption text-weight-bold text-grey-7">Perlu APD?</span>
                          <q-radio v-model="form.pakai_apd" val="tidak" label="Tidak Perlu" dense color="primary" />
                          <q-radio v-model="form.pakai_apd" val="ya" label="Ya, Perlu APD" dense color="primary" />
                        </div>
                        <div v-if="form.pakai_apd === 'ya'" class="row q-col-gutter-sm q-pt-xs border-top">
                          <div class="col-4 col-sm-2"><q-checkbox v-model="form.apd" val="masker" label="Masker" dense color="primary" /></div>
                          <div class="col-4 col-sm-2"><q-checkbox v-model="form.apd" val="sarung tangan" label="Sarung Tangan" dense color="primary" /></div>
                          <div class="col-4 col-sm-2"><q-checkbox v-model="form.apd" val="baju scort" label="Baju Scort" dense color="primary" /></div>
                          <div class="col-4 col-sm-2"><q-checkbox v-model="form.apd" val="sepatu boot" label="Sepatu Boot" dense color="primary" /></div>
                          <div class="col-4 col-sm-2"><q-checkbox v-model="form.apd" val="kaca mata gogle" label="Goggles" dense color="primary" /></div>
                          <div class="col-4 col-sm-2"><q-checkbox v-model="form.apd" val="lain-lain" label="Lain-lain" dense color="primary" /></div>
                        </div>
                      </div>
                    </div>

                    <!-- Penyakit Penyerta -->
                    <div class="col-12">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Penyakit Penyerta (Komorbid)</div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-4">
                          <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-around" style="height: 40px;">
                            <q-radio v-model="form.penyakit_penyerta" val="tidak" label="Tidak Ada" dense color="primary" />
                            <q-radio v-model="form.penyakit_penyerta" val="ya" label="Ada Penyakit Penyerta" dense color="primary" />
                          </div>
                        </div>
                        <div class="col-12 col-md-8" v-if="form.penyakit_penyerta === 'ya'">
                          <q-input v-model="form.ket_penyakit_penyerta" placeholder="Sebutkan penyakit penyerta (misal: Diabetes Melitus, Hipertensi)" outlined dense stack-label color="primary" class="bg-grey-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- CARD SECTION B: IMUNOSUPRESED -->
              <q-card flat class="rounded-borders shadow-1 bg-white overflow-hidden">
                <div class="bg-teal text-white q-px-lg q-py-sm flex items-center justify-between">
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-shield" size="20px" />
                    <span class="text-subtitle1 text-weight-bold">B. Penyakit Penurunan Daya Tahan Tubuh (Imunosupresed)</span>
                  </div>
                  <span class="text-caption text-teal-1 font-medium">Evaluasi Imunitas Pasien</span>
                </div>

                <q-card-section class="q-pa-lg">
                  <div class="row q-col-gutter-md">
                    <!-- Pasien Mengetahui Penyakit Imunosupresed -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Pasien Mengetahui Penyakit Daya Tahan Tubuhnya?</div>
                      <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center q-gutter-x-lg" style="height: 40px;">
                        <q-radio v-model="form.b_tahu_penyakit" val="tahu" label="Ya, Mengetahui" dense color="teal" class="q-ml-sm" />
                        <q-radio v-model="form.b_tahu_penyakit" val="tidak" label="Tidak Mengetahui" dense color="teal" />
                      </div>
                    </div>

                    <!-- Sumber Informasi Imunosupresed -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Sumber Informasi Diperoleh Dari</div>
                      <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center q-gutter-x-md" style="height: 40px;">
                        <q-radio v-model="form.b_sumber_info" val="dokter" label="Dokter" dense color="teal" class="q-ml-xs" />
                        <q-radio v-model="form.b_sumber_info" val="perawat" label="Perawat" dense color="teal" />
                        <q-radio v-model="form.b_sumber_info" val="keluarga" label="Keluarga" dense color="teal" />
                        <q-radio v-model="form.b_sumber_info" val="lain-lain" label="Lain-lain" dense color="teal" />
                      </div>
                    </div>

                    <!-- Menerima Informasi Jangka Waktu -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Menerima Informasi Jangka Waktu Pengobatan?</div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-around" style="height: 40px;">
                            <q-radio v-model="form.b_info_jangka" val="tidak" label="Tidak" dense color="teal" />
                            <q-radio v-model="form.b_info_jangka" val="ya" label="Ya" dense color="teal" />
                          </div>
                        </div>
                        <div class="col-6" v-if="form.b_info_jangka === 'ya'">
                          <q-input v-model="form.b_durasi_pengobatan" placeholder="Misal: 1 Tahun" outlined dense stack-label color="teal" class="bg-grey-1" />
                        </div>
                      </div>
                    </div>

                    <!-- Melakukan Pemeriksaan Rutin -->
                    <div class="col-12 col-md-6">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Melakukan Pemeriksaan Rutin?</div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-around" style="height: 40px;">
                            <q-radio v-model="form.b_pemeriksaan_rutin" val="tidak" label="Tidak" dense color="teal" />
                            <q-radio v-model="form.b_pemeriksaan_rutin" val="ya" label="Ya" dense color="teal" />
                          </div>
                        </div>
                        <div class="col-6" v-if="form.b_pemeriksaan_rutin === 'ya'">
                          <q-input v-model="form.b_tempat_rutin" placeholder="Nama faskes / RS" outlined dense stack-label color="teal" class="bg-grey-1" />
                        </div>
                      </div>
                    </div>

                    <!-- Dirawat Terpisah / Sendiri -->
                    <div class="col-12">
                      <div class="form-label text-weight-bold text-grey-8 q-mb-xs">Dirawat Terpisah / Ruangan Sendiri?</div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-4">
                          <div class="q-pa-xs border-grey rounded-borders bg-grey-1 flex items-center justify-around" style="height: 40px;">
                            <q-radio v-model="form.b_dirawat_terpisah" val="tidak" label="Tidak" dense color="teal" />
                            <q-radio v-model="form.b_dirawat_terpisah" val="ya" label="Ya, Dirawat Terpisah" dense color="teal" />
                          </div>
                        </div>
                        <div class="col-12 col-md-8" v-if="form.b_dirawat_terpisah === 'ya'">
                          <q-input v-model="form.b_tempat_terpisah" placeholder="Sebutkan lokasi / nama kamar perawatan tersendiri" outlined dense stack-label color="teal" class="bg-grey-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- CARD SECTION C & D: ANALISA & TINDAKAN -->
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-card flat class="rounded-borders shadow-1 bg-white overflow-hidden h-full">
                    <div class="bg-blue-grey-8 text-white q-px-md q-py-xs flex items-center q-gutter-x-sm">
                      <q-icon name="icon-mat-analytics" size="18px" />
                      <span class="text-subtitle2 text-weight-bold">C. Analisa Masalah</span>
                    </div>
                    <q-card-section class="q-pa-md">
                      <q-input v-model="form.analisa_masalah" type="textarea" rows="4" outlined color="blue-grey-8" class="bg-grey-1" placeholder="Tuliskan analisa masalah pengkajian pasien..." />
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-md-6">
                  <q-card flat class="rounded-borders shadow-1 bg-white overflow-hidden h-full">
                    <div class="bg-positive text-white q-px-md q-py-xs flex items-center q-gutter-x-sm">
                      <q-icon name="icon-mat-medical_services" size="18px" />
                      <span class="text-subtitle2 text-weight-bold">D. Tindakan Pelayanan</span>
                    </div>
                    <q-card-section class="q-pa-md">
                      <q-input v-model="form.tindakan" type="textarea" rows="4" outlined color="positive" class="bg-grey-1" placeholder="Tuliskan instruksi / rencana tindakan pelayanan..." />
                    </q-card-section>
                  </q-card>
                </div>
              </div>

            </q-form>
          </div>
        </q-card-section>

        <!-- Footer Actions Bar -->
        <q-card-section class="bg-white col-auto q-py-sm q-px-lg shadow-2 border-top">
          <div class="max-width-container mx-auto flex items-center justify-between">
            <div class="text-caption text-grey-7 flex items-center q-gutter-x-xs">
              <q-icon name="icon-mat-info" color="primary" size="16px" />
              <span>Pastikan seluruh data pengkajian telah diperiksa dengan benar sebelum disimpan.</span>
            </div>
            <div class="row q-gutter-x-md">
              <q-btn label="Batal" flat color="grey-8" class="q-px-lg" v-close-popup />
              <q-btn label="Simpan Pengkajian" icon="icon-mat-save" unelevated color="primary" class="q-px-xl text-weight-bold shadow-1" :loading="loadingSave" @click="onSubmit" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const store = useAsesmenJatuhNyeriStore()
const appStore = useAplikasiStore()

const dialogOpen = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const loadingSave = ref(false)

const currentUserPegawai = computed(() => {
  return appStore.user?.pegawai?.kdpegsimrs || appStore.user?.kdpegsimrs || appStore.user?.username || ''
})

const items = computed(() => {
  return store.itemsPenyakitMenular || []
})

const defaultForm = () => ({
  diagnosis: '',
  status_diag: 'baru',
  lama_sejak: '',
  tahu_penyakit: 'tahu',
  sumber_info: 'dokter',
  info_jangka: 'tidak',
  durasi_pengobatan: '',
  pemeriksaan_rutin: 'tidak',
  tempat_rutin: '',
  cara_penularan: [],
  ruang_isolasi: 'tidak',
  ruang_isolasi_ket: '',
  rujuk_ke: '',
  pakai_apd: 'tidak',
  apd: [],
  penyakit_penyerta: 'tidak',
  ket_penyakit_penyerta: '',
  
  // Section B
  b_tahu_penyakit: 'tahu',
  b_sumber_info: 'dokter',
  b_info_jangka: 'tidak',
  b_durasi_pengobatan: '',
  b_pemeriksaan_rutin: 'tidak',
  b_tempat_rutin: '',
  b_dirawat_terpisah: 'tidak',
  b_tempat_terpisah: '',

  // Section C & D
  analisa_masalah: '',
  tindakan: ''
})

const form = reactive(defaultForm())

onMounted(() => {
  if (props.pasien) {
    store.getData(props.pasien)
  }
})

function resetForm() {
  Object.assign(form, defaultForm())
  isEdit.value = false
  editId.value = null
}

function bukaForm() {
  resetForm()
  dialogOpen.value = true
}

function bukaEdit(item) {
  resetForm()
  isEdit.value = true
  editId.value = item.id
  
  Object.assign(form, {
    diagnosis: item.diagnosis || '',
    status_diag: item.status_diag || 'baru',
    lama_sejak: item.lama_sejak || '',
    tahu_penyakit: item.tahu_penyakit || 'tahu',
    sumber_info: item.sumber_info || 'dokter',
    info_jangka: item.info_jangka || 'tidak',
    durasi_pengobatan: item.durasi_pengobatan || '',
    pemeriksaan_rutin: item.pemeriksaan_rutin || 'tidak',
    tempat_rutin: item.tempat_rutin || '',
    cara_penularan: Array.isArray(item.cara_penularan) ? item.cara_penularan : [],
    ruang_isolasi: item.ruang_isolasi || 'tidak',
    ruang_isolasi_ket: item.ruang_isolasi_ket || '',
    rujuk_ke: item.rujuk_ke || '',
    pakai_apd: item.pakai_apd || 'tidak',
    apd: Array.isArray(item.apd) ? item.apd : [],
    penyakit_penyerta: item.penyakit_penyerta || 'tidak',
    ket_penyakit_penyerta: item.ket_penyakit_penyerta || '',
    
    b_tahu_penyakit: item.b_tahu_penyakit || 'tahu',
    b_sumber_info: item.b_sumber_info || 'dokter',
    b_info_jangka: item.b_info_jangka || 'tidak',
    b_durasi_pengobatan: item.b_durasi_pengobatan || '',
    b_pemeriksaan_rutin: item.b_pemeriksaan_rutin || 'tidak',
    b_tempat_rutin: item.b_tempat_rutin || '',
    b_dirawat_terpisah: item.b_dirawat_terpisah || 'tidak',
    b_tempat_terpisah: item.b_tempat_terpisah || '',

    analisa_masalah: item.analisa_masalah || '',
    tindakan: item.tindakan || ''
  })
  
  dialogOpen.value = true
}

async function onSubmit() {
  loadingSave.value = true
  const payload = {
    ...form,
    id: editId.value,
    noreg: props.pasien?.noreg,
    norm: props.pasien?.norm,
    kdruangan: props.pasien?.kdruangansim || props.pasien?.kdpoli || props.pasien?.kdruang || '',
    sumber: 'ranap',
    kdpegsimrs: currentUserPegawai.value,
    petugas: appStore.user?.pegawai?.nama || appStore.user?.nama || ''
  }

  const success = await store.simpanPenyakitMenular(props.pasien, payload)
  loadingSave.value = false
  if (success) {
    dialogOpen.value = false
  }
}

async function hapusItem(item) {
  if (confirm('Apakah Anda yakin ingin menghapus data asesmen penyakit menular ini?')) {
    await store.hapusPenyakitMenular(props.pasien, item.id)
  }
}
</script>

<style lang="scss" scoped>
.max-width-container {
  max-width: 1050px;
}
.lh-1 {
  line-height: 1.2;
}
.border-left {
  border-left: 1px solid #e0e0e0;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-top {
  border-top: 1px solid #e0e0e0;
}
.border-grey {
  border: 1px solid #cfd8dc;
}
.border-blue-2 {
  border: 1px solid #90caf9;
}
.border-green-2 {
  border: 1px solid #a5d6a7;
}
.font-medium {
  font-weight: 500;
}
.grid-details {
  display: flex;
  flex-direction: column;
}
.h-full {
  height: 100%;
}
.shadow-xs {
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
</style>
