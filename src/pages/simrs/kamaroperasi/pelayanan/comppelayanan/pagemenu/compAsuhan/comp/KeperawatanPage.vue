<template>
  <div class="row full-height" style="height: 600px;">
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
          <app-input-date :model="store.form.pengkajian_jam" label="Mulai Jam" :type-date="false" dense outlined
            @set-model="(val) => {
              store.form.pengkajian_jam = val
            }" />
        </div>
        <div class="col-6">
          <app-input-date :model="store.form.pengkajian_jam" label="Selesai Jam" :type-date="false" dense outlined
            @set-model="(val) => {
              store.form.pengkajian_jam = val
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
              <q-input v-model="store.form.pengkajian_cairan_untuk_cuci_luka" autofocus color="primary" dense />
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
              <q-input v-model="store.form.pengkajian_jenis_obat_penutup_luka" autofocus color="primary" dense />
            </div>
            <div class="col-2">Jenis Balutan</div>
            <div class="col-9">
              <q-input v-model="store.form.pengkajian_jenis_balutan_penutup_luka" color="primary" dense />
            </div>
          </div>
        </div>
      </div>

      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        LUARAN
      </div>
      <div class="row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-6">luaran utama</div>
        <div class="col-6"><q-option-group v-model="store.form.luaran_utama" :options="store.optionLuarans"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-6">Setelah dilakukan tindakan keperawatan selama 3x24 jam, maka tingkat infeksi menurun dengan
          kriteria hasil</div>
        <div class="col-6"><q-option-group v-model="store.form.luaran_hasil" :options="store.optionHasils"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        INTERVENSI DAN IMPLEMENTASI
      </div>
      <div class="row q-col-gutter-sm items-center q-pa-sm">
        <div class="col-3 text-weight-bold">luaran utama</div>
        <div class="col-6"><q-option-group v-model="store.form.luaran_utama" :options="store.optionLuarans"
            color="primary" inline dense type="checkbox" size="sm" /></div>
      </div>
      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        EVALUASI
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAsuhanKeperawatanStore } from 'src/stores/simrs/kamaroperasi/asuhan/asuhanKeperawatan'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useAsuhanKeperawatanStore()
function ambilTidakanOperasi (val) {
  const data = val?.length > 0 ? val?.map(v => v?.mastertindakanoperasi?.rs2).join(', ') : 'Belum ada Tindakan Operasi '
  console.log(data)
  return data
}
function setNullIf (value, keyToSet, condition) {
  // console.log('val', value, 'key', keyToSet, 'con', condition)
  if (value == condition) {
    store.formPengkajian[keyToSet] = null
  }
}
</script>
<style lang="scss" scoped>
.satu-tab {
  margin-left: 10px;
  padding: 3px;
  padding-bottom: 3px;
}
</style>
