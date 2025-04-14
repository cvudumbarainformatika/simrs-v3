<template>
  <div class="q-ma-md bg-white">
    <div class="row">
      <div class="col-1 q-pa-xs bg-grey-4">
        <div>
          <app-avatar-pasien :key="pasien" :pasien="pasien" width="100%" />
        </div>
      </div>
      <div class="col-5 q-pa-xs ">
        <div class="row">
          <div class="col-2 text-weight-bold">Nama</div>
          <div class="col-1">:</div>
          <div class="col-3 "><q-badge color="red"> {{ pasien ? pasien.nama : '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-2 text-weight-bold">No. RM</div>
          <div class="col-1">:</div>
          <div class="col-3"><q-badge color="red"> {{ pasien?.norm ?? '-' }}</q-badge> / <q-badge color="red"> {{
            pasien.kelamin ??
            '-' }} </q-badge>
          </div>
        </div>
        <div class="row">
          <div class="col-2 text-weight-bold">No. Reg</div>
          <div class="col-1">:</div>
          <div class="col-2"><q-badge color="red"> {{ pasien ? pasien.noreg : '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-2 text-weight-bold">Tgl Kunjungan</div>
          <div class="col-1">:</div>
          <div class="col-2"><q-badge color="red"> {{ dateFullFormat(pasien?.tgl_kunjungan) ?? '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-2 text-weight-bold">Usia</div>
          <div class="col-1">:</div>
          <div class="col-2"><q-badge color="red"> {{ pasien.usia ?? '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-2 text-weight-bold">Poli</div>
          <div class="col-1">:</div>
          <div class="col-2"><q-badge color="red"> {{ pasien?.poli ?? '-' }}</q-badge></div>
        </div>
        <div class="row">
          <div class="col-2 text-weight-bold">DPJP</div>
          <div class="col-1">:</div>
          <div class="col-2"><q-badge color="red"> {{ pasien?.dokter ?? '-' }}</q-badge></div>
        </div>
      </div>
      <q-separator vertical class="q-mt-sm" />
      <div class="col-5 q-ma-sm">
        <div class="row">
          <div class="col-12 text-weight-bold q-gutter-sm">
            <q-radio v-model="store.jenispembayaran" val="pelayananrm" label="Pel RM" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.pelayananrm) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="kartuidentitas" label="Kartu Pasien" size="sm"
              dense><q-item-label caption> ( {{
                formatRpDouble(billing?.kartuidentitas) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="poliklinik" label="Poliklinik" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.poliklinik) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="konsulantarpoli" label="Konsul Antar Poli" size="sm"
              dense><q-item-label caption> ( {{
                formatRpDouble(billing?.konsulantarpoli) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="laborat" label="Laborat" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.laborat) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="radiologi" label="Radiologi" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.radiologi) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="onedaycare" label="Onedaycare" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.onedaycare) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="fisioterapi" label="Fisioterapi" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.fisioterapi) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="penunjanglain" label="Penunjanglain" size="sm"
              dense><q-item-label caption> ( {{
                formatRpDouble(billing?.penunjanglain) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="psikologi" label="Psikologi" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.psikologi) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="cardio" label="Cardio" size="sm" dense><q-item-label caption>
                ( {{
                  formatRpDouble(billing?.cardio) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="eeg" label="Eeg" size="sm" dense><q-item-label caption>
                ( {{
                  formatRpDouble(billing?.eeg) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="endoscopy" label="Endoscopy" size="sm" dense><q-item-label
                caption>
                ( {{
                  formatRpDouble(billing?.endoscopy) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="obat" label="Obat" size="sm" dense><q-item-label caption>
                ( {{
                  formatRpDouble(billing?.obat) }} )</q-item-label></q-radio>
            <q-radio v-model="store.jenispembayaran" val="farmasinew" label="E-Resep" size="sm" dense><q-item-label
                caption> ( {{
                  formatRpDouble(billing?.farmasinew) }} )</q-item-label></q-radio>
          </div>
        </div>
      </div>
    </div>
    <q-separator class="q-ma-md" />
  </div>

</template>
<script setup>
import { dateFullFormat, formatRpDouble } from 'src/modules/formatter';
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan';
import { ref } from 'vue';

const store = useKasirRajalListKunjunganStore()

const prop = defineProps({
  pasien: { type: Object, default: () => { } },
  billing: { type: Object, default: () => { } },
})

</script>
