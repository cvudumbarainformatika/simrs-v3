<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN MANAJEMEN PELAYANAN PASIEN (MPP)</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="items.length">
            Formulir A & B Terbuat
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="items.length">
          <q-btn
            v-print="printObj"
            color="indigo-10"
            icon="icon-mat-print"
            label="Cetak Dokumen MPP"
            no-caps
            dense
            class="q-px-md"
          />
        </div>
      </div>
    </div>

    <!-- Container preview dokumen -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="loading && !items.length" class="text-center text-grey-6 q-pa-xl">
        <q-spinner-dots color="indigo-10" size="40px" />
        <div class="q-mt-sm">Memuat dokumen...</div>
      </div>

      <div v-else-if="!items.length" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-my-file_sign" size="64px" class="q-mb-sm" />
        <div class="text-bold">Bukan Pasien MPP</div>
        <div class="text-caption">Belum Ada Skrining Dari Perawat / Bidan / Karu.</div>
      </div>

      <div v-else id="print-mpp-document" class="column items-center q-gutter-y-md full-width">
        <div v-for="(item, idx) in items" :key="item.id" class="document-container">
          
          <!-- ── HALAMAN 1: FORMULIR A ── -->
          <div class="print-page page-1 q-mb-md">
            <!-- Kop Surat -->
            <div class="col-auto">
              <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['EVALUASI AWAL', 'MANAJEMEN PELAYANAN PASIEN (FORM A)', '']" />
            </div>

            <!-- Biodata Pasien di Bawah Header -->
            <div class="mpp-patient-info q-pa-sm q-mt-sm">
              <div class="row items-center justify-between" style="font-size: 10px;">
                <div class="col-4">Nama Pasien: <strong>{{ pasien?.nama || '-' }}</strong></div>
                <div class="col-4 text-center">No. RM: <strong>{{ pasien?.norm || '-' }}</strong></div>
                <div class="col-4 text-right">Noreg: <strong>{{ pasien?.noreg || '-' }}</strong></div>
              </div>
              <div class="row items-center justify-between q-mt-xs" style="font-size: 10px;">
                <div class="col-6">Tgl. Lahir / Usia: <strong>{{ pasien?.tgllahir || '-' }} / {{ pasien?.umur || '-' }}</strong></div>
                <div class="col-6 text-right">Jenis Kelamin: <strong>{{ pasien?.kelamin || '-' }}</strong></div>
              </div>
            </div>

            <!-- Grid 5 Kolom Formulir A -->
            <div class="mpp-grid-container q-mt-md">
              
              <!-- Kolom 1: Skrining -->
              <div class="mpp-col">
                <div class="mpp-col-header">1. SKRINING</div>
                <div class="mpp-col-content">
                  
                  <!-- 1. Usia -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">1. Usia:</span>
                    <div class="q-pl-xs">
                      <div :class="getSkrining(item).usia === 'Anak-anak' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getSkrining(item).usia === 'Anak-anak' ? '☑' : '☐' }} Anak-anak (0-18 th)
                      </div>
                      <div :class="getSkrining(item).usia === 'Dewasa' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getSkrining(item).usia === 'Dewasa' ? '☑' : '☐' }} Dewasa (18-59 th)
                      </div>
                      <div :class="getSkrining(item).usia === 'Lansia' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getSkrining(item).usia === 'Lansia' ? '☑' : '☐' }} Lansia (>= 60 th)
                      </div>
                    </div>
                  </div>

                  <!-- 2. Kognitif Rendah -->
                  <div class="q-mb-xs" :class="getSkrining(item).kognitif_rendah ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).kognitif_rendah ? '☑' : '☐' }} 2. Kognitif rendah
                  </div>

                  <!-- 3. Resiko Tinggi -->
                  <div class="q-mb-xs" :class="getSkrining(item).resiko_tinggi ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).resiko_tinggi ? '☑' : '☐' }} 3. Risiko klinis tinggi
                  </div>

                  <!-- 4. Potensi Komplain Tinggi -->
                  <div class="q-mb-xs" :class="getSkrining(item).potensi_komplain ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).potensi_komplain ? '☑' : '☐' }} 4. Potensi komplain tinggi
                  </div>

                  <!-- 5. Kasus Penyakit -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">5. Kasus Penyakit:</span>
                    <div class="q-pl-xs">
                      <div :class="getSkrining(item).kasus_penyakit === 'Akut' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getSkrining(item).kasus_penyakit === 'Akut' ? '☑' : '☐' }} Akut
                      </div>
                      <div :class="getSkrining(item).kasus_penyakit === 'Kronis' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getSkrining(item).kasus_penyakit === 'Kronis' ? '☑' : '☐' }} Kronis
                      </div>
                      <div :class="getSkrining(item).kasus_penyakit === 'Komplek' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getSkrining(item).kasus_penyakit === 'Komplek' ? '☑' : '☐' }} Komplek
                      </div>
                      <div :class="getSkrining(item).kasus_penyakit === 'Terminal' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getSkrining(item).kasus_penyakit === 'Terminal' ? '☑' : '☐' }} Terminal
                      </div>
                    </div>
                  </div>

                  <!-- 6. Keterbatasan ADL -->
                  <div class="q-mb-xs" :class="getSkrining(item).keterbatasan_adl ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).keterbatasan_adl ? '☑' : '☐' }} 6. Keterbatasan ADL berat
                  </div>

                  <!-- 7. Pakai Alat Medis -->
                  <div class="q-mb-xs">
                    <div :class="getSkrining(item).pakai_alat_medis ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getSkrining(item).pakai_alat_medis ? '☑' : '☐' }} 7. Pakai alat medis khusus
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getSkrining(item).pakai_alat_medis && getSkrining(item).riwayatalat_medis">
                      ↳ Detail: {{ getSkrining(item).riwayatalat_medis }}
                    </div>
                  </div>

                  <!-- 8. Riwayat Psikologis -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">8. Riwayat Psikologis:</span>
                    <div class="q-pl-xs">
                      <div :class="hasPsikologis(item, 'Riwayat gangguan mental') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Riwayat gangguan mental') ? '☑' : '☐' }} Ggn Mental
                      </div>
                      <div :class="hasPsikologis(item, 'Upaya bunuh diri') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Upaya bunuh diri') ? '☑' : '☐' }} Bunuh Diri
                      </div>
                      <div :class="hasPsikologis(item, 'Krisis keluarga') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Krisis keluarga') ? '☑' : '☐' }} Krisis Keluarga
                      </div>
                      <div :class="hasPsikologis(item, 'Isu sosial') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Isu sosial') ? '☑' : '☐' }} Isu Sosial
                      </div>
                      <div :class="hasPsikologis(item, 'Pasien terlantar') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Pasien terlantar') ? '☑' : '☐' }} Terlantar
                      </div>
                      <div :class="hasPsikologis(item, 'Pasien tinggal sendiri') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Pasien tinggal sendiri') ? '☑' : '☐' }} Tinggal Sendiri
                      </div>
                      <div :class="hasPsikologis(item, 'Penggunaan narkoba & minuman keras') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Penggunaan narkoba & minuman keras') ? '☑' : '☐' }} Narkoba/Miras
                      </div>
                      <div :class="hasPsikologis(item, 'Narapidana') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPsikologis(item, 'Narapidana') ? '☑' : '☐' }} Narapidana
                      </div>
                    </div>
                  </div>

                  <!-- 9. Readmisi -->
                  <div class="q-mb-xs" :class="getSkrining(item).readmisi ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).readmisi ? '☑' : '☐' }} 9. Readmisi &lt; 30 Hari
                  </div>

                  <!-- 10. Biaya Tinggi -->
                  <div class="q-mb-xs" :class="getSkrining(item).biaya_tinggi ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).biaya_tinggi ? '☑' : '☐' }} 10. Biaya Tinggi
                  </div>

                  <!-- 11. Pembiayaan Komplek -->
                  <div class="q-mb-xs" :class="getSkrining(item).pembiayaan_komplek ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).pembiayaan_komplek ? '☑' : '☐' }} 11. Pembiayaan Komplek
                  </div>

                  <!-- 12. Melebihi LOS -->
                  <div class="q-mb-xs" :class="getSkrining(item).melebihi_los ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).melebihi_los ? '☑' : '☐' }} 12. Melebihi LOS
                  </div>

                  <!-- 13. Rujukan/Transfer RS -->
                  <div class="q-mb-xs" :class="getSkrining(item).transfer_rujukan ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).transfer_rujukan ? '☑' : '☐' }} 13. Rujukan/Transfer RS
                  </div>

                  <!-- 14. Kerjasama Sektor -->
                  <div class="q-mb-xs" :class="getSkrining(item).kerjasama_sektor ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).kerjasama_sektor ? '☑' : '☐' }} 14. Kerjasama Sektor
                  </div>

                  <!-- 15. Butuh Kontinuitas -->
                  <div class="q-mb-xs" :class="getSkrining(item).kontinuitas_pelayanan ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ getSkrining(item).kontinuitas_pelayanan ? '☑' : '☐' }} 15. Butuh Kontinuitas
                  </div>

                </div>
              </div>

              <!-- Kolom 2: Asesmen -->
              <div class="mpp-col">
                <div class="mpp-col-header">2. ASESMEN</div>
                <div class="mpp-col-content">
                  
                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).fisik_fungsional ? 'mpp-item-checked' : 'mpp-item-unchecked'">1. Fisik, fungsional, kognitif:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).fisik_fungsional ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).fisik_fungsional || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).riwayat_kesehatan ? 'mpp-item-checked' : 'mpp-item-unchecked'">2. Riwayat Kesehatan:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).riwayat_kesehatan ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).riwayat_kesehatan || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).psiko_sosio_kultural ? 'mpp-item-checked' : 'mpp-item-unchecked'">3. Perilaku Psiko-Sosio-Kultural:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).psiko_sosio_kultural ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).psiko_sosio_kultural || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).kesehatan_mental ? 'mpp-item-checked' : 'mpp-item-unchecked'">4. Kesehatan Mental:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).kesehatan_mental ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).kesehatan_mental || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).dukungan_keluarga ? 'mpp-item-checked' : 'mpp-item-unchecked'">5. Dukungan Keluarga:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).dukungan_keluarga ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).dukungan_keluarga || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).masalah_finansial ? 'mpp-item-checked' : 'mpp-item-unchecked'">6. Finansial:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).masalah_finansial ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).masalah_finansial || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).asuransi ? 'mpp-item-checked' : 'mpp-item-unchecked'">7. Asuransi:</span>
                    <div class="q-pl-xs" :class="getAsesmen(item).asuransi ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).asuransi || 'Belum diisi / Tidak ada' }}
                      <span v-if="getAsesmen(item).asuransi_ket">({{ getAsesmen(item).asuransi_ket }})</span>
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).pakai_alat_obat ? 'mpp-item-checked' : 'mpp-item-unchecked'">8. Penggunaan Obat/Alat:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).pakai_alat_obat ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).pakai_alat_obat || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).riwayat_trauma ? 'mpp-item-checked' : 'mpp-item-unchecked'">9. Riwayat Trauma:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).riwayat_trauma ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).riwayat_trauma || 'Belum diisi / Tidak ada' }}
                      <span v-if="getAsesmen(item).riwayat_trauma_ket">({{ getAsesmen(item).riwayat_trauma_ket }})</span>
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).health_literacy ? 'mpp-item-checked' : 'mpp-item-unchecked'">10. Health Literacy:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).health_literacy ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).health_literacy || 'Belum diisi / Tidak ada' }}
                      <span v-if="getAsesmen(item).health_literacy_ket">({{ getAsesmen(item).health_literacy_ket }})</span>
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).harapan_asuhan ? 'mpp-item-checked' : 'mpp-item-unchecked'">11. Harapan Asuhan:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).harapan_asuhan ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).harapan_asuhan || 'Belum diisi / Tidak ada' }}
                    </div>
                  </div>

                  <div class="q-mb-xs">
                    <span :class="getAsesmen(item).aspek_legal ? 'mpp-item-checked' : 'mpp-item-unchecked'">12. Aspek Legal:</span>
                    <div class="text-justify q-pl-xs" :class="getAsesmen(item).aspek_legal ? 'text-black' : 'text-grey-5 italic'">
                      {{ getAsesmen(item).aspek_legal || 'Belum diisi / Tidak ada' }}
                      <span v-if="getAsesmen(item).aspek_legal_ket">({{ getAsesmen(item).aspek_legal_ket }})</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Kolom 3: Identifikasi Masalah -->
              <div class="mpp-col">
                <div class="mpp-col-header">3. IDENTIFIKASI MASALAH</div>
                <div class="mpp-col-content">
                  
                  <div class="q-mb-xs" :class="hasMasalah(item, 'tingkat_asuhan_tidak_sesuai') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasMasalah(item, 'tingkat_asuhan_tidak_sesuai') ? '☑' : '☐' }} 1. Tingkat asuhan tdk sesuai panduan
                  </div>

                  <div class="q-mb-xs" :class="hasMasalah(item, 'over_under_utilization') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasMasalah(item, 'over_under_utilization') ? '☑' : '☐' }} 2. Over/under utilization pelayanan
                  </div>

                  <div class="q-mb-xs" :class="hasMasalah(item, 'ketidakpatuhan_pasien') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasMasalah(item, 'ketidakpatuhan_pasien') ? '☑' : '☐' }} 3. Ketidakpatuhan pasien
                  </div>

                  <!-- 4. Edukasi kurang memadai -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">4. Edukasi kurang memadai tentang:</span>
                    <div class="q-pl-xs">
                      <div :class="hasMasalah(item, 'edukasi_proses_penyakit') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasMasalah(item, 'edukasi_proses_penyakit') ? '☑' : '☐' }} Proses penyakit & penatalaksanaan
                      </div>
                      <div :class="hasMasalah(item, 'edukasi_kondisi_terkini') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasMasalah(item, 'edukasi_kondisi_terkini') ? '☑' : '☐' }} Kondisi terkini
                      </div>
                      <div :class="hasMasalah(item, 'edukasi_daftar_obat') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasMasalah(item, 'edukasi_daftar_obat') ? '☑' : '☐' }} Daftar obat / health literacy
                      </div>
                    </div>
                  </div>

                  <div class="q-mb-xs" :class="hasMasalah(item, 'kurang_dukungan_keluarga') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasMasalah(item, 'kurang_dukungan_keluarga') ? '☑' : '☐' }} 5. Kurangnya dukungan keluarga
                  </div>

                  <div class="q-mb-xs" :class="hasMasalah(item, 'penurunan_determinasi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasMasalah(item, 'penurunan_determinasi') ? '☑' : '☐' }} 6. Penurunan determinasi pasien
                  </div>

                  <div class="q-mb-xs" :class="hasMasalah(item, 'kendala_keuangan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasMasalah(item, 'kendala_keuangan') ? '☑' : '☐' }} 7. Kendala keuangan
                  </div>

                  <div class="q-mb-xs" :class="hasMasalah(item, 'pemulangan_ditunda') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasMasalah(item, 'pemulangan_ditunda') ? '☑' : '☐' }} 8. Pemulangan/rujukan ditunda
                  </div>

                  <div class="border-t q-pt-xs text-caption q-mt-sm" v-if="getMasalah(item).masalah_ket">
                    <span class="text-weight-bold">Keterangan:</span>
                    <div class="text-justify text-grey-9">{{ getMasalah(item).masalah_ket }}</div>
                  </div>

                </div>
              </div>

              <!-- Kolom 4: Sasaran MPP -->
              <div class="mpp-col">
                <div class="mpp-col-header">4. SASARAN MPP</div>
                <div class="mpp-col-content">
                  
                  <div class="q-mb-xs" :class="hasSasaran(item, 'asuhan_sesuai_ppa') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'asuhan_sesuai_ppa') ? '☑' : '☐' }} 1. Asuhan sesuai panduan PPA
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'patuh_asuhan_ppa') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'patuh_asuhan_ppa') ? '☑' : '☐' }} 2. Pasien/keluarga patuh asuhan PPA
                  </div>

                  <!-- 3. Pasien/keluarga paham -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">3. Pasien/keluarga paham akan:</span>
                    <div class="q-pl-xs">
                      <div :class="hasSasaran(item, 'paham_proses_penyakit') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasSasaran(item, 'paham_proses_penyakit') ? '☑' : '☐' }} Proses penyakit
                      </div>
                      <div :class="hasSasaran(item, 'paham_penatalaksanaan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasSasaran(item, 'paham_penatalaksanaan') ? '☑' : '☐' }} Penatalaksanaan
                      </div>
                      <div :class="hasSasaran(item, 'paham_kondisi_terkini') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasSasaran(item, 'paham_kondisi_terkini') ? '☑' : '☐' }} Kondisi terkini
                      </div>
                      <div :class="hasSasaran(item, 'paham_daftar_obat') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasSasaran(item, 'paham_daftar_obat') ? '☑' : '☐' }} Daftar obat yang diberikan
                      </div>
                    </div>
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'dukungan_sosial') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'dukungan_sosial') ? '☑' : '☐' }} 4. Mendapatkan dukungan sosial
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'ambil_keputusan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'ambil_keputusan') ? '☑' : '☐' }} 5. Mengambil keputusan tepat
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'bebas_tanggungan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'bebas_tanggungan') ? '☑' : '☐' }} 6. Bebas tanggungan pulang
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'rujukan_sesuai') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'rujukan_sesuai') ? '☑' : '☐' }} 7. Tempat rujukan yang sesuai
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'edukasi_pulang') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'edukasi_pulang') ? '☑' : '☐' }} 8. Edukasi sebelum pulang
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'komplain_teratasi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'komplain_teratasi') ? '☑' : '☐' }} 9. Bebas komplain / teratasi
                  </div>

                  <div class="q-mb-xs" :class="hasSasaran(item, 'kemandirian_pulang') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasSasaran(item, 'kemandirian_pulang') ? '☑' : '☐' }} 10. Kemandirian pasien/keluarga
                  </div>

                  <div class="border-t q-pt-xs text-caption q-mt-sm" v-if="getSasaran(item).sasaran_ket">
                    <span class="text-weight-bold">Keterangan:</span>
                    <div class="text-justify text-grey-9">{{ getSasaran(item).sasaran_ket }}</div>
                  </div>

                </div>
              </div>

              <!-- Kolom 5: Perencanaan -->
              <div class="mpp-col">
                <div class="mpp-col-header">5. PERENCANAAN</div>
                <div class="mpp-col-content">
                  
                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'pendekatan_pasien_keluarga') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'pendekatan_pasien_keluarga') ? '☑' : '☐' }} 1. Pendekatan pasien, kel/dokter
                  </div>

                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'koordinasi_informasi_asuhan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'koordinasi_informasi_asuhan') ? '☑' : '☐' }} 2. Rencanakan & koordinasi PPA
                  </div>

                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'validasi_rencana_asuhan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'validasi_rencana_asuhan') ? '☑' : '☐' }} 3. Validasi rencana asuhan
                  </div>

                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'keterlibatan_pasien_keluarga') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'keterlibatan_pasien_keluarga') ? '☑' : '☐' }} 4. Rencanakan keterlibatan kel.
                  </div>

                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'evaluasi_pemahaman_ppa') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'evaluasi_pemahaman_ppa') ? '☑' : '☐' }} 5. Evaluasi pemahaman & perkemb.
                  </div>

                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'fasilitasi_masalah_konflik') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'fasilitasi_masalah_konflik') ? '☑' : '☐' }} 6. Fasilitasi tangani konflik
                  </div>

                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'pelayanan_doa') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'pelayanan_doa') ? '☑' : '☐' }} 7. Pelayanan doa
                  </div>

                  <div class="q-mb-xs" :class="hasPerencanaan(item, 'meeting_case') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasPerencanaan(item, 'meeting_case') ? '☑' : '☐' }} 8. Meeting case
                  </div>

                  <!-- 9. Kolaborasi -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">9. Kolaborasi dengan:</span>
                    <div class="q-pl-xs">
                      <div :class="hasPerencanaan(item, 'kolaborasi_keuangan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_keuangan') ? '☑' : '☐' }} Bag Keuangan
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_yanmed') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_yanmed') ? '☑' : '☐' }} Bid Yanmed
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_keperawatan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_keperawatan') ? '☑' : '☐' }} Bid Keperawatan
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_casemix') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_casemix') ? '☑' : '☐' }} Penjaminan/CaseMix
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_asuransi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_asuransi') ? '☑' : '☐' }} Penjaminan/Asuransi
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_cs') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_cs') ? '☑' : '☐' }} Customer Service
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_unit_lain') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_unit_lain') ? '☑' : '☐' }} Unit Lain
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="hasPerencanaan(item, 'kolaborasi_unit_lain') && getPerencanaan(item).kolaborasi_unit_lain_ket">
                        ↳ Ket: {{ getPerencanaan(item).kolaborasi_unit_lain_ket }}
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_dinkes') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_dinkes') ? '☑' : '☐' }} Dinas Kesehatan
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_dinsos') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_dinsos') ? '☑' : '☐' }} Dinas Sosial
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_dispenduk') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_dispenduk') ? '☑' : '☐' }} Dispendukcapil
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_polisi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_polisi') ? '☑' : '☐' }} Kepolisian
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_lapas') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_lapas') ? '☑' : '☐' }} Lapas
                      </div>
                      <div :class="hasPerencanaan(item, 'kolaborasi_dll') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasPerencanaan(item, 'kolaborasi_dll') ? '☑' : '☐' }} Dll
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="hasPerencanaan(item, 'kolaborasi_dll') && getPerencanaan(item).kolaborasi_dll_ket">
                        ↳ Ket: {{ getPerencanaan(item).kolaborasi_dll_ket }}
                      </div>
                    </div>
                  </div>

                  <div class="border-t q-pt-xs text-caption q-mt-sm" v-if="getPerencanaan(item).perencanaan_ket">
                    <span class="text-weight-bold">Keterangan:</span>
                    <div class="text-justify text-grey-9">{{ getPerencanaan(item).perencanaan_ket }}</div>
                  </div>

                </div>
              </div>

            </div>

            <!-- Footer Tanda Tangan MPP -->
            <div class="row justify-end q-mt-xl q-pr-md" style="font-size: 11px;">
              <div class="text-center" style="width: 250px;">
                <div>Probolinggo, {{ humanDate(item.created_at) }}</div>
                <div class="text-weight-bold q-mt-xs">Manajer Pelayanan Pasien</div>
                <div class="q-my-md flex justify-center items-center" style="height: 70px;">
                  <app-qr-petugas
                    :noreg="item.noreg"
                    :jnssurat="'MPP-FORM-A.png'"
                    :asal="'RANAP'"
                    :kdpegsimrs="item.kdpegsimrs_updated || item.kdpegsimrs"
                    width="70px"
                    height="70px"
                  />
                </div>
                <div class="text-weight-bold text-underline">
                  {{ item.petugas_updated?.nama || item.petugas?.nama || '-' }}
                </div>
                <div class="text-grey-7">NIP. {{ item.petugas_updated?.nip || item.petugas?.nip || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Page Break Halaman -->
          <div class="page-break" />

          <!-- ── HALAMAN 2: FORMULIR B ── -->
          <div class="print-page page-2">
            <!-- Kop Surat -->
            <div class="col-auto">
              <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="['CATATAN IMPLEMENTASI', 'MANAJEMEN PELAYANAN PASIEN (FORM B)', '']" />
            </div>

            <!-- Biodata Pasien di Bawah Header -->
            <div class="mpp-patient-info q-pa-sm q-mt-sm">
              <div class="row items-center justify-between" style="font-size: 10px;">
                <div class="col-4">Nama Pasien: <strong>{{ pasien?.nama || '-' }}</strong></div>
                <div class="col-4 text-center">No. RM: <strong>{{ pasien?.norm || '-' }}</strong></div>
                <div class="col-4 text-right">Noreg: <strong>{{ pasien?.noreg || '-' }}</strong></div>
              <div class="row items-center justify-between q-mt-xs" style="font-size: 10px;">
                <div class="col-6">Tgl. Lahir / Usia: <strong>{{ pasien?.tgllahir || '-' }} / {{ pasien?.umur || '-' }}</strong></div>
                <div class="col-6 text-right">Jenis Kelamin: <strong>{{ pasien?.kelamin || '-' }}</strong></div>
              </div>
            </div>

            <!-- Grid 5 Kolom Formulir B -->
            <div class="mpp-grid-container q-mt-md">
              
              <!-- Kolom 1: Monitoring -->
              <div class="mpp-col">
                <div class="mpp-col-header">1. MONITORING</div>
                <div class="mpp-col-content">
                  
                  <!-- 1. KIE Dimengerti -->
                  <div class="q-mb-xs">
                    <div :class="getMonTgl(item, 'kie_dimengerti') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getMonTgl(item, 'kie_dimengerti') ? '☑' : '☐' }} 1. KIE Dimengerti PPA
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getMonTgl(item, 'kie_dimengerti')">
                      ↳ Tgl: {{ getMonTgl(item, 'kie_dimengerti') }}
                    </div>
                  </div>

                  <!-- 2. Pertemuan PPA -->
                  <div class="q-mb-xs">
                    <div :class="getMonTgl(item, 'pertemuan_ppa') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getMonTgl(item, 'pertemuan_ppa') ? '☑' : '☐' }} 2. Pertemuan PPA
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getMonTgl(item, 'pertemuan_ppa')">
                      ↳ Tgl: {{ getMonTgl(item, 'pertemuan_ppa') }}
                    </div>
                  </div>

                  <!-- 3. Perkembangan Kondisi -->
                  <div class="q-mb-xs">
                    <div :class="getMonTgl(item, 'perkembangan_kondisi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getMonTgl(item, 'perkembangan_kondisi') ? '☑' : '☐' }} 3. Perkembangan Kondisi
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getMonTgl(item, 'perkembangan_kondisi')">
                      ↳ Tgl: {{ getMonTgl(item, 'perkembangan_kondisi') }}
                    </div>
                  </div>

                  <!-- 4. PPK / CP -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">4. Proses Pelayanan PPK/CP:</span>
                    <div class="q-pl-xs">
                      <div :class="getMonitoring(item).monitoring_ppk_cp === 'ada_ppk' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getMonitoring(item).monitoring_ppk_cp === 'ada_ppk' ? '☑' : '☐' }} Ada PPK dan CP
                      </div>
                      <div :class="getMonitoring(item).monitoring_ppk_cp === 'sesuai_ppk' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getMonitoring(item).monitoring_ppk_cp === 'sesuai_ppk' ? '☑' : '☐' }} Sesuai PPK dan CP
                      </div>
                      <div :class="getMonitoring(item).monitoring_ppk_cp === 'tidak_sesuai_ppk' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getMonitoring(item).monitoring_ppk_cp === 'tidak_sesuai_ppk' ? '☑' : '☐' }} Tidak Sesuai PPK/CP
                      </div>
                      <div :class="getMonitoring(item).monitoring_ppk_cp === 'tidak_ada_ppk' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getMonitoring(item).monitoring_ppk_cp === 'tidak_ada_ppk' ? '☑' : '☐' }} Tidak Ada PPK/CP
                      </div>
                    </div>
                  </div>

                  <!-- 5. Billing Melebihi -->
                  <div class="q-mb-xs">
                    <div :class="getMonTgl(item, 'billing_melebihi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getMonTgl(item, 'billing_melebihi') ? '☑' : '☐' }} 5. Billing Melebihi Tarif
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getMonTgl(item, 'billing_melebihi')">
                      ↳ Tgl: {{ getMonTgl(item, 'billing_melebihi') }}
                    </div>
                  </div>

                  <!-- 6. Koding Diagnosa -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">6. Koding Diagnosa:</span>
                    <div class="q-pl-xs">
                      <div :class="getMonitoring(item).monitoring_koding === 'sesuai' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getMonitoring(item).monitoring_koding === 'sesuai' ? '☑' : '☐' }} Sesuai
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getMonitoring(item).monitoring_koding === 'sesuai' && getMonTgl(item, 'koding_diagnosa')">
                        ↳ Tgl: {{ getMonTgl(item, 'koding_diagnosa') }}
                      </div>
                      <div :class="getMonitoring(item).monitoring_koding === 'tidak_sesuai' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getMonitoring(item).monitoring_koding === 'tidak_sesuai' ? '☑' : '☐' }} Tidak Sesuai
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getMonitoring(item).monitoring_koding === 'tidak_sesuai' && getMonitoring(item).monitoring_koding_ket">
                        ↳ Dikonsulkan: {{ getMonitoring(item).monitoring_koding_ket }}
                      </div>
                    </div>
                  </div>

                  <!-- 7. Kendala Pembiayaan -->
                  <div class="q-mb-xs">
                    <div :class="getMonTgl(item, 'kendala_pembiayaan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getMonTgl(item, 'kendala_pembiayaan') ? '☑' : '☐' }} 7. Kendala Pembiayaan
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getMonTgl(item, 'kendala_pembiayaan')">
                      ↳ Tgl: {{ getMonTgl(item, 'kendala_pembiayaan') }}
                    </div>
                  </div>

                  <!-- 8. Pulang Administrasi -->
                  <div class="q-mb-xs">
                    <div :class="getMonTgl(item, 'pulang_administrasi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getMonTgl(item, 'pulang_administrasi') ? '☑' : '☐' }} 8. Pulang Administrasi
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getMonTgl(item, 'pulang_administrasi')">
                      ↳ Tgl: {{ getMonTgl(item, 'pulang_administrasi') }}
                    </div>
                  </div>

                </div>
              </div>

              <!-- Kolom 2: Fasilitasi -->
              <div class="mpp-col">
                <div class="mpp-col-header">2. FASILITASI & KOORDINASI</div>
                <div class="mpp-col-content">
                  
                  <!-- 1. Dietisen -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'dietisen') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'dietisen') ? '☑' : '☐' }} 1. Dietisen
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'dietisen')">
                      ↳ Tgl: {{ getFasTgl(item, 'dietisen') }} <span v-if="getFasKet(item, 'dietisen')">({{ getFasKet(item, 'dietisen') }})</span>
                    </div>
                  </div>

                  <!-- 2. DPJP -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'dpjp') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'dpjp') ? '☑' : '☐' }} 2. DPJP
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'dpjp')">
                      ↳ Tgl: {{ getFasTgl(item, 'dpjp') }}
                    </div>
                  </div>

                  <!-- 3. Farmasi -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'farmasi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'farmasi') ? '☑' : '☐' }} 3. Farmasi
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'farmasi')">
                      ↳ Tgl: {{ getFasTgl(item, 'farmasi') }}
                    </div>
                  </div>

                  <!-- 4. Fisioterapi -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'fisioterapi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'fisioterapi') ? '☑' : '☐' }} 4. Fisioterapi
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'fisioterapi')">
                      ↳ Tgl: {{ getFasTgl(item, 'fisioterapi') }}
                    </div>
                  </div>

                  <!-- 5. Perawat -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'perawat') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'perawat') ? '☑' : '☐' }} 5. Perawat
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'perawat')">
                      ↳ Tgl: {{ getFasTgl(item, 'perawat') }} <span v-if="getFasKet(item, 'perawat')">({{ getFasKet(item, 'perawat') }})</span>
                    </div>
                  </div>

                  <!-- 6. Pelayanan Pasca Rawat -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'pelayanan_pasca_rawat') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'pelayanan_pasca_rawat') ? '☑' : '☐' }} 6. Pelayanan Pasca Rawat
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'pelayanan_pasca_rawat')">
                      ↳ Tgl: {{ getFasTgl(item, 'pelayanan_pasca_rawat') }}
                    </div>
                  </div>

                  <!-- 7. Sesuai PPK & CP -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'pelayanan_ppk_cp') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'pelayanan_ppk_cp') ? '☑' : '☐' }} 7. Sesuai PPK & CP
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'pelayanan_ppk_cp')">
                      ↳ Tgl: {{ getFasTgl(item, 'pelayanan_ppk_cp') }}
                    </div>
                  </div>

                  <!-- 8. Perubahan Rencana -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'perubahan_rencana') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'perubahan_rencana') ? '☑' : '☐' }} 8. Perubahan Rencana
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'perubahan_rencana')">
                      ↳ Tgl: {{ getFasTgl(item, 'perubahan_rencana') }}
                    </div>
                  </div>

                  <!-- 9. Pihak Dalam RS -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'pihak_dalam_rs') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'pihak_dalam_rs') ? '☑' : '☐' }} 9. Pihak Dalam RS
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'pihak_dalam_rs')">
                      ↳ Tgl: {{ getFasTgl(item, 'pihak_dalam_rs') }} <span v-if="getFasKet(item, 'pihak_dalam_rs')">({{ getFasKet(item, 'pihak_dalam_rs') }})</span>
                    </div>
                  </div>

                  <!-- 10. Pihak Luar RS -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'pihak_luar_rs') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'pihak_luar_rs') ? '☑' : '☐' }} 10. Pihak Luar RS
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'pihak_luar_rs')">
                      ↳ Tgl: {{ getFasTgl(item, 'pihak_luar_rs') }} <span v-if="getFasKet(item, 'pihak_luar_rs')">({{ getFasKet(item, 'pihak_luar_rs') }})</span>
                    </div>
                  </div>

                  <!-- 11. Transisi Pelayanan -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'transisi_faskes') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'transisi_faskes') ? '☑' : '☐' }} 11. Transisi Pelayanan
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'transisi_faskes')">
                      ↳ Tgl: {{ getFasTgl(item, 'transisi_faskes') }}
                    </div>
                  </div>

                  <!-- 12. Case Meeting -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'meeting_case') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'meeting_case') ? '☑' : '☐' }} 12. Case Meeting
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'meeting_case')">
                      ↳ Tgl: {{ getFasTgl(item, 'meeting_case') }}
                    </div>
                  </div>

                  <!-- 13. Penjaminan Koding -->
                  <div class="q-mb-xs">
                    <div :class="getFasTgl(item, 'penjaminan_koding') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getFasTgl(item, 'penjaminan_koding') ? '☑' : '☐' }} 13. Penjaminan Koding
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getFasTgl(item, 'penjaminan_koding')">
                      ↳ Tgl: {{ getFasTgl(item, 'penjaminan_koding') }}
                    </div>
                  </div>

                </div>
              </div>

              <!-- Kolom 3: Advokasi -->
              <div class="mpp-col">
                <div class="mpp-col-header">3. ADVOKASI</div>
                <div class="mpp-col-content">
                  
                  <!-- 1. Peran Aktif -->
                  <div class="q-mb-xs">
                    <div :class="getAdvTgl(item, 'peran_aktif') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getAdvTgl(item, 'peran_aktif') ? '☑' : '☐' }} 1. Peran Aktif Pasien/Kel
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'peran_aktif')">
                      ↳ Tgl: {{ getAdvTgl(item, 'peran_aktif') }}
                    </div>
                  </div>

                  <!-- 2. Kebutuhan ke DPJP -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">2. Kebutuhan ke DPJP:</span>
                    <div class="q-pl-xs">
                      <div :class="getAdvTgl(item, 'dpjp_discharge') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'dpjp_discharge') ? '☑' : '☐' }} Discharge Planning
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'dpjp_discharge')">
                        ↳ Tgl: {{ getAdvTgl(item, 'dpjp_discharge') }}
                      </div>
                      <div :class="getAdvTgl(item, 'dpjp_konsultasi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'dpjp_konsultasi') ? '☑' : '☐' }} Konsultasi PPA
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'dpjp_konsultasi')">
                        ↳ Tgl: {{ getAdvTgl(item, 'dpjp_konsultasi') }}
                      </div>
                      <div :class="getAdvTgl(item, 'dpjp_pembiayaan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'dpjp_pembiayaan') ? '☑' : '☐' }} Pembiayaan
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'dpjp_pembiayaan')">
                        ↳ Tgl: {{ getAdvTgl(item, 'dpjp_pembiayaan') }}
                      </div>
                    </div>
                  </div>

                  <!-- 3. Hubungi RS Rujukan -->
                  <div class="q-mb-xs">
                    <div :class="getAdvTgl(item, 'rs_rujukan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                      {{ getAdvTgl(item, 'rs_rujukan') ? '☑' : '☐' }} 3. Hubungi RS Rujukan
                    </div>
                    <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'rs_rujukan')">
                      ↳ Tgl: {{ getAdvTgl(item, 'rs_rujukan') }}
                    </div>
                  </div>

                  <!-- 4. Pemeriksaan Penunjang -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">4. Pemeriksaan Penunjang:</span>
                    <div class="q-pl-xs">
                      <div :class="getAdvTgl(item, 'pemeriksaan_lab') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'pemeriksaan_lab') ? '☑' : '☐' }} Laboratorium
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'pemeriksaan_lab')">
                        ↳ Tgl: {{ getAdvTgl(item, 'pemeriksaan_lab') }}
                      </div>
                      <div :class="getAdvTgl(item, 'pemeriksaan_rad') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'pemeriksaan_rad') ? '☑' : '☐' }} Radiologi
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'pemeriksaan_rad')">
                        ↳ Tgl: {{ getAdvTgl(item, 'pemeriksaan_rad') }}
                      </div>
                      <div :class="getAdvTgl(item, 'pemeriksaan_eeg') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'pemeriksaan_eeg') ? '☑' : '☐' }} EEG
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'pemeriksaan_eeg')">
                        ↳ Tgl: {{ getAdvTgl(item, 'pemeriksaan_eeg') }}
                      </div>
                      <div :class="getAdvTgl(item, 'pemeriksaan_endo') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'pemeriksaan_endo') ? '☑' : '☐' }} Endoscopi
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'pemeriksaan_endo')">
                        ↳ Tgl: {{ getAdvTgl(item, 'pemeriksaan_endo') }}
                      </div>
                      <div :class="getAdvTgl(item, 'pemeriksaan_lain') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getAdvTgl(item, 'pemeriksaan_lain') ? '☑' : '☐' }} Lain-lain
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getAdvTgl(item, 'pemeriksaan_lain')">
                        ↳ Tgl: {{ getAdvTgl(item, 'pemeriksaan_lain') }}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Kolom 4: Hasil Pelayanan -->
              <div class="mpp-col">
                <div class="mpp-col-header">4. HASIL PELAYANAN</div>
                <div class="mpp-col-content">
                  
                  <!-- 1. Level Capaian -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">1. Level Capaian:</span>
                    <div class="q-pl-xs">
                      <div :class="getHasil(item).level_hasil === '1' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getHasil(item).level_hasil === '1' ? '☑' : '☐' }} Level 1: Melepaskan diri
                      </div>
                      <div :class="getHasil(item).level_hasil === '2' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getHasil(item).level_hasil === '2' ? '☑' : '☐' }} Level 2: Menjadi sadar
                      </div>
                      <div :class="getHasil(item).level_hasil === '3' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getHasil(item).level_hasil === '3' ? '☑' : '☐' }} Level 3: Ambil tindakan
                      </div>
                      <div :class="getHasil(item).level_hasil === '4' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getHasil(item).level_hasil === '4' ? '☑' : '☐' }} Level 4: Perilaku menetap
                      </div>
                    </div>
                  </div>

                  <!-- 2. Pasien Mengerti -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">2. Pasien Mengerti Kepatuhan:</span>
                    <div class="q-pl-xs">
                      <div :class="hasHasil(item, 'kepatuhan_obat') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasHasil(item, 'kepatuhan_obat') ? '☑' : '☐' }} Minum obat lanjutan
                      </div>
                      <div :class="hasHasil(item, 'kepatuhan_terapi') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasHasil(item, 'kepatuhan_terapi') ? '☑' : '☐' }} Terapi lain
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="hasHasil(item, 'kepatuhan_terapi') && getHasil(item).hasil_ket?.terapi_lain">
                        ↳ Detail: {{ getHasil(item).hasil_ket.terapi_lain }}
                      </div>
                      <div :class="hasHasil(item, 'kepatuhan_kebutuhan') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ hasHasil(item, 'kepatuhan_kebutuhan') ? '☑' : '☐' }} Kebutuhan kesehatan lain
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="hasHasil(item, 'kepatuhan_kebutuhan') && getHasil(item).hasil_ket?.kebutuhan_lain">
                        ↳ Detail: {{ getHasil(item).hasil_ket.kebutuhan_lain }}
                      </div>
                    </div>
                  </div>

                  <div class="q-mb-xs" :class="hasHasil(item, 'discharge_planning_ada') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasHasil(item, 'discharge_planning_ada') ? '☑' : '☐' }} 3. Discharge planning & edukasi ada
                  </div>

                  <div class="q-mb-xs" :class="hasHasil(item, 'terapi_sesuai') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasHasil(item, 'terapi_sesuai') ? '☑' : '☐' }} 4. Terapi yang sesuai
                  </div>

                  <div class="q-mb-xs" :class="hasHasil(item, 'kendala_pembiayaan_tidak_ada') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasHasil(item, 'kendala_pembiayaan_tidak_ada') ? '☑' : '☐' }} 5. Kendala pembiayaan tidak ada
                  </div>

                  <div class="q-mb-xs" :class="hasHasil(item, 'tidak_ada_komplain') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                    {{ hasHasil(item, 'tidak_ada_komplain') ? '☑' : '☐' }} 6. Tidak ada komplain
                  </div>

                  <div class="border-t q-pt-xs text-caption q-mt-sm" v-if="getHasil(item).hasil_ket?.hasil_ket">
                    <span class="text-weight-bold">Keterangan:</span>
                    <div class="text-justify text-grey-9">{{ getHasil(item).hasil_ket.hasil_ket }}</div>
                  </div>

                </div>
              </div>

              <!-- Kolom 5: Terminasi -->
              <div class="mpp-col">
                <div class="mpp-col-header">5. TERMINASI</div>
                <div class="mpp-col-content">
                  
                  <!-- 1. Kriteria Terminasi -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">1. Kriteria Terminasi:</span>
                    <div class="q-pl-xs">
                      <div :class="getTermTgl(item, 'tujuan_tercapai') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTermTgl(item, 'tujuan_tercapai') ? '☑' : '☐' }} Sasaran Tercapai
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTermTgl(item, 'tujuan_tercapai')">
                        ↳ Tgl: {{ getTermTgl(item, 'tujuan_tercapai') }}
                      </div>
                      <div :class="getTermTgl(item, 'transisi_faskes_terlaksana') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTermTgl(item, 'transisi_faskes_terlaksana') ? '☑' : '☐' }} Transisi Faskes
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTermTgl(item, 'transisi_faskes_terlaksana')">
                        ↳ Tgl: {{ getTermTgl(item, 'transisi_faskes_terlaksana') }}
                      </div>
                      <div :class="getTermTgl(item, 'pasien_menolak') ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTermTgl(item, 'pasien_menolak') ? '☑' : '☐' }} Pasien Menolak MPP
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTermTgl(item, 'pasien_menolak')">
                        ↳ Tgl: {{ getTermTgl(item, 'pasien_menolak') }}
                      </div>
                    </div>
                  </div>

                  <!-- 2. Cara Pulang -->
                  <div class="q-mb-xs">
                    <span class="text-weight-bold">2. Cara Pulang:</span>
                    <div class="q-pl-xs">
                      <div :class="getTerminasi(item).cara_pulang_val === 'diperbolehkan_pulang' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTerminasi(item).cara_pulang_val === 'diperbolehkan_pulang' ? '☑' : '☐' }} Diperbolehkan Pulang
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTerminasi(item).cara_pulang_val === 'diperbolehkan_pulang'">
                        ↳ Poli: {{ getCaraPulangKet(item, 'kontrol_poli') || '......' }} (Tgl: {{ getCaraPulangTgl(item, 'kontrol_poli') || '......' }})
                      </div>
                      <div :class="getTerminasi(item).cara_pulang_val === 'pulang_paksa' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTerminasi(item).cara_pulang_val === 'pulang_paksa' ? '☑' : '☐' }} Pulang Paksa
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTerminasi(item).cara_pulang_val === 'pulang_paksa'">
                        ↳ Alasan: {{ getCaraPulangKet(item, 'pulang_paksa_alasan') || '......' }}
                      </div>
                      <div :class="getTerminasi(item).cara_pulang_val === 'dirujuk' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTerminasi(item).cara_pulang_val === 'dirujuk' ? '☑' : '☐' }} Dirujuk
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTerminasi(item).cara_pulang_val === 'dirujuk'">
                        ↳ Ke: {{ getCaraPulangKet(item, 'dirujuk_ke') || '......' }}
                      </div>
                      <div :class="getTerminasi(item).cara_pulang_val === 'melarikan_diri' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTerminasi(item).cara_pulang_val === 'melarikan_diri' ? '☑' : '☐' }} Melarikan Diri
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTerminasi(item).cara_pulang_val === 'melarikan_diri'">
                        ↳ Tgl: {{ getCaraPulangTgl(item, 'melarikan_diri') || '......' }}
                      </div>
                      <div :class="getTerminasi(item).cara_pulang_val === 'meninggal' ? 'mpp-item-checked' : 'mpp-item-unchecked'">
                        {{ getTerminasi(item).cara_pulang_val === 'meninggal' ? '☑' : '☐' }} Meninggal
                      </div>
                      <div class="q-pl-sm text-grey-8" v-if="getTerminasi(item).cara_pulang_val === 'meninggal'">
                        ↳ Tgl: {{ getCaraPulangTgl(item, 'meninggal') || '......' }} Jam: {{ getTerminasi(item).cara_pulang_jam || '......' }}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Footer Tanda Tangan MPP -->
            <div class="row justify-end q-mt-xl q-pr-md" style="font-size: 11px;">
              <div class="text-center" style="width: 250px;">
                <div>Probolinggo, {{ humanDate(item.created_at) }}</div>
                <div class="text-weight-bold q-mt-xs">Manajer Pelayanan Pasien</div>
                <div class="q-my-md flex justify-center items-center" style="height: 70px;">
                  <app-qr-petugas
                    :noreg="item.noreg"
                    :jnssurat="'MPP-FORM-B.png'"
                    :asal="'RANAP'"
                    :kdpegsimrs="item.kdpegsimrs_updated || item.kdpegsimrs"
                    width="70px"
                    height="70px"
                  />
                </div>
                <div class="text-weight-bold text-underline">
                  {{ item.petugas_updated?.nama || item.petugas?.nama || '-' }}
                </div>
                <div class="text-grey-7">NIP. {{ item.petugas_updated?.nip || item.petugas?.nip || '-' }}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useMppRanapStore } from 'src/stores/simrs/ranap/mpp'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'
import AppQrPetugas from 'src/components/~global/AppQrPetugas.vue'
import { humanDate } from 'src/modules/formatter'

const store = useMppRanapStore()
const loading = computed(() => store.loading)
const items = computed(() => store.items)

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

// Fetch data jika pasien disuplai
watch(() => props.pasien, (val) => {
  if (val) {
    store.getData(val)
  }
}, { immediate: true })

const dataHeader = [
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
  'UOBK RSUD DOKTER MOHAMAD SALEH',
  'Jl. Mayjend Panjaitan No.65 Telp: (0335)433119 Fax.(0335)432702',
  'email: rsudprob@probolinggokota.go.id',
  'PROBOLINGGO – 67219'
]

const printObj = {
  id: 'print-mpp-document',
  popTitle: 'Manajemen Pelayanan Pasien (MPP)'
}

// ── JSON Parsers ───────────────────────────────────
const parseVal = (val) => {
  if (!val) return {}
  if (typeof val === 'object') return val
  try {
    return JSON.parse(val)
  } catch (e) {
    return {}
  }
}

const getSkrining = (item) => parseVal(item.skrining)
const getAsesmen = (item) => parseVal(item.asesmen)
const getMasalah = (item) => parseVal(item.identifikasi_masalah)
const getSasaran = (item) => parseVal(item.sasaran)
const getPerencanaan = (item) => parseVal(item.perencanaan)
const getMonitoring = (item) => parseVal(item.monitoring)
const getFasilitasi = (item) => parseVal(item.fasilitasi)
const getAdvokasi = (item) => parseVal(item.advokasi)
const getHasil = (item) => parseVal(item.hasil_pelayanan)
const getTerminasi = (item) => parseVal(item.terminasi)

// Checkers
const hasPsikologis = (item, val) => {
  const p = getSkrining(item).riwayat_psikologis
  return Array.isArray(p) && p.includes(val)
}
const hasMasalah = (item, val) => {
  const m = getMasalah(item).masalah
  return Array.isArray(m) && m.includes(val)
}
const hasSasaran = (item, val) => {
  const s = getSasaran(item).sasaran
  return Array.isArray(s) && s.includes(val)
}
const hasPerencanaan = (item, val) => {
  const p = getPerencanaan(item).perencanaan
  return Array.isArray(p) && p.includes(val)
}
const hasHasil = (item, val) => {
  const h = getHasil(item).hasil
  return Array.isArray(h) && h.includes(val)
}

// Get Object Values
const getMonTgl = (item, key) => getMonitoring(item).monitoring_tgl?.[key]
const getFasTgl = (item, key) => getFasilitasi(item).fasilitasi_tgl?.[key]
const getFasKet = (item, key) => getFasilitasi(item).fasilitasi_ket?.[key]
const getAdvTgl = (item, key) => getAdvokasi(item).advokasi_tgl?.[key]
const getTermTgl = (item, key) => getTerminasi(item).terminasi_tgl?.[key]

const getCaraPulangTgl = (item, key) => getTerminasi(item).cara_pulang_tgl?.[key]
const getCaraPulangKet = (item, key) => getTerminasi(item).cara_pulang_ket?.[key]
</script>

<style lang="scss" scoped>
.document-container {
  width: 210mm;
  margin: 0 auto;
}

.print-page {
  background-color: #ffffff !important;
  width: 210mm;
  min-height: 297mm;
  padding: 8mm;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Custom Header Box */
.mpp-header-box {
  border: 1px solid #000;
  box-sizing: border-box;
  width: 100%;
}

.border-r {
  border-right: 1px solid #000;
}

.border-b {
  border-bottom: 1px solid #000;
}

.border-y {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}

.f-8 {
  font-size: 8px;
}

.f-10 {
  font-size: 10px;
}

.f-12 {
  font-size: 12px;
}

/* 5 Column Grid Layout */
.mpp-grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border: 1px solid #000;
  box-sizing: border-box;
  width: 100%;
}

.mpp-col {
  border-right: 1px solid #000;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  
  &:last-child {
    border-right: none;
  }
}

.mpp-col-header {
  background-color: #f5f5f5;
  border-bottom: 1px solid #000;
  padding: 6px 4px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  box-sizing: border-box;
}

.mpp-col-content {
  padding: 6px 4px;
  font-size: 9px;
  line-height: 1.35;
  box-sizing: border-box;
  flex-grow: 1;
}

.text-underline {
  text-decoration: underline;
}

@media print {
  .no-print {
    display: none !important;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  .document-container {
    width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  .print-page {
    width: 210mm !important;
    height: 297mm !important;
    padding: 8mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    page-break-inside: avoid !important;
    page-break-after: always !important;
    box-sizing: border-box !important;
  }

  .page-break {
    page-break-after: always !important;
    break-after: page !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }
}
</style>
