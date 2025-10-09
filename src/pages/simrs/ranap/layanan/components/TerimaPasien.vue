<template>
  <q-card flat class="q-pa-md" style="width: 50%; height: 80%;">

    <q-card-section class="q-pa-sm ">
      <b class="f-14">Terima Pasien</b>
      <div>Form Penerimaan Pasien</div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section class="q-pa-sm">
      <div>Pasien dari <b>{{ terima?.nm_ruanglm }}</b> </div>
      <div v-if="terima?.titipan">Titipan dari <b>{{ terima?.nm_ruanglm }}</b> </div>
      <div>diserahkan Oleh <b>{{ terima?.prwt_serah }}</b> </div>
      <q-separator class="q-my-xs"></q-separator>
      <div class="q-my-md text-center"> <b>dengan Kondisi Objective :</b> </div>
      <div class="row">
        <q-card class="col-2 column text-center">
          <q-card-section class="q-px-xs q-py-md">
            <div>Tensi</div>
            <div class="f-18 text-weight-bold">{{ terima?.sistole }} / {{ terima?.diastole }}</div>
            <div> mmHg</div>
          </q-card-section>
        </q-card>
        <q-card class="col-2 column text-center">
          <q-card-section class="q-px-xs q-py-md">
            <div>Nadi</div>
            <div class="f-18 text-weight-bold">{{ terima?.nadi }}</div>
            <div> x/menit</div>
          </q-card-section>
        </q-card>
        <q-card class="col-2 column text-center">
          <q-card-section class="q-px-xs q-py-md">
            <div>Tensi</div>
            <div class="f-18 text-weight-bold">{{ terima?.tensi }}</div>
            <div> mmHg</div>
          </q-card-section>
        </q-card>
        <q-card class="col-2 column text-center">
          <q-card-section class="q-px-xs q-py-md">
            <div>Suhu</div>
            <div class="f-18 text-weight-bold">{{ terima?.suhu }}</div>
            <div> Celcius</div>
          </q-card-section>
        </q-card>

        <q-card class="col-2 column text-center">
          <q-card-section class="q-px-xs q-py-md">
            <div>RR</div>
            <div class="f-18 text-weight-bold">{{ terima?.rr }}</div>
            <div> x / menit</div>
          </q-card-section>
        </q-card>
        <q-card class="col-2 column text-center">
          <q-card-section class="q-px-xs q-py-md">
            <div>SPO2</div>
            <div class="f-18 text-weight-bold">{{ terima?.spo2 }}</div>
            <div> %</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-my-md text-center">Perawat / Bidan Penerima harap Mengisi <b>Kondisi Pasien Saat Serah Terima
          Pasien</b> </div>

      <q-form class="row q-col-gutter-sm" ref="formTerima" @submit="onSubmit">

        <app-input-simrs v-model="form.keadaanUmum" label="Keadaan Umum" outlined dense class="col-6" />
        <app-input-simrs v-model="form.kesadaran" label="Kesadaran" outlined dense class="col-6" />

        <app-input-simrs label="Sistolik (mmHg)" class="col-3" v-model="form.sistole_trm" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) form.sistole_trm = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="Diastolik (mmHg)" class="col-3" v-model="form.diastole_trm" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) form.diastole_trm = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="Nadi (x/mnt)" class="col-3" v-model="form.nadi_trm" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) form.nadi_trm = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="Suhu (°C)" class="col-3" v-model="form.suhu_trm" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) form.suhu_trm = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="RR (x/mnt)" class="col-3" v-model="form.rr_trm" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) form.rr_trm = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />
        <app-input-simrs label="SPO2 (%)" class="col-3" v-model="form.spo2_trm" :valid="{ number: true }"
          @update:model-value="(val) => {
            const _removedZeros = val.replace(/^0+/, '')
            if (val > 1) form.spo2_trm = _removedZeros
            // cekEws('tb', _removedZeros)
          }" />


        <div class="col-12">

          <div class="text-right">
            <q-btn :loading="loading" :disable="loading" label="Terima Pasien" type="submit" color="primary" />
          </div>
        </div>
      </q-form>

    </q-card-section>

  </q-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { notifSuccessVue } from 'src/modules/utils'

const props = defineProps({
  pasien: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    default: null
  }
})

const loading = ref(false)

const form = ref({
  kesadaranUmum: null,
  kesadaran: null,
  tensi_trm: null,
  sistole_trm: null,
  diastole_trm: null,
  nadi_trm: null,
  suhu_trm: null,
  rr_trm: null,
  spo2_trm: null,
})

onMounted(() => {
  // console.log('pasien', props.pasien);

})

const terima = computed(() => {
  return props.pasien?.serah_terima?.length ? props.pasien?.serah_terima[0] : null
})

const onSubmit = async () => {
  loading.value = true
  form.value.noreg = props.pasien?.noreg
  form.value.id = terima.value?.id || null
  try {
    await api.post('v1/simrs/ranap/ruangan/updatemutasi', form.value)

    const findPasien = props.store?.pasiens?.filter(x => x?.noreg === props?.pasien?.noreg)
    if (findPasien?.length) {
      const data = findPasien[0]
      data.status = ''
    }

    notifSuccessVue('Data sukses tersimpan')
  } catch (error) {
    console.log(error);

  } finally {
    loading.value = false
  }

  // setTimeout(() => {
  //   console.log('formed', props.store.pasiens);
  //   const findPasien = props.store?.pasiens?.filter(x => x?.noreg === props?.pasien?.noreg)
  //   if (findPasien?.length) {
  //     const data = findPasien[0]
  //     data.status = ''
  //   }

  // }, 2000);
}
</script>