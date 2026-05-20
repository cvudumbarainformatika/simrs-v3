<template>
  <div class="row full-height q-pa-md" style="min-height: 650px; margin-bottom: 100px;">
    <div class="col-12 full-height style-form">

      <div class="row bg-primary text-white q-pa-sm justify-center text-weight-bold f-18 rounded-borders q-mb-md">
        PENGKAJIAN DAN DIAGNOSA KEPERAWATAN
      </div>

      <q-card outlined class="q-mb-md q-pa-md">

        <div class="row q-col-gutter-md q-mb-sm items-center">
          <div class="col-xs-12 col-md-6">
            <app-input-date-human label="Tanggal Pengkajian" outlined :model="store.display.tanggal"
              @db-model="(val) => { store.form.pengkajian_tanggal = val }"
              @set-display="(val) => { store.display.tanggal = val }" />
          </div>
          <div class="col-xs-12 col-md-6">
            <app-input-date :model="store.form.pengkajian_jam" label="Jam Pengkajian" :type-date="false" dense outlined
              @set-model="(val) => { store.form.pengkajian_jam = val }" />
          </div>
        </div>

        <div class="row q-mb-md items-center bg-grey-2 q-pa-sm rounded-borders">
          <div class="col-xs-12 col-md-2 text-weight-bold">Tindakan Operasi :</div>
          <div class="col-xs-12 col-md-10 text-primary text-weight-medium">
            {{ ambilTidakanOperasi(pasien?.manytindakanop) }}
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-xs-12 col-md-6">
            <app-input-date :model="store.form.pengkajian_jam_mulai" label="Mulai Jam" :type-date="false" dense outlined
              @set-model="(val) => { store.form.pengkajian_jam_mulai = val }" />
          </div>
          <div class="col-xs-12 col-md-6">
            <app-input-date :model="store.form.pengkajian_jam_selesai" label="Selesai Jam" :type-date="false" dense
              outlined @set-model="(val) => { store.form.pengkajian_jam_selesai = val }" />
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 text-weight-bold text-negative q-mb-sm">Resiko Infeksi (D.0142)</div>

        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Faktor resiko :</div>
          <div class="col-xs-12 col-md-9">
            <q-option-group v-model="store.form.pengkajian_faktor_resiko" :options="store.optionFaktorResikos"
              color="primary" inline dense type="checkbox" size="sm" />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Posisi canul intra vena :</div>
          <div class="col-xs-12 col-md-9">
            <q-option-group v-model="store.form.pengkajian_posisi_canul_intra_vena"
              :options="store.optionPosisiCanulIntraVenas" color="primary" inline dense type="checkbox" size="sm" />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Urine katheter :</div>
          <div class="col-xs-12 col-md-9">
            <q-option-group v-model="store.form.pengkajian_urine_katheter" :options="store.ynOptions" color="primary"
              inline dense size="sm" />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-md items-center">
          <div class="col-xs-12 col-md-3">Status pernafasan :</div>
          <div class="col-xs-12 col-md-9">
            <q-option-group v-model="store.form.pengkajian_status_pernafasan" :options="store.nafasOptions"
              color="primary" inline dense size="sm" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md items-center">
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs">Tensi :</div>
              <div class="col"><app-input v-model="store.form.pengkajian_td_sis" label="Sis" outlined dense /></div>
              <div class="col-auto q-px-sm">/</div>
              <div class="col"><app-input v-model="store.form.pengkajian_td_dia" label="Dia" outlined dense /></div>
              <div class="col-3 q-ml-sm">mmHg</div>
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs">Nadi :</div>
              <div class="col"><app-input v-model="store.form.pengkajian_nadi" label="Nadi" outlined dense /></div>
              <div class="col-3 q-ml-sm">x/mnt</div>
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs">Suhu :</div>
              <div class="col"><app-input v-model="store.form.pengkajian_suhu" label="Suhu" outlined dense /></div>
              <div class="col-3 q-ml-sm">°C</div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md items-center">
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs">Resp rate :</div>
              <div class="col"><app-input v-model="store.form.pengkajian_respirasi_rate" label="RR" outlined dense />
              </div>
              <div class="col-3 q-ml-sm">x/mnt</div>
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs">Saturasi :</div>
              <div class="col"><app-input v-model="store.form.pengkajian_saturasi" label="SpO2" outlined dense /></div>
              <div class="col-3 q-ml-sm">%</div>
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs">Lab HB :</div>
              <div class="col"><app-input v-model="store.form.pengkajian_lab_hb" label="HB" outlined dense /></div>
              <div class="col-3 q-ml-sm">gr/dl</div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md items-center">
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs text-caption">Dibuktikan dgn :</div>
              <div class="col"><app-input v-model="store.form.pengkajian_bukti" label="Keterangan Bukti" outlined
                  dense /></div>
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs text-caption">Masuk OK :</div>
              <div class="col">
                <app-input-date :model="store.form.pengkajian_waktu_masuk_ok" label="Waktu" :type-date="false" dense
                  outlined @set-model="(val) => { store.form.pengkajian_waktu_masuk_ok = val }" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="row items-center no-wrap">
              <div class="col-3 q-mr-xs text-caption">Waktu Anastesi:</div>
              <div class="col"><app-input v-model="store.form.pengkajian_waktu_anastesi" label="Waktu" outlined dense />
              </div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Jenis Operasi :</div>
          <div class="col-xs-12 col-md-9">
            <q-option-group v-model="store.form.pengkajian_jenis_operasi" :options="store.optionJenisOperasis"
              color="primary" inline dense size="sm" />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Disinfeksi Area Operasi :</div>
          <div class="col-xs-12 col-md-9">
            <q-option-group v-model="store.form.pengkajian_disinfeksi_area_operasi"
              :options="store.optionDisinfeksiAreaOperasis" color="primary" inline dense size="sm" />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Irigasi Luka :</div>
          <div class="col-xs-12 col-md-9 row items-center">
            <q-option-group v-model="store.form.pengkajian_irigasi_luka" :options="store.ynOptions" color="primary"
              inline dense size="sm"
              @update:model-value="(val) => { setNullIf(val, 'pengkajian_cairan_irigasi_luka', 'Tidak') }" />
            <template v-if="store.form.pengkajian_irigasi_luka == 'Ya'">
              <div class="q-ml-md q-mr-sm">Yaitu :</div>
              <q-option-group v-model="store.form.pengkajian_cairan_irigasi_luka"
                :options="store.optionCairanIrigasiLuka" color="primary" inline dense size="sm" />
            </template>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Pencucian Luka :</div>
          <div class="col-xs-12 col-md-9 row items-center">
            <q-option-group v-model="store.form.pengkajian_cuci_luka" :options="store.ynOptions" color="primary" inline
              dense size="sm"
              @update:model-value="(val) => { setNullIf(val, 'pengkajian_cairan_untuk_cuci_luka', 'Tidak') }" />
            <template v-if="store.form.pengkajian_cuci_luka == 'Ya'">
              <div class="q-ml-md q-mr-sm">Cairan :</div>
              <q-input v-model="store.form.pengkajian_cairan_untuk_cuci_luka" autofocus outlined color="primary" dense
                style="width:200px" maxlength="255"
                :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
            </template>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-xs items-center">
          <div class="col-xs-12 col-md-3">Obat Penutup Luka :</div>
          <div class="col-xs-12 col-md-9 row items-center">
            <q-option-group v-model="store.form.pengkajian_obat_penutup_luka" :options="store.ynOptions" color="primary"
              inline dense size="sm" @update:model-value="(val) => {
                setNullIf(val, 'pengkajian_jenis_obat_penutup_luka', 'Tidak')
                setNullIf(val, 'pengkajian_jenis_balutan_penutup_luka', 'Tidak')
              }" />
            <template v-if="store.form.pengkajian_obat_penutup_luka == 'Ya'">
              <div class="q-ml-md q-mr-sm">Jenis :</div>
              <q-input v-model="store.form.pengkajian_jenis_obat_penutup_luka" outlined color="primary" dense
                style="width:150px" class="q-mr-sm" maxlength="255"
                :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
              <div class="q-mr-sm">Balutan :</div>
              <q-input v-model="store.form.pengkajian_jenis_balutan_penutup_luka" outlined color="primary" dense
                style="width:150px" maxlength="255"
                :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
            </template>
          </div>
        </div>
      </q-card>

      <q-card outlined class="q-mb-md">
        <div class="bg-primary text-white q-pa-sm text-center text-weight-bold f-16">
          LUARAN
        </div>
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm items-center q-mb-sm">
            <div class="col-xs-12 col-md-4 text-weight-medium">Luaran utama</div>
            <div class="col-xs-12 col-md-8">
              <q-option-group v-model="store.form.luaran_utama" :options="store.optionLuarans" color="primary" inline
                dense type="checkbox" size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-xs-12 col-md-4 text-weight-medium">Setelah dilakukan tindakan keperawatan selama 3x24 jam,
              tingkat
              infeksi menurun dgn kriteria:</div>
            <div class="col-xs-12 col-md-8">
              <q-option-group v-model="store.form.luaran_hasil" :options="store.optionHasils" color="primary" inline
                dense type="checkbox" size="sm" />
            </div>
          </div>
        </div>
      </q-card>

      <q-card outlined class="q-mb-md">
        <div class="bg-primary text-white q-pa-sm text-center text-weight-bold f-16">
          INTERVENSI DAN IMPLEMENTASI
        </div>
        <div class="q-pa-md">
          <div class="row q-col-gutter-sm items-center q-mb-sm">
            <div class="col-xs-12 col-md-3 text-weight-bold">Intervensi utama</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.intervensi_utama" :options="store.optionIntervensiUtamas"
                color="primary" inline dense type="checkbox" size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm items-center q-mb-md">
            <div class="col-xs-12 col-md-3 text-weight-bold">Intervensi pendukung</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.intervensi_pendukung" :options="store.optionIntervensiPendukungs"
                color="primary" inline dense type="checkbox" size="sm" />
            </div>
          </div>

          <q-separator />

          <div class="f-14 text-weight-bold q-mt-md q-mb-sm text-primary">IMPLEMENTASI :</div>
          <div class="row q-col-gutter-sm items-center q-mb-sm">
            <div class="col-xs-12 col-md-3 text-italic">Observasi</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.implementasi_observasi" :options="store.optionObservasis"
                color="primary" inline dense type="checkbox" size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm items-center q-mb-sm">
            <div class="col-xs-12 col-md-3 text-italic">Terapeutik</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.implementasi_terupetik" :options="store.optionTerupetiks"
                color="primary" inline dense type="checkbox" size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-xs-12 col-md-3 text-italic">Kolaborasi</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.implementasi_kolaborasi" :options="store.optionKolaborasis"
                color="primary" inline dense type="checkbox" size="sm" />
            </div>
          </div>
        </div>
      </q-card>

      <q-card outlined class="q-mb-md">
        <div class="bg-primary text-white q-pa-sm text-center text-weight-bold f-16">
          EVALUASI
        </div>
        <div class="q-pa-md">
          <div class="row q-col-gutter-md q-mb-md">
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

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-xs-12 col-md-6">
              <q-input v-model="store.form.eval_subjective" label="Subjektif (S)" outlined dense />
            </div>
            <div class="col-xs-12 col-md-6">
              <q-input v-model="store.form.eval_objective" label="Objektif (O)" outlined dense />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-xs items-center">
            <div class="col-xs-12 col-md-3">Kerusakan Jaringan</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.eval_kerusakan_jaringan" :options="store.ynOptions" color="primary"
                inline dense size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-xs items-center">
            <div class="col-xs-12 col-md-3">Kemerahan</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.eval_kemerahan" :options="store.ynOptions" color="primary" inline
                dense size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-xs items-center">
            <div class="col-xs-12 col-md-3">Oedem daerah incici</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.eval_oedem_daerah_incici" :options="store.ynOptions" color="primary"
                inline dense size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-xs items-center">
            <div class="col-xs-12 col-md-3">Haematon</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.eval_haematon" :options="store.ynOptions" color="primary" inline dense
                size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-md items-center">
            <div class="col-xs-12 col-md-3">Cairan Drainase</div>
            <div class="col-xs-12 col-md-9 row items-center">
              <q-option-group v-model="store.form.eval_cairan_drainase" :options="store.ynOptions" color="primary"
                inline dense size="sm"
                @update:model-value="(val) => { setNullIf(val, 'eval_jenis_cariran_drainase', 'Tidak') }" />
              <template v-if="store.form.eval_cairan_drainase == 'Ya'">
                <div class="q-ml-md q-mr-sm">Jenis:</div>
                <q-input v-model="store.form.eval_jenis_cariran_drainase" outlined autofocus color="primary" dense
                  style="width:200px" maxlength="255"
                  :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
              </template>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-md items-center">
            <div class="col-xs-12 col-md-4">
              <div class="row items-center no-wrap">
                <div class="col-3 q-mr-xs">Tensi :</div>
                <div class="col"><app-input v-model="store.form.eval_td_sis" label="Sis" outlined dense /></div>
                <div class="col-auto q-px-sm">/</div>
                <div class="col"><app-input v-model="store.form.eval_td_dia" label="Dia" outlined dense /></div>
                <div class="col-3 q-ml-sm">mmHg</div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4">
              <div class="row items-center no-wrap">
                <div class="col-3 q-mr-xs">Suhu :</div>
                <div class="col"><app-input v-model="store.form.eval_suhu" label="Suhu" outlined dense /></div>
                <div class="col-3 q-ml-sm">°C</div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4">
              <div class="row items-center no-wrap">
                <div class="col-3 q-mr-xs">RR :</div>
                <div class="col"><app-input v-model="store.form.eval_rr" label="RR" outlined dense /></div>
                <div class="col-3 q-ml-sm">x/mnt</div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4">
              <div class="row items-center no-wrap">
                <div class="col-3 q-mr-xs">HR :</div>
                <div class="col"><app-input v-model="store.form.eval_hr" label="HR" outlined dense /></div>
                <div class="col-3 q-ml-sm">x/mnt</div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4">
              <div class="row items-center no-wrap">
                <div class="col-3 q-mr-xs">SpO<sub>2</sub> :</div>
                <div class="col">
                  <q-input v-model="store.form.eval_spo2" label="SpO2" outlined dense />
                </div>
                <div class="col-3 q-ml-sm">%</div>
              </div>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-xs items-center">
            <div class="col-xs-12 col-md-3">A: Resiko Infeksi</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.eval_a_resiko_infeksi" :options="store.optionResikoInfeksis"
                color="primary" inline dense size="sm" />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mb-xs items-center">
            <div class="col-xs-12 col-md-3">P :</div>
            <div class="col-xs-12 col-md-9">
              <q-option-group v-model="store.form.eval_p" :options="store.optionPs" color="primary" inline dense
                size="sm" />
            </div>
          </div>
        </div>
      </q-card>

      <div class="row justify-end q-mt-md">
        <q-btn label="Simpan Data" color="primary" icon="save" rounded no-caps glossy :loading="store.loading"
          :disable="store.loading" @click="store.simpan(pasien)" class="q-px-xl" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAsuhanKeperawatanStore } from 'src/stores/simrs/kamaroperasi/asuhan/asuhanKeperawatan'
import { onMounted } from 'vue'

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

onMounted(() => {
  store.getData(props.pasien)
})
</script>

<style lang="scss" scoped>
.style-form {
  max-width: 1200px;
  margin: 0 auto;
}

.f-18 {
  font-size: 18px;
}

.f-16 {
  font-size: 16px;
}

.f-14 {
  font-size: 14px;
}
</style>
