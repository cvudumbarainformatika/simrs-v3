<template>
  <div class="fit column no-wrap bg-grey-2">

    <!-- Header -->
    <div class="row items-center justify-between q-pa-sm q-px-md bg-white border-b shadow-sm col-auto">
      <div class="text-subtitle2 text-bold text-indigo-10 flex items-center">
        <q-icon name="icon-mat-assignment_turned_in" class="q-mr-sm" size="sm" />
        FORMULIR MANAJEMEN PELAYANAN PASIEN (MPP)
      </div>
      <div class="row q-gutter-x-sm">
        <q-chip dense color="indigo-1" text-color="indigo-10" icon="icon-mat-today" size="sm">
          {{ today }}
        </q-chip>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !items.length" class="col flex flex-center bg-grey-2">
      <div class="text-center q-pa-xl">
        <q-spinner-dots size="50px" color="indigo-10" />
        <div class="text-body2 text-grey-7 q-mt-md">Memuat data skrining pasien...</div>
      </div>
    </div>

    <!-- Body: 2 kolom -->
    <div v-else-if="items.length > 0" class="col q-pa-md mpp-grid-container">
      <div class="row q-col-gutter-md mpp-grid">

        <!-- ═══ KIRI: FORM ═══ -->
        <div class="col-xs-12 col-md-7 mpp-col-left column no-wrap">
          <div class="col scroll">
            <q-list>

              <!-- ── BAGIAN 1: SKRINING MPP ── -->
              <q-expansion-item
                v-model="sec.skrining"
                header-class="bg-indigo-10 text-white text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
                expand-icon-class="text-white"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm full-width">
                    <q-icon name="icon-mat-fact_check" size="xs" />
                    <span>Skrining MPP</span>
                    <q-space />
                    <q-badge
                      :color="skriningScore >= 3 ? 'positive' : 'white'"
                      :text-color="skriningScore >= 3 ? 'white' : 'grey-8'"
                      class="text-caption"
                    >
                      {{ skriningScore >= 3 ? 'PASIEN MPP' : 'Bukan MPP' }} (Skor: {{ skriningScore }})
                    </q-badge>
                  </div>
                </template>

                <q-list separator class="bg-white">

                  <!-- 1. Usia -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Usia</q-item-label>
                      <div class="q-mt-sm row q-gutter-x-lg">
                        <q-radio v-model="form.skrining.usia" val="Anak-anak" label="Anak-anak" dense color="indigo-10" size="sm" />
                        <q-radio v-model="form.skrining.usia" val="Dewasa" label="Dewasa" dense color="indigo-10" size="sm" />
                        <q-radio v-model="form.skrining.usia" val="Lansia" label="Lansia (Geriatri)" dense color="indigo-10" size="sm" />
                      </div>
                    </q-item-section>
                  </q-item>

                  <!-- 2. Kognitif Rendah -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Pasien dengan Kognitif yang Rendah</q-item-label>
                      <q-item-label caption>Memiliki kendala pemahaman, demensia, atau gangguan kognitif lainnya</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.kognitif_rendah" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 3. Resiko Tinggi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Pasien dengan Resiko Tinggi</q-item-label>
                      <q-item-label caption>Kondisi klinis kritis, risiko jatuh tinggi, risiko infeksi tinggi, dll.</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.resiko_tinggi" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 4. Potensi Komplain Tinggi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Potensi Komplain Tinggi</q-item-label>
                      <q-item-label caption>Adanya riwayat ketidakpuasan terhadap pelayanan atau keluarga yang sangat kritis</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.potensi_komplain" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 5. Kasus Penyakit -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Kasus Penyakit</q-item-label>
                      <div class="q-mt-sm row q-gutter-x-lg">
                        <q-radio v-model="form.skrining.kasus_penyakit" val="Akut" label="Akut" dense color="indigo-10" size="sm" />
                        <q-radio v-model="form.skrining.kasus_penyakit" val="Kronis" label="Kronis" dense color="indigo-10" size="sm" />
                        <q-radio v-model="form.skrining.kasus_penyakit" val="Komplek" label="Komplek" dense color="indigo-10" size="sm" />
                        <q-radio v-model="form.skrining.kasus_penyakit" val="Terminal" label="Terminal" dense color="indigo-10" size="sm" />
                      </div>
                    </q-item-section>
                  </q-item>

                  <!-- 6. Status Fungsional ADL -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Status Fungsional Rendah, Kebutuhan Bantuan ADL (Activity Daily Living) yang Tinggi dan Membutuhkan Pendampingan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.keterbatasan_adl" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 7. Riwayat Peralatan Medis -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">7.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Riwayat Penggunaan Peralatan Medis</q-item-label>
                      <div class="q-mt-sm">
                        <q-checkbox v-model="form.skrining.pakai_alat_medis" label="Ya, menggunakan peralatan medis khusus" color="indigo-10" dense size="sm" />
                      </div>
                      <q-slide-transition>
                        <div v-show="form.skrining.pakai_alat_medis" class="q-mt-sm">
                          <q-input
                            v-model="form.skrining.riwayatalat_medis"
                            outlined
                            placeholder="Sebutkan jenis peralatan medis khusus yang digunakan..."
                            class="text-caption"
                            dense
                          />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                  </q-item>

                  <!-- 8. Riwayat Psikologis -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">8.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Riwayat Psikologis</q-item-label>
                      <div class="q-mt-sm row q-col-gutter-sm">
                        <div v-for="opsi in opsiPsikologis" :key="opsi.value" class="col-xs-12 col-sm-6">
                          <q-checkbox v-model="form.skrining.riwayat_psikologis" :val="opsi.value" :label="opsi.label" color="indigo-10" dense size="sm" />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>

                  <!-- 9. Readmisi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">9.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Readmisi &lt; dari 30 Hari dengan Diagnosa yang Sama</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.readmisi" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 10. Biaya Tinggi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">10.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Perkiraan Asuhan dengan Biaya Tinggi</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.biaya_tinggi" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 11. Pembiayaan Kompleks -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">11.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Kemungkinan Sistem Pembiayaan yang Komplek</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.pembiayaan_komplek" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 12. LOS -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">12.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Kasus yang Melebihi Lama Rata-rata Dirawat</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.melebihi_los" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 13. Rujukan / Transfer -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">13.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Transfer Pasien antar RS / Rujukan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.transfer_rujukan" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 14. Lintas Sektor -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">14.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Dibutuhkan Kerjasama Lintas Sektor</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.kerjasama_sektor" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 15. Kontinuitas Pelayanan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">15.</div>
                    <q-item-section>
                      <q-item-label class="text-body2">Kasus yang Diidentifikasi Rencana Membutuhkan Kontinuitas Pelayanan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.skrining.kontinuitas_pelayanan" color="indigo-10" size="sm" />
                    </q-item-section>
                  </q-item>

                </q-list>
              </q-expansion-item>


              <!-- ── BAGIAN 2: ASESMEN MPP (Form A) ── -->
              <q-expansion-item
                v-model="sec.asesmen"
                header-class="bg-indigo-1 text-indigo-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-medical_services" size="xs" />
                    <span>Asesmen MPP (Form A)</span>
                  </div>
                </template>
                <div class="bg-white q-pa-md q-gutter-y-md">

                  <!-- 1. Fisik, Fungsional, Kognitif -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      1. Fisik, fungsional, kognitif, kekuatan kemampuan, kemandirian
                    </div>
                    <q-input v-model="form.fisik_fungsional" outlined autogrow standout="bg-yellow-3"
                      placeholder="Uraikan kondisi fisik, fungsional, kognitif dan kemandirian pasien..." />
                  </div>

                  <!-- 2. Riwayat Kesehatan -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      2. Riwayat kesehatan
                    </div>
                    <q-input v-model="form.riwayat_kesehatan" outlined autogrow standout="bg-yellow-3"
                      placeholder="Riwayat kesehatan pasien..." />
                  </div>

                  <!-- 3. Psiko-Sosio-Kultural -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      3. Riwayat perilaku psiko-sosio-kultural
                    </div>
                    <q-input v-model="form.psiko_sosio_kultural" outlined autogrow standout="bg-yellow-3"
                      placeholder="Riwayat perilaku psiko-sosio-kultural..." />
                  </div>

                  <!-- 4. Kesehatan Mental -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      4. Kesehatan mental
                    </div>
                    <q-input v-model="form.kesehatan_mental" outlined autogrow standout="bg-yellow-3"
                      placeholder="Kondisi kesehatan mental pasien..." />
                  </div>

                  <!-- 5. Dukungan Keluarga / Support System -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      5. Tersedianya dukungan keluarga/ support system, kemampuan dari pemberi asuhan dirumah
                    </div>
                    <div class="row q-gutter-x-md q-py-xs">
                      <q-radio v-model="form.dukungan_keluarga" val="Ya" label="Ya" dense color="indigo-10" />
                      <q-radio v-model="form.dukungan_keluarga" val="Tidak" label="Tidak" dense color="indigo-10" />
                    </div>
                  </div>

                  <!-- 7. Finansial -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      7. Finansial
                    </div>
                    <div class="row q-gutter-x-md q-py-xs">
                      <q-radio v-model="form.masalah_finansial" val="Ada masalah" label="Ada / berpotensi masalah" dense color="indigo-10" />
                      <q-radio v-model="form.masalah_finansial" val="Tidak" label="Tidak" dense color="indigo-10" />
                    </div>
                  </div>

                  <!-- 8. Status Asuransi -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      8. Status asuransi
                    </div>
                    <div class="row q-gutter-x-md q-py-xs q-mb-xs">
                      <q-radio v-model="form.asuransi" val="Tidak" label="Tidak" dense color="indigo-10" />
                      <q-radio v-model="form.asuransi" val="Ya" label="Ya:" dense color="indigo-10" />
                    </div>
                    <q-slide-transition>
                      <q-input v-show="form.asuransi === 'Ya'" v-model="form.asuransi_ket"
                        outlined standout="bg-yellow-3" placeholder="Sebutkan jenis asuransi..." class="q-mt-xs" />
                    </q-slide-transition>
                  </div>

                  <!-- 9. Riwayat Penggunaan Obat -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      9. Riwayat penggunaan obat/obat
                    </div>
                    <div class="row q-gutter-x-md q-py-xs">
                      <q-radio v-model="form.pakai_alat_obat" val="Tidak" label="Tidak" dense color="indigo-10" />
                      <q-radio v-model="form.pakai_alat_obat" val="Ya" label="Ya" dense color="indigo-10" />
                    </div>
                  </div>

                  <!-- 10. Riwayat Trauma / Kekerasan -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      10. Riwayat trauma/kekerasan
                    </div>
                    <div class="row q-gutter-x-md q-py-xs q-mb-xs">
                      <q-radio v-model="form.riwayat_trauma" val="Tidak" label="Tidak" dense color="indigo-10" />
                      <q-radio v-model="form.riwayat_trauma" val="Ya" label="Ya:" dense color="indigo-10" />
                    </div>
                    <q-slide-transition>
                      <q-input v-show="form.riwayat_trauma === 'Ya'" v-model="form.riwayat_trauma_ket"
                        outlined standout="bg-yellow-3" placeholder="Uraikan riwayat trauma/kekerasan..." class="q-mt-xs" />
                    </q-slide-transition>
                  </div>

                  <!-- 11. Health Literacy -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      11. Pemahaman tentang kesehatan (Health Literacy)
                    </div>
                    <div class="row q-gutter-x-md q-py-xs q-mb-xs">
                      <q-radio v-model="form.health_literacy" val="Paham" label="Paham" dense color="indigo-10" />
                      <q-radio v-model="form.health_literacy" val="Tidak paham" label="Tidak paham tentang:" dense color="indigo-10" />
                    </div>
                    <q-slide-transition>
                      <q-input v-show="form.health_literacy === 'Tidak paham'" v-model="form.health_literacy_ket"
                        outlined standout="bg-yellow-3" placeholder="Topik yang tidak dipahami..." class="q-mt-xs" />
                    </q-slide-transition>
                  </div>

                  <!-- 13. Harapan terhadap hasil asuhan -->
                  <div class="border-b-light q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      13. Harapan terhadap hasil asuhan
                    </div>
                    <q-input v-model="form.harapan_asuhan" outlined autogrow standout="bg-yellow-3"
                      placeholder="Harapan pasien/keluarga terhadap hasil asuhan..." />
                  </div>

                  <!-- 14. Aspek Legal -->
                  <div class="q-pb-xs">
                    <div class="text-caption text-weight-bold text-indigo-10 q-mb-xs">
                      14. Aspek legal
                    </div>
                    <div class="row q-gutter-x-md q-py-xs q-mb-xs">
                      <q-radio v-model="form.aspek_legal" val="Tidak" label="Tidak" dense color="indigo-10" />
                      <q-radio v-model="form.aspek_legal" val="Ya" label="Ya:" dense color="indigo-10" />
                    </div>
                    <q-slide-transition>
                      <q-input v-show="form.aspek_legal === 'Ya'" v-model="form.aspek_legal_ket"
                        outlined standout="bg-yellow-3" placeholder="Uraikan aspek legal..." class="q-mt-xs" />
                    </q-slide-transition>
                  </div>

                </div>
              </q-expansion-item>


              <!-- ── BAGIAN 3: Identifikasi Masalah & Risiko ── -->
              <q-expansion-item
                v-model="sec.masalah"
                header-class="bg-orange-1 text-orange-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-warning_amber" size="xs" />
                    <span>Identifikasi Masalah & Risiko</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. Tingkat Asuhan -->
                  <!-- 1. Tingkat Asuhan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-orange-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Tingkat asuhan tidak sesuai panduan dan norma yang digunakan</q-item-label>
                      <q-item-label caption>Contoh: butuh ICU/ tidak</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.masalah" val="tingkat_asuhan_tidak_sesuai" color="orange-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 2. Over/Under Utilization -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-orange-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Over/under utilization pelayanan dasar panduan, norma yang digunakan</q-item-label>
                      <q-item-label caption>Contoh: pemeriksaan yang berlebih/ kurang</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.masalah" val="over_under_utilization" color="orange-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 3. Ketidakpatuhan Pasien -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-orange-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Ketidakpatuhan pasien</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.masalah" val="ketidakpatuhan_pasien" color="orange-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 4. Edukasi Kurang Memadai -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-orange-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Edukasi kurang memadai atau pemahaman yang belum memadai tentang:</div>
                        <div class="q-mt-sm q-pl-md q-gutter-y-sm">
                          <q-checkbox v-model="form.masalah" val="edukasi_proses_penyakit" label="Proses penyakit dan penatalaksanaan" color="orange-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.masalah" val="edukasi_kondisi_terkini" label="Kondisi terkini" color="orange-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.masalah" val="edukasi_daftar_obat" label="Daftar obat / health literacy" color="orange-10" dense size="sm" class="full-width" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 5. Kurangnya Dukungan Keluarga -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-orange-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Kurangnya dukungan keluarga</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.masalah" val="kurang_dukungan_keluarga" color="orange-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 6. Penurunan Determinasi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-orange-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Penurunan determinasi pasien</q-item-label>
                      <q-item-label caption>Ketika tingkat keparahan/ komplikasi meningkat</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.masalah" val="penurunan_determinasi" color="orange-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 7. Kendala Keuangan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-orange-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">7.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Kendala keuangan</q-item-label>
                      <q-item-label caption>Ketika tingkat keparahan/ komplikasi meningkat</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.masalah" val="kendala_keuangan" color="orange-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 8. Pemulangan Ditunda -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-orange-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">8.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pemulangan/ rujukan yang belum memenuhi kriteria/ditunda</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.masalah" val="pemulangan_ditunda" color="orange-10" size="sm" />
                    </q-item-section>
                  </q-item>

                </q-list>
                <div class="q-pa-md bg-white border-t">
                  <q-input
                    v-if="form.masalah.length"
                    v-model="form.masalah_ket"
                    outlined autogrow standout="bg-yellow-3"
                    placeholder="Keterangan masalah tambahan..."
                  />
                </div>
              </q-expansion-item>

              <!-- ── BAGIAN 4: Sasaran MPP ── -->
              <q-expansion-item
                v-model="sec.sasaran"
                header-class="bg-green-1 text-green-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-flag" size="xs" />
                    <span>Sasaran MPP</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. Asuhan Pasien -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Asuhan pasien selama dirawat sesuai dengan panduan dan norma yang digunakan asuhan profesional Pemberi Asuhan (PPA)</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="asuhan_sesuai_ppa" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 2. Patuh Asuhan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien/keluarga selama dirawat patuh pada asuhan Profesional Pemberi Asuhan (PPA)</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="patuh_asuhan_ppa" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 3. Paham Akan -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-green-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Pasien/ keluarga paham akan:</div>
                        <div class="q-mt-sm q-pl-md q-gutter-y-sm">
                          <q-checkbox v-model="form.sasaran" val="paham_proses_penyakit" label="Proses penyakit" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.sasaran" val="paham_penatalaksanaan" label="Penatalaksanaan" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.sasaran" val="paham_kondisi_terkini" label="Kondisi terkini" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.sasaran" val="paham_daftar_obat" label="Daftar obat yang diberikan" color="green-10" dense size="sm" class="full-width" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 4. Dukungan Sosial -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien selama perawatan mendapatkan dukungan keluarga, teman, maupun tetangga</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="dukungan_sosial" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 5. Mengambil Keputusan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien dan keluarga dapat mengambil keputusan ketika tingkat keparahan dan komplikasi</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="ambil_keputusan" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 6. Bebas Tanggungan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Tidak ada tanggungan pembayaran saat pasien pulang</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="bebas_tanggungan" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 7. Rujukan Sesuai -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">7.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien mendapatkan tempat rujukan yang sesuai</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="rujukan_sesuai" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 8. Edukasi Rencana Pulang -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">8.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien/ keluarga mendapatkan edukasi yang sesuai sebelum pulang dan alternatifnya</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="edukasi_pulang" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 9. Komplain Teratasi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">9.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Tidak ada komplain terhadap layanan/ komplain teratasi pada saat pulang</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="komplain_teratasi" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 10. Kemandirian Pasien -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">10.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien dan keluarga menunjukkan kemandirian dalam melakukan perawatan untuk persiapan pulang</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.sasaran" val="kemandirian_pulang" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                </q-list>
                <div class="q-pa-md bg-white border-t">
                  <q-input
                    v-if="form.sasaran.length"
                    v-model="form.sasaran_ket"
                    outlined autogrow standout="bg-yellow-3"
                    placeholder="Keterangan sasaran tambahan..."
                  />
                </div>
              </q-expansion-item>

              <!-- ── BAGIAN 5: Perencanaan (Form A) ── -->
              <q-expansion-item
                v-model="sec.perencanaan"
                header-class="bg-green-1 text-green-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-event_note" size="xs" />
                    <span>Perencanaan MPP</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. Lakukan pendekatan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Lakukan pendekatan dengan pasien dan keluarga/ dokter</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="pendekatan_pasien_keluarga" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 2. Rencanakan koordinasi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Rencanakan dan koordinasi dengan PPA untuk memberikan informasi kepada dan keluarga tentang penyakit dan asuhan akan diberikan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="koordinasi_informasi_asuhan" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 3. Validasi rencana -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Validasi rencana asuhan konsisten panduan, norma yang digunakan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="validasi_rencana_asuhan" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 4. Rencanakan keterlibatan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Rencanakan keterlibatan pasien dan keluarga dalam asuhan termasuk akan kemungkinan kemungkinan perubahan rencana asuhan/tindakan</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="keterlibatan_pasien_keluarga" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 5. Evaluasi perkembangan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Evaluasi perkembangan pasien dan pemahaman pasien serta keluarga akan informasi yang diberikan oleh PPA</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="evaluasi_pemahaman_ppa" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 6. Fasilitasi konflik -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Fasilitasi pasien dan keluarga untuk menangani masalah/konflik</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="fasilitasi_masalah_konflik" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 7. Pelayanan Doa -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">7.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pelayanan doa</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="pelayanan_doa" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 8. Case Meeting -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-green-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">8.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Meeting case</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.perencanaan" val="meeting_case" color="green-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 9. Kolaborasi -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-green-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">9.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Kolaborasi dengan:</div>
                        <div class="q-mt-sm q-pl-md q-gutter-y-sm">
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_keuangan" label="Bagian Keuangan" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_yanmed" label="Bidang Yanmed" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_keperawatan" label="Bidang Keperawatan" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_casemix" label="Penjaminan/ Tim Case Mix" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_asuransi" label="Penjaminan/Asuransi" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_cs" label="Customer Service" color="green-10" dense size="sm" class="full-width" />
                          
                          <!-- Unit Lain (Text Input) -->
                          <div class="full-width q-mb-xs">
                            <q-checkbox v-model="form.perencanaan" val="kolaborasi_unit_lain" label="Unit lain:" color="green-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.perencanaan.includes('kolaborasi_unit_lain')" class="q-mt-xs q-pl-lg">
                                <q-input v-model="form.kolaborasi_unit_lain_ket" outlined standout="bg-yellow-3" dense placeholder="Sebutkan unit lain..." />
                              </div>
                            </q-slide-transition>
                          </div>

                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_dinkes" label="Dinas Kesehatan" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_dinsos" label="Dinas Sosial" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_dispenduk" label="Dinas Kependudukan dan Catatan Sipil" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_polisi" label="Kepolisian" color="green-10" dense size="sm" class="full-width" />
                          <q-checkbox v-model="form.perencanaan" val="kolaborasi_lapas" label="Lapas" color="green-10" dense size="sm" class="full-width" />
                          
                          <!-- Dll (Text Input) -->
                          <div class="full-width">
                            <q-checkbox v-model="form.perencanaan" val="kolaborasi_dll" label="Dll:" color="green-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.perencanaan.includes('kolaborasi_dll')" class="q-mt-xs q-pl-lg">
                                <q-input v-model="form.kolaborasi_dll_ket" outlined standout="bg-yellow-3" dense placeholder="Sebutkan lainnya..." />
                              </div>
                            </q-slide-transition>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item>

                </q-list>
                <div class="q-pa-md bg-white border-t">
                  <q-input
                    v-if="form.perencanaan.length"
                    v-model="form.perencanaan_ket"
                    outlined autogrow standout="bg-yellow-3"
                    placeholder="Keterangan perencanaan tambahan..."
                  />
                </div>
              </q-expansion-item>

              <q-separator class="q-my-sm" color="grey-4" />
              <div class="text-caption text-grey-6 text-center q-mb-xs">— FORM B: Monitoring & Implementasi —</div>
                    <!-- ── BAGIAN 6: Monitoring (Form B) ── -->
              <q-expansion-item
                v-model="sec.monitoring"
                header-class="bg-teal-1 text-teal-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-monitor_heart" size="xs" />
                    <span>Monitoring</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. PPA dalam KIE -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">PPA dalam melakukan KIE terhadap rencana asuhan dimengerti oleh pasien dan keluarga</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.monitoring.includes('kie_dimengerti')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.monitoring_tgl.kie_dimengerti" label="Tanggal" outlined @set-model="val => form.monitoring_tgl.kie_dimengerti = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.monitoring" val="kie_dimengerti" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 2. Pertemuan pasien -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pertemuan pasien dan keluarga dengan PPA untuk rencana asuhan, persetujuan tindakan dan kemungkinan perubahan rencana asuhan</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.monitoring.includes('pertemuan_ppa')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.monitoring_tgl.pertemuan_ppa" label="Tanggal" outlined @set-model="val => form.monitoring_tgl.pertemuan_ppa = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.monitoring" val="pertemuan_ppa" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 3. Perkembangan kondisi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Perkembangan kondisi pasien respon keluarga</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.monitoring.includes('perkembangan_kondisi')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.monitoring_tgl.perkembangan_kondisi" label="Tanggal" outlined @set-model="val => form.monitoring_tgl.perkembangan_kondisi = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.monitoring" val="perkembangan_kondisi" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 4. Proses pelayanan PPK & CP -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-sm">Proses pelayanan sesuai dengan PPK dan Clinical Pathway:</div>
                        <div class="q-pl-md q-gutter-y-sm">
                          <q-radio v-model="form.monitoring_ppk_cp" val="ada_ppk" label="Ada PPK dan CP" color="teal-10" dense size="sm" class="full-width" />
                          <q-radio v-model="form.monitoring_ppk_cp" val="sesuai_ppk" label="Sesuai PPK dan CP" color="teal-10" dense size="sm" class="full-width" />
                          <q-radio v-model="form.monitoring_ppk_cp" val="tidak_sesuai_ppk" label="Tidak sesuai PPK dan CP" color="teal-10" dense size="sm" class="full-width" />
                          <q-radio v-model="form.monitoring_ppk_cp" val="tidak_ada_ppk" label="Tidak ada PPK dan CP" color="teal-10" dense size="sm" class="full-width" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 5. Billing RS -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Billing RS pasien melebihi tarif INA CBGs (Bila pasien BPJS)</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.monitoring.includes('billing_melebihi')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.monitoring_tgl.billing_melebihi" label="Tanggal" outlined @set-model="val => form.monitoring_tgl.billing_melebihi = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.monitoring" val="billing_melebihi" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 6. Koding diagnosa -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-sm">Koding diagnosa sesuai dengan INA CBGs:</div>
                        <div class="q-pl-md q-gutter-y-sm">
                          <q-radio v-model="form.monitoring_koding" val="sesuai" label="Sesuai" color="teal-10" dense size="sm" class="full-width" />
                          <div class="full-width">
                            <q-radio v-model="form.monitoring_koding" val="tidak_sesuai" label="Tidak sesuai. Dikonsulkan ke:" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.monitoring_koding === 'tidak_sesuai'" class="q-mt-xs q-pl-lg">
                                <q-input v-model="form.monitoring_koding_ket" outlined standout="bg-yellow-3" dense placeholder="Dikonsulkan ke..." />
                              </div>
                            </q-slide-transition>
                          </div>
                          <q-slide-transition>
                            <div v-show="form.monitoring_koding" class="row items-center gap-sm q-mt-sm">
                              <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                              <app-input-date :model="form.monitoring_tgl.koding_diagnosa" label="Tanggal" outlined @set-model="val => form.monitoring_tgl.koding_diagnosa = val" style="max-width: 150px;" />
                            </div>
                          </q-slide-transition>
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 7. Kendala pembiayaan -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">7.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Kendala pembiayaan</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.monitoring.includes('kendala_pembiayaan')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.monitoring_tgl.kendala_pembiayaan" label="Tanggal" outlined @set-model="val => form.monitoring_tgl.kendala_pembiayaan = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.monitoring" val="kendala_pembiayaan" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 8. Pulang secara administrasi -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">8.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pulang secara administrasi</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.monitoring.includes('pulang_administrasi')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.monitoring_tgl.pulang_administrasi" label="Tanggal" outlined @set-model="val => form.monitoring_tgl.pulang_administrasi = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.monitoring" val="pulang_administrasi" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                </q-list>
              </q-expansion-item>

              <!-- ── BAGIAN 7: Fasilitasi, Koordinasi, Komunikasi, Edukasi & Kolaborasi (Form B) ── -->
              <q-expansion-item
                v-model="sec.fasilitasi"
                header-class="bg-teal-1 text-teal-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-groups" size="xs" />
                    <span>Fasilitasi, Koordinasi, Komunikasi & Kolaborasi</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. Koordinasi dengan PPA -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-md">Koordinasi, kolaborasi dan komunikasi dengan PPA:</div>
                        
                        <div class="q-pl-md q-gutter-y-md">
                          
                          <!-- Dietisen -->
                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Dietisen</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col">
                                <q-input v-model="form.fasilitasi_ket.dietisen" outlined dense label="Mengedukasi tentang..." />
                              </div>
                              <div class="col-auto">
                                <app-input-date :model="form.fasilitasi_tgl.dietisen" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.dietisen = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <!-- DPJP -->
                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9">DPJP : Memberikan informasi tentang pemeriksaan penunjang, diagnosa, penatalaksanaan</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.fasilitasi_tgl.dpjp" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.dpjp = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <!-- Farmasi -->
                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9">Farmasi : cara minum obat dan efek samping</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.fasilitasi_tgl.farmasi" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.farmasi = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <!-- Fisioterapi -->
                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9">Fisioterapi : Latihan fisik</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.fasilitasi_tgl.fisioterapi" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.fisioterapi = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <!-- Perawat -->
                          <div class="q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Perawat</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col">
                                <q-input v-model="form.fasilitasi_ket.perawat" outlined dense label="Edukasi tentang..." />
                              </div>
                              <div class="col-auto">
                                <app-input-date :model="form.fasilitasi_tgl.perawat" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.perawat = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 2. Rencana Pemulangan Pasien -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Koordinasi dengan PPA untuk rencana pemulangan pasien dengan pelayanan pasca rawat inap</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.fasilitasi_tgl.pelayanan_pasca_rawat" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.pelayanan_pasca_rawat = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 3. Pelayanan PPK & CP -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Koordinasi dengan PPA untuk pelayanan sesuai dengan PPK dan Clinical Pathway</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.fasilitasi_tgl.pelayanan_ppk_cp" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.pelayanan_ppk_cp = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 4. Berkomunikasi dengan pasien dan keluarga -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Berkomunikasi dengan pasien dan keluarga setiap ada perubahan rencana perawatan</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.fasilitasi_tgl.perubahan_rencana" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.perubahan_rencana = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 5. Koordinasi pihak dalam RS -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Koordinasi dengan pihak dalam RS</div>
                        <div class="q-mt-sm q-pl-sm q-gutter-y-sm">
                          <q-input v-model="form.fasilitasi_ket.pihak_dalam_rs" outlined dense label="Dengan..." />
                          <div class="row items-center gap-sm">
                            <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                            <app-input-date :model="form.fasilitasi_tgl.pihak_dalam_rs" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.pihak_dalam_rs = val" style="max-width: 150px;" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 6. Koordinasi pihak luar RS -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Koordinasi dengan pihak luar RS</div>
                        <div class="q-mt-sm q-pl-sm q-gutter-y-sm">
                          <q-input v-model="form.fasilitasi_ket.pihak_luar_rs" outlined dense label="Dengan..." />
                          <div class="row items-center gap-sm">
                            <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                            <app-input-date :model="form.fasilitasi_tgl.pihak_luar_rs" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.pihak_luar_rs = val" style="max-width: 150px;" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 7. Transisi pelayanan kesehatan -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">7.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Fasilitasi pasien dalam proses transisi ke fasilitas pelayanan kesehatan lain</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.fasilitasi_tgl.transisi_faskes" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.transisi_faskes = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 8. Case Meeting -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">8.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Meeting Case</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.fasilitasi_tgl.meeting_case" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.meeting_case = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 9. Koordinasi penjaminan -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">9.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Koordinasi dengan penjaminan untuk koding pasien</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.fasilitasi_tgl.penjaminan_koding" label="Tanggal" outlined @set-model="val => form.fasilitasi_tgl.penjaminan_koding = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                </q-list>
              </q-expansion-item>


              <!-- ── BAGIAN 8: Advokasi (Form B) ── -->
              <q-expansion-item
                v-model="sec.advokasi"
                header-class="bg-teal-1 text-teal-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-record_voice_over" size="xs" />
                    <span>Advokasi</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. Pasien/Keluarga Berperan -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Pasien dan keluarga sudah berperan serta secara aktif dalam proses perawatan and pasca rawat inap</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.advokasi_tgl.peran_aktif" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.peran_aktif = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 2. Menyampaikan Kebutuhan -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-sm">Menyampaikan kebutuhan pasien kepada DPJP untuk:</div>
                        <div class="q-pl-md q-gutter-y-sm">
                          
                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Discharge Planning</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.dpjp_discharge" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.dpjp_discharge = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Konsultasi</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.dpjp_konsultasi" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.dpjp_konsultasi = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <div class="q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Pembiayaan</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.dpjp_pembiayaan" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.dpjp_pembiayaan = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 3. Menghubungi RS rujukan -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9">Menghubungi rumah sakit rujukan bila diperlukan</div>
                        <div class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.advokasi_tgl.rs_rujukan" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.rs_rujukan = val" style="max-width: 150px;" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 4. Memastikan pemeriksaan penunjang -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-sm">Memastikan pemeriksaan penunjang yang sesuai:</div>
                        <div class="q-pl-md q-gutter-y-sm">
                          
                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Laboratorium</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.pemeriksaan_lab" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.pemeriksaan_lab = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Radiologi</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.pemeriksaan_rad" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.pemeriksaan_rad = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">EEG</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.pemeriksaan_eeg" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.pemeriksaan_eeg = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <div class="border-b q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Endoscopi/Kolonoscopi</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.pemeriksaan_endo" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.pemeriksaan_endo = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                          <div class="q-pb-sm">
                            <div class="text-body2 text-grey-9 text-weight-medium">Lain-lain</div>
                            <div class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                              <div class="col-auto">
                                <app-input-date :model="form.advokasi_tgl.pemeriksaan_lain" label="Tanggal" outlined @set-model="val => form.advokasi_tgl.pemeriksaan_lain = val" style="max-width: 140px;" />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </q-item>
                </q-list>
              </q-expansion-item>

              <!-- ── BAGIAN 8: Hasil Pelayanan (Form B) ── -->
              <q-expansion-item
                v-model="sec.hasil"
                header-class="bg-teal-1 text-teal-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-done_all" size="xs" />
                    <span>Hasil Pelayanan</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. Keterlibatan Pasien & Keluarga (Level) -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-sm">Pasien dan keluarga cukup aktif terlibat dalam perkembangan kesehatan, level keterlibatan pasien sebagai berikut:</div>
                        <div class="q-pl-md q-gutter-y-sm">
                          <q-radio v-model="form.level_hasil" val="1" label="Level 1: Melepaskan diri dan kewalahan" color="teal-10" dense size="sm" class="full-width" />
                          <q-radio v-model="form.level_hasil" val="2" label="Level 2: Menjadi sadar, tetapi masih berjuang" color="teal-10" dense size="sm" class="full-width" />
                          <q-radio v-model="form.level_hasil" val="3" label="Level 3: Mengambil tindakan" color="teal-10" dense size="sm" class="full-width" />
                          <q-radio v-model="form.level_hasil" val="4" label="Level 4: Perilaku dan mendorong lebih jauh" color="teal-10" dense size="sm" class="full-width" />
                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 2. Kepatuhan Pasien -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-sm">Pasien mengerti tentang kepatuhan:</div>
                        <div class="q-pl-md q-gutter-y-sm">
                          
                          <!-- Minum obat -->
                          <q-checkbox v-model="form.hasil" val="kepatuhan_obat" label="Minum obat lanjutan" color="teal-10" dense size="sm" class="full-width" />

                          <!-- Terapi lain -->
                          <div class="full-width q-mb-xs">
                            <q-checkbox v-model="form.hasil" val="kepatuhan_terapi" label="Terapi lain:" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.hasil.includes('kepatuhan_terapi')" class="q-mt-xs q-pl-lg">
                                <q-input v-model="form.hasil_ket.terapi_lain" outlined standout="bg-yellow-3" dense placeholder="Sebutkan terapi lain..." />
                              </div>
                            </q-slide-transition>
                          </div>

                          <!-- Kebutuhan kesehatan lain -->
                          <div class="full-width">
                            <q-checkbox v-model="form.hasil" val="kepatuhan_kebutuhan" label="Kebutuhan kesehatan lain:" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.hasil.includes('kepatuhan_kebutuhan')" class="q-mt-xs q-pl-lg">
                                <q-input v-model="form.hasil_ket.kebutuhan_lain" outlined standout="bg-yellow-3" dense placeholder="Sebutkan kebutuhan kesehatan lain..." />
                              </div>
                            </q-slide-transition>
                          </div>

                        </div>
                      </div>
                    </div>
                  </q-item>

                  <!-- 3. Discharge Planning -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Discharge planning dan edukasi perawatan pasien pulang sudah ada</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.hasil" val="discharge_planning_ada" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 4. Terapi Sesuai -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien mendapat terapi yang sesuai</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.hasil" val="terapi_sesuai" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 5. Kendala Pembiayaan Tidak Ada -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Kendala pembiayaan tidak ada</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.hasil" val="kendala_pembiayaan_tidak_ada" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 6. Tidak Ada Komplain -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Tidak ada komplain</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.hasil" val="tidak_ada_komplain" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                </q-list>
              </q-expansion-item>

              <!-- ── BAGIAN 9: Terminasi (Form B) ── -->
              <q-expansion-item
                v-model="sec.terminasi"
                header-class="bg-teal-1 text-teal-10 text-weight-bold rounded-borders"
                class="section-card q-mb-sm"
              >
                <template #header>
                  <div class="row items-center q-gutter-x-sm">
                    <q-icon name="icon-mat-exit_to_app" size="xs" />
                    <span>Terminasi</span>
                  </div>
                </template>
                <q-list separator class="bg-white">

                  <!-- 1. Telah tercapainya sasaran -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Telah tercapainya sasaran manajemen pelayanan pasien</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.terminasi.includes('tujuan_tercapai')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.terminasi_tgl.tujuan_tercapai" label="Tanggal" outlined @set-model="val => form.terminasi_tgl.tujuan_tercapai = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.terminasi" val="tujuan_tercapai" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 2. Transisi faskes -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Telah terlaksananya transisi ke fasilitas pelayanan kesehatan lain</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.terminasi.includes('transisi_faskes_terlaksana')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.terminasi_tgl.transisi_faskes_terlaksana" label="Tanggal" outlined @set-model="val => form.terminasi_tgl.transisi_faskes_terlaksana = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.terminasi" val="transisi_faskes_terlaksana" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 3. Pasien menolak -->
                  <q-item class="q-py-md">
                    <div class="text-body2 text-teal-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-9">Pasien menolak manajemen pelayanan pasien</q-item-label>
                      <q-slide-transition>
                        <div v-show="form.terminasi.includes('pasien_menolak')" class="q-mt-sm row items-center gap-sm">
                          <span class="text-caption text-grey-7 q-mr-xs">Tanggal:</span>
                          <app-input-date :model="form.terminasi_tgl.pasien_menolak" label="Tanggal" outlined @set-model="val => form.terminasi_tgl.pasien_menolak = val" style="max-width: 150px;" />
                        </div>
                      </q-slide-transition>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="form.terminasi" val="pasien_menolak" color="teal-10" size="sm" />
                    </q-item-section>
                  </q-item>

                  <!-- 4. Cara pasien pulang -->
                  <q-item class="q-py-md" style="display: block;">
                    <div class="row no-wrap items-start">
                      <div class="text-body2 text-teal-10 q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                      <div class="col">
                        <div class="text-body2 text-grey-9 q-mb-sm">Cara pasien pulang:</div>
                        <div class="q-pl-md q-gutter-y-sm">

                          <!-- Diperbolehkan pulang DPJP -->
                          <div class="border-b q-pb-sm">
                            <q-radio v-model="form.cara_pulang_val" val="diperbolehkan_pulang" label="Diperbolehkan pulang oleh DPJP" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.cara_pulang_val === 'diperbolehkan_pulang'" class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                                <div class="col">
                                  <q-input v-model="form.cara_pulang_ket.kontrol_poli" outlined dense label="Kontrol ke Poli..." />
                                </div>
                                <div class="col-auto">
                                  <app-input-date :model="form.cara_pulang_tgl.kontrol_poli" label="Tanggal" outlined @set-model="val => form.cara_pulang_tgl.kontrol_poli = val" style="max-width: 140px;" />
                                </div>
                              </div>
                            </q-slide-transition>
                          </div>

                          <!-- Pulang paksa -->
                          <div class="border-b q-pb-sm">
                            <q-radio v-model="form.cara_pulang_val" val="pulang_paksa" label="Pulang paksa" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.cara_pulang_val === 'pulang_paksa'" class="q-mt-xs q-pl-md">
                                <q-input v-model="form.cara_pulang_ket.pulang_paksa_alasan" outlined dense label="Alasan..." />
                              </div>
                            </q-slide-transition>
                          </div>

                          <!-- Dirujuk -->
                          <div class="border-b q-pb-sm">
                            <q-radio v-model="form.cara_pulang_val" val="dirujuk" label="Dirujuk, ke" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.cara_pulang_val === 'dirujuk'" class="q-mt-xs q-pl-md">
                                <q-input v-model="form.cara_pulang_ket.dirujuk_ke" outlined dense label="Ke..." />
                              </div>
                            </q-slide-transition>
                          </div>

                          <!-- Melarikan diri -->
                          <div class="border-b q-pb-sm">
                            <q-radio v-model="form.cara_pulang_val" val="melarikan_diri" label="Melarikan diri" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.cara_pulang_val === 'melarikan_diri'" class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                                <div class="col-auto">
                                  <app-input-date :model="form.cara_pulang_tgl.melarikan_diri" label="Tanggal" outlined @set-model="val => form.cara_pulang_tgl.melarikan_diri = val" style="max-width: 140px;" />
                                </div>
                              </div>
                            </q-slide-transition>
                          </div>

                          <!-- Meninggal -->
                          <div class="q-pb-sm">
                            <q-radio v-model="form.cara_pulang_val" val="meninggal" label="Meninggal" color="teal-10" dense size="sm" />
                            <q-slide-transition>
                              <div v-show="form.cara_pulang_val === 'meninggal'" class="q-mt-xs q-pl-md row q-col-gutter-sm items-center">
                                <div class="col">
                                  <app-input-date :model="form.cara_pulang_tgl.meninggal" label="Tanggal" outlined @set-model="val => form.cara_pulang_tgl.meninggal = val" />
                                </div>
                                <div class="col-auto">
                                  <q-input v-model="form.cara_pulang_jam" outlined dense type="time" label="Jam" style="max-width: 120px;" />
                                </div>
                              </div>
                            </q-slide-transition>
                          </div>

                        </div>
                      </div>
                    </div>
                  </q-item>

                </q-list>
              </q-expansion-item>

            </q-list>

            <div style="height: 30px" />
          </div>

          <!-- Tombol Simpan -->
          <div class="row items-center justify-end q-pt-sm col-auto q-pr-xs">
            <q-btn
              v-if="editingId"
              label="Batal Edit"
              color="grey-7"
              no-caps flat
              class="q-mr-sm"
              @click="resetForm"
            />
            <q-btn
              :label="editingId ? 'Update Data MPP' : 'Simpan Data MPP'"
              icon="icon-mat-save"
              color="indigo-10"
              no-caps
              class="q-px-lg"
              :loading="loading"
              @click="onSubmit"
            />
          </div>
        </div>

        <!-- ═══ KANAN: RIWAYAT ═══ -->
        <div class="col-xs-12 col-md-5 mpp-col-right column no-wrap">
          <div class="bg-indigo-1 text-indigo-10 q-pa-md row items-center justify-between border-top-radius border-card no-border-bottom col-auto">
            <div class="row items-center">
              <q-icon name="icon-mat-history" size="xs" class="q-mr-sm" />
              <div class="text-subtitle2 text-bold">RIWAYAT DATA MPP</div>
            </div>
            <q-badge color="indigo-10" :label="items.length + ' Data'" />
          </div>

          <div class="col scroll q-pa-sm bg-white border-bottom-radius border-card">
            <div v-if="!items.length" class="q-pa-md text-center text-grey-6 text-caption">
              Belum ada data MPP tersimpan untuk pasien ini.
            </div>
            <div v-else>
              <transition-group name="list">
                <q-card
                  v-for="(item, i) in items"
                  :key="item.id || i"
                  class="q-mb-sm cursor-pointer relative-position border-history-card"
                  @mouseover="hoveredId = item.id"
                  @mouseleave="hoveredId = null"
                >
                  <q-card-section class="q-py-sm q-px-md">
                    <div class="row items-center justify-between q-mb-xs">
                      <div class="text-caption text-grey-6">{{ humanDate(item.created_at) }}</div>
                    </div>


                    <!-- Skrining Summary -->
                    <div v-if="displaySkriningForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('skrining') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #e8eaf6; color: #1a237e;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">SKRINING:</div>
                      <div v-for="(line, idx) in displaySkriningForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Asesmen Summary -->
                    <div v-if="displayAsesmenForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('asesmen') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #e0f2f1; color: #004d40;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">ASESMEN:</div>
                      <div v-for="(line, idx) in displayAsesmenForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Masalah Summary -->
                    <div v-if="displayMasalahForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('identifikasi_masalah') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #e0f7fa; color: #006064;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">IDENTIFIKASI MASALAH:</div>
                      <div v-for="(line, idx) in displayMasalahForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Sasaran Summary -->
                    <div v-if="displaySasaranForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('sasaran') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #e3f2fd; color: #0d47a1;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">SASARAN:</div>
                      <div v-for="(line, idx) in displaySasaranForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Perencanaan Summary -->
                    <div v-if="displayPerencanaanForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('perencanaan') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #f3e5f5; color: #4a148c;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">PERENCANAAN:</div>
                      <div v-for="(line, idx) in displayPerencanaanForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Monitoring Summary -->
                    <div v-if="displayMonitoringForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('monitoring') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #fff3e0; color: #e65100;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">MONITORING:</div>
                      <div v-for="(line, idx) in displayMonitoringForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Fasilitasi Summary -->
                    <div v-if="displayFasilitasiForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('fasilitasi') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #efebe9; color: #3e2723;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">FASILITASI:</div>
                      <div v-for="(line, idx) in displayFasilitasiForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Advokasi Summary -->
                    <div v-if="displayAdvokasiForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('advokasi') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #fbe9e7; color: #bf360c;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">ADVOKASI:</div>
                      <div v-for="(line, idx) in displayAdvokasiForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Hasil Summary -->
                    <div v-if="displayHasilForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('hasil_pelayanan') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #e8f5e9; color: #1b5e20;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">HASIL PELAYANAN:</div>
                      <div v-for="(line, idx) in displayHasilForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>

                    <!-- Terminasi Summary -->
                    <div v-if="displayTerminasiForm()?.length" class="q-my-xs q-pa-sm rounded-borders" :style="isFieldDirty('terminasi') ? 'background-color: #ffebee; color: #c62828;' : 'background-color: #ffebee; color: #b71c1c;'" style="font-size: 11px; line-height: 1.4;">
                      <div class="text-weight-bold q-mb-xs">TERMINASI:</div>
                      <div v-for="(line, idx) in displayTerminasiForm()" :key="idx">
                        • {{ line }}
                      </div>
                    </div>
                    <div class="q-mt-sm border-t q-pt-sm">
                      <div class="text-caption text-grey-7 bg-grey-1 q-pa-xs rounded-borders border-l-light">
                        <div class="flex items-center gap-xs" v-if="item.petugas">
                          <span>Oleh:</span>
                          <b class="text-grey-9">{{ item.petugas?.nama || item.kdpegsimrs }}</b>
                        </div>
                        <div class="flex items-center gap-xs q-mt-xs" v-if="item.petugas_updated">
                          <span>Diupdate Oleh:</span>
                          <b class="text-grey-9">{{ item.petugas_updated?.nama || item.kdpegsimrs_updated }}</b>
                        </div>
                      </div>
                    </div>
                  </q-card-section>

                  <!-- Overlay aksi -->
                  <div
                    v-if="hoveredId === item.id"
                    class="absolute-top-right bg-white full-height column flex-center q-px-md action-overlay"
                    style="border-left: 1px solid #ddd; right: 0; top: 0; bottom: 0; z-index: 10;"
                  >
                    <div class="flex q-gutter-x-sm">
                      <q-btn flat round size="md" icon="icon-mat-edit" color="primary" @click="onEdit(item)">
                        <q-tooltip>Edit</q-tooltip>
                      </q-btn>
                      <q-btn flat round size="md" icon="icon-mat-delete" color="negative" @click="onDelete(item.id)">
                        <q-tooltip>Hapus</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card>
              </transition-group>
              <div style="margin-bottom: 50px;" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Empty State / Bukan Pasien MPP -->
    <div v-else class="col flex flex-center q-pa-md bg-grey-2">
      <div class="text-center bg-white q-pa-xl rounded-borders shadow-sm border-card" style="max-width: 600px; width: 100%;">
        <q-icon name="icon-mat-warning" size="80px" color="orange-8" class="q-mb-md" />
        <div class="text-h6 text-bold text-indigo-10 q-mb-xs">Bukan Pasien MPP</div>
        <div class="text-body2 text-grey-8 q-mb-lg">
          (Belum Ada Skrining Dari Perawat / Bidan / Karu)
        </div>
        <div class="text-caption text-grey-6" style="line-height: 1.5;">
          Halaman formulir dan riwayat MPP hanya dapat diakses apabila pasien telah disaring dan diidentifikasi sebagai pasien MPP oleh perawat, bidan, atau kepala ruangan (Karu).
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { humanDate } from 'src/modules/formatter'
import { useMppRanapStore } from 'src/stores/simrs/ranap/mpp'

const $q = useQuasar()
const store = useMppRanapStore()

const props = defineProps({
  pasien: { type: Object, default: null }
})

// ── State / Store Connection ──────────────────────
const loading = computed(() => store.loading)
const editingId = ref(null)
const hoveredId = ref(null)
const items = computed(() => store.items)

// Fetch data saat pasien berubah
watch(() => props.pasien, (val) => {
  if (val) {
    store.getData(val)
  }
}, { immediate: true })

// Sections expanded/collapsed
const sec = reactive({
  skrining: true,
  asesmen: true,
  masalah: false,
  sasaran: false,
  perencanaan: false,
  monitoring: false,
  fasilitasi: false,
  advokasi: false,
  hasil: false,
  terminasi: false
})

const today = computed(() => new Date().toLocaleDateString('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
}))

// ── Form default ───────────────────────────────────
const skriningDefault = () => ({
  usia: null,
  kognitif_rendah: false,
  resiko_tinggi: false,
  potensi_komplain: false,
  kasus_penyakit: null,
  keterbatasan_adl: false,
  pakai_alat_medis: false,
  riwayatalat_medis: null,
  riwayat_psikologis: [],
  readmisi: false,
  biaya_tinggi: false,
  pembiayaan_komplek: false,
  melebihi_los: false,
  transfer_rujukan: false,
  kerjasama_sektor: false,
  kontinuitas_pelayanan: false
})

const formDefault = () => ({
  skrining: skriningDefault(),
  tgl_kajian: new Date().toISOString().slice(0, 10),
  fisik_fungsional: null,
  riwayat_kesehatan: null,
  psiko_sosio_kultural: null,
  kesehatan_mental: null,
  dukungan_keluarga: null,
  masalah_finansial: null,
  asuransi: null,
  asuransi_ket: null,
  pakai_alat_obat: null,
  riwayat_trauma: null,
  riwayat_trauma_ket: null,
  health_literacy: null,
  health_literacy_ket: null,
  harapan_asuhan: null,
  aspek_legal: null,
  aspek_legal_ket: null,
  masalah: [],
  masalah_ket: null,
  sasaran: [],
  sasaran_ket: null,
  perencanaan: [],
  perencanaan_ket: null,
  kolaborasi_unit_lain_ket: null,
  kolaborasi_dll_ket: null,
  monitoring: [],
  monitoring_tgl: {},
  monitoring_ppk_cp: null,
  monitoring_koding: null,
  monitoring_koding_ket: null,
  fasilitasi: [],
  fasilitasi_tgl: {},
  fasilitasi_ket: {},
  advokasi: [],
  advokasi_tgl: {},
  hasil: [],
  hasil_ket: {},
  terminasi: [],
  terminasi_tgl: {},
  cara_pulang_val: null,
  cara_pulang_ket: {},
  cara_pulang_tgl: {},
  cara_pulang_jam: null
})

// Auto-fill usia berdasarkan data pasien
watch(() => props.pasien, (p) => {
  if (!p || form.skrining.usia) return
  const usia = p.usia ?? null
  if (usia === null) return
  if (usia <= 18) form.skrining.usia = 'Anak-anak'
  else if (usia >= 60) form.skrining.usia = 'Lansia'
  else form.skrining.usia = 'Dewasa'
}, { immediate: true })

const form = reactive(formDefault())

// ── Opsi data ──────────────────────────────────────
const opsiPsikologis = [
  { label: 'Riwayat gangguan mental', value: 'gangguan_mental' },
  { label: 'Upaya bunuh diri', value: 'bunuh_diri' },
  { label: 'Krisis keluarga', value: 'krisis_keluarga' },
  { label: 'Isu sosial', value: 'isu_sosial' },
  { label: 'Pasien terlantar', value: 'pasien_terlantar' },
  { label: 'Pasien tinggal sendiri', value: 'tinggal_sendiri' },
  { label: 'Penggunaan narkoba & miras', value: 'narkoba_miras' },
  { label: 'Status Narapidana', value: 'narapidana' }
]

// Grid 2 kolom checklist skrining sederhana
const skriningKiriList = [
  { no: 2, key: 'kognitif_rendah', label: 'Kognitif Rendah' },
  { no: 3, key: 'resiko_tinggi', label: 'Resiko Tinggi' },
  { no: 4, key: 'potensi_komplain', label: 'Potensi Komplain' },
  { no: 6, key: 'keterbatasan_adl', label: 'Keterbatasan ADL' },
  { no: 9, key: 'readmisi', label: 'Readmisi < 30 Hari' },
  { no: 10, key: 'biaya_tinggi', label: 'Biaya Tinggi' }
]
const skriningKananList = [
  { no: 11, key: 'pembiayaan_komplek', label: 'Pembiayaan Kompleks' },
  { no: 12, key: 'melebihi_los', label: 'Melebihi LOS' },
  { no: 13, key: 'transfer_rujukan', label: 'Transfer / Rujukan' },
  { no: 14, key: 'kerjasama_sektor', label: 'Lintas Sektor' },
  { no: 15, key: 'kontinuitas_pelayanan', label: 'Kontinuitas Pelayanan' }
]

const skriningScore = computed(() => {
  const s = form.skrining
  let count = 0
  if (s.usia) count++
  if (s.kognitif_rendah) count++
  if (s.resiko_tinggi) count++
  if (s.potensi_komplain) count++
  if (s.kasus_penyakit) count++
  if (s.keterbatasan_adl) count++
  if (s.pakai_alat_medis) count++
  if (Array.isArray(s.riwayat_psikologis) && s.riwayat_psikologis.length > 0) count++
  if (s.readmisi) count++
  if (s.biaya_tinggi) count++
  if (s.pembiayaan_komplek) count++
  if (s.melebihi_los) count++
  if (s.transfer_rujukan) count++
  if (s.kerjasama_sektor) count++
  if (s.kontinuitas_pelayanan) count++
  return count
})





const isFieldDirty = (section) => {
  if (!items.value || items.value.length === 0) return false
  const saved = items.value[0]
  
  const parseVal = (val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return val }
    }
    return val
  }

  const isEquivalent = (val1, val2) => {
    const clean = (v) => (v === null || v === undefined ? '' : v.toString().trim())
    return clean(val1) === clean(val2)
  }

  const isArrayEquivalent = (arr1, arr2) => {
    const a1 = Array.isArray(arr1) ? arr1 : []
    const a2 = Array.isArray(arr2) ? arr2 : []
    if (a1.length !== a2.length) return false
    const sorted1 = [...a1].sort()
    const sorted2 = [...a2].sort()
    return sorted1.every((v, i) => v === sorted2[i])
  }

  const isObjectEquivalent = (obj1, obj2) => {
    const o1 = obj1 && typeof obj1 === 'object' ? obj1 : {}
    const o2 = obj2 && typeof obj2 === 'object' ? obj2 : {}
    const keys = [...new Set([...Object.keys(o1), ...Object.keys(o2)])]
    return keys.every(k => isEquivalent(o1[k], o2[k]))
  }

  if (section === 'skrining') {
    const savedSkrining = parseVal(saved.skrining) || {}
    const skriningKeys = [
      'usia', 'kognitif_rendah', 'resiko_tinggi', 'potensi_komplain', 'kasus_penyakit',
      'keterbatasan_adl', 'pakai_alat_medis', 'riwayatalat_medis', 'readmisi',
      'biaya_tinggi', 'pembiayaan_komplek', 'melebihi_los', 'transfer_rujukan',
      'kerjasama_sektor', 'kontinuitas_pelayanan'
    ]
    const keysMatch = skriningKeys.every(k => isEquivalent(form.skrining[k], savedSkrining[k]))
    const psychMatch = isArrayEquivalent(form.skrining.riwayat_psikologis, savedSkrining.riwayat_psikologis)
    return !keysMatch || !psychMatch
  }
  
  if (section === 'asesmen') {
    const savedAsesmen = parseVal(saved.asesmen) || {}
    const asesmenKeys = [
      'tgl_kajian', 'fisik_fungsional', 'riwayat_kesehatan', 'psiko_sosio_kultural',
      'kesehatan_mental', 'dukungan_keluarga', 'masalah_finansial', 'asuransi',
      'asuransi_ket', 'pakai_alat_obat', 'riwayat_trauma', 'riwayat_trauma_ket',
      'health_literacy', 'health_literacy_ket', 'harapan_asuhan', 'aspek_legal',
      'aspek_legal_ket'
    ]
    return asesmenKeys.some(key => !isEquivalent(form[key], savedAsesmen[key]))
  }

  if (section === 'identifikasi_masalah') {
    const savedMasalah = parseVal(saved.identifikasi_masalah) || {}
    const matchArray = isArrayEquivalent(form.masalah, savedMasalah.masalah)
    const matchKet = isEquivalent(form.masalah_ket, savedMasalah.masalah_ket)
    return !matchArray || !matchKet
  }

  if (section === 'sasaran') {
    const savedSasaran = parseVal(saved.sasaran) || {}
    const matchArray = isArrayEquivalent(form.sasaran, savedSasaran.sasaran)
    const matchKet = isEquivalent(form.sasaran_ket, savedSasaran.sasaran_ket)
    return !matchArray || !matchKet
  }

  if (section === 'perencanaan') {
    const savedPerencanaan = parseVal(saved.perencanaan) || {}
    const matchArray = isArrayEquivalent(form.perencanaan, savedPerencanaan.perencanaan)
    const matchKet = isEquivalent(form.perencanaan_ket, savedPerencanaan.perencanaan_ket)
    const matchKolab1 = isEquivalent(form.kolaborasi_unit_lain_ket, savedPerencanaan.kolaborasi_unit_lain_ket)
    const matchKolab2 = isEquivalent(form.kolaborasi_dll_ket, savedPerencanaan.kolaborasi_dll_ket)
    return !matchArray || !matchKet || !matchKolab1 || !matchKolab2
  }

  if (section === 'monitoring') {
    const savedMonitoring = parseVal(saved.monitoring) || {}
    const matchArray = isArrayEquivalent(form.monitoring, savedMonitoring.monitoring)
    const matchTgl = isObjectEquivalent(form.monitoring_tgl, savedMonitoring.monitoring_tgl)
    const matchPpk = isEquivalent(form.monitoring_ppk_cp, savedMonitoring.monitoring_ppk_cp)
    const matchKoding = isEquivalent(form.monitoring_koding, savedMonitoring.monitoring_koding)
    const matchKodingKet = isEquivalent(form.monitoring_koding_ket, savedMonitoring.monitoring_koding_ket)
    return !matchArray || !matchTgl || !matchPpk || !matchKoding || !matchKodingKet
  }

  if (section === 'fasilitasi') {
    const savedFasilitasi = parseVal(saved.fasilitasi) || {}
    const matchArray = isArrayEquivalent(form.fasilitasi, savedFasilitasi.fasilitasi)
    const matchTgl = isObjectEquivalent(form.fasilitasi_tgl, savedFasilitasi.fasilitasi_tgl)
    const matchKet = isObjectEquivalent(form.fasilitasi_ket, savedFasilitasi.fasilitasi_ket)
    return !matchArray || !matchTgl || !matchKet
  }

  if (section === 'advokasi') {
    const savedAdvokasi = parseVal(saved.advokasi) || {}
    const matchArray = isArrayEquivalent(form.advokasi, savedAdvokasi.advokasi)
    const matchTgl = isObjectEquivalent(form.advokasi_tgl, savedAdvokasi.advokasi_tgl)
    return !matchArray || !matchTgl
  }

  if (section === 'hasil_pelayanan') {
    const savedHasil = parseVal(saved.hasil_pelayanan) || {}
    const matchArray = isArrayEquivalent(form.hasil, savedHasil.hasil)
    const matchKet = isObjectEquivalent(form.hasil_ket, savedHasil.hasil_ket)
    const matchLevel = isEquivalent(form.level_hasil, savedHasil.level_hasil)
    return !matchArray || !matchKet || !matchLevel
  }

  if (section === 'terminasi') {
    const savedTerminasi = parseVal(saved.terminasi) || {}
    const matchArray = isArrayEquivalent(form.terminasi, savedTerminasi.terminasi)
    const matchTgl = isObjectEquivalent(form.terminasi_tgl, savedTerminasi.terminasi_tgl)
    const matchCara = isEquivalent(form.cara_pulang_val, savedTerminasi.cara_pulang_val)
    const matchCaraKet = isObjectEquivalent(form.cara_pulang_ket, savedTerminasi.cara_pulang_ket)
    const matchCaraTgl = isObjectEquivalent(form.cara_pulang_tgl, savedTerminasi.cara_pulang_tgl)
    const matchCaraJam = isEquivalent(form.cara_pulang_jam, savedTerminasi.cara_pulang_jam)
    return !matchArray || !matchTgl || !matchCara || !matchCaraKet || !matchCaraTgl || !matchCaraJam
  }

  return false
}


const displaySasaranForm = () => {
  const s = form.sasaran
  const list = []
  if (s.length > 0) {
    list.push(`Sasaran: ${s.join(', ')}`)
  }
  if (form.sasaran_ket) {
    list.push(`Keterangan: ${form.sasaran_ket}`)
  }
  return list
}

const displayAsesmenForm = () => {
  const list = []
  if (form.fisik_fungsional) list.push(`Fisik & Fungsional: ${form.fisik_fungsional}`)
  if (form.riwayat_kesehatan) list.push(`Riwayat Kesehatan: ${form.riwayat_kesehatan}`)
  if (form.psiko_sosio_kultural) list.push(`Psiko-Sosio-Kultural: ${form.psiko_sosio_kultural}`)
  if (form.kesehatan_mental) list.push(`Kesehatan Mental: ${form.kesehatan_mental}`)
  if (form.dukungan_keluarga) list.push(`Dukungan Keluarga: ${form.dukungan_keluarga}`)
  if (form.masalah_finansial) list.push(`Masalah Finansial: ${form.masalah_finansial}`)
  if (form.asuransi) {
    const ket = form.asuransi_ket ? ` (${form.asuransi_ket})` : ''
    list.push(`Asuransi: ${form.asuransi}${ket}`)
  }
  if (form.pakai_alat_obat) list.push(`Penggunaan Alat/Obat: ${form.pakai_alat_obat}`)
  if (form.riwayat_trauma) {
    const ket = form.riwayat_trauma_ket ? ` (${form.riwayat_trauma_ket})` : ''
    list.push(`Riwayat Trauma: ${form.riwayat_trauma}${ket}`)
  }
  if (form.health_literacy) {
    const ket = form.health_literacy_ket ? ` (${form.health_literacy_ket})` : ''
    list.push(`Health Literacy: ${form.health_literacy}${ket}`)
  }
  if (form.harapan_asuhan) list.push(`Harapan Asuhan: ${form.harapan_asuhan}`)
  if (form.aspek_legal) {
    const ket = form.aspek_legal_ket ? ` (${form.aspek_legal_ket})` : ''
    list.push(`Aspek Legal: ${form.aspek_legal}${ket}`)
  }
  return list
}

const displayMasalahForm = () => {
  const list = []
  if (form.masalah.length > 0) {
    list.push(`Masalah: ${form.masalah.join(', ')}`)
  }
  if (form.masalah_ket) {
    list.push(`Keterangan: ${form.masalah_ket}`)
  }
  return list
}

const displayPerencanaanForm = () => {
  const list = []
  if (form.perencanaan.length > 0) {
    list.push(`Rencana: ${form.perencanaan.join(', ')}`)
  }
  if (form.perencanaan_ket) list.push(`Keterangan: ${form.perencanaan_ket}`)
  if (form.kolaborasi_unit_lain_ket) list.push(`Kolaborasi Unit Lain: ${form.kolaborasi_unit_lain_ket}`)
  if (form.kolaborasi_dll_ket) list.push(`Kolaborasi Lain-lain: ${form.kolaborasi_dll_ket}`)
  return list
}

const displayMonitoringForm = () => {
  const list = []
  if (form.monitoring.length > 0) {
    const details = form.monitoring.map(m => {
      const tgl = form.monitoring_tgl[m] ? ` (${form.monitoring_tgl[m]})` : ''
      return `${m}${tgl}`
    })
    list.push(`Monitoring: ${details.join(', ')}`)
  }
  if (form.monitoring_ppk_cp) list.push(`PPK/CP: ${form.monitoring_ppk_cp}`)
  if (form.monitoring_koding) {
    const ket = form.monitoring_koding_ket ? ` (${form.monitoring_koding_ket})` : ''
    list.push(`Koding: ${form.monitoring_koding}${ket}`)
  }
  return list
}

const displayFasilitasiForm = () => {
  const list = []
  const labelMap = {
    dietisen: 'Dietisen',
    dpjp: 'DPJP',
    farmasi: 'Farmasi',
    fisioterapi: 'Fisioterapi',
    perawat: 'Perawat',
    pelayanan_pasca_rawat: 'Pasca Rawat',
    pelayanan_ppk_cp: 'PPK/CP',
    perubahan_rencana: 'Perubahan Rencana',
    pihak_dalam_rs: 'Pihak Dalam RS',
    pihak_luar_rs: 'Pihak Luar RS',
    transisi_faskes: 'Transisi Faskes',
    meeting_case: 'Case Meeting',
    penjaminan_koding: 'Koding & Penjaminan'
  }
  
  Object.keys(labelMap).forEach(key => {
    const tgl = form.fasilitasi_tgl?.[key]
    const ket = form.fasilitasi_ket?.[key]
    
    const hasTgl = tgl && tgl.trim() !== ''
    const hasKet = ket && ket.trim() !== ''
    
    if (hasTgl || hasKet) {
      const parts = []
      parts.push(labelMap[key])
      if (hasTgl) parts.push(`(${tgl})`)
      if (hasKet) parts.push(`[${ket}]`)
      list.push(parts.join(' '))
    }
  })
  return list
}

const displayAdvokasiForm = () => {
  const list = []
  const labelMap = {
    peran_aktif: 'Peran Aktif memfasilitasi PPA',
    dpjp_discharge: 'Discharge Planning DPJP',
    dpjp_konsultasi: 'Konsultasi DPJP',
    dpjp_pembiayaan: 'Pembiayaan DPJP',
    rs_rujukan: 'Rujukan ke RS Lain',
    pemeriksaan_lab: 'Pemeriksaan Lab',
    pemeriksaan_rad: 'Pemeriksaan Radiologi',
    pemeriksaan_eeg: 'Pemeriksaan EEG',
    pemeriksaan_endo: 'Pemeriksaan Endoskopi',
    pemeriksaan_lain: 'Pemeriksaan Lainnya'
  }
  
  Object.keys(labelMap).forEach(key => {
    const tgl = form.advokasi_tgl?.[key]
    const hasTgl = tgl && tgl.trim() !== ''
    
    if (hasTgl) {
      list.push(`${labelMap[key]} (${tgl})`)
    }
  })
  return list
}

const displayHasilForm = () => {
  const list = []
  if (form.level_hasil) list.push(`Level Capaian: ${form.level_hasil}`)
  if (form.hasil.length > 0) {
    const details = form.hasil.map(h => {
      const ket = form.hasil_ket[h] ? ` [${form.hasil_ket[h]}]` : ''
      return `${h}${ket}`
    })
    list.push(`Hasil: ${details.join(', ')}`)
  }
  return list
}

const displayTerminasiForm = () => {
  const list = []
  if (form.terminasi.length > 0) {
    const details = form.terminasi.map(t => {
      const tgl = form.terminasi_tgl[t] ? ` (${form.terminasi_tgl[t]})` : ''
      return `${t}${tgl}`
    })
    list.push(`Terminasi: ${details.join(', ')}`)
  }
  if (form.cara_pulang_val) {
    const cleanVal = form.cara_pulang_val.replace('_', ' ')
    const tgl = form.cara_pulang_tgl.cara_pulang ? ` (${form.cara_pulang_tgl.cara_pulang})` : ''
    const jam = form.cara_pulang_jam ? ` jam ${form.cara_pulang_jam}` : ''
    list.push(`Cara Pulang: ${cleanVal}${tgl}${jam}`)
  }
  return list
}

const displaySkriningForm = () => {
  const s = form.skrining
  if (!s) return []

  const list = []
  if (s.usia) list.push(`Usia: ${s.usia}`)
  if (s.kasus_penyakit) list.push(`Kasus: ${s.kasus_penyakit}`)
  
  const criteria = []
  if (s.kognitif_rendah) criteria.push('Kognitif Rendah')
  if (s.resiko_tinggi) criteria.push('Resiko Tinggi')
  if (s.potensi_komplain) criteria.push('Potensi Komplain')
  if (s.keterbatasan_adl) criteria.push('Keterbatasan ADL')
  if (s.pakai_alat_medis) {
    const alat = s.riwayatalat_medis ? ` (${s.riwayatalat_medis})` : ''
    criteria.push(`Peralatan Medis${alat}`)
  }
  if (s.readmisi) criteria.push('Readmisi < 30 Hari')
  if (s.biaya_tinggi) criteria.push('Biaya Tinggi')
  if (s.pembiayaan_komplek) criteria.push('Pembiayaan Kompleks')
  if (s.melebihi_los) criteria.push('Melebihi LOS')
  if (s.transfer_rujukan) criteria.push('Transfer/Rujukan')
  if (s.kerjasama_sektor) criteria.push('Lintas Sektor')
  if (s.kontinuitas_pelayanan) criteria.push('Kontinuitas Pelayanan')
  if (Array.isArray(s.riwayat_psikologis) && s.riwayat_psikologis.length > 0) {
    const labels = s.riwayat_psikologis.map(val => {
      const match = opsiPsikologis.find(opt => opt.value === val)
      return match ? match.label : val
    })
    criteria.push(`Masalah Psikologis: ${labels.join(', ')}`)
  }

  if (criteria.length > 0) {
    list.push(`Kriteria: ${criteria.join(', ')}`)
  }

  return list
}

// ── Actions & Data Loading ─────────────────────────
const loadDataToForm = (item) => {
  if (!item) return
  editingId.value = item.id
  
  // Clean Form B defaults first
  Object.assign(form, formDefault())
  
  // 1. Skrining (Form A)
  if (item.skrining) {
    const sData = typeof item.skrining === 'string' ? JSON.parse(item.skrining) : item.skrining
    Object.assign(form.skrining, sData)
  }
  
  // 2. Asesmen (Form A)
  if (item.asesmen) {
    const aData = typeof item.asesmen === 'string' ? JSON.parse(item.asesmen) : item.asesmen
    Object.keys(aData).forEach(key => {
      form[key] = aData[key]
    })
  }
  
  // 3. Identifikasi Masalah (Form B)
  if (item.identifikasi_masalah) {
    const mData = typeof item.identifikasi_masalah === 'string' ? JSON.parse(item.identifikasi_masalah) : item.identifikasi_masalah
    form.masalah = mData.masalah || []
    form.masalah_ket = mData.masalah_ket || null
  }
  
  // 4. Sasaran (Form B)
  if (item.sasaran) {
    const sasData = typeof item.sasaran === 'string' ? JSON.parse(item.sasaran) : item.sasaran
    form.sasaran = sasData.sasaran || []
    form.sasaran_ket = sasData.sasaran_ket || null
  }
  
  // 5. Perencanaan (Form B)
  if (item.perencanaan) {
    const pData = typeof item.perencanaan === 'string' ? JSON.parse(item.perencanaan) : item.perencanaan
    form.perencanaan = pData.perencanaan || []
    form.perencanaan_ket = pData.perencanaan_ket || null
    form.kolaborasi_unit_lain_ket = pData.kolaborasi_unit_lain_ket || null
    form.kolaborasi_dll_ket = pData.kolaborasi_dll_ket || null
  }
  
  // 6. Monitoring (Form B)
  if (item.monitoring) {
    const monData = typeof item.monitoring === 'string' ? JSON.parse(item.monitoring) : item.monitoring
    form.monitoring = monData.monitoring || []
    form.monitoring_tgl = monData.monitoring_tgl || {}
    form.monitoring_ppk_cp = monData.monitoring_ppk_cp || null
    form.monitoring_koding = monData.monitoring_koding || null
    form.monitoring_koding_ket = monData.monitoring_koding_ket || null
  }
  
  // 7. Fasilitasi (Form B)
  if (item.fasilitasi) {
    const fData = typeof item.fasilitasi === 'string' ? JSON.parse(item.fasilitasi) : item.fasilitasi
    form.fasilitasi = fData.fasilitasi || []
    form.fasilitasi_tgl = fData.fasilitasi_tgl || {}
    form.fasilitasi_ket = fData.fasilitasi_ket || {}
  }
  
  // 8. Advokasi (Form B)
  if (item.advokasi) {
    const advData = typeof item.advokasi === 'string' ? JSON.parse(item.advokasi) : item.advokasi
    form.advokasi = advData.advokasi || []
    form.advokasi_tgl = advData.advokasi_tgl || {}
  }
  
  // 9. Hasil Pelayanan (Form B)
  if (item.hasil_pelayanan) {
    const hData = typeof item.hasil_pelayanan === 'string' ? JSON.parse(item.hasil_pelayanan) : item.hasil_pelayanan
    form.hasil = hData.hasil || []
    form.hasil_ket = hData.hasil_ket || {}
    form.level_hasil = hData.level_hasil || null
  }
  
  // 10. Terminasi (Form B)
  if (item.terminasi) {
    const tData = typeof item.terminasi === 'string' ? JSON.parse(item.terminasi) : item.terminasi
    form.terminasi = tData.terminasi || []
    form.terminasi_tgl = tData.terminasi_tgl || {}
    form.cara_pulang_val = tData.cara_pulang_val || null
    form.cara_pulang_ket = tData.cara_pulang_ket || {}
    form.cara_pulang_tgl = tData.cara_pulang_tgl || {}
    form.cara_pulang_jam = tData.cara_pulang_jam || null
  }
}

// Watch list data MPP dari database untuk auto-load ke form (mengupdate data perawat)
watch(items, (newItems) => {
  if (newItems && newItems.length > 0) {
    loadDataToForm(newItems[0])
  } else {
    resetForm()
  }
}, { immediate: true })

const resetForm = () => {
  editingId.value = null
  Object.assign(form, formDefault())
}

const onEdit = (item) => {
  loadDataToForm(item)
  // Buka semua section saat edit
  Object.keys(sec).forEach(k => { sec[k] = true })
}

const onDelete = (id) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Yakin ingin menghapus data MPP ini?',
    cancel: true, persistent: true
  }).onOk(() => {
    store.deleteData(props.pasien, id)
  })
}

const onSubmit = () => {
  store.simpanData(props.pasien, form)
}
</script>

<style lang="scss" scoped>
.item-no {
  width: 24px;
  flex-shrink: 0;
  padding-top: 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1a237e;
  align-self: flex-start;
  margin-right: 12px;
}

/* Compact skrining rows */
.skrining-row {
  display: flex;
  align-items: center;
  padding: 6px 4px;
  gap: 8px;
}
.skrining-no {
  min-width: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #3949ab;
  flex-shrink: 0;
}
.skrining-no-sm {
  min-width: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #5c6bc0;
  flex-shrink: 0;
  padding-top: 1px;
}
.skrining-label {
  min-width: 130px;
  font-size: 12px;
  color: #333;
  flex-shrink: 0;
}
.skrining-ctrl {
  flex: 1;
}
.skrining-check-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-bottom: 1px solid #f5f5f5;
}
.border-b-light { border-bottom: 1px solid #eeeeee; }
.border-l-light { border-left: 1px solid #eeeeee; }
.border-b { border-bottom: 1px solid #eee; }
.border-card { border: 1px solid #e0e0e0; }
.border-top-radius { border-radius: 8px 8px 0 0; }
.border-bottom-radius { border-radius: 0 0 8px 8px; }
.no-border-bottom { border-bottom: none !important; }
.text-wrap { white-space: normal; word-break: break-word; }

.section-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.border-history-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: none;
  transition: all 0.2s ease;
  &:hover { border-color: var(--q-primary); background-color: #fbfbfe; }
}

.action-overlay {
  animation: slideIn 0.15s ease-out forwards;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(10px); }
  to   { opacity: 1; transform: translateX(0); }
}

@media (min-width: 1024px) {
  .mpp-grid-container { overflow: hidden; height: calc(100vh - 115px); }
  .mpp-grid, .mpp-col-left, .mpp-col-right { height: 100%; }
}
@media (max-width: 1023px) {
  .mpp-grid-container { overflow-y: auto; height: auto; }
  .mpp-grid, .mpp-col-left, .mpp-col-right { height: auto; }
  .mpp-col-right { margin-top: 16px; }
}
</style>