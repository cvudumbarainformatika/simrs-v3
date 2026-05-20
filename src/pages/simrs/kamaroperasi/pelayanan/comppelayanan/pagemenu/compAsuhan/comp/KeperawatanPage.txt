<template>
  <div class="row full-height" style="min-height: 650px; margin-bottom: 100px;">
    <div class="col full-height">
      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        PENGKAJIAN DAN DIAGNOSA KEPERAWATAN
      </div>
      <div class="row q-col-gutter-xs satu-tab ">
        <div class="col-6">
          <app-input-date-human label="Tanggal" outlined :model="store.display.tanggal" @db-model="(val) => {
            store.form.pengkajian_tanggal = val
          }" @set-display="(val) => {
            store.display.tanggal = val
          }" />
        </div>
        <div class="col-6">
          <app-input-date :model="store.form.pengkajian_jam" label="Jam" :type-date="false" dense outlined @set-model="(val) => {
            store.form.pengkajian_jam = val
          }" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-sm items-center">
        <div class="col-2">Tindakan Operasi :</div>
        <div class="col-8">{{ ambilTidakanOperasi(pasien?.manytindakanop) }}</div>
      </div>
      <div class="row q-col-gutter-xs satu-tab  q-py-sm">
        <div class="col-6">
          <app-input-date :model="store.form.pengkajian_jam_mulai" label="Mulai Jam" :type-date="false" dense outlined
            @set-model="(val) => {
              store.form.pengkajian_jam_mulai = val
            }" />
        </div>
        <div class="col-6">
          <app-input-date :model="store.form.pengkajian_jam_selesai" label="Selesai Jam" :type-date="false" dense
            outlined @set-model="(val) => {
              store.form.pengkajian_jam_selesai = val
            }" />
        </div>
      </div>
      <div class="row f-16 text-weight-bold q-pa-sm">Resiko Infeksi ( D.0142 )</div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Faktor resiko :</div>
        <div class="col-9">
          <q-option-group v-model="store.form.pengkajian_faktor_resiko" :options="store.optionFaktorResikos"
            color="primary" inline dense type="checkbox" size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Posisi canul intra vena :</div>
        <div class="col-9">
          <q-option-group v-model="store.form.pengkajian_posisi_canul_intra_vena"
            :options="store.optionPosisiCanulIntraVenas" color="primary" inline dense type="checkbox" size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Urine katheter :</div>
        <div class="col-9">
          <q-option-group v-model="store.form.pengkajian_urine_katheter" :options="store.ynOptions" color="primary"
            inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Status pernafasan :</div>
        <div class="col-9">
          <q-option-group v-model="store.form.pengkajian_status_pernafasan" :options="store.nafasOptions"
            color="primary" inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center">
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Tensi : </div>
            <div class="col-auto" style="width: 30%;"><app-input v-model="store.form.pengkajian_td_sis" label="Sistole"
                outlined /> </div>
            <div class="col-auto">/</div>
            <div class="col-auto" style="width: 30%;"><app-input v-model="store.form.pengkajian_td_dia" label="Diastole"
                outlined />
            </div>
            <div class="col-auto">mmHg</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Nadi : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.pengkajian_nadi" label="Nadi"
                outlined /> </div>
            <div class="col-auto">x/menit</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Suhu : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.pengkajian_suhu" label="Suhu"
                outlined /> </div>
            <div class="col-auto"></div>
          </div>
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center">

        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Resp rate : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.pengkajian_respirasi_rate" label=""
                outlined />
            </div>
            <div class="col-auto">/menit</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Saturasi : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.pengkajian_saturasi" label=""
                outlined /> </div>
            <div class="col-auto">%</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Hasil Lab HB:</div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.pengkajian_lab_hb" label=""
                outlined /> </div>
            <div class="col-auto">gr/dl</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Dibuktikan dengan : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.pengkajian_bukti" label=""
                outlined /> </div>
            <!-- <div class="col-auto">gr/dl</div> -->
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Waktu masuk OK :</div>
            <div class="col-auto" style="width: 60%;">
              <app-input-date :model="store.form.pengkajian_waktu_masuk_ok" label="" :type-date="false" dense outlined
                @set-model="(val) => {
                  store.form.pengkajian_waktu_masuk_ok = val
                }" />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Waktu Anastesi :</div>
            <div class="col-auto" style="width: 60%;">
              <app-input v-model="store.form.pengkajian_waktu_anastesi" label="" outlined />
            </div>

          </div>
        </div>
      </div>

      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Jenis Operasi :</div>
        <div class="col-9">
          <q-option-group v-model="store.form.pengkajian_jenis_operasi" :options="store.optionJenisOperasis"
            color="primary" inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Disinfeksi Area Operasi :</div>
        <div class="col-9">
          <q-option-group v-model="store.form.pengkajian_disinfeksi_area_operasi"
            :options="store.optionDisinfeksiAreaOperasis" color="primary" inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Irigasi Luka :</div>
        <div class="col-9">
          <div class="row">
            <q-option-group v-model="store.form.pengkajian_irigasi_luka" :options="store.ynOptions" color="primary"
              inline dense size="sm"
              @update:model-value="(val) => { setNullIf(val, 'cairan_irigasi_luka', 'Tidak') }" />
          </div>
          <div v-if="store.form.pengkajian_irigasi_luka == 'Ya'" class="row items-center">
            <div class="col-2">Yaitu :</div>
            <div class="col-9">
              <q-option-group v-model="store.form.pengkajian_cairan_irigasi_luka"
                :options="store.optionCairanIrigasiLuka" color="primary" inline dense size="sm" />
            </div>
          </div>
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Pencucian Luka :</div>
        <div class="col-9">
          <div class="row">
            <q-option-group v-model="store.form.pengkajian_cuci_luka" :options="store.ynOptions" color="primary" inline
              dense size="sm" @update:model-value="(val) => { setNullIf(val, 'cairan_untuk_cuci_luka', 'Tidak') }" />
          </div>
          <div v-if="store.form.pengkajian_cuci_luka == 'Ya'" class="row items-center">
            <div class="col-2">Jenis Cairan :</div>
            <div class="col-9">
              <q-input v-model="store.form.pengkajian_cairan_untuk_cuci_luka" autofocus color="primary" dense
                maxlength="255" :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
            </div>
          </div>
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Obat Penutup Luka :</div>
        <div class="col-9">
          <div class="row">
            <q-option-group v-model="store.form.pengkajian_obat_penutup_luka" :options="store.ynOptions" color="primary"
              inline dense size="sm" @update:model-value="(val) => {
                setNullIf(val, 'jenis_obat_penutup_luka', 'Tidak')
                setNullIf(val, 'jenis_balutan_penutup_luka', 'Tidak')
              }" />
          </div>
          <div v-if="store.form.pengkajian_obat_penutup_luka == 'Ya'" class="row items-center">
            <div class="col-2">Jenis :</div>
            <div class="col-9">
              <q-input v-model="store.form.pengkajian_jenis_obat_penutup_luka" autofocus color="primary" dense
                maxlength="255" :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
            </div>
            <div class="col-2">Jenis Balutan</div>
            <div class="col-9">
              <q-input v-model="store.form.pengkajian_jenis_balutan_penutup_luka" color="primary" dense maxlength="255"
                :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
            </div>
          </div>
        </div>
      </div>

      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        LUARAN
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-6">luaran utama</div>
        <div class="col-6"><q-option-group v-model="store.form.luaran_utama" :options="store.optionLuarans"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-6">Setelah dilakukan tindakan keperawatan selama 3x24 jam, maka tingkat infeksi menurun dengan
          kriteria hasil</div>
        <div class="col-6"><q-option-group v-model="store.form.luaran_hasil" :options="store.optionHasils"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        INTERVENSI DAN IMPLEMENTASI
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-3 text-weight-bold">Intervensi utama</div>
        <div class="col-6"><q-option-group v-model="store.form.intervensi_utama" :options="store.optionIntervensiUtamas"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-3 text-weight-bold">Intervensi pendukung</div>
        <div class="col-6"><q-option-group v-model="store.form.intervensi_pendukung"
            :options="store.optionIntervensiPendukungs" color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="row f-14 q-pa-sm q-ml-lg">
        IMPLEMENTASI :
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-3 text-weight-bold text-italic">Obseravasi</div>
        <div class="col-6"><q-option-group v-model="store.form.implementasi_observasi" :options="store.optionObservasis"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-3 text-weight-bold text-italic">Terupetik</div>
        <div class="col-6"><q-option-group v-model="store.form.implementasi_terupetik" :options="store.optionTerupetiks"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-3 text-weight-bold text-italic">Kolaborasi</div>
        <div class="col-6"><q-option-group v-model="store.form.implementasi_kolaborasi"
            :options="store.optionKolaborasis" color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        EVALUASI
      </div>
      <div class="satu-tab row q-col-gutter-xs ">
        <div class="col-6">
          <app-input-date-human label="Tanggal" outlined :model="store.display.tanggal_eval" @db-model="(val) => {
            store.form.eval_tanggal = val
          }" @set-display="(val) => {
            store.display.tanggal_eval = val
          }" />
        </div>
        <div class="col-6">
          <app-input-date :model="store.form.eval_jam" label="Jam" :type-date="false" dense outlined @set-model="(val) => {
            store.form.eval_jam = val
          }" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs ">
        <div class="col-6">
          <app-input v-model="store.form.eval_subjective" label="S" outlined />
        </div>
        <div class="col-6">
          <app-input v-model="store.form.eval_objective" label="O" outlined />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Kerusakan Jaringan</div>
        <div class="col-9">
          <q-option-group v-model="store.form.eval_kerusakan_jaringan" :options="store.ynOptions" color="primary" inline
            dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Kemerahan</div>
        <div class="col-9">
          <q-option-group v-model="store.form.eval_kemerahan" :options="store.ynOptions" color="primary" inline dense
            size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Oedem daerah incici</div>
        <div class="col-9">
          <q-option-group v-model="store.form.eval_oedem_daerah_incici" :options="store.ynOptions" color="primary"
            inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Haematon</div>
        <div class="col-9">
          <q-option-group v-model="store.form.eval_haematon" :options="store.ynOptions" color="primary" inline dense
            size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">Cairan Drainase</div>
        <div class="col-9">
          <div class="row">
            <q-option-group v-model="store.form.eval_cairan_drainase" :options="store.ynOptions" color="primary" inline
              dense size="sm"
              @update:model-value="(val) => { setNullIf(val, 'eval_jenis_cariran_drainase', 'Tidak') }" />
          </div>
          <div v-if="store.form.eval_cairan_drainase == 'Ya'" class="row items-center">
            <div class="col-1">Jenis</div>
            <div class="col-11">
              <q-input v-model="store.form.eval_jenis_cariran_drainase" autofocus color="primary" dense maxlength="255"
                :rules="[val => !val || val.length <= 255 || 'Maksimal 255 karakter']" />
            </div>

          </div>
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center">
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Tensi : </div>
            <div class="col-auto" style="width: 30%;"><app-input v-model="store.form.eval_td_sis" label="Sistole"
                outlined /> </div>
            <div class="col-auto">/</div>
            <div class="col-auto" style="width: 30%;"><app-input v-model="store.form.eval_td_dia" label="Diastole"
                outlined />
            </div>
            <div class="col-auto">mmHg</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">Suhu : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.eval_suhu" label="Suhu" outlined />
            </div>
            <div class="col-auto"></div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">RR : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.eval_rr" label="RR" outlined />
            </div>
            <div class="col-auto">x/menit</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">HR : </div>
            <div class="col-auto" style="width: 60%;"><app-input v-model="store.form.eval_hr" label="HR" outlined />
            </div>
            <div class="col-auto">x/menit</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs" style="width: 20%;">SpO<sub>2</sub> : </div>
            <div class="col-auto" style="width: 60%;">
              <q-input v-model="store.form.eval_spo2" label="label" outlined dense>
                <template #label>
                  SpO<sub>2</sub>
                </template>
              </q-input>
            </div>
            <div class="col-auto">%</div>
          </div>
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">A: Resiko Infeksi</div>
        <div class="col-9">
          <q-option-group v-model="store.form.eval_a_resiko_infeksi" :options="store.optionResikoInfeksis"
            color="primary" inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs q-my-xs  ">
        <div class="col-3">P : </div>
        <div class="col-9">
          <q-option-group v-model="store.form.eval_p" :options="store.optionPs" color="primary" inline dense
            size="sm" />
        </div>
      </div>
      <div class="row justify-end q-pa-xl">
        <q-btn label="Simpan" color="primary" icon="save" rounded no-caps glossy :loading="store.loading"
          :disable="store.loading" @click="store.simpan(pasien)" />
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
  const data = val?.length > 0 ? val?.map(v => v?.mastertindakanoperasi?.rs2).join(', ') : 'Belum ada Tindakan Operasi '
  // console.log(data)
  return data
}
function setNullIf (value, keyToSet, condition) {
  // console.log('val', value, 'key', keyToSet, 'con', condition)
  if (value == condition) {
    store.form[keyToSet] = null
  }
}
onMounted(() => {
  // console.log('on mounted')

  store.getData(props.pasien)
})
</script>
<style lang="scss" scoped>
.satu-tab {
  margin-left: 10px;
  padding: 3px;
  padding-bottom: 3px;
}
</style>
