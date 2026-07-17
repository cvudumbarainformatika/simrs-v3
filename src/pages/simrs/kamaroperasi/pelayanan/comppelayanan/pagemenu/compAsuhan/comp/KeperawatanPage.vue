<template>
  <div style="margin-bottom: 100px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh;">
    <div class="q-pa-lg">
      <div class="style-form">

        <!-- Header -->
        <div class="q-mb-lg">
          <div class="bg-primary text-white q-pa-md text-center text-weight-bold rounded-borders header-card"
            style="font-size: 20px; letter-spacing: 0.5px;">
            <q-icon name="description" size="md" class="q-mr-md" />
            PENGKAJIAN DAN DIAGNOSA KEPERAWATAN
          </div>
        </div>

        <!-- ===== SECTION 1: PENGKAJIAN UMUM ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header">
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="assignment" class="q-mr-md" />Informasi Pengkajian
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-6">
                <app-input-date-human label="Tanggal Pengkajian" outlined :model="store.display.tanggal"
                  @db-model="(val) => { store.form.pengkajian_tanggal = val }"
                  @set-display="(val) => { store.display.tanggal = val }" />
              </div>
              <div class="col-xs-12 col-md-6">
                <app-input-date :model="store.form.pengkajian_jam" label="Jam Pengkajian" :type-date="false" dense
                  outlined @set-model="(val) => { store.form.pengkajian_jam = val }" />
              </div>
            </div>

            <div class="info-box q-pa-md q-mb-lg">
              <div class="text-weight-bold q-mb-sm">Tindakan Operasi</div>
              <div class="text-primary text-weight-medium">
                {{ ambilTidakanOperasi(pasien?.manytindakanop) }}
              </div>
            </div>

            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Waktu Pelayanan</div>
            <div class="row q-col-gutter-lg q-mb-lg time-box q-pa-md">
              <div class="col-xs-12 col-md-6">
                <app-input-date :model="store.form.pengkajian_jam_mulai" label="Mulai Jam" :type-date="false" dense
                  outlined @set-model="(val) => { store.form.pengkajian_jam_mulai = val }" />
                <div class="text-caption text-primary q-mt-xs" v-if="lapOpMulai">
                  ℹ️ Jam Mulai (Lap. Op): <strong>{{ lapOpMulai }}</strong>
                </div>
                <div class="text-caption text-grey-6 q-mt-xs" v-else>
                  ℹ️ Jam Mulai (Lap. Op): Belum diisi
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <app-input-date :model="store.form.pengkajian_jam_selesai" label="Selesai Jam" :type-date="false" dense
                  outlined @set-model="(val) => { store.form.pengkajian_jam_selesai = val }" />
                <div class="text-caption text-primary q-mt-xs" v-if="lapOpSelesai">
                  ℹ️ Jam Selesai (Lap. Op): <strong>{{ lapOpSelesai }}</strong>
                </div>
                <div class="text-caption text-grey-6 q-mt-xs" v-else>
                  ℹ️ Jam Selesai (Lap. Op): Belum diisi
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- ===== SECTION 2: RESIKO INFEKSI ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header bg-negative">
            <div class="text-h6 text-weight-bold text-white">
              <q-icon name="warning" class="q-mr-md" />Resiko Infeksi (D.0142)
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- Faktor Resiko -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Faktor Resiko</div>
            <div class="factor-box q-pa-md q-mb-lg">
              <q-option-group v-model="store.form.pengkajian_faktor_resiko" :options="store.optionFaktorResikos"
                color="primary" type="checkbox" dense size="sm" />
            </div>

            <!-- Canul Intra Vena -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Posisi Canul Intra Vena</div>
            <div class="factor-box q-pa-md q-mb-lg">
              <q-option-group v-model="store.form.pengkajian_posisi_canul_intra_vena"
                :options="store.optionPosisiCanulIntraVenas" color="primary" type="checkbox" dense size="sm" />
            </div>

            <!-- Urine Katheter & Pernafasan -->
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-6">
                <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm">Urine Katheter</div>
                <div class="exam-box q-pa-md">
                  <q-option-group v-model="store.form.pengkajian_urine_katheter" :options="store.ynOptions"
                    color="primary" inline dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm">Status Pernafasan</div>
                <div class="exam-box q-pa-md">
                  <q-option-group v-model="store.form.pengkajian_status_pernafasan" :options="store.nafasOptions"
                    color="primary" inline dense size="sm" />
                </div>
              </div>
            </div>

            <!-- Vital Signs -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Vital Signs</div>
            <div class="vital-box q-pa-md q-mb-lg">
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">Tensi</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.pengkajian_td_sis" label="Sis" outlined dense />
                      </div>
                      <div class="col-auto">/</div>
                      <div class="col"><app-input v-model="store.form.pengkajian_td_dia" label="Dia" outlined dense />
                      </div>
                      <div class="col-auto">mmHg</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">Nadi</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.pengkajian_nadi" label="Nadi" outlined dense />
                      </div>
                      <div class="col-auto">x/mnt</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">Suhu</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.pengkajian_suhu" label="Suhu" outlined dense />
                      </div>
                      <div class="col-auto">°C</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">RR</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.pengkajian_respirasi_rate" label="RR" outlined
                          dense /></div>
                      <div class="col-auto">x/mnt</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">Saturasi</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.pengkajian_saturasi" label="SpO2" outlined
                          dense /></div>
                      <div class="col-auto">%</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">Lab HB</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.pengkajian_lab_hb" label="HB" outlined dense />
                      </div>
                      <div class="col-auto">gr/dl</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Informasi Tambahan</div>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-4">
                <app-input v-model="store.form.pengkajian_bukti" label="Dibuktikan dengan" outlined dense />
              </div>
              <div class="col-xs-12 col-md-4">
                <app-input-date :model="store.form.pengkajian_waktu_masuk_ok" label="Masuk OK (Waktu)"
                  :type-date="false" dense outlined
                  @set-model="(val) => { store.form.pengkajian_waktu_masuk_ok = val }" />
              </div>
              <div class="col-xs-12 col-md-4">
                <app-input v-model="store.form.pengkajian_waktu_anastesi" label="Waktu Anestesi" outlined dense />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- ===== SECTION 3: PENANGANAN LUKA ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header">
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="local_hospital" class="q-mr-md" />Penanganan Luka Operasi
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- Jenis & Disinfeksi -->
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-6">
                <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm">Jenis Operasi</div>
                <div class="exam-box q-pa-md">
                  <q-option-group v-model="store.form.pengkajian_jenis_operasi" :options="store.optionJenisOperasis"
                    color="primary" dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm">Disinfeksi Area Operasi</div>
                <div class="exam-box q-pa-md">
                  <q-option-group v-model="store.form.pengkajian_disinfeksi_area_operasi"
                    :options="store.optionDisinfeksiAreaOperasis" color="primary" dense size="sm" />
                </div>
              </div>
            </div>

            <!-- Irigasi Luka -->
            <div class="treatment-box q-pa-md q-mb-lg">
              <div class="text-weight-bold q-mb-md">Irigasi Luka</div>
              <q-option-group v-model="store.form.pengkajian_irigasi_luka" :options="store.ynOptions" color="primary"
                inline dense size="sm"
                @update:model-value="(val) => { setNullIf(val, 'pengkajian_cairan_irigasi_luka', 'Tidak') }" />
              <template v-if="store.form.pengkajian_irigasi_luka == 'Ya'">
                <div class="q-mt-md">
                  <span class="q-mr-md text-weight-medium">Cairan :</span>
                  <q-option-group v-model="store.form.pengkajian_cairan_irigasi_luka"
                    :options="store.optionCairanIrigasiLuka" color="primary" inline dense size="sm" />
                </div>
              </template>
            </div>

            <!-- Pencucian Luka -->
            <div class="treatment-box q-pa-md q-mb-lg">
              <div class="text-weight-bold q-mb-md">Pencucian Luka</div>
              <q-option-group v-model="store.form.pengkajian_cuci_luka" :options="store.ynOptions" color="primary"
                inline dense size="sm"
                @update:model-value="(val) => { setNullIf(val, 'pengkajian_cairan_untuk_cuci_luka', 'Tidak') }" />
              <template v-if="store.form.pengkajian_cuci_luka == 'Ya'">
                <div class="q-mt-md">
                  <span class="q-mr-md text-weight-medium">Cairan :</span>
                  <q-input v-model="store.form.pengkajian_cairan_untuk_cuci_luka" autofocus outlined color="primary"
                    dense style="width:250px" maxlength="255"
                    :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
                </div>
              </template>
            </div>

            <!-- Obat Penutup Luka -->
            <div class="treatment-box q-pa-md q-mb-lg">
              <div class="text-weight-bold q-mb-md">Obat Penutup Luka</div>
              <q-option-group v-model="store.form.pengkajian_obat_penutup_luka" :options="store.ynOptions"
                color="primary" inline dense size="sm" @update:model-value="(val) => {
                  setNullIf(val, 'pengkajian_jenis_obat_penutup_luka', 'Tidak')
                  setNullIf(val, 'pengkajian_jenis_balutan_penutup_luka', 'Tidak')
                }" />
              <template v-if="store.form.pengkajian_obat_penutup_luka == 'Ya'">
                <div class="q-mt-md row q-col-gutter-md items-center">
                  <div class="col-auto">
                    <span class="text-weight-medium">Jenis Obat :</span>
                  </div>
                  <div class="col">
                    <q-input v-model="store.form.pengkajian_jenis_obat_penutup_luka" outlined color="primary" dense
                      maxlength="255" :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
                  </div>
                  <div class="col-auto">
                    <span class="text-weight-medium">Balutan :</span>
                  </div>
                  <div class="col">
                    <q-input v-model="store.form.pengkajian_jenis_balutan_penutup_luka" outlined color="primary" dense
                      maxlength="255" :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
                  </div>
                </div>
              </template>
            </div>
          </q-card-section>
        </q-card>

        <!-- ===== SECTION 4: LUARAN ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header bg-teal">
            <div class="text-h6 text-weight-bold text-white">
              <q-icon name="check_circle" class="q-mr-md" />LUARAN
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-6">
                <div class="text-weight-bold q-mb-md text-grey-8">Luaran Utama</div>
                <div class="outcome-box q-pa-md">
                  <q-option-group v-model="store.form.luaran_utama" :options="store.optionLuarans" color="primary"
                    type="checkbox" dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div class="text-weight-bold q-mb-md text-grey-8">Kriteria Hasil (3x24 jam)</div>
                <div class="outcome-box q-pa-md">
                  <q-option-group v-model="store.form.luaran_hasil" :options="store.optionHasils" color="primary"
                    type="checkbox" dense size="sm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- ===== SECTION 5: INTERVENSI DAN IMPLEMENTASI ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header bg-purple">
            <div class="text-h6 text-weight-bold text-white">
              <q-icon name="build" class="q-mr-md" />INTERVENSI DAN IMPLEMENTASI
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- Intervensi Utama & Pendukung -->
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-6">
                <div class="text-weight-bold q-mb-md text-grey-8">Intervensi Utama</div>
                <div class="intervention-box q-pa-md">
                  <q-option-group v-model="store.form.intervensi_utama" :options="store.optionIntervensiUtamas"
                    color="primary" type="checkbox" dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div class="text-weight-bold q-mb-md text-grey-8">Intervensi Pendukung</div>
                <div class="intervention-box q-pa-md">
                  <q-option-group v-model="store.form.intervensi_pendukung" :options="store.optionIntervensiPendukungs"
                    color="primary" type="checkbox" dense size="sm" />
                </div>
              </div>
            </div>

            <!-- Implementasi -->
            <div class="text-subtitle1 text-weight-bold text-primary q-mb-md q-mt-lg">IMPLEMENTASI</div>

            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-md-4">
                <div class="text-weight-bold q-mb-md text-grey-8">Observasi</div>
                <div class="impl-box q-pa-md">
                  <q-option-group v-model="store.form.implementasi_observasi" :options="store.optionObservasis"
                    color="primary" type="checkbox" dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-md-4">
                <div class="text-weight-bold q-mb-md text-grey-8">Terapeutik</div>
                <div class="impl-box q-pa-md">
                  <q-option-group v-model="store.form.implementasi_terupetik" :options="store.optionTerupetiks"
                    color="primary" type="checkbox" dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-md-4">
                <div class="text-weight-bold q-mb-md text-grey-8">Kolaborasi</div>
                <div class="impl-box q-pa-md">
                  <q-option-group v-model="store.form.implementasi_kolaborasi" :options="store.optionKolaborasis"
                    color="primary" type="checkbox" dense size="sm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- ===== SECTION 6: EVALUASI ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header bg-indigo">
            <div class="text-h6 text-weight-bold text-white">
              <q-icon name="assessment" class="q-mr-md" />EVALUASI
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- Tanggal & Jam Evaluasi -->
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-6">
                <app-input-date-human label="Tanggal Evaluasi" outlined :model="store.display.tanggal_eval"
                  @db-model="(val) => { store.form.eval_tanggal = val }"
                  @set-display="(val) => { store.display.tanggal_eval = val }" />
              </div>
              <div class="col-xs-12 col-md-6">
                <app-input-date :model="store.form.eval_jam" label="Jam Evaluasi" :type-date="false" dense outlined
                  @set-model="(val) => { store.form.eval_jam = val }" />
              </div>
            </div>

            <!-- SOAP -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">SOAP</div>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-md-6">
                <q-input v-model="store.form.eval_subjective" label="Subjektif (S)" outlined type="textarea" rows="3" />
              </div>
              <div class="col-xs-12 col-md-6">
                <q-input v-model="store.form.eval_objective" label="Objektif (O)" outlined type="textarea" rows="3" />
              </div>
            </div>

            <!-- Kondisi Luka -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Kondisi Luka</div>
            <div class="wound-condition-box q-pa-md q-mb-lg">
              <div class="row q-col-gutter-lg">
                <div class="col-xs-12 col-md-6">
                  <div class="text-weight-medium q-mb-sm">Kerusakan Jaringan</div>
                  <q-option-group v-model="store.form.eval_kerusakan_jaringan" :options="store.ynOptions"
                    color="primary" inline dense size="sm" />
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="text-weight-medium q-mb-sm">Kemerahan</div>
                  <q-option-group v-model="store.form.eval_kemerahan" :options="store.ynOptions" color="primary" inline
                    dense size="sm" />
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="text-weight-medium q-mb-sm">Oedem Daerah Incisi</div>
                  <q-option-group v-model="store.form.eval_oedem_daerah_incici" :options="store.ynOptions"
                    color="primary" inline dense size="sm" />
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="text-weight-medium q-mb-sm">Haematon</div>
                  <q-option-group v-model="store.form.eval_haematon" :options="store.ynOptions" color="primary" inline
                    dense size="sm" />
                </div>
              </div>
            </div>

            <!-- Cairan Drainase -->
            <div class="treatment-box q-pa-md q-mb-lg">
              <div class="text-weight-bold q-mb-md">Cairan Drainase</div>
              <q-option-group v-model="store.form.eval_cairan_drainase" :options="store.ynOptions" color="primary"
                inline dense size="sm"
                @update:model-value="(val) => { setNullIf(val, 'eval_jenis_cariran_drainase', 'Tidak') }" />
              <template v-if="store.form.eval_cairan_drainase == 'Ya'">
                <div class="q-mt-md">
                  <span class="q-mr-md text-weight-medium">Jenis :</span>
                  <q-input v-model="store.form.eval_jenis_cariran_drainase" outlined autofocus color="primary" dense
                    style="width:250px" maxlength="255"
                    :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
                </div>
              </template>
            </div>

            <!-- Vital Signs Evaluasi -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Vital Signs Akhir</div>
            <div class="vital-box q-pa-md q-mb-lg">
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">Tensi</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.eval_td_sis" label="Sis" outlined dense /></div>
                      <div class="col-auto">/</div>
                      <div class="col"><app-input v-model="store.form.eval_td_dia" label="Dia" outlined dense /></div>
                      <div class="col-auto">mmHg</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">Suhu</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.eval_suhu" label="Suhu" outlined dense /></div>
                      <div class="col-auto">°C</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">RR</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.eval_rr" label="RR" outlined dense /></div>
                      <div class="col-auto">x/mnt</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">HR</span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><app-input v-model="store.form.eval_hr" label="HR" outlined dense /></div>
                      <div class="col-auto">x/mnt</div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-4">
                  <div class="input-group">
                    <span class="label">SpO<sub>2</sub></span>
                    <div class="row items-center q-col-gutter-xs">
                      <div class="col"><q-input v-model="store.form.eval_spo2" label="SpO2" outlined dense /></div>
                      <div class="col-auto">%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assesment & Plan -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Assesment & Plan</div>
            <div class="assessment-box q-pa-md q-mb-lg">
              <div class="row q-col-gutter-lg">
                <div class="col-xs-12 col-md-6">
                  <div class="text-weight-medium q-mb-sm">A: Resiko Infeksi</div>
                  <q-option-group v-model="store.form.eval_a_resiko_infeksi" :options="store.optionResikoInfeksis"
                    color="primary" inline dense size="sm" />
                </div>
                <div class="col-xs-12 col-md-6">
                  <div class="text-weight-medium q-mb-sm">P: Plan</div>
                  <q-option-group v-model="store.form.eval_p" :options="store.optionPs" color="primary" inline dense
                    size="sm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Action Buttons -->
        <div class="row justify-end q-mt-lg sticky-buttons">
          <q-btn label="Simpan Data" color="primary" icon="save" rounded no-caps glossy :loading="store.loading"
            :disable="store.loading" @click="store.simpan(pasien)" class="q-px-xl" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsuhanKeperawatanStore } from 'src/stores/simrs/kamaroperasi/asuhan/asuhanKeperawatan'
import { onMounted, computed, watch } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useAsuhanKeperawatanStore()

function ambilTidakanOperasi (val) {
  const data = val?.length > 0 ? val?.map(v => v?.mastertindakanoperasi?.rs2).join(', ') : 'Belum ada Tindakan Operasi'
  return data
}

function setNullIf (value, keyToSet, condition) {
  if (value == condition) {
    store.form[keyToSet] = null
  }
}

const lapOpMulai = computed(() => {
  const lap = props.pasien?.laporanop
  if (Array.isArray(lap) && lap.length > 0) {
    const item = lap.find(x => x.rs11) || lap[0]
    return item?.rs11 ? item.rs11.substring(0, 5) : ''
  } else if (lap && typeof lap === 'object') {
    return lap.rs11 ? lap.rs11.substring(0, 5) : ''
  }
  return ''
})

const lapOpSelesai = computed(() => {
  const lap = props.pasien?.laporanop
  if (Array.isArray(lap) && lap.length > 0) {
    const item = lap.find(x => x.rs12) || lap[0]
    return item?.rs12 ? item.rs12.substring(0, 5) : ''
  } else if (lap && typeof lap === 'object') {
    return lap.rs12 ? lap.rs12.substring(0, 5) : ''
  }
  return ''
})

watch([lapOpMulai, lapOpSelesai], ([newMulai, newSelesai]) => {
  if (newMulai && !store.form.pengkajian_jam_mulai) {
    store.form.pengkajian_jam_mulai = newMulai
  }
  if (newSelesai && !store.form.pengkajian_jam_selesai) {
    store.form.pengkajian_jam_selesai = newSelesai
  }
}, { immediate: true })

onMounted(async () => {
  await store.getData(props.pasien)
  if (lapOpMulai.value && !store.form.pengkajian_jam_mulai) {
    store.form.pengkajian_jam_mulai = lapOpMulai.value
  }
  if (lapOpSelesai.value && !store.form.pengkajian_jam_selesai) {
    store.form.pengkajian_jam_selesai = lapOpSelesai.value
  }
})
</script>

<style lang="scss" scoped>
.style-form {
  max-width: 1400px;
  margin: 0 auto;
}

.header-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none !important;
}

.card-section {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;

  .section-header {
    background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%);
    border-bottom: 3px solid #1976d2;
    padding: 16px !important;

    &.bg-negative {
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      border-bottom-color: #d32f2f;
    }

    &.bg-teal {
      background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
      border-bottom-color: #00897b;
    }

    &.bg-purple {
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      border-bottom-color: #7b1fa2;
    }

    &.bg-indigo {
      background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
      border-bottom-color: #303f9f;
    }
  }
}

.info-box {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #90caf9;
  border-left: 4px solid #1976d2;
  border-radius: 8px;
}

.time-box,
.vital-box {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border: 1px solid #e0e8f0;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.factor-box,
.exam-box {
  background-color: #fafbfc;
  border: 1px solid #e0e8f0;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #1976d2;
  }
}

.treatment-box {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 1px solid #ffcc80;
  border-left: 4px solid #f57c00;
  border-radius: 8px;
}

.wound-condition-box {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  border: 1px solid #f48fb1;
  border-left: 4px solid #c2185b;
  border-radius: 8px;
}

.outcome-box {
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  border: 1px solid #80cbc4;
  border-radius: 6px;
}

.intervention-box {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border: 1px solid #d1c4e9;
  border-radius: 6px;
}

.impl-box {
  background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
  border: 1px solid #9fa8da;
  border-radius: 6px;
}

.assessment-box {
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  border: 1px solid #80cbc4;
  border-radius: 8px;
}

.input-group {
  .label {
    display: block;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
    font-size: 12px;
    text-transform: uppercase;
  }
}

.sticky-buttons {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
  z-index: 10;
  text-align: right;
}

.f-16 {
  font-size: 16px;
}

.f-14 {
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .card-section {
    margin-bottom: 1rem;
  }

  .input-group {
    margin-bottom: 12px;
  }
}
</style>
