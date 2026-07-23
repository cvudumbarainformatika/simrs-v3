<template>
  <div class="q-pa-md bg-grey-2 style-form">
    <!-- SECTION 1: ANAMNESIS & PERSIAPAN PRA INDUKSI -->
    <q-card flat bordered class="bg-white q-mb-md rounded-borders shadow-1 overflow-hidden">
      <q-card-section class="q-pa-sm bg-primary text-white row items-center">
        <q-icon name="assignment_ind" size="sm" class="q-mr-sm" />
        <div class="text-subtitle2 text-weight-bold">1. ANAMNESIS & PERSIAPAN PRA INDUKSI</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Keluhan Utama -->
          <div class="col-xs-12 col-md-6">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Keluhan Utama
              <q-badge v-if="isFilled(store.formInduksi.keluhan_utama)" color="primary" label="✓ Terisi" class="q-ml-xs" />
            </div>
            <q-input v-model="store.formInduksi.keluhan_utama" label="Masukkan Keluhan Utama" type="textarea" outlined rows="2" :bg-color="isFilled(store.formInduksi.keluhan_utama) ? 'blue-1' : 'white'" />
          </div>

          <!-- Diagnosa -->
          <div class="col-xs-12 col-md-6">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Diagnosa
              <q-badge v-if="isFilled(store.formInduksi.diagnosa)" color="primary" label="✓ Terisi" class="q-ml-xs" />
            </div>
            <q-input ref="refDiagnosa" v-model="store.formInduksi.diagnosa" label="Diagnosa Pra-Induksi" outlined dense :bg-color="isFilled(store.formInduksi.diagnosa) ? 'blue-1' : 'white'" :rules="[
              val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
            ]" />
            <div class="text-caption text-primary q-mt-xs" v-if="props.pasien?.rs4">
              ℹ️ Diagnosa Permintaan: <strong>{{ props.pasien?.rs4 }}</strong>
            </div>
            <div class="text-caption text-grey-6 q-mt-xs" v-else>
              ℹ️ Diagnosa Permintaan: Belum diisi
            </div>
          </div>

          <!-- Rencana Pembedahan -->
          <div class="col-xs-12">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Rencana Pembedahan
              <q-badge v-if="isFilled(store.formInduksi.rencana_bedah)" color="primary" label="✓ Terisi" class="q-ml-xs" />
            </div>
            <q-input v-model="store.formInduksi.rencana_bedah" label="Rencana Pembedahan / Prosedur" type="textarea" outlined rows="2" :bg-color="isFilled(store.formInduksi.rencana_bedah) ? 'blue-1' : 'white'" />
            <div class="text-caption text-primary q-mt-xs" v-if="allTindakanOp">
              ℹ️ Tindakan Operasi: <strong>{{ allTindakanOp }}</strong>
            </div>
            <div class="text-caption text-grey-6 q-mt-xs" v-else>
              ℹ️ Tindakan Operasi: Belum diisi
            </div>
          </div>

          <!-- Riwayat-Riwayat Pasien (Grid 2 Kolom) -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm rounded-borders transition-generic" :class="isFilled(store.formInduksi.riwayat_anastesi) ? 'bg-blue-1 border-blue' : 'bg-grey-1 border-grey'">
              <div class="text-caption text-weight-bold text-primary q-mb-xs">
                Riwayat Anestesi
                <q-badge v-if="isFilled(store.formInduksi.riwayat_anastesi)" color="primary" label="✓ Terisi" class="q-ml-xs" />
              </div>
              <q-option-group v-model="store.formInduksi.riwayat_anastesi" :options="options" inline dense color="primary"
                @update:model-value="clearJenis($event, 'jenis_riwayat_anastesi', 'Tidak')" />
              <q-input v-if="store?.formInduksi?.riwayat_anastesi == 'Ya'" v-model="store.formInduksi.jenis_riwayat_anastesi"
                label="Sebutkan Jenis Anestesi" outlined dense class="q-mt-sm bg-white" :rules="[
                  val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
                ]" />
            </div>
          </div>

          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm rounded-borders transition-generic" :class="isFilled(store.formInduksi.riwayat_alergi) ? 'bg-blue-1 border-blue' : 'bg-grey-1 border-grey'">
              <div class="text-caption text-weight-bold text-primary q-mb-xs">
                Riwayat Alergi
                <q-badge v-if="isFilled(store.formInduksi.riwayat_alergi)" color="primary" label="✓ Terisi" class="q-ml-xs" />
              </div>
              <q-option-group v-model="store.formInduksi.riwayat_alergi" :options="options" inline dense color="primary"
                @update:model-value="clearJenis($event, 'jenis_alergi', 'Tidak')" />
              <q-input v-if="store?.formInduksi?.riwayat_alergi == 'Ya'" v-model="store.formInduksi.jenis_alergi"
                label="Sebutkan Jenis Alergi" outlined dense class="q-mt-sm bg-white" :rules="[
                  val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
                ]" />
            </div>
          </div>

          <div class="col-xs-12 col-md-4">
            <div class="q-pa-sm rounded-borders transition-generic" :class="isFilled(store.formInduksi.riwayat_merokok) ? 'bg-blue-1 border-blue' : 'bg-grey-1 border-grey'">
              <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">
                Riwayat Merokok
                <q-badge v-if="isFilled(store.formInduksi.riwayat_merokok)" color="primary" label="✓ Terisi" class="q-ml-xs" />
              </div>
              <q-option-group v-model="store.formInduksi.riwayat_merokok" :options="options" inline dense color="primary" />
            </div>
          </div>

          <div class="col-xs-12 col-md-4">
            <div class="q-pa-sm rounded-borders transition-generic" :class="isFilled(store.formInduksi.alkohol) ? 'bg-blue-1 border-blue' : 'bg-grey-1 border-grey'">
              <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">
                Alkoholik
                <q-badge v-if="isFilled(store.formInduksi.alkohol)" color="primary" label="✓ Terisi" class="q-ml-xs" />
              </div>
              <q-option-group v-model="store.formInduksi.alkohol" :options="options" inline dense color="primary" />
            </div>
          </div>

          <div class="col-xs-12 col-md-4">
            <div class="q-pa-sm rounded-borders transition-generic" :class="isFilled(store.formInduksi.persiapan_transfusi) ? 'bg-blue-1 border-blue' : 'bg-grey-1 border-grey'">
              <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">
                Persiapan Transfusi
                <q-badge v-if="isFilled(store.formInduksi.persiapan_transfusi)" color="primary" label="✓ Terisi" class="q-ml-xs" />
              </div>
              <q-option-group v-model="store.formInduksi.persiapan_transfusi" :options="options" inline dense color="primary"
                @update:model-value="(val) => {
                  clearJenis(val, 'jenis_transfusi', 'Tidak')
                  clearJenis(val, 'jumlah_transfusi', 'Tidak')
                }" />
              <div v-if="store?.formInduksi?.persiapan_transfusi == 'Ya'" class="row q-col-gutter-x-xs q-mt-xs">
                <div class="col-7">
                  <q-input v-model="store.formInduksi.jenis_transfusi" label="Jenis Transfusi" outlined dense class="bg-white" :rules="[
                    val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
                  ]" />
                </div>
                <div class="col-5">
                  <q-input v-model="store.formInduksi.jumlah_transfusi" label="Jumlah (Kolf)" outlined dense class="bg-white" :rules="[
                    val => (!val || /^-?\d*[.,]?\d*$/.test(val)) || 'Harus angka'
                  ]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SECTION 2: PENGUKURAN VITAL SIGN -->
    <q-card flat bordered class="bg-white q-mb-md rounded-borders shadow-1 overflow-hidden">
      <q-card-section class="q-pa-sm bg-teal-8 text-white row items-center">
        <q-icon name="monitor_heart" size="sm" class="q-mr-sm" />
        <div class="text-subtitle2 text-weight-bold">2. PENGUKURAN VITAL SIGN</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-4 col-md-3">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Kesadaran (Sens)</div>
            <q-select v-model="store.formInduksi.vit_sens" label="Pilih Kesadaran" :options="optionKesadaran" outlined dense emit-value map-options clearable :bg-color="isFilled(store.formInduksi.vit_sens) ? 'teal-1' : 'white'" />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-3">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Tekanan Darah (TD)</div>
            <div class="row items-center no-wrap">
              <q-input v-model="store.formInduksi.vit_td_sistole" label="Sis" outlined dense class="col" :bg-color="isFilled(store.formInduksi.vit_td_sistole) ? 'teal-1' : 'white'" />
              <span class="q-px-xs text-weight-bold text-grey-7">/</span>
              <q-input v-model="store.formInduksi.vit_td_diastole" label="Dia" outlined dense class="col" :bg-color="isFilled(store.formInduksi.vit_td_diastole) ? 'teal-1' : 'white'" />
              <span class="q-ml-xs text-caption text-grey-7">mmHg</span>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-2">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Nadi</div>
            <q-input v-model="store.formInduksi.vit_nadi" label="Nadi" outlined dense :bg-color="isFilled(store.formInduksi.vit_nadi) ? 'teal-1' : 'white'" suffix="x/mnt" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-2">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Respirasi (RR)</div>
            <q-input v-model="store.formInduksi.vit_rr" label="RR" outlined dense :bg-color="isFilled(store.formInduksi.vit_rr) ? 'teal-1' : 'white'" suffix="x/mnt" />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Suhu</div>
            <q-input v-model="store.formInduksi.vit_suhu" label="Suhu" outlined dense :bg-color="isFilled(store.formInduksi.vit_suhu) ? 'teal-1' : 'white'" suffix="°C" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SECTION 3: PEMERIKSAAN FISIK & PENUNJANG -->
    <q-card flat bordered class="bg-white q-mb-md rounded-borders shadow-1 overflow-hidden">
      <q-card-section class="q-pa-sm bg-deep-orange-7 text-white row items-center">
        <q-icon name="clinical_notes" size="sm" class="q-mr-sm" />
        <div class="text-subtitle2 text-weight-bold">3. PEMERIKSAAN FISIK & PENUNJANG</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Sub 1: Jalan Napas & Mulut -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm bg-orange-1 rounded-borders border-orange">
              <div class="text-weight-bold text-deep-orange-9 q-mb-sm">Organ & Jalan Napas</div>
              <div class="q-mb-xs">
                <span class="text-caption text-weight-bold text-grey-9">Jalan Napas (Kesulitan Intubasi):</span>
                <q-option-group v-model="store.formInduksi.fis_jalan_napas" :options="options" inline dense color="primary" class="q-ml-sm" />
              </div>
              <div class="q-mb-xs">
                <span class="text-caption text-weight-bold text-grey-9">Mulut:</span>
                <q-option-group v-model="store.formInduksi.fis_mulut" :options="options" inline dense color="primary" class="q-ml-sm" />
              </div>
              <div class="q-mb-xs">
                <span class="text-caption text-weight-bold text-grey-9">Tenggorokan:</span>
                <q-option-group v-model="store.formInduksi.fis_tenggorokan" :options="options" inline dense color="primary" class="q-ml-sm" />
              </div>
              <div class="q-mt-sm">
                <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">Skor Mallampati:</div>
                <q-option-group v-model="store.formInduksi.fis_skor_mallapati" :options="optionMallapatis" inline dense color="primary" />
              </div>
            </div>
          </div>

          <!-- Sub 2: Sistemik & Abdomen -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm bg-orange-1 rounded-borders border-orange full-height column justify-between">
              <div>
                <div class="text-weight-bold text-deep-orange-9 q-mb-sm">Pemeriksaan Sistemik</div>
                <div class="q-mb-xs">
                  <span class="text-caption text-weight-bold text-grey-9">Kelainan Tulang Belakang:</span>
                  <q-option-group v-model="store.formInduksi.fis_kel_tul_bel" :options="options" inline dense color="primary" class="q-ml-sm" />
                </div>
                <div class="q-mb-xs">
                  <span class="text-caption text-weight-bold text-grey-9">Kelainan Jantung / Paru-paru:</span>
                  <q-option-group v-model="store.formInduksi.fis_kel_jan_par" :options="options" inline dense color="primary" class="q-ml-sm" />
                </div>
              </div>
              <div class="q-mt-sm">
                <div class="text-caption text-weight-bold text-grey-9 q-mb-xs">Abdomen:</div>
                <q-input v-model="store.formInduksi.fis_abdomen" label="Keterangan Abdomen" outlined dense :bg-color="isFilled(store.formInduksi.fis_abdomen) ? 'orange-1' : 'white'" :rules="[
                  val => (!val || val?.length <= 255) || 'Maksimal 255 karakter'
                ]" />
              </div>
            </div>
          </div>

          <!-- Sub 3: Pemeriksaan Penunjang -->
          <div class="col-xs-12">
            <div class="text-weight-bold text-grey-9 q-mb-xs">Pemeriksaan Penunjang</div>
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-3">
                <q-input v-model="store.formInduksi.fis_penj_lab" label="Laboratorium" outlined dense :bg-color="isFilled(store.formInduksi.fis_penj_lab) ? 'orange-1' : 'white'" />
              </div>
              <div class="col-xs-12 col-sm-3">
                <q-input v-model="store.formInduksi.fis_penj_ekg" label="EKG" outlined dense :bg-color="isFilled(store.formInduksi.fis_penj_ekg) ? 'orange-1' : 'white'" />
              </div>
              <div class="col-xs-12 col-sm-3">
                <q-input v-model="store.formInduksi.fis_penj_thorax" label="Thorax" outlined dense :bg-color="isFilled(store.formInduksi.fis_penj_thorax) ? 'orange-1' : 'white'" />
              </div>
              <div class="col-xs-12 col-sm-3">
                <q-input v-model="store.formInduksi.fis_penj_lain" label="Lain-lain" outlined dense :bg-color="isFilled(store.formInduksi.fis_penj_lain) ? 'orange-1' : 'white'" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SECTION 4: EVALUASI RISIKO & RENCANA ANESTESI -->
    <q-card flat bordered class="bg-white q-mb-md rounded-borders shadow-1 overflow-hidden">
      <q-card-section class="q-pa-sm bg-indigo-7 text-white row items-center">
        <q-icon name="medical_services" size="sm" class="q-mr-sm" />
        <div class="text-subtitle2 text-weight-bold">4. EVALUASI RISIKO & RENCANA ANESTESI</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Skor Nyeri & ASA -->
          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm rounded-borders transition-generic" :class="isFilled(store.formInduksi.ket_skor_nyeri) ? 'bg-indigo-1 border-indigo' : 'bg-grey-1 border-grey'">
              <div class="text-caption text-weight-bold text-indigo-9 q-mb-xs">
                Skor Nyeri
                <q-badge v-if="isFilled(store.formInduksi.ket_skor_nyeri)" color="indigo" label="✓ Terisi" class="q-ml-xs" />
              </div>
              <q-option-group v-model="store.formInduksi.ket_skor_nyeri" :options="SkorNyeriOptions" inline dense color="primary" />
            </div>
          </div>

          <div class="col-xs-12 col-md-6">
            <div class="q-pa-sm rounded-borders transition-generic" :class="isFilled(store.formInduksi.klasifikasi_asa) ? 'bg-indigo-1 border-indigo' : 'bg-grey-1 border-grey'">
              <div class="text-caption text-weight-bold text-indigo-9 q-mb-xs">
                Klasifikasi ASA
                <q-badge v-if="isFilled(store.formInduksi.klasifikasi_asa)" color="indigo" label="✓ Terisi" class="q-ml-xs" />
              </div>
              <q-option-group v-model="store.formInduksi.klasifikasi_asa" :options="KlasifikasiAsaOptions" inline dense color="primary" />
            </div>
          </div>

          <!-- Rencana Anestesi & Teknik -->
          <div class="col-xs-12">
            <div class="q-pa-md bg-grey-1 rounded-borders border-grey">
              <div class="row items-center q-mb-sm">
                <div class="text-subtitle2 text-weight-bold text-primary q-mr-md">Rencana Anestesi:</div>
                <q-option-group v-model="store.formInduksi.renc_anastesi" :options="RenAnasOptions" inline dense color="primary"
                  @update:model-value="() => { store.formInduksi.region_anas = null }" />
              </div>
              <div v-if="store.formInduksi.renc_anastesi" class="q-mt-sm q-pl-md border-left-primary">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Teknik {{ store.formInduksi.renc_anastesi }}:</div>
                <q-option-group v-if="store.formInduksi.renc_anastesi == 'Regional'"
                  v-model="store.formInduksi.region_anas" :options="RegionAnasOptions" inline dense color="primary" />
                <q-option-group v-if="store.formInduksi.renc_anastesi == 'Umum'" v-model="store.formInduksi.region_anas"
                  :options="UmumAnasOptions" inline dense color="primary" />
              </div>
            </div>
          </div>

          <!-- Rencana Pemulihan & Management Nyeri -->
          <div class="col-xs-12 col-md-6">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Rencana Pemulihan Pasca Anestesi</div>
            <q-option-group v-model="store.formInduksi.renc_pemulihan_pasca_anas" :options="RencPemulihanPascaAnaOptions" inline dense color="primary" />
          </div>

          <div class="col-xs-12 col-md-6">
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Rencana Management Nyeri</div>
            <q-option-group v-model="store.formInduksi.renc_management_nyeri" :options="RencManagementNyesiOptions" inline dense color="primary" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- SECTION 5: LOG PEMBERIAN OBAT PRE-MEDIKASI -->
    <q-card flat bordered class="bg-white q-mb-md rounded-borders shadow-1 overflow-hidden">
      <q-card-section class="q-pa-sm bg-purple-7 text-white row items-center">
        <q-icon name="medication" size="sm" class="q-mr-sm" />
        <div class="text-subtitle2 text-weight-bold">5. LOG PEMBERIAN OBAT PRE-MEDIKASI</div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div class="responsive-table-box scroll">
          <table class="doc-table-styled full-width">
            <thead>
              <tr class="bg-purple-1 text-purple-10 text-left">
                <th width="5%" class="q-pa-xs text-center">No</th>
                <th width="35%" class="q-pa-xs">Obat Pre-Medikasi</th>
                <th width="20%" class="q-pa-xs">Dosis</th>
                <th width="15%" class="q-pa-xs">Jam</th>
                <th width="20%" class="q-pa-xs">Pelaksana</th>
                <th width="5%" class="q-pa-xs text-center">Aksi</th>
              </tr>
              <!-- Row Add New Obat -->
              <tr class="bg-grey-2">
                <th class="q-pa-xs text-center text-primary">+</th>
                <th class="q-pa-xs">
                  <app-autocomplete ref="inputObatMedikasi" v-model="obatMedikasi.obat_pre_medikasi" label="Pilih Obat" dense :source="store.obats"
                    option-label="nama_obat" option-value="nama_obat" hide-dropdown-icon outlined bg-color="white" />
                </th>
                <th class="q-pa-xs">
                  <q-input v-model="obatMedikasi.dosis" label="Dosis" dense outlined bg-color="white" />
                </th>
                <th class="q-pa-xs">
                  <q-input v-model="obatMedikasi.jam" label="HH:mm" dense outlined mask="##:##" bg-color="white" />
                </th>
                <th class="q-pa-xs" @keyup.enter="addObatMedikasi">
                  <app-autocomplete v-model="obatMedikasi.pelaksana" label="Pilih Nakes" dense :source="laporanOp.nakes"
                    option-label="nama" hide-dropdown-icon outlined bg-color="white" />
                </th>
                <th class="q-pa-xs text-center">
                  <q-btn icon="add" @click="addObatMedikasi" dense color="primary" round size="sm" />
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="store.loadingInduksi">
                <tr>
                  <td colspan="6" class="text-center q-pa-md"><app-loading /></td>
                </tr>
              </template>
              <template v-else-if="!store.formInduksi?.obat_pre_medikasi?.length">
                <tr>
                  <td colspan="6" class="text-center q-pa-md text-grey-6">Belum ada obat pre-medikasi ditambahkan</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(item, n) in store.formInduksi?.obat_pre_medikasi" :key="n"
                  :class="item.delete ? 'bg-red-1 text-negative' : (n % 2 === 0 ? 'bg-white' : 'bg-grey-1')">
                  <td class="text-center text-weight-bold">{{ n + 1 }}</td>
                  <td>{{ item?.obat_pre_medikasi?.nama_obat || item?.obat_pre_medikasi || '-' }}</td>
                  <td>{{ item?.dosis || '-' }}</td>
                  <td>{{ item?.jam || '-' }}</td>
                  <td>{{ item?.pelaksana?.nama || '-' }}</td>
                  <td class="text-center">
                    <q-btn v-if="!item.delete" icon="delete" color="negative" dense flat round size="sm" @click="() => {
                      if (obatBaru(item, n)) store.formInduksi.obat_pre_medikasi.splice(n, 1)
                      else item.delete = true
                    }">
                      <q-tooltip>Hapus Obat</q-tooltip>
                    </q-btn>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </q-card-section>
    </q-card>

    <!-- SECTION 6: PENETAPAN DOKTER & ACTION BUTTONS -->
    <q-card flat bordered class="bg-white q-mb-md rounded-borders shadow-1">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-xs-12 col-sm-4">
            <app-input-date :model="store.formInduksi.tgl" label="Tanggal Pelaksanaan" dense outlined @set-model="(val) => {
              store.formInduksi.tgl = val
            }" />
          </div>
          <div class="col-xs-12 col-sm-4">
            <app-input-date :model="store.formInduksi.jam" label="Jam Pelaksanaan" :type-date="false" dense outlined
              @set-model="(val) => {
                store.formInduksi.jam = val
              }" />
          </div>
          <div class="col-xs-12 col-sm-4">
            <app-autocomplete v-model="store.formInduksi.dokter_anastesi"
              :key="laporanOp.nakes?.length || 0" label="Dokter Anestesi Penanggung Jawab" outlined dense
              :source="laporanOp.nakes?.filter(y => y?.kdgroupnakes == '1')" option-label="nama" option-value="kdpegsimrs"
              hide-dropdown-icon />
          </div>
        </div>

        <div class="row justify-end q-mt-lg">
          <q-btn label="Simpan Pra Induksi" icon="save" no-caps color="primary" glossy size="md" class="q-px-xl" :loading="store.loadingInduksi"
            :disable="store.loadingInduksi" @click="handleSimpan" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { notifErrVue } from 'src/modules/utils'
import { useAssasementPraBedahStore } from 'src/stores/simrs/kamaroperasi/assasement/praBedah'
import { onMounted, ref, watch, computed } from 'vue'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const obatMedikasi = ref({})
const inputObatMedikasi = ref({})
function obatBaru (item, n) {
  // const baru = props.pasien?.pra_induksi?.obat_pre_medikasi?.find(el => el.obat_pre_medikasi === item.obat_pre_medikasi && el.dosis === item.dosis && el.jam === item.jam && el.pelaksana?.id === item.pelaksana?.id)
  const baru = props.pasien?.pra_induksi?.obat_pre_medikasi?.[n]
  console.log('obat bar', baru, item, props.pasien?.pra_induksi?.obat_pre_medikasi)
  if (!baru) return true
  return false
}
function addObatMedikasi () {
  console.log('add', inputObatMedikasi.value)
  if (!obatMedikasi.value?.obat_pre_medikasi) return notifErrVue('Obat pre medikasi tidak boleh kosong')
  if (!Array.isArray(store.formInduksi.obat_pre_medikasi)) {
    store.formInduksi.obat_pre_medikasi = []
  }
  store.formInduksi.obat_pre_medikasi.push(obatMedikasi.value)
  obatMedikasi.value = {}
  inputObatMedikasi.value?.focus?.()
}
const options = ref([
  {
    label: 'Ya',
    value: 'Ya'
  },
  {
    label: 'Tidak',
    value: 'Tidak'
  },
])

const RenAnasOptions = ref([
  {
    label: 'Umum',
    value: 'Umum'
  },
  {
    label: 'Regional',
    value: 'Regional'
  },
])

const RegionAnasOptions = ref([
  {
    label: 'Spinal',
    value: 'Spinal'
  },
  {
    label: 'Epidural',
    value: 'Epidural'
  },
  {
    label: 'Blok Syaraf',
    value: 'Blok Syaraf'
  },
])
const UmumAnasOptions = ref([
  {
    label: 'Intubasi',
    value: 'Intubasi'
  },
  {
    label: 'LMA',
    value: 'LMA'
  },
  {
    label: 'Face mask',
    value: 'Face mask'
  },
  {
    label: 'TIVA',
    value: 'TIVA'
  },
])

const optionMallapatis = ref([
  {
    label: 'Grade I',
    value: 'Grade I'
  },
  {
    label: 'Grade II',
    value: 'Grade II'
  },
  {
    label: 'Grade III',
    value: 'Grade III'
  },
  {
    label: 'Grade IV',
    value: 'Grade IV'
  },
])

const SkorNyeriOptions = ref([
  {
    label: 'Ringan (0-3)',
    value: 'Ringan (0-3)'
  },
  {
    label: 'Sedang (4-6)',
    value: 'Sedang (4-6)'
  },
  {
    label: 'Berat (7-10)',
    value: 'Berat (7-10)'
  },
])

const KlasifikasiAsaOptions = ref([
  {
    label: '1',
    value: '1'
  },
  {
    label: '2',
    value: '2'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '5',
    value: '5'
  },
  {
    label: 'E',
    value: 'E'
  },
])

const optionKesadaran = ref([
  { value: 'Compos Mentis', label: 'Compos Mentis' },
  { value: 'Apatis', label: 'Apatis' },
  { value: 'Samnolen', label: 'Samnolen' },
  { value: 'Sopor', label: 'Sopor' },
  { value: 'Delirium', label: 'Delirium' },
  { value: 'Coma', label: 'Coma' }
])

const RencPemulihanPascaAnaOptions = ref([
  {
    label: 'ICU',
    value: 'ICU'
  },
  {
    label: 'HCU',
    value: 'HCU'
  },
  {
    label: 'Recovery Room',
    value: 'Recovery Room'
  },
])

const RencManagementNyesiOptions = ref([
  {
    label: 'IV Bolus',
    value: 'IV Bolus'
  },
  {
    label: 'Oral',
    value: 'Oral'
  },
  {
    label: 'Supp',
    value: 'Supp'
  },
  {
    label: 'IV Kontinue',
    value: 'IV Kontinue'
  },
  {
    label: 'Patch',
    value: 'Patch'
  },
])

const store = useAssasementPraBedahStore()
const laporanOp = useLaporanOperasiStore()

const refDiagnosa = ref(null)
function isFilled (val) {
  if (val === null || val === undefined) return false
  if (typeof val === 'string') return val.trim().length > 0
  if (typeof val === 'number') return !isNaN(val)
  if (Array.isArray(val)) return val.length > 0
  if (typeof val === 'object') return Object.keys(val).length > 0
  return !!val
}
const allTindakanOp = computed(() => {
  const list = props.pasien?.manytindakanop
  if (Array.isArray(list) && list.length > 0) {
    const names = list.map(v => v?.mastertindakanoperasi?.rs2 || v?.rs2 || v?.nama).filter(Boolean)
    return names.length ? names.join(', ') : ''
  }
  return ''
})

const firstTindakanOp = computed(() => {
  const list = props.pasien?.manytindakanop
  if (Array.isArray(list) && list.length > 0) {
    const item = list[0]
    return item?.mastertindakanoperasi?.rs2 || item?.rs2 || item?.nama || ''
  }
  return ''
})

const listObatPermintaan = computed(() => {
  const names = new Set()

  const addName = (n) => {
    if (n && typeof n === 'string' && n.trim().length > 0) {
      names.add(n.trim())
    }
  }

  const extractFromList = (list) => {
    if (!Array.isArray(list)) return
    list.forEach(p => {
      if (!p) return
      addName(p?.obat?.nama_obat || p?.nama_obat || p?.namaobat || p?.masterobat?.nama_obat)

      const rinci = p?.rinci || p?.rincian || p?.details || p?.permintaanresep || []
      if (Array.isArray(rinci)) {
        rinci.forEach(r => {
          if (!r) return
          addName(r?.obat?.nama_obat || r?.nama_obat || r?.namaobat || r?.masterobat?.nama_obat)
        })
      }
    })
  }

  extractFromList(props.pasien?.permintaanobatoperasi)
  extractFromList(props.pasien?.permintaanresep)
  extractFromList(props.pasien?.resep)
  extractFromList(props.pasien?.eresep)
  extractFromList(props.pasien?.newapotekrajal)
  extractFromList(props.pasien?.reseprajal)
  extractFromList(props.pasien?.resepranap)

  return Array.from(names).map(nama => ({
    name: nama,
    nama_obat: nama
  }))
})

function formatNoZero (val) {
  if (val === null || val === undefined || val === '') return ''
  const str = String(val).trim().replace(',', '.')
  if (isNaN(str)) return str
  const num = parseFloat(str)
  if (isNaN(num)) return str
  return String(num)
}

function cleanFormVitalSigns () {
  if (store.formInduksi) {
    if (store.formInduksi.vit_td_sistole) store.formInduksi.vit_td_sistole = formatNoZero(store.formInduksi.vit_td_sistole)
    if (store.formInduksi.vit_td_diastole) store.formInduksi.vit_td_diastole = formatNoZero(store.formInduksi.vit_td_diastole)
    if (store.formInduksi.vit_nadi) store.formInduksi.vit_nadi = formatNoZero(store.formInduksi.vit_nadi)
    if (store.formInduksi.vit_rr) store.formInduksi.vit_rr = formatNoZero(store.formInduksi.vit_rr)
    if (store.formInduksi.vit_suhu) store.formInduksi.vit_suhu = formatNoZero(store.formInduksi.vit_suhu)
  }
}

function handleSimpan () {
  cleanFormVitalSigns()
  store.simpanFormInduksi(props.pasien)
}

watch(() => props.pasien, (newPasien) => {
  if (newPasien?.pra_induksi && Object.keys(newPasien.pra_induksi).length > 0) {
    store.formInduksi = { ...newPasien.pra_induksi }
    if (!Array.isArray(store.formInduksi.obat_pre_medikasi)) {
      store.formInduksi.obat_pre_medikasi = []
    }
  }
  cleanFormVitalSigns()
  store.obats = listObatPermintaan.value
  if (!store.formInduksi?.diagnosa && newPasien?.rs4) {
    store.formInduksi.diagnosa = newPasien.rs4
  }
  if (!store.formInduksi?.rencana_bedah && firstTindakanOp.value) {
    store.formInduksi.rencana_bedah = firstTindakanOp.value
  }
}, { immediate: true, deep: true })

onMounted(() => {
  if (!laporanOp.nakes?.length) laporanOp.getNakes()
  if (props.pasien?.pra_induksi && Object.keys(props.pasien.pra_induksi).length > 0) {
    store.formInduksi = { ...props.pasien.pra_induksi }
    if (!Array.isArray(store.formInduksi.obat_pre_medikasi)) {
      store.formInduksi.obat_pre_medikasi = []
    }
  }
  cleanFormVitalSigns()
  store.obats = listObatPermintaan.value
  if (!store.formInduksi?.diagnosa && props.pasien?.rs4) {
    store.formInduksi.diagnosa = props.pasien.rs4
  }
  if (!store.formInduksi?.rencana_bedah && firstTindakanOp.value) {
    store.formInduksi.rencana_bedah = firstTindakanOp.value
  }
})
</script>


<style lang="scss" scoped>
.style-form {
  max-width: 1400px;
  margin: 0 auto;
}
.border-blue {
  border: 1px solid #90caf9;
}
.border-grey {
  border: 1px solid #e0e0e0;
}
.border-orange {
  border: 1px solid #ffcc80;
}
.border-indigo {
  border: 1px solid #c5cae9;
}
.border-left-primary {
  border-left: 3px solid #1976d2;
}
.doc-table-styled {
  border-collapse: collapse;
  width: 100%;
  th, td {
    border: 1px solid #e0e0e0;
  }
}
</style>
