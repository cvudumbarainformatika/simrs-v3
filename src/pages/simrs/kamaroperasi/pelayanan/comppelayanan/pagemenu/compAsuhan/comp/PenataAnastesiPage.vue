<template>
  <div class="q-pa-md style-form" style="margin-bottom: 100px;">
    <q-form @submit="simpanData">

      <div class="row bg-primary text-white q-pa-md justify-center text-weight-bold f-18 rounded-borders q-mb-md">
        ASUHAN KEPERAWATAN / KEPENATAAN ANESTESI
      </div>

      <q-card outlined class="q-mb-md q-pa-sm">
        <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">A. PRA ANESTESI</div>

        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-xs-12 col-sm-4">
            <q-input v-model="store.form.pra_nama" label="Nama Pasien" outlined dense maxlength="255" />
          </div>
          <div class="col-xs-12 col-sm-4">
            <q-input v-model="store.form.pra_no_rm" label="No. RM" outlined dense maxlength="255" />
          </div>
          <div class="col-xs-12 col-sm-4">
            <q-input v-model="store.form.pra_diagnosa" label="Diagnosa" outlined dense maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-sm items-center">
          <div class="col-xs-6 col-sm-2">
            <q-input v-model="store.form.pra_bb" label="BB (kg)" outlined dense type="number" />
          </div>
          <div class="col-xs-6 col-sm-2">
            <q-input v-model="store.form.pra_tb" label="TB (cm)" outlined dense type="number" />
          </div>
          <div class="col-xs-12 col-sm-2">
            <q-input v-model="store.form.pra_gol_darah" label="Gol. Darah" outlined dense maxlength="255" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="store.form.pra_keadaan_umum" label="Keadaan Umum" outlined dense maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-xs-6 col-sm-3">
            <q-input v-model="store.form.pra_td" label="Tensi (TD)" outlined dense placeholder="eg: 120/80"
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

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-4">
            <q-input v-model="store.form.pra_hb" label="Hb" outlined dense maxlength="255" />
          </div>
          <div class="col-4">
            <q-input v-model="store.form.pra_ht" label="Ht" outlined dense maxlength="255" />
          </div>
          <div class="col-4">
            <q-input v-model="store.form.pra_gds" label="GDS" outlined dense maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">I. Respirasi (Saturasi O2)</div>
            <q-input v-model="store.form.pra_respirasi_sat" label="Sebutkan/Isi" outlined dense maxlength="255" />
          </div>
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">II. Kardiovaskular</div>
            <q-input v-model="store.form.pra_kardio_crt" label="CRT, Kulit, Perdarahan" outlined dense
              maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">III. Persyarafan (Kesadaran)</div>
            <q-option-group v-model="store.form.pra_kesadaran" :options="store.opsiKesadaran" color="primary" inline
              dense size="sm" />
            <q-input v-model="store.form.pra_gcs" label="GCS (E... M... V...)" outlined dense class="q-mt-xs"
              maxlength="255" />
          </div>
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">IV & V. Renal, Endokrin, Hepato, Gastro</div>
            <q-input v-model="store.form.pra_renal_hepato" label="Keterangan klinis" outlined dense maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">VI & VII. Muskuloskeletal & Alergi</div>
            <q-input v-model="store.form.pra_muskulo_alergi" label="Riwayat Alergi / Lain-lain" outlined dense
              maxlength="255" />
          </div>
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">Skala Nyeri</div>
            <q-option-group v-model="store.form.pra_nyeri_status" :options="store.opsiYn" color="primary" inline dense
              size="sm" />
            <q-input v-if="store.form.pra_nyeri_status === 'Ya'" v-model="store.form.pra_nyeri_skala"
              label="Skala Nyeri" outlined dense class="q-mt-xs" maxlength="255" />
          </div>
        </div>

        <div class="bg-grey-2 q-pa-sm rounded-borders">
          <div class="text-weight-bold q-mb-xs text-secondary">PROSES KEPERAWATAN (PRA)</div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Masalah Kesehatan:</span>
              <q-option-group v-model="store.form.pra_masalah_kesehatan" :options="store.opsiPraMasalah" type="checkbox"
                color="primary" dense size="sm" />
            </div>
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Intervensi & Implementasi:</span>
              <q-option-group v-model="store.form.pra_intervensi_implementasi" :options="store.opsiPraIntervensi"
                type="checkbox" color="primary" dense size="sm" />
            </div>
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Evaluasi:</span>
              <q-option-group v-model="store.form.pra_evaluasi" :options="store.opsiPraEval" type="checkbox"
                color="primary" dense size="sm" />
            </div>
          </div>
        </div>
      </q-card>

      <q-card outlined class="q-mb-md q-pa-sm">
        <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">B. INTRA ANESTESI</div>

        <div class="row q-col-gutter-sm q-mb-sm">
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
            <q-input v-model="store.form.intra_jam_selesai_bedah" label="Jam Selesai Bedah" outlined dense mask="##:##"
              placeholder="HH:mm" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">Teknik Anestesi</div>
            <q-option-group v-model="store.form.intra_teknik_anestesi" :options="store.opsiTeknikAnestesi"
              type="checkbox" color="primary" inline dense size="sm" />
          </div>
          <div class="col-xs-12 col-sm-6 font-box">
            <div class="text-weight-bold">Inhalasi / Gas</div>
            <q-input v-model="store.form.intra_inhalasi" label="Sevorane / Isoflurane / dll" outlined dense
              maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 font-box">
            <div class="text-weight-bold">Posisi Operasi</div>
            <q-option-group v-model="store.form.intra_posisi_operasi" :options="store.opsiPosisiOperasi" type="checkbox"
              color="primary" inline dense size="sm" />
            <q-input v-model="store.form.intra_posisi_lain" label="Posisi Lain-lain" outlined dense class="q-mt-xs"
              maxlength="255" />
          </div>
        </div>

        <div class="bg-grey-2 q-pa-sm rounded-borders">
          <div class="text-weight-bold q-mb-xs text-secondary">PROSES KEPERAWATAN (INTRA)</div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Masalah Kesehatan:</span>
              <q-option-group v-model="store.form.intra_masalah_kesehatan" :options="store.opsiIntraMasalah"
                type="checkbox" color="primary" dense size="sm" />
            </div>
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Intervensi & Implementasi:</span>
              <q-option-group v-model="store.form.intra_intervensi_implementasi" :options="store.opsiIntraIntervensi"
                type="checkbox" color="primary" dense size="sm" />
            </div>
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Evaluasi:</span>
              <q-option-group v-model="store.form.intra_evaluasi" :options="store.opsiIntraEval" type="checkbox"
                color="primary" dense size="sm" />
            </div>
          </div>
        </div>
      </q-card>

      <q-card outlined class="q-mb-md q-pa-sm">
        <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">C. PASCA ANESTESI (RUANG PEMULIHAN / RR)</div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-xs-6 col-sm-3">
            <q-input v-model="store.form.pasca_jam_masuk_rr" label="Jam Masuk RR" outlined dense mask="##:##"
              placeholder="HH:mm" />
          </div>
          <div class="col-xs-6 col-sm-3">
            <q-input v-model="store.form.pasca_jam_keluar_rr" label="Jam Keluar RR" outlined dense mask="##:##"
              placeholder="HH:mm" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="store.form.pasca_spo2" label="Saturasi SpO2 Akhir (%)" outlined dense maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-xs-12 col-sm-4 font-box">
            <div class="text-weight-bold">1. Pernafasan</div>
            <q-option-group v-model="store.form.pasca_pernafasan_status" :options="store.opsiPascaNafas" type="checkbox"
              color="primary" dense size="sm" />
          </div>
          <div class="col-xs-12 col-sm-4 font-box">
            <div class="text-weight-bold">Pola Nafas</div>
            <q-option-group v-model="store.form.pasca_pola_nafas" :options="store.opsiPolaNafas" color="primary" dense
              size="sm" />
          </div>
          <div class="col-xs-12 col-sm-4 font-box">
            <div class="text-weight-bold">2. Sirkulasi / TTV RR</div>
            <q-input v-model="store.form.pasca_td" label="TD Pasca" outlined dense class="q-mb-xs"
              placeholder="eg: 110/70" maxlength="255" />
            <q-input v-model="store.form.pasca_nadi" label="Nadi Pasca" outlined dense class="q-mb-xs"
              maxlength="255" />
            <q-input v-model="store.form.pasca_suhu" label="Suhu Pasca" outlined dense maxlength="255" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md bg-amber-1 q-pa-sm rounded-borders">
          <div class="col-12 text-weight-bold text-amber-9">SKORING PEMULIHAN (Steward / Bromage Score)</div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="store.form.pasca_steward_score" label="Steward Score (Anak)" outlined dense
              placeholder="Isi total / kriteria" maxlength="255" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input v-model="store.form.pasca_bromage_score" label="Bromage Score (Regional)" outlined dense
              placeholder="Isi total / kriteria" maxlength="255" />
          </div>
        </div>

        <div class="bg-grey-2 q-pa-sm rounded-borders">
          <div class="text-weight-bold q-mb-xs text-secondary">PROSES KEPERAWATAN (PASCA)</div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Masalah Kesehatan:</span>
              <q-option-group v-model="store.form.pasca_masalah_kesehatan" :options="store.opsiPascaMasalah"
                type="checkbox" color="primary" dense size="sm" />
            </div>
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Intervensi & Implementasi:</span>
              <q-option-group v-model="store.form.pasca_intervensi_implementasi" :options="store.opsiPascaIntervensi"
                type="checkbox" color="primary" dense size="sm" />
            </div>
            <div class="col-xs-12 col-sm-4">
              <span class="text-weight-medium">Evaluasi / Target:</span>
              <q-option-group v-model="store.form.pasca_evaluasi" :options="store.opsiPascaEval" type="checkbox"
                color="primary" dense size="sm" />
            </div>
          </div>
        </div>
      </q-card>

      <div class="row justify-end q-mt-md">
        <q-btn label="Simpan Rekam Medis Anestesi" type="submit" color="primary" icon="save" class="q-px-lg" />
      </div>

    </q-form>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAsuhanAnastesiStore } from 'src/stores/simrs/kamaroperasi/asuhan/asuhanAnastesi'
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useAsuhanAnastesiStore()

function simpanData () {
  console.log('Payload Data yang siap dikirim ke backend:', store.form)
  // Masukkan fungsi aksi simpan store kamu di sini, misal: store.saveFormAnestesi()
}

onMounted(() => {
  // Inisialisasi awal jika dibutuhkan
})
</script>

<style lang="scss" scoped>
.style-form {
  max-width: 1200px;
  margin: 0 auto;
}

.font-box {
  border: 1px solid #e0e0e0;
  padding: 8px;
  border-radius: 4px;
  background-color: #fafafa;
}

.f-18 {
  font-size: 18px;
}
</style>
