<template>
  <div class="row fit" style="min-height: 600px;">
    <div class="col fit">
      <div class="row f-18 text-weight-bold q-pa-sm justify-center">
        PENGKAJIAN DAN DIAGNOSA KEPERAWATAN
      </div>
      <div class="row q-col-gutter-xs">
        <div class="col-6">
          <app-input-date-human label="Tanggal" outlined :model="store.display.tanggal" @db-model="(val) => {
            store.formPengkajian.tanggal = val
          }" @set-display="(val) => {
            store.display.tanggal = val
          }" />
        </div>
        <div class="col-6">
          <app-input-date :model="store.formPengkajian.jam" label="Jam" :type-date="false" dense outlined @set-model="(val) => {
            store.formPengkajian.jam = val
          }" />
        </div>
      </div>
      <div class="row f-16 text-weight-bold q-pa-sm">Resiko Infeksi ( D.0142 )</div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Faktor resiko :</div>
        <div class="col-9">
          <q-option-group v-model="store.formPengkajian.faktor_resiko" :options="store.optionFaktorResikos"
            color="primary" inline dense type="checkbox" size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Posisi canul intra vena :</div>
        <div class="col-9">
          <q-option-group v-model="store.formPengkajian.posisi_canul_intra_vena"
            :options="store.optionPosisiCanulIntraVenas" color="primary" inline dense type="checkbox" size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Urine katheter :</div>
        <div class="col-9">
          <q-option-group v-model="store.formPengkajian.urine_katheter" :options="store.ynOptions" color="primary"
            inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center">
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Tensi : </div>
            <div class="col-auto" style="width: 30%;"><app-input v-model="store.formPengkajian.td_sis" label="Sistole"
                outlined /> </div>
            <div class="col-auto">/</div>
            <div class="col-auto" style="width: 30%;"><app-input v-model="store.formPengkajian.td_dia" label="Diastole"
                outlined />
            </div>
            <div class="col-auto">mmHg</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Nadi : </div>
            <div class="col-auto"><app-input v-model="store.formPengkajian.nadi" label="Nadi" outlined /> </div>
            <div class="col-auto">x/menit</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Suhu : </div>
            <div class="col-auto"><app-input v-model="store.formPengkajian.suhu" label="Suhu" outlined /> </div>
            <div class="col-auto"></div>
          </div>
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-xs">
        <div class="col-3">Status pernafasan :</div>
        <div class="col-9">
          <q-option-group v-model="store.formPengkajian.status_pernafasan" :options="store.nafasOptions" color="primary"
            inline dense size="sm" />
        </div>
      </div>
      <div class="satu-tab row q-col-gutter-sm items-center">

        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Resp rate : </div>
            <div class="col-auto"><app-input v-model="store.formPengkajian.respirasi_rate" label="" outlined />
            </div>
            <div class="col-auto">/menit</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Saturasi : </div>
            <div class="col-auto"><app-input v-model="store.formPengkajian.saturasi" label="" outlined /> </div>
            <div class="col-auto">%</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Hasil Laboratorium HB : </div>
            <div class="col-auto"><app-input v-model="store.formPengkajian.lab_hb" label="" outlined /> </div>
            <div class="col-auto">gr/dl</div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Dibuktikan dengan : </div>
            <div class="col-auto"><app-input v-model="store.formPengkajian.bukti" label="" outlined /> </div>
            <!-- <div class="col-auto">gr/dl</div> -->
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Waktu masuk OK :</div>
            <div class="col-auto">
              <app-input-date :model="store.formPengkajian.waktu_masuk_ok" label="" :type-date="false" dense outlined
                @set-model="(val) => {
                  store.formPengkajian.waktu_masuk_ok = val
                }" />
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="row items-center no-wrap">
            <div class="col-auto q-mr-xs">Waktu Anastesi :</div>
            <div class="col-auto">
              <app-input v-model="store.formPengkajian.waktu_anastesi" label="" outlined />
            </div>

          </div>
        </div>
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
</script>
<style lang="scss" scoped>
.satu-tab {
  margin-left: 10px;
  padding: 3px;
  padding-bottom: 3px;
}
</style>
