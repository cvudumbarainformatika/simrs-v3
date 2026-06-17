<template>
  <div class="q-pa-lg"
    style="margin-bottom: 100px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh;">
    <div class="style-form">
      <!-- Header -->
      <div class="q-mb-lg">
        <div class="bg-primary text-white q-pa-md text-center text-weight-bold rounded-borders"
          style="font-size: 20px; letter-spacing: 0.5px;">
          <q-icon name="assignment" size="md" class="q-mr-md" />
          ASUHAN KEPERAWATAN / KEPENATAAN ANESTESI
        </div>
      </div>

      <q-form ref="formRef" @submit="simpanData">
        <!-- ===== SECTION A: PRA ANESTESI ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header">
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="assignment_ind" class="q-mr-md" />A. PRA ANESTESI
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- Data Dasar -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md"> Diagnosa & Tindakan</div>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-sm-4">
                <q-input v-model="store.form.pra_diagnosa" label="Diagnosa" outlined dense maxlength="255" />
              </div>
              <div class="col-xs-12 col-sm-4">
                <div class="text-weight-bold q-mb-xs">Tindakan Operasi</div>
                <div class="text-primary text-weight-medium">
                  {{ ambilTidakanOperasi(pasien?.manytindakanop) }}
                </div>
              </div>
            </div>

            <!-- Vital Signs -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Vital Signs & Antropometri</div>
            <div class="row q-col-gutter-lg q-mb-lg vital-signs-box q-pa-md">
              <div class="col-xs-12 col-sm-3">
                <q-input v-model="store.form.pra_keadaan_umum" label="Keadaan Umum" outlined dense maxlength="255" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pra_bb" label="BB (kg)" outlined dense type="number" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pra_tb" label="TB (cm)" outlined dense type="number" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pra_gol_darah" label="Gol. Darah" outlined dense maxlength="255" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pra_td" label="Tensi (TD)" outlined dense placeholder="120/80"
                  maxlength="255" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pra_nadi" label="Nadi (x/mnt)" outlined dense maxlength="255" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pra_rr" label="RR (x/mnt)" outlined dense maxlength="255" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pra_suhu" label="Suhu (°C)" outlined dense maxlength="255" />
              </div>
            </div>

            <!-- Lab Results -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Hasil Lab</div>
            <div class="row q-col-gutter-lg q-mb-lg lab-box q-pa-md">
              <div class="col-xs-12 col-sm-4">
                <q-input v-model="store.form.pra_hb" label="Hb (g/dL)" outlined dense maxlength="255" />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input v-model="store.form.pra_ht" label="Ht (%)" outlined dense maxlength="255" />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input v-model="store.form.pra_gds" label="GDS (mg/dL)" outlined dense maxlength="255" />
              </div>
            </div>

            <!-- Pemeriksaan Fisik -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Pemeriksaan Fisik</div>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">I. Respirasi</div>
                  <q-option-group v-model="store.form.pra_respirasi_status" :options="store.opsiNormal" color="primary"
                    inline dense size="sm"
                    @update:model-value="(val) => { setNullIf(val, 'pra_respirasi_status_keterangan', 'Normal') }" />
                  <q-input v-if="store.form.pra_respirasi_status === 'Tidak'"
                    v-model="store.form.pra_respirasi_status_keterangan" label="Sebutkan" outlined dense class="q-mt-md"
                    maxlength="255" />
                  <q-input v-model="store.form.pra_respirasi_sat" label="Saturasi O2 (%)" outlined dense class="q-mt-md"
                    maxlength="255" />
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">II. Kardiovaskular</div>
                  <div class="q-mb-sm">
                    <span class="text-grey-8">Status:</span>
                    <q-option-group v-model="store.form.pra_kardio_status" :options="store.opsiNormal" color="primary"
                      inline dense size="sm"
                      @update:model-value="(val) => { setNullIf(val, 'pra_kardio_status_keterangan', 'Normal') }" />
                    <q-input v-if="store.form.pra_kardio_status === 'Tidak'"
                      v-model="store.form.pra_kardio_status_keterangan" label="Sebutkan" outlined dense class="q-mt-sm"
                      maxlength="255" />
                  </div>
                  <div class="q-mb-sm">
                    <span class="text-grey-8">CRT:</span>
                    <q-option-group v-model="store.form.pra_kardio_crt_detik" :options="store.opsiCRTDetik"
                      color="primary" inline dense size="sm" />
                  </div>
                  <div class="q-mb-sm">
                    <span class="text-grey-8">Kulit:</span>
                    <q-option-group v-model="store.form.pra_kardio_kulit" :options="store.opsiKulit" color="primary"
                      inline dense size="sm" />
                  </div>
                  <div>
                    <span class="text-grey-8">Perdarahan:</span>
                    <q-option-group v-model="store.form.pra_kardio_perdarahan_status" :options="store.opsiPerdarahan"
                      color="primary" inline dense size="sm"
                      @update:model-value="(val) => { setNullIf(val, 'pra_kardio_perdarahan_cc', 'Tidak') }" />
                    <q-input v-if="store.form.pra_kardio_perdarahan_status === 'Ada'"
                      v-model="store.form.pra_kardio_perdarahan_cc" label="Jumlah (cc)" outlined dense class="q-mt-sm"
                      maxlength="255" />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">III. Persyarafan (Kesadaran)</div>
                  <q-option-group v-model="store.form.pra_kesadaran" :options="store.opsiKesadaran" color="primary"
                    dense size="sm" />
                  <q-input v-model="store.form.pra_gcs" label="GCS (E... M... V...)" outlined dense class="q-mt-md"
                    maxlength="255" />
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">IV. Renal & Hepato</div>
                  <div class="q-mb-md">
                    <span class="text-grey-8">Renal:</span>
                    <q-option-group v-model="store.form.pra_renal_status" :options="store.opsiNormal" color="primary"
                      inline dense size="sm"
                      @update:model-value="(val) => { setNullIf(val, 'pra_renal_ket', 'Normal') }" />
                    <q-input v-if="store.form.pra_renal_status === 'Tidak'" v-model="store.form.pra_renal_ket"
                      label="Keterangan Renal" outlined dense class="q-mt-sm" maxlength="255" />
                  </div>
                  <div>
                    <span class="text-grey-8">Hepato:</span>
                    <q-option-group v-model="store.form.pra_hepato_status" :options="store.opsiNormal" color="primary"
                      inline dense size="sm"
                      @update:model-value="(val) => { setNullIf(val, 'pra_hepato_ket', 'Normal') }" />
                    <q-input v-if="store.form.pra_hepato_status === 'Tidak'" v-model="store.form.pra_hepato_ket"
                      label="Keterangan Hepato" outlined dense class="q-mt-sm" maxlength="255" />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">V. Muskuloskeletal & Alergi</div>
                  <div class="q-mb-md">
                    <span class="text-grey-8">Muskuloskeletal:</span>
                    <q-option-group v-model="store.form.pra_muskulo_status" :options="store.opsiNormal" color="primary"
                      inline dense size="sm"
                      @update:model-value="(val) => { setNullIf(val, 'pra_muskulo_ket', 'Normal') }" />
                    <q-input v-if="store.form.pra_muskulo_status === 'Tidak'" v-model="store.form.pra_muskulo_ket"
                      label="Keterangan Muskuloskeletal" outlined dense class="q-mt-sm" maxlength="255" />
                  </div>
                  <div>
                    <span class="text-grey-8">Alergi:</span>
                    <q-option-group v-model="store.form.pra_alergi_status" :options="store.opsiPerdarahan"
                      color="primary" inline dense size="sm"
                      @update:model-value="(val) => { setNullIf(val, 'pra_alergi_riwayat', 'Tidak') }" />
                    <q-input v-if="store.form.pra_alergi_status === 'Ada'" v-model="store.form.pra_alergi_riwayat"
                      label="Riwayat Alergi" outlined dense class="q-mt-sm" maxlength="255" />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">VI. Informed Consent Anestesi</div>
                  <q-option-group v-model="store.form.pra_informed_consent" :options="store.opsiYesNo" color="primary"
                    dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">Skala Nyeri</div>
                  <q-option-group v-model="store.form.pra_nyeri_status" :options="store.opsiYn" color="primary" dense
                    size="sm" @update:model-value="(val) => { setNullIf(val, 'pra_nyeri_skala', 'Tidak') }" />
                  <q-input v-if="store.form.pra_nyeri_status === 'Ya'" v-model="store.form.pra_nyeri_skala"
                    label="Skala Nyeri (1-10)" outlined dense class="q-mt-md" maxlength="255" />
                </div>
              </div>
            </div>

            <!-- Proses Keperawatan -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Proses Keperawatan</div>
            <div class="nursing-process-box q-pa-md">
              <div class="row q-col-gutter-lg">
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Masalah Kesehatan</div>
                  <q-option-group v-model="store.form.pra_masalah_kesehatan" :options="store.opsiPraMasalah"
                    type="checkbox" color="primary" dense size="sm" />
                </div>
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Intervensi</div>
                  <q-option-group v-model="store.form.pra_intervensi" :options="store.opsiPraIntervensi" type="checkbox"
                    color="primary" dense size="sm" />
                  <div class="text-weight-bold q-mb-md q-mt-lg">Implementasi</div>
                  <q-option-group v-model="store.form.pra_implementasi" :options="store.opsiPraImplementasi"
                    type="checkbox" color="primary" dense size="sm" />
                </div>
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Evaluasi</div>
                  <q-option-group v-model="store.form.pra_evaluasi" :options="store.opsiPraEval" type="checkbox"
                    color="primary" dense size="sm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- ===== SECTION B: INTRA ANESTESI ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header">
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="local_hospital" class="q-mr-md" />B. INTRA ANESTESI
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- Waktu Operasi -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Waktu Operasi</div>
            <div class="row q-col-gutter-lg q-mb-lg operation-time-box q-pa-md">
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.intra_jam_mulai_anestesi" label="Jam Mulai Anestesi" outlined dense
                  mask="##:##" placeholder="HH:mm" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.intra_jam_selesai_anestesi" label="Jam Selesai Anestesi" outlined dense
                  mask="##:##" placeholder="HH:mm" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.intra_jam_mulai_bedah" label="Jam Mulai Bedah" outlined dense mask="##:##"
                  placeholder="HH:mm" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.intra_jam_selesai_bedah" label="Jam Selesai Bedah" outlined dense
                  mask="##:##" placeholder="HH:mm" />
              </div>
            </div>

            <!-- Teknik Anestesi -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Teknik & Gas Anestesi</div>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">Teknik Anestesi</div>
                  <q-option-group v-model="store.form.intra_teknik_anestesi" :options="store.opsiTeknikAnestesi"
                    type="checkbox" color="primary" inline dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-sm-6">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">Inhalasi / Gas</div>
                  <q-input v-model="store.form.intra_inhalasi" label="Sevorane / Isoflurane / dll" outlined dense
                    maxlength="255" />
                </div>
              </div>
            </div>

            <!-- Posisi Operasi -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Posisi Operasi</div>
            <div class="exam-box q-pa-md q-mb-lg">
              <div class="text-weight-bold q-mb-sm text-primary">Pilih Posisi Operasi</div>
              <q-option-group v-model="store.form.intra_posisi_operasi" :options="store.opsiPosisiOperasi"
                type="checkbox" color="primary" inline dense size="sm" />
              <q-input v-model="store.form.intra_posisi_lain" label="Posisi Lain-lain" outlined dense class="q-mt-md"
                maxlength="255" />
            </div>

            <!-- Proses Keperawatan -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Proses Keperawatan</div>
            <div class="nursing-process-box q-pa-md">
              <div class="row q-col-gutter-lg">
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Masalah Kesehatan</div>
                  <q-option-group v-model="store.form.intra_masalah_kesehatan" :options="store.opsiIntraMasalah"
                    type="checkbox" color="primary" dense size="sm" />
                </div>
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Intervensi</div>
                  <q-option-group v-model="store.form.intra_intervensi" :options="store.opsiIntraIntervensi"
                    type="checkbox" color="primary" dense size="sm" />
                  <div class="text-weight-bold q-mb-md q-mt-lg">Implementasi</div>
                  <q-option-group v-model="store.form.intra_implementasi" :options="store.opsiIntraImplementasi"
                    type="checkbox" color="primary" dense size="sm" />
                </div>
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Evaluasi</div>
                  <q-option-group v-model="store.form.intra_evaluasi" :options="store.opsiIntraEval" type="checkbox"
                    color="primary" dense size="sm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- ===== SECTION C: PASCA ANESTESI ===== -->
        <q-card outlined class="q-mb-lg card-section">
          <q-card-section class="section-header">
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="healing" class="q-mr-md" />C. PASCA ANESTESI (RUANG PEMULIHAN / RR)
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <!-- Waktu RR -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Waktu Pemulihan</div>
            <div class="row q-col-gutter-lg q-mb-lg recovery-box q-pa-md">
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pasca_jam_masuk_rr" label="Jam Masuk RR" outlined dense mask="##:##"
                  placeholder="HH:mm" />
              </div>
              <div class="col-xs-6 col-sm-3">
                <q-input v-model="store.form.pasca_jam_keluar_rr" label="Jam Keluar RR" outlined dense mask="##:##"
                  placeholder="HH:mm" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input v-model="store.form.pasca_spo2" label="Saturasi SpO2 Akhir (%)" outlined dense
                  maxlength="255" />
              </div>
            </div>

            <!-- Pemeriksaan Pasca -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Pemeriksaan Pasca Anestesi</div>
            <div class="row q-col-gutter-lg q-mb-lg">
              <div class="col-xs-12 col-sm-4">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">1. Pernafasan</div>
                  <q-option-group v-model="store.form.pasca_pernafasan_status" :options="store.opsiPascaNafas"
                    type="checkbox" color="primary" dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-sm-4">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">Pola Nafas</div>
                  <q-option-group v-model="store.form.pasca_pola_nafas" :options="store.opsiPolaNafas" color="primary"
                    dense size="sm" />
                </div>
              </div>
              <div class="col-xs-12 col-sm-4">
                <div class="exam-box q-pa-md">
                  <div class="text-weight-bold q-mb-sm text-primary">2. Sirkulasi / TTV RR</div>
                  <q-input v-model="store.form.pasca_td" label="TD Pasca" outlined dense class="q-mb-sm"
                    placeholder="110/70" maxlength="255" />
                  <q-input v-model="store.form.pasca_nadi" label="Nadi Pasca" outlined dense class="q-mb-sm"
                    maxlength="255" />
                  <q-input v-model="store.form.pasca_suhu" label="Suhu Pasca" outlined dense maxlength="255" />
                </div>
              </div>
            </div>

            <!-- Skoring Pemulihan -->
            <!-- <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Skoring Pemulihan</div>
            <div class="scoring-box q-pa-md q-mb-lg">
              <div class="row q-col-gutter-lg">
                <div class="col-xs-12 col-sm-6">
                  <q-input v-model="store.form.pasca_steward_score" label="Steward Score (Anak)" outlined dense
                    placeholder="Isi total / kriteria" maxlength="255" />
                </div>
                <div class="col-xs-12 col-sm-6">
                  <q-input v-model="store.form.pasca_bromage_score" label="Bromage Score (Regional)" outlined dense
                    placeholder="Isi total / kriteria" maxlength="255" />
                </div>
              </div>
            </div> -->

            <!-- Proses Keperawatan -->
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md">Proses Keperawatan</div>
            <div class="nursing-process-box q-pa-md">
              <div class="row q-col-gutter-lg">
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Masalah Kesehatan</div>
                  <q-option-group v-model="store.form.pasca_masalah_kesehatan" :options="store.opsiPascaMasalah"
                    type="checkbox" color="primary" dense size="sm" />
                </div>
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Intervensi</div>
                  <q-option-group v-model="store.form.pasca_intervensi" :options="store.opsiPascaIntervensi"
                    type="checkbox" color="primary" dense size="sm" />
                  <div class="text-weight-bold q-mb-md q-mt-lg">Implementasi</div>
                  <q-option-group v-model="store.form.pasca_implementasi" :options="store.opsiPascaImplementasi"
                    type="checkbox" color="primary" dense size="sm" />
                </div>
                <div class="col-xs-12 col-sm-4">
                  <div class="text-weight-bold q-mb-md">Evaluasi / Target</div>
                  <q-option-group v-model="store.form.pasca_evaluasi" :options="store.opsiPascaEval" type="checkbox"
                    color="primary" dense size="sm" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Action Buttons -->
        <div class="row justify-end q-col-gutter-md q-mt-lg sticky-buttons">
          <div class="col-auto">
            <q-btn label="Reset Form" type="button" color="grey-7" icon="refresh" class="q-px-lg" @click="resetData"
              unelevated />
          </div>
          <div class="col-auto">
            <q-btn label="Simpan Rekam Medis" type="submit" color="primary" icon="save" class="q-px-lg"
              :loading="loading" unelevated />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAsuhanAnastesiStore } from 'src/stores/simrs/kamaroperasi/asuhan/asuhanAnastesi'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const $q = useQuasar()
const store = useAsuhanAnastesiStore()
const formRef = ref(null)
const loading = ref(false)

function simpanData () {
  if (!formRef.value) return

  formRef.value.validate().then(async (success) => {
    if (!success) {
      $q.notify({
        type: 'negative',
        message: 'Harap isi semua field yang wajib diisi',
        position: 'top'
      })
      return
    }

    loading.value = true
    try {
      await store.saveFormAnestesi()
      $q.notify({
        type: 'positive',
        message: 'Rekam Medis Anestesi berhasil disimpan',
        position: 'top'
      })
      // store.resetForm()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menyimpan data: ' + (error.response?.data?.message || error.message),
        position: 'top'
      })
    } finally {
      loading.value = false
    }
  })
}


function setNullIf (value, keyToSet, condition) {
  if (value == condition) {
    store.form[keyToSet] = null
  }
}

function resetData () {
  $q.dialog({
    title: 'Reset Form',
    message: 'Anda yakin ingin menghapus semua data form?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.resetForm(props.pasien)
  })
}


function ambilTidakanOperasi (val) {
  const data = val?.length > 0 ? val?.map(v => v?.mastertindakanoperasi?.rs2).join(', ') : 'Belum ada Tindakan Operasi'
  return data
}

onMounted(() => {
  store.getAsuhanAnastesi(props.pasien)
})
</script>

<style lang="scss" scoped>
.style-form {
  max-width: 1400px;
  margin: 0 auto;
}

.card-section {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);

  .section-header {
    background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%);
    border-bottom: 3px solid #1976d2;
    padding: 16px !important;
  }
}

.vital-signs-box,
.lab-box,
.operation-time-box,
.recovery-box {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

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

.nursing-process-box {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%);
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.scoring-box {
  background: linear-gradient(135deg, #fff8e6 0%, #ffe8cc 100%);
  border: 1px solid #ffe0b2;
  border-radius: 8px;
  border-left: 4px solid #f57c00;
}

.sticky-buttons {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.f-18 {
  font-size: 18px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nursing-process-box {
    .row {
      flex-direction: column;

      >[class*="col"] {
        margin-bottom: 16px;
      }
    }
  }
}
</style>
