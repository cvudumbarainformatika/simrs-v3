<template>
  <q-scroll-area style="height: calc(100vh - 130px);" class="fit">
    <q-form ref="formRef" @submit="onSubmit" class="q-pa-sm text-dark font-sans">
      <q-card flat bordered class="q-mb-md rounded-borders bg-white shadow-1">
        <!-- HEADER DOKTER ANESTESI -->
        <q-card-section class="bg-primary text-white q-py-sm flex items-center justify-between">
          <div class="text-subtitle1 text-bold flex items-center">
            <q-icon name="icon-mat-assignment" size="22px" class="q-mr-sm" />
            FORM ASESMEN PRA SEDASI (RM IRNA - 38d)
          </div>
          <div class="text-caption bg-white text-primary q-px-sm rounded-borders text-bold">
            DIISI OLEH DOKTER ANESTESI
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md items-center">
            <div class="col-12 col-md-6">
              <app-autocomplete-new
                v-model="store.form.kddokter"
                label="Dokter Anestesi"
                autocomplete="nama"
                option-value="kdpegsimrs"
                option-label="nama"
                outlined
                dense
                :source="storeDokters"
                @on-select="(val) => {
                  store.form.kddokter = val
                  store.form.dokter = storeDokters?.find(item => item.kdpegsimrs === val)?.nama
                }"
                @clear="() => {
                  store.form.kddokter = null
                  store.form.dokter = null
                }"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 1. KAJIAN SISTEM -->
        <q-card-section class="q-pa-md">
          <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
            <q-icon name="icon-mat-checklist" size="18px" class="q-mr-xs" />
            1. KAJIAN SISTEM
          </div>

          <div class="row q-col-gutter-md">
            <!-- Box Kolom 1 -->
            <div class="col-12 col-md-6">
              <q-card flat bordered class="bg-grey-1">
                <q-card-section class="q-pa-xs">
                  <div v-for="(item, idx) in kajianCol1" :key="idx" class="row items-center justify-between q-pa-xs border-bottom-light">
                    <div class="col-7 text-caption text-bold text-dark">{{ item.label }}</div>
                    <div class="col-5 text-right no-wrap">
                      <q-radio dense v-model="store.form.kajian_sistem[item.key]" val="Ya" label="Ya" color="teal" class="q-mr-md" />
                      <q-radio dense v-model="store.form.kajian_sistem[item.key]" val="Tidak" label="Tidak" color="negative" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Box Kolom 2 -->
            <div class="col-12 col-md-6">
              <q-card flat bordered class="bg-grey-1">
                <q-card-section class="q-pa-xs">
                  <div v-for="(item, idx) in kajianCol2" :key="idx" class="row items-center justify-between q-pa-xs border-bottom-light">
                    <div class="col-7 text-caption text-bold text-dark">{{ item.label }}</div>
                    <div class="col-5 text-right no-wrap">
                      <q-radio dense v-model="store.form.kajian_sistem[item.key]" val="Ya" label="Ya" color="teal" class="q-mr-md" />
                      <q-radio dense v-model="store.form.kajian_sistem[item.key]" val="Tidak" label="Tidak" color="negative" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 q-mt-xs">
              <q-input
                v-model="store.form.keterangan_kajian_sistem"
                label="Keterangan Kajian Sistem"
                outlined
                type="textarea"
                rows="3"
                standout="bg-yellow-2"
                style="min-height: 85px;"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 2. PEMERIKSAAN FISIK -->
        <q-card-section class="q-pa-md">
          <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
            <q-icon name="icon-mat-monitor_heart" size="18px" class="q-mr-xs" />
            2. PEMERIKSAAN FISIK (VITAL SIGNS)
          </div>
          <div class="row q-col-gutter-sm bg-grey-1 q-pa-sm rounded-borders">
            <div class="col-6 col-sm-2">
              <app-input-simrs v-model="store.form.tinggi" label="Tinggi (cm)" />
            </div>
            <div class="col-6 col-sm-2">
              <app-input-simrs v-model="store.form.berat" label="Berat (kg)" />
            </div>
            <div class="col-6 col-sm-3">
              <app-input-simrs v-model="store.form.tekanan_darah" label="Tekanan Darah (mmHg)" />
            </div>
            <div class="col-6 col-sm-2">
              <app-input-simrs v-model="store.form.nadi" label="Nadi (x/mnt)" />
            </div>
            <div class="col-12 col-sm-3">
              <app-input-simrs v-model="store.form.suhu" label="Suhu (°C)" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 3. KEADAAN UMUM -->
        <q-card-section class="q-pa-md">
          <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
            <q-icon name="icon-mat-accessibility" size="18px" class="q-mr-xs" />
            3. KEADAAN UMUM
          </div>
          <div class="row q-col-gutter-sm bg-grey-1 q-pa-sm rounded-borders">
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.skor_mallampati" label="Skor Mallampati" />
            </div>
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.gigi_palsu" label="Gigi Palsu" />
            </div>
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.jantung" label="Jantung" />
            </div>
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.paru_paru" label="Paru-paru" />
            </div>
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.abdomen" label="Abdomen" />
            </div>
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.tulang_belakang" label="Tulang Belakang" />
            </div>
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.ekstremitas" label="Ekstremitas" />
            </div>
            <div class="col-12 col-md-6">
              <app-input-simrs v-model="store.form.neurologi" label="Neurologi (bila dapat diperiksa)" />
            </div>
            <div class="col-12">
              <q-input
                v-model="store.form.keterangan_keadaan_umum"
                label="Keterangan Keadaan Umum"
                outlined
                type="textarea"
                rows="3"
                standout="bg-yellow-2"
                style="min-height: 85px;"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 4. LABORATORIUM -->
        <q-card-section class="q-pa-md">
          <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
            <q-icon name="icon-mat-science" size="18px" class="q-mr-xs" />
            4. LABORATORIUM (bila tersedia)
          </div>
          <div class="row q-col-gutter-sm bg-grey-1 q-pa-sm rounded-borders">
            <!-- Left Col -->
            <div class="col-12 col-md-6">
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.hbHtCheck" label="Hb/Ht :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.hbHt" label="Hasil Hb/Ht" :disable="!store.form.laboratorium.hbHtCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.ptCheck" label="PT :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.pt" label="Hasil PT" :disable="!store.form.laboratorium.ptCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.glukosaDarahCheck" label="Glukosa Darah :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.glukosaDarah" label="Hasil Glukosa Darah" :disable="!store.form.laboratorium.glukosaDarahCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.tesKehamilanCheck" label="Tes Kehamilan :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.tesKehamilan" label="Hasil Tes Kehamilan" :disable="!store.form.laboratorium.tesKehamilanCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.kaliumCheck" label="Kalium :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.kalium" label="Hasil Kalium" :disable="!store.form.laboratorium.kaliumCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.ureumCheck" label="Ureum :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.ureum" label="Hasil Ureum" :disable="!store.form.laboratorium.ureumCheck" /></div>
              </div>
            </div>
            <!-- Right Col -->
            <div class="col-12 col-md-6">
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.leukositCheck" label="Leukosit :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.leukosit" label="Hasil Leukosit" :disable="!store.form.laboratorium.leukositCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.trombositCheck" label="Trombosit :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.trombosit" label="Hasil Trombosit" :disable="!store.form.laboratorium.trombositCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.rontgenDadaCheck" label="Rontgen Dada :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.rontgenDada" label="Hasil Rontgen Dada" :disable="!store.form.laboratorium.rontgenDadaCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.ekgCheck" label="EKG (>= 40 thn) :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.ekg" label="Hasil EKG" :disable="!store.form.laboratorium.ekgCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.naClCheck" label="Na / Cl :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.naCl" label="Hasil Na/Cl" :disable="!store.form.laboratorium.naClCheck" /></div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-checkbox v-model="store.form.laboratorium.kreatininCheck" label="Kreatinin :" dense class="col-4 text-bold" />
                <div class="col-8"><app-input-simrs v-model="store.form.laboratorium.kreatinin" label="Hasil Kreatinin" :disable="!store.form.laboratorium.kreatininCheck" /></div>
              </div>
            </div>
            <div class="col-12 q-mt-xs">
              <q-input
                v-model="store.form.keterangan_laboratorium"
                label="Keterangan Laboratorium"
                outlined
                type="textarea"
                rows="3"
                standout="bg-yellow-2"
                style="min-height: 85px;"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 5. DIAGNOSIS & ASA CLASSIFICATION -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
                <q-icon name="icon-mat-medical_information" size="18px" class="q-mr-xs" />
                5. DIAGNOSIS (ICD X)
              </div>
              <div class="bg-grey-1 q-pa-sm rounded-borders">
                <app-input-simrs v-model="store.form.diagnosis[0]" label="1. Diagnosis Utama" class="q-mb-sm" />
                <app-input-simrs v-model="store.form.diagnosis[1]" label="2. Diagnosis Sekunder" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
                <q-icon name="icon-mat-grade" size="18px" class="q-mr-xs" />
                6. ASA CLASSIFICATION
              </div>
              <div class="bg-grey-1 q-pa-sm rounded-borders">
                <div v-for="asa in store.asaOptions" :key="asa.value" class="q-mb-xs">
                  <q-radio v-model="store.form.asa_classification" :val="asa.value" :label="asa.label" dense color="teal" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 7. PENYULIT SEDASI LAIN & CATATAN TINDAK LANJUT -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
                <q-icon name="icon-mat-warning" size="18px" class="q-mr-xs" />
                7. PENYULIT SEDASI LAIN
              </div>
              <div class="bg-grey-1 q-pa-sm rounded-borders">
                <app-input-simrs v-model="store.form.penyulit_sedasi_lain[0]" label="1. Penyulit Sedasi 1" class="q-mb-sm" />
                <app-input-simrs v-model="store.form.penyulit_sedasi_lain[1]" label="2. Penyulit Sedasi 2" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
                <q-icon name="icon-mat-note_alt" size="18px" class="q-mr-xs" />
                8. CATATAN TINDAK LANJUT
              </div>
              <div class="bg-grey-1 q-pa-sm rounded-borders">
                <q-input
                  v-model="store.form.catatan_tindak_lanjut"
                  label="Catatan Tindak Lanjut"
                  outlined
                  type="textarea"
                  rows="3"
                  standout="bg-yellow-2"
                  style="min-height: 85px;"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 9. PERENCANAAN SEDASI (SS2) -->
        <q-card-section class="q-pa-md">
          <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
            <q-icon name="icon-mat-event_note" size="18px" class="q-mr-xs" />
            9. PERENCANAAN SEDASI
          </div>
          <div class="bg-grey-1 q-pa-sm rounded-borders row q-col-gutter-sm">
            <div class="col-12">
              <app-input-simrs v-model="store.form.teknik_sedasi" label="Teknik Sedasi" />
            </div>
            <div class="col-12">
              <div class="text-caption text-bold q-mb-xs">Teknik Khusus :</div>
              <div class="row q-gutter-sm items-center">
                <q-checkbox
                  v-for="opt in store.teknikKhususOptions"
                  :key="opt"
                  v-model="store.form.teknik_khusus"
                  :val="opt"
                  :label="opt"
                  dense
                  color="teal"
                />
              </div>
              <div v-if="store.form.teknik_khusus.includes('Lain-lain')" class="q-mt-sm">
                <app-input-simrs v-model="store.form.teknik_khusus_lain" label="Sebutkan Teknik Khusus Lainnya" />
              </div>
            </div>

            <div class="col-12 q-mt-sm">
              <div class="text-caption text-bold q-mb-xs">Perawatan Pasca Sedasi :</div>
              <div class="row q-gutter-md items-center">
                <q-radio
                  v-for="opt in store.perawatanPascaSedasiOptions"
                  :key="opt"
                  v-model="store.form.perawatan_pasca_sedasi"
                  :val="opt"
                  :label="opt"
                  dense
                  color="teal"
                />
              </div>
              <!-- Sub Options for Rawat Khusus -->
              <div v-if="store.form.perawatan_pasca_sedasi === 'Rawat Khusus'" class="q-ml-md q-mt-sm bg-blue-1 q-pa-sm rounded-borders">
                <div class="text-caption text-bold q-mb-xs">Pilih Rawat Khusus:</div>
                <div class="row q-gutter-sm items-center">
                  <q-radio
                    v-for="rk in store.rawatKhususOptions"
                    :key="rk"
                    v-model="store.form.rawat_khusus_opt"
                    :val="rk"
                    :label="rk"
                    dense
                    color="indigo"
                  />
                </div>
                <q-input
                  v-if="store.form.rawat_khusus_opt === 'Lain-lain'"
                  v-model="store.form.rawat_khusus_lain"
                  label="Keterangan Rawat Khusus Lainnya"
                  outlined
                  type="textarea"
                  rows="3"
                  standout="bg-yellow-2"
                  class="q-mt-xs"
                  style="min-height: 85px;"
                />
              </div>
              <div v-if="store.form.perawatan_pasca_sedasi === 'APS'" class="q-ml-md q-mt-sm">
                <q-input
                  v-model="store.form.aps_ket"
                  label="Keterangan APS"
                  outlined
                  type="textarea"
                  rows="3"
                  standout="bg-yellow-2"
                  style="min-height: 85px;"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- 10. PERSIAPAN PRA SEDASI (SS2) -->
        <q-card-section class="q-pa-md">
          <div class="text-subtitle2 text-bold text-primary q-mb-sm flex items-center">
            <q-icon name="icon-mat-alarm" size="18px" class="q-mr-xs" />
            10. PERSIAPAN PRA SEDASI
          </div>
          <div class="bg-grey-1 q-pa-sm rounded-borders row q-col-gutter-sm">
            <!-- Puasa Mulai -->
            <div class="col-12 col-sm-6">
              <app-input-simrs v-model="store.form.puasa_mulai_jam" label="Puasa Mulai (Jam e.g. 08:00)" />
            </div>
            <div class="col-12 col-sm-6">
              <app-input-date :model="store.form.puasa_mulai_tgl" label="Puasa Mulai (Tanggal)" outlined dense @set-model="val => store.form.puasa_mulai_tgl = val" />
            </div>

            <!-- Pre Medikasi -->
            <div class="col-12 col-sm-6">
              <app-input-simrs v-model="store.form.pre_medikasi_jam" label="Pre Medikasi (Jam)" />
            </div>
            <div class="col-12 col-sm-6">
              <app-input-date :model="store.form.pre_medikasi_tgl" label="Pre Medikasi (Tanggal)" outlined dense @set-model="val => store.form.pre_medikasi_tgl = val" />
            </div>

            <!-- Mulai Sedasi -->
            <div class="col-12 col-sm-6">
              <app-input-simrs v-model="store.form.mulai_sedasi_jam" label="Mulai Sedasi (Jam)" />
            </div>
            <div class="col-12 col-sm-6">
              <app-input-date :model="store.form.mulai_sedasi_tgl" label="Mulai Sedasi (Tanggal)" outlined dense @set-model="val => store.form.mulai_sedasi_tgl = val" />
            </div>

            <!-- Catatan Persiapan Pra Sedasi -->
            <div class="col-12 q-mt-xs">
              <q-input
                v-model="store.form.catatan_persiapan_pra_sedasi"
                label="CATATAN PERSIAPAN PRA SEDASI"
                outlined
                type="textarea"
                rows="3"
                standout="bg-yellow-2"
                style="min-height: 85px;"
              />
            </div>
          </div>
        </q-card-section>

        <!-- BOTTOM ACTIONS -->
        <q-card-section class="bg-grey-2 q-pa-sm flex justify-between items-center">
          <q-btn label="Reset Form" color="negative" outline icon="icon-mat-refresh" @click="store.initForm()" />
          <q-btn label="Simpan Pra Sedasi" color="primary" icon="icon-mat-save" :loading="store.loadingSave" type="submit" />
        </q-card-section>
      </q-card>
    </q-form>
  </q-scroll-area>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePraSedasiRanapStore } from 'src/stores/simrs/ranap/prasedasi'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'

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

const store = usePraSedasiRanapStore()
const storePengunjung = usePengunjungRanapStore()

const storeDokters = computed(() => {
  return storePengunjung?.nakes?.filter(x => x?.kdgroupnakes === '1') ?? []
})

const kajianCol1 = [
  { label: 'Hilangnya Gigi', key: 'hilangnyaGigi' },
  { label: 'Masalah mobilisasi leher', key: 'masalahMobilisasiLeher' },
  { label: 'Leher Pendek', key: 'leherPendek' },
  { label: 'Batuk', key: 'batuk' },
  { label: 'Sesak Nafas', key: 'sesakNafas' },
  { label: 'Baru saja menderita infeksi', key: 'baruSajaInfeksi' },
  { label: 'Saluran nafas atas sakit dada', key: 'saluranNafasSakitDada' },
  { label: 'Denyut Jantung tidak normal', key: 'denyutJantungTidakNormal' }
]

const kajianCol2 = [
  { label: 'Muntah', key: 'muntah' },
  { label: 'Pingsan', key: 'pingsan' },
  { label: 'Stroke', key: 'stroke' },
  { label: 'Kejang', key: 'kejang' },
  { label: 'Sedang Hamil', key: 'sedangHamil' },
  { label: 'Kelainan tulang belakang', key: 'kelainanTulangBelakang' },
  { label: 'Obesitas', key: 'obesitas' }
]

function onSubmit() {
  store.saveData(props.pasien)
}
</script>

<style lang="scss" scoped>
.border-bottom-light {
  border-bottom: 1px dashed #e0e0e0;
}
</style>
