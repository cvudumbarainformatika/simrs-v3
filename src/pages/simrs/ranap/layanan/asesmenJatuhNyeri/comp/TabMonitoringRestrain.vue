<template>
  <div class="fit column relative-position bg-grey-2">
    <!-- Header Toolbar -->
    <div class="col-auto bg-primary text-white q-px-md q-py-sm shadow-2">
      <div class="row justify-between items-center">
        <div class="text-subtitle1 text-weight-bold row items-center q-gutter-x-sm">
          <q-avatar size="32px" color="white" text-color="primary" icon="icon-mat-lock_clock" />
          <div>
            <div class="lh-1 text-weight-bold">Monitoring Pengikatan Restrain</div>
            <div class="text-caption text-blue-2" style="font-size: 11px;">Lembar Observasi & Pemantauan Pasien Dalam Pengikatan (Restrain)</div>
          </div>
        </div>
        <div>
          <q-btn rounded unelevated color="positive" class="q-px-md shadow-1" :loading="store.loading" @click="bukaForm">
            <q-icon name="icon-mat-add" size="xs" />
            <span class="q-ml-xs text-weight-bold">Tambah Monitoring Baru</span>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- List Data Riwayat Monitoring -->
    <div class="col q-pa-md scroll relative-position">
      <div v-if="!items.length" class="fit flex flex-center bg-white rounded-borders shadow-1"
        style="border: 2px dashed #cfd8dc; min-height: 380px;">
        <div class="text-center q-pa-lg">
          <q-avatar size="90px" color="blue-1" text-color="primary" class="q-mb-md">
            <q-icon name="icon-mat-lock_clock" size="50px" />
          </q-avatar>
          <div class="text-h6 text-weight-bold text-grey-8">Belum Ada Catatan Monitoring Restrain</div>
          <div class="text-subtitle2 text-grey-6 q-mt-xs q-mb-md" style="max-width: 420px;">
            Belum ada observasi monitoring pengikatan fisik (restrain) yang tercatat untuk pasien ini.
          </div>
          <q-btn rounded unelevated color="primary" icon="icon-mat-add" label="Buat Monitoring Sekarang" class="q-px-lg" @click="bukaForm" />
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
                    <span class="text-weight-bold text-subtitle1 text-dark">{{ item.petugas || 'Perawat / Petugas' }}</span>
                    <q-badge color="blue-1" text-color="primary" class="text-weight-bold q-px-sm">PPA / Observer</q-badge>
                    <q-badge color="teal-1" text-color="teal-9" class="text-weight-bold q-px-sm">
                      Kesadaran: {{ item.kesadaran || '-' }}
                    </q-badge>
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
                <!-- Row Cards Grid Observasi -->
                <div class="row q-col-gutter-sm">
                  <!-- 1. TTV -->
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-primary text-white q-pa-xs text-caption text-weight-bold flex items-center">
                        <q-icon name="icon-mat-favorite" size="16px" class="q-mr-xs" />
                        <span>1. TANDA VITAL (TTV)</span>
                      </div>
                      <q-card-section class="q-pa-sm text-caption text-grey-9">
                        <div class="q-gutter-y-xs">
                          <div><strong>T (Tensi):</strong> {{ item.ttv_t || '-' }} mmHg</div>
                          <div><strong>N (Nadi):</strong> {{ item.ttv_n || '-' }} x/mnt</div>
                          <div><strong>S (Suhu):</strong> {{ item.ttv_s || '-' }} °C</div>
                          <div><strong>RR (Pernafasan):</strong> {{ item.ttv_rr || '-' }} x/mnt</div>
                          <div><strong>CRT:</strong> {{ item.ttv_crt || '-' }}</div>
                          <div><strong>Akral:</strong> {{ item.ttv_akral || '-' }}</div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- 2. Tanda Cidera Akibat Fiksasi -->
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-indigo-7 text-white q-pa-xs text-caption text-weight-bold flex items-center">
                        <q-icon name="icon-mat-healing" size="16px" class="q-mr-xs" />
                        <span>2. TANDA CIDERA FIKSASI</span>
                      </div>
                      <q-card-section class="q-pa-sm text-caption text-grey-9">
                        <div v-if="!item.tanda_cedera || !item.tanda_cedera.length" class="text-grey-6 italic">Tidak ada catatan</div>
                        <div v-else class="q-gutter-xs">
                          <q-badge v-for="c in item.tanda_cedera" :key="c" color="indigo-1" text-color="indigo-9" class="text-weight-bold q-mr-xs">
                            {{ c }}
                          </q-badge>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- 3. Nutrisi -->
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-teal-7 text-white q-pa-xs text-caption text-weight-bold flex items-center">
                        <q-icon name="icon-mat-restaurant" size="16px" class="q-mr-xs" />
                        <span>3. NUTRISI</span>
                      </div>
                      <q-card-section class="q-pa-sm text-caption text-grey-9">
                        <div class="q-gutter-y-xs">
                          <div><strong>Porsi Makan:</strong> {{ item.nutrisi_makan || '-' }}</div>
                          <div><strong>Minum:</strong> {{ item.nutrisi_minum_gelas ? item.nutrisi_minum_gelas + ' gelas' : '' }} {{ item.nutrisi_minum_cc ? '/ ' + item.nutrisi_minum_cc + ' cc' : '' }} / 24 jam</div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- 4. Mobilisasi Tempat Fiksasi -->
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-deep-purple-7 text-white q-pa-xs text-caption text-weight-bold flex items-center">
                        <q-icon name="icon-mat-accessibility" size="16px" class="q-mr-xs" />
                        <span>4. MOBILISASI FIKSASI</span>
                      </div>
                      <q-card-section class="q-pa-sm text-caption text-grey-9">
                        <div class="q-gutter-y-xs">
                          <div><strong>Status:</strong> {{ item.mobilisasi === 'mobilisasi' ? 'Mobilisasi Ekstremitas' : 'Tidak dilakukan mobilisasi' }}</div>
                          <div v-if="item.mobilisasi === 'mobilisasi'"><strong>Interval:</strong> Tiap {{ item.mobilisasi_tiap_jam || '-' }} Jam</div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- 5. Higiene -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-cyan-8 text-white q-pa-xs text-caption text-weight-bold flex items-center">
                        <q-icon name="icon-mat-clean_hands" size="16px" class="q-mr-xs" />
                        <span>5. HIGIENE</span>
                      </div>
                      <q-card-section class="q-pa-sm text-caption text-grey-9">
                        <div v-if="!item.higiene || !item.higiene.length" class="text-grey-6 italic">Tidak ada catatan</div>
                        <div v-else class="q-gutter-y-xs">
                          <div v-for="h in item.higiene" :key="h" class="flex items-center q-gutter-x-xs">
                            <q-icon name="icon-mat-check_circle" size="14px" color="cyan-8" />
                            <span>{{ h }}</span>
                            <span v-if="h === 'Mandi / Seka'" class="text-weight-bold">({{ item.higiene_mandi_x || '-' }} x/hari)</span>
                            <span v-if="h === 'Oral Higeine'" class="text-weight-bold">({{ item.higiene_oral_x || '-' }} x/hari)</span>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- 6. Eliminasi -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-amber-9 text-white q-pa-xs text-caption text-weight-bold flex items-center">
                        <q-icon name="icon-mat-wc" size="16px" class="q-mr-xs" />
                        <span>6. ELIMINASI</span>
                      </div>
                      <q-card-section class="q-pa-sm text-caption text-grey-9">
                        <div class="q-gutter-y-xs">
                          <div><strong>BAB:</strong> {{ item.eliminasi_bab_x ? item.eliminasi_bab_x + ' x/hari' : '-' }}</div>
                          <div><strong>BAK:</strong> {{ item.eliminasi_bak_x ? item.eliminasi_bak_x + ' x/hari' : '-' }}</div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- 7. Kesadaran -->
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                      <div class="bg-blue-grey-8 text-white q-pa-xs text-caption text-weight-bold flex items-center">
                        <q-icon name="icon-mat-psychology" size="16px" class="q-mr-xs" />
                        <span>7. KESADARAN</span>
                      </div>
                      <q-card-section class="q-pa-sm text-caption text-grey-9">
                        <div class="text-weight-bold text-subtitle2 text-primary">
                          {{ item.kesadaran || '-' }}
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

    <!-- DIALOG FORM MONITORING RESTRAIN -->
    <q-dialog v-model="dialogForm" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="column fit bg-grey-2">
        <!-- Dialog Header -->
        <q-card-section class="bg-primary text-white q-py-sm q-px-md row items-center justify-between shadow-2">
          <div class="row items-center q-gutter-x-sm">
            <q-avatar size="32px" color="white" text-color="primary" icon="icon-mat-lock_clock" />
            <div>
              <div class="text-subtitle1 text-weight-bold">
                {{ isEdit ? 'Edit Catatan Monitoring Restrain' : 'Form Monitoring Pengikatan Restrain' }}
              </div>
              <div class="text-caption text-blue-2" style="font-size: 11px;">
                Pasien: {{ pasien?.nama }} ({{ pasien?.norm }}) | Ruang: {{ pasien?.ruangan || '-' }}
              </div>
            </div>
          </div>
          <q-btn icon="icon-mat-close" flat round dense v-close-popup />
        </q-card-section>

        <!-- Dialog Body (Form Isian Modern & Terstruktur) -->
        <q-card-section class="col scroll q-pa-md">
          <div class="row justify-center">
            <div class="col-12 col-lg-11 q-gutter-y-md">

              <!-- Baris Tanggal & Waktu Observasi -->
              <q-card flat bordered class="bg-white rounded-borders shadow-xs">
                <q-card-section class="q-pa-md">
                  <div class="row q-col-gutter-md items-center">
                    <div class="col-12 col-md-6">
                      <div class="text-caption text-grey-7 q-mb-xs font-medium">Tanggal Observasi</div>
                      <app-input-date
                        :model="form.tgl_only"
                        outlined
                        dense
                        @set-model="form.tgl_only = $event"
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="text-caption text-grey-7 q-mb-xs font-medium">Jam Observasi (WIB)</div>
                      <q-input v-model="form.jam_only" outlined dense mask="time" :rules="['time']" placeholder="HH:mm">
                        <template #append>
                          <q-icon name="icon-mat-access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-time v-model="form.jam_only" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Tutup" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Form 7 Kotak Observasi -->
              <div class="row q-col-gutter-md">
                
                <!-- 1. TTV -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                    <div class="bg-primary text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center">
                      <q-icon name="icon-mat-favorite" size="18px" class="q-mr-xs" />
                      <span>1. TTV (Tanda Vital)</span>
                    </div>
                    <q-card-section class="q-pa-md q-gutter-y-sm">
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <q-input v-model="form.ttv_t" outlined dense label="T (Tekanan Darah)" placeholder="cth: 120/80" suffix="mmHg" />
                        </div>
                        <div class="col-6">
                          <q-input v-model="form.ttv_n" outlined dense label="N (Nadi)" placeholder="cth: 80" suffix="x/mnt" />
                        </div>
                        <div class="col-6">
                          <q-input v-model="form.ttv_s" outlined dense label="S (Suhu)" placeholder="cth: 36.5" suffix="°C" />
                        </div>
                        <div class="col-6">
                          <q-input v-model="form.ttv_rr" outlined dense label="RR (Pernafasan)" placeholder="cth: 20" suffix="x/mnt" />
                        </div>
                        <div class="col-6">
                          <q-input v-model="form.ttv_crt" outlined dense label="CRT" placeholder="cth: < 2 dtk" />
                        </div>
                        <div class="col-6">
                          <q-input v-model="form.ttv_akral" outlined dense label="Akral" placeholder="cth: Hangat / Kering" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 2. Tanda Cidera Akibat Fiksasi -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                    <div class="bg-indigo-7 text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center">
                      <q-icon name="icon-mat-healing" size="18px" class="q-mr-xs" />
                      <span>2. Tanda Cidera Akibat Fiksasi</span>
                    </div>
                    <q-card-section class="q-pa-md">
                      <div class="text-caption text-grey-7 q-mb-xs font-medium">Pilih tanda cedera yang ditemukan:</div>
                      <div class="row q-col-gutter-xs">
                        <div v-for="c in listCedera" :key="c" class="col-6">
                          <q-checkbox v-model="form.tanda_cedera" :val="c" :label="c" dense color="indigo-7" class="text-caption" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 3. Nutrisi -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                    <div class="bg-teal-7 text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center">
                      <q-icon name="icon-mat-restaurant" size="18px" class="q-mr-xs" />
                      <span>3. Nutrisi</span>
                    </div>
                    <q-card-section class="q-pa-md q-gutter-y-sm">
                      <div class="text-caption text-grey-7 font-medium">Asupan Porsi Makan:</div>
                      <div class="row q-col-gutter-xs">
                        <div v-for="p in listPorsiMakan" :key="p" class="col-6">
                          <q-radio v-model="form.nutrisi_makan" :val="p" :label="p" dense color="teal-7" class="text-caption" />
                        </div>
                      </div>

                      <q-separator class="q-my-sm" />

                      <div class="text-caption text-grey-7 font-medium">Asupan Minum (per 24 jam):</div>
                      <div class="row q-col-gutter-sm items-center">
                        <div class="col-6">
                          <q-input v-model="form.nutrisi_minum_gelas" outlined dense label="Jumlah Gelas" placeholder="cth: 4" suffix="gelas" />
                        </div>
                        <div class="col-6">
                          <q-input v-model="form.nutrisi_minum_cc" outlined dense label="Jumlah CC" placeholder="cth: 1000" suffix="cc / 24 jam" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 4. Mobilisasi Tempat Fiksasi -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                    <div class="bg-deep-purple-7 text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center">
                      <q-icon name="icon-mat-accessibility" size="18px" class="q-mr-xs" />
                      <span>4. Mobilisasi Tempat Fiksasi</span>
                    </div>
                    <q-card-section class="q-pa-md q-gutter-y-sm">
                      <div class="q-gutter-y-xs">
                        <q-radio v-model="form.mobilisasi" val="mobilisasi" label="Mobilisasi ekstremitas" dense color="deep-purple-7" class="text-caption" />
                        <div v-if="form.mobilisasi === 'mobilisasi'" class="q-pl-lg q-pt-xs">
                          <q-input v-model="form.mobilisasi_tiap_jam" outlined dense label="Interval Tiap ... Jam" placeholder="cth: 2" suffix="Jam" style="max-width: 200px;" />
                        </div>
                        <q-radio v-model="form.mobilisasi" val="tidak" label="Tidak dilakukan mobilisasi" dense color="deep-purple-7" class="text-caption q-mt-sm" />
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 5. Higiene -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                    <div class="bg-cyan-8 text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center">
                      <q-icon name="icon-mat-clean_hands" size="18px" class="q-mr-xs" />
                      <span>5. Higiene</span>
                    </div>
                    <q-card-section class="q-pa-md">
                      <div class="column q-gutter-y-sm">
                        <!-- Mandi / Seka -->
                        <div class="row items-center justify-between no-wrap q-gutter-x-sm">
                          <q-checkbox v-model="form.higiene" val="Mandi / Seka" label="Mandi / Seka" dense color="cyan-8" class="text-caption" />
                          <q-input v-if="form.higiene.includes('Mandi / Seka')" v-model="form.higiene_mandi_x" outlined dense label="Frekuensi" placeholder="1" suffix="x/hari" style="width: 140px;" />
                        </div>

                        <!-- Tidak dilakukan seka -->
                        <div>
                          <q-checkbox v-model="form.higiene" val="Tidak dilakukan seka" label="Tidak dilakukan seka" dense color="cyan-8" class="text-caption" />
                        </div>

                        <!-- Ganti pakaian -->
                        <div>
                          <q-checkbox v-model="form.higiene" val="Ganti pakaian" label="Ganti pakaian" dense color="cyan-8" class="text-caption" />
                        </div>

                        <!-- Oral Higiene -->
                        <div class="row items-center justify-between no-wrap q-gutter-x-sm">
                          <q-checkbox v-model="form.higiene" val="Oral Higeine" label="Oral Higeine" dense color="cyan-8" class="text-caption" />
                          <q-input v-if="form.higiene.includes('Oral Higeine')" v-model="form.higiene_oral_x" outlined dense label="Frekuensi" placeholder="2" suffix="x/hari" style="width: 140px;" />
                        </div>

                        <!-- Tidak oral higeine -->
                        <div>
                          <q-checkbox v-model="form.higiene" val="Tidak oral higeine" label="Tidak oral higeine" dense color="cyan-8" class="text-caption" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 6. Eliminasi -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="bg-white rounded-borders h-full shadow-xs">
                    <div class="bg-amber-9 text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center">
                      <q-icon name="icon-mat-wc" size="18px" class="q-mr-xs" />
                      <span>6. Eliminasi</span>
                    </div>
                    <q-card-section class="q-pa-md q-gutter-y-sm">
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <q-input v-model="form.eliminasi_bab_x" outlined dense label="BAB" placeholder="cth: 1" suffix="x/hari" />
                        </div>
                        <div class="col-6">
                          <q-input v-model="form.eliminasi_bak_x" outlined dense label="BAK" placeholder="cth: 3" suffix="x/hari" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 7. Kesadaran -->
                <div class="col-12">
                  <q-card flat bordered class="bg-white rounded-borders shadow-xs">
                    <div class="bg-blue-grey-8 text-white q-pa-sm text-subtitle2 text-weight-bold flex items-center">
                      <q-icon name="icon-mat-psychology" size="18px" class="q-mr-xs" />
                      <span>7. Kesadaran Pasien</span>
                    </div>
                    <q-card-section class="q-pa-md">
                      <div class="text-caption text-grey-7 q-mb-xs font-medium">Pilih tingkat kesadaran saat observasi:</div>
                      <div class="row q-col-gutter-sm">
                        <div v-for="k in listKesadaran" :key="k" class="col-6 col-sm-4 col-md-2">
                          <q-radio v-model="form.kesadaran" :val="k" :label="k" dense color="blue-grey-8" class="text-caption" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

              </div>

            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Dialog Actions -->
        <q-card-actions class="bg-white q-px-lg q-py-sm justify-end q-gutter-x-sm">
          <q-btn flat label="Batal" color="dark" v-close-popup class="q-px-md" />
          <q-btn unelevated color="primary" label="Simpan Monitoring" icon="icon-mat-save" :loading="store.loadingSave" class="q-px-lg shadow-1" @click="simpanData" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const store = useAsesmenJatuhNyeriStore()

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

const items = computed(() => store.itemsMonitoringRestrain || [])

const listCedera = ['Merah', 'Oedema', 'Lecet', 'Bula', 'Luxasi/Dislokasi', 'Tidak ada cidera']
const listPorsiMakan = ['1 porsi habis', '1/2 porsi habis', '3/4 porsi habis', 'Tidak mau makan / minum']
const listKesadaran = ['Composmentis', 'Apatis', 'Dellirium', 'Somnolen', 'Sopor', 'Coma']

const dialogForm = ref(false)
const isEdit = ref(false)

const form = ref({
  id: null,
  tgl_only: '',
  jam_only: '',
  ttv_t: '',
  ttv_n: '',
  ttv_s: '',
  ttv_rr: '',
  ttv_crt: '',
  ttv_akral: '',
  tanda_cedera: ['Tidak ada cidera'],
  nutrisi_makan: '1 porsi habis',
  nutrisi_minum_gelas: '',
  nutrisi_minum_cc: '',
  mobilisasi: 'mobilisasi',
  mobilisasi_tiap_jam: '2',
  higiene: ['Mandi / Seka', 'Ganti pakaian', 'Oral Higeine'],
  higiene_mandi_x: '1',
  higiene_oral_x: '2',
  eliminasi_bab_x: '1',
  eliminasi_bak_x: '3',
  kesadaran: 'Composmentis'
})

const currentUserPegawai = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.pegawai?.kdpegsimrs || user?.kdpegsimrs || 'sa'
  } catch (e) {
    return 'sa'
  }
})

function getCurrentDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getCurrentTime() {
  const d = new Date()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function resetForm() {
  form.value = {
    id: null,
    tgl_only: getCurrentDate(),
    jam_only: getCurrentTime(),
    ttv_t: '',
    ttv_n: '',
    ttv_s: '',
    ttv_rr: '',
    ttv_crt: '',
    ttv_akral: '',
    tanda_cedera: ['Tidak ada cidera'],
    nutrisi_makan: '1 porsi habis',
    nutrisi_minum_gelas: '',
    nutrisi_minum_cc: '',
    mobilisasi: 'mobilisasi',
    mobilisasi_tiap_jam: '2',
    higiene: ['Mandi / Seka', 'Ganti pakaian', 'Oral Higeine'],
    higiene_mandi_x: '1',
    higiene_oral_x: '2',
    eliminasi_bab_x: '1',
    eliminasi_bak_x: '3',
    kesadaran: 'Composmentis'
  }
}

function bukaForm() {
  isEdit.value = false
  resetForm()
  dialogForm.value = true
}

function bukaEdit(item) {
  isEdit.value = true
  const tglSource = item.tanggal || item.created_at || ''
  let tgl = getCurrentDate()
  let jam = getCurrentTime()
  if (tglSource.includes(' ')) {
    const parts = tglSource.split(' ')
    tgl = parts[0]
    jam = parts[1].slice(0, 5)
  }

  form.value = {
    id: item.id,
    tgl_only: tgl,
    jam_only: jam,
    ttv_t: item.ttv_t || '',
    ttv_n: item.ttv_n || '',
    ttv_s: item.ttv_s || '',
    ttv_rr: item.ttv_rr || '',
    ttv_crt: item.ttv_crt || '',
    ttv_akral: item.ttv_akral || '',
    tanda_cedera: Array.isArray(item.tanda_cedera) ? item.tanda_cedera : [],
    nutrisi_makan: item.nutrisi_makan || '1 porsi habis',
    nutrisi_minum_gelas: item.nutrisi_minum_gelas || '',
    nutrisi_minum_cc: item.nutrisi_minum_cc || '',
    mobilisasi: item.mobilisasi || 'mobilisasi',
    mobilisasi_tiap_jam: item.mobilisasi_tiap_jam || '2',
    higiene: Array.isArray(item.higiene) ? item.higiene : [],
    higiene_mandi_x: item.higiene_mandi_x || '',
    higiene_oral_x: item.higiene_oral_x || '',
    eliminasi_bab_x: item.eliminasi_bab_x || '',
    eliminasi_bak_x: item.eliminasi_bak_x || '',
    kesadaran: item.kesadaran || 'Composmentis'
  }
  dialogForm.value = true
}

async function simpanData() {
  const tglFull = `${form.value.tgl_only} ${form.value.jam_only}:00`

  const payload = {
    id: form.value.id,
    noreg: props.pasien?.noreg,
    norm: props.pasien?.norm,
    kdruangan: props.pasien?.kdruangan || props.pasien?.kodepoli || '',
    tanggal: tglFull,
    sumber: 'ranap',

    ttv_t: form.value.ttv_t,
    ttv_n: form.value.ttv_n,
    ttv_s: form.value.ttv_s,
    ttv_rr: form.value.ttv_rr,
    ttv_crt: form.value.ttv_crt,
    ttv_akral: form.value.ttv_akral,

    tanda_cedera: form.value.tanda_cedera,
    nutrisi_makan: form.value.nutrisi_makan,
    nutrisi_minum_gelas: form.value.nutrisi_minum_gelas,
    nutrisi_minum_cc: form.value.nutrisi_minum_cc,

    mobilisasi: form.value.mobilisasi,
    mobilisasi_tiap_jam: form.value.mobilisasi_tiap_jam,

    higiene: form.value.higiene,
    higiene_mandi_x: form.value.higiene_mandi_x,
    higiene_oral_x: form.value.higiene_oral_x,

    eliminasi_bab_x: form.value.eliminasi_bab_x,
    eliminasi_bak_x: form.value.eliminasi_bak_x,

    kesadaran: form.value.kesadaran
  }

  const success = await store.simpanMonitoringRestrain(props.pasien, payload)
  if (success) {
    dialogForm.value = false
  }
}

function hapusItem(item) {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data monitoring pengikatan restrain ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusMonitoringRestrain(props.pasien, item.id)
  })
}

onMounted(() => {
  if (props.pasien?.noreg) {
    store.getData(props.pasien)
  }
})
</script>

<style scoped>
.lh-1 {
  line-height: 1.2;
}
.font-medium {
  font-weight: 500;
}
.shadow-xs {
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
</style>
